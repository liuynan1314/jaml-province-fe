let _model = null;
let _msgr = null;

import { ajaxCall } from '../../common.js';
import { queryEventAlarm } from '../../modules/eventBasedSubmission.mjs';
const eventSendWindow = (parent_msgr, ids) => {
    return {
        type: 'card',
        icon: '',
        cap: '事件上送',
        styles: [
            Styles.card.floating({
                width: '30vw',
                height: '25vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                id: 'eventSendWindow',
                styles: [
                    'size.fullsize',
                    Styles.stylesheet({
                        ':scope': {
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 'm',
                            'box-sizing': 'border-box'
                        },
                        '.form-wrapper': {
                            flexDirection: 'column',
                            'span[slot=cap]': {
                                width: '5rem',
                                textAlign: 'right'
                            }
                        },
                        '.btn-wrapper': {
                            justifyContent: 'center',
                            position: 'absolute',
                            bottom: '2rem',
                            left: 0,
                            right: 0
                        }
                    })
                ],
                components: [
                    {
                        type: 'wrapper',
                        class: 'form-wrapper',
                        selectStyles: [Styles.select.regularStyleNew],
                        inputStyles: [Styles.input.regularStyleNew],
                        components: [
                            {
                                type: 'select',
                                cap: '目的地：',
                                valueKey: 'target',
                                showIf: '{{isShowTarget}}',
                                data: [
                                    {
                                        name: '总部',
                                        value: 0
                                    },
                                    {
                                        name: '中台',
                                        value: 1
                                    }
                                ]
                            },
                            {
                                type: 'input',
                                cap: '账号：',
                                valueKey: 'account',
                                showIf: '{{isShowAccount}}',
                                placeholder: '请输入账号'
                            },
                            {
                                type: 'input-password',
                                cap: '密码：',
                                valueKey: 'password',
                                showIf: '{{isShowAccount}}',
                                placeholder: '请输入密码'
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        buttonStyles: [Styles.searchBtnsStyles],
                        class: 'btn-wrapper',
                        components: [
                            {
                                type: 'button',
                                cap: '确认',
                                icon: 'floppy-disk',
                                class: 'jam-cta',
                                onclick: () => {
                                    saveSend(ids);
                                }
                            },
                            {
                                type: 'button',
                                cap: '取消',
                                icon: 'xmark',
                                onclick: () => {
                                    parent_msgr.pub('closeEvent', new Date().getTime());
                                }
                            }
                        ]
                    }
                ],
                vars: {
                    isShowTarget: true,
                    isShowAccount: true
                },
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                onafterrender: function () {
                    showTarget();
                }
            }
        ]
    };
};

/**
 * 是否展示目的地
 */
function showTarget() {
    ajaxCall('getProvinceEventConfig', {
        success(data) {
            let { upload2bpEnabled, provinceSendButtonAuthEnabled } = data;
            if (!upload2bpEnabled) {
                //是否展示目的地
                _model.vars.isShowTarget = false;
            }
            if (!provinceSendButtonAuthEnabled) {
                //是否展示账户、密码
                _model.vars.isShowAccount = false;
            }
        },
        error(error) {
            console.log(error);
        },
        params: {},
        useMock: false,
        type: 'post'
    });
}

/**
 * 保存确认
 */
function saveSend(ids) {
    let params = {
        idList: ids,
        target: _model.vars.isShowTarget ? _msgr.get('target') : 0,
        account: _msgr.get('account'),
        password: _msgr.get('password')
    };
    ajaxCall('sendEventAlarm', {
        success(data) {
            nutmeg.success('事件上送成功！');
            parent_msgr.pub('closeEvent', new Date().getTime());
        },
        error(error) {
            console.log(error);
        },
        params: params,
        useMock: false,
        type: 'post'
    });
}

export default eventSendWindow;
