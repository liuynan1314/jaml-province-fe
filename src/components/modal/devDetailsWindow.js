import { ajaxCall } from '../../common.js';
import diffImportantDevTable from '../../components/diffImportantDevTable.js';
let _model, _msgr;
const devDetailsWindow = (params) => {
    return {
        type: 'card',
        icon: '',
        cap: '用户详情',
        styles: [
            Styles.card.floating({
                width: '80vw',
                height: '65vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                id: 'devDetailsWindow',
                styles: [
                    'props(display:flex;flexDirection:column;overflow:hidden;)',
                    'size(width:100%;height:calc(100% - 1rem))',
                    Styles.stylesheet({
                        ':scope': {
                            padding: 'm'
                        },
                        '.form_wrapper': {
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            '.add_btn': {
                                width: '4rem !important',
                                padding: '0 !important',
                                justifyContent: 'flex-start'
                            },
                            '.form_item': {
                                marginLeft: 'm',
                                marginBottom: 's',
                                '--jam-agent-width': '11.25rem',
                                '.jam-option': {
                                    background: 'elevation'
                                }
                            },
                            'jam-button': {
                                marginLeft: 'm'
                            }
                        },
                        '.tableContent': {
                            // height: 'calc(100% - 2rem)',
                            flexGrow: 1
                        }
                    })
                ],
                components: [
                    {
                        type: 'wrapper',
                        class: 'form_wrapper',
                        buttonStyles: [Styles.searchBtnsStyles],
                        components: [
                            {
                                type: 'select',
                                styles: [Styles.select.regularStyleDiff],
                                class: 'form_item',
                                cap: '所属厂站：',
                                valueKey: 'stId',
                                data: '{{stList}}'
                            },
                            // {
                            //     type: 'filterSelect',
                            //     class: 'form_item',
                            //     styles: [
                            //         Styles.input.regularStyleDiff,
                            //         Styles.input.agent.css({
                            //             borderColor: 'var(--jam-color-outline-muted)',
                            //             width: '11.25rem',
                            //             background: tint
                            //         })
                            //     ],
                            //     props: { cap: '所属厂站:', data: '{{stList}}', search: '{{stName}}', select: '{{stId}}' },
                            //     watchers: {
                            //         async stName(val) {
                            //             if (val.length == 0) _msgr.pub('stId', '');
                            //             getSubstationList(val);
                            //         }
                            //     }
                            // },
                            {
                                type: 'input',
                                styles: [
                                    Styles.input.regularStyleDiff,
                                    Styles.input.agent.css({
                                        borderColor: 'var(--jam-color-outline-muted)'
                                    })
                                ],
                                cap: '设备名称：',
                                class: 'form_item',
                                valueKey: 'devName'
                            },
                            {
                                type: 'select',
                                styles: [Styles.select.regularStyleDiff],
                                class: 'form_item',
                                cap: '设备类型：',
                                valueKey: 'devType',
                                data: [
                                    { name: '断路器', value: ['CBR'] },
                                    { name: '负荷', value: ['FH'] },
                                    { name: '交流线段端点', value: ['aclineend'] },
                                    { name: '变压器', value: ['PTR'] },
                                    { name: '绕组', value: ['NS'] }
                                ]
                            },

                            {
                                type: 'button',
                                class: 'jam-cta',
                                cap: '查询',
                                styles: [Styles.icon.duotone, 'margin(bottom:s)'],
                                icon: 'magnifying-glass',
                                onclick: function () {
                                    querySceneImportantDev();
                                }
                            }
                        ]
                    },

                    {
                        type: 'wrapper',
                        class: 'tableContent',
                        components: [diffImportantDevTable()]
                    }
                ],
                watchers: {
                    devDetailsListResult() {
                        mango.pub('_closeWindow', new Date());
                    }
                },
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                onafterrender: function () {
                    if (params.id) {
                        _msgr.pub('sceneId', params.id);
                    }

                    _model.vars.formList = params;
                    querySceneImportantDev();
                }
            }
        ]
    };
};

function querySceneImportantDev() {
    const sceneId = _msgr.get('sceneId') || undefined;
    const devName = _msgr.get('devName') || undefined;
    const devType = _msgr.get('devType') || undefined;
    const stId = _msgr.get('stId') || undefined;
    ajaxCall(
        'querySceneImportantDev',
        {
            success(res) {
                _msgr.pub('majorPowerOutageTableData', res);
                let stList = [];
                (res || []).forEach((item) => {
                    stList.push({
                        name: item.stName,
                        value: item.stId
                    });
                });
                _model.vars.stList = stList;
            },
            params: {
                sceneId,
                devName,
                devType,
                stId
            },
            useMock: false,
            type: 'post'
        },
        false
    );
}

function resetForm() {
    _msgr.pub('stId', '');
    _msgr.pub('devType', null);
    _msgr.pub('stName', '');
    _msgr.pub('devName', '');
}

export default devDetailsWindow;
