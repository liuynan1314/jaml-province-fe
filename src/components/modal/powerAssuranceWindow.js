import { ajaxCall } from '../../common.js';
import { getUserName } from '../../modules/importantUser.mjs';
// import { createWindow } from '../../components/createWindow.js';
import devListWindow from './devListWindow.js';
let _model, _msgr, thisModel, fh;

const powerAssuranceWindow = (params) => {
    return {
        type: 'card',
        icon: '',
        cap: params?._titel || '',
        styles: [
            Styles.card.floating({
                width: '25vw',
                height: '50vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                broker: 'diff',
                id: 'powerAssuranceWindow',
                styles: [
                    'props(display:flex;flexDirection:column;position:relative;)',
                    'size.fullsize',
                    Styles.stylesheet({
                        ':scope': {
                            // padding: '0.8rem'
                        },
                        '.form_wrapper': {
                            // width: '100%',
                            height: 'calc(100% - 5rem)',
                            display: 'flex',
                            flexDirection: 'column',
                            '.add_btn': {
                                width: '4rem !important',
                                padding: '0 !important',
                                justifyContent: 'flex-start'
                            },
                            '.form_item': {
                                marginBottom: 's',
                                '--jam-agent-width': '11.25rem',
                                display: 'flex'
                            },
                            'jam-button': {
                                marginLeft: '5rem'
                            }
                        },
                        '.devList': {
                            alignItems: 'flex-start'
                        },
                        '.editIcon': {
                            marginLeft: 'm',
                            cursor: 'pointer',
                            color: 'transparent'
                        },
                        '.devListBox': {
                            width: '27rem',
                            height: 'auto',
                            overflowY: 'auto',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            borderRadius: 's',
                            border: 's solid',
                            borderColor: 'var(--jam-color-outline-muted)',
                            minHeight: '4.8rem',
                            maxHeight: '10rem',
                            padding: 's',
                            'jam-button': {
                                marginLeft: 0
                            },
                            'jam-label': {
                                padding: 'm',
                                borderRadius: 0,
                                border: 's solid',
                                height: '2rem',
                                marginRight: 's',
                                fontSize: 's',
                                marginBottom: 's',
                                borderColor: 'var(--jam-color-outline-subtle)',
                                background: 'transparent'
                            },
                            '.wrapper slot[name=tag]': {
                                flexWrap: 'wrap'
                            }
                        }
                    })
                ],
                components: [
                    {
                        type: 'wrapper',
                        class: 'form_wrapper',
                        components: [
                            {
                                buildIf: '{{formList.type}} == 3',
                                type: 'input',
                                styles: [
                                    Styles.input.regularStyleDiff,
                                    Styles.input.agent.css({
                                        borderColor: 'var(--jam-color-outline-muted)',
                                        width: '11.25rem'
                                    })
                                ],
                                cap: '场景名称：',
                                defaultValue: '{{formList.name}}',
                                class: 'form_item',
                                valueKey: 'name'
                                // rules: {
                                //     required: true,
                                //     triggers: ['blur', 'valuechange']
                                // }
                            },
                            // {
                            //     type: 'select',
                            //     styles: [
                            //         Styles.select.regularStyleDiff,
                            //         Styles.select.agent.css({
                            //             background: tint
                            //         })
                            //     ],
                            //     cap: '保电类型:',
                            //     defaultValue: '{{formList.type}}',
                            //     class: 'form_item',
                            //     valueKey: 'type',
                            //     data: [
                            //         { name: '重要用户', value: 1 },
                            //         { name: '重要活动', value: 2 },
                            //         { name: '重大保电', value: 3 }
                            //     ]
                            // },
                            {
                                buildIf: '{{formList.type}} == 1',
                                type: 'input',
                                styles: [
                                    Styles.input.regularStyleDiff,
                                    Styles.input.agent.css({
                                        width: '11.25rem',
                                        borderColor: 'var(--jam-color-outline-muted)'
                                    })
                                ],
                                cap: '用户名称：',
                                defaultValue: '{{formList.name}}',
                                class: 'form_item',
                                valueKey: 'name'
                                // rules: {
                                //     required: true,
                                //     triggers: ['blur', 'valuechange']
                                // }
                            },
                            {
                                buildIf: '{{formList.type}} == 2',
                                type: 'input',
                                styles: [
                                    Styles.input.regularStyleDiff,
                                    Styles.input.agent.css({
                                        width: '11.25rem',
                                        borderColor: 'var(--jam-color-outline-muted)'
                                    })
                                ],
                                cap: '活动名称：',
                                defaultValue: '{{formList.name}}',
                                class: 'form_item',
                                valueKey: 'name'
                                // rules: {
                                //     required: true,
                                //     triggers: ['blur', 'valuechange']
                                // }
                            },
                            {
                                buildIf: '{{formList.type}} == 3',
                                type: 'select',
                                styles: [Styles.select.regularStyleDiff],
                                class: 'form_item',
                                cap: '保电类型：',
                                defaultValue: '{{formList.subType}}',
                                valueKey: 'subType',
                                data: [
                                    { name: '重大保电', value: '重大保电' },
                                    { name: '极端天气', value: '极端天气' },
                                    { name: '汛期', value: '汛期' },
                                    { name: '山火', value: '山火' }
                                ]
                                // rules: {
                                //     required: true,
                                //     triggers: ['blur', 'valuechange']
                                // }
                            },
                            {
                                buildIf: '{{formList.type}} == 1',
                                type: 'select',
                                styles: [Styles.select.regularStyleDiff],
                                class: 'form_item',
                                cap: '用户类型：',
                                defaultValue: '{{formList.subType}}',
                                valueKey: 'subType',
                                data: [
                                    { name: '政府', value: '政府' },
                                    { name: '机场', value: '机场' },
                                    { name: '医院', value: '医院' },
                                    { name: '车站', value: '车站' }
                                ]
                                // rules: {
                                //     required: true,
                                //     triggers: ['blur', 'valuechange']
                                // }
                            },
                            {
                                buildIf: '{{formList.type}} == 2',
                                type: 'select',
                                styles: [Styles.select.regularStyleDiff],
                                class: 'form_item',
                                cap: '保电等级：',
                                defaultValue: '{{formList.level}}',
                                valueKey: 'level',
                                data: [
                                    { name: '特级', value: '特级' },
                                    { name: '一级', value: '一级' },
                                    { name: '二级', value: '二级' },
                                    { name: '三级', value: '三级' }
                                ]
                                // rules: {
                                //     required: true,
                                //     triggers: ['blur', 'valuechange']
                                // }
                            },
                            {
                                buildIf: '{{formList.type}} == 2',
                                type: 'wrapper',
                                class: 'form_item',
                                components: [
                                    {
                                        type: 'datepicker',
                                        valueKey: 'beginTime',
                                        cap: '时间范围：',
                                        max: '{{endTime}}',
                                        styles: [Styles.datepicker.regularStyleDiff]
                                    },
                                    {
                                        type: 'datepicker',
                                        valueKey: 'endTime',
                                        cap: '-',
                                        min: '{{beginTime}}',
                                        styles: [Styles.datepicker.regularStyleDiff]
                                    }
                                ]
                                // rules: {
                                //     required: true,
                                //     triggers: ['blur', 'valuechange']
                                // }
                            },
                            {
                                type: 'select',
                                styles: [Styles.select.regularStyleDiff],
                                class: 'form_item',
                                cap: '所属区域：',
                                defaultValue: '{{formList.regionId}}',
                                valueKey: 'regionId',
                                data: '{{regionList}}'
                                // rules: {
                                //     required: true,
                                //     triggers: ['blur', 'valuechange']
                                // }
                            },
                            {
                                type: 'wrapper',
                                class: 'form_item',
                                components: [
                                    {
                                        type: 'label',
                                        class: 'devList',
                                        cap: '保电设备：'
                                    },
                                    {
                                        type: 'wrapper',
                                        class: 'devListBox',
                                        components: [
                                            // {
                                            //     buildFor: '(item,index) in devList',
                                            //     type: 'label',
                                            //     class: 'devItem',
                                            //     cap: '{{item.devName}}'
                                            // },
                                            {
                                                type: 'tags',
                                                removable: true,
                                                styles: ['tags.css(--jam-tagslot-flex-wrap:wrap)'],
                                                dataWatcher: 'devList',
                                                // valueKey: 'targetChecked',
                                                onvaluechange: function (val) {
                                                    console.log('val', val);
                                                    let _list = _msgr.get('devList') || [];
                                                    const newList = [];
                                                    _list.forEach((item) => {
                                                        if (val.indexOf(item.devId) !== -1) {
                                                            newList.push(item);
                                                        }
                                                    });

                                                    _msgr.pub('devList', newList);
                                                }
                                            },
                                            {
                                                type: 'button',
                                                class: 'add_btn jam-cta',
                                                icon: 'plus',
                                                cap: '增加',
                                                styles: [Styles.icon.duotone, Styles.searchBtnsStyles],
                                                onclick: function () {
                                                    openDevWindow();
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                buildIf: '{{formList.type}} == 1',
                                type: 'wrapper',
                                class: 'form_item',
                                buildFor: '(item,index) in formList.fhList',
                                components: [
                                    {
                                        type: 'filterSelect',
                                        id: '"fh" + {{item.id}}',
                                        styles: [
                                            Styles.input.regularStyleDiff,
                                            Styles.input.agent.css({
                                                borderColor: 'var(--jam-color-outline-muted)',
                                                width: '100%'
                                            })
                                        ],
                                        props: { cap: '保电负荷：', data: '{{fhArr}}', search: '{{item.fhName}}', defaultValue: '{{item.fhName}}', select: '{{item.fhId}}' },
                                        watchers: {
                                            async 'item.fhName'(val) {
                                                getFhList(val);
                                            }
                                        }
                                    },
                                    {
                                        type: 'filterSelect',
                                        id: '"brk" + {{item.id}}',
                                        styles: [
                                            'props(marginLeft:m)',
                                            Styles.input.regularStyleDiff,
                                            Styles.input.agent.css({
                                                borderColor: 'var(--jam-color-outline-muted)',
                                                width: '100%'
                                            })
                                        ],
                                        props: { cap: '保电开关：', data: '{{brkList}}', search: '{{item.brkName}}', defaultValue: '{{item.brkName}}', select: '{{item.brkId}}' },
                                        watchers: {
                                            async 'item.brkName'(val) {
                                                let _id = 0;
                                                if (this.getAttribute('id')) {
                                                    _id = Number(this.getAttribute('id').replace('brk', '')) || 0;
                                                }
                                                const _list = _model.vars.formList.fhList || [];
                                                getbrkList(_list[_id], val);
                                            }
                                        }
                                    },
                                    {
                                        type: 'label',
                                        class: 'editIcon',
                                        icon: 'trash-can',
                                        cap: '{{item.id}}',
                                        styles: [Styles.icon.duotone],
                                        onclick: function () {
                                            console.log(this.cap);
                                            let _list = _model.vars.formList.fhList;
                                            _list = _list.filter((item) => item.id != this.cap);
                                            _model.vars.formList.fhList = _list;
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'button',
                                buildIf: '{{formList.type}} == 1',
                                class: 'add_btn jam-cta',
                                icon: 'plus',
                                cap: '增加',
                                styles: [Styles.icon.duotone, Styles.searchBtnsStyles],
                                onclick: function () {
                                    const list = jam.cloneDeep(_model.vars.formList.fhList || []);
                                    const id = list.length;
                                    if (list.length == 0 || (list[list.length - 1].fhId && list[list.length - 1].brkId)) {
                                        const newItem = {
                                            id,
                                            fhId: '',
                                            fhName: '',
                                            brkId: '',
                                            brkName: '',
                                            stId: '',
                                            bayId: ''
                                        };
                                        list.push(newItem);
                                        _model.vars.formList.fhList = list;
                                    } else {
                                        nutmeg.warn('请先选择上一组保电负荷');
                                    }
                                }
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        styles: ['css(width:calc(100% + 2rem))', 'wrapper.buttonwrapper', Styles.css({ marginTop: '1rem', position: 'absolute', bottom: '-1rem', left: '-1rem' })],
                        childStyles: ['icon.duotone', Styles.css({ borderRadius: '0' })],
                        components: [
                            {
                                type: 'button',
                                icon: 'repeat',
                                cap: '重置',
                                onclick: function () {
                                    resetForm();
                                }
                            },
                            {
                                type: 'button',
                                icon: 'trash-can',
                                cap: '清空',
                                onclick: function () {
                                    resetForm();
                                }
                            },
                            {
                                type: 'button',
                                icon: 'xmark',
                                cap: '取消',
                                onclick: function () {
                                    mango.pub('_closeWindow', 2);
                                }
                            },
                            {
                                type: 'button',
                                icon: 'check',
                                class: 'jam-cta',
                                cap: '确认',
                                msgFormat: {
                                    msgKey: 'powerResult'
                                }
                            }
                        ]
                    }
                ],
                watchers: {
                    powerResult(val) {
                        console.log('val', val);
                        editPowerProtectScene();
                    }
                },
                vars: {
                    formList: params
                },
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                onunmount: function () {
                    mango.unsub('_editDev');
                },
                onafterrender: function () {
                    if (params.beginTime) {
                        const _beginTime = moment(params.beginTime).format('YYYY-MM-DD');
                        _msgr.pub('beginTime', _beginTime);
                    }
                    if (params.endTime) {
                        const _endTime = moment(params.endTime).format('YYYY-MM-DD');
                        _msgr.pub('endTime', _endTime);
                    }
                    if (params.fhList) {
                        params.fhList?.forEach((item, index) => {
                            item.id = index;
                        });
                    } else {
                        params.fhList = [{ id: 0 }];
                    }

                    if (params.id) {
                        _msgr.pub('id', params.id);
                    }
                    if (params.type) {
                        _msgr.pub('type', params.type);
                    }
                    mango.sub('_editDev', (val) => {
                        jam.closeTopModal();
                        mango.pub('_editDev', null);
                        if (!Array.isArray(val)) return;
                        _msgr.pub('devList', val);
                        // _model.vars.devList = val || [{}];
                    });
                    _model.vars.formList = params;

                    getRegionList();
                    getDevList(params.id);
                    getFhList();
                }
            }
        ]
    };
};

function getFhList(fhName = '') {
    const regionId = getRegionId();
    ajaxCall(
        'getSubstationList',
        {
            success(data) {
                _model.vars.fhArr = data?.map((item) => ({ name: item.devName, value: item.devId }));
                if (data.length == 1) {
                    let _list = JSON.parse(JSON.stringify(_model.vars.formList.fhList));
                    _list.forEach((item) => {
                        if (data[0].devId == item.fhId) {
                            item.bayId = data[0].bayId;
                            item.stId = data[0].stId;
                            item.stName = data[0].stName;
                            item.bvId = data[0].bvId;
                            item.bvName = data[0].bvName;
                            item.brkState = data[0].brkState;
                            item.ivalue = data[0].ivalue;
                        }
                    });
                    _model.vars.formList.fhList = _list;
                    getbrkList(data[0]);
                }
            },
            params: {
                count: 50,
                regionId: regionId,
                devName: fhName,
                devType: ['FH']
            },
            useMock: false,
            type: 'post',
            uniqId: `getFhName_${Math.random(1, 1000000)}`
        },
        false
    );
}

function getbrkList(object, name = '') {
    const regionId = getRegionId();
    const _list = _model.vars.formList.fhList;
    ajaxCall(
        'getSubstationList',
        {
            success(data) {
                _model.vars.brkList = data?.map((item) => ({ name: item.devName, value: item.devId }));
            },
            params: {
                stId: object?.stId,
                bayId: object?.bayId,
                count: 50,
                regionId: regionId,
                devName: name,
                devType: ['CBR']
            },
            useMock: false,
            type: 'post',
            uniqId: `getbrkName_${Math.random(1, 1000000)}`
        },
        false
    );
}

function editPowerProtectScene() {
    const params = getParams();
    ajaxCall(
        'editPowerProtectScene',
        {
            success(data) {
                nutmeg.success('提交成功');
                mango.pub('_closeWindow', 1);
            },
            params: params,
            useMock: false,
            type: 'post'
        },
        false
    );
}

function openDevWindow() {
    console.log(_msgr.get('devList'), '===_msgr.get');
    jam.renderModal(
        '#main',
        devListWindow({
            regionId: getRegionId(),
            devList: _msgr.get('devList') || []
        })
    );
    // thisModel = createWindow({
    //     id: '_devListWindow',
    //     title: '新增保电设备',
    //     width: '46vw',
    //     height: '60vh',
    //     icon: '',
    //     body: devListWindow({
    //         regionId: getRegionId(),
    //         devList: _msgr.get('devList') || []
    //     }),
    //     showBtn: false
    // });
}

function getRegionList() {
    ajaxCall(
        'getRegionList',
        {
            success(data) {
                const regionList = [];
                (data || []).forEach((item) => regionList.push({ name: item.regionNameChn, value: item.regionId }));
                _model.vars.regionList = regionList;
            },
            params: {},
            useMock: false,
            type: 'get'
        },
        false
    );
}

function resetForm() {
    _model.vars.formList = {};
    _msgr.pub('name', '');
    _msgr.pub('subType', '');
    _msgr.pub('regionId', null);
    _msgr.pub('beginTime', null);
    _msgr.pub('endTime', null);
    _msgr.pub('level', null);
}

function getDevList(sceneId) {
    if (!sceneId) return;
    ajaxCall(
        'querySceneImportantDev',
        {
            success(data) {
                data.forEach((item) => {
                    item.name = item.devName;
                    item.value = item.devId;
                });
                console.log('data', data);
                _msgr.pub('devList', data);
                // _model.vars.devList = data || [];
            },
            params: { sceneId },
            useMock: false,
            type: 'post'
        },
        false
    );
}

function getParams() {
    const id = _msgr.get('id') || undefined;
    const name = _msgr.get('name') || undefined;
    const type = _msgr.get('type') || undefined;
    const subType = _msgr.get('subType') || undefined;
    const regionId = getRegionId();
    const beginTime = _msgr.get('beginTime') ? _msgr.get('beginTime') + ' 00:00:00' : undefined;
    const endTime = _msgr.get('endTime') ? _msgr.get('endTime') + ' 23:59:59' : undefined;
    const level = _msgr.get('level') || undefined;
    const fhList = _model.vars.formList?.fhList || undefined;
    const devList = _msgr.get('devList') || undefined;
    return {
        id,
        name,
        type,
        subType,
        regionId,
        beginTime,
        endTime,
        level,
        fhList,
        devList
    };
}

function getRegionId() {
    const _regionId = _msgr.get('regionId');
    if (Array.isArray(_regionId)) {
        return _regionId[0];
    } else {
        return _regionId;
    }
}

export default powerAssuranceWindow;
