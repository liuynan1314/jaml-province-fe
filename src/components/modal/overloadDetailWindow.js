// 负载率曲线弹窗
let _model, _msgr;
import { ajaxCall } from '../../common';
const map = {
    regionName: '单位',
    stName: '变电站',
    bvName: '电压等级',
    devName: '设备名称',
    loadRate: '实时负载率(%)',
    totalLoadNumb: '重过载次数',
    totalLoadTime: '重过载时长(min)',
    startTime: '发生时间',
    // endTime: '结束时间',
    maxLoad: '最大负荷(MW)',
    maxLoadRate: '最大负载率',
    trwdTemp: '主变油温(℃)',
    windTemp: '绕组温度(℃)',
    loadStatus: '重过载类型',
    mvanom: '额定容量(MVA)',
    windType: '绕组类型'
};
const overloadDetailWindow = (params) => {
    return {
        type: 'card',
        icon: '',
        cap: '重过载详情',
        styles: [
            Styles.card.floating({
                width: '40vw',
                height: '40vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                styles: ['layout.alignlabel', 'layout.autoalign', 'stylize.gridline', 'size.fullsize', 'css(font-size:1rem;overflow:auto;backgroundColor:transparent;)'],
                components: [
                    {
                        type: 'input',
                        buildFor: 'item in overloadDetail',
                        disabled: true,
                        cap: '{{item.name}}',
                        value: '{{item.value}}'
                    }
                ],
                watchers: [],
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                onafterrender: function () {
                    let obj = [];
                    Object.keys(map).forEach((item) => {
                        if (item == 'totalLoadTime') {
                            obj.push({
                                name: map?.[item] || '',
                                value: Math.floor(params?.[item] / 60) || ''
                            });
                        } else {
                            obj.push({
                                name: map?.[item] || '',
                                value: params?.[item] || params?.[item] === 0 ? params?.[item] : ''
                            });
                        }
                    });
                    _model.vars.overloadDetail = obj;
                },
                onunmount: function () {}
            }
        ]
    };
};

export default overloadDetailWindow;
