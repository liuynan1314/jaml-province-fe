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
                background: 'elevation',
                border: 's solid var(--jam-color-outline-muted)',
                boxShadow: 'l',
                padding: 's m'
            },
            '.scene-list-title': {
                height: '2.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: 's solid var(--jam-color-outline-muted)'
            },
            '.scene-line': {
                position: 'relative',
                color: 'var(--jam-color-fg-default)',
                fontFamily: 'Source Han Sans CN',
                '&::before, &::after': {
                    display: 'block',
                    content: '',
                    height: '1px',
                    width: '1rem',
                    background: 'var(--jam-color-primary-default)',
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
        label: [Styles.label.icon.css({ fontSize: 'l', cursor: 'pointer' })]
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
                            marginBottom: 's'
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
