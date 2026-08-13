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
                    color: Tokens.color.outline.subtle,
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
                color: Tokens.color.fg.muted,
                interval: 0
            },
            data: xAisData
        },
        yAxis: {
            show: true,
            nameTextStyle: {
                fontSize: 14,
                color: Tokens.color.fg.muted
            },
            axisLine: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
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
                barWidth: '16',
                itemStyle: {
                    normal: {
                        color: jam.toEchartsGradient(
                            135,
                            jam.acToken[1](),
                            [jam.acToken[1](1, 1, 1, 0.5), 0.5],
                            jam.acToken[1](1, 1, 1, 0.1)
                        )
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    color: Tokens.color.fg.muted,
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
                    shadowColor: Tokens.color.fg.default,
                    shadowBlur: 10,
                    color: Tokens.color.fg.default
                },
                data: seriesData
            }
        ]
    };
}
