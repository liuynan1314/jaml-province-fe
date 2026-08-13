/**
 * 五类告警数量统计-卡片
 * @cap 五类告警数量统计-卡片
 * @icon bell-on
 * @showType card
 */

import { ALARM_TYPE, dataNameMap } from '../global.js';
import mainAndAuxAlarmWindow from '../components/modal/mainAndAuxAlarmWindow.js';
import { getDetailConf } from './../common.js';
// import { createWindow } from '../components/createWindow.js';

const { main_aux } = dataNameMap;
const dataNames = [];
Object.values(main_aux).forEach((item) => {
    dataNames.push(item.main, item.aux, item.main_yes, item.aux_yes);
});

const alarmType = {
    1: 'sg',
    2: 'yc',
    3: 'yx',
    4: 'bw',
    5: 'gz'
};

const mainAlarmType = getDetailConf('alarmType');
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
let _msgr;

export default {
    type: 'card',
    cap: '五类告警数量统计',
    class: 'fiveTypeAlarmNum',
    icon: 'bell-on',
    styles: [
        'size.fullsize',
        'card.bodyslot.flex(direction:column)',
        Styles.css({
            '--jam-card-bodyslot-padding': '0 0.5rem 0.5rem 0.5rem'
        }),
        Styles.stylesheet({
            ':scope': {
                position: 'relative'
            },
            '.main-wrapper': {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                overflow: 'auto',
                position: 'relative',
                width: '100%',
                height: '100%'
            },
            '.alarm-list': {
                display: 'flex',
                flexDirection: 'column'
            },
            '.jam-main-value': {
                fontSize: 'l !important;',
                fontFamily: 'DINPro'
            },
            '.jam-sub-value': {
                marginLeft: 's !important;',
                fontSize: 'm !important;',
                textDecoration: 'underline !important;',
                color: 'var(--jam-color-fg-default)',
                marginBottom: 's'
            },
            '.unit-top': {
                position: 'absolute',
                top: '0.4rem',
                right: '0.4rem',
                fontSize: 's',
                color: 'muted'
            },
            '.date-indicator': {
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                fontSize: 's',
                position: 'absolute',
                top: 0,
                right: '0rem',
                '& span[slot=cap]': {
                    fontSize: 's'
                },
                '& span[slot=value]': {
                    marginLeft: '0.2rem',
                    fontSize: 'm',
                    fontWeight: 'bold',
                    fontFamily: 'DINPro',
                    color: 'primary'
                }
            },
            '.type-label': {
                padding: 's m s l',
                position: 'relative',
                '&::before': {
                    display: 'inline-block',
                    content: '',
                    width: '8px',
                    height: '12px',
                    background: 'linear-gradient(180deg, var(--jam-color-primary-default) 0%, hsla(0, 0%, 100%, 0.1) 100%)',
                    clipPath: 'polygon(30% 0, 100% 0, 70% 100%, 0% 100%)',
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    transform: 'translateY(-50%)'
                },
                '&::after': {
                    display: 'inline-block',
                    content: '',
                    width: '6.5px',
                    height: '7px',
                    background: 'linear-gradient(180deg, hsla(0, 0%, 49%, 1) -35.71%, hsla(0, 0%, 100%, 0) 100%)',
                    clipPath: 'polygon(30% 0, 100% 0, 70% 100%, 0% 100%)',
                    position: 'absolute',
                    top: '55%',
                    left: '0.5rem',
                    transform: 'translateY(-50%)'
                }
            }
        })
    ],
    components: [
        {
            type: 'label',
            cap: '单位：次',
            class: 'unit-top auxiliary'
        },
        {
            type: 'wrapper',
            class: 'main-wrapper',
            components: [
                {
                    type: 'wrapper',
                    class: 'alarm-list',
                    styles: ['size.fullsize', 'padding(0)'],
                    buildFor: '(alarm,i) in alarm_type_list',
                    components: [
                        {
                            type: 'label',
                            class: 'type-label',
                            cap: '{{alarm.name}}'
                        },
                        {
                            type: 'wrapper',
                            styles: ['size.fullsize', 'layout.flex(gap:0.5rem;wrap:nowrap;)'],
                            components: [
                                {
                                    type: '2IndicatorIconBottom',
                                    buildFor: '(item,index) in alarm.data',
                                    state: '{{index + 1}}',
                                    states: colorStates,
                                    attrs: {
                                        devType: '{{item.devType}}',
                                        index: '{{index + 1}}'
                                    },
                                    props: {
                                        dataDef: [
                                            {
                                                title: '{{item.typeName}}',
                                                value: '{{item.value}}',
                                                icon: '{{item.icon}}',
                                                state: '{{item.tendency}}',
                                                color: '{{item.color}}'
                                            },
                                            {
                                                title: '昨日',
                                                value: '{{item.yesCount}}'
                                            }
                                        ]
                                    },
                                    styles: ['2IndicatorIconBottom.basic', `css(width:calc((100% - 2rem)/5);height:100%;cursor:pointer;)`],
                                    onclick: function (e) {
                                        let _ele = e.target;
                                        const { tagName } = _ele;
                                        if (tagName !== 'JAM-INDICATOR') {
                                            _ele = jam.findParent(_ele, 'jam-indicator');
                                        }

                                        const _parent = jam.findParent(_ele, '.jam-cc-type-indicator');
                                        const index = _parent.getAttribute('index');
                                        const devType = _parent.getAttribute('devType');
                                        let isToday = _ele.classList.contains('indi1') ? true : false;
                                        jam.renderModal('#main', mainAndAuxAlarmWindow({ via: 'mainAuxCard', alarmClassification: alarmType[index], devType: devType, isToday: isToday }));
                                        // createWindow({ title: '主辅告警列表', body: mainAndAuxAlarmWindow({ via: 'mainAuxCard', alarmClassification: alarmType[index], devType: devType, isToday: isToday }), width: '72vw', height: '68vh', showBtn: false });
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    methods: {
        getAlarmData() {
            let _this = this;
            jam.ajaxCall({
                urlKey: 'getGeneralStatisticsData',
                onsuccess(res) {
                    const { data } = res;
                    const { valList = [] } = data[0] || {};
                    const __filterData = valList.filter((item) => dataNames.includes(item.statName)).map((item) => [item.statName, item.resultVal]);
                    const filterData = Object.fromEntries(__filterData);

                    const main_alarm_type = [];
                    const aux_alarm_type = [];

                    for (const key in ALARM_TYPE) {
                        main_alarm_type.push({
                            typeName: mainAlarmType[key]['name'],
                            alarmType: mainAlarmType[key]['type'],
                            devType: '0',
                            yesCount: filterData[main_aux[key]['main_yes']] || 0,
                            tendency: (filterData[main_aux[key]['main_yes']] || 0) < (filterData[main_aux[key]['main']] || 0) ? 'up' : 'down',
                            value: filterData[main_aux[key]['main']] || 0,
                            color: getFullHsl(colorStates[key].styles[1]),
                            icon: (filterData[main_aux[key]['main_yes']] || 0) == (filterData[main_aux[key]['main']] || 0) ? 'minus' : 'triangle'
                        });
                        aux_alarm_type.push({
                            typeName: ALARM_TYPE[key],
                            alarmType: alarmType[key],
                            devType: '1',
                            yesCount: filterData[main_aux[key]['aux_yes']] || 0,
                            tendency: (filterData[main_aux[key]['aux_yes']] || 0) < (filterData[main_aux[key]['aux']] || 0) ? 'up' : 'down',
                            value: filterData[main_aux[key]['aux']] || 0,
                            color: getFullHsl(colorStates[key].styles[1]),
                            icon: (filterData[main_aux[key]['aux_yes']] || 0) == (filterData[main_aux[key]['aux']] || 0) ? 'minus' : 'triangle'
                        });
                    }

                    _this.vars.alarm_type_list = [
                        {
                            name: '主设备',
                            devType: '0',
                            data: main_alarm_type
                        },
                        {
                            name: '辅设备',
                            devType: '1',
                            data: aux_alarm_type
                        }
                    ];
                }
            });
        }
    },

    onmount() {
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        this.getAlarmData();
    }
};

function getFullHsl(str) {
    const match = str.match(/hsl\(.*?\)/);
    return match ? match[0] : null;
}
