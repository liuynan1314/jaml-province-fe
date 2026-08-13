let _model = null;
let _msgr = null;
import { urlConfig } from './../global.js';
import { ajaxCall, formatterJameTime, exportExcel } from './../common.js';
// import { createWindow } from '../components/createWindow.js';
import eventEditWindow from '../components/modal/eventEditWindow.js';
import sendMiddleFilterWindow from '../components/modal/sendMiddleFilterWindow.js';
import sendHeadquartersFilterWindow from '../components/modal/sendHeadquartersFilterWindow.js';
import handSureWindow from '../components/modal/handSureWindow.js';
import eventSendWindow from '../components/modal/eventSendWindow.js';
import moment from 'moment';
let eventTypeData = [],
    eventLevelData = [];
let _thisModel = null;
let selectRows = [];
let _page = {
    pageIndex: 1,
    pageSize: 15
};

let dataDef = [
    {
        key: 'id',
        cap: '<input id="select-all-token-rows" class="table-checked" type="checkbox" style="height:45% !important;margin-left:0.7rem"></input>',
        width: '5rem',
        sortable: false,
        formatter: (param) => {
            const _checkBox = document.createElement('input');
            _checkBox.type = 'checkbox';
            _checkBox.id = param;
            _checkBox.classList.add('table-checkbox');
            _checkBox.classList.add('token-checkbox');
            _checkBox.style.cursor = 'pointer';
            return _checkBox;
        }
    },
    {
        key: 'devInfo',
        cap: '设备',
        show: false
    },
    {
        key: 'regionName',
        cap: '地区',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '10rem'
    },
    {
        key: 'occurTime',
        cap: '发生时间',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '13rem',
        formatter: formatterJameTime
    },
    {
        key: 'stName',
        cap: '厂站名称',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '12rem',
        formatter: function (val) {
            if (val && val.includes('.')) {
                return val.split('.')[1];
            } else {
                return val;
            }
        }
    },
    {
        key: 'devName',
        cap: '设备名称',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '12rem',
        formatter: function (val) {
            let devInfo = this.col(1);
            if (!devInfo || devInfo.length == 0) {
                return '';
            }

            var devName = '';
            devInfo.forEach((item) => (devName += item.devName + ','));
            return devName.slice(0, -1);
        }
    },
    {
        key: 'bvName',
        cap: '电压等级',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '12rem'
    },
    {
        key: 'devBvName',
        cap: '设备电压等级',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '12rem'
    },
    {
        key: 'devType',
        cap: '设备类型',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '12rem',
        formatter: function (val) {
            var devTypeName = '';
            if (val == 0) {
                devTypeName = '变压器';
            } else if (val == 1) {
                devTypeName = '线路';
            } else if (val == 2) {
                devTypeName = '母线';
            }

            return devTypeName;
        }
    },
    {
        key: 'content',
        cap: '内容',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '15rem'
    },
    {
        key: 'eventType',
        cap: '事件类型',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '12rem',
        formatter: function (val) {
            if (eventTypeData.filter((item) => item.value == val)[0] == null) return '';
            return eventTypeData.filter((item) => item.value == val)[0].name;
        }
    },
    {
        key: 'eventLevel',
        cap: '事件等级',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '12rem',
        formatter: function (val) {
            if (eventLevelData.filter((item) => item.value == val)[0] == null) return '';
            return eventLevelData.filter((item) => item.value == val)[0].name;
        }
    },
    {
        key: 'sendStatus',
        cap: '发送是否成功',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '12rem',
        formatter: function (val) {
            var sendStatusName = '';
            if (val == 0) {
                sendStatusName = '未发送';
            } else if (val == 1) {
                sendStatusName = '发送成功';
            } else if (val == 2) {
                sendStatusName = '发送失败';
            }

            return sendStatusName;
        }
    },
    {
        key: 'sendTime',
        cap: '发送时间',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '13rem',
        formatter: formatterJameTime
    },
    {
        key: 'sendToBpStatus',
        cap: '发送到中台状态',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '12rem',
        formatter: function (val) {
            if (val == 0) {
                return '未发送';
            } else if (val == 1) {
                return '发送成功';
            } else if (val == 2) {
                return '发送失败';
            }
        }
    },
    {
        key: 'sendToBpTime',
        cap: '发送到中台时间',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '13rem',
        formatter: formatterJameTime
    },
    {
        key: 'confirmed',
        cap: '中台确认',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '12rem',
        formatter: function (val) {
            if (val == 0) {
                return '不通过';
            } else if (val == 1) {
                return '通过';
            } else if (val == 2) {
                return '未确认';
            } else if (!val) {
                return '';
            }
        }
    },
    {
        key: 'confirmTime',
        cap: '中台确认时间',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '13rem',
        formatter: formatterJameTime
    },
    {
        key: 'confirmReason',
        cap: '中台确认原因',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '12rem'
    },
    {
        key: 'faultReceived',
        cap: '是否收到二次简报',
        align: 'center',
        sortable: false,
        styles: [Styles.toShowAll],
        width: '12rem',
        formatter: function (val) {
            if (val == 0) {
                return '未收到';
            } else if (val == 1) {
                return '收到';
            }
        }
    }
];
export default {
    type: 'wrapper',
    class: 'eventBasedSubmission',
    styles: [
        'size.fullsize',
        'flex(direction: column)',
        Styles.stylesheet({
            flexDirection: 'column',
            '.form-wrapper': {
                // flexDirection: 'column',
                flexWrap: 'wrap',
                '.form-item': {
                    width: '50%'
                },
                '.keyWords-wrapper': {
                    flexDirection: 'column',
                    width: '100%',
                    '.keyWords-title': {
                        '&>span[slot=cap]': {
                            display: 'block',
                            minWidth: '13.2rem',
                            height: '2.25rem',
                            lineHeight: '1.25rem',
                            color: 'onprimary',
                            paddingLeft: '1.5rem',
                            backgroundImage: 'url(assets/images/title_third.png)',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'bottom var(--gap) left',
                            backgroundSize: 'auto 1.875rem'
                        }
                    },
                    '.keyWords-list': {
                        height: '2.25rem',
                        borderRadius: 's',
                        minWidth: '12rem',
                        border: `s solid hsl(204.49 , 92.45%, 41.57%)`,
                        alignItems: 'center',
                        position: 'relative',
                        maxWidth: '50%',
                        overflow: 'auto',
                        '.keyWords-item': {
                            alignItems: 'center',
                            height: '1.5rem',
                            margin: '0 0.2rem',
                            border: 's solid var(--jam-color-primary-subtle)',
                            borderRadius: 's'
                        },
                        '.button-style': {
                            height: '1.5rem',
                            background: 'rgba(0,0,0,0)'
                        },
                        '.add-button': {
                            position: 'absolute',
                            width: '4rem',
                            right: '0.5rem',

                            border: 's solid var(--jam-color-primary-subtle)'
                        },
                        '.keyWord-input': {
                            position: 'absolute',
                            height: '1.5rem',
                            right: '0.5rem'
                        }
                    }
                },
                '.other-form': {
                    flexWrap: 'wrap',
                    marginTop: '1rem',
                    alignItems: 'center'

                    // 'jam-imput span[slot=cap]': {
                    //     width: '7rem',
                    //     textAlign: 'right'
                    // },
                    // 'jam-slect span[slot=cap]': {
                    //     width: '7rem',
                    //     textAlign: 'right'
                    // },
                    // 'jam-datepicker span[slot=cap]': {
                    //     width: '7rem',
                    //     textAlign: 'right'
                    // }
                }
            },
            '.btn-wrapper': {
                justifyContent: 'flex-end',
                marginTop: '1rem',
                'jam-button': {
                    marginRight: '1rem',
                    backgroundColor: 'var(--jam-color-primary-default)'
                }
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            class: 'form-wrapper',
            components: [
                {
                    type: 'buttongroup-radio',
                    cap: '区域选择',
                    icon: 'earth-asia',
                    class: 'form-item',
                    styles: [Styles.buttonGroupStylesWithBgCap],
                    defaultValue: null,
                    valueKey: 'regionId',
                    data: '{{regionList}}'
                },
                {
                    type: 'buttongroup-checkbox',
                    cap: '设备类型',
                    class: 'form-item',
                    styles: [Styles.buttonGroupStylesWithBgCap],
                    defaultValue: [0, 1, 2],
                    valueKey: 'devType',
                    data: [
                        {
                            name: '变压器',
                            value: '0'
                        },
                        {
                            name: '线路',
                            value: '1'
                        },
                        {
                            name: '母线',
                            value: '2'
                        }
                    ]
                },
                {
                    type: 'buttongroup-checkbox',
                    cap: '电压等级',
                    icon: 'bolt',
                    class: 'form-item',
                    styles: [Styles.buttonGroupStylesWithBgCap],
                    defaultValue: '{{bvData}}',
                    valueKey: 'bvName',
                    data: '{{bvList}}'
                },
                {
                    type: 'buttongroup-checkbox',
                    cap: '设备电压等级',
                    class: 'form-item',
                    icon: 'bolt',
                    styles: [Styles.buttonGroupStylesWithBgCap],
                    defaultValue: '{{bvData}}',
                    valueKey: 'devBvName',
                    data: '{{devBvList}}'
                },
                {
                    type: 'wrapper',
                    class: 'keyWords-wrapper',
                    components: [
                        {
                            type: 'label',
                            class: 'keyWords-title',
                            cap: '屏蔽关键字：'
                        },
                        {
                            type: 'wrapper',
                            class: 'keyWords-list',
                            type: 'wrapper',
                            components: [
                                {
                                    buildFor: 'item in keyWords',
                                    type: 'wrapper',
                                    class: 'keyWords-item',
                                    components: [
                                        {
                                            type: 'label',
                                            cap: '{{item}}',
                                            value: '{{item}}'
                                        },
                                        {
                                            type: 'button',
                                            cap: 'x',
                                            class: 'button-style',
                                            onclick: function () {
                                                let text = this.previousSibling.cap.replace(/\s+/g, '');
                                                _model.vars.keyWords = _model.vars.keyWords.filter((item) => item != text);
                                            }
                                        }
                                    ]
                                },
                                {
                                    type: 'button',
                                    cap: '新增',
                                    class: 'button-style add-button',
                                    showIf: '{{showAdd}}',
                                    onclick: function () {
                                        _model.vars.showAdd = false;
                                        _model.ref('keyWordInput').focus();
                                    }
                                },
                                {
                                    type: 'input',
                                    ref: 'keyWordInput',
                                    class: 'keyWord-input',
                                    styles: [
                                        Styles.input.regularStyleNew,
                                        Styles.input.agent.css({
                                            minWidth: '3rem',
                                            width: '3rem',
                                            height: '1.5rem'
                                        })
                                    ],
                                    showIf: '!{{showAdd}}',
                                    onblur: function () {
                                        if (!this.value) return;
                                        _model.vars.keyWords.push(this.value);
                                        this.value = '';
                                        _model.vars.showAdd = true;
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'other-form',
                    selectStyles: [Styles.select.agent.css({ minWidth: '5rem', width: '9rem' })],
                    inputStyles: [Styles.input.agent.css({ minWidth: '9rem', width: '9rem' })],
                    datepickerStyles: [Styles.datepicker.agent.css({ minWidth: '9rem', width: '9rem' })],
                    buttonStyles: [Styles.searchBtnsStyles],
                    components: [
                        {
                            type: 'input',
                            cap: '厂站名称：',
                            valueKey: 'stName',
                            placeholder: '请输入厂站名称',
                            styles: [Styles.input.regularStyleNew]
                        },
                        {
                            type: 'select',
                            cap: '事件类型：',
                            valueKey: 'eventType',
                            placeholder: '请选择事件类型',
                            data: '{{eventTypeList}}',
                            styles: [Styles.select.regularStyleNew]
                        },
                        {
                            type: 'select',
                            cap: '事件等级：',
                            valueKey: 'eventLevel',
                            placeholder: '请选择事件等级',
                            data: '{{eventLevelList}}',
                            styles: [Styles.select.regularStyleNew]
                        },
                        {
                            type: 'select',
                            cap: '发送状态：',
                            valueKey: 'sendStatus',
                            placeholder: '请选择发送状态',
                            data: [
                                {
                                    name: '未发送',
                                    value: 0
                                },
                                {
                                    name: '发送成功',
                                    value: 1
                                },
                                {
                                    name: '发送失败',
                                    value: 2
                                }
                            ],
                            styles: [Styles.select.regularStyleNew]
                        },
                        {
                            type: 'datepicker',
                            valueKey: 'beginDate',
                            defaultValue: moment().format('YYYY-MM-DD'),
                            cap: '开始时间：',
                            styles: [Styles.datepicker.regularStyleNew]
                        },
                        {
                            type: 'datepicker',
                            valueKey: 'endDate',
                            defaultValue: moment().format('YYYY-MM-DD'),
                            cap: '结束时间：',
                            styles: [Styles.datepicker.regularStyleNew]
                        },
                        {
                            type: 'input',
                            cap: '关键字：',
                            valueKey: 'keyword',
                            placeholder: '请输入关键字',
                            styles: [Styles.input.regularStyleNew]
                        },
                        {
                            type: 'button',
                            cap: '查询',
                            icon: 'search',
                            class: 'jam-cta',
                            onclick: function () {
                                queryEventAlarm();
                            }
                        },
                        {
                            type: 'button',
                            cap: '导出',
                            icon: 'file-export',
                            onclick: function () {
                                exportExcel(urlConfig['exportEventAlarmRecord'].url, getFormParams(), `事件化上送_${moment().format('yyyyMMDDHHmmssSSS')}.xlsx`, 'post');
                            }
                        },
                        {
                            type: 'switch',
                            cap: '是否自动刷新：',
                            onvaluechange: function (val) {
                                if (val) {
                                    _model.vars.autoRefreshTimer = setInterval(function () {
                                        queryEventAlarm();
                                    }, 5 * 1000);
                                } else {
                                    clearInterval(_model.vars.autoRefreshTimer);
                                }
                            }
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'btn-wrapper',
            components: [
                {
                    type: 'button',
                    cap: '事件编辑',
                    icon: 'cloud-upload',
                    showIf: '{{provinceEnabled}}',
                    onclick: function () {
                        jam.renderModal('#main', eventEditWindow(_msgr));
                        // _thisModel = createWindow({
                        //     title: `事件编辑`,
                        //     width: '40vw',
                        //     height: '75vh',
                        //     body: eventEditWindow(_msgr),
                        //     showBtn: false
                        // });
                    }
                },
                {
                    type: 'button',
                    cap: '上送中台过滤',
                    icon: 'filter',
                    onclick: function () {
                        jam.renderModal('#main', sendMiddleFilterWindow(_msgr));
                        // _thisModel = createWindow({
                        //     title: `上送中台过滤`,
                        //     width: '60vw',
                        //     height: '75vh',
                        //     body: sendMiddleFilterWindow(_msgr),
                        //     showBtn: false
                        // });
                    }
                },
                {
                    type: 'button',
                    cap: '上送总部过滤',
                    icon: 'filter',
                    onclick: function () {
                        jam.renderModal('#main', sendHeadquartersFilterWindow(_msgr));
                        // _thisModel = createWindow({
                        //     title: `上送总部过滤`,
                        //     width: '60vw',
                        //     height: '75vh',
                        //     body: sendHeadquartersFilterWindow(_msgr),
                        //     showBtn: false
                        // });
                    }
                },
                {
                    type: 'button',
                    cap: '手动确认',
                    icon: 'check',
                    showIf: '{{showHandSure}}',
                    onclick: function () {
                        if (selectRows.length === 0) {
                            nutmeg.warn('请选择要手动确认的告警数据！');
                            return;
                        }
                        jam.renderModal('#main', handSureWindow(_msgr, selectRows));
                        // _thisModel = createWindow({
                        //     title: `手动确认`,
                        //     width: '30vw',
                        //     height: '25vh',
                        //     body: handSureWindow(_msgr, selectRows),
                        //     showBtn: false
                        // });
                    }
                },
                {
                    type: 'button',
                    cap: '事件上送',
                    icon: 'send',
                    onclick: function () {
                        if (selectRows.length === 0) {
                            nutmeg.warn('请选择要事件上送的告警数据！');
                            return;
                        }
                        jam.renderModal('#main', eventSendWindow(_msgr, selectRows));
                        // _thisModel = createWindow({
                        //     title: `事件上送`,
                        //     width: '30vw',
                        //     height: '25vh',
                        //     body: eventSendWindow(_msgr, selectRows),
                        //     showBtn: false
                        // });
                    }
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
            components: [
                {
                    type: 'table',
                    styles: ['flex(1)', Styles.tableStyles],
                    dataWatcher: 'eventBasedSubmissionData',
                    ref: 'table',
                    dataDef: [],
                    onmount: function () {
                        this.addEventListener('click', function (e) {
                            const { target = null } = e;
                            if (!target) return;
                            if (target.classList.contains('table-checkbox')) {
                                const __key = target.id.split('_')[0];
                                selectRows.includes(__key) ? (selectRows = selectRows.filter((key) => key != __key)) : selectRows.push(__key);
                                const notSelectAll = [...document.querySelectorAll('.table-checkbox')].some((ele) => !ele.checked);
                                if (target.classList.contains('token-checkbox')) {
                                    document.getElementById('select-all-token-rows').checked = !notSelectAll;
                                } else if (target.classList.contains('restrain-checkbox')) {
                                    document.getElementById('select-all-restrain-rows').checked = !notSelectAll;
                                }
                            }
                            switch (target.id) {
                                case 'select-all-restrain-rows':
                                case 'select-all-token-rows':
                                    document.querySelectorAll('.table-checkbox').forEach((ele) => {
                                        ele.checked = target.checked;
                                    });

                                    if (target.checked) {
                                        selectRows = [...document.querySelectorAll('.table-checkbox')].map((ele) => ele.id);
                                    } else {
                                        selectRows = [];
                                    }
                                    break;

                                default:
                                    return;
                            }
                        });
                    }
                },
                {
                    type: 'pager',
                    styles: [
                        //
                        'size(minHeight:2.25rem)',
                        'margin(top:var(--gap-sm))'
                    ],
                    props: {
                        pageSizeList: [
                            {
                                value: '15',
                                name: '15条/页'
                            },
                            {
                                value: '50',
                                name: '50条/页'
                            },
                            {
                                value: '100',
                                name: '100条/页'
                            }
                        ],
                        total: 'eventBasedSubmissionData_total',
                        messageKey: 'eventBasedSubmissionData_key'
                    }
                }
            ]
        }
    ],
    vars: {
        bvList: [],
        devBvList: [],
        devTypeList: [],
        keyWords: ['测试', '模拟'],
        showAdd: true,
        bvData: [],
        provinceEnabled: true,
        showHandSure: false
    },
    watchers: {
        eventBasedSubmissionData_key(page) {
            if (page?.firstFetch) return;
            page.pageIndex = page.pageNumber;
            _page = {
                pageIndex: page.pageNumber,
                pageSize: page.pageSize
            };
            queryEventAlarm();
        },
        closeEvent() {
            jam.closeTopModal();
            // _thisModel && _thisModel.close();
        }
    },
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: async function () {
        getIfCustomizedEventEnabled();
        getEventAlarmTableColumnConfig();
        getAreaList();
        await getBvNameList();
        getEventTypeList();
        getEventLevelList();
        queryEventAlarm();
    }
};

/**
 * 获取是否显示事件编辑
 */
function getIfCustomizedEventEnabled() {
    ajaxCall('getIfCustomizedEventEnabled', {
        success(data) {
            if (!data.provinceEnabled) {
                _model.vars.provinceEnabled = false;
            }
        },
        error(error) {
            console.log(error);
        },
        params: {},
        useMock: false,
        type: 'get'
    });
}

/**
 * 获取表格展示的列
 */
function getEventAlarmTableColumnConfig() {
    let newCols = [];
    ajaxCall('getEventAlarmTableColumnConfig', {
        success(data) {
            let columns = data.columns;
            newCols = dataDef.filter((item) => {
                return columns[item.key];
            });
            newCols.unshift(dataDef[1]);
            newCols.unshift(dataDef[0]);
            _model.ref('table').dataDef = newCols;
            if (columns.confirmed) {
                //confirmed true显示手动确认按钮
                _model.vars.showHandSure = true;
            }
        },
        error(error) {},
        params: {},
        useMock: false,
        type: 'get'
    });
    return newCols;
}

/**
 * 获取区域列表
 */
function getAreaList() {
    ajaxCall('getRegionListNew', {
        success(data) {
            const regionList = [
                {
                    name: '全部',
                    value: null
                }
            ];

            (data || []).forEach((item) => regionList.push({ name: item.regionName, value: item.regionName }));
            _model.vars.regionList = regionList;
        },
        error(error) {
            console.log(error);
        },
        params: {},
        useMock: false,
        type: 'get'
    });
}

/**
 * 获取电压等级
 */
function getBvNameList() {
    return new Promise((r, j) => {
        ajaxCall('getBvNameList', {
            success(data) {
                let newData = [];
                data.forEach((item) => {
                    if (!item) return;
                    newData.push({
                        name: item,
                        value: item
                    });
                });
                _model.vars.bvData = newData.map((item) => item.value);
                _model.vars.bvList = newData;
                _model.vars.devBvList = newData;
                r(data);
            },
            error(err) {
                j(err);
            },
            params: {},
            useMock: false,
            type: 'get'
        });
    });
}

/**
 * 获取事件类型
 */
function getEventTypeList() {
    ajaxCall('getProvinceEventTypeList', {
        success(data) {
            eventTypeData = data;
            _model.vars.eventTypeList = data;
        },
        error(error) {
            console.log(error);
        },
        params: {},
        useMock: false,
        type: 'get'
    });
}

/**
 * 获取事件等级
 */
function getEventLevelList() {
    ajaxCall('getEventLevelList', {
        success(data) {
            eventLevelData = data;
            _model.vars.eventLevelList = data;
        },
        error(error) {
            console.log(error);
        },
        params: {},
        useMock: false,
        type: 'get'
    });
}

/**
 * 获取表格数据
 */
export function queryEventAlarm() {
    let params = {
        ...getFormParams(),
        ..._page
    };
    ajaxCall('queryEventAlarm', {
        success(data) {
            _model.vars.eventBasedSubmissionData = data.list;
            _model.vars.eventBasedSubmissionData_total = data.pojoTotalCount;
        },
        error(error) {
            console.log(error);
        },
        params: params,
        useMock: false,
        type: 'post'
    });
}

/**
 * 获取表单参数
 */
function getFormParams() {
    let bvNameData = _msgr.get('bvName');
    let bvVal = bvNameData;
    if (_model.vars.bvData.length == bvNameData.length) {
        bvVal = [];
    }
    let devBvNameData = _msgr.get('devBvName');
    let devNameVal = devBvNameData;
    if (_model.vars.devBvList.length == devBvNameData.length) {
        devNameVal = [];
    }
    let devTypeData = _msgr.get('devType');
    let devTypeVal = devTypeData;
    if (devTypeData.length == 3) {
        devTypeVal = [];
    }
    const notContains = _model.vars.keyWords;
    const params = {
        region: _msgr.get('regionId'),
        bvName: bvVal,
        devBvName: devNameVal,
        devType: devTypeVal,
        notContains,
        stName: _msgr.get('stName') ? _msgr.get('stName') : null,
        eventType: _msgr.get('eventType') ? _msgr.get('eventType') : null,
        eventLevel: _msgr.get('eventLevel') ? _msgr.get('eventLevel') : null,
        sendStatus: _msgr.get('sendStatus') ? _msgr.get('sendStatus') : null,
        beginDate: _msgr.get('beginDate') ? _msgr.get('beginDate') + ' 00:00:00' : '',
        endDate: _msgr.get('endDate') ? _msgr.get('endDate') + ' 23:59:59' : '',
        keyword: _msgr.get('keyWords') ? _msgr.get('keyWords') : null
    };
    return params;
}
