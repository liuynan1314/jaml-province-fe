export function remoteInspectionInfoBarOptions(barData, leftColor, rightColor, topColor) {
    const offsetX = 8;
    const offsetY = 4;
    // 绘制左侧面
    const CubeLeft = echarts.graphic.extendShape({
        shape: {
            x: 0,
            y: 0
        },
        buildPath: function (ctx, shape) {
            // 会canvas的应该都能看得懂，shape是从custom传入的
            const xAxisPoint = shape.xAxisPoint;
            const c0 = [shape.x, shape.y];
            const c1 = [shape.x - offsetX, shape.y - offsetY];
            const c2 = [xAxisPoint[0] - offsetX, xAxisPoint[1] - offsetY];
            const c3 = [xAxisPoint[0], xAxisPoint[1]];
            ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath();
        }
    });

    // 绘制右侧面
    const CubeRight = echarts.graphic.extendShape({
        shape: {
            x: 0,
            y: 0
        },
        buildPath: function (ctx, shape) {
            const xAxisPoint = shape.xAxisPoint;
            const c1 = [shape.x, shape.y];
            const c2 = [xAxisPoint[0], xAxisPoint[1]];
            const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1] - offsetY];
            const c4 = [shape.x + offsetX, shape.y - offsetY];
            ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
        }
    });

    // 绘制顶面
    const CubeTop = echarts.graphic.extendShape({
        shape: {
            x: 0,
            y: 0
        },
        buildPath: function (ctx, shape) {
            const c1 = [shape.x, shape.y];
            const c2 = [shape.x + offsetX, shape.y - offsetY]; //右点
            const c3 = [shape.x, shape.y - offsetX];
            const c4 = [shape.x - offsetX, shape.y - offsetY];
            ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
        }
    });

    // 注册三个面图形
    echarts.graphic.registerShape('CubeLeft', CubeLeft);
    echarts.graphic.registerShape('CubeRight', CubeRight);
    echarts.graphic.registerShape('CubeTop', CubeTop);

    return {
        tooltip: {
            trigger: 'axis',
            formatter: (params, ticket, callback) => {
                const item = params[1];
                return item.name + ' : ' + item.data.value;
            }
        },
        dataset: [
            {
                source: barData,
                dimensions: ['name', 'value']
            }
        ],
        grid: {
            left: '3%',
            right: '5%',
            top: '5%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            // data: xaxisData,
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1,
                    color: '#134e6a'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                fontSize: 12,
                color: '#8abae2',
                interval: 0
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1,
                    color: '#134e6a'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed', //线的类型 虚线0
                    color: '#0e3d57'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                fontSize: 12,
                color: '#8abae2'
            }
        },
        series: [
            {
                type: 'custom',
                renderItem: (params, api) => {
                    const location = api.coord([api.value(0), api.value(1)]);
                    return {
                        type: 'group',
                        children: [
                            {
                                type: 'CubeLeft',
                                shape: {
                                    api,
                                    xValue: api.value(0),
                                    yValue: api.value(1),
                                    x: location[0],
                                    y: location[1],
                                    xAxisPoint: api.coord([api.value(0), 0])
                                },
                                style: {
                                    fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        {
                                            offset: 0,
                                            color: leftColor[0]
                                        },
                                        {
                                            offset: 0.6,
                                            color: leftColor[1]
                                        },
                                        {
                                            offset: 1,
                                            color: leftColor[2]
                                        }
                                    ])
                                }
                            },
                            {
                                type: 'CubeRight',
                                shape: {
                                    api,
                                    xValue: api.value(0),
                                    yValue: api.value(1),
                                    x: location[0],
                                    y: location[1],
                                    xAxisPoint: api.coord([api.value(0), 0])
                                },
                                style: {
                                    fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        {
                                            offset: 0,
                                            color: rightColor[0]
                                        },
                                        {
                                            offset: 0.6,
                                            color: rightColor[1]
                                        },
                                        {
                                            offset: 1,
                                            color: rightColor[2]
                                        }
                                    ])
                                }
                            },
                            {
                                type: 'CubeTop',
                                shape: {
                                    api,
                                    xValue: api.value(0),
                                    yValue: api.value(1),
                                    x: location[0],
                                    y: location[1],
                                    xAxisPoint: api.coord([api.value(0), 0])
                                },
                                style: {
                                    fill: topColor
                                }
                            }
                        ]
                    };
                }
                // data: yaxisData,
            },
            {
                type: 'bar',
                itemStyle: {
                    color: 'transparent'
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        fontSize: 14,
                        color: '#feffff',
                        fontWeight: 'bold',
                        offset: [0, -5]
                    }
                }
                // data: yaxisData,
            }
        ]
    };
}
