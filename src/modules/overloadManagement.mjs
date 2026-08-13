let _model = null;
let _msgr = null;
import { ajaxCall, formatterJameTime } from './../common.js';
import moment from 'moment';

let _thisModel = null;
let selectRows = [];
let dataDef = [
    {
        key: 'psrId',
        cap: '<input id="select-all-token-rows" class="table-checked" type="checkbox" style="height:45% !important;margin-left:0.8rem"></input>',
        width: '5.5%',
        sortable: false,
        formatter: (param) => {
            const _checkBox = document.createElement('input');
            _checkBox.type = 'checkbox';
            _checkBox.id = param + 'checkbox';
            _checkBox.classList.add('table-checkbox');
            _checkBox.classList.add('token-checkbox');
            _checkBox.style.cursor = 'pointer';
            return _checkBox;
        }
    },

    {
        key: 'regionName',
        cap: '区域',
        align: 'center',
        styles: [Styles.toShowAll],
        width: '12rem'
    },
    {
        key: 'devName',
        cap: '设备名称',
        align: 'center',
        styles: [Styles.toShowAll],
        width: '20rem'
    },
    {
        key: 'stName',
        cap: '所属厂站',
        align: 'center',
        styles: [Styles.toShowAll],
        width: '15rem'
    },
    {
        key: 'bvName',
        cap: '电压等级',
        align: 'center',
        styles: [Styles.toShowAll],
        width: '20rem'
    },
    {
        key: 'overLoadTime',
        cap: '当日重过载时长',
        styles: [Styles.toShowAll],
        align: 'center',
        width: '15rem'
    },
    {
        key: 'maxLoad',
        cap: '当日最大负荷',
        align: 'center',
        styles: [Styles.toShowAll],
        width: '15rem'
    },
    {
        key: 'maxLoadRate',
        cap: '当日最大负载率',
        align: 'center',
        styles: [Styles.toShowAll],
        width: '15rem'
    },
    {
        key: 'maxLoadStartTime',
        cap: '最大重过载发生时间',
        styles: [Styles.toShowAll],
        formatter: formatterJameTime,
        align: 'center',
        width: '22rem'
    },
    {
        key: 'maxLoadEndTime',
        cap: '最大重过载结束时间',
        align: 'center',
        formatter: formatterJameTime,
        styles: [Styles.toShowAll],
        width: '22rem'
    },
    {
        key: 'loadType',
        cap: '重过载类型',
        align: 'center',
        styles: [Styles.toShowAll],
        width: '12rem',
        formatter: function (d) {
            if (d == '0') {
                return '正常';
            } else if (d == '1') {
                return '重载';
            } else if (d == '2') {
                return '过载';
            }
        }
    },
    {
        key: 'loadRate',
        cap: '实时负载率',
        styles: [Styles.toShowAll],
        align: 'center',
        width: '12rem'
    },
    {
        key: 'startTime',
        cap: '重过载发生时间',
        styles: [Styles.toShowAll],
        formatter: formatterJameTime,
        align: 'center',
        width: '22rem'
    },
    {
        key: 'endTime',
        cap: '重过载结束时间',
        styles: [Styles.toShowAll],
        formatter: formatterJameTime,
        align: 'center',
        width: '22rem'
    },
    {
        key: 'overLoadNum',
        cap: '当日重过载次数',
        align: 'center',
        width: '15rem'
    },
    {
        key: 'trwdTemp',
        cap: '主变油温',
        align: 'center',
        width: '12rem'
    },
    {
        key: 'windTemp',
        cap: '绕组温度',
        align: 'center',
        width: '12rem'
    },
    {
        key: 'rateCap',
        cap: '主变容量',
        width: '12rem',
        align: 'center'
    },
    {
        key: 'isWhiteList',
        cap: '是否白名单',
        align: 'center',
        width: '12rem',
        formatter: function (d) {
            return d == 'false' ? '否' : '是';
        }
    },
    {
        key: 'isBlackList',
        cap: '是否黑名单',
        align: 'center',
        width: '12rem',
        formatter: function (d) {
            return d == 'false' ? '否' : '是';
        }
    }
];
export default {
    type: 'wrapper',
    class: 'overloadManagement',
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
                        height: '1.8rem',
                        borderRadius: 's',
                        minWidth: '12rem',
                        border: `s solid hsl(204.49 , 92.45%, 41.57%)`,
                        alignItems: 'center',
                        position: 'relative',
                        maxWidth: '50%',
                        overflow: 'auto',
                        '.button-style': {
                            height: '1.5rem',
                            background: 'rgba(0,0,0,0)',
                            border: 's solid var(--jam-color-primary-subtle)'
                        },
                        '.add-button': {
                            position: 'absolute',
                            width: '4rem',
                            right: '0.5rem'
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
                            cap: '上送总部状态：',
                            valueKey: 'sendStatus',
                            placeholder: '请选择上送总部状态',
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
                            type: 'select',
                            cap: '上送中台状态：',
                            valueKey: 'sendMCCStatus',
                            placeholder: '请选择上送中台状态',
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
                            type: 'select',
                            cap: '重过载类型：',
                            valueKey: 'overloadType',
                            placeholder: '请选择重过载类型',
                            data: [
                                {
                                    name: '正常（恢复）',
                                    value: 0
                                },
                                {
                                    name: '重载',
                                    value: 1
                                },
                                {
                                    name: '过载',
                                    value: 2
                                }
                            ],
                            styles: [Styles.select.regularStyleNew]
                        },
                        {
                            type: 'datepicker',
                            valueKey: 'beginDate',
                            // defaultValue: moment().format('YYYY-MM-DD'),
                            cap: '开始时间：',
                            styles: [Styles.datepicker.regularStyleNew]
                        },
                        {
                            type: 'datepicker',
                            valueKey: 'endDate',
                            // defaultValue: moment().format('YYYY-MM-DD'),
                            cap: '结束时间：',
                            styles: [Styles.datepicker.regularStyleNew]
                        },
                        {
                            type: 'button',
                            cap: '查询',
                            icon: 'search',
                            class: 'jam-cta',
                            onclick: function () {
                                getInitTableData();
                            }
                        }
                        // {
                        //     type: 'button',
                        //     cap: '导出',
                        //     icon: 'file-export',
                        //     onclick: function () {
                        //         nusp.exportArray2Excel(
                        //             [
                        //                 {
                        //                     name: '重过载发生时间',
                        //                     key: 'overLoadStartTime'
                        //                 }
                        //             ],
                        //             '重过载上送'
                        //         );
                        //         // exportExcel(urlConfig['exportEventByParam'].url, packageParams(), `事件化统计_${moment().format('yyyyMMDDHHmmssSSS')}.xlsx`, 'post');
                        //     }
                        // }
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
                    cap: '上送总部',
                    icon: 'cloud-upload',
                    onclick: function () {
                        if (selectRows.length == 0) {
                            nutmeg.error('请选择要上送总部的重过载记录');
                            return;
                        } else {
                            var psrIds = selectRows;
                            sendFun(0, psrIds);
                        }
                    }
                },
                {
                    type: 'button',
                    cap: '上送中台',
                    icon: 'cloud-upload',
                    onclick: function () {
                        if (selectRows.length == 0) {
                            nutmeg.error('请选择要上送中台的重过载记录');
                            return;
                        } else {
                            var psrIds = selectRows;
                            sendFun(1, psrIds);
                        }
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
                    styles: ['flex(1)', Styles.tableStyles, 'size(minWidth:max-content)', Styles.css({ width: 'max-content', overflowX: 'auto' })],
                    dataWatcher: 'overloadManagementData',
                    ref: 'table',
                    dataDef: [],
                    onmount: function () {
                        this.addEventListener('click', function (e) {
                            const { target = null } = e;
                            if (!target) return;
                            if (target.classList.contains('table-checkbox')) {
                                const __key = target.id.replace('checkbox', '');
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
                                        selectRows = [...document.querySelectorAll('.table-checkbox')].map((ele) => ele.id?.replace('checkbox', ''));
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
                                value: '20',
                                name: '20条/页'
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
                        total: 'overloadManagementData_total',
                        messageKey: 'overloadManagement_key'
                    }
                }
            ]
        }
    ],

    watchers: {
        overloadManagement_key(page) {
            if (page?.firstFetch) return;
            page.pageIndex = page.pageNumber;
            const _page = {
                pageIndex: page.pageNumber,
                pageSize: page.pageSize
            };
            getInitTableData(_page);
        }
    },
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: async function () {
        getIsShowButton();
        getInitTableData();
    }
};
// 先获取判断是否展示上送总部和上送中台
function getIsShowButton() {
    ajaxCall('getProvinceSendConf', {
        success(data) {
            if (data.send2HQ) {
                _msgr.pub('zbWrap', data.send2HQ);
                dataDef.push({
                    key: 'sendStatus',
                    cap: '上送总部状态',
                    align: 'center',
                    width: '16rem',
                    formatter: function (d) {
                        if (d == 0) {
                            return '未发送';
                        } else if (d == 1) {
                            return '发送成功';
                        } else {
                            return '发送失败';
                        }
                    }
                });
            }
            if (data.send2MCC) {
                //上送中台
                _msgr.pub('zbMCWrap', data.send2MCC);
                dataDef.push({
                    key: 'sendMCCStatus',
                    cap: '上送中台状态',
                    width: '16rem',
                    align: 'center',
                    formatter: function (d) {
                        if (d == 0) {
                            return '未发送';
                        } else if (d == 1) {
                            return '发送成功';
                        } else {
                            return '发送失败';
                        }
                    }
                });
            }
            _model.ref('table').dataDef = dataDef;
        },
        error(error) {
            console.log(error);
        },
        params: {},
        useMock: false,
        type: 'get'
    });
}

// 获取重过载数据
function getInitTableData(page = { pageIndex: 1, pageSize: 20 }) {
    let params = {
        beginDate: _msgr.get('beginDate') ? _msgr.get('beginDate') : '',
        endDate: _msgr.get('endDate') ? _msgr.get('endDate') : '',
        loadType: _msgr.get('overloadType') || '',
        sendMCCStatus: _msgr.get('sendMCCStatus') || '',
        sendStatus: _msgr.get('sendStatus') || '',
        stName: _msgr.get('stName') || '',
        pageIndex: page.pageIndex,
        pageSize: page.pageSize
    };
    ajaxCall('queryOverload', {
        success(data) {
            if (data.list) {
                data.list.forEach(function (item) {
                    if (!item.extInfo || item.extInfo == 'null') {
                        item.regionName = '';
                        item.bvName = '';
                    } else {
                        item.regionName = isValidJSON(item.extInfo) ? JSON.parse(item.extInfo).regionName : '';
                        item.bvName = isValidJSON(item.extInfo) ? JSON.parse(item.extInfo).bvName : '';
                    }
                });
                _model.vars.overloadManagementData = data.list;
                _model.vars.overloadManagementData_total = data.pojoTotalCount;
            }
        },
        error(error) {
            console.log(error);
        },
        params: params,
        useMock: false,
        type: 'post'
    });
}
// 判断json格式是否合法
function isValidJSON(text) {
    try {
        JSON.parse(text);
        return true;
    } catch (error) {
        return false;
    }
}

function sendFun(type, psrIds) {
    let params = {
        psrIdList: psrIds,
        receiver: type
    };
    ajaxCall('sendOverload', {
        success(data) {
            nutmeg.success('上送成功');
            getInitTableData();
        },
        error(error) {
            console.log(error);
            nutmeg.error('上送失败');
            getInitTableData();
        },
        params: params,
        useMock: false,
        type: 'post'
    });
}
