import { ajaxCall } from '../common.js';
import { urlConfig, mockPath } from '../global.js';
import heavyOverloadEquipInfoWindow from '../components/modal/heavyOverloadEquipInfoWindow.mjs';
let _model,
    _msgr = null;
let clickIndex, clickSeriesName, areaName; //点击记录
let _el;
let barOptions;
let initialParams = null; // 保存初始化参数

export default {
    type: 'card',
    icon: 'computer-classic',
    class: 'devOverLoad',
    styles: [
        'size.fullsize',
        Styles.css({
            '--jam-card-bodyslot-padding': '0.25rem 0.5rem'
        })
    ],
    components: [
        {
            type: 'container',
            styles: ['size.fullsize'],
            components: [
                {
                    type: 'label',
                    icon: 'download',
                    attrs: {
                        title: '导出图表数据'
                    },
                    styles: [
                        Styles.icon.regular,
                        Styles.css({
                            position: 'absolute',
                            right: '0rem',
                            top: '-2.5rem',
                            cursor: 'pointer'
                        })
                    ],
                    onclick() {
                        const data = _msgr.get('devOverLoadData') || [];
                        let list = [['区域名称', '过载数量', '重载数量']];
                        for (let item of data) {
                            list.push([item?.regionName, item?.overloadCnt, item?.heavyLoadCnt]);
                        }
                        nusp.exportArray2Excel(list, '实时重过载数量统计');
                    }
                },
                {
                    type: 'wrapper',
                    styles: [Styles.titleBox, Styles.css({ height: '1.5rem' })],
                    components: [
                        {
                            type: 'label',
                            class: 'overloadTitle',
                            cap: '{{_overloadTitle}}'
                        }
                    ]
                },
                {
                    type: 'barWithTotal',
                    props: {
                        title: '重过载总计',
                        unit: '次',
                        hasValue: true,
                        hasTags: false,
                        barWidth: '1rem',
                        tipFormatter: null,
                        showSplitArea: true,
                        showSplitLineX: true
                    },
                    varsUrl: {
                        method: 'post',
                        data: {
                            devType: 2
                        },
                        url: urlConfig.getOverloadRegionStatistics.url,
                        mock: mockPath + urlConfig.getOverloadRegionStatistics.mock,
                        transform: function (res) {
                            const chartData = [['', '过载', '重载']];
                            let data = res.data;
                            _msgr.pub('devOverLoadData', data);
                            data.forEach(function (item) {
                                chartData.push([item.regionName, item.overloadCnt, item.heavyLoadCnt]);
                            });
                            let overloadCntArr = data.map((item) => item.overloadCnt);
                            let heavyLoadCntArr = data.map((item) => item.heavyLoadCnt);
                            let maxOverloadCnt = Math.max(...overloadCntArr);
                            let maxHeavyLoadCnt = Math.max(...heavyLoadCntArr);
                            let maxOverloadCntName = data.find((item) => item.overloadCnt == maxOverloadCnt).regionName;
                            let maxHeavyLoadCntName = data.find((item) => item.heavyLoadCnt == maxHeavyLoadCnt).regionName;

                            const _overloadTitle = `<div>设备过载以 <b style="color:${jam.colorText()}">${maxOverloadCntName}</b> 数量最多，设备重载以 <b style="color:${jam.colorText()}">${maxHeavyLoadCntName}</b> 数量最多</div>`;
                            _msgr.pub('_overloadTitle', _overloadTitle);
                            return {
                                data: {
                                    chartData
                                }
                            };
                        }
                    },
                    watchers: {},
                    onmount: function () {
                        _model = this.model;
                    },
                    styles: ['barWithTotal.basic', 'css(width:100%;height:calc(100% - 1.6rem);)'],
                    onafterrender: async function () {
                        _el = jam.findElement(this.element, 'jam-chart');
                        await _el.chartReady;
                        barOptions = jam.cloneDeep(_el.chartOption);
                        if (initialParams?.index !== undefined) {
                            let { index, type, name } = initialParams;
                            setTimeout(() => {
                                highlightBarByIndex(index, type, name);
                            }, 0);
                        }
                        _el.chart.on('click', (params) => {
                            if (params.componentType === 'series') {
                                // 柱状图点击变色
                                let seriesIndex = params.dataIndex;
                                let seriesName = params.seriesName;

                                if (!rambutan.getPath().includes('overload_songjian')) {
                                    rambutan.switchTo('/statistic/overload_songjian', {
                                        token: jam.getUrlParam('token')
                                    });
                                    mango.pub('devOverLoadArea', {
                                        name: params.name,
                                        index: seriesIndex
                                    });
                                } else {
                                    if (clickIndex == seriesIndex && clickSeriesName == seriesName) {
                                        renderStartStatus();
                                        mango.pub('devOverLoadArea', {
                                            name: '',
                                            index: -1
                                        });
                                    } else {
                                        highlightBarByIndex(seriesIndex, seriesName, params.name);

                                        mango.pub('devOverLoadArea', {
                                            name: areaName,
                                            index: seriesIndex
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            ]
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        mango.sub('devOverLoadParmas', function (params) {
            if (params && barOptions) {
                let { index, type, name } = params;
                highlightBarByIndex(index, type, name);
            }

            // 保存初始参数供图表初始化时使用
            initialParams = params;
        });
    }
};

/**
 * 渲染默认状态
 */
function renderStartStatus() {
    barOptions.xAxis.axisLabel = {
        color: 'hsl(0, 0%, 64.31%)',
        interval: 0,
        formatter: function (value, idx) {
            return `{a|${value}}`;
        },
        rich: {
            a: {
                fontWeight: 'normal',
                fontSize: jam.rem(0.87)
            }
        }
    };
    clickIndex = null;
    clickSeriesName = null;
    areaName = null;
    _el.chart.setOption(barOptions);
}

// 根据索引高亮柱体的函数
function highlightBarByIndex(index, type, name) {
    if (index == -1) {
        renderStartStatus();
        return;
    }
    barOptions.xAxis.axisLabel = {
        color: function (value, idx) {
            const color = `rgba(${jam.accolor._rgb})`;
            return idx === index ? color : 'hsl(0, 0%, 64.31%)';
        },
        formatter: function (value, idx) {
            // 根据 index 决定是否加粗
            return idx === index ? `{a|${value}}` : value;
        },
        rich: {
            a: {
                fontWeight: 'bold',
                fontSize: 16
            }
        },
        interval: 0
    };
    _el.chart.setOption(barOptions);
    areaName = name;
    clickIndex = index;
    clickSeriesName = type;
}
