import { hslaToJamAc } from '../utils/Constants.js';

let _model, _msgr;

jaml.register('sceneList', {
    type: 'container',
    styles: [
        Styles.stylesheet({
            ':scope': {
                minHeight: '20rem',
                minWidth: '50rem',
                background: 'red',
                position: 'absolute',
                top: '2.3rem',
                left: '3.65rem',
                zIndex: 9999,
                background: hslaToJamAc('hsla(213.5, 65%, 15.7%, 0.9)'),
                border: `1px solid ${hslaToJamAc('hsl(196.5, 54.4%, 35.3%)')}`,
                boxShadow: `0px 4px 12px 0px ${hslaToJamAc('hsla(218, 80.3%, 12%, 0.5)')}`,
                padding: '0.3rem 0.5rem'
            },
            '.scene-list-title': {
                height: '2.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${hslaToJamAc('hsl(208.2, 25%, 26.7%)')}`
            },
            '.scene-line': {
                position: 'relative',
                color: hslaToJamAc('hsl(199.4, 100%, 93.9%)'),
                fontFamily: 'Source Han Sans CN',
                '&::before, &::after': {
                    display: 'block',
                    content: '',
                    height: '1px',
                    width: '1rem',
                    background: hslaToJamAc('hsl(180, 100%, 41%)'),
                    position: 'absolute',
                    bottom: 0
                },
                '&::after': {
                    left: '1.4rem'
                },

                '&:last-child::before': {
                    left: '1rem'
                },

                '&:last-child::after': {
                    left: '-0.2rem'
                }
            }
        })
    ],
    descStyles: {
        label: [Styles.label.icon.css({ fontSize: '1.3rem', cursor: 'pointer' })]
    },
    components: [
        {
            type: 'wrapper',
            class: 'scene-list-title',
            components: [
                {
                    type: 'label',
                    class: 'scene-list-title-name scene-line',
                    cap: '切换场景'
                },
                {
                    type: 'label',
                    class: 'scene-list-title-close scene-line',
                    icon: 'close',
                    onclick: function () {
                        _msgr.pub('sceneName', _model.vars.activeScene?.name);
                        _model.vars.isShowSceneCard = false;
                    }
                }
            ]
        },
        {
            type: 'wrapper',
            components: [
                {
                    type: 'buttongroup-radio',
                    // defaultValue: null,
                    valueKey: 'sceneId',
                    class: 'scene-btn-group',
                    dataWatcher: 'sceneList',
                    styles: [
                        Styles.buttonGroupStyles,
                        Styles.button.css({
                            marginBottom: '0.5rem'
                        })
                    ]
                }
            ]
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {}
});
