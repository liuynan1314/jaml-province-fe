import { ajaxCall, exportExcel, loadConf, formatterJameTime } from '../common.js';
import { getRegionList } from '../utils/commonList.js';
import { urlConfig, userInfo } from '../global.js';
import { disableRegionOptionByUnicode } from './equipmentEarlyWarningStatistics.mjs';
let _model, _msgr, eChartsIns;
const pagerKey = jam.genUUID();
const traceOperationTypeList = loadConf('detailConfig.json', {})?.traceOperationTypeList || false;

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
                    childStyles: [
                        Styles.css({
                            marginTop: 'l'
                        })
                    ],
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
                            type: 'buttongroup-radio',
                            defaultValue: null,
                            cap: '操作类型',
                            defaultValue: traceOperationTypeList[0]?.value,
                            styles: [Styles.buttonGroupStylesWithBgCap],
                            value: '{{traceOperationType}}',
                            data: traceOperationTypeList
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
                            datepickerStyles: [Styles.datepicker.regularStyle],
                            buttonStyles: [Styles.searchBtnsStyles],
                            components: [
                                { type: 'datepicker', value: '{{beginDate}}', max: '{{endDate}}', icon: 'calendar', cap: '查询时间：' },
                                { type: 'datepicker', value: '{{endDate}}', min: '{{beginDate}}', cap: '-' },
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
                                        getChartData();
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
                                        exportExcel(urlConfig['exportTracemanageAlarmData'].url, packageParams(), `痕迹管理_${moment().format('yyyyMMDDHHmmssSSS')}.xlsx`, 'post');
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
                                            styles: ['padding(0 m)', 'layout.flex(justifyContent:space-between;alignItems:center)'],
                                            descStyles: {
                                                label: [
                                                    'text(size:s)',
                                                    Styles.stylesheet({
                                                        '.title-color': {
                                                            color: 'primary'
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
                    dataWatcher: 'traceManageData',
                    dataDef: [
                        {
                            cap: '地区',
                            key: 'regionName',
                            width: '10%',
                            sortable: false
                        },
                        {
                            cap: '操作时间',
                            key: 'occurTime',
                            width: '15%',
                            sortable: false,
                            formatter: formatterJameTime
                        },
                        {
                            cap: '操作类型',
                            width: '15%',
                            key: 'opTask',
                            sortable: false
                        },
                        {
                            cap: '操作内容',
                            key: 'content',
                            sortable: false,
                            styles: [Styles.toShowAll]
                        }
                    ]
                },
                {
                    type: 'pager',
                    styles: [
                        //
                        'size(minHeight:2.25rem)',
                        'margin(top:var(--gap-sm))'
                    ],
                    props: {
                        pageSizeList: [
                            {
                                value: '15',
                                name: '15条/页'
                            },
                            {
                                value: '50',
                                name: '50条/页'
                            },
                            {
                                value: '100',
                                name: '100条/页'
                            }
                        ],
                        total: pagerKey + '_total',
                        messageKey: pagerKey
                    }
                }
            ]
        }
    ],
    vars: {
        beginDate: moment().format('yyyy-MM-DD'),
        endDate: moment().format('yyyy-MM-DD'),
        regionId: null
    },
    watchers: [
        {
            key: 'regionId',
            callback: function () {
                initTableData();
            }
        },
        {
            key: 'traceOperationType',
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
        _model.vars.regionId = userInfo.unicode || null;
        getChartData();
    }
};

function initTableData(page) {
    ajaxCall('getTracemanageAlarmData', {
        params: { ...getPagerParams(page), ...packageParams() },
        type: 'post',
        success(data) {
            _msgr.pub('traceManageData', data?.list || []);
            _msgr.pub(pagerKey + '_total', data.pojoTotalCount);
        }
    });
}

function packageParams() {
    const regionId = _model.vars.regionId || undefined;
    const opTask = _model.traceOperationType ? _model.vars.traceOperationType : undefined;
    const params = {
        startTime: _model.vars.beginDate ? _model.vars.beginDate + ' 00:00:00' : undefined,
        endTime: _model.vars.endDate ? _model.vars.endDate + ' 23:59:59' : undefined,
        regionId,
        opTask
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
    ajaxCall('getTracemanageAlarmRegionNum', {
        params,
        type: 'post',
        useMock: false,
        success(data) {
            console.log('data', data);
            var sum = 0,
                xData = [],
                yData = [];

            data?.forEach((item) => {
                xData.push(item.regionName || '');
                yData.push(item.count || 0);
                sum += item.count || 0;
            });
            _model['chart-left-info'] = `<div><span>痕迹总数为</span><span class="title-color"> ${sum} </span>个`;
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
