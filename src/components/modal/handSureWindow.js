let _model = null;
let _msgr = null;

import { ajaxCall } from '../../common.js';
import { queryEventAlarm } from '../../modules/eventBasedSubmission.mjs';
const handSureWindow = (parent_msgr, ids) => {
    return {
        type: 'card',
        icon: '',
        cap: '手动确认',
        styles: [
            Styles.card.floating({
                width: '30vw',
                height: '25vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                id: 'handSureWindow',
                styles: [
                    'size.fullsize',
                    Styles.stylesheet({
                        ':scope': {
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '1.2rem',
                            'box-sizing': 'border-box'
                        },
                        '.form-wrapper': {
                            flexDirection: 'column'
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
                                cap: '是否通过：',
                                valueKey: 'passed',
                                data: [
                                    {
                                        name: '是',
                                        value: '0'
                                    },
                                    {
                                        name: '否',
                                        value: '1'
                                    }
                                ]
                            },
                            {
                                type: 'textarea',
                                cap: '确认原因：',
                                valueKey: 'reason',
                                styles: [
                                    Styles.input.agent.css({
                                        minHeight: '4rem'
                                    })
                                ],
                                placeholder: '请输入确认原因'
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
                                    saveSure(ids);
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
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                onafterrender: function () {}
            }
        ]
    };
};

/**
 * 保存确认
 */
function saveSure(ids) {
    let params = {
        idList: ids,
        passed: _msgr.get('passed') == '0' ? true : false,
        reason: _msgr.get('reason')
    };
    ajaxCall('confirmEventAlarm', {
        success(data) {
            nutmeg.success('确认成功！');
            queryEventAlarm();
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

export default handSureWindow;
