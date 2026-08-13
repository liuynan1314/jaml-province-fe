import { ajaxCall } from '../common.js';
let _this = this;
export default {
    type: 'card',
    cap: '当月操作次数',
    icon: 'list-check',
    styles: [
        'size.fullsize',
        Styles.css({
            '--jam-card-bodyslot-padding': '1rem'
        }),
        Styles.card.bodyslot.css({
            placeItems: 'flex-start !important',
            placeContent: 'flex-start !important'
        }),
        Styles.stylesheet({
            '.title-wrapper': {
                marginTop: '-0.5rem',
                marginBottom: '0.5rem',
                '[slot=value]': {
                    color: jam.colorText(),
                    fontFamily: 'DINPro',
                    fontWeight: 'bold'
                }
            },
            '.info-wrapper': {
                width: '100%',
                height: 'calc(100% - 3.5rem)',
                flexWrap: 'wrap',
                gap: 'm',
                '.info-item': {
                    width: 'calc((100% - 1rem)/2)',
                    height: 'calc((100% - 1rem)/2)',
                    background: 'accent',
                    padding: 'm',
                    boxSizing: 'border-box',
                    borderRadius: 's',
                    '[slot=icon] .jam-icon': {
                        '--size': '1.5rem',
                        borderRadius: '50%',
                        fontSize: 'm'
                    }
                }
            }
        })
    ],
    components: [
        {
            type: 'buttongroup-radio',
            styles: [
                Styles.buttonGroupDateList,
                Styles.tabBtnList,
                Styles.css({
                    alignSelf: 'flex-end',
                    top: '0.2rem',
                    right: 0,
                    position: 'absolute'
                })
            ],
            value: '{{currentType}}',
            data: [
                {
                    name: '本月',
                    value: 1
                },
                {
                    name: '本周',
                    value: 2
                },
                {
                    name: '当日',
                    value: 3
                }
            ],
            onvaluechange: function (val) {
                _this.vars.currentType = val;
                _this.getOperationData();
            }
        },
        {
            type: 'indicator',
            cap: '变电站当月操作总数',
            value: '{{total}}',
            class: 'title-wrapper',
            styles: ['indicator.inline']
        },
        {
            type: 'wrapper',
            class: 'info-wrapper',
            components: jaml.var('infoData', function (val) {
                return val.map((item, index) => {
                    return {
                        type: 'indicatorWithProgress',
                        class: 'info-item',
                        styles: ['indicatorWithProgress.basic'],
                        props: item.propsData,
                        vars: {
                            data: item.data
                        }
                    };
                });
            })
        }
    ],
    vars: {
        currentType: 1
    },
    methods: {
        getOperationData() {
            let params = {};
            if (_this.vars.currentType == 1) {
                params = {
                    startTime: moment().format('YYYY-MM-01 00:00:00'),
                    endTime: moment().endOf('month').format('YYYY-MM-DD 23:59:59')
                };
            } else if (_this.vars.currentType == 2) {
                params = {
                    startTime: moment().isoWeekday(1).format('YYYY-MM-DD 00:00:00'),
                    endTime: moment().isoWeekday(7).format('YYYY-MM-DD 23:59:59')
                };
            } else if (_this.vars.currentType == 3) {
                params = {
                    startTime: moment().format('YYYY-MM-DD 00:00:00'),
                    endTime: moment().format('YYYY-MM-DD 23:59:59')
                };
            }
            jam.ajaxCall({
                urlKey: 'getIndexSubstationSuccessData',
                method: 'post',
                data: params,
                onsuccess(res) {
                    const { data } = res;

                    let infoData = [
                        {
                            name: '遥控分',
                            value: data.ykSeparateNum,
                            percent: 0
                        },
                        {
                            name: '遥控合',
                            value: data.ykCombineNum,
                            percent: 0
                        },
                        {
                            name: '调档升',
                            value: data.tdUpNum,
                            percent: 0
                        },
                        {
                            name: '调档降',
                            value: data.tdDownNum,
                            percent: 0
                        }
                    ];
                    let sum = infoData.reduce((total, cur) => total + cur.value, 0);
                    infoData.forEach(function (item) {
                        item.percent = sum == 0 ? 0 : Number(Number(item.value / sum).toFixed(2));
                    });
                    let chartData = [];
                    infoData.forEach(function (item) {
                        chartData.push({
                            propsData: {
                                dataDef: [
                                    {
                                        dataKey: 'a',
                                        title: item.name,
                                        value: '{{data.a.value}}',
                                        dataType: 'analog',
                                        icon: item.name.slice(-1),
                                        unit: '',
                                        valueType: 'number',
                                        hasIcon: true,
                                        toFixed: false,
                                        decimalPos: 2
                                    },
                                    {
                                        dataKey: 'b',
                                        value: '{{data.b.value}}',
                                        dataType: 'percent',
                                        valueType: 'percent',
                                        hasIcon: false,
                                        toFixed: false,
                                        decimalPos: 2,
                                        hasUnit: false,
                                        hasTitle: false
                                    }
                                ]
                            },
                            data: {
                                a: {
                                    value: item.value
                                },
                                b: {
                                    value: item.percent
                                }
                            }
                        });
                    });
                    _this.vars.infoData = chartData;
                    _this.vars.total = sum;
                }
            });
        }
    },
    onmount: function () {
        _this = this;
    },
    onafterrender: function () {
        _this.getOperationData();
    }
};
