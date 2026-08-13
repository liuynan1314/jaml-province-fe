import { urlConfig, mockPath } from '../../global.js';
import { formatterJameBv, ajaxCall, findCol } from '../../common.js';
import stationFilterSelect from '../../modules/registerCards/select/stationFilterSelect.mjs';
import spaceFilterSelect from '../../modules/registerCards/select/spaceFilterSelect.mjs';

let _msgr = null;
let _model = null;
let _this = null;
let tableData;
let currentScaleType, paramsData;

let bvData = [];
const menuData = [
    {
        name: '变电站',
        value: 2,
        tableIdList: ''
    },
    {
        name: '主设备',
        value: 3,
        tableIdList: null
    },
    {
        name: '辅设备',
        value: 4,
        tableIdList: 13400
    }
    // {
    //     name: '主遥信',
    //     value: 5,
    //     tableIdList: 431
    // },
    // {
    //     name: '辅遥信',
    //     value: 6,
    //     tableIdList: '13401,13406'
    // },
    // {
    //     name: '主遥测',
    //     value: 7,
    //     tableIdList: 432
    // },
    // {
    //     name: '辅遥测',
    //     value: 8,
    //     tableIdList: '13402,13407'
    // }
];
const auxiliaryList = [
    {
        name: '全部',
        value: '-1'
    },
    {
        name: '动环设备',
        value: 0
    },
    {
        name: '安防设备',
        value: 1
    },
    {
        name: '消防设备',
        value: 2
    },
    {
        name: '在线监测',
        value: 3
    }
];

const statusList = [
    {
        name: '全部',
        value: '-1'
    },
    {
        name: '接入',
        value: '0'
    },
    {
        name: '退出',
        value: '1'
    }
];

const systemProgressCityAccessWindow = (params = {}) => {
    console.log(params, '----params');
    const uuid = jam.genUUID();
    return {
        type: 'card',
        // cap: params.title,
        cap: '设备列表',
        icon: 'gear',
        id: 'systemProgressCityAccessWindow',
        styles: [
            Styles.card.floating({
                width: '70vw',
                height: '70vh'
            }),
            Styles.stylesheet({
                '.main-wrapper': {
                    width: '100%',
                    height: '100%',
                    flexDirection: 'column',
                    'flex-wrap': 'nowrap',
                    'flex-direction': 'column'
                },
                '.search-wrapper': {
                    width: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                },
                '.table-wrapper': {
                    flex: 1
                },
                '.viewButtons': {
                    'jam-button': {
                        '--jam-button-bg-deg': '180deg',
                        background: 'var(--jam-color-primary-default)',
                        color: 'onprimary',
                        '&:hover': {
                            background: 'var(--jam-color-primary-strong)'
                        },
                        '&:active': {
                            '--jam-button-bg-deg': '0deg'
                        }
                    }
                },
                '.space-filter-select': {
                    "[slot='cap']": {
                        marginRight: 'm'
                    }
                }
            })
        ],
        components: [
            {
                type: 'wrapper',
                class: 'main-wrapper',
                components: [
                    {
                        type: 'wrapper',
                        styles: [
                            Styles.css({
                                padding: 0,
                                width: '100%',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill,minmax(14rem,1fr))',
                                gridAutoRows: 'minmax(1fr,max-content)',
                                gap: 's',
                                flexShrink: 0
                            })
                        ],
                        descStyles: [Styles.icon.solid],
                        // descButtongroupStyles: [Styles.buttongroup.emphsisTitle],
                        components: [
                            {
                                icon: 'bell',
                                type: 'select',
                                cap: '类型\u3000',
                                value: '{{scaleType}}',
                                data: menuData
                            },
                            {
                                icon: 'bolt',
                                type: 'select',
                                cap: '电压等级',
                                buildIf: '{{scaleType}}===2 || {{scaleType}}===3',
                                value: '{{bvIdList}}',
                                dataUrl: {
                                    mock: mockPath + urlConfig['getBvConfData'].mock,
                                    url: urlConfig['getBvConfData'].url,
                                    transform(res) {
                                        bvData = res.data.map((item, idx) => {
                                            return {
                                                name: item.name,
                                                value: item.value
                                            };
                                        });
                                        return bvData;
                                    }
                                }
                            },
                            {
                                icon: 'typewriter',
                                type: 'select',
                                cap: '设备类型',
                                buildIf: '{{scaleType}}===4',
                                value: '{{devTypes}}',
                                defaultValue: params.devTypes >= 0 ? params.devTypes : -1,
                                data: auxiliaryList
                            },
                            {
                                icon: 'list-radio',
                                type: 'select',
                                buildIf: '{{scaleType}}===2',
                                cap: '状态选择',
                                value: '{{statusId}}',
                                data: statusList
                            },
                            {
                                type: 'select',
                                icon: 'layer-group',
                                cap: '设备类型',
                                placeholder: '请选择主设备',
                                buildIf: '{{scaleType}}===3',
                                value: '{{tableId}}',
                                dataUrl: {
                                    mock: mockPath + urlConfig['getDevTypeData'].mock,
                                    url: urlConfig['getDevTypeData'].url,
                                    headers: {
                                        Authorization: 'Bearer ' + jam.getUrlParam('token') || ''
                                    },
                                    data: {
                                        catalog: 1
                                    },
                                    transform: (res) => {
                                        const { data } = res;
                                        const devTypeList = (data || []).map((item) => ({
                                            name: item.devTypeDesc,
                                            value: item.devType
                                        }));
                                        return devTypeList;
                                    }
                                }
                            },
                            {
                                type: 'select',
                                icon: 'screwdriver-wrench',
                                cap: '运维班组',
                                placeholder: '请选择运维班组',
                                buildIf: '{{scaleType}}===2||{{scaleType}}===3',
                                value: '{{groupIdList}}',
                                dataUrl: {
                                    mock: mockPath + urlConfig['getMaintenanceGroup'].mock,
                                    url: urlConfig['getMaintenanceGroup'].url,
                                    headers: {
                                        Authorization: 'Bearer ' + jam.getUrlParam('token') || ''
                                    },
                                    transform: (res) => {
                                        const { data } = res;
                                        const devTypeList = (data || []).map((item) => ({
                                            name: item.name,
                                            value: item.id
                                        }));
                                        return devTypeList;
                                    }
                                }
                            },
                            {
                                type: 'select',
                                cap: '运维站',
                                icon: 'screwdriver-wrench',
                                placeholder: '请选择运维站',
                                buildIf: '{{scaleType}}===2',
                                value: '{{maintenanceIdList}}',
                                dataUrl: {
                                    mock: mockPath + urlConfig['getStationSelectList'].mock,
                                    url: urlConfig['getStationSelectList'].url,
                                    transform: (res) => {
                                        const { data } = res;
                                        const devTypeList = (data || []).map((item) => ({
                                            name: item.name,
                                            value: item.id
                                        }));
                                        return devTypeList;
                                    }
                                }
                            },
                            stationFilterSelect,
                            spaceFilterSelect,
                            {
                                type: 'input',
                                cap: '设备名称',
                                icon: 'screwdriver-wrench',
                                components: [
                                    {
                                        type: 'button',
                                        buildIf: '{{devName}}',
                                        icon: 'r',
                                        class: 'jam-clear-btn jam-input-btn jam-extra-btn',
                                        slot: 'extra',
                                        title: '清除',
                                        onclick(e) {
                                            const el = this.parentNode;
                                            if (el?.clear) {
                                                el.clear();
                                            }
                                        }
                                    }
                                ],
                                buildIf: '{{scaleType}}===3 || {{scaleType}}===4|| {{scaleType}}===5 || {{scaleType}}===6 || {{scaleType}}===7 || {{scaleType}}===8',
                                value: '{{devName}}'
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        styles: ['css(marginTop:0.5rem;flex: 1;min-height: 0; overflow: hidden)'],
                        components: jaml.var('scaleType', function (type) {
                            return [
                                {
                                    type: 'tableWithPage',
                                    styles: ['tableWithPage.basic', Styles.hover.toShowAll({ selector: '.jam-td' }), Styles.table.fixedrowheight({ height: '2.5rem' }), ' css(width:100%)', Styles.css({ padding: 0 })],
                                    descStyles: {
                                        '.item-time': [Styles.badge.cap.css({ width: '5em' }), Styles.badge.content.css({ width: '5em' })],
                                        '.item-tag': [Styles.cap.css({ border: 's solid var(--jam-color-outline-muted)', padding: 'xxs s' })],
                                        '.item-content': ['css(overflow:hidden;white-space:nowrap;text-overflow:ellipsis)'],
                                        '.item-indicator': ['indicator.cap.hide()', 'indicator.value.css(width:2rem;justify-content:flex-end)']
                                    },
                                    props: {
                                        cpageHide: {
                                            pageSize: false
                                        },
                                        pageSizeList: [
                                            { value: 20, name: '20条/页' },
                                            { value: 30, name: '30条/页' },
                                            { value: 50, name: '50条/页' },
                                            { value: 100, name: '100条/页' }
                                        ]
                                    },
                                    dataDef: getDataDefData(type),
                                    ref: 'tableWithPage',
                                    watchers: [
                                        {
                                            keys: ['cpageNo'],
                                            debounce: 400,
                                            callback(cpageNo) {
                                                _model.vars.cpageNo = cpageNo;
                                                initTable(cpageNo);
                                            }
                                        }
                                    ]
                                }
                            ];
                        })
                    }
                ]
            }
        ],
        onmount: function () {
            _this = this;
            _model = this.model;
            _msgr = this.model.msgr;
        },
        watchers: [
            {
                keys: ['scaleType', 'bvIdList', 'devTypes', 'statusId', 'tableId', 'stId', 'devName', 'groupIdList', 'maintenanceIdList', 'bayId'],
                debounce: 400,
                callback(scaleType, bvIdList, devTypes, statusId, tableId, stId, devName, groupIdList, maintenanceIdList, bayId) {
                    currentScaleType = scaleType;
                    initTable();
                }
            }
        ],
        vars: {
            ctotal: 0,
            cpageNo: 1,
            cpageSize: 20,
            scaleType: params.scaleType || 2,
            bvData,
            bvIdList: null,
            statusId: params.channelStatus || '-1',
            tableId: params.devType || '',
            type: params.type
        },
        onafterrender: async function () {
            const bvList = await getBvList();
            if (params.bvName) {
                _model.vars.bvIdList = bvList.find((v) => v.name == params.bvName)?.value;
            }

            // initTable()
        }
    };
};

async function initTable(cpageNo) {
    paramsData = {
        pageSize: _model.vars.cpageSize || 20
    };
    if (currentScaleType == 2) {
        paramsData.pageNum = _model.vars.cpageNo || cpageNo;
    } else {
        paramsData.pageIndex = _model.vars.cpageNo || cpageNo;
    }
    if (currentScaleType == 2) {
        if (_msgr.get('statusId') != '-1') {
            paramsData.channelStatus = _msgr.get('statusId') || _model.vars.statusId;
        }
        paramsData.isShowRegion = 1;
        paramsData.ifExam = 1;
        paramsData.stTypeList = mango.get('detailConfig')?.stTypeList || [4];
        paramsData.id = _msgr.get('stId') || '';
        paramsData.isShowChannelStatus = 1;
        paramsData.groupIdList = _msgr.get('groupIdList') ? [_msgr.get('groupIdList')] : [];
        paramsData.maintenanceIdList = _msgr.get('maintenanceIdList') ? [_msgr.get('maintenanceIdList')] : [];
        paramsData.bvIdList = _model.vars.bvIdList ? [_model.vars.bvIdList] : bvData.map((item) => item.value);
    } else if (currentScaleType == 3) {
        if (!_msgr.get('tableId')) {
            paramsData.devType = [];
        } else {
            paramsData.devType = [_msgr.get('tableId')];
        }
        paramsData.groupId = _msgr.get('groupIdList') || '';
        paramsData.devName = _msgr.get('devName') || '';
        paramsData.bvIdList = _model.vars.bvIdList ? [_model.vars.bvIdList] : bvData.map((item) => item.value);
        paramsData.bayId = _msgr.get('bayId') || '';
        paramsData.stId = _msgr.get('stId') || '';
        paramsData.withPmsInfo = true;
        paramsData.catalog = 1;
    } else if (currentScaleType == 4) {
        paramsData.name = _msgr.get('devName') || '';
        paramsData.stId = _msgr.get('stId') || '';
        paramsData.bayId = _msgr.get('bayId') || '';
        const devId = getMenuList().find((item) => item.value == currentScaleType)?.tableIdList;
        if (typeof devId === 'string') {
            paramsData.tableIdList = devId.split(',').map((id) => parseInt(id.trim()));
        } else {
            paramsData.tableIdList = [devId];
        }
        if (_msgr.get('devTypes') >= 0 && _msgr.get('devTypes') != null) {
            paramsData.auxClass = [_msgr.get('devTypes')];
        } else {
            paramsData.auxClass = [0, 1, 2, 3];
        }
    } else {
        // paramsData.bvId = _msgr.get('bvId');
        paramsData.name = _msgr.get('devName') || '';
        paramsData.stId = _msgr.get('stId') || '';
        const devId = getMenuList().find((item) => item.value == currentScaleType)?.tableIdList;
        if (typeof devId === 'string') {
            paramsData.tableIdList = devId.split(',').map((id) => parseInt(id.trim()));
        } else {
            paramsData.tableIdList = [devId];
        }
    }

    jam.ajaxCall({
        debounce: 500,
        method: 'POST',
        url: urlConfig[getUrlByValue(currentScaleType)].url,
        mock: mockPath + urlConfig[getUrlByValue(currentScaleType)].mock,
        data: paramsData,
        headers: {
            ...(currentScaleType === 2 && _model.vars.type === 'allSt' ? { 'Use-Case': '', 'Only-Ts': false } : {})
        },
        onsuccess: function (res) {
            let data = res?.data || {};
            tableData = data?.list;

            let newData = [];
            if (currentScaleType == 2) {
                newData = data.records?.map((item) => {
                    return [item.id, item?.name || '--', item?.bvName || '--', item?.groupName || '--', item?.maintenanceName || '--', ['接入', '退出'][item?.channelStatus] || '--'];
                });
            } else if (currentScaleType == 3) {
                newData = data.list?.map((item) => {
                    return [item.stId, item.devId, item.bayId, item?.stName || '--', item?.bayName || '--', item?.bvName || '--', item?.typeDesc || '--', item?.devName || '--', item?.mgroupName || '--', item.devId];
                });
            } else if (currentScaleType == 4) {
                newData = data.records?.map((item) => {
                    return [item.id, item.bayId, item?.stName || '--', item?.bayName || '--', item?.bvName || '--', item?.auxClassName || '--', item?.name || '--'];
                });
            } else {
                newData = data.records?.map((item) => {
                    return [item.id, item?.name || '--', item?.bvName || '--', item?.stName || '--'];
                });
            }
            if (currentScaleType == 3) {
                setTimeout(() => {
                    _model.vars.ctotal = data.pojoTotalCount;
                }, 100);
            } else {
                setTimeout(() => {
                    _model.vars.ctotal = data.total;
                }, 100);
            }
            _this.ref('tableWithPage').data = newData;
        }
    });
}

function getDataDefData(value) {
    let dataDef = [];
    if (value == 2) {
        dataDef = [
            {
                key: 'stId',
                show: false
            },
            {
                cap: '变电站',
                sortable: false,
                class: 'r-st item-content',
                sortable: false,
                attrs: jaml.res(function () {
                    return { 'data-id': this.col(0) };
                })
            },
            {
                cap: '电压等级',
                sortable: false,
                formatter: formatterJameBv
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
        ];
    } else if (value == 3) {
        dataDef = [
            {
                // key: 'devId',
                show: false
            },
            {
                // key: 'devId',
                show: false
            },
            {
                // key: 'devId',
                show: false
            },
            {
                // key: 'stName',
                cap: '变电站',
                class: 'r-st item-content',
                sortable: false,
                attrs: jaml.res(function () {
                    return { 'data-id': this.col(0) };
                })
            },
            {
                cap: '间隔',
                align: 'left',
                class: 'r-bay item-content',
                sortable: false,
                attrs: jaml.res(function () {
                    return { 'data-id': this.col(2) };
                })
            },
            {
                cap: '电压等级',
                sortable: false,
                formatter: formatterJameBv
            },
            {
                cap: '设备类型',
                sortable: false
            },
            {
                cap: '设备名称',
                align: 'left',
                sortable: false
            },
            {
                cap: '运维班',
                sortable: false
            },
            {
                cap: '操作',
                sortable: false,
                formatter: function () {
                    return jame({
                        type: 'label',
                        cap: '查看台账',
                        styles: [`color(${jam.getColor('primary')})`, 'css(cursor: pointer;text-underline-offset:.2rem;transition:all .2s ease-in-out; )', 'hover(textDecoration: underline;)'],
                        onclick: async (e) => {
                            let target = findCol(e.target);
                            const data = tableData.find((item) => item.devId == target.col(1));
                            if (data) {
                                let params = {
                                    id: target.col(1)
                                };
                                mango.pub('openCard', params);
                                const _res = await jam.addResource('modules/modals/devInfo.mjs');
                                jam.renderModal('#main', _res.default);
                            } else {
                                jam.notify('未查询到台账数据！', 'info');
                            }
                        }
                    });
                }
            }
        ];
    } else if (value == 4) {
        dataDef = [
            {
                show: false
            },
            {
                show: false
            },
            {
                cap: '变电站',
                class: 'r-st item-content',
                sortable: false,
                attrs: jaml.res(function () {
                    return { 'data-id': this.col(0) };
                })
            },
            {
                cap: '间隔',
                align: 'left',
                class: 'r-bay item-content',
                sortable: false,
                attrs: jaml.res(function () {
                    return { 'data-id': this.col(1) };
                })
            },
            {
                cap: '电压等级',
                sortable: false,
                formatter: formatterJameBv
            },
            {
                cap: '设备类型',
                sortable: false
            },
            {
                cap: '名称',
                sortable: false
            }
        ];
    } else {
        dataDef = [
            {
                key: 'id',
                show: false
            },
            {
                cap: '名称',
                sortable: false
            },
            {
                cap: '电压等级',
                sortable: false,
                formatter: formatterJameBv
            },
            {
                cap: '变电站',
                sortable: false
            }
        ];
    }
    return dataDef;
}

function getUrlByValue(value) {
    let urlName = '';
    if (value == 2) {
        urlName = 'getSubListData';
    } else if (value == 4) {
        urlName = 'getAuxDevListData';
    } else if (value == 5 || value == 7) {
        urlName = 'getMainYcOrYxListData';
    } else if (value == 6) {
        urlName = 'getAuxYxListData';
    } else if (value == 8) {
        urlName = 'getAuxYcListData';
    } else {
        // urlName = 'getMainDevListData';
        urlName = `getJkDevInfoData`;
    }
    return urlName;
}

function getMenuList() {
    return [
        {
            name: '变电站',
            value: 2,
            tableIdList: ''
        },
        {
            name: '主设备',
            value: 3,
            tableIdList: null
        },
        {
            name: '辅设备',
            value: 4,
            tableIdList: 13400
        },
        {
            name: '主遥信',
            value: 5,
            tableIdList: 431
        },
        {
            name: '辅遥信',
            value: 6,
            tableIdList: '13401,13406'
        },
        {
            name: '主遥测',
            value: 7,
            tableIdList: 432
        },
        {
            name: '辅遥测',
            value: 8,
            tableIdList: '13402,13407'
        }
    ];
}

async function getBvList() {
    return new Promise((resolve, reject) => {
        ajaxCall(
            'getBvConfData',
            {
                success(data) {
                    const bvList__ = [
                        {
                            name: '全部',
                            value: null
                        }
                    ];
                    const bvList = (data || []).sort((a, b) => parseInt(b.name) - parseInt(a.name));
                    bvList__.push(...bvList);
                    resolve(bvList__);
                    return bvList__;
                },
                params: {},
                useMock: false,
                type: 'get'
            },
            false
        );
    });
}

export default systemProgressCityAccessWindow;
