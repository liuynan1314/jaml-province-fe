// import { createWindow } from './createWindow.js';
import mainAndAuxAlarmWindow from './modal/mainAndAuxAlarmWindow.js';

const colorStates = {
    1: {
        styles: ['background(color:hsl(355 100% 63.9%/0.1))', 'css(--val-clr: hsl(355 100% 63.9%))']
    },
    2: {
        styles: ['background(color:hsl(39 100% 50.4%/0.1))', 'css(--val-clr: hsl(39 100% 50.4%))']
    },
    3: {
        styles: ['background(color:hsl(57 66.3% 51.2%/0.1))', 'css(--val-clr: hsl(57 66.3% 51.2%))']
    },
    4: {
        styles: ['background(color:hsl(162 66.7% 54.1%/0.1))', 'css(--val-clr: hsl(162 66.7% 54.1%))']
    },
    5: {
        styles: ['background(color:hsl(199 100% 59.2%/0.1))', 'css(--val-clr: hsl(199 100% 59.2%))']
    }
};
jaml.register('mainAndAuxAlarmCard', {
    type: 'wrapper',
    styles: ['layout.flex(justifyContent:space-evenly)', 'layout(overflow:hidden)', 'flex(flex:none;direction:column)', 'size(height:100%;maxWidth:calc(20% - .4rem);width:calc(20% - .4rem))', 'padding(left:0.25rem)', 'css(borderRadius:.135rem)'],
    state: '{{i}}+1',
    states: colorStates,
    components: [
        {
            type: 'label',
            styles: ['label.capslot.text(size:s;color:var(--jam-color-fg-muted))'],
            cap: '{{item.typeName}}'
        },
        {
            type: 'label',
            styles: ['css(cursor:pointer;flexWrap:nowrap)', 'padding(0)', 'flex(direction:row-reverse)', 'layout.flex(justifyContent:flex-end)', 'label.icon.size(width:.75rem;height:.375rem)', 'label.capslot.text(size:m;color:var(--val-clr);weight:bold;family:DINPro)'],
            cap: jaml.var('item.value', function (value) {
                return forkValue(value);
            }),
            attrs: {
                'data-devType': '{{item.devType}}',
                'data-alarmType': '{{item.alarmType}}'
            },
            //  jaml.var('item.devType', 'item.alarmType', function (devType, alarmType) {
            //     return {
            //         'data-devType': devType,
            //         'data-alarmType': alarmType
            //     };
            // })
            onclick: function () {
                const { devtype, alarmtype } = this.dataset;
                jam.renderModal('#main', mainAndAuxAlarmWindow({ via: 'mainAuxCard', alarmClassification: alarmtype, devType: devtype, isToday: true }));

                // createWindow({ title: '主辅告警列表', body: mainAndAuxAlarmWindow({ via: 'mainAuxCard', alarmClassification: alarmtype, devType: devtype, isToday: true }), width: '72vw', height: '68vh', showBtn: false });
            },
            state: '{{item.tendency}}',
            states: {
                up: {
                    icon: '<div><img src="./../../assets/images/up-arrow.png" /></div>'
                },
                down: {
                    icon: '<div><img src="./../../assets/images/down-arrow.png" /></div>'
                }
            },
            plugins: [Plugins.popup.tip({ showDelay: 300 })],
            tip: jaml.var('item.value', function (value) {
                return value;
            })
        },

        {
            type: 'label',
            styles: ['css(cursor:pointer;padding:0)', 'label.capslot.text(size:s;color:var(--jam-color-fg-subtle))'],
            attrs: {
                'data-devType': '{{item.devType}}',
                'data-alarmType': '{{item.alarmType}}'
            },
            onclick: function () {
                const { devtype, alarmtype } = this.dataset;
                jam.renderModal('#main', mainAndAuxAlarmWindow({ via: 'mainAuxCard', alarmClassification: alarmtype, devType: devtype, isToday: false }));

                // createWindow({ title: '主辅告警列表', body: mainAndAuxAlarmWindow({ via: 'mainAuxCard', alarmClassification: alarmtype, devType: devtype, isToday: false }), width: '72vw', height: '68vh', showBtn: false });
            },
            cap: jaml.var('item.yesCount', function (yesCount) {
                return `<span style="word-break:keep-all">昨日${forkValue(yesCount)}</span>`;
            }),
            plugins: [Plugins.popup.tip({ showDelay: 300 })],
            tip: jaml.var('item.yesCount', function (yesCount) {
                return '昨日' + yesCount;
            })
        }
    ]
});
function forkValue(value) {
    let rt = value;
    if (value > 999 && value < 9999) {
        rt = jam.toFixed(value / 1000, 1) + 'k';
    } else if (value > 9999 && value < 99999) {
        rt = jam.toFixed(value / 10000, 1) + 'w';
    } else if (value > 99999) {
        rt = jam.toFixed(value / 10000, 0) + 'w';
    }
    return rt;
}
