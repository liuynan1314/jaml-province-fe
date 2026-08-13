/**
 * 主变油温-卡片
 * @cap 主变油温-卡片
 * @showType card
 */

let _model, chart_model;
export default {
    type: 'card',
    cap: '主变油温',
    icon: 'oil-temperature',
    class: 'mainTransOilTempNew',
    styles: [
        'size.fullsize',
        Styles.css({
            '--jam-card-bodyslot-padding': '0.25rem 0.5rem'
        }),
        Styles.stylesheet({
            '.jam-cc-legend-wrapper': {
                display: 'none !important'
            }
        })
    ],
    components: [
        {
            type: 'container',
            styles: ['size.fullsize'],
            components: [
                {
                    type: 'wrapper',
                    styles: [Styles.titleBox, Styles.css({ height: '1.5rem' })],
                    components: [
                        {
                            type: 'label',
                            class: 'auxiliary',
                            cap: jaml.var('event-chart-pie-info', (chartLeftInfo) => chartLeftInfo)
                        }
                    ]
                },
                {
                    type: 'barWithTotal',
                    props: {
                        title: '主变油温',
                        unit: '台',
                        hasValue: false,
                        hasTags: false,
                        barWidth: '2rem',
                        tipFormatter: null,
                        showSplitArea: false,
                        showSplitLineX: false
                    },
                    vars: {
                        data: {
                            chartData: []
                        }
                    },
                    watchers: {},
                    onmount: function () {
                        chart_model = this.model;
                        jam.ajaxCall({
                            urlKey: 'oilTempStatics',
                            data: {
                                beginTime: jam.formatTime(new Date(), 'yyyy-MM-dd 00:00:00'),
                                endTime: jam.formatTime(new Date(), 'yyyy-MM-dd 23:59:59')
                            },
                            onsuccess(res) {
                                const { data } = res;
                                const dataList = [];
                                var xData = ['<50℃', '50-70℃', '≥70℃', '温度异常'],
                                    yData = [];
                                let sum = 0;
                                xData.forEach(function (item, index) {
                                    dataList.push([item, data['count' + (index + 1)]]);
                                    yData.push(data['count' + (index + 1)]);
                                    sum += data['count' + (index + 1)];
                                });

                                let maxIndex = yData.indexOf(Math.max.apply(null, yData));
                                let maxName = xData[maxIndex];
                                let maxValue = yData[maxIndex];

                                _model['event-chart-pie-info'] = `重过载共&nbsp;<b style="color:${jam.colorText()};">${sum}</b>&nbsp;条，${sum > 0 ? `${maxName}最多，占总数&nbsp;<b style="color:${jam.colorText()};">${Math.trunc((maxValue / sum) * 100)}</b>&nbsp;%` : ''}`;
                                chart_model.data.chartData = [['油温', '数量'], ...dataList];
                            }
                        });
                    },
                    styles: ['barWithTotal.basic', 'css(width:100%;height:calc(100% - 1.6rem);)'],
                    onafterrender: async function () {
                        const _chart = jam.findElement(this.element, 'jam-chart');
                        await _chart.chartReady;
                        _chart.chart.on('click', (params) => {
                            rambutan.switchTo('/oilTemperatureAnalysis_songjian-screen', {
                                token: jam.getUrlParam('token')
                            });
                        });
                    }
                }
            ]
        }
    ],

    vars: {},
    onmount: function () {
        _model = this.model;
    },
    onafterrender: function () {}
};
