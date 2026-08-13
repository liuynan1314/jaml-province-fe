let _model = null;
let _msgr = null;

import { ajaxCall, formatterJameTime } from '../../common.js';
import moment from 'moment';
let allChildData = [];
let devTypeListData = [];
const filterListWindow = (parent_msgr, allFilterList, oneList) => {
    return {
        type: 'card',
        icon: '',
        cap: '上送总部过滤',
        styles: [
            Styles.card.floating({
                width: '50vw',
                height: '65vh'
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
                            padding: '1.2rem',
                            'box-sizing': 'border-box'
                        },
                        '.form-wrapper': {
                            flexDirection: 'column',
                            width: '90%',
                            margin: '0 auto',
                            '.muilt-label': {
                                'span[slot=cap]': {
                                    width: '12rem',
                                    textAlign: 'right'
                                }
                            },
                            '.filterSelect': {
                                'jam-input': {
                                    width: '100%'
                                }
                            },
                            'span[name=tag]': {
                                flexWrap: 'wrap'
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
                                type: 'input',
                                cap: '过滤器名称：',
                                valueKey: 'filterDesc',
                                class: 'muilt-label',
                                placeholder: '请输入过滤器名称'
                            },
                            {
                                type: 'wrapper',
                                class: 'muilt-form',
                                components: [
                                    {
                                        type: 'label',
                                        class: 'muilt-label',
                                        cap: '事件类型过滤：',
                                        title: '只上送选中的事件类型的数据'
                                    },
                                    {
                                        type: 'buttongroup-checkbox',
                                        data: '{{eventTypeLevelList}}',
                                        value: '{{eventTypeLevelListInit}}',
                                        onvaluechange: function (value) {
                                            getEventTypeLevelMapChildren(value);
                                            let childData = [];
                                            value.forEach(function (item) {
                                                if (!item) return;
                                                const filteredChildren = _model.vars.eventTypeLevelListChildrenInit.filter((child) => String(child).substring(0, 1) == item);
                                                if (filteredChildren.length > 0) {
                                                    childData.push(filteredChildren);
                                                }
                                            });
                                            _model.vars.eventTypeLevelListChildrenInit = childData;
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'wrapper',
                                class: 'muilt-form',
                                components: [
                                    {
                                        type: 'label',
                                        class: 'muilt-label',
                                        cap: '事件等级过滤：',
                                        title: '只上送选中的事件等级的数据'
                                    },
                                    {
                                        type: 'buttongroup-checkbox',
                                        valueKey: 'eventLevelList',
                                        value: '{{eventTypeLevelListChildrenInit}}',
                                        data: '{{eventTypeLevelListChildren}}',
                                        onvaluechange: function (value) {
                                            let parentData = [];
                                            value.forEach(function (item) {
                                                parentData.push(Number(String(item).substring(0, 1)));
                                            });
                                            _model.vars.eventTypeLevelListInit = Array.from(new Set(parentData));
                                            console.log(_model.vars.eventTypeLevelListInit);
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'wrapper',
                                class: 'muilt-form',
                                components: [
                                    {
                                        type: 'label',
                                        class: 'muilt-label',
                                        cap: '厂站电压等级过滤：',
                                        title: '只上送选中的厂站电压等级的事件化数据'
                                    },
                                    {
                                        type: 'muiltiTags',
                                        valueKey: 'bvNameList',
                                        props: {
                                            initialValue: '{{initialBvValue}}',
                                            tagsValue: '{{bvValue}}',
                                            inputValue: '',
                                            selectData: '{{bvList}}'
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'wrapper',
                                class: 'muilt-form',
                                components: [
                                    {
                                        type: 'label',
                                        class: 'muilt-label',
                                        cap: '厂站过滤：',
                                        title: '只上送选中厂站的事件化数据'
                                    },
                                    {
                                        type: 'muiltiTags',
                                        valueKey: 'stNameList',
                                        props: {
                                            initialValue: '{{initialStValue}}',
                                            tagsValue: '{{stValue}}',
                                            inputValue: '',
                                            selectData: '{{stList}}'
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'wrapper',
                                class: 'muilt-form',
                                components: [
                                    {
                                        type: 'label',
                                        class: 'muilt-label',
                                        cap: '厂站黑名单：',
                                        title: '不上送黑名单中厂站的数据'
                                    },
                                    {
                                        type: 'muiltiTags',
                                        valueKey: 'stNameBlackList',
                                        props: {
                                            initialValue: '{{initialBlackValue}}',
                                            tagsValue: '{{blackValue}}',
                                            inputValue: '',
                                            selectData: '{{stIdBlackList}}'
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'input',
                                cap: '事件内容关键字黑名单：',
                                title: "事件内容包含关键字的事件化数据不上送，用'；'分割多个名称",
                                valueKey: 'keywordBlackList',
                                class: 'muilt-label',
                                placeholder: '请输入事件内容关键字黑名单'
                            },
                            {
                                type: 'wrapper',
                                class: 'muilt-form',
                                components: [
                                    {
                                        type: 'label',
                                        class: 'muilt-label',
                                        cap: '设备电压等级过滤：',
                                        title: '只上送选中的设备电压等级的事件化数据'
                                    },
                                    {
                                        type: 'muiltiTags',
                                        valueKey: 'devBvNameList',
                                        props: {
                                            initialValue: '{{initialDevBvValue}}',
                                            tagsValue: '{{devBvValue}}',
                                            inputValue: '',
                                            selectData: '{{devBvList}}'
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'wrapper',
                                class: 'muilt-form',
                                components: [
                                    {
                                        type: 'label',
                                        class: 'muilt-label',
                                        cap: '设备类型过滤：',
                                        title: '只上送设备信息中包含该设备类型的事件告警数据'
                                    },
                                    {
                                        type: 'muiltiTags',
                                        valueKey: 'devTypeNameList',
                                        props: {
                                            initialValue: '{{initialDevTypeValue}}',
                                            tagsValue: '{{devTypeValue}}',
                                            inputValue: '',
                                            selectData: '{{devTypeList}}'
                                        }
                                    }
                                ]
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
                                    saveFilterList(parent_msgr, allFilterList, oneList);
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
                    initialBvValue: [],
                    initialStValue: [],
                    initialBlackValue: [],
                    initialDevBvValue: [],
                    initialDevTypeValue: [],
                    eventTypeLevelListChildrenInit: [],
                    eventTypeLevelListInit: [],
                    eventTypeLevelList: []
                },
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                onafterrender: async function () {
                    await getEventTypeLevelMap();
                    if (!oneList) return;
                    renderFormData(oneList);
                }
            }
        ]
    };
};

/**
 * 获取事件类型和事件等级过滤
 */
function getEventTypeLevelMap() {
    return new Promise((resolve, reject) => {
        ajaxCall('getProvinceEventTypeLevelList', {
            success(data) {
                _model.vars.eventTypeLevelList = data;
                let childData = [];
                data.forEach((item) => {
                    if (item.eventLevel) {
                        childData.push(
                            ...item.eventLevel.map((n) => {
                                return { ...n, name: `${item.name}-${n.name}`, fatherValue: item.value };
                            })
                        );
                    }
                });
                allChildData = childData;
                _model.vars.eventTypeLevelListChildren = allChildData;
                getBvList();
                resolve();
            },
            error(error) {
                console.log(error);
            },
            params: {},
            useMock: false,
            type: 'get'
        });
    });
}

/**
 * 获取事件类型和事件等级过滤子数据
 */
function getEventTypeLevelMapChildren(val) {
    let arr = [];
    if (val.length === 0) {
        _model.vars.eventTypeLevelListChildren = allChildData;
        return;
    }
    val.forEach((item) => {
        arr.push(...allChildData.filter((n) => n.fatherValue === item));
    });
    _model.vars.eventTypeLevelListChildren = arr;
}

/**
 * 获取厂站电压等级 设备电压等级
 */
function getBvList() {
    ajaxCall('getBvNameList', {
        success(data) {
            _model.vars.bvList = data.map((item) => ({ name: item, value: item }));
            _model.vars.devBvList = data.map((item) => ({ name: item, value: item }));
            getStNameList();
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
 * 获取厂站
 */
function getStNameList() {
    ajaxCall('getStNameList', {
        success(data) {
            _model.vars.stList = data.map((item) => ({ name: item, value: item }));
            _model.vars.stIdBlackList = data.map((item) => ({ name: item, value: item }));
            getDevTypeList();
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
 * 获取设备类型
 */
function getDevTypeList() {
    ajaxCall('getProvinceDevTypeList', {
        success(data) {
            devTypeListData = data;
            _model.vars.devTypeList = data.map((item) => ({ name: item.devTypeName, value: item.devTypeName }));
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
 * 保存过滤列表
 */
function saveFilterList(parent_msgr, allFilterList, oneList) {
    let devType = _msgr.get('devTypeNameList');
    let devTypeData = [];
    devType.forEach((item) => {
        devTypeData.push(devTypeListData.filter((n) => n.devTypeName === item)[0]);
    });
    let formParams = {
        filterDesc: _msgr.get('filterDesc'),
        bvNameList: _msgr.get('bvNameList'),
        stNameList: _msgr.get('stNameList'),
        stNameBlackList: _msgr.get('stNameBlackList'),
        eventTypeLevelList: _msgr.get('eventLevelList'),
        keywordBlackList: _msgr.get('keywordBlackList') ? _msgr.get('keywordBlackList').trim().split('；') : [],
        devBvNameList: _msgr.get('devBvNameList'),
        devTypeList: devTypeData
    };

    if (oneList) {
        formParams.id = oneList.id;
        let idIndex = allFilterList.findIndex((item) => item.id === oneList.id);
        if (idIndex !== -1) {
            allFilterList[idIndex] = formParams;
        }
    } else {
        let index = allFilterList.findIndex((item) => item.filterDesc === formParams.filterDesc);
        if (index !== -1) {
            nutmeg.warn('过滤器名称已存在，请重新输入！');
            return;
        }
        allFilterList.push(formParams);
    }

    parent_msgr.pub('allFilterList', allFilterList);
    parent_msgr.pub('closeEvent', new Date().getTime());
}

/**
 * 查看某个数据
 */
function renderFormData(data) {
    let { filterDesc, eventTypeLevelList, bvNameList, stNameList, stNameBlackList, keywordBlackList, devBvNameList, devTypeList } = data;
    _msgr.pub('filterDesc', filterDesc);
    _model.vars.eventTypeLevelListChildrenInit = eventTypeLevelList || [];
    let parentData = [];
    eventTypeLevelList ||
        [].forEach(function (item) {
            parentData.push(Number(String(item).substring(0, 1)));
        });
    _model.vars.eventTypeLevelListInit = Array.from(new Set(parentData));

    _model.vars.initialBvValue = bvNameList;
    _model.vars.initialStValue = stNameList;
    _model.vars.initialBlackValue = stNameBlackList;
    _model.vars.initialDevBvValue = devBvNameList;
    _model.vars.initialDevTypeValue = devTypeList || [] ? devTypeList.map((item) => item?.devTypeName) : [];

    _msgr.pub('keywordBlackList', keywordBlackList ? keywordBlackList.join('；') : '');
}

export default filterListWindow;
