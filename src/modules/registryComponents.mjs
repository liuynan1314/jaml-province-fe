import { DATA_PATH, ICON_PATH } from '../utils/Constants.js';
import { resolveModuleById } from '../utils/pageEditorUtil.js';

// 配置获取设备类型的清单
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

// 配置获取应用类型的清单
export const APP_TYPE = [
    { value: '1', name: 'SCADA' },
    { value: '2', name: '新能源' },
    { value: '3', name: '状态估计' },
    { value: '4', name: '静态安全' }
];
const cachedAllList = {};

export default {
    type: 'bottomSheet',
    id: 'registryCenter',
    slot: 'layer',
    styles: [
        'icon.solid',
        // Styles.card.floating({
        //     width: '100%'
        // }),
        Styles.stylesheet({
            '&': {
                zIndex: 99999,
                padding: '1rem',
                borderRadius: '0.5rem 0.5rem 0 0',
                height: '50%',
                width: '80%',
                left: 0,
                margin: '0 10%',
                boxShadow: '0.15rem 0rem 0.25rem hsla(0, 0%, 0%, 0.2)',
                backgroundColor: 'var(--jam-sys-background-color-extra-primary,var(--jam-card-bodysolot-backgroud-color,hsla(0,0%,0%,0.8)))'
            },
            '#devSidebar': {
                '.dev-group': {
                    'margin-bottom': '0.5rem'
                },
                '.dev-name': {
                    cursor: 'pointer',
                    padding: '0.5rem',
                    img: { filter: 'hue-rotate(calc(var(--jam-ac-h) * 1deg))  drop-shadow(0px 0.04rem 0.1rem var(--jam-ac-color))', transform: 'scale(0.8)', '--jam-icon-size': '1.2rem' },
                    '[slot="value"]': {
                        'font-family': 'DINpro',
                        'font-weight': 'bold',
                        color: jam.ac({ l: jam.lumiO(10) }),
                        'text-shadow': '0 0.1rem 0.2rem hsla(0,0%,47%,0.4)',
                        'margin-right': '0.5rem'
                    }
                },
                '.group-list': {
                    display: 'flex',
                    flexDirection: 'column',
                    'padding-left': '1.5rem',
                    '.group-name': {
                        cursor: 'pointer',
                        padding: '0.3rem',
                        borderRadius: 'var(--jam-sys-border-radius-tertiary)'
                    }
                }
            },
            '.widgets-wrapper': {
                overflow: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(8rem, 1fr))',
                gap: '1rem',
                // 'flex-wrap': 'wrap',
                '.widget-wrapper': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    backgroundImage: `linear-gradient(180deg,hsla(0,0%,100%,0.01) 50%,hsla(0,0,0,0.03))`,
                    backgroundColor: 'var(--jam-sys-background-color-surface-quaternary)',
                    boxShadow: '0rem 0.15rem 0.35rem hsla(0,0%,0%,var(--jam-lumi-a-10))',
                    borderRadius: 'var(--jam-sys-border-radius-tertiary)',
                    cursor: 'pointer'
                },
                '.jam-cc': {
                    aspectRatio: 'var(--w) / var(--h)',
                    // padding: 'var(--gap-padding)',
                    // margin: '1rem',
                    // cursor: 'pointer',
                    transition: 'box-shadow 0.4s ease-in-out',
                    position: 'relative',
                    '.fa-circle-plus': {
                        fontSize: '1rem'
                    },
                    '&:hover': {
                        boxShadow: '0rem 1rem 1rem hsla(0,0%,0%,var(--jam-lumi-a-10))'
                    }
                }
            },
            'body.jam-dark :scope #devSidebar .dev-name [slot="layer"]': { 'text-shadow': '0 0.1rem 0.2rem hsla(0,0%,0%,0.8)' }
        })
    ],
    components: [
        {
            type: 'container',
            styles: [
                Styles.size.fullsize,
                Styles.css({
                    display: 'grid',
                    gridTemplateColumns: '11rem auto',
                    gridTemplateRows: '2rem auto',
                    gap: '1rem'
                })
            ],
            components: [
                {
                    type: 'container',
                    styles: [Styles.css({ 'grid-column': '1 / span 2' })],
                    childStyles: [Styles.icon.solid],
                    components: [
                        {
                            type: 'buttongroup-radio',
                            icon: 'layer-group',
                            cap: '业务类型: ',
                            value: '{{appType}}',
                            data: APP_TYPE
                        },
                        {
                            type: 'buttongroup-radio',
                            icon: 'gear',
                            cap: '将模块新建为: ',
                            help: '选择包裹业务模块的容器类型，如带标题和图标的卡片或普通容器',
                            plugins: ['popup.helper'],
                            data: [
                                {
                                    name: '卡片',
                                    value: 'card'
                                },
                                {
                                    name: '容器',
                                    value: 'container'
                                }
                            ],
                            value: '{{newModuleType}}'
                        }
                    ]
                },
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
                                            styles: [Styles.hover.crosshair({ radius: 'var(--jam-sys-border-radius-tertiary)' })],
                                            state: '{{group.id}} === {{selected.id}} ? "selected":"default"',
                                            states: {
                                                default: {
                                                    styles: [Styles.css({ background: 'transparent', color: jam.lumiText(5) })]
                                                },
                                                selected: {
                                                    styles: [Styles.css({ background: jam.ac(), color: jam.lumiText(5) })]
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
                    components: jaml.var('selected', 'editMode@mango', async function (selected, editMode) {
                        if (!selected || !editMode) {
                            return [];
                        }
                        const _res = await jam.ajaxCall(`${DATA_PATH}/devType${selected.devType}/${selected.id}.json`);
                        return [
                            ..._res.widgets.map((item) => ({
                                type: 'wrapper',
                                class: 'widget-wrapper',
                                title: '添加到页面',
                                components: [
                                    {
                                        type: item.type,
                                        props: item.props,
                                        styles: [...item.styles, Styles.vars({ '--w': item.size[0], '--h': item.size[1] }), Styles.size.fullsize, Styles.css({ pointerEvents: 'none' })]
                                    }
                                ],
                                vars: item.vars,
                                varsUrl: item.varsUrl,
                                onclick: async () => {
                                    const _id = `${this.model.vars.newModuleType}@@${_res.id}@@${item.id}`;
                                    // const _id = `${this.model.vars.newModuleType}@@${_res.id}@@undefined`;
                                    let _card = document.querySelector(`[data-id="${item.id}"]`);
                                    // let _card = document.querySelector(`[data-id=undefined]`);
                                    if (_card) {
                                        jam.notify('当前页面中已存在该模块', 'info');
                                        jam.locate(_card, { color: jam.ac() });
                                        return;
                                    }
                                    jam.currantComposable.putNewCardInCanvas(await resolveModuleById(_id));
                                    // const icon = selected?.icon || ALL_COMPONENTS.find((item) => item.cap === selected.name)?.icon || 'border-all';
                                    // 配置新卡片
                                    // jam.currantComposable.putNewCardInCanvas({
                                    //     id: _id,
                                    //     type: 'card',
                                    //     cap: selected.name,
                                    //     icon: icon,
                                    //     size: item.size,
                                    //     class: 'single-widgets'
                                    // });
                                },
                                onmouseenter() {
                                    // const el = jame({
                                    //     type: 'label',
                                    //     id: `label-${item.key}`,
                                    //     icon: 'circle-plus',
                                    //     styles: ['icon.solid', 'css(position:absolute;bottom:0.5rem;right:0.5rem;display:flex)']
                                    // });
                                    const el1 = jame({
                                        type: 'label',
                                        id: `size-${item.key}`,
                                        cap: `${item.size[0]} x ${item.size[1]}`,
                                        styles: [`css(display:flex;justifyContent:center;position:absolute;bottom:0.5rem;right:0.5rem;padding:0.1rem 0.5rem;border-radius:var(--jam-sys-border-radius-tertiary);backdrop-filter:blur(2px);background:${jam.ac({ l: 1.2, a: 0.3 })};width: 6rem;height: 1.5rem;)`]
                                    });
                                    // jam.appendChild(this, el);
                                    jam.appendChild(this, el1);
                                },
                                onmouseleave() {
                                    // const el = jam.findElement(`#label-${item.key}`);
                                    const el1 = jam.findElement(`#size-${item.key}`);
                                    // jam.removeSelf(el);
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
                            }))
                        ];
                    })
                },
                {
                    type: 'button',
                    class: 'jam-close-btn jam-extra-btn',
                    slot: 'extra',
                    icon: '×',
                    styles: [
                        Styles.css({
                            position: 'absolute',
                            top: '0',
                            right: '0'
                        })
                    ],
                    onclick() {
                        this.parentNode.parentNode.hideSheet();
                    }
                }
            ]
        }
    ],
    watchers: [
        {
            keys: ['appType', 'listSearch', 'time'],
            callback: async function (appType, search) {
                if (Object.keys(cachedAllList).length === 0) {
                    await getData();
                }
                const list = [];
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
    // 覆盖组件自身的挂载事件，防止事件重复监听
    onmount() {},
    vars: {
        devType: '1', // 设备类型 单独文件
        appType: '1',
        newModuleType: 'card' // 新建模块的类型，默认为卡片
    },
    props: {
        icon: 'grid-2',
        awakeDistance: 280
    }
};

async function getData() {
    for (let i = 0; i < DEVICE_TYPE.length; i++) {
        const type = DEVICE_TYPE[i].value;
        let res;
        try {
            res = await jam.addResource(`${DATA_PATH}/list-devType${type}.json`);
        } catch (e) {
            res = { cmpts: [] };
        }
        cachedAllList[type] = res?.cmpts || [];
    }
    return cachedAllList;
}
