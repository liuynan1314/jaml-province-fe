import { urlConfig } from '../global.js';
import { ajaxCall, exportExcel } from '../common.js';
// import { autoSyschartsOption } from '../components/chartConfig/autoSysOption.js';
import { autoSyschartsOption } from '../components/chartConfig/autoSysOption.js';
let _model, _msgr;

const dataDef = [
    [
        {
            cap: 'id',
            key: 'id',
            show: false
        },
        {
            cap: '地区',
            key: 'regionName',
            sortable: false
        },
        {
            cap: '开始时间',
            key: 'appName',
            sortable: false
        },
        {
            cap: '内容',
            key: 'status',
            sortable: false,
            width: '60%'
        },
        {
            cap: '异常类型',
            key: 'nodeName',
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
                'flex-direction': 'column',
                justifyContent: 'space-between',
                '.form-item': {
                    alignItems: 'center'
                }
            },
            '.chart-box': {
                display: 'flex',
                'flex-direction': 'column'
            },
            '.chart-pie': {
                width: '100%',
                height: 'calc(100% - 2.5rem)',
                'margin-top': '1.5rem'
            },
            '.table-box': {
                display: 'flex',
                'flex-direction': 'column'
            }
        }),
        Styles.layout.grid({ cols: 16, rows: 10, gap: `0.5rem` })
    ],
    components: [
        {
            type: 'wrapper',
            class: 'form-box',
            styles: [Styles.layout.gridpos(1, 1, 10, 2)],
            components: [
                {
                    type: 'wrapper',
                    class: 'form-item',
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '区域选择',
                            icon: 'earth-asia',
                            defaultValue: null,
                            valueKey: 'regionId',
                            dataWatcher: 'regionList',
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
                            cap: '电压等级',
                            icon: 'bolt',
                            defaultValue: null,
                            styles: [Styles.buttongroupWithCapInTop],
                            valueKey: 'bvId',
                            dataWatcher: 'bvList'
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'form-item',
                    buttonStyles: [Styles.searchBtnsStyles],
                    components: [
                        {
                            type: 'datepicker',
                            valueKey: 'beginTime',
                            cap: '开始时间',
                            styles: [Styles.datepicker.regularStyle]
                        },
                        {
                            type: 'datepicker',
                            valueKey: 'endTime',
                            cap: '结束时间',
                            styles: [Styles.datepicker.regularStyle]
                        },
                        {
                            type: 'filterSelect',
                            class: 'unifycap',
                            styles: [Styles.input.regularStyle],
                            props: { cap: '厂站', data: '{{stList}}', search: '{{name}}', select: '{{stId}}' },
                            watchers: {
                                async name(val) {
                                    if (val.length == 0) _msgr.pub('stId', '');
                                    getSubstationList(val);
                                }
                            }
                        },
                        {
                            type: 'button',
                            class: 'jam-cta',
                            icon: 'magnifying-glass',
                            cap: '查询',
                            onclick: function () {
                                getTableData();
                                getEchartsData();
                            }
                        },
                        {
                            type: 'button',
                            icon: 'file-export',
                            class: 'btn',
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
            styles: [Styles.layout.gridpos(11, 1, 6, 2)],
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
            styles: [Styles.layout.gridpos(1, 3, 16, 8)],
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
    },
    onafterrender: function () {
        _msgr.pub('chartTitle', '母线失压');
        getOverloadStaticsBvList();
        getSubstationList();
        getRegionList();
        getEchartsData();
        getTableData();
    }
};

function getOverloadStaticsBvList() {
    ajaxCall(
        'getOverloadStaticsBvList',
        {
            success(data) {
                const defaultBvList = [
                    {
                        name: '全部',
                        value: null
                    }
                ];
                const excludeBvList = [];
                const bvList = data
                    .filter((item) => !excludeBvList.includes(item.bvName))
                    .map((item) => {
                        return { name: item.bvName, value: item.bvId };
                    });

                _msgr.pub('bvList', [...defaultBvList, ...bvList]);
            },
            params: {},
            useMock: false,
            type: 'get'
        },
        false
    );
}

function getSubstationList(devName = '') {
    ajaxCall(
        'getSubstationList',
        {
            success(data) {
                _model.vars.stList = data?.map((item) => ({ name: item.devName, value: item.devId }));
            },
            params: {
                count: 100,
                devName: devName,
                devType: ['substation']
            },
            useMock: false,
            type: 'post',
            uniqId: `getSubstationList_${Math.random(1, 1000000)}`
        },
        false
    );
}

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
                        value: null
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
    let _regionId = _msgr.get('regionId') || [];
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
