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
            type: 'pictorialBar',
            symbol: 'react',
            symbolSize: ['100%', 3],
            symbolOffset: [0, -2],
            z: 12,
            itemStyle: {
                color: '#EAB59D'
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
                color: '#fff'
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
                    color: '#72A4C0',
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
                color: '#aec5e8'
            }
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
                formatter: function (value, index) {
                    return Number.isSafeInteger(value) ? value : '';
                },
                color: '#A5BCDE',
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
    // const colorList = ['rgb(96, 127, 229)', 'rgb(255, 0, 0)', 'rgb(72, 194, 255)', 'rgb(90, 146, 70)', '#19e5dd', '#f6c81e'];
    let colorList = [];
    const colorItem = {
        '500kV': 'rgb(96, 127, 229)',
        '1000kV': '#fd7783',
        '220kV': 'rgb(255, 0, 0)',
        '110kV': 'rgb(72, 194, 255)',
        '35kV': 'rgb(90, 146, 70)',
        '20kV': '#D57F7B',
        '10kV': '#f6c81e'
    };
    const sum = chartData.reduce((per, cur) => per + cur.value, 0);
    const pieData1 = [];
    const pieData2 = [];
    const gapData = {
        name: '',
        value: (sum / 100) * 0.5,
        itemStyle: {
            color: 'transparent'
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
                color: '#fff',
                fontSize: 36,
                fontWeight: 'bold',
                fontFamily: 'DOUYU-Font'
            },
            subtextStyle: {
                color: '#f5f5f5',
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
                color: '#fff'
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
                    color: '#A7D2F5',
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
