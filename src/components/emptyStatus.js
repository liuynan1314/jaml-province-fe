jaml.register('emptyStatus', {
    type: 'wrapper',
    styles: [
        'size.fullsize',
        Styles.css({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }),
        Styles.stylesheet({
            '.emptyIcon': {
                '--jam-icon-size': '3rem'
            }
        })
    ],
    components: [
        {
            type: 'label',
            class: 'emptyIcon',
            icon: 'table',
            styles: ['icon.duotone']
        },
        {
            type: 'label',
            cap: '{{desc}}',
            styles: [Styles.label.cap.text({ size: '1.5rem' })]
        }
    ]
});
