// 设备重过载预警弹窗
let _model, _msgr;
import { ajaxCall, getDetailConf } from '../../common.js';
import { getRegionList } from '../../utils/commonList.js';
const bvSelectData = getDetailConf('bvNameList');
const maintenanceId = getDetailConf('maintenanceId');
const systemMainAccessWindow = (params = {}) => {
    console.log(params, '----params');
    const uuid = jam.genUUID();
    return {
        type: 'wrapper',
        id: 'systemProgressCityAccessWindow',
        styles: [
            'size.fullsize',
            'layout(overflow:hidden)',
            Styles.stylesheet({
                ':scope': {
                    direction: 'column',
                    'flex-wrap': 'nowrap',
                    'flex-direction': 'column'
                },
                '.search-wrapper': {
                    width: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                },
                '.table-wrapper': {
                    flex: 1
                }
            })
        ],
        components: [
            {
                type: 'wrapper',
                class: 'search-wrapper',
                childStyles: ['icon.regular'],
                components: [
                    {
                        type: 'select',
                        cap: '所属区域:',
                        icon: 'bars',
                        placeholder: '请选择区域',
                        dataWatcher: 'regionList',
                        valueKey: 'regionId',
                        styles: [Styles.select.regularStyleNew, Styles.select.agent.css({ minWidth: '10rem' })]
                    },
                    {
                        type: 'button',
                        class: 'btn jam-cta',
                        cap: '查询',
                        icon: 'magnifying-glass',
                        styles: [Styles.searchBtnsStyles],
                        msgFormat: {
                            msgKey: 'substation-table-search'
                        }
                    },
                    {
                        type: 'button',
                        cap: '重置',
                        icon: 'rotate-right',
                        styles: [Styles.searchBtnsStyles],
                        onclick: function () {
                            _msgr.pub('regionId', params.regionId);
                        }
                    }
                ]
            },
            {
                type: 'table',
                class: 'table-wrapper',
                styles: [Styles.tableStyles, Styles.table.layout({ overflow: 'auto' }), 'table.fixedrowheight(height:2.5rem)'],
                dataDef: [
                    {
                        cap: 'id',
                        show: false
                    },
                    {
                        cap: '厂站',
                        sortable: false
                    },
                    {
                        cap: '电压等级',
                        sortable: false
                    },
                    {
                        cap: '地区',
                        sortable: false
                    },
                    {
                        cap: '运维班组',
                        sortable: false
                    },
                    {
                        cap: '运维站',
                        sortable: false
                    },
                    {
                        cap: '状态',
                        sortable: false
                    }
                ],
                dataWatcher: 'substationTableData'
            },
            {
                type: 'pager',
                props: {
                    pageSizeList: [
                        {
                            value: '10',
                            name: '10条/页'
                        },
                        {
                            value: '50',
                            name: '50条/页'
                        }
                    ],
                    total: 'substationScale_pager_total',
                    messageKey: uuid
                },
                watchers: [
                    {
                        key: uuid,
                        callback: function (value) {
                            console.log('value: ', value);
                            initData({ pageNum: value.pageNumber, pageSize: value.pageSize });
                        }
                    }
                ]
            }
        ],
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
            _msgr.pub('regionId', params.regionId);
            _msgr.pub('substationScale_pager_total', 0);
        },
        watchers: [
            {
                key: 'substation-table-search',
                callback: function (val) {
                    initData();
                }
            },
            {
                key: 'auto-refresh-msg',
                callback: function (val) {
                    initData();
                }
            }
        ],
        onafterrender: function () {
            _model.vars.showIf = params.showIf;
            getRegionList(_model);
            initData();
        },
        onunmount: function () {}
    };
    function initData(pager = { pageSize: 10, pageNum: 1 }) {
        const paramsData = {
            //
            pageSize: pager.pageSize,
            pageNum: pager.pageNum,
            regionId: _msgr.get('regionId') || undefined,
            isShowRegion: 1,
            bvNameList: bvSelectData
            // maintenanceId: maintenanceId
        };
        if (params.channelStatus == 123) {
            paramsData.channelStatus = 0;
        }
        ajaxCall(
            'getSubListData',
            {
                success(data) {
                    let newData = data.records.map((item) => {
                        return [item.id, item?.name || '--', item?.bvName || '--', item?.regionName || '--', item?.groupName || '--', item?.maintenanceName || '--', ['接入', '退出'][item?.channelStatus] || '--'];
                    });
                    _msgr.pub('substationTableData', newData);
                    _msgr.pub('substationScale_pager_total', data.total);
                },
                params: paramsData,
                useMock: false,
                type: 'post',
                error() {},
                complete() {}
            },

            false
        );
    }
};
export default systemMainAccessWindow;
