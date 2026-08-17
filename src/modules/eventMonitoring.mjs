import { ajaxCall, exportExcel, formatterJameTime } from '../common.js';
import { getRegionList } from '../utils/commonList.js';
import { urlConfig } from '../global.js';
let _model, _msgr, eChartsIns;
const pagerKey = jam.genUUID();

export default {
    type: 'wrapper',
    styles: ['css(--gap:var(--jam-space-m))', 'padding(var(--gap))', 'flex(direction: column)', 'with.elevation', 'padding(bottom:0)', 'layout(overflow:hidden auto)', 'size.fullsize'],
    components: [
        {
            type: 'wrapper',
            components: [
                {
                    type: 'wrapper',
                    styles: ['flex(flex:1;direction:column;)'],
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
                            selectStyles: [Styles.select.regularStyle],
                            inputStyles: [Styles.input.regularStyle],
                            components: [
                                {
                                    type: 'input',
                                    cap: '终端名称：',
                                    valueKey: 'termName'
                                },
                                {
                                    type: 'select',
                                    cap: '查杀方式：',
                                    valueKey: 'finder',
                                    data: '{{finderTypeList}}'
                                },
                                { type: 'datepicker', value: '{{beginDate}}', max: '{{endDate}}', icon: 'calendar', cap: '查询时间：' },
                                { type: 'datepicker', value: '{{endDate}}', min: '{{beginDate}}', cap: '-' },
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
                                        exportExcel(urlConfig['exportSpiteEventData'].url, packageParams(), `事件监测_${moment().format('yyyyMMDDHHmmssSSS')}.xlsx`, 'post');
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
                    dataWatcher: 'eventMonitoringData',
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
                            cap: '查杀时间',
                            key: 'time',
                            sortable: false,
                            formatter: formatterJameTime
                        },
                        {
                            cap: '终端',
                            styles: [Styles.toShowAll],
                            key: 'memo',
                            sortable: false
                        },
                        {
                            cap: 'IP',
                            styles: [Styles.toShowAll],
                            key: 'ip',
                            sortable: false
                        },
                        {
                            cap: '恶意代码名称',
                            key: 'virusName',
                            sortable: false
                        },
                        {
                            cap: '感染文件',
                            key: 'path',
                            styles: [Styles.toShowAll],
                            sortable: false
                        },
                        {
                            cap: 'MD5',
                            styles: [Styles.toShowAll],
                            key: 'fileMd5',
                            sortable: false
                        },
                        {
                            cap: '相关进程',
                            styles: [Styles.toShowAll],
                            key: 'processInfo',
                            sortable: false
                        },
                        {
                            cap: '查杀方式',
                            styles: [Styles.toShowAll],
                            key: 'finderName',
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
        finder: null,
        page: {
            pageIndex: 1,
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
        eChartsIns = null;
    },
    onunmount: function () {},
    onafterrender: function () {
        getRegionList(_model, _msgr);
        initTableData();
        getEventKillWayCondition();
    }
};

function getEventKillWayCondition() {
    ajaxCall('getEventKillWayCondition', {
        uniqId: Math.random(),
        params: {
            spite: 0
        },
        type: 'post',
        useMock: false,
        success(data) {
            _model.vars.finderTypeList = data || [];
        }
    });
}

function initTableData(page) {
    ajaxCall('getSpiteEventData', {
        params: { ...getPagerParams(page), ...packageParams() },
        type: 'post',
        useMock: false,
        success(data) {
            _msgr.pub('eventMonitoringData', data.list || []);
            _msgr.pub(pagerKey + '_total', data.pojoTotalCount);
        }
    });
}

function packageParams() {
    const regionId = _model.vars.regionId || undefined;
    const termName = _model.vars.termName || undefined;
    const finderList = _model.vars.finder ? [_model.vars.finder] : [];
    const params = {
        termName,
        finderList,
        regionId,
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
