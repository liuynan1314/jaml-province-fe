jaml.register('multidropdown', {
    type: 'wrapper',
    styles: ['size(width: 16rem;height: 2rem;)'],
    descStyles: {
        'jam-tag :host .wrapper': {
            background: 'red'
        }
    },
    components: [
        {
            type: 'tags',
            cap: '{{cap}}',
            data: '{{data}}',
            icon: '{{icon}}',
            title: '{{title}}',
            tip: '{{tip}}',
            removable: '{{ clearable }}',
            disabled: '{{disabled}}',
            placeholder: '',
            updateViaValue: true,
            value: '{{value}}',
            onvaluechange(val) {
                this.msgr(this.props.broker || '').pub(this.props.valueName, val);
            },
            styles: [
                'css(width:100%;padding:0)',
                Styles.tags.labelslot.margin('left:0'),
                Styles.tags.tagslot.css({
                    minHeight: '1.8rem',
                    overflow: 'hidden !important',
                    background: 'var(--jam-input-background-color)',
                    'border-color': 'var(--jam-input-border-color)',
                    'border-radius': 'var(--jam-agent-border-radius)',
                    'border-style': 'solid',
                    'border-width': 'var(--jam-input-border-width)',
                    '-webkit-mask-image': 'unset',
                    maskImage: 'unset'
                })
            ],
            onaddclick(e) {
                if (this.props.disabled) return;
                jam.popup(this, this.ref.menu, { position: 'bottom' });
            },
            components: [
                {
                    type: 'wrapper',
                    build: false,
                    ref: 'menu',
                    styles: ['flex(direction:column)', 'css(padding:0.2rem;height:24vh;)'],
                    components: [
                        {
                            type: 'input',
                            placeholder: '搜索',
                            buildIf: '{{searchable}}',
                            styles: ['auto.focus'],
                            onvaluechange(value) {
                                this.msgr.pub(this.props.searchName || 'kw', value);
                            },
                            onkeydown(e) {
                                if (e.keyCode === 27) {
                                    if (this.value === '') {
                                        jam.closePopup();
                                    } else {
                                        this.value = '';
                                    }
                                }
                            }
                        },
                        {
                            type: 'checkbox',
                            chooseAll: true,
                            styles: ['checkbox.checkmark', 'options.vertical', 'options.stripy'],
                            value: '{{value}}',
                            data: '{{data}}',
                            onvaluechange(val) {
                                this.msgr(this.props.broker || '').pub(this.props.valueName, val);
                            },
                            onafterrender() {
                                if (!this.props.remoteSearch) {
                                    this.msgr.sub(this.props.searchName || 'kw', (value) => {
                                        if (jam.nullOrUndefined(value)) {
                                            this.filter();
                                        } else {
                                            this.filter((o) => o.name.includes(value.trim()));
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]
});
