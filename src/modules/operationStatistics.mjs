import { ajaxCall, exportExcel, formatterJameBv, formatterJameTime, loadConf } from '../common.js';
import operationStatisticWindow from '../components/modal/operationStatisticWindow.js';
import { urlConfig, userInfo } from '../global.js';
let _model, _msgr, _this;
const REGION_ID = userInfo.regionId;
const AREA_ID = userInfo.areaId;
const isTest = loadConf('config.json', {})?.isTest || false;
export const optTypeList = [
    {
        name: '遥控',
        value: 1
    },
    {
        name: '遥调',
        value: 2
    },
    {
        name: '软压板投退',
        value: 3
    },
    {
        name: '程序化操作',
        value: 4
    }
];
export default {
    type: 'wrapper',
    styles: ['css(--gap:.75rem)', 'padding(var(--gap))', 'flex(direction: column)', 'padding(bottom:0)', 'layout(overflow:hidden auto)', 'size.fullsize'],
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
                            type: 'buttongroup-checkbox',
                            cap: '区域选择',
                            icon: 'earth-asia',
                            buildIf: '{{city}}!=="chongqing"',
                            styles: [Styles.buttonGroupStylesWithBgCap],
                            value: '{{regionIdList}}',
                            data: '{{regionList}}'
                        },
                        {
                            type: 'wrapper',
                            // styles: [
                            //     Styles.css({
                            //         display: 'flex',
                            //         justifyContent: 'space-between'
                            //     })
                            // ],
                            components: [
                                {
                                    type: 'buttongroup-checkbox',
                                    cap: '电压等级',
                                    styles: [Styles.buttonGroupStylesWithBgCap],
                                    icon: 'bolt',
                                    value: '{{bvIdList}}',
                                    defaultValue: [],
                                    onvaluechange: 'this.vars.stIdList = []',
                                    dataUrl: {
                                        urlKey: 'getBvList',
                                        transform: (res) => res.data.map(({ bvId, bvName }) => ({ name: bvName, value: bvId }))
                                    }
                                },
                                {
                                    type: 'buttongroup-radio',
                                    cap: '操作类型',
                                    icon: 'list-check',
                                    styles: [Styles.buttonGroupStylesWithBgCap],
                                    value: '{{opType}}',
                                    defaultValue: 1,
                                    data: optTypeList
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
                                        marginLeft: '.625rem'
                                    }
                                })
                            ],
                            components: [
                                {
                                    type: 'multidropdown',
                                    buildIf: '{{city}}==="chongqing"',
                                    props: {
                                        cap: '地区：',
                                        icon: 'earth-asia',
                                        value: '{{regionIdList}}',
                                        searchable: true,
                                        clearable: !REGION_ID,
                                        disabled: !!REGION_ID,
                                        data: '{{regionListData}}'
                                    },
                                    dataUrl: {
                                        urlKey: 'getRegionList',
                                        transform: (res) => {
                                            _model.regionList = res.data.filter(({ regionId }) => (REGION_ID ? regionId == REGION_ID : true)).map(({ regionId, regionNameChn }) => ({ name: regionNameChn, value: regionId }));
                                            return _model.regionList;
                                        }
                                    }
                                },
                                {
                                    type: 'multidropdown',
                                    buildIf: '{{city}}==="chongqing"',
                                    props: {
                                        cap: '区县：',
                                        icon: 'globe',
                                        value: '{{subareaIdList}}',
                                        searchable: true,
                                        remoteSearch: true,
                                        clearable: !AREA_ID,
                                        disabled: !!AREA_ID,
                                        searchName: 'subareaDesc',
                                        data: '{{subareaListData}}'
                                    },
                                    dataUrl: {
                                        urlKey: 'getSubAreaListData',
                                        debounce: 200,
                                        data: jaml.var('subareaDesc', 'regionIdList', 'regionList', (name, regionIdList, regionList) => ({
                                            name,
                                            fatherName: regionList
                                                ?.filter(({ value }) => (REGION_ID ? REGION_ID == value : regionIdList?.includes(value)))
                                                .map(({ name }) => name)
                                                .join(),
                                            areaType: 5
                                        })),
                                        transform(res) {
                                            _model.subareaIdList = AREA_ID ? [AREA_ID] : [];
                                            return res.data.filter(({ areaId }) => (AREA_ID ? AREA_ID == areaId : true)).map((item) => ({ name: item.areaName, value: item.areaId }));
                                        }
                                    }
                                },
                                {
                                    type: 'multidropdown',
                                    props: {
                                        cap: '变电站：',
                                        value: '{{stIdList}}',
                                        icon: 'transformer-bolt',
                                        searchable: true,
                                        clearable: true,
                                        remoteSearch: true,
                                        searchName: 'stationDesc',
                                        data: '{{stationListData}}'
                                    },
                                    dataUrl: {
                                        urlKey: 'getSubstationList',
                                        debounce: 200,
                                        method: 'post',
                                        data: {
                                            devName: '{{stationDesc}}??undefined',
                                            regionIdList: '{{regionIdList}} ?? undefined',
                                            bvIdList: '{{bvIdList}} ?? undefined',
                                            devType: ['substation']
                                        },
                                        transform(res) {
                                            _model.stIdList = [];
                                            return res.data.map((item) => ({ name: item.stName, value: item.stId }));
                                        }
                                    }
                                },
                                {
                                    type: 'select',
                                    cap: '是否成功：',
                                    icon: 'octagon-check',
                                    styles: [Styles.select.regularStyle],
                                    value: '{{successFlag}}',
                                    defaultValue: '',
                                    data: [
                                        {
                                            name: '成功',
                                            value: 0
                                        },
                                        {
                                            name: '失败',
                                            value: 1
                                        }
                                    ]
                                },
                                {
                                    type: 'input',
                                    cap: '操作内容：',
                                    styles: [Styles.input.regularStyle],
                                    icon: 'comment-text',
                                    value: '{{content}}',
                                    defaultValue: ''
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
                                        marginLeft: '.625rem'
                                    }
                                })
                            ],
                            datepickerStyles: [Styles.datepicker.regularStyle],
                            buttonStyles: [Styles.searchBtnsStyles],
                            components: [
                                { type: 'datepicker', value: '{{beginDate}}', max: '{{endDate}}', defaultValue: jaml.var('shortKeyValue', (value) => moment().subtract(value, 'day').format('YYYY-MM-DD')), icon: 'calendar', cap: '查询时间：' },
                                { type: 'datepicker', value: '{{endDate}}', min: '{{beginDate}}', defaultValue: moment().format('YYYY-MM-DD'), cap: '-' },
                                {
                                    type: 'radio',
                                    data: [
                                        { name: '昨日', value: 1 },
                                        { name: '今日', value: 0 },
                                        { name: '近三天', value: 3 },
                                        { name: '近七天', value: 7 }
                                    ],
                                    value: '{{shortKeyValue}}',
                                    defaultValue: 0,
                                    onvaluechange: function (value) {
                                        _model.endDate = moment().format('YYYY-MM-DD');
                                        _model.beginDate = moment().subtract(value, 'day').format('YYYY-MM-DD');
                                        initTableData();
                                        getChartData();
                                    }
                                },
                                {
                                    type: 'button',
                                    cap: '查询',
                                    icon: 'search',
                                    class: 'jam-cta',
                                    onclick: function () {
                                        initTableData();
                                        getChartData();
                                    }
                                },
                                {
                                    type: 'button',
                                    cap: '重置',
                                    usage: 'reset',
                                    icon: 'refresh',
                                    onclick() {
                                        this.vars.regionIdList = [];
                                        this.vars.subareaIdList = [];
                                        this.vars.stIdList = [];
                                    }
                                },
                                {
                                    type: 'button',
                                    cap: '导出',
                                    icon: 'file-export',
                                    onclick: function () {
                                        exportExcel(urlConfig['exportRemoteOpRecord'].url, packageParams(), `远方操作统计_${moment().format('yyyyMMDDHHmmssSSS')}.xlsx`, 'post');
                                    }
                                },
                                {
                                    type: 'button',
                                    cap: '统计',
                                    showIf: '{{isTest}}',
                                    icon: 'share-nodes',
                                    onclick: function () {
                                        jam.renderModal('#main', operationStatisticWindow());
                                        // createWindow({
                                        //     title: '统计详情',
                                        //     width: '70vw',
                                        //     height: '30vw',
                                        //     body: operationStatisticWindow(),
                                        //     showBtn: false
                                        // });
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    styles: ['size(width:42%;height:100%)', 'margin(left:var(--gap))', 'flex(direction:column;)'],
                    components: [
                        {
                            type: 'wrapper',
                            styles: ['layout.flex'],
                            components: [
                                {
                                    type: 'label',
                                    cap: '{{chartTitle}}',
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
                                {
                                    type: 'buttongroup-radio',
                                    styles: [Styles.buttonGroupStyles],
                                    value: '{{sortIndex}}',
                                    data: [
                                        {
                                            name: '默认',
                                            value: 0
                                        },
                                        {
                                            name: '升序',
                                            value: 1
                                        },
                                        {
                                            name: '降序',
                                            value: 2
                                        }
                                    ],
                                    onvaluechange: function (value) {
                                        const _data = _msgr.get('chartData') || [];
                                        initChart(_data, value);
                                    },
                                    components: [
                                        {
                                            type: 'label',
                                            icon: 'download',
                                            attrs: {
                                                title: '导出图表数据'
                                            },
                                            styles: [
                                                Styles.icon.duotone,
                                                Styles.css({
                                                    // position: 'absolute',
                                                    right: '0rem',
                                                    top: '0rem',
                                                    cursor: 'pointer'
                                                })
                                            ],
                                            onclick() {
                                                const data = _msgr.get('chartData') || [];
                                                let list = [['区域名称', '失败数量', '成功数量']];
                                                for (let item of data) {
                                                    list.push([item?.regionName, item?.failCount, item?.count]);
                                                }
                                                nusp.exportArray2Excel(list, _msgr.get('chartTitle') + '统计' || '指标统计');
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        // 图表
                        {
                            type: 'wrapper',
                            styles: ['size.fullsize', 'layout(overflow: hidden)', `border(width:.0625rem;style:solid;color: ${jam.ac(0.99, 0.95, 0.6, jam.acLumiO(30))})`],
                            components: [
                                {
                                    type: 'wrapper',
                                    styles: ['size.fullsize', 'layout(position:relative)', 'flex(direction:column;)'],
                                    components: [
                                        {
                                            type: 'wrapper',
                                            styles: ['padding(0 1rem)', 'layout.flex(justifyContent:space-between;alignItems:center)'],
                                            descStyles: {
                                                label: [
                                                    'text(size:.875rem;)',
                                                    Styles.stylesheet({
                                                        '.title-color': {
                                                            color: jam.ac(0.95, 1, jam.lumiL(40))
                                                        },
                                                        '.fail-color': {
                                                            color: 'hsl(0, 100%, 66.1%)'
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
                                            type: 'groupBar',
                                            ref: 'chartBar',
                                            props: {
                                                unit: '',
                                                barWith: '20%',
                                                fontSize: '0.6rem',
                                                dataType: 'analog',
                                                valueType: 'number',
                                                decimalPos: 2,
                                                hasSubtitle: false,
                                                toFixed: false,
                                                hasTags: false,
                                                colorList: ['hsl(205, 100%, 67%)', 'hsl(0, 70%, 60%)', 'hsl(300, 52%, 59%)', 'hsl(58, 65%, 51%)']
                                            },
                                            vars: {
                                                data: {
                                                    id: '000',
                                                    value: '2000',
                                                    chartData: [['type', '成功', '失敗']]
                                                }
                                            },
                                            onafterrender: async function () {
                                                const _chart = jam.findElement(this.element, 'jam-chart');
                                                await _chart.chartReady;
                                                _chart.chart.on('click', (params) => {
                                                    const regionName = params.name;
                                                    if (!regionName) return;
                                                    const regionId = _model.regionList.find(({ name, _ }) => name === regionName)?.value;
                                                    _model.regionIdList = Array.from(new Set([...(_model.regionIdList || []), regionId]));
                                                    const isSuccess = params.seriesName == '成功';
                                                    if (isSuccess) {
                                                        _model.vars.successFlag = 0;
                                                    } else {
                                                        _model.vars.successFlag = 1;
                                                    }
                                                    initTableData();
                                                });
                                            },
                                            styles: ['groupBar.basic', 'size.fullsize']
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
                    styles: ['flex(1)', Styles.hover.toShowAll({ selector: '.jam-td' }), Styles.table.fixedrowheight({ height: '2.5rem' }), ' css(width:100%)', Styles.css({ padding: 0 })],
                    props: {
                        cpageHide: {
                            pageSize: false
                        },
                        pageSizeList: [
                            { value: 15, name: '15条/页' },
                            { value: 30, name: '30条/页' },
                            { value: 50, name: '50条/页' },
                            { value: 100, name: '100条/页' }
                        ]
                    },
                    dataWatcher: 'eventDrivenAnalyticsData',
                    dataDef: [
                        {
                            cap: '地区',
                            key: 'regionName',
                            sortable: false,
                            width: '10%'
                        },
                        {
                            cap: '区县',
                            key: 'subareaName',
                            sortable: false,
                            width: '6rem'
                        },
                        {
                            cap: '厂站名称',
                            key: 'stName',
                            sortable: false,
                            width: '10%'
                        },
                        {
                            cap: '间隔',
                            key: 'bayName',
                            sortable: false,
                            formatter: function (value) {
                                return value ? value : '<div style="width:100%;text-align:center">--</div>';
                            },
                            width: '12%',
                            styles: [Styles.toShowAll]
                        },
                        {
                            cap: '设备名称',
                            key: 'devName',
                            sortable: false,
                            width: '12%',
                            styles: [Styles.toShowAll]
                        },
                        {
                            cap: '电压等级',
                            key: 'bvName',
                            sortable: false,
                            width: '8%',
                            formatter: formatterJameBv
                        },
                        {
                            cap: '操作类型',
                            key: 'opType',
                            sortable: false,
                            width: '8%'
                        },
                        {
                            cap: '操作结果',
                            key: 'opResult',
                            sortable: false,
                            width: '8%'
                        },
                        {
                            cap: '操作内容',
                            key: 'content',
                            sortable: false,
                            align: 'left',
                            styles: [Styles.toShowAll],
                            width: '20%'
                        },
                        {
                            cap: '操作时间',
                            key: 'occurTime',
                            sortable: false,
                            formatter: formatterJameTime,
                            width: '12%',
                            styles: [Styles.toShowAll]
                        }
                    ]
                }
            ]
        }
    ],
    vars: {
        beginDate: moment().format('yyyy-MM-DD'),
        endDate: moment().format('yyyy-MM-DD'),
        opType: 1,
        regionIdList: REGION_ID ? [REGION_ID] : [],
        subareaIdList: AREA_ID ? [AREA_ID] : [],
        successFlag: 2,
        sortIndex: 0,
        cpageSize: 15,
        ctotal: 0,
        cpageNo: 1,
        isTest,
        city: jam.getUrlParams()?.city
    },
    watchers: [
        {
            key: 'opType',
            callback: function (value) {
                let chartTitle = optTypeList.find((item) => item.value == value).name;
                chartTitle = chartTitle == '全部' ? '开关遥控' : chartTitle;
                _msgr.pub('chartTitle', chartTitle);
                _model.vars.opType = value;
                initTableData();
                getChartData();
            }
        },
        {
            keys: ['cpageNo', 'cpageSize'],
            debounce: 400,
            callback: function (cpageNo, cpageSize) {
                _model.vars.cpageNo = cpageNo;
                _model.vars.cpageSize = cpageSize;
                initTableData();
            }
        }
    ],
    onmount: function () {
        _this = this;
        _model = this.model;
        _msgr = this.model.msgr;
        _model.vars.opType = mango.get('remoteOperationParams')?.opType || 1;
    },
    onunmount: function () {
        mango.pub('remoteOperationParams', null);
    },
    onafterrender: function () {
        getChartData();
    }
};

function initTableData() {
    ajaxCall('queryMonitorsDiaryCtrl', {
        params: {
            pageIndex: _model.vars.cpageNo,
            pageSize: _model.vars.cpageSize,
            ...packageParams()
        },
        type: 'post',
        success(data) {
            _msgr.pub('eventDrivenAnalyticsData', data?.list || []);
            _model.vars.ctotal = data.pojoTotalCount;
        }
    });
}

function packageParams() {
    return {
        startTime: _model.vars.beginDate ? _model.vars.beginDate + ' 00:00:00' : undefined,
        endTime: _model.vars.endDate ? _model.vars.endDate + ' 23:59:59' : undefined,
        stIdList: _model.vars.stIdList,
        bvIdList: _model.bvIdList,
        regionIdList: REGION_ID ? [REGION_ID] : _model.regionIdList,
        subareaIdList: AREA_ID ? [AREA_ID] : _model.subareaIdList,
        successFlag: _model.vars.successFlag != null ? _model.vars.successFlag : 2,
        opUser: _msgr.get('content') ? _msgr.get('content').trim() : '',
        opType: _model.opType
    };
}

function getChartData() {
    let params = packageParams();
    params.opType = params.opType ? params.opType : 1;
    delete params.stIdList;
    delete params.opUser;
    ajaxCall('getRemoteOpRegionCnt', {
        params,
        type: 'post',
        useMock: false,
        success(res) {
            let data = res || [];
            if (REGION_ID) data = data.filter(({ regionId }) => regionId == REGION_ID);
            let successSum = 0;
            let failSum = 0;
            var xData = [],
                yData = [],
                yData2 = [];

            if (data instanceof Array) {
                if (!data.length) {
                    suppChartData();
                } else {
                    data.forEach((item) => {
                        xData.push(item.regionName);
                        yData.push(item.count);
                        yData2.push(item.failCount);
                        successSum += item.count;
                        failSum += item.failCount;
                    });
                }
            } else {
                suppChartData();
            }
            _model['chart-left-info'] = `<div><span>操作总成功数</span><span class="title-color"> ${successSum} </span>个，<span>操作总失败数</span><span class="fail-color"> ${failSum} </span>个</div>`;
            _msgr.pub('chartData', data);
            initChart(data, 0);
        }
    });
}

function initChart(data, chartFlag) {
    const chartData = [['type', '成功', '失敗']];
    const newBarData = JSON.parse(JSON.stringify(data));
    if (chartFlag == 2) {
        newBarData.sort(function (a, b) {
            if (a.count !== b.count) {
                return b.count - a.count;
            } else {
                return b.failCount - a.failCount;
            }
        });
    } else if (chartFlag == 1) {
        newBarData.sort(function (a, b) {
            if (a.count !== b.count) {
                return a.count - b.count;
            } else {
                return a.failCount - b.failCount;
            }
        });
    }
    newBarData.forEach((item) => {
        chartData.push([item.regionName, item.count, item.failCount]);
    });
    _this.ref('chartBar').vars.data.chartData = chartData;
}
