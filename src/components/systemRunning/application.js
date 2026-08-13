import { ajaxCall } from '../../common.js';
import { statusStates, filterName, filterRegion, filterStatus, getStsRunMenu, cpuValueStates } from './node';
import { getRegionList, digitalFormatter } from '../../utils/ajaxCache.js';
const window = (params) => {
    let _model,
        _msgr,
        cacheData,
        init = true;
    function getTableData() {
        let param = {
            regionIdList: [_msgr.get('regionId')],
            nodeName: params.nodeName
        };
        if (params.abnormal) {
            param.abnormal = true;
        }
        ajaxCall('getSysAppDetail', {
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
            params: param,
            useMock: false,
            type: 'post'
        });
    }
    function filterData() {
        let rt = jam.cloneDeep(cacheData);
        rt = filterName(rt, _msgr.get('inputText')?.trim());
        rt = filterStatus(rt, _msgr.get('status'), 'curStatus');
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
                    params.nodeName
                        ? null
                        : {
                              type: 'select',
                              valueKey: 'regionId',
                              valueWatcher: 'regionId',
                              placeholder: '-请选择区域-',
                              dataWatcher: 'regionList'
                          },
                    {
                        ref: 'status',
                        type: 'select',
                        valueKey: 'status',
                        placeholder: '-请选择应用状态-',
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
            let { typeMenu } = await getStsRunMenu('应用工况状态');
            _msgr.pub('regionList', regionList || []);
            _msgr.pub('typeMenu', typeMenu || []);
            getTableData();
        }
    };
};

export default window;
