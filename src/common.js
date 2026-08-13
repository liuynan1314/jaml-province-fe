import axios from 'axios';
import { okStatus, mockPath, urlConfig, confPath } from './global';

let ajaxCallingMap = {};
export function ajaxCall(
    key,
    opt = {
        success() {},
        error() {},
        type: 'get',
        useMock: false,
        headers: {},
        mock: null,
        params: {},
        timeout: 10,
        useMock: false
    },
    paramsHasUser
) {
    typeof opt.transformResponse === 'undefined' ? (opt.transformResponse = true) : null;
    if (!(key in urlConfig) && key !== '@_@') {
        console.error(`no ${key} in urlConfig`);
        return;
    }
    const uniqId = opt.uniqId ? opt.uniqId : key;
    if (uniqId in ajaxCallingMap) {
        if (uniqId.startsWith('!')) {
            ajaxCallingMap[uniqId]?.abort();
            lime.error('<' + uniqId + '> previous request was ignored.');
        } else {
            lime.error('<' + uniqId + '> data is loading right now, request ignored.');
            return;
        }
    }

    const _urlInfo =
        key === '@_@'
            ? {
                  url: opt.url,
                  mock: opt.mock
              }
            : urlConfig[key];
    let _useMock = opt.useMock || jam.getUrlParam('useMock', false) === 'true';
    const _mock = opt.mock ? opt.mock : _urlInfo.mock;
    // const URL = (() => {
    //     if (!_mock) {
    //         return;
    //     }
    //     const _mockInfo = getMockConfig(_urlInfo.url);
    //     if (opt.useMock === true || _globalMockFlag || (_mockInfo && _mockInfo.block === true)) {
    //         let _newURL = _mock;
    //         if (_mockInfo && _mockInfo.alternative) {
    //             _newURL = _mockInfo.alternative;
    //         }
    //         lime.log(_urlInfo.url + '的返回已使用' + _newURL + '替换');
    //         _useMock = true;
    //         return _newURL;
    //     }
    //     return _urlInfo.url;
    // })();
    function _successFunc(result) {
        let _cause = null;

        if (opt.loadFile) {
            opt.success(result);
        } else {
            if (result != null) {
                _cause = 'cause' in result ? result.cause : result.message;
                if (('code' in result || 'state' in result) && 'data' in result) {
                    let _code = 'state' in result ? result.state : result.code;
                    _code = result.code === '00000' ? result.code : parseInt(_code);
                    if (_code > 0 || _code === '00000') {
                        try {
                            opt.success(opt.transformResponse ? result?.data || result : result, _cause, { uniqId });
                            // lime.log(`success func called, URL: ${URL}`);
                            // downloadMock(ajaxOption.mockData, result.data);
                            _cause = null;
                        } catch (err) {
                            console.error('Failed to call success function.', err);
                        }
                        // setLocalStorage();
                    } else {
                        if (!_cause) {
                            _cause = 'returned state is -1';
                            if (opt?.error) {
                                opt.error(result?.msg || result);
                            }
                        }
                    }
                } else {
                    if (result.code === -10000) {
                        const ospPort = loadConf('config.json', {})?.ospPort || '8443';
                        const redirectUrl = NODE_ENV !== 'development' ? result?.data || `${location.protocol}//${location.hostname}:${ospPort}/osp/jkz_portal/login.jsp?redirectUrl=${location.href}` : (mango.get('config')?.ospUrl || 'https://192.168.208.153:8443//osp/jkportal/index.html') + `?redirectUrl=http://127.0.0.1:3333/#/`;
                        console.log('redirecting to:', redirectUrl);
                        top.location.href = redirectUrl;
                    }
                    try {
                        opt.success(opt.transformResponse ? result?.data || result : result, _cause, { uniqId });
                        // lime.error(`success func called, URL: ${URL}`);
                        // downloadMock(ajaxOption.mockData, result);
                        _cause = null;
                    } catch (err) {
                        console.error('Failed to call success function.', err);
                    }
                }
            } else {
                _cause = 'Result recieved of <' + uniqId + '> is null.';
            }
            if (_cause != undefined && _cause != null) {
                try {
                    failedFunc(_cause);
                    // lime.error(`failed func called, URL: ${URL}`);
                } catch (err) {
                    lime.error('Failed to call failure function.');
                }
            }
        }
    }

    if (_useMock && _mock) {
        _successFunc(loadMock(_mock));
        return;
    }
    const controller = new AbortController();
    const config = {
        url: _urlInfo.url,
        params: opt.params || {},
        method: opt.type || 'get',
        timeout: (opt?.timeout || 10) * 1000,
        signal: controller.signal
    };
    // if (paramsHasUser !== false) {
    //     config.params.loginUserId = mango.get('user').userId;
    // }

    if (config.method === 'post') {
        config.data = config.params;
        delete config.params;
    }
    if (config.method === 'get') {
        let search = '?';
        for (let [k, v] of Object.entries(config.params || {})) {
            search += `${k}=${v}&`;
        }
        if (search.length === 1) {
            search = '';
        }
        if (search.endsWith('&')) {
            search = search.slice(0, -1);
        }
        config.url = config.url + search;
        delete config.params;
    }
    if (opt.responseType) {
        config.responseType = opt.responseType;
    }
    if (opt.queryPost) {
        //post请求地址拼接请求数据
        config.url = opt.url;
    }

    const token = jam.getUrlParam('token');
    if (token) localStorage.setItem('JKZ_NARIKJ_PORTAL_TOKEN', token);
    config.headers = {
        Authorization: 'Bearer ' + token,
        tag: new Date().valueOf()
    };
    if (opt.headers) {
        config.headers = {
            Authorization: 'Bearer ' + token,
            tag: new Date().valueOf(),
            ...opt.headers
        };
    }

    raspberry
        .request(config)
        .then(function (response) {
            if (typeof response === 'undefined') {
                throw new Error('response is undefined');
            } else if (response instanceof Error) {
                throw response;
            } else {
                _successFunc(response);
            }
        })
        .catch(function (error) {
            const status = error?.response?.status;
            if (_mock && ([404, 405, 501].includes(status) || process.env.NODE_ENV === 'development')) {
                _successFunc(loadMock(_mock));
            } else {
                if (opt?.error) {
                    opt.error(error);
                }
            }
        })
        .finally(() => {
            if (opt.complete) {
                opt.complete();
            }
            delete ajaxCallingMap[uniqId];
        });
    ajaxCallingMap[uniqId] = controller;
}
let _globalMock;
let _globalMockFlag = false;
export function getMockConfig(key) {
    if (!_globalMock) {
        _globalMock = loadConf('mockConfig.json') || {};
        if ('all' in _globalMock) {
            lime.error('已设置为全局使用mock数据');
            _globalMockFlag = true;
        }
    }
    return _globalMock[key];
}

function confignize(_data) {
    _data.__proto__ = Object.create({
        get: function (_key, _default) {
            return _key in this ? this[_key] : _default;
        },
        getNumber: function (_key, _default) {
            return _key in this ? spoon.toNumber(this[_key]) : _default;
        },
        getString: function (_key, _default) {
            return _key in this ? String(this[_key]) : _default;
        },
        getBoolean: function (_key, _default) {
            return _key in this ? spoon.toBoolean(this[_key]) : _default;
        },
        getStringList: function (_key) {
            return spoon.toArray(_key);
        }
    });
}

function loadLocalFile(path) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    xhr.send();
    let _res;
    if (xhr.status === okStatus) {
        _res = JSON.parse(xhr.responseText);
    } else {
        lime.error(`Failed load config from <${path}>`);
    }
    return _res;
}
export function loadMock(_filename = 'example.json') {
    if (!_filename.endsWith('.json')) {
        _filename = _filename + '.json';
    }
    return loadLocalFile(`${mockPath}${_filename}`);
}
export function loadConf(_filename, _default) {
    let _res = loadLocalFile(`${confPath}${_filename}`) || _default || {};
    if (!Array.isArray(_res)) {
        confignize(_res);
    }
    return _res;
}

export function router_getquery(href) {
    // 获取当前URL
    const url = new URL(href);

    // 获取查询参数字符串
    const queryString = url.search;

    // 使用URLSearchParams解析查询参数
    const params = new URLSearchParams(queryString);

    // 将查询参数转换为对象
    const paramsObject = {};
    for (const [key, value] of params.entries()) {
        paramsObject[key] = value;
    }
    return paramsObject;
}

export function PageUtil(option) {
    this.total = option.total;
    this.size = option.size || 50;
    this.now = 1;
    this.$cntr = option.cntr;
    this.$cntr.classList.add('page-util');
    this.clickFuc = option.click;
    this.preIcon = option.preIcon || '上一页';
    this.nextIcon = option.nextIcon || '下一页';
    this.__init();
}

PageUtil.prototype = {
    $cntr: null,
    numcntr: null,
    total: 0,
    now: 0,
    size: 0,
    click: null,
    changeTime: -1,
    __init() {
        const me = this;
        const up = document.createElement('div');
        up.className = 'pre-page page';
        up.innerHTML = this.preIcon;
        up.onclick = function () {
            me.now = me.now - 1;
            me.clickFuc && me.clickFuc(me.now);
        };

        const num = document.createElement('div');
        num.className = 'page-num-cntr';
        this.numcntr = num;

        const down = document.createElement('div');
        down.className = 'next-page page';
        down.innerHTML = this.nextIcon;
        down.onclick = function () {
            me.now = me.now + 1;
            me.clickFuc && me.clickFuc(me.now);
        };
        this.$cntr.appendChild(up);
        this.$cntr.appendChild(num);
        this.$cntr.appendChild(down);
    },

    setPage(opt) {
        if (opt.total) {
            this.total = opt.total;
        }
        if (opt.now) {
            this.now = opt.now;
        }
        this.numcntr.innerHTML = '';
        if (this.total === this.now) {
            spoon.addClass(this.$cntr.querySelector('.next-page'), 'unclick');
        } else {
            spoon.removeClass(this.$cntr.querySelector('.next-page'), 'unclick');
        }

        if (1 === this.now) {
            spoon.addClass(this.$cntr.querySelector('.pre-page'), 'unclick');
        } else {
            spoon.removeClass(this.$cntr.querySelector('.pre-page'), 'unclick');
        }
        //小于6页全部展示
        if (this.total <= 6) {
            for (let i = 1; i <= this.total; i++) {
                this.addPageNum(i);
            }
            return;
        }
        //当前页小于等于4时
        if (this.now <= 4) {
            for (let i = 1; i <= 5; i++) {
                this.addPageNum(i);
            }
            this.addPageNum('...');
            this.addPageNum(this.total);
            return;
        }
        this.addPageNum(1);
        //最后4页
        if (this.now + 3 >= this.total) {
            this.addPageNum('...');
            for (let i = this.total - 4; i <= this.total; i++) {
                this.addPageNum(i);
            }
            return;
        }
        this.addPageNum('...');
        this.addPageNum(this.now - 1);
        this.addPageNum(this.now);
        this.addPageNum(this.now + 1);
        this.addPageNum('...');
        this.addPageNum(this.total);
    },
    addPageNum(num) {
        if (num === '...') {
            this.numcntr.appendChild(this.getMoreDom());
            return;
        }
        const _dom = document.createElement('div');
        _dom.className = `page page-num${this.now === num ? ' select' : ''}`;
        _dom.innerHTML = num;
        _dom.onclick = () => {
            this.changePage(num);
        };
        this.numcntr.appendChild(_dom);
    },
    getMoreDom() {
        const _more = document.createElement('span');
        _more.className = 'page-more';
        _more.innerHTML = '. . .';
        _more.onclick = () => {
            if (_more.classList.contains('input')) {
                return;
            }
            _more.classList.add('input');
            _more.contentEditable = true;
            _more.innerHTML = '';
            _more.focus();
        };
        _more.onkeydown = (e) => {
            if (!e.key.match(/[0-9]/) && e.key !== 'Backspace') {
                e.preventDefault();
                return;
            }
        };
        _more.onkeyup = (e) => {
            let _num = e.target.innerText;
            if (_num === '') {
                return;
            }
            if (_num > this.total) {
                _num = this.total;
                e.target.innerText = _num;
            }
            this.changePage(parseInt(_num));
        };
        return _more;
    },
    changePage(num) {
        clearTimeout(this.changeTime);
        this.changeTime = setTimeout(() => {
            this.now = num;
            this.clickFuc && this.clickFuc(this.now);
        }, 500);
    }
};

export function getHdRecord(param, uniqId) {
    return new Promise((r, j) => {
        ajaxCall('getHdRecord', {
            type: 'post',
            uniqId: uniqId,
            params: param,
            mock: uniqId,
            success(data) {
                r(data);
            },
            error(err) {
                j(err);
            }
        });
    });
}

export function getSelectDataByMenu(key, name2Value) {
    return Object.entries(MENU[key]).map((el) => ({ name: el[1], value: name2Value ? el[1] : el[0] }));
}
export const selectSearchInputSuffix = '-input';
export function selectSearch({ id, name, getData = () => {}, valueKey, onselected }, props) {
    let _keyTo = -1;
    let _options;
    let _callback = (data) => {
        data.unshift({
            value: null,
            name: '---请选择---'
        });
        _options.data = data;
    };

    return {
        id: id,
        type: 'input',
        cap: name,
        onclick() {
            if (this.reloadData !== false) {
                getData(null, _callback);
                this.reloadData = false;
            }
        },
        onkeyup(e) {
            clearTimeout(_keyTo);
            _keyTo = setTimeout(() => {
                getData(this.value, _callback);
            }, 150);
        },
        placeholder: '请选择',
        valueKey: valueKey + selectSearchInputSuffix,
        onmount() {
            const me = this;
            _options = new OliveOptions({
                class: 'select-oliveoptions',
                styles: [
                    Styles.layout.flex,
                    Styles.options.optionslot.odd,
                    Styles.options.optionslot.flex({ direction: 'column' }),
                    Styles.options.optionslot.align({ alignItems: 'flex-start' }),
                    Styles.size({
                        maxHeight: '25rem',
                        minWidth: '8rem',
                        minHeight: '3rem'
                    }),
                    Styles.layout({
                        overflow: 'hidden auto'
                    })
                ],
                type: 'radio',
                indicatorStyles: [Styles.hover.highlightcap],
                onvaluechange() {
                    let _checked = this.getCheckedOptions();
                    me.value = _checked[0].value ? _checked[0].name : '';
                    mango.pub(valueKey, _checked);
                    if (onselected) {
                        onselected(_checked);
                    }
                }
            });
            const pps = new PapayaPopup({
                type: PopupType.contextMenu,
                eventTarget: this,
                bias: 5,
                content: _options,
                showOn: 'click',
                exclusive: false
            }).bindEvents();
            this.options = _options;
        },
        ...props
    };
}
export function getMovableStyles(args = {}) {
    return [
        Styles.props(
            Object.assign(
                {
                    position: 'absolute',
                    width: '50%',
                    height: '50%',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)',
                    zIndex: 99
                },
                args
            )
        ),
        Styles.icon.duotone,
        // Styles.interact.movable,
        Styles.interact.closable
    ];
}
export function getDateObj(date) {
    if (!date) return;
    if (typeof date === 'number') {
        date = date.toString();
    }
    if (typeof date === 'string') {
        date = date.length === 10 ? new Date(parseInt(date) * 1000) : new Date(parseInt(date));
    }
    return date;
}
export function formatTime(date, pattern) {
    if (!date) return;
    date = getDateObj(date);
    let translateDow = function (_dow, _capital) {
        // bad practice, rewrite later
        let _ret;
        _dow = _dow < 0 || _dow >= 7 ? Math.abs(_dow) % 7 : _dow;
        if (_capital === 0) {
            _ret = '星期' + ['日', '一', '二', '三', '四', '五', '六'][_dow];
        } else {
            switch (_dow) {
                case 0:
                    _ret = (_capital ? 'S' : 's') + 'unday';
                case 1:
                    _ret = (_capital ? 'M' : 'm') + 'onday';
                case 2:
                    _ret = (_capital ? 'T' : 't') + 'uesday';
                case 3:
                    _ret = (_capital ? 'W' : 'w') + 'ednesday';
                case 4:
                    _ret = (_capital ? 'T' : 't') + 'ursday';
                case 5:
                    _ret = (_capital ? 'F' : 'f') + 'riday';
                case 6:
                    _ret = (_capital ? 'S' : 's') + 'aturday';
                default:
                    _ret = 'N/A';
            }
        }
        return _ret;
    };

    return pattern
        .replace('yyyy', date.getFullYear())
        .replace('yy', String(date.getFullYear()).substr(2))
        .replace('MM', pad(date.getMonth() + 1, 2))
        .replace('M', date.getMonth() + 1)
        .replace('dd', pad(date.getDate(), 2))
        .replace('d', date.getDate())
        .replace('HH', pad(date.getHours(), 2))
        .replace('H', date.getHours())
        .replace('mm', pad(date.getMinutes(), 2))
        .replace('m', date.getMinutes())
        .replace('ss', pad(date.getSeconds(), 2))
        .replace('SSS', pad(date.getMilliseconds(), 3))
        .replace('s', date.getSeconds())
        .replace('w', getWeekDay(date.getDay(), false))
        .replace('W', getWeekDay(date.getDay(), true))
        .replace('星期几', getWeekDay(date.getDay(), 0));
}

var getWeekDay = function (_dow, _capital) {
    let _ret;
    _dow = _dow < 0 || _dow >= 7 ? Math.abs(_dow) % 7 : _dow;
    if (_capital === 0) {
        _ret = '星期' + ['日', '一', '二', '三', '四', '五', '六'][_dow];
    } else {
        switch (_dow) {
            case 0:
                _ret = (_capital ? 'S' : 's') + 'unday';
            case 1:
                _ret = (_capital ? 'M' : 'm') + 'onday';
            case 2:
                _ret = (_capital ? 'T' : 't') + 'uesday';
            case 3:
                _ret = (_capital ? 'W' : 'w') + 'ednesday';
            case 4:
                _ret = (_capital ? 'T' : 't') + 'ursday';
            case 5:
                _ret = (_capital ? 'F' : 'f') + 'riday';
            case 6:
                _ret = (_capital ? 'S' : 's') + 'aturday';
            default:
                _ret = 'N/A';
        }
    }
    return _ret;
};

function pad(num, size) {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
}

export function isStringNull(data) {
    return data === null || data === undefined || (typeof data === 'string' && (data.trim() === '' || data.trim().toLowerCase() === 'undefined' || data.trim().toLowerCase() === 'null' || data.trim().toLowerCase() === '未定义' || data.trim().toLowerCase() === '未分类')) ? true : false;
}

let __detailConf;
export function getDetailConf(key, _default) {
    if (!__detailConf) {
        if (!mango.get('detailConf')) {
            mango.pub('detailConf', loadConf('detailConfig.json', {}));
        }
        __detailConf = mango.get('detailConf');
    }
    if (key) {
        if (__detailConf.get(key, {}).value === undefined) {
            return _default;
        }
        return __detailConf.get(key, {}).value;
    } else {
        return __detailConf;
    }
}
export function getDetailConfObject(key, _default) {
    if (!__detailConf) {
        __detailConf = loadConf('detailConfig.json', {});
    }
    if (key) {
        if (__detailConf.get(key, undefined) === undefined) {
            return _default;
        }
        return __detailConf.get(key, {});
    } else {
        return __detailConf;
    }
}
export function buildDateHtml(_dateParam) {
    if (isStringNull(_dateParam) || _dateParam == 0) {
        return '';
    }
    let _date = formatTime(_dateParam, 'yyyy-MM-dd');
    if (_date === undefined) {
        // debugger;
    }
    let _time = formatTime(_dateParam, 'HH : mm : ss');
    return `<div class="td-date-time"><span class="td-date">${_date}</span><span class="td-time align-justify">${_time}</span></div>`;
}
export function finetuneEventContent(_content, _substation, _occurTime) {
    let _ret = _content;
    if (_substation && _substation != 0) {
        _ret = _ret.replace(RegExp(`${_substation}[ \t]+`), '');
    }
    if (_occurTime) {
        _ret = _ret.replace(RegExp(`${_occurTime}[ \t]+`), '');
    }
    _ret = _ret.trim();
    return _ret;
}

export function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function findCol(currentNode) {
    if (currentNode && currentNode?.col) {
        return currentNode;
    } else {
        currentNode = jam.findParent(currentNode);
        return findCol(currentNode);
    }
}

export async function exportExcel(url, params = {}, name = '', type = 'post') {
    const config = {
        url: url,
        method: type,
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jam.getUrlParam('token')
        }
    };

    if (type.toLowerCase() === 'get') {
        config.params = params;
    } else {
        config.data = params;
    }

    const response = await axios(config);

    const BlobUrl = URL.createObjectURL(new Blob([response.data]));
    const aLink = document.createElement('a');
    aLink.style.display = 'none';
    aLink.href = BlobUrl;
    aLink.setAttribute('download', name);
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);
}

export function formatterJameTime(time) {
    return time
        ? jame({
              type: 'badge',
              styles: [
                  Styles.css({
                      borderRadius: 's',
                      fontSize: 's'
                  })
              ],
              cap: jam.formatTime(time, 'yyyy-MM-dd'),
              content: jam.formatTime(time, 'HH:mm:ss')
          })
        : '--:--';
}

export function formatterJameLevel(typeName, type) {
    let _color;
    if (type == 1) {
        _color = 'red';
    } else if (type == 2) {
        _color = 'orange';
    } else if (type == 3) {
        _color = 'lightorange';
    }

    return typeName && typeName !== '--' && typeName !== 'null'
        ? jame({
              type: 'label',
              class: 'type-label',
              cap: typeName,
              styles: [
                  Styles.css({
                      fontSize: 's',
                      color: _color
                  })
              ]
          })
        : '--';
}

export function formatterStateType(typeName, type) {
    return typeName && typeName !== '--' && typeName !== 'null'
        ? jame({
              type: 'label',
              class: 'type-label',
              cap: typeName,
              color: type,
              styles: [
                  'with.accent',
                  'on.accent',
                  Styles.css({
                      fontSize: 's',
                      padding: 's',
                      borderRadius: 's'
                  })
              ]
          })
        : '--';
}

/**
 * 格式化电压等级
 * @param {*} bvName
 * @returns
 */
export function formatterJameBv(bvName) {
    const _color = jam.getColor(bvName).hex();
    return bvName && bvName !== '--' && bvName !== 'null'
        ? jame({
              type: 'label',
              class: 'bv-label',
              cap: bvName,
              icon: `<div style="width:0.625rem;min-width:0.625rem;height:0.625rem;min-height:0.625rem;border-radius:50%;background:${_color}"><div>`,
              styles: [
                  Styles.label.cap.css({
                      width: '3rem',
                      textAlign: 'left',
                    //   marginLeft: 'm'
                  })
              ]
          })
        : '--';
}

/**
 * 格式化电压等级-新
 * @param {*} bvName
 * @returns
 */
export function formatterJameBvNew(bvName) {
    const _color = jam.getColor(bvName).hex();
    return bvName && bvName !== '--' && bvName !== 'null'
        ? jame({
              type: 'label',
              class: 'bv-label',
              cap: bvName,
              icon: `<div style="width:0.625rem;min-width:0.625rem;height:0.625rem;border-radius:50%;background:${_color}"><div>`,
              styles: [
                  Styles.label.cap.css({
                      width: '3rem',
                      textAlign: 'left'
                  })
              ]
          })
        : '--';
}

export function formatterJameStatus(status) {
    let _color, statusName;
    if (status == 0) {
        _color = 'success';
        statusName = '已发送';
    } else if (status == 1) {
        _color = 'error';
        statusName = '发送失败';
    } else if (status == 2) {
        _color = 'info';
        statusName = '未发送';
    }

    return statusName
        ? jame({
              type: 'label',
              class: 'status-label',
              color: _color,
              icon: `<div style="width:0.5rem;min-width:0.5rem;height:0.5rem;border-radius:50%;background:${jam.getColor(_color).hex()}"><div>`,
              cap: statusName,
              styles: [
                  'with.tint',
                  'border.subtle',
                  'border.s',
                  Styles.css({
                      fontSize: 's',
                      borderRadius: 'l',
                      padding: 's'
                  })
              ]
          })
        : '--';
}

const typeColorMap = new Map();
/**
 * 格式化type相关的标签背景色，每种类型的标签颜色唯一
 * @param {*} typeName 类型名称
 * @param {*} num 颜色集数量
 * @returns
 */
export function formatterJameType(typeName, num = 10) {
    let _colorIdx = 0;
    if (typeColorMap.has(typeName)) {
        _colorIdx = typeColorMap.get(typeName);
    } else {
        _colorIdx = typeColorMap.size % num;
        typeColorMap.set(typeName, _colorIdx);
    }

    return typeName && typeName !== '--' && typeName !== 'null'
        ? jame({
              type: 'label',
              class: 'type-label',
              cap: typeName,
              color: jam.colorSet[_colorIdx],
              styles: [
                  'with.tint',
                  Styles.css({
                      fontSize: 's',
                      padding: 's',
                      borderRadius: 's'
                  })
              ]
          })
        : '--';
}

const stateColorMap = new Map();
/**
 * 格式化state相关的标签背景色，每种类型的标签颜色唯一
 * @param {*} stateName 类型名称
 * @param {*} num 颜色集数量
 * @returns
 */
export function formatterJameState(stateName, num = 10) {
    let _color;
    let _colorIdx = 0;

    // 如果没有特定的状态色，从颜色集里拿相关的颜色
    if (stateName.toLowerCase() in jam.customColors) {
        _color = stateName.toLowerCase();
    } else if (stateColorMap.has(stateName)) {
        _color = stateColorMap.get(stateName);
    } else {
        _colorIdx = stateColorMap.size % num;
        _color = jam.colorSet[_colorIdx];
        stateColorMap.set(stateName, _color);
    }

    return stateName && stateName !== '--' && stateName !== 'null'
        ? jame({
              type: 'label',
              class: 'state-label',
              cap: stateName,
              color: _color,
              styles: [
                  'with.tint',
                  Styles.css({
                      fontSize: 's',
                      padding: 's',
                      borderRadius: 's'
                  })
              ]
          })
        : '--';
}

export const homeRouter = ['/home_zj'];
export const homeSceneRouter = homeRouter.filter((p) => !p.includes('home_zj'));
export function homeRouterWatcher(path, matchFunc, unMatchedFunc) {
    const _path = path || rambutan.getPath();
    if (homeRouter.includes(_path)) {
        if (matchFunc && typeof matchFunc === 'function') {
            matchFunc();
        }
    } else {
        if (unMatchedFunc && typeof unMatchedFunc === 'function') {
            unMatchedFunc();
        }
    }
}

// 判断是不是一个合法的http地址或者相对路径url
export function isValidHttpOrRelativeUrl(url) {
    if (typeof url !== 'string') return false;
    // 匹配 http:// 或 https:// 开头的绝对地址
    const isHttpAbsolute = /^https?:\/\//i.test(url);
    // 只匹配 ./xxx 或 ../xxx 开头的相对路径
    const isRelative = /^\.\.?\//.test(url);
    return isHttpAbsolute || isRelative;
}
