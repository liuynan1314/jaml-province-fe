import { urlConfig, findCol, layoutPageConfig } from '../../global.js';
import { formatterJameTime } from '../../common.js';
import addStaff from '../modal/addStaff.js';
let _model, _msgr;
const homeConfig = layoutPageConfig?.systemOperatingRecords;
const maintenancePersonnel = (page = 0) => {
    const layout = homeConfig?.[page] || {};
    const components = layout.elements.find((element) => {
        return element.id == 'maintenancePersonnel';
    });
    return {
        type: 'wrapper',
        id: 'maintenancePersonnel',
        styles: [
            'size.fullsize',
            Styles.layout.gridpos(components.pos),
            Styles.stylesheet({
                ':scope': {
                    'box-sizing': 'border-box'
                }
            }),
            Styles.layout.grid({ cols: 16, rows: 16, gap: `0.5rem` })
        ],
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
                                valueKey: 'name',
                                cap: '姓名：',
                                icon: 'user'
                            },
                            {
                                type: 'input',
                                valueKey: 'phoneNumber',
                                icon: 'address-book',
                                cap: '联系方式：'
                            },
                            {
                                type: 'button',
                                class: 'jam-cta',
                                icon: 'magnifying-glass',
                                cap: '查询',
                                onclick: function () {
                                    _model.tPageNo = 1;
                                    getMaintenanceTableData();
                                }
                            },
                            {
                                type: 'button',
                                cap: '重置',
                                icon: 'rotate-right',
                                onclick: function () {
                                    _msgr.pub('name', '');
                                    _msgr.pub('phoneNumber', '');
                                    _model.tPageNo = 1;
                                    getMaintenanceTableData();
                                }
                            },
                            {
                                type: 'button',
                                cap: '同步',
                                icon: 'solar-system',
                                onclick: function () {
                                    getUserSync();
                                }
                            },
                            {
                                type: 'button',
                                cap: '新增',
                                icon: 'plus',
                                onclick: function () {
                                    jam.renderModal('#main', addStaff({ title: '运维人员新增', keyId: '' }));
                                }
                            },
                            {
                                type: 'button',
                                cap: '删除',
                                icon: 'trash-can',
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
                class: 'table-box',
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
                                    cap: '姓名',
                                    key: 'name',
                                    sortable: false
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
                                    cap: '是否平台用户',
                                    key: 'iscId',
                                    sortable: false,
                                    formatter: function (value) {
                                        if (value) {
                                            return '是';
                                        } else {
                                            return '否';
                                        }
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
                                    cap: '备注',
                                    key: 'remark',
                                    sortable: false,
                                    formatter: function (value) {
                                        return value ? value : '---';
                                    }
                                },
                                {
                                    cap: '操作',
                                    key: 'status',
                                    sortable: false,
                                    formatter: function (value) {
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
                                                        jam.renderModal('#main', addStaff({ title: '运维人员详情', keyId: key_factor }));
                                                    }
                                                },
                                                {
                                                    type: 'label',
                                                    // tip: '删除',
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
                            ],
                            pageSizeList: [
                                { value: 20, name: '20条/页' },
                                { value: 30, name: '30条/页' },
                                { value: 50, name: '50条/页' },
                                { value: 100, name: '100条/页' }
                            ]
                        },
                        data: '{{maintenanceTableData}}'
                    }
                ]
            }
        ],
        vars: {
            tPageNo: 1,
            tPageSize: 20,
            tTotal: 0,
            maintenanceTableData: [],
            selectedRows: []
        },
        watchers: [
            {
                debounce: 300,
                init: false,
                keys: ['tPageSize', 'tPageNo'],
                callback() {
                    getMaintenanceTableData();
                }
            }
        ],
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
        },
        onafterrender: function () {
            // getMaintenanceTableData();
        }
    };
};

export default maintenancePersonnel;

// 同步接口
function getUserSync() {
    jam.ajaxCall({
        urlKey: 'getUserSync',
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess(result) {
            nutmeg.success('同步成功');
            getMaintenanceTableData();
        }
    });
}

function getDelteTable(idList) {
    jam.ajaxCall({
        urlKey: 'getUserDelete',
        method: 'post',
        data: idList,
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess(result) {
            nutmeg.success('删除成功');
            getMaintenanceTableData();
        }
    });
}

export function getMaintenanceTableData(type = null) {
    let _params = {
        pageIndex: _model.tPageNo || 1,
        pageSize: _model.tPageSize || 20,
        name: _msgr.get('name'),
        tel: _msgr.get('phoneNumber')
    };
    if (type) {
        _params.pageIndex = 1;
    }
    jam.ajaxCall({
        urlKey: 'getUserPage',
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
            _model.maintenanceTableData = list;
            _model.vars.selectedRows = [];
        }
    });
}
