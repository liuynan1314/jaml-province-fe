import { urlConfig } from '../../global.js';
import { ajaxCall } from '../../common.js';
import { getParamsSettingData } from './newOperationRecords.js';
import { getMaintenanceLogTableData } from '../systemOperatingRecords/maintenanceLog.js';
let _model, _msgr;
let key_opsRecordId, tabType;
const addLog = (params) => {
    key_opsRecordId = params.key_opsRecordId;
    tabType = params?.tabType || '';
    return {
        type: 'card',
        icon: '',
        cap: params.title,
        class: 'addLogId',
        styles: [
            Styles.card.floating({
                width: '23vw',
                height: '26vh'
            }),
            Styles.stylesheet({
                ':scope': {
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1.2rem',
                    'box-sizing': 'border-box'
                },
                '.form-item': {
                    display: 'flex',
                    'align-items': 'center'
                },
                '.unifycap': {
                    width: '100% !important'
                },
                '.description-input': {
                    height: '5rem'
                }
            })
        ],
        components: [
            {
                type: 'container',
                styles: ['size.fullsize', 'layout.autoalign'],
                components: [
                    {
                        type: 'filterSelect',
                        class: 'unifycap',
                        props: { cap: '运维人员：', data: '{{adduserlist}}', search: '{{addname}}', select: '{{addopsUserId}}', defaultValue: '{{addname}}' },
                        watchers: {
                            async addname(val) {
                                getAddUserList(val);
                            }
                        },
                        styles: [Styles.input.regularStyleNew, Styles.css({ width: '100%' }), 'filterSelect.labelslot.margin(0)'],
                        childStyles: [Styles.css({ width: '100%' })]
                    },
                    {
                        type: 'textarea',
                        valueKey: 'addcontent',
                        class: 'description-input',
                        cap: '日志内容：',
                        styles: [Styles.css({ height: '6rem', marginTop: '0.3rem' }), 'textarea.labelslot.margin(0)']
                    },
                    {
                        type: 'wrapper',
                        class: 'form-item',
                        components: [
                            {
                                type: 'datepicker',
                                cap: '运维时间：',
                                valueKey: 'opsDate',
                                // defaultValue: moment().format('YYYY-MM-DD'),
                                styles: [Styles.datepicker.regularStyleNew, 'datepicker.labelslot.margin(0.1rem)']
                            },
                            {
                                type: 'timepicker',
                                // defaultValue: moment().format('HH:mm'),
                                valueKey: 'opsTime',
                                styles: [Styles.datepicker.regularStyleNew]
                            }
                        ]
                    }
                ]
            },
            {
                type: 'wrapper',
                styles: ['size.fullwidth', 'wrapper.buttonwrapper', Styles.css({ position: 'absolute', bottom: '0', left: '0' })],
                childStyles: ['icon.duotone', Styles.css({ borderRadius: '0' })],
                components: [
                    {
                        type: 'button',
                        icon: 'repeat',
                        cap: '重置',
                        // usage: 'reset'
                        onclick: function () {
                            if (params.key_factor) {
                                getUserDetail(params);
                            } else {
                                _msgr.pub('addcontent', '');
                                _msgr.pub('addopsUserId', '');
                                _msgr.pub('addname', '');
                            }
                        }
                    },
                    {
                        type: 'button',
                        icon: 'trash-can',
                        cap: '清空',
                        usage: 'clear'
                    },
                    {
                        type: 'button',
                        icon: 'xmark',
                        cap: '取消',
                        usage: 'cancel',
                        onclick: function () {
                            _msgr.pub('closeAddSaff', 1);
                            _msgr.pub('ids', '');
                        }
                    },
                    {
                        type: 'button',
                        icon: 'check',
                        class: 'jam-cta',
                        cap: '确认',
                        msgFormat: {
                            msgKey: ''
                        },
                        onclick: function () {
                            if (!_msgr.get('addname')) {
                                nutmeg.error('请选择运维人员');
                            } else if (!_msgr.get('addcontent')) {
                                nutmeg.error('请输入日志内容');
                            } else if (!_msgr.get('opsDate') || !_msgr.get('opsTime')) {
                                nutmeg.error('请选择运维时间');
                            } else {
                                if (params.key_factor) {
                                    getUserUpdate(params);
                                } else {
                                    getUserAdd();
                                }
                            }
                        }
                    }
                ]
            }
        ],
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
        },
        onafterrender: function () {
            _msgr.pub('opsDate', moment().format('YYYY-MM-DD'));
            _msgr.pub('opsTime', moment().format('HH:mm'));

            if (params.key_factor) {
                getUserDetail(params);
            } else {
                getAddUserList();
            }
        }
    };
};

// 获取运维人员下拉框接口
function getAddUserList(val) {
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
                'adduserlist',
                data?.map((item) => ({ name: item.name, value: item.id }))
            );
        }
    });
}

// 编辑
function getUserUpdate(params) {
    let _params = {};
    _params.id = params.key_factor;
    _params.opsRecordId = _msgr.get('opsRecordIdStr');
    _params.content = _msgr.get('addcontent');
    _params.opsUserId = _msgr.get('addopsUserId') == null ? '' : _msgr.get('addopsUserId');
    _params.opsTime = _msgr.get('opsDate') + ' ' + _msgr.get('opsTime') + ':00';

    jam.ajaxCall({
        urlKey: 'getLogUpdate',
        method: 'post',
        data: _params,
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess() {
            nutmeg.success('修改成功');
            let dom = document.querySelector('.addLogId');
            spoon.removeSelf(dom);
            if (tabType == 3) {
                getMaintenanceLogTableData();
            } else if (tabType == 2) {
                getParamsSettingData();
            }
        }
    });
}

// 初始
function getUserDetail(params) {
    _msgr.pub('addcontent', params.key_content);
    _msgr.pub('addopsUserId', params.key_opsUserId);
    _msgr.pub('addname', params.key_opsUserName);
    // 拆分日期时间并分别赋值
    const [date, time] = params.key_opsTime.split(' ');
    console.log(date, time, '===123123');
    _msgr.pub('opsDate', date);
    _msgr.pub('opsTime', time ? time.slice(0, 5) : '');
    _msgr.pub('opsRecordId', params.key_opsRecordId);
    getAddUserList(params.key_opsUserName);
}

// 新增
function getUserAdd() {
    let _params = {
        opsRecordId: key_opsRecordId || '',
        content: _msgr.get('addcontent'),
        opsUserId: _msgr.get('addopsUserId') == null ? '' : _msgr.get('addopsUserId'),
        opsTime: _msgr.get('opsDate') + ' ' + _msgr.get('opsTime') + ':00'
    };
    jam.ajaxCall({
        urlKey: 'getLogAdd',
        method: 'post',
        data: _params,
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess() {
            nutmeg.success('新增成功');
            let dom = document.querySelector('.addLogId');
            spoon.removeSelf(dom);
            if (tabType == 3) {
                getMaintenanceLogTableData('add');
            } else if (tabType == 2) {
                getParamsSettingData();
            }
        }
    });
}

export default addLog;
