let _model, _msgr;
// import { createWindow } from '../../components/createWindow.js';
import { ajaxCall, getDetailConf, findCol, formatterJameBv } from '../../common.js';
import { getRegionList, getBvList, getSubstationList } from '../../utils/commonList';
import mainEquipmentDetailsWindow from '../../components/modal/mainEquipmentDetailsWindow.js';
import { buildTable } from '../componentBuilder.js';
const bvSelectData = getDetailConf('bvNameList');
let urlIndex = '';
const systemProgressCityAccessWindow = (params = {}) => {
    const uuid = jam.genUUID();
    return {
        type: 'card',
        icon: '',
        cap: params.title,
        styles: [
            Styles.card.floating({
                width: '88vw',
                height: '65vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                id: 'systemProgressCityAccessWindow',
                broker: uuid,
                styles: [
                    'size.fullsize',
                    'layout(overflow:hidden)',
                    Styles.stylesheet({
                        ':scope': {
                            direction: 'column',
                            'flex-wrap': 'nowrap',
                            'flex-direction': 'column',
                            gap: 'm'
                        },
                        '.search-wrapper': {
                            width: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'center'
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
                                cap: '类型:',
                                icon: 'bars',
                                placeholder: '请选择类型',
                                dataWatcher: 'menuList',
                                valueKey: 'menuId',
                                styles: [Styles.select.regularStyleNew, Styles.select.agent.css({ minWidth: '10rem' })],
                                onvaluechange: function (value) {
                                    _model.vars.menuId = value;
                                    if (value == 2) {
                                        _model.vars.statusList = getSelectData(value);
                                    }
                                    if (_model.vars.menuId != 3) {
                                        _msgr.pub('devId', getMenuList().find((item) => item.value == value)?.tableIdList);
                                    }
                                    urlIndex = getUrlByValue(value);
                                    _msgr.pub('tableDataDef', getDataDefData(value));

                                    if (value == 3) {
                                        getDevTypeData();
                                    }

                                    initData();
                                }
                            },
                            {
                                type: 'select',
                                cap: '所属区域:',
                                icon: 'bars',
                                placeholder: '请选择区域',
                                dataWatcher: 'regionList',
                                valueKey: 'regionId',
                                styles: [Styles.select.regularStyleNew, Styles.select.agent.css({ minWidth: '10rem' })],
                                watchers: [
                                    {
                                        key: 'regionId',
                                        callback: function (val) {
                                            getSubstationList({ _model, regionId: val });
                                        },
                                        debounce: 200
                                    }
                                ]
                            },
                            {
                                type: 'select',
                                cap: '状态:',
                                buildIf: '{{menuId}}===2',
                                icon: 'bars',
                                placeholder: '请选择状态',
                                dataWatcher: 'statusList',
                                valueKey: 'statusId',
                                styles: [Styles.select.regularStyleNew, Styles.select.agent.css({ minWidth: '10rem' })]
                            },
                            {
                                type: 'select',
                                cap: '主设备:',
                                icon: 'transformer-bolt',
                                placeholder: '请选择主设备',
                                buildIf: '{{menuId}}===3',
                                dataWatcher: 'stationList',
                                valueKey: 'tableId',
                                styles: [Styles.select.regularStyleNew, Styles.select.agent.css({ minWidth: '10rem' })]
                            },
                            {
                                type: 'filterSelect',
                                buildIf: '{{menuId}}===3',
                                styles: ['size(maxWidth:11.5rem)', 'padding(top:0;bottom:0)'],
                                childStyles: ['size(minWidth:11.5rem)', 'input.agent.border(radius:s)', 'input.labelslot.margin(0)', 'padding(0)'],
                                valueKey: 'stId',
                                props: { cap: '变电站：', placeholder: '请选择', data: '{{stList}}', icon: 'transformer-bolt', search: '{{name}}', select: '{{stId}}' },
                                watchers: [
                                    {
                                        key: 'name',
                                        callback: function (val) {
                                            getSubstationList({ _model, devName: val });
                                        },
                                        debounce: 200
                                    }
                                ]
                            },
                            {
                                type: 'input',
                                icon: 'transformer-bolt',
                                buildIf: '{{menuId}}===3',
                                styles: [
                                    Styles.input.regularStyleDiff,
                                    Styles.input.agent.css({
                                        borderColor: 'var(--jam-color-outline-muted)',
                                        width: '11.25rem'
                                    })
                                ],
                                cap: '设备名称：',
                                valueKey: 'devName'
                            },
                            {
                                type: 'select',
                                cap: '电压等级:',
                                icon: 'transformer-bolt',
                                placeholder: '请选择电压等级',
                                buildIf: '{{menuId}}===3',
                                dataWatcher: 'bvList',
                                valueKey: 'bvId',
                                styles: [Styles.select.regularStyleNew, Styles.select.agent.css({ minWidth: '10rem' })]
                            },
                            {
                                type: 'button',
                                class: 'btn jam-cta',
                                cap: '查询',
                                icon: 'magnifying-glass',
                                styles: [Styles.searchBtnsStyles],
                                onclick: () => {
                                    initData();
                                }
                            },
                            {
                                type: 'button',
                                cap: '重置',
                                icon: 'rotate-right',
                                styles: [Styles.searchBtnsStyles],
                                onclick: function () {
                                    _msgr.pub('regionId', '');
                                    _msgr.pub('bvId', '');
                                    _msgr.pub('stId', '');
                                    _msgr.pub('stName', '');
                                    _msgr.pub('bvName', params.bvName);
                                    _msgr.pub('statusId', params.channelStatus);
                                }
                            }
                        ]
                    },
                    buildTable({
                        cap: '系统规模管理-表格',
                        icon: 'table',
                        broker: uuid,
                        dataKey: 'systemProgressAccessWindowTableData',
                        pageSize: 15,
                        pageSizeList: [
                            { value: 15, name: '15条/页' },
                            { value: 50, name: '50条/页' }
                        ],
                        tableStyles: [Styles.table.layout({ overflow: 'auto' })],
                        dataDef: jaml.var(`tableDataDef@${uuid}`, (value) => value || []),
                        getReqParams: function () {
                            const paramsData = getRequestParams({
                                pageNumber: this.model.vars.cpageNo,
                                pageSize: this.model.vars.cpageSize
                            });

                            const _this = this;
                            return {
                                method: 'POST',
                                urlKey: urlIndex,
                                data: paramsData,
                                useMock: false,
                                transform(res) {
                                    const { list = [], records = [], total = 0, pojoTotalCount = 0 } = res?.data;
                                    const tableData = list ?? records;
                                    const newData = formatTableRecords(_model.vars.menuId, tableData);
                                    _this.vars.ctotal = pojoTotalCount ?? total;
                                    _this.vars.systemProgressAccessWindowTableData = newData;
                                    _model.vars.systemProgressAccessWindowTableData = newData;
                                    return newData;
                                }
                            };
                        }
                    })
                ],
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                watchers: [
                    {
                        key: 'auto-refresh-msg',
                        callback: function (val) {
                            initData();
                        }
                    }
                ],
                vars: {
                    regionId: params.regionId,
                    tableId: params.tableId,
                    tableIdList: params.tableIdList,
                    devId: params.devId,
                    statusId: params.channelStatus,
                    menuId: params.buildIf,
                    bvName: params.bvName,
                    tableDataDef: getDataDefData(params.buildIf)
                },
                onafterrender: async function () {
                    getRegionList(_model);
                    if (_model.vars.menuId == 3) {
                        getSubstationList({ _model });
                        getDevTypeData();
                        await getBvList(_model);
                    }
                    if (params.regionId) {
                        _msgr.pub('regionId', params.regionId);
                    }
                    if (params.devType) {
                        _msgr.pub('tableId', params.devType);
                    }
                    if (params.devId) {
                        _msgr.pub('devId', params.devId);
                    }
                    if (params.bvName) {
                        const bvId = _model.vars.bvList.find((item) => item.name == params.bvName)?.value;
                        _msgr.pub('bvId', bvId);
                    }
                    _model.vars.menuList = getMenuList();
                    if (_model.vars.menuId == 2) {
                        _model.vars.statusList = getSelectData(_model.vars.menuId);
                        _model.vars.statusId = params.channelStatus;
                    } else {
                        _model.vars.devId = params.tableIdList;
                    }
                    urlIndex = getUrlByValue(_model.vars.menuId);
                    _msgr.pub('tableDataDef', getDataDefData(_model.vars.menuId));
                    initData();
                }
            }
        ]
    };
    function initData() {
        _msgr.pub('_t', { time: Date.now() });
    }

    function getRequestParams(page) {
        const menuId = _model.vars.menuId;
        const paramsData = getPagerParams(page);
        if (menuId == 2) return { ...paramsData, ...getSubstationParams() };
        if (menuId == 3) return { ...paramsData, ...getMainDeviceParams() };
        return { ...paramsData, ...getGeneralListParams() };
    }

    function getSubstationParams() {
        const statusId = _msgr.get('statusId');
        return {
            ...(statusId != '-1' ? { channelStatus: statusId || _model.vars.statusId } : {}),
            regionId: _msgr.get('regionId') || undefined,
            isShowRegion: 1,
            ifExam: 1,
            bvNameList: bvSelectData
        };
    }

    function getMainDeviceParams() {
        const tableId = _msgr.get('tableId');
        return {
            devType: tableId ? [tableId] : [],
            devName: _msgr.get('devName') || '',
            bvId: _msgr.get('bvId'),
            regionId: _msgr.get('regionId') || '',
            stId: _msgr.get('stId') || '',
            withPmsInfo: true,
            catalog: 1
        };
    }

    function getGeneralListParams() {
        const regionId = _msgr.get('regionId');
        const devId = _msgr.get('devId') || _model.vars.devId;
        return {
            regionId: [regionId],
            tableIdList: typeof devId === 'string' ? devId.split(',').map((id) => parseInt(id.trim(), 10)) : [devId]
        };
    }
};

function formatTableRecords(menuId, records) {
    if (menuId == 1) {
        return records.map((item) => [item.id, item.name || '--', item.regionName || '--', item.substationNum || '--', item.operatorPhone || '--', item.longitude || '--', item.latitude || '--']);
    }
    if (menuId == 2) {
        return records.map((item) => [item.id, item.name || '--', item.bvName || '--', item.regionName || '--', item.groupName || '--', item.maintenanceName || '--', ['接入', '退出'][item.channelStatus] || '--']);
    }
    if (menuId == 3) {
        return records ? records : [];
    }
    return records.map((item) => [item.id, item.name || '--', item.bvName || '--', item.stName || '--', item.regionName || '--']);
}

function getDataDefData(value) {
    let dataDef = [];
    if (value == 1) {
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
                cap: '区域',
                sortable: false
            },
            {
                cap: '管辖变电站数',
                sortable: false
            },
            {
                cap: '联系方式',
                sortable: false
            },
            {
                cap: '经度',
                sortable: false
            },
            {
                cap: '纬度',
                sortable: false
            }
        ];
    } else if (value == 2) {
        dataDef = [
            {
                key: 'id',
                show: false
            },
            {
                cap: '厂站',
                sortable: false
            },
            {
                cap: '电压等级',
                sortable: false,
                formatter: formatterJameBv
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
        ];
    } else if (value == 3) {
        dataDef = [
            {
                key: 'devId',
                show: false
            },
            {
                key: 'regionName',
                cap: '地区',
                sortable: false,
                formatter: function (value) {
                    return value ? value : '--';
                }
            },
            {
                key: 'stName',
                cap: '厂站',
                sortable: false,
                formatter: function (value) {
                    return value ? value : '--';
                }
            },
            {
                key: 'bayName',
                cap: '间隔名称',
                sortable: false,
                formatter: function (value) {
                    return value ? value : '--';
                }
            },
            {
                key: 'bvName',
                cap: '电压等级',
                sortable: false,
                formatter: formatterJameBv
            },
            {
                key: 'typeDesc',
                cap: '设备类型',
                sortable: false,
                formatter: function (value) {
                    return value ? value : '--';
                }
            },
            {
                key: 'devName',
                cap: '设备名称',
                sortable: false,
                formatter: function (value) {
                    return value ? value : '--';
                }
            },
            {
                cap: '操作',
                sortable: false,
                formatter: function () {
                    return jame({
                        type: 'wrapper',
                        styles: [Styles.layout.flex({ alignItems: 'center', justifyContent: 'center' })],
                        descStyles: {
                            label: ['margin(left:s)']
                        },
                        components: [
                            {
                                type: 'label',
                                cap: '查看台账',
                                styles: [
                                    'icon.regular',
                                    Styles.label.css({
                                        color: 'hsl(210,100%,62%)',
                                        cursor: 'pointer'
                                    })
                                ],
                                onclick: function (e) {
                                    let target = findCol(e.target);
                                    const data = _model.vars.systemProgressAccessWindowTableData.find((item) => item.devId == target.col(0));
                                    if (data.pmsInfo) {
                                        let params = {
                                            ...data.pmsInfo?.assets[0],
                                            ...data.pmsInfo?.resource
                                        };
                                        params._title = `${target.col(6)}台账详情`;
                                        jam.renderModal('#main', mainEquipmentDetailsWindow(params));
                                        // createWindow({
                                        //     title: `${target.col(6)}台账详情`,
                                        //     body: mainEquipmentDetailsWindow(params),
                                        //     width: '23vw',
                                        //     height: '60vh',
                                        //     showBtn: false
                                        // });
                                    } else {
                                        nutmeg.loading('未查询到台账数据！');
                                    }
                                }
                            }
                        ]
                    });
                }
            }
        ];
    } else {
        dataDef = [
            {
                key: 'id',
                show: false
            },
            {
                cap: '地区',
                sortable: false
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
                cap: '厂站',
                sortable: false
            }
        ];
    }
    return dataDef;
}

function getUrlByValue(value) {
    const urlByMenuId = {
        1: 'getGroupListData',
        2: 'getSubListData',
        4: 'getAuxDevListData',
        5: 'getMainYcOrYxListData',
        6: 'getAuxYxListData',
        7: 'getMainYcOrYxListData',
        8: 'getAuxYcListData'
    };
    return urlByMenuId[value] || 'getJkDevInfoData';
}

function getSelectData(value) {
    let selectData = [];
    if (value == 2) {
        selectData = [
            {
                name: '全部',
                value: '-1'
            },
            {
                name: '接入',
                value: 0
            },
            {
                name: '退出',
                value: 1
            }
        ];
    }
    return selectData;
}

function getMenuList() {
    return [
        {
            name: '运维班',
            value: 1,
            tableIdList: 13351
        },
        {
            name: '厂站',
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

function getDevTypeData() {
    ajaxCall(
        'getDevTypeData',
        {
            success(data) {
                _msgr.pub(
                    'stationList',
                    (data || []).map(({ devType, devTypeDesc }) => ({ value: devType, name: devTypeDesc }))
                );
            },
            params: {
                catalog: 1
            },
            useMock: false,
            type: 'get'
        },

        false
    );
}

function getPagerParams(page) {
    const { pageNumber = 1, pageSize = 15 } = page || {};
    if ([2, 5, 6, 7, 8].includes(Number(_model.vars.menuId))) {
        return { pageNum: pageNumber, pageSize };
    }
    return { pageIndex: pageNumber, pageSize };
}
export default systemProgressCityAccessWindow;
