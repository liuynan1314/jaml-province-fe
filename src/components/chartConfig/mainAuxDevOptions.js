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
                color: '#77ABC4'
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
                        color: 'rgb(30, 61, 74)'
                    }
                },
                axisLabel: {
                    color: '#77ABC4',
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
                        color: 'rgb(30, 61, 74)'
                    }
                },
                max: max,
                nameTextStyle: {
                    color: '#fff'
                },
                axisLabel: {
                    color: '#77ABC4',
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
                    color: '#fff',
                    borderColor: 'rgba(88,107,197,0.4)',
                    borderWidth: 12
                },
                smooth: true,
                showSymbol: true,
                lineStyle: {
                    color: '#5B6FCC'
                },

                data: lastYearList
            },
            {
                type: 'line',
                name: '今年',
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    color: '#fff',
                    borderColor: 'rgba(245,205,102,0.4)',
                    borderWidth: 12
                },
                smooth: true,
                lineStyle: {
                    color: '#DBB462'
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
                color: '#77ABC4'
            }
        },
        xAxis: {
            type: 'category',
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#0F3D4E',
                    width: 2
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#0F3D4E'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                fontSize: 14,
                color: '#77ABC4',
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
                    color: '#0F3D4E'
                }
            },
            axisLabel: {
                color: '#77ABC4',
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
                        color: {
                            type: 'linear',
                            x: 1,
                            x2: 0,
                            y: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#85ACF4'
                                },
                                {
                                    offset: 0.5,
                                    color: '#5388D8'
                                },
                                {
                                    offset: 1,
                                    color: '#2564B9'
                                }
                            ]
                        },
                        borderRadius: [10, 10, 0, 0]
                    }
                },
                data: thisYearList
            }
        ]
    };
}
