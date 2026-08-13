let checkboxMap = [];
jaml.register('treeSelect', {
    type: 'container',
    // broker: 'generalDetail',
    styles: [
        Styles.css({
            boxShadow: 'l',
            transition: 'width 400ms',
            maxWidth: '12rem',
            minWidth: '0px',
            flex: '0 0 12rem',
            overflow: 'auto',
            whiteSpace: 'nowrap',
            padding: '.625rem'
        }),
        Styles.stylesheet({
            '.nodes-wrapper': {
                '.tree-name': {
                    position: 'relative',
                    '&:hover': {
                        background: 'var(--jam-color-primary-film)'
                    }
                }
            }
        })
    ],
    components: jaml.var('treeData', (data) => {
        return buildTree(data);
    }),
    onmount() {
        const _self = this;
        const lcIdList = this.model.lcIdList;

        function initializeCheckboxes() {
            if (lcIdList && lcIdList.length) {
                let includesLcId = false;
                checkboxMap.forEach((cb) => {
                    lcIdList.includes(cb.id) && ((cb.shadowRoot.childNodes[1].checked = true), (includesLcId = true));
                });
                includesLcId && (handleCheckboxChange(), mango.pub('toSearchSample', jam.genUUID()));
            }
        }
        function tryInitialize() {
            try {
                checkboxMap = _self.querySelectorAll('jam-input[type="checkbox"]');
                if (checkboxMap.length > 0) {
                    initializeCheckboxes();
                    return true;
                }
                return false;
            } catch (e) {
                return false;
            }
        }

        if (!tryInitialize()) {
            const initWhenReady = () => {
                if (!tryInitialize()) {
                    requestAnimationFrame(initWhenReady);
                }
            };
            requestAnimationFrame(initWhenReady);
        }
    }
});
function buildTree(tree) {
    let _nodes = [];
    tree.map((el) => {
        let _isLeaf = !el.children;
        let _labelName = {
            type: 'wrapper',
            styles: [
                'css(cursor: pointer)',
                Styles.stylesheet({
                    '[type="checkbox"][disabled] + jam-label': {
                        color: 'gray',
                        cursor: 'not-allowed'
                    }
                })
            ],
            state: 0,
            components: [
                _isLeaf
                    ? {
                          type: 'input-checkbox',
                          styles: ['css(cursor: pointer;)'],
                          attrs: {
                              unit: el.unit || 'unk'
                          },
                          id: el.id,
                          onclick() {
                              handleCheckboxChange();
                          },
                          disabled: false
                      }
                    : null,
                {
                    type: 'label',
                    cap: el.name,
                    attrs: {
                        unit: el.unit || 'unk',
                        uniqName: el.uniqName
                    },
                    state: _isLeaf ? 2 : 0,
                    states: {
                        0: {
                            icon: 'folder-open'
                        },
                        1: {
                            icon: 'folder-closed'
                        },
                        2: {
                            icon: `file-alt`
                            // icon: `<span>${el.unit}</span>`
                        }
                    },
                    class: 'tree-name',
                    // styles: [_isLeaf ? '' : Styles.icon.duotone],
                    styles: [Styles.icon.duotone, 'size(width:9rem)', Styles.hover.toShowAll({ selector: '[slot=cap]' }), 'css(overflow:hidden;textOverflow:ellipsis; whiteSpace:nowrap)'],
                    onclick() {
                        if (_isLeaf && !this.previousSibling.disabled) {
                            this.previousSibling.shadowRoot.childNodes[1].checked = !this.previousSibling.shadowRoot.childNodes[1].checked;
                            handleCheckboxChange();
                            return;
                        }
                    }
                },
                _isLeaf
                    ? null
                    : {
                          type: 'label',
                          class: 'arrow',
                          state: 0,
                          states: {
                              0: {
                                  icon: 'angle-down'
                              },
                              1: {
                                  icon: 'angle-right'
                              }
                          },
                          icon: 'angle-down',
                          styles: [Styles.icon.duotone, Styles.css({ position: 'absolute', right: '0.1rem' })],
                          onmount() {
                              this.state = Number(this.parentElement.state);
                          }
                      }
            ],
            onclick() {
                if (_isLeaf) {
                    return;
                }
                this.state = this.state === 1 ? 0 : 1;
                this.nextSibling.state = this.state;
                this.children[1].state = this.state;
                this.children[0].state = this.state;
            }
        };
        _nodes.push(
            _labelName,
            _isLeaf
                ? null
                : {
                      type: 'wrapper',
                      class: 'nodes-wrapper',
                      state: 0,
                      states: [{ styles: [Styles.css({ maxHeight: '1000px' })] }, { styles: [Styles.css({ maxHeight: 0 })] }],
                      styles: [Styles.css({ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'all 0.5s' })],
                      components: buildTree(el.children)
                  }
        );
    });
    return _nodes;
}

function handleCheckboxChange() {
    let unit = null;
    const checkboxes = Array.from(checkboxMap);
    checkboxes.some((cb) => {
        if (cb.shadowRoot.children[1].checked) {
            unit = cb.getAttribute('unit');
        }
        return cb.shadowRoot.children[1].checked;
    });
    checkboxes.forEach((cb) => {
        cb.disabled = unit ? cb.getAttribute('unit') !== unit : false;
    });
    const names = {};
    const values = checkboxes
        .filter((cb) => cb.shadowRoot.children[1].checked)
        .map((cb) => {
            const id = cb.getAttribute('id');
            // names[id] = cb.nextSibling.cap;
            names[id] = cb.nextSibling.getAttribute('uniqName');
            return id;
        });
    mango.pub('treeSelectValue', values);
    mango.pub('treeSelectNames', names);
    mango.pub('treeSelectUnit', unit);
}
