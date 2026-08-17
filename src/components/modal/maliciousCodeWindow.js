import { ajaxCall } from './../../common';

export default function (props) {
    let _model, _msgr;
    return {
        type: 'wrapper',
        styles: ['size.fullsize', 'padding(1.25rem)', 'flex(direction:column)', 'layout(overflow:hidden;position:relative;)'],
        descStyles: {
            input: ['input.agent.border(radius:.25rem)', 'css(cursor:auto)'],
            '.title': [
                //
                'padding(left:.625rem)',
                'background(image:url(./assets/images/title-bg.png);repeat:no-repeat;size:auto .45rem;position:left bottom;)',
                `cap.text(weight:bold;color:var(--jam-color-fg-default))`
            ]
        },
        components: [
            {
                type: 'wrapper',
                styles: ['flex(wrap:wrap)', 'layout(gap:.625rem 1.25rem ;)'],
                descStyles: {
                    input: ['size(width:calc(calc(100% - 1.25rem) / 2))'],
                    'span[slot=cap]': [
                        Styles.css({
                            width: '6rem',
                            textAlign: 'right'
                        })
                    ]
                },
                components: [
                    {
                        type: 'input',
                        disabled: true,
                        cap: '终端名称：',
                        value: props?.name
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '终端类型：',
                        value: props?.typeName
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: 'IP地址：',
                        value: props?.ip
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: 'MAC地址：',
                        value: props?.mac
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '操作系统：',
                        value: props?.os
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '资产类型：',
                        value: props?.productTypeName
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '引擎版本：',
                        value: props?.engineName
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '病毒库版本：',
                        value: props?.virLibVersion
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '端口：',
                        value: props?.port
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '在线状态：',
                        value: props?.stateName
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '更新时间：',
                        value: jam.formatDate(props?.lastActive || '', 'yyyy-MM-dd HH:mm:ss')
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
