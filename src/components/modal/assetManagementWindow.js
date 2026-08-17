import { ajaxCall } from './../../common';

import { urlConfig } from './../../global';

export default function (props, isForTrip) {
    let _model, _msgr;
    return {
        type: 'wrapper',
        styles: ['size.fullsize', 'padding(1.25rem)', 'flex(direction:column)', 'layout(overflow:hidden;position:relative;)'],
        descStyles: {
            input: ['input.agent.border(radius:s)', 'css(cursor:auto)'],
            '.title': [
                //
                'padding(left:m)',
                'background(image:url(./assets/images/title-bg.png);repeat:no-repeat;size:auto .45rem;position:left bottom;)',
                'cap.text(weight:bold;color:var(--jam-color-fg-default))'
            ]
        },
        components: [
            {
                type: 'table',
                styles: [
                    //
                    'flex(1)',
                    Styles.tableStyles
                ],
                data: props,
                dataDef: [
                    {
                        key: 'keyIdStr',
                        show: false
                    },
                    {
                        cap: 'IP地址',
                        key: 'ip',
                        sortable: false
                    },
                    {
                        cap: '端口',
                        key: 'port',
                        sortable: false
                    },
                    {
                        cap: '状态',
                        key: 'status',
                        sortable: false
                    },
                    {
                        cap: '服务名称',
                        key: 'name',
                        sortable: false
                    },
                    {
                        cap: '描述',
                        key: 'descr',
                        styles: [Styles.toShowAll],
                        sortable: false
                    },
                    {
                        cap: '备注',
                        key: 'note',
                        styles: [Styles.toShowAll],
                        sortable: false
                    }
                ]
            }
        ],
        vars: {},
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
        },
        onafterrender: function () {}
    };
}
