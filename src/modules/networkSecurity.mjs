import { ajaxCall, exportExcel, formatterJameTime } from '../common.js';
import { getRegionList } from '../utils/commonList.js';
import { urlConfig } from '../global.js';
import { createWindow } from '../components/createWindow.js';
import networkSecurityWindow from '../components/modal/networkSecurityWindow.js';
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
                            type: 'wrapper',
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
                                    type: 'buttongroup-radio',
                                    cap: '事件等级',
                                    styles: [Styles.buttonGroupStylesWithBgCap, Styles.css({ marginLeft: 'm' })],
                                    value: '{{eventLevel}}',
                                    data: '{{warnLevelList}}'
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
                            selectStyles: [Styles.select.regularStyle],
                            inputStyles: [Styles.input.regularStyle],
                            components: [
                                {
                                    type: 'select',
                                    class: 'form_item',
                                    cap: '设备类型：',
                                    defaultValue: '',
                                    valueKey: 'devType',
                                    data: '{{devTypeList}}'
                                },
                                { type: 'datepicker', value: '{{beginDate}}', max: '{{endDate}}', icon: 'calendar', cap: '查询时间：' },
                                { type: 'datepicker', value: '{{endDate}}', min: '{{beginDate}}', cap: '-' },
                                {
                                    type: 'input',
                                    cap: '检索：',
                                    value: '{{keyword}}'
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
                                        exportExcel(urlConfig['exportNetSafetyData'].url, packageParams(), `网安事件_${moment().format('yyyyMMDDHHmmssSSS')}.xlsx`, 'post');
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
                    dataWatcher: 'networkSecurityData',
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
                            cap: '设备或系统',
                            key: 'deviceSystem',
                            styles: [Styles.toShowAll],
                            sortable: false
                        },
                        {
                            cap: '设备名称',
                            key: 'devName',
                            align: 'left',
                            styles: [Styles.toShowAll],
                            sortable: false
                        },
                        {
                            cap: '事件级别',
                            key: 'levelName',
                            sortable: false
                        },
                        {
                            cap: '重复次数',
                            key: 'updateCount',
                            sortable: false
                        },
                        {
                            cap: '发生时间',
                            key: 'collectTime',
                            sortable: false,
                            width: '10%',
                            formatter: formatterJameTime
                        },
                        {
                            cap: '更新时间',
                            key: 'updateTime',
                            sortable: false,
                            width: '10%',
                            formatter: formatterJameTime
                        },
                        {
                            cap: '设备类型',
                            key: 'devType',
                            sortable: false
                        },
                        {
                            cap: '事件类型',
                            key: 'eveTypeName',
                            sortable: false
                        },
                        {
                            cap: '事件子类型',
                            styles: [Styles.toShowAll],
                            key: 'eveSubTypeName',
                            sortable: false
                        },
                        {
                            cap: '告警来源',
                            key: 'type',
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
                        },
                        {
                            cap: '明细',
                            sortable: false,
                            width: '4rem',
                            formatter: (uuid) => {
                                return jame({
                                    type: 'label',
                                    cap: '详情',
                                    styles: ['color(var(--jam-color-primary-default))', 'css(cursor: pointer;text-underline-offset:.2rem;transition:all .2s ease-in-out; )', 'hover(textDecoration: underline;)'],
                                    onclick: (e) => {
                                        let target;
                                        if (e.target.classList.contains('jam-td')) {
                                            target = e.target;
                                        } else {
                                            target = jam.findParent(e.target, '.jam-td');
                                        }
                                        if (!target) return;
                                        const row = target.jamtd.rowIdx;

                                        const _tableData = _msgr.get('networkSecurityData') || [];
                                        const _rowData = _tableData[row] || {};
                                        console.log(_rowData);
                                        createWindow({
                                            title: '详情',
                                            width: '60vw',
                                            height: '20vw',
                                            body: networkSecurityWindow(_rowData),
                                            showBtn: false
                                        });
                                    }
                                });
                            }
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
        eventLevel: null,
        devTypeList: [],
        keyword: '',
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
    },
    onunmount: function () {},
    onafterrender: function () {
        getRegionList(_model, _msgr);
        initTableData();
        getNetSafetyCondition();
    }
};

function getNetSafetyCondition() {
    ajaxCall('getNetSafetyCondition', {
        uniqId: Math.random(),
        params: {
            netSafety: 0
        },
        type: 'post',
        useMock: false,
        success(data) {
            _model.vars.devTypeList = data || [];
        }
    });
    ajaxCall('getNetSafetyCondition', {
        uniqId: Math.random(),
        params: {
            netSafety: 1
        },
        type: 'post',
        useMock: false,
        success(data) {
            data.sort((a, b) => b.value - a.value);
            _model.vars.warnLevelList = [
                {
                    name: '全部',
                    value: null
                },
                ...data
            ];
        }
    });
}

function initTableData(page) {
    ajaxCall('getNetSafetyData', {
        params: { ...getPagerParams(page), ...packageParams() },
        type: 'post',
        useMock: false,
        success(data) {
            _msgr.pub('networkSecurityData', data.list || []);
            _msgr.pub(pagerKey + '_total', data.pojoTotalCount);
        }
    });
}

function packageParams() {
    const regionId = _model.vars.regionId || undefined;
    const act = _model.vars.devType || undefined;
    const keyword = _model.vars.keyword || undefined;
    const levelList = _model.vars.eventLevel ? [_model.vars.eventLevel] : [];
    const params = {
        levelList,
        regionId,
        act,
        keyword,
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
