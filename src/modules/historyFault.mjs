import { urlConfig, userInfo } from '../global.js';
import { ajaxCall, exportExcel } from '../common.js';
import { autoSyschartsOption } from '../components/chartConfig/autoSysOption.js';
import dateRangePicker from './registerCards/dateRange/dateRangePicker.mjs';
import searchBtns from './registerCards/buttons/searchBtns.mjs';
import { disableRegionOptionByUnicode } from './equipmentEarlyWarningStatistics.mjs';

let _model, _msgr;

const dataDef = [
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
        key: 'occurTime',
        sortable: false
    },
    {
        cap: '异常类型',
        key: 'dataType',
        sortable: false,
        menu: {
            1: '应用节点',
            2: '关键进程',
            3: '数据库中断',
            4: '服务器磁盘越限'
        }
    },
    {
        cap: '内容',
        key: 'content',
        sortable: false,
        width: '40%',
        styles: [Styles.toShowAll],
        align: 'left'
    }
];

export default {
    type: 'wrapper',
    styles: [
        'padding(bottom:0)',
        'size.fullsize',
        Styles.css({
            display: 'flex',
            flexDirection: 'column',
            gap: 's'
        })
    ],
    components: [
        {
            type: 'wrapper',
            styles: [
                Styles.css({
                    display: 'flex'
                })
            ],
            components: [
                {
                    type: 'wrapper',
                    styles: ['flex(flex:1;direction:column;gap:s)'],
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
                            styles: [Styles.buttonGroupStylesWithBgCap, Styles.size.fullwidth]
                        },
                        {
                            type: 'buttongroup-radio',
                            cap: '异常类型',
                            styles: [Styles.buttonGroupStylesWithBgCap],
                            value: '{{table_type}}',
                            data: [
                                {
                                    name: '全部',
                                    value: null
                                },
                                {
                                    name: '应用节点',
                                    value: 1
                                },
                                {
                                    name: '关键进程',
                                    value: 2
                                },
                                {
                                    name: '数据库中断',
                                    value: 3
                                },
                                {
                                    name: '服务器磁盘越限',
                                    value: 4
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
                            components: [
                                dateRangePicker,
                                {
                                    type: 'input',
                                    styles: [
                                        'props(marginLeft:2rem;)',
                                        Styles.input.regularStyleDiff,
                                        Styles.input.agent.css({
                                            borderColor: 'var(--jam-color-primary-subtle)' 
                                        })
                                    ],
                                    cap: '内容：',
                                    defaultValue: '',
                                    valueKey: '_content'
                                },
                                {
                                    type: 'button',
                                    icon: 'search',
                                    class: 'jam-cta',
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
                                        exportHistoryFaultData();
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    styles: [
                        'css(width:40%)',
                        Styles.css({
                            display: 'flex',
                            flexDirection: 'column'
                        })
                    ],
                    components: [
                        {
                            type: 'label',
                            cap: '{{chartTitle}}',
                            styles: [
                                Styles.stylesheet({
                                    '[slot=cap]': {
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
                        },
                        {
                            type: 'wrapper',
                            class: 'chart-pie',
                            components: [],
                            styles: ['css(width:100%;height:100%)']
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            styles: ['flex(direction: column)', 'margin(top:0rem)', 'layout(overflow:hidden)', 'flex(1)'],
            components: [
                {
                    type: 'tableWithPage',
                    styles: [
                        'tableWithPage.basic',
                        Styles.hover.toShowAll({ selector: '.hover' }),
                        Styles.tableStylesFixedRowGeight,
                        Styles.numberAlign,
                        Styles.css({
                            width: '100%',
                            height: 'calc(100% - 3rem)',
                            padding: 0,
                            margin: 's auto'
                        }),
                        Styles.stylesheet({
                            '.underline': {
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }
                        })
                    ],
                    dataWatcher: 'historyFaultTableData',
                    dataDef: dataDef,
                    props: {
                        cpageHide: {
                            pageSize: false
                        },
                        pageSizeList: [
                            { value: 100, name: '100条/页' },
                            { value: 50, name: '50条/页' },
                            { value: 10, name: '10条/页' }
                        ]
                    },
                    watchers: []
                }
            ]
        }
    ],
    vars: {
        cpageSize: 100,
        ctotal: 0,
        cpageNo: 1,
        regionId: null,
        beginDate: moment().format('yyyy-MM-DD'),
        endDate: moment().format('yyyy-MM-DD'),
        table_type: null
    },
    watchers: [
        {
            keys: ['cpageNo', 'cpageSize'],
            debounce: 400,
            callback(cpageNo, cpageSize) {
                _model.vars.cpageNo = cpageNo;
                _model.vars.cpageSize = cpageSize;
                getTableData();
            }
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
        _model.regionId = userInfo.unicode || null;
    },
    onafterrender: function () {
        _msgr.pub('chartTitle', '运行指标异常统计');
        getRegionList();
        getEchartsData();
    }
};

function getTableData() {
    let _params = getParams() || {};
    _params.pageIndex = _model.vars.cpageNo;
    _params.pageSize = _model.vars.cpageSize;
    ajaxCall(
        'querySystemRunDetail',
        {
            success(data) {
                console.log('data', data);
                _msgr.pub('historyFaultTableData', data.list);
                _model.vars.ctotal = data?.pojoTotalCount;
            },
            params: _params,
            useMock: true,
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
    delete _params.regionId;
    ajaxCall(
        'querySystemRunDetailStatistics',
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

function exportHistoryFaultData() {
    let _params = getParams() || {};
    _params.pageIndex = 1;
    _params.pageSize = 999999999;
    exportExcel(
        urlConfig.exportSystemRunDetail.url,
        {
            ...getParams()
        },
        '历史故障.xlsx',
        'POST'
    );
    ajaxCall(
        'exportSystemRunDetail',
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
    let regionId = _model.vars.regionId;
    if (regionId === '' || regionId === null || regionId === undefined) {
        regionId = undefined;
    }
    const dataType = _msgr.get('table_type') || undefined;
    return {
        beginDate: _model.vars.beginDate ? _model.vars.beginDate + ' 00:00:00' : undefined,
        endDate: _model.vars.endDate ? _model.vars.endDate + ' 23:59:59' : undefined,
        regionId,
        dataType: _model.vars.table_type || undefined,
        content: _msgr.get('_content') || ''
    };
}
