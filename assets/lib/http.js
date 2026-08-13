var http = (function () {
    function request(url, methods, params, callback) {
        var xhr = new XMLHttpRequest();
        // 兼容本地文件协议，需要修改chrome配置
        var okStatus = document.location.protocol === 'file:' ? 0 : 200;
        xhr.open(methods, url);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        xhr.send(params);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === okStatus) {
                    try {
                        const paramsobj = params ? JSON.parse(params) : params;
                        if (paramsobj && paramsobj.servname == 'gserver_data_access') {
                            var res = JSON.parse(xhr.responseText);
                            // 返回数据
                            var responseObject = {};
                            var resultstr = res.responseData;
                            var resultArr = [];
                            if (resultstr.indexOf('}') != -1) {
                                resultArr = resultstr.split('}');
                                var jsondata = resultArr[0] + '}';
                                var valuedata = resultArr[1];
                                var jsondataobj = JSON.parse(jsondata);
                                jsondataobj['data'] = gbk2utf8(valuedata);
                                if (res.code === 0) {
                                    responseObject.code = 200;
                                } else {
                                    responseObject.code = res.code;
                                }
                                responseObject.msg = res.describe;
                                responseObject.datas = JSON.stringify(jsondataobj);
                                responseObject.data = JSON.stringify(jsondataobj);
                                callback && callback(responseObject);
                            }
                        } else {
                            // 返回数据
                            var responseObject = {};
                            try {
                                var res = JSON.parse(xhr.responseText);
                            } catch (error) {
                                responseObject.code = 200;
                                responseObject.msg = '服务调用成功！';
                                responseObject.data = xhr.responseText;
                                responseObject.datas = xhr.responseText;
                                callback && callback(responseObject);
                            }
                            if (res.code === 0) {
                                responseObject.code = 200;
                            } else {
                                responseObject.code = res.code;
                            }
                            responseObject.msg = res.describe;
                            responseObject.data = xhr.responseText;
                            responseObject.datas = res.responseData;
                            callback && callback(responseObject);
                        }
                    } catch (e) {
                        var errorObject = {};
                        errorObject.code = 500;
                        errorObject.msg = xhr.statusText;
                        callback && callback(errorObject);
                        //throw new Error('[request error]: ', xhr.statusText);
                    }
                } else {
                    callback && callback({ err: new Error(xhr.status + xhr.statusText) });
                }
            }
        };
    }
    function gbk2utf8(str) {
        console.log('转换前的数据是：' + str);
        const newdata = str.replace(/^\x00|\x00$/g, '');
        console.log('转换后的数据是：' + newdata);
        return newdata;
    }
    function requestSync(url, methods, params) {
        var xhr = new XMLHttpRequest();
        var okStatus = document.location.protocol === 'file:' ? 0 : 200;
        xhr.open(methods, url, false);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        xhr.send(params);
        if (xhr.status === okStatus) {
            var res = JSON.parse(xhr.responseText);
            // 返回数据
            var responseObject = {};
            responseObject.datas = res.responseData;
            if (res.code === 0) {
                responseObject.code = 200;
            } else {
                responseObject.code = res.code;
            }
            responseObject.msg = res.describe;
            responseObject.data = xhr.responseText;
            return responseObject;
            //return xhr.responseText
        }
        throw new Error('[requestSync error]: ', xhr.statusText);
    }

    function getUrl(url, params) {
        // 如果不带参数直接返回url本身
        if (!params) {
            return url;
        }
        var paramsStr = '';
        Object.keys(params).forEach((key, i, arr) => {
            if (i < arr.length - 1) {
                paramsStr += key + '=' + params[key] + '&';
            } else {
                paramsStr += key + '=' + params[key];
            }
        });

        if (url.indexOf('?') > -1) {
            url += '&' + paramsStr;
        } else {
            url += '?' + paramsStr;
        }

        return url;
    }
    function parseParams(params) {
        if (params.hasOwnProperty('factory')) {
            params.manufactor = params.factory;
            delete params.factory;
        }
        if (params.hasOwnProperty('scn_id')) {
            params.scene_id = params.scn_id;
            delete params.scn_id;
        }
        if (params.hasOwnProperty('versions')) {
            params.version = params.versions;
            delete params.versions;
        }
        if (params.hasOwnProperty('data')) {
            if (params['servname'] == 'gserver_data_access') {
                params.requestData = ' ?' + params.data;
                delete params.data;
            } else {
                params.requestData = params.data;
                delete params.data;
            }
        }
        return params;
    }

    function get(url, params, callback) {
        request(getUrl(url, params), 'GET', null, callback);
    }
    function getSync(url, params) {
        return requestSync(getUrl(url, params), 'GET', null);
    }
    function post(url, params, callback) {
        params = parseParams(params);
        request(url, 'POST', JSON.stringify(params), callback);
    }
    function postSync(url, params) {
        params = parseParams(params);
        return requestSync(url, 'POST', JSON.stringify(params));
    }

    function setSource(params) {
        if (!(window.config && window.config.getConfig('isNotNewGen'))) {
            window.top.postMessage(
                {
                    fun: 'setSource',
                    msg: {
                        filename: params.filename
                    }
                },
                '*'
            );
        } else {
            if (window.config) window.location.href = window.config.getConfig('ospServer') + '/osp/Graph/Navigator.html?graph=' + params.filename + ';menubarshow=0;statusbarshow=0;toolbarshow=0';
        }
    }
    function newTab(params) {
        if (!(window.config && window.config.getConfig('isNotNewGen'))) {
            window.top.postMessage(
                {
                    fun: 'newTab',
                    msg: {
                        filename: params.filename
                    }
                },
                '*'
            );
        } else {
            if (window.config) window.open(window.config.getConfig('ospServer') + '/osp/Graph/Navigator.html?graph=' + (!params.filename || !params.filename.includes('?') ? params.filename : params.filename.replace(/\?/g, ';')) + ';isClient=1;menubarshow=0');
        }
    }

    /**
     * 打开g文件弹窗
     * @param {*} params
     * 属性字段如下：
     * ip filename title width height top left
     * @returns 弹窗实例
     */

    function openGfile(params) {
        if (!(window.config && window.config.getConfig('isNotNewGen'))) {
            window.top.postMessage(
                {
                    fun: 'popGraph',
                    msg: {
                        url: params.filename,
                        w: params.width,
                        h: params.height,
                        x: params.left,
                        y: params.top,
                        dialogjson: {
                            title: params.title,
                            showTitleBar: params.showTitleBar || '1',
                            isAlignCenter: params.isAlignCenter || '1'
                        },
                        isH5Msg: params.isH5Msg
                    }
                },
                '*'
            );
        } else {
            const url = params.ip + '/graph/Graph/Navigator.html?graph=' + params.filename + ';menubarshow=0;statusbarshow=0;toolbarshow=0';

            const dialog = Vue.prototype.$showDialog({
                title: params.title,
                url: url,
                width: params.width,
                height: params.height,
                top: params.top,
                left: params.left,
                isDragable: true
            });
            return dialog;
        }
    }
    return {
        get: post,
        getSync: postSync,
        post: post,
        postSync: postSync,
        newTab: newTab,
        setSource: setSource,
        openGfile: openGfile,
        sendGetRequest: get
    };
})();
console.log('[http]: ', http);
