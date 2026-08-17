import { ajaxCall, getDetailConf, findCol, formatterJameTime, exportExcel } from '../common.js';
import { getRegionList, getBvList, getSubstationList } from '../utils/commonList.js';
import { urlConfig } from '../global.js';
// import { createWindow } from './../components/createWindow.js';
import tripDetailWindow from './../components/modal/tripDetailWindow.js';
let _model, _msgr, eChartsIns, _this;
const eventTypeMap = {};
let isFirstChange = true;
let isForTrip = false;
const dataMap = new Map();

let isAfterRender = false;

let eventTripAlarmParmas = {};
let lateList = [
    { name: '全部', value: null },
    { name: '是', value: 1 },
    { name: '否', value: 2 }
];
let accuracyList = [
    { name: '全部', value: null },
    { name: '是', value: 1 },
    { name: '否', value: 2 }
];
export default {
    type: 'wrapper',
    styles: [
        'css(--gap:var(--jam-space-m))',
        'padding(var(--gap))',
        'flex(direction: column)',
        'padding(bottom:0)',
        'layout(overflow:hidden auto)',
        'size.fullsize',
        Styles.stylesheet({
            '.jam-cc-legend-wrapper': {
                height: 'fit-content !important'
            },
            '.legend': {
                cursor: 'pointer',
                paddingTop: 'm !important'
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            // header
            styles: ['size(minHeight:14rem)'],
            components: [
                {
                    type: 'wrapper',
                    // form
                    styles: ['flex(flex:1;direction:column;)'],
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '区域选择',
                            icon: 'earth-asia',
                            styles: [Styles.buttonGroupStylesWithBgCap],
                            defaultValue: null,
                            value: '{{regionId}}',
                            data: '{{regionList}}'
                        },
                        {
                            type: 'buttongroup-radio',
                            cap: '电压等级',
                            icon: 'bolt',
                            styles: [Styles.buttonGroupStylesWithBgCap],
                            defaultValue: null,
                            value: '{{bvId}}',
                            data: '{{bvList}}'
                        },
                        {
                            type: 'wrapper',
                            components: [
                                {
                                    type: 'buttongroup-checkbox',
                                    buildIf: '!{{isForTrip}}',
                                    cap: '事件类型',
                                    icon: 'chart-pyramid',
                                    styles: [Styles.buttonGroupStylesWithBgCap],
                                    value: '{{eventTypeList}}',
                                    data: '{{eventTypeOption}}'
                                },
                                {
                                    // showIf: '{{analyticsType}}==="1"',
                                    type: 'buttongroup-radio',
                                    cap: '是否及时',
                                    icon: 'rocket',
                                    class: 'button-group-style',
                                    defaultValue: null,
                                    state: 'normal',
                                    // state: '!{{isForTrip}}&&{{analyticsType}}!=="1"?"disabled":"normal"',
                                    states: {
                                        disabled: {
                                            styles: ['css(cursor:not-allowed;)', `buttongroup.button.css(cursor:not-allowed;color:var(--jam-element-color-l3);)`]
                                        },
                                        normal: {}
                                    },
                                    styles: [Styles.buttonGroupStylesWithBgCap],
                                    value: '{{late}}',
                                    data: lateList
                                    // ,
                                    // onclick: function (e) {
                                    //     if (_model.isForTrip) return;
                                    //     if (_model.analyticsType !== '1') {
                                    //         this.value = null;
                                    //         return e.preventDefault();
                                    //     }
                                    // }
                                },
                                {
                                    // showIf: '{{analyticsType}}==="2"',
                                    type: 'buttongroup-radio',
                                    cap: '是否准确',
                                    icon: 'circle-check',
                                    class: 'button-group-style',
                                    defaultValue: null,
                                    state: 'normal',
                                    // state: '!{{isForTrip}}&&{{analyticsType}}!=="2"?"disabled":"normal"',
                                    states: {
                                        disabled: {
                                            styles: ['css(cursor:not-allowed;)', `buttongroup.button.css(cursor:not-allowed;color:var(--jam-element-color-l3);)`]
                                        },
                                        normal: {}
                                    },
                                    // disabled: '{{analyticsType}}!=="2"',
                                    styles: [Styles.buttonGroupStylesWithBgCap],
                                    value: '{{accuracy}}',
                                    data: accuracyList
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
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
                            childStyles: ['datepicker.agent.border(radius:s)'],
                            datepickerStyles: ['padding(top:0;bottom:0)', 'datepicker.labelslot.margin(0)'],
                            buttonStyles: [Styles.searchBtnsStyles],
                            components: [
                                {
                                    type: 'filterSelect',
                                    styles: ['size(maxWidth:11.5rem)', 'padding(top:0;bottom:0)'],
                                    childStyles: ['size(minWidth:11.5rem)', 'input.agent.border(radius:s)', 'input.labelslot.margin(0)', 'padding(0)'],
                                    valueKey: 'stId',
                                    props: { cap: '变电站：', placeholder: '请选择', data: '{{stList}}', icon: 'transformer-bolt', search: '{{name}}', select: '{{stId}}' },
                                    watchers: [
                                        {
                                            key: 'name',
                                            callback: function (val) {
                                                getSubstationList({ _model, devName: val });
                                            },
                                            debounce: 200
                                        }
                                    ]
                                },
                                { type: 'datepicker', value: '{{beginDate}}', max: '{{endDate}}', icon: 'calendar', cap: '查询时间：' },
                                { type: 'datepicker', value: '{{endDate}}', min: '{{beginDate}}', cap: '-', styles: ['padding(left:0)', 'size(width:9.2rem;)', Styles.stylesheet({ ':scope': { minWidth: '0!important' } })] },
                                {
                                    type: 'input',
                                    cap: '设备：',
                                    styles: [Styles.input.regularStyle],
                                    icon: 'comment-text',
                                    value: '{{content}}'
                                },
                                {
                                    type: 'button',
                                    cap: '查询',
                                    icon: 'search',
                                    class: 'jam-cta',
                                    onclick: function () {
                                        initTableData();
                                        const type = _model.vars.analyticsType;
                                        if (type === '3') {
                                            initRegionStatisticsChartData();
                                        } else {
                                            initEventAnalysePieData(type);
                                        }
                                    }
                                },
                                {
                                    type: 'button',
                                    cap: '导出',
                                    icon: 'file-export',
                                    onclick: function () {
                                        exportExcel(urlConfig['exportEventByParam'].url, packageParams(), `事件化统计_${moment().format('yyyyMMDDHHmmssSSS')}.xlsx`, 'post');
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    // chart
                    // `background(image:linear-gradient(180deg, ${COLOR_SET.gradientbgclr_deep} 0%, ${COLOR_SET.gradientbgclr_light} 100%))`,
                    styles: ['size(width:42%;height:100%)', 'margin(left:var(--gap))', 'flex(direction:column;)'],
                    components: [
                        {
                            type: 'wrapper',
                            styles: ['layout.flex'],
                            components: [
                                {
                                    type: 'label',
                                    cap: '统计分析',
                                    styles: [
                                        Styles.stylesheet({
                                            '[slot=cap]': {
                                                display: 'block',
                                                minWidth: '13.2rem',
                                                height: '2.25rem',
                                                color: 'muted',
                                                paddingLeft: 'l',
                                                backgroundImage: 'url(./../assets/images/title_third.png)',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'bottom var(--gap) left',
                                                backgroundSize: 'auto 1.875rem'
                                            }
                                        })
                                    ]
                                },
                                {
                                    buildIf: '!{{isForTrip}}',
                                    type: 'buttongroup-radio',
                                    value: '{{analyticsType}}',
                                    styles: [
                                        'padding(left:s)',
                                        'layout.flex(justifyContent:center;)',
                                        Styles.stylesheet({
                                            ':scope': {
                                                'jam-button.jam-option': {
                                                    minWidth: '5.5rem',
                                                    width: 'fit-content',
                                                    height: '1.875rem',
                                                    border: 0,
                                                    borderRadius: 0,
                                                    color: 'var(--jam-color-fg-default)',
                                                    fontWeight: '500',
                                                    fontSize: 's',
                                                    padding: 's m',
                                                    backgroundImage: 'url(./assets/images/new/tab_default2.png)',
                                                    backgroundSize: '100% 100%',
                                                    backgroundRepeat: 'no-repeat',
                                                    boxShadow: 'none',
                                                    transition: 'all .25s ease-in-out',
                                                    '&>[slot=cap]': {
                                                        height: '1.5rem',
                                                        lineHeight: '1.5rem'
                                                    },
                                                    '&:nth-child(2)': {
                                                        width: '7.5rem'
                                                    }
                                                },
                                                'jam-button.jam-checked': {
                                                    color: 'muted',
                                                    fontSize: 'm',
                                                    fontWeight: 'bold',
                                                    backgroundImage: 'url(./assets/images/new/tab_hover2.png)',

                                                    '&>[slot=cap]': {
                                                        backgroundImage: 'linear-gradient(-180deg, var(--jam-color-on-primary) 0%, var(--jam-color-primary-subtle) 100%)',
                                                        '-webkit-background-clip': 'text',
                                                        backgroundClip: 'text'
                                                    }
                                                },
                                                'jam-button:hover': {
                                                    'background-image': 'url(./assets/images/new/tab_hover2.png)'
                                                },
                                                'jam-button,jam-button.jam-checked,jam-button.jam-checked:hover': {
                                                    'background-color': 'transparent'
                                                }
                                            }
                                        })
                                    ],
                                    onvaluechange: function (val) {
                                        // 重置筛选条件
                                        _model.late = val !== '1' ? null : _model.late;
                                        _model.accuracy = val !== '2' ? null : _model.accuracy;
                                        val == '4' ? (_model.colorSetChart = ['hsl(0 100% 66.1%)', 'hsl(40 100% 50%)', 'hsl(195 100% 56.1%)', 'hsl(180 100% 41%)', 'hsl(156 52.5% 53.7%)']) : (_model.colorSetChart = ['hsl(13 58.6% 55.5%)', 'hsl(156 52.5% 53.7%)']);
                                        isFirstChange
                                            ? null
                                            : setTimeout(() => {
                                                  val === '3' ? initRegionStatisticsChartData() : initEventAnalysePieData(val);
                                                  //   initTableData();
                                              }, 10);

                                        isFirstChange = false;
                                    },
                                    data: [
                                        {
                                            name: '事件统计',
                                            value: '3'
                                        },
                                        {
                                            name: '事件级别统计',
                                            value: '4'
                                        },
                                        {
                                            name: '及时性',
                                            value: '1'
                                        },
                                        {
                                            name: '准确度',
                                            value: '2'
                                        }
                                    ]
                                }
                            ]
                        },
                        // 图表
                        {
                            type: 'wrapper',
                            styles: ['size.fullsize', 'layout(overflow: hidden)', 'border.subtle', 'border.s'],
                            components: [
                                {
                                    type: 'wrapper',
                                    buildIf: '{{analyticsType}}==="3"',
                                    styles: ['size.fullsize', 'layout(position:relative)', 'flex(direction:column;)'],
                                    components: [
                                        {
                                            type: 'wrapper',
                                            styles: ['padding(0 m)', 'layout.flex(justifyContent:space-between;alignItems:center)'],
                                            descStyles: {
                                                label: [
                                                    'text(size:s)',
                                                    Styles.stylesheet({
                                                        '.title-color': {
                                                            color: 'primary'
                                                        }
                                                    })
                                                ]
                                            },
                                            components: [
                                                {
                                                    type: 'label',
                                                    cap: jaml.var('chart-left-info', (chartLeftInfo) => chartLeftInfo)
                                                },
                                                {
                                                    type: 'label',
                                                    cap: jaml.var('chart-right-info', (chartRightInfo) => chartRightInfo)
                                                }
                                            ]
                                        },
                                        {
                                            type: 'stripyBarChart',
                                            data: '{{eventChartData}}',
                                            props: { unit: '个' },
                                            styles: [
                                                'stripyBarChart.basic',
                                                'css(flex:1;width:100%;min-height:0)',
                                                Styles.efuncs((el) => {
                                                    el.chart.on('click', function (params) {
                                                        if (params.componentType === 'series') {
                                                            const clickName = params.name;
                                                            const clickRegionId = _model.vars.regionList.find((item) => item.name === clickName);
                                                            if (clickRegionId) {
                                                                _msgr.pub('regionId', clickRegionId.value);
                                                            }
                                                        }
                                                    });
                                                })
                                            ],
                                            onafterrender: async function () {
                                                const chartEl = jam.findElement(this.element, 'jam-chart');
                                                await chartEl?.chartReady;
                                                chartEl?.chart?.off('click');
                                                chartEl?.chart?.on('click', (params) => {
                                                    if (params.componentType !== 'series' || params.componentSubType !== 'bar' || params.seriesName !== '统计值') {
                                                        return;
                                                    }
                                                    const clickName = params.name;
                                                    if (type === 'defectType') {
                                                        const clickTypeId = getJsonData.typeData.find((item) => item.name === clickName);
                                                        _msgr.pub('defectType', clickTypeId ? [clickTypeId.value] : [5]);
                                                    } else if (type === 'region') {
                                                        const clickRegionId = regionList.find((item) => item.name === clickName);
                                                        if (clickRegionId) {
                                                            _msgr.pub('regionId', clickRegionId.value);
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    ]
                                },
                                {
                                    type: 'wrapper',
                                    styles: ['size.fullsize', 'layout(position:relative)', 'css(--legend-width:46%; justifyContent: center;)'],
                                    buildIf: '{{analyticsType}}==="1"||{{analyticsType}}==="2"||{{analyticsType}}==="4"',
                                    descStyles: [Styles.icon.duotone],
                                    components: [
                                        {
                                            type: 'singlelegendWithpie',
                                            props: {
                                                title: '总计',
                                                unit: '个',
                                                dataType: 'analog',
                                                valueType: 'number',
                                                decimalPos: 2,
                                                hasSubtitle: false,
                                                toFixed: false,
                                                hasTags: false,
                                                colorList: []
                                            },
                                            ref: 'eventPieChart',
                                            styles: ['singlelegendWithpie.basic', 'css(width:60%;)'],
                                            onafterrender: async function () {
                                                const chartEl = jam.findElement(this.element, 'jam-chart');
                                                await chartEl?.chartReady;
                                                chartEl?.chart?.off('click');
                                                chartEl?.chart?.on('click', (params) => {
                                                    if (params.componentType !== 'series') {
                                                        return;
                                                    }
                                                    let clickName = params.name;
                                                    const type = _model.vars.analyticsType;
                                                    if (type === '1') {
                                                        if (clickName == '及时') {
                                                            clickName = '是';
                                                        } else {
                                                            clickName = '否';
                                                        }
                                                        const clickTypeId = lateList.find((item) => item.name === clickName);
                                                        _msgr.pub('late', clickTypeId ? clickTypeId.value : null);
                                                    } else if (type === '2') {
                                                        if (clickName == '已确认') {
                                                            clickName = '是';
                                                        } else {
                                                            clickName = '否';
                                                        }
                                                        const clickRegionId = accuracyList.find((item) => item.name === clickName);
                                                        if (clickRegionId) {
                                                            _msgr.pub('accuracy', clickRegionId.value);
                                                        }
                                                    }
                                                });
                                            },
                                            onclick: function (e) {
                                                let _el = jam.closest(e.target, 'jam-indicator');
                                                const type = _model.vars.analyticsType;
                                                let clickName = _el?.cap;
                                                if (!clickName) {
                                                    return;
                                                }
                                                if (type === '1') {
                                                    if (clickName == '及时') {
                                                        clickName = '是';
                                                    } else {
                                                        clickName = '否';
                                                    }
                                                    const clickTypeId = lateList.find((item) => item.name === clickName);
                                                    _msgr.pub('late', clickTypeId ? clickTypeId.value : null);
                                                } else if (type === '2') {
                                                    if (clickName == '已确认') {
                                                        clickName = '是';
                                                    } else {
                                                        clickName = '否';
                                                    }
                                                    const clickRegionId = accuracyList.find((item) => item.name === clickName);
                                                    if (clickRegionId) {
                                                        _msgr.pub('accuracy', clickRegionId.value);
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            styles: [
                //
                'flex(direction: column)',
                'margin(top:var(--gap))',
                'layout(overflow:hidden)',
                'flex(1)'
            ],
            // table-wrapper
            components: [
                {
                    type: 'tableWithPage',
                    // ref: 'eventTableWithPage',
                    styles: ['tableWithPage.basic', 'flex(1)', Styles.hover.toShowAll({ selector: '.jam-td' }), Styles.table.fixedrowheight({ height: '2.5rem' }), 'size.fullsize', Styles.css({ padding: 0 }), 'table.th.css(whiteSpace:nowrap;minHeight:2.5rem;)'],
                    descStyles: {
                        '.item-time': [Styles.badge.cap.css({ width: '5em' }), Styles.badge.content.css({ width: '5em' })],
                        '.item-tag': ['indicator.cap.hide()'],
                        '.item-content': ['css(overflow:hidden;white-space:nowrap;text-overflow:ellipsis)'],
                        '.item-indicator': ['indicator.cap.hide()', 'indicator.value.css(justify-content:flex-end)']
                    },
                    props: {
                        cpageHide: { pageSize: false },
                        pageSizeList: [
                            { value: 10, name: '10条/页' },
                            { value: 50, name: '50条/页' },
                            { value: 100, name: '100条/页' }
                        ],
                        data: '{{eventTableData}}'
                    },
                    // onsortclick: function (th, asc) {
                    //     _msgr.pub('sortParams', typeof asc === 'object' ? null : { orderByColumn: th.key, asc });
                    //     initTableData({ pageNumber: 1, pageSize: _msgr.get(pagerKey)['pageSize'] || 15 });
                    // },
                    // dataWatcher: 'eventDrivenAnalyticsData',
                    dataDef: jaml.var('isForTrip', (isForTrip) => [
                        { show: false },
                        {
                            cap: '地区'
                            // key: 'regionId'
                        },
                        {
                            cap: '发生时间',
                            key: 'occurTime',
                            formatter: formatterJameTime
                        },
                        {
                            cap: '厂站名称',
                            key: 'stName'
                        },
                        {
                            cap: '设备名称',
                            key: 'devName',
                            styles: [Styles.toShowAll],
                            align: 'left'
                        },
                        {
                            cap: '事件描述',
                            key: 'content',
                            styles: [Styles.toShowAll],
                            align: 'left'
                        },
                        {
                            cap: '事件类型',
                            // key: 'eventType',
                            show: !isForTrip
                        },
                        {
                            cap: '事件级别',
                            key: 'eventLevel',
                            menu: eventTypeMap,
                            states: {
                                //
                                1: { condition: 'value=="1"', styles: ['value.text(color:red)'] },
                                2: { condition: 'value=="2"', styles: ['value.text(color:orange)'] },
                                3: { condition: 'value=="3"', styles: ['value.text(color:lightorange)'] },
                                4: { condition: 'value=="4"', styles: ['value.text(color:skyblue)'] },
                                5: { condition: 'value=="5"', styles: ['value.text(color:lightgreen)'] }
                            }
                        },
                        {
                            cap: '信号数量',
                            show: isForTrip,
                            styles: ['css(text-decoration:underline;text-underline-offset:0.2rem;cursor:pointer;color:lightgreen)'],
                            // sortable: false,
                            onclick(params) {
                                const uuid = this.col(0);
                                const rowData = dataMap.get(uuid);
                                jam.renderModal('#main', tripDetailWindow(rowData, false, rowData['confTypeName'] + '详情'));
                                // createWindow({
                                //     title: rowData['confTypeName'] + '详情',
                                //     width: '40vw',
                                //     height: '26vw',
                                //     body: tripDetailWindow(rowData, false),
                                //     showBtn: false
                                // });
                            }
                            // show: analyticsType === '1'
                        },
                        {
                            cap: '是否及时'
                            // sortable: false,
                            // show: analyticsType === '1'
                        },
                        {
                            cap: '是否准确'
                            // sortable: false,
                            // show: analyticsType === '2'
                        },
                        {
                            cap: '确认时间',
                            width: '11.5rem',
                            key: 'confirmTime',
                            formatter: formatterJameTime
                        },
                        {
                            cap: '设备运行状态',
                            key: 'resInt2'
                        },
                        {
                            cap: '操作',
                            sortable: false,
                            width: '4rem',
                            formatter: (uuid) => {
                                const rowData = dataMap.get(uuid);
                                return jame({
                                    type: 'label',
                                    cap: '详情',
                                    styles: ['color.primary', 'css(cursor: pointer;text-underline-offset:.2rem;transition:all .2s ease-in-out; )', 'hover(textDecoration: underline;)'],
                                    onclick: () => {
                                        jam.renderModal('#main', tripDetailWindow(rowData, isForTrip, rowData['confTypeName'] + '详情'));

                                        // createWindow({
                                        //     title: rowData['confTypeName'] + '详情',
                                        //     width: '40vw',
                                        //     height: isForTrip ? '46vw' : '32vw',
                                        //     body: tripDetailWindow(rowData, isForTrip),
                                        //     showBtn: false
                                        // });
                                    }
                                });
                            }
                        }
                    ])
                }
            ]
        }
    ],
    vars: {
        // todo
        ctotal: 0,
        cpageNo: 1,
        cpageSize: 20,
        beginDate: moment().format('yyyy-MM-DD'),
        endDate: moment().format('yyyy-MM-DD'),
        // beginDate: '2023-05-05',
        // endDate: '2023-05-05',
        // beginDate: '2023-09-01',
        // endDate: '2023-09-06',
        analyticsType: '3',
        late: null,
        accuracy: null,
        eventTypeList: [],
        eventTypeOption: [],
        regionId: null,
        bvId: null,
        regionStatisticsChartData: [],
        statisticsTotalCnt: 0
    },
    watchers: [
        // {
        //     key: 'late',
        //     callback: function () {
        //         isAfterRender ? initTableData() : null;
        //     }
        // },
        // {
        //     key: 'accuracy',
        //     callback: function () {
        //         isAfterRender ? initTableData() : null;
        //     }
        // },
        // {
        //     key: 'regionId',
        //     callback: function () {
        //         const val = _model.analyticsType;
        //         isAfterRender ? (initTableData(), val === '3' ? null : initEventAnalysePieData(val)) : null;
        //     }
        // },
        // {
        //     key: 'bvId',
        //     callback: function () {
        //         const val = _model.analyticsType;
        //         isAfterRender ? (initTableData(), val === '3' ? initRegionStatisticsChartData() : initEventAnalysePieData(val)) : null;
        //     }
        // },
        {
            keys: ['cpageNo', 'cpageSize'],
            callback: function (cpageNo, cpageSize) {
                _model.vars.cpageNo = cpageNo;
                initTableData();
            }
        }
    ],
    onmount: function () {
        _this = this;
        _model = this.model;
        _msgr = this.model.msgr;
        isFirstChange = true;
        isForTrip = jam.getHash(window.location).includes('/trip');
        _model.isForTrip = isForTrip;
        eChartsIns = null;
    },
    onunmount: function () {
        mango.pub('eventTripAlarmParmas', null);
    },
    onafterrender: function () {
        eventTripAlarmParmas = mango.get('eventTripAlarmParmas');
        getRegionList(_model, eventTripAlarmParmas);
        getBvList(_model, _msgr);
        getSubstationList({ _model });

        getEventTypeConfData();
        getMenuInfo_EventType();
        setTimeout(() => (isAfterRender = true), 200);
    }
};

function initTableData() {
    ajaxCall('getJkSynthEventAlarm', {
        params: { ...getPagerParams(), ...packageParams(), ...(_msgr.get('sortParams') || {}) },
        type: 'post',
        success(data) {
            try {
                dataMap.clear();
                const { list = [], pojoTotalCount = 0 } = data || {};
                const tableData = list.map((item) => {
                    dataMap.set(item.uuid, item);
                    return [item.uuid, item.regionName, item.occurTime, item.stName, item.devName, item.content, item.confTypeName, item.eventLevel, item.hisNum, item.isTimely, item.accuracy, item.confirmTime, ['分闸', '合闸'][item.resInt2], item.uuid];
                });
                // const tableRef = _this?.ref('eventTableWithPage');
                // if (tableRef) {
                //     tableRef.data = tableData || [];
                // }
                _model.vars.eventTableData = tableData || [];
                setTimeout(() => {
                    _model.vars.ctotal = pojoTotalCount || 0;
                }, 100);
            } catch (error) {
                console.error(error);
            }
        }
    });
}

function getTodayData() {
    return new Promise((resolve, reject) => {
        ajaxCall('getEventRegionData', {
            uniqId: 'getEventRegionDataForToday',
            params: { ...packageParams(true), startTime: moment().format('YYYY-MM-DD') + ' 00:00:00', endTime: moment().format('YYYY-MM-DD HH:mm:ss') },
            type: 'post',
            success(data) {
                let sum = 0;
                data.forEach((item) => {
                    const { list } = item || {};
                    const [item1, item2, item3, item4, item5] = list || [];
                    const count = (item1?.num || 0) + (item2?.num || 0) + (item3?.num || 0) + (item4?.num || 0) + (item5?.num || 0);
                    sum += count;
                });
                resolve(sum);
            }
        });
    });
}
function initRegionStatisticsChartData() {
    jam.ajaxCall({
        urlKey: 'getEventRegionData',
        data: packageParams(true),
        method: 'post',
        async transform(res) {
            const { data } = res;
            let sum = 0;
            var xData = [],
                yData = [];
            const title = ['地区', '事件数'];
            const _chartData = [];
            if (data instanceof Array) {
                data.forEach((item) => {
                    const { list, regionName } = item || {};
                    const [item1, item2, item3, item4, item5] = list || [];
                    const count = (item1?.num || 0) + (item2?.num || 0) + (item3?.num || 0) + (item4?.num || 0) + (item5?.num || 0);
                    xData.push(regionName);
                    yData.push(count);
                    sum += count;
                    _chartData.push([regionName, count]);
                });
            }
            // if (_this.ref('eventDetailChart')) {
            _model.vars.eventChartData = [title, ..._chartData];
            // _this.ref('eventDetailChart').vars.data.chartData = [title, ..._chartData];
            // }
            let maxIndex = yData.indexOf(Math.max.apply(null, yData));
            let maxValue = yData[maxIndex];
            let maxValueCount = yData.filter((val) => val === maxValue).length;
            _model['chart-left-info'] = `<div><span>总事件统计</span><span class="title-color"> ${sum} </span>个${sum > 0 ? `，其中<span class="title-color"> ${xData[maxIndex]} ${maxValueCount > 1 ? '等' : ''}</span>发生次数最多` : ''}</div>`;
            const todayCnt = _model.vars.beginDate === moment().format('YYYY-MM-DD') ? sum : await getTodayData();
            _model['chart-right-info'] = `<div>今日新增事件<span class="title-color">${todayCnt}</span>个</div>`;

            // try {
            //     const result = [['区域', ..._model.vars.eventTypeOption.map((item) => item.name)]];
            //     if (data instanceof Array) {
            //         if (!data.length) {
            //             suppChartData();
            //         } else {
            //             data.forEach((item) => {
            //                 const { list, regionName } = item || {};
            //                 const [item1, item2, item3, item4, item5] = list || [];
            //                 result.push([regionName, item1?.num || 0, item2?.num || 0, item3?.num || 0, item4?.num || 0, item5?.num || 0]);
            //             });
            //         }
            //     } else {
            //         suppChartData();
            //     }
            //     _model.vars.regionStatisticsChartData = result;

            //     function suppChartData() {
            //         (_model.regionList || []).forEach((item) => {
            //             const regionName = item.name;
            //             result.push([regionName, 0, 0, 0, 0, 0]);
            //         });
            //     }
            //     setTimeout(() => {
            //         const chartWrapper = jam.findElement('statisticsChartBar');
            //         chartWrapper?.chart?.resize();
            //     }, 100);
            // } catch (error) {
            //     console.error(error);
            // }
        }
    });
}
const labelMap = {
    1: {
        typeName: '是否及时',
        name: ['及时', '不及时']
    },
    2: {
        typeName: '是否准确',
        name: ['已确认', '未确认']
    }
};
function initEventAnalysePieData(type) {
    const params = { type: Number(type), ...packageParams() };
    params.bvId && ((params.bvIdList = [params.bvId]), delete params.bvId);
    ajaxCall(type == '4' ? 'getEventLevelStatData' : 'getEventAnalyseData', {
        params,
        type: 'post',
        success(data) {
            try {
                // const result = [['区域', { 1: '及时性', 2: '准确度' }[type]]];
                // data.forEach((item) => {
                //     result.push([item.regionName, item.rate]);
                // });
                // _model.vars.eventAnalysePieData = result;
                if (type == '4') {
                    let sumNum = 0;
                    const chartData = data.map((item) => {
                        sumNum += item.count;
                        return [item.eventLevelName || item.eventLevel, item.count];
                    });
                    // _model.eventAnalysePieData = [['事件级别', '数量'], ...chartData];
                    const pieData = {
                        id: '000',
                        value: sumNum,
                        chartData: [['事件级别', '数量'], ...chartData]
                    };
                    _this.ref('eventPieChart').vars.data = pieData;
                } else {
                    let number1 = 0,
                        number2 = 0,
                        sumNum = 0;
                    data.forEach((item) => {
                        number1 += Number(item.number1);
                        number2 += Number(item.number2);
                        sumNum += Number(item.sumNum);
                    });
                    // _model.eventAnalysePieData = [
                    //     [labelMap[type]['typeName'], '数量'],
                    //     [labelMap[type]['name'][0], number1],
                    //     [labelMap[type]['name'][1], number2]
                    // ];
                    _this.ref('eventPieChart').vars.data = {
                        id: '000',
                        value: sumNum,
                        chartData: [
                            [labelMap[type]['typeName'], '数量'],
                            [labelMap[type]['name'][0], number1],
                            [labelMap[type]['name'][1], number2]
                        ]
                    };
                }
            } catch (error) {
                console.error(error);
            }
        }
    });
}

function packageParams(isForStatisticsChart) {
    const regionId = _model.vars.regionId || undefined;
    const bvId = _model.vars.bvId || undefined;
    const eventTypeList = _model.vars.eventTypeList.length ? _model.vars.eventTypeList : _model.vars?.eventTypeOption?.map((item) => item.value);
    const params = {
        ...getTimeParams(),
        hisNum: isForTrip,
        analyse: true,
        eventTypeList,
        late: _model.vars.late || undefined,
        accuracy: _model.vars.accuracy || undefined,
        stId: _msgr.get('stId') ? _msgr.get('stId') : undefined,
        content: _msgr.get('content') ? _msgr.get('content') : undefined,
        regionId,
        bvId
    };
    isForStatisticsChart && delete params.regionId;
    // if (_model.vars.analyticsType === '1') {
    //     _model.vars.lateAll ? (params.late = _model.vars.lateAll) : (params.lateAll = 3);
    // } else if (_model.vars.analyticsType === '2') {
    //     _model.vars.accuracyAll ? (params.accuracy = _model.vars.accuracyAll) : (params.accuracyAll = 3);
    // }
    return params;
}
function getPagerParams() {
    return { pageIndex: _model.vars.cpageNo || 1, pageSize: _model.vars.cpageSize || 20 };
}
function getTimeParams() {
    return {
        startTime: _model.vars.beginDate ? _model.vars.beginDate + ' 00:00:00' : undefined,
        endTime: _model.vars.endDate ? _model.vars.endDate + ' 23:59:59' : undefined
    };
}

export function getEventTypeConfData() {
    ajaxCall(
        'getEventTypeConfData',
        {
            success(data) {
                _model.vars.eventTypeOption = data || [];
                _model.vars.eventTypeList = (data || []).map((item) => item.value);
                if (eventTripAlarmParmas?.type) {
                    let filterData = data.filter((item) => item.name == eventTripAlarmParmas.type);
                    _model.vars.eventTypeList = [filterData?.[0].value];
                }
                // 初始化table 需要传eventTypeList
                initTableData();
                initRegionStatisticsChartData();
            },
            params: {},
            useMock: false
        },
        false
    );
}

export function getMenuInfo_EventType() {
    ajaxCall(
        'getMenuInfo_EventType',
        {
            success(data) {
                (data || []).forEach((item) => {
                    eventTypeMap[item.actualValue] = item.displayValue;
                });
            },
            params: {
                menu: '监控事件等级'
            },
            useMock: false
        },
        false
    );
}
