import { formatterJameTime } from '../../common.js';
import { buildBasicTable } from '../componentBuilder.js';

const PANEL_BORDER = 'var(--jam-color-outline-muted)';
const PANEL_BG = 'var(--jam-color-primary-subtle)';
const PANEL_BG_LIGHT = 'var(--jam-color-primary-film)';
const PANEL_INNER_BG = 'tint';

const BROKER = 'rcStatusDetailModal';
const TITLE_MAP = {
    all: '支路详情',
    0: '正常支路详情',
    1: '异常支路详情'
};

let _modal;

// function mapBranchStatusForCc(apiStatus) {
//     if (apiStatus === 0 || apiStatus === '0') return 1;
//     if (apiStatus === 1 || apiStatus === '1') return 0;
//     return apiStatus;
// }

function buildChartData(sampleList, branchMap) {
    if (!sampleList?.length) return [['时间']];
    const header = ['时间'];
    sampleList.forEach((item) => {
        header.push(branchMap[item.lcId] || item.lcId);
    });
    const chartData = [header];
    const maxLen = Math.max(...sampleList.map((item) => item.sampleList?.length || 0));
    for (let i = 0; i < maxLen; i++) {
        const row = [];
        sampleList.forEach((item, idx) => {
            const sample = item.sampleList?.[i];
            if (!idx) {
                let time;
                if (sample?.occurTime) {
                    time = sample?.occurTime.split(' ').pop();
                } else {
                    time = '--:--:--';
                }
                row.push(time);
            }
            row.push(sample?.sampleValue ?? '--');
        });
        chartData.push(row);
    }
    return chartData;
}

export default function currencyStatusDetail(statusType, keys) {
    const [stId, , regionId, stName, date] = keys;
    const branchStatus = statusType === 'all' ? null : statusType;

    return {
        type: 'card',
        cap: stName + TITLE_MAP[statusType] || TITLE_MAP.all,
        broker: BROKER,
        styles: [
            Styles.card.floating({
                width: '88vw',
                height: '75vh'
            }),
            'card.bodyslot.css(display:flex;flexDirection:column;overflow:hidden;padding:m)',
            Styles.stylesheet({
                '.status-detail-body': {
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    gap: 'm',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                },
                '.status-detail-left': {
                    width: '20%',
                    minWidth: '20%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                    minHeight: 0,
                    padding: 0,
                    boxSizing: 'border-box',
                    borderRadius: 's',
                    border: `s solid ${PANEL_BORDER}`,
                    background: PANEL_BG,
                    overflow: 'hidden'
                },
                '.status-detail-left-filters': {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'xs',
                    padding: 's',
                    boxSizing: 'border-box',
                    background: PANEL_BG_LIGHT
                },
                '.status-detail-filter-row': {
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    boxSizing: 'border-box'
                },
                '.status-detail-left-list': {
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    padding: '0 s',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                    background: PANEL_INNER_BG,
                    overflow: 'hidden',
                    '.br-items': {
                        gap: 's'
                    }
                },
                '.status-detail-right': {
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'm',
                    minHeight: 0
                },
                '.status-detail-chart-panel': {
                    height: '38%',
                    minHeight: '9rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'xs',
                    padding: 's',
                    boxSizing: 'border-box',
                    borderRadius: 's',
                    border: `s solid ${PANEL_BORDER}`,
                    background: PANEL_BG,
                    overflow: 'hidden'
                },
                '.status-detail-chart-toolbar': {
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'xs',
                    padding: 'xs s',
                    boxSizing: 'border-box',
                    borderRadius: 'xs',
                    background: PANEL_BG_LIGHT
                },
                '.status-detail-chart-content': {
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 'xs',
                    boxSizing: 'border-box',
                    borderRadius: 'xs',
                    background: PANEL_INNER_BG
                },
                '.status-detail-table-panel': {
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                    overflow: 'hidden',
                    padding: 0,
                    boxSizing: 'border-box',
                    borderRadius: 's',
                    border: `s solid ${PANEL_BORDER}`,
                    background: PANEL_BG
                },
                '.status-detail-table-body': {
                    flex: 1,
                    minHeight: 0,
                    overflow: 'hidden',
                    padding: 0
                }
            })
        ],
        descStyles: {
            '*': ['icon.solid']
        },
        components: [
            {
                type: 'wrapper',
                class: 'status-detail-body',
                components: [
                    {
                        type: 'wrapper',
                        class: 'status-detail-left',
                        components: [
                            {
                                type: 'wrapper',
                                class: 'status-detail-left-filters',
                                components: [
                                    {
                                        type: 'wrapper',
                                        class: 'status-detail-filter-row',
                                        components: [
                                            {
                                                type: 'select',
                                                cap: '支路状态：',
                                                icon: 'octagon-check',
                                                styles: [Styles.select.regularStyle, 'css(width:100%;margin:0)'],
                                                value: '{{filterStatus}}',
                                                data: [
                                                    { name: '全部', value: null },
                                                    { name: '正常', value: 0 },
                                                    { name: '异常', value: 1 }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'wrapper',
                                        class: 'status-detail-filter-row',
                                        components: [
                                            {
                                                type: 'input',
                                                cap: '支路名称：',
                                                icon: 'search',
                                                placeholder: '请输入支路名称',
                                                styles: [Styles.input.regularStyle, 'css(flex:1;minWidth:0;margin:0)'],
                                                value: '{{branchName}}'
                                            },
                                            {
                                                type: 'button',
                                                cap: '查询',
                                                icon: 'search',
                                                class: 'jam-cta',
                                                styles: [Styles.searchBtnsStyles, 'css(flex:none;margin:0 0 0 xs)'],
                                                onclick() {
                                                    _modal.loadBranchList();
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'wrapper',
                                class: 'status-detail-left-list',
                                components: [
                                    {
                                        type: 'list12-1',
                                        ref: 'branchList',
                                        styles: ['list12-1.basic', 'css(flex:1;minHeight:0;overflow:auto)'],
                                        props: {
                                            data: '{{branchDatas}}',
                                            selected: '{{selectedId}}'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        class: 'status-detail-right',
                        components: [
                            {
                                type: 'wrapper',
                                class: 'status-detail-chart-panel',
                                components: [
                                    {
                                        type: 'wrapper',
                                        class: 'status-detail-chart-toolbar',
                                        components: [
                                            {
                                                type: 'datepicker',
                                                cap: '时间',
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
                                                        onclick() {
                                                            _modal.msgr(BROKER).pub('_t', Date.now());
                                                        }
                                                    },
                                                    {
                                                        type: 'button',
                                                        cap: '导出',
                                                        icon: 'file-export',
                                                        class: 'export-btn',
                                                        state: `{{to-export-table@${BROKER}}}?"loading":"normal"`,
                                                        states: {
                                                            loading: {
                                                                icon: 'spinner',
                                                                styles: [
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
                                                        onclick() {
                                                            if (this.msgr(BROKER).get('to-export-table')) return;
                                                            this.msgr(BROKER).pub('to-export-table', Date.now());
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'wrapper',
                                        class: 'status-detail-chart-content',
                                        components: [
                                            {
                                                type: 'line9-1',
                                                ref: 'sampleChart',
                                                styles: ['line9-1.basic', 'css(flex:1;minHeight:0)'],
                                                props: {
                                                    limitValue: 300,
                                                    limitTitle: '告警线',
                                                    limitType: 'error',
                                                    title: '',
                                                    limitValue: 300,
                                                    yAxisName: 'A',
                                                    xAxisName: '时间',
                                                    interval: 119,
                                                    limitTitle: '告警线',
                                                    limitType: 'error',
                                                    whiteList: '{{whiteList1}}',
                                                    data: {
                                                        chartData: '{{chartData}}'
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'wrapper',
                                class: 'status-detail-table-panel',
                                components: [
                                    {
                                        type: 'wrapper',
                                        class: 'status-detail-table-body',
                                        components: [
                                            buildBasicTable({
                                                cap: '支路异常信息',
                                                icon: 'table',
                                                broker: BROKER,
                                                dataKey: 'abnormalTableData',
                                                dataDef: [
                                                    {
                                                        cap: '支路名称',
                                                        key: 'branchName',
                                                        sortable: false,
                                                        formatter(val) {
                                                            return val || '--';
                                                        }
                                                    },
                                                    {
                                                        cap: '越限时长',
                                                        key: 'duration',
                                                        type: 'indicator',
                                                        class: 'item-indicator',
                                                        unit: '分钟',
                                                        sortable: false,
                                                        formatter(val) {
                                                            return val ?? '--';
                                                        }
                                                    },
                                                    {
                                                        cap: '开始时间',
                                                        key: 'beginTime',
                                                        sortable: false,
                                                        formatter: formatterJameTime
                                                    },
                                                    {
                                                        cap: '结束时间',
                                                        key: 'endTime',
                                                        sortable: false,
                                                        formatter: formatterJameTime
                                                    },
                                                    {
                                                        cap: '电流最大值',
                                                        key: 'maxValue',
                                                        type: 'indicator',
                                                        class: 'item-indicator',
                                                        unit: 'A',
                                                        sortable: false,
                                                        formatter(val) {
                                                            return val ?? '--';
                                                        }
                                                    },
                                                    {
                                                        cap: '电流最大值时间',
                                                        key: 'maxValueTime',
                                                        sortable: false,
                                                        formatter: formatterJameTime
                                                    },
                                                    {
                                                        cap: '电流最小值',
                                                        key: 'minValue',
                                                        type: 'indicator',
                                                        class: 'item-indicator',
                                                        unit: 'A',
                                                        sortable: false,
                                                        formatter(val) {
                                                            return val ?? '--';
                                                        }
                                                    },
                                                    {
                                                        cap: '电流最小值时间',
                                                        key: 'minValueTime',
                                                        sortable: false,
                                                        formatter: formatterJameTime
                                                    },
                                                    {
                                                        cap: '电流上限值',
                                                        key: 'upLimitValue',
                                                        type: 'indicator',
                                                        class: 'item-indicator',
                                                        unit: 'A',
                                                        sortable: false,
                                                        formatter(val) {
                                                            return val ?? '--';
                                                        }
                                                    },
                                                    {
                                                        cap: '电流下限值',
                                                        key: 'lowLimitValue',
                                                        type: 'indicator',
                                                        class: 'item-indicator',
                                                        unit: 'A',
                                                        sortable: false,
                                                        formatter(val) {
                                                            return val ?? '--';
                                                        }
                                                    }
                                                ],
                                                getReqParams() {
                                                    const selectedIds = _modal?.ref('branchList')?.vars?.selectedId || [];
                                                    if (!selectedIds.length) return null;
                                                    return {
                                                        method: 'post',
                                                        urlKey: 'queryRcBranchAbnormalDetail',
                                                        data: {
                                                            regionId: _modal.vars.regionId,
                                                            stId: _modal.vars.stId,
                                                            branchIdList: selectedIds,
                                                            beginTime: `${_modal.vars.date} 00:00:00`,
                                                            endTime: `${_modal.vars.date} 23:59:59`
                                                        },
                                                        transform(res) {
                                                            _modal.querySampleData();
                                                            return res?.data?.list || res?.data || [];
                                                        }
                                                    };
                                                },
                                                exportUrl: 'exportRcBranchAbnormalDetail'
                                            })
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        vars: {
            stId,
            regionId,
            stName,
            date,
            branchStatus,
            filterStatus: branchStatus,
            branchName: '',
            branchNameMap: {},
            branchDatas: [],
            selectedId: [],
            date: date || moment().format('YYYY-MM-DD'),
            chartData: [['时间']],
            whiteList1: []
        },
        methods: {
            loadBranchList() {
                const _this = this;
                jam.ajaxCall({
                    urlKey: 'queryRcBranchStatusDayDetail',
                    method: 'post',
                    data: {
                        stId: _this.vars.stId,
                        day: _this.vars.date,
                        name: _this.vars.branchName || undefined,
                        status: _this.vars.filterStatus,
                        regionId: _this.vars.regionId
                    },
                    onsuccess(res) {
                        const list = res?.data || [];
                        const branchNameMap = {};
                        const branchList = list.map((item) => {
                            branchNameMap[item.branchId] = item.branchName;
                            return {
                                id: item.branchId,
                                name: item.branchName,
                                // status: mapBranchStatusForCc(item.status),
                                status: item.status,
                                whiteFlag: item.whiteFlag
                            };
                        });
                        _this.vars.branchDatas = branchList;
                        _this.vars.selectedId = [branchList?.[0]?.id || ''];
                        _this.vars.branchNameMap = branchNameMap;
                        _this.msgr(BROKER).pub('_t', Date.now());
                    }
                });
            },
            querySampleData() {
                const _this = this;
                const lcIdList = _this.ref('branchList')?.vars?.selectedId || [];
                if (!lcIdList.length) {
                    _this.vars.chartData = [['时间']];
                    return;
                }
                jam.ajaxCall({
                    urlKey: 'queryDevHisSample',
                    method: 'post',
                    data: {
                        lcIdList,
                        beginTime: `${_this.vars.date} 00:00:00`,
                        endTime: `${_this.vars.date} 23:59:59`
                    },
                    onsuccess(res) {
                        const sampleList = res?.data || [];
                        _this.vars.chartData = buildChartData(sampleList, _this.vars.branchNameMap);
                    }
                });
            }
        },
        watchers: [
            {
                key: 'selectedId',
                callback() {
                    this.querySampleData();
                    _modal.msgr(BROKER).pub('_t', Date.now());
                }
            }
        ],
        onmount() {
            _modal = this;
        },
        onafterrender() {
            _modal = this;
            this.loadBranchList();
        }
    };
}
