export function getLineChartOptions(data) {
    let lastYearList = [];
    let thisYearList = [];
    let xAisList = [];
    data.forEach((item) => {
        lastYearList.push(item.lastYear);
        thisYearList.push(item.thisYear);
        xAisList.push(item.month);
    });
    const max = Math.ceil(Math.max(...thisYearList, ...lastYearList) / 10) * 10;
    return {
        grid: {
            left: '5%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        legend: {
            top: '3%',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                color: Tokens.color.fg.muted
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: [
            {
                type: 'category',
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: Tokens.color.outline.subtle
                    }
                },
                axisLabel: {
                    color: Tokens.color.fg.muted,
                    fontSize: 14,
                    fontFamily: 'SourceHanSansCN-Regular'
                },
                data: xAisList
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: Tokens.color.outline.subtle
                    }
                },
                max: max,
                nameTextStyle: {
                    color: Tokens.color.fg.default
                },
                axisLabel: {
                    color: Tokens.color.fg.muted,
                    fontSize: 14,
                    fontFamily: 'SourceHanSansCN-Regular'
                }
            }
        ],
        series: [
            {
                type: 'line',
                name: '去年',
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    color: Tokens.color.fg.default,
                    borderColor: jam.acToken[0](1, 1, 1, 0.4),
                    borderWidth: 12
                },
                smooth: true,
                showSymbol: true,
                lineStyle: {
                    color: jam.acToken[0]()
                },

                data: lastYearList
            },
            {
                type: 'line',
                name: '今年',
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    color: Tokens.color.fg.default,
                    borderColor: jam.acToken[1](1, 1, 1, 0.4),
                    borderWidth: 12
                },
                smooth: true,
                lineStyle: {
                    color: jam.acToken[1]()
                },

                data: thisYearList
            }
        ]
    };
}

export function getBarChartOptions(thisYearList = [], xAisList) {
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        legend: {
            show: true,
            icon: 'rect',
            top: '3%',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                color: Tokens.color.fg.muted
            }
        },
        xAxis: {
            type: 'category',
            axisLine: {
                show: true,
                lineStyle: {
                    color: Tokens.color.outline.subtle,
                    width: 2
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: Tokens.color.outline.subtle
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                fontSize: 14,
                color: Tokens.color.fg.muted,
                interval: 0
            },
            data: xAisList
        },
        yAxis: {
            show: true,
            axisLine: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: Tokens.color.outline.subtle
                }
            },
            axisLabel: {
                color: Tokens.color.fg.muted,
                fontSize: 14
            }
        },
        series: [
            {
                type: 'bar',
                name: '当日',
                barWidth: '15',
                itemStyle: {
                    normal: {
                        color: jam.toEchartsGradient(
                            135,
                            Tokens.color.primary.subtle,
                            Tokens.color.primary.default,
                            Tokens.color.primary.strong
                        ),
                        borderRadius: [10, 10, 0, 0]
                    }
                },
                data: thisYearList
            }
        ]
    };
}
