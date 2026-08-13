import { urlConfig, findCol, defectPageConfig } from '../global.js';
import cmpt from '../components/systemDefectManagement/index.js';
const homeConfig = defectPageConfig?.systemDefectManagement;
const layout = homeConfig?.[0];
let _model, _msgr;

export default {
    type: 'wrapper',
    id: 'systemDefectManagement',
    broker: 'systemDefectManagement',
    class: '',
    styles: [
        'size.fullsize',
        Styles.stylesheet({
            ':scope': {
                // padding: '1.2rem',
                'box-sizing': 'border-box'
            },
            '.form-box': {
                display: 'flex',
                'flex-direction': 'column',
                '.form-time': {
                    display: 'flex',
                    'align-items': 'flex-end',
                    'flex-wrap': 'wrap',
                    marginTop: 'var(--gap)',
                    '.fa-clock': {
                        '--color': 'var(--jam-color-primary-subtle) !important',
                        '--stroke-color': 'var(--jam-color-primary-subtle) !important',
                        '--color2': `rgba(0,0,0,0) !important`,
                        marginTop: '0.2rem'
                    }
                }
            },
            '.chart-box': {
                display: 'flex',
                'flex-direction': 'column',
                '.right-tab': {
                    display: 'flex !important',
                    'justify-content': 'space-between',
                    'padding-left': '0.5rem',
                    '.right-title': {
                        'span[slot=cap]': {
                            display: 'block',
                            minWidth: '13.2rem',
                            height: '2.25rem',
                            color: 'var(--jam-color-fg-default)',
                            fontSize: 's',
                            backgroundImage: 'url(./../assets/images/new/title_level.png)',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'bottom var(--gap) left',
                            'padding-left': '1.5rem'
                        }
                    },
                    '.right-tab-item': {
                        width: '5.5rem',
                        height: '1.875rem',
                        cursor: 'pointer',
                        'justify-content': 'center',
                        background: 'url(../../../../assets/images/new/tab_default2.png) no-repeat',
                        color: 'muted',
                        backgroundSize: '100% 100%'
                    },
                    '.right-tab-item:hover': {
                        background: 'url(../../../../assets/images/new/tab_hover2.png) no-repeat',
                        backgroundSize: '100% 100%'
                    },
                    '.right-tab-item.active': {
                        color: 'var(--jam-color-fg-default)',
                        fontWeight: 'bold',
                        background: 'url(../../../../assets/images/new/tab_hover2.png) no-repeat',
                        backgroundSize: '100% 100%'
                    }
                },
                '.chart-bar-box': {
                    width: '100%',
                    height: '100%',
                    border: 's solid var(--jam-color-primary-subtle)',
                    'flex-direction': 'column',
                    '.chart-title': {
                        marginLeft: '3%',
                        marginRight: '5%',
                        justifyContent: 'space-between',
                        color: 'var(--jam-color-fg-default)',
                        fontSize: 's',
                        '.title-color': {
                            color: 'primary'
                        }
                    },
                    '.chart-bar': {
                        width: '100%',
                        height: 'calc(100% - 1rem)'
                    }
                }
            },
            '.table-box': {
                display: 'flex',
                'flex-direction': 'column',
                'margin-top': '1rem',
                '.detail-btn': {
                    cursor: 'pointer',
                    color: 'primary' 
                }
            }
        }),
        'css(--gap:var(--jam-space-m))',
        // 'padding(var(--gap))',
        'flex(direction: column)'
    ],
    plugins: ['popup.helper', 'popup.tip(subTip:true)', "-shortcut.search({selector:'.jam-option'})"],
    components: [
        {
            type: 'wrapper',
            class: 'form-box',
            styles: ['flex(1)', 'props(display:flex;flexDirection:column;justifyContent:space-between)'],
            components: [
                {
                    type: 'buttongroup-radio',
                    class: 'form-item',
                    defaultValue: 1,
                    styles: [Styles.buttonGroupStylesWithBgCap],
                    data: [
                        {
                            name: '缺陷统计',
                            value: 1
                        },
                        {
                            name: '缺陷详情',
                            value: 2
                        }
                    ],
                    onvaluechange: function (value) {
                        _msgr.pub('pagetype', value);
                    }
                },
                {
                    type: 'wrapper',
                    class: '',
                    styles: ['flex(1)'],
                    components: jaml.var('elements', (data) =>
                        data.map((el, idx) => {
                            const pagetype = _msgr.get('pagetype');
                            return cmpt[el.id](pagetype - 1);
                        })
                    )
                }
            ]
        }
    ],
    watchers: {
        pagetype(value) {
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
    onafterrender: function () {}
};
