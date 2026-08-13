import { ajaxCall, findCol, formatterJameTime, formatterJameBv } from '../common.js';
import { getRegionList, getBvList, getSubstationList } from '../utils/commonList.js';
import dailyStatisticsDetailWindow from '../components/modal/dailyStatisticsDetailWindow.js';
let _pageSize = 15;
const pagerKey = jam.genUUID();
const dailyTypeList = [
    {
        name: '容抗器投切日统计',
        value: 1
    },
    {
        name: '主变日统计',
        value: 2
    },
    {
        name: '母线日统计',
        value: 3
    }
];
const uploadStatusList = [
    {
        value: 0,
        name: '未上送'
    },
    {
        value: 1,
        name: '上送成功'
    },
    {
        value: 2,
        name: '上送失败'
    }
];
const devSubTypeList = [
    {
        value: 1,
        name: '并联电容'
    },
    {
        value: 2,
        name: '并联电抗'
    }
];
const mxDevSubTypeList = [
    {
        value: 0,
        name: '双向越限'
    },
    {
        value: 1,
        name: '越上限'
    },
    {
        value: 2,
        name: '越下限'
    }
];
const dataDefs = [
    [
        { key: 'devId', show: false },
        { key: 'id', show: false },
        {
            cap: '时间',
            sortable: false,
            class: 'hover',
            key: 'statTime',
            formatter: formatterJameTime
        },
        {
            cap: '所属厂站',
            align: 'left',
            class: 'hover',
            sortable: false,
            key: 'stName'
        },

        {
            cap: '容抗器名称',
            class: 'hover',
            align: 'left',
            sortable: false,
            key: 'devName'
        },
        {
            cap: '电压等级',
            sortable: false,
            class: 'hover',
            key: 'bvName',
            formatter: formatterJameBv
        },
        {
            cap: '容抗器类型',
            class: 'hover',
            sortable: false,
            key: 'devType',
            formatter(value) {
                let _color = 'primary';
                let _name = '并联电容';
                if (value == 2) {
                    _color = 'warn';
                    _name = '并联电抗';
                }
                return jame({
                    type: 'label',
                    cap: _name,
                    color: _color,
                    styles: [
                        'with.tint',
                        'border.s',
                        Styles.label.cap.css({
                            textAlign: 'left'
                        })
                    ]
                });
            }
        },
        {
            cap: '使用率',
            type: 'progress',
            key: 'usageRate',
            styles: [Styles.progress.agent.css({ cursor: 'pointer' }), 'color.stateMap(high:info;mid:warn;low:error)'],
            valueStates: {
                high: 'value>=0.8',
                mid: 'value>0.4',
                low: 'value<=0.4'
            }
        },
        {
            cap: '日累计投切次数',
            key: 'totalSwitch',
            formatter: NumberFormatter
        },
        {
            cap: '投入时长累计时长(分钟)',
            key: 'onDuration',
            formatter: NumberFormatter
        },
        {
            cap: '上送状态',
            sortable: false,
            class: 'hover',
            key: 'uploadStatus',
            formatter: uploadFormatter
        }
    ],
    [
        { key: 'devId', show: false },
        { key: 'id', show: false },
        {
            cap: '时间',
            sortable: false,
            class: 'hover',
            width: '14rem',
            key: 'statTime',
            formatter: formatterJameTime
        },
        {
            cap: '所属厂站',
            align: 'left',
            width: '10rem',
            class: 'hover',
            sortable: false,
            key: 'stName'
        },
        {
            cap: '区域',
            class: 'hover',
            width: '5rem',
            sortable: false,
            key: 'regionName'
        },
        {
            cap: '主变名称',
            class: 'hover',
            width: '7rem',
            align: 'left',
            sortable: false,
            key: 'devName'
        },
        {
            cap: '电压等级',
            sortable: false,
            width: '7rem',
            class: 'hover',
            key: 'bvName',
            formatter: formatterJameBv
        },
        {
            cap: '上送状态',
            sortable: false,
            width: '7rem',
            class: 'hover',
            key: 'uploadStatus',
            formatter: uploadFormatter
        },
        {
            cap: `正向负载率\n平均值(%)`,
            sortable: false,
            key: 'positiveAverage',
            formatter: NumberFormatter
        },
        {
            cap: `正向负载率\n最大值(%)`,
            sortable: false,
            key: 'positiveMax',
            formatter: NumberFormatter
        },
        {
            cap: `正向负载率\n累计时长(分钟)`,
            width: '10rem',
            sortable: false,
            key: 'positiveDuration',
            formatter: NumberFormatter
        },
        {
            cap: `反向负载率\n平均值(%)`,
            sortable: false,
            key: 'reverseAverage',
            formatter: NumberFormatter
        },
        {
            cap: `反向负载率\n最大值(%)`,
            sortable: false,
            key: 'reverseMax',
            formatter: NumberFormatter
        },
        {
            cap: `反向负载率\n累计时长(分钟)`,
            width: '10rem',
            sortable: false,
            key: 'reverseDuration',
            formatter: NumberFormatter
        },
        {
            cap: `无功倒送\n平均值(%)`,
            sortable: false,
            key: 'qbackAverage',
            formatter: NumberFormatter
        },
        {
            cap: `无功倒送\n最大值(%)`,
            sortable: false,
            key: 'qbackMax',
            formatter: NumberFormatter
        },
        {
            cap: `无功倒送\n时长(分钟)`,
            sortable: false,
            key: 'qbackDuration',
            formatter: NumberFormatter
        },
        {
            cap: `无功倒送\n时长占比(%)`,
            sortable: false,
            key: 'qbackPercent',
            formatter: NumberFormatter
        }
    ],
    [
        { key: 'devId', show: false },
        { key: 'id', show: false },
        {
            cap: '时间',
            sortable: false,
            class: 'hover',
            key: 'statTime',
            formatter: formatterJameTime
        },
        {
            cap: '所属厂站',
            align: 'left',
            class: 'hover',
            sortable: false,
            key: 'stName'
        },
        {
            cap: '区域',
            class: 'hover',
            sortable: false,
            key: 'regionName'
        },
        {
            cap: '母线名称',
            class: 'hover',
            align: 'left',
            sortable: false,
            key: 'devName'
        },
        {
            cap: '主变名称',
            class: 'hover',
            align: 'left',
            sortable: false,
            key: 'trName'
        },
        {
            cap: '电压等级',
            sortable: false,
            class: 'hover',
            key: 'bvName',
            formatter: formatterJameBv
        },
        {
            cap: '上送状态',
            sortable: false,
            class: 'hover',
            key: 'uploadStatus',
            formatter: uploadFormatter
        },
        {
            cap: '越限类型',
            class: 'hover',
            sortable: false,
            key: 'limitType',
            width: '9%',
            formatter(value) {
                let _color = 'primary';
                let _name = '越上限';
                if (value == 0) {
                    _color = 'danger';
                    _name = '双向越限';
                } else if (value == 2) {
                    _color = 'warn';
                    _name = '越下限';
                }
                return jame({
                    type: 'label',
                    cap: _name,
                    color: _color,
                    icon: `<div style="width:0.625rem;min-width:0.625rem;height:0.625rem;min-height:0.625rem;border-radius:50%;background:${jam.getColor(_color).hex()}"><div>`,
                    styles: [
                        Styles.icon.duotone,
                        'with.tint',
                        Styles.css({
                            padding: 's',
                            borderRadius: 'l'
                        }),
                        Styles.label.cap.css({
                            textAlign: 'left'
                        })
                    ]
                });
            }
        },
        {
            cap: '越上限时长(分钟)',
            key: 'upDuration',
            formatter: NumberFormatter
        },
        {
            cap: '越下限时长(分钟)',
            key: 'downDuration',
            formatter: NumberFormatter
        },
        {
            cap: '母线拓扑连接主变时长(分钟)',
            key: 'linkTime',
            formatter: NumberFormatter
        }
    ]
];
dataDefs.forEach((item) => {
    item.push({
        cap: '操作',
        sortable: false,
        width: '8rem',
        formatter(uuid) {
            const _id = this.col(1);
            const _styles = ['color.primary', 'with.tint', 'border.subtle', 'border.s', 'css(marginLeft:m;padding:0 s;cursor: pointer;text-underline-offset:.2rem;transition:all .2s ease-in-out; )', 'hover(color:var(--jam-color-fg-default)!important;)'];
            return jame({
                type: 'container',
                components: [
                    {
                        type: 'label',
                        cap: '详情',
                        styles: _styles,
                        onclick: () => {
                            const _data = _msgr.get('dailyStatisticsData') || [];
                            const _thiskey = _data.find((item) => item.id == _id);
                            const _dailyType = _model.vars.dailyType || 1;
                            const title = dailyTypeList[_dailyType - 1]?.name;
                            jam.renderModal('#main', dailyStatisticsDetailWindow(title, _thiskey, _dailyType));
                        }
                    },
                    {
                        type: 'label',
                        cap: '上送',
                        styles: _styles,
                        onclick: (e) => {
                            let target = findCol(e.target);
                            const devIdList = target.col(0) ? [target.col(0)] : [];
                            const date = target.col(2);
                            jam.popupYesNo(
                                e.target,
                                '<span style="white-space:nowrap">确定执行此操作吗?</span>',
                                () => {
                                    runReactiveDevPush(devIdList, date);
                                },
                                () => {}
                            );
                        }
                    }
                ]
            });
        }
    });
});
let _model, _msgr;
export default {
    type: 'wrapper',
    styles: [
        Styles.css({
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            background: 'elevation',
            overflow: 'hidden'
        }),
        Styles.stylesheet({
            '.headerContent': {
                width: '100%',
                minHeight: '14rem',
                flexDirection: 'column',
                '.btnContent': {
                    marginTop: '.625rem',
                    alignItems: 'center'
                }
            },
            '.tableContent': {
                flexDirection: 'column',
                flex: 1,
                overflow: 'hidden'
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            class: 'headerContent',
            components: [
                {
                    type: 'buttongroup-radio',
                    cap: '统计类别',
                    styles: [Styles.buttonGroupStylesWithBgCap],
                    value: '{{dailyType}}',
                    data: dailyTypeList
                },
                {
                    type: 'wrapper',
                    components: [
                        {
                            type: 'buttongroup-radio',
                            icon: 'earth-asia',
                            cap: '区域选择',
                            styles: [Styles.buttonGroupStylesWithBgCap],
                            value: '{{regionId}}',
                            data: '{{regionList}}'
                        },
                        {
                            type: 'buttongroup-radio',
                            cap: '电压等级',
                            icon: 'bolt',
                            styles: [Styles.buttonGroupStylesWithBgCap],
                            defaultValue: null,
                            value: '{{bvId}}',
                            data: '{{bvList}}'
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'btnContent',
                    childStyles: ['datepicker.agent.border(radius:s)'],
                    datepickerStyles: ['padding(top:0;bottom:0)', 'datepicker.labelslot.margin(0)'],
                    buttonStyles: [Styles.searchBtnsStyles],
                    components: [
                        {
                            type: 'filterSelect',
                            styles: ['size(maxWidth:14.5rem)', 'padding(top:0;bottom:0)'],
                            childStyles: ['size(minWidth:14.5rem)', 'input.agent.border(radius:s)', 'input.labelslot.margin(0)', 'padding(0)'],
                            valueKey: 'stId',
                            props: { cap: '变电站：', placeholder: '请选择', data: '{{stList}}', icon: 'transformer-bolt', search: '{{name}}', select: '{{stId}}' },
                            watchers: [
                                {
                                    key: 'name',
                                    callback: function (val) {
                                        getSubstationList({ _model, devName: val });
                                    },
                                    debounce: 200
                                }
                            ]
                        },
                        {
                            type: 'select',
                            cap: '上送状态',
                            valueKey: 'uploadStatus',
                            data: uploadStatusList
                        },
                        {
                            type: 'select',
                            showIf: '{{dailyType}} == 1',
                            cap: '容抗器类型',
                            valueKey: 'devSubType',
                            data: devSubTypeList
                        },
                        {
                            type: 'select',
                            showIf: '{{dailyType}} == 3',
                            cap: '越限类型',
                            valueKey: 'devSubType',
                            data: mxDevSubTypeList
                        },
                        { type: 'datepicker', value: '{{beginDate}}', max: '{{endDate}}', icon: 'calendar', cap: '查询时间：' },
                        { type: 'datepicker', value: '{{endDate}}', min: '{{beginDate}}', cap: '-', styles: ['padding(left:0)', 'size(width:9.2rem;)', Styles.stylesheet({ ':scope': { minWidth: '0!important' } })] },
                        {
                            type: 'button',
                            cap: '查询',
                            icon: 'search',
                            class: 'jam-cta',
                            onclick: function () {
                                initTableData();
                            }
                        }
                        // {
                        //     type: 'button',
                        //     cap: '导出',
                        //     icon: 'file-export',
                        //     onclick: function () {
                        //         const title = dailyTypeList[_model.vars.dailyType - 1 || 0]?.name;
                        //         exportExcel(urlConfig['exportEventByParam'].url, packageParams(), `${title}_${moment().format('yyyyMMDDHHmmssSSS')}.xlsx`, 'post');
                        //     }
                        // }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'tableContent',
            components: [
                {
                    type: 'table',
                    styles: [
                        'flex(1)',
                        Styles.tableStyles,
                        Styles.hover.toShowAll({
                            selector: '.hover'
                        })
                    ],
                    descStyles: [Styles.icon.duotone],
                    ref: 'pageTable',
                    stateWatcher: 'dailyType',
                    states: {
                        1: {
                            styles: [
                                Styles.stylesheet({
                                    '.jam-th': { whiteSpace: 'nowrap' }
                                })
                            ]
                        },
                        2: {
                            styles: [
                                Styles.table.th.css({
                                    whiteSpace: 'pre-line',
                                    textAlign: 'center',
                                    lineHeight: 1.2,
                                    minHeight: '3.5rem',
                                    height: 'auto'
                                })
                            ]
                        },
                        3: {
                            styles: [
                                Styles.stylesheet({
                                    '.jam-th': { whiteSpace: 'nowrap' }
                                })
                            ]
                        }
                    },
                    dataWatcher: 'dailyStatisticsData',
                    dataDef: jaml.var('dailyType', (data) => {
                        return dataDefs[data - 1];
                    })
                },
                {
                    type: 'pager',
                    styles: [
                        //
                        'size(minHeight:2.25rem)',
                        'margin(top:var(--gap-sm))'
                    ],
                    props: {
                        pageSizeList: [
                            {
                                value: '15',
                                name: '15条/页'
                            },
                            {
                                value: '50',
                                name: '50条/页'
                            },
                            {
                                value: '100',
                                name: '100条/页'
                            }
                        ],
                        total: pagerKey + '_total',
                        messageKey: pagerKey
                    }
                }
            ]
        }
    ],
    vars: {
        // beginDate: '2022-01-01',
        beginDate: moment().subtract(1, 'days').format('yyyy-MM-DD'),
        endDate: moment().subtract(1, 'days').format('yyyy-MM-DD'),
        regionId: null,
        bvId: null,
        dailyType: 1,
        uploadStatus: null,
        devSubType: null
    },
    watchers: [
        {
            keys: ['cpageNo', 'cpageSize'],
            callback(pageNo, pageSize) {
                console.log(99999);
                this.parentElement.startRow = (pageNo - 1) * pageSize + 1;
            }
        },
        {
            key: 'dailyType',
            callback: function (value) {
                initTableData();
            }
        },
        {
            key: pagerKey,
            callback: function (page) {
                this.ref('pageTable').startRow = (Number(page.pageNumber) - 1) * Number(page.pageSize) + 1;
                _pageSize = page.pageSize;
                page.firstFetch ? null : initTableData(page);
            }
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        getRegionList(_model);
        getBvList(_model, _msgr);
        getSubstationList({ _model });
        // initTableData();
    }
};

function runReactiveDevPush(devIdList, date) {
    const params = packageParams();
    ajaxCall('runReactiveDevPush', {
        params: {
            devIdList,
            date: jam.formatTime(date, 'yyyy-MM-dd'),
            devType: params.devType
        },
        type: 'post',
        success(data) {
            if (data == 1) {
                jam.notify('上送成功');
                initTableData();
            } else {
                jam.notify('上送失败');
            }
        },
        error(data) {
            jam.notify('上送失败');
        }
    });
}

function initTableData(page) {
    ajaxCall('getReactiveDevStatList', {
        params: { ...getPagerParams(page), ...packageParams() },
        type: 'post',
        success(data) {
            try {
                const { list = [], pojoTotalCount = 0 } = data || {};
                list.forEach((item) => {
                    if (item.usageRate != null) {
                        item.usageRate = (Number(item.usageRate) / 100).toFixed(2);
                    }
                });
                _msgr.pub('dailyStatisticsData', list);
                _msgr.pub(pagerKey + '_total', pojoTotalCount);
            } catch (error) {}
        }
    });
}

function getPagerParams(page) {
    const { pageNumber = 1, pageSize = _pageSize } = page || {};
    return { pageIndex: pageNumber, pageSize };
}

function packageParams() {
    let devSubType = undefined;
    if (_model.vars.dailyType != 2) {
        devSubType = _model.vars.devSubType;
    }
    return {
        startTime: _model.vars.beginDate ? _model.vars.beginDate + ' 00:00:00' : undefined,
        endTime: _model.vars.endDate ? _model.vars.endDate + ' 23:59:59' : undefined,
        stId: _msgr.get('stId') ? _msgr.get('stId') : undefined,
        regionIdList: _model.vars.regionId ? [_model.vars.regionId] : undefined,
        bvIdList: _model.vars.bvId ? [_model.vars.bvId] : undefined,
        devType: _model.vars.dailyType,
        uploadStatus: _model.vars.uploadStatus,
        devSubType
    };
}

function uploadFormatter(value) {
    let _color = 'warn';
    let _icon = 'triangle-exclamation';
    let title = uploadStatusList[value]?.name;
    if (value == 1) {
        _color = 'success';
        _icon = 'octagon-check';
    } else if (value == 2) {
        _color = 'error';
        _icon = 'circle-xmark';
    }
    return jame({
        type: 'label',
        icon: _icon,
        cap: title ?? '--',
        color: _color,
        styles: [
            Styles.css({
                fontSize: 's',
                padding: 's',
                borderRadius: 's',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }),
            Styles.stylesheet({
                '[slot=icon] i': {
                    '--stroke-color': 'var(--jam-element-color) !important'
                }
            })
        ]
    });
}

function NumberFormatter(value) {
    if (!value && value !== 0) {
        return '--';
    } else {
        return value;
    }
}
