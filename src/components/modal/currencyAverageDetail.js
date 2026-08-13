import { formatterJameTime, formatterStateType } from '../../common.js';
import { buildBasicTable } from '../../components/componentBuilder';
import stationSelect from '../../modules/registerCards/select/stationSelect.mjs';
let _model;
export default function (title, keys) {
    const [stId, _, regionId, stName] = keys;
    return {
        type: 'card',
        cap: title,
        broker: 'rcDetailModal',
        styles: [
            Styles.card.floating({
                width: '60vw',
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
                components: [
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
                        type: 'input',
                        cap: '支路名称：',
                        icon: 'search',
                        styles: [Styles.input.regularStyle],
                        value: '{{zlname}}'
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
                                    this.msgr('rcDetailModal').pub('_t', Date.now());
                                }
                            },
                            {
                                type: 'button',
                                cap: '导出',
                                icon: 'file-export',
                                class: 'export-btn',
                                state: '{{to-export-table@rcDetailModal}}?"loading":"normal"',
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
                                    if (this.msgr('rcDetailModal').get('to-export-table')) return;
                                    this.msgr('rcDetailModal').pub('to-export-table', Date.now());
                                }
                            }
                        ]
                    }
                ]
            },
            buildBasicTable({
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
                        cap: '支路名称',
                        key: 'branchName',
                        sortable: false
                    },

                    {
                        cap: '剩余电流值',
                        key: 'rcValue',
                        type: 'indicator',
                        class: 'item-indicator',
                        unit: 'A',
                        sortable: false
                    },
                    {
                        cap: '支路状态',
                        key: 'statusStr',
                        sortable: false,
                        formatter: function (res) {
                            return formatterStateType(res, res === '异常' ? 'warn' : 'success');
                        }
                    },
                    {
                        cap: '上限告警值',
                        key: 'upLimitValue',
                        type: 'indicator',
                        class: 'item-indicator',
                        unit: 'A',
                        sortable: false
                    },
                    {
                        cap: '更新时间',
                        key: 'updateTime',
                        formatter: formatterJameTime
                    }
                ],
                getReqParams: function () {
                    const _this = this.parentNode;
                    return {
                        method: 'post',
                        data: {
                            regionIdList: _this.vars.regionId ? [_this.vars.regionId] : [],
                            stId: _this.vars.stId,
                            name: _this.vars.zlname
                        },
                        urlKey: 'queryRcBranchStatusDayDetail',
                        // useMock: true,
                        transform: (res) => {
                            return res.data;
                        }
                    };
                },
                exportUrl: 'exportRcBranchStatusDayDetail',
                broker: 'rcDetailModal'
            })
        ],
        vars: {
            regionId: null,
            stId: null,
            name: '',
            zlname: ''
        },
        onmount() {
            this.vars.regionId = regionId;
            this.vars.stId = stId;
            this.vars.name = stName;
            // this.queryRcBranchStatusDayDetail();
        }
    };
}
