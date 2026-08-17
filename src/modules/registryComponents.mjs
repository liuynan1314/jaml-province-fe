import { DATA_PATH, ICON_PATH } from '../utils/Constants.js';
import { putResolvedModuleInCanvas, resolveModuleById } from '../utils/pageEditorUtil.js';

const cellSize = [3.5, 2.5] // 单元格宽高3.5rem * 2.5rem;
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
                padding: 'm',
                borderRadius: 'm m 0 0',
                height: '50%',
                width: '80%',
                left: 0,
                margin: '0 10%',
                boxShadow: 's',
                backgroundColor: 'var(--jam-color-surface-highest)'
            },
            '#devSidebar': {
                '.dev-group': {
                    'margin-bottom': 's'
                },
                '.dev-name': {
                    cursor: 'pointer',
                    padding: 's',
                    img: {
                        filter: 'drop-shadow(0px 0.04rem 0.1rem var(--jam-color-primary-default))',
                        transform: 'scale(0.8)',
                        '--jam-icon-size': '1.2rem'
                    },
                    '[slot="value"]': {
                        'font-family': 'DINpro',
                        'font-weight': 'bold',
                        color: 'primary',
                        'text-shadow': 's',
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
                display: 'flex',
                justifyContent: 'flex-start',
                flexWrapper: 'wrap',
                alignItems: 'center',
                gap: 'm',
                // 'flex-wrap': 'wrap',
                '.widget-wrapper': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    height: 'fit-content',
                    backgroundColor: 'elevated',
                    borderRadius: 's',
                    cursor: 'pointer'
                },
                '.jam-cc': {
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
            styles: [
                Styles.size.fullsize,
                Styles.css({
                    display: 'grid',
                    gridTemplateColumns: '11rem auto',
                    gridTemplateRows: '2rem auto',
                    gap: 'm'
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
                    styles: [
                        Styles.css({
                            'overflow-y': 'auto',
                            display: 'flex',
                            flexDirection: 'column'
                        })
                    ],
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
                                                    styles: [
                                                        Styles.css({
                                                            background: 'transparent',
                                                            color: 'var(--jam-color-fg-default)'
                                                        })
                                                    ]
                                                },
                                                selected: {
                                                    styles: [
                                                        Styles.css({
                                                            background: 'accent',
                                                            color: 'onprimary'
                                                        })
                                                    ]
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
                        console.log('_res', _res);

                        return [
                            ..._res.widgets.map((item) => {
                                const _item = jam.pick(item, 'type', 'props', item.varsUrl ? 'varsUrl' : 'vars', 'styles', 'class', 'components', 'color');
                                return {
                                    type: 'wrapper',
                                    class: 'widget-wrapper',
                                    title: '添加到页面',
                                    components: [
                                        {
                                            ..._item,
                                            styles: [
                                                ...item.styles,
                                                Styles.vars({
                                                    '--w': item.size[0],
                                                    '--h': item.size[1]
                                                }),
                                                Styles.size.fullsize,
                                                Styles.css({ pointerEvents: 'none' })
                                            ]
                                        }
                                    ],
                                    onclick: async () => {
                                        const _id = `${this.model.vars.newModuleType}@@${_res.id}@@${item.id}`;
                                        // const _id = `${this.model.vars.newModuleType}@@${_res.id}@@undefined`;
                                        let _card = document.querySelector(`[data-id="${item.id}"]`);
                                        // let _card = document.querySelector(`[data-id=undefined]`);
                                        if (_card) {
                                            jam.notify('当前页面中已存在该模块', 'info');
                                            jam.locate(_card, {
                                                color: 'var(--jam-color-primary-default)'
                                            });
                                            return;
                                        }
                                        await putResolvedModuleInCanvas(await resolveModuleById(_id));
                                    },
                                    onmouseenter() {
                                        // const el = jame({
                                        //     type: 'label',
                                        //     id: `label-${item.key}`,
                                        //     icon: 'circle-plus',
                                        //     styles: ['icon.solid', 'css(position:absolute;bottom:0.5rem;right:0.5rem;display:flex)']
                                        // });
                                        const el = jame({
                                            type: 'label',
                                            id: `size-${item.key}`,
                                            cap: `${item.size[0]} x ${item.size[1]}`,
                                            styles: [`css(display:flex;justifyContent:center;position:absolute;bottom:1rem;right:1REM;padding:s;border-radius:var(--jam-border-radius-s);backdrop-filter:blur(2px);background:var(--jam-color-primary-film);width: 6rem;height: 1.5rem;)`]
                                        });
                                        // jam.appendChild(this, el);
                                        jam.appendChild(this, el);
                                    },
                                    onmouseleave() {
                                        // const el = jam.findElement(`#label-${item.key}`);
                                        const el1 = jam.findElement(`#size-${item.key}`);
                                        // jam.removeSelf(el);
                                        jam.removeSelf(el1);
                                    },
                                    onmount() {
                                        const [width, height] = item.size;
                                        const [cw, ch] = cellSize;
                                            jam.applyStyle(this, {
                                                width: `${width * cw}rem`,
                                                height: `${height * ch}rem`
                                            });
                                    }
                                };
                            })
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
