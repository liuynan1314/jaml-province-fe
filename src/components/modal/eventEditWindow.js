let _model = null;
let _msgr = null;

import { ajaxCall, formatterJameTime } from '../../common.js';
import moment from 'moment';
let isEventName;
let nameFormat = '',
    stName = '',
    bayName = '',
    brkName = '',
    devName = '',
    occurTime = moment().format('YYYY-MM-DD'),
    eventLevel = '',
    regionName = '',
    bvName = '';
let devTypeList = [
    {
        name: '全部',
        value: ''
    },
    {
        name: '交流线段',
        value: '交流线段'
    },
    {
        name: '交流线段端点',
        value: '交流线段端点'
    },
    {
        name: '母线',
        value: '母线'
    },
    {
        name: '变压器',
        value: '变压器'
    },
    {
        name: '断路器',
        value: '断路器'
    },
    {
        name: '负荷',
        value: '负荷'
    }
];
const eventEditWindow = (parent_msgr) => {
    return {
        type: 'card',
        icon: '',
        cap: '事件编辑',
        styles: [
            Styles.card.floating({
                width: '40vw',
                height: '75vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                id: 'eventEditWindow',
                styles: [
                    'size.fullsize',
                    Styles.stylesheet({
                        ':scope': {
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 'm',
                            'box-sizing': 'border-box'
                        },
                        '.form-wrapper': {
                            flexDirection: 'column',
                            width: '90%',
                            margin: '0 auto',
                            'span[slot=cap]': {
                                width: '6rem',
                                textAlign: 'right'
                            },
                            '.filterSelect': {
                                'jam-input': {
                                    width: '100%'
                                }
                            }
                        },
                        '.btn-wrapper': {
                            position: 'absolute',
                            bottom: '2rem',
                            justifyContent: 'center',
                            left: 0,
                            right: 0
                        }
                    })
                ],
                components: [
                    {
                        type: 'wrapper',
                        class: 'form-wrapper',
                        selectStyles: [Styles.select.regularStyleNew],
                        inputStyles: [Styles.input.regularStyleNew],
                        datepickerStyles: [Styles.datepicker.regularStyleNew],
                        components: [
                            {
                                type: 'select',
                                cap: '区域：',
                                valueKey: 'regionId',
                                data: '{{regionList}}',
                                onvaluechange: function (val) {
                                    _msgr.pub('stId', '');
                                    getStList({ regionId: val });
                                    regionName = _model.vars.regionList.filter((item) => item.value == val)[0].name;
                                }
                            },
                            {
                                type: 'filterSelect',
                                class: 'filterSelect',
                                styles: [Styles.input.regularStyleNew],
                                valueKey: 'stId',
                                props: { cap: '厂站', placeholder: '-请选择-', data: '{{stList}}', search: '{{name1}}', select: '{{stId}}' },
                                watchers: [
                                    {
                                        key: 'name11',
                                        callback: function (val) {
                                            getStList({ devName: val });
                                        },
                                        debounce: 600
                                    },
                                    {
                                        key: 'stId',
                                        callback: function (val) {
                                            _msgr.pub('bayId', '');
                                            getBayList({ stId: val });
                                            _msgr.pub('brkId', '');
                                            getBrkList({ stId: val });
                                            _msgr.pub('devId', '');
                                            getDevList({ stId: val });
                                            stName = _model.vars.stList.filter((item) => item.value == val)[0]?.name;
                                            getEventContent({ stName });
                                        },
                                        debounce: 600
                                    }
                                ]
                            },
                            {
                                type: 'datepicker',
                                valueKey: 'occurTime',
                                defaultValue: moment().format('YYYY-MM-DD'),
                                cap: '发生时间：',
                                onvaluechange: function (val) {
                                    occurTime = val + ' ' + moment().format('HH:mm:ss');
                                    getEventContent({ occurTime: val });
                                }
                            },
                            {
                                type: 'select',
                                cap: '事件类型：',
                                valueKey: 'eventType',
                                data: '{{eventTypeList}}',
                                onvaluechange: function (val) {
                                    _msgr.pub('eventName', '');
                                    getEventNameList({ eventType: val });
                                }
                            },
                            {
                                type: 'select',
                                cap: '事件等级：',
                                valueKey: 'eventLevel',
                                data: '{{eventLevelList}}',
                                showIf: '!{{autoGenerateContent}}'
                            },
                            {
                                type: 'select',
                                cap: '事件名称：',
                                valueKey: 'eventName',
                                data: '{{eventNameList}}',
                                showIf: '{{autoGenerateContent}}',
                                onvaluechange: function (val) {
                                    let res = _model.vars.eventNameList.filter((item) => item.value == val);
                                    nameFormat = res[0].format;
                                    eventLevel = res[0].level;
                                    getEventContent({ nameFormat, eventLevel });
                                }
                            },
                            {
                                type: 'select',
                                cap: '电压等级：',
                                valueKey: 'bvId',
                                data: '{{bvList}}',
                                onvaluechange: function (val) {
                                    _msgr.pub('bayId', '');
                                    getBayList({ bvId: val });
                                    _msgr.pub('brkId', '');
                                    getBrkList({ bvId: val });
                                    _msgr.pub('devId', '');
                                    getDevList({ bvId: val });
                                    bvName = _model.vars.bvList.filter((item) => item.value == val)[0].name;
                                }
                            },
                            // {
                            //     type: 'select',
                            //     cap: '间隔：',
                            //     valueKey: 'bayId',
                            //     data: '{{bayList}}',
                            //     onvaluechange: function (val) {
                            //         _msgr.pub('brkId', '');
                            //         getBrkList({ bayId: val });
                            //         _msgr.pub('devId', '');
                            //         getDevList({ bayId: val });
                            //         bayName = _model.vars.bayList.filter((item) => item.value == val)[0].name;
                            //     }
                            // },
                            {
                                type: 'filterSelect',
                                class: 'filterSelect',
                                styles: [Styles.input.regularStyleNew],
                                valueKey: 'bayId',
                                props: { cap: '间隔：', placeholder: '-请选择-', data: '{{bayList}}', search: '{{name2}}', select: '{{bayId}}' },
                                watchers: [
                                    {
                                        key: 'name2',
                                        callback: function (val) {
                                            getBayList({ devName: val });
                                        },
                                        debounce: 600
                                    },
                                    {
                                        key: 'bayId',
                                        callback: function (val) {
                                            _msgr.pub('brkId', '');
                                            getBrkList({ bayId: val });
                                            _msgr.pub('devId', '');
                                            getDevList({ bayId: val });
                                            bayName = _model.vars.bayList.filter((item) => item.value == val)[0]?.name;
                                        },
                                        debounce: 600
                                    }
                                ]
                            },
                            {
                                type: 'select',
                                cap: '设备类型：',
                                valueKey: 'devType',
                                data: devTypeList,
                                onvaluechange: function (val) {
                                    _msgr.pub('devId', '');
                                    getDevList({ devType: val });
                                    if (val == '断路器') {
                                        _model.vars.isShowBrk = false;
                                    }
                                    getEventContent();
                                }
                            },
                            // {
                            //     type: 'select',
                            //     cap: '设备：',
                            //     valueKey: 'devId',
                            //     data: '{{devList}}',
                            //     onvaluechange: function (val) {
                            //         devName = _model.vars.devList.filter((item) => item.value == val)[0].name;
                            //         getEventContent();
                            //     }
                            // },
                            {
                                type: 'filterSelect',
                                class: 'filterSelect',
                                styles: [Styles.input.regularStyleNew],
                                valueKey: 'devId',
                                props: { cap: '设备：', placeholder: '-请选择-', data: '{{devList}}', search: '{{name3}}', select: '{{devId}}' },
                                watchers: [
                                    {
                                        key: 'name3',
                                        callback: function (val) {
                                            getDevList({ devName: val });
                                        },
                                        debounce: 600
                                    },
                                    {
                                        key: 'devId',
                                        callback: function (val) {
                                            devName = _model.vars.devList.filter((item) => item.value == val)[0]?.name;
                                            getEventContent();
                                        },
                                        debounce: 600
                                    }
                                ]
                            },
                            // {
                            //     type: 'select',
                            //     cap: '断路器：',
                            //     valueKey: 'brkId',
                            //     data: '{{brkList}}',
                            //     showIf: '{{isShowBrk}}',
                            //     onvaluechange: function (val) {
                            //         brkName = _model.vars.brkList.filter((item) => item.value == val)[0].name;
                            //         getEventContent();
                            //     }
                            // },
                            {
                                type: 'filterSelect',
                                class: 'filterSelect',
                                styles: [Styles.input.regularStyleNew],
                                valueKey: 'brkId',
                                props: { cap: '断路器：', placeholder: '-请选择-', data: '{{brkList}}', search: '{{name4}}', select: '{{brkId}}' },
                                watchers: [
                                    {
                                        key: 'name4',
                                        callback: function (val) {
                                            getBrkList({ devName: val });
                                        },
                                        debounce: 600
                                    },
                                    {
                                        key: 'brkId',
                                        callback: function (val) {
                                            brkName = _model.vars.brkList.filter((item) => item.value == val)[0]?.name;
                                            getEventContent();
                                        },
                                        debounce: 600
                                    }
                                ]
                            },
                            {
                                type: 'input',
                                cap: '告警内容：',
                                valueKey: 'content'
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        buttonStyles: [Styles.searchBtnsStyles],
                        class: 'btn-wrapper',
                        components: [
                            {
                                type: 'button',
                                cap: '保存',
                                icon: 'floppy-disk',
                                class: 'jam-cta',
                                onclick: () => {
                                    saveEvent(parent_msgr);
                                }
                            },
                            {
                                type: 'button',
                                cap: '取消',
                                icon: 'xmark',
                                onclick: () => {
                                    parent_msgr.pub('closeEvent', new Date().getTime());
                                }
                            }
                        ]
                    }
                ],
                vars: {
                    isShowBrk: true
                },
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                onafterrender: function () {
                    getIfCustomizedEventEnabled();
                    getRegionList();
                    getStList({});
                    getEventInfoTypeList();
                    getEventNameList({});
                    getEventLevelList();
                    getBvList();
                    getBayList({});
                    getDevList({});
                    getBrkList({});
                }
            }
        ]
    };
};

/**
 * 获取是否展示区域
 */
function getIfCustomizedEventEnabled() {
    ajaxCall('getIfCustomizedEventEnabled', {
        success(data) {
            // data.autoGenerateContent 事件名称显示 事件等级不显示
            _model.vars.autoGenerateContent = data.autoGenerateContent;
            isEventName = data.autoGenerateContent;
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
 * 获取区域列表
 */
function getRegionList() {
    ajaxCall('getRegionListNew', {
        success(data) {
            let regionList = [];
            (data || []).forEach((item) => regionList.push({ name: item.regionName, value: item.regionId }));
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
 * 获取厂站列表
 */
function getStList({ regionId = '', devName = '' }) {
    console.log('getStList');
    ajaxCall('getJkDevInfoData', {
        success(data) {
            _model.vars.stList = data?.list.map((item) => ({ name: item.devName, value: item.devId }));
        },
        error(error) {
            console.log(error);
        },
        params: {
            pageIndex: 1,
            pageSize: 100,
            regionId: regionId ? regionId : _msgr.get('regionId'),
            devType: ['substation'],
            devName,
            selectColList: ['devId', 'devName']
        },
        useMock: false,
        type: 'post',
        uniqId: `getJkDevInfoData1_${Math.random(1, 1000000)}`
    });
}

/**
 * 获取事件类型
 */
function getEventInfoTypeList() {
    let url = isEventName ? 'getEventInfoTypeList' : 'getEventTypeList';
    ajaxCall(url, {
        success(data) {
            if (isEventName) {
                _model.vars.eventTypeList = data.map((item) => ({ name: item.typeName, value: item.type }));
            } else {
                _model.vars.eventTypeList = data;
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
 * 获取事件名称
 */
function getEventNameList({ eventType = '' }) {
    ajaxCall('getEventInfoList', {
        success(data) {
            _model.vars.eventNameList = data.map((item) => ({ name: item.name, value: item.ruleId }));
        },
        error(error) {
            console.log(error);
        },
        params: {
            type: eventType
        },
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
 * 获取电压等级
 */
function getBvList() {
    ajaxCall('getBvListNew', {
        success(data) {
            _model.vars.bvList = data.map((item) => ({ name: item.bvName, value: item.bvId }));
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
 * 获取间隔
 */
function getBayList({ stId = '', bvId = '', devName = '' }) {
    ajaxCall('getJkDevInfoData', {
        success(data) {
            _model.vars.bayList = data?.list.map((item) => ({ name: item.devName, value: item.devId }));
        },
        error(error) {
            console.log(error);
        },
        params: {
            pageIndex: 1,
            pageSize: 100,
            stId: stId ? stId : _msgr.get('stId'),
            bvId: bvId ? bvId : _msgr.get('bvId'),
            devType: ['bay'],
            devName: devName,
            selectColList: ['devId', 'devName']
        },
        useMock: false,
        type: 'post',
        uniqId: `getJkDevInfoData2_${Math.random(1, 1000000)}`
    });
}

/**
 * 获取设备
 */
function getDevList({ stId = '', bvId = '', bayId = '', devType = '', devName = '' }) {
    ajaxCall('getJkDevInfoData', {
        success(data) {
            _model.vars.devList = data?.list.map((item) => ({ name: item.devName, value: item.devId }));
        },
        error(error) {
            console.log(error);
        },
        params: {
            pageIndex: 1,
            pageSize: 100,
            stId: stId ? stId : _msgr.get('stId'),
            bvId: bvId ? bvId : _msgr.get('bvId'),
            bayId: bayId ? bayId : _msgr.get('bayId'),
            devType: dealDevType(devType ? devType : _msgr.get('devType')),
            devName: devName,
            selectColList: ['devId', 'devName']
        },
        useMock: false,
        type: 'post',
        uniqId: `getJkDevInfoData3_${Math.random(1, 1000000)}`
    });
}

/**
 * 获取断路器
 */
function getBrkList({ stId = '', bvId = '', bayId = '', devName = '' }) {
    ajaxCall('getJkDevInfoData', {
        success(data) {
            _model.vars.brkList = data?.list.map((item) => ({ name: item.devName, value: item.devId }));
        },
        error(error) {
            console.log(error);
        },
        params: {
            pageIndex: 1,
            pageSize: 100,
            stId: stId ? stId : _msgr.get('stId'),
            bvId: bvId ? bvId : _msgr.get('bvId'),
            bayId: bayId ? bayId : _msgr.get('bayId'),
            devType: ['CBR'],
            devName: devName,
            selectColList: ['devId', 'devName']
        },
        useMock: false,
        type: 'post',
        uniqId: `getJkDevInfoData4_${Math.random(1, 1000000)}`
    });
}

// 处理设备类型
function dealDevType(devType) {
    let devTypeName = '';
    switch (devType) {
        case '断路器':
            devTypeName = ['CBR'];
            break;
        case '交流线段':
            devTypeName = ['IFL'];
            break;
        case '交流线段端点':
            devTypeName = ['aclineend'];
            break;
        case '母线':
            devTypeName = ['EBus'];
            break;
        case '变压器':
            devTypeName = ['PTR'];
            break;
        case '负荷':
            devTypeName = ['FH'];
            break;
        default:
            devTypeName = ['CBR', 'IFL', 'aclineend', 'EBus', 'PTR', 'FH'];
    }
    return devTypeName;
}

/**
 * 获取告警内容
 */
function getEventContent() {
    // FAC：替换所选变电站、BAY：替换所选间隔、BREAKER：替换所选断路器、LINE/TR/DEV/BUS： 替换所选设备
    let content = nameFormat
        .replace(/\$FAC/g, stName)
        .replace(/\$BAY/g, bayName)
        .replace(/\$BREAKER/g, brkName)
        .replace(/\$LINE/g, devName)
        .replace(/\$TR/g, devName)
        .replace(/\$DEV/g, devName)
        .replace(/\$BUS/g, devName);
    _msgr.pub('content', isEventName ? occurTime + ' ' + content : `${occurTime}，${stName}，${devName}`);
}

/**
 * 保存
 */
function saveEvent(parent_msgr) {
    let formDataObject = {
        regionName: regionName,
        regionId: _msgr.get('regionId'),
        stName: stName,
        stId: _msgr.get('stId'),
        occurTime: occurTime,
        eventType: 1,
        ruleId: _msgr.get('eventName'),
        eventLevel: _msgr.get('eventLevel'),
        bvName: bvName,
        bvId: _msgr.get('bvId'),
        bayName: bayName,
        bayId: _msgr.get('bayId'),
        devName: devName,
        devId: _msgr.get('devId'),
        brkName: brkName,
        brkId: _msgr.get('brkId'),
        content: _msgr.get('content')
    };
    let devType = _msgr.get('devType');
    if (devType == '断路器') {
        formDataObject.brkName = devName;
        formDataObject.brkId = formDataObject.devId;
    }

    if (!formDataObject.stId) {
        nutmeg.error('请选择厂站！');
        return;
    }

    if (!formDataObject.devId) {
        nutmeg.error('请选择设备！');
        return;
    }

    if (!formDataObject.content) {
        nutmeg.error('请输入事件内容！');
        return;
    }
    ajaxCall('provinceCustomizeEventAlarm', {
        success(data) {
            nutmeg.success(data);
            parent_msgr.pub('closeEvent', new Date().getTime());
        },
        error(error) {
            console.log(error);
            nutmeg.error(error);
        },
        params: formDataObject,
        useMock: false,
        type: 'post',
        uniqId: `getJkDevInfoData4_${Math.random(1, 1000000)}`
    });
}

export default eventEditWindow;
