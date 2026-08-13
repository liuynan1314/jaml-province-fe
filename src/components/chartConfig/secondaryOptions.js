export function secondaryOptions(xData, yData) {
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
    return {
        grid: {
            top: '15%',
            left: '3%',
            right: '5%',
            bottom: '5%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: xData,
            axisLine: {
                lineStyle: {
                    color: 'hsla(217.5, 20%, 39.2%, 0.8)'
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    color: 'hsl(0deg 0% 85.1%,0.15)'
                }
            },
            axisLabel: {
                color: 'hsl(201.6, 33.3%, 64.1%)'
            }
        },
        yAxis: {
            type: 'value',
            minInterval: 1,
            name: '个',
            nameTextStyle: {
                color: 'hsl(201.6, 33.3%, 64.1%)'
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'hsla(217.5, 20%, 39.2%, 0.8)'
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: 'hsl(0deg 0% 85.1%,0.15)'
                }
            },
            axisLabel: {
                color: 'hsl(201.6, 33.3%, 64.1%)'
            }
        },
        series: [
            // 左边边框
            {
                data: yData,
                name: '告警次数',
                type: 'bar',
                barWidth: 1,
                silent: true,
                label: {
                    show: false
                },
                tooltip: {
                    show: false
                },
                itemStyle: {
                    color: function (params) {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#28a9f7'
                            },
                            {
                                offset: 1,
                                color: `rgba(23,94,140, 0)`
                            }
                        ]);
                    }
                },
                z: 99
            },
            // 柱子
            {
                z: 0,
                data: yData,
                name: '告警次数',
                markLine: {
                    silent: true,
                    symbol: 'none',
                    label: {
                        show: true,
                         color: 'hsl(12.7, 58.4%, 55.7%)',
                        formatter:function (params) {
                            return params.name+'\n '+params.value;
                        }
                    },
                    lineStyle: {
                        color: 'hsl(12.7, 58.4%, 55.7%)'
                    },
                    data: [
                        {
                            name: '平均值',
                            // 支持 'average', 'min', 'max'
                            type: 'average'
                        }
                    ]
                },
                type: 'bar',
                barWidth: 30,
                label: {
                    show: true,
                    position: 'top',
                    distance: 12,
                    fontFamily: 'DINPro',
                    textStyle: {
                        color: '#1EC2FC',
                        fontWeight: 'bolder',
                        fontSize: 16
                    }
                },
                itemStyle: {
                    color: function (params) {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: `rgba(23,94,140, 1)`
                            },
                            {
                                offset: 1,
                                color: `rgba(23,94,140, 0)`
                            }
                        ]);
                    }
                }
            },
            // 右边边框
            {
                z: 99,
                data: yData,
                name: '告警次数',
                type: 'bar',
                barWidth: 1,
                silent: true,
                label: {
                    show: false
                },
                tooltip: {
                    show: false
                },
                itemStyle: {
                    color: function (params) {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#28a9f7'
                            },
                            {
                                offset: 1,
                                color: `rgba(23,94,140, 0)`
                            }
                        ]);
                    }
                },
                barGap: 0
            },
            // 顶部边框
            {
                type: 'pictorialBar',
                name: '告警次数',
                symbol: 'react',
                symbolSize: [32, 1],
                symbolOffset: [0, -1],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return `#28a9f7`;
                    }
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(yData)
            },
            // 最上面线
            {
                type: 'pictorialBar',
                name: '告警次数',
                symbol: 'react',
                symbolSize: [9, 3],
                symbolOffset: [-11, -10],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return `${params.value ? '#1ec1fa' : 'rgba(0,0,0,0'}`;
                    },
                    shadowColor: '#1ec1fa',
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(yData)
            },
            {
                type: 'pictorialBar',
                name: '告警次数',
                symbol: 'react',
                symbolSize: [9, 3],
                symbolOffset: [0, -10],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return `${params.value ? '#ece0b5' : 'rgba(0,0,0,0'}`;
                    },
                    shadowColor: '#ece0b5',
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(yData)
            },
            {
                type: 'pictorialBar',
                name: '告警次数',
                symbol: 'react',
                symbolSize: [9, 3],
                symbolOffset: [11, -10],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return `${params.value ? '#1ec1fa' : 'rgba(0,0,0,0'}`;
                    },
                    shadowColor: '#1ec1fa',
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(yData)
            },
            // 斜线填充
            {
                type: 'pictorialBar',
                name: '告警次数',
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
}
