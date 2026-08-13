let _model, _msgr, _this;
import { ajaxCall, formatterJameTime, formatterJameBv } from '../../common.js';
import { urlConfig } from '../../global.js';
// import { createWindow } from '../createWindow.js';
import remoteVideoAccess from './remoteVideoAccess.js';
import { buildTable } from '../componentBuilder.js';
export default (params = {}) => {
    const current = params.occurTime ? jam.formatDate(params.occurTime, 'yyyy-MM-dd') : params.isToday === false ? moment().subtract(1, 'day').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    return {
        type: 'card',
        icon: '',
        cap: '主辅告警列表',
        styles: [
            Styles.card.floating({
                width: '72vw',
                height: '68vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                id: 'mainAndAuxAlarmWindow',
                styles: [
                    'size.fullsize',
                    Styles.stylesheet({
                        ':scope': {
                            display: 'flex',
                            flexDirection: 'column',
                            '.form-box': {
                                display: 'flex',
                                flexWrap: 'wrap'
                            }
                        }
                    })
                ],
                components: [
                    {
                        type: 'wrapper',
                        class: 'form-box',
                        descStyles: {
                            datepicker: [Styles.icon.duotone, Styles.datepicker.regularStyle],
                            button: [Styles.searchBtnsStyles, Styles.button.css({ margin: '0.2rem 0.5rem' })],
                            select: [Styles.icon.duotone, Styles.select.regularStyle, Styles.select.agent.css({ width: '11rem' })],
                            input: [Styles.icon.duotone, Styles.input.regularStyle]
                        },
                        components: [
                            {
                                type: 'filterSelect',
                                class: 'unifycap',
                                props: { icon: 'transformer-bolt', cap: `厂站名称：`, data: '{{stList}}', search: '{{stName}}', select: '{{stId}}' },
                                watchers: {
                                    stName: jam.makeDebounce(function (val) {
                                        getSubstationList(val);
                                    }, 500)
                                }
                            },
                            {
                                type: 'filterSelect',
                                class: 'unifycap',
                                props: { icon: 'transformer-bolt', cap: `间隔名称：`, data: '{{bayListData}}', search: '{{bayName}}', select: '{{bayId}}' },
                                watchers: {
                                    bayName: jam.makeDebounce(function (bayName) {
                                        getBayListData(bayName);
                                    }, 500)
                                }
                            },
                            {
                                type: 'filterSelect',
                                class: 'unifycap',
                                props: { icon: 'transformer-bolt', cap: `设备名称：`, data: '{{devListData}}', search: '{{devName}}', select: '{{devId}}' },
                                watchers: {
                                    devName: jam.makeDebounce(function (devName) {
                                        getDeviceListData(devName);
                                    }, 500)
                                }
                            },
                            {
                                type: 'datepicker',
                                valueKey: 'beginDate',
                                icon: 'calendar',
                                cap: '开始时间：'
                            },
                            {
                                type: 'datepicker',
                                valueKey: 'endDate',
                                icon: 'calendar',
                                cap: '结束时间：'
                            },
                            {
                                type: 'select',
                                cap: '告警类型：',
                                icon: 'bell-plus',
                                valueKey: 'alarmClassification',
                                data: [
                                    { value: '', name: '全部' },
                                    { value: 'sg', name: '事故' },
                                    { value: 'yc', name: '异常' },
                                    { value: 'yx', name: '越限' },
                                    { value: 'bw', name: '变位' },
                                    { value: 'gz', name: '告知' }
                                ]
                            },
                            {
                                type: 'select',
                                cap: '设备类型：',
                                valueKey: 'devType',
                                icon: 'tablet-rugged',
                                // defaultValue: '0',
                                data: [
                                    { value: '0', name: '主设备' },
                                    { value: '1', name: '辅设备' }
                                ]
                            },
                            {
                                type: 'input',
                                cap: '告警内容：',
                                icon: 'hammer',
                                valueKey: 'content',
                                placeholder: '请输入告警内容'
                            },
                            {
                                type: 'select',
                                cap: '复归状态：',
                                icon: 'bell-plus',
                                valueKey: 'fgStatus',
                                data: [
                                    { value: null, name: '全部' },
                                    { value: '0', name: '已复归' },
                                    { value: '1', name: '未复归' }
                                ]
                            },
                            {
                                type: 'button',
                                cap: '查询',
                                icon: 'search',
                                class: 'jam-cta',
                                onclick: function () {
                                    initData();
                                }
                            },
                            {
                                type: 'button',
                                cap: '重置',
                                icon: 'repeat',
                                onclick: function () {
                                    _msgr.pub('beginDate', current);
                                    _msgr.pub('endDate', current);
                                    _msgr.pub('stId', '');
                                    _msgr.pub('stName', '');
                                    _msgr.pub('bayId', '');
                                    _msgr.pub('bayName', '');
                                    _msgr.pub('alarmClassification', '');
                                    _msgr.pub('devType', '');
                                    _msgr.pub('fgStatus', null);

                                    _msgr.pub('devId', '');
                                    _msgr.pub('devName', '');
                                }
                            }
                        ]
                    },
                    buildTable({
                        cap: '主辅告警列表-表格',
                        dataKey: 'mainAndAuxAlarmData',
                        dataDef: [
                            {
                                cap: 'devId',
                                key: 'devId',
                                show: false
                            },
                            {
                                cap: 'keyId',
                                key: 'keyId',
                                show: false
                            },
                            {
                                cap: '发生时间',
                                key: 'occurTime',
                                align: 'center',
                                formatter: formatterJameTime
                            },
                            {
                                cap: '变电站',
                                key: 'stName',
                                sortable: false,
                                formatter: function (val) {
                                    return val || '--';
                                }
                            },
                            {
                                cap: '间隔',
                                key: 'bayName',
                                align: 'left',
                                sortable: false,
                                formatter: function (val) {
                                    return val || '--';
                                }
                            },
                            {
                                cap: '电压等级',
                                key: 'bvName',
                                sortable: false,
                                formatter: formatterJameBv
                            },
                            {
                                cap: '告警内容',
                                key: 'content',
                                align: 'left',
                                class: 'item-content',
                                sortable: false,
                                formatter: function (val) {
                                    let occurTime = this.col(2);
                                    let stName = this.col(3);
                                    return val ? val.replace(moment(occurTime).format('YYYY年MM月DD日  HH:mm:ss'), '').replace(stName, '') : '--';
                                }
                            },
                            {
                                cap: '告警类型',
                                key: 'customizedGroupName',
                                sortable: false,
                                formatter: function (val) {
                                    return { sg: '事故', yc: '异常', yx: '越限', bw: '变位', gz: '告知' }[val] || '--';
                                }
                            },
                            {
                                cap: '设备类型',
                                key: 'mainAuxTypeName',
                                sortable: false,
                                formatter: function (val) {
                                    return val || '--';
                                }
                            },
                            {
                                cap: '确认状态',
                                key: 'confirmStatusName',
                                sortable: false,
                                formatter: function (val) {
                                    return val || '--';
                                }
                            },
                            {
                                cap: '确认时间',
                                key: 'confirmTime',
                                sortable: false,
                                formatter: function (val) {
                                    return val || '--';
                                }
                            },
                            {
                                cap: '复归状态',
                                key: 'fgStatusName',
                                sortable: false,
                                formatter: function (val) {
                                    return val || '--';
                                }
                            },
                            {
                                cap: '操作',
                                sortable: false,
                                type: 'buttongroup',
                                data: [
                                    {
                                        name: '智能联动',
                                        value: 1
                                    }
                                ],
                                onclick() {
                                    const devId = this.col(0);
                                    const keyId = this.col(1);
                                    locateDevice(devId, keyId);
                                    jam.renderModal('#main', remoteVideoAccess({ devId }));

                                    // createWindow({
                                    //     title: `智巡视频调阅`,
                                    //     width: '75vw',
                                    //     height: '75vh',
                                    //     body: remoteVideoAccess({ devId }),
                                    //     showBtn: false
                                    // });
                                }
                            }
                        ],
                        getReqParams: function () {
                            const _p = {
                                startTime: _msgr.get('beginDate') + ' 00:00:00',
                                endTime: _msgr.get('endDate') + ' 23:59:59',
                                stIdList: _msgr.get('stId') ? [_msgr.get('stId')] : [],
                                bayIdList: _msgr.get('bayId') ? [_msgr.get('bayId')] : [],
                                devIdList: _msgr.get('devId') ? [_msgr.get('devId')] : [],
                                alarmClassification: _msgr.get('alarmClassification') ? [_msgr.get('alarmClassification')] : [],
                                fgStatus: _msgr.get('fgStatus'),
                                mainAux: _msgr.get('devType'),
                                content: _msgr.get('content')
                            };
                            return {
                                method: 'post',
                                data: {
                                    pageNum: this.model.cpageNo || 1,
                                    pageSize: this.model.cpageSize || 20,
                                    ..._p
                                },
                                urlKey: 'mainAndAuxAlarmInfo',
                                transform: (res) => {
                                    const { records = [], total = 0 } = res?.data || {};
                                    this.model.ctotal = total;
                                    return records;
                                }
                            };
                        }
                    })
                ],
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                    _this = this;
                },
                watchers: [
                    {
                        key: 'stId',
                        callback: function () {
                            _msgr.pub('bayId', '');
                            _msgr.pub('bayName', '');
                            _msgr.pub('devId', '');
                            _msgr.pub('devName', '');
                        }
                    },
                    {
                        key: 'bayId',
                        callback: function () {
                            _msgr.pub('devId', '');
                            _msgr.pub('devName', '');
                        }
                    }
                ],
                onafterrender: async function () {
                    _msgr.pub('beginDate', current);
                    _msgr.pub('endDate', current);
                    _msgr.pub('alarmClassification', params.alarmClassification ?? '');
                    params.via === 'mainAuxCard' ? _msgr.pub('devType', params.devType ?? '') : null;
                    await getSubstationList(params.stName, params);
                }
            }
        ]
    };
};

function initData() {
    _this.msgr('page').pub('_t', Date.now());
}

/**
 * 获取变电站列表
 */
async function getSubstationList(devName = '', params = null) {
    ajaxCall(
        'getSubstationList',
        {
            success(data) {
                _model.vars.stList = data?.map((item) => ({ name: item.devName, value: item.devId }));
                if (params) {
                    _msgr.pub('stId', params.stId);
                    _msgr.pub('stName', params.stName);
                    getBayListData(params?.bayName, params);
                }
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
 * 间隔下拉框
 */
function getBayListData(bayName = '', params) {
    ajaxCall(
        'getSubstationList',
        {
            success(res) {
                _model.vars.bayListData = res?.map((item) => ({ name: item.devName, value: item.devId })) || [];

                if (params) {
                    _msgr.pub('bayId', params.bayId);
                    _msgr.pub('bayName', params.bayName);
                    getDeviceListData(params?.devName, params);
                }
            },
            useMock: false,
            params: {
                stId: params ? params.stId : _msgr.get('stId'),
                devName: bayName,
                devType: ['bay'],
                count: 100
            },
            type: 'post',
            uniqId: `getSubstationList_${Math.random(1, 1000000)}`,
            error() {},
            complete() {}
        },

        false
    );
}

/**
 * 设备名称下拉框
 */
function getDeviceListData(devName = '', params) {
    ajaxCall(
        'getSubstationList',
        {
            success(res) {
                _model.vars.devListData = res?.map((item) => ({ name: item.devName, value: item.devId })) || [];

                if (params) {
                    _msgr.pub('devId', params.devId);
                    _msgr.pub('devName', params.devName);
                    initData();
                }
            },
            useMock: false,
            params: {
                stId: params ? params.stId : _msgr.get('stId'),
                bayId: params ? params.bayId : _msgr.get('bayId'),
                devName: devName,
                count: 100
            },
            type: 'post',
            uniqId: `getSubstationList_${Math.random(1, 1000000)}`,
            error() {},
            complete() {}
        },

        false
    );
}
function locateDevice(devId = '', keyId = '') {
    ajaxCall('@_@', {
        url: `${urlConfig.locateDevice.url}?devId=${devId}&keyId=${keyId}`,
        success(res) {
            nutmeg.success('远程调阅智巡视频成功');
        },
        useMock: true
    });
}
