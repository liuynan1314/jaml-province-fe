import { ajaxCall } from '../../common.js';

export default function (params, _msgr) {
    let _model_self,
        _msgr_self,
        recipientMap = {};
    return {
        type: 'card',
        icon: '',
        cap: '新增案例',
        styles: [
            Styles.card.floating({
                width: '25vw',
                height: '52vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                styles: [
                    'size.fullsize',
                    'flex(direction:column)',
                    'padding(.625rem 1rem 1rem 0 )',
                    Styles.css({
                        alignItems: 'center'
                    }),
                    Styles.stylesheet({
                        ':scope': {
                            '--jam-input-agent-border-radius': '0.25rem'
                        },
                        '.label-width-56': {
                            '&>[slot=cap]': {
                                width: '3.5rem',
                                textAlign: 'right'
                            }
                        }
                    })
                ],
                inputStyles: [
                    'capslot.text(size:s;color:var(--jam-color-fg-muted))',
                    Styles.input.agent.css({
                        borderColor: 'var(--jam-color-outline-muted)',
                        width: '18rem'
                    }),
                    Styles.input.cap.css({
                        textAlign: 'right',
                        minWidth: '8rem'
                    })
                ],
                components: [
                    {
                        type: 'input',
                        cap: '地区:',
                        disabled: true,
                        defaultValue: '{{_regionName}}'
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '时间:',
                        defaultValue: '{{_occurTime}}'
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '变电站名称:',
                        defaultValue: '{{_stName}}'
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '预警能力提升方式:',
                        defaultValue: '{{_warnWay}}'
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '预警能力提升方向:',
                        defaultValue: '{{_warnOrientation}}'
                    },
                    {
                        type: 'textarea',
                        class: 'label-width-56',
                        cap: '设备监控预警概述:',
                        value: '{{_content}}'
                    },
                    {
                        type: 'textarea',
                        class: 'label-width-56',
                        cap: '原因分析:',
                        value: '{{cause}}'
                    },
                    {
                        type: 'textarea',
                        class: 'label-width-56',
                        cap: '处理情况:',
                        value: '{{dealWith}}'
                    },
                    {
                        type: 'textarea',
                        class: 'label-width-56',
                        cap: '备注:',
                        value: '{{remark}}'
                    },
                    {
                        type: 'wrapper',
                        styles: ['size.fullwidth', 'wrapper.buttonwrapper', Styles.css({ marginTop: 'm', position: 'fixed', bottom: '0', left: '0' })],
                        childStyles: ['icon.duotone', Styles.css({ borderRadius: '0' })],
                        components: [
                            {
                                type: 'button',
                                icon: 'repeat',
                                cap: '重置',
                                onclick: function () {
                                    resetForm();
                                }
                            },
                            {
                                type: 'button',
                                icon: 'xmark',
                                cap: '取消',
                                onclick: function () {
                                    onCancel();
                                }
                            },
                            {
                                type: 'button',
                                icon: 'check',
                                cap: '确认',
                                msgFormat: {
                                    msgKey: 'caseConfirm'
                                }
                            }
                        ]
                    }
                ],
                watchers: [
                    {
                        key: 'caseConfirm',
                        callback(id) {
                            onConfirmCase();
                        }
                    }
                ],
                onmount() {
                    _model_self = this.model;
                    _msgr_self = this.model.msgr;
                    _msgr_self.pub('_regionName', params.regionName);
                    _msgr_self.pub('_occurTime', params.occurTime);
                    _msgr_self.pub('_stName', params.stName);
                    _msgr_self.pub('_warnOrientation', params.warnOrientation);
                    _msgr_self.pub('_warnWay', params.warnWay);
                },
                onafterrender() {}
            }
        ]
    };

    function onCancel() {
        _msgr.pub('toCloseModal', new Date().getTime());
        _msgr.unsub('toCloseModal');
    }
    function onConfirmCase() {
        ajaxCall('saveCaseTableData', {
            params: {
                id: params.key,
                regionId: params.regionId,
                occurTime: params.occurTime,
                stName: params.stName,
                warnWay: params.warnWay,
                warnOrientation: params.warnOrientation,
                content: _msgr_self.get('_content') || '',
                cause: _msgr_self.get('cause') || '',
                dealWith: _msgr_self.get('dealWith') || '',
                remark: _msgr_self.get('remark') || ''
            },
            uniqId: Math.random(1, 1000000),
            type: 'post',
            success(data) {
                nutmeg.success(data);
                onCancel();
            },
            error(data) {
                nutmeg.error(data);
            }
        });
    }

    function resetForm() {
        _msgr_self.pub('_content', '');
        _msgr_self.pub('cause', '');
        _msgr_self.pub('dealWith', '');
        _msgr_self.pub('remark', '');
    }
}
