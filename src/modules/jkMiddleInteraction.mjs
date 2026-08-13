import { ajaxCall, exportExcel, loadConf, formatterJameTime } from '../common.js';
import { getBvList, getRegionList, getSubstationList } from '../utils/commonList.js';
import { urlConfig, userInfo } from '../global.js';
import { disableRegionOptionByUnicode } from './equipmentEarlyWarningStatistics.mjs';
import { traceManagementOptions } from './traceManagement.mjs';
let _model,
    _msgr,
    eChartsIns,
    isFirstSearch = true;

export default {
    type: 'wrapper',
    styles: [
        'css(--gap:var(--jam-space-m))',
        'padding(var(--gap))',
        'flex(direction: column)',
        'with.elevation',
        'padding(bottom:0)',
        'layout(overflow:hidden auto)',
        'size.fullsize',
        Styles.stylesheet({
            '.jam-th': {
                'word-wrap': 'break-word',
                'word-break': 'break-all',
                'white-space': 'normal'
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            styles: ['size(minHeight:14rem)'],
            components: [
                {
                    type: 'wrapper',
                    styles: ['flex(flex:1;direction:column;)'],
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '区域选择',
                            icon: 'earth-asia',
                            styles: [Styles.buttonGroupStylesWithBgCap],
                            defaultValue: null,
                            value: '{{regionId}}',
                            data: '{{regionList}}',
                            onafterrender: function () {
                                if (userInfo.unicode) {
                                    const buttonggroupEle = this.cmpt.element;
                                    disableRegionOptionByUnicode(userInfo.unicode, buttonggroupEle);
                                }
                            }
                        },
                        {
                            type: 'buttongroup-radio',
                            cap: '电压等级',
                            icon: 'bolt',
                            disabled: '{{isDisabled}}',
                            styles: [Styles.buttonGroupStylesWithBgCap],
                            defaultValue: null,
                            value: '{{bvId}}',
                            data: '{{bvList}}'
                        },
                        {
                            type: 'wrapper',
                            childStyles: [
                                Styles.css({
                                    marginRight: 'm'
                                })
                            ],
                            components: [
                                {
                                    type: 'buttongroup-radio',
                                    cap: '查看方式',
                                    styles: [Styles.buttonGroupStylesWithBgCap],
                                    defaultValue: 1,
                                    value: '{{viewType}}',
                                    data: [
                                        {
                                            name: '全部',
                                            value: 1
                                        },
                                        {
                                            name: '明细',
                                            value: 2
                                        }
                                    ]
                                },
                                {
                                    type: 'buttongroup-radio',
                                    cap: '是否进行中台映射',
                                    disabled: '{{isDisabled}}',
                                    defaultValue: null,
                                    styles: [Styles.buttonGroupStylesWithBgCap],
                                    value: '{{isReaction}}',
                                    data: [
                                        {
                                            name: '全部',
                                            value: null
                                        },
                                        {
                                            name: '是',
                                            value: 1
                                        },
                                        {
                                            name: '否',
                                            value: 0
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            styles: [
                                'layout.flex(alignItems:center;justifyContent:flex-start)',
                                'margin(top:var(--gap))',
                                Styles.stylesheet({
                                    ':scope': {},
                                    '.ml-_625rem': {
                                        marginLeft: 'm'
                                    }
                                })
                            ],
                            datepickerStyles: [Styles.datepicker.regularStyle],
                            buttonStyles: [Styles.searchBtnsStyles],
                            components: [
                                {
                                    type: 'filterSelect',
                                    styles: ['size(maxWidth:11.5rem)', 'padding(top:0;bottom:0)'],
                                    childStyles: ['size(minWidth:11.5rem)', 'input.agent.border(radius:s)', 'input.labelslot.margin(0)'],
                                    valueKey: 'stId',
                                    disabled: '{{isDisabled}}',
                                    props: { cap: '变电站：', placeholder: '请选择', data: '{{stList}}', search: '{{name}}', select: '{{stId}}', icon: 'transformer-bolt' },
                                    watchers: {
                                        name(val) {
                                            getSubstationList({ _model, devName: val });
                                        }
                                    }
                                },
                                {
                                    type: 'select',
                                    cap: '设备类型：',
                                    styles: [Styles.select.regularStyle],
                                    disabled: '{{isDisabled}}',
                                    value: '{{devType}}',
                                    dataWatcher: 'devTypeList'
                                },
                                {
                                    type: 'button',
                                    cap: '查询',
                                    icon: 'search',
                                    class: 'jam-cta',
                                    onclick: function () {
                                        initTableData();
                                    }
                                },
                                {
                                    type: 'button',
                                    cap: '导出',
                                    icon: 'file-export',
                                    onclick: function () {
                                        if (_model.vars.isDisabled) {
                                            const _table = this.model.ref('jkMiddleTable');
                                            const _dataDef = _table.dataDef.filter((item) => item.show !== false);
                                            const title = _dataDef.map((th) => th.cap);
                                            const titleKey = _dataDef.map((th) => th.key);
                                            const data = [
                                                title,
                                                ..._msgr.get('jkMiddleData').map((item) => {
                                                    return titleKey.map((k) => item?.[k] || '');
                                                })
                                            ];
                                            nusp.exportArray2Excel(data, `集控中台交互_${moment().format('yyyyMMDDHHmmssSSS')}`);
                                        } else {
                                            const _params = getTableParams();
                                            delete _params.pageIndex;
                                            delete _params.pageSize;
                                            exportExcel(urlConfig['exportRelationDevAreaData'].url, _params, `集控中台交互明细_${moment().format('YYYYMMDDHHmmssSSS')}.xlsx`, 'post');
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    styles: ['size(width:42%;height:100%)', 'margin(left:var(--gap))', 'flex(direction:column;)'],
                    components: [
                        {
                            type: 'wrapper',
                            styles: ['layout.flex'],
                            components: [
                                {
                                    type: 'label',
                                    cap: '{{chartTitle}}',
                                    styles: [
                                        Styles.stylesheet({
                                            '[slot=cap]': {
                                                display: 'block',
                                                minWidth: '13.2rem',
                                                height: '2.25rem',
                                                paddingLeft: 'l',
                                                backgroundImage: 'url(./../assets/images/title_third.png)',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'bottom var(--gap) left',
                                                backgroundSize: 'auto 1.875rem'
                                            }
                                        })
                                    ]
                                }
                            ]
                        },
                        // 图表
                        {
                            type: 'wrapper',
                            styles: ['size.fullsize', 'layout(overflow: hidden)', 'border.subtle', 'border.s'],
                            components: [
                                {
                                    type: 'wrapper',
                                    styles: ['size.fullsize', 'layout(position:relative)', 'flex(direction:column;)'],
                                    components: [
                                        {
                                            type: 'wrapper',
                                            styles: ['padding(0 m)', 'layout.flex(justifyContent:space-between;alignItems:center)'],
                                            descStyles: {
                                                label: [
                                                    'text(size:s)',
                                                    Styles.stylesheet({
                                                        '.title-color': {
                                                            color: 'primary'
                                                        },
                                                        '.fail-color': {
                                                            color: 'hsl(0, 100%, 66.1%)'
                                                        }
                                                    })
                                                ]
                                            },
                                            components: [
                                                {
                                                    type: 'label',
                                                    cap: jaml.var('chart-left-info', (chartLeftInfo) => chartLeftInfo)
                                                },
                                                {
                                                    type: 'label',
                                                    cap: jaml.var('chart-right-info', (chartRightInfo) => chartRightInfo)
                                                }
                                            ]
                                        },
                                        {
                                            type: 'wrapper',
                                            styles: ['size.fullsize'],
                                            id: 'statisticsChartBar'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            buildIf: '{{isDisabled}}',
            styles: [
                //
                'flex(direction: column)',
                'margin(top:var(--gap))',
                'layout(overflow:hidden)',
                'flex(1)'
            ],
            components: [
                {
                    type: 'table',
                    ref: 'jkMiddleTable',
                    styles: ['flex(1)', Styles.tableStyles],
                    dataWatcher: 'jkMiddleData',
                    dataDef: [
                        {
                            cap: '地区',
                            key: 'regionName',
                            width: '10%',
                            sortable: false
                        },
                        {
                            cap: '应完成交互变电站数量',
                            key: 'shouldStNum'
                        },
                        {
                            cap: '已完成模型映射变电站数量',
                            key: 'finishStNum'
                        },
                        {
                            cap: '已接入量测中心变电站数量',
                            key: 'switchStNum'
                        },
                        {
                            cap: '已实现映射设备数量',
                            key: 'realizeDevNum'
                        },
                        {
                            cap: '映射黑名单中设备数量',
                            key: 'blacklistDevNum'
                        },
                        {
                            cap: '已消除黑名单中已处理设备数量',
                            key: 'dealBlacklistDevNum'
                        },
                        {
                            cap: '映射白名单中设备数量',
                            key: 'whitelistDevNum'
                        },
                        {
                            cap: '映射白名单中已处理设备数量',
                            key: 'dealWhitelistDevNum'
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            buildIf: '{{!isDisabled}}',
            styles: [
                //
                'flex(direction: column)',
                'margin(top:var(--gap))',
                'layout(overflow:hidden)',
                'flex(1)'
            ],
            components: [
                {
                    type: 'table',
                    ref: 'jkMiddleTable',
                    styles: ['flex(1)', Styles.tableStyles],
                    dataWatcher: 'jkMiddleData',
                    dataDef: [
                        {
                            cap: '地区',
                            key: 'regionName',
                            width: '10%',
                            sortable: false
                        },
                        {
                            cap: '电压等级',
                            key: 'bvName'
                        },
                        {
                            cap: '变电站',
                            key: 'stName'
                        },
                        {
                            cap: '设备类型',
                            key: 'devTypeName'
                        },
                        {
                            cap: '设备名称',
                            key: 'relationName'
                        },
                        {
                            cap: '是否映射中台',
                            key: 'isReaction'
                        }
                    ]
                },
                {
                    type: 'pagination',
                    styles: [
                        //
                        'size(minHeight:2.25rem)',
                        'margin(top:var(--gap-sm))',
                        'layout.flex(justifyContent:flex-start;alignItems:center;)'
                    ],
                    props: {
                        pageNo: '{{pageNumber}}',
                        total: '{{pojoTotalCount}}',
                        pageSize: '{{pageSize1}}',
                        hide: { total: false, pageSize: false, switch: false }
                    },
                    watchers: [
                        {
                            keys: ['pageNumber', 'pageSize1'],
                            callback(pageNumber, pageSize) {
                                if (isFirstSearch) {
                                    isFirstSearch = false;
                                } else {
                                    initTableData({ pageNumber: pageNumber || 1, pageSize: pageSize || 15 });
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ],
    vars: {
        regionId: null,
        sortIndex: 0,
        viewType: 1,
        isDisabled: true
    },
    watchers: [
        {
            key: 'regionId',
            callback: function () {
                initTableData();
            }
        },
        {
            key: 'bvId',
            callback: function () {
                initTableData();
            }
        },
        {
            key: 'isReaction',
            callback: function () {
                initTableData();
            }
        },
        {
            key: 'stId',
            callback: function () {
                initTableData();
            }
        },
        {
            key: 'devType',
            callback: function () {
                initTableData();
            }
        },
        {
            key: 'viewType',
            callback: function (value) {
                _model.vars.isDisabled = value == 2 ? false : true;
                _model.vars.isReaction = null;
                _model.vars.bvId = null;
                initTableData();
            }
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
        eChartsIns = null;
    },
    onafterrender: function () {
        getRegionList(_model, _msgr);
        getBvList(_model, _msgr);
        getSubstationList({ _model });
        getDevTypeConf(_model);
        _model.vars.regionId = userInfo.unicode || null;
        // getChartData();
    }
};

function initTableData(page) {
    const params = getTableParams(page);
    const tableUrl = _model.vars.isDisabled ? 'getRelationDevAreaNum' : 'getRelationDevAreaData';
    ajaxCall(tableUrl, {
        params,
        type: 'post',
        useMock: false,
        success(result) {
            let xData = [];
            let yData = [];
            let sum = 0;
            let data = [];
            if (_model.vars.isDisabled) {
                data = result;
                data.forEach((item) => {
                    xData.push(item.regionName || '');
                    yData.push(item.realizeDevNum || 0);
                    sum += item.realizeDevNum || 0;
                });
                initChart(xData, yData);
                _model['chart-left-info'] = `<div><span>已实现映射设备数量总数为</span><span class="title-color"> ${sum} </span>个`;
                const _data = addTotalRow(data);
                _msgr.pub('jkMiddleData', _data || []);
                _msgr.pub('chartData', data);
            } else {
                data = result.list;
                _msgr.pub('pojoTotalCount', result.pojoTotalCount);
                _msgr.pub('jkMiddleData', data || []);
            }
        }
    });
}

function getTableParams(page) {
    const regionId = _model.vars.regionId || undefined;
    const bvIdList = _model.vars.bvId ? [_model.vars.bvId] : undefined;
    const isReaction = _model.vars.isReaction;
    const stId = _model.vars.stId || undefined;
    const devType = _model.vars.devType || undefined;
    const { pageNumber = 1, pageSize = 20 } = page || {};
    return _model.vars.isDisabled ? { regionId } : { pageIndex: pageNumber, pageSize, regionId, bvIdList, isReaction, stId, devType };
}

function addTotalRow(data, excludeKeys = ['regionId', 'regionName']) {
    if (!Array.isArray(data) || data.length === 0) {
        return data;
    }
    const numericKeys = Object.keys(data[0]).filter((key) => !excludeKeys.includes(key));
    const totalRow = {
        regionId: null,
        regionName: '合计'
    };
    numericKeys.forEach((key) => {
        totalRow[key] = data.reduce((sum, item) => {
            item[key] = item[key] ? item[key] : 0;
            const value = item[key];
            return sum + (typeof value === 'number' && !isNaN(value) ? value : 0);
        }, 0);
    });
    return [...data, totalRow];
}

async function getDevTypeConf(_model) {
    return new Promise((resolve, reject) => {
        ajaxCall(
            'getDevTypeConf',
            {
                success(data) {
                    _model.vars.devTypeList = data;
                    resolve(data);
                },
                params: {},
                useMock: false,
                type: 'get'
            },
            false
        );
    });
}

function initChart(xData, yData) {
    if (eChartsIns) {
        eChartsIns.clear();
    }
    eChartsIns = echarts.init(document.querySelector('#statisticsChartBar'));
    eChartsIns.setOption(traceManagementOptions(xData, yData), true);
}
