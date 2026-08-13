// import '../css/bus-voltage-limit.scss';
import { urlConfig } from '../global.js';
import { ajaxCall } from '../common.js';
let _model = null,
    _msgr = null;
let isClickSame = false,
    clickBeginRate;
export default {
    type: 'card',
    styles: ['size.fullsize'],
    styles: [
        'size.fullsize',
        Styles.stylesheet({
            ':root': {
                '--1000kV-clr': '#fd7783',
                '--500kV-clr': 'rgb(96, 127, 229)',
                '--220kV-clr': 'rgb(255, 0, 0)',
                '--110kV-clr': 'rgb(72, 194, 255)',
                '--35kV-clr': 'rgb(90, 146, 70)',
                '--10kV-clr': '#f6c81e'
            },
            '.chart-box': {
                width: '100%',
                height: 'calc(100% - 1rem)',
                display: 'flex',
                'flex-wrap': 'wrap',
                border: `1px solid ${jam.ac(0.99, 0.95, 0.6, jam.acLumiO(30))}`
            },
            '.staicesItem': {
                width: '50%',
                height: '50%'
            },
            '.staticsIndicator': {
                width: '100%',
                height: '100%',
                display: 'flex',
                cursor: 'pointer',
                'justify-content': 'flex-start',
                'align-items': 'center'
            },
            ".staticsIndicator span[slot='cap']": {
                display: 'flex',
                'justify-content': 'center',
                width: '50%',
                height: '100%',
                'font-size': '1rem',
                'text-align': 'center',
                background: 'url(../../assets/images/text-bg.png) no-repeat',
                'background-position': 'center 60%'
            },
            ".staticsIndicator span[slot='value']": {
                display: 'flex',
                'justify-content': 'center',
                width: '50%',
                height: '100%',
                'text-align': 'center',
                'align-items': 'center',
                background: 'url(../../assets/images/base.png) no-repeat',
                'font-size': '2.25rem',
                'font-family': 'DIN-Bold',
                'background-position': 'center 60%'
            }
        })
    ],

    components: [
        {
            type: 'wrapper',
            class: 'chart-box',
            components: [
                {
                    type: 'wrapper',
                    class: 'staicesItem',
                    buildFor: `(item) in staticsList`,
                    components: [
                        {
                            type: 'indicator',
                            class: 'staticsIndicator',
                            cap: '{{item.name}}',
                            value: '{{item.value}}',
                            onclick: function () {
                                let beginRate = 0,
                                    endRate = 0;
                                if (this.cap == '80%-90%') {
                                    beginRate = 80;
                                    endRate = 90;
                                } else if (this.cap == '90%-100%') {
                                    beginRate = 90;
                                    endRate = 100;
                                } else if (this.cap == '100%-120%') {
                                    beginRate = 100;
                                    endRate = 120;
                                } else if (this.cap == '120%以上') {
                                    beginRate = 120;
                                    endRate = 200;
                                }
                                if (clickBeginRate != beginRate) {
                                    mango.pub('devOverLoadParmas', {
                                        type: 3,
                                        beginRate,
                                        endRate
                                    });
                                    clickBeginRate = beginRate;
                                } else {
                                    mango.pub('devOverLoadParmas', {
                                        type: 3,
                                        beginRate: '',
                                        endRate: ''
                                    });
                                    clickBeginRate = '';
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ],
    onunmount: function () {
        mango.unsub('overload_intervals');
    },
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        mango.sub('overload_intervals', (data) => {
            const staticsList = [
                { name: '80%-90%', value: data.count1 || 0 },
                { name: '90%-100%', value: data.count2 || 0 },
                { name: '100%-120%', value: data.count3 || 0 },
                { name: '120%以上', value: data.count4 || 0 }
            ];
            _model.vars.staticsList = staticsList;
        });
    }
};
