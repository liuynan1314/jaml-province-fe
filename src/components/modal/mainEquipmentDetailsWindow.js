// 负载率曲线弹窗
let _model, _msgr;
import { loadConf } from '../../common';
const map = loadConf('name.json') || {};
const mainEquipmentDetailsWindow = (params) => {
    return {
        type: 'card',
        icon: '',
        cap: params._title || '',
        styles: [
            Styles.card.floating({
                width: '23vw',
                height: '60vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                styles: ['layout.alignlabel', 'layout.autoalign', 'stylize.gridline', 'size.fullsize', 'css(font-size:1rem;overflow-y:auto;backgroundColor:transparent;)'],
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
                        if (item == 'ctime' || item == 'startTime' || item == 'manufactureDate') {
                            obj.push({
                                name: map?.[item] || '',
                                value: params?.[item] ? moment(params?.[item]).format('YYYY-MM-DD HH:mm:ss') : ''
                            });
                        } else {
                            obj.push({
                                name: map?.[item] || '',
                                value: params?.[item] || ''
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

export default mainEquipmentDetailsWindow;
