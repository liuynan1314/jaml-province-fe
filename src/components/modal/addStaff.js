import { urlConfig } from '../../global.js';
import { ajaxCall } from '../../common.js';
let _model, _msgr, _this;
import { getMaintenanceTableData } from '../systemOperatingRecords/maintenancePersonnel.js';
let keyId = '';
const addStaff = (params) => {
    keyId = params.keyId;
    return {
        type: 'card',
        icon: '',
        class: 'addStaffId',
        cap: params.title,
        styles: [
            Styles.card.floating({
                width: '20vw',
                height: '20vh'
            }),
            Styles.stylesheet({
                ':scope': {
                    display: 'flex',
                    flexDirection: 'column',
                    'box-sizing': 'border-box'
                }
            })
        ],
        components: [
            {
                type: 'container',
                styles: ['size.fullsize', 'layout.autoalign'],
                inputStyles: [Styles.input.regularStyleNew, 'input.labelslot.margin(0)'],
                components: [
                    {
                        type: 'input',
                        valueKey: 'nameval',
                        cap: '人员姓名：'
                    },
                    {
                        type: 'input',
                        valueKey: 'tel',
                        cap: '联系方式：'
                    },
                    {
                        type: 'input',
                        valueKey: 'remark',
                        cap: '\u3000\u3000备注：'
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
                        onclick: function () {
                            if (keyId) {
                                getUserDetail();
                            } else {
                                resetFormData();
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
                            let dom = document.querySelector('.addStaffId');
                            spoon.removeSelf(dom);
                        }
                    },
                    {
                        type: 'button',
                        icon: 'check',
                        cap: '确认',
                        msgFormat: {
                            msgKey: 'confirmResult'
                        }
                    }
                ]
            }
        ],
        watchers: {
            confirmResult(val) {
                let { nameval, tel } = val;
                let reg = /^1[3-9]\d{9}$/.test(tel);
                if (!nameval) {
                    nutmeg.error('请填写姓名');
                } else if (!tel) {
                    nutmeg.error('请填写联系方式');
                } else if (!reg) {
                    nutmeg.error('请填写正确的联系方式');
                } else {
                    if (keyId) {
                        getUserUpdate();
                    } else {
                        getUserAdd();
                    }
                }
            }
        },
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
            _this = this;
            if (!keyId) {
                resetFormData();
            }
        },
        onafterrender: function () {
            if (keyId) {
                getUserDetail();
            }
        }
    };
};

// 编辑
function getUserUpdate() {
    let _params = {
        id: keyId,
        name: _msgr.get('nameval'),
        tel: _msgr.get('tel'),
        remark: _msgr.get('remark')
    };
    jam.ajaxCall({
        urlKey: 'getUserUpdate',
        method: 'post',
        data: _params,
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess() {
            nutmeg.success('修改成功');
            let dom = document.querySelector('.addStaffId');
            spoon.removeSelf(dom);
            getMaintenanceTableData();
        }
    });
}

// 初始值
function getUserDetail() {
    jam.ajaxCall({
        urlKey: 'getUserDetail',
        data: {
            id: keyId
        },
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess(result) {
            const { data } = result;
            _msgr.pub('nameval', data.name);
            _msgr.pub('tel', data.tel);
            _msgr.pub('remark', data.remark);
        }
    });
}

// 新增
function getUserAdd() {
    let _params = {};
    _params.name = _msgr.get('nameval');
    _params.tel = _msgr.get('tel');
    _params.remark = _msgr.get('remark');
    jam.ajaxCall({
        urlKey: 'getUserAdd',
        method: 'post',
        data: _params,
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess() {
            nutmeg.success('新增成功');
            let dom = document.querySelector('.addStaffId');
            spoon.removeSelf(dom);
            getMaintenanceTableData('isAdd');
        }
    });
}

// 重置
function resetFormData() {
    _msgr.pub('nameval', '');
    _msgr.pub('tel', '');
    _msgr.pub('remark', '');
}

export default addStaff;
