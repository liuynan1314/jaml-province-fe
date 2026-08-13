import { createWindow } from '../createWindow.js';
import node from './node.js';
import application from './application.js';
import process from './process.js';
import { getDetailConfObject } from '../../common.js';
const threshold = getDetailConfObject('systemRunningManagementThreshold') || [0.8, 0.6];
const progressStyles = [
    Styles.css({
        fontSize: 'l',
        height: '1.6rem',
        width: '100%',
        padding: 0,
        '--jam-agent-border-radius': '0',
        '--jam-agent-border-width': '0',
        '--jam-agent-min-width': 'initial'
    }),
    Styles.progress.agent.css({
        height: '1.6rem',
        background: 'hsl(203.4, 57.1%, 22%)',
        textAlign: 'left',
        textIndent: 's',
        cursor: 'pointer'
    })
];
jaml.register('systemRunningCard', {
    type: 'container',
    styles: [
        Styles.hover.crosshair,
        Styles.css({
            height: 'fit-content',
            width: 'calc(calc((100% / 3)) - 1rem)',
            margin: '0 s m s',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: '2.8rem s s s',
            fontFamily: 'DINPro',
            fontSize: 's',
            border: 's solid var(--jam-color-primary-default)',
            background: 'tint'
            // backgroundImage: 'url(../assets/images/dataQualityManagement/sj_box.png)',
            // backgroundSize: '100% 100%',
            // backgroundRepeat: 'no-repeat'
        })
    ],
    components: [
        {
            type: 'label',
            cap: '{{item.regionName}}',
            styles: [
                Styles.css({
                    backgroundImage: 'linear-gradient(180deg, var(--jam-color-primary-default) 0%, var(--jam-color-primary-default) 100%)',
                    backgroundClip: 'text',
                    fontSize: 'l',
                    position: 'absolute',
                    top: '0.2rem',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    color: 'transparent',
                    fontWeight: 'bold'
                }),
                Styles.stylesheet({
                    ':scope': {
                        '-webkit-background-clip': 'text'
                    }
                })
            ]
        },
        {
            type: 'systemRunningCardLeft',
            props: {
                allData: '{{item}}'
            }
        },
        {
            type: 'systemRunningCardRight',
            props: {
                allData: '{{item}}'
            }
        }
    ]
});
jaml.register('systemRunningCardNode', {
    class: 'systemRunningCardNode',
    type: 'container',
    styles: [
        Styles.css({
            // border: '1px solid hsl(200, 36%, 61%, 0.5)',
            // height: '3rem',
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            padding: 'xs',
            background: 'var(--jam-color-primary-default)'
        })
    ],
    components: [
        {
            type: 'container',
            styles: [
                Styles.css({
                    display: 'block',
                    width: '45%',
                    marginRight: 's'
                })
            ],
            components: [
                {
                    type: 'label',
                    icon: ' ',
                    cap: '{{cap}}',
                    states: {
                        0: {
                            styles: [
                                Styles.label.icon.css({
                                    backgroundImage: 'url(../assets/images/systemRunningManagement/icon_node.png)'
                                })
                            ]
                        },
                        1: {
                            styles: [
                                Styles.label.icon.css({
                                    backgroundImage: 'url(../assets/images/systemRunningManagement/icon_application.png)'
                                })
                            ]
                        },
                        2: {
                            styles: [
                                Styles.label.icon.css({
                                    backgroundImage: 'url(../assets/images/systemRunningManagement/icon_process.png)'
                                })
                            ]
                        }
                    },
                    state: jaml.var('subIndex', (subIndex) => {
                        return subIndex;
                    }),
                    styles: [
                        Styles.css({
                            width: '100%',
                            height: '1.8rem',
                            paddingLeft: '0',
                            fontSize: 'm',
                            color: 'primary',
                            // backgroundImage: 'url(../assets/images/systemRunningManagement/bg_title_nob.png)',
                            // backgroundSize: '100% 50%',
                            // backgroundRepeat: 'no-repeat',
                            // backgroundPosition: '0 100%',
                            marginBottom: 'xs'
                        }),
                        Styles.label.icon.css({
                            backgroundSize: '80% 80%',
                            backgroundRepeat: 'no-repeat',
                            position: 'relative',
                            top: '0.2rem',
                            left: '0.2rem',
                            margin: 0
                        })
                    ]
                },
                {
                    type: 'progress',
                    value: jaml.var('subData.rate', (val) => {
                        return val / 100;
                    }),
                    states: {
                        0: {
                            styles: [
                                Styles.css({
                                    '--p-bg-image': 'linear-gradient(90deg,hsl(0, 52.5%, 23%)  0%, hsl(0, 52.5%, 43%) var(--p-val))'
                                })
                            ]
                        },
                        1: {
                            styles: [
                                Styles.css({
                                    '--p-bg-image': 'linear-gradient(90deg,hsl(45, 69.6%, 20%) 0%, hsl(45, 69.6%, 50%) var(--p-val))'
                                })
                            ]
                        },
                        2: {
                            styles: [
                                Styles.css({
                                    '--p-bg-image': 'linear-gradient(90deg,hsl(156.3, 52.5%, 23%)  0%, hsl(156.3, 52.5%, 43%) var(--p-val))'
                                })
                            ]
                        }
                    },
                    state: jaml.var('subData.rate', (val) => {
                        let rate = val / 100;
                        let rt;
                        if (rate >= threshold?.[0]) {
                            rt = 2;
                        } else if (rate >= threshold?.[1]) {
                            rt = 1;
                        } else {
                            rt = 0;
                        }
                        return rt;
                    }),
                    styles: progressStyles
                }
            ]
        },
        {
            type: 'container',
            styles: [
                Styles.css({
                    display: 'block',
                    height: '100%',
                    width: '55%',
                    background: 'var(--jam-color-primary-subtle)'
                })
            ],
            components: [
                {
                    type: 'label',
                    cap: '正常/总数',
                    styles: [
                        Styles.css({
                            height: '1.8rem',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: 'xxs',
                            padding: 0,
                            fontSize: 'm'
                            // background: 'hsl(210, 40.3%, 28.2%)',
                        })
                    ]
                },
                {
                    type: 'container',
                    styles: [
                        Styles.css({
                            height: '1.8rem',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        })
                    ],
                    labelStyles: [Styles.css({ padding: '0 xxs', fontSize: 'm' })],
                    components: [
                        {
                            type: 'label',
                            cap: '{{subData.normal}}',
                            styles: [
                                Styles.css({
                                    fontWeight: 'bold',
                                    color: 'hsl(156.3, 52.5%, 53.7%)'
                                })
                            ]
                        },
                        {
                            type: 'label',
                            cap: '/'
                        },
                        {
                            type: 'label',
                            cap: '{{subData.total}}',
                            styles: [
                                Styles.css({
                                    fontSize: 'xs'
                                })
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    onclick() {
        let func, cap;
        if (this?.cmpt?.subIndex === '0') {
            func = node;
            cap = '节点';
        } else if (this?.cmpt?.subIndex === '1') {
            func = application;
            cap = '应用';
        } else if (this?.cmpt?.subIndex === '2') {
            func = process;
            cap = '进程';
        }
        createWindow({
            title: `${this?.cmpt?.regionName} - ${cap}详情`,
            width: '80vw',
            height: '65vh',
            body: func({ regionId: this?.cmpt?.regionId }),
            showBtn: false
        });
    }
});
jaml.register('systemRunningCardLeft', {
    type: 'container',
    styles: [
        Styles.css({
            width: '45%',
            display: 'block',
            padding: 'xs'
        }),
        Styles.stylesheet({
            ':scope .systemRunningCardNode:not(:first-child)': {
                marginTop: 's'
            }
        })
    ],
    components: [
        {
            type: 'systemRunningCardNode',
            props: {
                subData: '{{allData.node}}',
                subIndex: '0',
                cap: '节点',
                regionId: '{{allData.regionId}}',
                regionName: '{{allData.regionName}}'
            }
        },
        {
            type: 'systemRunningCardNode',
            props: {
                subData: '{{allData.app}}',
                subIndex: '1',
                cap: '应用',
                regionId: '{{allData.regionId}}',
                regionName: '{{allData.regionName}}'
            }
        },
        {
            type: 'systemRunningCardNode',
            props: {
                subData: '{{allData.proc}}',
                subIndex: '2',
                cap: '进程',
                regionId: '{{allData.regionId}}',
                regionName: '{{allData.regionName}}'
            }
        }
    ]
});
jaml.register('systemRunningCardRight', {
    type: 'container',
    styles: [
        Styles.css({
            width: 'calc(55% - 0.2rem)',
            display: 'block',
            padding: 'xs',
            marginLeft: 'xxs'
        })
    ],
    components: [
        {
            type: 'buttongroup-radio',
            data: [
                { value: 1, name: '应用' },
                { value: 2, name: '进程' }
            ],
            value: 1,
            styles: [
                Styles.stylesheet({
                    ':scope input[type=radio]': {
                        display: 'none'
                    },
                    ':scope .jam-option': {
                        height: '1.4rem',
                        padding: 'xs xs',
                        borderRadius: '0',
                        transition: 'all 0.3s ',
                        border: 'none',
                        margin: '0',
                        border: 's solid var(--jam-color-primary-default)',
                        color: 'muted',
                        backgroundImage: 'linear-gradient(-2.64deg, transparent 0%, var(--jam-color-primary-film) 100%)'
                    },
                    ':scope .jam-option.jam-checked': {
                        border: 's solid var(--jam-color-primary-default)',
                        color: 'onprimary',
                        backgroundImage: 'linear-gradient(-5.96deg, var(--jam-color-primary-subtle) 0%, var(--jam-color-primary-default) 100%)'
                    }
                }),
                Styles.css({
                    padding: 0
                })
            ],
            states: {
                active: {
                    styles: [
                        Styles.stylesheet({
                            ':scope .jam-option': {
                                color: 'hsl(199.4, 100%, 93.9%)',
                                backgroundImage: 'linear-gradient(-5.96deg, hsla(196, 100%, 50%, 0.6) 0%, hsl(212, 100%, 50%) 100%)'
                            }
                        })
                    ]
                }
            },
            onvaluechange(val) {
                const sibling = jam.findSiblings(this, 'jam-table')?.[0];
                changeTable(sibling.cmpt, val, this.filterStr);
                this.filterStr = null;
            },
            watchers: [
                {
                    key: 'item',
                    callback(val) {
                        // 不监听排序表格不刷新
                        this.cmpt.value = 1;
                        const sibling = jam.findSiblings(this, 'jam-table')?.[0];
                        changeTable(sibling.cmpt, this.cmpt.value, this.filterStr);
                        this.filterStr = null;
                    },
                    init: false
                }
            ]
        },
        {
            ref: 'table',
            type: 'table',
            styles: [
                Styles.hover.toShowAll({ selector: '.hover' }),
                Styles.tableStylesFixedRowGeight,
                Styles.table.gridline,
                Styles.css({
                    width: '100%',
                    height: '14.2rem',
                    cursor: 'pointer',
                    padding: 0
                })
            ],
            onclick(e) {
                let target;
                const sibling = jam.findSiblings(this, 'jam-buttongroup')?.[0];
                if (e.target.classList.contains('jam-td')) {
                    target = e.target;
                } else {
                    target = jam.findParent(e.target, '.jam-td');
                }
                if (!target) return; // 点击表头
                const row = target.jamtd.rowIdx;
                if (target && target.jamtd?.col === 1 && sibling.value === 1) {
                    // 点击节点名称，过滤进程列表某节点的数据
                    sibling.filterStr = target.col(0);
                    sibling.value = 2; // 触发onvaluechange，刷新表格
                    jam.afterNextRepaint(() => {
                        // 处理toShowAll的label
                        jam.removeSelf(jam.findChildren(document.body, 'jam-label')[0]);
                    });
                } else if (sibling.value === 1) {
                    // 点击应用表格，弹出应用卡片
                    const rowData = this?.cmpt?.allData?.app?.details[row];
                    if (target && target.jamtd?.col === 2) {
                        createWindow({
                            title: `${this?.cmpt?.allData?.regionName} - ${rowData.nodeName}节点 - 异常应用详情`,
                            width: '80vw',
                            height: '65vh',
                            body: application({
                                regionId: this?.cmpt?.allData?.regionId,
                                nodeName: rowData.nodeName,
                                abnormal: true
                            }),
                            showBtn: false
                        });
                    } else if (target && target.jamtd?.col === 3) {
                        createWindow({
                            title: `${this?.cmpt?.allData?.regionName} - ${rowData.nodeName}节点 - 应用详情`,
                            width: '80vw',
                            height: '65vh',
                            body: application({
                                regionId: this?.cmpt?.allData?.regionId,
                                nodeName: rowData.nodeName
                            }),
                            showBtn: false
                        });
                    }
                } else if (target && target.jamtd?.col === 3 && sibling.value === 2) {
                    // 点击进程表格，弹出进程卡片
                    const rowData = this?.cmpt?.allData?.proc?.details[row];
                    if (target && target.jamtd?.col === 3) {
                        createWindow({
                            title: `${this?.cmpt?.allData?.regionName} - ${rowData.nodeName}节点 - ${rowData.appName}应用 - 异常进程详情`,
                            width: '80vw',
                            height: '65vh',
                            body: process({
                                regionId: this?.cmpt?.allData?.regionId,
                                nodeName: rowData.nodeName,
                                appName: rowData.appName,
                                abnormal: true
                            }),
                            showBtn: false
                        });
                    } else if (target && target.jamtd?.col === 4) {
                        createWindow({
                            title: `${this?.cmpt?.allData?.regionName} - ${rowData.nodeName}节点 - ${rowData.appName}应用 - 进程详情`,
                            width: '80vw',
                            height: '65vh',
                            body: process({
                                regionId: this?.cmpt?.allData?.regionId,
                                nodeName: rowData.nodeName,
                                appName: rowData.appName
                            }),
                            showBtn: false
                        });
                    }
                }
            }
        }
    ]
});
function changeTable(table, type, filter) {
    let tableData;
    if (type === 1) {
        table.dataDef = [
            {
                key: 'nodeName',
                cap: '所属节点',
                sortable: false,
                width: '43%',
                class: 'hover'
            },
            {
                key: 'abnormal',
                cap: '异常应用',
                styles: [
                    Styles.css({
                        color: 'hsl(40.2, 100%, 50%)',
                        textDecoration: 'underline'
                    })
                ],
                width: '28%'
            },
            {
                key: 'total',
                cap: '总数',
                width: '28%',
                styles: [
                    Styles.css({
                        textDecoration: 'underline'
                    })
                ]
            }
        ];
        tableData = jam.cloneDeep(table?.allData?.app?.details || []);
        table.data = tableData;
    } else if (type === 2) {
        table.dataDef = [
            {
                key: 'nodeName',
                cap: '所属节点',
                sortable: false,
                width: '25%',
                class: 'hover'
            },
            {
                key: 'appName',
                cap: '所属应用',
                sortable: false,
                width: '25%',
                class: 'hover'
            },
            {
                key: 'abnormal',
                cap: '异常进程',
                styles: [
                    Styles.css({
                        color: 'hsl(40.2, 100%, 50%)',
                        textDecoration: 'underline'
                    })
                ],
                width: '25%'
            },
            {
                key: 'total',
                cap: '总数',
                width: '25%',
                styles: [
                    Styles.css({
                        textDecoration: 'underline'
                    })
                ]
            }
        ];
        tableData = jam.cloneDeep(table?.allData?.proc?.details || []);
        if (filter) {
            tableData = tableData.filter((item) => item.nodeName === filter);
        }
    }
    table.data = tableData;
}
