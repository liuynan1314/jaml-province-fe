import { ajaxCall, exportExcel, loadConf, formatterJameTime } from '../common.js';
import { getRegionList } from '../utils/commonList.js';
import { urlConfig, userInfo } from '../global.js';
import { disableRegionOptionByUnicode } from './equipmentEarlyWarningStatistics.mjs';
let _model,
    _msgr,
    eChartsIns,
    isFirstSearch = true;
const pagerKey = jam.genUUID();

export default {
    type: 'wrapper',
    styles: ['css(--gap:var(--jam-space-m))', 'padding(var(--gap))', 'flex(direction: column)', 'with.elevation', 'padding(bottom:0)', 'layout(overflow:hidden auto)', 'size.fullsize'],
    components: [
        {
            type: 'wrapper',
            styles: ['size(minHeight:14rem)'],
            components: [
                {
                    type: 'wrapper',
                    styles: ['flex(flex:1;direction:column;)'],
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '区域选择',
                            icon: 'earth-asia',
                            styles: [Styles.buttonGroupStylesWithBgCap],
                            defaultValue: null,
                            value: '{{regionId}}',
                            data: '{{regionList}}',
                            onafterrender: function () {
                                if (userInfo.unicode) {
                                    const buttonggroupEle = this.cmpt.element;
                                    disableRegionOptionByUnicode(userInfo.unicode, buttonggroupEle);
                                }
                            }
                        },
                        {
                            type: 'wrapper',
                            styles: [
                                Styles.css({
                                    marginTop: 'm'
                                })
                            ],
                            components: [
                                {
                                    type: 'select',
                                    cap: '设备类型：',
                                    styles: [Styles.select.regularStyle],
                                    value: '{{devType}}',
                                    dataWatcher: 'devTypeList'
                                },
                                {
                                    type: 'select',
                                    cap: '设备厂商：',
                                    styles: [Styles.select.regularStyle],
                                    value: '{{brand}}',
                                    dataWatcher: 'brandList'
                                },
                                {
                                    type: 'input',
                                    cap: '关键字：',
                                    styles: [Styles.input.regularStyle],
                                    icon: 'comment-text',
                                    value: '{{keyWord}}'
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            styles: [
                                'layout.flex(alignItems:center;justifyContent:flex-start)',
                                Styles.stylesheet({
                                    '.ml-_625rem': {
                                        marginLeft: 'm'
                                    }
                                }),
                                Styles.css({
                                    marginTop: 'm'
                                })
                            ],
                            childStyles: ['margin(top:var(--gap))', 'datepicker.agent.border(radius:.25rem)'],
                            descStyles: {
                                datepicker: ['padding(top:0;bottom:0)', 'datepicker.labelslot.margin(0)'],
                                button: [Styles.searchBtnsStyles]
                            },
                            components: [
                                { type: 'datepicker', max: '{{endDate}}', cap: '查询时间：', icon: 'calendar', value: '{{beginDate}}' },
                                { type: 'datepicker', min: '{{beginDate}}', cap: '-', value: '{{endDate}}', styles: ['padding(left:0)', 'size(width:9.2rem;)', Styles.stylesheet({ ':scope': { minWidth: '0!important' } })] },
                                {
                                    type: 'radio',
                                    data: [
                                        { name: '昨日', value: 1 },
                                        { name: '今日', value: 0 },
                                        { name: '近三天', value: 3 },
                                        { name: '近七天', value: 7 }
                                    ],
                                    value: 0,
                                    onvaluechange: function (value) {
                                        _model.endDate = moment().format('YYYY-MM-DD');
                                        _model.beginDate = moment().subtract(value, 'day').format('YYYY-MM-DD');
                                        initTableData();
                                        initPieData();
                                    }
                                },

                                {
                                    type: 'button',
                                    cap: '查询',
                                    icon: 'search',
                                    class: 'jam-cta',
                                    onclick: function () {
                                        initTableData();
                                        getChartData();
                                    }
                                },

                                {
                                    type: 'button',
                                    cap: '导出',
                                    icon: 'file-export',
                                    onclick: function () {
                                        exportExcel(urlConfig['exportJsTDeviceData'].url, packageParams(), `台账_${moment().format('yyyyMMDDHHmmssSSS')}.xlsx`, 'post');
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    styles: ['size(width:42%;height:100%)', 'margin(left:var(--gap))', 'flex(direction:column;)'],
                    components: [
                        {
                            type: 'wrapper',
                            styles: ['layout.flex'],
                            components: [
                                {
                                    type: 'label',
                                    cap: '{{chartTitle}}',
                                    styles: [
                                        Styles.stylesheet({
                                            '[slot=cap]': {
                                                display: 'block',
                                                minWidth: '13.2rem',
                                                height: '2.25rem',
                                                paddingLeft: 'l',
                                                backgroundImage: 'url(./../assets/images/title_third.png)',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'bottom var(--gap) left',
                                                backgroundSize: 'auto 1.875rem'
                                            }
                                        })
                                    ]
                                }
                            ]
                        },
                        // 图表
                        {
                            type: 'wrapper',
                            styles: ['size.fullsize', 'layout(overflow: hidden)', 'border.subtle', 'border.s'],
                            components: [
                                {
                                    type: 'wrapper',
                                    styles: ['size.fullsize', 'layout(position:relative)', 'flex(direction:column;)'],
                                    components: [
                                        {
                                            type: 'wrapper',
                                            styles: ['padding(0 1rem)', 'layout.flex(justifyContent:space-between;alignItems:center)'],
                                            descStyles: {
                                                label: [
                                                    'text(size:s;)',
                                                    Styles.stylesheet({
                                                        '.title-color': {
                                                            color: 'var(--jam-color-primary-default)'
                                                        },
                                                        '.fail-color': {
                                                            color: 'hsl(0, 100%, 66.1%)'
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
            styles: [
                //
                'flex(direction: column)',
                'margin(top:var(--gap))',
                'layout(overflow:hidden)',
                'flex(1)'
            ],
            components: [
                {
                    type: 'table',
                    styles: ['flex(1)', Styles.tableStyles],
                    dataWatcher: 'ledgerTableData',
                    dataDef: [
                        // {
                        //     cap: '地区',
                        //     key: 'regionName',
                        //     width: '10%',
                        //     sortable: false
                        // },
                        {
                            cap: '设备名称',
                            key: 'name',
                            sortable: false
                        },
                        {
                            cap: '设备类型',
                            key: 'value',
                            sortable: false
                        },
                        {
                            cap: '所属单位',
                            key: 'companyName',
                            sortable: false
                        },
                        {
                            cap: '机房位置',
                            key: 'machineRoomName',
                            sortable: false
                        },
                        {
                            cap: '设备型号',
                            key: 'brandModel',
                            sortable: false
                        },
                        {
                            cap: '设备厂商',
                            key: 'brand',
                            sortable: false
                        },
                        {
                            cap: '设备编号',
                            key: 'serialNumber',
                            sortable: false
                        },
                        {
                            cap: '更新时间',
                            key: 'updateTime',
                            sortable: false
                        }
                    ]
                },
                {
                    type: 'pagination',
                    styles: [
                        //
                        'size(minHeight:2.25rem)',
                        'margin(top:var(--gap-sm))',
                        'layout.flex(justifyContent:flex-start;alignItems:center;)'
                    ],
                    props: {
                        pageNo: '{{pageNumber}}',
                        total: '{{pojoTotalCount}}',
                        pageSize: '{{pageSize1}}',
                        hide: { total: false, pageSize: false, switch: false }
                    },
                    watchers: [
                        {
                            keys: ['pageNumber', 'pageSize1'],
                            callback(pageNumber, pageSize) {
                                if (isFirstSearch) {
                                    isFirstSearch = false;
                                } else {
                                    initTableData({ pageNumber: pageNumber || 1, pageSize: pageSize || 15 });
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ],
    vars: {
        beginDate: moment().format('yyyy-MM-DD'),
        endDate: moment().format('yyyy-MM-DD'),
        regionId: null,
        devType: null,
        brand: null,
        keyWord: null
    },
    watchers: [
        {
            key: 'regionId',
            callback: function () {
                initTableData();
            }
        },
        {
            key: pagerKey,
            callback: function (page) {
                page.firstFetch ? null : initTableData(page);
            }
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
        eChartsIns = null;
    },
    onafterrender: function () {
        getRegionList(_model, _msgr);
        getDropByType();
        _model.vars.regionId = userInfo.unicode || null;
        getChartData();
    }
};

function getDropByType() {
    ajaxCall('getDropByType', {
        params: {
            type: 0
        },
        uniqId: jam.genUUID(),
        success(data) {
            _model.vars.devTypeList = data;
        }
    });
    ajaxCall('getDropByType', {
        params: {
            type: 1
        },
        uniqId: jam.genUUID(),
        success(data) {
            _model.vars.brandList = data;
        }
    });
}

function initTableData(page) {
    ajaxCall('getJsTDeviceData', {
        params: { ...getPagerParams(page), ...packageParams() },
        type: 'post',
        success(data) {
            _msgr.pub('ledgerTableData', data?.list || []);
            _msgr.pub('pojoTotalCount', data.pojoTotalCount);
        }
    });
}

function packageParams() {
    const regionIdList = _model.vars.regionId ? [_model.vars.regionId] : undefined;
    const value = _model.vars.devType || undefined;
    const brand = _model.vars.brand || undefined;
    const name = _model.vars.keyWord || undefined;
    const params = {
        startTime: _model.vars.beginDate ? _model.vars.beginDate + ' 00:00:00' : undefined,
        endTime: _model.vars.endDate ? _model.vars.endDate + ' 23:59:59' : undefined,
        regionIdList,
        value,
        brand,
        value,
        name
    };

    return params;
}
function getPagerParams(page) {
    const { pageNumber = 1, pageSize = 15 } = page || {};
    return { pageIndex: pageNumber, pageSize };
}

function getChartData() {
    let params = packageParams();
    delete params.regionId;
    ajaxCall('getJsTDeviceRegionNum', {
        params,
        type: 'post',
        useMock: false,
        success(data) {
            var sum = 0,
                xData = [],
                yData = [];

            data?.forEach((item) => {
                xData.push(item.regionName || '');
                yData.push(item.count || 0);
                sum += item.count || 0;
            });
            _model['chart-left-info'] = `<div><span>设备总数为</span><span class="title-color"> ${sum} </span>个`;
            _msgr.pub('chartData', data);
            initChart(xData, yData);
        }
    });
}

function initChart(xData, yData) {
    if (eChartsIns) {
        eChartsIns.clear();
    }
    eChartsIns = echarts.init(document.querySelector('#statisticsChartBar'));
    eChartsIns.setOption(traceManagementOptions(xData, yData), true);
}

export function traceManagementOptions(xData, yData) {
    const getSymbolData = (datas) => {
        let arr = [];
        for (var i = 0; i < datas.length; i++) {
            arr.push({
                value: yData[i],
                symbolPosition: 'end'
            });
        }
        return arr;
    };
    const barOptions = {
        grid: {
            top: '20%',
            left: '0.3%',
            right: '0.3%',
            bottom: '2%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            x: 'center',
            top: '0%',
            selectedMode: false,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
                color: 'hsl(201.6, 33.3%, 64.1%)'
            }
        },
        xAxis: {
            type: 'category',
            data: xData,
            axisLine: {
                lineStyle: {
                    color: 'hsl(201.6, 33.3%, 64.1%)'
                }
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                color: 'hsl(201.6, 33.3%, 64.1%)'
            }
        },
        yAxis: {
            type: 'value',
            nameTextStyle: {
                color: 'hsl(201.6, 33.3%, 64.1%)',
                padding: [0, 0, 0, -30]
            },
            axisLine: {
                show: false
            },
            splitNumber: 4,
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: 'hsl(201.6, 33.3%, 64.1%)'
                }
            },
            axisLabel: {
                color: 'hsl(201.6, 33.3%, 64.1%)'
            }
        },
        series: [
            // // 柱子
            {
                z: 0,
                data: yData,
                type: 'bar',
                barWidth: 30,
                // barGap: '',
                label: {
                    show: true,
                    position: 'top',
                    distance: 12,
                    fontFamily: 'DINPro',
                    textStyle: {
                        color: 'rgba(0, 113, 194, 1)',
                        fontWeight: 'bolder',
                        fontSize: 12
                    }
                },
                itemStyle: {
                    color: jam.toEchartsGradient(90, Tokens.color.primary.default, Tokens.color.transparent)
                }
            },
            // 最上面线
            {
                type: 'pictorialBar',
                symbol: 'react',
                symbolSize: [9, 3],
                symbolOffset: [-11, -10],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return `${params.value ? 'rgba(0, 113, 194, 1)' : 'rgba(0,0,0,0'}`;
                    },
                    shadowColor: 'rgba(0, 113, 194, 1)',
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(yData)
            },
            {
                type: 'pictorialBar',
                symbol: 'react',
                symbolSize: [9, 3],
                symbolOffset: [0, -10],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return `${params.value ? 'rgba(0, 113, 194, 1)' : 'rgba(0,0,0,0'}`;
                    },
                    shadowColor: 'rgba(0, 113, 194, 1)',
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(yData)
            },
            {
                type: 'pictorialBar',
                symbol: 'react',
                symbolSize: [9, 3],
                symbolOffset: [11, -10],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return `${params.value ? 'rgba(0, 113, 194, 1)' : 'rgba(0,0,0,0'}`;
                    },
                    shadowColor: 'rgba(0, 113, 194, 1)',
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(yData)
            },
            // // 斜线填充
            {
                type: 'pictorialBar',
                itemStyle: {
                    color: 'rgba(255,255,255,0.15)'
                },
                tooltip: {
                    show: false
                },
                symbolRepeat: 'fixed',
                symbolMargin: 3,
                symbol: 'rect',
                symbolClip: true,
                symbolSize: [42, 1],
                symbolRotate: 45,
                symbolOffset: [1, 1],
                data: yData,
                z: 1
            }
        ]
    };
    return barOptions;
}
