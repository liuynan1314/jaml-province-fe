import { ajaxCall, findCol, loadConf, formatterJameBv, formatterJameTime } from '../common.js';
// import { createWindow } from '../components/createWindow.js';
import fzlChartWindow from '../components/modal/fzlChartWindow.js';
import overloadDetailWindow from '../components/modal/overloadDetailWindow.js';
import alarmSearchTable from '../components/modal/alarmSearchTable.js';
import devOverloadStatisticsWindow from '../components/modal/devOverloadStatisticsWindow.js';
import { openDiffHistoryChart } from '../components/diffImportantDevTable.js';
import { buildBasicTable } from '../components/componentBuilder.js';
let _model,
    _msgr = null;
let _table = null;
const isTest = loadConf('config.json', {})?.isTest || false;
export default {
    type: 'card',
    class: '',
    icon: 'wave-square',
    styles: [
        'size.fullsize',
        Styles.stylesheet({
            '.bdztj-btn': {
                position: 'absolute',
                top: '0.35rem',
                right: '6.5rem'
            },
            '.history-btn': {
                position: 'absolute',
                top: '0.35rem',
                right: '0.5rem'
            },
            '.viewButtons': {
                'jam-button': {
                    '--jam-button-bg-deg': '180deg',
                    background: `linear-gradient(var(--jam-button-bg-deg),${jam.ac({ l: 0.9 })}, ${jam.ac({ l: 0.7 })})`,
                    color: jam.lumiText(1),
                    '&:hover': {
                        background: `linear-gradient(var(--jam-button-bg-deg),${jam.ac({ l: 1 })}, ${jam.ac({ l: 0.8 })})`
                    },
                    '&:active': {
                        '--jam-button-bg-deg': '0deg'
                    }
                }
            },
            '.text-underline': {
                cursor: 'pointer',
                textDecoration: 'underline',
                'text-underline-offset': '.2rem'
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            styles: [Styles.css({ height: '100%', width: '100%', overflow: 'auto' })],
            components: [
                {
                    type: 'wrapper',
                    components: [
                        {
                            type: 'button',
                            class: 'bdztj-btn',
                            styles: ['props({ backgroundColor: jam.ac() })'],
                            showIf: '{{isTest}}',
                            cap: '变电站统计',
                            onclick: function () {
                                jam.renderModal('#main', devOverloadStatisticsWindow());
                                // createWindow({
                                //     title: `设备重过载变电站统计`,
                                //     width: '80vw',
                                //     height: '75vh',
                                //     body: devOverloadStatisticsWindow(),
                                //     showBtn: false
                                // });
                            }
                        },
                        {
                            type: 'button',
                            class: 'history-btn',
                            styles: ['props({ backgroundColor: jam.ac() })'],
                            cap: '历史重过载',
                            onclick: function () {
                                jam.renderModal('#main', alarmSearchTable());
                                // createWindow({
                                //     title: `历史重过载`,
                                //     width: '80vw',
                                //     height: '75vh',
                                //     body: alarmSearchTable(),
                                //     showBtn: false,
                                //     movable: false
                                // });
                            }
                        }
                    ]
                },
                buildBasicTable({
                    dataKey: 'detailData',
                    dataDef: [
                        {
                            cap: '',
                            key: 'devId',
                            show: false
                        },
                        {
                            cap: '',
                            key: 'loadRateLcId',
                            show: false
                        },
                        {
                            cap: '',
                            key: 'stId',
                            show: false
                        },
                        {
                            cap: '单位',
                            key: 'regionName',
                            sorter: true
                        },
                        {
                            cap: '变电站',
                            align: 'left',
                            key: 'stName',
                            class: 'r-st item-content',
                            sortable: false,
                            attrs: jaml.res(function () {
                                return { 'data-id': this.col(2) };
                            })
                        },
                        {
                            cap: '电压等级',
                            key: 'bvName',
                            formatter: formatterJameBv
                        },
                        {
                            cap: '设备名称',
                            align: 'left',
                            key: 'devName'
                        },
                        {
                            cap: '实时负载率',
                            key: 'loadRate',
                            formatter: function (value) {
                                return jame({
                                    type: 'label',
                                    cap: value,
                                    class: 'text-underline',
                                    styles: [
                                        Styles.css({
                                            color: 'hsl(195.3, 100%, 56.1%)'
                                        })
                                    ],
                                    onclick: function (e) {
                                        let target = findCol(e.target);
                                        const devId = target.col(0);
                                        const loadRateLcId = target.col(1);
                                        const modal_params = {
                                            devId,
                                            devName: target.col(6)
                                        };
                                        openDiffHistoryChart(modal_params, [loadRateLcId]);
                                    }
                                });
                            }
                        },
                        {
                            cap: '重过载类型',
                            key: 'loadStatus',
                            menu: {
                                0: '正常',
                                1: '重载',
                                2: '过载'
                            }
                        },
                        {
                            cap: '(重过载)起始时间',
                            key: 'startTime',
                            formatter: formatterJameTime
                        },
                        {
                            cap: '持续时间(min)',
                            key: 'totalTime',
                            formatter: function (value) {
                                return value || value === 0 ? Math.floor(value / 60) : '--';
                            }
                        },
                        {
                            cap: '操作',
                            sortable: false,
                            width: '12%',
                            type: 'buttongroup',
                            class: 'viewButtons',
                            styles: [
                                Styles.css({
                                    '--jam-optionslot-justify-content': 'center'
                                })
                            ],
                            align: 'center',
                            key: 'action',
                            data: [
                                {
                                    name: '详情',
                                    value: 'view'
                                },
                                {
                                    name: '曲线',
                                    value: 'curve'
                                }
                            ],
                            onclick(e) {
                                if (e?.target?.cap === '详情' || e?.target?.textContent === '详情') {
                                    const data = _model.vars.detailData.find((item) => (item.devId = this.col(0)));
                                    jam.renderModal('#main', overloadDetailWindow({ ...data, loadStatus: ['正常', '重载', '过载'][data.loadStatus], windType: ['两绕组', '三绕组'][data.windType] }));

                                    // createWindow({
                                    //     title: '重过载详情',
                                    //     body: overloadDetailWindow({ ...data, loadStatus: ['正常', '重载', '过载'][data.loadStatus], windType: ['两绕组', '三绕组'][data.windType] }),
                                    //     width: '40vw',
                                    //     height: '40vh',
                                    //     showBtn: false
                                    // });
                                } else if (e?.target?.cap === '曲线' || e?.target?.textContent === '曲线') {
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
                        }
                    ]
                })
            ]
        }
    ],
    methods: {
        getOverloadDetail() {
            const params = {
                devType: 2,
                regionId: _msgr.get('regionId') || ''
            };
            jam.ajaxCall({
                urlKey: 'getOverloadDetail',
                data: params,
                onsuccess(result) {
                    const { data } = result;

                    let newRes = jam.cloneDeep(data);
                    let filterData = [];
                    let devOverLoadParmas = mango.get('devOverLoadParmas');
                    let regionName = devOverLoadParmas?.name || '';
                    if (regionName) {
                        //数量统计过滤
                        filterData = newRes.filter((item) => item.regionName == regionName);
                    }
                    _model.vars.detailData = regionName ? filterData : data;
                    getLoadRateCnt();
                }
            });
        }
    },
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onunmount: function () {
        mango.pub('devOverLoadParmas', null);
    },
    onafterrender: function () {
        this.methods.getOverloadDetail();
        _msgr.pub('isTest', isTest);
    },
    watchers: [
        {
            key: 'regionId',
            callback() {
                this.cmpt.methods.getOverloadDetail();
            }
        }
    ]
};

function getLoadRateCnt() {
    const _tableData = _model.vars.detailData || [];
    const intervals = {
        count1: 0, // 大于等于80，小于90
        count2: 0, // 大于等于90，小于100
        count3: 0, // 大于等于100，小于120
        count4: 0 // 大于等于120
    };

    _tableData.forEach((item) => {
        const loadRate = item.loadRate;
        if (loadRate >= 80 && loadRate < 90) {
            intervals['count1']++;
        } else if (loadRate >= 90 && loadRate < 100) {
            intervals['count2']++;
        } else if (loadRate >= 100 && loadRate < 120) {
            intervals['count3']++;
        } else if (loadRate >= 120) {
            intervals['count4']++;
        }
    });
    mango.pub('overload_intervals', intervals);
}

function dealTotalTime(totalTime) {
    return totalTime || totalTime === 0 ? Math.floor(totalTime / 60) : 0;
}
