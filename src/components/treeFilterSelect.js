jaml.register('treeFilterSelect', {
    type: 'input',
    class: 'filter-item',
    cap: '{{cap}}',
    icon: '{{icon}}',
    value: '{{search}}',
    styles: [Styles.css({ '--jam-element-color-l4': jam.lumiText(7) })],
    placeholder: jaml.res(function () {
        return this.cmpt.search || '--请选择--';
    }),
    methods: {
        popupTree() {
            jam.popup(this, this.ref('treeFilterSelector'), { container: document.body, position: 'bottom' });
        },
        findNodeName(nodeId, nodeList) {
            if (!this?._datacache) {
                this._datacache = new Map();
            }
            if (!nodeList) {
                return null;
            }
            let _name = this._datacache.get(nodeId);
            if (_name === undefined) {
                for (let node of nodeList) {
                    // 如果有nodeId
                    if (node?.nodeId) {
                        this._datacache.set(node.nodeId, node.nodeName ?? '');
                        if (node.nodeId === nodeId) {
                            return node.nodeName ?? '';
                        }
                    }
                    // 去下一级查找
                    if (node?.children && node.children.length > 0) {
                        let _name = this.findNodeName(nodeId, node.children);
                        if (_name !== null) {
                            return _name;
                        }
                    }
                }
            }
            return null;
        }
    },
    onfocus() {
        this.popupTree();
    },
    onvaluechange(val) {
        if (!val.detail.value) {
            const closeBtn = this.ref('closeBtn');
            if (closeBtn) {
                closeBtn.click();
            }
        }
    },
    ondestroy() {
        if (this?._datacache) {
            this._datacache.clear();
            this._datacache = null;
        }
    },
    watchers: [
        {
            keys: ['select', 'data'],
            debounce: 200,
            callback(select, data) {
                if (!select || !data) {
                    return;
                }
                const _name = this.findNodeName(select, this.data);
                this.search = _name;
            }
        },
        {
            key: 'data',
            callback() {
                if (this?._datacache) {
                    this._datacache.clear();
                }
            }
        }
    ],
    components: [
        {
            type: 'wrapper',
            build: false,
            ref: 'treeFilterSelector',
            styles: [
                Styles.stylesheet({
                    '&': {
                        maxHeight: '20rem',
                        minWidth: '10rem',
                        maxWidth: '100%',
                        width: 'fit-content',
                        padding: 0
                    },
                    '.tree': {
                        padding: '0.75rem',
                        overflow: 'auto',
                        width: '100%',
                        height: '100%'
                    }
                })
            ],
            components: [
                {
                    type: 'lazyTree',
                    styles: [Styles.css({ width: '100%' })],
                    props: {
                        filterable: false,
                        multiSelect: false,
                        onlyLeafClick: true,
                        loadingAllChildren: false,
                        selected: '[{{select}}]',
                        expandList: '{{expandNodes}}',
                        currentTree: '{{data}}'
                    },
                    methods: {
                        getNodeInfo(e) {
                            const _labelDom = jam.closest(e.target, 'jam-label.treeLeaf');
                            if (!_labelDom) {
                                return;
                            }
                            this.cmpt._parentComponent.container.select = _labelDom.getAttribute('nodeId');
                            // this.cmpt._parentComponent.container.search = _labelDom.cap;
                            jam.closePopup();
                        }
                    },
                    onclick(e) {
                        this.getNodeInfo(e);
                    }
                }
            ]
        },
        {
            type: 'button',
            ref: 'closeBtn',
            showIf: '{{showclose}} && {{select}}',
            icon: 'r',
            class: 'jam-clear-btn jam-input-btn',
            title: '清除',
            styles: [Styles.flex('0 0 auto'), Styles.size('1.5em')],
            slot: 'extra',
            onclick(e) {
                const input = this.parentElement;
                input.value = '';
                input.cmpt.select = null;
                // input.agent.placeholder = '--请选择--';
            }
        }
    ],
    props: {
        showclose: true
    }
});
