export function powerOutageEchartsOption(resData) {
    const chartData = resData.map((item) => {
        return {
            name: item.regionName || '',
            value: item.total
        };
    });

    const colorList = Array.from({ length: 22 }, (_, i) => jam.acToken[i % 10]());
    const sum = chartData.reduce((sum, cur) => sum + cur.value, 0);
    const pieData1 = [];
    const pieData2 = [];
    const gapData = {
        value: sum ? (sum / 100) * 0.5 : -1,
        itemStyle: {
            color: Tokens.color.transparent
        }
    };
    const lefts = ['50%', '50%', '50%', '50%', '50%', '50%', '50%', '75%', '75%', '75%', '75%', '75%', '75%', '75%'];
    const tops = ['15%', '26.7%', '38.4%', '50.1%', '61.8%', '73.5%', '85.2%', '26.9%', '38.6%', '50.3%', '62%', '73.7%', '85.4%', '97.1%'];
    const legendData = [];

    for (let i = 0; i < chartData.length; i++) {
        pieData1.push(chartData[i], gapData);
        pieData2.push(
            {
                ...chartData[i],
                itemStyle: {
                    color: colorList[i],
                    opacity: 0.15
                }
            },
            gapData
        );
        legendData.push({
            show: true,
            icon: 'rect',
            left: lefts[i],
            top: tops[i],
            itemStyle: {
                color: colorList[i]
            },
            backgroundColor: jam.toEchartsGradient(
                90,
                jam.acToken[0](1, 1, 1, 0.3),
                jam.acToken[0](1, 1, 1, 0.1)
            ),
            borderColor: jam.acToken[0](),
            borderWidth: 1,
            borderRadius: 4,
            width: '100px',
            itemWidth: 12,
            itemHeight: 12,
            formatter: `{aa| ${chartData[i].name} }{bb| ${chartData[i].value} } {bb| ${sum ? parseInt((chartData[i].value / sum) * 100) : 0}%}`,
            x: 'left',
            textStyle: {
                fontFamily: 'SourceHanSansCN-Medium',
                rich: {
                    aa: {
                        color: Tokens.color.fg.default
                    },
                    bb: {
                        color: colorList[i],
                        width: 30,
                        align: 'right'
                    }
                }
            },
            data: [chartData[i].name]
        });
    }

    return {
        tooltip: {
            show: true,
            backgroundColor: 'rgba(0, 0, 0,.8)',
            textStyle: {
                color: Tokens.color.fg.default
            }
        },
        legend: legendData,
        grid: {
            top: 30,
            right: 20,
            bottom: 10,
            left: 10
        },
        color: colorList,
        series: [
            {
                name: '',
                type: 'pie',
                roundCap: true,
                radius: ['62%', '70%'],
                center: ['22%', '50%'],
                label: {
                    normal: {
                        show: true,
                        position: 'center',
                        color: Tokens.color.fg.default,
                        fontSize: 20,
                        formatter: '{total|' + sum + '}' + '\n\r' + '{active|母线失电设备总数}',
                        rich: {
                            total: {
                                fontSize: 24,
                                fontWeight: 600,
                                color: Tokens.color.fg.default
                            },
                            active: {
                                fontSize: 14,
                                color: Tokens.color.fg.muted
                            }
                        }
                    }
                },
                labelLine: {
                    show: false
                },
                data: pieData1
            },
            {
                name: '',
                type: 'pie',
                radius: ['95%', '70%'],
                center: ['22%', '50%'],
                label: {
                    show: true,
                    position: 'inside',
                    color: Tokens.color.fg.muted,
                    opacity: 1
                },
                labelLine: {
                    show: false
                },
                silent: true,
                data: pieData2
            }
        ]
    };
}
