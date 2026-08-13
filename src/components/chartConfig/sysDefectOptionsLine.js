export function sysDefectOptionsLine(xData, yData) {
    return {
        color: [jam.acToken[0]()],
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(15, 32, 50,0.8)',
            borderColor: Tokens.color.outline.subtle,
            axisPointer: {
                lineStyle: {
                    color: Tokens.color.outline.subtle,
                    type: 'solid',
                    width: 2
                },
                z: 1
            },
            formatter: (params) => {
                let str = '';
                params.forEach((item, index) => {
                    if (index === 0) {
                        str += `<div style="color:${Tokens.color.fg.default}">${item.axisValueLabel}</div>`;
                    }
                    str += `<div style="display:flex;align-items:center">
                  <div style="height:3px;width:10px;background-color:${item.color}"></div>
                  <div style="margin-left:5px;width:65px;color:${Tokens.color.fg.muted}">${item.seriesName}</div>
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
                    color: Tokens.color.outline.subtle
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    color: Tokens.color.outline.subtle
                }
            },
            axisLabel: {
                color: Tokens.color.fg.muted
            }
        },
        yAxis: {
            type: 'value',
            name: '个',
            minInterval: 1,
            nameTextStyle: {
                color: Tokens.color.fg.muted
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: Tokens.color.outline.subtle
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: Tokens.color.outline.subtle
                }
            },
            axisLabel: {
                color: Tokens.color.fg.muted
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
