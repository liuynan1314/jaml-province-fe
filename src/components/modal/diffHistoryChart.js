import { ajaxCall, findCol } from '../../common.js';
let _this, _model, _msgr;

const diffHistoryChart = (modal_params) => {
    const typeData = typeList.find((item) => item.name === modal_params.name);
    return {
        type: 'wrapper',
        styles: [
            'size.fullsize',
            Styles.stylesheet({
                ':scope': {
                    padding: 's',
                    display: 'flex',
                    flexDirection: 'column',
                    '.form-box': {
                        display: 'flex',
                        alignItems: 'center'
                    }
                }
            })
        ],
        descStyles: {
            datepicker: [Styles.icon.duotone, Styles.datepicker.regularStyleNew],
            button: [Styles.diffButton, Styles.diffSearchButton, Styles.button.css({ margin: '0 s' })]
        },
        components: [
            {
                type: 'wrapper',
                class: 'form-box',
                components: [
                    {
                        type: 'datepicker',
                        valueKey: 'beginDate',
                        icon: 'calendar',
                        cap: '查询时间:'
                    },
                    {
                        type: 'datepicker',
                        valueKey: 'endDate',
                        cap: '-'
                    },
                    {
                        type: 'button',
                        class: 'btn search_btn',
                        cap: '查询',
                        styles: [],
                        onclick() {
                            _this.getDiffHistoryChartData();
                        }
                    }
                ]
            },
            {
                type: 'chart-line',
                colorSet: [typeData?.color || 'hsl(156.3, 52.5%, 53.7%)'],
                styles: [
                    Styles.size.fullsize,
                    Styles.echarts.legend({
                        show: true,
                        icon: 'rect',
                        itemWidth: '12px',
                        itemHeight: '6px'
                    }),

                    Styles.echarts.grid({
                        left: 45,
                        right: 60
                    }),

                    Styles.echarts.axis.x({
                        name: '时间'
                    }),

                    Styles.echarts.axis.y({
                        name: typeData.unit
                    }),
                    Styles.echarts.axis.x.line.lineStyle({
                        color: 'hsl(217.5 20% 39.22%)'
                    }),
                    Styles.echarts.axis.y.line.lineStyle({
                        color: 'hsl(217.5 20% 39.22%)'
                    }),
                    Styles.echarts.axis.y.label.textStyle({
                        color: 'hsl(205.09 44% 75.49%)'
                    }),
                    Styles.echarts.axis.y.splitLine.lineStyle({
                        color: 'hsl(212.86 32.31% 25.49%)',
                        type: 'dashed'
                    })
                ],
                dataWatcher: 'diffHistoryChartData'
            }
        ],
        methods: {
            getDiffHistoryChartData: function () {
                const _params = {
                    lcId: modal_params.lcId,
                    beginTime: _msgr.get('beginDate') + ' 00:00:00',
                    endTime: _msgr.get('endDate') + ' 23:59:59'
                };
                ajaxCall(
                    'queryHisSample',
                    {
                        success(res) {
                            const chartData = [['时间', modal_params.name + '值']];

                            if (!res || res.length === 0) {
                                nutmeg.warn('未查询到采样数据!');
                                chartData.push([_params.beginTime, '-'], [_params.endTime, '-']);
                            } else {
                                res.forEach((item) => {
                                    chartData.push([item.occurTime, item.sampleValue]);
                                });
                            }

                            _model.vars.diffHistoryChartData = chartData;
                        },
                        params: _params,
                        useMock: false,
                        type: 'post'
                    },
                    false
                );
            }
        },
        onmount: function () {
            _this = this;
            _model = this.model;
            _msgr = this.model.msgr;

            const current = moment().format('YYYY-MM-DD');
            _msgr.pub('beginDate', current);
            _msgr.pub('endDate', current);
        },
        onafterrender: function () {
            this.getDiffHistoryChartData();
        }
    };
};

const typeList = [
    {
        name: '有功',
        color: 'hsl(156.3, 52.5%, 53.7%)',
        unit: 'MW'
    },
    {
        name: '无功',
        color: 'hsl(45, 69.6%, 63.9%)',
        unit: 'MW'
    },
    {
        name: '电流',
        color: 'hsl(180, 100%, 41%)',
        unit: 'A'
    },
    {
        name: '温度',
        color: 'hsl(195.3, 100%, 56.1%)',
        unit: '℃'
    },
    {
        name: '负载率',
        color: 'hsl(195.3, 100%, 56.1%)',
        unit: '%'
    }
];

export default diffHistoryChart;
