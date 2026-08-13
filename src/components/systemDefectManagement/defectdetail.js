import { findCol } from '../../global.js';
import { loadConf } from '../../common.js';
// import { createWindow } from '../createWindow.js';
import newOperationRecords from '../modal/newOperationRecords.js';
let _model, _msgr, _this;
let rightTypeData = [
    {
        name: '类型',
        value: 'defectType'
    },
    {
        name: '区域',
        value: 'region'
    },
    {
        name: '时间',
        value: 'time'
    }
];
let type = 'defectType';
let regionList = [];
const dataDef = [
    {
        cap: 'idStr',
        key: 'idStr',
        show: false
    },
    {
        cap: '区域',
        key: 'regionName',
        sortable: false,
        formatter: function (value) {
            return value ? value : '---';
        }
    },
    {
        cap: '运维标题',
        key: 'content',
        sortable: false,
        align: 'left',
        styles: [Styles.toShowAll],
        formatter: function (value) {
            return value ? value : '---';
        }
    },
    {
        cap: '缺陷类型',
        key: 'defectTypeName',
        sortable: false,
        formatter: function (value) {
            return jame({
                type: 'tag',
                class: 'jam-cc-tag',
                styles: ['padding(0.2rem 0.5rem !important)'],
                cap: value
            });
        }
    },
    {
        cap: '运维内容',
        key: 'describe',
        sortable: false,
        align: 'left',
        styles: [Styles.toShowAll],
        formatter: function (value) {
            return value ? value : '---';
        }
    },
    {
        cap: '状态',
        key: 'statusName',
        sortable: false,
        formatter: function (value) {
            return jame({
                type: 'tag',
                class: 'jam-cc-tag',
                styles: ['padding(0.2rem 0.5rem !important)'],
                cap: value
            });
        }
    },
    {
        cap: '负责人',
        key: 'ownerName',
        sortable: false,
        formatter: function (value) {
            return value ? value : '---';
        }
    },
    {
        cap: '创建人',
        key: 'createUserName',
        sortable: false,
        formatter: function (value) {
            return value ? value : '---';
        }
    },
    {
        cap: '创建时间',
        key: 'gmtCreateTime',
        sortable: false,
        formatter: function (value) {
            return value
                ? jame({
                      type: 'badge',
                      styles: [
                          Styles.css({
                              borderRadius: '0.2rem',
                              fontSize: '0.9rem'
                          })
                      ],
                      cap: jam.formatTime(value, 'yyyy-MM-dd'),
                      content: jam.formatTime(value, 'HH:mm:ss')
                  })
                : '---:---';
        }
    },
    {
        cap: '操作',
        key: '',
        sortable: false,
        formatter: function (value) {
            return jame({
                type: 'wrapper',
                styles: [Styles.layout.flex({ alignItems: 'center', justifyContent: 'center' })],
                descStyles: {
                    label: ['margin(left:0.5rem)']
                },
                components: [
                    {
                        type: 'label',
                        tip: '运维日志',
                        icon: 'file-pen',
                        styles: [
                            'icon.solid',
                            Styles.label.css({
                                // height: '1.5rem',
                                // color: jam.ac(0.88, 0.79, 0.67, jam.acLumiO(50)),
                                cursor: 'pointer'
                            })
                        ],
                        onclick: function (e) {
                            const __self = findCol(e.target);
                            let id = __self.col(0);
                            let params = {
                                id: id,
                                type: 'defect',
                                statusName: '已归档'
                            };
                            // createWindow({
                            //     title: '运维日志',
                            //     width: '60vw',
                            //     height: '60vh',
                            //     body: newOperationRecords(params),
                            //     showBtn: false
                            // });
                            jam.renderModal('#main', newOperationRecords({ title: '运维日志', ...params }));
                        }
                    }
                ]
            });
        }
        // onclick: function (e) {
        //     const __self = jam.findParent(e.target);
        //     let id = __self.col(0);
        //     let params = {
        //         id: id,
        //         type: 'defect',
        //         statusName: '已归档'
        //     };
        //     createWindow({
        //         title: '运维日志',
        //         width: '65vw',
        //         height: '70vh',
        //         body: newOperationRecords(params),
        //         showBtn: false
        //     });
        // }
    }
];
const defaultTime1 = moment().format('YYYY-MM-01');
const defaultTime2 = moment().endOf('month').format('YYYY-MM-DD');
const currentTime = moment().format('YYYY-MM-DD');
let getJsonData = loadConf('systemDefectType.json', {});
let defectTypeList = getJsonData.typeData.map((item) => {
        return item.value;
    }),
    statusList = getJsonData.statusData.map((item) => {
        return item.value;
    });
const defectdetail = (pageIndex = 0) => {
    return {
        type: 'wrapper',
        class: '',
        styles: ['size.fullsize', 'css(--gap:.75rem)', 'padding(var(--gap))', 'flex(direction: column)'],
        plugins: ['popup.helper', 'popup.tip(subTip:true)', "-shortcut.search({selector:'.jam-option'})"],
        components: [
            {
                type: 'wrapper',
                components: [
                    {
                        type: 'wrapper',
                        class: 'form-box',
                        styles: ['flex(flex:1;)'],
                        components: [
                            {
                                type: 'wrapper',
                                class: 'form-item',
                                components: [
                                    {
                                        type: 'buttongroup-radio',
                                        cap: '区域选择',
                                        defaultValue: null,
                                        icon: 'earth-asia',
                                        valueKey: 'regionId',
                                        dataWatcher: 'regionList',
                                        styles: [Styles.buttonGroupStylesWithBgCap],
                                        onvaluechange(value) {
                                            if (value != null) {
                                                _msgr.pub('regionId', value);
                                                _model.vars.cpageNo = 1;
                                                getRightChartData();
                                                getTableData();
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'wrapper',
                                childStyles: ['margin(right:0.5rem)'],
                                switchStyles: ['input.text(size:0.58rem)'],
                                class: 'form-item',
                                components: [
                                    {
                                        type: 'buttongroup-checkbox',
                                        cap: '缺陷类型',
                                        icon: 'chart-pyramid',
                                        defaultValue: defectTypeList,
                                        valueKey: 'defectType',
                                        styles: [Styles.buttonGroupStylesWithBgCap],
                                        data: getJsonData.typeData
                                    }
                                ]
                            },
                            {
                                type: 'wrapper',
                                childStyles: ['margin(right:0.5rem)'],
                                switchStyles: ['input.text(size:0.58rem)'],
                                class: 'form-item',
                                components: [
                                    {
                                        type: 'buttongroup-checkbox',
                                        cap: '缺陷状态',
                                        defaultValue: statusList,
                                        icon: 'signal',
                                        valueKey: 'status',
                                        styles: [Styles.buttonGroupStylesWithBgCap],
                                        data: getJsonData.statusData
                                    }
                                ]
                            },
                            {
                                type: 'wrapper',
                                class: 'form-item form-time',
                                childStyles: ['margin(right:0.5rem;)', 'icon.solid', 'padding(top:0;bottom:0;)'],
                                components: [
                                    {
                                        type: 'datepicker',
                                        valueKey: 'startDate',
                                        icon: 'calendar',
                                        cap: '开始时间：',
                                        defaultValue: defaultTime1,
                                        styles: ['datepicker.labelslot.margin(0)']
                                    },
                                    {
                                        type: 'datepicker',
                                        valueKey: 'endDate',
                                        cap: '结束时间：',
                                        icon: 'calendar',
                                        defaultValue: defaultTime2,
                                        styles: ['datepicker.labelslot.margin(0)']
                                    },
                                    // {
                                    //     type: 'select',
                                    //     valueKey: 'status',
                                    //     cap: '状态',
                                    //     icon: '<img src="../../assets/images/power-control.svg">',
                                    //     data: loadConf('systemDefectType.json', {}).statusData,
                                    //     styles: [Styles.select.regularStyleNew, Styles.select.agent.css({ minWidth: '8rem' })]
                                    // },
                                    {
                                        type: 'button',
                                        class: 'btn jam-cta',
                                        cap: '查询',
                                        icon: 'magnifying-glass',
                                        styles: [Styles.searchBtnsStyles],
                                        onclick: function () {
                                            _model.vars.cpageNo = 1;
                                            getRightChartData();
                                            getTableData();
                                        }
                                    },
                                    {
                                        type: 'button',
                                        class: 'btn',
                                        cap: '重置',
                                        icon: 'rotate-right',
                                        styles: [Styles.searchBtnsStyles],
                                        onclick: function () {
                                            _msgr.pub('defectType', defectTypeList);
                                            _msgr.pub('regionId', '');
                                            _msgr.pub('startDate', defaultTime1);
                                            _msgr.pub('endDate', defaultTime2);
                                            _msgr.pub('status', statusList);
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        class: 'chart-box',
                        styles: ['flex(flex:1;)'],
                        components: [
                            {
                                type: 'wrapper',
                                class: 'right-tab',
                                components: [
                                    {
                                        type: 'label',
                                        cap: '统计分析',
                                        class: 'right-title'
                                    },
                                    {
                                        type: 'wrapper',
                                        class: 'right-tab-list',
                                        components: [
                                            {
                                                buildFor: '(item,idx) in rightTypeData',
                                                type: 'label',
                                                cap: '{{item.name}}',
                                                attrs: {
                                                    id: '{{item.value}}'
                                                },
                                                class: 'right-tab-item',
                                                // class: '{{index}}===0?"right-tab-item active": "right-tab-item"',
                                                watchers: {
                                                    'item.value': function (item) {
                                                        if (item === type) {
                                                            this.class = 'right-tab-item active';
                                                        } else {
                                                            this.class = 'right-tab-item';
                                                        }
                                                    }
                                                },
                                                onclick: function (e) {
                                                    const elem = jam.findParent(e.target, '.right-tab-item') || e.target;
                                                    const alarmAll = document.querySelectorAll('.right-tab-item');
                                                    for (let i = 0; i < alarmAll.length; i++) {
                                                        alarmAll[i].classList.remove('active');
                                                    }
                                                    elem.classList.add('active');
                                                    type = this.id;
                                                    getRightChartData();
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'wrapper',
                                class: 'chart-bar-box',
                                components: [
                                    {
                                        type: 'wrapper',
                                        class: 'chart-title',
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
                                        ref: 'defectDetailChart',
                                        props: { unit: '个' },
                                        styles: ['stripyBarChart.basic', 'css(flex:1;width:100%;min-height:0)'],
                                        vars: {
                                            data: {
                                                chartData: [['指标', '统计值']]
                                            }
                                        },
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
                                                getTableData();
                                            });
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
                class: 'table-box',
                styles: ['flex(direction: column)', 'margin(top:var(--gap))', 'layout(overflow:hidden)', 'flex(1)'],
                components: [
                    {
                        type: 'tableWithPage',
                        ref: 'defectTableWithPage',
                        styles: ['flex(1)', Styles.hover.toShowAll({ selector: '.jam-td' }), Styles.table.fixedrowheight({ height: '2.5rem' }), 'size.fullsize', Styles.css({ padding: 0 }), 'table.th.css(whiteSpace:nowrap;minHeight:2.5rem;)'],
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
                            ]
                        },
                        dataDef,
                        watchers: [
                            {
                                keys: ['cpageNo'],
                                debounce: 400,
                                callback(cpageNo) {
                                    _model.vars.cpageNo = cpageNo;
                                    getTableData(cpageNo);
                                }
                            },
                            {
                                keys: ['cpageSize'],
                                debounce: 400,
                                callback(cpageSize) {
                                    _model.vars.cpageSize = cpageSize;
                                    _model.vars.cpageNo = 1;
                                    getTableData(1);
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        vars: {
            ctotal: 0,
            cpageNo: 1,
            cpageSize: 10
        },
        onmount: function () {
            _this = this;
            _model = this.model;
            _msgr = this.model.msgr;
        },
        onafterrender: function () {
            const systemDefectManagementParmas = mango.get('systemDefectManagementParmas') || {};
            if (systemDefectManagementParmas?.defectType) {
                _msgr.pub('defectType', systemDefectManagementParmas?.defectType);
            }
            _model.vars.rightTypeData = rightTypeData;
            getRegionList();
        }
    };
};

/**
 * 获取区域列表
 */
function getRegionList() {
    jam.ajaxCall({
        urlKey: 'getRegionList',
        method: 'get',
        data: { queryProvincial: true },
        onsuccess(res) {
            const data = res?.data || [];
            const defaultRegion = [{ name: '全部', value: ' ' }];
            regionList = data.map((item) => ({ name: item.regionNameChn, value: item.regionId }));
            _msgr.pub('regionId', ' ');
            _msgr.pub('regionList', [...defaultRegion, ...regionList]);
            if (regionList.length) {
                getTodayDefectCount();
            }
        }
    });
}

/**
 * 获取今日新增缺陷数
 */
function getTodayDefectCount() {
    jam.ajaxCall({
        urlKey: 'getSysDefectEchartsData2',
        method: 'post',
        data: {
            startDate: currentTime,
            endDate: currentTime,
            defectTypeList: _msgr.get('defectType'),
            regionIdList: _msgr.get('regionId') || _msgr.get('regionId') === 0 ? [_msgr.get('regionId')] : [],
            statusList: _msgr.get('status'),
            type
        },
        onsuccess(res) {
            const data = res?.data || {};
            let sum = 0;
            for (const key in data) {
                sum += data[key];
            }
            _model['chart-right-info'] = `<div>今日新增缺陷<span class="title-color">${sum}</span>个</div>`;
        }
    });
}

function getChartHeader(type) {
    return { defectType: '类型', region: '地区', time: '时间' }[type] || '指标';
}

function buildDetailChartData(data, chartType) {
    const chartData = [[getChartHeader(chartType), '统计值']];
    for (const key in data) {
        chartData.push([key, data[key]]);
    }
    return chartData;
}

/**
 * 获取右侧柱形图数据
 */
function getRightChartData() {
    const searchParams = {
        startDate: _msgr.get('startDate'),
        endDate: _msgr.get('endDate'),
        defectTypeList: _msgr.get('defectType'),
        regionIdList: _msgr.get('regionId') || _msgr.get('regionId') === 0 ? [_msgr.get('regionId')] : [],
        statusList: _msgr.get('status'),
        type
    };
    if (type === 'defectType') {
        searchParams.defectTypeList = defectTypeList;
    } else if (type === 'region') {
        searchParams.regionIdList = [];
    }
    jam.ajaxCall({
        urlKey: 'getSysDefectEchartsData',
        method: 'post',
        data: searchParams,
        onsuccess(res) {
            const data = res?.data || {};
            const xData = [];
            const yData = [];
            let sum = 0;
            for (const key in data) {
                xData.push(key);
                yData.push(data[key]);
                sum += data[key];
            }
            const maxIndex = yData.indexOf(Math.max.apply(null, yData));
            const maxValue = yData[maxIndex];
            const maxValueCount = yData.filter((val) => val === maxValue).length;
            if (sum === 0) {
                _model['chart-left-info'] = `<div>总缺陷<span class="title-color">${sum}</span>个</div>`;
            } else if (maxValueCount > 1) {
                _model['chart-left-info'] = `<div>总缺陷<span class="title-color">${sum}</span>个，其中<span class="title-color">${xData[maxIndex]}等</span>缺陷次数最多</div>`;
            } else {
                _model['chart-left-info'] = `<div>总缺陷<span class="title-color">${sum}</span>个，其中<span class="title-color">${xData[maxIndex]}</span>缺陷次数最多</div>`;
            }
            const chartRef = _this?.ref('defectDetailChart');
            if (chartRef) {
                chartRef.vars.data.chartData = buildDetailChartData(data, type);
            }
            getTodayDefectCount();
        }
    });
}

/**
 * 获取表格数据
 */
function getTableData(page) {
    const pageIndex = typeof page === 'number' ? page : _model.vars.cpageNo || 1;
    const pageSize = _model.vars.cpageSize || 10;
    jam.ajaxCall({
        urlKey: 'getSysDefectTableData',
        method: 'post',
        data: {
            startDate: _msgr.get('startDate'),
            endDate: _msgr.get('endDate'),
            defectTypeList: _msgr.get('defectType'),
            regionIdList: _msgr.get('regionId') || _msgr.get('regionId') === 0 ? [_msgr.get('regionId')] : [],
            statusList: _msgr.get('status'),
            type: 'defect',
            pageIndex,
            pageSize
        },
        onsuccess(res) {
            const data = res?.data || {};
            const setTableData = (list, retry = 0) => {
                const tableRef = _this?.ref('defectTableWithPage');
                if (tableRef) {
                    tableRef.data = list || [];
                } else if (retry < 10) {
                    setTimeout(() => setTableData(list, retry + 1), 100);
                }
            };
            setTableData(data.list);
            setTimeout(() => {
                _model.vars.ctotal = data.pojoTotalCount || 0;
            }, 100);
        }
    });
}
export default defectdetail;
