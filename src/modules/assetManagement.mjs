import { ajaxCall, exportExcel, formatterJameTime } from '../common.js';
import { getRegionList } from '../utils/commonList.js';
import { urlConfig } from '../global.js';
import { createWindow } from '../components/createWindow.js';
import assetManagementWindow from '../components/modal/assetManagementWindow.js';
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
                            components: [
                                {
                                    type: 'buttongroup-radio',
                                    icon: 'earth-asia',
                                    cap: '区域选择',
                                    styles: [Styles.buttonGroupStylesWithBgCap, Styles.css({ width: 'auto' })],
                                    value: '{{regionId}}',
                                    data: '{{regionList}}'
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
                                        marginLeft: '.625rem'
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
                                    cap: '资产类型：',
                                    valueKey: 'type1',
                                    data: '{{assetTypeList}}'
                                },
                                {
                                    type: 'select',
                                    cap: '操作系统：',
                                    valueKey: 'os',
                                    data: '{{osList}}'
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
                                        exportExcel(urlConfig['exportPropertyData'].url, packageParams(), `资产管理_${moment().format('yyyyMMDDHHmmssSSS')}.xlsx`, 'post');
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
                            cap: 'IP地址A',
                            key: 'ip',
                            styles: [Styles.toShowAll],
                            sortable: false
                        },
                        {
                            cap: 'MAC地址A',
                            key: 'mac',
                            styles: [Styles.toShowAll],
                            sortable: false
                        },
                        {
                            cap: 'IP地址B',
                            key: 'ipB',
                            styles: [Styles.toShowAll],
                            sortable: false
                        },
                        {
                            cap: 'MAC地址B',
                            key: 'macB',
                            styles: [Styles.toShowAll],
                            sortable: false
                        },
                        {
                            cap: '设备名称',
                            key: 'deviceName',
                            styles: [Styles.toShowAll],
                            sortable: false
                        },
                        {
                            cap: '资产类型',
                            key: 'type1',
                            styles: [Styles.toShowAll],
                            sortable: false
                        },
                        {
                            cap: '操作类型',
                            key: 'os',
                            styles: [Styles.toShowAll],
                            sortable: false
                        },
                        {
                            cap: '设备型号',
                            styles: [Styles.toShowAll],
                            key: 'model',
                            sortable: false
                        },
                        {
                            cap: '生产厂家',
                            styles: [Styles.toShowAll],
                            key: 'manuFactor',
                            sortable: false
                        },
                        {
                            cap: '网络分区',
                            styles: [Styles.toShowAll],
                            key: 'netRegion',
                            sortable: false
                        },
                        {
                            cap: '物理位置',
                            styles: [Styles.toShowAll],
                            key: 'installPosition',
                            sortable: false
                        },
                        {
                            cap: '机柜名称',
                            styles: [Styles.toShowAll],
                            key: 'cabinetName',
                            sortable: false
                        },
                        {
                            cap: '数据来源',
                            key: 'source',
                            styles: [Styles.toShowAll],
                            sortable: false
                        },
                        {
                            cap: '在线状态',
                            styles: [Styles.toShowAll],
                            key: 'online',
                            sortable: false
                        },
                        {
                            cap: '端口',
                            sortable: false,
                            key: 'portList',
                            width: '4rem',
                            formatter: (value) => {
                                console.log(22222, value);
                                const portList = value || [];
                                return jame({
                                    type: 'label',
                                    cap: '查看',
                                    styles: ['color(var(--jam-color-primary-default))', 'css(cursor: pointer;text-underline-offset:.2rem;transition:all .2s ease-in-out; )', 'hover(textDecoration: underline;)'],
                                    onclick: () => {
                                        createWindow({
                                            title: '端口详情',
                                            width: '60vw',
                                            height: '20vw',
                                            body: assetManagementWindow(portList),
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
        regionId: null,
        type1: null,
        os: null,
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
        getPropertyCondition();
    }
};

function getPropertyCondition() {
    ajaxCall('getPropertyCondition', {
        uniqId: Math.random(),
        params: {
            property: 0
        },
        type: 'post',
        useMock: false,
        success(data) {
            _model.vars.assetTypeList = data || [];
        }
    });
    ajaxCall('getPropertyCondition', {
        uniqId: Math.random(),
        params: {
            property: 1
        },
        type: 'post',
        useMock: false,
        success(data) {
            _model.vars.osList = data || [];
        }
    });
}

function initTableData(page) {
    ajaxCall('getPropertyData', {
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
    const ip = _model.vars.ip || undefined;
    const mac = _model.vars.mac || undefined;
    const type1 = _model.vars.type1 || undefined;
    const os = _model.vars.os || undefined;
    const params = {
        regionId,
        ip,
        mac,
        type1,
        os
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
