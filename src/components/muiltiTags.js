jaml.register('muiltiTags', {
    type: 'tags',
    data: '{{initialValue}}',
    value: '{{tagsValue}}',
    class: 'tags-wrapper',
    removable: true,
    styles: [],
    onaddclick(e) {
        if (this.cmpt.disabled) {
            return;
        }
        const _tags = this;
        const dom = jame('wrapper');
        if (!_tags.cmpt.originalData) {
            _tags.cmpt.originalData = jam.cloneDeep(_tags.cmpt.selectData);
        }
        jaml(dom, {
            type: 'wrapper',
            styles: [
                Styles.css({
                    flexDirection: 'column'
                })
            ],
            components: [
                {
                    type: 'input',
                    styles: ['size(width:8rem)'],
                    onvaluechange: jam.makeDebounce(function (val) {
                        if (!val) {
                            _tags.cmpt.selectData = jam.cloneDeep(_tags.cmpt.originalData);
                        } else {
                            console.log(_tags.cmpt.originalData);
                            console.log(val);
                            _tags.cmpt.selectData = jam.cloneDeep(_tags.cmpt.originalData).filter((item) => item.name?.includes(val));
                        }
                        let dom = this.nextSibling;
                        dom.data = _tags.cmpt.selectData;
                        _tags.cmpt.inputValue = val;
                    }, 1000),
                    value: _tags.cmpt.inputValue
                },
                {
                    type: 'buttongroup-checkbox',
                    id: 'buttongroup',
                    styles: [
                        Styles.css({
                            '--jam-optionslot-align-items': 'flex-start',
                            maxHeight: '20vh',
                            overflowY: 'auto',
                            alignItems: 'flex-start'
                        })
                    ],
                    data: _tags.cmpt.selectData,
                    value: _tags.value,
                    onvaluechange(val) {
                        if (val.length == _tags.cmpt.selectData.length) {
                            _tags.data = [
                                {
                                    name: '全部',
                                    value: ''
                                }
                            ];
                        } else {
                            _tags.data = this.getCheckedOptions();
                        }
                    }
                }
            ]
        });
        jam.popup(_tags, dom, {
            container: document.body,
            style: {
                width: 'fit-content',
                maxWidth: '50vw'
            }
        });
    }
});
