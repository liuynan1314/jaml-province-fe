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
                color: 'hsl(201.6, 33.3%, 64.1%)'
            },
            data: [
                {
                    name: '变电站接入率',
                    itemStyle: {
                        color: 'hsl(195.3, 100%, 56.1%)'
                    }
                },
                {
                    // name: '双通道接入率',
                    name: '通道故障率',
                    itemStyle: {
                        color: 'hsl(45, 69.6%, 63.9%)'
                    }
                }
            ]
        },
        xAxis: {
            type: 'category',
            data: xData,
            axisLine: {
                lineStyle: {
                    color: '#2e3e54'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    color: '#2e3e54'
                }
            },
            axisLabel: {
                color: 'hsl(201.6, 33.3%, 64.1%)'
            }
        },
        yAxis: {
            max: 100,
            type: 'value',
            name: '%',
            nameTextStyle: {
                color: 'hsl(201.6, 33.3%, 64.1%)',
                padding: [0, 0, 0, -30]
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#2e3e54'
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: '#2e3e54'
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
                        color: '#28a9f7',
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
                        color: 'hsl(12.7, 58.4%, 55.7%)'
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
                                color: `hsl(202.9, 92.8%, 56.3%) `
                            },
                            {
                                offset: 1,
                                color: `hsla(202.9, 92.8%, 56.3%, 0)`
                            }
                        ]);
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
                        return `${params.value ? '#1ec1fa' : 'rgba(0,0,0,0'}`;
                    },
                    shadowColor: '#1ec1fa',
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
                        return `${params.value ? '#1ec1fa' : 'rgba(0,0,0,0'}`;
                    },
                    shadowColor: '#1ec1fa',
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
                        return `${params.value ? '#1ec1fa' : 'rgba(0,0,0,0'}`;
                    },
                    shadowColor: '#1ec1fa',
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
                    color: 'rgba(255,255,255,0.15)'
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
                        color: 'hsl(45, 69.6%, 63.9%) ',
                        fontWeight: 'bolder',
                        fontSize: 12
                    }
                },
                itemStyle: {
                    color: function (params) {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: `hsl(45, 69.6%, 63.9%)`
                            },
                            {
                                offset: 1,
                                color: `hsla(45, 69.6%, 63.9%, 0)`
                            }
                        ]);
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
                symbol: 'react',
                symbolSize: [6, 3],
                symbolOffset: [17, -6],
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
                symbol: 'react',
                symbolSize: [6, 3],
                symbolOffset: [25, -6],
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
            // 斜线填充
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
                symbolSize: [30, 1],
                symbolRotate: 45,
                symbolOffset: [18, 1],
                data: data2,
                z: 1
            }
        ]
    };
}
