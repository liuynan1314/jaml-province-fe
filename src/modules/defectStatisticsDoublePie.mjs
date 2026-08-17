/**
 * 缺陷统计-卡片
 * @cap 缺陷统计-卡片
 * @icon square-sliders
 * @showType card
 */
import { loadConf, ajaxCall } from '../common.js';
let getJsonData = loadConf('systemDefectType.json', {});
let defectTypeList = getJsonData.typeData.map((item) => {
        return item.value;
    }),
    statusList = getJsonData.statusData.map((item) => {
        return item.value;
    });

export default {
    type: 'card',
    cap: '缺陷统计',
    icon: 'bug',
    class: 'defectStatisticsDoublePie',
    broker: 'gridRiskMonitor',
    styles: [
        'size.fullsize',
        Styles.css({
            '--jam-card-bodyslot-padding': '0.25rem 0.5rem'
        }),
        Styles.stylesheet({
            ':scope': {
                'jam-buttongroup': {
                    position: 'absolute',
                    right: 0,
                    top: '-3.4rem',
                    margin: 's s'
                }
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
                            cap: jaml.var('event-chart-pie-info', (chartLeftInfo) => chartLeftInfo)
                        }
                    ]
                },
                {
                    type: 'pie16',
                    props: {
                        title: '缺陷统计',
                        dataType: 'analog',
                        valueType: 'number',
                        decimalPos: 0,
                        toFixed: false,
                        unit: '条',
                        radius1: ['40%', '70%'],
                        radius2: ['40%', '60%']
                    },
                    styles: ['pie16.basic', 'css(display:flex;width:100%;height:calc(100% - 1.6rem);)'],
                    onafterrender: async function () {
                        const _el = jam.findElement(this.element, 'jam-chart');
                        await _el?.chartReady;
                        _el.chart.on('click', (params) => {
                            if (params.componentType === 'series') {
                                let clickName = params.name;

                                let clickTypeId = getJsonData.typeData.find((item) => item.name == clickName);
                                rambutan.switchTo('/maintenance/system-defect-management', {
                                    token: jam.getUrlParam('token')
                                });
                                mango.pub('systemDefectManagementParmas', {
                                    defectType: clickTypeId ? [clickTypeId.value] : [5]
                                });
                            }

                            _el.chart.off('click');
                        });
                    }
                }
            ]
        }
    ],
    vars: {
        data: {
            id: '000',
            value: 42,
            chartData: [['类型', '总数']]
        }
    },
    watchers: {},
    methods: {
        getDefectData() {
            let _this = this;
            jam.ajaxCall({
                urlKey: 'getSysDefectEchartsData',
                method: 'post',
                data: {
                    startDate: moment().format('YYYY-MM-01'),
                    endDate: moment().endOf('month').format('YYYY-MM-DD'),
                    regionIdList: [],
                    statusList,
                    type: 'defectType',
                    defectTypeList
                },
                onsuccess(res) {
                    const { data } = res;
                    const names = ['类型', '总数'];
                    const values = [];
                    let total = 0;
                    var xData = [],
                        yData = [];
                    for (var key in data) {
                        values.push([key, data[key]]);
                        xData.push(key);
                        yData.push(data[key]);
                        total += data[key];
                    }
                    _this.vars.data.chartData = [names, ...values];
                    _this.vars.data.value = total;
                    let maxIndex = yData.indexOf(Math.max.apply(null, yData));
                    _this.model['event-chart-pie-info'] = total
                        ? `<div>
                            总缺陷
                            <b style="color:${jam.colorText()}">${total}</b>
                            条，其中
                            <b style="color:${jam.colorText()}">${xData[maxIndex]}</b>
                            缺陷次数最多
                        </div>`
                        : `<div>
                            总缺陷
                            <b style="color:${jam.colorText()}">${total}</b>
                            条
                        </div>`;
                },
                useMock: true
            });
        }
    },
    onmount: function () {},
    onafterrender: function () {
        this.getDefectData();
    }
};
