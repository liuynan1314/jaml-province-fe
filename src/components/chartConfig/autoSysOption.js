export function autoSyschartsOption(resData) {
    let xAisData = [];
    let seriesData = [];
    resData.forEach((item) => {
        xAisData.push(item.regionName);
        seriesData.push(item.num || item.cnt);
    });
    return {
        tooltip: {
            trigger: 'axis',
            formatter: '{b} : {c}',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    color: '#233e4c',
                    width: 2
                }
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                fontSize: 14,
                color: '#aec5e8',
                interval: 0
            },
            data: xAisData
        },
        yAxis: {
            show: true,
            nameTextStyle: {
                fontSize: 14,
                color: '#A5BCDE'
            },
            axisLine: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: '#6997ad'
                }
            },
            axisLabel: {
                color: '#A5BCDE',
                fontSize: 14
            }
        },
        series: [
            {
                type: 'bar',
                barWidth: '16',
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
                                    color: 'rgba(239,216,91,1)'
                                },
                                {
                                    offset: 0.5,
                                    color: 'rgba(239,216,91,.5)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(239,216,91,.1)'
                                }
                            ]
                        }
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    color: '#cbe3fe',
                    fontSize: 16,
                    fontStyle: 'bold',
                    fontFamily: 'DIN-Medium',
                    formatter: '{c}',
                    align: 'center'
                },
                data: seriesData
            },
            {
                z: 3,
                type: 'pictorialBar',
                symbolPosition: 'end',
                symbol: 'rect',
                symbolSize: [20, 5],
                itemStyle: {
                    shadowColor: '#fff',
                    shadowBlur: 10,
                    color: '#fff'
                },
                data: seriesData
            }
        ]
    };
}
