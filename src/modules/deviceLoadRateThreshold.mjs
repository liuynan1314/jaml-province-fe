import { ajaxCall, findCol, exportExcel, getDetailConf } from '../common.js';
import { urlConfig } from '../global.js';
import { createWindow } from '../components/createWindow.js';
import deviceLineWindow from '../components/modal/deviceLineWindow.js';
import deviceWindow from '../components/modal/deviceWindow.js';

let _model, _msgr;

export default {
    type: 'wrapper',
    id: 'deviceLoadRate3',
    styles: [
        'size.fullsize',
        Styles.stylesheet({
            ':scope': {
                padding: 'm',
                display: 'flex',
                flexDirection: 'column',
                gap: 'm'
            },
            '.form-wrapper': {
                height: '8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 'm'
            },
            '.form-row-wrapper': {
                display: 'flex',
                alignItems: 'center',
                gap: 's',
                flex: 1,
                width: '100%'
            },
            '.form-item': {
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                minWidth: 0,
                padding: '0 s'
            },
            '.form-row-wrapper:nth-child(2)': {
                width: '95%',
                gap: 's'
            },
            '.table-wrapper': {
                height: 'calc(100% - 7rem)',
                display: 'flex',
                flexDirection: 'column'
            },
            '.btn:hover': {
                // background: 'url(../../assets/images/button-bg.png) no-repeat center center !important',
                // backgroundSize: '100% 100%'
            },
            '.timepickerStyle': {
                minWidth: '12rem',
                '--jam-timepicker-agent-height': '1.8rem',
                '--jam-agent-border-radius': 0,
                '--jam-timepicker-agent-background-color': 'tansparent',
                '--jam-timepicker-agent-border-color': 'var(--jam-color-primary-subtle)'
            }
        })
    ],
    descStyles: {
        datepicker: ['icon.duotone'],
        input: ['icon.duotone']
    },
    components: [
        {
            type: 'wrapper',
            class: 'form-wrapper',
            components: [
                {
                    type: 'wrapper',
                    class: 'form-row-wrapper',
                    components: [
                        {
                            type: 'wrapper',
                            class: 'form-item',
                            components: [
                                {
                                    type: 'checkbox',
                                    cap: '区域选择：',
                                    icon: 'location-dot',
                                    valueKey: 'regionId',
                                    dataWatcher: 'regionList',
                                    buildIf: '{{type}} === "new"',
                                    styles: [Styles.icon.duotone],
                                    onchange: function () {
                                        if (!jam.getUrlParams().type || jam.getUrlParams().type == 'old') {
                                            return;
                                        }
                                        getSubstationList();
                                    }
                                },
                                {
                                    type: 'buttongroup-radio',
                                    cap: '区域选择',
                                    icon: 'earth-asia',
                                    defaultValue: getDetailConf('regionId', 12),
                                    valueKey: 'regionId',
                                    dataWatcher: 'regionList',
                                    buildIf: '{{type}} === "old"',
                                    styles: [Styles.buttongroupWithCapInTop, Styles.size.fullwidth],
                                    onchange: function () {
                                        if (jam.getUrlParams().type == 'new') {
                                            return;
                                        }
                                        getSubstationList();
                                    }
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            class: 'form-item',
                            components: [
                                {
                                    type: 'checkbox',
                                    cap: '电压等级：',
                                    icon: 'circle-bolt',
                                    buildIf: '{{type}} === "new"',
                                    valueKey: 'bvId',
                                    dataWatcher: 'bvList',
                                    styles: [Styles.icon.duotone],
                                    onchange: function () {
                                        if (!jam.getUrlParams().type || jam.getUrlParams().type == 'old') {
                                            return;
                                        }
                                        getSubstationList();
                                    }
                                },
                                {
                                    type: 'buttongroup-radio',
                                    cap: '电压等级',
                                    icon: 'bolt',
                                    styles: [Styles.buttongroupWithCapInTop, Styles.size({ minWidth: '10rem' })],
                                    defaultValue: null,
                                    buildIf: '{{type}} === "old"',
                                    valueKey: 'bvId',
                                    dataWatcher: 'bvList',
                                    onchange: function () {
                                        if (jam.getUrlParams().type == 'new') {
                                            return;
                                        }
                                        getSubstationList();
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'form-row-wrapper',
                    components: [
                        {
                            type: 'wrapper',
                            class: 'form-item',
                            components: [
                                {
                                    type: 'filterSelect',
                                    class: 'unifycap',
                                    styles: [Styles.input.regularStyle],
                                    props: { icon: 'transformer-bolt', cap: `厂站名称：`, data: '{{stList}}', search: '{{name}}', select: '{{stId}}' },
                                    watchers: {
                                        async name(val) {
                                            getSubstationList(val);
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            class: 'form-item',
                            components: [
                                {
                                    type: 'input',
                                    valueKey: 'diff',
                                    icon: 'minus',
                                    defaultValue: 70,
                                    styles: [Styles.input.regularStyle],
                                    cap: '阈值：'
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            class: 'form-item',
                            components: [
                                {
                                    type: 'datepicker',
                                    valueKey: 'time1',
                                    icon: 'timer',
                                    defaultValue: moment().format('YYYY-MM-DD'),
                                    cap: '开始时间：',
                                    styles: [Styles.datepicker.regularStyle]
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            class: 'form-item',
                            components: [
                                {
                                    type: 'timepicker',
                                    valueKey: 'startTime',
                                    defaultValue: '00:00:00',
                                    // pattern: 'HH:mm:ss',
                                    step: 1,
                                    class: 'timepickerStyle'
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            class: 'form-item',
                            components: [
                                {
                                    type: 'datepicker',
                                    valueKey: 'time2',
                                    icon: 'timer',
                                    cap: '结束时间 ：',
                                    defaultValue: moment().format('YYYY-MM-DD'),
                                    styles: [Styles.datepicker.regularStyle]
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            class: 'form-item',
                            components: [
                                {
                                    type: 'timepicker',
                                    valueKey: 'endTime',
                                    // defaultValue: moment().format('HH:mm:ss'),
                                    defaultValue: '23:59:59',
                                    step: 1,
                                    class: 'timepickerStyle'
                                }
                            ]
                        },
                        {
                            type: 'button',
                            class: 'btn query-btn',
                            styles: [
                                Styles.button.regularStyle,
                                Styles.hover.toShowAll,
                                Styles.css({
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis'
                                })
                            ],
                            cap: '查询',
                            onclick: function () {
                                getDeviceLoadRate3TableData();
                            }
                        },
                        {
                            type: 'button',
                            class: 'btn export-btn',
                            cap: '导出',
                            styles: [Styles.button.regularStyle],
                            onclick: function () {
                                exportTableData();
                            }
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'table-wrapper',
            components: [
                {
                    type: 'table',
                    plugins: [
                        Plugins.popup.floatingTip({
                            content: (el) => {
                                const textWithBr = el.parentElement.col(7);
                                return textWithBr;
                            },
                            style: { '--jam-labelslot-width': 'fit-content', padding: 'm', height: 'auto', width: 'fit-content', lineHeight: '2rem', maxWidth: '20vw', overflowY: 'auto' }
                        })
                    ],
                    styles: [
                        Styles.table.regularStyle,
                        Styles.table.showrownum({ style: 'plain' }),
                        Styles.size({ width: '100%', height: 'calc(100% - 2.5rem)' }),
                        Styles.stylesheet({
                            'jam-tablejam-table.jam-fixed-row-height .jam-td': {
                                minHeight: '2.5rem'
                            }
                        }),
                        Styles.table.css({
                            // '--jam-row-height': "auto"
                        })
                    ],
                    dataWatcher: 'deviceLoadRate3TableData',
                    dataDef: [
                        {
                            cap: '单位',
                            key: 'regionName',
                            sortable: false
                        },
                        {
                            key: 'ycId',
                            show: false
                        },
                        // {
                        //     key: 'hasAclineend',
                        //     show: false
                        // },
                        {
                            cap: '电压等级',
                            key: 'stBvName',
                            sortable: false
                        },
                        {
                            cap: '变电站',
                            key: 'stName',
                            // mergable: true,
                            sortable: false
                        },
                        {
                            cap: '主变绕组名称',
                            key: 'devName',
                            sortable: false,
                            // align: 'left',
                            styles: [
                                Styles.hover.toShowAll,
                                Styles.css({
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis'
                                })
                            ]
                        },
                        {
                            cap: '最高负载率',
                            key: 'loadRate',
                            sortable: false
                        },
                        {
                            cap: '最高负载率时间',
                            key: 'loadTime',
                            sortable: false,
                            formatter: function (value) {
                                const overLoadTime = this.col(8);
                                if (overLoadTime) {
                                    return value
                                        ? jame({
                                              type: 'badge',
                                              styles: [
                                                  Styles.css({
                                                      borderRadius: 's',
                                                      fontSize: 's'
                                                  })
                                              ],
                                              cap: jam.formatTime(value, 'yyyy-MM-dd HH:mm:ss')
                                              // content: jam.formatTime(value, 'HH:mm:ss')
                                          })
                                        : '--';
                                } else {
                                    return value;
                                }
                            }
                        },
                        {
                            cap: '越限时间段',
                            key: 'overThDetail',
                            sortable: false,
                            formatter(val) {
                                // 如果有值且不为空字符串
                                if (val && val !== '') {
                                    const firstPart = val.split('<br/>')[0];
                                    return firstPart + '<i jam-tip class="jam-info">i</i>';
                                }
                                // 如果有值但为空字符串（或其他 falsy 值）
                                else {
                                    return '越限时间小于十分钟';
                                }
                            }
                            // styles: [
                            //     Styles.hover.toShowAll,
                            //     Styles.css({
                            //         overflow: 'hidden',
                            //         whiteSpace: 'nowrap',
                            //         textOverflow: 'ellipsis'
                            //     })
                            // ],
                        },
                        {
                            key: 'overLoadTime',
                            show: false
                        },
                        {
                            cap: '功能调阅',
                            key: 'operation',
                            sortable: false,
                            formatter: function () {
                                return jame({
                                    type: 'label',
                                    cap: '曲线',
                                    styles: [
                                        Styles.label.css({
                                            height: '1.5rem',
                                            // color: jam.ac(0.95, 0.93, 0.8, jam.acLumiO(50)),
                                            backgroundColor: 'var(--jam-color-primary-subtle)',
                                            borderRadius: 's',
                                            cursor: 'pointer'
                                        })
                                    ],
                                    onclick: function (e) {
                                        let target = e.target;
                                        target = findCol(target);
                                        const ycId = target.col(1);
                                        const stName = target.col(3);
                                        const devName = target.col(4);
                                        const _p = {
                                            ycId,
                                            devName,
                                            stName,
                                            type: 3,
                                            ...getParams()
                                        };
                                        createWindow({
                                            title: '统计曲线',
                                            width: '90vw',
                                            height: '60vh',
                                            body: deviceLineWindow(_p),
                                            showBtn: false
                                        });
                                    }
                                });
                            }
                        },
                        {
                            cap: '操作',
                            key: 'hasAclineend',
                            sortable: false,
                            formatter: function (val) {
                                if (val === true) {
                                    return jame({
                                        type: 'label',
                                        cap: '查看线路详情',
                                        styles: [
                                            Styles.label.css({
                                                height: '1.5rem',
                                                // color: jam.ac(0.95, 0.93, 0.8, jam.acLumiO(50)),
                                                backgroundColor: 'var(--jam-color-primary-subtle)',
                                                borderRadius: 's',
                                                cursor: 'pointer'
                                            })
                                        ],
                                        onclick: function (e) {
                                            let target = e.target;
                                            target = findCol(target);
                                            const ycId = target.col(1);
                                            const pageType = 2;
                                            const _p = {
                                                ycId,
                                                pageType,
                                                ...getParams()
                                            };
                                            createWindow({
                                                title: '阈值统计',
                                                width: '70vw',
                                                height: '70vh',
                                                body: deviceWindow(_p),
                                                showBtn: false
                                            });
                                        }
                                    });
                                } else {
                                    return jame({
                                        type: 'label',
                                        cap: '本侧无关联线路',
                                        styles: [
                                            Styles.label.css({
                                                height: '1.5rem',
                                                // color: jam.ac(0.95, 0.93, 0.8, jam.acLumiO(50)),
                                                backgroundColor: 'var(--jam-color-primary-subtle)',
                                                borderRadius: 's',
                                                cursor: 'pointer'
                                            })
                                        ],
                                        onclick: function (e) {
                                            nutmeg.warn('不支持点击');
                                            return;
                                        }
                                    });
                                }
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
                        total: 'deviceLoadRate3TableTotal',
                        messageKey: 'deviceLoadRate3'
                    },
                    watchers: [
                        {
                            key: 'deviceLoadRate3',
                            callback: function (page) {
                                if (page?.firstFetch) return;
                                page.pageIndex = page.pageNumber;
                                const _page = {
                                    pageIndex: page.pageNumber,
                                    pageSize: page.pageSize
                                };
                                getDeviceLoadRate3TableData(_page);
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
        _model.vars.type = jam.getUrlParams().type || 'old';
    },
    onafterrender: function () {
        if (_model.vars.type === 'old') {
            document.querySelector('.form-wrapper').style.height = '10rem';
            document.querySelector('.table-wrapper').style.height = 'calc(100% - 9rem)';
        }
        getRegionList();
        getOverloadStaticsBvList();
        getSubstationList();
        // getDeviceLoadRate3TableData();
    },
    watchers: {}
};

/**
 * 获取区域列表
 */
async function getRegionList() {
    ajaxCall(
        'getRegionList',
        {
            success(data) {
                let defaultRegion = [];
                if (_model.vars.type === 'old') {
                    defaultRegion = [
                        // {
                        //     name: '全部',
                        //     value: ''
                        // }
                    ];
                }

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
                let defaultBvList = [];
                if (_model.vars.type === 'old') {
                    defaultBvList = [
                        {
                            name: '全部',
                            value: ''
                        }
                    ];
                }
                const excludeBvList = ['1000kV', '500kV', '220kV'];
                const bvList = data
                    // .filter((item) => !excludeBvList.includes(item.bvName))
                    .map((item) => {
                        return {
                            name: item.bvName,
                            value: item.bvId,
                            // 提取电压数值用于排序
                            voltageValue: parseInt(item.bvName)
                        };
                    })
                    // 按电压数值从高到低排序
                    .sort((a, b) => b.voltageValue - a.voltageValue)
                    // 移除临时添加的排序用属性
                    .map((item) => ({ name: item.name, value: item.value }));

                _msgr.pub('bvList', [...defaultBvList, ...bvList]);
            },
            params: {},
            useMock: false,
            type: 'get'
        },
        false
    );
}

function getParams() {
    let regionIdVal = _msgr.get('regionId');
    let bvIdVal = _msgr.get('bvId');
    // 如果是数组，且数组元素是空字符串，就转成空数组
    if (Array.isArray(regionIdVal)) {
        regionIdVal = regionIdVal.filter((id) => id);
    } else {
        regionIdVal = regionIdVal ? [String(regionIdVal)] : [];
    }
    if (Array.isArray(bvIdVal)) {
        bvIdVal = bvIdVal.filter((id) => id);
    } else {
        bvIdVal = bvIdVal ? [String(bvIdVal)] : [];
    }
    return {
        regionId: regionIdVal,
        bvId: bvIdVal,
        stId: _msgr.get('stId'),
        th: _msgr.get('diff'),
        queryLine: true,
        time1: _msgr.get('time1') + ' ' + _msgr.get('startTime'),
        time2: _msgr.get('time2') + ' ' + _msgr.get('endTime')
    };
}

/**
 * 获取变电站列表
 */
async function getSubstationList(devName = '') {
    let bvIdVal = _msgr.get('bvId');
    if (Array.isArray(bvIdVal)) {
        bvIdVal = bvIdVal.filter((id) => id).join(',');
    } else {
        bvIdVal = bvIdVal ? String(bvIdVal) : '';
    }
    // let bvIdVal = _msgr.get('bvId');
    // if (Array.isArray(bvIdVal)) {
    //     bvIdVal = bvIdVal.filter(id => id);
    // } else {
    //     bvIdVal = bvIdVal ? [String(bvIdVal)] : [];
    // }
    ajaxCall(
        'getSubstationList',
        {
            success(data) {
                _model.vars.stList = data?.map((item) => ({ name: item.devName, value: item.devId }));
            },
            params: {
                count: 100,
                devName: devName,
                regionId: Number(_msgr.get('regionId')),
                bvId: bvIdVal,
                devType: ['substation']
            },
            useMock: false,
            type: 'post',
            uniqId: `getSubstationList_${Math.random(1, 1000000)}`
        },
        false
    );
}

function getDeviceLoadRate3TableData(page = { pageIndex: 1, pageSize: 100 }) {
    // 解析时间字符串为Date对象
    const date1 = new Date(getParams().time1);
    const date2 = new Date(getParams().time2);

    // 检查日期是否有效
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
        nutmeg.warn('时间格式无效，请检查输入');
        return;
    }
    // 计算两个时间的毫秒差，并取绝对值
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());

    // 转换为天数（1天 = 24*60*60*1000毫秒）
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
    // 检查是否超过7天
    if (dayDiff > 7) {
        nutmeg.warn(`开始时间与结束时间最多相差7天`);
        return;
    } else {
        Qmsg.loading('正在查询');
        ajaxCall(
            'getDevLoadRateTh',
            {
                success(res) {
                    Qmsg.closeAll();
                    _msgr.pub('deviceLoadRate3TableData', res?.list);
                    _msgr.pub('deviceLoadRate3TableTotal', res?.pojoTotalCount);
                },
                params: {
                    ...getParams(),
                    ...page
                },
                useMock: false,
                type: 'post',
                timeout: 600
            },
            false
        );
    }
}

// 表格导出
function exportTableData() {
    exportExcel('exportDevLoadRateTh', getParams(), '阈值统计.xlsx', 'post', false);
}
