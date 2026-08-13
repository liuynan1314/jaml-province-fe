import { ajaxCall, findCol, getDetailConf, loadConf } from '../common.js';
import { createWindow } from '../components/createWindow.js';
import systemProgressCityAccessWindow from '../components/modal/systemProgressCityAccessWindow.js';
import systemProgressCityAccessNumWindow from '../components/modal/systemProgressCityAccessNumWindow.js';
import { getRegionList } from '../utils/commonList.js';
import { buildBasicTable } from '../components/componentBuilder.js';
const deviceList = getDetailConf('deviceList');
let _model, _msgr;
let deviceScaleData;
const deviceTypeIds = deviceList.map((item) => item.value);
const isTest = loadConf('config.json', {})?.isTest || false;
const STAT_NAMES = {
    operationTeam: '运维班总数_四区统计',
    doubleChannel: '双通道百分比_四区统计',
    mainSignal: '主遥信总数_四区统计',
    mainTelemetry: '主遥测总数_四区统计',
    mainDevice: '主设备总数_四区统计',
    auxiliaryDevice: '辅设备总数_四区统计',
    auxiliarySignal: '辅遥信总数_四区统计',
    auxiliaryTelemetry: '辅遥测总数_四区统计',
    singleChannel: '单通道百分比_四区统计',
    offlineChannel: '离线通道百分比_四区统计'
};

export default {
    type: 'wrapper',
    styles: [
        'size.fullsize',
        'css(columnGap:1.25rem)',
        Styles.stylesheet({
            '.main-wrapper': {
                overflow: 'hidden auto'
            },

            '.chart-container': {
                display: 'flex',
                flexDirection: 'column',
                padding: 'var(--gap)',
                height: '100%',
                background: 'tint',
                boxShadow: 'l'
            },
            '.chart-title': {
                background: 'url(../../assets/images/new/title_level.png) no-repeat left bottom',
                color: 'var(--jam-color-fg-default)',
                fontSize: 'm',
                height: '2rem',
                minWidth: '16rem'
            },
            '.barChart': {
                width: '100%',
                height: 'calc(100% - 2rem)'
            },
            '.faultBarChart': {
                width: '100%',
                height: 'calc(100% - 5rem)'
            },
            '.table-container': {
                padding: 'var(--gap)',
                marginTop: 'var(--gap)',
                border: 's solid var(--jam-color-primary-subtle)',
                background: 'tint',
                boxShadow: 'l',
                overflow: 'hidden auto'
            },
            '.fa-clock,.fa-user,.fa-calendar,.fa-bars,.fa-list': {
                '--color': 'var(--jam-color-primary-subtle) !important',
                '--stroke-color': 'var(--jam-color-primary-subtle) !important',
                '--color2': `rgba(0,0,0,0) !important`
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            class: 'main-wrapper',
            styles: ['flex(flex:1;direction:column)', 'css(gap:1.5rem)'],
            components: [
                {
                    type: 'wrapper',
                    descStyles: {
                        datepicker: ['padding(top:0;bottom:0)', 'datepicker.labelslot.margin(0)'],
                        button: [Styles.searchBtnsStyles]
                    },
                    styles: ['css(display:flex;alignItems:center;)'],
                    components: [
                        {
                            type: 'select',
                            styles: [Styles.select.regularStyle],
                            class: 'form_item',
                            icon: 'earth-asia',
                            cap: '所属区域:',
                            defaultValue: '{{formList.regionId}}',
                            valueKey: 'regionId',
                            data: '{{regionList}}'
                        },
                        {
                            type: 'button',
                            cap: '查询',
                            icon: 'search',
                            class: 'ml-_625rem jam-cta',
                            onclick: function () {
                                getGeneralStatisticsData();
                            }
                        },
                        {
                            type: 'button',
                            cap: '重置',
                            class: 'btn reset-btn',
                            icon: 'rotate-right',
                            onclick: function () {
                                _msgr.pub('regionId', null);
                                getGeneralStatisticsData();
                            }
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    styles: ['flex(direction:row)', 'css(min-height:31%)'],
                    class: 'chart-wrapper',
                    components: [
                        {
                            type: 'wrapper',
                            class: 'chart-container',
                            styles: ['css(width:50%;)'],
                            components: [
                                {
                                    type: 'wrapper',
                                    styles: ['size.fullsize', 'flex(direction:column)'],
                                    components: [
                                        {
                                            type: 'label',
                                            styles: [Styles.label.cap.css({ marginLeft: 'm', fontSize: 'm' })],
                                            class: 'chart-title',
                                            cap: '各地市接入率统计'
                                        },

                                        {
                                            type: 'barWithTotal',
                                            props: {
                                                title: '各地市接入率统计',
                                                unit: '%',
                                                hasValue: false,
                                                hasTags: false,
                                                barWidth: '1.5rem',
                                                tipFormatter: ``,
                                                showSplitArea: false,
                                                showSplitLineX: false
                                            },

                                            styles: ['barWithTotal.basic', 'css(width:100%;height:calc(100% - 2rem))']
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            class: 'chart-container',
                            styles: ['flex(flex:1;)', 'css(marginLeft:1.25rem;padding:0 1rem)'],
                            components: [
                                {
                                    type: 'wrapper',
                                    styles: ['flex(direction:row)', 'css(justify-content:space-between)'],
                                    components: [
                                        {
                                            type: 'label',
                                            styles: [Styles.label.cap.css({ marginLeft: 'm', fontSize: 'm' })],
                                            class: 'chart-title',
                                            cap: '主要设备数量统计'
                                        },
                                        {
                                            type: 'button',
                                            showIf: '{{isTest}}',
                                            class: 'btn query-btn',
                                            cap: '变电站统计',
                                            styles: [Styles.button.regularStyle, Styles.buttonWithQueryBgNew, Styles.props({ marginTop: 'xs', width: '7rem' })],
                                            onclick: function () {
                                                const params = {
                                                    title: '变电站统计'
                                                };
                                                jam.renderModal('#main', systemProgressCityAccessNumWindow(params));
                                                // createWindow({
                                                //     title: params.title,
                                                //     body: systemProgressCityAccessNumWindow(params),
                                                //     width: '50vw',
                                                //     height: '48vh',
                                                //     showBtn: false
                                                // });
                                            }
                                        }
                                    ]
                                },
                                {
                                    type: 'wrapper',
                                    styles: ['css(height:3rem)', Styles.layout.flex({ justifyContent: 'flex-start' })],
                                    components: [
                                        {
                                            type: 'buttongroup-radio',
                                            cap: '类型选择:',
                                            icon: 'chart-pyramid',
                                            value: '{{typeId}}',
                                            data: deviceList,
                                            onvaluechange: function (value) {
                                                handleTableData(value);
                                            }
                                        }
                                    ]
                                },
                                {
                                    type: 'wrapper',
                                    class: 'faultBarChart',
                                    components: [
                                        buildBasicTable({
                                            cap: '-表格',
                                            icon: 'table',
                                            broker: 'systemProgress',
                                            dataKey: 'numberTableData',
                                            dataDef: jaml.var('cols', (cols) =>
                                                cols.map((item, index) => {
                                                    if (index === 0) {
                                                        return {
                                                            key: item.key,
                                                            cap: item.cap,
                                                            sortable: false,
                                                            styles: [
                                                                Styles.css({
                                                                    fontFamily: 'DIN',
                                                                    fontSize: 's'
                                                                })
                                                            ]
                                                        };
                                                    } else {
                                                        return {
                                                            key: item.key,
                                                            cap: item.cap,
                                                            sortable: false,
                                                            formatter: function (value) {
                                                                return jame({
                                                                    type: 'label',
                                                                    cap: value ? value.split('_')[0] : 0,
                                                                    styles: [
                                                                        Styles.css({
                                                                            color: 'hsl(196.8, 74.9%, 67.3%)',
                                                                            fontFamily: 'DIN',
                                                                            fontSize: 's',
                                                                            cursor: 'pointer',
                                                                            textDecoration: 'underline'
                                                                        })
                                                                    ],
                                                                    onclick: function (e) {
                                                                        let target = findCol(e.target);
                                                                        let regionId = parseValueToVariables(target._value);
                                                                        const bvId = target.col(0);
                                                                        const params = {
                                                                            title: '主设备列表',
                                                                            regionId: Number(regionId),
                                                                            bvName: bvId,
                                                                            devType: _model.vars.typeId,
                                                                            tableIdList: '-2',
                                                                            buildIf: 3,
                                                                            tableId: _model.vars.typeId
                                                                        };
                                                                        openSystemProgressCityAccessWindow(params);
                                                                    }
                                                                });
                                                            }
                                                        };
                                                    }
                                                })
                                            )
                                        })
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'table-container',
                    styles: ['flex(flex:1;direction:column)'],
                    components: [
                        buildBasicTable({
                            cap: '-表格',
                            icon: 'table',
                            broker: 'systemProgress',
                            dataKey: 'defectRecordData',
                            dataDef: [
                                {
                                    key: 'regionName',
                                    cap: '地市',
                                    sortable: false
                                },
                                {
                                    key: 'ywbCnt',
                                    cap: '运维班数',
                                    sortable: false,
                                    formatter: function (value) {
                                        return jame({
                                            type: 'label',
                                            cap: value,
                                            styles: [
                                                Styles.css({
                                                    color: 'hsl(180, 100%, 41%)',
                                                    fontFamily: 'DIN',
                                                    fontSize: 's',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                })
                                            ],
                                            onclick: function (e) {
                                                let target = findCol(e.target);
                                                const regionId = target.col(11);
                                                const params = {
                                                    title: '运维班列表',
                                                    regionId: regionId,
                                                    tableIdList: 13351,
                                                    buildIf: 1
                                                };
                                                openSystemProgressCityAccessWindow(params);
                                            }
                                        });
                                    }
                                },
                                {
                                    key: 'stCnt',
                                    cap: '厂站数',
                                    sortable: false,
                                    formatter: function (value) {
                                        return jame({
                                            type: 'label',
                                            cap: value,
                                            styles: [
                                                Styles.css({
                                                    color: 'hsl(180, 100%, 41%)',
                                                    fontFamily: 'DIN',
                                                    fontSize: 's',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                })
                                            ],
                                            onclick: function (e) {
                                                let target = findCol(e.target);
                                                const regionId = target.col(11);
                                                const params = {
                                                    title: '厂站列表',
                                                    regionId: regionId,
                                                    channelStatus: '-1',
                                                    buildIf: 2
                                                };
                                                openSystemProgressCityAccessWindow(params);
                                            }
                                        });
                                    }
                                },
                                {
                                    key: 'cstCnt',
                                    cap: '接入厂站数',
                                    sortable: false,
                                    formatter: function (value) {
                                        return jame({
                                            type: 'label',
                                            cap: value,
                                            styles: [
                                                Styles.css({
                                                    color: 'hsl(180, 100%, 41%)',
                                                    fontFamily: 'DIN',
                                                    fontSize: 's',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                })
                                            ],
                                            onclick: function (e) {
                                                let target = findCol(e.target);
                                                const regionId = target.col(11);
                                                const params = {
                                                    title: '接入厂站列表',
                                                    regionId: regionId,
                                                    buildIf: 2,
                                                    channelStatus: 0
                                                };
                                                openSystemProgressCityAccessWindow(params);
                                            }
                                        });
                                    }
                                },
                                {
                                    key: 'czyCnt',
                                    cap: '主设备总数',
                                    sortable: false,
                                    formatter: function (value) {
                                        return jame({
                                            type: 'label',
                                            cap: value || 0,
                                            styles: [
                                                Styles.css({
                                                    color: 'hsl(156.3, 52.5%, 53.7%)',
                                                    fontFamily: 'DIN',
                                                    fontSize: 's',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                })
                                            ],
                                            onclick: function (e) {
                                                let target = findCol(e.target);
                                                const regionId = target.col(11);
                                                const params = {
                                                    title: '主设备列表',
                                                    regionId: regionId,
                                                    tableIdList: '-2',
                                                    buildIf: 3
                                                };
                                                openSystemProgressCityAccessWindow(params);
                                            }
                                        });
                                    }
                                },
                                {
                                    key: 'csecCnt',
                                    cap: '辅设备总数',
                                    sortable: false,
                                    formatter: function (value) {
                                        return jame({
                                            type: 'label',
                                            cap: value,
                                            styles: [
                                                Styles.css({
                                                    color: 'hsl(196.8, 74.9%, 67.3%)',
                                                    fontFamily: 'DIN',
                                                    fontSize: 's',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                })
                                            ],
                                            onclick: function (e) {
                                                let target = findCol(e.target);
                                                const regionId = target.col(11);
                                                const params = {
                                                    title: '辅设备列表',
                                                    regionId: regionId,
                                                    tableIdList: 13400,
                                                    buildIf: 4
                                                };
                                                openSystemProgressCityAccessWindow(params);
                                            }
                                        });
                                    }
                                },
                                {
                                    key: 'cyxCnt',
                                    cap: '主遥信总数',
                                    sortable: false,
                                    formatter: function (value) {
                                        return jame({
                                            type: 'label',
                                            cap: value,
                                            styles: [
                                                Styles.css({
                                                    color: 'hsl(156.3, 52.5%, 53.7%)',
                                                    fontFamily: 'DIN',
                                                    fontSize: 's',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                })
                                            ],
                                            onclick: function (e) {
                                                let target = findCol(e.target);
                                                const regionId = target.col(11);
                                                const params = {
                                                    title: '主遥信列表',
                                                    regionId: regionId,
                                                    tableIdList: 431,
                                                    buildIf: 5
                                                };
                                                openSystemProgressCityAccessWindow(params);
                                            }
                                        });
                                    }
                                },
                                {
                                    key: 'cyxAemCnt',
                                    cap: '辅遥信总数',
                                    sortable: false,
                                    formatter: function (value) {
                                        return jame({
                                            type: 'label',
                                            cap: value,
                                            styles: [
                                                Styles.css({
                                                    color: 'hsl(156.3, 52.5%, 53.7%)',
                                                    fontFamily: 'DIN',
                                                    fontSize: 's',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                })
                                            ],
                                            onclick: function (e) {
                                                let target = findCol(e.target);
                                                const regionId = target.col(11);
                                                const params = {
                                                    title: '辅遥信列表',
                                                    regionId: regionId,
                                                    tableIdList: '13401,13406',
                                                    buildIf: 6
                                                };
                                                openSystemProgressCityAccessWindow(params);
                                            }
                                        });
                                    }
                                },
                                {
                                    key: 'cycCnt',
                                    cap: '主遥测总数',
                                    sortable: false,
                                    formatter: function (value) {
                                        return jame({
                                            type: 'label',
                                            cap: value,
                                            styles: [
                                                Styles.css({
                                                    color: 'hsl(196.8, 74.9%, 67.3%)',
                                                    fontFamily: 'DIN',
                                                    fontSize: 's',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                })
                                            ],
                                            onclick: function (e) {
                                                let target = findCol(e.target);
                                                const regionId = target.col(11);
                                                const params = {
                                                    title: '主遥测列表',
                                                    regionId: regionId,
                                                    tableIdList: 432,
                                                    buildIf: 7
                                                };
                                                openSystemProgressCityAccessWindow(params);
                                            }
                                        });
                                    }
                                },
                                {
                                    key: 'cycAemCnt',
                                    cap: '辅遥测总数',
                                    sortable: false,
                                    formatter: function (value) {
                                        return jame({
                                            type: 'label',
                                            cap: value,
                                            styles: [
                                                Styles.css({
                                                    color: 'hsl(196.8, 74.9%, 67.3%)',
                                                    fontFamily: 'DIN',
                                                    fontSize: 's',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                })
                                            ],
                                            onclick: function (e) {
                                                let target = findCol(e.target);
                                                const regionId = target.col(11);
                                                const params = { title: '辅遥测列表', regionId, tableIdList: '13402,13407', buildIf: 8 };
                                                openSystemProgressCityAccessWindow(params);
                                            }
                                        });
                                    }
                                },
                                {
                                    key: 'doubleCnt',
                                    cap: '双通道百分比',
                                    sortable: false,
                                    show: false,
                                    formatter: function (value) {
                                        return jame({
                                            type: 'label',
                                            cap: value,
                                            styles: [
                                                Styles.css({
                                                    color: 'hsl(196.8, 74.9%, 67.3%)',
                                                    fontFamily: 'DIN',
                                                    fontSize: 's'
                                                })
                                            ]
                                        });
                                    }
                                },
                                {
                                    key: 'regionId',
                                    show: false
                                }
                            ]
                        })
                    ]
                }
            ]
        }
    ],
    vars: {
        typeId: deviceTypeIds[0],
        isTest,
        cols: [],
        numberTableData: [],
        defectRecordData: [],
        data: {
            chartData: []
        }
    },
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        getRegionList(_model);
        getTableData();
        getGeneralStatisticsData();
    }
};

function getGeneralStatisticsData() {
    ajaxCall(
        'getGeneralStatisticsData',
        {
            success(data) {
                const regionId = _model.vars.regionId;
                const statistics = (data || []).map(buildRegionStatistics);
                const tableData = statistics.map(({ tableRow }) => tableRow).filter((item) => !regionId || item.regionId == regionId);

                _msgr.pub('defectRecordData', tableData);
                _model.vars.data.chartData = [['地区', '变电站接入率', '通道故障率'], ...statistics.map(({ chartRow }) => chartRow)];
            },
            params: {},
            useMock: false,
            type: 'get'
        },
        false
    );
}

function buildRegionStatistics(item) {
    const summary = summarizeRegion(item.valList);
    const accessRate = summary.totalNum ? Number(((summary.singleNum / summary.totalNum) * 100).toFixed(2)) : 0;
    const metric = (name) => summary.metrics.get(name) || 0;

    return {
        tableRow: {
            regionId: item.regionId,
            regionName: item.regionName,
            ywbCnt: metric(STAT_NAMES.operationTeam),
            stCnt: summary.totalNum,
            cstCnt: summary.singleNum,
            cyxCnt: metric(STAT_NAMES.mainSignal),
            cycCnt: metric(STAT_NAMES.mainTelemetry),
            cykCnt: 0,
            czyCnt: metric(STAT_NAMES.mainDevice),
            csecCnt: metric(STAT_NAMES.auxiliaryDevice),
            cyxAemCnt: metric(STAT_NAMES.auxiliarySignal),
            cycAemCnt: metric(STAT_NAMES.auxiliaryTelemetry),
            cykAemCnt: 0,
            doubleCnt: metric(STAT_NAMES.doubleChannel),
            singleCnt: metric(STAT_NAMES.singleChannel)
        },
        chartRow: [item.regionName, accessRate, metric(STAT_NAMES.offlineChannel)]
    };
}

function summarizeRegion(valList = []) {
    const values = Array.isArray(valList) ? valList : [];
    return values.reduce(
        (summary, { statName = '', resultVal = 0 }) => {
            summary.metrics.set(statName, (summary.metrics.get(statName) || 0) + resultVal);
            if (statName.includes('kV接入数量_四区统计')) {
                summary.singleNum += resultVal;
            } else if (statName.includes('kV总数_四区统计')) {
                summary.totalNum += resultVal;
            }
            return summary;
        },
        { metrics: new Map(), singleNum: 0, totalNum: 0 }
    );
}

function getTableData() {
    ajaxCall(
        'getDevScale',
        {
            success(res) {
                deviceScaleData = res;
                handleTableData(deviceList[0].value);
            },
            params: {
                devTypeList: deviceTypeIds,
                groupType: 4
            },
            useMock: false,
            type: 'post'
        },
        false
    );
}

function handleTableData(name) {
    const selectedDevice = deviceScaleData?.find((item) => item.devType === name);
    const regionBvList = selectedDevice?.regionBvList || [];
    const cols = [
        {
            key: 'name',
            cap: '电压等级',
            width: '113.5rem',
            sortable: false
        },
        {
            key: 'totalCnt',
            cap: '合计',
            sortable: false
        },
        ...regionBvList.map(({ regionName }) => ({
            key: regionName,
            cap: regionName,
            sortable: false
        }))
    ];
    const tableData = (regionBvList[0]?.bvList || []).map(({ bvName }, index) => {
        const row = { name: bvName };
        regionBvList.forEach(({ regionId, regionName, bvList }) => {
            const item = bvList[index];
            if (item) {
                row[regionName] = `${item.totalCnt}_${regionId}`;
            }
        });
        const total = Object.values(row).reduce((sum, value) => sum + getCellCount(value), 0);
        row.totalCnt = `${total}_${bvName}`;
        return row;
    });

    _model.vars.cols = cols;
    _model.vars.numberTableData = tableData;
}

function getCellCount(value) {
    if (typeof value !== 'string' || !value.includes('_')) return 0;
    return parseInt(value.split('_')[0], 10) || 0;
}

function openSystemProgressCityAccessWindow(params) {
    jam.renderModal('#main', systemProgressCityAccessWindow(params));
    // createWindow({
    //     title: params.title,
    //     body: systemProgressCityAccessWindow(params),
    //     width: '88vw',
    //     height: '68vh',
    //     showBtn: false
    // });
}

function parseValueToVariables(value) {
    const parts = value.split('_');
    const regionId = parts[1];
    return regionId && !regionId.includes('kV') ? regionId : '';
}
