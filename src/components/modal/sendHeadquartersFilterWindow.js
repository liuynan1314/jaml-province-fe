let _model = null;
let _msgr = null;

import { ajaxCall } from '../../common.js';
// import { createWindow } from '../../components/createWindow.js';
import filterListWindow from '../../components/modal/filterListWindow.js';
import moment from 'moment';
let _thisModel = null;
let allFilterList = [];
let allData = {};
const sendHeadquartersFilterWindow = (parent_msgr) => {
    return {
        type: 'card',
        icon: '',
        cap: '上送总部过滤',
        styles: [
            Styles.card.floating({
                width: '60vw',
                height: '75vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                id: 'sendHeadquartersFilterWindow',
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
                            '.form-item span[slot=cap]': {
                                width: '15rem',
                                textAlign: 'right'
                            }
                        },
                        '.btn-wrapper': {
                            justifyContent: 'center'
                        }
                    })
                ],
                components: [
                    {
                        type: 'wrapper',
                        class: 'form-wrapper',
                        components: [
                            {
                                type: 'switch',
                                class: 'form-item',
                                cap: '是否上送事件化到总部：',
                                title: '总开关',
                                valueKey: 'upload2PmsEnable'
                            },
                            {
                                type: 'switch',
                                class: 'form-item',
                                cap: '是否自动上送到总部：',
                                title: '是否自动上送到总部',
                                valueKey: 'autoSendEnable'
                            },
                            {
                                type: 'wrapper',
                                class: 'muilt-form',
                                showIf: '{{telBvShow}}',
                                components: [
                                    {
                                        type: 'label',
                                        class: 'form-item',
                                        cap: '发送往电话系统电压等级过滤：',
                                        title: '推超高压电话系统的设备电压等级调整为220千伏及以上'
                                    },
                                    {
                                        type: 'muiltiTags',
                                        valueKey: 'telBvList',
                                        props: {
                                            initialValue: '{{initialTelValue}}',
                                            tagsValue: '{{telValue}}',
                                            inputValue: '',
                                            selectData: '{{telBvListData}}'
                                        },
                                        onvaluechange(val) {
                                            allData.toTelBvNameList = val;
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
                                        class: 'form-item',
                                        cap: '过滤器列表：'
                                    },
                                    {
                                        type: 'tags',
                                        removable: true,
                                        data: '{{initFilterList}}',
                                        valueKey: 'filterValue',
                                        onaddclick(e) {
                                            let filterList = JSON.parse(JSON.stringify(allFilterList));
                                            jam.renderModal('#main', filterListWindow(_msgr, filterList));
                                            // _thisModel = createWindow({
                                            //     title: `上送总部过滤`,
                                            //     width: '50vw',
                                            //     height: '65vh',
                                            //     body: filterListWindow(_msgr, filterList),
                                            //     showBtn: false
                                            // });
                                        },
                                        onclick: function (e) {
                                            if (e.target?._type == 'button') {
                                                return;
                                            }
                                            let filterName = e.target.innerText;
                                            let oneList = allData.filterList.filter((i) => i.filterDesc === filterName)[0];
                                            let filterList = JSON.parse(JSON.stringify(allFilterList));
                                            jam.renderModal('#main', filterListWindow(_msgr, filterList, oneList));
                                            // _thisModel = createWindow({
                                            //     title: `上送总部过滤`,
                                            //     width: '50vw',
                                            //     height: '65vh',
                                            //     body: filterListWindow(_msgr, filterList, oneList),
                                            //     showBtn: false
                                            // });
                                        },
                                        watchers: {
                                            filterValue(val) {
                                                let newList = [];
                                                val.forEach((item) => {
                                                    newList.push(allData.filterList.filter((i) => i.filterDesc === item)[0]);
                                                });
                                                _model.vars.initFilterList = _model.vars.initFilterList.filter((item) => item.name !== val);
                                                allData.filterList = newList;
                                            }
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
                                    saveAllFilterList(parent_msgr);
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
                    initialTelValue: [],
                    telBvShow: false
                },
                watchers: {
                    closeEvent() {
                        jam.closeTopModal();
                        // _thisModel && _thisModel.close();
                    },
                    allFilterList(val) {
                        allFilterList = val;
                        allData.filterList = val;
                        let filterList = [];
                        val.forEach((item, index) => {
                            filterList.push({
                                value: item.filterDesc,
                                name: item.filterDesc
                            });
                        });
                        _model.vars.initFilterList = filterList;
                    }
                },
                vars: {
                    initFilterList: []
                },
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                onafterrender: function () {
                    getInitialValue();
                }
            }
        ]
    };
};
/**
 * 获取过滤器列表初始值
 */
function getInitialValue() {
    ajaxCall('getProvinceFilterConfig', {
        success(data) {
            allData = data;
            let filterList = [];
            data?.filterList.forEach((item, index) => {
                filterList.push({
                    value: item.filterDesc,
                    name: item.filterDesc
                });
            });
            _model.vars.initFilterList = filterList;
            allFilterList = data?.filterList;
            _msgr.pub('upload2PmsEnable', data.upload2PmsEnable);
            _msgr.pub('autoSendEnable', data.autoSendEnable);
            _model.vars.telBvShow = data.toTelBvNameFilterEnabled;
            if (data.toTelBvNameFilterEnabled) {
                _model.vars.initialTelValue = data.toTelBvNameList;
                getBvList();
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
 * 渲染电压等级
 */
function getBvList() {
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
            _model.vars.telBvListData = newData;
        },
        error(err) {},
        params: {},
        useMock: false,
        type: 'get'
    });
}

/**
 * 保存所有过滤器列表
 */
function saveAllFilterList(parent_msgr) {
    ajaxCall('saveProvinceFilterConfig', {
        success(data) {
            nutmeg.success('保存成功！');
            parent_msgr.pub('closeEvent', new Date().getTime());
        },
        error(error) {
            console.log(error);
        },
        params: allData,
        useMock: false,
        type: 'post',
        uniqId: `saveProvinceFilterConfig_${Math.random(1, 1000000)}`
    });
}

export default sendHeadquartersFilterWindow;
