import { hslaToJamAc } from '../utils/Constants.js';
import { ajaxCall } from '../common.js';
let _model,
    _msgr = null;
let clickIndex, clickSeriesName, areaName; //点击记录
let barEchart;
let barOptions = {};
let initialParams = null; // 保存初始化参数

export default {
    type: 'card',
    class: 'devOverLoad',
    styles: [
        Styles.css({
            '--jam-card-bodyslot-padding': '0.5rem 1rem 0 1rem'
        }),
        'size.fullsize',
        Styles.stylesheet({
            '.content-wrapper': {
                width: '100%',
                height: '100%',
                flexDirection: 'column'
            },
            '.overloadTitle': {
                width: '100%',
                height: '2rem'
            },
            '.devload-box': {
                width: '100%',
                height: 'calc(100% - 2rem)'
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            class: 'content-wrapper',
            components: [
                {
                    type: 'label',
                    icon: 'download',
                    attrs: {
                        title: '导出图表数据'
                    },
                    styles: [
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
                    type: 'label',
                    class: 'overloadTitle',
                    cap: '{{_overloadTitle}}'
                },
                {
                    type: 'wrapper',
                    class: 'devload-box'
                }
            ]
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        onRenderBarChart();
        mango.sub('devOverLoadParmas', function (params) {
            if (params?.totalTime || params?.bvName) {
                renderStartStatus();
                barEchart.setOption(barOptions, true);
            }
            if (params?.index !== undefined) {
                let { index, type, name } = params;
                highlightBarByIndex(index, type, name);
            }
            // 保存初始参数供图表初始化时使用
            initialParams = params;
        });
    }
};

// 根据索引高亮柱体的函数
function highlightBarByIndex(index, type, name) {
    if (type == '过载') {
        barOptions.series[0].itemStyle = {
            color: function (params) {
                if (params.dataIndex === index) {
                    return `hsl(0, 94.13%, 49.97%)`;
                } else {
                    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: `hsl(0,100%,66.1%)`
                        },
                        {
                            offset: 1,
                            color: `hsla(0,100%,66.1%,0)`
                        }
                    ]);
                }
            }
        };
        barOptions.series[4].itemStyle = {
            color: function (params) {
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: `hsl(45,69.6%,63.9%)`
                    },
                    {
                        offset: 1,
                        color: `hsla(45,69.6%,63.9%,0)`
                    }
                ]);
            }
        };
    } else {
        barOptions.series[4].itemStyle = {
            color: function (params) {
                if (params.dataIndex === index) {
                    return `hsl(45,97.13% ,48.92%)`;
                } else {
                    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: `hsl(45,69.6%,63.9%)`
                        },
                        {
                            offset: 1,
                            color: `hsla(45,69.6%,63.9%,0)`
                        }
                    ]);
                }
            }
        };
        barOptions.series[0].itemStyle = {
            color: function (params) {
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: `hsl(0,100%,66.1%)`
                    },
                    {
                        offset: 1,
                        color: `hsla(0,100%,66.1%,0)`
                    }
                ]);
            }
        };
    }
    barOptions.xAxis.axisLabel = {
        color: function (value, idx) {
            const color = `rgba(${jam.accolor._rgb})`;
            return idx === index ? color : 'hsl(201.6, 33.3%, 64.1%)';
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
    areaName = name;
    clickIndex = index;
    clickSeriesName = type;
    barEchart.setOption(barOptions, true);
}

function onRenderBarChart() {
    ajaxCall(
        'getOverloadRegionStatistics',
        {
            success(data) {
                _msgr.pub('devOverLoadData', data);
                let name__ = [],
                    value__ = [],
                    maxHeavyNum = 0,
                    maxHeavyNumName = '',
                    maxOverloadNum = 0,
                    maxOverloadNumName = '',
                    value = [];
                (data || []).forEach((v) => {
                    if (v.heavyLoadCnt && maxHeavyNum < v.heavyLoadCnt) {
                        maxHeavyNum = v.heavyLoadCnt;
                        maxHeavyNumName = v.regionName;
                    }
                    if (v.overloadCnt && maxOverloadNum < v.overloadCnt) {
                        maxOverloadNum = v.overloadCnt;
                        maxOverloadNumName = v.regionName;
                    }

                    name__.push(v.regionName);
                    value__.push(v.heavyLoadCnt);
                    value.push(v.overloadCnt);
                });
                const _overloadTitle = `<div>设备过载以 <b style="color:${jam.colorText()}">${maxOverloadNumName}</b> 数量最多，设备重载以 <b style="color:${jam.colorText()}">${maxHeavyNumName}</b> 数量最多</div>`;
                _msgr.pub('_overloadTitle', _overloadTitle);

                barEchart = echarts.init(document.querySelector('.devload-box'));
                barEchart.setOption(setDevOverloadEcharts(data), true);

                // 如果存在初始参数且包含index，则在图表初始化时高亮对应柱体
                if (initialParams?.index !== undefined) {
                    let { index, type, name } = initialParams;
                    setTimeout(() => {
                        highlightBarByIndex(index, type, name);
                    }, 0);
                }

                barEchart.off();
                barEchart.on('click', function (params) {
                    if (params.componentType === 'series') {
                        // 柱状图点击变色
                        let seriesIndex = params.dataIndex;
                        let seriesName = params.seriesName;

                        if (!rambutan.getPath().includes('overload_songjian')) {
                            rambutan.switchTo('/statistic/overload_songjian', {
                                token: jam.getUrlParam('token')
                            });
                            mango.pub('devOverLoadParmas', {
                                name: params.name,
                                type: seriesName,
                                index: seriesIndex
                            });
                        } else {
                            if (clickIndex == seriesIndex && clickSeriesName == seriesName) {
                                renderStartStatus();
                            } else {
                                highlightBarByIndex(seriesIndex, seriesName, params.name);
                            }
                            barEchart.setOption(barOptions, true);

                            mango.pub('devOverLoadParmas', {
                                name: areaName,
                                type: clickSeriesName
                            });
                        }
                    }
                });
            },
            params: {},
            useMock: false,
            type: 'post'
        },
        false
    );
}

function setDevOverloadEcharts(newBarData) {
    newBarData.sort(function (a, b) {
        if (a.overloadCnt !== b.overloadCnt) {
            return b.overloadCnt - a.overloadCnt;
        } else {
            return b.heavyLoadCnt - a.heavyLoadCnt;
        }
    });
    var data1 = [],
        data2 = [],
        xData = [];
    newBarData.forEach(function (item) {
        data1.push(item.overloadCnt);
        data2.push(item.heavyLoadCnt);
        xData.push(item.regionName);
    });
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
    barOptions = {
        grid: {
            top: '10%',
            left: '0.3%',
            right: '0.3%',
            bottom: '10%',
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
            },
            data: [
                {
                    name: '过载',
                    itemStyle: {
                        color: 'hsl(0, 100%, 66.1%)'
                    }
                },
                {
                    name: '重载',
                    itemStyle: {
                        color: 'hsl(45,69.6%,63.9%)'
                    }
                }
            ]
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
                color: function (value) {
                    if (value === '80') {
                        return 'hsl(12.7, 58.4%, 55.7%)';
                    } else {
                        return 'hsl(201.6, 33.3%, 64.1%)';
                    }
                }
            }
        },
        series: [
            // // 柱子
            {
                z: 0,
                name: '过载',
                data: data1,
                type: 'bar',
                barWidth: 15,
                // barGap: '',
                label: {
                    show: true,
                    position: 'top',
                    distance: 12,
                    fontFamily: 'DINPro',
                    textStyle: {
                        color: 'hsl(0, 100%, 66.1%)',
                        fontWeight: 'bolder',
                        fontSize: 12
                    }
                },
                markLine: {
                    silent: true,
                    symbol: 'none',
                    label: {
                        show: false
                    },
                    lineStyle: {
                        color: 'hsl(0,100%,66.1%)'
                    },
                    data: [
                        {
                            yAxis: 80
                        }
                    ]
                },
                itemStyle: {
                    color: function (params) {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: `hsl(0,100%,66.1%)`
                            },
                            {
                                offset: 1,
                                color: `hsla(0,100%,66.1%,0)`
                            }
                        ]);
                    }
                }
            },
            // 最上面线
            {
                type: 'pictorialBar',
                name: '过载',
                symbol: 'react',
                symbolSize: [6, 2],
                symbolOffset: [-14, -4],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return `${params.value ? 'hsl(0, 100%, 66.1%)' : 'rgba(0,0,0,0'}`;
                    },
                    shadowColor: 'hsl(0, 100%, 66.1%)',
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(data1)
            },
            {
                type: 'pictorialBar',
                name: '过载',
                symbol: 'react',
                symbolSize: [6, 2],
                symbolOffset: [-4, -4],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return `${params.value ? 'hsl(0, 100%, 66.1%)' : 'rgba(0,0,0,0'}`;
                    },
                    shadowColor: 'hsl(0, 100%, 66.1%)',
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(data1)
            },
            // // 斜线填充
            {
                type: 'pictorialBar',
                name: '过载',
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
                symbolOffset: [-10, 1],
                data: data1,
                z: 1
            },
            // 柱子
            {
                z: 0,
                data: data2,
                name: '重载',
                type: 'bar',
                barWidth: 15,
                barGap: '20%',
                label: {
                    show: true,
                    position: 'top',
                    distance: 12,
                    fontFamily: 'DINPro',
                    textStyle: {
                        color: 'hsl(45,69.6%,63.9%) ',
                        fontWeight: 'bolder',
                        fontSize: 12
                    }
                },
                itemStyle: {
                    color: function (params) {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: `hsl(45,69.6%,63.9%)`
                            },
                            {
                                offset: 1,
                                color: `hsla(45,69.6%,63.9%,0)`
                            }
                        ]);
                    }
                }
            },
            // 最上面线
            {
                type: 'pictorialBar',
                name: '重载',
                symbol: 'react',
                symbolSize: [6, 2],
                symbolOffset: [4, -4],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return `${params.value ? 'hsla(45, 69.6%, 63.9%)' : 'rgba(0,0,0,0'}`;
                    },
                    shadowColor: 'hsla(45, 69.6%, 63.9%)',
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(data2)
            },
            {
                type: 'pictorialBar',
                name: '重载',
                symbol: 'react',
                symbolSize: [6, 2],
                symbolOffset: [14, -4],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return `${params.value ? 'hsl(45, 69.6%, 63.9%)' : 'rgba(0,0,0,0'}`;
                    },
                    shadowColor: 'hsl(45, 69.6%, 63.9%)',
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(data2)
            },
            // 斜线填充
            {
                type: 'pictorialBar',
                name: '重载',
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
                symbolOffset: [10, 1],
                data: data2,
                z: 1
            }
        ]
    };
    return barOptions;
}

/**
 * 渲染默认状态
 */
function renderStartStatus() {
    barOptions.series[0].itemStyle = {
        color: function (params) {
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                    offset: 0,
                    color: `hsl(0,100%,66.1%)`
                },
                {
                    offset: 1,
                    color: `hsla(0,100%,66.1%,0)`
                }
            ]);
        }
    };
    barOptions.series[4].itemStyle = {
        color: function (params) {
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                    offset: 0,
                    color: `hsl(45,69.6%,63.9%)`
                },
                {
                    offset: 1,
                    color: `hsla(45,69.6%,63.9%,0)`
                }
            ]);
        }
    };
    barOptions.xAxis.axisLabel = {
        color: 'hsl(201.6, 33.3%, 64.1%)',
        interval: 0
    };
    clickIndex = null;
    clickSeriesName = null;
    areaName = null;
}

window.addEventListener('resize', () => {
    if (!barEchart) return;
    barEchart.resize();
});

function getCssVariable(name) {
    console.log(8, jam.colorSet);
    console.log(2222, getComputedStyle(document.documentElement).getPropertyValue('--jam-ac-h').trim());
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
