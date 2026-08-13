/** **************************************************************************
 **
 ** Copyright (C) 2016 The Qt Company Ltd.
 ** Copyright (C) 2016 Klarälvdalens Datakonsult AB, a KDAB Group company, info@kdab.com, author Milian Wolff <milian.wolff@kdab.com>
 ** Contact: https://www.qt.io/licensing/
 **
 ** This file is part of the QtWebChannel module of the Qt Toolkit.
 **
 ** $QT_BEGIN_LICENSE:LGPL$
 ** Commercial License Usage
 ** Licensees holding valid commercial Qt licenses may use this file in
 ** accordance with the commercial license agreement provided with the
 ** Software or, alternatively, in accordance with the terms contained in
 ** a written agreement between you and The Qt Company. For licensing terms
 ** and conditions see https://www.qt.io/terms-conditions. For further
 ** information use the contact form at https://www.qt.io/contact-us.
 **
 ** GNU Lesser General Public License Usage
 ** Alternatively, this file may be used under the terms of the GNU Lesser
 ** General Public License version 3 as published by the Free Software
 ** Foundation and appearing in the file LICENSE.LGPL3 included in the
 ** packaging of this file. Please review the following information to
 ** ensure the GNU Lesser General Public License version 3 requirements
 ** will be met: https://www.gnu.org/licenses/lgpl-3.0.html.
 **
 ** GNU General Public License Usage
 ** Alternatively, this file may be used under the terms of the GNU
 ** General Public License version 2.0 or (at your option) the GNU General
 ** Public license version 3 or any later version approved by the KDE Free
 ** Qt Foundation. The licenses are as published by the Free Software
 ** Foundation and appearing in the file LICENSE.GPL2 and LICENSE.GPL3
 ** included in the packaging of this file. Please review the following
 ** information to ensure the GNU General Public License requirements will
 ** be met: https://www.gnu.org/licenses/gpl-2.0.html and
 ** https://www.gnu.org/licenses/gpl-3.0.html.
 **
 ** $QT_END_LICENSE$
 **
 ****************************************************************************/

'use strict'
var jsList = [];
var QWebChannelMessageTypes = {
    signal: 1,
    propertyUpdate: 2,
    init: 3,
    idle: 4,
    debug: 5,
    invokeMethod: 6,
    connectToSignal: 7,
    disconnectFromSignal: 8,
    setProperty: 9,
    response: 10
}

var QWebChannel = function (transport, initCallback) {
    if (typeof transport !== 'object' || typeof transport.send !== 'function') {
        console.error('The QWebChannel expects a transport object with a send function and onmessage callback property.' + ' Given is: transport: ' + typeof transport + ', transport.send: ' + typeof transport.send)
        return
    }

    var channel = this
    this.transport = transport

    this.send = function (data) {
        if (typeof data !== 'string') {
            data = JSON.stringify(data)
        }
        channel.transport.send(data)
    }

    this.transport.onmessage = function (message) {
        var data = message.data
        if (typeof data === 'string') {
            data = JSON.parse(data)
        }
        switch (data.type) {
            case QWebChannelMessageTypes.signal:
                channel.handleSignal(data)
                break
            case QWebChannelMessageTypes.response:
                channel.handleResponse(data)
                break
            case QWebChannelMessageTypes.propertyUpdate:
                channel.handlePropertyUpdate(data)
                break
            default:
                console.error('invalid message received:', message.data)
                break
        }
    }

    this.execCallbacks = {}
    this.execId = 0
    this.exec = function (data, callback) {
        if (!callback) {
            // if no callback is given, send directly
            channel.send(data)
            return
        }
        if (channel.execId === Number.MAX_VALUE) {
            // wrap
            channel.execId = Number.MIN_VALUE
        }
        if (data.hasOwnProperty('id')) {
            console.error('Cannot exec message with property id: ' + JSON.stringify(data))
            return
        }
        data.id = channel.execId++
        channel.execCallbacks[data.id] = callback
        channel.send(data)
    }

    this.objects = {}

    this.handleSignal = function (message) {
        var object = channel.objects[message.object]
        if (object) {
            object.signalEmitted(message.signal, message.args)
        } else {
            console.warn('Unhandled signal: ' + message.object + '::' + message.signal)
        }
    }

    this.handleResponse = function (message) {
        if (!message.hasOwnProperty('id')) {
            console.error('Invalid response message received: ', JSON.stringify(message))
            return
        }
        channel.execCallbacks[message.id](message.data)
        delete channel.execCallbacks[message.id]
    }

    this.handlePropertyUpdate = function (message) {
        for (var i in message.data) {
            var data = message.data[i]
            var object = channel.objects[data.object]
            if (object) {
                object.propertyUpdate(data.signals, data.properties)
            } else {
                console.warn('Unhandled property update: ' + data.object + '::' + data.signal)
            }
        }
        channel.exec({ type: QWebChannelMessageTypes.idle })
    }

    this.debug = function (message) {
        channel.send({ type: QWebChannelMessageTypes.debug, data: message })
    }

    channel.exec({ type: QWebChannelMessageTypes.init }, function (data) {
        for (var objectName in data) {
            var object = new QObject(objectName, data[objectName], channel)
        }
        // now unwrap properties, which might reference other registered objects
        for (var objectName in channel.objects) {
            channel.objects[objectName].unwrapProperties()
        }
        if (initCallback) {
            initCallback(channel)
        }
        channel.exec({ type: QWebChannelMessageTypes.idle })
    })
}

function QObject(name, data, webChannel) {
    this.__id__ = name
    webChannel.objects[name] = this

    // List of callbacks that get invoked upon signal emission
    this.__objectSignals__ = {}

    // Cache of all properties, updated when a notify signal is emitted
    this.__propertyCache__ = {}

    var object = this

    // ----------------------------------------------------------------------

    this.unwrapQObject = function (response) {
        if (response instanceof Array) {
            // support list of objects
            var ret = new Array(response.length)
            for (var i = 0; i < response.length; ++i) {
                ret[i] = object.unwrapQObject(response[i])
            }
            return ret
        }
        if (!response || !response['__QObject*__'] || response.id === undefined) {
            return response
        }

        var objectId = response.id
        if (webChannel.objects[objectId]) return webChannel.objects[objectId]

        if (!response.data) {
            console.error('Cannot unwrap unknown QObject ' + objectId + ' without data.')
            return
        }

        var qObject = new QObject(objectId, response.data, webChannel)
        qObject.destroyed.connect(function () {
            if (webChannel.objects[objectId] === qObject) {
                delete webChannel.objects[objectId]
                // reset the now deleted QObject to an empty {} object
                // just assigning {} though would not have the desired effect, but the
                // below also ensures all external references will see the empty map
                // NOTE: this detour is necessary to workaround QTBUG-40021
                var propertyNames = []
                for (var propertyName in qObject) {
                    propertyNames.push(propertyName)
                }
                for (var idx in propertyNames) {
                    delete qObject[propertyNames[idx]]
                }
            }
        })
        // here we are already initialized, and thus must directly unwrap the properties
        qObject.unwrapProperties()
        return qObject
    }

    this.unwrapProperties = function () {
        for (var propertyIdx in object.__propertyCache__) {
            object.__propertyCache__[propertyIdx] = object.unwrapQObject(object.__propertyCache__[propertyIdx])
        }
    }

    function addSignal(signalData, isPropertyNotifySignal) {
        var signalName = signalData[0]
        var signalIndex = signalData[1]
        object[signalName] = {
            connect: function (callback) {
                if (typeof callback !== 'function') {
                    console.error('Bad callback given to connect to signal ' + signalName)
                    return
                }

                object.__objectSignals__[signalIndex] = object.__objectSignals__[signalIndex] || []
                object.__objectSignals__[signalIndex].push(callback)

                if (!isPropertyNotifySignal && signalName !== 'destroyed') {
                    // only required for "pure" signals, handled separately for properties in propertyUpdate
                    // also note that we always get notified about the destroyed signal
                    webChannel.exec({
                        type: QWebChannelMessageTypes.connectToSignal,
                        object: object.__id__,
                        signal: signalIndex
                    })
                }
            },
            disconnect: function (callback) {
                if (typeof callback !== 'function') {
                    console.error('Bad callback given to disconnect from signal ' + signalName)
                    return
                }
                object.__objectSignals__[signalIndex] = object.__objectSignals__[signalIndex] || []
                var idx = object.__objectSignals__[signalIndex].indexOf(callback)
                if (idx === -1) {
                    console.error('Cannot find connection of signal ' + signalName + ' to ' + callback.name)
                    return
                }
                object.__objectSignals__[signalIndex].splice(idx, 1)
                if (!isPropertyNotifySignal && object.__objectSignals__[signalIndex].length === 0) {
                    // only required for "pure" signals, handled separately for properties in propertyUpdate
                    webChannel.exec({
                        type: QWebChannelMessageTypes.disconnectFromSignal,
                        object: object.__id__,
                        signal: signalIndex
                    })
                }
            }
        }
    }

    /**
     * Invokes all callbacks for the given signalname. Also works for property notify callbacks.
     */
    function invokeSignalCallbacks(signalName, signalArgs) {
        var connections = object.__objectSignals__[signalName]
        if (connections) {
            connections.forEach(function (callback) {
                callback.apply(callback, signalArgs)
            })
        }
    }

    this.propertyUpdate = function (signals, propertyMap) {
        // update property cache
        for (var propertyIndex in propertyMap) {
            var propertyValue = propertyMap[propertyIndex]
            object.__propertyCache__[propertyIndex] = propertyValue
        }

        for (var signalName in signals) {
            // Invoke all callbacks, as signalEmitted() does not. This ensures the
            // property cache is updated before the callbacks are invoked.
            invokeSignalCallbacks(signalName, signals[signalName])
        }
    }

    this.signalEmitted = function (signalName, signalArgs) {
        invokeSignalCallbacks(signalName, this.unwrapQObject(signalArgs))
    }

    function addMethod(methodData) {
        var methodName = methodData[0]
        var methodIdx = methodData[1]
        object[methodName] = function () {
            var args = []
            var callback
            var result
            for (var i = 0; i < arguments.length; ++i) {
                var argument = arguments[i]
                if (typeof argument === 'function') callback = argument
                else if (argument instanceof QObject && webChannel.objects[argument.__id__] !== undefined) {
                    args.push({
                        id: argument.__id__
                    })
                } else args.push(argument)
            }
            if (methodName === 'getSync' || methodName === 'postSync') {
                (async () => {
                    function syncHandler() {
                        return new Promise((resolve, reject) => {
                            webChannel.exec({
                                type: QWebChannelMessageTypes.invokeMethod,
                                object: object.__id__,
                                method: methodIdx,
                                args: args
                            },
                                function (response) {
                                    if (response !== undefined) {
                                        var result = object.unwrapQObject(response)
                                        if (callback !== undefined) {
                                            callback(result)
                                        }
                                        resolve(result)
                                    }
                                })
                        })
                    }

                    const result = await syncHandler()
                    return result
                })()
            } else {
                webChannel.exec({
                    type: QWebChannelMessageTypes.invokeMethod,
                    object: object.__id__,
                    method: methodIdx,
                    args: args
                },
                    function (response) {
                        if (response !== undefined) {
                            var result = object.unwrapQObject(response)
                            if (callback !== undefined) {
                                callback(result)
                            } else {
                                return result
                            }
                        }
                    }
                )
            }
        }
    }

    function bindGetterSetter(propertyInfo) {
        var propertyIndex = propertyInfo[0]
        var propertyName = propertyInfo[1]
        var notifySignalData = propertyInfo[2]
        // initialize property cache with current value
        // NOTE: if this is an object, it is not directly unwrapped as it might
        // reference other QObject that we do not know yet
        object.__propertyCache__[propertyIndex] = propertyInfo[3]

        if (notifySignalData) {
            if (notifySignalData[0] === 1) {
                // signal name is optimized away, reconstruct the actual name
                notifySignalData[0] = propertyName + 'Changed'
            }
            addSignal(notifySignalData, true)
        }

        Object.defineProperty(object, propertyName, {
            configurable: true,
            get: function () {
                var propertyValue = object.__propertyCache__[propertyIndex]
                if (propertyValue === undefined) {
                    // This shouldn't happen
                    console.warn('Undefined value in property cache for property "' + propertyName + '" in object ' + object.__id__)
                }

                return propertyValue
            },
            set: function (value) {
                if (value === undefined) {
                    console.warn('Property setter for ' + propertyName + ' called with undefined value!')
                    return
                }
                object.__propertyCache__[propertyIndex] = value
                var valueToSend = value
                if (valueToSend instanceof QObject && webChannel.objects[valueToSend.__id__] !== undefined) valueToSend = { id: valueToSend.__id__ }
                webChannel.exec({
                    type: QWebChannelMessageTypes.setProperty,
                    object: object.__id__,
                    property: propertyIndex,
                    value: valueToSend
                })
            }
        })
    }

    // ----------------------------------------------------------------------

    data.methods.forEach(addMethod)

    data.properties.forEach(bindGetterSetter)

    data.signals.forEach(function (signal) {
        addSignal(signal, false)
    })

    for (var name in data.enums) {
        object[name] = data.enums[name]
    }
}

// required for use with nodejs
if (typeof module === 'object') {
    module.exports = {
        QWebChannel: QWebChannel
    }
}
function _init() {
    new QWebChannel(qt.webChannelTransport, function (channel) {
        window.chttp = channel.objects.http
        window.myobject = channel.objects.myobject
        if (channel.objects.htmlobj) {
            window.htmlobj = channel.objects.htmlobj
          }  
        const requestMap = {}
        myobject.mystringChanged.connect(function (back) {
            const uuid = back.requestCmd
            const _callBack = requestMap[uuid]
            if (typeof _callBack === 'function') {
                _callBack.call(null, back)
            } else {
                console.error('no callback func find in ' + uuid)
            }
            delete requestMap[uuid]
        })
        if(typeof myobject.addCurve === 'function') {
        myobject.addCurve.connect(function (back) {
            var data = back.data;
            windowProxy.myGlobalVariable = data;
          })
        }
        function setUUID(_param, _callBack) {
            const uuid = http.genUUID()
            _param.__serviceUUID = uuid
            requestMap[uuid] = _callBack
        }
        window.http = {
            genUUID() {
                function repeatUUIDChar(times) {
                    return repeatRandomChar(times, [
                        [48, 57],
                        [97, 102]
                    ])
                }

                function repeatRandomChar(times, range) {
                    let _ret = ''
                    for (let i = 0; i < times; i++) {
                        _ret += String.fromCharCode(randomValueInRange.apply(null, range))
                    }
                    return _ret
                }

                function randomValue(start, end) {
                    if (typeof start === 'undefined') {
                        start = 0
                    }
                    if (typeof end === 'undefined') {
                        end = start + 100
                    }
                    return start + Math.round(Math.random() * (end - start))
                }

                function randomValueIn(args) {
                    const _idx = randomValue(1, arguments.length) - 1
                    const _ret = arguments[_idx]
                    return _ret
                }

                function randomValueInRange(args) {
                    const _arr = randomValueIn.apply(null, arguments)
                    return randomValue(_arr[0], _arr[1])
                }

                return repeatUUIDChar(8) + '-' + repeatUUIDChar(4) + '-' + randomValue(1, 5) + repeatUUIDChar(3) + '-' + randomValueIn(8, 9, 'a', 'b') + repeatUUIDChar(3) + '-' + repeatUUIDChar(12)
            },
            postAsync: function (url, _param, _callBack) {
                setUUID(_param, _callBack)
                try {
                    window.chttp.postAsync(url, _param)
                } catch (error) {
                    console.error("chttp postAsync error: " + error);
                }

            },

            getAsync: function (url, _param, _callBack) {
                setUUID(_param, _callBack)
                try {
                    window.chttp.getAsync(url, _param)
                } catch (error) {
                    console.error("chttp getAsync error: " + error);
                }
            },
            newTab: function (_param) {
                try {
                    window.chttp.newTab(_param);
                } catch (error) {
                    console.error("chttp newTab error: " + error);
                }
            },
            setSource: function (_param) {
                try {
                    window.chttp.setSource(_param);
                } catch (error) {
                    console.error("chttp setSource error: " + error);
                }

            },
            openGfile: function (_param) {
                try {
                    window.chttp.openGfile(_param);
                } catch (error) {
                    console.error("chttp setSource error: " + error);
                }
            },
            PrintCurveCard: function (_param) {
                try {
                    window.chttp.PrintCurveCard(_param);
                } catch (error) {
                    console.error("chttp PrintCurveCard error: " + error);
                }
            },
            executeCmd: function (_param, _callBack) {
                setUUID(_param, _callBack);
                try {
                    window.chttp.executeCmd(_param)
                } catch (error) {
                    console.error("chttp executeCmd error: " + error);
                }

            },
            getConfigFile: function (_param, _callBack) {
                setUUID(_param, _callBack);
                if(_param.hasOwnProperty("autoFlag")&&_param.autoFlag){
                     _param.autoFlag=false;
                }
                try {
                    window.chttp.getConfigFile(_param);
                } catch (error) {
                    console.error("chttp getConfigFile error: " + error);
                }

            },
            writeLog: function (_param, _callBack) {
                setUUID(_param, _callBack);
                try {
                    window.chttp.writeLog(_param);
                } catch (error) {
                    console.error("chttp writeLog error: " + error);
                }

            },
            closeCard: function (_param) {
                try {
                    window.chttp.closeCard(_param);
                } catch (error) {
                    console.error("chttp closeCard error: " + error);
                }

            },
            exportFile: function (_param1, _param2) {
                try {
                    window.chttp.exportFile(_param1, _param2)
                } catch (error) {
                    console.error("chttp exportFile error: " + error);
                }
            },
            exporttable: function (_param) {
                try {
                    window.chttp.exportTableFile(_param);
                } catch (error) {
                    console.error("chttp exportTableFile error: " + error);
                }

            },
            exportImage: function (_param) {
                try {
                    window.chttp.exportImage(_param)
                } catch (error) {
                    console.log("chttp exportImage error: " + error);
                }

            },
            netWorkSaveFile: function (_param, _callBack) {
                setUUID(_param, _callBack);
                try {
                    window.chttp.netWorkSaveFile(_param);
                } catch (error) {
                    console.error("chttp netWorkSaveFile error: " + error);
                }
            },
            getConfigFileFromServer: function (_param, _callBack) {
                setUUID(_param, _callBack);
                try {
                    window.chttp.getConfigFileFromServer(_param);
                } catch (error) {
                    console.error("chttp getConfigFileFromServer error: " + error);
                }
            },
            writeConfigFile: function (_param) {
                var filePath = _param.filePath;
                var fileContent = _param.fileContent;
                try {
                    window.chttp.writeConfigFile(filePath,fileContent);
                } catch (error) {
                    console.error("chttp writeConfigFile error: " + error);
                }
            },
            hasPower: function (_param,_callBack) {
                setUUID(_param, _callBack);
                try {
                    window.chttp.hasCurveModifyPrivilege(_param);
                } catch {
                    console.error("chttp hasCurveModifyPrivilege error" + error);
                }
            }
        }
        http.post = http.postAsync.bind(http)
        http.get = http.getAsync.bind(http)
        const evalStr = jsList.reduce((str, url) => { return str += `await loadJs('${url}');` }, '')
        eval(`(async function(){ ${evalStr} })()`)
        console.log('http init success');
        if (http) {
            var message = { "status": "ok" };
            window.top.postMessage(JSON.stringify(message), '*');
        }
    })
}

(function () {
    try {
        if (!parent.http) {
            throw new Error()
        } else {
            window.http = parent.http
            window.chttp = parent.chttp
            const evalStr = jsList.reduce((str, url) => { return str += `await loadJs('${url}');` }, '')
            eval(`(async function(){ ${evalStr} })()`)
        }
    } catch (error) {
        try {
            _init()
        } catch (err) {
            console.error('init http fail ' + err)
        }
    }
})();

function loadJs(url) {
    return new Promise((resolve, reject) => {
        var script = document.createElement('script')
        script.type = 'text/javascript'
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null
                    resolve()
                }
            }
        } else {
            script.onload = function () {
                resolve()
            }
        }
        script.src = url
        document.body.appendChild(script)
    })
}

function CurveIframeEvent(msg) {
    // 当前所属区,通过XXX判断
    const area = 1
    if (msg && msg.func == 'CurveIframeEvent') {
        // 三区处理方式
        if (area == 3) {
            const data = {
                func: 'CurveIframeEvent', // 固定值，写死
                keyid: msg.keyid, // 多keyid用逗号隔开
                title: msg.title // 多title用逗号隔开
            }
            if (window.parent.length > 0) {
                window.parent.postMessage(JSON.stringify(data))
            } else {
                // 如果没有父页面，还是按照原方法打开曲线卡片
                console.log(data)
            }
        }
        // 一区处理方式
        if (area == 1) {
            const oneMsg = {
                'filename': 'card_template_html_curve.sys.pic.g?objId=' + msg.keyid + '&title=' + msg.title,
                'width': 1200,
                'height': 800,
                'top': 150,
                'left': 300,
                'title': '{"isAlignCenter": true,"title": "曲线卡片"}'
            }
            http.openGfile(oneMsg)
        }
    }
}
window.InitFlag = false;
//callback 方法名,...args 参数列表
function getHttp(callback, ...args) {
    if(!InitFlag){
    window.addEventListener('message', (event) => {
        if (JSON.parse(event.data)["status"] == "ok") {
            console.log('init http success');
            InitFlag = true;
            if (args.length == 0) {
                callback();
            } else {
                callback(...args);
            }
        }
    })
}else{
    if (args.length == 0) {
        callback();
    } else {
        callback(...args);
    }
}
}
window.windowProxy ={};