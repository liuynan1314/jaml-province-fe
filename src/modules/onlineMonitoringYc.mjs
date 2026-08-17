let _model, _msgr;
import { ajaxCall } from '../common.js';
import { getRegionList } from '../utils/ajaxCache.js';
import { getSubstationList } from '../utils/commonList.js';
const pagerKey = jam.genUUID();
let _pageSize = 15;

export default {
    type: 'container',
    styles: [
        Styles.size.fullsize,
        Styles.stylesheet({
            ':scope': {
                display: 'flex',
                flexDirection: 'column',
                fontSize: 'm',
                minHeight: '0',
                paddingRight: 'm'
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            class: 'form-box',
            styles: [
                Styles.css({
                    display: 'flex',
                    width: '100%',
                    flexWrap: 'wrap'
                })
            ],
            components: [
                {
                    type: 'wrapper',
                    class: 'top-left',
                    styles: [
                        Styles.css({
                            display: 'flex',
                            height: 'initial',
                            gap: 's',
                            alignItems: 'flex-start',
                            width: '100%',
                            alignItems: 'flex-start',
                            marginBottom: 'm'
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
                                    padding: '0 s'
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
                    cap: '遥测子类型：',
                    styles: [
                        Styles.select.regularStyle,
                        Styles.select.cap.css({
                            fontSize: 'm'
                        })
                    ],
                    icon: 'list',
                    valueKey: 'subType',
                    dataWatcher: 'subTypeList'
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
                        getTableData();
                    }
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'table-box',
            styles: [Styles.css({ height: 'calc(100% - 8rem)', width: '100%', display: 'flex', flexDirection: 'column', alignContent: 'flex-start', position: 'relative' })],
            components: [
                {
                    type: 'table',
                    class: 'data-table',
                    ref: 'pageTable',
                    styles: [
                        Styles.hover.toShowAll({ selector: '.hover' }),
                        Styles.tableStylesFixedRowGeight,
                        Styles.numberAlign,
                        Styles.css({
                            width: '100%',
                            height: '100%',
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
                            cap: '变电站',
                            sortable: false,
                            width: '20%'
                        },
                        {
                            key: 'ycName',
                            class: 'hover',
                            cap: '名称',
                            sortable: false,
                            width: '30%'
                        },
                        {
                            class: 'hover',
                            key: 'ycSubTypeName',
                            cap: '遥测子类型',
                            sortable: false,
                            width: '15%'
                        },
                        {
                            class: 'hover',
                            key: 'ycValue',
                            cap: '遥测值',
                            sortable: true,
                            width: '10%',
                            formatter: function (value) {
                                return value ? Number(value).toFixed(2) : null;
                            }
                        },
                        {
                            class: 'hover',
                            key: 'updTime',
                            cap: '更新时间',
                            sortable: true,
                            width: '15%',
                            formatter: function (value) {
                                return jame({
                                    type: 'badge',
                                    styles: [Styles.badge.timeBadge],
                                    cap: value ? jam.formatTime(value, 'yyyy-MM-dd') : '',
                                    content: value ? jam.formatTime(value, 'HH:mm:ss') : ''
                                });
                            }
                        }
                    ],
                    data: '{{tableData}}'
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
                                            duration: 1,
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
    watchers: [
        {
            key: pagerKey,
            callback: function (page) {
                this.ref('pageTable').startRow = (Number(page.pageNumber) - 1) * Number(page.pageSize) + 1;
                _pageSize = page.pageSize;
                page.firstFetch ? null : getTableData(page);
            }
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        getRegionData();
        getSubstationList({ _model });
        getSubTypeData();
        getTableData();
    }
};

function getSubTypeData() {
    ajaxCall(
        'getMenuInfo_EventType',
        {
            success(data) {
                const typeList = data.map((item) => {
                    return {
                        name: item.displayValue,
                        value: item.actualValue
                    };
                });

                typeList.unshift({
                    value: null,
                    name: '全部'
                });

                _msgr.pub('subTypeList', typeList);
            },
            params: {
                menu: '辅助遥测-监测'
            },
            useMock: false
        },
        false
    );
}

async function getRegionData() {
    let regionList = await getRegionList();
    let rt = jam.clone(regionList);
    rt.unshift({
        value: null,
        name: '全部'
    });
    _msgr.pub('regionList', rt || []);
}

function getTableData(page) {
    const { pageNumber = 1, pageSize = _pageSize } = page || {};
    _model.vars.loading = true;
    const [regionId, stId, subType] = ['regionId', 'stId', 'subType'].map((key) => _msgr.get(key));

    const params = {
        pageIndex: pageNumber,
        pageSize,
        regionId: regionId ? [regionId] : undefined,
        stId: stId ? [stId] : undefined,
        subType: subType ? [subType] : undefined
    };

    lime.log('params', params);
    ajaxCall('getAuxMonitorData', {
        success(data) {
            _model.vars.loading = false;
            _msgr.pub(pagerKey + '_total', data?.pojoTotalCount);
            _msgr.pub('tableData', data?.list || []);
        },
        error(error) {
            _model.vars.loading = false;
            console.log(error);
        },
        complete() {},
        params,
        useMock: false,
        type: 'post'
    });
}
