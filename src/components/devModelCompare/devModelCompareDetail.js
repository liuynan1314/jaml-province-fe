import { ajaxCall } from '../../common.js';
import { getDcRegionList, getJkDevInfoByRetrieval, setStlist, getDevTypeList, setDevlist } from '../../utils/ajaxCache.js';
const diffTypeList = [
    {
        value: 0,
        name: '一致'
    },
    {
        value: 1,
        name: '省级缺失'
    },
    {
        value: 2,
        name: '地市缺失'
    },
    {
        value: 3,
        name: '模型不一致'
    }
];
function getDiffTypeName(id) {
    let rt = null;
    for (let item of diffTypeList) {
        if (item.value == id) {
            rt = item.name;
            break;
        }
    }
    return rt;
}
const window = (recordId) => {
    let _model,
        _msgr,
        pageIndex = 1,
        pageSize = 20,
        devCacheList = [];
    const dataDef = [
        {
            key: 'regionName',
            cap: '区域',
            sortable: false,
            width: '10rem',
            class: 'hover',
            formatter: function (value) {
                return value || '--';
            }
        },
        {
            key: 'diffType',
            cap: '差异类型',
            width: '10rem',
            class: 'hover',
            formatter: function (value) {
                return getDiffTypeName(value) || '--';
            }
        },
        {
            key: 'devTypeChn',
            cap: '设备类型',
            sortable: false,
            width: '10rem',
            class: 'hover',
            formatter: function (value) {
                return value || '--';
            }
        },
        {
            key: 'stName',
            cap: '变电站',
            sortable: false,
            width: '10rem',
            class: 'hover',
            formatter: function (value) {
                return value || '--';
            }
        }
    ];
    function getTableData() {
        let params = {
            recordId,
            regionId: _msgr.get('regionId'),
            stId: _msgr.get('stId') ? [_msgr.get('stId')] : null,
            diffType: _msgr.get('diffType'),
            devName: _msgr.get('devName'),
            devType: _msgr.get('devType'),
            pageIndex,
            pageSize
        };
        ajaxCall('queryCheckDetail', {
            success(data) {
                if (data?.list?.length > 0) {
                    initDataDef(data?.list?.[0].columnDetail);
                }
                jam.afterNextRepaint(() => {
                    jam.afterNextRepaint(() => {
                        _msgr.pub('total1', data?.pojoTotalCount || 0);
                        _msgr.pub('tableData', data?.list || []);
                    });
                });
            },
            error(error) {
                console.log(error);
            },
            type: 'post',
            params
        });
    }
    function initDataDef(columnDetail) {
        if (columnDetail?.length > 5) {
            Styles.css({
                width: columnDetail.length * 15 + 40 + 'rem'
            }).applyTo(_model.ref('table'));
        }
        let rt = jam.cloneDeep(dataDef);
        for (let item of columnDetail) {
            rt.push({
                key: item.columnName,
                cap: item.columnNameChn + '(省｜市)',
                sortable: false,
                width: '15rem',
                class: 'hover',
                formatter: function (value) {
                    let rt = '--';
                    let td = this.jamtd;
                    let key = td?.optionGroup?.key;
                    if (td && key) {
                        const row = td.rowIdx;
                        const rowData = _msgr.get('tableData')[row];
                        let value_province = '--';
                        let value_region = '--';
                        let diffType = null;
                        for (let item of rowData?.columnDetail || []) {
                            if (item.columnName === key) {
                                value_province = item.province;
                                value_region = item.region;
                                diffType = item.diffType;
                                break;
                            }
                        }
                        if (diffType !== '0') {
                            Styles.css({
                                backgroundColor: 'hsl(0,45%, 30%)'
                            }).applyTo(this);
                        }
                        rt = jame({
                            type: 'label',
                            styles: [
                                Styles.css({
                                    maxWidth: '100%'
                                }),
                                Styles.label.cap.css({
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                })
                            ],
                            cap: value_province + ' | ' + value_region
                        });
                    }
                    return rt;
                }
            });
        }
        _msgr.pub('dataDef', rt);
    }
    async function initStList(val) {
        let stList = await getJkDevInfoByRetrieval({
            devName: val
        });
        stList = setStlist(stList);
        stList.unshift({
            name: '-请选择厂站-',
            value: null
        });
        _msgr.pub('stList', stList);
    }
    return {
        type: 'container',
        styles: [
            Styles.size.fullsize,
            Styles.css({
                display: 'flex',
                flexDirection: 'column',
                fontSize: 'm',
                minHeight: '0'
            })
        ],
        components: [
            {
                type: 'container',
                class: 'top',
                styles: [
                    Styles.css({
                        display: 'flex',
                        // width: '100%',
                        gap: 'xs',
                        alignItems: 'center',
                        paddingBottom: 's',
                        flexWrap: 'wrap'
                    })
                ],
                datepickerStyles: [Styles.datepicker.regularDatepicker],
                selectStyles: [Styles.select.regularSelect],
                buttonStyles: [Styles.searchBtnsStyles],
                components: [
                    {
                        type: 'select',
                        value: '{{regionId}}',
                        placeholder: '-请选择区域-',
                        dataWatcher: 'regionList'
                    },
                    {
                        type: 'filterSelect',
                        childStyles: [Styles.input.regularInput],
                        props: {
                            cap: '',
                            data: '{{stList}}',
                            search: '{{stName}}',
                            select: '{{stId}}',
                            placeholder: '-请选择厂站-'
                        },
                        watchers: [
                            {
                                key: 'stName',
                                callback: jam.makeDebounce(async function (val) {
                                    initStList(val);
                                }, 500)
                            }
                        ]
                    },
                    {
                        type: 'filterSelect',
                        childStyles: [Styles.input.regularInput],
                        props: {
                            cap: '',
                            data: '{{devList}}',
                            search: '{{devTypeName}}',
                            select: '{{devType}}',
                            placeholder: '-请选择设备类型-'
                        },
                        watchers: [
                            {
                                key: 'devTypeName',
                                callback: jam.makeDebounce(async function (val) {
                                    let rt = jam.cloneDeep(devCacheList);
                                    rt = rt.filter((item) => {
                                        return item?.name?.includes(val);
                                    });
                                    rt.unshift({
                                        name: '-请选择设备类型-',
                                        value: null
                                    });
                                    _model.vars.devList = rt;
                                }, 500)
                            }
                        ]
                    },
                    {
                        type: 'input',
                        placeholder: '-请输入设备名称-',
                        value: '{{devName}}',
                        styles: [Styles.input.regularInput]
                    },
                    {
                        type: 'select',
                        value: '{{diffType}}',
                        placeholder: '-请选择差异类型-',
                        data: diffTypeList
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
                                marginLeft: 's'
                            })
                        ],
                        onclick() {
                            pageIndex = 1;
                            _model.ref('pagination').props.pageNo = 1;
                            _msgr.pub('pageNo1', 1); // 只做这个处理props.pageNo还是老值
                            getTableData();
                        }
                    }
                ]
            },
            {
                type: 'container',
                class: 'body',
                styles: [
                    Styles.css({
                        minHeight: '0%',
                        width: '100%',
                        flexGrow: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignContent: 'flex-start'
                    })
                ],
                components: [
                    {
                        type: 'wrapper',
                        styles: [
                            Styles.css({
                                width: '100%',
                                height: 'calc(100% - 2.5rem)',
                                flexShrink: 0,
                                overflowX: 'auto'
                            })
                        ],
                        components: [
                            {
                                ref: 'table',
                                type: 'table',
                                styles: [
                                    Styles.table.clickhighlight,
                                    Styles.hover.toShowAll({
                                        selector: '.hover'
                                    }),
                                    Styles.tableStylesFixedRowGeight,
                                    Styles.css({
                                        width: '100%',
                                        height: '100%',
                                        flexShrink: 0
                                    })
                                ],
                                dataDef: jaml.var('dataDef', (dataDef) => {
                                    return dataDef;
                                }),
                                dataWatcher: 'tableData'
                            }
                        ]
                    },
                    {
                        ref: 'pagination',
                        type: 'pagination',
                        styles: [
                            Styles.css({
                                width: '100%',
                                marginTop: 'm'
                            })
                        ],
                        props: {
                            pageNo: '{{pageNo1}}',
                            pageSize: '{{pageSize1}}',
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
                    }
                ]
            }
        ],
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
        },
        onafterrender: async function () {
            let regionList = await getDcRegionList();
            let devList = await getDevTypeList();
            _msgr.pub('regionList', regionList || []);
            devList = setDevlist(devList);
            _msgr.pub('devList', devList || []);
            devCacheList = devList;
            initStList();
            getTableData();
        }
    };
};

export default window;
