import { ajaxCall } from '../../common.js';
import { valueStates } from '../systemRunning/node.js';
import { getStList, getRegionList, getBvList } from '../../utils/ajaxCache.js';
import { getSubstationList } from '../../utils/commonList.js';
const window = (params) => {
    let _model,
        _msgr,
        pageIndex = 1,
        pageSize = 20;
    function getTableData() {
        let param = {
            regionId: _msgr.get('regionId'),
            stId: _msgr.get('stId'),
            bvId: _msgr.get('bvId'),
            beginTime: _msgr.get('beginTime') + ' 00:00:00',
            endTime: _msgr.get('endTime') + ' 23:59:59',
            pageIndex,
            pageSize
        };
        if (params.subIndex === '6') {
            getData('getChannelStatics', param);
        } else if (params.subIndex === '3') {
            getData('getAccidentStatics', param);
        } else if (params.subIndex === '15') {
            getData('getDataCompletenessStatics', param);
        } else if (params.subIndex === '16') {
            getData('getDataValidStatics', param);
        } else if (params.subIndex === '14') {
            getData('getYcYxMatchStatics', param);
        }
    }
    function getData(url, param) {
        ajaxCall(url, {
            success(data) {
                _model.vars.total1 = data?.pojoTotalCount || 0;
                _msgr.pub('tableData', data?.list || []);
            },
            error(error) {
                console.log(error);
            },
            params: param,
            useMock: false,
            type: 'post'
        });
        // ajaxCall(
        //     'getChannelStatics',
        //     url.url,
        //     (data) => {
        //         _msgr.pub('tOtAlNuMbEr', data?.pojoTotalCount || 0);
        //         _msgr.pub('tableData', data?.list || []);
        //     },
        //     (error) => {
        //         console.log(error);
        //     },
        //     {
        //         type: 'post',
        //         mockData: url.mockData,
        //         data: JSON.stringify(param)
        //     }
        // );
    }
    function initDataDef() {
        let rt = [
            {
                key: 'devId',
                show: false
            },
            {
                key: 'staticsTime',
                cap: '时间',
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
                key: 'regionName',
                cap: '地区',
                sortable: false,
                width: '10%'
            },
            {
                class: 'hover',
                key: 'stName',
                cap: '厂站',
                sortable: false,
                width: '15%'
            },
            {
                class: 'hover',
                key: 'bvName',
                cap: '电压等级',
                sortable: false,
                width: '10%'
            },
            {
                class: 'hover',
                key: 'devName',
                cap: '设备名称',
                sortable: false,
                width: '25%'
            }
        ];
        if (params.subIndex === '6') {
            rt = rt.concat([
                {
                    key: 'tlen',
                    show: false
                },
                {
                    key: 'qlen',
                    cap: '退出时长/总时长',
                    formatter: function (value) {
                        // const row = this.jamtd.rowIdx; // rowIdx是原始数据的索引，row是排序后索引
                        // const rowData = _msgr.get('tableData')[row] || {};
                        return jame({
                            type: 'badge',
                            styles: [Styles.badge.timeBadge, Styles.badge.successErrorBadge],
                            cap: value,
                            content: this.col(6)
                        });
                    },
                    width: '15%'
                },
                {
                    type: 'progress',
                    key: 'channelOnlineRate',
                    cap: '通道在线情况',
                    width: '10%',
                    styles: ['background.stripy', 'color.stateMap(good:lightgreen;passed:orange;failed:red)'],
                    valueStates
                }
            ]);
        } else if (params.subIndex === '3') {
            rt = rt.concat([
                {
                    key: 'facAccidentTotal',
                    show: false
                },
                {
                    key: 'facAccidentNoMatch',
                    cap: '未匹配数/总数',
                    formatter: function (value) {
                        return jame({
                            type: 'badge',
                            styles: [Styles.badge.timeBadge, Styles.badge.successErrorBadge],
                            cap: value,
                            content: this.col(6)
                        });
                    },
                    width: '15%'
                },
                {
                    type: 'progress',
                    key: 'accidentNormalRate',
                    cap: '事故总正确率',
                    width: '10%',
                    styles: ['background.stripy', 'color.stateMap(good:lightgreen;passed:orange;failed:red)'],
                    valueStates
                }
            ]);
        } else if (params.subIndex === '15') {
            rt = rt.concat([
                {
                    key: 'ycyxTotalNum',
                    show: false
                },
                {
                    key: 'lostYcyxNum',
                    cap: '未采集数/总数',
                    formatter: function (value) {
                        return jame({
                            type: 'badge',
                            styles: [Styles.badge.timeBadge, Styles.badge.successErrorBadge],
                            cap: value,
                            content: this.col(6)
                        });
                    },
                    width: '15%'
                },
                {
                    type: 'progress',
                    key: 'dataCompleteness',
                    cap: '数据完整率',
                    width: '10%',
                    styles: ['background.stripy', 'color.stateMap(good:lightgreen;passed:orange;failed:red)'],
                    valueStates
                }
            ]);
        } else if (params.subIndex === '16') {
            rt = rt.concat([
                {
                    key: 'dataTotalNum',
                    show: false
                },
                {
                    key: 'invalidNum',
                    cap: '异常数据/总数',
                    formatter: function (value) {
                        return jame({
                            type: 'badge',
                            styles: [Styles.badge.timeBadge, Styles.badge.successErrorBadge],
                            cap: value,
                            content: this.col(6)
                        });
                    },
                    width: '15%'
                },
                {
                    type: 'progress',
                    key: 'dataValidRate',
                    cap: '数据合格率',
                    width: '10%',
                    styles: ['background.stripy', 'color.stateMap(good:lightgreen;passed:orange;failed:red)'],
                    valueStates
                }
            ]);
        } else if (params.subIndex === '14') {
            rt = rt.concat([
                {
                    key: 'ycyxTotalNum',
                    show: false
                },
                {
                    key: 'ycyxNotMatchNum',
                    cap: '不匹配数/总数',
                    formatter: function (value) {
                        return jame({
                            type: 'badge',
                            styles: [Styles.badge.timeBadge, Styles.badge.successErrorBadge],
                            cap: value,
                            content: this.col(6)
                        });
                    },
                    width: '15%'
                },
                {
                    type: 'progress',
                    key: 'ycyxMatchRate',
                    cap: '遥测遥信匹配度',
                    width: '10%',
                    styles: ['background.stripy', 'color.stateMap(good:lightgreen;passed:orange;failed:red)'],
                    valueStates
                }
            ]);
        }
        rt = rt.concat([
            {
                key: '',
                cap: '告警',
                sortable: false,
                formatter: function (value) {
                    const row = this.jamtd.rowIdx;
                    const rowData = _msgr.get('tableData')[row] || {};
                    return jame({
                        type: 'button',
                        styles: [
                            Styles.css({
                                height: '1.8rem',
                                backgroundColor: 'var(--jam-color-primary-default)'
                            })
                        ],
                        cap: '详情',
                        onclick(e) {
                            let target;
                            if (e.target.classList.contains('jam-td')) {
                                target = e.target;
                            } else {
                                target = jam.findParent(e.target, '.jam-td');
                            }
                            if (target && target.jamtd?.col === 8) {
                                const row = target.jamtd.rowIdx;
                                let obj = _msgr.get('tableData')[row];
                                getAlarmDetailsByDevId(target, obj);
                            }
                        }
                    });
                },
                width: '5%'
            }
        ]);
        return rt;
    }
    function getAlarmDetailsByDevId(target, obj) {
        let param = {
            indexType: params.subIndex,
            devId: obj.devId,
            beginTime: obj.staticsTime,
            endTime: obj.staticsTime
        };
        // const url = urlConfig.getAlarmDetailsByDevId;
        // ajaxCall(
        //     'getAlarmDetailsByDevId',
        //     url.url,
        //     (data) => {
        //         if (data?.length > 0) {
        //             popTable(target, data);
        //         } else {
        //             jam.message('未查询到告警数据！');
        //         }
        //     },
        //     (error) => {
        //         console.log(error);
        //     },
        //     {
        //         type: 'post',
        //         mockData: url.mockData,
        //         data: JSON.stringify(param)
        //     }
        // );
        ajaxCall('getAlarmDetailsByDevId', {
            success(data) {
                if (data?.length > 0) {
                    popTable(target, data);
                } else {
                    if (jam.notify) {
                        jam.notify({ text: '未查询到告警数据！', content: '未查询到告警数据！' });
                    } else if (jam.message) {
                        jam.message('未查询到告警数据！');
                    }
                }
            },
            error(error) {
                console.log(error);
            },
            params: param,
            useMock: false,
            type: 'post'
        });
    }
    function popTable(target, data) {
        jam.popup(
            target,
            {
                type: 'container',
                styles: [
                    Styles.css({
                        width: '55rem',
                        maxWidth: 'none',
                        height: '20rem',
                        overflow: 'auto',
                        display: 'block',
                        padding: '0 xs'
                    })
                ],
                components: [
                    {
                        type: 'table',
                        styles: [
                            Styles.hover.toShowAll({ selector: '.hover' }),
                            Styles.table.fixedrowheight({
                                height: '2.5rem'
                            }),
                            Styles.tableStyles,
                            Styles.table.ellipsisTable,
                            Styles.css({
                                width: '53.5rem',
                                height: '18.5rem',
                                padding: 0,
                                margin: 's auto'
                            }),
                            Styles.table.thslot.css({
                                position: 'sticky',
                                zIndex: 1,
                                top: 0
                            })
                        ],
                        dataDef: [
                            {
                                key: 'time',
                                cap: '时间',
                                sortable: false,
                                formatter: function (value) {
                                    return jame({
                                        type: 'badge',
                                        styles: [Styles.badge.timeBadge],
                                        cap: value ? jam.formatTime(value, 'yyyy-MM-dd') : '',
                                        content: value ? jam.formatTime(value, 'HH:mm:ss') : ''
                                    });
                                },
                                width: '25%'
                            },
                            {
                                cap: '告警内容',
                                key: 'content',
                                sortable: false,
                                width: '75%',
                                class: 'hover',
                                align: 'left'
                            }
                        ],
                        data
                    }
                ]
            },
            {
                position: 'right'
            }
        );
    }
    return {
        type: 'card',
        icon: '',
        cap: params.name || '',
        styles: [
            Styles.card.floating({
                width: '85vw',
                height: '75vh'
            })
        ],
        components: [
            {
                type: 'container',
                styles: [
                    Styles.size.fullsize,
                    Styles.css({
                        '--blue-color': 'hsl(196, 100%, 50%)',
                        '--font-gray-color': 'hsl(0, 0%, 70%)',
                        '--orange-color': 'hsl(40.2, 100%, 50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: 'm',
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
                                gap: 'xs',
                                alignItems: 'center',
                                paddingBottom: 's',
                                flexWrap: 'wrap'
                            })
                        ],
                        datepickerStyles: [Styles.datepicker.regularDatepicker],
                        selectStyles: [Styles.select.regularSelect],
                        components: [
                            {
                                type: 'datepicker',
                                valueWatcher: 'beginTime',
                                valueKey: 'beginTime',
                                styles: [
                                    Styles.connectLine,
                                    Styles.css({
                                        paddingLeft: 0
                                    })
                                ]
                            },
                            {
                                type: 'datepicker',
                                valueWatcher: 'endTime',
                                valueKey: 'endTime'
                            },
                            {
                                type: 'select',
                                valueKey: 'regionId',
                                valueWatcher: 'regionId',
                                placeholder: '-请选择区域-',
                                dataWatcher: 'regionList'
                            },
                            // {
                            //     type: 'select',
                            //     valueKey: 'stId',
                            //     placeholder: '-请选择厂站-',
                            //     dataWatcher: 'stList'
                            // },
                            {
                                type: 'filterSelect',
                                styles: [Styles.input.regularInput],
                                valueKey: 'stId',
                                props: { placeholder: '-请选择厂站-', data: '{{stList}}', search: '{{name}}', select: '{{stId}}' },
                                watchers: [
                                    {
                                        key: 'name',
                                        callback: function (val) {
                                            getSubstationList({ _model, devName: val });
                                        },
                                        debounce: 600
                                    }
                                ]
                            },
                            {
                                type: 'select',
                                valueKey: 'bvId',
                                placeholder: '-请选择电压等级-',
                                dataWatcher: 'bvList'
                            },
                            {
                                type: 'button',
                                cap: '查询',
                                icon: 'search',
                                class: 'jam-cta',
                                styles: [Styles.searchBtnsStyles],
                                onclick() {
                                    _model.vars.pageNo1 = 1;
                                    pageIndex = 1;
                                    getTableData();
                                }
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
                                type: 'table',
                                styles: [
                                    Styles.hover.toShowAll({ selector: '.hover' }),
                                    Styles.table.fixedrowheight({
                                        height: '2.5rem'
                                    }),
                                    Styles.tableStyles,
                                    Styles.css({
                                        width: '100%',
                                        height: 'calc(100% - 2.5rem)'
                                    })
                                ],
                                dataDef: initDataDef(),
                                dataWatcher: 'tableData'
                            },
                            {
                                ref: 'pagination',
                                type: 'pagination',
                                styles: [
                                    Styles.css({
                                        width: '100%',
                                        marginTop: 'm'
                                    })
                                ],
                                props: {
                                    pageNo: '{{pageNo1}}',
                                    pageSize: '{{pageSize1}}',
                                    total: '{{total1}}',
                                    hide: { total: false, pageSize: false, switch: false }
                                },
                                watchers: [
                                    {
                                        keys: ['pageSize1', 'pageNo1'],
                                        callback: function (pageSize1, pageNo1) {
                                            if (pageIndex === pageNo1 && pageSize === pageSize1) {
                                                return;
                                            }
                                            pageIndex = pageNo1;
                                            pageSize = pageSize1;
                                            getTableData();
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
                    // _msgr.pub('regionId', params.regionId);
                    // _msgr.pub('beginTime', params.beginTime);
                    // _msgr.pub('endTime', params.endTime);
                },
                onafterrender: async function () {
                    _msgr.pub('regionId', params.regionId);
                    _msgr.pub('beginTime', params.beginTime);
                    _msgr.pub('endTime', params.endTime);
                    // getStList().then((stList) => {
                    //     _msgr.pub('stList', stList || []);
                    // });
                    getSubstationList({ _model });
                    getRegionList().then((regionList) => {
                        _msgr.pub('regionList', regionList || []);
                    });
                    getBvList().then((bvList) => {
                        _msgr.pub('bvList', bvList || []);
                    });
                    getTableData();
                },
                vars: {
                    // pageNo1: pageIndex,
                    // pageSize1: pageSize,
                    // total1: 0
                }
            }
        ]
    };
};

export default window;
