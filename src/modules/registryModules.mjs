import { addResource, assign, cloneDeep, closest, currantComposable, CurrantComposable, omit, popup, round } from '@jam/jam-ui';
import { DATA_PATH, ICON_PATH } from '../utils/Constants.js';

export const DEVICE_TYPE = [
    { value: '1', name: '电网', icon: '电网.svg' },
    { value: '2', name: '厂站', icon: '厂站.svg' },
    { value: '3', name: '一次设备', icon: '一次设备.svg' },
    { value: '4', name: '开断设备', icon: '开断设备.svg' },
    { value: '5', name: '变压器', icon: '变压器.svg' },
    { value: '6', name: '母线', icon: '母线.svg' },
    { value: '7', name: '发电机', icon: '发电机.svg' },
    { value: '8', name: '交流线端', icon: '交流线端.svg' },
    { value: '9', name: '断路器', icon: '断路器.svg' },
    { value: '10', name: '刀闸', icon: '刀闸.svg' },
    { value: '11', name: '负荷', icon: '负荷.svg' },
    { value: '12', name: '馈线段', icon: '馈线段.svg' },
    { value: '13', name: '容抗器', icon: '容抗器.svg' }
];

export const APP_TYPE = [
    { value: '1', name: 'SCADA' },
    { value: '2', name: '新能源' },
    { value: '3', name: '状态估计' },
    { value: '4', name: '静态安全' }
];
const cachedAllList = {};

export default {
    type: 'bottomSheet',
    cap: '卡片中心',
    icon: 'grid-2',
    id: 'registryCenter',
    slot: 'layer',
    scopeBroker: true,
    styles: [
        'icon.solid',
        Styles.stylesheet({
            '&': {
                zIndex: 99999,
                padding: 'm',
                borderRadius: 'm m 0 0',
                height: '50%',
                width: '80%',
                left: 0,
                margin: '0 10%',
                boxShadow: '0.15rem 0rem 0.25rem hsla(0, 0%, 0%, 0.2)',
                backgroundColor: 'elevation'
            },
            '.widgets-wrapper': {
                overflow: 'auto',
                display: 'grid',
                height: '100%',
                width: '100%',
                gridTemplateColumns: 'repeat(6, minmax(8rem, 1fr))',
                gridAutoRows: '8rem',
                gap: 'm',
                '.modules-wrapper': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '8rem',
                    backgroundImage: `linear-gradient(180deg,hsla(0,0%,100%,0.01) 50%,hsla(0,0,0,0.03))`,
                    backgroundColor: 'elevation',
                    borderRadius: 's',
                    overflow: 'hidden',
                    padding: 's',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.4s ease-in-out',
                    position: 'relative',
                    'jam-label': {
                        display: 'flex',
                        flexFlow: 'column',
                        justifyContent: 'center',
                        '[slot=icon]': {
                            padding: 's',
                            width: '5rem',
                            height: '5rem',
                            fontSize: 'l'
                        }
                    }
                }
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            styles: [
                Styles.size.fullsize,
                Styles.css({
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'm'
                })
            ],
            components: [
                {
                    type: 'searchPanel',
                    props: { icon: 'search' },
                    styles: ['searchPanel.basic']
                },
                {
                    type: 'wrapper',
                    buildIf: '{{detailConfig@mango}}.hasRegistryCenter',
                    styles: [Styles.css({ gap: 's', height: '2rem' })],
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '卡片类型: ',
                            icon: 'tags',
                            styles: [Styles.icon.solid],
                            data: [
                                {
                                    name: '组态卡片',
                                    value: 'cards'
                                },
                                {
                                    name: '业务模块',
                                    value: 'modules'
                                }
                            ],
                            value: '{{registryType}}'
                        },
                        {
                            type: 'buttongroup-radio',
                            showIf: '{{registryType}} === "modules"',
                            icon: 'layer-group',
                            cap: '业务类型: ',
                            styles: [Styles.icon.solid],
                            value: '{{appType}}',
                            data: APP_TYPE
                        }
                    ]
                },
                {
                    type: 'container',
                    styles: [
                        Styles.css({
                            overflow: 'auto',
                            flex: 1
                        })
                    ],
                    components: [
                        {
                            type: 'container',
                            buildIf: '{{registryType}} === "cards"',
                            class: 'widgets-wrapper',
                            components: [
                                {
                                    type: 'wrapper',
                                    class: 'modules-wrapper',
                                    buildFor: 'item in modulesData',
                                    components: [
                                        {
                                            type: 'label',
                                            cap: '{{item.cap}}??"未命名卡片"',
                                            icon: '{{item.icon}}??"square-question"',
                                            styles: [Styles.icon.solid]
                                        }
                                    ],
                                    on: {
                                        // mouseenter: function () {
                                        //     const _path = this.cmpt?.item?.path;
                                        //     if (_path) {
                                        //         previewModules(_path, this);
                                        //     }
                                        // }
                                    }
                                }
                            ],
                            on: {
                                click: async function (e) {
                                    const _path = closest(e.target, '.modules-wrapper')?.cmpt?.item?.path;
                                    if (_path) {
                                        await currantComposable.createNewModuleFromResource(_path);
                                    }
                                }
                            }
                        },
                        // 注册中心
                        {
                            type: 'container',
                            buildIf: '{{registryType}} === "modules"',
                            styles: [
                                Styles.size.fullsize,
                                Styles.css({
                                    display: 'grid',
                                    gridTemplateColumns: '11rem calc(100% - 11rem)',
                                    gridTemplateRows: '1fr'
                                }),
                                Styles.stylesheet({
                                    '#devSidebar': {
                                        '.dev-group': {
                                            'margin-bottom': 's'
                                        },
                                        '.dev-name': {
                                            cursor: 'pointer',
                                            padding: 's',
                                            img: { filter: 'drop-shadow(0px 0.04rem 0.1rem var(--jam-color-primary-default))', transform: 'scale(0.8)', '--jam-icon-size': '1.2rem' },
                                            '[slot="value"]': {
                                                'font-family': 'DINpro',
                                                'font-weight': 'bold',
                                                color: 'primary',
                                                'text-shadow': '0 0.1rem 0.2rem hsla(0,0%,47%,0.4)',
                                                'margin-right': 's'
                                            }
                                        },
                                        '.group-list': {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            'padding-left': 'l',
                                            '.group-name': {
                                                cursor: 'pointer',
                                                padding: 's',
                                                borderRadius: 's'
                                            }
                                        }
                                    },
                                    '.widgets-wrapper': {
                                        overflow: 'auto',
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, minmax(8rem, 1fr))',
                                        gridAutoRows: 'unset',
                                        // 'flex-wrap': 'wrap',
                                        '.widget-wrapper': {
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '100%',
                                            height: '100%'
                                        },
                                        '.jam-cc': {
                                            // height: `calc(var(--h) * 7rem)`,
                                            aspectRatio: 'var(--w) / var(--h)',
                                            backgroundImage: `linear-gradient(180deg,hsla(0,0%,100%,0.01) 50%,hsla(0,0,0,0.03))`,
                                            backgroundColor: 'elevation',
                                            borderRadius: 's',
                                            padding: 'var(--gap-padding)',
                                            margin: 'm',
                                            cursor: 'pointer',
                                            transition: 'box-shadow 0.4s ease-in-out',
                                            position: 'relative',
                                            '.fa-circle-plus': {
                                                fontSize: 'm'
                                            }
                                        }
                                    }
                                })
                            ],
                            components: [
                                {
                                    type: 'container',
                                    id: 'devSidebar',
                                    styles: [Styles.css({ 'overflow-y': 'auto', display: 'flex', flexDirection: 'column' })],
                                    components: [
                                        {
                                            type: 'wrapper',
                                            buildFor: 'devList in list',
                                            class: 'dev-group',
                                            styles: [Styles.css({ display: 'flex', flexDirection: 'column' })],
                                            components: [
                                                {
                                                    type: 'indicator',
                                                    key: 'value',
                                                    class: 'dev-name',
                                                    cap: '{{devList.name}}',
                                                    icon: `<img src="${ICON_PATH}/{{devList.icon}}"></img>`,
                                                    styles: [Styles.indicator.inline, Styles.indicator.cap.css({ flex: 1 }), Styles.hover.brighter, Styles.background.gradient],
                                                    value: '{{devList.count}}',
                                                    onclick() {
                                                        this.cmpt.devList.show = !this.cmpt.devList.show;
                                                    }
                                                },
                                                {
                                                    type: 'container',
                                                    class: 'group-list',
                                                    showIf: '{{devList.show}}',
                                                    styles: [Styles.stylize.oddeven],
                                                    components: [
                                                        {
                                                            type: 'label',
                                                            key: 'id',
                                                            cap: '{{group.name}}',
                                                            class: 'group-name',
                                                            buildFor: 'group in devList.data',
                                                            styles: [Styles.hover.crosshair({ radius: 's' })],
                                                            state: '{{group.id}} === {{selected.id}} ? "selected":"default"',
                                                            states: {
                                                                default: {
                                                                    styles: [Styles.css({ background: 'transparent', color: 'var(--jam-color-fg-default)' })]
                                                                },
                                                                selected: {
                                                                    styles: [Styles.css({ background: 'accent', color: 'onprimary' })]
                                                                }
                                                            },
                                                            onclick() {
                                                                this.model.vars.selected = this.cmpt.group;
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'container',
                                    class: 'widgets-wrapper',
                                    components: jaml.var('selected', async function (selected) {
                                        if (!selected) {
                                            return [];
                                        }
                                        // TODO 此处展示的卡片替换成 modules 下面的模块
                                        const _res = await jam.ajaxCall(`${DATA_PATH}/devType${selected.devType}/${selected.id}.json`);
                                        return [
                                            ..._res.widgets.map((item) => ({
                                                type: 'wrapper',
                                                class: 'widget-wrapper',
                                                components: [
                                                    {
                                                        type: item.type,
                                                        props: item.props,
                                                        styles: [...item.styles, Styles.vars({ '--w': item.size[0], '--h': item.size[1] })],
                                                        vars: item.vars,
                                                        varsUrl: item.varsUrl,
                                                        onclick() {
                                                            const icon = selected?.icon || ALL_COMPONENTS.find((item) => item.cap === selected.name)?.icon || 'border-all';
                                                            const oldConfig = JSON.parse(jam.getFromStorage(CurrantComposable.propsStorageName));
                                                            const component = {
                                                                ...oldConfig,
                                                                [`${_res.devType}@@${_res.id}@@${item.type}`]: {
                                                                    type: item.type,
                                                                    props: item.props,
                                                                    styles: [...item.styles],
                                                                    vars: item.vars,
                                                                    varsUrl: item.varsUrl
                                                                }
                                                            };
                                                            jam.save2Storage(CurrantComposable.propsStorageName, JSON.stringify(component));
                                                            jam.currantComposable.putNewCardInCanvas({
                                                                id: `${_res.devType}@@${_res.id}@@${item.type}`,
                                                                type: 'card',
                                                                cap: selected.name,
                                                                icon: icon,
                                                                size: item.size,
                                                                class: 'single-widgets'
                                                            });
                                                        },

                                                        onmouseenter() {
                                                            const el = jame({
                                                                type: 'label',
                                                                id: `label-${item.key}`,
                                                                icon: 'circle-plus',
                                                                styles: ['icon.solid', 'css(position:absolute;top:-0.8rem;left:-0.8rem;display:flex)']
                                                            });
                                                            const el1 = jame({
                                                                type: 'label',
                                                                id: `size-${item.key}`,
                                                                cap: `${item.size[0]} x ${item.size[1]}`,
                                                                styles: [`css(display:flex;justifyContent:center;position:absolute;bottom:s;right:s;padding:s;border-radius:var(--jam-border-radius-s);backdrop-filter:blur(2px);background:var(--jam-color-primary-film);width: 6rem;height: 1.5rem;)`]
                                                            });
                                                            jam.appendChild(this, el);
                                                            jam.appendChild(this, el1);
                                                        },
                                                        onmouseleave() {
                                                            const el = jam.findElement(`#label-${item.key}`);
                                                            const el1 = jam.findElement(`#size-${item.key}`);
                                                            jam.removeSelf(el);
                                                            jam.removeSelf(el1);
                                                        },
                                                        onmount() {
                                                            const [width, _] = item.size;
                                                            if (width >= 2.5) {
                                                                jam.applyStyle(this, {
                                                                    width: `100%`
                                                                });
                                                            } else {
                                                                jam.applyStyle(this, {
                                                                    width: `calc(${width * 8}rem + 2rem)`
                                                                });
                                                            }
                                                        }
                                                    }
                                                ]
                                            }))
                                        ];
                                    })
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'preview',
            build: false,
            ref: 'previewContainer',

            styles: [
                Styles.css({
                    minWidth: '20rem'
                })
            ],
            components: jaml.var('previewPath', async (resource) => {
                if (!resource) {
                    return;
                }

                let _card = '';
                if (typeof resource === 'string' && resource.endsWith('.mjs')) {
                    // 资源是一个.mjs文件资源路径
                    _card = await addResource(resource);
                    _card = cloneDeep(_card?.default || _card);
                } else if (typeof resource === 'object') {
                    // 资源是一个从cc中获取的对象
                    let [w = 1, h = 1] = resource?.size || [];
                    const _cardCols = round(w) ?? 1;
                    const _cardRows = round(h) ?? 1;
                    const _styles = [
                        Styles.css({
                            height: '100%',
                            aspectRatio: `${_cardCols} / ${_cardRows}`
                        })
                    ];
                    _card = cloneDeep(resource);
                    _card = omit(assign(_card, { id: _card.id, styles: _styles, components: [_component] }));
                }
                if (_card) {
                    // 添加icon.solid;
                    if (_card.styles) {
                        _card.styles.push(Styles.icon.solid);
                    } else {
                        _card.styles = [Styles.icon.solid];
                    }
                }

                return [_card];
            })
        }
    ],
    watchers: [
        {
            key: 'modulesData@mango',
            callback(value) {
                this.model.vars.modulesData = value;
            }
        },
        {
            key: 'searchText',
            callback(text) {
                this.model.vars.modulesData = getModuleInfos(text);
            },
            debounce: 200
        },
        {
            keys: ['appType', 'listSearch', 'time'],
            callback: async function (appType, search) {
                if (Object.keys(cachedAllList).length === 0) {
                    await getData();
                }
                const list = [];
                let _init = false;
                DEVICE_TYPE.forEach((devType, idx) => {
                    const devData = [];
                    cachedAllList[devType.value].forEach((item) => {
                        if ((jam.nullOrUndefined(search) || search.trim() === '' || item.name.includes(search)) && (appType === 'all' || appType === item.appType)) {
                            devData.push(item);
                        }
                    });
                    list.push({
                        data: devData,
                        ...devType,
                        show: idx === 0,
                        count: devData.length
                    });
                });
                this.model.vars.list = list;
                this.model.vars.selected = this.model.vars.list[0].data[0];
            },
            debounce: 200
        },
        {
            key: 'editMode@mango',
            init: true,
            callback(value) {
                if (value) {
                    this.showSheet();
                    this.enable();
                } else {
                    this.hideSheet();
                    this.disable();
                }
            }
        }
    ],
    vars: {
        registryType: 'cards',
        devType: '1', // 设备类型 单独文件
        appType: '1',
        searchRes: null
    },
    onmount() {
        this.model.vars.modulesData = getModuleInfos();
    }
};

async function getData() {
    for (let i = 0; i < DEVICE_TYPE.length; i++) {
        const type = DEVICE_TYPE[i].value;
        const res = (await jam.addResource(`${DATA_PATH}/list-devType${type}.json`)) || { cmpts: [] };
        cachedAllList[type] = res.cmpts;
    }
    return cachedAllList;
}

function previewModules(resource, container) {
    if (!resource || !container) {
        return;
    }

    popup(container, container.ref('previewContainer'), {
        container: document.getElementById('main'),
        showArrow: false,
        style: {
            width: 'max-content',
            height: 'max-content',
            maxWidth: '60rem',
            maxHeight: '45rem',
            overflow: 'auto'
        }
    });

    container.model.vars.previewPath = resource;
}

function getModuleInfos(name, type, pageNo, pageSize) {
    const _allComponents = mango.get('modulesData');
    // TODO 模糊搜索
    let _components2show = _allComponents.filter((componentInfo) => {
        const _n = !name || componentInfo.cap.includes(name);
        const _t = !type || (type && componentInfo?.showType && componentInfo.showType.includes(type));
        return _n && _t;
    });

    if (pageNo != null && pageSize != null) {
        _components2show = _components2show.slice((pageNo - 1) * pageSize, pageNo * pageSize);
    }

    return _components2show;
}
