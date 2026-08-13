import { COLOR_SET } from '../utils/Constants.js';
import { formatterJameTime, loadConf } from '../common.js';
import { urlConfig, mockPath } from '../global.js';
let _model, _msgr;
const pagerKey = jam.genUUID();
import bvListSelect from './registerCards/select/bvListSelect.mjs';
import regionSelect from './registerCards/select/regionSelect.mjs';
import stationSelect from './registerCards/select/stationSelect.mjs';
import devTypeSelect from './registerCards/select/devTypeSelect.mjs';

import searchBtns from './registerCards/buttons/searchBtns.mjs';
import dateRangePicker from './registerCards/dateRange/dateRangePicker.mjs';
import { buildButtonGroup } from '../components/componentBuilder.js';
import fiveTypesAlarmEventTable from './fiveTypesAlarmEventTable.mjs';
import fiveTypesAlarmTotalTable from './fiveTypesAlarmTotalTable.mjs';

export default {
    type: 'wrapper',
    broker: 'fiveTypesAlarmDetails',
    styles: [
        'padding(bottom:0)',
        'size.fullsize',
        Styles.css({
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        })
    ],
    components: [
        {
            type: 'wrapper',
            styles: [
                Styles.css({
                    display: 'flex'
                })
            ],
            components: [
                {
                    type: 'wrapper',
                    styles: ['flex(flex:1;direction:column;gap:0.5rem)'],
                    components: [
                        buildButtonGroup({
                            cap: '告警类型',
                            icon: 'chart-pyramid',
                            valueName: 'customizedGroup',
                            defaultValue: 'total',
                            data: [
                                { name: '总计', value: 'total' },
                                { name: '事故', value: 0 },
                                { name: '异常', value: 1 },
                                { name: '越限', value: 2 },
                                { name: '变位', value: 3 },
                                { name: '告知', value: 4 }
                            ]
                        }),
                        regionSelect,
                        {
                            type: 'wrapper',
                            styles: [
                                'layout.flex(alignItems:flex-end;justifyContent:flex-start)',
                                'margin(top:var(--gap))',
                                Styles.stylesheet({
                                    ':scope': {},
                                    '.ml-_625rem': {
                                        marginLeft: '.625rem'
                                    },
                                    'jam-container': {
                                        marginBottom: '0.4rem'
                                    },
                                    'jam-select': {
                                        marginBottom: '0.1rem'
                                    }
                                })
                            ],
                            components: [bvListSelect, stationSelect, devTypeSelect]
                        },
                        {
                            type: 'wrapper',
                            styles: [
                                'layout.flex(alignItems:center;justifyContent:flex-start)',
                                'margin(top:var(--gap))',
                                Styles.stylesheet({
                                    ':scope': {},
                                    '.ml-_625rem': {
                                        marginLeft: '.625rem'
                                    }
                                })
                            ],
                            components: [dateRangePicker, searchBtns]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    styles: ['css(width:40%)', 'flex(direction:column;)'],
                    components: jaml.var('customizedGroup@page', function (type) {
                        return [
                            {
                                type: 'label',
                                cap: jaml.var('customizedGroup@page', function (type) {
                                    return type === 'total' ? '告警信息数量统计' : '各地市事故数量统计';
                                }),
                                styles: [
                                    Styles.stylesheet({
                                        '[slot=cap]': {
                                            display: 'block',
                                            minWidth: '13.2rem',
                                            height: '2.25rem',
                                            paddingLeft: '1.5rem',
                                            backgroundImage: 'url(./../assets/images/title_third.png)',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'bottom var(--gap) left',
                                            backgroundSize: 'auto 1.875rem'
                                        }
                                    })
                                ]
                            },
                            type === 'total'
                                ? {
                                      type: 'basicLineChart',
                                      buildIf: "{{customizedGroup@page}} === 'total'",
                                      props: {
                                          chartData: '{{data}}'
                                      },
                                      ref: 'alarmDetailsTotalChart',
                                      vars: {},
                                      styles: ['basicLineChart.basic', 'css(width:100%;height:calc(100% - 4.5rem))']
                                  }
                                : {
                                      type: 'stripyBarChart',
                                      props: {
                                          unit: '个'
                                      },
                                      ref: 'alarmDetailsEventChart',
                                      vars: {
                                          data: {}
                                      },
                                      styles: ['stripyBarChart.basic', 'css(width:100%;height:calc(100% - 2.2rem))']
                                  }
                        ];
                    })
                }
            ]
        },
        {
            type: 'wrapper',
            styles: ['flex(direction: column)', 'margin(top:0rem)', 'layout(overflow:hidden)', 'flex(1)'],
            components: jaml.var('customizedGroup@page', function (type) {
                return type === 'total' ? [fiveTypesAlarmTotalTable] : [fiveTypesAlarmEventTable];
            })
        }
    ],
    vars: {
        customizedGroup: 'total',
        bvId: null,
        regionId: null,
        beginDate: moment().format('yyyy-MM-DD'),
        endDate: moment().format('yyyy-MM-DD'),
        tableId: ''
    },
    watchers: [
        {
            key: '_t',
            callback: function () {
                const type = this.msgr.get('customizedGroup');
                if (type === 'total') {
                    this.getAlarmTotalData();
                } else {
                    this.getAlarmEventData();
                }
            }
        }
    ],
    methods: {
        getAlarmTotalData() {
            const _this = this;
            const { customizedGroup, stId, tableId, beginDate, endDate } = this.model.vars;
            jam.ajaxCall({
                method: 'post',
                data: {
                    customizedGroup,
                    stId,
                    tableId,
                    endTime: endDate + ' 23:59:59',
                    startTime: beginDate + ' 00:00:00'
                },
                url: urlConfig['getAlarmBarNum'].url,
                mock: mockPath + urlConfig['getAlarmBarNum'].mock,
                onsuccess: function (res) {
                    const data = res?.data || [];

                    const title = ['日期'];
                    data.forEach((item) => {
                        title.push(item.stName);
                    });

                    const chartData = [title];
                    const days = data.length > 0 && Array.isArray(data[0].list) ? data[0].list.length : 7;
                    for (let i = 0; i < days; i++) {
                        const currentDate = jam.formatDate(new Date(beginDate).valueOf() + i * 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
                        const row = [currentDate];
                        data.forEach((item) => {
                            let val = item.list[i];
                            if (val === null || val === undefined || val === '') {
                                row.push(0);
                            } else {
                                const numVal = Number(val);
                                row.push(isNaN(numVal) ? 0 : numVal);
                            }
                        });

                        chartData.push(row);
                    }

                    _this.ref('alarmDetailsTotalChart').vars.data = chartData;
                }
            });
        },
        getAlarmEventData() {
            const _this = this;
            const { customizedGroup, stId, bvId, regionId, tableId, beginDate, endDate } = this.model.vars;
            jam.ajaxCall({
                method: 'post',
                data: {
                    recordType: customizedGroup,
                    groupType: 1,
                    stId,
                    tableId,
                    regionId,
                    stBvId: bvId,
                    endTime: endDate + ' 23:59:59',
                    startTime: beginDate + ' 00:00:00'
                },
                url: urlConfig['getMainAuxBarData'].url,
                mock: mockPath + urlConfig['getMainAuxBarData'].mock,
                onsuccess: function (res) {
                    const data = res?.data || [];
                    const title = ['地区', '告警数'];
                    const _chartData = data.map((item) => {
                        item.total = item.numList ? item.numList.reduce((acc, curr) => acc + curr.count ?? 0, 0) : 0;
                        return [item.regionName, item.total];
                    });
                    _this.ref('alarmDetailsEventChart').vars.data.chartData = [title, ..._chartData];
                }
            });
        }
    },
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onunmount: function () {},
    onafterrender: function () {}
};
