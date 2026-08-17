jaml.register('share', {
    type: 'wrapper',
    styles: [
        Styles.stylesheet({
            ':scope': {
                '--jam-icon-size': '2.8rem',
                '--corner-size': '1rem',
                '--corder-pct': '80%',
                // 已降级: radial corner needs theme primary in gradient
                '--corner-bg': 'radial-gradient(transparent var(--corder-pct), var(--jam-color-primary-default) var(--corder-pct))',
                display: 'flex',
                position: 'absolute',
                right: 0,
                top: '30%',
                width: 0,
                background: 'var(--jam-color-primary-default)',
                padding: 0,
                transition: 'all ease-in-out 250ms',
                borderRadius: 'm 0 0 m',
                zIndex: 9999,
                '&:hover': {
                    padding: 'xs',
                    // width: '18rem',
                    width: '12rem',
                    filter: 'drop-shadow(0em 0.8em 1em hsla(0, 0%, 0%, 0.3))'
                },

                '.share-wrapper': {
                    // width: '18rem',
                    width: '12rem',
                    height: '6rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'xs',
                    borderRadius: 'm',
                    background: 'var(--jam-color-primary-subtle)',
                    '.share-item': {
                        width: '5.5rem',
                        height: '5.5rem',
                        borderRadius: 'm',
                        'grid-template-areas': "'i i i i' 'c c c c'",
                        'grid-gap': 's',
                        cursor: 'pointer',
                        '&:hover': {
                            background: 'var(--jam-color-primary-subtle)',
                            'box-shadow': 's'
                        },
                        '&>span[slot=cap]': {
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        }
                    }
                },
                '.icon-wrapper': {
                    borderRadius: 'm 0 0 m',
                    position: 'absolute',
                    top: '1.5rem',
                    left: '-1.2rem',
                    height: '3.4rem',
                    width: '1.2rem',
                    display: 'flex',
                    // 已降级: linear-gradient needs theme primary stops
                    background: 'linear-gradient(90deg, var(--jam-color-primary-subtle), transparent) var(--jam-color-primary-default)',
                    alignItems: 'center',
                    justifyContent: 'center',

                    '&::before': {
                        content: '',
                        position: 'absolute',
                        height: 'var(--corner-size)',
                        width: 'var(--corner-size)',
                        top: 'calc(0% - var(--corner-size))',
                        right: '0%',
                        background: 'var(--corner-bg)',
                        'background-size': '200% 200%',
                        'background-position': '100% 100%',
                        'background-repeat': 'no-repeat',
                        'z-index': 1
                    },
                    '&::after': {
                        content: '',
                        position: 'absolute',
                        height: 'var(--corner-size)',
                        width: 'var(--corner-size)',
                        top: '100%',
                        right: '0%',
                        background: 'var(--corner-bg)',
                        'background-size': '200% 200%',
                        'background-position': '100% 0%',
                        'background-repeat': 'no-repeat',
                        'z-index': 1
                    }
                }
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            class: 'share-wrapper',
            descStyles: {
                indicator: ['indicator.centered', 'icon.duotone']
            },
            components: [
                // {
                //     type: 'indicator',
                //     icon: 'message-dots',
                //     class: 'share-item',
                //     cap: '即时通讯',
                // },
                {
                    type: 'indicator',
                    icon: 'share-nodes',
                    class: 'share-item',
                    cap: '分享',
                    onclick: function (e) {
                        jam.copy2Clipboard(location.href);
                        jam.popup(e, '地址复制成功');
                    }
                },
                {
                    type: 'indicator',
                    icon: 'share',
                    class: 'share-item',
                    cap: '新窗口打开',
                    onclick: function () {
                        window.open(location.href);
                    }
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'icon-wrapper',
            components: [
                {
                    type: 'label',
                    icon: 'ellipsis-vertical',
                    styles: ['icon.duotone'],
                    class: 'side-btn-handle'
                }
            ]
        }
    ]
});
