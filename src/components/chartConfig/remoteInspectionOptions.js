export function remoteInspectionOptions(data) {
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                shadowStyle: {
                    color: 'rgba(0,0,0,0.2)'
                }
            },
            backgroundColor: 'rgba(50,50,50,0.7)',
            textStyle: {
                color: '#fff'
            },
            borderColor: 'rgba(0,0,0,0)',
            formatter: function (param) {
                var marker = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:rgb(20,172,255,1);"></span>`;
                const { value, name } = param[0];
                return `${marker}标题：远程智能巡航 <br/> ${marker}地区：${name} <br/> ${marker}数量：${value}`;
            }
        },
        legend: {
            show: false
        },
        grid: {
            top: '-3%',
            bottom: '-8%',
            left: '-16%',
            right: '5%',
            containLabel: true
        },
        xAxis: {
            show: false,
            type: 'value'
        },
        yAxis: [
            {
                type: 'category',
                inverse: true,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                data: data.map((item) => item.name),
                axisLabel: {
                    margin: 140,
                    fontSize: 16,
                    align: 'left',
                    color: '#ffffff',
                    rich: {
                        a1: {
                            color: '#fff',
                            backgroundColor: {
                                image: '../../../assets/images/icon_wurenji.png'
                            },
                            width: 36,
                            height: 30,
                            align: 'center'
                        },
                        a2: {
                            color: '#fff',
                            backgroundColor: {
                                image: '../../../assets/images/icon_shipin.png'
                            },
                            width: 36,
                            height: 30,
                            align: 'center'
                        },
                        a3: {
                            color: '#fff',
                            backgroundColor: {
                                image: '../../../assets/images/icon_jiqiren.png'
                            },
                            width: 36,
                            height: 30,
                            align: 'center'
                        },
                        a4: {
                            color: '#fff',
                            backgroundColor: {
                                image: '../../../assets/images/icon_shexiangtou.png'
                            },
                            width: 36,
                            height: 30,
                            align: 'center'
                        }
                    },
                    formatter: function (params) {
                        var index = data.map((item) => item.name).indexOf(params);
                        index = index + 1;
                        if (index - 1 < 4) {
                            return ['{a' + index + '|}' + '  ' + params].join('\n');
                        }
                    }
                }
            },
            {
                type: 'category',
                inverse: true,
                axisTick: 'none',
                axisLine: 'none',
                show: true,
                data: data.map((item) => item.value),
                axisLabel: {
                    show: true,
                    fontSize: 24,
                    color: '#ffffff',
                    formatter: '{value}',
                    fontFamily: 'DIN MEDIUM'
                }
            }
        ],
        series: [
            {
                z: 2,
                name: '远程智能巡航',
                type: 'bar',
                barWidth: '30%',
                zlevel: 1,
                itemStyle: {
                    normal: {
                        borderRadius: 30,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            {
                                offset: 0,
                                color: 'rgb(25,43,95,1)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(20,172,255,1)'
                            }
                        ])
                    }
                },
                data: data.map((item) => item.value),
                label: {
                    show: false,
                    position: 'right',
                    color: '#333333',
                    fontSize: 14,
                    offset: [10, 0]
                }
            }
        ]
    };
}
