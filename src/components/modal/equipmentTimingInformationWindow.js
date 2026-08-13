import { ajaxCall } from './../../common.js';

export default function (props) {
    let _model, _msgr;
    return {
        type: 'wrapper',
        styles: ['size.fullsize', 'flex(direction:column)'],
        childStyles: [
            'padding(0.5rem)',
            'labelslot.text(size:1.125rem;weight:bold)',
            Styles.stylesheet({
                '&>[slot=label]': {
                    position: 'sticky',
                    top: 0,
                    height: '1.6875rem',
                    paddingLeft: 'l',
                    color: 'transparent',
                    backgroundImage: 'linear-gradient(180deg, var(--jam-color-on-primary) 10%, var(--jam-color-primary-default) 90%, var(--jam-color-primary-default) 100%)',
                    '-webkit-background-clip': 'text',
                    backgroundClip: 'text',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: -1,
                        backgroundImage: 'url(./assets/images/window_title.png)',
                        backgroundSize: 'auto 1.875rem',
                        backgroundRepeat: 'no-repeat'
                    }
                }
            })
        ],
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
        },
        onafterrender: function () {
            initData();
        },
        components: [
            {
                type: 'wrapper',
                // label: '运行数据',
                styles: ['size(width:100%)', 'flex(flex:1;direction:column)'],
                components: [
                    {
                        type: 'chart-line',
                        colorSet: ['primary', 'success', 'muted'],
                        styles: ['size.fullsize', 'echarts.line.gradientBg', 'echarts.line(smooth:false)', 'echarts.grid(bottom:1%)', 'echarts.legend(show:true)'],
                        data: '{{timingInfoSampleData}}'
                    }
                ]
            }
            // {
            //     type: 'wrapper',
            //     label: '告警记录',
            //     styles: [
            //         'size(width:100%;height:48%)',
            //         'layout(overflow:auto)',
            //         'flex(direction:column)',
            //         Styles.stylesheet({
            //             'jam-label:first-child': {
            //                 marginTop: 's'
            //             },
            //             '.empty::after': {
            //                 content: '无告警记录'
            //             }
            //         })
            //     ],
            //     components: [
            //         {
            //             buildFor: 'item in warnDetailList',
            //             type: 'label',
            //             cap: '{{item.content}}',
            //             styles: [
            //                 //
            //                 'size(width:100%;height:1.625rem)',
            //                 'padding(left:1rem)',
            //                 'border(width:0px;style:dashed;color: rgba(94,94,94,1);bottomWidth:1px)',
            //                 `color(${COLOR_SET.secondarytextclr})`
            //             ]
            //         }
            //     ]
            // }
        ]
    };
    function initData() {
        // ajaxCall('getWarnDetailInfo', {
        //     params: {
        //         // "pageIndex": 1,
        //         // "pageSize": 10,
        //         startTime: props.beginDate,
        //         endTime: props.endDate,
        //         devId: props.devId,
        //         desc: true
        //     },
        //     type: 'post',
        //     success(data) {
        //         const { list = [] } = data || {};
        //         _model.vars.warnDetailList = list;
        //     }
        // });

        ajaxCall('getWarnDevSample', {
            params: {
                warnType: props.warnType,
                devId: props.devId,
                beginDate: props.beginDate,
                endDate: props.endDate
            },
            // useMock: true,
            type: 'post',
            success(data) {
                try {
                    const result = [['时间']];
                    data.forEach((item, i) => {
                        result[0].push(item.sampleName);
                        item.sampleList.forEach((sampleItem, j) => {
                            i ? result[j + 1].push(sampleItem.sampleValue) : result.push([sampleItem.occurTime?.slice(-8) || '--:--:--', sampleItem.sampleValue]);
                        });
                    });
                    _model.vars.timingInfoSampleData = result;
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }
}
