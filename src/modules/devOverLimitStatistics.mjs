import regionSelect from './registerCards/select/regionSelect.mjs';
import bvListSelect from './registerCards/select/bvListSelect.mjs';
import dateRangePicker from './registerCards/dateRange/dateRangePicker.mjs';
import stationSelect from './registerCards/select/stationSelect.mjs';
import searchBtns from './registerCards/buttons/searchBtns.mjs';
import { formatterJameBv, getDetailConf } from '../common.js';
import { buildTable } from '../components/componentBuilder.js';
import { urlConfig, mockPath } from '../global.js';
import devOverLimitWindow from '../components/modal/devOverLimitWindow.js';
const devTypeList = getDetailConf('devTypeList') || [];
console.log('devTypeList', devTypeList);
const overLimitTypeList = [
    {
        name: '电压越限',
        value: '电压'
    },
    {
        name: '电流越限',
        value: '电流'
    }
];
const colorSet = ['rgba(14,129,128,1)', 'rgba(208,104,76,1)', 'rgba(221,116,158,1)', 'rgba(227,195,99,1)', 'rgba(0,110,162,1)', 'rgba(109,199,234,1)', 'rgba(47,188,255,1)', 'rgba(75,199,150,1)', 'rgba(144,97,215,1)', 'rgba(92,112,144,1)', 'rgba(59,134,255,1)', 'rgba(255,71,87,1)', 'rgba(250,250,140,1)'];
let _msgr, _model, _this;
export default {
    type: 'wrapper',
    broker: 'devOverLimit',
    styles: [
        'css(--gap:.75rem)',
        'padding(var(--gap))',
        'padding(bottom:0)',
        'layout(overflow:hidden auto)',
        'size.fullsize',
        Styles.css({
            display: 'grid',
            'grid-template-columns': `repeat(2, 1fr)`,
            'grid-template-rows': `repeat(10, 1fr)`
        }),
        Styles.stylesheet({
            '.dateRangePicker': {
                marginTop: 'm',
                marginBottom: 'm',
                width: '100%'
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            styles: [
                'layout.flex(justifyContent:flex-start;alignItems:center;)',
                'cap.hide',
                'icon.hide',
                Styles.stylesheet({
                    '.search-btn,.export-btn': {
                        height: '1.8rem',
                        boxSizing: 'content-box'
                    }
                }),
                Styles.layout.gridpos([1, 1, 1, 3])
            ],
            buttonStyles: [Styles.searchBtnsStyles],
            descStyles: [Styles.icon.solid],
            components: [
                regionSelect,
                { ...bvListSelect, class: 'bvListSelect' },
                {
                    type: 'buttongroup-radio',
                    cap: '越限类型',
                    styles: [Styles.buttonGroupStylesWithBgCap, 'margin(left:.75rem)'],
                    value: '{{overLimitType}}',
                    data: overLimitTypeList
                },

                { ...dateRangePicker, class: 'dateRangePicker' },
                stationSelect,
                {
                    type: 'select',
                    cap: '设备类型：',
                    icon: 'comment',
                    styles: [Styles.select.regularStyle],
                    value: '{{tableId}}',
                    data: devTypeList
                },
                searchBtns
            ]
        },
        {
            type: 'wrapper',
            styles: [
                'layout(overflow:hidden;position:relative;)',
                'layout.flex(alignItems:center;justifyContent:flex-start;alignContent:center)',
                Styles.stylesheet({
                    '.jam-cc-type-chart.jam-cc-legend-on-right .jam-cc-legend-wrapper': {
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        flex: 1,
                        justifyContent: 'flex-start',
                        '.jam-cc-legend': {
                            width: 'calc((100% - 9rem)/4)',
                            marginRight: 'l',
                            cursor: 'pointer'
                        },
                        '.jam-cc-legend:nth-child(4n)': {
                            marginRight: 0
                        }
                    },
                    '.value .jam-major-value': {
                        cursor: 'pointer'
                    }
                }),
                Styles.layout.gridpos([2, 1, 1, 3])
            ],
            components: [
                {
                    type: 'pieWithScale',
                    ref: 'telemetryOverLimitPie',
                    props: {
                        title: '总计',
                        unit: '个',
                        dataType: 'analog',
                        valueType: 'number',
                        decimalPos: 2,
                        toFixed: false,
                        hasTags: false,
                        data: '{{telemetryOverLimitData}}'
                    },
                    vars: {
                        telemetryOverLimitData: {}
                    },
                    styles: ['pieWithScale.basic', 'size(width:100%;height:100%;)'],
                    onafterrender: async function () {
                        const _chart = jam.findElement(this.element, 'jam-chart');
                        await _chart.chartReady;
                        _chart.chart.on('click', (params) => {
                            const _regionList = _model.vars.regionList || [];
                            const _regionId = _regionList.find((item) => item.name == params.name)?.value || '';
                            if (_regionId) {
                                if (_regionId == _model.vars.regionId) {
                                    _model.vars.regionId = null;
                                } else {
                                    _model.vars.regionId = _regionId;
                                }
                            } else {
                                return;
                            }
                            _this.msgr('page').pub('_t', Date.now());
                        });
                    },
                    onclick: (e) => {
                        const _regionList = _model.vars.regionList || [];
                        let _el = jam.closest(e.target, '.jam-cc-legend');
                        let _elTotal = jam.closest(e.target, '.value .jam-major-value');
                        if (_elTotal) {
                            _model.vars.regionId = null;
                        }
                        if (_el) {
                            const _regionId = _regionList.find((item) => item.name == _el.cap)?.value || '';
                            if (_regionId) {
                                if (_regionId == _model.vars.regionId) {
                                    _model.vars.regionId = null;
                                } else {
                                    _model.vars.regionId = _regionId;
                                }
                            } else {
                                return;
                            }
                        }
                        _this.msgr('page').pub('_t', Date.now());
                    }
                }
            ]
        },
        {
            type: 'wrapper',
            styles: [Styles.layout.gridpos([1, 4, 2, 7])],
            components: [
                buildTable({
                    cap: '遥测越限统计-表格',
                    icon: 'table',
                    dataDef: [
                        { show: false, key: 'devId' },
                        { show: false, key: 'stId' },
                        {
                            cap: '地区',
                            key: 'regionName',
                            sortable: false
                        },
                        {
                            cap: '变电站',
                            key: 'stName',
                            align: 'left',
                            class: 'r-st item-content',
                            sortable: false,
                            attrs: jaml.res(function () {
                                return { 'data-id': this.col(1) };
                            })
                        },
                        {
                            cap: '电压等级',
                            key: 'bvName',
                            sortable: false,
                            formatter: formatterJameBv
                        },
                        {
                            cap: '设备名称',
                            key: 'devName',
                            align: 'left',
                            class: 'item-content',
                            sortable: false
                        },
                        {
                            cap: '总次数',
                            styles: ['css(text-decoration:underline;text-underline-offset:0.2rem;cursor:pointer;)'],
                            key: 'total',
                            onclick(params) {
                                const devId = this.col(0);
                                const _params = getParams();
                                _params.devId = devId;
                                jam.renderModal('#main', devOverLimitWindow(_params));
                            },
                            sortable: false
                        },
                        {
                            cap: '越上限1总数',
                            styles: ['css(text-decoration:underline;text-underline-offset:0.2rem;cursor:pointer;)'],
                            key: 'upLimit1',
                            onclick(params) {
                                const devId = this.col(0);
                                const _params = getParams();
                                _params.devId = devId;
                                _params.limitType = 1;
                                jam.renderModal('#main', devOverLimitWindow(_params));
                            },
                            sortable: false
                        },
                        {
                            cap: '越下限1总数',
                            styles: ['css(text-decoration:underline;text-underline-offset:0.2rem;cursor:pointer;)'],
                            key: 'downLimit1',
                            onclick(params) {
                                const devId = this.col(0);
                                const _params = getParams();
                                _params.devId = devId;
                                _params.limitType = 2;
                                jam.renderModal('#main', devOverLimitWindow(_params));
                            },
                            sortable: false
                        },
                        {
                            cap: '越上限2总数',
                            styles: ['css(text-decoration:underline;text-underline-offset:0.2rem;cursor:pointer;)'],
                            key: 'upLimit2',
                            onclick(params) {
                                const devId = this.col(0);
                                const _params = getParams();
                                _params.devId = devId;
                                _params.limitType = 3;
                                jam.renderModal('#main', devOverLimitWindow(_params));
                            },
                            sortable: false
                        },
                        {
                            cap: '越下限2总数',
                            styles: ['css(text-decoration:underline;text-underline-offset:0.2rem;cursor:pointer;)'],
                            key: 'downLimit2',
                            onclick(params) {
                                const devId = this.col(0);
                                const _params = getParams();
                                _params.devId = devId;
                                _params.limitType = 4;
                                jam.renderModal('#main', devOverLimitWindow(_params));
                            },
                            sortable: false
                        },
                        {
                            cap: '运维班名称',
                            key: 'groupName',
                            sortable: false
                        }
                    ],
                    getReqParams: function () {
                        const _params = getParams();
                        return {
                            method: 'post',
                            data: {
                                pageIndex: this.model.cpageNo || 1,
                                pageSize: this.model.cpageSize || 20,
                                ..._params
                            },
                            url: urlConfig.getOverLimitDevStatics.url,
                            mock: mockPath + urlConfig.getOverLimitDevStatics.mock,
                            transform: (res) => {
                                const { list = [], pojoTotalCount = 0 } = res?.data || {};
                                this.model.ctotal = pojoTotalCount;
                                return list;
                            }
                        };
                    },
                    exportUrl: 'exportOverLimitDevStatics'
                })
            ]
        }
    ],
    watchers: [
        {
            key: '_t',
            callback: async function (value) {
                if (!value) return;
                initChart();
            }
        }
    ],
    onmount() {
        _model = this.model;
        _msgr = this.model.msgr;
        _this = this;
    },
    vars: {
        tableId: ' ',
        overLimitType: '电压',
        bvId: null,
        regionId: null,
        stId: ''
    }
};

function initChart() {
    const _params = getParams();
    delete _params.bvId;
    delete _params.regionId;
    delete _params.stId;

    jam.ajaxCall({
        urlKey: 'getOverLimitRegionStatics',
        data: _params,
        method: 'post',
        onsuccess(result) {
            const { data } = result;
            const chartData = [['区域', '数量']];
            let totalCnt = 0;
            data.forEach((item) => {
                totalCnt += Number(item.total);
                chartData.push([item.regionName, item.total]);
            });

            _this.ref('telemetryOverLimitPie').vars.telemetryOverLimitData = {
                chartData: chartData,
                value: totalCnt
            };
        }
    });
}

function getParams() {
    const tableId = _model.vars.tableId;
    const keyName = _model.vars.overLimitType;
    const bvId = _model.vars.bvId;
    const regionId = _model.vars.regionId;
    const stId = _model.vars.stId;
    const beginDate = _model.vars.beginDate ? _model.vars.beginDate + ' 00:00:00' : undefined;
    const endDate = _model.vars.endDate ? _model.vars.endDate + ' 23:59:59' : undefined;
    return {
        tableId,
        keyName,
        bvId,
        regionId,
        stId,
        beginDate,
        endDate
    };
}
