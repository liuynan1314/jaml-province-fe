import { createWindow } from '../components/createWindow.js';
import { getTargetSystemList } from '../utils/ajaxCache.js';
import { ajaxCall } from '../common.js';
import dataCompareDetail from '../components/dataCompareDetail.js';
let _model, _msgr, threshold, loadingFlag, loadingFlag2, cacheRow;
const dataTypeList = [
    {
        value: 1,
        name: '遥信'
    },
    {
        value: 2,
        name: '遥测'
    }
];
const compareListMap = {
    5: '0',
    6: '2',
    7: '1',
    8: '3'
};
function getDataTypeName(val) {
    let rt = null;
    for (let item of dataTypeList) {
        if (item.value == val) {
            rt = item.name;
            break;
        }
    }
    return rt;
}
function getTargetSystemName(val) {
    let rt = null;
    for (let item of _msgr.get('targetSystemList') || []) {
        if (item.value == val) {
            rt = item.name;
            break;
        }
    }
    return rt;
}
function setThreshold(dom) {
    if (dom.prevalue === dom.value) return;
    if (dom.value > 0 && dom.value < 100) {
        // 执行更新阈值
        saveConsistencyRange(dom.value);
        dom.prevalue = dom.value;
    }
}
function queryMeaCompareOverview() {
    const params = {
        startTime: jam.formatTime(_msgr.get('startTime'), 'yyyy-MM-dd HH:mm:ss'),
        endTime: jam.formatTime(_msgr.get('endTime'), 'yyyy-MM-dd HH:mm:ss'),
        dataType: _msgr.get('dataType'),
        systemId: _msgr.get('systemId'),
        compared: _msgr.get('compared')
    };
    loadStart();
    ajaxCall('queryMeaCompareOverview', {
        success(data) {
            _msgr.pub('tableData', data || []);
        },
        error(error) {
            console.log(error);
        },
        type: 'post',
        params,
        complete() {
            loadEnd();
        }
    });
}
function queryMeaCompareResult(rowData) {
    cacheRow = rowData;
    _msgr.pub('title', `${rowData.sampleTime && jam.formatTime(rowData.sampleTime, 'yyyy-MM-dd HH:mm:ss')}  ${getDataTypeName(rowData.dataType)}${getTargetSystemName(rowData.targetSystemId)}对比详情`);
    const params = {
        id: rowData.id
    };
    loadStart2();
    ajaxCall('queryMeaCompareResult', {
        success(data) {
            _msgr.pub('detailTableData', data || []);
        },
        error(error) {
            console.log(error);
        },
        type: 'post',
        params,
        complete() {
            loadEnd2();
        }
    });
}
function getConsistencyRange() {
    const user = mango.get('userInfo');
    const params = {
        userId: user?.userId || null
    };
    return new Promise((resolve, reject) => {
        ajaxCall('getConsistencyRange', {
            success(data) {
                const rate = data.rate || 0.99;
                _msgr.pub('threshold', rate * 100);
                _msgr.pub('threshold_used', rate * 100);
                threshold = rate;
            },
            error(error) {
                console.log(error);
            },
            type: 'get',
            params,
            complete() {
                resolve();
            }
        });
    });
}
function saveConsistencyRange(val) {
    const user = mango.get('userInfo');
    const rate = +(val / 100).toFixed(4);
    const params = {
        rate,
        userId: user?.userId || null
    };
    ajaxCall('saveConsistencyRange', {
        success(data) {
            _msgr.pub('threshold_used', rate * 100);
            threshold = rate;
            queryMeaCompareOverview();
            cacheRow && queryMeaCompareResult(cacheRow);
            nutmeg.success('更新成功！');
        },
        error(error) {
            console.log(error);
            nutmeg.error('更新失败！');
        },
        type: 'post',
        params
    });
}
function doCompare(id, targetSystemId, uuid) {
    const params = {
        id,
        systemId: targetSystemId
    };
    ajaxCall('doCompare', {
        success(data) {
            dealNotify(uuid, 'success');
        },
        error(error) {
            console.log(error);
            dealNotify(uuid, 'error');
        },
        type: 'post',
        params,
        timeout: 30
    });
}
function dealNotify(uuid, status) {
    let notify;
    for (let item of jam.NutmegNotify.notifies || []) {
        if (item?.id === uuid) {
            notify = item;
            break;
        }
    }
    if (notify) {
        notify.content = notify.content.replace('正在对比', '对比完成');
        status && notify.setAttribute('level', status);
        notify.shake();
        setTimeout(() => {
            notify.pin = false;
        }, 2000);
    }
}
function loadStart() {
    _msgr.pub('loading', true);
    loadingFlag = true;
    setTimeout(() => {
        if (loadingFlag) {
            loadingFlag = false;
        } else {
            _msgr.pub('loading', false);
        }
    }, 600);
}
function loadEnd() {
    if (loadingFlag) {
        loadingFlag = false;
    } else {
        _msgr.pub('loading', false);
    }
}
function loadStart2() {
    _msgr.pub('loading2', true);
    loadingFlag2 = true;
    setTimeout(() => {
        if (loadingFlag2) {
            loadingFlag2 = false;
        } else {
            _msgr.pub('loading2', false);
        }
    }, 600);
}
function loadEnd2() {
    if (loadingFlag2) {
        loadingFlag2 = false;
    } else {
        _msgr.pub('loading2', false);
    }
}
function getDataDef() {
    return [
        {
            key: 'dataType',
            cap: '数据类型',
            sortable: false,
            width: '10%',
            class: 'hover',
            formatter: function (value) {
                return getDataTypeName(value) || '--';
            }
        },
        {
            key: 'sampleTime',
            cap: '采样时间',
            sortable: false,
            width: '10%',
            formatter: function (value) {
                if (!value) return '--';
                let date = jam.formatTime(value, 'yyyy-MM-dd');
                let time = jam.formatTime(value, 'HH:mm:ss');
                return jame({
                    type: 'badge',
                    styles: [Styles.badge.timeBadge],
                    cap: date,
                    content: time
                });
            }
        },
        {
            key: 'checkTime',
            cap: '校核时间',
            sortable: false,
            width: '10%',
            class: 'hover',
            formatter: function (value) {
                if (!value) return '--';
                let date = jam.formatTime(value, 'yyyy-MM-dd');
                let time = jam.formatTime(value, 'HH:mm:ss');
                return jame({
                    type: 'badge',
                    styles: [Styles.badge.timeBadge],
                    cap: date,
                    content: time
                });
            }
        },
        {
            key: 'targetSystemId',
            cap: '对比目标系统',
            sortable: false,
            width: '10%',
            class: 'hover',
            formatter: function (value) {
                return getTargetSystemName(value) || '--';
            }
        },
        {
            key: 'regionUploadCnt',
            cap: '地区上送量测数',
            sortable: false,
            width: '10%',
            class: 'hover',
            align: 'right',
            formatter: function (value) {
                return jam.isEmpty(value) ? '--' : value;
            }
        },
        {
            key: 'provinceModelCnt',
            cap: '省级量测数',
            sortable: false,
            width: '10%',
            class: 'hover',
            align: 'right',
            formatter: function (value) {
                return jam.isEmpty(value) ? '--' : value;
            }
        },
        {
            key: 'consistentCnt',
            cap: '量测一致数量',
            sortable: false,
            width: '10%',
            class: 'hover',
            align: 'right',
            formatter: function (value) {
                return jam.isEmpty(value) ? '--' : value;
            }
        },
        {
            type: 'progress',
            key: 'consistentRate',
            cap: '量测一致率',
            sortable: false,
            width: '10%',
            styles: [
                Styles.progress.agent.css({
                    cursor: 'pointer'
                }),
                'background.stripy',
                'color.stateMap(success:lightgreen;failed:red)'
            ],
            valueStates: {
                success: `value>=${threshold}`,
                failed: `value<${threshold}`
            }
        },
        {
            key: 'compared',
            cap: '是否已对比',
            sortable: false,
            width: '10%',
            class: 'hover',
            formatter: function (value) {
                let comparedName = String(value) === '1' ? '是' : '否';
                return jame({
                    type: 'badge',
                    styles: [comparedName === '是' ? Styles.badge.successBadge : Styles.badge.errorBadge],
                    cap: comparedName
                });
            }
        },
        {
            key: 'compared',
            cap: '操作',
            sortable: false,
            width: '8rem',
            formatter: function (value) {
                const row = this.jamtd.rowIdx;
                const rowData = _msgr.get('tableData')[row] || {};
                const id = rowData.id;
                return jame({
                    type: 'button',
                    cap: String(rowData.compared) === '1' ? '重新对比' : '对比',
                    styles: [
                        Styles.button.tableButton,
                        Styles.css({
                            lineHeight: '1rem'
                        })
                    ],
                    onclick(e) {
                        const data = _msgr.get('targetSystemList');
                        jam.popup(e.target, {
                            type: 'container',
                            styles: [
                                Styles.css({
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '18rem',
                                    alignItems: 'center'
                                })
                            ],
                            components: [
                                {
                                    type: 'select',
                                    placeholder: '-请选择目标系统-',
                                    data
                                },
                                {
                                    type: 'button',
                                    cap: '确认',
                                    styles: [
                                        Styles.css({
                                            width: '4rem',
                                            height: '2rem',
                                            marginLeft: '0.5rem'
                                        })
                                    ],
                                    onclick() {
                                        const select = jam.findSiblings(this, 'jam-select')?.[0]?.value;
                                        if (select) {
                                            let uuid = jam.genGUID();
                                            jam.closePopup();
                                            doCompare(id, select, uuid);
                                            jam.NutmegNotify.appendNotify({
                                                content: `正在对比：${getTargetSystemName(select)} ${getDataTypeName(rowData.dataType)} ${rowData.sampleTime && jam.formatTime(rowData.sampleTime, 'yyyy-MM-dd HH:mm:ss')} 采样数据`,
                                                pin: true,
                                                pinnable: true,
                                                duration: 2000,
                                                id: uuid
                                            });
                                        }
                                    }
                                }
                            ]
                        });
                    }
                });
            }
        }
    ];
}
function getDataDefBottom() {
    return [
        {
            key: 'dataType',
            cap: '数据类型',
            sortable: false,
            width: '10%',
            class: 'hover',
            formatter: function (value) {
                return getDataTypeName(value) || '--';
            }
        },
        {
            key: 'sampleTime',
            cap: '采样时间',
            sortable: false,
            width: '10%',
            formatter: function (value) {
                if (!value) return '--';
                let date = jam.formatTime(value, 'yyyy-MM-dd');
                let time = jam.formatTime(value, 'HH:mm:ss');
                return jame({
                    type: 'badge',
                    styles: [Styles.badge.timeBadge],
                    cap: date,
                    content: time
                });
            }
        },
        {
            key: 'regionName',
            cap: '地区',
            sortable: false,
            width: '10%',
            class: 'hover',
            formatter: function (value) {
                return value || '--';
            }
        },
        {
            key: 'regionUploadCnt',
            cap: '地区上送量测数',
            sortable: false,
            width: '10%',
            class: 'hover',
            align: 'right',
            formatter: function (value) {
                return jam.isEmpty(value) ? '--' : value;
            }
        },
        {
            key: 'provinceModelCnt',
            cap: '省级量测数',
            sortable: false,
            width: '10%',
            class: 'hover',
            align: 'right',
            formatter: function (value) {
                return jam.isEmpty(value) ? '--' : value;
            }
        },
        {
            key: 'consistentCnt',
            cap: '量测一致数量',
            sortable: false,
            width: '10%',
            class: 'hover',
            align: 'right',
            formatter: function (value) {
                return jam.isEmpty(value) ? '--' : value;
            }
        },
        {
            key: 'regionLack',
            cap: '地区量测缺失',
            sortable: false,
            width: '10%',
            class: 'hover',
            align: 'right',
            formatter: function (value) {
                return jam.isEmpty(value) ? '--' : value;
            }
        },
        {
            key: 'provinceLack',
            cap: '省级量测缺失',
            sortable: false,
            width: '10%',
            class: 'hover',
            align: 'right',
            formatter: function (value) {
                return jam.isEmpty(value) ? '--' : value;
            }
        },
        {
            key: 'inconsistentCnt',
            cap: '量测不一致数量',
            sortable: false,
            width: '10%',
            class: 'hover',
            align: 'right',
            formatter: function (value) {
                return jam.isEmpty(value) ? '--' : value;
            }
        },
        {
            type: 'progress',
            key: 'consistentRate',
            cap: '量测一致率',
            sortable: false,
            width: '10%',
            styles: [
                Styles.progress.agent.css({
                    cursor: 'pointer'
                }),
                'background.stripy',
                'color.stateMap(success:lightgreen;failed:red)'
            ],
            valueStates: {
                success: `value>=${threshold}`,
                failed: `value<${threshold}`
            }
        }
    ];
}
export default {
    type: 'container',
    styles: [
        Styles.size.fullsize,
        Styles.css({
            display: 'flex',
            flexDirection: 'column',
            fontSize: '1.1rem',
            minHeight: '0',
            marginRight: '1rem'
        })
    ],
    components: [
        {
            type: 'container',
            class: 'top',
            styles: [
                Styles.css({
                    display: 'flex',
                    flexDirection: 'column',
                    height: '50%',
                    width: '100%',
                    marginbottom: '0.5rem'
                })
            ],
            components: [
                {
                    type: 'container',
                    class: 'head',
                    styles: [
                        Styles.css({
                            display: 'flex',
                            height: 'initial',
                            width: '100%',
                            gap: '0.1rem',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            paddingBottom: '0.5rem',
                            flexWrap: 'wrap'
                        })
                    ],
                    datepickerStyles: [Styles.datepicker.regularDatepicker],
                    selectStyles: [Styles.select.regularSelect],
                    inputStyles: [Styles.input.regularInput],
                    buttonStyles: [Styles.button.regularButton],
                    components: [
                        {
                            type: 'datepicker',
                            defaultValue: Date.now() - 86400000,
                            valueKey: 'startTime',
                            styles: [Styles.connectLine]
                        },
                        {
                            type: 'datepicker',
                            defaultValue: Date.now(),
                            valueKey: 'endTime'
                        },
                        {
                            type: 'select',
                            valueKey: 'dataType',
                            placeholder: '-请选择量测类型-',
                            data: dataTypeList
                        },
                        {
                            type: 'select',
                            valueKey: 'systemId',
                            placeholder: '-请选择目标系统-',
                            dataWatcher: 'targetSystemList'
                        },
                        {
                            type: 'select',
                            valueKey: 'compared',
                            placeholder: '-请选择是否对比',
                            data: [
                                {
                                    value: 1,
                                    name: '是'
                                },
                                {
                                    value: 2,
                                    name: '否'
                                }
                            ]
                        },
                        {
                            type: 'button',
                            cap: '查询',
                            icon: 'search',
                            class: 'jam-cta',
                            styles: [
                                Styles.searchBtnsStyles,
                                Styles.css({
                                    height: '2rem'
                                })
                            ],
                            onclick() {
                                queryMeaCompareOverview();
                            }
                        },
                        {
                            type: 'input-number',
                            label: '一致率阈值(%)',
                            value: '{{threshold}}',
                            rules: {
                                min: 0,
                                max: 100,
                                triggers: ['blur']
                            },
                            step: 0.1,
                            styles: [
                                Styles.css({
                                    position: 'absolute',
                                    right: '0'
                                }),
                                Styles.input.agent.css({
                                    width: '3rem'
                                })
                            ],
                            on: {
                                keyup(event) {
                                    if (event.key === 'Enter') {
                                        setThreshold(this);
                                    }
                                },
                                blur() {
                                    this.value = this.prevalue;
                                },
                                focus() {
                                    this.prevalue = this.value;
                                }
                            },
                            plugins: [Plugins.popup.tip({ showDelay: 300 })],
                            tip: '点击回车保存'
                        }
                    ]
                },
                {
                    type: 'container',
                    class: 'body',
                    styles: [
                        Styles.css({
                            minHeight: '0%',
                            width: '100%',
                            flexGrow: 1,
                            display: 'flex',
                            position: 'relative'
                        })
                    ],
                    components: [
                        {
                            type: 'table',
                            ref: 'topTable',
                            styles: [
                                Styles.table.clickhighlight,
                                Styles.hover.toShowAll({
                                    selector: '.hover'
                                }),
                                Styles.tableStylesFixedRowGeight,
                                Styles.css({
                                    width: '100%',
                                    height: '100%',
                                    cursor: 'pointer'
                                })
                            ],
                            // dataDef: [],
                            dataWatcher: 'tableData',
                            onclick: jam.makeThrottle((e) => {
                                let target;
                                if (e.target.classList.contains('jam-td')) {
                                    target = e.target;
                                } else {
                                    target = jam.findParent(e.target, '.jam-td');
                                }
                                if (target) {
                                    const row = target.jamtd.rowIdx;
                                    const col = target.jamtd.col;
                                    if (col === 10) return; // 操作列不触发
                                    const rowData = _msgr.get('tableData')[row];
                                    queryMeaCompareResult(rowData);
                                }
                            }, 400),
                            watchers: [
                                {
                                    key: 'threshold_used',
                                    callback() {
                                        this.dataDef = getDataDef();
                                    }
                                }
                            ]
                        },
                        {
                            type: 'loading',
                            styles: ['loading.basic', 'size(width:100% !important;height:100% !important)'],
                            props: {
                                isLoading: '{{loading}}'
                            }
                        }
                    ]
                }
            ]
        },
        {
            type: 'container',
            class: 'bottom',
            styles: [
                Styles.css({
                    display: 'flex',
                    flexDirection: 'column',
                    height: '50%',
                    width: '100%',
                    marginbottom: '0.5rem'
                })
            ],
            components: [
                {
                    type: 'container',
                    class: 'bottom-header',
                    components: [
                        {
                            type: 'label',
                            cap: '{{title}}',
                            styles: [
                                Styles.css({
                                    minHeight: '0%',
                                    width: '100%',
                                    padding: '0.5rem 0',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold'
                                })
                            ]
                        }
                    ]
                },
                {
                    type: 'container',
                    class: 'bottom-body',
                    styles: [
                        Styles.css({
                            minHeight: '0%',
                            width: '100%',
                            flexGrow: 1,
                            display: 'flex',
                            position: 'relative'
                        })
                    ],
                    components: [
                        {
                            type: 'table',
                            styles: [
                                Styles.table.clickhighlight,
                                Styles.hover.toShowAll({
                                    selector: '.hover'
                                }),
                                Styles.tableStylesFixedRowGeight,
                                Styles.css({
                                    width: '100%',
                                    height: '100%',
                                    cursor: 'pointer'
                                })
                            ],
                            dataWatcher: 'detailTableData',
                            watchers: [
                                {
                                    key: 'threshold_used',
                                    callback() {
                                        this.dataDef = getDataDefBottom();
                                    }
                                }
                            ],
                            onclick: function (e) {
                                let target;
                                if (e.target.classList.contains('jam-td')) {
                                    target = e.target;
                                } else {
                                    target = jam.findParent(e.target, '.jam-td');
                                }
                                if (target) {
                                    const row = target.jamtd.rowIdx;
                                    const col = target.jamtd.colIdx;
                                    const diffType = compareListMap[col];
                                    let rowData = _msgr.get('detailTableData')[row];
                                    rowData.diffType = diffType;
                                    const body = dataCompareDetail(rowData);
                                    createWindow({
                                        title: `量测对比详情`,
                                        width: '95vw',
                                        height: '85vh',
                                        body,
                                        showBtn: false
                                    });
                                }
                            }
                        },
                        {
                            type: 'loading',
                            styles: ['loading.basic', 'size(width:100% !important;height:100% !important)'],
                            props: {
                                isLoading: '{{loading2}}'
                            }
                        }
                    ]
                }
            ]
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: async function () {
        let targetSystemList = await getTargetSystemList();
        await getConsistencyRange();
        _msgr.pub('title', '请点击上方表格的行查看详情');
        _msgr.pub('targetSystemList', targetSystemList || []);
        queryMeaCompareOverview();
    }
};
