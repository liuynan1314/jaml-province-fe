import { ajaxCall } from '../../common.js';
import { digitalFormatter, getRegionList } from '../../utils/ajaxCache.js';
export const statusStates = {
    offline: {
        styles: [
            Styles.badge.cap.css({
                background: 'hsl(0, 45%, 30%)'
            })
        ]
    },
    online: {
        styles: [
            Styles.badge.cap.css({
                background: 'hsl(108, 35%, 30%)'
            })
        ]
    }
};
export const valueStates = {
    good: 'value>=0.98',
    passed: 'value>=0.9',
    failed: 'value<0.9'
};
export const cpuValueStates = {
    good: `value<0.6`,
    passed: `value<0.8`,
    failed: `value>=0.8`
};
export function filterName(rt, text) {
    if (text !== '' && text !== undefined) {
        rt = rt.filter((item) => item?.nodeName?.includes(text) || item?.appName?.includes(text) || item?.procName?.includes(text));
    }
    return rt;
}
export function filterRegion(rt, id) {
    if (id) {
        rt = rt.filter((item) => item.regionId === id);
    }
    return rt;
}
export function filterStatus(rt, id, key) {
    if (id) {
        rt = rt.filter((item) => +item?.[key] === +id);
    }
    return rt;
}
export function getStsRunMenu(name) {
    return new Promise((resolve, reject) => {
        ajaxCall('getStsRunMenu', {
            success(data) {
                let rt = [];
                let netStatusList = [];
                if (data?.length > 0) {
                    for (let item of data) {
                        if (item.menuName === name) {
                            rt = item.menu;
                            for (let item of rt) {
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
                resolve({ typeMenu: rt, netStatusList });
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
const window = (params) => {
    let _model,
        _msgr,
        cacheData,
        init = true;
    function getTableData() {
        let params = {
            regionIdList: [_msgr.get('regionId')]
        };
        ajaxCall('getSysNodeDetail', {
            success(data) {
                init = false;
                for (let item of data) {
                    if (item.cpuUsed) {
                        item.cpuUsed = digitalFormatter(item.cpuUsed / 100);
                    }
                    if (item.memUsed) {
                        item.memUsed = digitalFormatter(item.memUsed / 100);
                    }
                }
                cacheData = data || [];
                _msgr.pub('tableData', cacheData);
            },
            error(error) {
                console.log(error);
            },
            params,
            useMock: false,
            type: 'post'
        });
    }
    function filterData() {
        let rt = jam.cloneDeep(cacheData);
        rt = filterName(rt, _msgr.get('inputText')?.trim());
        rt = filterStatus(rt, _msgr.get('status'), 'nodeStatus');
        // rt = filterRegion(rt, _msgr.get('regionId'));
        _msgr.pub('tableData', rt);
    }
    return {
        type: 'container',
        styles: [
            // Styles.color.accent('hsl(201, 64.47%, 29.8%)'),
            Styles.size.fullsize,
            Styles.css({
                '--blue-color': 'hsl(196, 100%, 50%)',
                '--font-gray-color': 'hsl(0, 0%, 70%)',
                '--orange-color': 'hsl(40.2, 100%, 50%)',
                display: 'flex',
                flexDirection: 'column',
                fontSize: '1.1rem',
                minHeight: '0'
            })
        ],
        components: [
            {
                type: 'container',
                class: 'top',
                styles: [
                    Styles.css({
                        display: 'flex',
                        width: '100%',
                        gap: '0.1rem',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        paddingBottom: '0.5rem',
                        flexWrap: 'wrap'
                    })
                ],
                inputStyles: [Styles.input.regularInput],
                buttonStyles: [Styles.button.regularButton],
                selectStyles: [Styles.select.regularSelect],
                components: [
                    {
                        type: 'select',
                        valueKey: 'regionId',
                        placeholder: '-请选择区域-',
                        dataWatcher: 'regionList'
                    },
                    {
                        ref: 'status',
                        type: 'select',
                        valueKey: 'status',
                        placeholder: '-请选择节点状态-',
                        dataWatcher: 'typeMenu'
                    },
                    {
                        ref: 'text',
                        type: 'input',
                        valueKey: 'inputText',
                        placeholder: '-请搜索名称-',
                        onvaluechange: jam.makeDebounce(function (value) {
                            filterData();
                        }, 600)
                    }
                ]
            },
            {
                type: 'container',
                class: 'body',
                styles: [
                    Styles.css({
                        minHeight: '0%',
                        width: '100%',
                        flexGrow: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignContent: 'flex-start'
                    })
                ],
                components: [
                    {
                        type: 'container',
                        styles: [
                            Styles.css({
                                display: 'block',
                                height: '100%',
                                width: '100%'
                            })
                        ],
                        components: [
                            {
                                type: 'container',
                                styles: [
                                    Styles.css({
                                        display: 'block',
                                        height: '100%',
                                        width: '100%'
                                    })
                                ],
                                components: [
                                    {
                                        type: 'table',
                                        styles: [
                                            Styles.hover.toShowAll({ selector: '.hover' }),
                                            Styles.tableStylesFixedRowGeight,
                                            Styles.numberAlign,
                                            Styles.css({
                                                width: '100%',
                                                height: '100%'
                                            })
                                        ],
                                        dataDef: [
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
                                                width: '20%'
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
                                                    for (let item of _msgr.get('typeMenu')) {
                                                        if (+item.value === +value) {
                                                            cap = item.name;
                                                            status = +item.type;
                                                            break;
                                                        }
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
                                                    for (let item of _msgr.get('netStatusList')) {
                                                        if (+item.value === +value) {
                                                            cap = item.name;
                                                            status = +item.type;
                                                            break;
                                                        }
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
                                        dataWatcher: 'tableData'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        watchers: [
            {
                keys: ['status'],
                callback: function () {
                    if (!init) {
                        filterData();
                    }
                }
            },
            {
                keys: ['regionId'],
                callback: function () {
                    if (!init) {
                        this.model.ref('status').cmpt.value = null;
                        this.model.ref('text').cmpt.value = '';
                        getTableData();
                    }
                }
            }
        ],
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
        },
        onafterrender: async function () {
            _msgr.pub('regionId', params.regionId);
            let regionList = await getRegionList();
            if (regionList) {
                regionList.unshift({
                    value: 0,
                    name: '省级'
                });
            }
            let { typeMenu, netStatusList } = await getStsRunMenu('节点工作状态信息');
            _msgr.pub('regionList', regionList || []);
            _msgr.pub('typeMenu', typeMenu || []);
            _msgr.pub('netStatusList', netStatusList || []);
            getTableData();
        }
    };
};

export default window;
