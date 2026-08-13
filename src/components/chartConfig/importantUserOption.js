export function importantUserNumChartsOptions(data) {
    const colors = ['#94BFFF', '#165DFF', '#14C9C9'];

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
                        color: '#1c1f23'
                    }
                },
                axisLabel: {
                    interval: 0,
                    lineHeight: 14,
                    fontSize: 12,
                    color: '#fff',
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
                        color: '#1c1f23'
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
                    color: '#fff'
                },
                axisLine: {
                    lineStyle: {
                        color: '#1c1f23'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#e6e8ea',
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
                        color: {
                            type: 'linear',
                            x: 0,
                            x2: 0,
                            y: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#E7B198'
                                },
                                {
                                    offset: 0.5,
                                    color: '#AE5D30'
                                },
                                {
                                    offset: 1,
                                    color: '#9F4716'
                                }
                            ]
                        }
                    }
                }
            },
            {
                data: lineData,
                type: 'line',
                color: '#6997ad'
            }
        ]
    };
}
