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
                `cap.text(weight:bold;color:${jam.lumiText(1)})`
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
                        cap: '设备或系统：',
                        value: props?.deviceSystem
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '设备名称：',
                        value: props?.deviceName
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '事件级别：',
                        value: props?.levelName
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '重复次数：',
                        value: props?.updateCount
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '发生时间：',
                        value: jam.formatDate(props?.collectTime || '', 'yyyy-MM-dd HH:mm:ss')
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '更新时间：',
                        value: jam.formatDate(props?.updateTime || '', 'yyyy-MM-dd HH:mm:ss')
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '设备类型：',
                        value: props?.devType
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '事件类别：',
                        value: props?.eveTypeName
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '数据来源：',
                        value: props?.source
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '事件来源：',
                        value: props?.type
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '原始数据：',
                        styles: ['size(width:100%)'],
                        value: props?.data
                    },
                    {
                        type: 'input',
                        disabled: true,
                        cap: '事件描述：',
                        styles: ['size(width:100%)'],
                        value: `江苏省集控平台采集服务器(${props?.source})发现设备(${props?.deviceName})的${props?.eveTypeName}${props?.rate ? '(' + props?.rate + '%)' : ''}`
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
