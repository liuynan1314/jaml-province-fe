import { ajaxCall } from '../common.js';
import { getDcRegionList, getJkDevInfoByRetrieval, setStlist } from '../utils/ajaxCache.js';
const window = (row) => {
    let _model,
        _msgr,
        pageIndex = 1,
        pageSize = 20,
        loadingFlag;
    const dataTypeList = [
        {
            value: 1,
            name: '遥信'
        },
        {
            value: 2,
            name: '遥测'
        }
    ];
    const compareList = [
        {
            value: '0',
            name: '量测一致'
        },
        {
            value: '1',
            name: '省级量测缺失'
        },
        {
            value: '2',
            name: '地市量测缺失'
        },
        {
            value: '3',
            name: '量测不一致'
        }
    ];
    const dataDef = [
        {
            key: 'dataType',
            cap: '数据类型',
            sortable: false,
            width: '8rem',
            class: 'hover',
            formatter: function (value) {
                return getDataTypeName(value) || '--';
            }
        },
        {
            key: 'sampleTime',
            cap: '采样时间',
            sortable: false,
            width: '12rem',
            formatter: function (value) {
                if (!value) return '--';
                let date = jam.formatTime(value, 'yyyy-MM-dd');
                let time = jam.formatTime(value, 'HH:mm:ss');
                return jame({
                    type: 'badge',
                    styles: [Styles.badge.timeBadge],
                    cap: date,
                    content: time
                });
            }
        },
        {
            key: 'regionName',
            cap: '地区',
            sortable: false,
            width: '8rem',
            class: 'hover',
            formatter: function (value) {
                return value || '--';
            }
        },
        {
            key: 'diffType',
            cap: '比较结果',
            sortable: false,
            width: '8rem',
            class: 'hover',
            formatter: function (value) {
                return getCompareName(value) || '--';
            }
        },
        {
            key: 'meaId',
            cap: '量测ID',
            sortable: false,
            width: '10%',
            class: 'hover',
            formatter: function (value) {
                return value || '--';
            }
        },
        {
            key: 'stNameProvince',
            cap: '厂站名称(省｜市)',
            sortable: false,
            width: '10%',
            class: 'hover',
            formatter: function (value) {
                const row = this.jamtd.rowIdx;
                const rowData = _msgr.get('tableData')[row] || {};
                if (rowData.stNameProvince !== rowData.stNameRegion) {
                    Styles.css({
                        backgroundColor: 'hsl(0,45%, 30%)'
                    }).applyTo(this);
                }
                return jame({
                    type: 'label',
                    cap: rowData.stNameProvince + ' | ' + rowData.stNameRegion
                });
            }
        },
        {
            key: 'meaNameProvince',
            cap: '量测名称(省｜市)',
            sortable: false,
            width: '10%',
            class: 'hover',
            formatter: function (value) {
                const row = this.jamtd.rowIdx;
                const rowData = _msgr.get('tableData')[row] || {};
                if (rowData.meaNameProvince !== rowData.meaNameRegion) {
                    Styles.css({
                        backgroundColor: 'hsl(0,45%, 30%)'
                    }).applyTo(this);
                }
                return jame({
                    type: 'label',
                    cap: rowData.meaNameProvince + ' | ' + rowData.meaNameRegion
                });
            }
        },
        {
            key: 'devIdProvince',
            cap: '设备ID(省｜市)',
            sortable: false,
            width: '10%',
            class: 'hover',
            formatter: function (value) {
                const row = this.jamtd.rowIdx;
                const rowData = _msgr.get('tableData')[row] || {};
                if (rowData.devIdProvince !== rowData.devIdRegion) {
                    Styles.css({
                        backgroundColor: 'hsl(0,45%, 30%)'
                    }).applyTo(this);
                }
                return jame({
                    type: 'label',
                    cap: rowData.devIdProvince + ' | ' + rowData.devIdRegion
                });
            }
        },
        {
            key: 'devPsrIdProvince',
            cap: '设备中台ID(省｜市)',
            sortable: false,
            width: '10%',
            class: 'hover',
            formatter: function (value) {
                const row = this.jamtd.rowIdx;
                const rowData = _msgr.get('tableData')[row] || {};
                if (rowData.devPsrIdProvince !== rowData.devPsrIdRegion) {
                    Styles.css({
                        backgroundColor: 'hsl(0,45%, 30%)'
                    }).applyTo(this);
                }
                return jame({
                    type: 'label',
                    cap: rowData.devPsrIdProvince + ' | ' + rowData.devPsrIdRegion
                });
            }
        },
        {
            key: 'stPsrIdProvince',
            cap: '厂站中台ID(省｜市)',
            sortable: false,
            width: '10%',
            class: 'hover',
            formatter: function (value) {
                const row = this.jamtd.rowIdx;
                const rowData = _msgr.get('tableData')[row] || {};
                if (rowData.stPsrIdProvince !== rowData.stPsrIdRegion) {
                    Styles.css({
                        backgroundColor: 'hsl(0,45%, 30%)'
                    }).applyTo(this);
                }
                return jame({
                    type: 'label',
                    cap: rowData.stPsrIdProvince + ' | ' + rowData.stPsrIdRegion
                });
            }
        },
        {
            key: 'valueTypeProvince',
            cap: '测点类型(省｜市)',
            sortable: false,
            width: '10%',
            class: 'hover',
            formatter: function (value) {
                const row = this.jamtd.rowIdx;
                const rowData = _msgr.get('tableData')[row] || {};
                if (rowData.valueTypeProvince !== rowData.valueTypeRegion) {
                    Styles.css({
                        backgroundColor: 'hsl(0,45%, 30%)'
                    }).applyTo(this);
                }
                return jame({
                    type: 'label',
                    cap: rowData.valueTypeProvince + ' | ' + rowData.valueTypeRegion
                });
            }
        }
    ];
    const dynamicRow = ['meaId', 'stNameProvince', 'meaNameProvince', 'devIdProvince', 'devPsrIdProvince', 'stPsrIdProvince', 'valueTypeProvince'];
    const defaultRow = ['stNameProvince', 'meaNameProvince', 'devIdProvince', 'devPsrIdProvince', 'stPsrIdProvince', 'valueTypeProvince'];
    function getDef(key) {
        let rt = null;
        for (let item of dataDef) {
            if (item.key === key) {
                rt = item;
                break;
            }
        }
        return rt;
    }
    function getDataTypeName(val) {
        let rt = null;
        for (let item of dataTypeList) {
            if (item.value == val) {
                rt = item.name;
                break;
            }
        }
        return rt;
    }
    function getCompareName(val) {
        let rt = null;
        for (let item of compareList) {
            if (item.value == val) {
                rt = item.name;
                break;
            }
        }
        return rt;
    }
    function queryMeaCompareDetail() {
        const params = {
            pageIndex,
            pageSize,
            sampleDate: jam.formatTime(_msgr.get('sampleDate'), 'yyyy-MM-dd HH:mm:ss'),
            dataType: _msgr.get('dataType'),
            regionId: _msgr.get('regionId'),
            diffType: _msgr.get('diffType') ? [_msgr.get('diffType')] : [],
            stName: _msgr.get('stName') ? (_msgr.get('stName') === '-请选择厂站-' ? null : _msgr.get('stName')) : null,
            meaName: _msgr.get('meaName'),
            meaId: _msgr.get('meaId'),
            devId: _msgr.get('devId'),
            stPsrId: _msgr.get('stPsrId'),
            devPsrId: _msgr.get('devPsrId'),
            valueType: _msgr.get('valueType')
        };
        loadStart();
        ajaxCall('queryMeaCompareDetail', {
            success(data) {
                _msgr.pub('total1', data?.pojoTotalCount || 0);
                _msgr.pub('tableData', data?.list || []);
            },
            error(error) {
                console.log(error);
            },
            params,
            useMock: false,
            type: 'post',
            complete() {
                loadEnd();
            }
        });
    }
    function refreshDataDef(dom, list) {
        let newDataDef = dataDef.slice(0, 4);
        let dymDefs = jam.cloneDeep(dynamicRow);
        dymDefs = dymDefs.filter((item) => {
            return list.includes(item);
        });
        for (let item of dymDefs || []) {
            let def = getDef(item);
            if (def) {
                newDataDef.push(def);
            }
        }
        dom.dataDef = newDataDef;
        queryMeaCompareDetail();
    }
    function loadStart() {
        _msgr.pub('loading', true);
        loadingFlag = true;
        setTimeout(() => {
            if (loadingFlag) {
                loadingFlag = false;
            } else {
                _msgr.pub('loading', false);
            }
        }, 600);
    }
    function loadEnd() {
        if (loadingFlag) {
            loadingFlag = false;
        } else {
            _msgr.pub('loading', false);
        }
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
                        height: 'initial',
                        width: '100%',
                        gap: 'xs',
                        alignItems: 'center',
                        paddingBottom: 's',
                        flexWrap: 'wrap'
                    })
                ],
                datepickerStyles: [Styles.datepicker.regularDatepicker],
                selectStyles: [Styles.select.regularSelect],
                inputStyles: [Styles.input.regularInput],
                buttonStyles: [Styles.button.regularButton],
                buttongroupStyles: [Styles.buttonGroupStyles],
                components: [
                    {
                        type: 'datepicker',
                        value: '{{sampleDate}}'
                    },
                    {
                        type: 'select',
                        valueKey: 'dataType',
                        valueWatcher: 'dataType',
                        placeholder: '-请选择量测类型-',
                        data: dataTypeList
                    },
                    {
                        type: 'select',
                        valueKey: 'regionId',
                        valueWatcher: 'regionId',
                        placeholder: '-请选择区域-',
                        dataWatcher: 'regionList'
                    },
                    {
                        type: 'select',
                        valueKey: 'diffType',
                        placeholder: '-请选择比较结果-',
                        data: compareList
                    },
                    {
                        type: 'filterSelect',
                        props: {
                            data: '{{stList}}',
                            search: '{{stName}}',
                            select: '{{stId}}',
                            placeholder: '-请选择厂站-'
                        },
                        childStyles: [Styles.input.regularInput],
                        watchers: {
                            stName: jam.makeDebounce(async function (val) {
                                initStList(val);
                            }, 500)
                        }
                    },
                    {
                        type: 'input',
                        valueKey: 'meaName',
                        placeholder: '-请输入量测名称-'
                    },
                    {
                        showIf: '{{showMoreFilter}}',
                        type: 'input',
                        valueKey: 'meaId',
                        placeholder: '-请输入量测ID-'
                    },
                    {
                        showIf: '{{showMoreFilter}}',
                        type: 'input',
                        valueKey: 'devId',
                        placeholder: '-请输入设备ID-'
                    },
                    {
                        showIf: '{{showMoreFilter}}',
                        type: 'input',
                        valueKey: 'devPsrId',
                        placeholder: '-请输入设备中台ID-'
                    },
                    {
                        showIf: '{{showMoreFilter}}',
                        type: 'input',
                        valueKey: 'stPsrId',
                        placeholder: '-请输入厂站中台ID-'
                    },
                    {
                        showIf: '{{showMoreFilter}}',
                        type: 'input',
                        valueKey: 'valueType',
                        placeholder: '-请输入测点类型-'
                    },
                    {
                        cap: '表格展示列：',
                        showIf: '{{showMoreFilter}}',
                        type: 'buttongroup-checkbox',
                        data: [
                            {
                                value: 'meaId',
                                name: '量测ID'
                            },
                            {
                                value: 'stNameProvince',
                                name: '厂站名称(省｜市)'
                            },
                            {
                                value: 'meaNameProvince',
                                name: '量测名称(省｜市)'
                            },
                            {
                                value: 'devIdProvince',
                                name: '设备ID(省｜市)'
                            },
                            {
                                value: 'devPsrIdProvince',
                                name: '设备中台ID(省｜市)'
                            },
                            {
                                value: 'stPsrIdProvince',
                                name: '厂站中台ID(省｜市)'
                            },
                            {
                                value: 'valueTypeProvince',
                                name: '测点类型(省｜市)'
                            }
                        ],
                        value: '{{rowFilter}}',
                        defaultValue: defaultRow
                    },
                    {
                        type: 'button',
                        cap: jaml.var('showMoreFilter', (val) => {
                            return val ? '收起更多' : '更多过滤';
                        }),
                        styles: [
                            Styles.css({
                                marginLeft: 's'
                            })
                        ],
                        onclick() {
                            const value = _msgr.get('showMoreFilter');
                            _msgr.pub('showMoreFilter', !value);
                        },
                        onafterrender() {
                            this.element.cap = '更多过滤';
                        }
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
                            queryMeaCompareDetail();
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
                        flexDirection: 'column',
                        position: 'relative'
                    })
                ],
                components: [
                    {
                        type: 'table',
                        styles: [
                            Styles.hover.toShowAll({
                                selector: '.hover'
                            }),
                            Styles.tableStylesFixedRowGeight,
                            Styles.css({
                                width: '100%',
                                height: 'calc(100% - 2.5rem)'
                            })
                        ],
                        dataDef: [],
                        dataWatcher: 'tableData',
                        watchers: [
                            {
                                key: 'rowFilter',
                                callback(list) {
                                    refreshDataDef(this, list);
                                }
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
                                    queryMeaCompareDetail();
                                }
                            }
                        ]
                    },
                    {
                        type: 'loading',
                        styles: ['loading.basic', 'size(width:100% !important;height:100% !important)'],
                        props: {
                            isLoading: '{{loading}}'
                        }
                    }
                ]
            }
        ],
        vars: { pageNo1: 1, pageSize1: 20 },
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
            const params = row;
            if (params?.dataType) {
                _msgr.pub('dataType', params.dataType);
            }
            if (params?.sampleTime) {
                _msgr.pub('sampleDate', new Date(params.sampleTime).getTime());
            } else {
                _msgr.pub('sampleDate', Date.now() - 86400000);
            }
            if (params?.dataType) {
                _msgr.pub('regionId', params.regionId);
            }
            if (params?.diffType) {
                _msgr.pub('diffType', params.diffType);
            }
        },
        onafterrender: async function () {
            let regionList = await getDcRegionList();
            _msgr.pub('regionList', regionList || []);
            // _msgr.pub('showMoreFilter', false);
            initStList();
            queryMeaCompareDetail();
        }
    };
};

export default window;
