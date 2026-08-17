let _model, _msgr;
import { ajaxCall, getDetailConf } from '../../common.js';
import { buildBasicTable } from '../componentBuilder.js';
const deviceList = getDetailConf('deviceList');
const deviceTypeIds = deviceList.map((item) => item.value);
let deviceScaleData = [];
const systemProgressCityAccessNumWindow = (params) => {
    return {
        type: 'card',
        icon: '',
        cap: params.title,
        styles: [
            Styles.card.floating({
                width: '50vw',
                height: '48vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                id: 'systemProgressCityAccessNumWindow',
                styles: [
                    'size.fullsize',
                    'layout(overflow:hidden)',
                    Styles.stylesheet({
                        ':scope': {
                            direction: 'column',
                            'flex-wrap': 'nowrap',
                            'flex-direction': 'column',
                            gap: 'm'
                        }
                    })
                ],
                components: [
                    {
                        type: 'wrapper',
                        styles: [Styles.layout.flex({ justifyContent: 'flex-start' })],
                        components: [
                            {
                                type: 'select',
                                cap: '类型选择:',
                                value: '{{typeId}}',
                                styles: [Styles.select.regular, Styles.props({ marginTop: 'xs', marginLeft: 'm' })],
                                data: deviceList
                            },
                            {
                                type: 'input',
                                cap: '变电站：',
                                styles: [Styles.input.regular, Styles.props({ marginTop: 'xs', marginLeft: 'm' })],
                                placeholder: '请输入变电站',
                                valueKey: 'stName'
                            },
                            {
                                type: 'button',
                                class: 'btn query-btn',
                                cap: '查询',
                                styles: [Styles.button.regularStyle, Styles.buttonWithQueryBgNew, Styles.props({ marginTop: 'xs', marginLeft: 'm' })],
                                onclick: function () {
                                    handleTableData();
                                }
                            }
                        ]
                    },
                    buildBasicTable({
                        cap: '主要设备数量-表格',
                        icon: 'table',
                        dataKey: 'substationTableData',
                        dataDef: [
                            {
                                cap: 'id',
                                key: 'id',
                                show: false
                            },
                            {
                                cap: '变电站',
                                key: 'stName',
                                sortable: false
                            },
                            {
                                cap: '数量',
                                key: 'totalCnt',
                                sortable: false
                            }
                        ]
                    })
                ],
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                vars: {
                    typeId: deviceTypeIds[0],
                    substationTableData: []
                },
                onafterrender: function () {
                    getTableData();
                }
            }
        ]
    };
    function getTableData() {
        ajaxCall(
            'getDevScale',
            {
                success(res) {
                    deviceScaleData = res;
                    handleTableData();
                },
                params: {
                    devTypeList: deviceTypeIds,
                    groupType: 3
                },
                useMock: false,
                type: 'post'
            },
            false
        );
    }

    function handleTableData() {
        const inputName = _msgr?.get('stName');
        const selectedDevice = (Array.isArray(deviceScaleData) ? deviceScaleData : []).find((item) => item.devType === _model.vars.typeId);
        const tableData = (selectedDevice?.stList || []).map(({ stName, totalCnt, id }) => ({ stName, totalCnt, id })).filter((item) => !inputName || String(item.stName || '').includes(inputName));

        _model.vars.substationTableData = tableData;
    }
};
export default systemProgressCityAccessNumWindow;
