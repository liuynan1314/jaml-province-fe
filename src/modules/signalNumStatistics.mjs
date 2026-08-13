import { ajaxCall, exportExcel } from '../common.js';
import { getRegionList, getBvList, getSubstationList } from '../utils/commonList.js';
import { urlConfig } from '../global.js';
import signalDetailsWindow from '../components/modal/signalDetailsWindow.js';
let _model, _msgr, eChartsIns;
const pagerKey = jam.genUUID();

export default {
    type: 'wrapper',
    styles: ['css(--gap:var(--jam-space-m))', 'padding(var(--gap))', 'flex(direction: column)', 'with.elevation', 'padding(bottom:0)', 'layout(overflow:hidden auto)', 'size.fullsize'],
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
                            value: '{{regionId}}',
                            data: '{{regionList}}'
                        },
                        {
                            type: 'buttongroup-radio',
                            cap: '电压等级',
                            icon: 'bolt',
                            styles: [Styles.buttonGroupStylesWithBgCap],
                            value: '{{bvId}}',
                            data: '{{bvList}}'
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
                                {
                                    type: 'filterSelect',
                                    styles: ['size(maxWidth:18rem;height:1.8rem;)', 'padding(top:0;bottom:0)'],
                                    childStyles: [Styles.input.regularStyle, 'size(minWidth:18rem;)', 'input.agent.border(radius:s)', 'input.labelslot.margin(0)', 'padding(0)'],
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
                                { type: 'datepicker', value: '{{beginDate}}', max: '{{endDate}}', icon: 'calendar', cap: '查询时间：' },
                                { type: 'datepicker', value: '{{endDate}}', min: '{{beginDate}}', cap: '-' },
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
                                        exportExcel(urlConfig['exportMonitorsDiaryManageSignalTable'].url, packageParams(), `验收信号数量_${moment().format('yyyyMMDDHHmmssSSS')}.xlsx`, 'post');
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
                                            }
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
            // table-wrapper
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
                            key: 'keyIdStr',
                            show: false
                        },
                        {
                            cap: '地区',
                            key: 'regionName',
                            sortable: false,
                            width: '10%'
                        },
                        {
                            cap: '变电站',
                            key: 'stName',
                            sortable: false,
                            width: '10%'
                        },
                        {
                            cap: '信号名称',
                            key: 'keyName',
                            sortable: false,
                            width: '12%',
                            styles: [Styles.toShowAll]
                        },
                        {
                            cap: '电压等级',
                            key: 'bvName',
                            sortable: false,
                            width: '8%'
                        },
                        {
                            cap: '动作次数',
                            key: 'count',
                            styles: [Styles.css({ color: 'rgba(10,249,178,1)', textDecoration: 'underline', cursor: 'pointer' })],
                            sortable: false,
                            width: '8%',
                            onclick: function (e) {
                                const keyId = this.col(0);
                                openSignalDetailsDialog(keyId);
                            }
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
        bvId: null,
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
            key: 'bvId',
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
    onunmount: function () {
        mango.pub('remoteOperationParams', null);
    },
    onafterrender: function () {
        getRegionList(_model, _msgr);
        getSubstationList({ _model });
        getBvList(_model, _msgr);
        getChartData();
    }
};

function initTableData(page) {
    ajaxCall('getMonitorsDiaryManageSignalTable', {
        params: { ...getPagerParams(page), ...packageParams() },
        type: 'post',
        success(data) {
            _msgr.pub('eventDrivenAnalyticsData', data?.list || []);
            _msgr.pub(pagerKey + '_total', data.pojoTotalCount);
        }
    });
}

function packageParams() {
    const regionId = _model.vars.regionId || undefined;
    const bvId = _model.vars.bvId || undefined;
    const params = {
        bvIdList: bvId ? [bvId] : undefined,
        startTime: _model.vars.beginDate ? _model.vars.beginDate + ' 00:00:00' : undefined,
        endTime: _model.vars.endDate ? _model.vars.endDate + ' 23:59:59' : undefined,
        stIdList: _msgr.get('stId') ? [_msgr.get('stId')] : undefined,
        regionId,
        // diaryTypeList: ['设备异常记录']
        diaryTypeList: ['调试记录']
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
    delete params.stId;
    ajaxCall('getMonitorsDiaryManageGroupData', {
        params,
        type: 'post',
        useMock: false,
        success(data) {
            var xData = [],
                yData = [];

            if (data instanceof Array) {
                if (!data.length) {
                    suppChartData();
                } else {
                    data.forEach((item) => {
                        xData.push(item.regionName);
                        yData.push(item.count);
                    });
                }
            } else {
                suppChartData();
            }

            initChart(xData, yData);
        }
    });
}

function initChart(xData, yData) {
    if (eChartsIns) {
        eChartsIns.clear();
    }
    eChartsIns = echarts.init(document.querySelector('#statisticsChartBar'));
    eChartsIns.setOption(operationStOptions(xData, yData), true);
}

export function operationStOptions(xData, yData) {
    const getSymbolData = (datas) => {
        let arr = [];
        for (var i = 0; i < datas.length; i++) {
            arr.push({
                value: datas[i],
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
            show: false
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
                name: '信号数量',
                data: yData,
                type: 'bar',
                barWidth: 15,
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
                name: '信号数量',
                symbol: 'react',
                symbolSize: [6, 2],
                symbolOffset: [-4, -4],
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
                name: '信号数量',
                symbol: 'react',
                symbolSize: [6, 2],
                symbolOffset: [4, -4],
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
                name: '信号数量',
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
                symbolSize: [20, 1],
                symbolRotate: 45,
                symbolOffset: [0, 0],
                data: yData,
                z: 1
            }
        ]
    };
    return barOptions;
}

function openSignalDetailsDialog(keyId) {
    const _params = {
        keyId: keyId,
        startTime: _model.vars.beginDate ? _model.vars.beginDate + ' 00:00:00' : undefined,
        endTime: _model.vars.endDate ? _model.vars.endDate + ' 23:59:59' : undefined,
        // diaryTypeList: ['设备异常记录']
        diaryTypeList: ['调试记录']
    };
    jam.renderModal('#main', signalDetailsWindow(_params));
}
