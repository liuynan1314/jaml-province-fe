import { mockPath, urlConfig, ALARM_TYPE } from '../../global.js';
import { COLOR_SET } from '../../utils/Constants.js';
let _model, _msgr;
import { buildTable } from '../../components/componentBuilder.js';
import { formatterJameTime, formatterJameBv } from '../../common.js';

const COLOR_LIST = ['hsl(355 100% 63.9%)', 'hsl(39 100% 50.4%)', 'hsl(57 66.3% 51.2%)', 'hsl(162 66.7% 54.1%)', 'hsl(199 100% 59.2%)'];
export default function (_params) {
    return {
        type: 'card',
        // icon: 'compass',
        broker: 'fiveTypesAlarmDetailsWindow',
        cap: _params.customizedGroup === 'total' ? '告警总计数据' : `${ALARM_TYPE[_params.customizedGroup + 1]}详情数据`,
        styles: [
            `background(color:${COLOR_SET.modulebgclr})`,

            Styles.card.floating({
                width: '70vw',
                height: '60vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                styles: ['size.fullsize'],
                components: [_params.customizedGroup === 'total' ? renderTotalTable(_params) : renderEventTable(_params)]
            }
        ],
        vars: {
            type: null,
            desc: false
        },
        watchers: [
            {
                keys: ['type', 'desc'],
                callback: function () {
                    this.msgr('fiveTypesAlarmDetailsWindow').pub('_t', Date.now());
                }
            }
        ],
        onmount() {
            _model = this.model;
        },
        onafterrender: function (dom) {}
    };
}

function renderTotalTable(_params) {
    return {
        type: 'wrapper',
        styles: [Styles.layout.flex({ direction: 'column', alignItems: 'flex-start', wrap: 'nowrap' }), 'size.fullsize'],
        components: [
            {
                type: 'wrapper',
                styles: [Styles.layout.flex({ alignContent: 'center' })],
                components: [
                    {
                        type: 'buttongroup-radio',
                        styles: [Styles.buttonGroupStylesWithBgCap],
                        defaultValue: null,
                        data: [
                            { name: '总计', value: null },
                            { name: '事故', value: 0 },
                            { name: '异常', value: 1 },
                            { name: '越限', value: 2 },
                            { name: '变位', value: 3 },
                            { name: '告知', value: 4 }
                        ],
                        value: '{{type}}'
                    },
                    {
                        type: 'buttongroup-radio',
                        styles: [Styles.buttonGroupStylesWithBgCap],
                        defaultValue: false,
                        data: [
                            { name: '时间正序', value: false },
                            { name: '时间倒序', value: true }
                        ],
                        value: '{{desc}}'
                    },
                    {
                        type: 'button',
                        cap: '导出',
                        icon: 'file-export',
                        class: 'export-btn',
                        styles: [Styles.icon.duotone, Styles.css({ height: '2rem', marginTop: '0.3rem' })],
                        state: '{{to-export-table}}?"loading":"normal"',
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
                        onclick: function () {
                            if (this.msgr.get('to-export-table')) return;
                            this.msgr('fiveTypesAlarmDetailsWindow').pub('to-export-table', Date.now());
                        }
                    }
                ]
            },
            buildTable({
                cap: '告警数量总计统计-表格',
                icon: 'table',
                dataDef: [
                    {
                        key: 'stId',
                        show: false
                    },
                    {
                        cap: '变电站',
                        key: 'stName',
                        sortable: false
                    },
                    {
                        cap: '发生时间',
                        key: 'occurTime',
                        formatter: formatterJameTime
                    },
                    {
                        cap: '信号描述',
                        key: 'content',
                        sortable: false,
                        width: '60%',
                        align: 'left',
                        styles: [Styles.toShowAll]
                    },
                    {
                        cap: '类型',
                        key: 'customizedGroup',
                        sortable: false,
                        formatter: function (value) {
                            if (!value && value !== 0) {
                                return;
                            }
                            value = Number(value);
                            return ALARM_TYPE[value + 1];
                        }
                    }
                ],
                getReqParams: function () {
                    const _p = {
                        pageIndex: this.model.cpageNo || 1,
                        pageSize: this.model.cpageSize || 20,
                        ..._params,
                        desc: _model.vars.desc,
                        customizedGroup: _model.vars.type
                    };
                    return {
                        method: 'post',
                        data: {
                            ..._p
                        },
                        url: urlConfig.getWarnDetails.url,
                        mock: mockPath + urlConfig.getWarnDetails.mock,
                        transform: (res) => {
                            const { list = [], pojoTotalCount = 0 } = res?.data || {};
                            this.model.ctotal = pojoTotalCount;
                            return list;
                        }
                    };
                },
                styles: [
                    Styles.css({
                        height: '90%'
                    })
                ],
                exportUrl: 'exportWarnDetailsByParam',
                exportParams: {
                    pageMaxValue: 40000
                },
                broker: 'fiveTypesAlarmDetailsWindow'
            })
        ]
    };
}

function renderEventTable(_params) {
    return {
        type: 'basicTable',
        props: {
            dataDef: [
                {
                    key: 'stId',
                    show: false
                },
                {
                    cap: '变电站',
                    key: 'stName',
                    sortable: false
                },
                {
                    cap: '间隔名称',
                    key: 'bayName',
                    sortable: false
                },
                {
                    cap: '电压等级',
                    key: 'stBvName',
                    sortable: false,
                    formatter: formatterJameBv
                },
                {
                    cap: '设备名称',
                    key: 'keyName',
                    sortable: false
                },
                {
                    cap: '类型',
                    key: 'customizedGroup',
                    sortable: false,
                    formatter: function (value) {
                        if (!value && value !== 0) {
                            return;
                        }
                        value = Number(value);
                        return ALARM_TYPE[value + 1];
                    }
                },
                {
                    cap: '数量',
                    key: 'recordNum',
                    formatter: function (value) {
                        const type = Number(this.col(5));
                        const color = COLOR_LIST?.[type] ?? '';
                        return `<div style="color:${color}">${value}</div>`;
                    }
                }
            ]
        },
        styles: [Styles.tableStyles, Styles.iconslot.css({ display: 'none' }), Styles.capslot.css({ display: 'none' }), 'size.fullsize', 'padding(0)'],
        onafterrender: async function (dom) {
            await jam.ajaxCall({
                method: 'post',
                data: {
                    ..._params
                },
                url: urlConfig.getJkAlarmNumByRecordType.url,
                mock: mockPath + urlConfig.getJkAlarmNumByRecordType.mock,
                transform: (res) => {
                    const _data = res?.data || [];
                    this.data = _data;
                }
            });
        }
    };
}
