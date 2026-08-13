// import { createWindow } from '../createWindow';
import { ajaxCall, getDetailConf, loadConf } from '../../common';
import fzlChartWindow from './fzlChartWindow.js';
const uuid = jam.genUUID();

const dataDefs = [
    {
        cap: '',
        key: 'devId',
        show: false
    },
    {
        cap: '单位',
        key: 'regionName',
        sortable: false
    },
    {
        cap: '变电站',
        key: 'stName',
        sortable: false
    },
    {
        cap: '电压等级',
        key: 'bvName',
        sortable: false
    },
    {
        cap: '设备名称',
        key: 'devName',
        align: 'left',
        styles: [
            Styles.hover.toShowAll,
            Styles.css({
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            })
        ],
        sortable: false
    },
    {
        cap: '重过载时长(min)',
        key: 'totalTime',
        sortable: true,
        unit: 'min',
        type: 'indicator-number',
        color: 'success',
        align: 'center',
        styles: ['indicator.capslot.hide'],
        formatter: function (val) {
            return val || val === 0 ? Math.floor(val / 60) : '--';
        }
    },
    {
        cap: '发生时间',
        key: 'startTime',
        sortable: true,
        formatter: function (value) {
            return value
                ? jame({
                      type: 'badge',
                      styles: [
                          Styles.css({
                              borderRadius: 'xs',
                              fontSize: 's'
                          })
                      ],
                      cap: jam.formatTime(value, 'yyyy-MM-dd'),
                      content: jam.formatTime(value, 'HH:mm:ss')
                  })
                : '--:--';
        }
    },
    {
        key: 'endTime',
        cap: '结束时间',
        sortable: true,
        formatter: function (value) {
            return value
                ? jame({
                      type: 'badge',
                      styles: [
                          Styles.css({
                              borderRadius: 'xs',
                              fontSize: 's'
                          })
                      ],
                      cap: jam.formatTime(value, 'yyyy-MM-dd'),
                      content: jam.formatTime(value, 'HH:mm:ss')
                  })
                : '--:--';
        }
    },
    {
        cap: '最大负荷',
        key: 'maxLoad',
        sortable: true,
        type: 'indicator-number',
        unit: 'MW',
        color: 'primary',
        align: 'center',
        styles: ['indicator.capslot.hide'],
        formatter: function (val) {
            return val || val === 0 ? val : '--';
        }
    },
    {
        key: 'maxLoadRate',
        cap: '最大负荷率',
        sortable: true,
        type: 'indicator-number',
        unit: '%',
        color: 'warn',
        align: 'center',
        styles: ['indicator.capslot.hide'],
        formatter: function (val) {
            return val || val === 0 ? val : '--';
        }
    },
    {
        key: 'loadStatus',
        cap: '重过载类型',
        sortable: false,
        menu: {
            0: '正常',
            1: '重载',
            2: '过载'
        }
    },
    {
        key: 'windType',
        cap: '绕组类型',
        sortable: false,
        menu: {
            0: '两绕组',
            1: '三绕组'
        }
    },
    {
        cap: '额定容量',
        key: 'mvanom',
        sortable: false,
        unit: 'MVA',
        type: 'indicator-number',
        color: 'primary',
        align: 'center',
        styles: ['indicator.capslot.hide'],
        formatter: function (val) {
            return val || val === 0 ? val : '--';
        }
    },
    {
        cap: '曲线',
        class: 'viewButtons',
        sortable: false,
        formatter: function () {
            return `<jam-button style="max-height:2rem" cap='曲线'></jam-button>`;
        },
        onclick: function (e) {
            const __self = jam.findParent(e.target).parentNode;
            jam.renderModal('#main', fzlChartWindow(this.col(0)));

            // createWindow({
            //     title: '负载率历史曲线',
            //     body: fzlChartWindow(this.col(0)),
            //     width: '70vw',
            //     height: '79vh',
            //     showBtn: false
            // });
        }
    }
];
let _msgr = null,
    _model = null;
let month, overType, year;
const alarmSearchTable = (params) => {
    if (params) {
        month = params.time;
        if (month < 10) {
            month = '0' + month;
        }
        year = params.year;
        overType = params.type;
    } else {
        month = moment().format('MM');
        overType = '';
        year = moment().format('YYYY');
    }
    let days = moment(month).daysInMonth(month);
    console.log(moment().daysInMonth());
    const current1 = moment().format(`${year}-${month}-01`);
    const current2 = moment().format(`${year}-${month}-${days}`);
    return {
        type: 'card',
        icon: '',
        cap: '历史重过载',
        styles: [
            Styles.card.floating({
                width: '80vw',
                height: '75vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                styles: [
                    'size.fullsize',
                    Styles.stylesheet({
                        ':scope': {
                            display: 'flex',
                            flexDirection: 'column',
                            '.form-box': {
                                display: 'flex',
                                flexWrap: 'wrap'
                            },
                            '.viewButtons': {
                                'jam-button': {
                                    '--jam-button-bg-deg': '180deg',
                                    background: 'var(--jam-color-primary-default)',
                                    color: 'onprimary',
                                    '&:hover': {
                                        background: 'var(--jam-color-primary-strong)'
                                    },
                                    '&:active': {
                                        '--jam-button-bg-deg': '0deg'
                                    }
                                }
                            }
                        }
                    })
                ],
                components: [
                    {
                        type: 'wrapper',
                        class: 'form-box',
                        descStyles: {
                            datepicker: [Styles.icon.duotone, Styles.datepicker.regularStyle],
                            button: [Styles.searchBtnsStyles, Styles.button.css({ margin: 'xs s' })],
                            select: [Styles.icon.duotone, Styles.select.regularStyle, Styles.select.agent.css({ width: '11rem' })],
                            input: [Styles.icon.duotone, Styles.input.regularStyle]
                        },
                        components: [
                            {
                                type: 'select',
                                cap: '区域：',
                                placeholder: '请选择区域',
                                valueKey: 'regionId',
                                dataWatcher: 'regionList'
                            },
                            {
                                type: 'select',
                                cap: '类型：',
                                placeholder: '请选择类型',
                                valueKey: 'overType',
                                defaultValue: overType,
                                data: [
                                    {
                                        name: '重载',
                                        value: 1
                                    },
                                    {
                                        name: '过载',
                                        value: 2
                                    }
                                ]
                            },
                            {
                                type: 'select',
                                cap: '电压等级：',
                                placeholder: '请选择电压等级',
                                dataWatcher: 'voltageData',
                                valueKey: 'bvId'
                            },
                            {
                                type: 'filterSelect',
                                class: 'unifycap',
                                styles: [Styles.input.regularStyle],
                                props: { cap: '厂站：', data: '{{substationData}}', search: '{{name}}', select: '{{stId}}' },
                                watchers: {
                                    async name(val) {
                                        if (val.length == 0) _msgr.pub('stId', '');
                                        getSubstationData(val);
                                    }
                                }
                            },
                            {
                                type: 'datepicker',
                                valueKey: 'beginDate',
                                cap: '开始时间：'
                            },
                            {
                                type: 'datepicker',
                                valueKey: 'endDate',
                                cap: '结束时间：'
                            },
                            {
                                type: 'input',
                                cap: '持续时间：',
                                placeholder: '请输入持续时间',
                                valueKey: 'devName'
                            },
                            {
                                type: 'button',
                                icon: 'search',
                                class: 'jam-cta',
                                cap: '查询',
                                onclick: function () {
                                    getTableData();
                                }
                            },
                            {
                                type: 'button',
                                cap: '重置',
                                icon: 'repeat',
                                onclick: function () {
                                    _msgr.pub('regionId', null);
                                    _msgr.pub('devType', null);
                                    _msgr.pub('overType', null);
                                    _msgr.pub('bvId', null);
                                    _msgr.pub('stId', '');
                                    _msgr.pub('stId_name', '');
                                    _msgr.pub('beginDate', current1);
                                    _msgr.pub('endDate', current2);
                                }
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        styles: ['size(width:100%;height:calc(100% - 6rem))'],
                        components: [
                            {
                                type: 'table',
                                styles: [Styles.table.regularStyleNew, '', 'table.fixedrowheight(height:2.6rem)', Styles.css({ width: '100%', height: 'calc(100% - 1rem)' })],
                                dataWatcher: 'tableData',
                                dataDef: dataDefs
                            }
                        ]
                    },
                    {
                        type: 'pager',
                        props: {
                            pageSizeList: [
                                {
                                    value: '10',
                                    name: '10条/页'
                                },
                                {
                                    value: '50',
                                    name: '50条/页'
                                }
                            ],
                            total: 'table_pager_total',
                            messageKey: uuid
                        },
                        watchers: [
                            {
                                key: uuid,
                                callback: function (page) {
                                    if (page.firstFetch) return;
                                    getTableData({ pageIndex: page.pageNumber, pageSize: page.pageSize });
                                }
                            }
                        ]
                    }
                ],
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                onafterrender: function () {
                    _msgr.pub('beginDate', current1);
                    _msgr.pub('endDate', current2);
                    getRegionList();
                    getBvList();
                    getTableData();
                }
            }
        ]
    };
};

/**
 * 获取区域列表
 */
function getRegionList() {
    ajaxCall(
        'getRegionList',
        {
            success(data) {
                const defaultRegion = [
                    {
                        name: '全部',
                        value: ''
                    }
                ];
                const regionList = data.map((item) => {
                    return { name: item.regionNameChn, value: item.regionId };
                });
                _msgr.pub('regionList', [...defaultRegion, ...regionList]);
            },
            params: {},
            useMock: false,
            type: 'get'
        },
        false
    );
}

/**
 * 电压等级下拉框
 */
function getBvList() {
    ajaxCall(
        'getBvList',
        {
            success(data) {
                const newData = Object.values(data).map((item) => {
                    return {
                        name: item.name,
                        value: item.id
                    };
                });
                _msgr.pub('voltageData', newData);
            },
            useMock: false
        },
        false
    );
}

/**
 * 变电站下拉框
 */
function getSubstationData(name) {
    ajaxCall(
        'getSubstationList',
        {
            success(res) {
                _model.vars.substationData = res?.map((item) => ({ name: item.stName, value: item.stId }));
            },
            useMock: false,
            params: {
                devName: name,
                devType: ['substation'],
                count: 100
            },
            type: 'post',
            error() {},
            complete() {}
        },

        false
    );
}

/**
 * 表格数据
 */
function getTableData(pager = { pageIndex: 1, pageSize: 10 }) {
    let searchParams = {
        beginDate: _msgr.get('beginDate') ? _msgr.get('beginDate') + ' 00:00:00' : '',
        endDate: _msgr.get('endDate') ? _msgr.get('endDate') + ' 23:59:59' : '',
        devType: 2,
        overType: overType || _msgr.get('overType'),
        regionId: _msgr.get('regionId'),
        stId: _msgr.get('stId'),
        bvId: _msgr.get('bvId'),
        duration: _msgr.get('duration'),
        ...pager
    };
    ajaxCall(
        'getHisOverloadRecord',
        {
            type: 'post',
            success(data) {
                _msgr.pub('tableData', data.list);
                _msgr.pub('table_pager_total', data.pojoTotalCount);
            },
            params: searchParams,
            useMock: false
        },
        false
    );
}

export default alarmSearchTable;
