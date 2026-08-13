let _model,
    _msgr,
    setDateFlag = 0,
    cacheData = [],
    sort = 'desc';
const map = {
    6: 'channel',
    3: 'accident',
    14: 'yxYcMatch',
    15: 'dataCompleteness',
    16: 'dataValid'
};
import { ajaxCall } from '../common.js';
import { getRegionList, digitalFormatter } from '../utils/ajaxCache.js';
import '../components/dataQuality/dataQualityCard.js';
export default {
    type: 'container',
    styles: [
        Styles.size.fullsize,
        Styles.css({
            display: 'flex',
            flexDirection: 'column',
            fontSize: '1.1rem',
            overflowY: 'auto'
            // backgroundImage: 'url(../../common/img/dataQualityManagement/bg_right.png)',
            // backgroundSize: '100% 100%',
            // backgroundRepeat: 'no-repeat',
            // padding: '1rem 0.5rem'
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
                    width: '100%',
                    justifyContent: 'space-between'
                })
            ],
            containerStyles: [
                Styles.css({
                    display: 'flex',
                    height: 'initial',
                    gap: '0.1rem',
                    alignItems: 'flex-start'
                })
            ],
            components: [
                {
                    type: 'container',
                    class: 'top-left',
                    styles: [
                        Styles.css({
                            width: '38%',
                            alignItems: 'flex-start'
                        })
                    ],
                    buttongroupStyles: [Styles.buttonGroupStylesWithBgCap],
                    components: [
                        {
                            type: 'buttongroup-checkbox',
                            cap: '区域：',
                            valueKey: 'regionId',
                            icon: 'earth-asia',
                            dataWatcher: 'regionList',
                            styles: [
                                Styles.css({
                                    padding: '0 0.3rem'
                                }),
                                Styles.buttongroup.labelslot.css({
                                    alignSelf: 'flex-start',
                                    fontSize: '1rem',
                                    margin: '0.5rem 0.25rem'
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
                            width: '45%',
                            flexWrap: 'wrap',
                            // paddingTop: '0.125rem',
                            flexDirection: 'column'
                        })
                    ],
                    components: [
                        {
                            type: 'container',
                            datepickerStyles: [Styles.datepicker.regularDatepicker],
                            components: [
                                {
                                    type: 'label',
                                    cap: '时间范围：'
                                },
                                {
                                    type: 'datepicker',
                                    defaultValue: Date.now(),
                                    valueKey: 'beginTime',
                                    styles: [
                                        Styles.capStyle,
                                        Styles.datepicker.cap.css({
                                            fontSize: '1rem'
                                        }),
                                        Styles.connectLine,
                                        Styles.css({
                                            padding: '0 0.25rem'
                                        })
                                    ],
                                    onvaluechange() {
                                        if (setDateFlag === 0) {
                                            _msgr.pub('date', null);
                                        }
                                    }
                                },
                                {
                                    type: 'datepicker',
                                    defaultValue: Date.now(),
                                    valueKey: 'endTime',
                                    styles: [
                                        Styles.css({
                                            padding: '0 0.25rem'
                                        })
                                    ],
                                    onvaluechange() {
                                        if (setDateFlag === 0) {
                                            _msgr.pub('date', null);
                                        }
                                    }
                                },
                                {
                                    type: 'buttongroup-radio',
                                    valueKey: 'date',
                                    valueWatcher: 'date',
                                    styles: [
                                        Styles.buttonGroupStyles,
                                        Styles.buttongroup.button.css({
                                            margin: '0'
                                        }),
                                        Styles.css({
                                            padding: '0 0.25rem'
                                        })
                                    ],
                                    data: [
                                        {
                                            value: '0',
                                            label: '今天'
                                        },
                                        {
                                            value: '-3',
                                            label: '近3天'
                                        },
                                        {
                                            value: '-7',
                                            label: '近7天'
                                        }
                                    ],
                                    value: '0',
                                    onvaluechange(value) {
                                        if (value !== null) {
                                            setDateFlag = 1;
                                            setTimeout(() => {
                                                setDateFlag = 0;
                                                getData();
                                                getTableData();
                                            }, 100);
                                            setDate(+value);
                                        }
                                    }
                                },
                                {
                                    type: 'button',
                                    cap: '查询',
                                    icon: 'search',
                                    class: 'jam-cta',
                                    styles: [
                                        Styles.searchBtnsStyles,
                                        Styles.css({
                                            height: '2rem'
                                        })
                                    ],
                                    onclick() {
                                        getData();
                                        getTableData();
                                    }
                                }
                            ]
                        },
                        {
                            type: 'container',
                            styles: [
                                Styles.css({
                                    display: 'flex',
                                    alignItems: 'center'
                                })
                            ],
                            components: [
                                {
                                    type: 'label',
                                    cap: '排序指标：'
                                },
                                {
                                    ref: 'buttongroup',
                                    type: 'buttongroup-radio',
                                    valueKey: 'indexType',
                                    data: [
                                        {
                                            value: '6',
                                            name: '通道在线情况',
                                            onclick: buttonGroupClick
                                        },
                                        {
                                            value: '3',
                                            name: '事故信号正确性',
                                            onclick: buttonGroupClick
                                        },
                                        {
                                            value: '14',
                                            name: '遥测遥信匹配度',
                                            onclick: buttonGroupClick
                                        },
                                        {
                                            value: '15',
                                            name: '数据完整度',
                                            onclick: buttonGroupClick
                                        },
                                        {
                                            value: '16',
                                            name: '采集数据质量',
                                            onclick: buttonGroupClick
                                        }
                                    ],
                                    styles: [Styles.icon.duotone, Styles.buttonGroupStyles]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type: 'container',
            class: 'middle',
            components: [
                {
                    type: 'dataQualityCard',
                    buildFor: '(item) in cardList',
                    styles: [
                        Styles.css({
                            flexShrink: 0
                        })
                    ]
                }
            ],
            styles: [
                // Styles.interact.scrollX,
                Styles.css({
                    height: 'initial',
                    width: '100%',
                    display: 'flex',
                    alignContent: 'flex-start',
                    overflowX: 'auto',
                    margin: '0.5rem 0',
                    minHeight: '20.21rem'
                })
            ]
        },
        {
            type: 'container',
            class: 'table',
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
                            key: 'staTime',
                            cap: '更新时间',
                            formatter: function (value) {
                                return jame({
                                    type: 'badge',
                                    styles: [Styles.badge.timeBadge],
                                    cap: value ? jam.formatTime(value, 'yyyy-MM-dd') : ''
                                });
                            },
                            width: '15%'
                        },
                        {
                            class: 'hover',
                            key: 'regionName',
                            cap: '地区',
                            width: '10%'
                        },
                        {
                            key: 'channelRate',
                            cap: '通道在线情况',
                            width: '20%',
                            type: 'progress',
                            formatter(value) {
                                const row = this.jamtd.rowIdx;
                                const rowData = _msgr.get('tableData')[row] || {};
                                return rowData.channel || '';
                            }
                        },
                        {
                            key: 'accidentRate',
                            cap: '事故信号正确性',
                            width: '20%',
                            type: 'progress',
                            formatter(value) {
                                const row = this.jamtd.rowIdx;
                                const rowData = _msgr.get('tableData')[row] || {};
                                return rowData.accident || '';
                            }
                        },
                        {
                            key: 'yxYcMatchRate',
                            cap: '遥测遥信匹配度',
                            width: '20%',
                            type: 'progress',
                            formatter(value) {
                                const row = this.jamtd.rowIdx;
                                const rowData = _msgr.get('tableData')[row] || {};
                                return rowData.yxYcMatch || '';
                            }
                        },
                        {
                            key: 'dataCompletenessRate',
                            cap: '数据完整度',
                            width: '20%',
                            type: 'progress',
                            formatter(value) {
                                const row = this.jamtd.rowIdx;
                                const rowData = _msgr.get('tableData')[row] || {};
                                return rowData.dataCompleteness || '';
                            }
                        },
                        {
                            key: 'dataValidRate',
                            cap: '采集数据质量',
                            width: '20%',
                            type: 'progress',
                            formatter(value) {
                                const row = this.jamtd.rowIdx;
                                const rowData = _msgr.get('tableData')[row] || {};
                                return rowData.dataValid || '';
                            }
                        }
                    ],
                    dataWatcher: 'tableData'
                }
            ],
            styles: [
                Styles.css({
                    height: 0,
                    width: '100%',
                    display: 'flex',
                    flexGrow: 1
                })
            ]
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: async function () {
        setDate(0);
        _msgr.pub('endTime', jam.formatTime(Date.now(), 'yyyy-MM-dd'));
        let regionList = await getRegionList();
        _msgr.pub('regionList', regionList || []);

        let substationAccessConfitionParams = mango.get('substationAccessConfitionParams');
        if (substationAccessConfitionParams && substationAccessConfitionParams.name) {
            let regionId = regionList?.filter((item) => item.name == substationAccessConfitionParams.name)?.[0].value;
            _msgr.pub('regionId', [regionId]);
        } else {
            _msgr.pub(
                'regionId',
                regionList.map((item) => item.value)
            );
        }
        getData();
        getTableData();
    },
    watchers: [
        {
            key: 'regionId',
            callback() {
                getData();
                getTableData();
            }
        }
    ]
};
function getData() {
    let params = {
        regionIdList: _msgr.get('regionId'),
        indexType: _msgr.get('indexType'),
        beginTime: _msgr.get('beginTime') + ' 00:00:00',
        endTime: _msgr.get('endTime') + ' 23:59:59'
    };
    ajaxCall('getMonitorIndexStatNew', {
        success(data) {
            cacheData = data;
            // sortData(_msgr.get('indexType'));
            _model.vars.cardList = data;
        },
        error(error) {
            console.log(error);
        },
        uniqId: jam.genUUID(),
        params,
        useMock: false,
        type: 'post'
    });
}
function getTableData() {
    let params = {
        regionIdList: _msgr.get('regionId'),
        beginTime: _msgr.get('beginTime') + ' 00:00:00',
        endTime: _msgr.get('endTime') + ' 23:59:59'
    };
    ajaxCall('getMonitorIndexStatList', {
        success(data) {
            _msgr.pub('tableData', data || []);
        },
        error(error) {
            console.log(error);
        },
        uniqId: jam.genUUID(),
        params,
        useMock: false,
        type: 'post'
    });
}
function setDate(value = 0) {
    _msgr.pub('beginTime', jam.formatTime(Date.now() + value * 86400000, 'yyyy-MM-dd'));
    _msgr.pub('endTime', jam.formatTime(Date.now(), 'yyyy-MM-dd'));
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
