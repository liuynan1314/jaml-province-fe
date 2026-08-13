let _model = null;
let _msgr = null;

import { ajaxCall } from '../../common.js';
// import { createWindow } from '../../components/createWindow.js';
import filterListWindow from '../../components/modal/filterListWindow.js';
import moment from 'moment';
let _thisModel = null;
let allFilterList = [];
let allData = {};
const sendMiddleFilterWindow = (parent_msgr) => {
    return {
        type: 'card',
        icon: '',
        cap: '上送中台过滤',
        styles: [
            Styles.card.floating({
                width: '60vw',
                height: '75vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                id: 'sendMiddleFilterWindow',
                styles: [
                    'size.fullsize',
                    Styles.stylesheet({
                        ':scope': {
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '1.2rem',
                            'box-sizing': 'border-box'
                        },
                        '.btn-wrapper': {
                            justifyContent: 'center'
                        }
                    })
                ],
                components: [
                    {
                        type: 'wrapper',
                        components: [
                            {
                                type: 'label',
                                class: 'muilt-label',
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
                                    //     title: `上送中台过滤`,
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
                                    //     title: `上送中台过滤`,
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
                watchers: [
                    {
                        key: 'closeEvent',
                        callback: () => {
                            jam.closeTopModal();
                            // _thisModel && _thisModel.close();
                        }
                    },
                    {
                        key: 'allFilterList',
                        callback: function (val) {
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
                    }
                ],
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
    ajaxCall('getProvince2BpFilterConfig', {
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
 * 保存所有过滤器列表
 */
function saveAllFilterList(parent_msgr) {
    ajaxCall('saveProvince2BpFilterConfig', {
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
        uniqId: `saveProvince2BpFilterConfig_${Math.random(1, 1000000)}`
    });
}

export default sendMiddleFilterWindow;
