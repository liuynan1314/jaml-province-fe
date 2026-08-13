export function sysDefectOptionsLine(xData, yData) {
    return {
        color: ['#3B85FE'],
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(15, 32, 50,0.8)',
            borderColor: '#2e3e54',
            axisPointer: {
                lineStyle: {
                    color: '#2e3e54',
                    type: 'solid',
                    width: 2
                },
                z: 1
            },
            formatter: (params) => {
                let str = '';
                params.forEach((item, index) => {
                    if (index === 0) {
                        str += `<div style="color:#fff">${item.axisValueLabel}</div>`;
                    }
                    str += `<div style="display:flex;align-items:center">
                  <div style="height:3px;width:10px;background-color:${item.color}"></div>
                  <div style="margin-left:5px;width:65px;color:#799eb4">${item.seriesName}</div>
                  <span style="color:${item.color};font-weight:bold;font-size:18px">${item.value}</span>
              </div>`;
                });
                return str;
            }
        },
        grid: {
            top: '15%',
            left: '3%',
            right: '5%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: xData,
            axisLine: {
                lineStyle: {
                    color: 'hsla(217.5, 20%, 39.2%, 0.8)'
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    color: 'hsl(0deg 0% 85.1%,0.15)'
                }
            },
            axisLabel: {
                color: 'hsl(201.6, 33.3%, 64.1%)'
            }
        },
        yAxis: {
            type: 'value',
            name: '个',
            minInterval: 1,
            nameTextStyle: {
                color: 'hsl(201.6, 33.3%, 64.1%)'
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'hsla(217.5, 20%, 39.2%, 0.8)'
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: 'hsl(0deg 0% 85.1%,0.15)'
                }
            },
            axisLabel: {
                color: 'hsl(201.6, 33.3%, 64.1%)'
            }
        },
        series: [
            {
                name: '缺陷次数',
                data: yData,
                showSymbol: false,
                type: 'line',
                symbolSize: 10,
                z: 3
            }
        ]
    };
}
