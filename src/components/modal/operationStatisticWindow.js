import { ajaxCall } from '../../common.js';
import diffImportantDevTable from '../diffImportantDevTable.js';
import { optTypeList } from '../../modules/operationStatistics.mjs';
let _model, _msgr;
const operationStatisticWindow = () => {
    return {
        type: 'card',
        icon: '',
        cap: '统计详情',
        styles: [
            Styles.card.floating({
                width: '70vw',
                height: '30vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                id: 'operationStatisticWindow',
                styles: [
                    'props(display:flex;flexDirection:column;overflow:hidden;)',
                    'size(width:100%;height:calc(100% - 1rem))',
                    Styles.stylesheet({
                        ':scope': {
                            padding: 'm'
                        },
                        '.form_wrapper': {
                            width: '100%',
                            display: 'flex',

                            'jam-button': {
                                marginLeft: 'm'
                            }
                        }
                    })
                ],
                components: [
                    {
                        type: 'wrapper',
                        class: 'form_wrapper',
                        styles: [
                            'layout.flex(alignItems:center;justifyContent:flex-start)',
                            'margin(top:var(--gap))',
                            Styles.stylesheet({
                                ':scope': {},
                                '.ml-_625rem': {
                                    marginLeft: 'm'
                                }
                            })
                        ],
                        buttonStyles: [Styles.searchBtnsStyles],
                        datepickerStyles: [Styles.datepicker.regularStyle],
                        components: [
                            { type: 'datepicker', value: '{{beginDate}}', max: '{{endDate}}', cap: '查询时间：' },
                            { type: 'datepicker', value: '{{endDate}}', min: '{{beginDate}}', cap: '-' },
                            {
                                type: 'select',
                                styles: [Styles.select.regularStyle],
                                class: 'form_item',
                                cap: '统计类型：',
                                valueKey: 'cntType',
                                data: [
                                    { name: '区域', value: 0 },
                                    { name: '电压等级', value: 1 },
                                    { name: '变电站', value: 2 }
                                ],
                                onvaluechange: function (value) {
                                    _model.vars.cntType = value;
                                }
                            },
                            {
                                type: 'select',
                                styles: [Styles.select.regularStyle],
                                class: 'form_item',
                                cap: '操作类型：',
                                valueKey: 'optStType',
                                data: optTypeList,
                                onvaluechange: function (value) {
                                    _model.vars.optStType = value;
                                }
                            },
                            {
                                type: 'input',
                                cap: '统计内容：',
                                styles: [Styles.input.regularStyle],
                                value: '{{_content}}'
                            },
                            {
                                type: 'button',
                                class: 'jam-cta',
                                cap: '查询',
                                styles: [Styles.icon.duotone],
                                icon: 'magnifying-glass',
                                onclick: function () {
                                    getOperationStatData();
                                }
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        class: 'tableContent',
                        styles: [
                            //
                            'flex(direction: column)',
                            'margin(top:var(--gap))',
                            'layout(overflow:hidden)',
                            'flex(1)'
                        ],
                        components: [
                            {
                                type: 'table',
                                styles: [
                                    //
                                    'flex(1)',
                                    Styles.tableStyles
                                ],
                                dataWatcher: 'operationStData',
                                dataDef: [
                                    {
                                        cap: '统计类型',
                                        key: 'name',
                                        sortable: false
                                    },
                                    {
                                        cap: '成功次数',
                                        key: 'successCount',
                                        sortable: false
                                    },
                                    {
                                        cap: '失败次数',
                                        key: 'failCount',
                                        sortable: false
                                    },
                                    {
                                        cap: '成功率',
                                        key: 'successRate',
                                        sortable: false
                                    }
                                ]
                            }
                        ]
                    }
                ],
                vars: {
                    beginDate: moment().format('yyyy-MM-DD'),
                    endDate: moment().format('yyyy-MM-DD'),
                    cntType: 0,
                    optStType: 1
                },
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                onafterrender: function () {
                    getOperationStatData();
                }
            }
        ]
    };
};

function getOperationStatData() {
    const startTime = _model.vars.beginDate ? _model.vars.beginDate + ' 00:00:00' : undefined;
    const endTime = _model.vars.endDate ? _model.vars.endDate + ' 23:59:59' : undefined;
    console.log('cntType', _model.vars.cntType);
    const cntType = _model.vars.cntType;
    const opType = _model.vars.optStType;
    console.log({
        startTime,
        endTime,
        cntType,
        opType
    });
    ajaxCall(
        'getRemoteCnt',
        {
            success(res) {
                const _content = _msgr.get('_content') || '';
                if (_content.length > 0) {
                    res = res.filter((item) => {
                        return item.name.indexOf(_content) >= 0;
                    });
                }
                _msgr.pub('operationStData', res);
            },
            params: {
                startTime,
                endTime,
                cntType,
                opType
            },
            useMock: false,
            type: 'post'
        },
        false
    );
}

export default operationStatisticWindow;
