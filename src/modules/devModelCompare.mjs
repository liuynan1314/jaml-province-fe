import devModelCompareCreate from '../components/devModelCompare/devModelCompareCreate.js';
import devModelCompareDetail from '../components/devModelCompare/devModelCompareDetail.js';
import { createWindow } from '../components/createWindow.js';
import { getDcRegionList, getJkDevInfoByRetrieval, setStlist, getDevTypeList, setDevlist } from '../utils/ajaxCache.js';
import { ajaxCall } from '../common.js';
let _model,
    _msgr,
    pageIndex = 1,
    pageSize = 20,
    loadingFlag,
    devCacheList = [];
const valueStates = {
    good: `value>=0.99`,
    failed: `value<0.99`
};
const dataDef = [
    {
        key: 'summonTime',
        cap: '召唤时间',
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
        cap: '区域',
        sortable: false,
        width: '10%',
        class: 'hover',
        formatter: function (value) {
            return value || '--';
        }
    },
    {
        key: 'devTypeName',
        cap: '设备类型',
        sortable: false,
        width: '10%',
        class: 'hover'
    },
    {
        key: 'stNameList',
        cap: '变电站',
        sortable: false,
        width: '10%',
        class: 'hover'
    },
    {
        key: 'fields',
        cap: '召唤域',
        sortable: false,
        width: '10%',
        class: 'hover'
    },
    {
        type: 'progress',
        key: 'consistentRate',
        cap: '一致率',
        sortable: false,
        styles: [Styles.progress.agent.css({ cursor: 'pointer' }), 'background.stripy', 'color.stateMap(good:lightgreen;failed:red)'],
        valueStates,
        width: '10%'
    },
    {
        key: 'provinceModelCnt',
        cap: '总数量(省｜市｜不一致)',
        sortable: false,
        width: '18%',
        class: 'hover',
        formatter: function (value) {
            const row = this.jamtd.rowIdx;
            const rowData = _msgr.get('tableData')[row] || {};
            return jame({
                type: 'label',
                cap: rowData.provinceModelCnt + ' | ' + rowData.regionModelCnt + ' | ' + rowData.inconsistentCnt
            });
        }
    },
    {
        key: 'provinceLack',
        cap: '缺失数量(省｜市)',
        sortable: false,
        width: '12%',
        class: 'hover',
        formatter: function (value) {
            const row = this.jamtd.rowIdx;
            const rowData = _msgr.get('tableData')[row] || {};
            return jame({
                type: 'label',
                cap: rowData.provinceLack + ' | ' + rowData.regionLack
            });
        }
    },
    {
        key: 'status',
        cap: '召唤状态',
        sortable: false,
        width: '10%',
        class: 'hover',
        menu: {
            0: '召唤中',
            1: '召唤成功',
            2: '召唤失败'
        }
    }
];
function queryCheckRecord() {
    const params = {
        pageIndex,
        pageSize,
        startTime: _msgr.get('startTime') + ' 00:00:00',
        endTime: _msgr.get('endTime') + ' 23:59:59',
        devType: _msgr.get('devType') ? [_msgr.get('devType')] : [],
        regionId: _msgr.get('regionId') ? [_msgr.get('regionId')] : [],
        stId: _msgr.get('stId')
    };
    loadStart();
    ajaxCall('queryCheckRecord', {
        success(data) {
            _msgr.pub('total1', data?.pojoTotalCount || 0);
            _msgr.pub('tableData', data?.list || []);
        },
        error(error) {
            console.log(error);
        },
        type: 'post',
        params,
        complete() {
            loadEnd();
        }
    });
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
export default {
    type: 'container',
    styles: [
        Styles.size.fullsize,
        Styles.css({
            display: 'flex',
            flexDirection: 'column',
            fontSize: 'm',
            minHeight: '0',
            marginRight: 'm'
        })
    ],
    components: [
        {
            type: 'container',
            class: 'head',
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
            components: [
                {
                    type: 'datepicker',
                    defaultValue: Date.now() - 86400000,
                    valueKey: 'startTime',
                    styles: [Styles.connectLine]
                },
                {
                    type: 'datepicker',
                    defaultValue: Date.now(),
                    valueKey: 'endTime'
                },
                {
                    type: 'select',
                    value: '{{regionId}}',
                    placeholder: '-请选择区域-',
                    dataWatcher: 'regionList'
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
                    type: 'filterSelect',
                    props: {
                        data: '{{devList}}',
                        search: '{{devName}}',
                        select: '{{devType}}',
                        placeholder: '-请选择设备类型-'
                    },
                    childStyles: [Styles.input.regularInput],
                    watchers: [
                        {
                            key: 'devName',
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
                    type: 'button',
                    cap: '查询',
                    icon: 'search',
                    class: 'jam-cta',
                    styles: [
                        Styles.searchBtnsStyles,
                        Styles.css({
                            marginLeft: 's'
                        })
                    ],
                    onclick() {
                        pageIndex = 1;
                        _model.ref('pagination').props.pageNo = 1;
                        _msgr.pub('pageNo1', 1); // 只做这个处理props.pageNo还是老值
                        queryCheckRecord();
                    }
                },
                {
                    type: 'button',
                    cap: '召唤模型',
                    styles: [
                        Styles.css({
                            position: 'absolute',
                            right: '0'
                        })
                    ],
                    onclick() {
                        const obj = devModelCompareCreate();
                        const modal = createWindow({
                            title: `召唤设备模型`,
                            width: '33rem',
                            height: '26.5rem',
                            body: obj.body,
                            onCancel() {
                                obj.onunmount();
                            },
                            showBtn: false
                        });
                        mango.pub('openCard', modal);
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
                        Styles.table.clickhighlight,
                        Styles.tableStylesFixedRowGeight,
                        Styles.css({
                            width: '100%',
                            height: 'calc(100% - 2.5rem)',
                            cursor: 'pointer'
                        })
                    ],
                    dataDef,
                    dataWatcher: 'tableData',
                    onclick: function (e) {
                        let target = jam.closest(e.target, '.jam-td');
                        if (target) {
                            const row = target.jamtd.rowIdx;
                            const rowData = _msgr.get('tableData')[row];
                            const body = devModelCompareDetail(rowData.id);
                            createWindow({
                                title: `设备模型校验详情`,
                                width: '95vw',
                                height: '85vh',
                                body,
                                showBtn: false
                            });
                        }
                    }
                },
                {
                    ref: 'pagination',
                    type: 'pagination',
                    styles: [
                        Styles.css({
                            marginTop: 'm',
                            width: '100%'
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
                                queryCheckRecord();
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
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: async function () {
        let regionList = await getDcRegionList();
        let devList = await getDevTypeList();
        devList = setDevlist(devList);
        devCacheList = devList;
        _msgr.pub('regionList', regionList || []);
        _msgr.pub('devList', devList || []);
        initStList();
        queryCheckRecord();
    }
};
