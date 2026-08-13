// todoList
// 1、分页器输入超出范围，需要特殊处理  ---完成

// 2、select选择空时需要忽略处理，更新成上一次选择的值   ---
let _msgr = null;
jaml.register('pager', {
    id: 'pager',
    type: 'wrapper',
    broker: 'pager',
    buttonStyles: [Styles.margin({ margin: '0 0.3rem' })],
    styles: [
        Styles.props({
            display: 'block',
            width: '100%'
        }),
        Styles.stylesheet({
            // '.paper-btn': {
            //     backgroundImage: 'url(../../../assets/images/page-action.png)',
            //     backgroundRepeat: 'no-repeat',
            //     backgroundSize: '100% 100%',
            //     borderRadius: 0
            // },
            '.pager-number': {
                padding: '4px 10px'
                // borderRadius: 0
                // background: 'transparent'
            },
            '.jam-checked': {
                // backgroundImage: 'url(../../../assets/images/page-action.png) !important',
                // backgroundRepeat: 'no-repeat  !important',
                // backgroundSize: '100% 100%  !important',
                backgroundColor: jam.ac({ l: jam.acLumiO(30) })
                // borderRadius: '0  !important'
            }
        })
    ],
    onmount: function () {
        _msgr = this.model.msgr;
    },
    onunmount: function () {
        _msgr.unsub(this.cmpt.props.total);
        _msgr.unsub(this.cmpt.props.messageKey);
    },
    onafterrender: (cmpt) => {
        if (!cmpt.props.messageKey) {
            cmpt.props.messageKey = 'pagination';
        }
        _msgr.pub(cmpt.props.messageKey, {
            pageSize: cmpt.pageSizeList?.[0].value,
            pageNumber: '1',
            firstFetch: true
        });
        if (typeof cmpt.props.total === 'string') {
            _msgr.sub(cmpt.props.total, function (value) {
                console.log('pager', value);
                if (Array.isArray(value)) {
                    cmpt.props.total = value.length;
                } else if (typeof value === 'number') {
                    cmpt.props.total = value;
                }
                totalPageNumber = Math.ceil(+cmpt.props.total / +_msgr.get(cmpt.props.messageKey).pageSize);
                _msgr.pub(cmpt.props.messageKey, {
                    pageSize: _msgr.get(cmpt.props.messageKey).pageSize,
                    pageNumber: 1,
                    firstFetch: true
                });

                setTimeout(() => {
                    if (document.querySelector('#number-1')) {
                        document.querySelectorAll('#number-1').forEach((element) => {
                            element.classList.add('jam-checked');
                        });
                    }
                }, 200);
            });
        }
        _msgr.sub(cmpt.props.messageKey, function () {
            if (document.querySelector('#number-1').classList.contains('jam-checked')) {
                document.querySelector('#number-1').classList.remove('jam-checked');
            }
        });
        // _msgr.pub
        // 表格的时候，声明分页器的插件就可以分页，是容器的时候，声明放在什么位置
        // _msgr.pub('cmpt', cmpt);
        cmpt.components = initComp(cmpt);
    },
    components: []
});
let totalPageNumber;
let states = {
    select: {
        styles: [
            Styles.button.text({ color: jam.ac({ l: jam.acLumiO(1) }) }),
            Styles.button.background({ color: jam.ac({ l: jam.acLumiO(30) }) }),
            Styles.hover({ color: jam.ac({ l: jam.acLumiO(30) }) })
            // Styles.button.text({ color: '#fff' }),
            // Styles.button.background({
            //     image: 'url(../../../assets/images/page-action.png)',
            //     color: 'transparent',
            //     size: '100% 100%',
            //     repeat: 'no-repeat'
            // })
        ]
    },
    hide: {
        styles: [
            Styles.props({
                display: 'none'
            })
        ]
    }
};
let hideState = {
    hide: {
        styles: [
            Styles.props({
                display: 'none'
            })
        ]
    }
};
function initComp(cmpt) {
    let rt = [];
    let prevBtn = [
        {
            type: 'button',
            cap: '上一页',
            class: 'paper-btn',
            onclick: function (e) {
                if (+_msgr.get(cmpt.props.messageKey).pageNumber !== 1) {
                    _msgr.pub(cmpt.props.messageKey, {
                        pageSize: _msgr.get(cmpt.props.messageKey).pageSize,
                        pageNumber: (+_msgr.get(cmpt.props.messageKey).pageNumber - 1).toString()
                    });
                }
            },
            states: hideState,
            watchers: [
                {
                    key: cmpt.props.messageKey,
                    callback: function (value) {
                        if (+value.pageNumber === 1) {
                            this.state = 'hide';
                        } else {
                            this.state = 'default';
                        }
                    }
                }
            ]
        }
    ];
    let nextBtn = [
        {
            type: 'button',
            cap: '下一页',
            class: 'paper-btn',
            onclick: function (e) {
                if (+_msgr.get(cmpt.props.messageKey).pageNumber !== totalPageNumber) {
                    _msgr.pub(cmpt.props.messageKey, {
                        pageSize: _msgr.get(cmpt.props.messageKey).pageSize,
                        pageNumber: (+_msgr.get(cmpt.props.messageKey).pageNumber + 1).toString()
                    });
                }
            },
            states: hideState,
            watchers: [
                {
                    key: cmpt.props.messageKey,
                    callback: function (value) {
                        if (+value.pageNumber === totalPageNumber) {
                            this.state = 'hide';
                        } else {
                            this.state = 'default';
                        }
                    }
                }
            ]
        }
    ];
    let pageSetter = [
        {
            type: 'label',
            cap: '跳转到',
            styles: [Styles.props({})]
        },
        {
            id: 'pager-input',
            type: 'input',
            styles: [
                'input.size(width:3rem)'
                // Styles.input.agent.border({ radius: 0 })
                // Styles.input.agent.background({
                //     image: 'url(../../assets/images/page-action.png)',
                //     size: '100% 100%',
                //     repeat: 'no-repeat'
                // })
            ],
            onafterrender: (cmpt) => {
                cmpt.element.addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') {
                        _msgr.pub(cmpt.props.messageKey, {
                            pageSize: _msgr.get(cmpt.props.messageKey).pageSize,
                            pageNumber: e.target.value
                        });
                    }
                });
            },
            onvaluechange: jam.makeDebounce(function (value) {
                if (!value) {
                    this.value = null;
                    return;
                }
                if (value < 1) {
                    this.value = 1;
                } else if (value > totalPageNumber) {
                    this.value = totalPageNumber;
                } else if (isNaN(value)) {
                    this.value = null;
                }
            }, 500)
        },
        {
            type: 'label',
            cap: '页'
        },
        {
            type: 'button',
            id: 'jump_to_page_number',
            cap: '跳转',
            class: 'paper-btn',
            onafterrender: (cmpt) => {
                cmpt.element.addEventListener('click', (e) => {
                    const pageNumber = document.querySelector('#pager-input').value;
                    if (!pageNumber) return;
                    _msgr.pub(cmpt.props.messageKey, {
                        pageSize: _msgr.get(cmpt.props.messageKey).pageSize,
                        pageNumber: pageNumber
                    });
                });
            }
        }
    ];
    let total = [
        {
            type: 'label',
            cap: typeof cmpt.props.total === 'string' ? '共0条' : '"共"+{{cmpt.props.total}}+"条"',
            watchers: [
                {
                    key: cmpt.props.total,
                    callback: function (value) {
                        if (typeof value === 'number') {
                            this.cap = '共' + value + '条';
                            const msg = _msgr.get(cmpt.props.messageKey);
                            _msgr.pub(cmpt.props.messageKey, {
                                ...msg,
                                total: value
                            });
                        }
                    }
                }
            ]
        }
    ];
    let pagesizeList = [
        {
            type: 'select',
            styles: [
                // Styles.select.agent.css({
                //     border: 'none'
                // })
                // Styles.select.css({
                //     height: '1.8rem',
                //     background: 'url(../../assets/images/page-action.png) no-repeat',
                //     backgroundSize: '100% 100%'
                // })
            ],
            data: cmpt.props.pageSizeList,
            value: cmpt.props.pageSizeList?.[0].value,
            onvaluechange: function (value) {
                if (value === undefined) {
                    this.value = _msgr.get(cmpt.props.messageKey).pageSize;
                    return;
                }
                totalPageNumber = Math.ceil(+cmpt.props.total / +value);
                _msgr.pub(cmpt.props.messageKey, {
                    pageSize: value,
                    pageNumber: '1'
                });
            }
        }
    ];
    totalPageNumber = typeof cmpt.props.total === 'string' ? 1 : Math.ceil(+cmpt.props.total / +_msgr.get(cmpt.props.messageKey).pageSize);
    prevBtn[0].state = 'hide';
    rt = prevBtn.concat(initBtns(cmpt)).concat(nextBtn).concat(pageSetter).concat(total).concat(pagesizeList);
    setTimeout(function () {
        if (_msgr.get(cmpt.props.messageKey).pageNumber === '1') {
            if (document.querySelector('#number-1')) {
                document.querySelector('#number-1').state = 'select';
            }
        }
    }, 100);
    return rt;
}
function initBtns(cmpt) {
    let rt = [];
    let ellipsisLeft = {
        id: 'pager-left-ellipsis',
        type: 'label',
        cap: '...',
        states: hideState,
        watchers: [
            {
                key: cmpt.props.messageKey,
                callback: function (value) {
                    if (totalPageNumber > 5 && value.pageNumber > 3) {
                        this.state = 'default';
                    } else {
                        this.state = 'hide';
                    }
                }
            }
        ]
    };
    let ellipsisRight = {
        id: 'pager-right-ellipsis',
        type: 'label',
        cap: '...',
        states: hideState,
        watchers: [
            {
                key: cmpt.props.messageKey,
                callback: function (value) {
                    if (totalPageNumber > 5 && +totalPageNumber - +value.pageNumber > 2) {
                        this.state = 'default';
                    } else {
                        this.state = 'hide';
                    }
                }
            }
        ]
    };
    let firstBtn = {
        id: 'number-1',
        type: 'button',
        cap: '1',
        class: 'pager-number',
        states: states,
        onclick: function (e) {
            _msgr.pub(cmpt.props.messageKey, {
                pageSize: _msgr.get(cmpt.props.messageKey).pageSize,
                pageNumber: this.cap
            });
        },
        watchers: [
            {
                key: cmpt.props.messageKey,
                callback: function (value) {
                    if (this.cap === value.pageNumber) {
                        this.state = 'select';
                    } else {
                        this.state = 'default';
                    }
                }
            }
        ]
    };
    let secondBtn = {
        id: 'number-2',
        type: 'button',
        cap: '2',
        class: 'pager-number',
        states: states,
        onclick: function (e) {
            _msgr.pub(cmpt.props.messageKey, {
                pageSize: _msgr.get(cmpt.props.messageKey).pageSize,
                pageNumber: this.cap
            });
        },
        watchers: [
            {
                key: cmpt.props.messageKey,
                callback: function (value) {
                    if (totalPageNumber >= 2) {
                        // totalPageNumber大于2显示第2个按钮
                        if (+value.pageNumber <= 3) {
                            // 当前pageNumber靠近最小值1时
                            this.cap = '2';
                        } else if (totalPageNumber - +value.pageNumber <= 1) {
                            // 当前pageNumber靠近最大值totalPageNumber时
                            this.cap = totalPageNumber - 3 < 2 ? '2' : (totalPageNumber - 3).toString();
                        } else {
                            this.cap = (+value.pageNumber - 1).toString();
                        }
                        if (this.cap === value.pageNumber) {
                            this.state = 'select';
                        } else {
                            this.state = 'default';
                        }
                    } else {
                        this.state = 'hide';
                    }
                }
            }
        ]
    };
    let thirdBtn = {
        id: 'number-3',
        type: 'button',
        cap: '3',
        class: 'pager-number',
        states: states,
        onclick: function (e) {
            _msgr.pub(cmpt.props.messageKey, {
                pageSize: _msgr.get(cmpt.props.messageKey).pageSize,
                pageNumber: this.cap
            });
        },
        watchers: [
            {
                key: cmpt.props.messageKey,
                callback: function (value) {
                    if (totalPageNumber >= 3) {
                        // totalPageNumber大于3显示第3个按钮
                        if (+value.pageNumber <= 3) {
                            this.cap = '3';
                        } else if (totalPageNumber - +value.pageNumber <= 1) {
                            this.cap = totalPageNumber - 2 < 3 ? '3' : (totalPageNumber - 2).toString();
                        } else {
                            this.cap = (+value.pageNumber).toString();
                        }
                        if (this.cap === value.pageNumber) {
                            this.state = 'select';
                        } else {
                            this.state = 'default';
                        }
                    } else {
                        this.state = 'hide';
                    }
                }
            }
        ]
    };
    let fourthBtn = {
        id: 'number-4',
        type: 'button',
        class: 'pager-number',
        cap: '4',
        states: states,
        onclick: function (e) {
            _msgr.pub(cmpt.props.messageKey, {
                pageSize: _msgr.get(cmpt.props.messageKey).pageSize,
                pageNumber: this.cap
            });
        },
        watchers: [
            {
                key: cmpt.props.messageKey,
                callback: function (value) {
                    if (totalPageNumber >= 4) {
                        // totalPageNumber大于4显示第4个按钮
                        if (+value.pageNumber <= 3) {
                            this.cap = '4';
                        } else if (totalPageNumber - +value.pageNumber <= 1) {
                            this.cap = totalPageNumber - 1 < 4 ? '4' : (totalPageNumber - 1).toString();
                        } else {
                            this.cap = (+value.pageNumber + 1).toString();
                        }
                        if (this.cap === value.pageNumber) {
                            this.state = 'select';
                        } else {
                            this.state = 'default';
                        }
                    } else {
                        this.state = 'hide';
                    }
                }
            }
        ]
    };
    let fifthBtn = {
        id: 'number-5',
        type: 'button',
        class: 'pager-number',
        cap: totalPageNumber,
        states: states,
        onclick: function (e) {
            _msgr.pub(cmpt.props.messageKey, {
                pageSize: _msgr.get(cmpt.props.messageKey).pageSize,
                pageNumber: this.cap
            });
        },
        watchers: [
            {
                key: cmpt.props.messageKey,
                callback: function (value) {
                    if (totalPageNumber >= 5) {
                        // totalPageNumber大于5显示第5个按钮
                        this.cap = totalPageNumber;
                        if (this.cap === value.pageNumber) {
                            this.state = 'select';
                        } else {
                            this.state = 'default';
                        }
                    } else {
                        this.state = 'hide';
                    }
                }
            }
        ]
    };
    rt = [firstBtn, ellipsisLeft, secondBtn, thirdBtn, fourthBtn, ellipsisRight, fifthBtn];
    ellipsisLeft.state = 'hide';
    if (totalPageNumber === 1) {
        secondBtn.state = 'hide';
        thirdBtn.state = 'hide';
        fourthBtn.state = 'hide';
        ellipsisRight.state = 'hide';
        fifthBtn.state = 'hide';
    } else if (totalPageNumber === 2) {
        thirdBtn.state = 'hide';
        fourthBtn.state = 'hide';
        ellipsisRight.state = 'hide';
        fifthBtn.state = 'hide';
    } else if (totalPageNumber === 3) {
        fourthBtn.state = 'hide';
        ellipsisRight.state = 'hide';
        fifthBtn.state = 'hide';
    } else if (totalPageNumber === 4) {
        ellipsisRight.state = 'hide';
        fifthBtn.state = 'hide';
    } else if (totalPageNumber === 5) {
        ellipsisRight.state = 'hide';
    }
    return rt;
}
