import { ajaxCall } from '../common.js';
let _model,
    _msgr = null;
export default {
    type: 'card',
    class: 'dataQuality',
    icon: 'chart-pie',
    styles: [
        'size.fullsize',
        Styles.stylesheet({
            '.dataQuality-chart': {
                width: '100%',
                height: '100%'
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            styles: [
                'size.fullsize',
                'css(padding:0.5rem;)',
                Styles.stylesheet({
                    ':scope .legend:hover': {
                        backgroundColor: 'var(--jam-color-primary-subtle) !important'
                    },
                    ':scope': {
                        // cursor: 'pointer'
                    }
                })
            ],
            components: [
                // {
                //     type: 'label',
                //     class: 'dataQualityTitle',
                //     cap: '{{_dataQualityTitle}}'
                // },
                {
                    type: 'polarBarWithLegend',
                    // class: 'dataQuality-chart',
                    props: {
                        hasTitle: false,
                        hasValue: false,
                        hasSubtitle: false,
                        hasUnit: false,
                        hasIcon: false,
                        hasTags: false
                    },
                    styles: ['polarBarWithLegend.basic']
                }
            ]
            // onclick() {
            //     rambutan.switchTo('/data-quality-control-new', {
            //         token: jam.getUrlParam('token')
            //     });
            // }
        }
    ],
    vars: {
        data: {
            chartData: [
                ['type', '今日'],
                ['通道在线情况', 0, '%'],
                ['事故信号正确性', 0, '%'],
                ['数据完整度', 0, '%'],
                ['采集合格率', 0, '%'],
                ['量测正确率', 0, '%']
            ]
        }
    },
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        onRenderBarChart();
    }
};

function onRenderBarChart() {
    ajaxCall(
        'getMonitorIndexStatAll',
        {
            success(data) {
                const _chartData = [
                    ['type', '今日'],
                    ['通道在线情况', Number(Number(data.channel.rate * 100 || 0).toFixed(2)), '%'],
                    ['事故信号正确性', Number(Number(data.accident.rate * 100 || 0).toFixed(2)), '%'],
                    ['数据完整度', Number(Number(data.dataCompleteness.rate * 100 || 0).toFixed(2)), '%'],
                    ['采集数据质量', Number(Number(data.dataValid.rate * 100 || 0).toFixed(2)), '%'],
                    ['遥测遥信匹配度', Number(Number(data.yxYcMatch.rate * 100 || 0).toFixed(2)), '%']
                ];
                setTimeout(() => {
                    _model.data.chartData = _chartData;
                }, 100);
                // const maxItem = _chartData.reduce((max, item) => (item[1] > max[1] ? item : max), _chartData[0]);
                // const minItem = _chartData.reduce((min, item) => (item[1] < min[1] ? item : min), _chartData[0]);

                // const maxName = maxItem[0];
                // const minName = minItem[0];
                // const _dataQualityTitle = `<span style="fontSize:0.875rem;color:${hslaToJamAc('hsl(200.8, 56.3%, 82.9%)')}">${maxName}<span style="color:${hslaToJamAc('hsl(156.3, 52.5%, 53.7%)')}">最高</span>，${minName}<span style="color:${hslaToJamAc('hsl(12.7, 58.4%, 55.7%)')}">最低</span></span>`;
                // console.log('_dataQualityTitle', _dataQualityTitle);
                // _model.vars._dataQualityTitle = _dataQualityTitle;
            },
            params: {
                beginTime: moment().format('YYYY-MM-DD 00:00:00'),
                endTime: moment().format('YYYY-MM-DD 23:59:59')
            },
            useMock: false,
            type: 'post'
        },
        false
    );
}

// function initDataQualityChart() {
//     let information = {
//         dataArray: [
//             { name: '单位一', value: 56.8 },
//             { name: '单位二', value: 25.8 },
//             { name: '单位三', value: 16.8 },
//             { name: '单位四', value: 13.8 },
//             { name: '单位五', value: 5.8 }
//         ],
//         colorArray: ['#1df9fc', '#1e67f2', '#6e69f9', '#00b7ee', '#fed52f']
//     };
//     let series = [],
//         legend = [];
//     information.dataArray.forEach((item, index) => {
//         const radius = 100 - (index + 1) * 30;
//         series.push({
//             name: item.name,
//             type: 'gauge',
//             center: ['30%', '53%'],
//             startAngle: 90,
//             endAngle: 360,
//             clockwise: false,
//             radius: radius,
//             itemStyle: {
//                 color: information.colorArray[index]
//             },
//             progress: {
//                 show: true,
//                 width: 5,
//                 roundCap: true
//             },
//             pointer: {
//                 show: false
//             },
//             axisLine: {
//                 roundCap: true,
//                 lineStyle: {
//                     width: 10,
//                     color: [[1, '#2b4070']]
//                 }
//             },
//             axisTick: {
//                 show: false
//             },
//             splitLine: {
//                 show: false
//             },
//             axisLabel: {
//                 show: false
//             },
//             anchor: {
//                 show: false
//             },
//             detail: {
//                 valueAnimation: true,
//                 formatter: '{value}%',
//                 color: '#fff',
//                 fontSize: 12,
//                 offsetCenter: [80, radius * -1 + 6]
//             },
//             data: [item.value]
//         });
//         legend.push({
//             data: [
//                 {
//                     name: item.name,
//                     icon: 'path://M20 15A5 5 0 1 0 20 5A5 5 0 0 0 20 15ZM20 7A3 3 0 1 1 20 13A3 3 0 0 1 20 7Z',
//                     borderWidth: 0
//                 }
//             ],
//             formatter: function (name) {
//                 return `{leftStyle| ${name}}{rightStyle| ${information.dataArray.find((item) => item.name == name).value}%}`;
//             },
//             right: '2%',
//             top: `${30 + (index + 1) * 5}%`, // 调整每一个legend的位置
//             backgroundColor: 'rgba(18, 63, 115, 0.7)', // 背景色
//             padding: [10, 20],
//             width: 10,
//             textStyle: {
//                 //   height: 18,
//                 width: 220, // 文字总宽度
//                 rich: {
//                     leftStyle: {
//                         color: '#fff',
//                         fontSize: 20
//                     },
//                     rightStyle: {
//                         // 右侧样式
//                         align: 'right',
//                         fontSize: 20,
//                         color: information.colorArray[index]
//                     },
//                     a: {
//                         verticalAlign: 'middle'
//                     }
//                 }
//             }
//         });
//     });
//     return {
//         legend: legend,
//         xAxis: [
//             {
//                 show: false
//             }
//         ],
//         yAxis: [
//             {
//                 show: false
//             }
//         ],
//         series: series
//     };
// }
