import { ajaxCall } from '../common.js';
let _model,
    _msgr = null;
const colorSet = ['rgba(14,129,128,1)', 'rgba(227,195,99,1)', 'rgba(208,104,76,1)'];

export default {
    type: 'card',
    class: 'riskInfo',
    styles: [
        'size.fullsize',
        Styles.stylesheet({
            '.riskInfoChart': {
                width: '100%',
                height: '100%'
            }
        })
    ],
    components: [
        {
            type: 'indicator-number',
            cap: '总计',
            value: '{{warningTotalCount}}',
            unit: '个',
            styles: [
                //
                'layout(position:absolute;transform:translate(-50%,-50%);zIndex:1)',
                'css(top:55%;left:50%;grid-template-areas:"c c c c""v v v u")',
                'cap.css(gridArea:c;justifySelf:center)',
                `value.text(size:l;family:DINPro;)`,
                'indicator.unit.css(backgroundColor:transparent;boxShadow:none;)'
            ]
        },
        {
            type: 'chart-pie',
            colorSet,
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
                    label: {}
                }),
                Styles.echarts.Radar.axisName.textStyle({ size: jam.convert2Px('0.75rem') })
            ],
            data: '{{chartData}}'
        }
    ],
    vars: {
        warningTotalCount: 0,
        chartData: []
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
        'riskInfoData',
        {
            success(data) {
                console.log(2222, data);
                let sum = 0;
                for (var key in data) {
                    sum += data[key];
                }
                _model.vars.warningTotalCount = sum;

                _model.vars.chartData = [
                    ['type', '数量'],
                    ['三级风险', data.count1 || 0],
                    ['四级风险', data.count2 || 0],
                    ['五级风险', data.count3 || 0]
                ];
            },
            useMock: true,
            type: 'get'
        },
        false
    );
}
