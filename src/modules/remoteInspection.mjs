import { ajaxCall } from '../common.js';
let _model, _msgr;

export default {
    type: 'wrapper',
    class: 'remote-inspection',
    styles: [
        Styles.size.fullsize,
        // Styles.layout.grid({ row: 16, col: 9 }),
        Styles.stylesheet({
            ':scope': {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: 'm l',
                gap: 'l'
            },

            '.remote-type': {
                // gridArea: '1 / 1 / 16 / 5',
                flex: 5,
                gap: 'l',
                flexWrap: 'wrap',
                minHeight: 0,
                '.remote-type-item': {
                    width: 'calc(50%  - 2rem)',
                    display: 'flex',
                    background: 'url(../../assets/images/remote-card.png) no-repeat',
                    backgroundSize: '100% 100%',
                    border: 's solid var(--jam-color-primary-subtle)',
                    marginRight: '2rem',
                    '&:nth-child(2n)': {
                        marginRight: 0
                    },

                    '.remote-type-item-icon': {
                        flex: 1,
                        background: 'linear-gradient(180deg, var(--jam-color-primary-subtle) 0%, var(--jam-color-primary-film) 100%)',
                        opacity: '0.9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '.item-icon': {
                            width: '50%',
                            height: '50%',
                            marginTop: '8%'
                        }
                    },
                    '.remote-type-item-num': {
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',

                        '.remote-type-item-name': {
                            flex: 1,
                            fontSize: 'l',
                            justifyContent: 'center',
                            alignItems: 'center'
                        },

                        '.remote-type-item-value': {
                            flex: 1,
                            justifyContent: 'center',
                            marginTop: '-3rem',

                            '& > span[slot="value"]': {
                                fontSize: 'l',
                                margin: 0,
                                color: '#1FC6FF',
                                fontFamily: 'DINPro',
                                fontWeight: 'bold'
                            },
                            '& > span[slot="unit"]': {
                                background: 'transparent',
                                fontSize: 'l',
                                color: '#85acc2',
                                opacity: 0.8999999761581421,
                                fontFamily: 'DINPro',
                                fontWeight: 'normal'
                            }
                        }
                    },
                    '.remote-type-rate': {
                        flex: 1,
                        justifyContent: 'flex-end',
                        position: 'relative'
                    },
                    '.remote-type-item-rate': {
                        width: '70%',
                        height: '3.5rem',
                        background: 'url(../../assets/images/remote-indictor-bg.png) no-repeat',
                        backgroundSize: '100% 100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        padding: '0 s',
                        '& > span[slot="cap"]': {
                            color: '#85acc2',
                            fontFamily: 'DINPro',
                            fontSize: 'l',
                            alignItems: 'center'
                        },
                        '& > span[slot="value"]': {
                            color: '#00D1D1',
                            fontFamily: 'DINPro',
                            fontSize: 'l',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }
                    }
                }
            },

            '.remote-chart': {
                // gridArea: '1 / 5 / 16 / 4',
                flex: 4,
                minHeight: 0,
                display: 'flex',
                gap: 'l',
                '.chart-container': {
                    width: 'calc(50%  - 1.5rem)',
                    // hsl(209.23deg 49.37% 15.49%)
                    // hsl(209.23deg 52% 14.71%)
                    background: 'linear-gradient(to right, var(--jam-color-primary-default), var(--jam-color-primary-strong))',
                    padding: 'm',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    '.chart-title': {
                        fontSize: 'l',
                        color: '#fff'
                    },
                    '.chart-state': {
                        width: '5rem',
                        height: '2.4rem',
                        lineHeight: '2.4rem',
                        fontSize: 'm',
                        justifyContent: 'center',
                        borderRadius: 'm',
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem'
                    },
                    '.chart-box': {
                        height: 'calc(100% - 2rem)',
                        position: 'relative'
                    },
                    '.chart-num': {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#fff',
                        fontSize: 'l',
                        fontWeight: 'bold',
                        display: 'flex',
                        '& > span[slot="unit"]': {
                            backgroundColor: 'transparent',
                            fontSize: 'l',
                            fontFamily: 'DINPro',
                            fontWeight: 'normal',
                            color: '#fff'
                        }
                    }
                }
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            styles: [],
            class: 'remote-type',
            components: [
                {
                    type: 'wrapper',
                    class: 'remote-type-item',
                    buildFor: '(item,index) in rateDate',
                    components: [
                        {
                            type: 'wrapper',
                            class: 'remote-type-item-icon',
                            components: [
                                {
                                    type: 'element',
                                    class: 'item-icon',
                                    attr: jaml.var('index', function (index) {
                                        this.element.style = {
                                            backgroundImage: `url(../../assets/images/icon-remote${index + 1}.png)`,
                                            backgroundSize: `100% 100%`
                                        };
                                    })
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            class: 'remote-type-item-num',
                            components: [
                                {
                                    type: 'label',
                                    class: 'remote-type-item-name',
                                    cap: '{{item.name}}'
                                },
                                {
                                    type: 'indicator',
                                    class: 'remote-type-item-value',
                                    value: '{{item.value}}',
                                    unit: '个'
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            class: 'remote-type-rate',
                            components: [
                                {
                                    type: 'indicator',
                                    class: 'remote-type-item-rate',
                                    cap: '占比',
                                    value: '{{item.rate}}'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'remote-chart',
            components: [
                {
                    type: 'wrapper',
                    class: 'chart-container',
                    buildFor: '(item,index) in chartData',
                    components: [
                        {
                            type: 'label',
                            class: 'chart-title',
                            cap: '{{item.name}}'
                        },
                        {
                            type: 'label',
                            class: 'chart-state',
                            cap: '{{item.state}}',
                            states: {
                                正常: {
                                    styles: [
                                        Styles.label.css({
                                            border: 's solid #00C853',
                                            color: '#00C853'
                                        })
                                    ]
                                },
                                异常: {
                                    styles: [
                                        Styles.label.css({
                                            border: 's solid #ffab00',
                                            color: '#ffab00'
                                        })
                                    ]
                                }
                            },
                            state: '{{item.state}}'
                        },
                        {
                            type: 'wrapper',
                            class: 'chart-box',
                            components: [
                                {
                                    type: 'chart-pie',
                                    id: '{{item.name}}',
                                    colorset: '{{item.name}} === "站点覆盖率" ? ["primary"] : ["warn"]',
                                    // ['hsl(45, 69.6%, 63.9%)', 'hsl(213, 49%, 20%)', 'hsl(217, 24%, 43%)'],
                                    styles: [
                                        Styles.size.fullsize,
                                        Styles.echarts.pie({ radius: ['50%', '65%'], top: '-20%', bottom: '-20%', left: '-20%', right: '-20%', padAngle: 0 }), //padAngle每部分间距
                                        Styles.echarts.pie.label({
                                            show: false,
                                            position: 'center'
                                        }),

                                        Styles.efuncs((el, args) => {
                                            let _option = el.chartOption;
                                            const endColor =
                                                el.id === '站点覆盖率' ? Tokens.color.primary.default : jam.acToken[1]();
                                            _option.color[0] = jam.toEchartsGradient(90, Tokens.color.transparent, endColor);
                                            _option.color[1] = Tokens.color.primary.strong;
                                        })
                                    ],
                                    data: '{{item.chartData}}'
                                },
                                {
                                    type: 'indicator',
                                    class: 'chart-num',
                                    cap: '{{item.rate}}',
                                    unit: '%',
                                    state: '{{item.name}}',
                                    states: {
                                        站点覆盖率: {
                                            styles: [
                                                Styles.indicator.cap.css({
                                                    color: '#1fc6ff'
                                                })
                                            ]
                                        },
                                        异常点位比率: {
                                            styles: [
                                                Styles.indicator.cap.css({
                                                    color: '#ffab00'
                                                })
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        getChartData();
        getRemoteInspectionRateData();
    }
};

function getChartData() {
    ajaxCall(
        'getRemoteInspectionChartData',
        {
            success(data) {
                const total = data.reduce((sum, item) => sum + item.value, 0);
                const result = data.map((item) => {
                    return {
                        name: item.name,
                        value: item.value,
                        rate: ((item.value / total) * 100).toFixed(0) + '%'
                    };
                });

                _model.vars.rateDate = result;
            },
            params: {},
            useMock: true,
            type: 'post'
        },
        false
    );
}

function getRemoteInspectionRateData() {
    ajaxCall(
        'getRemoteInspectionRateData',
        {
            success(data) {
                const res = data.map((item) => {
                    let state;
                    const chartData = [['状态', '覆盖率']];
                    chartData.push([item.name === '站点覆盖率' ? '站点覆盖' : '异常点位', item.rate]);
                    chartData.push([item.name === '站点覆盖率' ? '站点未覆盖' : '正常点位', 100 - item.rate]);

                    if (item.name === '站点覆盖率') {
                        state = item.rate >= 90 ? '正常' : '异常';
                    }
                    if (item.name === '异常点位比率') {
                        state = item.rate >= 50 ? '异常' : '正常';
                    }
                    return {
                        ...item,
                        state,
                        chartData
                    };
                });
                _model.vars.chartData = res;
            },
            params: {},
            useMock: true,
            type: 'post'
        },
        false
    );
}
