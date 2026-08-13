import { ajaxCall } from '../common.js';

let _model,
    _msgr = null;
const config = mango.get('config');
const { substationScale } = mango.get('dataNameMap');
const list = config.bvListJs.map((bv) => `${bv}kV`);
// const color = list.map((bv) => substationScale?.[bv]?.color || 'hsl(0, 100%, 67%)');
const color = ['rgb(96, 127, 229)', 'rgb(255, 0, 0)', 'rgb(72, 194, 255)', 'rgb(90, 146, 70)'];
console.log('color', color);
const clickColor = list.map((bv) => substationScale?.[bv]?.clickColor || 'hsl(0, 100%, 67%)');

let clickIndex, clickSeriesName, bvName; //点击记录
let pieOptions, chartDom, thisChart;
export default {
    type: 'card',
    class: '',
    styles: ['size.fullsize'],
    components: [
        {
            type: 'wrapper',
            styles: [
                'size.fullsize',
                Styles.css({ position: 'relative' }),
                Styles.stylesheet({
                    'jam-button': {
                        width: '4rem',
                        borderRadius: 0
                    }
                })
            ],
            components: [
                {
                    type: 'chart-pie',
                    id: 'chart-pie',
                    styles: [
                        Styles.size.fullsize,
                        Styles.echarts.pie({ radius: ['52%', '70%'], top: '0%', bottom: '0%', left: '0%', right: '0%', padAngle: 2 }),
                        Styles.echarts.pie.itemStyle.border({ radius: [7, 7, 7, 7] }),
                        Styles.echarts.tooltip({ trigger: 'item' }),
                        Styles.echarts.legend({ show: true, bottom: 0 }),
                        Styles.echarts.pie.label({ show: false }),
                        Styles.eopts({
                            grid: {
                                top: 20
                            },
                            label: {
                                // show: false,
                                // formatter: ''
                                // borderColor: color[0],
                                // padding: 3,
                                // borderWidth: 1,
                                // borderRadius: 4
                            }
                        }),
                        Styles.echarts.Radar.axisName.textStyle({ size: jam.convert2Px('0.75rem') })
                    ],
                    data: '{{runtimeData}}',
                    colorSet: color
                },
                {
                    type: 'buttongroup-radio',
                    styles: ['', Styles.css({ position: 'absolute', top: '0rem', left: '0rem', zIndex: '99' })],
                    data: [
                        { name: '过载', value: 'overload' },
                        { name: '重载', value: 'heavyLoad' }
                    ],
                    defaultValue: 'overload',
                    valueKey: 'type'
                },
                {
                    type: 'wrapper',
                    styles: [Styles.css({ position: 'absolute', flexDirection: 'column', width: '50%', height: '100%', top: 0, left: '25%', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' })],
                    childStyles: [Styles.css({ justifyContent: 'center' })],
                    components: [
                        {
                            type: 'indicator',
                            value: '{{totalCnt}} || 0',
                            unit: '次',
                            styles: [Styles.css({ display: 'flex', '--jam-digit-height': '1.5rem' }), 'indicator.tweening.dial(msaklength:1)', Styles.indicator.value.css({ marginLeft: 0 }), Styles.indicator.unit.css({ minWidth: '1rem', alignSelf: 'center' })]
                        },
                        {
                            type: 'label',
                            cap: '{{title}}'
                        }
                    ]
                }
            ]
        }
    ],
    watchers: {
        type(value) {
            if (_model.vars[`${value}Data`]) {
                _model.vars.runtimeData = _model.vars[`${value}Data`];
                _model.vars.totalCnt = _model.vars[`${value}Total`];
                _model.vars.title = value === 'overload' ? '过载总数' : '重载总数';
            }
        }
    },
    methods: {
        getOverloadRuntimeStatistics() {
            const params = {
                devType: 2
            };
            ajaxCall('getOverloadRuntimeStatistics', {
                success(res) {
                    const newData = res.filter((item) => list.includes(String(item.bvName)));
                    let overloadNewData = JSON.parse(JSON.stringify(newData));
                    overloadNewData.sort((a, b) => b.bvName - a.bvName);
                    let heavyNewData = JSON.parse(JSON.stringify(overloadNewData));
                    let overloadTotal = 0;
                    let heavyLoadTotal = 0;
                    const overloadData = overloadNewData.map((item) => {
                        overloadTotal += item.overloadCnt;
                        return [item.bvName, item.overloadCnt];
                    });
                    const heavyLoadData = heavyNewData.map((item) => {
                        heavyLoadTotal += item.heavyLoadCnt;
                        return [item.bvName, item.heavyLoadCnt];
                    });
                    overloadData.unshift(['电压等级', '过载']);
                    heavyLoadData.unshift(['电压等级', '重载']);
                    _model.vars.title = '过载总数';
                    _model.vars.overloadTotal = overloadTotal;
                    _model.vars.heavyLoadTotal = heavyLoadTotal;
                    _model.vars.totalCnt = overloadTotal;
                    _model.vars.overloadData = overloadData;
                    _model.vars.heavyLoadData = heavyLoadData;
                    _model.vars.runtimeData = overloadData;
                },
                type: 'post',
                useMock: false,
                params: params
            });
        }
    },
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        this.methods.getOverloadRuntimeStatistics();

        chartDom = document.getElementById('chart-pie');
        thisChart = chartDom.chart;

        thisChart.on('click', (params) => {
            pieOptions = thisChart.getOption();
            console.log('params: ', params);

            if (params.componentType === 'series') {
                // 饼图点击变色
                let seriesIndex = params.dataIndex;
                let seriesName = params.seriesName;
                if (clickIndex == seriesIndex && clickSeriesName == seriesName) {
                    renderStartStatus();
                } else {
                    // let newColor = JSON.parse(JSON.stringify(color));
                    // newColor[seriesIndex] = clickColor[seriesIndex];
                    // pieOptions.color = newColor;
                    clickIndex = seriesIndex;
                    bvName = params.name;
                    clickSeriesName = seriesName;
                }
                thisChart.setOption(pieOptions, true);

                mango.pub('devOverLoadParmas', {
                    bvName: bvName,
                    type: clickSeriesName
                });
            }
        });

        mango.sub('devOverLoadParmas', function (params) {
            if (params?.name || params?.totalTime) {
                renderStartStatus();
            }
        });
    }
};

/**
 * 渲染默认状态
 */
function renderStartStatus() {
    if (pieOptions) {
        pieOptions.color = color;
        clickIndex = null;
        bvName = null;
        clickSeriesName = null;
        thisChart.setOption(pieOptions, true);
    }
}
