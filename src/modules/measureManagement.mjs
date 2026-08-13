let _model,
    _msgr,
    pageIndex = 1,
    pageSize = 500;
import { ajaxCall, exportExcel } from '../common.js';
import { getRegionList } from '../utils/ajaxCache.js';
import { getSubstationList } from '../utils/commonList.js';
import { urlConfig } from '../global.js';
const tableNoList = [
    {
        value: 431,
        name: '遥信'
    },
    {
        value: 432,
        name: '遥测'
    },
    {
        value: 13401,
        name: '辅助遥信'
    },
    {
        value: 13402,
        name: '辅助遥测'
    },
    {
        value: 13406,
        name: '辅助遥信在线监测'
    },
    {
        value: 13407,
        name: '辅助遥测在线监测'
    }
];
export default {
    type: 'container',
    styles: [
        Styles.size.fullsize,
        Styles.css({
            display: 'flex',
            flexDirection: 'column',
            fontSize: 'm',
            minHeight: '0',
            paddingRight: '1rem'
        })
    ],
    components: [
        {
            type: 'container',
            class: 'top',
            styles: [
                Styles.css({
                    display: 'flex',
                    width: '100%',
                    flexWrap: 'wrap'
                })
            ],
            components: [
                {
                    type: 'container',
                    class: 'top-left',
                    styles: [
                        Styles.css({
                            display: 'flex',
                            height: 'initial',
                            gap: 's',
                            alignItems: 'flex-start',
                            width: '100%',
                            alignItems: 'flex-start',
                            marginBottom: '0.75rem'
                        })
                    ],
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '区域：',
                            valueKey: 'regionId',
                            dataWatcher: 'regionList',
                            styles: [
                                Styles.buttonGroupStylesWithBgCap,
                                Styles.css({
                                    padding: '0 0.3rem'
                                }),
                                Styles.buttongroup.labelslot.css({
                                    alignSelf: 'flex-start',
                                    fontSize: 'm',
                                    margin: 's'
                                })
                            ],
                            value: null
                        }
                    ]
                },
                {
                    type: 'filterSelect',
                    styles: ['size(maxWidth:19.5rem)', 'padding(top:0;bottom:0)'],
                    childStyles: ['size(minWidth:19.5rem)', 'input.agent.border(radius:s)', 'input.agent.css(height:1.8rem)', 'input.labelslot.margin(0)'],
                    valueKey: 'stId',
                    props: { cap: '变电站：', placeholder: '请选择', data: '{{stList}}', search: '{{stName}}', select: '{{stId}}', icon: 'transformer-bolt' },
                    watchers: {
                        stName(val) {
                            getSubstationList({ _model, devName: val });
                        }
                    }
                },
                {
                    type: 'select',
                    cap: '测点类型：',
                    data: tableNoList,
                    styles: [
                        Styles.select.regularStyle,
                        Styles.select.cap.css({
                            fontSize: 'm'
                        })
                    ],
                    icon: 'list',
                    valueKey: 'tableNo',
                    valueWatcher: 'tableNo'
                },
                {
                    type: 'input',
                    cap: '测点名称：',
                    styles: [
                        Styles.input.regularStyle,
                        Styles.input.cap.css({
                            fontSize: 'm'
                        })
                    ],
                    icon: 'mobile-button',
                    value: '{{name}}'
                },
                {
                    type: 'button',
                    cap: '查询',
                    icon: 'search',
                    class: 'jam-cta',
                    styles: [
                        Styles.searchBtnsStyles,
                        Styles.css({
                            height: '2rem',
                            marginTop: '0.1875rem'
                        })
                    ],
                    onclick() {
                        _model.vars.pageNo1 = 1;
                        pageIndex = 1;
                        getTableData();
                    }
                }
                // {
                //     type: 'button',
                //     cap: '导出',
                //     icon: 'file-export',
                //     class: 'jam-cta',
                //     styles: [
                //         Styles.searchBtnsStyles,
                //         Styles.css({
                //             height: '2rem',
                //             marginTop: '0.1875rem'
                //         })
                //     ],
                //     onclick() {
                //         exportTableData();
                //     }
                // }
            ]
        },
        {
            type: 'container',
            class: 'body',
            styles: [Styles.css({ minHeight: '0%', width: '100%', flexGrow: 1, display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', position: 'relative' })],
            components: [
                {
                    type: 'table',
                    styles: [
                        Styles.hover.toShowAll({ selector: '.hover' }),
                        Styles.tableStylesFixedRowGeight,
                        Styles.numberAlign,
                        Styles.css({
                            width: '100%',
                            height: 'calc(100% - 3rem)',
                            padding: 0,
                            margin: 's auto'
                        })
                    ],
                    dataDef: [
                        {
                            class: 'hover',
                            key: 'regionName',
                            cap: '地区',
                            sortable: false,
                            width: '10%'
                        },
                        {
                            class: 'hover',
                            key: 'stName',
                            cap: '厂站',
                            sortable: false,
                            width: '15%'
                        },
                        {
                            class: 'hover',
                            key: 'meaName',
                            cap: '测点名称',
                            sortable: false,
                            width: '30%'
                        },
                        {
                            class: 'hover',
                            key: 'meaValue',
                            cap: '值',
                            sortable: false,
                            width: '8%'
                        },
                        {
                            class: 'hover',
                            key: 'qual',
                            cap: '质量码',
                            sortable: false,
                            width: '18%'
                        },
                        {
                            key: 'uptTime',
                            cap: '更新时间',
                            sortable: false,
                            formatter: function (value) {
                                return jame({
                                    type: 'badge',
                                    styles: [Styles.badge.timeBadge],
                                    cap: value ? jam.formatTime(value, 'yyyy-MM-dd') : '',
                                    content: value ? jam.formatTime(value, 'HH:mm:ss') : ''
                                });
                            },
                            width: '12%'
                        },
                        {
                            key: 'chgTime',
                            cap: '变化时间',
                            sortable: false,
                            formatter: function (value) {
                                return jame({
                                    type: 'badge',
                                    styles: [Styles.badge.timeBadge],
                                    cap: value ? jam.formatTime(value, 'yyyy-MM-dd') : '',
                                    content: value ? jam.formatTime(value, 'HH:mm:ss') : ''
                                });
                            },
                            width: '12%'
                        }
                    ],
                    data: '{{tableData}}'
                },
                {
                    type: 'pagination',
                    styles: [
                        Styles.css({
                            width: '100%'
                        })
                    ],
                    props: {
                        pageNo: '{{pageNo1}}',
                        pageSize: '{{pageSize1}}',
                        pageSizeList: [
                            {
                                value: 500,
                                name: '500条/页'
                            },
                            {
                                value: 200,
                                name: '200条/页'
                            },
                            {
                                value: 100,
                                name: '100条/页'
                            }
                        ],
                        total: '{{total1}}',
                        hide: { total: false, pageSize: false, switch: false }
                    },
                    watchers: [
                        {
                            keys: ['pageSize1', 'pageNo1'],
                            callback: function (pageSize1, pageNo1) {
                                if (pageIndex === pageNo1 && pageSize === pageSize1) {
                                    return;
                                }
                                pageIndex = pageNo1;
                                pageSize = pageSize1;
                                getTableData();
                            }
                        }
                    ]
                },
                {
                    class: 'laoding',
                    showIf: '{{loading}}',
                    type: 'wrapper',
                    styles: [
                        Styles.css({
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'var(--jam-color-primary-film)',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            backdropFilter: 'blur(0.125rem)'
                        })
                    ],
                    components: [
                        {
                            type: 'label',
                            cap: '数据加载中...',
                            styles: [
                                Styles.css({
                                    fontSize: 'l'
                                })
                            ],
                            components: [
                                {
                                    type: 'label',
                                    slot: 'icon',
                                    styles: [
                                        Styles.css({
                                            position: 'relative',
                                            left: '-1rem'
                                        }),
                                        Styles.layer.spinner.comet({
                                            dropShadow: true,
                                            cometFrom: 180,
                                            cometLength: 90,
                                            tailColor: 'var(--jam-color-primary-subtle)',
                                            headColor: 'var(--jam-color-primary-default)',
                                            roundHead: true,
                                            roundTail: true,
                                            outer: 100,
                                            inner: 70,
                                            spin: 'reverse',
                                            easing: 'plateau',
                                            duration: 1000, // 改成毫秒
                                            animateLength: true,
                                            size: '3rem'
                                        })
                                    ]
                                }
                            ]
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
        let regionList = await getRegionList();
        let rt = jam.clone(regionList);
        rt.unshift({
            value: null,
            name: '全部'
        });
        _msgr.pub('tableNo', tableNoList?.[0]?.value || null);
        _msgr.pub('regionList', rt || []);
        getSubstationList({ _model });
        // _msgr.pub('pageSize1', 500); // 代替
        getTableData();
    }
};
function getTableData() {
    _model.vars.loading = true;
    let params = {
        regionId: _msgr.get('regionId') || null,
        stId: _msgr.get('stId') || null,
        tableNo: _msgr.get('tableNo') || null,
        name: _msgr.get('name') || null,
        pageIndex,
        pageSize
    };
    lime.log('params', params);
    ajaxCall('queryRealMea', {
        success(data) {
            _model.vars.total1 = data?.pojoTotalCount || 0;
            _msgr.pub('tableData', data?.list || []);
        },
        error(error) {
            console.log(error);
        },
        complete() {
            _model.vars.loading = false;
        },
        params,
        useMock: false,
        type: 'post'
    });
}
function exportTableData() {
    let params = {
        regionId: _msgr.get('regionId') || null,
        stId: _msgr.get('stId') || null,
        tableNo: _msgr.get('tableNo') || null,
        name: _msgr.get('name') || null
    };
    exportExcel(urlConfig.exportRealMea.url, params, '测点列表.xlsx', 'POST');
}
