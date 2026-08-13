let timer = null;
jaml.register('dateDisplay', {
    type: 'wrapper',
    styles: [
        Styles.stylesheet({
            ':scope': {
                flexSelf: 'flex-end'
            },
            '.time-item': {
                padding: '0 0.5rem'
            },
            '.header-time, .header-date': {
                borderRight: `1px dashed ${jam.ac()}`
            }
        })
    ],
    components: [
        {
            type: 'indicator',
            class: 'time-item header-time',
            styles: [
                'indicator.inline',
                Styles.indicator.tweening.dial({ digits: ':0123456789' }),
                Styles.css({
                    '--jam-digit-height': '1.9rem'
                })
            ],
            value: '{{time}}'
        },
        {
            type: 'label',
            class: 'time-item header-date',
            cap: '{{date}}'
        },
        {
            type: 'label',
            class: 'time-item header-day',
            cap: '{{day}}'
        }
    ],
    onmount() {
        const _model = this.model;
        timer = jam.setInterval(() => {
            _model.vars.day = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']?.[moment().day()];
            _model.vars.date = moment().format('YYYY-MM-DD');
            _model.vars.time = moment().format('HH:mm:ss');
        }, 1000);
    }
});
