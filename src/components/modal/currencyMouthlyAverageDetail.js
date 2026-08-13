import { formatterJameBv, formatterJameTime } from '../../common.js';
import { buildTable } from '../componentBuilder.js';
import stationSelect from '../../modules/registerCards/select/stationSelect.mjs';
let _model;
export default function (title, keys) {
    const [stId, _, regionId, stName, date] = keys;
    return {
        type: 'card',
        cap: title,
        broker: 'rcMonthlyDetailModal',
        styles: [
            Styles.card.floating({
                width: '75vw',
                height: '60vh'
            }),
            'card.bodyslot.css(display:flex;flexDirection:column)'
        ],
        descStyles: {
            '*': ['icon.solid']
        },
        components: [
            {
                type: 'wrapper',
                styles: ['css(display:flex;flex-wrap:wrap)'],
                components: [
                    {
                        type: 'buttongroup-radio',
                        cap: '电压等级',
                        icon: 'bolt',
                        value: '{{bvId}}',
                        data: '{{bvList@page}}'
                    },
                    {
                        type: 'select',
                        cap: '地区：',
                        icon: 'octagon-check',
                        styles: [Styles.select.regularStyle],
                        value: '{{regionId}}',
                        data: '{{regionList@page}}'
                    },
                    { ...stationSelect, styles: ['css(display:flex;justifyContent:flex-end)'] },
                    {
                        type: 'datepicker',
                        cap: '查询时间',
                        icon: 'clock',
                        value: '{{date}}'
                    },
                    {
                        type: 'wrapper',
                        styles: ['css(display:flex;alignItems:center)'],
                        buttonStyles: [Styles.searchBtnsStyles],
                        components: [
                            {
                                type: 'button',
                                cap: '查询',
                                icon: 'search',
                                class: 'jam-cta',
                                onclick: function () {
                                    this.msgr('rcMonthlyDetailModal').pub('_t', Date.now());
                                }
                            },
                            {
                                type: 'button',
                                cap: '导出',
                                icon: 'file-export',
                                class: 'export-btn',
                                state: '{{to-export-table@rcMonthlyDetailModal}}?"loading":"normal"',
                                states: {
                                    loading: {
                                        icon: 'spinner',
                                        styles: [
                                            //
                                            'css(backdrop-filter:grayscale(.2);cursor:not-allowed;)',
                                            Styles.stylesheet({
                                                ':scope': {
                                                    '[slot="icon"]>i': {
                                                        animation: 'fa-spin',
                                                        animationDuration: '1s',
                                                        animationIterationCount: 'infinite',
                                                        animationTimingFunction: 'linear'
                                                    }
                                                }
                                            })
                                        ]
                                    },
                                    normal: {
                                        icon: 'file-export'
                                    }
                                },
                                onclick: function () {
                                    if (this.msgr('rcMonthlyDetailModal').get('to-export-table')) return;
                                    this.msgr('rcMonthlyDetailModal').pub('to-export-table', Date.now());
                                }
                            }
                        ]
                    }
                ]
            },
            buildTable({
                cap: title,
                icon: 'table',
                dataDef: [
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
                        sortable: false
                    },
                    {
                        cap: '异常支路数',
                        key: 'abnormalCnt',
                        sortable: false
                    },
                    {
                        cap: '正常支路数',
                        key: 'normalCnt',
                        sortable: false
                    },
                    {
                        cap: '日合格率',
                        key: 'normalRate',
                        type: 'indicator',
                        class: 'item-indicator',
                        unit: '%',
                        sortable: false
                    },
                    {
                        cap: '日期',
                        key: 'statisticsDay',
                        formatter: formatterJameTime
                    }
                ],
                getReqParams: function () {
                    const _this = this;
                    return {
                        method: 'post',
                        data: {
                            pageIndex: _this.vars.cpageNo,
                            pageSize: _this.vars.cpageSize,
                            bvIdList: _model.vars.bvId ? [_model.vars.bvId] : undefined,
                            stId: _model.vars.stId ?? undefined,
                            regionIdList: _model.vars.regionId ? [_model.vars.regionId] : undefined,
                            day: _model.vars.date,
                            detailFlag: true
                        },
                        urlKey: 'queryRcBranchStatusDayStatistics',
                        // useMock: true,
                        transform: (res) => {
                            const { list = [], pojoTotalCount = 0 } = res?.data || {};
                            this.model.ctotal = pojoTotalCount;
                            return list;
                        }
                    };
                },
                exportUrl: 'exportRcBranchStatusDayStatistics',
                broker: 'rcMonthlyDetailModal'
            })
        ],
        onafterrender() {
            _model = this.model;
            _model.vars.regionId = regionId;
            _model.vars.bvId = null;
            _model.vars.stId = stId;
            _model.vars.name = stName;
            _model.vars.date = date;
            // this.queryRcBranchStatusDayDetail();
        }
    };
}
