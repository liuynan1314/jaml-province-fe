import { findCol } from '../../global.js';
import { ajaxCall, formatterJameTime } from '../../common.js';
// import { createWindow } from '../createWindow.js';
import addLog from '../modal/addLog.js';
let _model, _msgr;
let recordId, recordType;
const newOperationRecords = (params) => {
    recordId = params.id;
    recordType = params.type;
    return {
        type: 'card',
        icon: '',
        class: 'newOperationRecordsId',
        cap: params.title,
        styles: [
            Styles.card.floating({
                width: '60vw',
                height: '60vh'
            }),
            Styles.stylesheet({
                '.form-wrapper': {
                    marginBottom: 'm'
                }
            })
        ],
        components: [
            {
                type: 'container',
                styles: ['size.fullsize', 'props(display:flex;flexDirection:column)'],
                descStyles: { '*': [Styles.icon.duotone] },
                components: [
                    {
                        type: 'wrapper',
                        class: 'form-wrapper',
                        components: [
                            {
                                type: 'input',
                                valueKey: 'logContent',
                                defaultValue: '',
                                icon: 'calendar',
                                cap: '日志内容：',
                                styles: [Styles.input.regularStyleNew, 'input.labelslot.margin(0)']
                            },
                            {
                                type: 'select',
                                cap: '运维人员：',
                                valueKey: 'opsUserId',
                                icon: 'user',
                                defaultValue: '',
                                dataWatcher: 'userlist',

                                styles: [Styles.select.regularStyleNew, 'select.labelslot.margin(0)']
                            },
                            {
                                type: 'button',
                                class: 'btn jam-cta',
                                cap: '查询',
                                icon: 'magnifying-glass',
                                styles: [Styles.searchBtnsStyles, Styles.props({ marginTop: 'xs' })],
                                onclick: function () {
                                    getParamsSettingData();
                                }
                            },
                            params.statusName != '已解决' && params.statusName != '已归档'
                                ? {
                                      type: 'button',
                                      class: 'btn jam-cta',
                                      icon: 'plus',

                                      styles: [Styles.searchBtnsStyles, Styles.props({ marginTop: 'xs' })],
                                      cap: '新增',
                                      onclick: function () {
                                          if (params.statusName == '已解决' || params.statusName == '已归档') {
                                              nutmeg.info('该记录不支持进行操作！');
                                          } else {
                                              _msgr.pub('addname', '');
                                              _msgr.pub('opsRecordId', params.id);
                                              let paramsData = {
                                                  key_factor: '',
                                                  key_opsUserName: '',
                                                  key_content: '',
                                                  key_opsTime: '',
                                                  key_opsUserIdStr: '',
                                                  key_opsRecordId: params.id,
                                                  tabType: 2
                                              };
                                              jam.renderModal('#main', addLog({ title: '运维日志新增', ...paramsData }));
                                          }
                                      }
                                  }
                                : null,
                            params.statusName != '已解决' && params.statusName != '已归档'
                                ? {
                                      type: 'button',
                                      class: 'btn jam-cta',
                                      icon: 'trash-can',

                                      styles: [Styles.searchBtnsStyles, Styles.props({ marginTop: 'xs' })],
                                      cap: '删除',
                                      onclick: function (e) {
                                          let selectRows = _model.selectRows || [];
                                          if (params.statusName == '已解决' || params.statusName == '已归档') {
                                              nutmeg.info('该记录不支持进行操作！');
                                          } else {
                                              jam.popupYesNo(
                                                  e.target,
                                                  '<span style="white-space:nowrap">确定执行此操作吗?</span>',
                                                  () => {
                                                      if (!selectRows.length) {
                                                          nutmeg.warn('请先勾选需要删除的记录！');
                                                          return;
                                                      }
                                                      getDelteTable(selectRows);
                                                  },
                                                  () => {}
                                              );
                                          }
                                      }
                                  }
                                : null
                        ]
                    },
                    {
                        type: 'tableWithPage',
                        subType: params.statusName != '已解决' && params.statusName != '已归档' ? 'checkbox' : '',
                        // subType: 'checkbox',
                        click2Check: true,
                        valueIndex: 0,
                        value: '{{selectRows}}',
                        styles: ['tableWithPage.basic', Styles.hover.toShowAll({ selector: '.jam-td' }), 'flex(1)', Styles.css({ padding: 0 }), 'table.th.css(whiteSpace:nowrap;minHeight:2.5rem;)'],
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
                                    key: 'content',
                                    cap: '日志内容',
                                    sortable: false,
                                    align: 'left'
                                },
                                {
                                    cap: '运维标题',
                                    key: 'opsContent',
                                    sortable: false,
                                    show: false,
                                    align: 'left',
                                    styles: [Styles.toShowAll],
                                    formatter: function (value) {
                                        return value ? value : '---';
                                    }
                                },
                                {
                                    cap: '反馈类型',
                                    key: 'feedbackTypeName',
                                    show: false,
                                    sortable: false,
                                    formatter: function (value) {
                                        return value ? value : '---';
                                    }
                                },
                                {
                                    cap: '缺陷类型',
                                    key: 'defectTypeName',
                                    show: false,
                                    sortable: false
                                },
                                {
                                    cap: '状态',
                                    key: 'statusName',
                                    sortable: false,
                                    show: false
                                },
                                {
                                    key: 'opsUserName',
                                    cap: '运维人员',
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
                                    key: 'opsTime',
                                    cap: '运维时间',
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
                                    show: params.statusName != '已解决' && params.statusName != '已归档',
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
                                                                tabType: 2
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
                        data: '{{paramsSettingData}}'
                    }
                ]
            }
        ],
        vars: {
            tPageNo: 1,
            tPageSize: 20,
            tTotal: 0,
            defectRecordData: []
        },
        watchers: [
            {
                debounce: 300,
                init: false,
                keys: ['tPageSize', 'tPageNo'],
                callback() {
                    getParamsSettingData();
                }
            }
        ],
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
        },
        onafterrender: function () {
            // getParamsSettingData();
            getUserList();
        }
    };
};
function getUserList() {
    jam.ajaxCall({
        urlKey: 'getUserListData',
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

function getDelteTable(id) {
    jam.ajaxCall({
        urlKey: 'getLogDelete',
        method: 'post',
        data: id,
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess(result) {
            nutmeg.success('删除成功');
            getParamsSettingData();
        }
    });
}

export function getParamsSettingData() {
    let _params = {
        pageIndex: _model.tPageNo || 1,
        pageSize: _model.tPageSize || 20
    };
    _params.logContent = _msgr.get('logContent') ? _msgr.get('logContent') : '';
    if (_msgr.get('opsUserId') == undefined || (_msgr.get('opsUserId').length == 1 && _msgr.get('opsUserId')[0] == '')) {
        _params.opsUserId = '';
    } else {
        _params.opsUserId = _msgr.get('opsUserId');
    }

    _params.recordId = recordId || '';
    _params.type = recordType || '';

    jam.ajaxCall({
        urlKey: 'getLogPage',
        method: 'post',
        data: _params,
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess(result) {
            const { data } = result;
            const { list = [], pageIndex = 1, pojoTotalCount = 20 } = data;
            _model.tPageNo = pageIndex;
            _model.tTotal = pojoTotalCount;
            _model.paramsSettingData = list;
            _model.selectRows = [];
        }
    });
}
export default newOperationRecords;
