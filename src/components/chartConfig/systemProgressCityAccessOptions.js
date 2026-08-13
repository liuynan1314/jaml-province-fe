export function systemProgressCityAccessOptions(newBarData) {
    newBarData.sort(function (a, b) {
        if (a.value1 !== b.value1) {
            return b.value1 - a.value1;
        } else {
            // return b.value2 - a.value2;
            return b.value3 - a.value3;
        }
    });
    var data1 = [],
        data2 = [],
        xData = [];
    newBarData.forEach(function (item) {
        data1.push(item.value1);
        // data2.push(item.value2);
        data2.push(item.value3);
        xData.push(item.name);
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
    const series0 = jam.acToken[0]();
    const series1 = jam.acToken[1]();
    return {
        grid: {
            top: '20%',
            left: '0.3%',
            right: '0.3%',
            bottom: '0%',
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
            top: '1%',
            selectedMode: false,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
                color: Tokens.color.fg.muted
            },
            data: [
                {
                    name: '变电站接入率',
                    itemStyle: {
                        color: series0
                    }
                },
                {
                    // name: '双通道接入率',
                    name: '通道故障率',
                    itemStyle: {
                        color: series1
                    }
                }
            ]
        },
        xAxis: {
            type: 'category',
            data: xData,
            axisLine: {
                lineStyle: {
                    color: Tokens.color.outline.subtle
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    color: Tokens.color.outline.subtle
                }
            },
            axisLabel: {
                color: Tokens.color.fg.muted
            }
        },
        yAxis: {
            max: 100,
            type: 'value',
            name: '%',
            nameTextStyle: {
                color: Tokens.color.fg.muted,
                padding: [0, 0, 0, -30]
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: Tokens.color.outline.subtle
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: Tokens.color.outline.subtle
                }
            },
            axisLabel: {
                color: function (value) {
                    if (value === '80') {
                        return jam.getColor('error').css();
                    } else {
                        return Tokens.color.fg.muted;
                    }
                }
            }
        },
        series: [
            // // 柱子
            {
                z: 0,
                name: '变电站接入率',
                data: data1,
                type: 'bar',
                barWidth: 23,
                barGap: '30',
                label: {
                    show: true,
                    position: 'top',
                    distance: 12,
                    fontFamily: 'DINPro',
                    textStyle: {
                        color: series0,
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
                        color: jam.getColor('error').css()
                    },
                    data: [
                        {
                            yAxis: 80
                        }
                    ]
                },
                itemStyle: {
                    color: function () {
                        return jam.toEchartsGradient(90, series0, Tokens.color.transparent);
                    }
                }
            },
            // 最上面线
            {
                type: 'pictorialBar',
                symbol: 'react',
                symbolSize: [6, 3],
                // symbolOffset: [-26, -6],
                symbolOffset: [-8, -6],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return params.value ? series0 : Tokens.color.transparent;
                    },
                    shadowColor: series0,
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(data1)
            },
            {
                type: 'pictorialBar',
                symbol: 'react',
                symbolSize: [6, 3],
                // symbolOffset: [-18, -6],
                symbolOffset: [0, -6],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return params.value ? series0 : Tokens.color.transparent;
                    },
                    shadowColor: series0,
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(data1)
            },
            {
                type: 'pictorialBar',
                symbol: 'react',
                symbolSize: [6, 3],
                // symbolOffset: [-10, -6],
                symbolOffset: [8, -6],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return params.value ? series0 : Tokens.color.transparent;
                    },
                    shadowColor: series0,
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
                itemStyle: {
                    color: Tokens.color.neutral.veil
                },
                tooltip: {
                    show: false
                },
                symbolRepeat: 'fixed',
                symbolMargin: 3,
                symbol: 'rect',
                symbolClip: true,
                symbolSize: [30, 1],
                symbolRotate: 45,
                // symbolOffset: [-18, 1],
                symbolOffset: [-1, 1],
                data: data1,
                z: 1
            },
            // 柱子
            {
                z: 0,
                data: data2,
                // name: '双通道接入率',
                name: '通道故障率',
                type: 'bar',
                barWidth: 23,
                barGap: '50%',
                label: {
                    show: true,
                    position: 'top',
                    distance: 12,
                    fontFamily: 'DINPro',
                    textStyle: {
                        color: series1,
                        fontWeight: 'bolder',
                        fontSize: 12
                    }
                },
                itemStyle: {
                    color: function () {
                        return jam.toEchartsGradient(90, series1, Tokens.color.transparent);
                    }
                }
            },
            // 最上面线
            {
                type: 'pictorialBar',
                symbol: 'react',
                symbolSize: [6, 3],
                symbolOffset: [9, -6],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return params.value ? series1 : Tokens.color.transparent;
                    },
                    shadowColor: series1,
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(data2)
            },
            {
                type: 'pictorialBar',
                symbol: 'react',
                symbolSize: [6, 3],
                symbolOffset: [17, -6],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return params.value ? series1 : Tokens.color.transparent;
                    },
                    shadowColor: series1,
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(data2)
            },
            {
                type: 'pictorialBar',
                symbol: 'react',
                symbolSize: [6, 3],
                symbolOffset: [25, -6],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return params.value ? series1 : Tokens.color.transparent;
                    },
                    shadowColor: series1,
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
                itemStyle: {
                    color: Tokens.color.neutral.veil
                },
                tooltip: {
                    show: false
                },
                symbolRepeat: 'fixed',
                symbolMargin: 3,
                symbol: 'rect',
                symbolClip: true,
                symbolSize: [30, 1],
                symbolRotate: 45,
                symbolOffset: [18, 1],
                data: data2,
                z: 1
            }
        ]
    };
}
