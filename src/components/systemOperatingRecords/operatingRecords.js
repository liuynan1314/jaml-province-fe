import { urlConfig, mockPath, findCol, layoutPageConfig } from '../../global.js';
// import { createWindow } from '../createWindow.js';
import newOperationRecords from '../modal/newOperationRecords.js';
import newBuildLog from '../modal/newBuildLog.js';
import { ajaxCall, exportExcel, formatterJameTime } from '../../common.js';
import { buildTable } from '../componentBuilder.js';
const homeConfig = layoutPageConfig?.systemOperatingRecords;
let _model, _msgr, _this;
const operatingRecords = (page = 0) => {
    const layout = homeConfig?.[page] || {};
    const components = layout.elements.find((element) => {
        return element.id == 'operatingRecords';
    });
    return {
        type: 'wrapper',
        id: 'operatingRecords',
        styles: [
            'size.fullsize',
            Styles.layout.gridpos(components.pos),
            Styles.stylesheet({
                ':scope': {
                    'box-sizing': 'border-box'
                },
                '.chart-box': {
                    display: 'flex',
                    'flex-direction': 'column'
                }
            }),
            Styles.layout.grid({ cols: 16, rows: 10, gap: 's' })
        ],
        components: [
            {
                type: 'wrapper',
                styles: [Styles.layout.gridpos(1, 1, 16, 1), 'props(justify-content:space-between;margin-bottom:s)'],
                indicatorStyles: [
                    'icon.regular',
                    Styles.css({
                        border: 's solid var(--jam-color-outline-muted) !important',
                        boxShadow: 's',
                        borderRadius: 's',
                        cursor: 'pointer',
                        width: '15%',
                        padding: 's 0'
                    }),
                    Styles.stylesheet({
                        '.jam-main-cap': {
                            fontSize: 'm'
                        },
                        '.jam-main-value': {
                            fontSize: 'l'
                        }
                    })
                ],
                components: jaml.var('infoData', function (val) {
                    return val.map((item) => {
                        return {
                            type: '1DataHasBigIconAndSubTitle',
                            props: {
                                title: item.name,
                                subtitle: '',
                                hasSubtitle: false,
                                unit: '条',
                                dataType: 'analog',
                                icon: item.icon,
                                valueType: 'number',
                                hasIcon: true,
                                toFixed: false,
                                decimalPos: 2
                            },
                            vars: {
                                data: {
                                    value: item.value
                                }
                            },
                            styles: ['1DataHasBigIconAndSubTitle.basic'],
                            onclick: function (e) {
                                _msgr.pub('defectType', item.defectType);
                                _msgr.pub('feedbackType', item.feedbackType);
                                getRecordTableData();
                            }
                        };
                    });
                })
            },
            {
                type: 'wrapper',
                styles: [Styles.layout.gridpos(1, 2, 16, 1)],
                components: [
                    {
                        type: 'wrapper',
                        childStyles: ['icon.regular', 'padding(0 xs 0 0)'],
                        descStyles: {
                            button: [Styles.searchBtnsStyles, 'margin(right:s)'],
                            datepicker: [Styles.datepicker.regularStyle, 'datepicker.labelslot.margin(0)', Styles.css({ minWidth: '19.2rem' })],
                            select: [Styles.select.regularStyle, 'select.labelslot.margin(0)', Styles.css({ minWidth: '19.2rem' })]
                        },
                        styles: ['css(flexWrap:wrap;margin-bottom:s;alignItems:center)'],
                        components: [
                            {
                                type: 'input',
                                valueKey: 'content',
                                icon: 'calendar',
                                cap: '运维标题：',
                                styles: [Styles.input.regularStyle, 'input.labelslot.margin(0)']
                            },
                            {
                                type: 'select',
                                cap: '反馈类型：',
                                valueKey: 'feedbackType',
                                icon: 'bars',
                                defaultValue: '',
                                data: [
                                    {
                                        name: '系统问题',
                                        value: 1
                                    },
                                    {
                                        name: '需求反馈',
                                        value: 2
                                    }
                                ],
                                onvaluechange: function (value) {
                                    _msgr.pub('feedbackType', value);
                                }
                            },
                            {
                                type: 'select',
                                cap: '缺陷类型：',
                                valueKey: 'defectType',
                                icon: 'bars',
                                defaultValue: '',
                                showIf: '{{feedbackType}} == "1"',
                                data: [
                                    {
                                        name: '人机界面缺陷',
                                        value: 1
                                    },
                                    {
                                        name: '软件缺陷',
                                        value: 2
                                    },
                                    {
                                        name: '硬件缺陷',
                                        value: 3
                                    },
                                    {
                                        name: '告警信息缺陷',
                                        value: 4
                                    },
                                    {
                                        name: '其它缺陷',
                                        value: 5
                                    }
                                ]
                            },
                            {
                                type: 'select',
                                cap: '状态：',
                                icon: 'list',
                                valueKey: 'status',
                                defaultValue: '',
                                data: [
                                    {
                                        name: '待分配',
                                        value: 1
                                    },
                                    {
                                        name: '已确认',
                                        value: 2
                                    },
                                    {
                                        name: '处理中',
                                        value: 3
                                    },
                                    {
                                        name: '已解决',
                                        value: 4
                                    },
                                    {
                                        name: '已归档',
                                        value: 5
                                    }
                                ]
                            },
                            {
                                type: 'filterSelect',
                                class: 'unifycap',
                                props: { cap: '负责人：', data: '{{recorduserlist}}', search: '{{recordname}}', select: '{{ownerId}}', icon: 'user' },
                                watchers: {
                                    async recordname(val) {
                                        if (!val || val.length == 0) _msgr.pub('ownerId', '');
                                        getUserList(val);
                                    }
                                },
                                styles: [Styles.input.regularStyle, 'filterSelect.labelslot.margin(0)']
                            },
                            {
                                type: 'datepicker',
                                valueKey: 'startDate',
                                // defaultValue: moment().subtract(1, 'month').format('YYYY-MM-DD'),
                                icon: 'clock',
                                cap: '开始时间：'
                            },
                            {
                                type: 'datepicker',
                                valueKey: 'endDate',
                                // defaultValue: moment().format('YYYY-MM-DD'),
                                icon: 'clock',
                                cap: '结束时间：'
                            },
                            {
                                type: 'button',
                                class: 'jam-cta',
                                icon: 'magnifying-glass',
                                cap: '查询',
                                onclick: function () {
                                    _model.tPageNo = 1;
                                    getRecordTableData();
                                }
                            },
                            {
                                type: 'button',
                                cap: '重置',
                                icon: 'rotate-right',
                                onclick: function () {
                                    _msgr.pub('content', '');
                                    _msgr.pub('recordname', '');
                                    _msgr.pub('ownerId', '');
                                    _msgr.pub('status', '');
                                    _msgr.pub('feedbackType', '');
                                    _msgr.pub('defectType', '');
                                    _model.tPageNo = 1;
                                    getUserList();
                                    getRecordTableData();
                                }
                            },
                            {
                                type: 'button',
                                icon: 'plus',
                                cap: '新增',
                                onclick: function () {
                                    let params = {
                                        statusName: '待分配',
                                        detailId: '',
                                        key_ownerName: ''
                                    };
                                    jam.renderModal('#main', newBuildLog({ title: '新增', ...params }));
                                }
                            }
                        ]
                    }
                ]
            },
            {
                type: 'wrapper',
                class: 'table-box',
                styles: [Styles.layout.gridpos(1, 3, 16, 8)],
                components: [
                    buildTable({
                        cap: '运维记录-表格',
                        icon: 'table',
                        dataDef: [
                            {
                                cap: 'id',
                                key: 'idStr',
                                show: false
                            },
                            {
                                cap: '区域',
                                key: 'regionName',
                                sortable: false
                            },
                            {
                                cap: '运维标题',
                                key: 'content',
                                sortable: false,
                                align: 'left',
                                class: 'item-content',
                                formatter: function (value) {
                                    return value ? value : '---';
                                }
                            },
                            {
                                cap: '反馈类型',
                                key: 'feedbackTypeName',
                                sortable: false,
                                formatter: function (value) {
                                    return value ? value : '---';
                                }
                            },
                            {
                                cap: '缺陷类型',
                                key: 'defectTypeName',
                                sortable: false
                            },
                            {
                                cap: '运维内容',
                                key: 'describe',
                                sortable: false,
                                align: 'left',
                                styles: [Styles.toShowAll],
                                formatter: function (value) {
                                    return value ? value : '---';
                                }
                            },
                            {
                                cap: '状态',
                                key: 'statusName',
                                sortable: false
                            },
                            {
                                cap: '负责人',
                                key: 'ownerName',
                                sortable: false,
                                formatter: function (value) {
                                    return value ? value : '---';
                                }
                            },
                            {
                                cap: '创建人',
                                key: 'createUserName',
                                sortable: false,
                                formatter: function (value) {
                                    return value ? value : '---';
                                }
                            },
                            {
                                cap: '创建时间',
                                key: 'gmtCreateTime',
                                sortable: false,
                                formatter: formatterJameTime
                            },
                            {
                                cap: '操作',
                                key: 'statusName',
                                sortable: false,
                                width: '10%',
                                styles: [Styles.toShowAll],
                                descStyles: {
                                    label: [
                                        'icon.regular',
                                        'css(cursor:pointer)',
                                        Styles.stylesheet({
                                            '[slot=icon]': {
                                                margin: 'xs'
                                            }
                                        })
                                    ]
                                },
                                formatter: function (value) {
                                    if (value == '待分配') {
                                        return jame({
                                            type: 'wrapper',
                                            styles: [Styles.layout.flex({ alignItems: 'center', justifyContent: 'center' })],
                                            components: [
                                                {
                                                    type: 'label',
                                                    tip: '编辑',
                                                    icon: 'pen',
                                                    onclick: function (e) {
                                                        let target = findCol(e.target);
                                                        const key_factor = target.col(0);
                                                        const key_ownerName = target.col(7);
                                                        let params = {
                                                            statusName: value,
                                                            detailId: key_factor,
                                                            key_ownerName: key_ownerName
                                                        };
                                                        jam.renderModal('#main', newBuildLog({ title: '编辑', ...params }));
                                                    }
                                                },
                                                {
                                                    type: 'label',
                                                    tip: '确认',
                                                    icon: 'circle-check',
                                                    onclick: function (e) {
                                                        jam.popupYesNo(
                                                            e.target,
                                                            '<span style="white-space:nowrap">确定执行此操作吗?</span>',
                                                            () => {
                                                                let target = findCol(e.target);
                                                                const fac_key = target.col(7);
                                                                const fac_id = target.col(0);
                                                                _msgr.pub('command', 1);
                                                                if (fac_key) {
                                                                    getRecordCommand(fac_id);
                                                                } else {
                                                                    nutmeg.warn('请选择相应负责人');
                                                                }
                                                            },
                                                            () => {}
                                                        );
                                                    }
                                                },
                                                {
                                                    type: 'label',
                                                    tip: '删除',
                                                    icon: 'trash-can',
                                                    onclick: function (e) {
                                                        jam.popupYesNo(
                                                            e.target,
                                                            '<span style="white-space:nowrap">确定执行此操作吗?</span>',
                                                            () => {
                                                                let target = findCol(e.target);
                                                                const key_factor = target.col(0);
                                                                getDelteTable(key_factor);
                                                            },
                                                            () => {}
                                                        );
                                                    }
                                                }
                                            ]
                                        });
                                    } else if (value == '已确认') {
                                        return jame({
                                            type: 'wrapper',
                                            styles: [Styles.layout.flex({ alignItems: 'center', justifyContent: 'center' })],
                                            components: [
                                                {
                                                    type: 'label',
                                                    tip: '编辑',
                                                    icon: 'pen',
                                                    onclick: function (e) {
                                                        let target = findCol(e.target);
                                                        const key_factor = target.col(0);
                                                        const key_ownerName = target.col(7);
                                                        let params = {
                                                            statusName: value,
                                                            detailId: key_factor,
                                                            key_ownerName: key_ownerName
                                                        };
                                                        jam.renderModal('#main', newBuildLog({ title: '编辑', ...params }));
                                                    }
                                                },

                                                {
                                                    type: 'label',
                                                    tip: '运维日志',
                                                    icon: 'file-pen',
                                                    onclick: function (e) {
                                                        let target = findCol(e.target);
                                                        const key_factor = target.col(0);
                                                        let params = {
                                                            id: key_factor,
                                                            statusName: value,
                                                            type: ''
                                                        };
                                                        jam.renderModal('#main', newOperationRecords({ title: '日志维护', ...params }));
                                                    }
                                                },
                                                {
                                                    type: 'label',
                                                    tip: '删除',
                                                    icon: 'trash-can',
                                                    onclick: function (e) {
                                                        jam.popupYesNo(
                                                            e.target,
                                                            '<span style="white-space:nowrap">确定执行此操作吗?</span>',
                                                            () => {
                                                                let target = findCol(e.target);
                                                                const key_factor = target.col(0);
                                                                getDelteTable(key_factor);
                                                            },
                                                            () => {}
                                                        );
                                                    }
                                                }
                                            ]
                                        });
                                    } else if (value == '处理中') {
                                        return jame({
                                            type: 'wrapper',
                                            styles: [Styles.layout.flex({ alignItems: 'center', justifyContent: 'center' })],
                                            components: [
                                                {
                                                    type: 'label',
                                                    tip: '编辑',
                                                    icon: 'pen',
                                                    onclick: function (e) {
                                                        let target = findCol(e.target);
                                                        const key_factor = target.col(0);
                                                        const key_ownerName = target.col(7);
                                                        // const statusName = target.col(5);
                                                        let params = {
                                                            statusName: value,
                                                            detailId: key_factor,
                                                            key_ownerName: key_ownerName
                                                        };
                                                        jam.renderModal('#main', newBuildLog({ title: '编辑', ...params }));
                                                    }
                                                },
                                                {
                                                    type: 'label',
                                                    tip: '运维日志',
                                                    icon: 'file-pen',
                                                    onclick: function (e) {
                                                        let target = findCol(e.target);
                                                        const key_factor = target.col(0);
                                                        let params = {
                                                            id: key_factor,
                                                            statusName: value,
                                                            type: ''
                                                        };
                                                        jam.renderModal('#main', newOperationRecords({ title: '日志维护', ...params }));
                                                    }
                                                },
                                                {
                                                    type: 'label',
                                                    tip: '解决',
                                                    icon: 'check-to-slot',
                                                    onclick: function (e) {
                                                        jam.popupYesNo(
                                                            e.target,
                                                            '<span style="white-space:nowrap">确定执行此操作吗?</span>',
                                                            () => {
                                                                let target = findCol(e.target);
                                                                const fac_id = target.col(0);
                                                                _msgr.pub('command', 3);
                                                                getRecordCommand(fac_id);
                                                            },
                                                            () => {}
                                                        );
                                                    }
                                                }
                                            ]
                                        });
                                    } else if (value == '已解决') {
                                        return jame({
                                            type: 'wrapper',
                                            styles: [Styles.layout.flex({ alignItems: 'center', justifyContent: 'center' })],
                                            components: [
                                                {
                                                    type: 'label',
                                                    tip: '运维日志',
                                                    icon: 'file-pen',
                                                    onclick: function (e) {
                                                        let target = findCol(e.target);
                                                        const key_factor = target.col(0);
                                                        let params = {
                                                            id: key_factor,
                                                            statusName: value,
                                                            type: ''
                                                        };
                                                        jam.renderModal('#main', newOperationRecords({ title: '日志维护', ...params }));
                                                    }
                                                },

                                                {
                                                    type: 'label',
                                                    tip: '归档',
                                                    icon: 'folder-closed',
                                                    onclick: function (e) {
                                                        jam.popupYesNo(
                                                            e.target,
                                                            '<span style="white-space:nowrap">确定执行此操作吗?</span>',
                                                            () => {
                                                                let target = findCol(e.target);
                                                                const fac_id = target.col(0);
                                                                _msgr.pub('command', 4);
                                                                getRecordCommand(fac_id);
                                                            },
                                                            () => {}
                                                        );
                                                    }
                                                }
                                            ]
                                        });
                                    } else if (value == '已归档') {
                                        return jame({
                                            type: 'wrapper',
                                            styles: [Styles.layout.flex({ alignItems: 'center', justifyContent: 'center' })],
                                            components: [
                                                {
                                                    type: 'label',
                                                    tip: '运维日志',
                                                    icon: 'file-pen',
                                                    onclick: function (e) {
                                                        let target = findCol(e.target);
                                                        const key_factor = target.col(0);
                                                        let params = {
                                                            id: key_factor,
                                                            statusName: value,
                                                            type: ''
                                                        };
                                                        jam.renderModal('#main', newOperationRecords({ title: '日志维护', ...params }));
                                                    }
                                                }
                                            ]
                                        });
                                    }
                                }
                            }
                        ],
                        getReqParams: function () {
                            const _params = getParams();
                            return {
                                method: 'post',
                                data: {
                                    pageIndex: this.model.cpageNo || 1,
                                    pageSize: this.model.cpageSize || 20,
                                    ..._params
                                },
                                url: urlConfig.getRecordPage.url,
                                mock: mockPath + urlConfig.getRecordPage.mock,
                                headers: {
                                    'Content-Type': 'application/json',
                                    userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
                                },
                                transform: (res) => {
                                    const { list = [], pojoTotalCount = 0 } = res?.data || {};
                                    this.model.ctotal = pojoTotalCount;
                                    return list;
                                }
                            };
                        }
                    })
                ]
            }
        ],
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
            _this = this;
        },
        onafterrender: function () {
            getUserList();
            getTotalData();
            // _msgr.pub('startDate', moment().subtract(1, 'month').format('YYYY-MM-DD'));
            // _msgr.pub('endDate', moment().format('YYYY-MM-DD'));
            getRecordTableData();
        },
        onunmount() {}
    };
};

// 获取运维人员下拉框接口
function getUserList(val) {
    jam.ajaxCall({
        urlKey: 'getIscUser',
        data: {
            name: val || ''
        },
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess(result) {
            const { data } = result;
            _msgr.pub(
                'recorduserlist',
                data?.map((item) => ({ name: item.name, value: item.id }))
            );
        }
    });
}

function getRecordCommand(fac_id) {
    let _params = {};
    if (fac_id) {
        _params.id = fac_id;
    } else {
        _params.id = _msgr.get('detailId');
    }
    _params.command = _msgr.get('command');
    jam.ajaxCall({
        urlKey: 'getRecordCommand',
        data: _params,
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess(result) {
            if (_params.command == 1) {
                nutmeg.success('确认成功');
            } else if (_params.command == 2) {
                nutmeg.success('日志维护成功');
            } else if (_params.command == 3) {
                nutmeg.success('解决成功');
            } else if (_params.command == 4) {
                nutmeg.success('归档成功');
            }
            _msgr.pub('detailId', '');
            getRecordTableData();
        }
    });
}

// 删除
function getDelteTable(id) {
    let _params = [];
    if (Array.isArray(id)) {
        _params = id; // 如果是数组直接赋值
    } else {
        _params.push(id); // 如果是字符串则push
    }
    jam.ajaxCall({
        urlKey: 'getRecordDelete',
        data: _params,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess(result) {
            nutmeg.success('删除成功');
            getRecordTableData();
            getTotalData();
        }
    });
}

function getParams() {
    let params = {
        content: _msgr.get('content'),
        startDate: _msgr.get('startDate'),
        endDate: _msgr.get('endDate'),
        feedbackType: _msgr.get('feedbackType'),
        defectType: _msgr.get('defectType'),
        status: _msgr.get('status'),
        ownerId: _msgr.get('ownerId')
    };

    ajaxCall(
        'getRecordConfig',
        {
            success(res) {
                params.regionId = res.regionId;
                params.dataScope = res.dataScope;
            }
        },
        false
    );
    return params;
}

export function getRecordTableData() {
    _this.msgr('page').pub('_t', Date.now());
}

// 获取统计信息数据
export function getTotalData() {
    jam.ajaxCall({
        urlKey: 'getRecordCount',
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess(result) {
            const { data } = result;
            let _infoData = [
                {
                    name: '需求反馈',
                    icon: 'comment',
                    value: data.xqfk,
                    defectType: '',
                    feedbackType: 2
                },
                {
                    name: '人机界面缺陷',
                    icon: 'laptop',
                    value: data.xtwt.rjjmqx,
                    defectType: 1,
                    feedbackType: 1
                },
                {
                    name: '软件缺陷',
                    icon: 'file-waveform',
                    value: data.xtwt.rjqx,
                    defectType: 2,
                    feedbackType: 1
                },
                {
                    name: '硬件缺陷',
                    icon: 'sim-card',
                    value: data.xtwt.yjqx,
                    defectType: 3,
                    feedbackType: 1
                },
                {
                    name: '告警信息缺陷',
                    icon: 'circle-exclamation',
                    value: data.xtwt.gjxxqx,
                    defectType: 4,
                    feedbackType: 1
                },
                {
                    name: '其他缺陷',
                    icon: 'folder-xmark',
                    value: data.xtwt.qtlqx,
                    defectType: 5,
                    feedbackType: 1
                }
            ];
            _model.vars.infoData = _infoData;
        }
    });
}
export default operatingRecords;
