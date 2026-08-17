import { urlConfig, userInfo } from '../global.js';
import { ajaxCall, findCol, exportExcel } from '../common.js';
import { powerOutageEchartsOption } from '../components/chartConfig/powerOutageOption.js';
import { createWindow } from '../components/createWindow.js';
import powerOutageWindow from '../components/modal/powerOutageWindow.js';
import { disableRegionOptionByUnicode } from './equipmentEarlyWarningStatistics.mjs';
let _model = null;
let _msgr = null;
export default {
    type: 'wrapper',
    class: 'power-outage-statistics',
    styles: [
        'size.fullsize',
        Styles.stylesheet({
            ':scope': {
                padding: 'm',
                'box-sizing': 'border-box'
            },
            '.form-box': {
                display: 'flex',
                'flex-direction': 'column',
                justifyContent: 'space-around'
            },
            '.chart-box': {
                display: 'flex',
                'flex-direction': 'column'
            },
            '.chart-pie': {
                width: '100%',
                height: 'calc(100% - 2.5rem)',
                'margin-top': '1.5rem'
            },
            '.table-box': {
                display: 'flex',
                'flex-direction': 'column'
            },
            '.btn': {
                minWidth: '5rem',
                marginTop: '0.23rem !important'
            }
        }),
        Styles.layout.grid({ cols: 16, rows: 10, gap: `0.5rem` })
    ],
    components: [
        {
            type: 'wrapper',
            class: 'form-box',
            styles: [Styles.layout.gridpos(1, 1, 10, 3)],
            components: [
                {
                    type: 'wrapper',
                    class: 'form-item',
                    components: [
                        {
                            type: 'buttongroup-radio',
                            icon: 'earth-asia',
                            cap: '区域选择',
                            value: '{{regionId}}',
                            dataWatcher: 'regionList',
                            onafterrender: function () {
                                if (userInfo.unicode) {
                                    const buttonggroupEle = this.cmpt.element;
                                    disableRegionOptionByUnicode(userInfo.unicode, buttonggroupEle);
                                }
                            },

                            styles: [Styles.buttongroupWithCapInTop, Styles.size.fullwidth]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    childStyles: ['margin(right:0.5rem)'],
                    switchStyles: ['input.text(size:0.58rem)', 'switch.padding(top:1rem)'],
                    class: 'form-item',
                    components: [
                        {
                            type: 'buttongroup-checkbox',
                            cap: '电压等级',
                            styles: [Styles.buttongroupWithCapInTop, Styles.size({ minWidth: '10rem' })],
                            icon: 'bolt',
                            defaultValue: [],
                            valueKey: 'bvId',
                            dataWatcher: 'bvList'
                        },
                        {
                            type: 'switch',
                            cap: '是否过滤开关变位',
                            defaultValue: true,
                            valueKey: 'filterBw'
                        },
                        {
                            type: 'switch',
                            cap: '是否过滤告警',
                            defaultValue: true,
                            valueKey: 'filterWarn'
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'form-item',
                    childStyles: ['margin(right:0.5rem)'],
                    components: [
                        {
                            type: 'datepicker',
                            valueKey: 'beginTime',
                            defaultValue: moment().format('YYYY-MM-DD'),
                            cap: '开始时间：',
                            styles: [Styles.datepicker.regularStyle]
                        },
                        {
                            type: 'datepicker',
                            valueKey: 'endTime',
                            defaultValue: moment().format('YYYY-MM-DD'),
                            cap: '结束时间：',
                            styles: [Styles.datepicker.regularStyle]
                        }
                        // {
                        //     type: 'select',
                        //     valueKey: 'stId',
                        //     dataWatcher: 'stList',
                        //     styles: [Styles.select.regularStyle],
                        //     cap: '厂站'
                        // },
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'form-item',
                    childStyles: ['margin(right:0.5rem)'],
                    switchStyles: ['input.text(size:0.58rem)'],
                    buttonStyles: [Styles.searchBtnsStyles],
                    components: [
                        {
                            type: 'filterSelect',
                            class: 'unifycap',
                            styles: [Styles.input.regularStyle],
                            props: { cap: '厂站：', data: '{{stList}}', search: '{{name}}', select: '{{stId}}' },
                            watchers: {
                                async name(val) {
                                    if (val.length == 0) _msgr.pub('stId', '');
                                    getSubstationList(val);
                                }
                            }
                        },
                        {
                            type: 'switch',
                            cap: '是否导出失电详情',
                            defaultValue: false,
                            valueKey: 'exportDetail'
                        },
                        {
                            type: 'button',
                            icon: 'magnifying-glass',
                            class: 'btn jam-cta',
                            cap: '查询',
                            onclick: function () {
                                getEchartsData();
                                getPowerOutageTableData();
                            }
                        },
                        {
                            type: 'button',
                            class: 'btn export-btn',
                            icon: 'file-export',
                            cap: '导出',
                            onclick: function () {
                                exportPowerOutageData();
                            }
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'chart-box',
            styles: [Styles.layout.gridpos(11, 1, 6, 3)],
            components: [
                {
                    type: 'label',
                    class: 'title',
                    cap: '母线失电',
                    styles: [Styles.titleLabel]
                },
                {
                    type: 'wrapper',
                    class: 'chart-pie'
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'table-box',
            styles: [Styles.layout.gridpos(1, 4, 16, 7)],
            components: [
                {
                    type: 'table',
                    styles: [Styles.table.regularStyle, Styles.table.showrownum({ style: 'plain' }), Styles.size({ width: '100%', height: 'calc(100% - 1rem)' })],
                    dataWatcher: 'powerOutageData',
                    dataDef: [
                        {
                            cap: '设备id',
                            key: 'devId',
                            show: false
                        },
                        {
                            cap: '区域',
                            key: 'regionName',
                            sortable: false
                        },
                        {
                            cap: '变电站',
                            key: 'stName',
                            sortable: false
                        },
                        {
                            cap: '设备名称',
                            key: 'devName',
                            sortable: false
                        },
                        {
                            cap: '电压等级',
                            key: 'bvName',
                            sortable: false
                        },
                        {
                            cap: '失电次数',
                            key: 'count',
                            sortable: false,
                            formatter: function (value) {
                                return `<span style="color:#00C2FF;font-weight:bold;text-decoration: underline;cursor: pointer">${value}</span>`;
                            },
                            onclick: function (e) {
                                let target = findCol(e.target);
                                const devId = target.col(0);
                                const devName = target.col(2) || '';
                                getDetailTableData(devId, devName);
                            }
                        }
                    ]
                },
                {
                    type: 'pager',
                    props: {
                        pageSizeList: [
                            {
                                value: '100',
                                name: '100条/页'
                            },
                            {
                                value: '10',
                                name: '10条/页'
                            },
                            {
                                value: '50',
                                name: '50条/页'
                            }
                        ],
                        total: 'powerOutage_pager_total',
                        messageKey: 'powerOutage_pager'
                    },
                    watchers: [
                        {
                            key: 'powerOutage_pager',
                            callback: function (page) {
                                if (page?.firstFetch) return;
                                getPowerOutageTableData(page);
                            }
                        }
                    ]
                }
            ]
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
        _model.regionId = userInfo.unicode || null;
    },
    onafterrender: async function () {
        await initFormData();
        await getPowerOutageTableData();
        await getEchartsData();
    }
};

function initFormData() {
    getRegionList();
    getOverloadStaticsBvList();
    getSubstationList();
}

/**
 * 获取区域列表
 */
async function getRegionList() {
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
async function getOverloadStaticsBvList() {
    ajaxCall(
        'getOverloadStaticsBvList',
        {
            success(data) {
                const excludeBvList = ['1000kV'];
                const bvList = data
                    .filter((item) => !excludeBvList.includes(item.bvName))
                    .map((item) => {
                        return { name: item.bvName, value: item.bvId };
                    });
                const defaultBvList = bvList.map((item) => {
                    return item.value;
                });
                _msgr.pub('bvId', defaultBvList);
                _msgr.pub('bvList', [...bvList]);
            },
            params: {},
            useMock: false,
            type: 'get'
        },
        false
    );
}

/**
 * 获取变电站列表
 */
async function getSubstationList(devName = '') {
    ajaxCall(
        'getSubstationList',
        {
            success(data) {
                _model.vars.stList = data?.map((item) => ({ name: item.devName, value: item.devId }));
            },
            params: {
                count: 100,
                devName: devName,
                devType: ['substation']
            },
            useMock: false,
            type: 'post',
            uniqId: `getSubstationList_${Math.random(1, 1000000)}`
        },
        false
    );
}

/**
 * 获取母线失电统计图表数据
 */
async function getEchartsData() {
    const _p = getParams();
    delete _p.regionId;
    delete _p.stId;

    ajaxCall(
        'getBusPowerLossRegionStatistics',
        {
            success(data) {
                const eCharts = echarts.init(document.querySelector('.chart-pie'));
                eCharts.setOption(powerOutageEchartsOption(data));
            },
            params: {
                ..._p
            },
            useMock: false,
            type: 'post'
        },
        false
    );
}

function getParams() {
    console.log(1111, _msgr.get('bvId'));
    let bvIdList = _msgr.get('bvId');
    const regionId = _model.regionId;
    if (_msgr.get('bvId').length <= 1 && _msgr.get('bvId')[0] == '') {
        bvIdList = undefined;
    }
    return {
        beginTime: _msgr.get('beginTime') + ' 00:00:00',
        // beginTime: '2021-01-01 00:00:00',
        endTime: _msgr.get('endTime') + ' 23:59:59',
        regionId,
        stId: _msgr.get('stId'),
        bvIdList,
        filterBw: _msgr.get('filterBw'),
        filterWarn: _msgr.get('filterWarn')
    };
}

/**
 * 获取表格数据
 */
async function getPowerOutageTableData(page = null) {
    if (!page) {
        page = {
            pageIndex: 1,
            pageSize: 100
        };
    } else {
        page = {
            pageIndex: page.pageNumber,
            pageSize: page.pageSize
        };
    }

    const _p = {
        ...getParams(),
        ...page
    };

    ajaxCall(
        'queryBusPowerLossStatistics',
        {
            success(data) {
                _msgr.pub('powerOutageData', data?.list);
                _msgr.pub('powerOutage_pager_total', data?.pojoTotalCount);
            },
            params: {
                ..._p
            },
            useMock: false,
            type: 'post'
        },
        false
    );
}

/**
 * 获取失电详情数据
 */
async function getDetailTableData(devId, devName) {
    const _p = {
        devId,
        ...getParams()
    };
    delete _p.regionId;
    delete _p.stId;

    createWindow({
        title: devName + '-失电详情数据',
        width: '60vw',
        height: '70vh',
        body: powerOutageWindow(_p, devName),
        showBtn: false,
        movable: false
    });
}

/**
 * data export
 */
function exportPowerOutageData() {
    exportExcel(
        urlConfig.exportBusPowerLoss.url,
        {
            ...getParams(),
            exportDetail: _msgr.get('exportDetail')
        },
        '母线失电统计数据.xlsx',
        'POST'
    );
}
