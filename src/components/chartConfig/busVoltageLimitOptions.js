export function setBusVolageLimitBarEcharts(xAxisData, data) {
    const series = [
        {
            name: '',
            data,
            type: 'bar',
            barWidth: '60%',
            symbolClip: true,
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
            type: 'pictorialBar',
            symbol: 'react',
            symbolSize: ['100%', 3],
            symbolOffset: [0, -2],
            z: 12,
            itemStyle: {
                color: Tokens.color.primary.subtle
            },
            data: getSymbolData(data)
        }
    ];

    return {
        tooltip: {
            trigger: 'axis',
            formatter: '{b} : {c}',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            top: 20,
            textStyle: {
                color: Tokens.color.fg.default
            },
            itemWidth: 10,
            itemHeight: 10,
            icon: 'rect',
            data: ['接入率']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
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
                rotate: 45, // 文字倾斜角度，正值为顺时针
                interval: 0,
                fontSize: 14,
                color: Tokens.color.fg.muted
            }
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
                formatter: function (value, index) {
                    return Number.isSafeInteger(value) ? value : '';
                },
                color: Tokens.color.fg.muted,
                fontSize: 14
            }
        },
        series: series
    };
}

function getSymbolData(datas) {
    let arr = [];
    for (var i = 0; i < datas.length; i++) {
        arr.push({
            value: datas[i],
            symbolPosition: 'end'
        });
    }
    return arr;
}

export function setPieEchartsData(chartData) {
    let colorList = [];
    const colorItem = {
        '500kV': jam.acToken[0](),
        '1000kV': jam.acToken[1](),
        '220kV': jam.acToken[2](),
        '110kV': jam.acToken[3](),
        '35kV': jam.acToken[4](),
        '20kV': jam.acToken[5](),
        '10kV': jam.acToken[6]()
    };
    const sum = chartData.reduce((per, cur) => per + cur.value, 0);
    const pieData1 = [];
    const pieData2 = [];
    const gapData = {
        name: '',
        value: (sum / 100) * 0.5,
        itemStyle: {
            color: Tokens.color.transparent
        }
    };
    console.log('chartData', chartData);
    for (let i = 0; i < chartData.length; i++) {
        // 第一圈数据
        pieData1.push(chartData[i], gapData);
        colorList.push(colorItem[chartData[i].name]);
        // 第二圈数据
        pieData2.push(
            {
                ...chartData[i],
                itemStyle: {
                    color: colorItem[chartData[i].name],
                    opacity: 0.15
                }
            },
            gapData
        );
    }
    return {
        title: {
            text: sum,
            subtext: '母线越限\n（电压等级）',
            x: '50%',
            y: '35%',
            itemGap: 15,
            textStyle: {
                color: Tokens.color.fg.default,
                fontSize: 36,
                fontWeight: 'bold',
                fontFamily: 'DOUYU-Font'
            },
            subtextStyle: {
                color: Tokens.color.fg.muted,
                fontSize: 16,
                lineHeight: 22,
                fontFamily: 'SourceHanSansCN-Regular'
            },
            textAlign: 'center'
        },
        tooltip: {
            show: true,
            backgroundColor: 'rgba(0, 0, 0,.8)',
            textStyle: {
                color: Tokens.color.fg.default
            }
        },
        color: colorList,
        series: [
            {
                name: '',
                type: 'pie',
                roundCap: true,
                radius: ['50%', '56%'],
                center: ['50%', '50%'],
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                data: pieData1
            },
            {
                name: '',
                type: 'pie',
                radius: ['56%', '80%'],
                center: ['50%', '50%'],
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
