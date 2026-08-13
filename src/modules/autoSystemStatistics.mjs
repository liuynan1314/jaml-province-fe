import { urlConfig, userInfo } from '../global.js';
import { ajaxCall, exportExcel } from '../common.js';
// import { autoSyschartsOption } from '../components/chartConfig/autoSysOption.js';
import { autoSyschartsOption } from '../components/chartConfig/autoSysOption.js';
import { disableRegionOptionByUnicode } from './equipmentEarlyWarningStatistics.mjs';
let uuid;
let _model, _msgr;
const curStatusMap = {
        1: { text: '启动', color: '#00FF00' },
        2: { text: '备机', color: '#3399FF' },
        3: { text: '主机', color: '#FF9900' },
        4: { text: '强制备机', color: '#9900FF' },
        5: { text: '强制主机', color: '#FF0000' },
        6: { text: '断网', color: '#FF6600' },
        7: { text: '故障', color: '#CC0000' },
        8: { text: '退出', color: '#666666' },
        9: { text: '系统启动', color: '#33CC33' },
        10: { text: '系统停止', color: '#CC0000' },
        11: { text: '节点离线', color: '#FF3333' },
        12: { text: '节点恢复', color: '#00CC66' },
        null: { color: '', text: '' }
    },
    activeFlagMap = {
        0: { color: '#999999', text: '离线' },
        1: { color: '#00cc00', text: '在线' },
        2: { color: '#ffcc00', text: '挂起' },
        5: { color: '#ffcc00', text: '故障' },
        null: { color: '', text: '' }
    };
const dataDef = [
    [
        {
            cap: 'id',
            key: 'id',
            show: false
        },
        {
            cap: '区域',
            key: 'regionName',
            sortable: false
        },
        {
            cap: '应用名',
            key: 'appName',
            sortable: false
        },
        {
            cap: '状态',
            key: 'status',
            sortable: false,
            formatter: (param) => {
                const cur = curStatusMap[param] || {};
                return `<div style="color:${cur['color']}">${cur['text']}</div>`;
            }
        },
        {
            cap: '主机节点',
            key: 'nodeName',
            sortable: false
        },
        {
            cap: '更新时间',
            key: 'updTime',
            sortable: false
        }
    ],
    [
        {
            cap: 'id',
            key: 'id',
            show: false
        },
        {
            cap: '区域',
            key: 'regionName',
            sortable: false
        },
        {
            cap: '节点名',
            key: 'nodeName',
            sortable: false
        },
        {
            cap: '应用名',
            key: 'appName',
            sortable: false
        },
        {
            cap: '进程名',
            key: 'bobName',
            sortable: false
        },
        {
            cap: '状态',
            key: 'status',
            sortable: false,
            formatter: (param) => {
                const act = activeFlagMap[param] || {};
                return `<div style="color:${act['color']}">${act['text']}</div>`;
            }
        },
        {
            cap: '更新时间',
            key: 'updTime',
            sortable: false
        }
    ]
];
export default {
    type: 'wrapper',
    class: 'power-outage-statistics',
    styles: [
        'size.fullsize',
        Styles.stylesheet({
            ':scope': {
                padding: 'm',
                'box-sizing': 'border-box'
            },
            '.form-box': {
                display: 'flex',
                'flex-direction': 'column'
            },
            '.chart-box': {
                display: 'flex',
                'flex-direction': 'column',
                justifyContent: 'space-around'
            },
            '.chart-pie': {
                width: '100%',
                height: 'calc(100% - 2.5rem)',
                'margin-top': '1.5rem'
            },
            '.table-box': {
                display: 'flex',
                'flex-direction': 'column'
            },
            '.btn': {
                minWidth: '5rem',
                marginTop: '0.23rem !important'
            }
        }),
        Styles.layout.grid({ cols: 16, rows: 10, gap: `0.5rem` })
    ],
    components: [
        {
            type: 'wrapper',
            class: 'form-box',
            styles: [Styles.layout.gridpos(1, 1, 10, 3)],
            components: [
                {
                    type: 'wrapper',
                    class: 'form-item',
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '区域选择',
                            icon: 'earth-asia',
                            value: '{{regionId}}',
                            dataWatcher: 'regionList',
                            onafterrender: function () {
                                if (userInfo.unicode) {
                                    const buttonggroupEle = this.cmpt.element;
                                    disableRegionOptionByUnicode(userInfo.unicode, buttonggroupEle);
                                }
                            },
                            styles: [Styles.buttongroupWithCapInTop, Styles.size.fullwidth]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    childStyles: ['margin(right:0.5rem)'],
                    switchStyles: ['input.text(size:0.58rem)'],
                    class: 'form-item',
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '管控类型',
                            defaultValue: 1,
                            styles: [Styles.buttongroupWithCapInTop],
                            data: [
                                {
                                    name: '关键应用',
                                    value: 1
                                },
                                {
                                    name: '关键进程',
                                    value: 2
                                }
                            ],
                            onvaluechange: function (value) {
                                _msgr.pub('table_type', value);
                                _msgr.pub('change_type', true);
                            }
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'form-item',
                    childStyles: ['margin(right:0.5rem;bottom:1rem;)'],
                    buttonStyles: [Styles.searchBtnsStyles],
                    components: [
                        {
                            type: 'datepicker',
                            valueKey: 'beginTime',
                            defaultValue: moment().format('YYYY-MM-DD'),
                            cap: '开始时间',
                            styles: [Styles.datepicker.regularStyle]
                        },
                        {
                            type: 'datepicker',
                            valueKey: 'endTime',
                            defaultValue: moment().format('YYYY-MM-DD'),
                            cap: '结束时间',
                            styles: [Styles.datepicker.regularStyle]
                        },
                        {
                            type: 'button',
                            icon: 'magnifying-glass',
                            class: 'btn jam-cta',
                            cap: '查询',
                            onclick: function () {
                                getTableData();
                                getEchartsData();
                            }
                        },
                        {
                            type: 'button',
                            class: 'btn export-btn',
                            icon: 'file-export',
                            cap: '导出',
                            onclick: function () {
                                exportAutoSysData();
                            }
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'chart-box',
            styles: [Styles.layout.gridpos(11, 1, 6, 3)],
            components: [
                {
                    type: 'label',
                    class: 'title',
                    cap: '{{chartTitle}}',
                    styles: [Styles.titleLabel]
                },
                {
                    type: 'wrapper',
                    class: 'chart-pie',
                    components: []
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'table-box',
            styles: [Styles.layout.gridpos(1, 4, 16, 7)],
            components: [
                {
                    type: 'table',
                    id: 'autoSysTable',
                    styles: [Styles.table.regularStyle, Styles.table.showrownum({ style: 'plain' }), Styles.size({ width: '100%', height: 'calc(100% - 1rem)' })],
                    dataWatcher: 'autoSysTableData',
                    dataDef: dataDef[0]
                },
                {
                    type: 'pager',
                    props: {
                        pageSizeList: [
                            {
                                value: '100',
                                name: '100条/页'
                            },
                            {
                                value: '50',
                                name: '50条/页'
                            },
                            {
                                value: '10',
                                name: '10条/页'
                            }
                        ],
                        total: 'auto_sys_total',
                        messageKey: 'autoSys_pager_total'
                    },
                    watchers: [
                        {
                            key: 'autoSys_pager_total',
                            callback: function (page) {
                                if (page?.firstFetch) return;
                                _msgr.pub('_page', page);
                                getTableData();
                                getEchartsData();
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
        _model.regionId = userInfo.unicode || null;
    },
    onafterrender: function () {
        _msgr.pub('chartTitle', '关键应用统计');
        getRegionList();
        getEchartsData();
        getTableData();
    }
};

function getTableData() {
    let _params = getParams() || {};
    const _type = _msgr.get('table_type') || 1;
    const pageIndex = _msgr.get('_page') ? _msgr.get('_page').pageNumber : 1;
    const pageSize = _msgr.get('_page') ? _msgr.get('_page').pageSize : 100;
    _params.pageIndex = pageIndex;
    _params.pageSize = pageSize;
    ajaxCall(
        'getAutoSysTableData',
        {
            success(data) {
                const tableDom = document.getElementById('autoSysTable');
                if (_msgr.get('change_type')) {
                    _msgr.pub('change_type', false);
                    tableDom.dataDef = dataDef[_type - 1];
                }
                _msgr.pub('autoSysTableData', data.list);
                _msgr.pub('auto_sys_total', data?.pojoTotalCount);
            },
            params: _params,
            useMock: false,
            type: 'post'
        },
        false
    );
}

async function getRegionList() {
    ajaxCall(
        'getRegionList',
        {
            success(data) {
                const defaultRegion = [
                    {
                        name: '全部',
                        value: ''
                    }
                ];
                const regionList = data.map((item) => {
                    return { name: item.regionNameChn, value: item.regionId };
                });
                _msgr.pub('regionList', [...defaultRegion, ...regionList]);
            },
            params: {},
            useMock: false,
            type: 'get'
        },
        false
    );
}

function getEchartsData() {
    let _params = getParams() || {};
    const _type = _msgr.get('table_type') || 1;
    ajaxCall(
        'getAutoSysChartData',
        {
            success(data) {
                if (_type == 1) {
                    _msgr.pub('chartTitle', '关键应用统计');
                } else {
                    _msgr.pub('chartTitle', '关键进程统计');
                }
                const eCharts = echarts.init(document.querySelector('.chart-pie'));
                eCharts.setOption(autoSyschartsOption(data));
            },
            params: _params,
            useMock: false,
            type: 'post'
        },
        false
    );
}

function exportAutoSysData() {
    let _params = getParams() || {};
    exportExcel(
        urlConfig.exportAutoSysChartData.url,
        {
            ...getParams()
        },
        '自动化系统统计.xlsx',
        'POST'
    );
    ajaxCall(
        'exportAutoSysChartData',
        {
            success(data) {},
            params: _params,
            useMock: false,
            type: 'post'
        },
        false
    );
}

function getParams() {
    let _regionId = _model.regionId || [];
    if (!Array.isArray(_regionId)) {
        _regionId = [_regionId];
    }
    return {
        startTime: _msgr.get('beginTime') + ' 00:00:00',
        endTime: _msgr.get('endTime') + ' 23:59:59',
        regionId: _regionId,
        type: _msgr.get('table_type') || 1
    };
}
