import { ajaxCall, findCol } from '../common.js';
// import { createWindow } from '../components/createWindow.js';
import { getRegionList } from '../utils/commonList.js';
import { VOLTAGE_COLOR_STATE_BG } from '../utils/Constants.js';
import powerAssuranceWindow from '../components/modal/powerAssuranceWindow.js';
import diffImportantDevTable from '../components/diffImportantDevTable.js';
import '../components/sceneList.js';

let SCENE_LIST, ACTIVE_SCENE_ID;
let _thisModel = null;

let _model, _msgr;
export default {
    type: 'wrapper',
    class: 'major-power-outage',
    styles: [
        'size.fullsize',
        Styles.layout.grid({ cols: 16, rows: 10, gap: `0.5rem` }),
        Styles.stylesheet({
            ':scope': {
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                gap: 'm',
                fontFamily: 'Source Han Sans CN'
            },
            '.major-box': {
                border: 's solid var(--jam-color-primary-subtle)',
                backdropFilter: ' blur(24px)'
            },
            '.major-top': {
                width: '100%',
                padding: 's m',
                flex: 'none',
                zIndex: 2,
                '.major-form-box': {
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    marginBottom: 'm',
                    position: 'relative',
                    '.change-scene-box': {
                        position: 'relative'
                    },

                    '.scene-type-box': {
                        position: 'absolute',
                        bottom: '0.2rem',
                        right: '2rem'
                    },

                    '.scene-regionName,.scene-type': {
                        padding: 's m',
                        // color: jam.lumiText(1),
                        color: 'hsl(195.27 100% 56.08%)',
                        background: 'linear-gradient(180deg, transparent 19%, var(--jam-color-primary-film) 100%)',
                        'font-family': 'Source Han Sans CN'
                    },

                    '.scene-regionName': {
                        marginRight: 'm'
                    }
                },

                '.major-card-wrapper': {
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'l',
                    maxHeight: '18rem',
                    overflowY: 'auto',
                    marginBottom: 'm'
                },
                '.major-card-box': {
                    height: '12rem',
                    width: '11.5rem',
                    borderRadius: 's',
                    background: 'linear-gradient(180deg, transparent 19%, var(--jam-color-primary-film) 100%)',
                    border: 's solid var(--jam-color-primary-subtle)',
                    padding: 's',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer'
                },
                '.major-card-top': {
                    height: '2rem',
                    width: '100%',
                    borderBottom: 's solid var(--jam-color-primary-default)',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative'
                },

                '.major-voltage-box': {
                    alignItems: 'center'
                },

                '.major-voltage-state': {
                    width: 0,
                    height: 0,
                    width: '0.6rem',
                    height: '0.4rem',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    marginRight: '-0.1rem'
                },
                '.major-title-voltage': {
                    fontSize: 's',
                    borderRadius: 's 0 0 0'
                },

                '.major-card-title': {
                    color: 'var(--jam-color-fg-default)',
                    fontWeight: 'bold',
                    fontSize: 'm',

                    '.major-title-state': {
                        width: 0,
                        height: 0,
                        width: '0.75rem',
                        height: '0.75rem',
                        clipPath: 'polygon(0 0, 80% 0, 0 80%)',
                        position: 'absolute',
                        top: '-0.2rem',
                        left: '-0.3rem',
                        borderTopLeftRadius: '4px'
                    }
                },
                '.major-card-content': {
                    width: '100%',
                    height: 'calc(100% - 2rem)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    overflowY: 'auto',
                    '.major-card-item': {
                        width: '100%',
                        display: 'flex',
                        height: '1.8rem',
                        justifyContent: 'space-between'
                    },
                    '.major-card-cap': {
                        fontSize: 's',
                        color: 'var(--jam-color-fg-default)',
                        fontFamily: 'Source Han Sans CN',
                        padding: 0
                    },
                    '.major-card-value': {
                        fontSize: 'm',
                        color: 'hsl(195.3, 100%, 56%)',
                        fontFamily: 'DINPro',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        padding: 0,
                        marginTop: '-0.2rem'
                    }
                }
            },
            '.major-bottom': {
                overflow: 'auto',
                width: '100%',
                zIndex: 1,
                '.major-bottom-table-box': {
                    height: 'calc(100% - 2.5rem)',
                    width: '100%'
                }
            }
        })
    ],
    descStyles: {
        input: [Styles.input.agent.css({ width: '12rem' })],
        button: [Styles.icon.regular, Styles.button.css({ margin: '0 s' })]
    },
    components: [
        {
            type: 'container',
            class: 'major-top major-box',
            components: [
                {
                    type: 'wrapper',
                    class: 'major-form-box',
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '地区:',
                            defaultValue: null,
                            valueKey: 'regionId',
                            dataWatcher: 'regionList',
                            styles: [Styles.buttonGroupStyles, Styles.size.fullwidth],
                            icon: 'earth-asia'
                        },
                        {
                            type: 'wrapper',
                            class: 'change-scene-box',
                            components: [
                                {
                                    type: 'input',
                                    cap: '场景：',
                                    icon: 'globe-snow',
                                    valueKey: 'sceneName',
                                    readonly: 'readonly',
                                    styles: [Styles.input.regularStyle],
                                    onclick() {
                                        _model.vars.sceneListData = SCENE_LIST;
                                        _model.vars.isShowSceneCard = true;
                                    },
                                    onvaluechange: jam.makeDebounce(function (sceneName) {
                                        const filterScene = SCENE_LIST.filter((item) => item?.name?.includes(sceneName));
                                        _model.vars.sceneListData = filterScene;
                                    }, 300)
                                },
                                {
                                    type: 'sceneList',
                                    props: {
                                        sceneList: '{{sceneListData}}'
                                    },
                                    buildIf: '{{isShowSceneCard}}'
                                }
                            ]
                        },
                        {
                            type: 'button',
                            cap: '新建保电场景',
                            icon: 'plus',
                            styles: [Styles.button.regularStyle],
                            onclick: function () {
                                openAddSceneWindow();
                            }
                        },
                        {
                            type: 'button',
                            cap: '编辑当前场景',
                            icon: 'edit',
                            styles: [Styles.button.regularStyle],
                            onclick: function () {
                                openAddSceneWindow(_model.vars.activeScene, '编辑重大场景');
                            }
                        },
                        {
                            type: 'button',
                            cap: '删除当前场景',
                            icon: 'trash',
                            styles: [Styles.button.regularStyle],
                            onclick: function (e) {
                                jam.popupYesNo(
                                    e.target,
                                    '<span style="white-space:nowrap">确定执行此操作吗?</span>',
                                    () => {
                                        deletePowerProtectScene();
                                    },
                                    () => {}
                                );
                            }
                        },
                        {
                            type: 'wrapper',
                            class: 'scene-type-box',
                            components: [
                                {
                                    type: 'label',
                                    class: 'scene-regionName',
                                    cap: '{{activeScene.regionName}}'
                                },
                                {
                                    type: 'label',
                                    class: 'scene-type',
                                    cap: '{{activeScene.subType}}'
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'major-card-wrapper',
                    components: [
                        {
                            type: 'wrapper',
                            class: 'major-card-box',
                            buildFor: '(stItem,index) in importDeviceNumData',
                            attrs: {
                                stId: '{{stItem.stId}}'
                            },
                            state: '{{stActiveId}} === {{stItem.stId}} ? "active" : "normal"',
                            states: {
                                active: {
                                    styles: [
                                        Styles.css({
                                            background: 'linear-gradient(179.98deg, var(--jam-color-primary-default) 20%, transparent 100%)'
                                        })
                                    ]
                                },
                                normal: {
                                    styles: [
                                        Styles.css({
                                            background: 'linear-gradient(180deg, transparent 19%, var(--jam-color-primary-film) 100%)'
                                        })
                                    ]
                                }
                            },
                            components: [
                                {
                                    type: 'wrapper',
                                    class: 'major-card-top',
                                    components: [
                                        {
                                            type: 'wrapper',
                                            class: 'major-card-title',
                                            components: [
                                                {
                                                    type: 'label',
                                                    class: 'major-title-stName',
                                                    cap: '{{stItem.stName}}'
                                                },
                                                {
                                                    type: 'element',
                                                    class: 'major-title-state',
                                                    state: '{{stItem.stStatus}}',
                                                    states: {
                                                        1: {
                                                            styles: [Styles.background({ color: 'hsl(144.48 100% 39.41%)' })]
                                                        },
                                                        2: {
                                                            styles: [Styles.background({ color: 'hsl(0, 100%, 66.1%)' })]
                                                        },
                                                        4: {
                                                            styles: [Styles.background({ color: 'hsl(0 0% 60%)' })]
                                                        },
                                                        null: {
                                                            styles: [Styles.hide]
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            type: 'wrapper',
                                            class: 'major-voltage-box',
                                            components: [
                                                {
                                                    type: 'element',
                                                    class: 'major-voltage-state',
                                                    state: '{{stItem.stBvName}}',
                                                    states: VOLTAGE_COLOR_STATE_BG('', 'backgroundColor')
                                                },
                                                {
                                                    type: 'label',
                                                    class: 'major-title-voltage',
                                                    cap: '{{stItem.stBvName}}'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'wrapper',
                                    class: 'major-card-content',
                                    components: [
                                        {
                                            type: 'wrapper',
                                            class: 'major-card-item',
                                            buildFor: 'item in stItem.devTypeList',
                                            components: [
                                                {
                                                    type: 'label',
                                                    icon: jaml.var('item.devType', function (name) {
                                                        switch (name) {
                                                            case '断路器':
                                                                return `<img src="../../assets/images/icon_circuit_breaker.svg">`;
                                                                break;
                                                            case '负荷':
                                                                return `<img src="../../assets/images/icon_load.svg">`;
                                                                break;
                                                            case '交流线段端点':
                                                                return `<img src="../../assets/images/icon_line.svg">`;
                                                                break;
                                                            case '主变':
                                                                return `<img src="../../assets/images/icon_transformer.svg">`;
                                                                break;
                                                            case '变压器绕组':
                                                                return `<img src="../../assets/images/icon_winding.svg">`;
                                                                break;
                                                        }
                                                    }),
                                                    class: 'major-card-cap',
                                                    cap: '{{item.devType}}',
                                                    styles: [Styles.label.icon.css({ minHeight: 0, minWidth: 0, width: '1rem', height: '1rem', marginRight: 'xs' })]
                                                },
                                                {
                                                    type: 'label',
                                                    class: 'major-card-value',
                                                    cap: '{{item.cnt}}'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            onclick() {
                                const elemAll = document.querySelectorAll('.major-card-box');
                                for (let i = 0; i < elemAll.length; i++) {
                                    elemAll[i].state = 'normal';
                                }
                                this.state = 'active';
                                const stId = this.getAttribute('stId');
                                _msgr.pub('stId', stId);
                            }
                        }
                    ]
                }
            ]
        },
        {
            type: 'container',
            class: 'major-bottom major-box',
            components: [
                // {
                //     type: 'label',
                //     cap: '重要设备',
                //     styles: [Styles.tableTitleStyles]
                // },
                {
                    type: 'wrapper',
                    class: 'major-bottom-table-box',
                    components: [diffImportantDevTable()]
                }
            ]
        }
    ],
    watchers: [
        {
            key: 'regionId',
            callback: function () {
                ACTIVE_SCENE_ID = null;
                getSceneListData();
            }
        },
        {
            key: 'sceneId',
            callback: function (sceneId) {
                ACTIVE_SCENE_ID = sceneId;
                _model.vars.isShowSceneCard = false;
                getImportDeviceNum(sceneId);

                const activeScene = _model.vars.sceneListData.find((item) => item.id == sceneId);
                _model.vars.activeScene = activeScene;
                _msgr.pub('sceneName', activeScene?.name);
            }
        },
        {
            key: 'stId',
            callback: function (stId) {
                const sceneId = _msgr.get('sceneId');
                _model.vars.stActiveId = stId;
                querySceneImportantDev(sceneId, stId);
            }
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: async function () {
        mango.sub('_closeWindow', (val) => {
            jam.closeTopModal();
            mango.pub('_closeWindow', null);
            if (val == 1) {
                const sceneId = _msgr.get('sceneId');
                const stId = _msgr.get('stId');
                getSceneListData();
                getImportDeviceNum(sceneId, true);
                // querySceneImportantDev(sceneId, stId);
            }
        });
        getRegionList(_model);
    }
};

function getSceneListData() {
    const _params = {
        type: 3,
        regionId: _msgr.get('regionId')
    };
    ajaxCall(
        'getSceneListData',
        {
            success(res) {
                const data = res.map((item) => {
                    return {
                        ...item,
                        value: item.id
                    };
                });
                SCENE_LIST = data;
                _model.vars.sceneListData = data;
                let sceneId = ACTIVE_SCENE_ID || data?.[0]?.value;
                _msgr.pub('sceneId', sceneId);
                const activeScene = data.find((item) => item.id == sceneId);
                _model.vars.activeScene = activeScene;
                _msgr.pub('sceneName', activeScene?.name);
            },
            params: _params,
            useMock: false,
            type: 'post'
        },
        false
    );
}

function getImportDeviceNum(sceneId, flag) {
    _model.vars.importDeviceNumData = [];
    ajaxCall(
        'getImportDeviceNumData',
        {
            success(res) {
                _model.vars.importDeviceNumData = res;
                const firstStId = flag ? _msgr.get('stId') : res?.[0]?.stId;
                _msgr.pub('stId', firstStId || null);
                !flag && (_model.vars.stActiveId = firstStId);
                querySceneImportantDev(sceneId, firstStId);
            },
            params: {
                sceneId
            },
            useMock: false,
            type: 'get'
        },
        false
    );
}

function querySceneImportantDev(sceneId, stId) {
    ajaxCall(
        'querySceneImportantDev',
        {
            success(res) {
                _msgr.pub('majorPowerOutageTableData', res);
            },
            params: {
                sceneId,
                stId
            },
            useMock: false,
            type: 'post'
        },
        false
    );
}

function deletePowerProtectScene() {
    ajaxCall(
        'deletePowerProtectScene',
        {
            success(res) {
                ACTIVE_SCENE_ID = null;
                nutmeg.success('删除成功');
                getSceneListData();
            },
            params: {
                sceneId: _msgr.get('sceneId')
            },
            useMock: false,
            type: 'get'
        },
        false
    );
}

function openAddSceneWindow(currSceneData = {}, title = '新增重大场景') {
    jam.renderModal(
        '#main',
        powerAssuranceWindow({
            _titel: title,
            type: 3,
            ...currSceneData
        })
    );
    // _thisModel = createWindow({
    //     title: title,
    //     width: '25vw',
    //     height: '50vh',
    //     icon: '',
    //     body: powerAssuranceWindow({
    //         type: 3,
    //         ...currSceneData
    //     }),
    //     showBtn: false
    // });
}
