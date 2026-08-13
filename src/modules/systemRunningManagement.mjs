let _model,
    _msgr,
    cacheData = [],
    cacheTableData = [],
    sort = 'desc',
    uniqId = null,
    switchFlag = null;
const map = {
    1: 'node',
    2: 'app',
    3: 'proc'
};
import '../components/systemRunning/systemRunningCard.js';
import { ajaxCall } from '../common.js';
import { getRegionList, digitalFormatter } from '../utils/ajaxCache.js';
import { statusStates, valueStates, cpuValueStates } from '../components/systemRunning/node.js';
export default {
    type: 'container',
    styles: [
        Styles.size.fullsize,
        Styles.css({
            display: 'flex',
            flexDirection: 'column',
            fontSize: 'm',
            overflowY: 'auto'
            // backgroundImage: 'url(../../common/img/dataQualityManagement/bg_right.png)',
            // backgroundSize: '100% 100%',
            // backgroundRepeat: 'no-repeat',
            // padding: 'm s'
            // color: 'hsl(201.6, 33.3%, 64.1%)'
        })
    ],
    components: [
        {
            type: 'container',
            class: 'top',
            styles: [
                Styles.css({
                    display: 'flex',
                    height: 'initial',
                    width: '100%'
                })
            ],
            containerStyles: [
                Styles.css({
                    display: 'flex',
                    height: 'initial',
                    gap: 's',
                    alignItems: 'flex-start'
                })
            ],
            components: [
                {
                    type: 'container',
                    class: 'top-left',
                    styles: [
                        Styles.css({
                            width: '75%',
                            alignItems: 'flex-start'
                        })
                    ],
                    components: [
                        {
                            type: 'buttongroup-checkbox',
                            cap: '区域：',
                            valueKey: 'regionId',
                            dataWatcher: 'regionList',
                            styles: [
                                Styles.buttonGroupStylesWithBgCap,
                                Styles.css({
                                    padding: '0 s'
                                }),
                                Styles.buttongroup.labelslot.css({
                                    alignSelf: 'flex-start',
                                    fontSize: 'm',
                                    margin: 's s'
                                })
                            ]
                        }
                    ]
                },
                {
                    type: 'container',
                    class: 'top-right',
                    styles: [
                        Styles.css({
                            width: '25%',
                            alignItems: 'flex-start'
                        })
                    ],
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '排序指标：',
                            valueKey: 'indexType',
                            data: [
                                {
                                    value: '1',
                                    name: '节点',
                                    onclick: buttonGroupClick
                                },
                                {
                                    value: '2',
                                    name: '应用',
                                    onclick: buttonGroupClick
                                },
                                {
                                    value: '3',
                                    name: '进程',
                                    onclick: buttonGroupClick
                                }
                            ],
                            styles: [
                                Styles.buttonGroupStylesWithBgCap,
                                Styles.buttongroup.labelslot.css({
                                    alignSelf: 'flex-start',
                                    fontSize: 'm',
                                    margin: 's s'
                                })
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type: 'container',
            class: 'middle',
            styles: [
                // Styles.interact.scrollX,
                Styles.css({
                    height: 'initial',
                    width: '100%',
                    display: 'flex',
                    alignContent: 'flex-start',
                    overflowX: 'auto',
                    margin: 's 0',
                    minHeight: '21.6rem'
                })
            ],
            components: [
                {
                    type: 'systemRunningCard',
                    buildFor: '(item) in cardList',
                    styles: [
                        Styles.css({
                            flexShrink: 0
                        })
                    ]
                }
            ]
        },
        {
            type: 'container',
            class: 'bottom',
            styles: [
                Styles.css({
                    height: 0,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                })
            ],
            components: [
                {
                    type: 'container',
                    styles: [
                        Styles.css({
                            display: 'flex',
                            width: '100%',
                            gap: 's',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            paddingBottom: 's',
                            paddingTop: 's',
                            flexWrap: 'wrap'
                        })
                    ],
                    components: [
                        {
                            ref: 'tableType',
                            type: 'buttongroup-radio',
                            valueKey: 'tableType',
                            valueWatcher: 'tableType',
                            data: [
                                {
                                    value: 'node',
                                    name: '节点'
                                },
                                {
                                    value: 'app',
                                    name: '应用'
                                },
                                {
                                    value: 'proc',
                                    name: '进程'
                                }
                            ],
                            value: null,
                            styles: [
                                Styles.buttonGroupStyles,
                                Styles.css({
                                    alignSelf: 'flex-start',
                                    fontSize: 'm',
                                    paddingLeft: 0
                                })
                            ],
                            onclick() {
                                const input = _model.ref('input');
                                input.value = null;
                            }
                        },
                        {
                            ref: 'status',
                            type: 'select',
                            valueKey: 'status',
                            placeholder: '-请选择状态-',
                            dataWatcher: 'typeMenu',
                            styles: [Styles.select.regularSelect],
                            value: null
                        },
                        {
                            ref: 'input',
                            type: 'input',
                            valueKey: 'inputText',
                            placeholder: '-请搜索名称-',
                            styles: [Styles.input.regularInput],
                            onvaluechange: jam.makeDebounce(function (value) {
                                if (!switchFlag) filterData();
                            }, 500)
                        }
                    ]
                },
                {
                    type: 'table',
                    styles: [
                        Styles.hover.toShowAll({ selector: '.hover' }),
                        Styles.tableStylesFixedRowGeight,
                        Styles.numberAlign,
                        Styles.css({
                            minHeight: '0%',
                            width: '100%',
                            flexGrow: 1,
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignContent: 'flex-start'
                        })
                    ],
                    dataDef: jaml.var('tableType', (val) => {
                        const status = _model.ref('status');
                        status.value = null;
                        switch (val) {
                            case 'node':
                                status.data = _msgr.get('nodeStatus');
                                getNodeTableData();
                                break;
                            case 'app':
                                status.data = _msgr.get('appStatus');
                                getAppTableData();
                                break;
                            case 'proc':
                                status.data = _msgr.get('procStatus');
                                getProcTableData();
                                break;
                        }
                        return getDataDef(val);
                    }),
                    dataWatcher: 'tableData',
                    watchers: [
                        {
                            key: 'status',
                            callback: function () {
                                if (!switchFlag) filterData();
                            }
                        }
                    ]
                }
            ]
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: async function () {
        let regionList = await getRegionList();
        if (regionList) {
            regionList.unshift({
                value: 0,
                name: '省级'
            });
        }
        _msgr.pub('regionList', regionList || []);
        let { nodeStatus, appStatus, procStatus, netStatusList } = await getStsRunMenu('节点工作状态信息');
        _msgr.pub('typeMenu', nodeStatus || []); // 默认给节点的数据
        _msgr.pub('nodeStatus', nodeStatus || []);
        _msgr.pub('appStatus', appStatus || []);
        _msgr.pub('procStatus', procStatus || []);
        _msgr.pub('netStatusList', netStatusList || []);
        _msgr.pub('tableType', 'node');
        getData();
    },
    watchers: [
        {
            key: 'regionId',
            callback() {
                getData();
                const tableType = _msgr.get('tableType');
                switch (tableType) {
                    case 'node':
                        getNodeTableData();
                        break;
                    case 'app':
                        getAppTableData();
                        break;
                    case 'proc':
                        getProcTableData();
                        break;
                }
            }
        }
    ]
};
function getData() {
    let param = {
        regionIdList: _msgr.get('regionId')
    };
    lime.log(param);
    uniqId = jam.genUUID();
    lime.log('最新请求' + uniqId);
    ajaxCall('getSysRunStat', {
        success(data, msg, opt) {
            if (data?.code === -1) return;
            if (uniqId !== opt.uniqId) {
                lime.log(opt.uniqId + '非最新请求，不渲染数据');
                return;
            }
            cacheData = data;
            _model.vars.cardList = data;
            // sortData(_msgr.get('indexType'));
        },
        error(error) {
            console.log(error);
        },
        uniqId,
        params: param,
        useMock: false,
        type: 'post'
    });
}
function filterData() {
    let rt = jam.cloneDeep(cacheTableData);
    rt = filterName(rt, _msgr.get('inputText')?.trim());
    rt = filterStatus(rt, _msgr.get('status'));
    rt = filterRegion(rt, _msgr.get('regionId'));
    _msgr.pub('tableData', rt);
}
function filterName(rt, text) {
    if (text !== '' && text !== undefined) {
        rt = rt.filter((item) => item?.nodeName?.includes(text) || item?.appName?.includes(text) || item?.procName?.includes(text));
    }
    return rt;
}
function filterRegion(rt, id) {
    if (id) {
        rt = rt.filter((item) => item.regionId === id);
    }
    return rt;
}
function filterStatus(rt, id) {
    if (id) {
        rt = rt.filter((item) => +item?.nodeStatus === +id || +item?.curStatus === +id || +item?.procStatus === +id);
    }
    return rt;
}
function getStsRunMenu() {
    return new Promise((resolve, reject) => {
        ajaxCall('getStsRunMenu', {
            success(data) {
                let nodeStatus = [];
                let appStatus = [];
                let procStatus = [];
                let netStatusList = [];
                if (data?.length > 0) {
                    for (let item of data) {
                        if (item.menuName === '节点工作状态信息') {
                            nodeStatus = item.menu;
                            for (let item of nodeStatus) {
                                Reflect.set(item, 'value', item.actualValue);
                                Reflect.deleteProperty(item, 'actualValue');
                                Reflect.set(item, 'name', item.displayValue);
                                Reflect.deleteProperty(item, 'displayValue');
                            }
                        }
                        if (item.menuName === '应用工况状态') {
                            appStatus = item.menu;
                            for (let item of appStatus) {
                                Reflect.set(item, 'value', item.actualValue);
                                Reflect.deleteProperty(item, 'actualValue');
                                Reflect.set(item, 'name', item.displayValue);
                                Reflect.deleteProperty(item, 'displayValue');
                            }
                        }
                        if (item.menuName === '进程工作状态') {
                            procStatus = item.menu;
                            for (let item of procStatus) {
                                Reflect.set(item, 'value', item.actualValue);
                                Reflect.deleteProperty(item, 'actualValue');
                                Reflect.set(item, 'name', item.displayValue);
                                Reflect.deleteProperty(item, 'displayValue');
                            }
                        }
                        if (item.menuName === '网络状态') {
                            netStatusList = item.menu;
                            for (let item of netStatusList) {
                                Reflect.set(item, 'value', item.actualValue);
                                Reflect.deleteProperty(item, 'actualValue');
                                Reflect.set(item, 'name', item.displayValue);
                                Reflect.deleteProperty(item, 'displayValue');
                            }
                        }
                    }
                }
                resolve({ nodeStatus, appStatus, procStatus, netStatusList });
            },
            error(error) {
                resolve([]);
                console.log(error);
            },
            useMock: false,
            type: 'get'
        });
    });
}
function getDataDef(type) {
    const list = {
        node: [
            {
                key: 'updateTime',
                cap: '更新时间',
                sortable: false,
                formatter: function (value) {
                    return jame({
                        type: 'badge',
                        styles: [Styles.badge.timeBadge],
                        cap: value ? jam.formatTime(value, 'yyyy-MM-dd') : '',
                        content: value ? jam.formatTime(value, 'HH:mm:ss') : ''
                    });
                },
                width: '15%'
            },
            {
                class: 'hover',
                key: 'nodeName',
                cap: '节点名称',
                sortable: false,
                width: '20%',
                styles: [
                    Styles.css({
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    })
                ],
                onclick(e) {
                    switchFlag = true;
                    _msgr.pub('tableType', 'app');
                    const span = e.target.tagName === 'SPAN' ? e.target : jam.findChild(e.target, 'span');
                    this.parentNode.model.ref('input').cmpt.value = span.innerText;
                }
            },
            {
                class: 'hover',
                key: 'regionName',
                cap: '地区',
                sortable: false,
                width: '15%'
            },
            {
                type: 'progress',
                key: 'cpuUsed',
                cap: 'CPU使用率',
                width: '10%',
                styles: ['background.stripy', 'color.stateMap(good:lightgreen;passed:orange;failed:red)'],
                valueStates: cpuValueStates
            },
            {
                type: 'progress',
                key: 'memUsed',
                cap: '内存使用率',
                width: '10%',
                styles: ['background.stripy', 'color.stateMap(good:lightgreen;passed:orange;failed:red)'],
                valueStates: cpuValueStates
            },
            {
                key: 'nodeStatus',
                cap: '节点状态',
                width: '10%',
                formatter: function (value) {
                    let cap = value;
                    let status = 0;
                    for (let item of _msgr.get('nodeStatus') || []) {
                        if (+item.value === +value) {
                            cap = item.name;
                            status = +item.type;
                            break;
                        }
                    }
                    if (jam.isNumber(cap)) {
                        cap = '未知';
                    }
                    return jame({
                        type: 'container',
                        states: statusStates,
                        components: [
                            {
                                type: 'badge',
                                styles: [Styles.badge.timeBadge],
                                cap: cap
                            }
                        ],
                        state: status === 1 ? 'online' : 'offline'
                    });
                }
            },
            {
                key: 'netStatus',
                cap: '网络状态',
                width: '10%',
                formatter: function (value) {
                    let cap = value;
                    let status = 0;
                    for (let item of _msgr.get('netStatusList') || []) {
                        if (+item.value === +value) {
                            cap = item.name;
                            status = +item.type;
                            break;
                        }
                    }
                    if (jam.isNumber(cap)) {
                        cap = '未知';
                    }
                    return jame({
                        type: 'container',
                        states: statusStates,
                        components: [
                            {
                                type: 'badge',
                                styles: [Styles.badge.timeBadge],
                                cap: cap
                            }
                        ],
                        state: status === 1 ? 'online' : 'offline'
                    });
                }
            },
            {
                key: 'score',
                cap: '综合评价',
                width: '10%',
                class: 'numberAlign'
            }
        ],
        app: [
            {
                key: 'updateTime',
                cap: '更新时间',
                sortable: false,
                formatter: function (value) {
                    return jame({
                        type: 'badge',
                        styles: [Styles.badge.timeBadge],
                        cap: value ? jam.formatTime(value, 'yyyy-MM-dd') : '',
                        content: value ? jam.formatTime(value, 'HH:mm:ss') : ''
                    });
                },
                width: '20%'
            },
            {
                class: 'hover',
                key: 'nodeName',
                cap: '节点名称',
                sortable: false,
                width: '15%',
                styles: [
                    Styles.css({
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    })
                ],
                onclick(e) {
                    switchFlag = true;
                    _msgr.pub('tableType', 'proc');
                    const span = e.target.tagName === 'SPAN' ? e.target : jam.findChild(e.target, 'span');
                    this.parentNode.model.ref('input').cmpt.value = span.innerText;
                }
            },
            {
                class: 'hover',
                key: 'appName',
                cap: '应用名称',
                sortable: false,
                width: '15%',
                styles: [
                    Styles.css({
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    })
                ],
                onclick(e) {
                    switchFlag = true;
                    _msgr.pub('tableType', 'proc');
                    const span = e.target.tagName === 'SPAN' ? e.target : jam.findChild(e.target, 'span');
                    this.parentNode.model.ref('input').cmpt.value = span.innerText;
                }
            },
            {
                class: 'hover',
                key: 'regionName',
                cap: '地区',
                sortable: false,
                width: '15%'
            },
            {
                type: 'progress',
                key: 'cpuUsed',
                cap: 'CPU使用率',
                width: '10%',
                styles: ['background.stripy', 'color.stateMap(good:lightgreen;passed:orange;failed:red)'],
                valueStates: cpuValueStates
            },
            {
                type: 'progress',
                key: 'memUsed',
                cap: '内存使用率',
                width: '10%',
                styles: ['background.stripy', 'color.stateMap(good:lightgreen;passed:orange;failed:red)'],
                valueStates: cpuValueStates
            },
            {
                key: 'curStatus',
                cap: '应用状态',
                width: '10%',
                formatter: function (value) {
                    let cap = value;
                    let status = 0;
                    for (let item of _msgr.get('appStatus') || []) {
                        if (+item.value === +value) {
                            cap = item.name;
                            status = +item.type;
                            break;
                        }
                    }
                    if (jam.isNumber(cap)) {
                        cap = '未知';
                    }
                    return jame({
                        type: 'container',
                        states: statusStates,
                        components: [
                            {
                                type: 'badge',
                                styles: [Styles.badge.timeBadge],
                                cap: cap
                            }
                        ],
                        state: status === 1 ? 'online' : 'offline'
                    });
                }
            },
            {
                key: 'score',
                cap: '综合评价',
                width: '10%',
                class: 'numberAlign'
            }
        ],
        proc: [
            {
                key: 'updateTime',
                cap: '更新时间',
                sortable: false,
                formatter: function (value) {
                    return jame({
                        type: 'badge',
                        styles: [Styles.badge.timeBadge],
                        cap: value ? jam.formatTime(value, 'yyyy-MM-dd') : '',
                        content: value ? jam.formatTime(value, 'HH:mm:ss') : ''
                    });
                },
                width: '20%'
            },
            {
                class: 'hover',
                key: 'nodeName',
                cap: '节点名称',
                sortable: false,
                width: '15%'
            },
            {
                class: 'hover',
                key: 'appName',
                cap: '应用名称',
                sortable: false,
                width: '15%'
            },
            {
                class: 'hover',
                key: 'procName',
                cap: '进程名称',
                sortable: false,
                width: '15%'
            },
            {
                class: 'hover',
                key: 'regionName',
                cap: '地区',
                sortable: false,
                width: '15%'
            },
            {
                key: 'procStatus',
                cap: '进程状态',
                width: '10%',
                formatter: function (value) {
                    let cap = value;
                    let status = 0;
                    for (let item of _msgr.get('procStatus') || []) {
                        if (+item.value === +value) {
                            cap = item.name;
                            status = +item.type;
                            break;
                        }
                    }
                    if (jam.isNumber(cap)) {
                        cap = '未知';
                    }
                    return jame({
                        type: 'container',
                        states: statusStates,
                        components: [
                            {
                                type: 'badge',
                                styles: [Styles.badge.timeBadge],
                                cap: cap
                            }
                        ],
                        state: status === 1 ? 'online' : 'offline'
                    });
                }
            },
            {
                key: 'score',
                cap: '综合评价',
                width: '10%',
                class: 'numberAlign'
            }
        ]
    };
    return list[type] || [];
}
function getNodeTableData() {
    let param = {
        regionIdList: _msgr.get('regionId')
    };
    lime.log(param);
    ajaxCall('getSysNodeDetail', {
        success(data) {
            for (let item of data) {
                if (item.cpuUsed) {
                    item.cpuUsed = digitalFormatter(item.cpuUsed / 100);
                }
                if (item.memUsed) {
                    item.memUsed = digitalFormatter(item.memUsed / 100);
                }
            }
            cacheTableData = data || [];
            if (switchFlag) {
                setTimeout(() => {
                    // 这里不给500毫秒延迟，input的makeDebounce的onvaluechange会触发
                    switchFlag = false;
                }, 500);
                filterData();
            } else {
                _msgr.pub('tableData', cacheTableData);
            }
        },
        error(error) {
            console.log(error);
        },
        uniqId: jam.genUUID(),
        params: param,
        useMock: false,
        type: 'post'
    });
}
function getAppTableData() {
    let param = {
        regionIdList: _msgr.get('regionId')
    };
    lime.log(param);
    ajaxCall('getSysAppDetail', {
        success(data) {
            for (let item of data) {
                if (item.cpuUsed) {
                    item.cpuUsed = digitalFormatter(item.cpuUsed / 100);
                }
                if (item.memUsed) {
                    item.memUsed = digitalFormatter(item.memUsed / 100);
                }
            }
            cacheTableData = data || [];
            if (switchFlag) {
                setTimeout(() => {
                    switchFlag = false;
                }, 500);
                filterData();
            } else {
                _msgr.pub('tableData', cacheTableData);
            }
        },
        error(error) {
            console.log(error);
        },
        uniqId: jam.genUUID(),
        params: param,
        useMock: false,
        type: 'post'
    });
}
function getProcTableData() {
    let param = {
        regionIdList: _msgr.get('regionId')
    };
    lime.log(param);
    ajaxCall('getSysProcessDetail', {
        success(data) {
            cacheTableData = data || [];
            if (switchFlag) {
                setTimeout(() => {
                    switchFlag = false;
                }, 500);
                filterData();
            } else {
                _msgr.pub('tableData', cacheTableData);
            }
        },
        error(error) {
            console.log(error);
        },
        uniqId: jam.genUUID(),
        params: param,
        useMock: false,
        type: 'post'
    });
}
function sortData(indexType) {
    let data = jam.clone(cacheData);
    data.sort((a, b) => {
        if (sort === 'asc') {
            return a[map[indexType]].rate - b[map[indexType]].rate;
        } else {
            return b[map[indexType]].rate - a[map[indexType]].rate;
        }
    });
    _model.vars.cardList = data;
}
function buttonGroupClick(e) {
    const value = this.attributes.value.nodeValue;
    const indexType = _msgr.get('indexType');
    const btnList = jam.findChildren(this.parentNode, 'jam-button');
    if (value === indexType) {
        if (sort === 'asc') {
            this.icon = 'arrow-down';
            sort = 'desc';
        } else {
            this.icon = 'arrow-up';
            sort = 'asc';
        }
    } else {
        for (let btn of btnList) {
            if (btn.attributes.value.nodeValue !== value) {
                btn.icon = '';
            } else {
                btn.icon = 'arrow-down';
                sort = 'desc';
            }
        }
    }
    sortData(value);
}
