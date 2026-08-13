(() => {
    let msgUuid = 'alertNotificationWindowPlugin';
    let globalScale = 1,
        list = [],
        ctnr = document.body,
        bindFunction,
        bindRegion;
    function initNotifyContent(msg) {
        return {
            type: 'card',
            cap: '图模更新通知',
            icon: 'bell',
            styles: [
                Styles.icon.regular,
                Styles.css({
                    '--jam-card-title-height': convertScale('1.5rem'),
                    boxShadow: 'none',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 0,
                    padding: 0
                }),
                Styles.card.cap.css({
                    fontSize: convertScale('1rem')
                }),
                Styles.card.icon.css({
                    fontSize: convertScale('0.9rem')
                }),
                Styles.card.bodyslot.css({
                    padding: 0
                }),
                Styles.card.titleslot.css({
                    borderRadius: 0
                })
            ],
            components: [
                {
                    type: 'wrapper',
                    styles: [
                        Styles.css({
                            width: convertScale('12rem'),
                            maxHeight: convertScale('7rem'),
                            display: 'block'
                        })
                    ],
                    components: [
                        {
                            type: 'label',
                            cap: msg || '告警内容',
                            styles: [
                                Styles.css({
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    width: '100%',
                                    maxHeight: convertScale('5.5rem'),
                                    overflowY: 'auto',
                                    fontSize: convertScale('0.8rem')
                                })
                            ]
                        }
                        // {
                        //     type: 'label',
                        //     cap: '消息源：' + msg?.userName,
                        //     styles: [
                        //         Styles.css({
                        //             display: 'flex',
                        //             width: '100%',
                        //             height: convertScale('1.5rem'),
                        //             justifyContent: 'flex-end',
                        //             fontSize: convertScale('0.8rem')
                        //         })
                        //     ]
                        // }
                    ]
                }
            ],
            onclick(e) {
                showTable(document.querySelector('#alertNotificationFloating jam-button'));
            }
        };
    }
    function normalAlarm(msg) {
        // 普通告警 type = 1
        if (msg) {
            jam.notify({
                content: initNotifyContent(msg),
                duration: 1000 * 60,
                level: 'info',
                pinnable: true,
                pin: false
            });
        }
    }
    function onmessage() {
        // 获取存储的告警数据（用于调试或其他用途）
        mango.sub('alertNotificationList', function ({ data }) {
            if (data && data.length > 0) {
                // 处理每条告警数据
                data.forEach((alarm, index) => {
                    const content = `${alarm.graphSaveTimeStr}  ${alarm.savePersonName || ' '}  修改了  ${alarm.regionName || '  '} ${alarm.stName || '  '}的${alarm.graphName || ' '}图形`;
                    normalAlarm(content);
                });
            }
            list = [...data, ...list];
            mango.pub('alarmNum', list.length || 0);
            mango.pub(msgUuid, { list, ts: Date.now() });
        });
    }
    function init() {
        onmessage();
        initFloating();
        initStyles();
    }
    function initFloating() {
        let floatingDom = jame({
            id: 'alertNotificationFloating',
            type: 'wrapper',
            styles: [
                Styles.interact.movable,
                Styles.css({
                    position: 'fixed',
                    right: convertScale('2rem'),
                    bottom: convertScale('2rem'),
                    zIndex: 999,
                    padding: convertScale('0.75rem'),
                    transition: '0.5s all',
                    opacity: 0.3,
                    borderRadius: '50%',
                    backgroundColor: jam.ac(1, 1, 1, 0.7),
                    boxShadow: `0 ${convertScale('0.2rem')} ${convertScale('0.4rem')} ${convertScale('-0.1rem')} hsla(0, 0%, 0%,${jam.lumiA(30)}`
                }),
                Styles.stylesheet({
                    ':scope': {
                        '&:hover': {
                            opacity: '1 !important'
                        }
                    }
                })
            ],
            components: [
                {
                    ref: 'badge',
                    type: 'badge',
                    styles: [
                        Styles.css({
                            width: convertScale('1.9rem'),
                            height: convertScale('1.9rem'),
                            fontSize: convertScale('0.8rem'),
                            borderRadius: convertScale('1.9rem'),
                            justifyContent: 'center',
                            backgroundColor: 'red',
                            position: 'absolute',
                            top: convertScale('0'),
                            right: convertScale('-0.8rem')
                        })
                    ],
                    cap: 0,
                    onmount() {
                        const _this = this;
                        mango.sub('alarmNum', function (data) {
                            _this.cap = data > 99 ? '99+' : data;
                        });
                    }
                },
                {
                    type: 'button',
                    icon: 'bell',
                    styles: [
                        Styles.icon.regular,
                        Styles.css({
                            border: 'none',
                            backgroundColor: 'transparent',
                            backgroundImage: 'none',
                            boxShadow: 'none'
                        }),
                        Styles.button.icon.css({
                            color: 'red',
                            margin: 0,
                            position: 'relative',
                            bottom: convertScale('0.0625rem'),
                            fontSize: convertScale('1.25rem'),
                            cursor: 'pointer !important'
                        }),
                        Styles.stylesheet({
                            ':scope': {
                                transition: '0.3s all',
                                '&:hover': {
                                    transform: 'scale(1.2)',
                                    'span[slot="icon"]': {
                                        textShadow: '0 0 0.75rem hsl(0,0%,0%)'
                                    }
                                }
                            }
                        })
                    ],
                    onclick(e) {
                        showTable(this);
                    },
                    on: {
                        mouseenter(e) {
                            jam.findParent(e.target, 'jam-wrapper').classList.remove('jam-movable');
                        },
                        mouseleave(e) {
                            jam.findParent(e.target, 'jam-wrapper').classList.add('jam-movable');
                        }
                    }
                }
            ]
        });
        jam.appendChild(ctnr, floatingDom);
    }
    function showTable(dom) {
        jam.floatingTip(dom, {
            broker: 'alertNotificationWindow',
            type: 'container',
            styles: [
                Styles.css({
                    fontSize: convertScale('0.75rem'),
                    width: convertScale('45rem'),
                    maxWidth: 'none',
                    height: convertScale('22.5rem'),
                    overflow: 'auto',
                    display: 'block',
                    padding: `0 ${convertScale('0.2rem')}`
                })
            ],
            components: [
                {
                    type: 'container',
                    styles: [
                        Styles.css({
                            display: 'flex',
                            justifyContent: 'space-between',
                            margin: `${convertScale('0.5rem')} ${convertScale('0.25rem')} ${convertScale('0.25rem')} ${convertScale('0.25rem')}`
                        })
                    ],
                    components: [
                        {
                            ref: 'select',
                            cap: '区域：',
                            type: 'select',
                            styles: [
                                Styles.select.regularSelect,
                                Styles.select.agent.css({
                                    fontSize: convertScale('0.8rem'),
                                    height: convertScale('1.6rem'),
                                    width: convertScale('10rem'),
                                    borderRadius: convertScale('0.25rem')
                                })
                            ],
                            data: [],
                            onvaluechange(value) {
                                let rt = [];
                                if (jam.nullOrEmpty(value)) {
                                    rt = list;
                                } else {
                                    for (let item of list) {
                                        if (String(item.regionId) === String(value)) {
                                            rt.push(item);
                                        }
                                    }
                                }
                                this.ref('table').data = rt;
                            },
                            onmount() {
                                const _this = this;
                                function filterRegion(data) {
                                    let rt = [];
                                    let ids = [];
                                    for (let item of data || []) {
                                        if (ids.includes(item.regionId)) continue;
                                        if (item?.regionId && item?.regionName) {
                                            ids.push(item.regionId);
                                            rt.push({
                                                name: item.regionName,
                                                value: item.regionId
                                            });
                                        }
                                    }
                                    _this.ref('select').data = rt;
                                }
                                filterRegion(list);
                                bindRegion = (data) => {
                                    filterRegion(data?.list);
                                };
                                mango.sub(msgUuid, bindRegion);
                            },
                            onunmount() {
                                mango.unsub(msgUuid, bindRegion);
                            }
                        },
                        {
                            type: 'button',
                            cap: '查看历史',
                            styles: [Styles.button.regularStyle],
                            class: 'ml-_625rem jam-cta',
                            onclick: function () {
                                mango.pub('routeToGraphUpdateInfo', Date.now());
                            }
                        }
                    ]
                },
                {
                    ref: 'table',
                    type: 'table',
                    styles: [
                        Styles.table.customTable,
                        Styles.table.fixedrowheight({
                            height: convertScale('2rem')
                        }),
                        Styles.hover.toShowAll({ selector: '.hover' }),
                        Styles.css({
                            '--th-padding': convertScale('0.25rem'),
                            width: convertScale('43.5rem'),
                            height: convertScale('18.5rem'),
                            padding: 0,
                            margin: `${convertScale('0.25rem')} auto ${convertScale('0.6rem')} auto`
                        }),
                        Styles.stylesheet({
                            '.jam-td': {
                                lineHeight: convertScale('1.9375rem'),
                                whiteSpace: 'nowrap'
                            }
                        })
                    ],
                    dataDef: [
                        {
                            class: 'hover',
                            cap: '区域',
                            key: 'regionName',
                            sortable: false,
                            align: 'center'
                        },
                        {
                            class: 'hover',
                            cap: '厂站',
                            key: 'stName',
                            sortable: false,
                            align: 'center',
                            align: 'left'
                        },
                        {
                            key: 'graphSaveTimeStr',
                            cap: '保存时间',
                            sortable: false,
                            formatter: function (value) {
                                return jame({
                                    type: 'badge',
                                    styles: [
                                        Styles.css({
                                            fontSize: convertScale('0.8rem'),
                                            borderRadius: convertScale('0.2rem'),
                                            position: 'ralative',
                                            top: convertScale('0.05rem')
                                        })
                                    ],
                                    cap: value ? jam.formatTime(value, 'yyyy-MM-dd') : '',
                                    content: value ? jam.formatTime(value, 'HH:mm:ss') : ''
                                });
                            }
                        },
                        {
                            class: 'hover',
                            cap: '图形名称',
                            sortable: false,
                            key: 'graphName',
                            align: 'left'
                        },
                        {
                            class: 'hover',
                            cap: '操作人',
                            sortable: false,
                            key: 'savePersonName',
                            align: 'left'
                        }
                    ],
                    data: []
                }
            ],
            onmount() {
                this.ref('table').data = list;
                bindFunction = (data) => {
                    let regionId = this.ref('select').value;
                    let rt = [];
                    function filter(item) {
                        if (!jam.nullOrEmpty(regionId) && item.regionId !== regionId) {
                            return false;
                        }
                        return true;
                    }
                    for (let item of data.list || []) {
                        if (filter(item)) {
                            rt.push(item);
                        }
                    }
                    this.ref('table').data = rt;
                };
                mango.sub(msgUuid, bindFunction);
            },
            onunmount() {
                mango.unsub(msgUuid, bindFunction);
            },
            onafterrender: function () {}
        });
    }
    function initStyles() {
        if (!Styles.table.customTable) {
            Styles.table.customTable = Styles.style({
                plugins: [
                    Styles.table.gridline,
                    Styles.table.showrownum({ style: 'plain' }),
                    Styles.table.thslot.css({
                        border: 'none'
                    })
                ]
            });
        }
    }
    function convertScale(value) {
        let number = jam.round(jam.toNumber(value) * globalScale, 4);
        let unit = jam.getUnit(value);
        return number + unit;
    }
    let alertNotification = {
        init
    };
    Object.defineProperty(window, 'alertNotification', {
        value: alertNotification,
        writable: false, // 是否可修改
        enumerable: true, // 是否可枚举（for...in, Object.keys等）
        configurable: false // 是否可删除或修改属性描述符
    });
})();
