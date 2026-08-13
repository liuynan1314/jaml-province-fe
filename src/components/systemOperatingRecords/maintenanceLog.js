import { urlConfig, findCol, layoutPageConfig } from '../../global.js';
import { ajaxCall, formatterJameTime } from '../../common.js';
// import { createWindow } from '../createWindow.js';
import addLog from '../modal/addLog.js';
let _model, _msgr;
const homeConfig = layoutPageConfig?.systemOperatingRecords;
const maintenanceLog = (page = 0) => {
    const layout = homeConfig?.[page] || {};
    const components = layout.elements.find((element) => {
        return element.id == 'maintenanceLog';
    });

    return {
        type: 'wrapper',
        class: 'maintenanceLog',
        styles: ['size.fullsize', Styles.layout.gridpos(components.pos), Styles.layout.grid({ cols: 16, rows: 16, gap: `0.5rem` })],
        components: [
            {
                type: 'wrapper',
                class: 'form-box',
                styles: [Styles.layout.gridpos(1, 1, 16, 1)],
                components: [
                    {
                        type: 'wrapper',
                        class: 'form-item',
                        styles: ['css(alignItems:center)'],
                        childStyles: ['margin(right:0.5rem;bottom:0rem;)', 'icon.regular'],
                        descStyles: {
                            button: [Styles.searchBtnsStyles],
                            input: [Styles.input.regularStyle, 'input.labelslot.margin(0)']
                        },
                        components: [
                            {
                                type: 'input',
                                valueKey: 'logContent',
                                defaultValue: '',
                                icon: 'calendar',
                                cap: '日志内容：'
                            },
                            {
                                type: 'input',
                                valueKey: 'opsContent',
                                defaultValue: '',
                                cap: '运维标题：',
                                icon: 'calendar'
                            },
                            {
                                type: 'filterSelect',
                                class: 'unifycap',
                                props: { cap: '运维人员：', data: '{{userlist}}', search: '{{name}}', select: '{{opsUserId}}', icon: 'user' },
                                watchers: {
                                    async name(val) {
                                        if (val.length == 0) _msgr.pub('opsUserId', '');
                                        getUserList(val);
                                    }
                                },
                                styles: [Styles.input.regularStyle, 'filterSelect.labelslot.margin(0)']
                            },
                            {
                                type: 'button',
                                class: 'btn jam-cta',
                                cap: '查询',
                                icon: 'magnifying-glass',
                                onclick: function () {
                                    _model.tPageNo = 1;
                                    getMaintenanceLogTableData();
                                }
                            },
                            {
                                type: 'button',
                                cap: '重置',
                                class: 'btn reset-btn',
                                icon: 'rotate-right',
                                onclick: function () {
                                    _msgr.pub('logContent', '');
                                    _msgr.pub('opsContent', '');
                                    _msgr.pub('opsUserId', '');
                                    _msgr.pub('name', '');
                                    _model.tPageNo = 1;
                                    getMaintenanceLogTableData();
                                }
                            },
                            {
                                type: 'button',
                                cap: '新增',
                                icon: 'plus',
                                styles: [Styles.searchBtnsStyles, Styles.props({ marginTop: 'xs' })],
                                onclick: function () {
                                    let params = {
                                        key_factor: '',
                                        key_opsUserName: '',
                                        key_content: '',
                                        key_opsTime: '',
                                        key_opsUserIdStr: '',
                                        tabType: 3
                                    };
                                    jam.renderModal('#main', addLog({ title: '运维日志新增', ...params }));
                                }
                            },
                            {
                                type: 'button',
                                cap: '删除',
                                icon: 'trash-can',
                                styles: [Styles.searchBtnsStyles, Styles.props({ marginTop: 'xs' })],
                                onclick: function (e) {
                                    jam.popupYesNo(
                                        e.target,
                                        '<span style="white-space:nowrap">确定执行此操作吗?</span>',
                                        () => {
                                            let idList = _model.vars.selectedRows;
                                            if (!idList.length) {
                                                nutmeg.warn('请先勾选需要删除的运维人员！');
                                                return;
                                            }
                                            getDelteTable(idList);
                                        },
                                        () => {}
                                    );
                                }
                            }
                        ]
                    }
                ]
            },
            {
                type: 'wrapper',
                styles: [Styles.layout.gridpos(1, 2, 16, 15)],
                components: [
                    {
                        type: 'tableWithPage',
                        subType: 'checkbox',
                        click2Check: true,
                        valueIndex: 0,
                        value: '{{selectedRows}}',
                        styles: ['tableWithPage.basic', Styles.hover.toShowAll({ selector: '.jam-td' }), Styles.size.fullsize, Styles.css({ padding: 0 }), 'table.th.css(whiteSpace:nowrap;minHeight:2.5rem;)'],
                        descStyles: {
                            '.item-content': ['css(overflow:hidden;white-space:nowrap;text-overflow:ellipsis)']
                        },
                        props: {
                            cpageNo: '{{tPageNo}}',
                            ctotal: '{{tTotal}}',
                            cpageSize: '{{tPageSize}}',
                            cpageHide: { pageSize: false },
                            dataDef: [
                                {
                                    cap: 'id',
                                    key: 'idStr',
                                    show: false
                                },
                                {
                                    cap: '日志内容',
                                    key: 'content',
                                    sortable: false,
                                    align: 'left',
                                    class: 'item-content',
                                    formatter: function (value) {
                                        return value ? value : '---';
                                    }
                                },
                                {
                                    cap: '运维标题',
                                    key: 'opsContent',
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
                                    cap: '状态',
                                    key: 'statusName',
                                    sortable: false
                                },
                                {
                                    cap: '运维人员',
                                    key: 'opsUserName',
                                    sortable: false,
                                    formatter: function (value) {
                                        return value ? value : '---';
                                    }
                                },
                                {
                                    cap: '联系方式',
                                    key: 'tel',
                                    sortable: false,
                                    formatter: function (value) {
                                        return value ? value : '---';
                                    }
                                },

                                {
                                    cap: '运维时间',
                                    key: 'opsTime',
                                    sortable: false,
                                    formatter: formatterJameTime
                                },
                                {
                                    cap: 'id',
                                    key: 'opsUserIdStr',
                                    show: false
                                },
                                {
                                    cap: 'id',
                                    key: 'opsRecordId',
                                    show: false
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
                                    formatter: function (value) {
                                        if (value == '待分配' || value == '已确认' || value == '处理中' || value == null) {
                                            return jame({
                                                type: 'wrapper',
                                                styles: [Styles.layout.flex({ alignItems: 'center', justifyContent: 'center' })],
                                                descStyles: {
                                                    label: [
                                                        'icon.regular',
                                                        'css(cursor:pointer)',
                                                        Styles.stylesheet({
                                                            '[slot=icon]': {
                                                                margin: 's'
                                                            }
                                                        })
                                                    ]
                                                },
                                                components: [
                                                    {
                                                        type: 'label',
                                                        tip: '编辑',
                                                        icon: 'pen',
                                                        onclick: function (e) {
                                                            let target = findCol(e.target);
                                                            const key_factor = target.col(0);
                                                            const key_opsUserName = target.col(6);
                                                            const key_content = target.col(1);
                                                            const key_opsTime = target.col(8);
                                                            const key_opsUserIdStr = target.col(9);
                                                            const key_opsRecordId = target.col(10);
                                                            let params = {
                                                                key_factor: key_factor,
                                                                key_opsUserName: key_opsUserName,
                                                                key_content: key_content,
                                                                key_opsTime: key_opsTime,
                                                                key_opsUserIdStr: key_opsUserIdStr,
                                                                key_opsRecordId: key_opsRecordId,
                                                                tabType: 3
                                                            };
                                                            jam.renderModal('#main', addLog({ title: '运维日志编辑', ...params }));
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
                                                                    getDelteTable([key_factor]);
                                                                },
                                                                () => {}
                                                            );
                                                        }
                                                    }
                                                ]
                                            });
                                        }
                                    }
                                }
                            ],
                            pageSizeList: [
                                { value: 20, name: '20条/页' },
                                { value: 30, name: '30条/页' },
                                { value: 50, name: '50条/页' },
                                { value: 100, name: '100条/页' }
                            ]
                        },
                        data: '{{autoLogTableData}}'
                    }
                ]
            }
        ],
        vars: {
            tPageNo: 1,
            tPageSize: 20,
            tTotal: 0,
            autoLogTableData: [],
            selectedRows: []
        },
        watchers: [
            {
                debounce: 300,
                init: false,
                keys: ['tPageSize', 'tPageNo'],
                callback() {
                    getMaintenanceLogTableData();
                }
            }
        ],
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
        },
        onafterrender: function () {
            getUserList();
            // getMaintenanceLogTableData();
        },
        onunmount() {}
    };
};

// 获取运维人员下拉框接口
function getUserList(val) {
    jam.ajaxCall({
        urlKey: 'getUserListData',
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
                'userlist',
                data?.map((item) => ({ name: item.name, value: item.id }))
            );
        }
    });
}

function getDelteTable(idList) {
    jam.ajaxCall({
        urlKey: 'getLogDelete',
        method: 'post',
        data: idList,
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess(result) {
            nutmeg.success('删除成功');
            getMaintenanceLogTableData();
        }
    });
}

export function getMaintenanceLogTableData(type = null) {
    let _params = {
        pageIndex: _model.tPageNo || 1,
        pageSize: _model.tPageSize || 20,
        logContent: _msgr.get('logContent') ? _msgr.get('logContent') : '',
        opsContent: _msgr.get('opsContent') ? _msgr.get('opsContent') : '',
        opsUserId: _msgr.get('opsUserId') == undefined ? '' : _msgr.get('opsUserId')
    };
    if (type == 'add') {
        _params.pageIndex = 1;
    }

    jam.ajaxCall({
        urlKey: 'getLogPage',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        data: _params,
        onsuccess(result) {
            const { data } = result;
            const { list = [], pageIndex = 1, pojoTotalCount = 20 } = data;
            _model.tPageNo = pageIndex;
            _model.tTotal = pojoTotalCount;
            _model.autoLogTableData = list;
            _model.vars.selectedRows = [];
        }
    });
}
export default maintenanceLog;
