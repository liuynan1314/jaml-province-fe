// import { createWindow } from '../createWindow';
import { ajaxCall, getDetailConf, loadConf } from '../../common';
import fzlChartWindow from './fzlChartWindow.js';
const uuid = jam.genUUID();

const dataDefs = [
    {
        cap: '变电站',
        key: 'stName',
        sortable: false
    },
    {
        cap: '重载数量',
        key: 'hevCnt',
        sortable: false
    },
    {
        cap: '过载数量',
        key: 'overCnt',
        sortable: false
    },
    {
        cap: '正常数量',
        key: 'normalCnt',
        sortable: false
    }
];
let _msgr = null,
    _model = null;
let tableData = [],
    allTableData = [];
const devOverloadStatisticsWindow = (params) => {
    return {
        type: 'card',
        icon: '',
        cap: '设备重过载变电站统计',
        styles: [
            Styles.card.floating({
                width: '80vw',
                height: '75vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                styles: [
                    'size.fullsize',
                    Styles.stylesheet({
                        ':scope': {
                            flexDirection: 'column'
                        },
                        '.container': {
                            width: '100%',
                            height: '100%',
                            flexDirection: 'column',
                            '.form-box': {
                                alignItems: 'center'
                            }
                        }
                    })
                ],
                components: [
                    {
                        type: 'wrapper',
                        class: 'container',
                        descStyles: {
                            button: [Styles.searchBtnsStyles, Styles.button.css({ margin: 'xs s' })]
                        },
                        components: [
                            {
                                type: 'wrapper',
                                class: 'form-box',
                                components: [
                                    {
                                        type: 'input',
                                        cap: '变电站：',
                                        valueKey: 'stName',
                                        styles: [Styles.input.regularStyle]
                                    },
                                    {
                                        type: 'button',
                                        icon: '',
                                        cap: '查询',
                                        onclick: function () {
                                            getTableData();
                                        }
                                    },
                                    {
                                        type: 'button',
                                        cap: '重置',
                                        onclick: function () {
                                            _msgr.pub('stName', '');
                                            getTableData();
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'table',
                                styles: [Styles.table.regularStyleNew, '', 'table.fixedrowheight(height:2.6rem)', Styles.css({ width: '100%', height: 'calc(100% - 1rem)' })],
                                dataWatcher: 'tableData',
                                dataDef: dataDefs
                            }
                        ]
                    }
                ],
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                onafterrender: function () {
                    getTableData();
                }
            }
        ]
    };
};

/**
 * 表格数据
 */
function getTableData() {
    ajaxCall(
        'getOverloadStCnt',
        {
            type: 'get',
            success(data) {
                tableData = data;
                allTableData = JSON.parse(JSON.stringify(data));

                let stName = _msgr.get('stName');
                if (!stName) {
                    tableData = allTableData;
                } else {
                    tableData = allTableData.filter(function (item) {
                        if (item.stName) {
                            return item.stName.indexOf(stName) > -1;
                        }
                    });
                }
                _msgr.pub('tableData', tableData);
            },
            useMock: false
        },
        false
    );
}

export default devOverloadStatisticsWindow;
