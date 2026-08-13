let _model, _msgr;
import { ajaxCall } from '../../common.js';
const uuid = jam.genUUID();
let tabType, type;
let dataDefs = {
    1: [
        {
            key: 'regionName',
            cap: '区域名称',
            sortable: false
        },
        {
            key: 'devName',
            cap: '信号名称',
            sortable: false,
            formatter: function (value) {
                return value ? value : '--';
            }
        },
        {
            key: 'stName',
            cap: '厂站名称',
            sortable: false
        },
        {
            key: 'devType',
            cap: '设备类型',
            sortable: false,
            formatter: function (val) {
                var text = '';
                switch (val) {
                    case 5:
                        text = '气体灭火系统';
                        break;
                    case 50:
                        text = '防排烟系统';
                        break;
                    case 51:
                        text = '应急照明系统';
                        break;
                    case 52:
                        text = '消防总信号';
                        break;
                    default:
                        text = '未知设备';
                }
                return text;
            }
        },
        {
            key: 'gmtUpdateTime',
            cap: '时间',
            sortable: false
        }
    ],
    2: [
        {
            key: 'stName',
            cap: '厂站名称',
            sortable: false
        },
        {
            key: 'regionName',
            cap: '区域名称',
            sortable: false
        },
        {
            key: 'signalName',
            cap: '信号名称',
            sortable: false
        },
        {
            key: 'signalType',
            cap: '信号类型',
            sortable: false,
            formatter: function (val) {
                var text = '';
                switch (val) {
                    case 0:
                        text = 'SF6';
                        break;
                    case 1:
                        text = '主变油色谱';
                        break;
                    case 3:
                        text = '蓄电池';
                        break;
                    case 2:
                        text = '温湿度';
                        break;
                    default:
                        text = '未知信号类型';
                }
                return text;
            }
        },
        {
            key: 'gmtUpdateTime',
            cap: '时间',
            sortable: false
        }
    ]
};
export default (params = {}) => {
    tabType = params.tabType; //1 消防 2在线
    type = params.type; //类型
    const current1 = moment().format('YYYY-MM-01');
    const current2 = moment().format('YYYY-MM-DD');

    return {
        type: 'wrapper',
        id: 'monitorInfoWindow',
        styles: [
            'size.fullsize',
            Styles.stylesheet({
                ':scope': {
                    display: 'flex',
                    flexDirection: 'column',
                    '.form-box': {
                        display: 'flex',
                        flexWrap: 'wrap'
                    }
                }
            })
        ],
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
                        type: 'filterSelect',
                        class: 'unifycap',
                        props: { cap: `厂站：`, data: '{{stList}}', search: '{{stName}}', select: '{{stId}}' },
                        watchers: {
                            stName: jam.makeDebounce(function (val) {
                                getSubstationList(val);
                            }, 500)
                        }
                    },
                    {
                        type: 'select',
                        cap: '区域：',
                        placeholder: '请选择区域',
                        valueKey: 'regionId',
                        dataWatcher: 'regionList'
                    },
                    {
                        type: 'select',
                        cap: '信号类型：',
                        placeholder: '请选择事件类型',
                        dataWatcher: 'eventData',
                        valueKey: 'eventId'
                    },
                    {
                        type: 'datepicker',
                        valueKey: 'beginDate',
                        cap: '开始时间：'
                    },
                    {
                        type: 'datepicker',
                        valueKey: 'endDate',
                        cap: '结束时间：'
                    },
                    {
                        type: 'button',
                        cap: '查询',
                        onclick: function () {
                            getTableData();
                        }
                    },
                    {
                        type: 'button',
                        cap: '重置',
                        onclick: function () {
                            _msgr.pub('beginDate', current1);
                            _msgr.pub('endDate', current2);
                            _msgr.pub('stId', '');
                            _msgr.pub('stName', '');
                            _msgr.pub('regionId', '');
                            _msgr.pub('eventId', '');
                        }
                    }
                ]
            },
            {
                type: 'table',
                styles: [
                    Styles.table.regularStyleNew,
                    // Styles.table.layout({ overflow: 'auto' }),
                    Styles.table.css({
                        height: 'calc(100% - 8rem)'
                    })
                ],
                dataDef: dataDefs[tabType],
                dataWatcher: 'tableData'
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
                    total: 'table_pager_total',
                    messageKey: uuid
                },
                watchers: [
                    {
                        key: uuid,
                        callback: function (page) {
                            if (page.firstFetch) return;
                            getTableData({ pageIndex: page.pageNumber, pageSize: page.pageSize });
                        }
                    }
                ]
            }
        ],
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
        },
        watchers: [],
        onafterrender: async function () {
            _msgr.pub('beginDate', current1);
            _msgr.pub('endDate', current2);
            await getSubstationList();
            getRegionList();
            getEventTypeList();
            getTableData();
        }
    };
};

/**
 * 获取变电站列表
 */
async function getSubstationList(devName = '', params = null) {
    ajaxCall(
        'getSubstationList',
        {
            success(data) {
                _model.vars.stList = data?.map((item) => ({ name: item.devName, value: item.devId }));
                if (params) {
                    _msgr.pub('stId', params.stId);
                    _msgr.pub('stName', params.stName);
                }
            },
            params: {
                count: 100,
                devName: devName,
                devType: ['substation']
            },
            useMock: false,
            type: 'post',
            uniqId: `getSubstationList_${Math.random(1, 1000000)}`
        },
        false
    );
}

/**
 * 获取区域列表
 */
function getRegionList() {
    ajaxCall(
        'getRegionList',
        {
            success(data) {
                const defaultRegion = [
                    {
                        name: '全部',
                        value: ''
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

/**
 * 事件类型列表
 */
function getEventTypeList() {
    let eventTypeData = {
        1: [
            {
                name: '消防总信号',
                value: 52
            },
            {
                name: '气体灭火系统',
                value: 5
            },
            {
                name: '防排烟系统',
                value: 50
            },
            {
                name: '应急照明系统',
                value: 51
            }
        ],
        2: [
            {
                name: 'SF6',
                value: 0
            },
            {
                name: '主变油色谱',
                value: 1
            },
            {
                name: '温湿度',
                value: 2
            },
            {
                name: '蓄电池',
                value: 3
            }
        ]
    };
    _msgr.pub('eventId', type);
    _msgr.pub('eventData', eventTypeData[tabType]);
}

/**渲染表格 */
function getTableData(pager = { pageIndex: 1, pageSize: 10 }) {
    let url = tabType == 1 ? 'getFireMonitorRecord' : 'getOnlineMonitorRecord';
    ajaxCall(
        url,
        {
            success(data) {
                _msgr.pub('tableData', data.list);
                _msgr.pub('table_pager_total', data.pojoTotalCount);
            },
            params: {
                regionId: _msgr.get('regionId'),
                stId: _msgr.get('stId'),
                beginTime: _msgr.get('beginDate') ? _msgr.get('beginDate') + ' 00:00:00' : '',
                endTime: _msgr.get('endDate') ? _msgr.get('endDate') + ' 23:59:59' : '',
                devType: _msgr.get('eventId'),
                ...pager
            },
            useMock: false,
            type: 'post'
        },
        false
    );
}
