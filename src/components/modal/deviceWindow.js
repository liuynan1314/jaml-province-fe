import { ajaxCall, exportExcel } from '../../common.js';
import { urlConfig } from '../../global.js';
// import { createWindow } from '../createWindow.js';
// import deviceLineWindow from './deviceLineWindow.js';

let _msgr = null;

const deviceWindow = (params) => {
    console.log(params);
    const dataDefs = [
        [
            {
                cap: '线路电压等级',
                key: 'bvName',
                sortable: false
            },
            {
                cap: '线路名称',
                key: 'lineendName',
                // align: 'left',
                styles: [
                    Styles.hover.toShowAll,
                    Styles.css({
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                    })
                ],
                sortable: false
            },
            {
                cap: '时段1最高负载率时刻线路电流占比受总电流比例',
                key: 'lineAndWindRate1',
                sortable: false,
                styles: [
                    Styles.css({
                        whiteSpace: 'pre-line'
                    })
                ]
            },
            {
                cap: '时段2最高负载率时刻线路电流占比受总电流比例',
                key: 'lineAndWindRate2',
                sortable: false
            },
            {
                cap: '两时段线路电流占比变化',
                key: 'lineAndWindVariation',
                sortable: false
            },

            {
                cap: '时段1最高负载率时刻线路负载率',
                key: 'rate1',
                sortable: false
            },
            {
                cap: '时段2最高负载率时刻线路负载率',
                key: 'rate2',
                sortable: false
            },
            {
                cap: '两时段线路负载率变化',
                key: 'rateVariation',
                sortable: false
            }
        ],
        [
            {
                cap: '线路电压等级',
                key: 'bvName',
                sortable: false
            },
            {
                cap: '线路名称',
                key: 'lineendName',
                // align: 'left',
                styles: [
                    Styles.hover.toShowAll,
                    Styles.css({
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                    })
                ],
                sortable: false
            },
            {
                cap: '最高负载率时刻线路电流占受总电流比例',
                key: 'lineAndWindRateHigh',
                sortable: false
            },
            {
                cap: '最低负载率时刻线路电流占受总电流比例',
                key: 'lineAndWindRateLow',
                sortable: false
            },
            {
                cap: '两时段线路电流占比变化',
                key: 'lineAndWindVariation',
                sortable: false
            },

            {
                cap: '最高负载率时刻线路负载率',
                key: 'rateHigh',
                sortable: false
            },
            {
                cap: '最低负载率时刻线路负载率',
                key: 'rateLow',
                sortable: false
            },
            {
                cap: '两时段线路负载率变化',
                key: 'rateVariation',
                sortable: false
            }
        ],
        [
            {
                cap: '线路电压等级',
                key: 'bvName',
                sortable: false
            },
            {
                cap: '线路名称',
                key: 'lineendName',
                sortable: false,
                // align: 'left',
                styles: [
                    Styles.hover.toShowAll,
                    Styles.css({
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                    })
                ]
            },
            {
                cap: '最高负载率时刻线路电流占受总电流比例',
                key: 'lineAndWindRate',
                sortable: false
            },
            {
                cap: '最高负载率时刻线路负载率',
                key: 'rate',
                sortable: false
            }
        ]
    ];
    return {
        type: 'wrapper',
        styles: [Styles.table.th.css({ height: '4.2rem' }), 'size.fullsize', 'padding( 0.5rem 0.5rem 1.5rem 0.5rem )', Styles.layout.flex({ direction: 'column', wrap: 'nowrap' })],
        components: [
            // {
            //     type: 'button',
            //     class: 'btn export-btn',
            //     styles: [Styles.button.regularStyle, Styles.buttonWithexportBg],
            //     onclick: function () {
            //         exportDetailTableData(params);
            //     }
            // },
            {
                type: 'table',
                styles: [
                    Styles.table.regularStyle,
                    Styles.table.showrownum({ style: 'plain' }),
                    Styles.table.css({
                        // maxWidth: '100%',
                        // overflowX: 'auto'
                    }),
                    Styles.stylesheet({
                        'jam-indicator>[slot=cap]': {
                            whiteSpace: 'break-spaces'
                        }
                    }),
                    Styles.size.fullsize
                ],
                dataWatcher: 'deviceLoadRate1TableData',
                dataDef: dataDefs[params.pageType]
            }
        ],
        onmount: function () {
            _msgr = this.model.msgr;
        },
        onafterrender: function () {
            getDetailTableData(params);
        }
    };
};

async function getDetailTableData(params) {
    let url = '';
    if (params.pageType === 0) {
        url = 'getDevLoadRate';
    } else if (params.pageType === 1) {
        url = 'getDevLoadRateIntraday';
    } else if (params.pageType === 2) {
        url = 'getDevLoadRateTh';
    }
    ajaxCall(
        url,
        {
            success(res) {
                _msgr.pub('deviceLoadRate1TableData', res?.list[0].mapBvIdAndLines);
                _msgr.pub('deviceLoadRate1TableTotal', res?.pojoTotalCount);
            },
            params: {
                ...params
            },
            useMock: false,
            type: 'post',
            timeout: 600
        },
        false
    );
}

// function exportDetailTableData(params) {
//     exportExcel(
//         urlConfig.exportBusPowerLoss.url,
//         {
//             ...params,
//             exportDetail: true
//         },
//         `失电详情数据.xlsx`,
//         'POST'
//     );
// }

export default deviceWindow;
