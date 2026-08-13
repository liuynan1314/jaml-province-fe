// 设备重过载预警弹窗
let _model, _msgr;
import { ajaxCall, getDetailConf } from '../../common.js';
const bvSelectData = getDetailConf('levelList1');
const substationScaleListWindow = (params = {}) => {
    console.log(params, '----params');
    const uuid = jam.genUUID();

    return {
        type: 'card',
        icon: '',
        cap: '变电站列表',
        styles: [
            Styles.card.floating({
                width: '76vw',
                height: '68vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                id: 'substationScaleListWindow',
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
                                type: 'input',
                                cap: '厂站名称：',
                                placeholder: '根据厂站名称模糊匹配',
                                valueKey: 'stName',
                                styles: [Styles.input.regularStyleNew, Styles.input.agent.css({ minWidth: '10rem' })]
                            },
                            {
                                type: 'select',
                                cap: '电压等级：',
                                placeholder: '请选择电压等级',
                                data: bvSelectData.map((item) => ({ name: item.name, value: item.name })),
                                valueKey: 'bvName',
                                styles: [Styles.select.regularStyleNew, Styles.select.agent.css({ minWidth: '10rem' })]
                            },
                            {
                                type: 'select',
                                cap: '状态：',
                                placeholder: '请选择状态',
                                data: [
                                    {
                                        name: '正常',
                                        value: 0
                                    },
                                    {
                                        name: '退出',
                                        value: 1
                                    }
                                ],
                                valueKey: 'channelStatus',
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
                                    _msgr.pub('stName', '');
                                    _msgr.pub('bvName', params.bvName);
                                    _msgr.pub('channelStatus', params.channelStatus);
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
                    _msgr.pub('bvName', params.bvName);
                    _msgr.pub('channelStatus', params.channelStatus);

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
                    initData();
                },
                onunmount: function () {}
            }
        ]
    };
    function initData(pager = { pageSize: 10, pageNum: 1 }) {
        const bvNameList = _msgr.get('bvName') ? [_msgr.get('bvName')] : bvSelectData.map((item) => item.name);
        const channelStatus = _msgr.get('channelStatus');
        ajaxCall(
            'getSubstationTableData',
            {
                success(data) {
                    let newData = data.records.map((item) => {
                        return [item.id, item?.name || '--', item?.bvName || '--', item?.regionName || '--', item?.groupName || '--', item?.maintenanceName || '--', ['接入', '退出'][item?.channelStatus] || '--'];
                    });
                    _msgr.pub('substationTableData', newData);
                    _msgr.pub('substationScale_pager_total', data.total);
                },
                params: {
                    //
                    pageSize: pager.pageSize,
                    pageNum: pager.pageNum,
                    bvNameList,
                    channelStatus: channelStatus || channelStatus == 0 ? channelStatus : undefined,
                    name: _msgr.get('stName') || undefined,
                    groupIdList: getDetailConf('groupIdList'),
                    ifExam: 1,
                    isShowChannelStatus: 1
                },
                useMock: false,
                type: 'post',
                error() {},
                complete() {}
            },

            false
        );
    }
};
export default substationScaleListWindow;
