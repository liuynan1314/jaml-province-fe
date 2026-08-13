import { urlConfig, layoutPageConfig } from '../global.js';
import cmpt from '../components/systemOperatingRecords/index.js';
const homeConfig = layoutPageConfig?.systemOperatingRecords;
const layout = homeConfig?.[0];
let _model, _msgr;
export default {
    type: 'wrapper',
    broker: 'systemOperatingRecords',
    class: 'power-outage-statistics',
    styles: [
        'size.fullsize',
        Styles.stylesheet({
            ':scope': {
                // padding: 'm',
                // padding: 's',
                'box-sizing': 'border-box'
            },
            '.form-box': {
                display: 'flex',
                'flex-direction': 'column'
            },
            '.chart-box': {
                display: 'flex',
                'flex-direction': 'column'
            },
            '.table-box': {
                display: 'flex',
                'flex-direction': 'column'
            }
        }),
        Styles.layout.grid({ cols: 16, rows: 18, gap: `0.5rem` })
    ],
    plugins: ['popup.helper', 'popup.tip(subTip:true)', "-shortcut.search({selector:'.jam-option'})"],
    components: [
        {
            type: 'wrapper',
            class: 'form-box',
            styles: [Styles.layout.gridpos(1, 1, 16, 1), 'props(display:flex;flexDirection:column;justifyContent:space-between)'],
            components: [
                {
                    type: 'buttongroup-radio',
                    class: 'form-item',
                    defaultValue: 1,
                    styles: [Styles.buttonGroupStylesWithBgCap],
                    data: [
                        {
                            name: '运维人员',
                            value: 1
                        },
                        {
                            name: '运维记录',
                            value: 2
                        },
                        {
                            name: '运维日志',
                            value: 3
                        }
                    ],
                    onvaluechange: function (value) {
                        _msgr.pub('pageIndex', value);
                        _msgr.pub('table_type', value);
                        _msgr.pub('change_type', true);
                    }
                }
            ]
        },
        {
            type: 'wrapper',
            class: '',
            styles: [
                Styles.layout.gridpos(1, 2, 16, 17),
                Styles.stylesheet({
                    ':scope': {
                        gap: `1rem`
                    }
                })
            ],
            components: jaml.var('elements', (data) =>
                data.map((el, idx) => {
                    const pageIndex = _msgr.get('pageIndex');
                    console.log('pageIndex', pageIndex);
                    return cmpt[el.id](pageIndex - 1);
                })
            )
        }
    ],
    watchers: {
        pageIndex(value) {
            console.log(111, value - 1);
            _model.vars = {
                ..._model.vars,
                elements: homeConfig?.[value - 1].elements
            };
        }
    },
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        _model.vars = {
            elements: layout.elements
        };
    }
};
