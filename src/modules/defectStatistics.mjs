import { urlConfig } from '../global.js';
import { ajaxCall } from '../common.js';
let _model,
    _msgr = null;
const colorStops = {
    危急: [
        {
            offset: 0,
            color: 'hsl(13, 58%, 56%)'
        },
        {
            offset: 1,
            color: 'hsl(13, 46%, 28%)'
        }
    ],
    一般: [
        {
            offset: 0,
            color: 'hsl(156.3, 52.5%, 53.7%)'
        },
        {
            offset: 1,
            color: 'hsl(179.5, 80.4%, 28%)'
        }
    ],
    严重: [
        {
            offset: 0,
            color: 'hsl(45, 70%, 64%)'
        },
        {
            offset: 1,
            color: 'hsl(45, 39%, 35%)'
        }
    ]
};
export default {
    type: 'card',
    class: 'defectStatistics',
    styles: [
        'size.fullsize',
        Styles.stylesheet({
            '.defectTitle': {
                height: '2rem'
            },
            '.defect-content': {
                width: '100%',
                height: 'calc(100% - 2rem)',
                display: 'flex',
                '.defect-bar': {
                    width: '70%',
                    height: '100%'
                },
                '.pie-legned': {
                    width: '30%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    '.legend-item': {
                        display: 'flex',
                        width: 'calc(100% - .5rem)',
                        justifyContent: 'space-around',
                        height: '2.18rem',
                        lineHeight: '2.18rem',
                        background: 'linear-gradient(180deg, hsla(206, 83.1%, 55.9%, 0) 19%, hsla(206, 83.1%, 55.9%, 0.16) 100%)',
                        border: 's solid hsla(216.5, 45.9%, 21.8%, 0.8)',
                        fontSize: 's',
                        color: 'hsl(200.8, 56.3%, 82.9%)',
                        'jam-label': {
                            fontSize: 's',
                            padding: '0 0 0 s',
                            lineHeight: '2.18rem'
                        },
                        'jam-indicator': {
                            flexGrow: 1,
                            display: 'flex',
                            flexWrap: 'nowrap',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            padding: 0,
                            span: {
                                display: 'inline-block',
                                height: '100%',
                                lineHeight: '2.18rem',
                                margin: 0
                            },
                            '&>[slot=cap]': {
                                display: 'flex',
                                padding: '0 xs',
                                height: '1.125rem',
                                borderRadius: '2px',
                                background: 'linear-gradient(-77.97deg, hsl(3.3, 100%, 32.2%) 0%, hsl(3.4, 100%, 62%) 100%)'
                            },
                            '&>[slot=value]': {
                                color: 'hsl(199.4, 100%, 93.9%)',
                                fontWeight: 'bold',
                                fontSize: 'm',
                                fontFamily: 'DINPro'
                            },
                            '&>[slot=unit]': {
                                color: 'hsl(201.6, 33.3%, 64.1%)',
                                boxShadow: 'none',
                                fontSize: 's',
                                background: 'transparent'
                            }
                        },
                        'jam-indicator._green': {
                            '&>[slot=cap]': {
                                background: 'linear-gradient(-79.16deg, hsl(180, 100%, 19.4%) 0%, hsl(181, 73.4%, 31%) 100%)'
                            }
                        }
                    }
                }
            }
        })
    ],
    components: [
        {
            type: 'label',
            class: 'defectTitle',
            cap: '{{_defectTitle}}'
        },
        {
            type: 'wrapper',
            class: 'defect-content',
            components: [
                {
                    type: 'wrapper',
                    class: 'defect-bar'
                },
                {
                    type: 'wrapper',
                    class: 'pie-legned',
                    components: [
                        {
                            type: 'wrapper',
                            class: 'legend-item',
                            components: [
                                {
                                    type: 'label',
                                    cap: '今日'
                                },
                                {
                                    type: 'indicator',
                                    value: '{{todayOverCnt}}',
                                    cap: '新增',
                                    unit: '个'
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            class: 'legend-item',
                            components: [
                                {
                                    type: 'label',
                                    cap: '本周'
                                },
                                {
                                    type: 'indicator',
                                    cap: '新增',
                                    value: '{{thisWeekAddCnt}}',
                                    unit: '个'
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            class: 'legend-item',
                            components: [
                                {
                                    type: 'label',
                                    cap: '今日'
                                },
                                {
                                    type: 'indicator',
                                    cap: '消缺',
                                    class: '_green',
                                    value: '{{todayOverCnt}}',
                                    unit: '个'
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            class: 'legend-item',
                            components: [
                                {
                                    type: 'label',
                                    cap: '本周'
                                },
                                {
                                    type: 'indicator',
                                    cap: '消缺',
                                    class: '_green',
                                    value: '{{thisWeekOverCnt}}',
                                    unit: '个'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    vars: {
        data: {}
    },
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        onRenderPieChart();
    }
};

function onRenderPieChart() {
    ajaxCall(
        'defectStatistics',
        {
            success(data) {
                const pieData = [
                    {
                        value: data?.generalCnt || 0,
                        name: '一般'
                    },
                    {
                        value: data?.seriousCnt || 0,
                        name: '严重'
                    },
                    {
                        value: data?.criticalCnt || 0,
                        name: '危急'
                    }
                ];
                _msgr.pub('thisWeekAddCnt', data?.thisWeekAddCnt || 0);
                _msgr.pub('thisWeekOverCnt', data?.thisWeekOverCnt || 0);
                _msgr.pub('todayOverCnt', data?.todayOverCnt || 0);
                _msgr.pub('thisWeekOverCnt', data?.thisWeekOverCnt || 0);
                let maxNum = 0,
                    maxNumName = '',
                    minNum = 0,
                    minNumName = '';
                const sum = pieData.reduce((total, item) => total + item.value, 0);
                (pieData || []).forEach((v, index) => {
                    if (index == 0) {
                        minNum = v.value;
                        minNumName = v.name;
                        maxNum = v.value;
                        maxNumName = v.name;
                    }
                    if (v.value && maxNum < v.value) {
                        maxNum = v.value;
                        maxNumName = v.name;
                    }
                    if (v.value && minNum > v.value) {
                        minNum = v.value;
                        minNumName = v.name;
                    }
                });
                const maxPer = sum == 0 ? 0 : Number((maxNum / sum) * 100).toFixed(0) + '%';
                const minPer = sum == 0 ? 0 : Number((minNum / sum) * 100).toFixed(0) + '%';
                const _defectTitle = `<span style="font-size:var(--jam-font-size-s);color:var(--jam-color-fg-muted)">${maxNumName}缺陷占比较大<span style="color:${colorStops[maxNumName][0].color}">${maxPer}</span>，${minNumName}缺陷占比<span style="color:${colorStops[minNumName][0].color}">${minPer}</span></span>`;
                _msgr.pub('_defectTitle', _defectTitle);

                const pieEchart = echarts.init(document.querySelector('.defect-bar'));
                pieEchart.setOption(setDetectStatisticsEcharts(pieData, sum));

                window.addEventListener('resize', pieEchart.resize);
            },
            params: {},
            useMock: true,
            type: 'get'
        },
        false
    );
}

function setDetectStatisticsEcharts(seriesData, sum) {
    return {
        tooltip: {
            show: true
        },
        title: [
            {
                text: '总计',
                subtext: '156',
                left: '48%',
                top: '22%',
                textAlign: 'center',
                subtextStyle: {
                    fontWeight: 900,
                    color: 'hsl(195.3, 100%, 56.1%)',
                    fontSize: 20
                },
                textStyle: {
                    fontSize: 14,
                    color: 'hsl(201.6, 33.3%, 64.1%)',
                    fontFamily: 'DIN-Bold'
                }
            }
        ],
        series: [
            {
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['50%', '40%'],
                data: seriesData,
                label: {
                    show: true,
                    color: 'inherit',
                    position: 'outside',
                    formatter: function (d) {
                        console.log('d', d);
                        const _per = sum == 0 ? 0 : Number((d.value / sum) * 100).toFixed(0) + '%';
                        // return _per + '\n' + d.name;
                        if (d.name == '一般') {
                            return '{num1|' + _per + '} \n{name|' + d.name + '}';
                        } else if (d.name == '严重') {
                            return '{num2|' + _per + '} \n{name|' + d.name + '}';
                        } else if (d.name == '危急') {
                            return '{num3|' + _per + '} \n{name|' + d.name + '}';
                        }
                    },
                    rich: {
                        num1: {
                            color: jam.getColor('success').css()
                        },
                        num2: {
                            color: jam.getColor('warn').css()
                        },
                        num3: {
                            color: jam.getColor('error').css()
                        },
                        name: {
                            color: Tokens.color.fg.muted
                        }
                    }
                },
                labelLine: {
                    length2: 0
                },
                itemStyle: {
                    borderColor: 'transparent',
                    color: function (params) {
                        return {
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 1,
                            colorStops: colorStops[params.name] // 100% 处的颜色
                        };
                    }
                }
            }
        ]
    };
}
