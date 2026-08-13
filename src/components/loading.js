jaml.register('loading', {
    class: 'loading',
    showIf: '{{isLoading}}',
    type: 'wrapper',
    styles: [
        Styles.css({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--jam-color-primary-film)',
            position: 'absolute',
            left: 0,
            top: 0,
            backdropFilter: 'blur(0.125rem)'
        })
    ],
    components: [
        {
            type: 'label',
            cap: '数据加载中...',
            styles: [
                Styles.css({
                    fontSize: 'xl'
                })
            ],
            components: [
                {
                    type: 'label',
                    slot: 'icon',
                    styles: [
                        Styles.css({
                            position: 'relative',
                            left: '-1rem'
                        }),
                        Styles.layer.spinner.comet({
                            dropShadow: true,
                            cometFrom: 180,
                            cometLength: 90,
                            tailColor: 'var(--jam-color-primary-film)',
                            headColor: 'var(--jam-color-primary-default)',
                            roundHead: true,
                            roundTail: true,
                            outer: 100,
                            inner: 70,
                            spin: 'reverse',
                            easing: 'plateau',
                            duration: 1000, // 改成毫秒
                            animateLength: true,
                            size: '3rem'
                        })
                    ]
                }
            ]
        }
    ]
});
