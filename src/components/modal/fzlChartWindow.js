// 负载率曲线弹窗
let _model, _msgr;
import { ajaxCall } from '../../common';
let devId;
const defaultTime = moment().format('YYYY-MM-DD');
const fzlChartWindow = (params) => {
    devId = params;
    const datepickerAgentStyles = [',', Styles.datepicker.agent.size({ width: 'var(--agent-width)', height: '2rem' }), Styles.datepicker.agent.background({ color: 'transparent' }), Styles.datepicker.agent.border({ color: 'var(--jam-color-outline-muted)', radius: '0' })];
    return {
        type: 'card',
        icon: '',
        cap: '负载率历史曲线',
        styles: [
            Styles.card.floating({
                width: '70vw',
                height: '79vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                id: 'fzlChartWindow',
                styles: ['size(width:100%;height:100%)', 'props(diplay:flex;flexDirection:column;flexWrap:nowrap)', 'css(font-size:1rem;)'],
                components: [
                    {
                        type: 'wrapper',
                        styles: ['size(width:100%;height:100%)', 'props(display:flex;flexDirection:column;)'],
                        components: [
                            {
                                type: 'wrapper',
                                styles: ['size(width:calc(100% - 1rem))', 'props(display:flex;flexWrap:wrap;align-items: center;)', 'margin(0.5rem)'],
                                inputStyles: [
                                    'hover.withbg',
                                    'size(maxWidth:16rem)',
                                    Styles.input.agent.size({ width: '10rem', height: '2rem' }),
                                    Styles.input.agent.background({ color: 'transparent' }),
                                    Styles.input.agent.border({ color: 'var(--jam-color-outline-muted)', radius: '0' }),
                                    Styles.props({
                                        marginRight: 'm'
                                    })
                                ],
                                buttonStyles: [Styles.searchBtnsStyles],
                                components: [
                                    {
                                        type: 'datepicker',
                                        cap: '开始时间',
                                        valueKey: 'startTime',
                                        defaultValue: defaultTime,
                                        styles: [
                                            'size(width:max-content;maxWidth:max-content)',
                                            ...datepickerAgentStyles,
                                            Styles.inputWithCustomizedBgAndIcon({
                                                dateIcon: '../../../jk-home-common/assets/icon-calender.png'
                                            })
                                        ]
                                    },
                                    {
                                        type: 'datepicker',
                                        cap: '结束时间',
                                        valueKey: 'endTime',
                                        defaultValue: defaultTime,
                                        styles: [
                                            'size(width:max-content;maxWidth:max-content)',
                                            ...datepickerAgentStyles,
                                            Styles.inputWithCustomizedBgAndIcon({
                                                dateIcon: '../../../jk-home-common/assets/icon-calender.png'
                                            })
                                        ]
                                    },
                                    {
                                        type: 'button',
                                        cap: '查询',
                                        icon: 'search',
                                        class: 'jam-cta',
                                        msgFormat: {
                                            msgKey: 'get-line-data'
                                        }
                                    },
                                    {
                                        type: 'button',
                                        cap: '重置',
                                        icon: 'repeat',
                                        onclick: function () {
                                            _msgr.pub('startTime', defaultTime);
                                            _msgr.pub('endTime', defaultTime);
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'wrapper',
                                styles: ['size(width:100%;height:calc(100% - 2rem))', 'padding(0 0.5rem)', 'css(border:.05rem solid rgba(43,72,101,.5))', 'props(font-size:1rem;position:relative)', Styles.css({ overflow: 'hidden' })],
                                components: [
                                    {
                                        type: 'chart-line',
                                        styles: [
                                            'echarts.legend(show:true;icon:rect;top:5%;itemWidth:10;itemHeight:10;)',
                                            'echarts.legend.textStyle(size:14;color:var(--jam-color-fg-default))',
                                            'echarts.grid(top:15%;bottom:5%;left:5%;)',
                                            'echarts.axis.y.nameStyle(fontSize:18px;color:var(--jam-color-fg-default);fontWeight:500)',
                                            'size(width:100%;height:100%;)',
                                            'css(font-size:22px;)',
                                            Styles.cap.text({ spacing: '3px' })
                                        ],
                                        dataWatcher: 'lineData'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                watchers: [
                    {
                        key: 'get-line-data',
                        callback: function (val) {
                            getEchartsData();
                        }
                    },
                    {
                        key: 'auto-refresh-msg',
                        callback: function (val) {
                            getEchartsData();
                        }
                    }
                ],
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                onafterrender: function () {
                    getEchartsData();
                },
                onunmount: function () {}
            }
        ]
    };
};

function getEchartsData() {
    let searchParams = {
        beginTime: (_msgr.get('startTime') ? _msgr.get('startTime') : defaultTime) + ' 00:00:00',
        endTime: (_msgr.get('endTime') ? _msgr.get('endTime') : defaultTime) + ' 23:59:59'
    };
    searchParams.devId = devId;
    ajaxCall('getHisOilTempCurve', {
        type: 'post',
        success(data) {
            let lineData = [['时间', '负载率']];
            lineData = lineData.concat(
                (data?.loadRate || []).map((item) => {
                    return [item.occurTime, item.sampleValue];
                })
            );
            _msgr.pub('lineData', lineData);
        },
        params: searchParams,
        useMock: false
    });
}

export default fzlChartWindow;
