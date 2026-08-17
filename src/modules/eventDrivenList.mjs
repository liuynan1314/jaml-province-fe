/**
 * 事件化列表-卡片
 */
import { ajaxCall, formatterJameTime, formatterJameBvNew, formatterJameType, formatterJameStatus } from '../common.js';
let _msgr = null;
export default {
    type: 'card',
    cap: '事件化列表',
    class: 'eventDrivenList',
    icon: 'list',
    styles: [
        'size.fullsize',
        Styles.css({
            '--jam-card-bodyslot-padding': '0.5rem 0 0.5rem 0'
        }),
        Styles.stylesheet({
            '.content-box': {
                padding: '0 m',
                overflow: 'hidden',
                '.basic-table': {
                    width: '83%'
                },
                '.num-box': {
                    width: '17%'
                }
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            class: 'content-box',
            styles: ['size.fullsize'],
            components: [
                {
                    type: 'basicTable',
                    class: 'basic-table',
                    styles: [
                        'basicTable.basic',
                        'size.fullsize',
                        'padding(0)',
                        'cap.hide',
                        'icon.hide',
                        Styles.table.fixedrowheight({
                            height: '2.5rem'
                        }),
                        Styles.stylesheet({
                            '.jam-th,.jam-td': {
                                whiteSpace: 'nowrap'
                            }
                        }),
                        Styles.hover.toShowAll({ selector: '.jam-td' })
                    ],
                    data: '{{eventTableData}}',
                    descStyles: {
                        '.item-time': [Styles.badge.cap.css({ width: '5em' }), Styles.badge.content.css({ width: '5em' })],
                        '.item-tag': ['indicator.cap.hide()'],
                        '.item-content': ['css(overflow:hidden;white-space:nowrap;text-overflow:ellipsis)'],
                        '.item-indicator': ['indicator.cap.hide()', 'indicator.value.css(justify-content:flex-end)']
                    },
                    dataDef: [
                        {
                            cap: 'stId',
                            key: 'stId',
                            show: false
                        },
                        {
                            cap: '发生时间',
                            key: 'occurTime',
                            sortable: false,
                            width: '14rem',
                            formatter: formatterJameTime
                        },
                        {
                            cap: '变电站',
                            key: 'stName',
                            align: 'left',
                            sortable: false,
                            width: '10rem',
                            class: 'r-st item-content',
                            attrs: jaml.res(function () {
                                return { 'data-id': this.col(0) };
                            })
                        },
                        {
                            cap: '电压等级',
                            key: 'bvName',
                            sortable: true,
                            width: '6rem',
                            formatter: formatterJameBvNew
                        },
                        {
                            cap: '类型',
                            key: 'eventTypeName',
                            sortable: false,
                            width: '5rem',
                            formatter: formatterJameType
                        },
                        {
                            cap: '事件描述',
                            key: 'content',
                            class: 'item-content',
                            sortable: false,
                            align: 'left',
                            formatter: function (val) {
                                let time = this.col(0);
                                let stName = this.col(1);

                                return val.replace(jam.formatTime(time, 'yyyy-MM-dd HH:mm:ss'), '').replace(stName, '');
                            }
                        }
                        // {
                        //     cap: '状态类型',
                        //     key: '',
                        //     sortable: false,
                        //     formatter: formatterJameStatus
                        // }
                    ]
                },
                {
                    type: 'indicatorWithSpinner',
                    class: 'num-box',
                    styles: [
                        'indicatorWithSpinner.basic',
                        Styles.stylesheet({
                            ':scope': {
                                'jam-indicator>[slot=cap]': {
                                    justifyContent: 'center'
                                },
                                '.desc-indi': {
                                    backgroundColor: 'transparent !important'
                                },
                                'jam-indicator>[slot=icon]': {
                                    margin: '0',
                                    justifyContent: 'center',
                                    width: '100%'
                                }
                            }
                        })
                    ],
                    props: {
                        dataDef: [
                            {
                                dataKey: 'total',
                                title: '总次数',
                                unit: '次',
                                icon: 'chart-pie-simple',
                                value: '{{data.total.value}}',
                                dataType: 'analog',
                                valueType: 'number',
                                toFixed: false,
                                decimalPos: 0
                            },
                            {
                                dataKey: 'time',
                                title: '统计时间',
                                unit: '',
                                value: '{{data.time.value}}',
                                dataType: 'string',
                                valueType: 'string',
                                toFixed: false,
                                decimalPos: 0
                            }
                        ]
                    }
                }
            ]
        }
    ],
    vars: {
        data: {
            total: {
                value: 0
            },
            time: {
                value: ''
            }
        }
    },
    methods: {
        getTableData() {
            const _this = this;
            jam.ajaxCall({
                urlKey: 'getJkSynthEventAlarm',
                method: 'post',
                data: {
                    startTime: jam.formatDate(new Date(), 'yyyy-MM-dd 00:00:00'),
                    endTime: jam.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    pageIndex: 1,
                    pageSize: 1000
                },
                onsuccess(res) {
                    const { data } = res;
                    _this.vars.eventTableData = data.list;
                    _this.vars.data.total.value = data.pojoTotalCount;
                }
            });
        }
    },
    onmount: function () {
        _msgr = this.model.msgr;
    },
    onafterrender() {
        this.getTableData();
        this.vars.data.time.value = jam.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
    }
};
