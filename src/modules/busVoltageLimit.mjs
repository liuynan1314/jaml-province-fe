// import '../css/bus-voltage-limit.scss';
import { urlConfig } from '../global.js';
import { ajaxCall, exportExcel } from '../common.js';
import { setBusVolageLimitBarEcharts, setPieEchartsData } from '../components/chartConfig/busVoltageLimitOptions.js';
let _model = null,
    _msgr = null;
let beginRate = null,
    endRate = null;
export default {
    type: 'wrapper',
    class: 'bus-voltage-limit',
    styles: [
        'size.fullsize',
        'props(display:flex;flexWrap:wrap;justifyContent:space-between)',
        Styles.stylesheet({
            ':root': {
                '--1000kV-clr': '#fd7783',
                '--500kV-clr': 'rgb(96, 127, 229)',
                '--220kV-clr': 'rgb(255, 0, 0)',
                '--110kV-clr': 'rgb(72, 194, 255)',
                '--35kV-clr': 'rgb(90, 146, 70)',
                '--20kV-clr': '#D57F7B',
                '--10kV-clr': '#f6c81e'
            },
            '.bus-voltage-limit': {
                width: '100%',
                height: '100%',
                padding: 's',
                display: 'flex',
                'flex-wrap': 'wrap',
                'justify-content': 'space-between'
            },
            '.echarts-wrapper': {
                width: '33%',
                height: '55%',
                display: 'flex',
                padding: 's',
                'flex-direction': 'column',
                '.barCharts-box': {
                    width: '100%',
                    height: '100%'
                },
                '.icon-download': {
                    position: 'absolute',
                    right: '0.5rem',
                    top: '0.5rem',
                    cursor: 'pointer',
                    'z-index': '1'
                }
            },
            // '.limit-title': {
            //     height: '1rem !important',
            //     'font-family': "'YouSheBiaoTiHei', serif",
            //     'font-size': '1.375rem',
            //     'font-weight': '200',
            //     'font-style': 'italic',
            //     'padding-left': '2rem'
            // },
            '.limit-title': {
                'span[slot=cap]': {
                    display: 'block',
                    minWidth: '13.2rem',
                    height: '2.25rem',
                    color: 'var(--jam-color-fg-default)',
                    backgroundImage: 'url(./../assets/images/new/title_level.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'bottom .625rem left',
                    'padding-left': '1.5rem',
                    backgroundSize: 'auto 1.875rem'
                }
            },
            '.chart-box': {
                width: '100%',
                height: 'calc(100% - 1rem)',
                display: 'flex',
                'flex-wrap': 'wrap',
                border: 's solid var(--jam-color-outline-muted)',
                position: 'relative'
            },
            '.pieCharts-box': {
                width: '50%',
                height: '100%'
            },
            '.pie-legend': {
                width: '50%',
                height: '100%'
            },
            '.column-flex': {
                display: 'flex',
                'flex-direction': 'column'
            },
            '.pie-legend > ul': {
                height: '100%',
                'justify-content': 'center',
                gap: 'xs',
                'list-style': 'none'
            },
            '.pie-legend > ul > li': {
                position: 'relative',
                'padding-left': '2rem',
                height: '1.625rem',
                'line-height': '1.625rem',
                'background-image': 'url(../../assets/images/pie_lenged_bg.png)',
                'background-position': '0 center',
                'text-wrap': 'nowrap',
                backgroundRepeat: 'no-repeat'
            },
            '.pie-legend > ul > li::before': {
                display: 'inline-block',
                content: '',
                width: '0.675rem',
                height: '0.675rem',
                'background-color': 'var(--li-clr)',
                position: 'absolute',
                left: '0.85rem',
                top: '0.475rem'
            },
            '.pie-legend > ul > li > span': {
                display: 'inline-block',
                'min-width': '5ch',
                color: ' var(--li-clr)'
            },
            '.pie-legend > ul > li > span:first-child': {
                color: 'var(--jam-color-fg-default)',
                width: '7ch'
            },
            '.staicesItem': {
                width: '50%',
                height: '50%'
            },
            '.staticsIndicator': {
                width: '100%',
                height: '100%',
                display: 'flex',
                cursor: 'pointer',
                'justify-content': 'flex-start',
                'align-items': 'center'
            },
            ".staticsIndicator span[slot='cap']": {
                display: 'flex',
                'justify-content': 'center',
                width: '50%',
                height: '100%',
                'font-size': '1rem',
                'text-align': 'center',
                background: 'url(../../assets/images/text-bg.png) no-repeat',
                'background-position': 'center 60%'
            },
            ".staticsIndicator span[slot='value']": {
                display: 'flex',
                'justify-content': 'center',
                width: '50%',
                height: '100%',
                'text-align': 'center',
                'align-items': 'center',
                background: 'url(../../assets/images/base.png) no-repeat',
                'font-size': '2.25rem',
                'font-family': 'DIN-Bold',
                'background-position': 'center 60%'
            },
            '.table_box': {
                width: '100%',
                height: '45%',
                display: 'flex',
                'flex-wrap': 'wrap'
            },
            '.form-item': {
                // width: '50%',
                width: 'auto',
                height: '25%',
                display: 'flex',
                'flex-wrap': 'wrap',
                'align-items': 'flex-start',
                marginRight: 'l'
            },
            '.bvItem': {
                // width: '25%'
                width: 'auto'
            },
            '.stItem': {
                width: 'auto',
                // height: '4.2rem',
                height: '1.875rem',
                marginTop: '2.725rem',
                'align-items': 'center'
            },
            '.select_style': {
                width: '5rem'
            },
            '.longArea': {
                width: '100%'
            },
            '.table-item': {
                width: '100%',
                height: '75%',
                display: 'flex',
                'flex-direction': 'column'
            },
            ".table-item span[slot='cap']": {
                'font-size': '1rem'
            }
        })
    ],

    components: [
        {
            type: 'wrapper',
            class: 'echarts-wrapper',
            components: [
                {
                    type: 'label',
                    class: 'limit-title',
                    cap: '母线越限实时(地区)'
                },
                {
                    type: 'wrapper',
                    class: 'chart-box',
                    components: [
                        {
                            type: 'wrapper',
                            icon: 'download',
                            class: 'icon-download',
                            onclick: function () {
                                exportBarChartToExcel();
                            }
                        },
                        {
                            type: 'wrapper',
                            class: 'barCharts-box'
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'echarts-wrapper',
            components: [
                {
                    type: 'label',
                    class: 'limit-title',
                    cap: '母线越限实时(电压等级)'
                },
                {
                    type: 'wrapper',
                    class: 'chart-box',
                    components: [
                        {
                            type: 'wrapper',
                            icon: 'download',
                            class: 'icon-download',
                            onclick: function () {
                                exportPieChartToExcel();
                            }
                        },
                        {
                            type: 'wrapper',
                            class: 'pieCharts-box'
                        },
                        {
                            type: 'wrapper',
                            class: 'pie-legend'
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'echarts-wrapper',
            components: [
                {
                    type: 'label',
                    class: 'limit-title',
                    // cap: '母线越限实时'
                    cap: '母线越限率'
                },
                {
                    type: 'wrapper',
                    class: 'chart-box',
                    components: [
                        {
                            type: 'wrapper',
                            class: 'staicesItem',
                            buildFor: `(item) in staticsList`,
                            components: [
                                {
                                    type: 'indicator',
                                    class: 'staticsIndicator',
                                    cap: '{{item.name}}',
                                    value: '{{item.value}}',
                                    onclick: function () {
                                        console.log(this.cap);
                                        if (this.cap == '10%及以下') {
                                            if (beginRate == 0 && endRate == 10) {
                                                beginRate = null;
                                                endRate = null;
                                            } else {
                                                beginRate = 0;
                                                endRate = 10;
                                            }
                                        } else if (this.cap == '10%-20%') {
                                            if (beginRate == 10 && endRate == 20) {
                                                beginRate = null;
                                                endRate = null;
                                            } else {
                                                beginRate = 10;
                                                endRate = 20;
                                            }
                                        } else if (this.cap == '20%-50%') {
                                            if (beginRate == 20 && endRate == 50) {
                                                beginRate = null;
                                                endRate = null;
                                            } else {
                                                beginRate = 20;
                                                endRate = 50;
                                            }
                                        } else if (this.cap == '50%以上') {
                                            if (beginRate == 50 && endRate == 100) {
                                                beginRate = null;
                                                endRate = null;
                                            } else {
                                                beginRate = 50;
                                                endRate = 999999;
                                            }
                                        }
                                        getTableData();
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
            class: 'table_box',
            components: [
                {
                    type: 'wrapper',
                    class: 'form-item',
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '区域选择',
                            icon: 'earth-asia',
                            defaultValue: null,
                            valueKey: 'regionId',
                            dataWatcher: 'regionList',
                            styles: [Styles.buttonGroupStylesWithBgCap]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'form-item bvItem',
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '电压等级',
                            icon: 'bolt',
                            styles: [Styles.buttonGroupStylesWithBgCap],
                            class: 'longArea',
                            defaultValue: null,
                            valueKey: 'bvId',
                            dataWatcher: 'bvList'
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'form-item stItem',
                    buttonStyles: [Styles.searchBtnsStyles],
                    components: [
                        {
                            type: 'filterSelect',
                            styles: ['size(maxWidth:11.5rem)', 'padding(top:0;bottom:0)'],
                            childStyles: ['size(minWidth:11.5rem)', 'input.agent.border(radius:.25rem)', 'input.labelslot.margin(0)', 'padding(0)'],
                            valueKey: 'stId',
                            props: { cap: '变电站：', placeholder: '请选择', data: '{{stList}}', icon: 'transformer-bolt', search: '{{name}}', select: '{{stId}}' },
                            watchers: [
                                {
                                    key: 'name',
                                    callback: function (val) {
                                        if (val.length == 0) _msgr.pub('stId', '');
                                        getSubstationList(val);
                                    },
                                    debounce: 200
                                }
                            ]
                        },
                        {
                            type: 'button',
                            class: 'btn jam-cta',
                            cap: '查询',
                            icon: 'magnifying-glass',
                            styles: [Styles.searchBtnsStyles],
                            onclick: function () {
                                beginRate = null;
                                endRate = null;
                                getTableData();
                            }
                        },
                        {
                            type: 'button',
                            class: 'btn',
                            cap: '导出',
                            icon: 'file-export',
                            onclick: function () {
                                exportTableData();
                            }
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'table-item',
                    components: [
                        {
                            type: 'table',
                            styles: [Styles.table.regularStyle, Styles.table.showrownum({ style: 'plain' }), Styles.size({ width: '100%', height: 'calc(100% - 2rem)' })],
                            dataWatcher: 'busVoltageTableData',
                            dataDef: [
                                {
                                    cap: '设备id',
                                    key: 'devId',
                                    show: false
                                },
                                {
                                    cap: '所属单位',
                                    key: 'regionName',
                                    sortable: false
                                },
                                {
                                    cap: '越限时间',
                                    key: 'occurTime',
                                    sortable: false
                                },
                                {
                                    cap: '电压等级',
                                    key: 'bvName',
                                    sortable: false
                                },
                                {
                                    cap: '变电站',
                                    key: 'stName',
                                    sortable: false
                                },
                                {
                                    cap: '设备名称',
                                    key: 'name',
                                    sortable: false
                                },
                                // {
                                //     cap: '线电压',
                                //     key: 'value',
                                //     sortable: true,
                                //     formatter: item=>{
                                //        return Number(item).toFixed(2)
                                //     }
                                // },
                                // {
                                //     cap: '上限1',
                                //     key: 'up1',
                                //     sortable: false
                                // },
                                // {
                                //     cap: '上限2',
                                //     key: 'up2',
                                //     sortable: false
                                // },
                                // {
                                //     cap: '下限1',
                                //     key: 'down1',
                                //     sortable: false
                                // },
                                // {
                                //     cap: '下限2',
                                //     key: 'down2',
                                //     sortable: false
                                // }
                                {
                                    cap: '电压值',
                                    key: 'bvValue',
                                    sortable: true,
                                    formatter: (item) => {
                                        return Number(Number(item).toFixed(2));
                                    }
                                },
                                {
                                    cap: '差值',
                                    key: 'subValue',
                                    sortable: true,
                                    formatter: (item) => {
                                        return Math.abs(Number(Number(item).toFixed(2)) || 0);
                                    }
                                },
                                {
                                    cap: '限值',
                                    key: 'value',
                                    sortable: true,
                                    formatter: (item) => {
                                        return Number(Number(item).toFixed(2));
                                    }
                                },
                                {
                                    cap: '越限率',
                                    key: 'rate',
                                    sortable: true,
                                    formatter: (item) => {
                                        return Number(Number(item).toFixed(2));
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
                                        value: '50',
                                        name: '50条/页'
                                    },
                                    {
                                        value: '10',
                                        name: '10条/页'
                                    }
                                ],
                                total: 'busVolLimit_total',
                                messageKey: 'bus_vol_limit'
                            },
                            watchers: [
                                {
                                    key: 'bus_vol_limit',
                                    callback: function (page) {
                                        if (page?.firstFetch) return;
                                        getTableData(page);
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        initFormData();
        onRenderBarChart();
        onRenderPieChart();
        getTypeOriginLineData();
    }
};

function initFormData() {
    getRegionList();
    getOverloadStaticsBvList();
    getSubstationList();
}

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
                _msgr.pub('regionId', '');
                _msgr.pub('regionList', [...defaultRegion, ...regionList]);
            },
            params: {},
            useMock: false,
            type: 'get'
        },
        false
    );
}

function getOverloadStaticsBvList() {
    ajaxCall(
        'getOriginBvConf',
        {
            success(data) {
                const defaultBvList = [
                    {
                        name: '全部',
                        value: ''
                    }
                ];
                const bvList = data.map((item) => {
                    return { name: item.bvName, value: item.bvId };
                });
                bvList.sort((a, b) => {
                    const numA = parseInt(a.name.match(/\d+/)[0]);
                    const numB = parseInt(b.name.match(/\d+/)[0]);
                    return numB - numA;
                });

                _msgr.pub('bvList', [...defaultBvList, ...bvList]);
                _msgr.pub('bvId', '');
                getTableData();
            },
            params: {},
            useMock: false,
            type: 'get'
        },
        false
    );
}

function getSubstationList(devName = '') {
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

function onRenderBarChart() {
    ajaxCall(
        'getRegionIdOriginLineData',
        {
            success(data) {
                const name__ = [],
                    value__ = [];
                (data || []).forEach((v) => {
                    name__.push(v.regionName);
                    value__.push(v.num);
                });
                const barEchart = echarts.init(document.querySelector('.barCharts-box'));
                barEchart.setOption(setBusVolageLimitBarEcharts(name__, value__));
                barEchart.on('click', (params) => {
                    const regionList = _msgr.get('regionList') || [];
                    const _regionId = _msgr.get('regionId') || null;
                    const _region = regionList.find((item) => {
                        return item.name == params.name;
                    });
                    let _clickId = _region?.value == _regionId ? '' : _region?.value;
                    filterOptions({ regionId: _clickId || '' });
                });
                window.addEventListener('resize', barEchart.resize);

                // 保存图表数据以便导出
                _model.vars.barChartData = { name__, value__ };
            },
            params: {},
            useMock: false,
            type: 'post'
        },
        false
    );
}

function onRenderPieChart() {
    ajaxCall(
        `getBvOriginLineData`,
        {
            success(data) {
                const sum = data.reduce((prev, cur) => (prev += cur.num), 0);
                data.sort((a, b) => {
                    const numA = parseInt(a.bvName.match(/\d+/)[0]);
                    const numB = parseInt(b.bvName.match(/\d+/)[0]);
                    return numB - numA;
                });
                let legendLiHtml = '<ul class="column-flex">';
                const pieData = [];
                const colorList = {
                    '500kV': 'rgb(96, 127, 229)',
                    '1000kV': '#fd7783',
                    '220kV': 'rgb(255, 0, 0)',
                    '110kV': 'rgb(72, 194, 255)',
                    '35kV': 'rgb(90, 146, 70)',
                    '20kV': '#D57F7B',
                    '10kV': '#f6c81e'
                };
                data.forEach((v) => {
                    if (['1000kV', '10kV'].includes(v.bvName)) return;
                    legendLiHtml += `<li style="--li-clr:${colorList[v.bvName]}">
                                        <span>${v.bvName}</span>
                                        <span>${v.num}</span>
                                        <span>${sum ? ((Number(v.num) / sum) * 100).toFixed(0) : 0}%</span>
                                    </li>`;
                    pieData.push({
                        name: v.bvName,
                        value: v.num
                    });
                });
                legendLiHtml += '</ul>';
                document.querySelector('.pie-legend').insertAdjacentHTML('beforeend', legendLiHtml);
                const pieEchart = echarts.init(document.querySelector('.pieCharts-box'));
                pieEchart.setOption(setPieEchartsData(pieData));
                pieEchart.on('click', (params) => {
                    const bvList = _msgr.get('bvList') || [];
                    const _bvId = _msgr.get('bvId') || null;
                    const _bv = bvList.find((item) => {
                        return item.name == params.name;
                    });
                    let _clickId = _bv?.value == _bvId ? '' : _bv?.value;
                    filterOptions({ bvId: _clickId || '' });
                });

                // 保存图表数据以便导出
                _model.vars.pieChartData = pieData;
            },
            useMock: false,
            type: 'post'
        },
        false
    );
}

function getTypeOriginLineData() {
    ajaxCall(
        `getTypeOriginLineData`,
        {
            success(data) {
                const staticsList = [
                    { name: '10%及以下', value: data.count1 || 0 },
                    { name: '10%-20%', value: data.count2 || 0 },
                    { name: '20%-50%', value: data.count3 || 0 },
                    { name: '50%以上', value: data.count4 || 0 }
                ];
                _model.vars.staticsList = staticsList;
            },
            useMock: false,
            type: 'post'
        },
        false
    );
}

function getTableData(page) {
    const params = getParams() || {};
    params.beginRate = beginRate;
    params.endRate = endRate;
    if (page) {
        params.pageIndex = page.pageNumber || 1;
        params.pageSize = page.pageSize || 100;
    } else {
        params.pageIndex = 1;
        params.pageSize = 100;
    }
    ajaxCall(
        'getOriginLineData',
        {
            success(data) {
                _msgr.pub('busVoltageTableData', data.list);
                _msgr.pub('busVolLimit_total', data.pojoTotalCount);
            },
            params,
            useMock: false,
            type: 'post'
        },
        false
    );
}
function exportTableData() {
    const params = getParams() || {};

    params.beginRate = beginRate;
    params.endRate = endRate;
    exportExcel(urlConfig.exportOriginLineData.url, params, '母线越限数据.xlsx', 'POST');
}

function filterOptions(params = {}) {
    _msgr.pub('regionId', '');
    _msgr.pub('bvId', '');
    _msgr.pub('stId', '');
    // _msgr.pub('type', 0);
    for (var i in params) {
        _msgr.pub(i, params[i]);
    }
    beginRate = null;
    endRate = null;
    getTableData();
}

function getParams() {
    let params = {};
    if (!Array.isArray(_msgr.get('bvId')) && _msgr.get('bvId')?.length > 0) {
        params.bvIdList = [_msgr.get('bvId')];
    }
    if (!Array.isArray(_msgr.get('regionId'))) {
        params.regionId = _msgr.get('regionId');
    }
    params.stId = _msgr.get('stId');
    // params.type = _msgr.get('type') || 0;
    return params;
}

// 柱图添加导出图表数据为Excel的函数
function exportBarChartToExcel() {
    const barChartData = _model.vars.barChartData;
    if (!barChartData || !barChartData.name__ || !barChartData.value__) {
        Qmsg.warning('没有可导出的图表数据');
        return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += '地区,实时越限值\n';

    barChartData.name__.forEach((name, index) => {
        const value = barChartData.value__[index];
        csvContent += `${name},${value}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', '母线越限实时数据(地区).xlsx');
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}

// 饼图添加导出图表数据为Excel的函数
function exportPieChartToExcel() {
    const pieData = _model.vars.pieChartData;
    console.log(pieData);
    if (!pieData || !pieData.length) {
        Qmsg.warning('没有可导出的图表数据');
        return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += '电压等级,实时越限值\n';

    pieData.forEach((item) => {
        csvContent += `${item.name},${item.value}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', '母线越限实时数据(电压等级).xlsx');
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}
