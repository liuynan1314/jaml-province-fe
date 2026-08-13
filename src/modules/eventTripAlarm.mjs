import { ajaxCall } from '../common.js';
import { hslaToJamAc } from '../utils/Constants.js';
let _model,
    _msgr = null;
const beginTime = moment().format('YYYY-MM-01 00:00:00');
const endTime = moment().format('YYYY-MM-DD 23:59:59');
export default {
    type: 'card',
    class: 'eventTripAlarm',
    styles: [
        'size.fullsize',
        Styles.stylesheet({
            '.eventTitle': {
                width: '100%',
                height: '2rem'
            },
            '.event-trip-alarm-box': {
                width: '100%',
                height: 'calc(100% - 2rem)'
            }
        })
    ],
    components: [
        {
            type: 'label',
            class: 'eventTitle',
            cap: '{{_eventTitle}}'
        },
        {
            type: 'wrapper',
            class: 'event-trip-alarm-box'
        }
    ],

    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        onRenderBarChart();
    }
};

function onRenderBarChart() {
    const detailConf = mango.get('detailConf') || {};
    ajaxCall(
        'getEventDataByEventLevel',
        {
            success(data) {
                let name__ = [],
                    value__ = [],
                    minNum = 0,
                    minNumName = '',
                    maxNum = 0,
                    maxNumName = '';
                (data || []).forEach((v, index) => {
                    if (index == 0) {
                        minNum = v.num;
                        minNumName = v.regionName;
                        maxNum = v.num;
                        maxNumName = v.regionName;
                    }
                    if (maxNum < v.num) {
                        maxNum = v.num;
                        maxNumName = v.regionName;
                    }
                    if (minNum > v.num) {
                        minNum = v.num;
                        minNumName = v.regionName;
                    }
                    name__.push(v.regionName);
                    value__.push(v.num || 0);
                });
                console.log(maxNum, maxNumName);
                const _eventTitle = `<div style="padding-left:0.8rem;">事件化跳闸告警以<span style="color:${hslaToJamAc('hsl(195.3, 100%, 56.1%)')}">${maxNumName}</span>数量最多，<span style="color:${hslaToJamAc('hsl(195.3, 100%, 56.1%)')}">${minNumName}</span>数量最少</div>`;
                _msgr.pub('_eventTitle', _eventTitle);
                const barEchart = echarts.init(document.querySelector('.event-trip-alarm-box'));
                barEchart.setOption(setBusVolageLimitBarEcharts(name__, value__));

                barEchart.on('click', function (params) {
                    rambutan.switchTo('/event-monitor-analysis', {
                        token: jam.getUrlParam('token')
                    });
                    mango.pub('eventTripAlarmParmas', {
                        name: params.name,
                        type: '跳闸'
                    });
                });
                window.addEventListener('resize', barEchart.resize);
            },
            params: {
                contentNotLike: detailConf.contentNotLike ? detailConf.contentNotLike : '',
                startTime: beginTime,
                endTime: endTime,
                eventTypeList: [2, 13, 14, 15, 16],
                notLikeCon: '开关连接刀闸分开'
            },
            useMock: false,
            type: 'post'
        },
        false
    );
}

function setBusVolageLimitBarEcharts(xAxisData, data) {
    const getSymbolData = (datas) => {
        let arr = [];
        for (var i = 0; i < datas.length; i++) {
            arr.push({
                value: datas[i],
                symbolPosition: 'end'
            });
        }
        return arr;
    };
    const series = [
        {
            name: '',
            data,
            type: 'bar',
            barWidth: '60%',
            symbolClip: true,
            label: {
                show: true,
                position: 'top',
                distance: 12,
                fontFamily: 'DINPro',
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                }
            },
            itemStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        x2: 0,
                        y: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'hsl(203.4, 99.2%, 51.4%)'
                            },
                            {
                                offset: 1,
                                color: 'hsla(203.4, 99.2%, 51.4%, 0)'
                            }
                        ]
                    }
                }
            }
        },
        {
            type: 'pictorialBar',
            symbol: 'react',
            symbolSize: ['100%', 3],
            symbolOffset: [0, -2],
            z: 12,
            itemStyle: {
                color: '#fff',
                shadowColor: 'rgba(139,242,191,1)',
                shadowBlur: 4
            },
            data: getSymbolData(data)
        }
    ];

    return {
        tooltip: {
            trigger: 'axis',
            formatter: '{b} : {c}',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLine: {
                lineStyle: {
                    color: 'hsl(201.6, 33.3%, 64.1%)'
                }
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: 'hsl(201.6, 33.3%, 64.1%)'
            }
        },
        yAxis: {
            type: 'value',
            name: '次',
            nameTextStyle: {
                align: 'left',
                fontSize: 14,
                color: 'hsl(201.6, 33.3%, 64.1%)',
                padding: [0, 0, 0, -20]
            },
            axisLine: {
                show: false
            },
            splitNumber: 4,
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: 'hsl(201.6, 33.3%, 64.1%)'
                }
            },
            axisLabel: {
                formatter: function (value, index) {
                    return Number.isSafeInteger(value) ? value : '';
                },
                color: 'hsl(201.6, 33.3%, 64.1%)',
                fontSize: 14
            }
        },
        series: series
    };
}
