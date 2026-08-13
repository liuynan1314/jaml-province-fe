jaml.register('filterSelect', {
    type: 'container',
    components: [
        {
            type: 'input',
            cap: '{{cap}}',
            icon: '{{icon}}',
            value: '{{search}}',
            defaultValue: '{{defaultValue}}',
            placeholder: '{{placeholder}}',
            styles: [Styles.css({ '--jam-element-color-l4': jam.lumiText(7) }), Styles.icon.duotone],
            onclick(e) {
                // this.value = '';
                const input = this;
                // this.nextSibling.style.display = 'flex';
                jam.popup(
                    e.target,
                    {
                        id: 'filterSelector',
                        type: 'buttongroup-radio',
                        styles: [
                            Styles.css({ maxHeight: '40vh', width: 'fit-content', maxWidth: '15rem', minWidth: '8rem', display: 'flex', 'flex-direction': 'column', '--jam-optionslot-flex-direction': 'column', overflowY: 'auto' }),
                            Styles.stylesheet({
                                '.jam-option': { cursor: 'pointer', width: '100%' }
                            })
                        ],
                        data: this.cmpt.data,
                        template: { type: 'label', cap: '{name}' },
                        onvaluechange() {
                            const _select = this.getCheckedOptions()[0] || {};
                            input.value = _select.name;
                            input.nextSibling.value = _select.value;
                            // input.agent.placeholder = _select.name;
                            input.agent.value = _select.name;

                            jam.closePopup();
                        }
                    },
                    { position: 'bottom' }
                );
            },
            watchers: {
                data: function (data) {
                    const _dom = document.getElementById('filterSelector');
                    if (!_dom) {
                        return;
                    }
                    _dom.data = data;
                },
                search: jam.makeDebounce(function (search) {
                    if (!search) {
                        this.nextSibling.value = null;
                    }
                }, 500)
            }
        },
        {
            type: 'input',
            styles: [Styles.css({ display: 'none' })],
            value: '{{select}}'
        }
    ]
});
