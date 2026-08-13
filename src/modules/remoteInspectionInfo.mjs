import { ajaxCall, findCol } from '../common.js';
import { remoteInspectionInfoBarOptions } from '../components/chartConfig/remoteInspectionInfoBarData.js';
let _model, _msgr;

export default {
    type: 'wrapper',
    class: 'remote-inspection-info',
    styles: [
        Styles.size.fullsize,
        Styles.layout.grid({ cols: 16, rows: 10 }),
        Styles.stylesheet({
            ':scope': {
                padding: '1rem'
            },
            '.form-wrapper': {
                height: '2rem',
                width: '100%',
                'jam-button': {
                    marginTop: '-0.1rem'
                },
                '.btn': {
                    marginRight: '0.5rem'
                }
            },
            '.chart-wrapper': {
                display: 'flex',
                flexDirection: 'column',

                '.chart-ele': {
                    height: 'calc(100% - 2rem)'
                }
            },

            '.table-wrapper': {}
        })
    ],
    components: [
        {
            type: 'wrapper',
            class: 'chart-wrapper',
            styles: [Styles.layout.gridpos(1, 1, 8, 5)],
            components: [
                {
                    type: 'wrapper',
                    class: 'form-wrapper',
                    components: [
                        {
                            type: 'datepicker',
                            valueKey: 'beginTime',
                            cap: '日期',
                            styles: [Styles.datepicker.regularStyle]
                        },
                        {
                            type: 'buttongroup-radio',
                            class: 'bv-list',
                            // cap: '电压等级',
                            styles: [Styles.buttongroupWithCapInTop, Styles.size({ minWidth: '10rem' })],
                            defaultValue: '',
                            valueKey: 'bvId',
                            dataWatcher: 'bvList'
                        }
                    ]
                },
                {
                    type: 'element',
                    class: 'bar-chart  chart-ele'
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'chart-wrapper',
            styles: [Styles.layout.gridpos(9, 1, 8, 5)],
            components: [
                {
                    type: 'wrapper',
                    class: 'form-wrapper',
                    components: [
                        {
                            type: 'buttongroup-radio',
                            class: 'type-list',
                            styles: [Styles.buttongroupWithCapInTop, Styles.size({ minWidth: '10rem' })],
                            defaultValue: 0,
                            valueKey: 'type',
                            data: [
                                {
                                    name: '无人机',
                                    value: 0
                                },
                                {
                                    name: '摄像头',
                                    value: 1
                                },
                                {
                                    name: '机器人',
                                    value: 2
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'chart-pie',
                    class: 'pie-chart chart-ele',
                    colorset: ['#41ecce', '#e37784'],
                    styles: [
                        'size.fullsize',
                        Styles.echarts.pie({
                            center: ['30%', '50%'],
                            radius: ['55%', '70%'],
                            clockwise: false,
                            startAngle: 90
                        }),

                        Styles.echarts.legend({
                            type: 'scroll',
                            orient: 'vertical',
                            show: true,
                            top: 'center',
                            left: '60%',
                            icon: 'rect',
                            itemWidth: 18,
                            itemHeight: 18,
                            itemGap: 35,
                            formatter: function (name) {
                                const data = _msgr.get('remoteInspectionInfoPieData');
                                for (let i = 0; i < data.length; i++) {
                                    if (name == data[i][0]) {
                                        return `${name}\u3000\u3000\u3000${data[i][1]}%`;
                                    }
                                }
                            }
                        }),

                        Styles.echarts.legend.textStyle({
                            color: function () {},
                            size: 18
                        }),
                        ,
                        Styles.echarts.tooltip({
                            trigger: 'item',
                            formatter: function (param) {
                                const { marker, value, name } = param;
                                return `告警类型： <br/> ${marker}${name}：${value[1]}个`;
                            }
                        })
                    ],
                    dataWatcher: 'remoteInspectionInfoPieData'
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'table-wrapper',
            styles: [Styles.layout.gridpos(1, 6, 16, 5)],
            components: [
                {
                    type: 'wrapper',
                    class: 'form-wrapper',
                    components: [
                        {
                            type: 'select',
                            cap: '区域选择',
                            defaultValue: '',
                            valueKey: 'regionId',
                            dataWatcher: 'regionList',
                            styles: [Styles.select.regularStyle, Styles.size({ minWidth: '14rem' })]
                        },
                        {
                            type: 'select',
                            cap: '运维班',
                            defaultValue: '',
                            valueKey: 'teamId',
                            dataWatcher: 'teamList',
                            data: [
                                {
                                    name: '全部',
                                    value: ''
                                },
                                {
                                    name: '班组1',
                                    value: 1
                                },
                                {
                                    name: '班组2',
                                    value: 2
                                },
                                {
                                    name: '班组3',
                                    value: 3
                                }
                            ],
                            styles: [Styles.select.regularStyle, Styles.size({ minWidth: '14rem' })]
                        },
                        {
                            type: 'button',
                            class: 'btn query-btn',
                            styles: [Styles.button.regularStyle, Styles.buttonWithQueryBg],
                            //   cap: "查询",
                            onclick: function () {
                                getEchartsData();
                                getPowerOutageTableData();
                            }
                        },
                        {
                            type: 'button',
                            cap: '重置',
                            class: 'btn export-btn',
                            styles: [Styles.button.regularStyle, Styles.buttonWithResetBg],
                            onclick: function () {}
                        },
                        {
                            type: 'button',
                            class: 'btn export-btn',
                            styles: [Styles.button.regularStyle, Styles.buttonWithexportBg],
                            onclick: function () {
                                exportPowerOutageData();
                            }
                        }
                    ]
                },
                {
                    type: 'table',
                    styles: [Styles.table.regularStyle, Styles.table.showrownum({ style: 'plain' }), Styles.size({ width: '100%', height: 'calc(100% - 1rem)' })],
                    dataWatcher: 'powerOutageData',
                    dataDef: [
                        {
                            cap: '设备id',
                            key: 'devId',
                            show: false
                        },
                        {
                            cap: '区域',
                            key: 'regionName',
                            sortable: false
                        },
                        {
                            cap: '运维班',
                            key: 'teamName',
                            sortable: false
                        },
                        {
                            cap: '设备名称',
                            key: 'devName',
                            sortable: false
                        },
                        {
                            cap: '在线状态',
                            key: 'onlineStatus',
                            sortable: false
                        },
                        {
                            cap: '历史告警数量',
                            key: 'historyAlarmCount',
                            sortable: false,
                            formatter: function (value) {
                                return `<span style="color:#00C2FF;font-weight:bold;text-decoration: underline;cursor: pointer">${value}</span>`;
                            },
                            onclick: function (e) {
                                let target = findCol(e.target);
                            }
                        }
                    ]
                }
            ]
        }
    ],
    watchers: [
        {
            key: 'type',
            callback: function (type) {
                getBarChartsData(type);
            }
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        getOverloadStaticsBvList();
        getPieChartsData();
        getRegionList();
    }
};

/**
 * 获取电压等级列表
 */
async function getOverloadStaticsBvList() {
    ajaxCall(
        'getOverloadStaticsBvList',
        {
            success(data) {
                const defaultBvList = [
                    {
                        name: '全部',
                        value: ''
                    }
                ];
                const bvList = data.map((item) => {
                    return { name: item.bvName, value: item.bvId };
                });

                _msgr.pub('bvList', [...defaultBvList, ...bvList]);
            },
            params: {},
            useMock: false,
            type: 'get'
        },
        false
    );
}

function getBarChartsData(type = 0) {
    ajaxCall(
        'getRemoteInspectionInfoBarData',
        {
            success(res) {
                const data = res.map((item) => {
                    return {
                        name: item.regionName,
                        value: item.value
                    };
                });

                const eCharts = echarts.init(document.querySelector('.bar-chart'));
                const leftColor = typeConfig.leftColor[type];
                const rightColor = typeConfig.rightColor[type];
                const topColor = typeConfig.topColor[type];
                eCharts.setOption(remoteInspectionInfoBarOptions(data, leftColor, rightColor, topColor));
            },
            params: {},
            useMock: false,
            type: 'get'
        },
        false
    );
}

function getPieChartsData() {
    ajaxCall(
        'getRemoteInspectionInfoPieData',
        {
            success(res) {
                const data = [['状态', '在离线率']];
                res.forEach((item) => {
                    data.push([item.name, item.value]);
                });
                _msgr.pub('remoteInspectionInfoPieData', data);
            },
            params: {},
            useMock: false,
            type: 'get'
        },
        false
    );
}

/**
 * 获取区域列表
 */
async function getRegionList() {
    ajaxCall(
        'getRegionList',
        {
            success(data) {
                const defaultRegion = [
                    {
                        name: '全部',
                        value: ''
                    }
                ];
                const regionList = data.map((item) => {
                    return { name: item.regionNameChn, value: item.regionId };
                });
                _msgr.pub('regionList', [...defaultRegion, ...regionList]);
            },
            params: {},
            useMock: false,
            type: 'get'
        },
        false
    );
}

const typeConfig = {
    leftColor: [
        ['#0887a5', '#04819c', '#017990'],
        ['#085fa5', '#055b9c', '#065686'],
        ['#a1990b', '#948a08', '#8c8306']
    ],
    rightColor: [
        ['#08d3bb', '#04aba9', '#08768b'],
        ['#01a6ca', '#057ba7', '#08558a'],
        ['#c78706', '#a08009', '#877c0b']
    ],
    topColor: [['#0eecf8'], ['#eaff8'], ['#f8cc0e']]
};
