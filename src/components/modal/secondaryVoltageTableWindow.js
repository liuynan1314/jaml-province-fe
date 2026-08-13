import { hslaToJamAc } from '../../utils/Constants.js';
import { ajaxCall } from '../../common.js';

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
                    paddingLeft: '1.375rem',
                    color: 'transparent',
                    backgroundImage: `linear-gradient(180deg, ${hslaToJamAc('hsl(220, 60%, 99%)')} 10%,${hslaToJamAc(' hsl(204.1, 40.6%, 60.4%)')} 90%,${hslaToJamAc(' hsl(204.1, 40.6%, 60.4%)')} 100%)`,
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
                        type: 'table',
                        class: 'talbe-style',
                        styles: [Styles.tableStyles, Styles.table.css({ width: '100%', height: 'calc(100% - 0.9rem)', overflowY: 'auto' })],
                        dataWatcher: 'defectRecordData',
                        dataDef: [
                            {
                                key: 'menu',
                                cap: ' ',
                                sortable: false
                            },
                            {
                                key: 'value1',
                                cap: '单设备偏差',
                                sortable: false
                            },
                            {
                                key: 'value2',
                                cap: '多设备偏差',
                                sortable: false
                            },
                            {
                                key: 'value3',
                                cap: '单设备历史值三相偏差',
                                sortable: false
                            },
                            {
                                key: 'value4',
                                cap: '三相历史平均值',
                                sortable: false
                            }
                        ]
                    }
                ]
            }
        ]
    };
    function initData() {
        ajaxCall('getDeviationData', {
            params: {
                devId: props.devId,
                elecPoint: props.elecPoint
                // devId:'116812115871809464',
                // elecPoint:'3848044406611378177',
            },
            // useMock: true,
            type: 'get',
            success(data) {
                try {
                    _model.vars.defectRecordData = generateTableData(data) || [];
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }
}

// 数据组合方法
function generateTableData(responseData) {
    // 提取数据
    const data = responseData;

    // 组合表格数据
    return [
        {
            menu: 'A相电压',
            value1: data.triPhaseDev[0],
            value2: data.multiTriPhaseDev[0],
            value3: data.hisTriPhaseDev[0],
            value4: data.hisAvg[0]
        },
        {
            menu: 'B相电压',
            value1: data.triPhaseDev[1],
            value2: data.multiTriPhaseDev[1],
            value3: data.hisTriPhaseDev[1],
            value4: data.hisAvg[1]
        },
        {
            menu: 'C相电压',
            value1: data.triPhaseDev[2],
            value2: data.multiTriPhaseDev[2],
            value3: data.hisTriPhaseDev[2],
            value4: data.hisAvg[2]
        }
    ];
}
