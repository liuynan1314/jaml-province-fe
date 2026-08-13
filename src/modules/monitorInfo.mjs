import { ajaxCall } from '../common.js';
let _model,
    _msgr = null;
const beginTime = moment().format('YYYY-MM-01 00:00:00');
const endTime = moment().format('YYYY-MM-DD 23:59:59');
import { createWindow } from '../components/createWindow.js';
import monitorInfoWindow from '../components/modal/monitorInfoWindow.js';
export default {
    type: 'card',
    class: 'monitorInfo',
    styles: [
        'size.fullsize',
        Styles.stylesheet({
            '.dateBtnList': {
                position: 'absolute',
                top: '-0.25rem',
                right: 0
            },

            '.monitor-box': {
                width: '100%',
                height: 'calc(100% - 1rem)',
                display: 'flex'
            }
        })
    ],
    components: [
        {
            type: 'buttongroup-radio',
            class: 'dateBtnList',
            styles: [Styles.buttonGroupDateList],
            defaultValue: 1,
            data: [
                {
                    name: '消防监测',
                    value: 1
                },
                {
                    name: '在线监测',
                    value: 2
                }
            ],
            onvaluechange: function (val) {
                _msgr.pub('monitiorType', val);
                if (val == 1) {
                    renderfirefightingChart();
                } else {
                    renderOnlineMonitorChart();
                }
            }
        },
        {
            type: 'wrapper',
            class: 'monitor-box'
        }
    ],

    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        renderfirefightingChart();
    }
};

function renderfirefightingChart() {
    const groupTimeType = _msgr.get('groupTimeType') || 1;

    const xAxisData = ['消防总信号', '气体灭火系统', '防排烟系统', '应急照明系统'];
    let chartData = [];
    let totalSignal = 0;
    let gas = 0;
    let smoke = 0;
    let lighting = 0;
    let newData = [
        {
            name: '消防总信号',
            value: 52
        },
        {
            name: '气体灭火系统',
            value: 5
        },
        {
            name: '防排烟系统',
            value: 50
        },
        {
            name: '应急照明系统',
            value: 51
        }
    ];
    ajaxCall(
        'getFireMonitorRegionStatistic',
        {
            success(data) {
                data.forEach((item) => {
                    totalSignal += item.signalCnt;
                    gas += item.gasCnt;
                    smoke += item.smokeCnt;
                    lighting += item.lightingCnt;
                });
                chartData = [totalSignal, gas, smoke, lighting];
                const barEchart = echarts.init(document.querySelector('.monitor-box'));
                barEchart.setOption(getEchartsOption(chartData, xAxisData, '#20BBB1', '#32E7CB', 1), true);
                barEchart.off();
                barEchart.on('click', function (params) {
                    let type = newData.filter((item) => item.name === params.name);
                    let paramsObj = {
                        type: type[0].value,
                        tabType: 1 //消防监测
                    };
                    createWindow({
                        title: `消防监测列表`,
                        width: '80vw',
                        height: '75vh',
                        body: monitorInfoWindow(paramsObj),
                        showBtn: false
                    });
                });

                window.addEventListener('resize', barEchart.resize);
            },
            params: {
                beginTime,
                endTime
            },
            useMock: false,
            type: 'post'
        },
        false
    );
}

function renderOnlineMonitorChart() {
    let xAxisData = ['SF6', '主变油色谱', '温湿度', '蓄电池'];
    let chartData = [];
    let sf = 0;
    let oil = 0;
    let temp = 0;
    let battery = 0;
    let newData = [
        {
            name: 'SF6',
            value: 0
        },
        {
            name: '主变油色谱',
            value: 1
        },
        {
            name: '温湿度',
            value: 2
        },
        {
            name: '蓄电池',
            value: 3
        }
    ];
    ajaxCall(
        'getOnlineMonitorRegionStatistic',
        {
            success(data) {
                data.forEach((item) => {
                    sf += item.sfCnt;
                    oil += item.oilCnt;
                    temp += item.tempCnt;
                    battery += item.batteryCnt;
                });
                chartData = [sf, oil, temp, battery];
                const barEchart = echarts.init(document.querySelector('.monitor-box'));
                barEchart.setOption(getEchartsOption(chartData, xAxisData), true);
                barEchart.off();
                barEchart.on('click', function (params) {
                    let type = newData.filter((item) => item.name === params.name);
                    let paramsObj = {
                        type: type[0].value,
                        tabType: 2
                    };
                    createWindow({
                        title: `在线监测列表`,
                        width: '75vw',
                        height: '75vh',
                        body: monitorInfoWindow(paramsObj),
                        showBtn: false
                    });
                });

                window.addEventListener('resize', barEchart.resize);
            },
            params: {
                beginTime,
                endTime
            },
            useMock: false,
            type: 'post'
        },
        false
    );
}

function getEchartsOption(resData, xAxisData) {
    const barWidth = '15';

    return {
        grid: {
            left: '2%',
            right: '2%',
            bottom: '-15%',
            top: '1%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                shadowStyle: {
                    color: 'rgba(0,0,0,0.2)'
                }
            },
            backgroundColor: 'rgba(50,50,50,0.7)',
            textStyle: {
                color: '#fff'
            },
            borderColor: 'rgba(0,0,0,0)',
            formatter: function (params) {
                return '<br>' + params[0].marker + params[0].name + ' : ' + params[0].value;
            }
        },
        xAxis: {
            show: false,
            type: 'value'
        },
        yAxis: [
            {
                type: 'category',
                inverse: true,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: 'hsl(200.8, 56.3%, 82.9%)',
                        fontSize: '0.875rem'
                    }
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                data: xAxisData
            },
            {
                type: 'category',
                inverse: true,
                axisTick: 'none',
                axisLine: 'none',
                show: true,
                axisLabel: {
                    textStyle: {
                        color: 'hsl(199.4, 100%, 93.9%)',
                        fontFamily: 'DINPro',
                        fontSize: '1.125rem'
                    },
                    formatter: function (value) {
                        return value + '台';
                    }
                },
                data: resData
            }
        ],
        series: [
            {
                name: '值',
                type: 'bar',
                zlevel: 1,
                barCategoryGap: 23,
                itemStyle: {
                    normal: {
                        color: function (i) {
                            var color, color1;
                            if (i.name == '消防总信号' || i.name == 'SF6') {
                                color = 'hsl(156.3, 52.5%, 53.7%)';
                                color1 = 'hsla(156.3, 52.5%, 53.7%, 0.1)';
                            } else if (i.name == '气体灭火系统' || i.name == '主变油色谱') {
                                color = ' hsl(45, 69.6%, 63.9%)';
                                color1 = 'hsla(45, 69.6%, 63.9%, 0.1)';
                            } else if (i.name == '防排烟系统' || i.name == '温湿度') {
                                color = ' hsl(12.7, 58.4%, 55.7%)';
                                color1 = 'hsla(12.7, 58.4%, 55.7%, 0.1)';
                            } else if (i.name == '应急照明系统' || i.name == '蓄电池') {
                                color = ' hsl(216.9, 22%, 46.3%)';
                                color1 = 'hsla(216.9, 22%, 46.3%, 0.1)';
                            }
                            return jam.toEchartsGradient(0, color1, color);
                        }
                    }
                },
                barWidth: barWidth,
                data: resData
            },
            {
                name: '外圆',
                zlevel: 5,
                type: 'scatter',
                symbolOffset: [0, 0],
                hoverAnimation: false,
                symbol: 'image://../../../assets/images/deco_monitor_bar.png',
                symbolSize: [20, 35],
                itemStyle: {
                    normal: {
                        color: '#fff',
                        opacity: 0.5,
                        shadowColor: '#6df8f0',
                        shadowBlur: 10
                    }
                },
                data: resData
            }
        ]
    };
}
