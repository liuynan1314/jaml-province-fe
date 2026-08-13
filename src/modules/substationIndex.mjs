// 厂站目录
import { getBvList, getRegionList, getSubstationList } from '../utils/commonList.js';
import { ajaxCall, getDetailConf } from './../common.js';

let _model,
    _msgr,
    _this,
    isAfterRender = false;
const city = jam.getUrlParam('city');

/** 每帧只创建这么多张，并立刻 append（不再整表重建） */
const CHUNK_SIZE_DEFAULT = 16;
const CHUNK_SIZE_FAST = 32;
/** @type {{ bvName: string, item: object }[]} */
let _renderQueue = [];
let _rafId = null;
let _chunkSize = CHUNK_SIZE_DEFAULT;
/** @type {Map<string, HTMLElement>} */
const _itemWrappers = new Map();

export default {
    type: 'wrapper',
    styles: [
        'size.fullsize',
        Styles.stylesheet({
            ':scope': {
                '--gap': 'var(--jam-space-m)',
                '--gap-sm': 'var(--jam-space-s)'
            },
            '.main-wrapper': {
                flex: 1,
                // padding: 'var(--gap)',
                marginLeft: 'var(--gap)',
                // border: `.0625rem solid ${COLOR_SET.secondaryborderclr}`,
                // backgroundColor: COLOR_SET.modulebgclr,
                overflow: 'hidden auto'
            },
            '.indicatorChannel-bg': {
                background: 'tint',
                borderRadius: 'm',
                padding: 's',
                border: 's solid var(--jam-color-primary-film)',
                display: 'flex',
                alignItems: 'center',
                gap: 's',
                width: '13.6rem',
                boxSizing: 'border-box',
                cursor: 'pointer',
                '&:hover': {
                    background: 'var(--jam-color-primary-default)'
                }
            },
            '.station-card-icon': {
                minWidth: '1.5rem',
                height: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'elevation',
                color: 'primary',
                fontSize: 's',
                flexShrink: 0
            },
            '.station-card-title': {
                flex: 1,
                minWidth: '7.5rem',
                maxWidth: '6.5rem',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                color: 'var(--jam-color-fg-default)'
            },
            '.station-card-sub': {
                marginLeft: 'auto',
                padding: 's',
                background: 'elevation',
                color: 'primary',
                fontSize: 's',
                flexShrink: 0,
                maxWidth: '4rem',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            },
            '.header-class': {
                borderBottom: 's solid var(--jam-color-primary-default)',
                paddingBottom: 's'
            },
            '.r-st': {
                minWidth: '7.5rem !important'
            }
        })
    ],
    components: [
        // {
        //     type: 'loading'
        // },
        {
            type: 'wrapper',
            class: 'main-wrapper',
            styles: ['flex(direction: column)', 'padding(bottom:0)', 'layout(overflow:hidden)', 'size.fullsize'],
            components: [
                {
                    type: 'wrapper',
                    // header
                    class: 'header-class',
                    styles: ['size.fullwidth', 'layout.flex(direction:column)'],
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '区域选择',
                            icon: 'earth-asia',
                            styles: [
                                Styles.buttonGroupStylesWithBgCap,
                                city === 'jiangsu'
                                    ? Styles.css({
                                          fontSize: 'l'
                                      })
                                    : ''
                            ],
                            value: '{{regionId}}',
                            data: '{{regionList}}'
                        },
                        {
                            type: 'wrapper',
                            styles: ['css(alignItems:flex-end)'],
                            components: [
                                {
                                    type: 'buttongroup-radio',
                                    cap: '电压等级',
                                    icon: 'bolt',
                                    styles: [
                                        Styles.buttonGroupStylesWithBgCap,
                                        city === 'jiangsu'
                                            ? Styles.css({
                                                  fontSize: 'l'
                                              })
                                            : ''
                                    ],
                                    value: null,
                                    valueKey: 'bvId',
                                    valueWatcher: 'bvId',
                                    data: '{{bvList}}'
                                },

                                {
                                    type: 'wrapper',
                                    styles: [
                                        Styles.css({
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            // alignItems: 'center',
                                            marginLeft: 'm',
                                            height: 'fit-content'
                                        }),
                                        Styles.stylesheet({
                                            '.ml-_625rem': {
                                                marginLeft: 'm',
                                                marginBottom: 's'
                                            }
                                        })
                                    ],
                                    childStyles: [
                                        'margin(top:var(--gap))',
                                        'datepicker.agent.border(radius:s)',
                                        city === 'jiangsu'
                                            ? Styles.css({
                                                  fontSize: 'l'
                                              })
                                            : ''
                                    ],
                                    descStyles: {
                                        datepicker: ['padding(top:0;bottom:0)', 'datepicker.labelslot.margin(0)'],
                                        button: [Styles.searchBtnsStyles]
                                    },
                                    components: [
                                        {
                                            type: 'filterSelect',
                                            styles: ['padding(top:0;bottom:s)', Styles.input.regularStyle],
                                            childStyles: ['input.agent.border(radius:s)', 'input.labelslot.margin(0)', 'padding(0)'],
                                            valueKey: 'stId',
                                            props: { cap: '变电站：', placeholder: '请选择', data: '{{stList}}', search: '{{name}}', select: '{{stId}}', icon: 'transformer-bolt' },
                                            watchers: {
                                                name(val) {
                                                    getSubstationList({ _model, devName: val });
                                                }
                                            }
                                        },

                                        city === 'jiangsu'
                                            ? {
                                                  type: 'select',
                                                  cap: '监控范围：',
                                                  icon: 'sigma',
                                                  styles: ['icon.duotone', 'size(minWidth:8.5rem)', 'select.agent.border(radius:s)'],
                                                  placeholder: '请选择集控范围',
                                                  value: '{{jkStation}}',
                                                  data: [
                                                      { name: '监控內', value: 1 },
                                                      { name: '监控外', value: 2 },
                                                      { name: '监控內/外', value: 3 }
                                                  ]
                                              }
                                            : null,
                                        {
                                            type: 'button',
                                            cap: '查询',
                                            icon: 'search',
                                            class: 'ml-_625rem jam-cta',
                                            onclick: function () {
                                                init();
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    styles: [
                        //
                        'flex(direction: column)',
                        'margin(top:var(--gap))',
                        'padding(bottom:var(--gap))',
                        'layout(overflow:auto)',
                        'flex(1)',
                        Styles.stylesheet({
                            '.content-wrapper': {
                                // backgroundColor: `${COLOR_SET.gradientbgclr_lighter}`,
                                // backgroundImage: 'url(./../../assets/images/wrapper-bg.png)',
                                // backgroundSize: '100% 100%',
                                // backgroundRepeat: 'no-repeat',

                                '.station-title': {
                                    '&:not(:first-child)': {
                                        marginTop: 'm'
                                    }
                                }
                            },
                            '.station-title': {
                                display: 'flex',
                                width: '12rem',
                                height: '2.2rem',
                                fontSize: 'm',
                                textAlign: 'center',
                                lineHeight: '2rem',
                                backgroundImage: 'url(./../../assets/images/bvlevel-bg.png)',
                                backgroundSize: '100% 100%',
                                backgroundRepeat: 'no-repeat',
                                icon: {
                                    width: '2rem',
                                    height: '2rem'
                                }
                            },
                            '.item-wrapper': {
                                gap: 'm',
                                padding: 'm 0',
                                borderTop: 'none',
                                display: 'flex',
                                flexWrap: 'wrap',
                                width: '100%',
                                overflow: 'auto'
                            },
                            '.item-content-wrapper': {
                                height: '3rem',
                                width: '15.6rem',
                                padding: 's',
                                margin: '0 1.4rem 1rem 0',
                                borderRadius: 's',
                                backgroundImage: 'url(./../../assets/images/border-bg.png)',
                                backgroundSize: '100% 100%',
                                backgroundRepeat: 'no-repeat',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: 'm',
                                lineHeight: '2em',
                                '.first-word': {
                                    width: '2rem',
                                    height: '2rem',
                                    justifyContent: 'center',
                                    backgroundImage: 'url(./../../assets/images/letter-border.png)',
                                    backgroundSize: '100% 100%',
                                    backgroundRepeat: 'no-repeat'
                                },
                                '.bv-st-name': {}
                            }
                        })
                    ],
                    components: [
                        {
                            type: 'wrapper',
                            styles: ['flex(direction: column)'],
                            class: 'content-wrapper',
                            buildFor: 'bvItem in currentBvList',
                            components: [
                                // {
                                //     type: 'label',
                                //     cap: '"变电站 · "+{{bvItem.name}}',
                                //     class: 'station-title',
                                //     icon: '<img src="./../../assets/images/station_blue.png"/>',
                                //     buildIf: '{{bvItem.value}}&&(!{{bvId}}||{{bvId}}=={{bvItem.value}})'
                                // },
                                {
                                    type: 'wrapper',
                                    styles: ['css(display:flex;align-items:center;)'],
                                    components: [
                                        {
                                            icon: 'bolt',
                                            type: 'label',
                                            class: 'jam-cc',
                                            styles: ['css(font-size:m;)', Styles.label.cap.css({ minWidth: '9rem' }), 'cap.color.primary', Styles.icon.solid],
                                            cap: '"变电站 · "+{{bvItem.name}}',
                                            color: '{{bvItem.name}}',
                                            props: {
                                                bvId: '{{bvItem.value}}'
                                            }
                                            // onafterrender: function (e) {
                                            //     e.style.backgroundColor = jam.adjustColor(getMenuColorByType(MenuType.BASE_VOLTAGE, this.props?.bvId), { a: 0.2 });
                                            // }
                                        },
                                        {
                                            type: 'element',
                                            slot: 'layer',
                                            styles: [Styles.css({ gridArea: 'l', width: '15%', height: '1px', margin: '0', padding: '0', position: 'relative' }), Styles.background.stripy({ deg: 90, color: 'gray' }), Styles.element.before({ content: '', '--w': '0.5rem', position: 'absolute', width: 'var(--w)', height: 'var(--w)', right: '-9px', top: 'calc(0px - var(--w)/2)', clipPath: 'polygon(0 0%, 100% 50%, 0% 100%)', background: 'white' }), Styles.element.after({ content: '', '--w': '0.5rem', position: 'absolute', width: 'var(--w)', height: 'var(--w)', right: '-20px', top: 'calc(0px - var(--w)/2)', clipPath: 'polygon(0 0%, 100% 50%, 0% 100%)', background: 'gray' })]
                                        }
                                    ]
                                },
                                {
                                    buildIf: '{{bvItem.value}}&&(!{{bvId}}||{{bvId}}=={{bvItem.value}})',
                                    type: 'wrapper',
                                    class: 'item-wrapper',
                                    attrs: {
                                        'data-bv-name': '{{bvItem.name}}'
                                    },
                                    props: {
                                        bvName: '{{bvItem.name}}'
                                    },
                                    components: [],
                                    onafterrender: function () {
                                        const bvName = this.props?.bvName;
                                        _itemWrappers.set(bvName, this);
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    vars: {
        jkStation: 3,
        // data: [],
        // isLoading: true,
        stationDataList: {}
    },
    watchers: [
        // {
        //     key: 'regionId',
        //     callback: function () {
        //         isAfterRender ? init() : null;
        //     }
        // },
        // {
        //     key: 'bvId',
        //     callback: function (value) {
        //         if (isAfterRender) {
        //             updatecurrentBvList(value);
        //             init(true);
        //         }
        //     }
        // }
    ],
    onmount: function () {
        _this = this;
        _model = this.model;
        _msgr = this.model.msgr;
        _model.vars.regionId = mango.get('substationIndexParams')?.regionId ?? null;
    },
    onafterrender: async function () {
        getRegionList(_model);
        getSubstationList({ _model });
        setTimeout(() => (isAfterRender = true), 200);
        await getBvList(_model, _msgr);
        updatecurrentBvList();
        init();
    }
};

export function handleClickStName(stId) {
    const { regionListUserOtherSys = [90] } = getDetailConf('regionListUserOtherSys');
    // ajaxCall('getStInfo', {
    //     params: { stId },
    //     success: (data) => {
    //         let url = '';
    //         if (data?.graphName && data?.graphUrl) {
    //             url = `${data?.graphUrl}?graph=${data?.graphName};isClient=1;toolbarshow=0;menubarshow=0;&token=${localStorage.getItem('JKZ_NARIKJ_PORTAL_TOKEN')}&randvalue1=${moment().valueOf()}`;
    //             if (regionListUserOtherSys.includes(data?.regionId)) {
    //                 url = `${data.graphUrl}?graph=${data?.graphName}`.replace('fac', 'sys').replace('nccs', '');
    //             }
    //         } else if (data?.graphName && data?.graphName.includes('http')) {
    //             url = data.graphName;
    //         } else {
    //             nutmeg.warn('请配置厂站对应g文件和链接地址');
    //             return;
    //         }
    //         mango.pub('openCard', {
    //             card: 'stGraph',
    //             params: {
    //                 url: url
    //             },
    //             timespace: Date.now()
    //         });
    //     }
    // });

    mango.pub('openCard', {
        card: 'stGraph',
        params: {
            id: stId
        },
        timespace: Date.now()
    });
}

function packageParams() {
    const regionId = _model.vars.regionId ?? undefined;
    const bvId = _model.vars.bvId ?? undefined;
    const regionIdList = regionId ? [regionId] : undefined;
    const bvIdList = bvId ? [bvId] : _model.vars.bvList?.filter((item) => item.value !== null).map((item) => item.value);
    return {
        regionIdList,
        bvIdList,
        jkStation: _model.vars.jkStation,
        pageIndex: 1,
        devName: _msgr.get('name') ? _msgr.get('name') : undefined
        //   "keyword": ""
    };
}
function firstWordOfName(item) {
    const newWord = item.stName.includes(item.bvName) ? item.devNamePy.replace(item.bvName, '') : item.devNamePy;
    return newWord.slice(0, 1).toLocaleUpperCase();
}

function createStationOption(item) {
    // 不用 stationIndicator CC：命令式挂载时 CC 内 data.value1 为空会抛错；本地卡片更轻也无此问题
    return {
        type: 'wrapper',
        class: 'indicatorChannel-bg',
        components: [
            {
                type: 'label',
                class: 'station-card-icon',
                cap: item.firstWord || ''
            },
            {
                type: 'label',
                class: 'r-st station-card-title r-transparentStation',
                cap: item.stName || '',
                attrs: {
                    'data-id': item.stId,
                    'data-name': item.stName || ''
                }
            },
            {
                type: 'label',
                class: 'station-card-sub',
                cap: item.subareaName || '--'
            }
        ],
        onclick: function (e) {
            const _el = jam.closest(e.target, '.r-st') || this.querySelector?.('.r-st');
            const dataId = _el?.getAttribute('data-id');
            if (dataId) handleClickStName(dataId);
        }
    };
}

function shouldUseFastChunk() {
    if (_model?.vars?.bvId) return true;
    if (_msgr?.get('name') || _msgr?.get('stId')) return true;
    return false;
}

function stopChunkRender() {
    if (_rafId != null) {
        cancelAnimationFrame(_rafId);
        _rafId = null;
    }
    _renderQueue = [];
}

function getOrderedBvNames(list) {
    const fromUi = (_model?.vars?.currentBvList || []).filter((item) => item?.value != null && item?.name && list?.[item.name]?.length).map((item) => item.name);
    if (fromUi.length) return fromUi;
    return Object.keys(list || {}).filter((name) => list[name]?.length);
}

function getItemWrapper(bvName) {
    const cached = _itemWrappers.get(bvName);
    if (cached?.isConnected) return cached;
    const el = document.querySelector(`.item-wrapper[data-bv-name="${CSS.escape(bvName)}"]`);
    if (el) _itemWrappers.set(bvName, el);
    return el;
}

function clearAllItemWrappers() {
    _itemWrappers.forEach((el) => {
        if (typeof el.clear === 'function') {
            el.clear();
        } else {
            el.replaceChildren?.();
        }
    });
    document.querySelectorAll('.item-wrapper').forEach((el) => {
        if (typeof el.clear === 'function') {
            el.clear();
        } else {
            el.replaceChildren?.();
        }
        const bvName = el.getAttribute('data-bv-name');
        if (bvName) _itemWrappers.set(bvName, el);
    });
}

/** 只创建本批 DOM 并 append，不重建已有卡片 */
function appendStationChunk(bvName, items) {
    const wrapper = getItemWrapper(bvName);
    if (!wrapper || !items.length) return;

    items.forEach((item) => {
        const opt = createStationOption(item);
        // 优先挂到页面树内的 wrapper，保留父级上下文，避免 CC 绑定读不到 data
        if (typeof wrapper.insertComponent === 'function') {
            wrapper.insertComponent(opt);
        } else if (typeof Model !== 'undefined' && Model.render) {
            Model.render(wrapper, opt);
        } else {
            wrapper.appendChild(jame(opt));
        }
    });
}

function startChunkRender(list) {
    stopChunkRender();
    clearAllItemWrappers();
    _chunkSize = shouldUseFastChunk() ? CHUNK_SIZE_FAST : CHUNK_SIZE_DEFAULT;

    const queue = [];
    getOrderedBvNames(list).forEach((bvName) => {
        (list[bvName] || []).forEach((item) => {
            queue.push({ bvName, item });
        });
    });
    _renderQueue = queue;

    // 等 item-wrapper 挂上 data-bv-name 后再开始灌（下一帧）
    requestAnimationFrame(() => {
        if (_renderQueue.length) scheduleChunkRender();
    });
}

function scheduleChunkRender() {
    if (_rafId != null) return;
    _rafId = requestAnimationFrame(() => {
        _rafId = null;
        flushChunk();
    });
}

function flushChunk() {
    if (!_renderQueue.length) return;

    const firstBv = _renderQueue[0].bvName;
    const wrapper = getItemWrapper(firstBv);
    if (!wrapper) {
        // item-wrapper 还没挂上，下一帧再试（不丢队列）
        scheduleChunkRender();
        return;
    }

    // 同一帧内只追加同一电压等级的一小批，几个几个出现
    const batchItems = [];
    while (_renderQueue.length && _renderQueue[0].bvName === firstBv && batchItems.length < _chunkSize) {
        batchItems.push(_renderQueue.shift().item);
    }

    appendStationChunk(firstBv, batchItems);

    if (_renderQueue.length) scheduleChunkRender();
}

function init(needClear) {
    try {
        jam.ajaxCall({
            urlKey: 'getDevTaizhang',
            transform(res) {
                // _this.vars.isLoading = false;
                const data = res.data || [];
                needClear && clearAllItemWrappers();
                stopChunkRender();

                const dataTemp = data.map((item) => ({
                    ...item,
                    subareaName: item.regionName || '--',
                    stName: item.stName.includes(item.bvName) ? item.stName.replace(item.bvName, '') : item.stName,
                    firstWord: firstWordOfName(item)
                }));
                const list = dataTemp.reduce((acc, item) => {
                    const { bvName } = item;
                    acc[bvName] = acc[bvName] || [];
                    acc[bvName].push(item);
                    return acc;
                }, {});
                Object.keys(list).forEach((bvName) => {
                    list[bvName].sort((a, b) => {
                        const letterA = a.firstWord || '';
                        const letterB = b.firstWord || '';
                        return letterA.localeCompare(letterB, 'zh-CN');
                    });
                });
                if (_model?.vars) _model.vars.stationDataList = list;
                _msgr.pub('stationDataList', list);
                startChunkRender(list);
            },
            data: packageParams(),
            useMock: true,
            method: 'post'
        });
    } catch (e) {
    } finally {
        // _this.vars.isLoading = false;
    }
}

function updatecurrentBvList(value = null) {
    let currentBvList = jam.cloneDeep(_model.vars.bvList);
    if (!value) {
        currentBvList.splice(0, 1);
        _model.vars.currentBvList = currentBvList;
    } else {
        let rt = [];
        for (let item of currentBvList) {
            if (value === item.value) {
                rt.push(item);
                break;
            }
        }
        _model.vars.currentBvList = rt;
    }
}
