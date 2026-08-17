import diffImportantDevTable from '../components/diffImportantDevTable.js';
import powerAssuranceWindow from '../components/modal/powerAssuranceWindow.js';
import { ajaxCall, formatterJameTime } from './../common.js';
// import { createWindow } from './../components/createWindow.js';
import { getRegionList } from './../utils/commonList.js';
import { buildBasicTable } from '../components/componentBuilder.js';
let _model,
    _msgr,
    isFirstChange = true,
    _thisModel = null,
    popupController,
    popupHideDelay;
const levelNumMap = {
        特级: 0,
        一级: 1,
        二级: 2,
        三级: 3,
        四级: 4
    },
    levelStates = {
        特级: { condition: 'value==="特级"', styles: ['css(--bg-clr:rgba(255,171,0,0.2);--bdr-clr:rgba(255,171,0,0.5);--txt-clr:rgba(255,149,0,1))'] },
        一级: { condition: 'value==="一级"', styles: ['css(--bg-clr:rgba(221, 70, 85,0.2);--bdr-clr:rgba(221, 70, 85,0.5);--txt-clr:rgba(221, 20, 85,1))'] },
        二级: { condition: 'value==="二级"', styles: ['css(--bg-clr:rgba(0,230,118,0.1);--bdr-clr:rgba(0,230,118,0.5);--txt-clr:rgba(0,200,83,1))'] },
        三级: { condition: 'value==="三级"', styles: ['css(--bg-clr:rgba(112, 188, 252,0.2);--bdr-clr:rgba(112, 188, 252,0.5);--txt-clr:rgba(112, 208, 252,1))'] },
        四级: { condition: 'value==="四级"', styles: ['css(--bg-clr:rgba(255,171,0,0.2);--bdr-clr:rgba(255,171,0,0.5);--txt-clr:rgba(255,149,0,1))'] }
    },
    tableDataMap = new Map();
export default {
    type: 'wrapper',
    styles: [
        'size.fullsize',
        'css(columnGap:1.25rem)',
        Styles.stylesheet({
            '.bg-bdr': {
                // background: COLOR_SET.modulebgclr,
                border: 's solid var(--jam-color-primary-subtle)'
                // 'backdrop-filter': 'blur(1.5rem)'
            }
        })
    ],
    childStyles: ['size.fullheight'],
    components: [
        {
            type: 'wrapper',
            class: 'bg-bdr',
            styles: ['flex(flex:1;direction:column)', 'padding(0 l l)'],
            components: [
                {
                    type: 'wrapper',
                    styles: ['flex(direction:column)'],
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '区域：',
                            icon: 'earth-asia',
                            styles: [Styles.buttonGroupStyles, 'buttongroup.labelslot.margin(0)'],
                            value: '{{regionId}}',
                            data: '{{regionList}}'
                        },
                        {
                            type: 'wrapper',
                            styles: ['css(alignItems:center)'],
                            buttonStyles: [Styles.searchBtnsStyles],
                            components: [
                                {
                                    type: 'input-month',
                                    cap: '日期：',
                                    icon: 'calendar',
                                    value: '{{date}}',
                                    styles: ['input.agent.border(radius:s)', 'input.labelslot.margin(0)'],
                                    onchange: function () {
                                        if (isFirstChange) return;
                                        initCalendar();
                                    }
                                },
                                {
                                    type: 'button',
                                    cap: '查询',
                                    icon: 'search',
                                    class: 'jam-cta',
                                    onclick: function () {
                                        initData();
                                    }
                                },
                                // {
                                //     type: 'button',
                                //     cap: '导出',
                                //     onclick: function () {
                                //         // todo
                                //     }
                                // },
                                {
                                    type: 'button',
                                    cap: '新增保电活动',
                                    icon: 'plus',
                                    onclick: function () {
                                        jam.renderModal(
                                            '#main',
                                            powerAssuranceWindow({
                                                _titel: '新增保电活动',
                                                type: 2
                                            })
                                        );
                                        // _thisModel = createWindow({
                                        //     title: '新增保电活动',
                                        //     width: '30vw',
                                        //     height: '50vh',
                                        //     body: powerAssuranceWindow({
                                        //         type: 2
                                        //     }),
                                        //     showBtn: false
                                        // });
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    styles: ['size.fullsize', 'flex(flex:1;direction:column)', 'padding(top:l)'],
                    components: [
                        {
                            type: 'wrapper',
                            styles: [
                                Styles.stylesheet({
                                    ':scope': {
                                        padding: '0 m',
                                        height: '3.8rem',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: 'linear-gradient(180deg, var(--jam-color-primary-default) 0%, var(--jam-color-primary-film) 100%)',
                                        border: 0,
                                        borderRadius: 0,
                                        fontWeight: 'bold'
                                    }
                                })
                            ],
                            childStyles: [
                                'indicator.tweening.dial(msaklength:1)',
                                Styles.css({
                                    '--jam-digit-height': '1.9rem'
                                })
                            ],
                            components: [
                                {
                                    type: 'indicator-time',
                                    value: '{{date}}',
                                    unit: '月',
                                    styles: [
                                        //
                                        'indicator.unit.css(backgroundColor:transparent;fontSize:l;color:var(--jam-color-fg-default);padding:0)',
                                        'value.text(size:l;color:var(--jam-color-fg-default))'
                                    ],
                                    formatter: (date) => jam.formatTime(date, 'M')
                                },
                                {
                                    type: 'indicator-time',
                                    value: '{{date}}',
                                    styles: ['value.text(size:l;color:muted;family:DINPro)'],
                                    formatter: (date) => jam.formatTime(date, 'yyyy')
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            childStyles: ['size(width:calc(100% / 7);height:3.8rem)', 'css(justifyContent:flex-end;)', 'text(size:l;color:muted)'],
                            components: [
                                {
                                    buildFor: 'item in weekdays',
                                    type: 'label',
                                    cap: '{{item}}'
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            styles: [
                                'size.fullsize',
                                'layout.grid(cols: 7;rows:6;gap: 0;)',
                                'css(gridTemplateColumns:repeat(7,calc(100% / 7));gridTemplateRows:repeat(6,calc(100% / 6));)',
                                Styles.stylesheet({
                                    ':scope': {
                                        'jam-wrapper:nth-child(7n-1):not([iscurrmon=false]),jam-wrapper:nth-child(7n):not([iscurrmon=false])': {
                                            background: 'tint'
                                        },
                                        'jam-wrapper': {
                                            flexDirection: 'column',
                                            overflow: 'hidden',
                                            '&:not(.calendar-content)': {
                                                border: 's solid var(--jam-color-primary-subtle)'
                                            },
                                            '&:not(:nth-child(7n))': {
                                                borderRightWidth: 0
                                            },
                                            '&:nth-child(n+8)': {
                                                borderTopWidth: 0
                                            },
                                            '&.jam-with-cap': {
                                                paddingTop: 'l'
                                            }
                                        }
                                    }
                                }),
                                Styles.css({
                                    '--jam-digit-height': '1.9rem'
                                })
                            ],
                            components: [
                                {
                                    type: 'wrapper',
                                    buildFor: 'item in calendarData',
                                    attrs: {
                                        isCurrMon: '{{item.isCurrentMonth}}'
                                    },
                                    class: 'calendar-item',
                                    components: [
                                        {
                                            type: 'indicator-number',
                                            value: '{{item.day}}',
                                            styles: ['indicator.tweening.dial', 'value.text(size:l;family:DINPro)', 'padding(right:m)', 'css(justifyContent:flex-end)'],
                                            state: '{{item.isCurrentMonth}}?"isCurrMon":"isNotCurrMon"',
                                            states: {
                                                isCurrMon: { styles: ['value.text(color:var(--jam-color-fg-default))'] },
                                                isNotCurrMon: { styles: ['value.text(color:muted)'] }
                                            }
                                        },
                                        {
                                            type: 'wrapper',
                                            class: 'calendar-content',
                                            labelStyles: [Styles.toShowAll, 'size(maxWidth:96%)', 'css(alignSelf:center)', 'cap.css(width:100%;padding:.25rem .45rem;borderRadius:1.25rem;backgroundColor:var(--bg-clr);color:var(--txt-clr);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;)'],
                                            components: jaml.var('item.date', 'calendarDataMap', (key, calendarDataMap) => {
                                                if (!calendarDataMap) return [];
                                                if (calendarDataMap[key] && calendarDataMap[key].length) {
                                                    if (calendarDataMap[key].length < 3) {
                                                        return (calendarDataMap[key] || []).map((aItem) => ({
                                                            type: 'label',
                                                            states: levelStates,
                                                            state: aItem.level,
                                                            cap: aItem.name
                                                        }));
                                                    } else {
                                                        const aItem = calendarDataMap[key][0];
                                                        return [
                                                            {
                                                                type: 'label',
                                                                states: levelStates,
                                                                state: aItem.level,
                                                                cap: aItem.name
                                                            },
                                                            {
                                                                type: 'label',
                                                                styles: [
                                                                    Styles.stylesheet({
                                                                        ':scope': {
                                                                            cursor: 'grab',
                                                                            paddingLeft: 'm',
                                                                            alignSelf: 'flex-start !important',
                                                                            color: 'muted'
                                                                        }
                                                                    })
                                                                ],
                                                                cap: `+${calendarDataMap[key].length - 1}`,
                                                                onmouseenter: function (e) {
                                                                    clearTimeout(popupHideDelay);
                                                                    jam.popup(
                                                                        e.target,
                                                                        jame({
                                                                            type: 'wrapper',
                                                                            labelStyles: ['cap.css(padding:.25rem .45rem;borderRadius:1.25rem;backgroundColor:var(--bg-clr);color:var(--txt-clr);)'],
                                                                            styles: ['size(width:max-content;)', 'border(width:0)', 'layout(overflow:hidden)', 'layout.flex(direction:column;wrap:nowrap;)', 'with.elevation'],
                                                                            components: calendarDataMap[key].map((aItem) => ({
                                                                                type: 'label',
                                                                                states: levelStates,
                                                                                state: aItem.level,
                                                                                cap: aItem.name
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
                                                } else {
                                                    return [];
                                                }
                                            })
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
            styles: ['size(width:47%;)', 'flex(direction:column;)', 'css(rowGap:1.25rem)'],
            childStyles: ['size.fullwidth', ''],
            components: [
                {
                    type: 'wrapper',
                    styles: ['flex(flex:1;direction:column;)'],
                    components: [
                        {
                            type: 'label',
                            cap: '保供电时间',
                            styles: [Styles.tableTitleStyles]
                        },
                        {
                            type: 'wrapper',
                            class: 'bg-bdr',
                            styles: ['flex(1)', 'padding(l)'],
                            components: [
                                buildBasicTable({
                                    cap: '保供电时间-表格',
                                    icon: 'table',
                                    dataDef: [
                                        {
                                            cap: '保电方案名称',
                                            sortable: false,
                                            styles: ['css(cursor:pointer)'],
                                            onclick: function (e) {
                                                _model.activityName = this.col(0);
                                                querySceneImportantDev(this.col(4));
                                            }
                                        },
                                        {
                                            cap: '级别',
                                            sortable: false,
                                            states: levelStates,
                                            styles: ['value.padding(.25rem .45rem)', 'value.border(width:.0625rem;style:solid;color:var(--bdr-clr))', 'value.background(color:var(--bg-clr))', 'text(color:var(--txt-clr))']
                                        },
                                        {
                                            cap: '开始时间',
                                            sortable: false,
                                            width: '12rem',
                                            formatter: formatterJameTime
                                        },
                                        {
                                            cap: '结束时间',
                                            sortable: false,
                                            width: '12rem',
                                            formatter: formatterJameTime
                                        },
                                        {
                                            cap: '操作',
                                            sortable: false,
                                            formatter: (id) =>
                                                jame({
                                                    type: 'wrapper',
                                                    styles: ['layout.flex(justifyContent:center)'],
                                                    buttonStyles: ['background(color:transparent;image:none)', 'shadow(none)'],
                                                    components: [
                                                        {
                                                            type: 'button',
                                                            icon: 'edit',
                                                            onclick: function () {
                                                                jam.renderModal(
                                                                    '#main',
                                                                    powerAssuranceWindow({
                                                                        _titel: '编辑保电活动',
                                                                        type: 2,
                                                                        ...tableDataMap.get(id)
                                                                    })
                                                                );
                                                                // _thisModel = createWindow({
                                                                //     title: '编辑保电活动',
                                                                //     width: '30vw',
                                                                //     height: '50vh',
                                                                //     body: powerAssuranceWindow({
                                                                //         type: 2,
                                                                //         ...tableDataMap.get(id)
                                                                //     }),
                                                                //     showBtn: false
                                                                // });
                                                            }
                                                        },
                                                        {
                                                            type: 'button',
                                                            icon: 'trash',
                                                            onclick: function (e) {
                                                                jam.popupYesNo(e.target, '确定要删除此保电活动吗？', () => {
                                                                    ajaxCall('deletePowerProtectScene', {
                                                                        params: {
                                                                            sceneId: id
                                                                        },
                                                                        success() {
                                                                            nutmeg.success('删除成功');
                                                                            initData();
                                                                        },
                                                                        error() {
                                                                            nutmeg.error('操作失败');
                                                                        }
                                                                    });
                                                                });
                                                            }
                                                        }
                                                    ]
                                                })
                                        }
                                    ],
                                    dataKey: 'importantActivityTableData'
                                })
                            ]
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    styles: ['size(height:49%;)', 'flex(direction:column;)'],
                    components: [
                        {
                            // plugins: ['popup.helper'],
                            type: 'label',
                            cap: '{{activityName}}+"-保供电设备"',
                            // help: '默认展示第一个保电方案设备,选中一个保电方案设备后,展示该方案下的设备。',
                            styles: [Styles.tableTitleStyles]
                        },
                        {
                            type: 'wrapper',
                            class: 'bg-bdr',
                            styles: ['size(width:100%;height:calc(100% - 2.5rem))', 'css(overflow:hidden)', 'padding(l)'],
                            components: [diffImportantDevTable('small')]
                        }
                    ]
                }
            ]
        }
    ],
    watchers: [
        {
            key: 'date',
            callback: function (date) {
                initData();
            },
            debounce: 300
        },
        {
            key: 'regionId',
            init: false,
            callback: function (regionId) {
                initData();
            }
        }
    ],
    vars: {
        activityName: ' ',
        date: jam.formatTime(new Date(), 'yyyy-MM'),
        // date: '2025-07',
        calendarData: Array(6 * 7).fill({}),
        weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        regionId: null
    },
    onmount() {
        _model = this.model;
        _msgr = this.model.msgr;

        mango.sub('_closeWindow', (val) => {
            jam.closeTopModal();
            mango.pub('_closeWindow', null);
            if (val == 1) {
                initData();
            }
        });
    },
    onunmount() {
        mango.unsub('_closeWindow');
        jam.closePopup();
    },
    onafterrender: function () {
        getRegionList(_model);
        if (isFirstChange) {
            initCalendar();
            isFirstChange = false;
        }
    }
};
function initData() {
    jam.closePopup();
    const dateIns = moment(_model.date);
    if (!dateIns.isValid()) return;
    const daysInMonth = dateIns.daysInMonth();
    ajaxCall('getImportantActivityData', {
        params: {
            // name 名称
            // level 保电等级
            type: 2, //重要活动
            // subType: '活动类型',
            beginTime: _model.date + '-01 00:00:00',
            endTime: _model.date + `-${daysInMonth} 23:59:59`,
            regionId: _model.regionId ?? undefined
        },
        type: 'post',
        success(data) {
            try {
                tableDataMap.clear();

                const calendarDataMap = {};
                _msgr.pub(
                    'importantActivityTableData',
                    data.map((item) => {
                        tableDataMap.set(item.id, item);
                        let time = item.beginTime;
                        while (moment(time).format('YYYY-MM-DD') <= moment(item.endTime).format('YYYY-MM-DD')) {
                            const key = moment(time).format('YYYY-MM-DD');
                            if (calendarDataMap[key]) {
                                calendarDataMap[key].push({ ...item, levelNum: levelNumMap[item.level] });
                            } else {
                                calendarDataMap[key] = [{ ...item, levelNum: levelNumMap[item.level] }];
                            }

                            time = moment(time).add(1, 'day');
                        }
                        return [item.name, item.level, item.beginTime, item.endTime, item.id, item.sceneId, item.stId];
                    })
                );

                for (const key in calendarDataMap) {
                    calendarDataMap[key] = calendarDataMap[key].sort((a, b) => a.levelNum - b.levelNum);
                }

                _model.calendarDataMap = calendarDataMap;
                const { name, id, stId } = data[0] || {};
                _model.activityName = name ?? ' ';
                querySceneImportantDev(id, stId);
            } catch (error) {
                console.error('error: ', error);
            }
        }
    });
    // 'getImportantActivityData'
}

function initCalendar() {
    const dateIns = moment(_model.date);
    if (!dateIns.isValid()) return;
    // 获取当前月份的1号是星期几
    const firstDayOfWeek = dateIns.date(1).day() || 7;
    // 获取当前月份的天数
    const daysInMonth = dateIns.daysInMonth();
    let calendarData,
        day = 1,
        nextMonthDay = 1;

    if (firstDayOfWeek === 1) {
        calendarData = _model.calendarData.map((item, index) => {
            if (index < daysInMonth - 1) {
                item.date = dateIns.format('yyyy-MM-') + (day < 10 ? '0' + day : day);
                item.day = day++;
                item.isCurrentMonth = true;
            } else {
                item.date = moment(dateIns).add(1, 'months').format('yyyy-MM-') + (nextMonthDay < 10 ? '0' + nextMonthDay : nextMonthDay);
                item.day = nextMonthDay++;
                item.isCurrentMonth = false;
            }
            return item;
        });
    } else {
        const daysInLastMonth = moment(dateIns.clone()).subtract(1, 'months').daysInMonth();
        calendarData = _model.calendarData.map((item, index) => {
            item.isCurrentMonth = index >= firstDayOfWeek - 1 && index < daysInMonth + firstDayOfWeek - 1;
            if (index < firstDayOfWeek - 1) {
                item.day = daysInLastMonth - (firstDayOfWeek - index - 2);
                item.date = moment(dateIns.clone()).subtract(1, 'months').format('yyyy-MM-') + (item.day < 10 ? '0' + item.day : item.day);
            } else if (index >= firstDayOfWeek - 1 && index < daysInMonth + firstDayOfWeek - 1) {
                item.date = dateIns.format('yyyy-MM-') + (day < 10 ? '0' + day : day);
                item.day = day++;
            } else {
                item.date = moment(dateIns.clone()).add(1, 'months').format('yyyy-MM-') + (nextMonthDay < 10 ? '0' + nextMonthDay : nextMonthDay);
                item.day = nextMonthDay++;
            }
            return item;
        });
    }
    _model.calendarData = calendarData;
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
