import { ajaxCall, loadConf, exportExcel, findCol, formatterJameBv } from '../common.js';
import { urlConfig, mockPath } from '../global.js';
// import { createWindow } from '../components/createWindow.js';
import oilTemperatureAnalysisWindow from '../components/modal/oilTemperatureAnalysisWindow.js';
import searchBtns from './registerCards/buttons/searchBtns.mjs';
import { openDiffHistoryChart } from '../components/diffImportantDevTable.js';
let _msgr, _this;
let regionId,
    stName = '',
    clickIndex;
const isTest = loadConf('config.json', {})?.isTest || false;
const bvData = [['电压等级', '油温越限']];
const tempData = [['温度', '台数']];
export default {
    type: 'wrapper',
    class: 'main-transformer-oilTemperature-statistics',
    styles: [
        'css(--gap:var(--jam-space-m))',
        'padding(bottom:0)',
        'layout(overflow:hidden auto)',
        'size.fullsize',
        Styles.stylesheet({
            ':scope': {},
            '.form-box': {
                flexDirection: 'column',
                '.form-item': {
                    display: 'flex',
                    alignItems: 'center'
                },
                '.btn-box': {
                    marginLeft: 'm',
                    'jam-button': {
                        marginRight: 'm'
                    }
                }
            },
            '.table-box': {
                width: '100%'
            },
            '.echarts-box': {
                marginTop: 'm',
                justifyContent: 'space-between',
                '.temp-box': {
                    width: 'calc((100% - 2rem)/3)',
                    flexDirection: 'column',
                    position: 'relative',
                    background: 'radial-gradient(circle, transparent, var(--jam-color-primary-film)) !important',
                    '.icon-download': {
                        position: 'absolute',
                        right: 0,
                        top: '0.25rem',
                        cursor: 'pointer'
                    }
                },
                '.jam-cc-type-chart.jam-cc.jam-cc-legend-on-right .jam-cc-chart-wrapper': {
                    width: '50%'
                }
            },
            '.temp-list': {
                height: 'calc(100% - 2.5rem)',
                '[data-id="4"]': {
                    '[slot=value]': {
                        color: 'red'
                    }
                }
            }
        }),
        Styles.layout.grid({ cols: 16, rows: 22, gap: `0.5rem` })
    ],
    components: [
        {
            type: 'wrapper',
            class: 'form-box',
            styles: [Styles.layout.gridpos(1, 1, 16, 2)],
            components: [
                {
                    type: 'wrapper',
                    class: 'form-item',
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '区域选择',
                            styles: [Styles.buttonGroupStylesWithBgCap],
                            icon: 'earth-asia',
                            defaultValue: null,
                            valueKey: 'regionId',
                            data: '{{regionList}}',
                            onvaluechange: function (val) {
                                regionId = val;
                                getSubstationList();
                            }
                        },
                        {
                            type: 'buttongroup-radio',
                            cap: '电压等级',
                            icon: 'bolt',
                            defaultValue: null,
                            valueKey: 'bvId',
                            dataWatcher: 'bvList',
                            styles: [Styles.buttonGroupStylesWithBgCap]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'form-item',
                    components: [
                        {
                            type: 'filterSelect',
                            styles: ['padding(top:0;bottom:0)', Styles.input.regularStyle],
                            childStyles: ['input.agent.border(radius:s)', 'input.labelslot.margin(0)', 'padding(0)'],
                            valueKey: 'stId',
                            props: { cap: '变电站：', placeholder: '请选择', data: '{{stList}}', icon: 'transformer-bolt', search: '{{name}}', select: '{{stId}}' },
                            watchers: [
                                {
                                    key: 'name',
                                    callback: function (val) {
                                        stName = val;
                                        getSubstationList();
                                    },
                                    debounce: 200
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            components: [
                                {
                                    type: 'input',
                                    cap: '油温：',
                                    icon: 'temperature-full',
                                    valueKey: 'minTemp',
                                    styles: [
                                        Styles.input.regularStyle,
                                        Styles.input.agent.css({
                                            minWidth: '6rem',
                                            width: '6rem'
                                        })
                                    ]
                                },
                                {
                                    type: 'label',
                                    cap: '-'
                                },
                                {
                                    type: 'input',
                                    cap: '',
                                    valueKey: 'maxTemp',
                                    styles: [
                                        Styles.input.regularStyle,
                                        Styles.input.agent.css({
                                            minWidth: '6rem',
                                            width: '6rem'
                                        })
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            class: 'btn-box',
                            components: [
                                searchBtns,
                                {
                                    type: 'button',
                                    cap: '变电站统计',
                                    icon: 'share-nodes',
                                    class: 'icon-duotone ml-5',
                                    showIf: '{{isTest}}',
                                    styles: ['with.accent'],
                                    onclick: function () {
                                        jam.renderModal('#main', oilTemperatureAnalysisWindow());
                                        // createWindow({
                                        //     title: `油温越限变电站统计`,
                                        //     width: '80vw',
                                        //     height: '75vh',
                                        //     body: oilTemperatureAnalysisWindow(),
                                        //     showBtn: false
                                        // });
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'echarts-box',
            styles: [Styles.layout.gridpos(1, 3, 16, 7)],
            components: [
                {
                    type: 'wrapper',
                    class: 'temp-box',
                    components: [
                        {
                            type: 'label',
                            cap: '油温越限（地区）',
                            icon: 'map-location-dot',
                            styles: [Styles.tableTitleStyles]
                        },
                        {
                            type: 'label',
                            class: 'icon-download',
                            icon: 'download',
                            showIf: '{{isTest}}',
                            onclick: function () {
                                nusp.exportArray2Excel(_this.ref('regionChart').vars.data.chartData, '油温越限（地区）');
                            }
                        },
                        {
                            type: 'gradientBarChart',
                            ref: 'regionChart',
                            class: 'region-chart',
                            props: {
                                unit: '',
                                desc: ''
                            },
                            vars: {
                                data: {
                                    chartData: [['地区', '油温越限值']]
                                }
                            },
                            styles: ['gradientBarChart.basic', 'size.fullsize'],
                            onafterrender: async function () {
                                const _chart = jam.findElement('.region-chart');
                                await _chart.chartReady;
                                _chart.chart.on('click', (params) => {
                                    let regionId = _msgr.get('regionList').filter((item) => item.name == params.name);
                                    _msgr.pub('minTemp', 85);
                                    _msgr.pub('regionId', regionId[0].value);
                                });
                            }
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'temp-box',
                    components: [
                        {
                            type: 'label',
                            cap: '油温越限（电压等级）',
                            icon: 'bolt',
                            styles: [Styles.tableTitleStyles]
                        },
                        {
                            type: 'label',
                            class: 'icon-download',
                            icon: 'download',
                            showIf: '{{isTest}}',
                            onclick: function () {
                                nusp.exportArray2Excel(bvData, '油温越限（电压等级）');
                            }
                        },
                        {
                            type: 'pieWithLegend',
                            ref: 'bvChart',
                            class: 'bv-chart',
                            props: {
                                title: '油温越限（电压等级）',
                                unit: '',
                                numberIndex: [2, 3],
                                bvLegend: ['', ''],
                                colorSet: '{{colorList}}',
                                radius1: ['70%', '80%'],
                                radius2: ['60%', '65%']
                            },
                            vars: {
                                data: {
                                    chartData: [['type', 'total', 'addValue', 'leftValue']]
                                }
                            },
                            styles: ['pieWithLegend.basic', 'size.fullsize'],
                            onafterrender: async function () {
                                const _chart = jam.findElement(this.element, 'jam-chart');
                                await _chart.chartReady;
                                _chart.chart.on('click', (params) => {
                                    let bvId = _msgr.get('bvList').filter((item) => item.name == params.name);
                                    _msgr.pub('minTemp', 85);
                                    _msgr.pub('bvId', bvId[0].value);
                                });
                            }
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'temp-box',
                    components: [
                        {
                            type: 'label',
                            cap: '油温越限（温度）',
                            icon: 'oil-temperature',
                            styles: [Styles.tableTitleStyles]
                        },
                        {
                            type: 'label',
                            class: 'icon-download',
                            icon: 'download',
                            showIf: '{{isTest}}',
                            onclick: function () {
                                nusp.exportArray2Excel(tempData, '油温越限（温度）');
                            }
                        },
                        {
                            type: 'with4DataSimpleCombine',
                            class: 'temp-list',
                            ref: 'dataIndi',
                            props: {
                                dataDef: [
                                    {
                                        hasIcon: true,
                                        icon: 'temperature-full',
                                        title: '{{data.a.name}}',
                                        dataKey: 'a',
                                        hasSubtitle: false,
                                        dataType: 'string',
                                        valueType: 'string',
                                        unit: '台',
                                        decimalPos: 0,
                                        hasTags: false,
                                        id: '1',
                                        value: '{{data.a.value}}'
                                    },
                                    {
                                        hasIcon: true,
                                        title: '{{data.b.name}}',
                                        icon: 'temperature-full',
                                        dataKey: 'b',
                                        unit: '台',
                                        hasSubtitle: false,
                                        dataType: 'string',
                                        valueType: 'string',
                                        decimalPos: 0,
                                        hasTags: false,
                                        id: '2',
                                        value: '{{data.b.value}}'
                                    },
                                    {
                                        hasIcon: true,
                                        icon: 'temperature-full',
                                        title: '{{data.c.name}}',
                                        dataKey: 'c',
                                        hasSubtitle: false,
                                        unit: '台',
                                        dataType: 'analog',
                                        valueType: 'number',
                                        decimalPos: 0,
                                        toFixed: true,
                                        hasTags: false,
                                        id: '3',
                                        value: '{{data.c.value}}'
                                    },
                                    {
                                        hasIcon: true,
                                        icon: 'temperature-full',
                                        title: '{{data.d.name}}',
                                        dataKey: 'd',
                                        hasSubtitle: false,
                                        unit: '台',
                                        dataType: 'analog',
                                        valueType: 'number',
                                        decimalPos: 1,
                                        id: '4',
                                        hasTags: false,
                                        value: '{{data.d.value}}'
                                    }
                                ]
                            },
                            onclick(e) {
                                const _el = jam.closest(e.target, 'jam-indicator');
                                const _id = _el.getAttribute('data-id') ?? null;
                                if (clickIndex == _id) {
                                    _msgr.pub('statisticsIndex', null);
                                    clickIndex = null;
                                } else {
                                    clickIndex = _id;
                                    _msgr.pub('statisticsIndex', _id);
                                }
                            },
                            styles: [
                                'with4DataSimpleCombine.basic',
                                Styles.icon.solid,
                                Styles.stylesheet({
                                    'jam-indicator[data-id="4"] [slot=value]': {
                                        color: 'error !important'
                                    }
                                })
                            ]
                        }
                        // {
                        //     type: 'wrapper',
                        //     class: 'temp-list',
                        //     components: jaml.var('tempList', function (val) {
                        //         const cardList = [];
                        //         val.forEach((item, index) => {
                        //             const _color = index == 3 ? jam.getColor('error').css() : jam.accolor.css();
                        //             cardList.push({
                        //                 type: 'indicatorWithBar',
                        //                 ref: 'indiBar',
                        //                 class: 'temp-item',
                        //                 colorSet: [_color],
                        //                 id: index + 1,
                        //                 props: {
                        //                     icon: 'temperature-full',
                        //                     unit: '个',
                        //                     dataType: 'analog',
                        //                     valueType: 'number',
                        //                     decimalPos: 2,
                        //                     borderRadius: 3,
                        //                     colored: item.name,
                        //                     overwrite: {
                        //                         title: '{{data.title}}'
                        //                     }
                        //                 },
                        //                 vars: {
                        //                     data: {
                        //                         value: item.value,
                        //                         title: item.name,
                        //                         chartData: [
                        //                             ['类型', '数量'],
                        //                             [val[0]?.name, val[0]?.value],
                        //                             [val[1]?.name, val[1]?.value],
                        //                             [val[2]?.name, val[2]?.value],
                        //                             [val[3]?.name, val[3]?.value]
                        //                         ]
                        //                     }
                        //                 },
                        //                 styles: ['indicatorWithBar.basic', Styles.value.css({ color: _color, cursor: 'pointer', fontSize: 'l', textDecoration: 'underline' })],
                        //                 onclick(e) {
                        //                     if (clickIndex == this.id) {
                        //                         _msgr.pub('statisticsIndex', null);
                        //                         clickIndex = null;
                        //                     } else {
                        //                         clickIndex = this.id;
                        //                         _msgr.pub('statisticsIndex', this.id);
                        //                     }
                        //                 }
                        //             });
                        //         });
                        //         return cardList;
                        //     })
                        // }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            styles: [Styles.layout.gridpos(1, 10, 16, 13)],
            components: [
                {
                    class: 'table-box',
                    type: 'table',
                    dataDef: [
                        { show: false },
                        {
                            cap: 'temp1Invalid',
                            key: 'temp1Invalid',
                            show: false
                        },
                        {
                            cap: 'temp2Invalid',
                            key: 'temp2Invalid',
                            show: false
                        },
                        {
                            cap: '',
                            key: 'temp1LcId',
                            show: false
                        },
                        {
                            cap: '',
                            key: 'temp2LcId',
                            show: false
                        },
                        {
                            cap: '',
                            key: 'devId',
                            show: false
                        },
                        {
                            cap: '所属单位',
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
                            sortable: false,
                            key: 'bvName',
                            formatter: formatterJameBv
                        },
                        {
                            cap: '设备名称',
                            sortable: false,
                            key: 'devName',
                            align: 'left'
                        },
                        {
                            key: 'temp1',
                            cap: '油温1',
                            align: 'center',
                            formatter: function (val) {
                                // if (this.col(1)) {
                                //     return `<div style="color:#ff4757;">${toFixed2(val)}</div>`;
                                // } else {
                                //     return `<div style="color:#00c853;">${toFixed2(val)}</div>`;
                                // }
                                return jame({
                                    type: 'label',
                                    cap: toFixed2(val),
                                    styles: [
                                        Styles.css({
                                            color: this.col(1) ? '#ff4757' : '#00c853',
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                            'text-underline-offset': '.2rem'
                                        })
                                    ],
                                    onclick: function (e) {
                                        let target = findCol(e.target);
                                        const devId = target.col(5);
                                        const loadRateLcId = target.col(3);
                                        const modal_params = {
                                            devId,
                                            devName: target.col(9)
                                        };
                                        openDiffHistoryChart(modal_params, [loadRateLcId]);
                                    }
                                });
                            }
                        },
                        {
                            key: 'temp2',
                            cap: '油温2',
                            align: 'center',
                            formatter: function (val) {
                                // if (this.col(2)) {
                                //     return `<div style="color:#ff4757;">${toFixed2(val)}</div>`;
                                // } else {
                                //     return `<div style="color:#00c853;">${toFixed2(val)}</div>`;
                                // }
                                return jame({
                                    type: 'label',
                                    cap: toFixed2(val),
                                    styles: [
                                        Styles.css({
                                            color: this.col(2) ? '#ff4757' : '#00c853',
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                            'text-underline-offset': '.2rem'
                                        })
                                    ],
                                    onclick: function (e) {
                                        let target = findCol(e.target);
                                        const devId = target.col(5);
                                        const loadRateLcId = target.col(4);
                                        const modal_params = {
                                            devId,
                                            devName: target.col(9)
                                        };
                                        openDiffHistoryChart(modal_params, [loadRateLcId]);
                                    }
                                });
                            }
                        }
                    ],
                    styles: ['padding(0)', 'cap.hide', 'icon.hide', Styles.hover.toShowAll({ selector: '.hover' }), Styles.tableStylesFixedRowGeight, Styles.numberAlign],
                    data: jaml.var('_t', 'regionId', 'bvId', 'statisticsIndex', function (_t, regionId, bvId, statisticsIndex) {
                        const [stId, minTemp, maxTemp] = ['stId', 'minTemp', 'maxTemp'].map((key) => this.vars[key]);
                        return jam.ajaxCall({
                            debounce: 300,
                            method: 'post',
                            data: {
                                _t: _t,
                                regionId: regionId,
                                stId: stId,
                                bvId: bvId,
                                minTemp: minTemp,
                                maxTemp: maxTemp,
                                statisticsIndex: statisticsIndex
                            },
                            headers: {
                                Authorization: 'Bearer ' + jam.getUrlParam('token') || ''
                            },
                            url: urlConfig.getOilTempRecords.url,
                            mock: mockPath + urlConfig.getOilTempRecords.mock,
                            transform: (res) => {
                                try {
                                    const list = res.data || [];
                                    _this.vars.ctotal = res.data.length;
                                    return list;
                                } catch (error) {
                                    console.log(' ', error);
                                }
                            }
                        });
                    }),
                    watchers: [
                        {
                            debounce: 500,
                            key: 'to-export-table',
                            callback: async (val) => {
                                if (!val) return;
                                try {
                                    const [regionId, bvId, statisticsIndex, stId, minTemp, maxTemp] = ['regionId', 'bvId', 'statisticsIndex', 'stId', 'minTemp', 'maxTemp'].map((key) => _this.vars[key]);

                                    await exportExcel(
                                        urlConfig['exportOilTempRecords'].url,
                                        {
                                            regionId: regionId,
                                            stId: stId,
                                            bvId: bvId,
                                            minTemp: minTemp,
                                            maxTemp: maxTemp,
                                            statisticsIndex: statisticsIndex
                                        },
                                        `主变油温统计__${jam.formatDate(Date.now(), 'yyyyMMddHHmmssSSS')}.xlsx`
                                    );
                                } catch (error) {
                                    console.error(error);
                                } finally {
                                    _msgr.pub('to-export-table', null);
                                }
                            }
                        }
                    ],
                    onmount() {
                        _msgr = this.msgr;
                    }
                }
            ]
        }
    ],
    vars: {
        colorList: [],
        isTest
    },
    onmount: function () {
        _msgr = this.msgr;
        _this = this;
    },
    onafterrender: function () {
        getRegionList();
        getBvList();
        getRegionTempData();
        getBVTempData();
        getTempChartData();
    }
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
                        value: null
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
 * 获取电压等级列表
 */
function getBvList() {
    ajaxCall(
        'getBvList',
        {
            success(data) {
                const defaultBv = [
                    {
                        name: '全部',
                        value: null
                    }
                ];
                const excludeBvList = ['1000kV', '10kV'];
                const bvList = data
                    .filter((item) => !excludeBvList.includes(item.name))
                    .map((item) => {
                        return {
                            name: item.name,
                            value: item.id
                        };
                    });
                _msgr.pub('bvList', [...defaultBv, ...bvList]);
            },
            useMock: false
        },
        false
    );
}

/**
 * 获取变电站列表
 */
function getSubstationList() {
    ajaxCall(
        'getSubstationList',
        {
            success(data) {
                const stData = data.map((item) => {
                    return {
                        name: item.stName,
                        value: item.stId
                    };
                });
                _msgr.pub('stList', stData);
            },
            params: {
                count: 999,
                devName: stName,
                devType: ['substation'],
                regionId: regionId
            },
            type: 'post',
            useMock: false
        },
        false
    );
}

/**
 * 油温越限（地区）echarts数据
 */
function getRegionTempData() {
    ajaxCall(
        'getOilTempRegionCnt',
        {
            success(data) {
                const _chartData = [['地区', '油温越限值']];
                data.forEach(function (item) {
                    _chartData.push([item.regionName, item.total]);
                });
                _this.ref('regionChart').vars.data.chartData = _chartData;
            },
            params: {},
            useMock: false
        },
        false
    );
}

/**
 * 油温越限（电压等级）echarts数据
 */
function getBVTempData() {
    ajaxCall(
        'getOilTempBvCnt',
        {
            success(data) {
                const _chartData = [['type', 'total', 'addValue', 'leftValue']];
                let sum = 0;
                data.forEach(function (item) {
                    if (item.bvName !== '1000kV' && item.bvName !== '10kV') {
                        sum += item.total;
                    }
                });
                data.forEach(function (item) {
                    if (item.bvName !== '1000kV' && item.bvName !== '10kV') {
                        _this.vars.colorList.push(jam.getColor(item.bvName).hex());
                        _chartData.push([item.bvName, item.total, item.total, toFixed2((item.total / sum) * 100) + '%']);
                        bvData.push([item.bvName, item.total]);
                    }
                });
                _this.ref('bvChart').vars.data.value = sum;
                _this.ref('bvChart').vars.data.chartData = _chartData;
            },
            params: {},
            useMock: false
        },
        false
    );
}

/**
 * 油温越限（温度）echarts数据
 */
function getTempChartData() {
    ajaxCall(
        'oilTempStatics',
        {
            success(data) {
                const tempList = [
                    {
                        name: '50℃\n及以下',
                        value: data.count1
                    },
                    {
                        name: '50℃-70℃',
                        value: data.count2
                    },
                    {
                        name: '70℃以上',
                        value: data.count3
                    },
                    {
                        name: '温度异常',
                        value: data.count4
                    }
                ];
                _this.ref('dataIndi').vars.data = {
                    a: {
                        name: '50℃\n及以下',
                        value: data.count1
                    },
                    b: {
                        name: '50℃-70℃',
                        value: data.count2
                    },
                    c: {
                        name: '70℃以上',
                        value: data.count3
                    },
                    d: {
                        name: '温度异常',
                        value: data.count4
                    }
                };
                tempList.forEach((item) => {
                    tempData.push([item.name, item.value]);
                });
            },
            params: {},
            useMock: false
        },
        false
    );
}

/**
 *
 * @param {*} n
 * @returns
 */
function downLoadChart1() {}

function toFixed2(n) {
    return Number(n).toFixed(2) || '0';
}
