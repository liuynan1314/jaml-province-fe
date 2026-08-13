export function importantUserNumChartsOptions(data) {
    const barData = [];
    const lineData = [];
    const xdata = [];
    const group = [];
    data.forEach((item) => {
        lineData.push(item.num);
        barData.push(item.num);
        xdata.push(item.regionName);
    });

    return {
        grid: {
            left: '5%',
            right: '5%',
            bottom: '5%',
            top: '5%',
            containLabel: true
        },

        xAxis: [
            {
                type: 'category',
                data: xdata,
                axisPointer: {
                    type: 'shadow'
                },
                axisLine: {
                    lineStyle: {
                        color: Tokens.color.outline.subtle
                    }
                },
                axisLabel: {
                    interval: 0,
                    lineHeight: 14,
                    fontSize: 12,
                    color: Tokens.color.fg.default,
                    margin: 10
                }
            },
            {
                type: 'category',
                data: group,
                axisPointer: {
                    type: 'shadow'
                },
                axisLine: {
                    lineStyle: {
                        color: Tokens.color.outline.subtle
                    }
                },
                position: 'top'
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    color: Tokens.color.fg.default
                },
                axisLine: {
                    lineStyle: {
                        color: Tokens.color.outline.subtle
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: Tokens.color.outline.subtle,
                        type: 'dashed'
                    }
                }
            }
        ],
        series: [
            {
                type: 'bar',
                barWidth: '60%',
                symbolClip: true,
                data: barData,
                itemStyle: {
                    normal: {
                        color: jam.toEchartsGradient(
                            90,
                            Tokens.color.primary.subtle,
                            Tokens.color.primary.default,
                            Tokens.color.primary.strong
                        )
                    }
                }
            },
            {
                data: lineData,
                type: 'line',
                color: jam.acToken[0]()
            }
        ]
    };
}
