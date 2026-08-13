jaml.register('fileinput', {
    type: 'container',
    type: 'tags',
    placeholder: '点击或者拖拽到这里',
    styles: [Styles.size.fullwidth, Styles.css({ position: 'relative' })],
    removable: true,
    data: '{{datafile}}',
    template: { type: 'button', cap: '{value}' },
    methods: {
        processFiles(files) {
            this.data = (this.data || []).concat(
                files.map((f) => ({
                    name: f.name,
                    value: jam.ellipsify(f.name),
                    onclick() {
                        jam.viewFileInWindow(f);
                    },
                    file: f.orig
                }))
            );
        }
    },
    onaddclick() {
        jam.attachFiles(this.processFiles, true);
    },
    onmount() {
        jam.makeFileDroppable(this, this.processFiles, '⤵拖拽来添加附件');
    }
});
