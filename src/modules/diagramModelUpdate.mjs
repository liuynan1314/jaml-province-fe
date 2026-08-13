import { ajaxCall, exportExcel, formatterJameTime } from '../common.js';
import { urlConfig } from '../global.js';
let _model, _msgr;
const pagerKey = jam.genUUID();

export default {
    type: 'wrapper',
    styles: [
        'size.fullsize',
        'css(columnGap:1.25rem)',
        Styles.stylesheet({
            '.main-wrapper': {
                overflow: 'hidden auto'
            },
            '.table-container': {
                padding: 'var(--gap)',
                marginTop: 'var(--gap)',
                border: 's solid var(--jam-color-outline-muted)',
                backgroundColor: 'elevation',
                boxShadow: 'l',
                overflow: 'hidden auto'
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            class: 'main-wrapper',
            styles: ['flex(flex:1;direction:column)'],
            components: [
                {
                    type: 'wrapper',
                    class: 'form-box',
                    descStyles: {
                        datepicker: [Styles.icon.duotone, Styles.datepicker.regularStyle],
                        button: [Styles.searchBtnsStyles, Styles.button.css({ margin: '0.2rem 0.5rem' })],
                        select: [Styles.icon.duotone, Styles.select.regularStyle, Styles.select.agent.css({ width: '11rem' })],
                        input: [Styles.icon.duotone, Styles.input.regularStyle]
                    },
                    components: [
                        {
                            type: 'multidropdown',
                            props: {
                                cap: '区域：',
                                value: '{{regionIdList}}',
                                searchable: true,
                                remoteSearch: true,
                                clearable: true,
                                searchName: 'regionDesc',
                                data: '{{regionListData}}'
                            },
                            dataUrl: {
                                urlKey: 'getRegionList',
                                debounce: 200,
                                data: {
                                    regionName: '{{regionDesc}} ?? undefined'
                                },
                                transform(res) {
                                    return res.data.map((item) => ({ name: item.regionNameChn, value: item.regionId }));
                                }
                            }
                        },
                        {
                            type: 'multidropdown',
                            props: {
                                cap: '变电站：',
                                value: '{{stIdList}}',
                                searchable: true,
                                remoteSearch: true,
                                clearable:true,
                                searchName: 'stationDesc',
                                data: '{{stationListData}}'
                            },
                            dataUrl: {
                                urlKey: 'getSubstationList',
                                debounce: 200,
                                method: 'post',
                                data: {
                                    regionIdList: '{{regionIdList}}??undefined',
                                    devName: '{{stationDesc}}?? undefined',
                                    devType: ['substation']
                                },
                                transform(res) {
                                    return res.data.map((item) => ({ name: item.stName, value: item.stId }));
                                }
                            }
                        },
                        { type: 'datepicker', value: '{{beginDate}}', max: '{{endDate}}', cap: '保存时间：', icon: 'calendar' },
                        { type: 'datepicker', value: '{{endDate}}', min: '{{beginDate}}', cap: '-', styles: ['padding(left:0)', Styles.stylesheet({ ':scope': { minWidth: '0!important' } })] },
                        {
                            type: 'button',
                            cap: '查询',
                            icon: 'search',
                            class: 'ml-_625rem jam-cta',
                            onclick: function () {
                                getTableData();
                            }
                        },
                        {
                            type: 'button',
                            cap: '重置',
                            icon: 'refresh',
                            onclick() {
                                this.vars.beginDate = moment().format('YYYY-MM-01');
                                this.vars.endDate = moment().format('YYYY-MM-DD');
                                this.vars.regionIdList = [];
                                this.vars.stIdList = [];
                            }
                        },
                        {
                            type: 'button',
                            class: 'btn export-btn',
                            cap: '导出',
                            icon: 'file-export',
                            onclick: function () {
                                exportTableData();
                            }
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'table-container',
                    styles: ['flex(flex:1;direction:column)'],
                    components: [
                        {
                            type: 'table',
                            class: 'table-style',
                            styles: [Styles.tableStyles, Styles.table.showrownum({ style: 'plain' }), Styles.table.css({ width: '100%', height: '100%', overflowY: 'auto' })],
                            dataWatcher: 'defectRecordData',
                            dataDef: [
                                {
                                    key: 'graphSaveTimeStr',
                                    cap: '保存时间',
                                    sortable: false,
                                    width: '8%',
                                    formatter: formatterJameTime
                                },
                                {
                                    key: 'regionName',
                                    cap: '区域',
                                    sortable: false,
                                    width: '5%'
                                },
                                {
                                    key: 'stName',
                                    cap: '厂站',
                                    sortable: false,
                                    align: 'left',
                                    width: '8%',
                                    styles: [Styles.toShowAll]
                                },
                                {
                                    key: 'graphName',
                                    cap: '图形名称',
                                    sortable: false,
                                    align: 'left',
                                    width: '30%',
                                    styles: [Styles.toShowAll]
                                },
                                {
                                    key: 'graphTypeName',
                                    cap: '图形类别',
                                    width: '5%',
                                    sortable: false
                                },
                                {
                                    key: 'graphVersion',
                                    cap: '图形版本号',
                                    width: '5%',
                                    sortable: false
                                },
                                {
                                    key: 'graphSplitTypeName',
                                    cap: '图形分割类型',
                                    width: '5%',
                                    sortable: false
                                },

                                {
                                    key: 'savePersonName',
                                    cap: '操作人',
                                    width: '5%',
                                    sortable: false
                                }
                            ]
                        },
                        {
                            type: 'pager',
                            styles: [
                                //
                                'size(minHeight:2.25rem)',
                                'margin(top:0.5rem)'
                            ],
                            props: {
                                pageSizeList: [
                                    {
                                        value: '20',
                                        name: '20条/页'
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
            ]
        }
    ],
    vars: {
        beginDate: moment().format('YYYY-MM-01'),
        endDate: moment().format('YYYY-MM-DD'),
        regionDesc: '',
        regionIdList: []
    },
    watchers: [
        {
            key: pagerKey,
            callback: function (page) {
                page.firstFetch ? null : getTableData(page);
            }
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        getTableData();
    }
};

function getTableData(page) {
    ajaxCall(
        'getGraphData',
        {
            success(res) {
                try {
                    const { list = [], pojoTotalCount = 0 } = res || {};
                    const tableData = list;
                    _msgr.pub('defectRecordData', tableData);
                    _msgr.pub(pagerKey + '_total', pojoTotalCount);
                } catch (error) {
                    console.error(error);
                }
            },
            params: {
                ...getPagerParams(page),
                ...getParams()
            },
            timeout: 12,
            useMock: false,
            type: 'post'
        },
        false
    );
}

function exportTableData() {
    const params = getParams() || {};
    exportExcel(urlConfig.exportGraphData.url, params, `图模更新历史数据_${moment().format('YYYYMMDDhhmmss')}.xlsx`, 'POST');
}

function getParams() {
    return {
        ...getTimeParams(),
        regionIdList: _model.regionIdList ?? undefined,
        stIdList: _model.stIdList ?? undefined
    };
}

function getPagerParams(page) {
    const { pageNumber = 1, pageSize = 20 } = page || {};
    return { pageIndex: pageNumber, pageSize };
}
function getTimeParams() {
    return {
        beginTime: _model.vars.beginDate ? _model.vars.beginDate + ' 00:00:00' : undefined,
        endTime: _model.vars.endDate ? _model.vars.endDate + ' 23:59:59' : undefined
    };
}
