import { getBvList, getRegionList, getSubstationList } from '../utils/commonList.js';
import { ajaxCall, exportExcel, findCol, formatterJameTime, loadConf, formatterJameBv } from './../common.js';
// import { createWindow } from './../components/createWindow.js';
// import equipmentTimingInformationWindow from './../components/modal/equipmentTimingInformationWindow.js';
import realHistoryDetail from './../components/modal/generalRealHistoryDetail.js';
import mainAndAuxAlarmWindow from './../components/modal/mainAndAuxAlarmWindow.js';
import sendMessageWindow from './../components/modal/sendMessageWindow.js';
import caseWindow from './../components/modal/caseWindow.js';
import { urlConfig, userInfo } from './../global.js';
let _model, _msgr, _this;
const pagerKey = jam.genUUID();
const isTest = loadConf('config.json', {})?.isTest || false;
const _isJiangsu = jam.getUrlParams()?.city == 'jiangsu' ? true : false;

let isAfterRender = false,
    isFirstSearch = true;
const tableDataMap = new Map();

const colorSet = ['rgba(14,129,128,1)', 'rgba(208,104,76,1)', 'rgba(221,116,158,1)', 'rgba(227,195,99,1)', 'rgba(0,110,162,1)', 'rgba(109,199,234,1)', 'rgba(47,188,255,1)', 'rgba(75,199,150,1)', 'rgba(144,97,215,1)', 'rgba(92,112,144,1)', 'rgba(59,134,255,1)', 'rgba(255,71,87,1)', 'rgba(250,250,140,1)'];

export function disableRegionOptionByUnicode(unicode, buttonggroupEle) {
    if (!buttonggroupEle || typeof buttonggroupEle.querySelectorAll !== 'function') {
        console.warn('Invalid buttongroupEle parameter');
        return;
    }
    const processButtons = () => {
        try {
            const jamBtns = Array.from(buttonggroupEle.querySelectorAll('.jam-option'));
            if (!jamBtns.length) {
                setTimeout(processButtons, 100);
            } else if (jamBtns.length > 0) {
                jamBtns.forEach((btn) => {
                    jam.getAttributes(btn, 'value')?.value != unicode ? btn.classList.add('disabled') : null;
                });
            }
        } catch (error) {
            console.error('Error processing buttons:', error);
        }
    };

    setTimeout(processButtons, 180);
}
export default {
    type: 'wrapper',
    styles: [
        'size.fullsize',
        Styles.stylesheet({
            ':scope': {
                '--gap': '0.75rem',
                '--gap-sm': '0.35rem'
            },
            '.main-wrapper': {
                flex: 1,
                padding: 'var(--gap)',
                marginLeft: 'var(--gap)',
                overflow: 'hidden auto'
            }
        })
    ],
    components: [
        {
            type: 'card',
            cap: '断路器异常告警',
            icon: 'bug',
            styles: [
                'size(height:100%;width:var(--menu-width);maxWidth:28rem;minWidth:16rem)',
                'flex(direction:column)',
                'border.subtle', 'border.s',
                'layout(overflow:hidden auto)',
                'card.bodyslot.css(placeItems:unset!important;)',
                Styles.stylesheet({
                    ':scope': {
                        '--menu-width': '20rem',
                        padding: 'm'
                        // '&.jam-with-cap': { 'padding-top': '0' }
                        // '&.jam-with-cap>[slot=cap]': {
                        //     position: 'sticky',
                        //     top: '0',
                        //     transform: 'translate(-.625rem, 0)',
                        //     width: 'var(--menu-width)',
                        //     height: '2.5rem',
                        //     lineHeight: '2.5rem',
                        //     paddingLeft: '2.5rem',
                        //     backgroundImage: `linear-gradient(90deg, ${COLOR_SET.thbrclr} 0%, transparent 100%)`,
                        //     fontSize: '1.125rem',
                        //     fontWeight: 'bold',
                        //     color: COLOR_SET.firsttextclr,
                        //     borderBottomStyle: 'solid',
                        //     borderBottomWidth: '.0625rem',
                        //     borderBottomColor: 'transparent',
                        //     borderImageSource: `linear-gradient(89.97deg, ${hslaToJamAc('hsl(203,60.2%,32.5%)')} 0%, transparent 100%)`,
                        //     borderImageSlice: 1,

                        //     '&::after': {
                        //         content: '""',
                        //         display: 'block',
                        //         position: 'absolute',
                        //         bottom: '0',
                        //         right: '0',
                        //         width: '2rem',
                        //         height: '.1rem',
                        //         backgroundImage: `linear-gradient(to right, ${hslaToJamAc('hsl(210,40.3%,28.2%)')} 0, ${hslaToJamAc('hsl(210,40.3%,28.2%)')} 22%, transparent 22%, transparent 39%,${hslaToJamAc('hsl(210,40.3%,28.2%)')} 39%, ${hslaToJamAc('hsl(210,40.3%,28.2%)')} 61%, transparent 61%,transparent 78%,${hslaToJamAc('hsl(210,40.3%,28.2%)')} 78% , ${hslaToJamAc('hsl(210,40.3%,28.2%)')} 100%)`
                        //     }
                        // }
                    }
                })
            ],
            components: [
                {
                    type: 'container',
                    class: 'widget',
                    styles: [Styles.css({ overflow: 'auto', display: 'flex' })],
                    components: [
                        {
                            type: 'container',
                            styles: [
                                'size(height:100%;width:100%)',
                                Styles.css({ overflow: 'auto' }),
                                Styles.stylesheet({
                                    '.fmltype-wrapper': {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 's',
                                        cursor: 'pointer',
                                        '&.has-child': {
                                            '.parent-name': {
                                                // background: hsla(var(--jam-ac-h), var(--jam-ac-s), calc(var(--jam-ac-l) * 1.4), 0.1);
                                            },
                                            ".parent-name [slot='cap']": {
                                                ' paddingLeft': '0.3rem'
                                            },
                                            '.childcount': {
                                                fontFamily: 'DINPro',
                                                fontSize: 's',
                                                color: 'primary'
                                            }
                                        },

                                        '.children-wrapper': {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            paddingLeft: 'l',
                                            maxHeight: 0,
                                            display: 'flex',
                                            transition: 'max-height 0.5s',
                                            overflow: 'hidden'
                                        },
                                        '&.open > .children-wrapper': {
                                            maxHeight: '1000px'
                                        },

                                        '.fml-item': {
                                            'jam-indicator': {
                                                "[slot='cap']": {
                                                    color: 'muted'
                                                }
                                            },
                                            'jam-badge': {
                                                fontSize: 's'
                                            },
                                            '&:nth-child(odd)': {
                                                background: 'hsl(0, 0%, 50%, 0.1)',
                                                borderRadius: 'm'
                                            },
                                            '.name': {
                                                "[slot='icon']": {
                                                    borderRadius: 'm',
                                                    border: '0.1rem solid red',
                                                    backgroundImage: 'linear-gradient(180deg, hsla(0, 0%, 100%, 0.25), rgba(0, 0, 0, 0.075))',
                                                    boxShadow: 's',
                                                    transform: 'scale(0.8)',
                                                    margin: '0 s'
                                                },
                                                "[slot='cap']": {
                                                    fontWeight: 'bold',
                                                    color: 'var(--jam-color-fg-default)'
                                                }
                                            }
                                        },
                                        "[slot='icon']": {
                                            border: '0'
                                        },
                                        '.fml-wrapper': {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            paddingLeft: 'l',
                                            marginRight: 's',

                                            '.label-icon': {
                                                margin: '0 0.1rem 0 1rem',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 'm',
                                                // border: '0.0625rem solid hsl(0, var(--jam-ac-s), var(--jam-ac-l), 0.1)',
                                                background: 'tint',
                                                boxShadow: '0 0 0.1rem hsla(0, 0%, 0%, 0.2)'
                                            }
                                        }
                                    }
                                })
                            ],
                            components: jaml.var('treeData', function (data) {
                                const _dom = getTreeCmpt(data);
                                return _dom.length === 0
                                    ? [
                                          {
                                              type: 'label',
                                              icon: 'face-pensive',
                                              styles: [Styles.icon.duotone],
                                              cap: '{{noDateCap}}'
                                          }
                                      ]
                                    : _dom;
                            }),

                            onmount() {
                                _model = this.model;
                            }
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'main-wrapper',
            styles: ['flex(direction: column)', 'padding(bottom:0)', 'layout(overflow:hidden)', 'size.fullsize'],
            components: [
                {
                    type: 'wrapper',
                    // header
                    styles: ['size(minHeight:15rem)', 'layout.flex(alignItems:center)'],
                    components: [
                        {
                            type: 'wrapper',
                            // form
                            styles: ['flex(flex:1;direction:column;)'],
                            components: [
                                {
                                    type: 'buttongroup-radio',
                                    cap: '区域选择',
                                    icon: 'earth-asia',
                                    styles: [Styles.buttonGroupStylesWithBgCap],
                                    value: '{{regionId}}',
                                    onafterrender: function () {
                                        if (userInfo.unicode) {
                                            const buttonggroupEle = this.cmpt.element;
                                            disableRegionOptionByUnicode(userInfo.unicode, buttonggroupEle);
                                        }
                                    },
                                    data: '{{regionList}}'
                                },
                                {
                                    type: 'buttongroup-radio',
                                    cap: '电压等级',
                                    icon: 'bolt',
                                    styles: [Styles.buttonGroupStylesWithBgCap],
                                    defaultValue: null,
                                    value: '{{bvId}}',
                                    data: '{{bvList}}'
                                },
                                {
                                    type: 'wrapper',
                                    styles: [
                                        'layout.flex(alignItems:center;justifyContent:flex-start)',
                                        Styles.stylesheet({
                                            '.ml-_625rem': {
                                                marginLeft: 'm'
                                            }
                                        })
                                    ],
                                    childStyles: ['margin(top:var(--gap))', 'datepicker.agent.border(radius:s)'],
                                    descStyles: {
                                        datepicker: ['padding(top:0;bottom:0)', 'datepicker.labelslot.margin(0)'],
                                        button: [Styles.searchBtnsStyles]
                                    },
                                    components: [
                                        {
                                            type: 'filterSelect',
                                            styles: ['size(maxWidth:11.5rem)', 'padding(top:0;bottom:0)'],
                                            childStyles: ['size(minWidth:11.5rem)', 'input.agent.border(radius:s)', 'input.labelslot.margin(0)'],
                                            valueKey: 'stId',
                                            props: { cap: '变电站：', placeholder: '请选择', data: '{{stList}}', search: '{{name}}', select: '{{stId}}', icon: 'transformer-bolt' },
                                            watchers: {
                                                name(val) {
                                                    getSubstationList({ _model, devName: val });
                                                }
                                            }
                                        },
                                        { type: 'datepicker', max: '{{endDate}}', cap: '查询时间：', icon: 'calendar', value: '{{beginDate}}' },
                                        { type: 'datepicker', min: '{{beginDate}}', cap: '-', value: '{{endDate}}', styles: ['padding(left:0)', 'size(width:9.2rem;)', Styles.stylesheet({ ':scope': { minWidth: '0!important' } })] },
                                        {
                                            type: 'radio',
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
                                                initTableData();
                                                initPieData();
                                            }
                                        },
                                        {
                                            type: 'button',
                                            cap: '查询',
                                            icon: 'search',
                                            class: 'ml-_625rem jam-cta',
                                            onclick: function () {
                                                initTableData();
                                                initPieData();
                                            }
                                        },
                                        {
                                            type: 'button',
                                            cap: '导出',
                                            icon: 'file-export',
                                            class: 'ml-_625rem',
                                            onclick: function () {
                                                exportExcel(urlConfig['exportEarlyWarningRecord'].url, packageParams(), `预警记录_${moment().format('YYYYMMDDHHmmssSSS')}.xlsx`, 'post');
                                            }
                                        },
                                        {
                                            type: 'button',
                                            cap: '案例导出',
                                            icon: 'file-export',
                                            showIf: '{{_isJiangsu}}',
                                            class: 'ml-_625rem',
                                            onclick: function () {
                                                exportExcel(
                                                    urlConfig['exportCaseTableData'].url,
                                                    {
                                                        regionId: _model.vars.regionId ?? undefined,
                                                        startTime: getTimeParams().beginDate,
                                                        endTime: getTimeParams().endDate
                                                    },
                                                    `案例_${moment().format('YYYYMMDDHHmmssSSS')}.xlsx`,
                                                    'post'
                                                );
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            // chart
                            styles: [
                                //
                                'size(width:32rem;minHeight:15rem)',
                                'layout(overflow:hidden;position:relative;)',
                                'layout.flex(alignItems:center;justifyContent:flex-start;alignContent:center)',
                                // `background(image:linear-gradient(180deg, ${COLOR_SET.gradientbgclr_deep} 0%, ${COLOR_SET.gradientbgclr_light} 100%))`,
                                Styles.stylesheet({
                                    ':scope': {
                                        '--title-width': '3rem'
                                    }
                                })
                            ],
                            components: [
                                // 预警区域统计
                                {
                                    type: 'wrapper',
                                    // chart-title
                                    cap: '预警区域统计',
                                    styles: [
                                        'size(height:8.125rem;width:var(--title-width))',
                                        `cap.css(width:1.6rem;height:max-content;padding:1 .4rem;fontWeight:bold;line-height:1.2;top:1rem;)`,
                                        'margin(left:1rem)',
                                        'with.tint', 'css(padding:xl 0;)',
                                        Styles.stylesheet({
                                            ':scope': {
                                                '&>[slot=cap]': {
                                                    '-webkit-background-clip': 'text'
                                                }
                                            }
                                        })
                                    ]
                                },
                                {
                                    type: 'pieWithScale',
                                    ref: 'chartPie',
                                    props: {
                                        title: '总计',
                                        unit: ' 个',
                                        dataType: 'analog',
                                        valueType: 'number',
                                        decimalPos: 2,
                                        toFixed: false,
                                        hasTags: false
                                    },
                                    vars: {
                                        data: {}
                                    },
                                    styles: ['pieWithScale.basic', 'size(width:calc(100% - 5rem);height:100%;)', 'layout(position:absolute)', 'css(aspectRatio:1;left:4rem)'],
                                    indicatorStyles: [Styles.value.css({ cursor: 'pointer' })],
                                    onafterrender: async function () {
                                        const _chart = jam.findElement(this.element, 'jam-chart');
                                        await _chart.chartReady;
                                        _chart.chart.on('click', (params) => {
                                            const _regionList = _model.vars.regionList || [];
                                            const _regionId = _regionList.find((item) => item.name == params.name)?.value || '';
                                            if (_regionId) {
                                                if (_regionId == _model.vars.regionId) {
                                                    _model.vars.regionId = 0;
                                                } else {
                                                    _model.vars.regionId = _regionId;
                                                }
                                            } else {
                                                return;
                                            }
                                            initTableData();
                                        });
                                    },
                                    onclick: (e) => {
                                        const _regionList = _model.vars.regionList || [];
                                        let _el = jam.closest(e.target, '.jam-cc-legend');
                                        if (!_el) return;
                                        const _regionId = _regionList.find((item) => item.name == _el.cap)?.value || '';
                                        if (_regionId) {
                                            if (_regionId == _model.vars.regionId) {
                                                _model.vars.regionId = 0;
                                            } else {
                                                _model.vars.regionId = _regionId;
                                            }
                                        } else {
                                            return;
                                        }
                                        initTableData();
                                    }
                                }
                                // {
                                //     type: 'wrapper',
                                //     styles: ['size(height:100%;)', 'layout(position:absolute)', 'css(aspectRatio:1;left:var(--title-width))', 'background(size:54% auto;position:center;repeat:no-repeat;image:url(./assets/images/chart_bg.png);)'],
                                //     components: [
                                //         {
                                //             type: 'indicator-number',
                                //             cap: '总计',
                                //             value: '{{warningTotalCount}}',
                                //             unit: '个',
                                //             styles: [
                                //                 //
                                //                 'layout(position:absolute;transform:translate(-50%,-50%);zIndex:1)',
                                //                 'css(top:50%;left:50%;grid-template-areas:"c c c c""v v v u")',
                                //                 'cap.css(gridArea:c;justifySelf:center)',
                                //                 `value.text(size:1.5rem;family:DINPro;color:${COLOR_SET.primarytextclr})`,
                                //                 'indicator.unit.css(backgroundColor:transparent;boxShadow:none;)'
                                //             ]
                                //         },
                                //         {
                                //             type: 'chart-pie',
                                //             colorSet,
                                //             styles: [
                                //                 //
                                //                 // 'css(opacity: 0;)',
                                //                 // 'size(width:0;height:0)',
                                //                 'size.fullsize',
                                //                 'echarts.pie(radius:["60%","70%"];padAngle:3;)',
                                //                 'echarts.pie.label(show:false;backgroundColor:rgba(255,255,252,0.2);position:center)',
                                //                 'echarts.pie.hover.label(show:true;)',
                                //                 'echarts.pie.hover(scaleSize:8)'
                                //             ],
                                //             data: '{{warnPieData}}'
                                //         }
                                //     ]
                                // },
                                // {
                                //     type: 'wrapper',
                                //     styles: ['size(height:100%;width:50%)', 'layout(position:absolute;overflow:auto;)', 'css(scrollbarWidth:.1rem;right:0;columnGap:.625rem)', 'flex(wrap:wrap;)', 'padding(1.5rem 0 1rem)'],
                                //     // legend
                                //     components: [
                                //         {
                                //             type: 'wrapper',
                                //             styles: ['size(width:fit-content)'],
                                //             buildFor: '(item,index) in chartLegendData',
                                //             components: [
                                //                 {
                                //                     type: 'indicator-number',
                                //                     styles: [
                                //                         //
                                //                         'padding(left:0)',
                                //                         'css(grid-template-areas:"i c v u";cursor:pointer)',
                                //                         'cap.size(minWidth:2.25rem)',
                                //                         `cap.text(size:.875rem;color:${COLOR_SET.secondarytextclr})`,
                                //                         `value.size(width:2.5rem)`,
                                //                         'value.css(justifyContent:flex-end)',
                                //                         `value.text(size:1.125rem;family:DINPro;weight:bold;color:${COLOR_SET.firsttextclr};)`
                                //                     ],
                                //                     attrs: {
                                //                         regionid: '{{item.regionId}}'
                                //                     },
                                //                     cap: '{{item.regionName}}',
                                //                     icon: jaml.var(
                                //                         'index',
                                //                         (index) => `<div>
                                //                                         <div style="--legend-clr:${colorSet[index]};width:.625rem;height:.625rem;display:flex;align-items:center;justify-content:center;border:.0625rem solid var(--legend-clr)">
                                //                                             <span style="display:block;width:.25rem;height:.25rem;background-color:var(--legend-clr)"></span>
                                //                                         </div>
                                //                                     </div>
                                //                                     `
                                //                     ),
                                //                     onclick: function (e) {
                                //                         _model.vars.regionId = Number(this.getAttribute('regionId')) ?? null;
                                //                         console.log(this);
                                //                         console.log(e);
                                //                     },
                                //                     value: '{{item.cnt}}'
                                //                     // unit: jaml.var('item.cnt', (cnt) => `<span style="background-color:transparent;box-shadow:none;margin-left:0;letter-spacing:0.07rem;font-size:.725rem;color:${COLOR_SET.auxtextclr};">%/<span style="display:inline-block;width:1.5rem;vertical-align:bottom;text-align:right;font-size:1rem;font-weight:400;">${cnt}</span></span>`),
                                //                     // value: jaml.var('item.cnt', 'warningTotalCount', (cnt = 0, total = 1) => (total ? (Number(cnt / total) * 100).toFixed(0) : 0))
                                //                 }
                                //             ]
                                //         }
                                //     ]
                                // }
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
                        'layout(overflow:hidden)',
                        'flex(1)'
                    ],
                    // table-wrapper
                    components: [
                        {
                            type: 'tableWithPage',
                            styles: [
                                'tableWithPage.basic',
                                'flex(1)',
                                Styles.hover.toShowAll({
                                    selector: '.hover'
                                })
                            ],
                            dataWatcher: 'earlyWarningTableData',
                            props: {
                                cpageHide: {
                                    pageSize: false
                                },
                                pageSizeList: [
                                    { value: 15, name: '15条/页' },
                                    { value: 30, name: '30条/页' },
                                    { value: 50, name: '50条/页' },
                                    { value: 100, name: '100条/页' }
                                ]
                            },
                            dataDef: [
                                { cap: 'keyId', show: false },
                                { cap: '区域', width: '6rem', sortable: false },
                                { cap: '变电站', width: '8rem', sortable: false },
                                { cap: '设备名称', width: '10rem', align: 'left', sortable: false, styles: [Styles.toShowAll] },
                                { cap: 'devId', show: false },
                                {
                                    cap: '电压等级',
                                    width: '8rem',
                                    sortable: false,
                                    formatter: formatterJameBv
                                },
                                { cap: '告警内容', align: 'left', sortable: false, styles: [Styles.toShowAll] },
                                {
                                    cap: '发生时间',
                                    width: '12rem',
                                    sortable: false,
                                    formatter: formatterJameTime
                                },
                                {
                                    cap: '操作',
                                    sortable: false,
                                    width: userInfo.unicode != null ? '14rem' : '12rem',
                                    type: 'buttongroup',
                                    class: 'viewButtons',
                                    styles: ['css(--jam-optionslot-justify-content:center;--sms-txt-clr:var(--jam-color-primary-default);--detail-txt-clr:var(--jam-color-primary-subtle))', 'button.capslot.text(white-space:nowrap)', 'button.border(border:0;radius:0)', 'button.background(image:none;color:transparent)'],
                                    data: [
                                        {
                                            name: '曲线',
                                            onclick: function (e) {
                                                const target = findCol(e.target);
                                                const time = moment(target.col(7));
                                                // openEquipmentTimingWindow({
                                                //     beginDate: time.subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                                                //     endDate: time.add(2, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                                                //     warnType: _model.vars.warnType,
                                                //     devId: target.col(4),
                                                //     devName: target.col(3)
                                                // });
                                                jam.renderModal('#main', realHistoryDetail({ devId: target.col(4), tabIndex: 2, devName: `${target.col(3)}-运行数据` }));

                                                // createWindow({
                                                //     title: `${target.col(3)}-运行数据`,
                                                //     width: '65vw',
                                                //     height: '40.6vw',
                                                //     body: realHistoryDetail({ devId: target.col(4), tabIndex: 2 }),
                                                //     showBtn: false
                                                // });
                                            },
                                            value: 1
                                        },
                                        {
                                            name: '告警',
                                            onclick: function (e) {
                                                const target = findCol(e.target);
                                                jam.renderModal('#main', mainAndAuxAlarmWindow(tableDataMap.get(target.col(0) + target.col(4) + target.col(7))));

                                                // createWindow({
                                                //     title: `主辅告警列表`,
                                                //     width: '70vw',
                                                //     height: '75vh',
                                                //     body: mainAndAuxAlarmWindow(tableDataMap.get(target.col(0) + target.col(4) + target.col(7))),
                                                //     showBtn: false
                                                // });
                                            },
                                            value: 1
                                        },
                                        {
                                            name: '短信',
                                            onclick: function (e) {
                                                const target = findCol(e.target);
                                                openSendMessageWindow({
                                                    content: target.col(6)
                                                });
                                            },
                                            value: 2
                                        },
                                        {
                                            name: '案例',
                                            onclick: function (e) {
                                                const target = findCol(e.target);
                                                openCaseWindow({
                                                    regionId: userInfo.unicode,
                                                    regionName: target.col(1),
                                                    occurTime: target.col(7),
                                                    stName: target.col(2),
                                                    key: target.col(8),
                                                    warnWay: '固定设备监控预警',
                                                    warnOrientation: _model.vars.warnTypeDes
                                                });
                                            },
                                            styles:
                                                userInfo.unicode != null && _isJiangsu
                                                    ? []
                                                    : [
                                                          Styles.css({
                                                              display: 'none'
                                                          })
                                                      ],
                                            value: 4
                                        },
                                        {
                                            name: '邮件',
                                            onclick: function (e) {
                                                const target = findCol(e.target);
                                                sendMail(tableDataMap.get(target.col(0) + target.col(4) + target.col(7)));
                                            },
                                            styles: isTest
                                                ? ['button.text(color:var(--sms-txt-clr);)']
                                                : [
                                                      Styles.css({
                                                          display: 'none'
                                                      })
                                                  ],
                                            value: 3
                                        }
                                    ]
                                },
                                {
                                    cap: '是否生成案例',
                                    sortable: false,
                                    hide: !_isJiangsu,
                                    menu: {
                                        0: '未生成',
                                        1: '已生成'
                                    }
                                }
                            ],
                            watchers: [
                                {
                                    keys: ['cpageNo', 'cpageSize'],
                                    debounce: 400,
                                    callback(cpageNo, cpageSize) {
                                        _model.vars.cpageNo = cpageNo;
                                        _model.vars.cpageSize = cpageSize;
                                        initTableData();
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
        beginDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        warningTotalCount: 0,
        warnType: 0,
        warnTypeDes: '',
        bvId: null,
        cpageSize: 15,
        ctotal: 0,
        cpageNo: 1,
        _isJiangsu
    },
    watchers: [
        {
            key: 'regionId',
            callback: function () {
                isAfterRender ? initTableData() : null;
            }
        },
        {
            key: 'bvId',
            callback: function () {
                isAfterRender ? initTableData() : null;
            }
        }
        // {
        //     key: pagerKey,
        //     callback: function (page) {
        //         page.firstFetch ? null : initTableData(page);
        //     }
        // }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
        _this = this;
        _model.regionId = userInfo.unicode || null;
        initWarningList();
    },
    onafterrender: function () {
        getRegionList(_model, _msgr);
        getBvList(_model, _msgr);
        getSubstationList({ _model });

        initTableData();
        initPieData();
        setTimeout(() => (isAfterRender = true), 200);
        _msgr.sub('toCloseModal', function () {
            jam.closeTopModal();
        });
    }
};

function packageParams() {
    const regionId = _model.vars.regionId ? _model.vars.regionId : undefined;
    const bvId = _model.vars.bvId ? _model.vars.bvId : undefined;
    return {
        ...getTimeParams(),
        warnType: _model.vars.warnType,
        stId: _msgr.get('stId') ? _msgr.get('stId') : undefined,
        regionId,
        bvId,
        exampleStatus: _isJiangsu
        //   "keyword": ""
    };
}
function getTimeParams() {
    return {
        beginDate: _model.vars.beginDate ? _model.vars.beginDate + ' 00:00:00' : undefined,
        endDate: _model.vars.endDate ? _model.vars.endDate + ' 23:59:59' : undefined
    };
}

function initWarningList() {
    ajaxCall('getEarlyWarningOverview', {
        success(data) {
            _model.treeData = data;
            _model.vars.warnTypeDes = data[0]?.children[0]?.displayValue || '';
        },
        params: {},
        useMock: true,
        type: 'get'
    });
}
function initTableData() {
    ajaxCall('getEarlyWarningRecord', {
        params: { pageIndex: _model.vars.cpageNo, pageSize: _model.vars.cpageSize, ...packageParams() },
        type: 'post',
        success(data) {
            try {
                const { list = [], pojoTotalCount = 0 } = data || {};
                tableDataMap.clear();
                const tableData = list.map((item) => {
                    tableDataMap.set(item.keyId + item.devId + item.occurTime, item);
                    return [item.keyId, item.regionName, item.stName, item.devName, item.devId, item.bvName, item.content, item.occurTime, item.key, item.exampleStatus];
                });

                _msgr.pub('earlyWarningTableData', tableData);
                _model.vars.ctotal = pojoTotalCount;
            } catch (error) {
                console.error(error);
            }
        }
    });
}

function initPieData() {
    ajaxCall('getRegionCnt', {
        params: {
            ...getTimeParams(),
            warnType: _model.vars.warnType
        },
        // useMock: true,
        type: 'post',
        success(data) {
            try {
                const chartData = [['区域', '数量']];
                let totalCnt = 0;
                data.forEach((item) => {
                    totalCnt += Number(item.cnt);
                    chartData.push([item.regionName, Number(item.cnt)]);
                });
                _model.vars.chartLegendData = data || [];
                // _model.vars.warnPieData = chartData;
                _this.ref('chartPie').vars.data.chartData = chartData;
                _this.ref('chartPie').vars.data.value = totalCnt;
                _model.vars.warningTotalCount = totalCnt;
            } catch (error) {
                console.error(error);
            }
        }
    });
}

function openSendMessageWindow(props = {}) {
    jam.renderModal('#main', sendMessageWindow(props, _msgr));

    // createWindow({
    //     title: '短信发送',
    //     width: '33.8rem',
    //     height: '15.2rem',
    //     body: sendMessageWindow(props, _msgr),
    //     showBtn: false,
    //     done: function (modal) {
    //         _msgr.sub('toCloseModal', function () {
    //             modal.close();
    //         });
    //     }
    // });
}

function openCaseWindow(props = {}) {
    jam.renderModal('#main', caseWindow(props, _msgr));

    // createWindow({
    //     title: '新增案例',
    //     width: '25vw',
    //     height: '52vh',
    //     body: caseWindow(props, _msgr),
    //     showBtn: false,
    //     done: function (modal) {
    //         _msgr.sub('toCloseModal', function () {
    //             modal.close();
    //         });
    //     }
    // });
}

function openEquipmentTimingWindow(props = {}) {
    // createWindow({
    //     title: props.devName + '-设备时序信息',
    //     width: '51vw',
    //     height: '53vh',
    //     body: equipmentTimingInformationWindow(props),
    //     showBtn: false
    // });
}

function getTreeCmpt(data) {
    return data.map((item, index) => {
        let _hasChild = item.children?.length ? true : false;
        let _label = {
            type: 'label',
            cap: item.displayValue
        };
        let _child;
        if (!_hasChild) {
            const _state = item.actualValue == 0 ? 'active' : 'normal';
            Object.assign(_label, {
                styles: [Styles.icon.duotone, Styles.label.cap.css({ height: '2.5rem', lineHeight: '2.5rem', marginLeft: 's' }), Styles.css({ height: '2.5rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }), Styles.hover.toShowAll({ selector: '[slot=cap]' })],
                class: 'childNode',
                icon: '<img src="./assets/images/18-early-warning/' + item.actualValue + '.png" style="width:1rem"/>',
                state: _state,
                states: {
                    normal: {
                        styles: []
                    },
                    active: {
                        styles: [
                            'css(--cnt-bg-clr:var(--jam-color-primary-film))',
                            'with.tint',
                            'border.subtle',
                            'border.s',
                            'css(border-radius:m!important)'
                        ]
                    }
                },
                onclick(e) {
                    document.querySelectorAll('.childNode').forEach((_item) => {
                        _item.state = 'normal';
                    });
                    this.state = 'active';
                    _model.vars.warnType = item.actualValue;
                    _model.vars.warnTypeDes = item.displayValue;
                    initTableData();
                    initPieData();
                    lime.log('click', item, jam.findParent(e.target));
                }
            });
        } else {
            Object.assign(_label, {
                class: 'parent-name',
                state: 1,
                styles: [Styles.css({ cursor: 'pointer' })],
                states: [
                    { icon: 'folder', styles: [Styles.icon.duotone] },
                    { icon: 'folder-open', styles: [Styles.icon.duotone] }
                ],
                components: [
                    item.actualValue
                        ? {
                              type: 'label',
                              styles: [Styles.icon.duotone],
                              icon: 'magnifying-glass',
                              slot: 'layer',
                              onclick(e) {
                                  e.stopPropagation();
                                  lime.log('click', item);
                              }
                          }
                        : null
                ],
                onclick(e) {
                    e.stopPropagation();
                    let _flag = this.parentElement.classList.toggle('open');
                    this.state = _flag ? '1' : '0';
                }
            });
            _child = {
                type: 'wrapper',
                class: 'children-wrapper',
                components: getTreeCmpt(item.children)
            };
        }

        return {
            type: 'wrapper',
            class: `fmltype-wrapper ${_hasChild ? 'has-child' : ''} open`,
            components: [_label, _child]
        };
    });
}

function sendMail(data) {
    ajaxCall(
        'sendMail',
        {
            type: 'post',
            success(res) {
                nutmeg.success('发送成功');
            },
            uniqId: jam.genUUID(),
            params: JSON.parse(JSON.stringify(data)),
            useMock: false
        },
        false
    );
}
