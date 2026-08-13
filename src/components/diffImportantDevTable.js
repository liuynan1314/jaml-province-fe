import { ajaxCall, findCol, formatterJameTime, formatterJameBv } from '../common.js';
// import { createWindow } from '../components/createWindow.js';
import diffHistoryChart from '../components/modal/diffHistoryChart.js';
import mainAndAuxAlarmWindow from '../components/modal/mainAndAuxAlarmWindow.js';
import { VOLTAGE_COLOR_STATE_BG } from '../utils/Constants.js';
import realHistoryDetail from './modal/generalRealHistoryDetail.js';
import { buildBasicTable } from './componentBuilder.js';

let _model = null;
let _msgr = null;

const diffImportantDevTable = (size) => {
    return {
        type: 'wrapper',
        styles: [
            Styles.size.fullsize,
            Styles.stylesheet({
                ':scope': {
                    '.text-underline': {
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        'text-underline-offset': '.2rem'
                    }
                }
            })
        ],
        components: [
            // {
            //     type: 'table',
            //     class: 'table-style',
            //     ref: 'abc',
            //     styles: [Styles.tableStyles, Styles.table.showrownum({ style: 'plain' }), Styles.table.fixedrowheight({ height: '2.5rem' }), Styles.size({ width: '100%' })],
            //     dataWatcher: 'majorPowerOutageTableData',
            //     dataDef: [
            //         {
            //             cap: '唯一设备id',
            //             key: 'devId',
            //             show: false
            //         },

            //         {
            //             cap: '修改时间',
            //             key: 'gmtUpdateTime',
            //             show: size !== 'small',
            //             width: '13.5rem',
            //             formatter: formatterJameTime
            //         },
            //         {
            //             cap: '厂站',
            //             key: 'stName',
            //             sortable: size !== 'small',
            //             align: 'left',
            //             styles: [Styles.toShowAll]
            //         },
            //         {
            //             cap: '所属间隔',
            //             key: 'bayName',
            //             sortable: size !== 'small',
            //             align: 'left',
            //             width: '12%',
            //             styles: [
            //                 Styles.hover.toShowAll,
            //                 Styles.css({
            //                     overflow: 'hidden',
            //                     whiteSpace: 'nowrap',
            //                     textOverflow: 'ellipsis'
            //                 })
            //             ],
            //             formatter: function (value) {
            //                 return value ? value : '<div style="width:100%;text-align:center">--</div>';
            //             }
            //         },
            //         {
            //             cap: '设备',
            //             key: 'devName',
            //             sortable: size !== 'small',
            //             align: 'left',
            //             width: '12%',
            //             styles: [
            //                 Styles.hover.toShowAll,
            //                 Styles.css({
            //                     overflow: 'hidden',
            //                     whiteSpace: 'nowrap',
            //                     textOverflow: 'ellipsis'
            //                 })
            //             ]
            //         },
            //         {
            //             cap: '设备类型',
            //             key: 'devType',
            //             show: size !== 'small'
            //         },
            //         {
            //             cap: '电压等级',
            //             key: 'bvName',
            //             show: size !== 'small',
            //             formatter: function (value) {
            //                 return jame({
            //                     type: 'label',
            //                     cap: value,
            //                     state: value,
            //                     states: VOLTAGE_COLOR_STATE_BG('label', 'color')
            //                 });
            //             }
            //         },
            //         {
            //             cap: size === 'small' ? '有功' : '有功（MW）',
            //             key: 'p',
            //             sortable: size !== 'small',
            //             ref: 'p',
            //             formatter: function (value) {
            //                 return jame({
            //                     type: 'label',
            //                     cap: value,
            //                     class: 'text-underline',
            //                     styles: [
            //                         Styles.css({
            //                             color: 'hsl(156.3, 52.5%, 53.7%)'
            //                         })
            //                     ],
            //                     onclick: function (e) {
            //                         let target = findCol(e.target);
            //                         const devId = target.col(0);
            //                         const modal_params = {
            //                             devId,
            //                             key: 'plcId',
            //                             name: '有功'
            //                         };
            //                         openDiffHistoryChart(modal_params);
            //                     }
            //                 });
            //             }
            //         },
            //         {
            //             cap: size === 'small' ? '无功' : '无功（MW）',
            //             key: 'q',
            //             sortable: size !== 'small',
            //             formatter: function (value) {
            //                 return jame({
            //                     type: 'label',
            //                     cap: value,
            //                     class: 'text-underline',
            //                     styles: [
            //                         Styles.css({
            //                             color: 'hsl(45, 69.6%, 63.9%)'
            //                         })
            //                     ],
            //                     onclick: function (e) {
            //                         let target = findCol(e.target);
            //                         const devId = target.col(0);
            //                         const modal_params = {
            //                             devId,
            //                             key: 'qlcId',
            //                             name: '无功'
            //                         };
            //                         openDiffHistoryChart(modal_params);
            //                     }
            //                 });
            //             }
            //         },
            //         {
            //             cap: size === 'small' ? '电流' : '电流（A）',
            //             key: 'i',
            //             sortable: size !== 'small',
            //             formatter: function (value) {
            //                 return jame({
            //                     type: 'label',
            //                     cap: value,
            //                     class: 'text-underline',
            //                     styles: [
            //                         Styles.css({
            //                             color: 'hsl(180, 100%, 41%)'
            //                         })
            //                     ],
            //                     onclick: function (e) {
            //                         let target = findCol(e.target);
            //                         const devId = target.col(0);
            //                         const modal_params = {
            //                             devId,
            //                             key: 'ilcId',
            //                             name: '电流'
            //                         };
            //                         openDiffHistoryChart(modal_params);
            //                     }
            //                 });
            //             }
            //         },
            //         {
            //             cap: size === 'small' ? '温度' : '温度（℃）',
            //             key: 'temperature',
            //             sortable: size !== 'small',
            //             formatter: function (value) {
            //                 return jame({
            //                     type: 'label',
            //                     cap: value,
            //                     class: 'text-underline',
            //                     styles: [
            //                         Styles.css({
            //                             color: 'hsl(195.3, 100%, 56.1%)'
            //                         })
            //                     ],
            //                     onclick: function (e) {
            //                         let target = findCol(e.target);
            //                         const devId = target.col(0);
            //                         const modal_params = {
            //                             devId,
            //                             key: 'temperatureLcId',
            //                             name: '温度'
            //                         };
            //                         openDiffHistoryChart(modal_params);
            //                     }
            //                 });
            //             }
            //         },
            //         {
            //             cap: size === 'small' ? '负载率' : '负载率（%）',
            //             key: 'loadRate',
            //             sortable: size !== 'small',
            //             formatter: function (value) {
            //                 return jame({
            //                     type: 'label',
            //                     cap: value,
            //                     class: 'text-underline',
            //                     styles: [
            //                         Styles.css({
            //                             color: 'hsl(195.3, 100%, 56.1%)'
            //                         })
            //                     ],
            //                     onclick: function (e) {
            //                         let target = findCol(e.target);
            //                         const devId = target.col(0);
            //                         const modal_params = {
            //                             devId,
            //                             key: 'loadRateLcId',
            //                             name: '负载率'
            //                         };
            //                         openDiffHistoryChart(modal_params);
            //                     }
            //                 });
            //             }
            //         },
            //         {
            //             cap: size === 'small' ? '间隔光字' : '间隔光字告警',
            //             key: 'gzpState',
            //             sortable: false,
            //             formatter: function (value) {
            //                 const gzpNames = {
            //                     0: '正常',
            //                     1: '异常',
            //                     2: '故障'
            //                 };

            //                 return jame({
            //                     type: 'wrapper',
            //                     styles: [Styles.layout.flex({ justifyContent: 'center', alignItems: 'center' }), Styles.css({ cursor: 'pointer' })],
            //                     components: [
            //                         {
            //                             type: 'element',
            //                             styles: [Styles.css({ display: 'block', content: '', height: '0.8rem', width: '0.8rem', borderRadius: '50%' })],
            //                             state: value,
            //                             states: gzpStates('background')
            //                         },
            //                         {
            //                             type: 'label',
            //                             cap: gzpNames[value] || '--',
            //                             state: value,
            //                             class: 'text-underline',
            //                             states: gzpStates('color')
            //                         }
            //                     ],
            //                     onclick: function (e) {
            //                         let target = findCol(e.target);
            //                         const devId = target.col(0);
            //                         const record = _msgr.get('majorPowerOutageTableData').find((item) => item.devId == devId);
            //                         createWindow({
            //                             title: `主辅告警列表`,
            //                             width: '75vw',
            //                             height: '75vh',
            //                             body: mainAndAuxAlarmWindow(record),
            //                             showBtn: false
            //                         });
            //                     }
            //                 });
            //             }
            //         }
            //     ]
            // }

            buildBasicTable({
                cap: '保供电设备-表格',
                icon: 'table',
                dataKey: 'majorPowerOutageTableData',
                dataDef: [
                    {
                        cap: '唯一设备id',
                        key: 'devId',
                        show: false
                    },

                    {
                        cap: '修改时间',
                        key: 'gmtUpdateTime',
                        show: size !== 'small',
                        width: '13.5rem',
                        formatter: formatterJameTime
                    },
                    {
                        cap: '厂站',
                        key: 'stName',
                        sortable: size !== 'small',
                        align: 'left',
                        styles: [Styles.toShowAll]
                    },
                    {
                        cap: '所属间隔',
                        key: 'bayName',
                        sortable: size !== 'small',
                        align: 'left',
                        width: '12%',
                        styles: [
                            Styles.hover.toShowAll,
                            Styles.css({
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            })
                        ],
                        formatter: function (value) {
                            return value ? value : '<div style="width:100%;text-align:center">--</div>';
                        }
                    },
                    {
                        cap: '设备',
                        key: 'devName',
                        sortable: size !== 'small',
                        align: 'left',
                        width: '12%',
                        styles: [
                            Styles.hover.toShowAll,
                            Styles.css({
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            })
                        ]
                    },
                    {
                        cap: '设备类型',
                        key: 'devType',
                        show: size !== 'small'
                    },
                    {
                        cap: '电压等级',
                        key: 'bvName',
                        show: size !== 'small',
                        formatter: formatterJameBv
                    },
                    {
                        cap: size === 'small' ? '有功' : '有功（MW）',
                        key: 'p',
                        sortable: size !== 'small',
                        ref: 'p',
                        formatter: function (value) {
                            return jame({
                                type: 'label',
                                cap: value,
                                class: 'text-underline',
                                styles: [
                                    Styles.css({
                                        color: 'hsl(156.3, 52.5%, 53.7%)'
                                    })
                                ],
                                onclick: function (e) {
                                    let target = findCol(e.target);
                                    const devId = target.col(0);
                                    const modal_params = {
                                        devId,
                                        key: 'plcId',
                                        name: '有功'
                                    };
                                    openDiffHistoryChart(modal_params);
                                }
                            });
                        }
                    },
                    {
                        cap: size === 'small' ? '无功' : '无功（MW）',
                        key: 'q',
                        sortable: size !== 'small',
                        formatter: function (value) {
                            return jame({
                                type: 'label',
                                cap: value,
                                class: 'text-underline',
                                styles: [
                                    Styles.css({
                                        color: 'hsl(45, 69.6%, 63.9%)'
                                    })
                                ],
                                onclick: function (e) {
                                    let target = findCol(e.target);
                                    const devId = target.col(0);
                                    const modal_params = {
                                        devId,
                                        key: 'qlcId',
                                        name: '无功'
                                    };
                                    openDiffHistoryChart(modal_params);
                                }
                            });
                        }
                    },
                    {
                        cap: size === 'small' ? '电流' : '电流（A）',
                        key: 'i',
                        sortable: size !== 'small',
                        formatter: function (value) {
                            return jame({
                                type: 'label',
                                cap: value,
                                class: 'text-underline',
                                styles: [
                                    Styles.css({
                                        color: 'hsl(180, 100%, 41%)'
                                    })
                                ],
                                onclick: function (e) {
                                    let target = findCol(e.target);
                                    const devId = target.col(0);
                                    const modal_params = {
                                        devId,
                                        key: 'ilcId',
                                        name: '电流'
                                    };
                                    openDiffHistoryChart(modal_params);
                                }
                            });
                        }
                    },
                    {
                        cap: size === 'small' ? '温度' : '温度（℃）',
                        key: 'temperature',
                        sortable: size !== 'small',
                        formatter: function (value) {
                            return jame({
                                type: 'label',
                                cap: value,
                                class: 'text-underline',
                                styles: [
                                    Styles.css({
                                        color: 'hsl(195.3, 100%, 56.1%)'
                                    })
                                ],
                                onclick: function (e) {
                                    let target = findCol(e.target);
                                    const devId = target.col(0);
                                    const modal_params = {
                                        devId,
                                        key: 'temperatureLcId',
                                        name: '温度'
                                    };
                                    openDiffHistoryChart(modal_params);
                                }
                            });
                        }
                    },
                    {
                        cap: size === 'small' ? '负载率' : '负载率（%）',
                        key: 'loadRate',
                        sortable: size !== 'small',
                        formatter: function (value) {
                            return jame({
                                type: 'label',
                                cap: value,
                                class: 'text-underline',
                                styles: [
                                    Styles.css({
                                        color: 'hsl(195.3, 100%, 56.1%)'
                                    })
                                ],
                                onclick: function (e) {
                                    let target = findCol(e.target);
                                    const devId = target.col(0);
                                    const modal_params = {
                                        devId,
                                        key: 'loadRateLcId',
                                        name: '负载率'
                                    };
                                    openDiffHistoryChart(modal_params);
                                }
                            });
                        }
                    },
                    {
                        cap: size === 'small' ? '间隔光字' : '间隔光字告警',
                        key: 'gzpState',
                        sortable: false,
                        formatter: function (value) {
                            const gzpNames = {
                                0: '正常',
                                1: '异常',
                                2: '故障'
                            };

                            return jame({
                                type: 'wrapper',
                                styles: [Styles.layout.flex({ justifyContent: 'center', alignItems: 'center' }), Styles.css({ cursor: 'pointer' })],
                                components: [
                                    {
                                        type: 'element',
                                        styles: [Styles.css({ display: 'block', content: '', height: '0.8rem', width: '0.8rem', borderRadius: '50%' })],
                                        state: value,
                                        states: gzpStates('background')
                                    },
                                    {
                                        type: 'label',
                                        cap: gzpNames[value] || '--',
                                        state: value,
                                        class: 'text-underline',
                                        states: gzpStates('color')
                                    }
                                ],
                                onclick: function (e) {
                                    let target = findCol(e.target);
                                    const devId = target.col(0);
                                    const record = _msgr.get('majorPowerOutageTableData').find((item) => item.devId == devId);
                                    jam.renderModal('#main', mainAndAuxAlarmWindow(record));
                                    // createWindow({
                                    //     title: `主辅告警列表`,
                                    //     width: '75vw',
                                    //     height: '75vh',
                                    //     body: mainAndAuxAlarmWindow(record),
                                    //     showBtn: false
                                    // });
                                }
                            });
                        }
                    }
                ]
            })
        ],
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
        },
        methods: {},
        onafterrender: function () {}
    };
};

export function openDiffHistoryChart(modal_params, lcIdList) {
    let record;
    if (lcIdList) {
        modal_params.lcIdList = lcIdList;
    } else {
        record = _msgr.get('majorPowerOutageTableData').find((item) => item.devId == modal_params.devId);
        modal_params.lcIdList = [record[modal_params.key]];
    }
    modal_params.devName = modal_params.devName ? modal_params.devName + '-运行数据' : record.devName + '-运行数据';
    // createWindow({
    //     title: `${record.devName}-${modal_params.name}历史曲线`,
    //     width: '60vw',
    //     height: '65vh',
    //     body: diffHistoryChart(modal_params),
    //     showBtn: false
    // });
    jam.renderModal('#main', realHistoryDetail(modal_params));
    // createWindow({
    //     title: `${modal_params?.devName || record.devName}-运行数据`,
    //     width: '64vw',
    //     height: '40vw',
    //     body: realHistoryDetail(modal_params),
    //     showBtn: false
    // });
}

function gzpStates(styleName) {
    return {
        0: {
            styles: [Styles.css({ [styleName]: 'hsl(144.9 100% 39.22%)' })]
        },
        1: {
            styles: [Styles.css({ [styleName]: 'hsl(40.24 100% 50%)' })]
        },
        2: {
            styles: [Styles.css({ [styleName]: 'hsl(19.2 100% 50%)' })]
        }
    };
}

export default diffImportantDevTable;
