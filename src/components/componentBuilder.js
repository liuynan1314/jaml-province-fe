import { exportExcel } from '../common.js';
import { urlConfig } from '../global.js';

/**
 * 当某条件变化时，执行一次回调
 * @param {*} el
 * @param {*} condition
 * @param {*} callback
 */
function onConditionChangeOnce(el, condition, callback) {
    const ob = new MutationObserver(() => {
        if (!document.contains(el)) {
            ob.disconnect();
        }
        if (condition()) {
            callback();
            ob.disconnect();
        }
    });
    // 目前只监听样式属性，如有其他需求，则需要更改
    ob.observe(el, { attributes: true, attributeFilter: ['style'] });
}

/**
 * 如果卡片不在首页，移除卡片标题
 * @param {*} el
 */
function removeCardTitleIfNotHome(el) {
    const path = rambutan.getPath();
    // path以/homeXXX为最后一节
    if (path !== '/' && !/\/home[^/]*$/.test(path)) {
        jam.removeSelf(jam.findElement(el, ':host slot[name=title]'));
    }
}

const topLegendStyle = [
    Styles.indicator.inline,
    Styles.css({
        paddingBottom: '0'
    }),
    Styles.indicator.value.css({
        fontSize: '1.125rem',
        color: jam.ac(1, 1, jam.lumiO(22)),
        fontWeight: 'bold',
        fontFamily: 'DINPro',
        cursor: 'pointer'
    }),
    Styles.indicator.unit.css({
        fontSize: '1rem',
        lineHeight: '1rem',
        backgroundColor: 'transparent',
        fontWeight: 'normal',
        border: 'none',
        boxShadow: 'none',
        color: 'var(--jam-element-color)',
        padding: '0 0.25rem'
    })
];

/**
 * 创建输入框
 * @param {*} param0
 * @returns
 */
export function buildInput({ cap, icon, valueName, placeholder = '请输入' }) {
    return {
        type: 'input',
        cap: cap,
        icon: icon,
        placeholder: placeholder,
        styles: [Styles.icon.duotone, Styles.select.agent.css({ minWidth: '12rem', height: '1.8rem' })],
        components: [
            {
                type: 'button',
                buildIf: `{{${valueName}@page}}`,
                icon: 'r',
                class: 'jam-clear-btn jam-input-btn jam-extra-btn',
                slot: 'extra',
                title: '清除',
                onclick(e) {
                    const el = this.parentNode;
                    if (el?.clear) {
                        el.clear();
                    }
                }
            }
        ],
        value: `{{${valueName}@page}}`,
        watchers: [
            {
                key: 'resetSearch@page',
                callback: function () {
                    if (this?.clear) {
                        this.clear();
                    }
                }
            },
            // 兼容旧版本写法
            {
                key: `${valueName}@page`,
                callback: function (value) {
                    this.msgr.pub(valueName, value);
                }
            }
        ]
    };
}

/**
 * 创建选择器，data的优先级高于dataUrl
 * @param {*} param0
 * @returns
 */
export function buildSelect({ cap, icon, valueName, data, dataUrl, defaultValue }) {
    const _select = {
        type: 'select',
        icon: icon,
        cap: cap,
        styles: [Styles.icon.duotone, Styles.select.agent.css({ minWidth: '12rem', height: '1.8rem' })],
        placeholder: '--请选择--',
        value: `{{${valueName}@page}}`,
        watchers: [
            {
                key: 'resetSearch@page',
                callback: function () {
                    // 重置选择框
                    this.msgr('page').pub(valueName, null);
                }
            },
            // 兼容旧版写法
            {
                key: `${valueName}@page`,
                callback: function (value) {
                    this.msgr.pub(valueName, value);
                }
            }
        ],
        onmount() {
            this.msgr('page').pub(valueName, defaultValue);
            this.model.vars[valueName] = defaultValue;
        }
    };

    if (data) {
        // 如果是字符串，绑定data键，否则设置为原始值
        _select['data'] = typeof data === 'string' ? `{{${data}}}` : data;
    } else if (dataUrl) {
        _select['dataUrl'] = dataUrl;
    }

    return _select;
}

/**
 * 创建一个常规表格（带分页 - 后续改为数据驱动表格）
 * @param {*} param0 getReqParams 为一个生成请求项的匿名普通函数，请求参数项中包含的函数必须为箭头函数，否则 this 绑定会有问题
 * @returns
 */
export function buildTable({ cap, icon, dataDef, dataKey = 'data', getReqParams, exportUrl, broker = 'page', tableStyles = [], ...args }) {
    const _table = {
        type: 'wrapper',
        cap: cap,
        icon: icon,
        styles: [Styles.tableStyles, Styles.iconslot.css({ display: 'none' }), Styles.capslot.css({ display: 'none' }), 'size.fullsize', 'padding(0)'],
        components: [
            {
                type: 'loading'
            },
            {
                type: 'tableWithPage',
                ...args,
                styles: [...tableStyles, Styles.hover.toShowAll({ selector: '.jam-td' }), Styles.size.fullsize, Styles.css({ padding: 0 }), 'table.th.css(whiteSpace:nowrap;minHeight:2.5rem;)'],
                descStyles: {
                    '.item-time': [Styles.badge.cap.css({ width: '5em' }), Styles.badge.content.css({ width: '5em' })],
                    '.item-tag': ['indicator.cap.hide()'],
                    '.item-content': ['css(overflow:hidden;white-space:nowrap;text-overflow:ellipsis)'],
                    '.item-indicator': ['indicator.cap.hide()', 'indicator.value.css(justify-content:flex-end)'],
                    '.item-clickable': [`css(color:${jam.ac({ l: '60%' })};textDecoration:underline;cursor:pointer)`]
                },
                props: {
                    cpageHide: {
                        pageSize: false
                    },
                    pageSizeList: [
                        { value: 20, name: '20条/页' },
                        { value: 30, name: '30条/页' },
                        { value: 50, name: '50条/页' },
                        { value: 100, name: '100条/页' }
                    ]
                },
                dataDef: Array.isArray(dataDef) ? dataDef.map((item) => (item.cap === '间隔' ? { ...item, align: 'left' } : item)) : dataDef,
                // 点击查询按钮时立即查询
                data: `{{${dataKey}}}`
            }
        ],
        watchers: [
            {
                // 页码和页面大小变更时自动查询
                keys: ['cpageNo', 'cpageSize'],
                callback() {
                    this.msgr(broker).pub('_t', { time: Date.now(), noloop: true });
                },
                init: false,
                debounce: 400
            }
        ],
        vars: {
            ctotal: 0,
            cpageNo: 1,
            cpageSize: 20,
            isLoading: true
        }
    };
    // 有请求参数，设置请求参数
    if (getReqParams) {
        _table.watchers.push({
            keys: [`_t@${broker}`, `_p@${broker}`],
            async callback(_t, _p) {
                if (!_t?.noloop && this.model.vars.cpageNo !== 1) {
                    this.model.vars.cpageNo = 1;
                    return;
                }
                const _reqParams = getReqParams.bind(this)();
                this.vars.isLoading = true;
                _reqParams ? this.msgr.pub(dataKey, await jam.ajaxCall(_reqParams)) : '';
                this.vars.isLoading = false;
            },
            init: false,
            debounce: 100
        });
        // 有导出url，设置导出url
        if (exportUrl) {
            _table.watchers.push({
                key: `to-export-table@${broker}`,
                callback: async function (val) {
                    if (!val) return;
                    try {
                        await exportExcel(urlConfig[exportUrl].url, getReqParams.bind(this)().data, `${cap}${jam.formatDate(Date.now(), 'yyyyMMddHHmmssSSS')}.xlsx`, 'post');
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.msgr(broker).pub('to-export-table', null);
                    }
                },
                debounce: 400
            });
        }
    }
    return _table;
}

export function buildBasicTable({ cap, icon, dataDef, dataKey = 'data', getReqParams, exportUrl, broker = 'page', isNeedScroll = true }) {
    const _scorllStyle = isNeedScroll ? [Styles.table.xscrollable, Styles.table.fixedrowheight({ height: '2.5rem' })] : [];
    const hasRequest = typeof getReqParams === 'function';
    const _table = {
        type: 'wrapper',
        cap: cap,
        icon: icon,
        styles: [Styles.tableStyles, Styles.iconslot.css({ display: 'none' }), Styles.capslot.css({ display: 'none' }), 'size.fullsize', 'padding(0)'],
        components: [
            ...(hasRequest ? [{ type: 'loading' }] : []),
            {
                type: 'basicTable',
                styles: [Styles.hover.toShowAll({ selector: '.jam-td:not(.viewButtons)' }), ..._scorllStyle, Styles.size.fullsize, Styles.css({ padding: 0 }), 'table.th.css(whiteSpace:nowrap;minHeight:2.5rem;)'],
                descStyles: {
                    '.item-time': [Styles.badge.cap.css({ width: '5em' }), Styles.badge.content.css({ width: '5em' })],
                    '.item-tag': ['indicator.cap.hide()'],
                    '.item-content': ['css(overflow:hidden;white-space:nowrap;text-overflow:ellipsis)'],
                    '.item-indicator': ['indicator.cap.hide()', 'indicator.value.css(justify-content:flex-end)']
                },

                dataDef: dataDef,
                // 点击查询按钮时立即查询
                data: `{{${dataKey}}}`,
                onmount() {
                    onConditionChangeOnce(
                        this,
                        () => jam.hasStyle(this, '--jam-template-cols-th'),
                        () => jam.afterNextRepaint(() => this.resize())
                    );
                },
                onafterrender() {
                    // this.msgr(broker).pub('_t', Date.now());
                }
            }
        ],
        watchers: []
    };

    if (hasRequest) {
        _table.vars = {
            init: true,
            isLoading: true
        };
        _table.watchers.push(
            {
                // 基础表格首次不刷新，查询时机错误临时解决方案
                key: 'init',
                callback() {
                    this.msgr(broker).pub('_t', Date.now());
                },
                debounce: 800
            },
            {
                keys: [`_t@${broker}`, `_p@${broker}`],
                async callback() {
                    const _reqParams = getReqParams.bind(this)();
                    if (!_reqParams) return;
                    this.vars.isLoading = true;
                    try {
                        this.msgr.pub(dataKey, await jam.ajaxCall(_reqParams));
                    } finally {
                        this.vars.isLoading = false;
                    }
                },
                init: false,
                debounce: 400
            }
        );

        if (exportUrl) {
            _table.watchers.push({
                debounce: 400,
                key: `to-export-table@${broker}`,
                callback: async function (val) {
                    if (!val) return;
                    try {
                        await exportExcel(urlConfig[exportUrl].url, getReqParams.bind(this)().data, `${cap}${jam.formatDate(Date.now(), 'yyyyMMddHHmmssSSS')}.xlsx`, 'post');
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.msgr(broker).pub('to-export-table', null);
                    }
                }
            });
        }
    }

    return _table;
}

/**
 * 创建一个带总计和tab切换的统计图表（目前在监盘数据的六个图表中使用）
 * @param {*} param0
 * @returns
 */
export function buildBarChartWithTabs({ cap, icon, tabs, unit, urlKey }) {
    return {
        type: 'card',
        styles: [
            'size.fullsize',
            Styles.capslot.css({ cursor: 'pointer' }),
            Styles.css({
                '--jam-card-bodyslot-padding': '0.25rem 0.5rem'
            })
        ],
        cap: `${cap}-统计`,
        icon: icon,
        components: [
            {
                type: 'container',
                class: 'jam-cc-legend-on-top',
                styles: [Styles.css({ display: 'flex', flexDirection: 'column', width: '100%' })],
                components: [
                    {
                        type: 'wrapper',
                        styles: [Styles.css({ justifyContent: 'space-between' })],
                        class: 'jam-cc-legend-wrapper',
                        components: [
                            {
                                type: 'indicator',
                                class: 'jam-cc-indicator jam-cc-legend',
                                styles: topLegendStyle,
                                cap: `${cap}，共计`,
                                value: '{{totalData}}',
                                unit: unit
                            },
                            {
                                type: 'buttongroup-radio',
                                buildIf: tabs,
                                data: tabs,
                                value: '{{selected}}'
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        class: 'jam-cc-chart-wrapper',
                        styles: [Styles.css({ flex: 1 })],
                        components: [
                            {
                                type: 'stripyBarChart',
                                styles: [Styles.size.fullsize],
                                props: {
                                    unit: unit
                                },
                                onmount() {
                                    this.model.vars.selected = this.model.vars.selected ?? 'bvList';
                                },
                                data: '{{chartData}}'
                            }
                        ]
                    }
                ]
            }
        ],
        onmount: function () {
            removeCardTitleIfNotHome(this);
        },
        watchers: [
            {
                keys: ['selected', 'classifiedDatas'],
                callback: function (selected, classifiedDatas) {
                    if (selected && classifiedDatas && classifiedDatas[selected]) {
                        this.model.vars.totalData = classifiedDatas[selected]['value'];
                        this.model.vars.chartData = classifiedDatas[selected]['chartData'];
                    }
                },
                debounce: 200
            }
        ],
        vars: {
            selected: 'bvList',
            classifiedDatasUrl: {
                method: 'GET',
                urlKey: urlKey,
                data: {
                    _t: '{{_t@page}}'
                    // stId: '{{stId}}',
                    // selected: '{{selected}}'
                },
                transform: function (res) {
                    // 转换成正确格式后存入 classifiedDatas
                    if (!res || !res.data) {
                        return;
                    }
                    const _classifiedDatas = {};
                    for (let key in res.data) {
                        _classifiedDatas[key] = {};
                        let _total = 0;
                        _classifiedDatas[key]['chartData'] = res.data[key].map((item) => {
                            _total += item.count ?? 0;
                            return [item.name, item.count];
                        });
                        _classifiedDatas[key]['value'] = _total;
                    }
                    return _classifiedDatas;
                }
            }
        }
    };
}

/**
 * 创建一个常规单选按钮组
 * @param {*} param0
 * @returns
 */
export function buildButtonGroup({ cap, icon, valueName, data, dataUrl, defaultValue, type = 'buttongroup-radio' }) {
    defaultValue = defaultValue ?? (data && data[0]?.value ? data[0].value : '');
    const _buttongroup = {
        type: type,
        icon: icon,
        cap: cap,
        styles: [Styles.buttonGroupStylesWithBgCap],
        value: `{{${valueName}}}`,
        onmount() {
            this.msgr.pub(valueName, defaultValue);
            this.model.vars[valueName] = defaultValue;
        },
        watchers: [
            {
                key: valueName,
                callback: function (value) {
                    this.msgr('page').pub(valueName, value);
                },
                debounce: 200
            },
            {
                key: 'resetSearch@page',
                callback: function () {
                    // 重置选择框
                    this.msgr('page').pub(valueName, defaultValue);
                }
            }
        ]
    };

    if (data) {
        // 如果是字符串，绑定data键，否则设置为原始值
        _buttongroup['data'] = typeof data === 'string' ? `{{${data}}}` : data;
    } else if (dataUrl) {
        _buttongroup['dataUrl'] = dataUrl;
    }

    return _buttongroup;
}
