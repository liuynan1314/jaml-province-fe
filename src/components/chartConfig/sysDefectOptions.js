export function sysDefectOptions(xData, yData) {
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
    const accent = jam.acToken[0]();
    const accentSoft = jam.acToken[1]();
    return {
        grid: {
            top: '15%',
            left: '3%',
            right: '5%',
            bottom: '7%',
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
                    color: Tokens.color.outline.subtle
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    color: Tokens.color.outline.subtle
                }
            },
            axisLabel: {
                interval: 0,
                color: Tokens.color.fg.muted
            }
        },
        yAxis: {
            type: 'value',
            minInterval: 1,
            name: '个',
            nameTextStyle: {
                color: Tokens.color.fg.muted
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
                color: Tokens.color.fg.muted
            }
        },
        series: [
            // 左边边框
            {
                data: yData,
                name: '缺陷次数',
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
                    color: function () {
                        return jam.toEchartsGradient(90, accent, Tokens.color.transparent);
                    }
                },
                z: 99
            },
            // 柱子
            {
                z: 0,
                data: yData,
                name: '缺陷次数',
                type: 'bar',
                barWidth: 30,
                label: {
                    show: true,
                    position: 'top',
                    distance: 12,
                    fontFamily: 'DINPro',
                    textStyle: {
                        color: accent,
                        fontWeight: 'bolder',
                        fontSize: 16
                    }
                },
                itemStyle: {
                    color: function () {
                        return jam.toEchartsGradient(90, Tokens.color.primary.default, Tokens.color.transparent);
                    }
                }
            },
            // 右边边框
            {
                z: 99,
                data: yData,
                name: '缺陷次数',
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
                    color: function () {
                        return jam.toEchartsGradient(90, accent, Tokens.color.transparent);
                    }
                },
                barGap: 0
            },
            // 顶部边框
            {
                type: 'pictorialBar',
                name: '缺陷次数',
                symbol: 'react',
                symbolSize: [32, 1],
                symbolOffset: [0, -1],
                z: 12,
                itemStyle: {
                    color: function () {
                        return accent;
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
                name: '缺陷次数',
                symbol: 'react',
                symbolSize: [9, 3],
                symbolOffset: [-11, -10],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return params.value ? accent : Tokens.color.transparent;
                    },
                    shadowColor: accent,
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(yData)
            },
            {
                type: 'pictorialBar',
                name: '缺陷次数',
                symbol: 'react',
                symbolSize: [9, 3],
                symbolOffset: [0, -10],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return params.value ? accentSoft : Tokens.color.transparent;
                    },
                    shadowColor: accentSoft,
                    shadowBlur: 4
                },
                tooltip: {
                    show: false
                },
                data: getSymbolData(yData)
            },
            {
                type: 'pictorialBar',
                name: '缺陷次数',
                symbol: 'react',
                symbolSize: [9, 3],
                symbolOffset: [11, -10],
                z: 12,
                itemStyle: {
                    color: function (params) {
                        return params.value ? accent : Tokens.color.transparent;
                    },
                    shadowColor: accent,
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
                name: '缺陷次数',
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
                symbolSize: [42, 1],
                symbolRotate: 45,
                symbolOffset: [1, 1],
                data: yData,
                z: 1
            }
        ]
    };
}
