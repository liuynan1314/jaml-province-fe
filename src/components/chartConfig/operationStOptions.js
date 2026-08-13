export function operationStOptions(data, sortFlag) {
    const newBarData = JSON.parse(JSON.stringify(data));
    if (sortFlag == 2) {
        newBarData.sort(function (a, b) {
            if (a.count !== b.count) {
                return b.count - a.count;
            } else {
                return b.failCount - a.failCount;
            }
        });
    } else if (sortFlag == 1) {
        newBarData.sort(function (a, b) {
            if (a.count !== b.count) {
                return a.count - b.count;
            } else {
                return a.failCount - b.failCount;
            }
        });
    }
    var data1 = [],
        data2 = [],
        xData = [];
    newBarData.forEach(function (item) {
        data1.push(item.count || 0);
        data2.push(item.failCount || 0);
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
            },
            formatter: function (params) {
                const successData = params.find((item) => item.seriesName === '成功');
                const failData = params.find((item) => item.seriesName === '失败');
                let sum = successData.value + failData.value;
                const successPer = sum == 0 ? '0%' : Number((successData.value / sum) * 100).toFixed(0) + '%';
                let html = `<div style="font-weight:bold;margin-bottom:10px;">${successData.name}</div>`;
                html += `<div>${successData.marker}成功: ${successData.value}</div>
                    <div>${failData.marker}失败: ${failData.value}</div>
                    <div>${failData.marker}成功率: ${successPer}</div>
                    `;
                return html;
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
                    name: '成功',
                    itemStyle: {
                        color: 'rgba(0, 113, 194, 1)'
                    }
                },
                {
                    name: '失败',
                    itemStyle: {
                        color: 'hsl(0, 100%, 66.1%)'
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
                color: 'hsl(201.6, 33.3%, 64.1%)'
            }
        },
        series: [
            // // 柱子
            {
                z: 0,
                name: '成功',
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
                        color: 'rgba(0, 113, 194, 1)',
                        fontWeight: 'bolder',
                        fontSize: 12
                    }
                },
                itemStyle: {
                    color: function (params) {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: `rgba(0, 113, 194, 1)`
                            },
                            {
                                offset: 1,
                                color: `rgba(0, 113, 194, 0)`
                            }
                        ]);
                    }
                }
            },
            // 最上面线
            {
                type: 'pictorialBar',
                name: '成功',
                symbol: 'react',
                symbolSize: [6, 2],
                symbolOffset: [-14, -4],
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
                data: getSymbolData(data1)
            },
            {
                type: 'pictorialBar',
                name: '成功',
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
                data: getSymbolData(data1)
            },
            // // 斜线填充
            {
                type: 'pictorialBar',
                name: '成功',
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
            //
            {
                z: 0,
                data: data2,
                name: '失败',
                type: 'bar',
                barWidth: 15,
                barGap: '20%',
                label: {
                    show: true,
                    position: 'top',
                    distance: 12,
                    fontFamily: 'DINPro',
                    textStyle: {
                        color: 'hsl(0, 100%, 66.1%) ',
                        fontWeight: 'bolder',
                        fontSize: 12
                    }
                },
                itemStyle: {
                    color: function (params) {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: `hsl(0, 100%, 66.1%)`
                            },
                            {
                                offset: 1,
                                color: `hsla(0, 100%, 66.1%,0)`
                            }
                        ]);
                    }
                }
            },
            // 最上面线
            {
                type: 'pictorialBar',
                name: '失败',
                symbol: 'react',
                symbolSize: [6, 2],
                symbolOffset: [4, -4],
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
                data: getSymbolData(data2)
            },
            {
                type: 'pictorialBar',
                name: '失败',
                symbol: 'react',
                symbolSize: [6, 2],
                symbolOffset: [14, -4],
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
                data: getSymbolData(data2)
            },
            // 斜线填充
            {
                type: 'pictorialBar',
                name: '失败',
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
