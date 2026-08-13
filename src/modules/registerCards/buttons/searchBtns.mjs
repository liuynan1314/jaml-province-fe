export default {
    type: 'container',
    class: 'form-item search-btns',
    cap: '查询按钮组件',
    icon: 'search',
    styles: ['layout.flex(alignItems:center;justifyContent:center;wrap:nowrap)', 'cap.hide', 'icon.hide'],
    buttonStyles: [Styles.searchBtnsStyles],
    components: [
        {
            type: 'button',
            cap: '查询',
            icon: 'search',
            class: 'jam-cta',
            onclick: function () {
                this.msgr('page').pub('_t', Date.now());
            }
        },

        {
            type: 'button',
            cap: '导出',
            icon: 'file-export',
            class: 'export-btn',
            state: '{{to-export-table}}?"loading":"normal"',
            states: {
                loading: {
                    icon: 'spinner',
                    styles: [
                        //
                        'css(backdrop-filter:grayscale(.2);cursor:not-allowed;)',
                        Styles.stylesheet({
                            ':scope': {
                                '[slot="icon"]>i': {
                                    animation: 'fa-spin',
                                    animationDuration: '1s',
                                    animationIterationCount: 'infinite',
                                    animationTimingFunction: 'linear'
                                }
                            }
                        })
                    ]
                },
                normal: {
                    icon: 'file-export'
                }
            },
            onclick: function () {
                if (this.msgr.get('to-export-table')) return;
                this.msgr('page').pub('to-export-table', Date.now());
            }
        }
    ],
    // 兼容旧版本写法
    watchers: [
        {
            key: '_t@page',
            callback: function (value) {
                this.msgr.pub('_t', value);
            }
        },
        {
            key: 'to-export-table@page',
            callback: function (value) {
                this.msgr.pub('to-export-table', value);
            }
        }
    ]
};
