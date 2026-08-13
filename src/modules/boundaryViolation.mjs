import { hslaToJamAc, COLOR_SET } from '../utils/Constants.js';
import { ajaxCall, exportExcel, formatterJameTime } from '../common.js';
import { getRegionList } from '../utils/commonList.js';
import { urlConfig } from '../global.js';
import { createWindow } from '../components/createWindow.js';
import networkSecurityWindow from '../components/modal/networkSecurityWindow.js';
let _model, _msgr, eChartsIns;
const pagerKey = jam.genUUID();

export default {
    type: 'wrapper',
    styles: ['css(--gap:.75rem)', 'padding(var(--gap))', 'flex(direction: column)', `background(color:${COLOR_SET.modulebgclr})`, 'padding(bottom:0)', 'layout(overflow:hidden auto)', 'size.fullsize'],
    components: [
        {
            type: 'wrapper',
            components: [
                {
                    type: 'wrapper',
                    styles: ['flex(flex:1;direction:column;)'],
                    components: [
                        {
                            type: 'wrapper',
                            styles: [
                                'layout.flex(alignItems:self-end;justifyContent:flex-start)',
                                Styles.stylesheet({
                                    ':scope': {},
                                    '.ml-_625rem': {
                                        marginLeft: '.625rem',
                                        marginBottom: '.125rem'
                                    }
                                })
                            ],
                            datepickerStyles: [Styles.datepicker.regularStyle],
                            selectStyles: [Styles.select.regularStyle],
                            components: [
                                {
                                    type: 'buttongroup-radio',
                                    cap: '区域选择',
                                    icon: 'earth-asia',
                                    styles: [Styles.buttonGroupStylesWithBgCap, Styles.css({ width: 'auto' })],
                                    value: '{{regionId}}',
                                    data: '{{regionList}}'
                                },
                                {
                                    type: 'select',
                                    class: 'ml-_625rem',
                                    cap: '预警级别：',
                                    value: '{{warnLevel}}',
                                    data: '{{warnLevelList}}'
                                },
                                { type: 'datepicker', class: 'ml-_625rem', value: '{{beginDate}}', max: '{{endDate}}', icon: 'calendar', cap: '查询时间：' },
                                { type: 'datepicker', class: 'ml-_625rem', value: '{{endDate}}', min: '{{beginDate}}', cap: '-' }
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
                                        marginLeft: '.625rem'
                                    }
                                })
                            ],
                            buttonStyles: [Styles.searchBtnsStyles],
                            selectStyles: [Styles.select.regularStyle],
                            inputStyles: [Styles.input.regularStyle],
                            components: [
                                {
                                    type: 'input',
                                    cap: 'IP地址：',
                                    valueKey: 'ip'
                                },
                                {
                                    type: 'input',
                                    cap: 'MAC地址：',
                                    valueKey: 'mac'
                                },
                                {
                                    type: 'select',
                                    cap: '置牌状态：：',
                                    defaultValue: null,
                                    valueKey: 'placingCards',
                                    data: [
                                        { name: '已置牌', value: 1 },
                                        { name: '未置牌', value: 0 }
                                    ]
                                },
                                {
                                    type: 'select',
                                    cap: '处理状态：',
                                    defaultValue: null,
                                    valueKey: 'handleStatus',
                                    data: [
                                        { name: '已处理', value: 1 },
                                        { name: '未处理', value: 0 }
                                    ]
                                },
                                {
                                    type: 'select',
                                    cap: '预警类型：',
                                    valueKey: 'warnType',
                                    data: '{{warnTypeList}}'
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
                                        exportExcel(urlConfig['exportBoundaryData'].url, packageParams(), `边界违规_${moment().format('yyyyMMDDHHmmssSSS')}.xlsx`, 'post');
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            styles: [
                //
                'flex(direction: column)',
                'margin(top:var(--gap))',
                'layout(overflow:hidden)',
                'flex(1)'
            ],
            // table-wrapper
            components: [
                {
                    type: 'table',
                    styles: [
                        //
                        'flex(1)',
                        Styles.tableStyles
                    ],
                    dataWatcher: 'boundaryData',
                    dataDef: [
                        {
                            key: 'keyIdStr',
                            show: false
                        },
                        {
                            cap: '地区',
                            key: 'regionName',
                            sortable: false
                        },
                        {
                            cap: 'IP地址',
                            styles: [Styles.toShowAll],
                            key: 'ip',
                            sortable: false
                        },
                        {
                            cap: 'MAC地址',
                            styles: [Styles.toShowAll],
                            key: 'mac',
                            sortable: false
                        },
                        {
                            cap: '设备名称',
                            styles: [Styles.toShowAll],
                            key: 'devName',
                            sortable: false
                        },
                        {
                            cap: '类型',
                            styles: [Styles.toShowAll],
                            key: 'type',
                            sortable: false
                        },
                        {
                            cap: '级别',
                            key: 'levelName',
                            sortable: false
                        },
                        {
                            cap: '次数',
                            key: 'times',
                            sortable: false
                        },
                        {
                            cap: '首次告警时间',
                            key: 'firstTime',
                            sortable: false,
                            formatter: formatterJameTime
                        },
                        {
                            cap: '最后更新时间',
                            key: 'updateTime',
                            sortable: false,
                            formatter: formatterJameTime
                        },
                        {
                            cap: '来源',
                            styles: [Styles.toShowAll],
                            key: 'source',
                            sortable: false
                        },
                        {
                            cap: '描述',
                            key: 'descr',
                            styles: [Styles.toShowAll],
                            sortable: false
                        },
                        {
                            cap: '置牌状态',
                            key: 'placingCardsName',
                            sortable: false
                        },
                        {
                            cap: '处理状态',
                            key: 'handleStatusName',
                            sortable: false
                        }
                    ]
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
        beginDate: moment().format('yyyy-MM-DD'),
        endDate: moment().format('yyyy-MM-DD'),
        regionId: null,
        warnLevel: null,
        page: {
            pageNumber: 1,
            pageSize: 15
        }
    },
    watchers: [
        {
            key: pagerKey,
            callback: function (page) {
                page.firstFetch ? null : initTableData(page);
            }
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onunmount: function () {},
    onafterrender: function () {
        getRegionList(_model, _msgr);
        initTableData();
        getBoundaryCondition();
    }
};

function getBoundaryCondition() {
    ajaxCall('getBoundaryCondition', {
        uniqId: Math.random(),
        params: {
            boundary: 0
        },
        type: 'post',
        useMock: false,
        success(data) {
            _model.vars.warnTypeList = data || [];
        }
    });
    ajaxCall('getBoundaryCondition', {
        uniqId: Math.random(),
        params: {
            boundary: 1
        },
        type: 'post',
        useMock: false,
        success(data) {
            data.sort((a, b) => b.value - a.value);
            _model.vars.warnLevelList = data || [];
        }
    });
}

function initTableData(page) {
    ajaxCall('getBoundaryData', {
        params: { ...getPagerParams(page), ...packageParams() },
        type: 'post',
        useMock: false,
        success(data) {
            _msgr.pub('boundaryData', data.list || []);
            _msgr.pub(pagerKey + '_total', data.pojoTotalCount);
        }
    });
}

function packageParams() {
    const regionId = _model.vars.regionId || undefined;
    const ip = _model.vars.ip?.trim() || '';
    const mac = _model.vars.mac?.trim() || '';
    const placingCards = _model.vars.placingCards || undefined;
    const handleStatus = _model.vars.handleStatus || undefined;
    const type = _model.vars.warnType || undefined;
    const levelList = _model.vars.warnLevel ? [_model.vars.warnLevel] : [];
    const params = {
        levelList,
        regionId,
        ip,
        mac,
        placingCards,
        handleStatus,
        type,
        startTime: _model.vars.beginDate ? _model.vars.beginDate + ' 00:00:00' : undefined,
        endTime: _model.vars.endDate ? _model.vars.endDate + ' 23:59:59' : undefined
    };

    return params;
}
function getPagerParams(page) {
    if (page) {
        _model.vars.page = page;
    } else {
        _model.vars.page.pageNumber = 1;
    }
    const { pageNumber, pageSize } = _model.vars.page || {};
    return { pageIndex: pageNumber, pageSize };
}
