import { ajaxCall, getDetailConf, findCol, formatterJameTime, exportExcel } from '../common.js';
import { getSubAreaListData, getBvList, getSubstationList } from '../utils/commonList.js';
import newModal from './../components/newModal.js';
import { secondaryOptions } from '../components/chartConfig/secondaryOptions.js';
import secondaryVoltageLineWindow from './../components/modal/secondaryVoltageLineWindow.js';
import secondaryVoltageTableWindow from './../components/modal/secondaryVoltageTableWindow.js';
let _model, _msgr, eChartsIns;
let popupHideDelay,
    popupController = false;
const pageNum = 1; //1、CVT 2、电容

// 映射关系
const voltageMap = {
    va: 'A相电压',
    vb: 'B相电压',
    vc: 'C相电压',
    vab: 'AB线电压',
    vac: 'AC线电压',
    vbc: 'BC线电压'
};
export default {
    type: 'wrapper',
    styles: [
        'css(--gap:var(--jam-space-m))',
        'padding(var(--gap))',
        'flex(direction: column)',
        'with.elevation',
        'padding(bottom:0)',
        'layout(overflow:hidden auto)',
        'size.fullsize',
        Styles.stylesheet({
            '.text-value': {
                justifyContent: 'flex-end',
                fontSize: 's',
                fontWeight: 'bold',
                fontFamily: 'DINPro',
                color: 'hsl(195.3, 100%, 56.1%)'
            },
            '.text-unit': {
                justifyContent: 'flex-start'
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            // header
            styles: ['size(minHeight:14rem)'],
            components: [
                {
                    type: 'wrapper',
                    // form
                    styles: ['flex(flex:1;direction:column;)'],
                    components: [
                        {
                            type: 'buttongroup-radio',
                            icon: 'earth-asia',
                            cap: '区域选择',
                            styles: [Styles.buttonGroupStylesWithBgCap],
                            value: '{{areaId}}',
                            data: '{{subAreaList}}'
                        },
                        {
                            type: 'buttongroup-radio',
                            cap: '电压等级',
                            icon: 'bolt',
                            styles: [Styles.buttonGroupStylesWithBgCap],
                            value: '{{bvId}}',
                            data: '{{bvList}}',
                            onvaluechange: function (value) {
                                getSubstationList({ _model, bvId: value });
                            }
                        },
                        {
                            type: 'wrapper',
                            components: [
                                {
                                    type: 'buttongroup-radio',
                                    cap: '告警状态',
                                    class: 'button-group-style',
                                    styles: ['css(width:50%;)', 'layout.flex(alignSelf:flex-start;)', Styles.buttonGroupStylesWithBgCap],
                                    value: '{{status}}',
                                    data: [
                                        { name: '全部', value: null },
                                        { name: '正常', value: 1 },
                                        { name: 'A相告警', value: 2 },
                                        { name: 'B相告警', value: 3 },
                                        { name: 'C相告警', value: 4 }
                                    ]
                                },
                                {
                                    type: 'buttongroup-radio',
                                    cap: '线路类型',
                                    class: 'button-group-style',
                                    showIf: '{{pageNum}} == "1"',
                                    styles: ['css(width:50%;)', 'layout.flex(alignSelf:flex-start;)', Styles.buttonGroupStylesWithBgCap],
                                    value: '{{type}}',
                                    data: [
                                        { name: '全部', value: null },
                                        { name: '母线', value: 410 },
                                        { name: '线路', value: 415 }
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            styles: [
                                'layout.flex(alignItems:center;justifyContent:flex-start)',
                                'margin(top:var(--gap))',
                                Styles.stylesheet({
                                    ':scope': {},
                                    '.ml-_625rem': {
                                        marginLeft: 'm'
                                    }
                                })
                            ],
                            childStyles: ['datepicker.agent.border(radius:s)'],
                            datepickerStyles: ['padding(top:0;bottom:0)', 'datepicker.labelslot.margin(0)'],
                            buttonStyles: [Styles.searchBtnsStyles],
                            components: [
                                {
                                    type: 'input',
                                    valueKey: 'devName',
                                    defaultValue: '',
                                    cap: '设备名称：',
                                    icon: 'transformer-bolt',
                                    placeholder: '请输入关键字',
                                    styles: [Styles.input.regularStyleNew, 'input.labelslot.margin(0)']
                                },
                                {
                                    type: 'filterSelect',
                                    styles: ['size(maxWidth:11.5rem)', 'padding(top:0;bottom:0)'],
                                    childStyles: ['size(minWidth:11.5rem)', 'input.agent.border(radius:s)', 'input.labelslot.margin(0)', 'padding(0)'],
                                    valueKey: 'stId',
                                    props: { cap: '变电站：', placeholder: '请选择', data: '{{stList}}', icon: 'transformer-bolt', search: '{{name}}', select: '{{stId}}' },
                                    watchers: [
                                        {
                                            key: 'name',
                                            callback: function (val) {
                                                getSubstationList({ _model, devName: val });
                                            },
                                            debounce: 200
                                        }
                                    ]
                                },
                                {
                                    type: 'button',
                                    cap: '查询',
                                    icon: 'search',
                                    class: 'jam-cta',
                                    onclick: function () {
                                        initTableData();
                                    }
                                }
                                // {
                                //     type: 'button',
                                //     cap: '导出',
                                //     icon: 'file-export',
                                //     onclick: function () {
                                //         exportExcel(urlConfig['exportEventByParam'].url, packageParams(), `事件化统计_${moment().format('yyyyMMDDHHmmssSSS')}.xlsx`, 'post');
                                //     }
                                // }
                            ]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    // chart
                    styles: [
                        //
                        'size(width:55%;height:100%)',
                        'layout(overflow:hidden;position:relative;)',
                        'layout.flex(alignItems:center;justifyContent:flex-start;alignContent:center)',
                        'background(image:linear-gradient(180deg, var(--jam-color-primary-subtle) 0%, var(--jam-color-primary-film) 100%))',
                        'margin(left:var(--gap))',
                        Styles.stylesheet({
                            ':scope': {
                                '--title-width': '3rem'
                            }
                        })
                    ],
                    components: [
                        // 预警区域统计
                        {
                            type: 'wrapper',
                            // chart-title
                            cap: '各市告警状态详情',
                            styles: [
                                'size(height:11.125rem;width:var(--title-width))',
                                'cap.css(width:1.6rem;height:max-content;padding:0 s;fontWeight:bold;line-height:1.2;top:1rem;background-color:transparent;background-image:linear-gradient(-90deg, var(--jam-color-primary-default) 0%, var(--jam-color-on-primary) 100%);color:transparent;backgroundClip:text;)',
                                'margin(left:m)',
                                'background(image:url(./assets/images/chart_title.png);size:100% 100%)',
                                Styles.stylesheet({
                                    ':scope': {
                                        '&>[slot=cap]': {
                                            '-webkit-background-clip': 'text'
                                        }
                                    }
                                })
                            ]
                        },
                        // 图表
                        {
                            type: 'wrapper',
                            styles: ['size(width:92%;height:100%;)', 'layout(overflow: hidden)'],
                            components: [
                                {
                                    type: 'wrapper',
                                    styles: ['size.fullsize', 'layout(position:relative)', 'flex(direction:column;)'],
                                    components: [
                                        {
                                            type: 'wrapper',
                                            styles: ['padding(0 m)', 'css(marginTop:m)', 'layout.flex(justifyContent:space-between;alignItems:center)'],
                                            descStyles: {
                                                label: [
                                                    'text(size:s;)',
                                                    Styles.stylesheet({
                                                        '.title-color': {
                                                            // color: jam.ac(0.95, 1, jam.lumiL(40))
                                                            color: '#d9970b'
                                                        }
                                                    })
                                                ]
                                            },
                                            components: [
                                                {
                                                    type: 'label',
                                                    cap: jaml.var('chart-left-info', (chartLeftInfo) => chartLeftInfo)
                                                },
                                                {
                                                    type: 'label',
                                                    cap: jaml.var('chart-right-info', (chartRightInfo) => chartRightInfo)
                                                }
                                            ]
                                        },
                                        {
                                            type: 'wrapper',
                                            styles: ['size.fullsize'],
                                            id: 'statisticsChartBar'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            styles: ['css(justifyContent:flex-end)'],
            components: [
                {
                    type: 'label',
                    cap: '图例：'
                },
                {
                    type: 'wrapper',
                    components: [
                        {
                            type: 'label',
                            cap: '查看曲线'
                        },
                        {
                            type: 'label',
                            icon: 'eye'
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    showIf: '{{pageNum}} == "1"',
                    components: [
                        {
                            type: 'label',
                            cap: '电压偏差'
                        },
                        {
                            type: 'label',
                            icon: 'bolt'
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            styles: [
                //
                'flex(direction: column)',
                // 'margin(top:var(--gap))',
                'layout(overflow:hidden)',
                'flex(1)'
            ],
            components: [
                {
                    type: 'table',
                    styles: [
                        //
                        'flex(1)',
                        Styles.tableStyles
                    ],
                    dataWatcher: 'eventDrivenAnalyticsData',
                    dataDef: [
                        {
                            key: 'devId',
                            show: false
                        },
                        {
                            key: 'statusDesc',
                            cap: '告警标注',
                            sortable: false
                        },
                        {
                            key: 'time',
                            cap: '刷新时间',
                            sortable: false,
                            width: '12rem',
                            formatter: formatterJameTime
                        },
                        {
                            key: 'areaName',
                            cap: '地市局',
                            sortable: false
                        },
                        {
                            key: 'stName',
                            cap: '变电站',
                            sortable: false,
                            styles: [Styles.toShowAll],
                            align: 'left'
                        },
                        {
                            key: 'devName',
                            cap: '设备名称',
                            sortable: false,
                            styles: [Styles.toShowAll],
                            align: 'left'
                        },
                        {
                            cap: '线路类型',
                            key: 'type',
                            formatter: function (value) {
                                return jame({
                                    type: 'label',
                                    styles: [
                                        Styles.label.css({
                                            width: '4rem',
                                            height: '1.6rem',
                                            justifyContent: 'center'
                                        })
                                    ],
                                    cap: value,
                                    state: value,
                                    states: {
                                        母线: {
                                            styles: [
                                                Styles.label.css({
                                                    color: 'hsl(195.3, 100%, 56.1%)'
                                                })
                                            ]
                                        },
                                        线路: {
                                            styles: [
                                                Styles.label.css({
                                                    color: 'hsl(156.3, 52.5%, 53.7%)'
                                                })
                                            ]
                                        }
                                    }
                                });
                            },
                            sortable: false
                        },
                        {
                            key: 'va',
                            cap: 'A相电压',
                            sortable: false,
                            formatter: function (value) {
                                return jame({
                                    type: 'label',
                                    styles: [
                                        Styles.label.css({
                                            color: 'hsl(195.3, 100%, 56.1%)'
                                        })
                                    ],
                                    cap: value
                                });
                            }
                        },
                        {
                            key: 'vb',
                            cap: 'B相电压',
                            sortable: false,
                            formatter: function (value) {
                                return jame({
                                    type: 'label',
                                    styles: [
                                        Styles.label.css({
                                            color: 'hsl(195.3, 100%, 56.1%)'
                                        })
                                    ],
                                    cap: value
                                });
                            }
                        },
                        {
                            key: 'vc',
                            cap: 'C相电压',
                            sortable: false,
                            formatter: function (value) {
                                return jame({
                                    type: 'label',
                                    styles: [
                                        Styles.label.css({
                                            color: 'hsl(195.3, 100%, 56.1%)'
                                        })
                                    ],
                                    cap: value
                                });
                            }
                        },
                        {
                            key: 'vab',
                            cap: 'AB相电压',
                            sortable: false,
                            formatter: function (value) {
                                return jame({
                                    type: 'label',
                                    styles: [
                                        Styles.label.css({
                                            color: 'hsl(180, 100%, 41%)'
                                        })
                                    ],
                                    cap: value
                                });
                            }
                        },
                        {
                            key: 'vac',
                            cap: 'AC相电压',
                            sortable: false,
                            formatter: function (value) {
                                return jame({
                                    type: 'label',
                                    styles: [
                                        Styles.label.css({
                                            color: 'hsl(180, 100%, 41%)'
                                        })
                                    ],
                                    cap: value
                                });
                            }
                        },
                        {
                            key: 'vbc',
                            cap: 'BC相电压',
                            sortable: false,
                            formatter: function (value) {
                                return jame({
                                    type: 'label',
                                    styles: [
                                        Styles.label.css({
                                            color: 'hsl(180, 100%, 41%)'
                                        })
                                    ],
                                    cap: value
                                });
                            }
                        },
                        {
                            key: 'busbar1DevName',
                            cap: '所属母线Ⅰ',
                            sortable: false,
                            formatter: function (value) {
                                return jame({
                                    type: 'label',
                                    cap: value ? value : '--',
                                    styles: [
                                        Styles.css({
                                            color: 'hsl(200.8, 56.3%, 82.9%)',
                                            cursor: 'pointer',
                                            textDecoration: 'underline'
                                        })
                                    ],
                                    onmouseenter: function (e) {
                                        if (value) {
                                            let target = findCol(e.target);
                                            const devId = target.col(0);

                                            const tableData = _msgr.get('eventDrivenAnalyticsData');
                                            const calendarDataMap = tableData.filter((item) => item.devId === devId)[0]?.busbar1;
                                            const dataList = convertVoltageData(calendarDataMap);
                                            const devName = target.col(13) || '-';
                                            const _c = dataList.map((item) => {
                                                return {
                                                    type: 'wrapper',
                                                    styles: [
                                                        Styles.css({
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between'
                                                        })
                                                    ],
                                                    components: [
                                                        {
                                                            type: 'label',
                                                            styles: [
                                                                Styles.label.css({
                                                                    color: 'hsl(200.8, 56.3%, 82.9%)',
                                                                    fontSize: 's',
                                                                    fontFamily: 'SourceHanSansCN'
                                                                })
                                                            ],
                                                            cap: item.name
                                                        },
                                                        {
                                                            type: 'label',
                                                            class: 'text-value',
                                                            cap: item.value
                                                        },
                                                        {
                                                            type: 'label',
                                                            cap: 'kv',
                                                            styles: [
                                                                Styles.label.css({
                                                                    color: 'hsl(200.8, 56.3%, 82.9%)',
                                                                    fontSize: 's',
                                                                    fontFamily: 'SourceHanSansCN'
                                                                })
                                                            ]
                                                        }
                                                    ]
                                                };
                                            });
                                            clearTimeout(popupHideDelay);
                                            jam.popup(
                                                e.target,
                                                jame({
                                                    type: 'wrapper',
                                                    // labelStyles: ['cap.css(padding:.25rem .45rem;borderRadius:1.25rem;backgroundColor:var(--bg-clr);color:var(--txt-clr);)'],
                                                    styles: ['layout.flex(direction:column;wrap:nowrap;)', 'css(width:10rem;background: hsla(203.4, 57.1%, 22%, 0.85);border: s solid hsla(195.3, 100%, 56.1%, 0.5);backdropFilter: blur(5px);boxShadow: 2px 2px 4px 0px hsla(204.4, 100%, 11.6%, 0.3);)'],
                                                    components: [
                                                        {
                                                            type: 'label',
                                                            cap: devName,
                                                            styles: [
                                                                Styles.css({
                                                                    width: '100%',
                                                                    justifyContent: 'center',
                                                                    borderBottom: 's solid hsl(203,39%,27%)'
                                                                }),
                                                                Styles.label.css({
                                                                    color: 'hsl(200.8, 56.3%, 82.9%)',
                                                                    fontSize: 's',
                                                                    fontWeight: 'bold',
                                                                    fontFamily: 'SourceHanSansCN'
                                                                })
                                                            ]
                                                        },
                                                        ..._c
                                                    ],
                                                    onmouseenter: function () {
                                                        popupController = true;
                                                    },
                                                    onmouseleave: function () {
                                                        jam.closePopup();
                                                        popupController = false;
                                                    }
                                                })
                                            );
                                        }
                                    },
                                    onmouseleave: function () {
                                        popupHideDelay = setTimeout(() => {
                                            if (popupController) return;
                                            jam.closePopup();
                                            popupController = false;
                                        }, 300);
                                    }
                                });
                            }
                        },
                        {
                            key: 'busbar2DevName',
                            cap: '所属母线Ⅱ',
                            sortable: false,
                            formatter: function (value) {
                                return jame({
                                    type: 'label',
                                    cap: value ? value : '--',
                                    styles: [
                                        Styles.css({
                                            color: 'hsl(200.8, 56.3%, 82.9%)',
                                            cursor: 'pointer',
                                            textDecoration: 'underline'
                                        })
                                    ],
                                    onmouseenter: function (e) {
                                        if (value) {
                                            let target = findCol(e.target);
                                            const devId = target.col(0);

                                            const tableData = _msgr.get('eventDrivenAnalyticsData');
                                            const calendarDataMap = tableData.filter((item) => item.devId === devId)[0]?.busbar2;
                                            const dataList = convertVoltageData(calendarDataMap);
                                            const devName = target.col(14) || '-';
                                            const _c = dataList.map((item) => {
                                                return {
                                                    type: 'wrapper',
                                                    styles: [
                                                        Styles.css({
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between'
                                                        })
                                                    ],
                                                    components: [
                                                        {
                                                            type: 'label',
                                                            styles: [
                                                                Styles.label.css({
                                                                    color: 'hsl(200.8, 56.3%, 82.9%)',
                                                                    fontSize: 's',
                                                                    fontFamily: 'SourceHanSansCN'
                                                                })
                                                            ],
                                                            cap: item.name
                                                        },
                                                        {
                                                            type: 'label',
                                                            class: 'text-value',
                                                            cap: item.value
                                                        },
                                                        {
                                                            type: 'label',
                                                            cap: 'kv',
                                                            styles: [
                                                                Styles.label.css({
                                                                    color: 'hsl(200.8, 56.3%, 82.9%)',
                                                                    fontSize: 's',
                                                                    fontFamily: 'SourceHanSansCN'
                                                                })
                                                            ]
                                                        }
                                                    ]
                                                };
                                            });
                                            clearTimeout(popupHideDelay);
                                            jam.popup(
                                                e.target,
                                                jame({
                                                    type: 'wrapper',
                                                    // labelStyles: ['cap.css(padding:.25rem .45rem;borderRadius:1.25rem;backgroundColor:var(--bg-clr);color:var(--txt-clr);)'],
                                                    styles: ['layout.flex(direction:column;wrap:nowrap;)', 'css(width:10rem;background: hsla(203.4, 57.1%, 22%, 0.85);border: s solid hsla(195.3, 100%, 56.1%, 0.5);backdropFilter: blur(5px);boxShadow: 2px 2px 4px 0px hsla(204.4, 100%, 11.6%, 0.3);)'],
                                                    components: [
                                                        {
                                                            type: 'label',
                                                            cap: devName,
                                                            styles: [
                                                                Styles.css({
                                                                    width: '100%',
                                                                    justifyContent: 'center',
                                                                    borderBottom: 's solid hsl(203,39%,27%)'
                                                                }),
                                                                Styles.label.css({
                                                                    color: 'hsl(200.8, 56.3%, 82.9%)',
                                                                    fontSize: 's',
                                                                    fontWeight: 'bold',
                                                                    fontFamily: 'SourceHanSansCN'
                                                                })
                                                            ]
                                                        },
                                                        ..._c
                                                    ],
                                                    onmouseenter: function () {
                                                        popupController = true;
                                                    },
                                                    onmouseleave: function () {
                                                        jam.closePopup();
                                                        popupController = false;
                                                    }
                                                })
                                            );
                                        }
                                    },
                                    onmouseleave: function () {
                                        popupHideDelay = setTimeout(() => {
                                            if (popupController) return;
                                            jam.closePopup();
                                            popupController = false;
                                        }, 300);
                                    }
                                });
                            }
                        },
                        {
                            key: 'elecPoint',
                            show: false
                        },
                        {
                            cap: '操作',
                            sortable: false,
                            formatter: (id) =>
                                jame({
                                    type: 'wrapper',
                                    styles: ['layout.flex(justifyContent:center)'],
                                    buttonStyles: ['background(color:transparent;image:none)', 'shadow(none)'],
                                    components: [
                                        {
                                            type: 'button',
                                            icon: 'eye',
                                            onclick: function () {
                                                openSecondaryVoltageLineWindow({
                                                    beginDate: '2021-01-01 00:00:00',
                                                    endDate: '2021-01-01 23:59:59',
                                                    warnType: 1,
                                                    devId: '111',
                                                    devName: ''
                                                });
                                            }
                                        },
                                        {
                                            type: 'button',
                                            icon: 'bolt',
                                            onclick: function (e) {
                                                let target = findCol(e.target);

                                                openSecondaryVoltageTableWindow({
                                                    devId: target.col(0),
                                                    elecPoint: target.col(15)
                                                });
                                            }
                                        }
                                    ]
                                })
                        }
                    ]
                    // )
                }
            ]
        }
    ],
    vars: {
        // todo
        devName: null,
        status: null,
        type: null,
        areaId: null,
        bvId: null
    },
    watchers: [],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        getSubAreaListData(_model);
        getBvList(_model, _msgr);
        getSubstationList({ _model });

        getEventTypeConfData();
    }
};

function initTableData(page) {
    ajaxCall('getCvtInfoData', {
        params: { ...getPagerParams(page), ...packageParams() },
        type: 'post',
        success(data) {
            try {
                const tableData = processData(data);
                _msgr.pub('eventDrivenAnalyticsData', tableData);
            } catch (error) {
                console.error(error);
            }
        }
    });
}

function initRegionStatisticsChartData() {
    ajaxCall('getCvtAbnormalStatData', {
        params: packageParams(),
        type: 'post',
        async success(data) {
            try {
                var xData = [],
                    yData = [];

                if (data instanceof Array) {
                    if (!data.length) {
                        suppChartData();
                    } else {
                        data.forEach((item) => {
                            xData.push(item.areaName);
                            yData.push({
                                areaId: item.areaId,
                                areaName: item.areaName,
                                value: item.abnormal
                            });
                        });
                    }
                } else {
                    suppChartData();
                }

                _model['chart-left-info'] = `<div><span>告警状态次数最多的城市为<span class="title-color"> ${getMaxAreaNames(yData)}</span></div>`;

                function suppChartData() {
                    (_model.regionList || []).forEach((item) => {
                        xData.push(item.name);
                        yData.push(0);
                    });
                }
                drawChart(jam.findElement('statisticsChartBar'));
                function drawChart(ele) {
                    if (!ele) {
                        setTimeout(() => {
                            drawChart(jam.findElement('statisticsChartBar'));
                        }, 100);
                    } else {
                        if (eChartsIns) {
                            eChartsIns.clear();
                        } else {
                            eChartsIns = echarts.init(ele);
                            window.addEventListener('resize', function () {
                                eChartsIns.resize();
                            });
                        }
                        eChartsIns.setOption(secondaryOptions(xData, yData), true);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    });
}

function packageParams() {
    const areaId = _model.vars.areaId || undefined;
    const bvId = _model.vars.bvId || undefined;
    const devName = _msgr.get('devName') || undefined;
    const params = {
        devName,
        status: _model.vars.warnStatus || undefined,
        type: _model.vars.lineType || undefined,
        stId: _msgr.get('stId') ? _msgr.get('stId') : undefined,
        areaId,
        bvId
    };
    return params;
}
function getPagerParams(page) {
    const { pageNumber = 1, pageSize = 15 } = page || {};
    return { pageIndex: pageNumber, pageSize };
}

export function getEventTypeConfData() {
    ajaxCall(
        'getEventTypeConfData',
        {
            success(data) {
                _model.vars.eventTypeList = (data || []).map((item) => item.value);
                // 初始化table 需要传eventTypeList
                initTableData();
                initRegionStatisticsChartData();
            },
            params: {},
            useMock: false
        },
        false
    );
}

function processData(originalData) {
    // 深拷贝原始数据，避免修改原数据
    const data = JSON.parse(JSON.stringify(originalData));

    if (Array.isArray(data)) {
        data.forEach((item) => {
            // 处理 busbar1
            if (item.busbar1) {
                item.busbar1DevId = item.busbar1.devId || '';
                item.busbar1DevName = item.busbar1.devName || '';
            } else {
                item.busbar1DevId = '';
                item.busbar1DevName = '';
            }

            // 处理 busbar2
            if (item.busbar2) {
                item.busbar2DevId = item.busbar2.devId || '';
                item.busbar2DevName = item.busbar2.devName || '';
            } else {
                item.busbar2DevId = '';
                item.busbar2DevName = '';
            }
        });
    }

    return data;
}

function openSecondaryVoltageLineWindow(props = {}) {
    newModal({
        title: '曲线详情',
        width: '51vw',
        height: '53vh',
        body: secondaryVoltageLineWindow(props)
    });
}

function openSecondaryVoltageTableWindow(props = {}) {
    newModal({
        title: '电压偏差',
        width: '31vw',
        height: '22vh',
        body: secondaryVoltageTableWindow(props)
    });
}

// 转换函数
function convertVoltageData(data) {
    return Object.entries(data)
        .filter(([key]) => key in voltageMap)
        .map(([key, value]) => ({
            name: voltageMap[key],
            value: value
        }));
}

// 获取最大值地区函数
function getMaxAreaNames(yData) {
    if (yData.length === 0) return '-';

    // 找出最大值
    const maxValue = Math.max(...yData.map((item) => item.value));

    // 筛选出所有最大值地区
    const maxAreas = yData.filter((item) => item.value === maxValue);

    // 提取地区名称并用逗号拼接
    return maxAreas.map((item) => item.areaName).join('，');
}

window.addEventListener('resize', function () {
    eChartsIns.resize();
});
