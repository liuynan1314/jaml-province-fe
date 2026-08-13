// import { createWindow } from '../createWindow.js';
import channel from './channel.js';
import { getDetailConfObject } from '../../common.js';
const threshold = getDetailConfObject('dataQualityManagementThreshold') || {
    0: [0.8, 0.6],
    1: [0.8, 0.6],
    2: [0.8, 0.6],
    3: [0.8, 0.6],
    4: [0.8, 0.6]
};
const progressStyles = [
    Styles.css({
        fontSize: '1.5rem',
        height: '1.6rem',
        width: 'calc(100% - 0.6rem)',
        margin: ' 0 0.3rem 0.5rem 0.3rem',
        padding: 0,
        '--jam-agent-border-radius': '0',
        '--jam-agent-border-width': '0'
    }),
    Styles.progress.agent.css({
        height: '1.6rem',
        background: `${jam.ac()}`,
        textAlign: 'left',
        textIndent: '0.5rem',
        cursor: 'pointer'
    })
];

jaml.register('dataQualityCard', {
    type: 'container',
    styles: [
        Styles.hover.crosshair,
        Styles.css({
            height: 'fit-content',
            width: 'calc(calc((100% / 3)) - 1rem)',
            margin: '0 0.5rem 0.9rem 0.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: '2.8rem 0.5rem 0.5rem 0.5rem',
            fontFamily: 'DINPro',
            fontSize: '0.9rem',
            border: `1px solid ${jam.ac()}`,
            background: `${jam.ac({ a: 0.2 })}`
        })
    ],
    components: [
        {
            type: 'label',
            cap: '{{item.regionName}}',
            styles: [
                Styles.css({
                    backgroundImage: `linear-gradient(180deg, ${jam.ac()} 0%, ${jam.lumiText(0)} 100%)`,
                    backgroundClip: 'text',
                    fontSize: '1.2rem',
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
            type: 'dataQualityCard33',
            props: {
                subData: '{{item.channel}}',
                subIndex: '0',
                cap: '通道在线情况',
                errorName: '退出时长',
                countName: '总时长'
            }
        },
        {
            type: 'dataQualityCard33',
            props: {
                subData: '{{item.accident}}',
                subIndex: '1',
                cap: '事故信号正确性',
                errorName: '未匹配',
                countName: '总数'
            }
        },
        {
            type: 'dataQualityCard33',
            props: {
                subData: '{{item.dataCompleteness}}',
                subIndex: '2',
                cap: '数据完整度',
                errorName: '未采集',
                countName: '总数'
            }
        },
        {
            type: 'dataQualityCard50',
            props: {
                subData: '{{item.dataValid}}',
                subIndex: '3',
                cap: '采集数据质量',
                errorName: '异常',
                countName: '总数'
            }
        },
        {
            type: 'dataQualityCard50',
            props: {
                subData: '{{item.yxYcMatch}}',
                subIndex: '4',
                cap: '遥测遥信匹配度',
                errorName: '不匹配',
                countName: '总数'
            }
        }
    ]
});
jaml.register('dataQualityCard33', {
    type: 'container',
    styles: [
        Styles.css({
            border: `1px solid ${jam.ac()}`,
            height: '8.2rem',
            width: 'calc(100% / 3 - 0.4rem)',
            display: 'block',
            marginBottom: '0.6rem',
            padding: '0.2rem',
            background: `${jam.ac({ a: 0.6 })}`,
            cursor: 'pointer'
        })
    ],
    components: [
        {
            type: 'label',
            icon: ' ',
            cap: '{{cap}}',
            styles: [
                Styles.css({
                    paddingTop: '0.1rem',
                    fontSize: '0.9rem'
                }),
                Styles.label.icon.css({
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    position: 'relative',
                    top: '0.2rem',
                    margin: 0
                })
            ],
            states: {
                0: {
                    styles: [
                        Styles.label.icon.css({
                            backgroundImage: 'url(../assets/images/dataQualityManagement/icon_statistics.png)'
                        })
                    ]
                },
                1: {
                    styles: [
                        Styles.label.icon.css({
                            backgroundImage: 'url(../assets/images/dataQualityManagement/icon_signal.png)'
                        })
                    ]
                },
                2: {
                    styles: [
                        Styles.label.icon.css({
                            backgroundImage: 'url(../assets/images/dataQualityManagement/icon_data.png)'
                        })
                    ]
                }
            },
            state: jaml.var('subIndex', (subIndex) => {
                return subIndex;
            })
        },
        {
            type: 'progress',
            value: jaml.var('subData.rate', (val) => {
                return Math.floor(val * 10000) / 10000;
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
            state: jaml.var('subData.rate', 'subIndex', (val, subIndex) => {
                let rate = Math.floor(val * 1000) / 1000;
                let rt;
                if (rate >= threshold?.[subIndex]?.[0]) {
                    rt = 2;
                } else if (rate >= threshold?.[subIndex]?.[1]) {
                    rt = 1;
                } else {
                    rt = 0;
                }
                return rt;
            }),
            styles: progressStyles
        },
        {
            type: 'container',
            styles: [
                Styles.css({
                    display: 'block',
                    height: '3rem',
                    width: 'calc(100% - 0.6rem)',
                    margin: '0 0.3rem',
                    fontSize: '0.9rem'
                })
            ],
            components: [
                {
                    type: 'container',
                    styles: [
                        Styles.css({
                            height: '50%',
                            width: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignContent: 'flex-start',
                            background: `${jam.ac()}`,
                            marginBottom: '0.2rem'
                        })
                    ],
                    components: [
                        {
                            type: 'label',
                            cap: '{{errorName}}',
                            styles: [
                                Styles.css({
                                    width: '4.2rem',
                                    height: '100%'
                                })
                            ]
                        },
                        {
                            type: 'label',
                            cap: jaml.var('subData.abnormal', (val) => {
                                return isNaN(val) ? val.match(/\d+/g)?.[0] : val;
                            }),
                            styles: [
                                Styles.css({
                                    height: '100%',
                                    // fontSize: '1.1rem',
                                    padding: 0,
                                    flexGrow: 1,
                                    justifyContent: 'flex-end',
                                    marginRight: '0.3rem',
                                    color: 'hsl(40.2, 100%, 50%)'
                                })
                            ]
                        },
                        {
                            type: 'label',
                            cap: jaml.var('subData.abnormal', 'subData.total', (abnormal, total) => {
                                // 如果上下单位一致，上面就不显示了
                                // abnormal灭有用逗号间隔，total有逗号间隔
                                let rt;
                                if (!isNaN(abnormal)) {
                                    rt = '';
                                } else {
                                    // 如果单位相同就不显示
                                    if (abnormal.match(/[^\d\s.]+/g)?.[0] === total.match(/[^\d\s.]+/g)?.[0]) {
                                        rt = '';
                                    } else {
                                        // 如果单位不相同就显示
                                        rt = abnormal.match(/[^\d\s.]+/g)?.[0];
                                    }
                                }
                                return rt;
                            }),
                            styles: [
                                Styles.css({
                                    height: 'fit-content',
                                    margin: '0 0.3rem 0 0.2rem',
                                    padding: '0 0.1rem',
                                    borderRadius: '0.2rem',
                                    color: jam.ac(1, 0, jam.acLumiO(1)),
                                    background: `linear-gradient(-79.16deg, ${jam.ac({ a: 0.2 })} 0%, ${jam.ac({ a: 0.8 })} 100%)`,
                                    fontSize: '0.8rem',
                                    alignSelf: 'center'
                                })
                            ]
                        }
                    ]
                },
                {
                    type: 'container',
                    styles: [
                        Styles.css({
                            height: '50%',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            background: `${jam.ac()}`
                        })
                    ],
                    components: [
                        {
                            type: 'label',
                            cap: '{{countName}}',
                            styles: [
                                Styles.css({
                                    width: '3.2rem',
                                    height: '100%'
                                })
                            ]
                        },
                        {
                            type: 'container',
                            styles: [
                                Styles.css({
                                    flexGrow: 1,
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                })
                            ],
                            components: [
                                {
                                    type: 'label',
                                    cap: jaml.var('subData.total', (val) => {
                                        return val.match(/\d+/g)?.[0];
                                    }),
                                    styles: [
                                        Styles.css({
                                            height: '100%'
                                        })
                                    ]
                                },
                                {
                                    type: 'label',
                                    cap: jaml.var('subData.total', (val) => {
                                        return val.match(/[^\d\s]+/g)?.[0] || '个';
                                    }),
                                    styles: [
                                        Styles.css({
                                            height: 'fit-content',
                                            margin: '0 0.3rem 0 0.2rem',
                                            padding: '0 0.1rem',
                                            borderRadius: '0.2rem',
                                            color: jam.ac(1, 0, jam.acLumiO(1)),
                                            background: `linear-gradient(-79.16deg, ${jam.ac({ a: 0.2 })} 0%, ${jam.ac({ a: 0.8 })} 100%)`,
                                            fontSize: '0.8rem',
                                            alignSelf: 'center'
                                        })
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    onclick() {
        openCard(this.cmpt);
    }
});
jaml.register('dataQualityCard50', {
    type: 'container',
    styles: [
        Styles.css({
            border: `1px solid ${jam.ac()}`,
            height: '6rem',
            width: 'calc(50% - 0.3rem)',
            display: 'block',
            padding: '0.2rem',
            background: `linear-gradient(180deg, hsla(206, 83.1%, 55.9%, 0) 19%, hsla(206, 83.1%, 55.9%, 0.16) 100%)`,
            cursor: 'pointer'
        })
    ],
    components: [
        {
            type: 'container',
            styles: [
                Styles.css({
                    width: '100%',
                    display: 'block'
                })
            ],
            components: [
                {
                    type: 'label',
                    icon: ' ',
                    cap: '{{cap}}',
                    styles: [
                        Styles.css({
                            paddingTop: '0.1rem',
                            fontSize: '0.9rem'
                        }),
                        Styles.label.icon.css({
                            backgroundSize: '100% 100%',
                            backgroundRepeat: 'no-repeat',
                            position: 'relative',
                            // top: '0.2rem',
                            margin: 0
                        })
                    ],
                    states: {
                        3: {
                            styles: [
                                Styles.label.icon.css({
                                    backgroundImage: 'url(../assets/images/dataQualityManagement/icon_record.png)'
                                })
                            ]
                        },
                        4: {
                            styles: [
                                Styles.label.icon.css({
                                    backgroundImage: 'url(../assets/images/dataQualityManagement/icon_device.png)'
                                })
                            ]
                        }
                    },
                    state: jaml.var('subIndex', (subIndex) => {
                        return subIndex;
                    })
                }
            ]
        },
        {
            type: 'progress',
            value: jaml.var('subData.rate', (val) => {
                return Math.floor(val * 1000) / 1000;
            }),
            styles: progressStyles,
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
            state: jaml.var('subData.rate', 'subIndex', (val, subIndex) => {
                let rate = Math.floor(val * 1000) / 1000;
                let rt;
                if (rate >= threshold?.[subIndex]?.[0]) {
                    rt = 2;
                } else if (rate >= threshold?.[subIndex]?.[1]) {
                    rt = 1;
                } else {
                    rt = 0;
                }
                return rt;
            })
        },
        {
            type: 'container',
            styles: [
                Styles.css({
                    width: 'calc(100% - 0.6rem)',
                    display: 'flex',
                    margin: '0 0.3rem',
                    padding: '0.2rem 0',
                    background: `${jam.ac()}`
                })
            ],
            components: [
                {
                    type: 'label',
                    cap: jaml.var('errorName', 'countName', (errorName, countName) => {
                        return `${errorName}/${countName}`;
                    }),
                    styles: [
                        Styles.css({
                            width: '5rem',
                            display: 'flex',
                            marginLeft: '0.2rem',
                            padding: 0
                        })
                    ]
                },
                {
                    type: 'container',
                    styles: [
                        Styles.css({
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        })
                    ],
                    labelStyles: [Styles.css({ padding: '0 0.1rem' })],
                    components: [
                        {
                            type: 'label',
                            cap: '{{subData.abnormal}}',
                            styles: [
                                Styles.css({
                                    color: 'hsl(40.2, 100%, 50%)'
                                    // fontSize: '1.1rem',
                                })
                            ]
                        },
                        {
                            type: 'label',
                            cap: '/'
                        },
                        {
                            type: 'label',
                            cap: jaml.var('subData.total', (val) => {
                                return val.split(' ')[0];
                            }),
                            styles: [
                                Styles.css({
                                    fontSize: '0.9rem'
                                })
                            ]
                        },
                        {
                            type: 'label',
                            cap: jaml.var('subData.total', (val) => {
                                return val.split(' ')[1] || '个';
                            }),
                            styles: [
                                Styles.css({
                                    height: 'fit-content',
                                    margin: '0 0.3rem 0 0.2rem',
                                    padding: '0 0.1rem',
                                    borderRadius: '0.2rem',
                                    color: jam.ac(1, 0, jam.acLumiO(1)),
                                    fontSize: '0.8rem',
                                    alignSelf: 'center'
                                })
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    onclick() {
        openCard(this.cmpt);
    }
});
const indexMap = {
    0: '6',
    1: '3',
    2: '15',
    3: '16',
    4: '14'
};
function openCard(cmpt) {
    jam.renderModal(
        '#main',
        channel({
            name: cmpt?.cap + '-详情',
            regionId: cmpt?.item?.regionId,
            subIndex: indexMap[cmpt?.subIndex],
            beginTime: cmpt.msgr.get('beginTime'),
            endTime: cmpt.msgr.get('endTime')
        })
    );

    // createWindow({
    //     title: cmpt?.cap + '-详情',
    //     width: '85vw',
    //     height: '75vh',
    //     body: channel({
    //         regionId: cmpt?.item?.regionId,
    //         subIndex: indexMap[cmpt?.subIndex],
    //         beginTime: cmpt.msgr.get('beginTime'),
    //         endTime: cmpt.msgr.get('endTime')
    //     }),
    //     showBtn: false
    // });
}
