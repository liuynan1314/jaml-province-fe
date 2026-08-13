import { urlConfig } from '../global.js';
import { ajaxCall, loadConf } from '../common.js';
import moment from 'moment';
// import { createWindow } from '../components/createWindow.js';
import alarmSearchTable from '../components/modal/alarmSearchTable.js';
let yearList = loadConf('detailConfig.json', {}).yearList;
let currentYear = moment().format('YYYY');
let clickIndex, clickSeriesName; //点击记录
let _model,
    _msgr = null,
    _this,
    _el;
let lineOptions = {};
const monthData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
export default {
    type: 'card',
    class: '',
    icon: 'history',
    styles: ['size.fullsize', Styles.stylesheet({})],
    components: [
        {
            type: 'wrapper',
            styles: [
                'size.fullsize',
                Styles.css({ position: 'relative' }),
                Styles.stylesheet({
                    ':scope': {
                        flexDirection: 'column'
                    },
                    '.year-box': {
                        width: '5rem',
                        height: '2.5rem',
                        marginLeft: 's'
                    },
                    '.chart-line': {
                        height: 'calc(100% - 2.5rem)'
                    }
                })
            ],
            components: [
                {
                    type: 'select',
                    class: 'year-box',
                    cap: '年份：',
                    data: yearList,
                    valueKey: 'year',
                    placeholder: '',
                    defaultValue: moment().format('YYYY'),
                    onvaluechange(val) {
                        currentYear = val;
                        _this.methods.getOverloadTrendStatistics(val);
                    }
                },
                {
                    type: 'basicLineChart',
                    class: 'chart-line',
                    ref: 'lineChart',
                    props: {
                        chartData: '{{data}}'
                    },
                    vars: {},
                    styles: ['basicLineChart.basic'],
                    onafterrender: async function () {
                        _el = jam.findElement(this.element, 'jam-chart');
                        await _el.chartReady;
                        lineOptions = jam.cloneDeep(_el.chartOption);
                        _el.chart.on('click', (params) => {
                            if (params.componentType === 'series') {
                                let seriesIndex = monthData.findIndex((item) => item == params.name);
                                let seriesName = params.seriesName;
                                // if (clickIndex == seriesIndex && clickSeriesName == seriesName) {
                                //     renderStartStatus();
                                // } else {
                                //     highlightLineByIndex(seriesIndex, seriesName);
                                // }
                                // _el.chart.setOption(lineOptions);
                                jam.renderModal(
                                    '#main',
                                    alarmSearchTable({
                                        time: params.name.slice(0, -1),
                                        type: seriesName == '重载' ? 1 : 2,
                                        year: currentYear
                                    })
                                );

                                // createWindow({
                                //     title: `历史重过载`,
                                //     width: '80vw',
                                //     height: '75vh',
                                //     body: alarmSearchTable({
                                //         time: params.name.slice(0, -1),
                                //         type: seriesName == '重载' ? 1 : 2,
                                //         year: currentYear
                                //     }),
                                //     showBtn: false
                                // });
                            }
                        });
                    }
                }
            ]
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    methods: {
        getOverloadTrendStatistics(val = currentYear) {
            jam.ajaxCall({
                urlKey: 'getOverloadTrendStatistics',
                data: {
                    devType: 2,
                    year: val
                },
                onsuccess(result) {
                    const { data } = result;
                    const heavyData = data.map((item) => item?.heavyCount || 0);
                    const overData = data.map((item) => item?.overCount || 0);

                    const trendData = monthData.map((item, index) => {
                        const currnetMonth = moment().month() + 1;
                        if (currentYear < moment().format('YYYY')) {
                            return [item, overData[index], heavyData[index]];
                        } else {
                            return [item, index < currnetMonth ? overData[index] : null, index < currnetMonth ? heavyData[index] : null];
                        }
                    });
                    let chartData = [['时间', '过载', '重载'], ...trendData];
                    _this.ref('lineChart').vars.data = chartData;
                }
            });
        }
    },
    onafterrender: function () {
        _this = this;
        this.getOverloadTrendStatistics();
    }
};

// 还原
function renderStartStatus() {
    lineOptions.xAxis.axisLabel = {
        color: 'hsl(0, 0%, 64.31%)',
        interval: 0,
        formatter: function (value, idx) {
            return `{a|${value}}`;
        },
        rich: {
            a: {
                fontWeight: 'normal',
                fontSize: jam.rem(0.87)
            }
        }
    };

    lineOptions.series[0].lineStyle = {
        color: 'hsl(197.09, 80.37%, 41.96%)'
    };
    lineOptions.series[1].lineStyle = {
        color: 'hsl(156.73, 64.19%, 55.1%)'
    };
    clickIndex = null;
    clickSeriesName = null;
}

// 高亮
function highlightLineByIndex(index, type) {
    lineOptions.xAxis.axisLabel = {
        color: function (value, idx) {
            const color = `rgba(${jam.accolor._rgb})`;
            return idx === index ? color : 'hsl(0, 0%, 64.31%)';
        },
        formatter: function (value, idx) {
            // 根据 index 决定是否加粗
            return idx === index ? `{a|${value}}` : value;
        },
        rich: {
            a: {
                fontWeight: 'bold',
                fontSize: 16
            }
        },
        interval: 0
    };

    if (type == '过载') {
        lineOptions.series[0].lineStyle = {
            color: 'yellow'
        };
        lineOptions.series[1].lineStyle = {
            color: 'hsl(156.73, 64.19%, 55.1%)'
        };
    } else if (type == '重载') {
        lineOptions.series[1].lineStyle = {
            color: 'yellow'
        };
        lineOptions.series[0].lineStyle = {
            color: 'hsl(197.09, 80.37%, 41.96%)'
        };
    }
    clickIndex = index;
    clickSeriesName = type;
}
