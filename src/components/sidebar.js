jaml.register('sidebar-self', {
    type: 'container',
    styles: [
        'shadow.m',
        'border.subtle',
        'border.s',
        Styles.css({
            transition: 'width 400ms',
            width: '13rem',
            minWidth: '0px',
            flex: '1 1 0%',
            overflow: 'auto',
            whiteSpace: 'nowrap'
        }),
        Styles.stylesheet({
            '.pages-wrapper': {
                '.sidebar-name': {
                    position: 'relative',
                    '&:hover': {
                        background: 'var(--jam-color-primary-subtle)'
                    }
                }
            }
        })
    ],
    components: jaml.var('sidebarData', (data) => {
        return buildSidebar(data);
    })
});
function buildSidebar(sidebar) {
    let _pages = [];
    sidebar.map((el) => {
        if (el?.hide) {
            return;
        }
        let _isLeaf = !el.pages;
        let _labelName = {
            type: 'label',
            cap: el.name,
            icon: el?.icon || 'minus',
            class: 'sidebar-name',
            styles: [Styles.icon.duotone]
        };
        if (_isLeaf) {
            Object.assign(_labelName, {
                state: 0,
                states: [{}, { styles: ['with.accent', 'on.accent'] }],
                onmount() {
                    const me = this;
                    rambutan.routerMsgr.sub(rambutan.pathWatcher, function (path) {
                        me.state = path == el.path ? 1 : 0;
                    });
                    const path = rambutan.routerMsgr.get(rambutan.pathWatcher);
                    me.state = path == el.path ? 1 : 0;
                },
                onclick() {
                    if (el?.newWindow) {
                        window.open(el.src + (el.src?.includes('?') ? '&' : '?') + 'token=' + jam.getUrlParam('token'));
                    } else {
                        rambutan.switchTo(el.path, { token: jam.getUrlParam('token') });
                    }
                }
            });
        } else {
            Object.assign(_labelName, {
                class: 'sidebar-name has-pages',
                state: 0,
                icon: el.icon,
                styles: [Styles.icon.duotone],
                components: [
                    {
                        type: 'label',
                        state: 1,
                        class: 'arrow',
                        states: {
                            0: {
                                icon: 'angle-right'
                            },
                            1: {
                                icon: 'angle-down'
                            }
                        },
                        icon: 'angle-right',
                        styles: [Styles.icon.duotone, Styles.css({ position: 'absolute', right: '0.1rem' })],
                        onmount() {
                            this.state = Number(this.parentElement.state);
                        }
                    }
                ],
                onclick() {
                    this.state = this.state === 1 ? 0 : 1;
                    this.nextSibling.state = this.state;
                    this.children[0].state = this.state;
                }
            });
        }
        _pages.push({
            type: 'wrapper',
            class: 'name-wrapper',
            components: [
                _labelName,
                _isLeaf
                    ? null
                    : {
                          type: 'wrapper',
                          class: 'pages-wrapper',
                          state: 0,
                          states: [{ styles: [Styles.css({ maxHeight: '1000px' })] }, { styles: [Styles.css({ maxHeight: 0 })] }],
                          styles: [Styles.css({ paddingLeft: 'm', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'max-height 0.5s' })],
                          components: buildSidebar(el.pages)
                      }
            ]
        });
    });
    return _pages;
}
