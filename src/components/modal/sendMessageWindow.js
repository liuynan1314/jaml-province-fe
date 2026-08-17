import { ajaxCall } from './../../common';

export default function (props, _msgr) {
    let _model_self,
        _msgr_self,
        recipientMap = {};
    return {
        type: 'card',
        icon: '',
        cap: '短信发送',
        styles: [
            Styles.card.floating({
                width: '26vw',
                height: '25vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                styles: [
                    'size.fullsize',
                    'flex(direction:column)',
                    'padding(m m m 0)',
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
                inputStyles: [`capslot.text(size:s;color:var(--jam-color-fg-muted))`],
                components: [
                    {
                        type: 'textarea',
                        cap: '内容:',
                        class: 'label-width-56',
                        valueKey: 'content',
                        styles: ['size(width:100%)', 'css(--jam-labelslot-align-self:flex-start)', 'flex(1)'],
                        placeholder: '输入内容...'
                    },
                    {
                        type: 'wrapper',
                        styles: ['size(height:2rem)', 'padding(top:.625rem)'],
                        inputStyles: ['size(height:2rem)', `capslot.text(size:s;color:var(--jam-color-fg-muted))`],
                        components: [
                            {
                                type: 'filterSelect',
                                styles: ['size(maxWidth:13rem)', 'padding(top:0;bottom:0)'],
                                inputStyles: ['size(height:1.875rem)', 'cap.size(width:3.5rem)', `capslot.text(size:s;color:var(--jam-color-fg-muted);align:right)`],
                                childStyles: [],
                                valueKey: 'personnelId',
                                props: { cap: '收信人:', placeholder: '请选择', data: '{{recipientList}}', search: '{{name}}', select: '{{personnelId}}' },
                                watchers: {
                                    name(val) {
                                        getRecipientList(val);
                                    }
                                }
                            },
                            {
                                type: 'input-tel',
                                cap: '手机号:',
                                styles: ['flex(1)'],
                                value: '{{phone}}',
                                placeholder: '输入手机号...'
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        styles: ['padding(top:1.25rem)', 'layout(boxSizing:content-box)', 'layout.flex(justifyContent:flex-end)'],
                        buttonStyles: ['size(height:1.5625rem;width:3.125rem;)', 'border(radius:0)', 'background(color:transparent;size:cover;repeat:no-repeat)', 'hover(backdrop-filter:brightness(110%))'],
                        components: [
                            {
                                type: 'button',
                                cap: '取消',
                                styles: [Styles.searchBtnsStyles],
                                onclick: onCancel
                            },
                            {
                                type: 'button',
                                styles: [
                                    'margin(left: .625rem)',
                                    Styles.searchBtnsStyles
                                    // 'background(image:url(./assets/images/btn_confirm.png))'
                                ],
                                class: 'jam-cta',
                                cap: '发送',
                                onclick() {
                                    onSendMessage();
                                }
                            }
                        ]
                    }
                ],
                watchers: [
                    {
                        key: 'personnelId',
                        callback(id) {
                            _model_self.phone = recipientMap[id] || '';
                        }
                    }
                ],
                onmount() {
                    _model_self = this.model;
                    _msgr_self = this.model.msgr;
                },
                onafterrender() {
                    getRecipientList();
                    _msgr_self.pub('content', props.content);
                }
            }
        ]
    };

    function getRecipientList(name) {
        ajaxCall('getAddressBookList', {
            params: { pageSize: 100, ...(name ? { nameLike: name } : {}) },

            success(data) {
                const list = (data.list || []).map((item) => ({
                    name: item.name,
                    value: item.id,
                    phone: item.phone,
                    completePhone: item.completePhone
                }));
                recipientMap = Object.fromEntries(list.map((item) => [item.value, item.completePhone]));
                _model_self.vars.recipientList = list;
            }
        });
    }

    function onCancel() {
        _msgr.pub('toCloseModal', new Date().getTime());
        _msgr.unsub('toCloseModal');
    }
    function onSendMessage() {
        ajaxCall('onSendMessage', {
            transformResponse: false,
            params: {
                content: _msgr_self.get('content'),
                phone: _model_self.phone,
                type: 0
            },
            type: 'post',
            success(data) {
                data.code === 200 ? (nutmeg.success(data.message), onCancel()) : nutmeg.error(data.message);
            }
        });
    }
}
