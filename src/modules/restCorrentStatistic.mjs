import { buildTable } from '../components/componentBuilder.js';
import { findCol, formatterJameBv } from '../common.js';
import searchBtns from './registerCards/buttons/searchBtns.mjs';
import bvListSelect from './registerCards/select/bvListSelect.mjs';
import regionSelect from './registerCards/select/regionSelect.mjs';
import currencyAverageDetail from '../components/modal/currencyAverageDetail.js';
import currencyStatusDetail from '../components/modal/currencyStatusDetail.js';
import stationSelect from './registerCards/select/stationSelect.mjs';
import currencyMouthlyAverageDetail from '../components/modal/currencyMouthlyAverageDetail.js';

function openBranchStatusDetail(e, statusType) {
    const target = findCol(e.target);
    const keys = [target.col(0), target.col(1), target.col(2), target.col(4), _model.vars.date];
    jam.renderModal('#main', currencyStatusDetail(statusType, keys));
}
let _model;
export default {
    type: 'wrapper',
    styles: ['size.fullsize', 'layout.grid({ cols: 24, rows: 12 })', 'css(gap:1rem)'],
    components: [
        {
            type: 'wrapper',
            styles: ['layout.gridpos([1, 1, 12, 3])', 'css(display:flex;flexDirection:column)'],
            components: [
                {
                    ...regionSelect,
                    styles: [...regionSelect.styles, 'size.fullwidth']
                },
                {
                    ...bvListSelect,
                    styles: [...bvListSelect.styles, 'size.fullwidth']
                },
                {
                    type: 'wrapper',
                    styles: ['size.fullwidth', 'css(marginTop:1rem;gap:1rem)'],
                    components: [
                        stationSelect,
                        {
                            type: 'datepicker',
                            cap: '查询时间：',
                            value: '{{date}}'
                        },
                        searchBtns
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            styles: ['layout.gridpos([13, 1, 12, 3])', 'css(display:flex;flexDirection:column)'],
            components: [
                {
                    type: 'label',
                    ref: 'title-desc'
                },
                {
                    type: 'stackBar',
                    ref: 'statisticBar',
                    props: {
                        hasTitle: false,
                        hasValue: false,
                        hasSubtitle: false,
                        toFixed: false
                    },
                    vars: {
                        data: {}
                    },
                    styles: ['stackBar.basic', 'size.fullsize']
                }
            ]
        },
        {
            type: 'wrapper',
            styles: ['layout.gridpos([1, 4, 24, 9])'],
            components: [
                buildTable({
                    cap: '剩余电流统计',
                    dataDef: [
                        {
                            key: 'stId',
                            show: false
                        },
                        {
                            key: 'stBvId',
                            show: false
                        },
                        {
                            key: 'regionId',
                            show: false
                        },
                        {
                            cap: '区域',
                            key: 'regionName',
                            sortable: false,
                            formatter: function (val) {
                                return val || '--';
                            }
                        },
                        {
                            cap: '变电站',
                            key: 'stName',
                            sortable: false,
                            formatter: function (val) {
                                return val || '--';
                            }
                        },
                        {
                            cap: '电压等级',
                            key: 'stBvName',
                            sortable: false,
                            formatter: formatterJameBv
                        },
                        {
                            cap: '总支路数',
                            key: 'totalCnt',
                            class: 'item-clickable',
                            sortable: false,
                            onclick(e) {
                                openBranchStatusDetail(e, 'all');
                            }
                        },
                        {
                            cap: '异常支路数',
                            key: 'abnormalCnt',
                            class: 'item-clickable',
                            sortable: false,
                            onclick(e) {
                                openBranchStatusDetail(e, 1);
                            }
                        },
                        {
                            cap: '正常支路数',
                            key: 'normalCnt',
                            class: 'item-clickable',
                            sortable: false,
                            onclick(e) {
                                openBranchStatusDetail(e, 0);
                            }
                        },
                        {
                            cap: '当日合格率',
                            key: 'normalRate',
                            type: 'indicator',
                            class: 'item-indicator',
                            unit: '%',
                            sortable: false
                        },
                        {
                            cap: '日平均合格率(当月)',
                            key: 'normalAvgRate',
                            type: 'indicator',
                            class: 'item-indicator item-clickable',
                            styles: [`indicator.value.css(color:${jam.ac({ l: '60%' })}!important)`],
                            unit: '%',
                            sortable: false,
                            onclick(e) {
                                let target = findCol(e.target);
                                const keys = [target.col(0), target.col(1), target.col(2), target.col(4), _model.vars.date];
                                jam.renderModal('#main', currencyMouthlyAverageDetail('每日合格率详情', keys));
                            }
                        },
                        {
                            cap: '操作',
                            sortable: false,
                            formatter: function () {
                                return jame({
                                    type: 'wrapper',
                                    styles: [Styles.layout.flex({ alignItems: 'center', justifyContent: 'center' })],
                                    components: [
                                        {
                                            type: 'button',
                                            cap: '查看',
                                            icon: 'eye',
                                            onclick: function (e) {
                                                let target = findCol(e.target);
                                                const keys = [target.col(0), target.col(1), target.col(2), target.col(4)];
                                                jam.renderModal('#main', currencyAverageDetail('支路实时数据', keys));
                                            }
                                        }
                                    ]
                                });
                            }
                        }
                    ],
                    getReqParams: function () {
                        let _parentNode = this.parentNode;
                        let _this = this;
                        return {
                            method: 'POST',
                            urlKey: 'queryRcBranchStatusDayStatistics',
                            data: {
                                bvIdList: _parentNode.vars.bvId ? [_parentNode.vars.bvId] : undefined,
                                stId: _parentNode.vars.stId ?? undefined,
                                regionIdList: _parentNode.vars.regionId ? [_parentNode.vars.regionId] : undefined,
                                day: _parentNode.vars.date,
                                pageIndex: _this.vars.cpageNo || 1,
                                pageSize: _this.vars.cpageSize || 15
                            },
                            transform(data) {
                                _this.vars.cpageNo = data.data.pageIndex;
                                _this.vars.cpageSize = data.data.pageSize;
                                _this.vars.ctotal = data.data.pojoTotalCount;
                                return data.data.list;
                            }
                        };
                    },
                    exportUrl: 'exportRcBranchStatusDayStatistics'
                })
            ]
        }
    ],
    methods: {
        queryRcBranchRegionStatistics() {
            const _this = this;
            jam.ajaxCall({
                urlKey: 'queryRcBranchRegionStatistics',
                method: 'post',
                data: {
                    bvIdList: this.vars.bvId ? [this.vars.bvId] : undefined,
                    day: this.vars.date,
                    normalRate: 60
                },
                onsuccess(res) {
                    const data = [['区域', '不合格数', '合格数']];
                    let total = 0;
                    let region = '';
                    res.data.forEach((item) => {
                        if (item.totalCnt) {
                            total += item.totalCnt;
                            region = item.regionName;
                        }
                        data.push([item.regionName, item.totalCnt - item.normalCnt, item.normalCnt]);
                    });
                    _this.ref('title-desc').cap = `全省共统计<span style='color:${jam.ac({ l: '60%' })}'>${total}</span>座变电站, 其中<span style='color:${jam.ac({ l: '60%' })}'>${region}</span>地区最多`;
                    _this.ref('statisticBar').vars.data.chartData = data;
                    setTimeout(() => {
                        _this.chartClickWatcher();
                    }, 500);
                }
            });
        },
        chartClickWatcher() {
            const _this = this;
            const _el = jam.findElement(this, 'jam-chart');
            let barOptions = jam.cloneDeep(_el.chartOption);
            _el.chart.on('click', (params) => {
                let { dataIndex: index, name } = params;
                if (index !== undefined) {
                    barOptions = getHeightLigntOption(barOptions, index);
                    _el.chart.setOption(barOptions);
                    _this.msgr('page').pub('regionName', name);
                }
            });
        }
    },
    watchers: [
        {
            key: '_t@page',
            callback() {
                this.queryRcBranchRegionStatistics();
            }
        },
        {
            key: 'regionName@page',
            callback(regionName) {
                const list = this.msgr('page').get('regionList');
                const regionId = list.find((item) => item.name === regionName)?.value || null;
                this.vars.regionId = regionId;
            }
        },
        {
            key: 'regionId',
            callback(id) {
                const regionList = this.msgr('page').get('regionList');
                const _el = jam.findElement(this, 'jam-chart');
                let options = jam.cloneDeep(_el.chartOption);
                // const name = regionList.find((item) => item.value === id)?.name || null;
                const index = regionList.findIndex((item) => item.value === id);
                options = getHeightLigntOption(options, index - 1);
                _el.chart.setOption(options);
            }
        }
    ],
    vars: {
        bvId: null,
        regionId: null,
        date: moment().format('yyyy-MM-DD'),
        barData: []
    },
    onmount() {
        _model = this.model;
    }
};
function getHeightLigntOption(barOptions, index) {
    if (!barOptions) {
        return {};
    }
    let options = jam.cloneDeep(barOptions);
    options.xAxis = {
        ...(options?.xAxis || {}),
        axisLabel: {
            color: function (value, idx) {
                const color = `rgba(${jam.accolor._rgb})`;
                return idx === index ? color : 'hsl(201.6, 33.3%, 64.1%)';
            },
            formatter: function (value, idx) {
                // 根据 index 决定是否加粗
                return idx === index ? `{a|${value}}` : value;
            },
            rich: {
                a: {
                    fontWeight: 'bold',
                    fontSize: 16
                }
            },
            interval: 0
        }
    };
    return options;
}
