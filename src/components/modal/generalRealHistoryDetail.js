import { ajaxCall } from './../../common';
import './../../components/treeSelect';
// todo 遥信 遥测 radio
let queryLoading = null;
export default function (props) {
    let _model,
        _msgr,
        popupHideDelay,
        popupController = false;
    const typeMap = {
            有功: {
                name: '有功',
                color: 'hsl(156.3, 52.5%, 53.7%)',
                unit: 'MW'
            },
            无功: {
                name: '无功',
                color: 'hsl(45, 69.6%, 63.9%)',
                unit: 'MW'
            },
            电流: {
                name: '电流',
                color: 'hsl(180, 100%, 41%)',
                unit: 'A'
            },
            温度: {
                name: '温度',
                color: 'hsl(195.3, 100%, 56.1%)',
                unit: '℃'
            },
            负载率: {
                name: '负载率',
                color: 'hsl(195.3, 100%, 56.1%)',
                unit: '%'
            }
        },
        codesStateMap = {
            采集有问题: 'alarm',
            采集异常: 'warn',
            越合理范围: 'warn',
            来源转发: 'normal',
            工况退出: 'error',
            不变化: 'alarm',
            可疑: 'alarm',
            未初始化: 'alarm',
            封锁: 'fine',
            告警抑制: 'fine',
            禁止控制: 'fine',
            控制中: 'normal',
            置数: 'normal',
            非实测: 'alarm',
            计算: 'normal',
            被状态估计替代: 'alarm',
            被对侧代: 'alarm',
            被旁路代: 'alarm',
            异常旁路代: 'warn',
            分量不正常: 'warn',
            跳变: 'alarm',
            历史值被改: 'alarm',
            越上限1: 'alarm',
            越下限1: 'alarm',
            越上限2: 'warn',
            越下限2: 'warn',
            越预警值上限: 'alarm',
            越预警值下限: 'alarm',
            越告警值上限: 'warn',
            越告警值下限: 'warn',
            越上限3: 'error',
            越下限3: 'error',
            越上限4: 'error',
            越下限4: 'error',
            正常: 'success'
        },
        colorMap = {
            fine: {
                style: {
                    '--value-clr': 'hsla(210, 10%, 70%, 1)',
                    '--bdr-clr': 'hsla(210, 10%, 70%, 0.3)',
                    '--bg-clr': 'hsla(215, 5%, 32%,1)'
                }
            },
            normal: {
                style: {
                    '--value-clr': 'hsl(210, 60%, 60%)',
                    '--bdr-clr': 'hsla(210, 60%, 60%, 0.3)',
                    '--bg-clr': 'hsla(215, 40%, 42%,1)'
                }
            },
            success: {
                style: {
                    '--value-clr': 'hsla(138, 90%, 80%, 1)',
                    '--bdr-clr': 'hsla(145, 70%, 42%, 0.3)',
                    '--bg-clr': 'hsla(145, 70%, 42%)'
                }
            },
            alarm: {
                style: {
                    '--value-clr': 'hsla(50, 100%, 85%, 1)',
                    '--bdr-clr': 'hsla(52, 85%, 48%, 0.5)',
                    '--bg-clr': 'hsla(52, 85%, 48%)'
                }
            },
            warn: {
                style: {
                    '--value-clr': 'hsla(28, 100%, 80%,1)',
                    '--bdr-clr': 'hsla(35, 100%, 45%, 0.6)',
                    '--bg-clr': 'hsla(35, 100%, 45%)'
                }
            },
            error: {
                style: {
                    '--value-clr': 'hsla(0, 100%, 80%, 1)',
                    '--bdr-clr': 'hsla(0, 90%, 50%, 1)',
                    '--bg-clr': 'hsla(359, 70%, 54%)'
                }
            }
        },
        detailDataMap = new Map(),
        codesColorMap = { 采集有问题: 'hsl(50, 90%, 60%)', 采集异常: 'hsl(30, 80%, 55%)', 越合理范围: 'hsl(30, 80%, 55%)', 来源转发: 'hsl(210, 60%, 60%)', 工况退出: 'hsl(0, 70%, 50%)', 不变化: 'hsl(50, 90%, 60%)', 可疑: 'hsl(50, 90%, 60%)', 未初始化: 'hsl(50, 90%, 60%)', 封锁: 'hsl(210, 10%, 70%)', 告警抑制: 'hsl(210, 10%, 70%)', 禁止控制: 'hsl(210, 10%, 70%)', 控制中: 'hsl(210, 60%, 60%)', 置数: 'hsl(210, 60%, 60%)', 非实测: 'hsl(35, 85%, 60%)', 计算: 'hsl(210, 60%, 60%)', 被状态估计替代: 'hsl(35, 85%, 60%)', 被对侧代: 'hsl(35, 85%, 60%)', 被旁路代: 'hsl(35, 85%, 60%)', 异常旁路代: 'hsl(30, 80%, 55%)', 分量不正常: 'hsl(30, 80%, 55%)', 跳变: 'hsl(50, 90%, 60%)', 历史值被改: 'hsl(50, 90%, 60%)', 越上限1: 'hsl(50, 90%, 60%)', 越下限1: 'hsl(50, 90%, 60%)', 越上限2: 'hsl(30, 80%, 55%)', 越下限2: 'hsl(30, 80%, 55%)', 越上限3: 'hsl(0, 70%, 50%)', 越下限3: 'hsl(0, 70%, 50%)', 越上限4: 'hsl(0, 70%, 50%)', 越下限4: 'hsl(0, 70%, 50%)', 正常: ' hsl(120, 60%, 45%)' };
    return {
        type: 'card',
        icon: '',
        cap: props?.devName || '运行数据',
        styles: [
            Styles.card.floating({
                width: '64vw',
                height: '40vw'
            })
        ],
        components: [
            {
                type: 'wrapper',
                // broker: 'generalDetail',
                styles: ['size.fullsize', 'padding(s l l)', 'flex(direction:column)'],
                descStyles: {
                    '.main-wrapper': ['size.fullsize', 'margin(top:s)', 'layout(overflow:hidden)'],
                    '.flex-column': ['flex(direction:column)'],
                    '.icon-duotone': ['icon.duotone']
                },
                components: [
                    {
                        type: 'buttongroup-radio',
                        value: '{{tabIndex}}',
                        styles: [Styles.tabButtonStyles],
                        data: [
                            {
                                name: '实时数据',
                                value: 1
                            },
                            {
                                name: '历史数据',
                                value: 2
                            }
                        ]
                    },
                    {
                        type: 'divider',
                        styles: ['size(height:.0625rem)', 'background(color:var(--jam-color-outline-muted))']
                    },
                    {
                        type: 'wrapper',
                        class: 'main-wrapper flex-column',
                        buildIf: '{{tabIndex}} === 1',
                        // 显示实时数据
                        styles: [],
                        components: [
                            {
                                type: 'wrapper',
                                components: [
                                    {
                                        type: 'buttongroup-checkbox',
                                        value: '{{dataType}}',
                                        styles: [
                                            Styles.stylesheet({
                                                '[value="undefined"]': {
                                                    display: 'none'
                                                }
                                            })
                                        ],
                                        data: [
                                            { name: '遥测', value: 1 },
                                            { name: '遥信', value: 0 }
                                        ]
                                    },
                                    {
                                        type: 'input',
                                        placeholder: '测点名称过滤',
                                        icon: 'search',
                                        class: 'icon-duotone',
                                        styles: ['input.agent.border(radius:s)', 'layout(position:relative)', 'size(width:12rem)', 'icon.css(position:absolute;right:xs)'],
                                        value: '{{searchText}}'
                                    }
                                ]
                            },
                            {
                                type: 'wrapper',
                                styles: [
                                    'flex(direction:column;gap:s)',
                                    'size.fullsize',
                                    'margin(top:s)',
                                    'layout(overflow:auto)',
                                    Styles.stylesheet({
                                        '.title': {
                                            background: 'linear-gradient(180deg, var(--jam-color-primary-subtle) 0%, var(--jam-color-primary-film) 100%)',
                                            borderBottom: 'xs solid var(--jam-color-outline-muted)',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            '&::after': {
                                                content: '"<<"',
                                                position: 'absolute',
                                                right: '1.625rem',
                                                transform: 'var(--arrow-rotate)',
                                                transition: 'transform .25s ease',
                                                fontFamily: 'cursive',
                                                fontSize: 'l',
                                                color: 'var(--jam-color-fg-muted)',
                                                letterSpacing: '-1rem'
                                            },
                                            'span[slot=icon]': {
                                                display: 'none'
                                            }
                                        }
                                    })
                                ],
                                components: [
                                    {
                                        type: 'wrapper',
                                        buildFor: '(item,index) in detailData',
                                        attrs: { idx: '{{index}}' },
                                        styles: ['flex(direction:column)'],
                                        state: '{{item.status}}',
                                        states: {
                                            hide: { styles: ['css(--arrow-rotate:rotate(0deg);--content-overflow:hidden;--content-max-height:0;--content-min-height:0;--content-padding:0 var(--jam-space-l);)'] },
                                            show: { styles: ['css(--arrow-rotate:rotate(-90deg);--content-overflow:visible;--content-max-height:36rem;--content-min-height:10rem;--content-padding:var(--jam-space-l))'] }
                                        },
                                        components: [
                                            {
                                                type: 'label',
                                                class: 'title',
                                                cap: '{{item.devName}}',
                                                onclick: function () {
                                                    const parent = jam.findParent(this);
                                                    parent.state = parent.state === 'show' ? 'hide' : 'show';
                                                },
                                                icon: ` <div >
                                                    <div style="width:.4rem;height:.4rem;background-image:linear-gradient(45deg,var(--jam-color-primary-default),var(--jam-color-primary-subtle));transform:rotate(45deg);box-shadow:2px 1px 1rem 2px var(--jam-color-primary-film)"></div>
                                                </div>`
                                            },
                                            {
                                                type: 'wrapper',
                                                styles: ['layout(overflow:var(--content-overflow);gap:var(--gap);)', 'layout.grid(cols:6)', 'padding(var(--content-padding))', 'size(maxHeight:var(--content-max-height);minHeight:var(--content-min-height))', 'css(--gap:var(--jam-space-l);gridTemplateColumns:repeat(6,calc(calc(100% - (5 * var(--gap))) / 6));transition:all .35s ease-in-out;)'],
                                                components: [
                                                    {
                                                        type: 'wrapper',
                                                        class: 'jam-cc',
                                                        buildFor: 'col in item.defineList',
                                                        // 搜索过滤
                                                        showIf: '{{dataType}}.includes({{col.type}})&&({{searchText}}?.trim()?{{col.colName}}.includes({{searchText}}):true)',
                                                        state: '{{col.status}}',
                                                        states: colorMap,
                                                        styles: [
                                                            //
                                                            'size.fullwidth',
                                                            'padding(padding:s;top:xs)',
                                                            `border(style:solid;width:.0625rem;color:var(--bdr-clr);radius:.25rem )`,
                                                            `css(aspectRatio:1/.618;background:linear-gradient(180deg,rgba(from var(--bg-clr) r g b / 0.1) 0%, rgba(from var(--bg-clr) r g b / 0) 100% ),rgba(255, 255, 255, 0.10);)`,
                                                            'layout(position:relative;)',
                                                            'hover.crosshair',
                                                            'flex(direction:column;)'
                                                            // hover outline: var(--jam-color-primary-default) / shadow.s
                                                        ],
                                                        components: [
                                                            {
                                                                type: 'label',
                                                                cap: '{{col.colName}}',
                                                                descStyles: {
                                                                    '&.jam-icon-bar::part(iconslot)': ['size(width:.625rem;height:1.25rem)', 'border(radius:xxs)', 'background(var(--bg-clr))']
                                                                },
                                                                styles: ['text(size:l)', 'icon.bar']
                                                            },
                                                            {
                                                                type: 'wrapper',
                                                                styles: ['margin(top:auto;)', 'flex(direction:column;)'],
                                                                components: [
                                                                    {
                                                                        buildIf: '{{col.unit}}==="%"',
                                                                        type: 'progress',
                                                                        styles: ['color.stateMap(good:hsl(145 100% 39.2%);passed:hsl(40 100% 50%);failed:hsl(0 100% 66.1%))'],
                                                                        valueStates: {
                                                                            failed: 'value>=0.9',
                                                                            passed: 'value>=0.8',
                                                                            good: 'value<0.8'
                                                                        },
                                                                        value: '{{col.value}} / 100'
                                                                    },
                                                                    {
                                                                        buildIf: '{{col.unit}}!=="%"',
                                                                        type: 'indicator',
                                                                        styles: ['css(justifyContent:flex-start)'],
                                                                        value: '!{{col.type}}?["分", "合"][{{col.value}}]:{{col.value}}',
                                                                        unit: '{{col.unit}}'
                                                                    },
                                                                    {
                                                                        // qualityCodes
                                                                        type: 'wrapper',
                                                                        styles: ['layout(overflow: auto;)'],
                                                                        components: [],
                                                                        watchers: [
                                                                            {
                                                                                key: 'col.qualityCodes',
                                                                                callback(codes) {
                                                                                    if (!codes || !codes?.length) {
                                                                                        this.cmpt.components = [{ type: 'label', cap: '--' }];
                                                                                        return;
                                                                                    }

                                                                                    if (codes.length < 3) {
                                                                                        const cmpt = codes.map((code) => ({
                                                                                            type: 'label',
                                                                                            styles: codeStyles(code),
                                                                                            cap: code
                                                                                        }));
                                                                                        this.cmpt.components = cmpt;
                                                                                        return;
                                                                                    } else {
                                                                                        const [code1, code2] = codes;
                                                                                        this.cmpt.components = [
                                                                                            {
                                                                                                type: 'label',
                                                                                                styles: codeStyles(code1),
                                                                                                cap: code1
                                                                                            },
                                                                                            {
                                                                                                type: 'label',
                                                                                                styles: codeStyles(code2),
                                                                                                cap: code2
                                                                                            },
                                                                                            {
                                                                                                type: 'label',
                                                                                                styles: [
                                                                                                    Styles.stylesheet({
                                                                                                        ':scope': {
                                                                                                            cursor: 'grab',
                                                                                                            color: 'var(--jam-color-fg-muted)'
                                                                                                        }
                                                                                                    })
                                                                                                ],
                                                                                                cap: `+${codes.length - 2}`,
                                                                                                onmouseenter: function (e) {
                                                                                                    clearTimeout(popupHideDelay);
                                                                                                    jam.popup(
                                                                                                        e.target,
                                                                                                        jame({
                                                                                                            type: 'wrapper',
                                                                                                            styles: ['size(width:max-content;)', 'border(width:0)', 'layout(overflow:hidden)', 'layout.flex(direction:column;wrap:nowrap;)', 'with.elevation'],
                                                                                                            components: codes.map((code) => ({
                                                                                                                type: 'label',
                                                                                                                styles: codeStyles(code, true),
                                                                                                                cap: code
                                                                                                            })),
                                                                                                            onmouseenter: function () {
                                                                                                                popupController = true;
                                                                                                            },
                                                                                                            onmouseleave: function () {
                                                                                                                jam.closePopup();
                                                                                                                popupController = false;
                                                                                                            }
                                                                                                        })
                                                                                                    );
                                                                                                },
                                                                                                onmouseleave: function () {
                                                                                                    popupHideDelay = setTimeout(() => {
                                                                                                        if (popupController) return;
                                                                                                        jam.closePopup();
                                                                                                        popupController = false;
                                                                                                    }, 300);
                                                                                                }
                                                                                            }
                                                                                        ];
                                                                                    }
                                                                                },
                                                                                debounce: 100
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                type: 'label',
                                                                cap: jaml.var('col.type', (type) => ['遥信', '遥测'][type]),
                                                                state: '{{col.type}}',
                                                                states: {
                                                                    0: { styles: [Styles.background({ color: 'var(--jam-color-primary-default)' })] },
                                                                    1: { styles: [Styles.background({ image: 'linear-gradient(to bottom, var(--jam-color-primary-subtle), transparent)' })] }
                                                                },
                                                                styles: ['layout(position:absolute;)', 'css(right:-.0625rem;top:-.0625rem;writing-mode:tb;)', 'text(size:s;color:muted)']
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        class: 'main-wrapper',
                        buildIf: '{{tabIndex}} === 2',
                        // 显示历史数据
                        styles: [],
                        components: [
                            {
                                type: 'treeSelect'
                            },
                            {
                                type: 'wrapper',
                                class: 'flex-column',
                                styles: ['size.fullsize', 'padding(left:s)'],
                                descStyles: {},
                                components: [
                                    {
                                        type: 'wrapper',
                                        descStyles: {
                                            datepicker: [
                                                'datepicker.agent.border(radius:s)',
                                                'datepicker.agent.css(minWidth:7rem;maxWidth:7rem)'
                                                // Styles.stylesheet({
                                                //     'input[agent="true"]': {
                                                //         width: '10rem'
                                                //     }
                                                // })
                                            ],
                                            timepicker: ['size(minWidth:7.25rem;maxWidth:7.25rem)', 'timepicker.agent.border(radius:s)', 'padding(left:0;right:0)'],
                                            '.ml-5': ['margin(left:s)'],
                                            button: [Styles.searchBtnsStyles]
                                        },
                                        components: [
                                            {
                                                type: 'datepicker',
                                                class: 'icon-duotone',
                                                value: '{{beginDate}}',
                                                pattern: 'yyyy-MM-dd',
                                                icon: 'calendar',
                                                cap: '起止时间:'
                                            },
                                            {
                                                type: 'timepicker',
                                                step: 1,
                                                value: '{{beginTime}}'
                                            },
                                            {
                                                type: 'datepicker',
                                                value: '{{endDate}}',
                                                pattern: 'yyyy-MM-dd',
                                                cap: '-'
                                            },
                                            {
                                                type: 'timepicker',

                                                step: 1,
                                                value: '{{endTime}}'
                                            },
                                            {
                                                type: 'radio',
                                                class: 'ml-5',
                                                styles: ['options.optionslot.layout(gap:xs)'],
                                                data: [
                                                    { name: '昨日', value: 1 },
                                                    { name: '今日', value: 0 },
                                                    { name: '近三天', value: 3 },
                                                    { name: '近七天', value: 7 }
                                                ],
                                                value: 0,
                                                onvaluechange: function (value) {
                                                    _model.endDate = moment().format('YYYY-MM-DD');
                                                    _model.beginDate = moment().subtract(value, 'day').format('YYYY-MM-DD');
                                                }
                                            },
                                            {
                                                type: 'button',
                                                cap: '查询',
                                                icon: 'search',
                                                class: 'jam-cta ml-5',
                                                onclick() {
                                                    searchHistorySample();
                                                }
                                            },
                                            {
                                                type: 'button',
                                                cap: '导出',
                                                icon: 'file-export',
                                                class: 'icon-duotone ml-5',
                                                styles: [`hide`],
                                                onclick() {
                                                    // todo
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        type: 'chart-line',
                                        class: 'historySampleChartLine',
                                        colorSet: ['primary', 'success', 'muted'],
                                        styles: [
                                            Styles.size.fullsize,
                                            Styles.echarts.legend({
                                                show: true,
                                                icon: 'rect',
                                                itemWidth: '12px',
                                                itemHeight: '6px'
                                            }),

                                            Styles.echarts.grid({
                                                left: 45,
                                                right: 60,
                                                bottom: 10
                                            }),

                                            Styles.echarts.axis.x({
                                                name: '时间'
                                            }),

                                            Styles.echarts.axis.x.line.lineStyle({
                                                color: 'hsl(217.5 20% 39.22%)'
                                            }),
                                            Styles.echarts.axis.y({ scale: true }),
                                            Styles.echarts.axis.y.line.lineStyle({
                                                color: 'hsl(217.5 20% 39.22%)'
                                            }),
                                            Styles.echarts.axis.y.label.textStyle({
                                                color: 'hsl(205.09 44% 75.49%)'
                                            }),
                                            Styles.echarts.axis.y.splitLine.lineStyle({
                                                color: 'hsl(212.86 32.31% 25.49%)',
                                                type: 'dashed'
                                            })
                                        ],
                                        dataWatcher: 'historySampleData'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                    mango.sub('toSearchSample', searchHistorySample);
                },
                onafterrender: async function () {
                    await initData();
                    _model.vars.tabIndex = props.tabIndex || (props.lcIdList ? 2 : 1);
                },
                onunmount: function () {
                    mango.unsub('toSearchSample');
                },
                vars: {
                    searchText: '',
                    dataType: [0, 1],
                    beginDate: moment().format('YYYY-MM-DD'),
                    endDate: moment().format('YYYY-MM-DD'),
                    beginTime: '00:00:00',
                    endTime: '23:59:59',
                    lcIdList: props.lcIdList
                }
            }
        ]
    };
    function initData() {
        return new Promise((resolve, reject) => {
            ajaxCall('queryDevSampleRealList', {
                params: { devId: props.devId },
                success(data) {
                    _model.detailData = data.map((item, index) => {
                        item.status = index ? 'hide' : 'show';
                        (item.defineList || []).forEach((defineItem, idx) => {
                            const _status = Array.isArray(defineItem.qualityCodes) && defineItem.qualityCodes?.length > 0 ? defineItem.qualityCodes[0] : '控制中';
                            console.log('_status', _status);
                            defineItem.status = codesStateMap[_status];
                        });
                        return item;
                    });
                    console.log(_model.detailData);
                    // 结构较简单，直接map转换
                    _model.treeData = data.map((item) => {
                        return {
                            id: item.devId,
                            name: item.devName,
                            icon: item.icon,
                            children: (item.defineList || []).map((child) => {
                                return {
                                    id: child.lcId,
                                    name: child.colName,
                                    uniqName: item.devName + '-' + child.colName,
                                    icon: child.icon,
                                    unit: child.unit
                                };
                            })
                        };
                    });
                    resolve();
                }
            });
        });
    }

    function searchHistorySample() {
        if (queryLoading) return;
        const lcIdList = mango.get('treeSelectValue');
        if (!lcIdList || !lcIdList.length) return nutmeg.error('请选择数据进行查询');
        if (!_model.endDate || !_model.beginDate) return nutmeg.error('请选择查询时间');
        queryLoading = Qmsg.loading('查询中...');
        ajaxCall('queryDevHisSample', {
            params: {
                lcIdList,
                beginTime: _model.beginDate + ' ' + _model.beginTime,
                endTime: _model.endDate + ' ' + _model.endTime
            },
            type: 'post',
            success(data) {
                try {
                    queryLoading.close();
                    queryLoading = null;
                    const chartLine = jam.findElement('.historySampleChartLine');
                    const names = mango.get('treeSelectNames');
                    const sampleData = [['时间', ...Object.values(names)]];
                    data.filter((item) => item?.sampleList && item.sampleList.length).forEach((item, i) => {
                        item.sampleList.forEach((sampleItem, j) => {
                            i ? sampleData[j + 1].push(sampleItem.sampleValue) : sampleData.push([sampleItem.occurTime || '--:--:--', sampleItem.sampleValue]);
                        });
                    });
                    _msgr.pub('historySampleData', sampleData);
                    const unit = mango.get('treeSelectUnit');
                    chartLine.chart.setOption({ yAxis: { name: unit == 'unk' ? '' : unit }, legend: { data: Object.values(names) } }); //
                    chartLine.chart.resize();
                } catch (error) {}
            },
            error() {
                queryLoading.close();
                queryLoading = null;
            }
        });
    }
    function codeStyles(code, isPopup) {
        return ['text(size:s)', `color(${codesColorMap[code]})`, `background(${codesColorMap[code]?.replace(')', ' ,0.3)')})`, 'border(radius:s)', `margin(${isPopup ? 'top' : 'right'}:s)`];
    }
}
