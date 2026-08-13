import { buildTable } from '../../components/componentBuilder.js';
import { mockPath, urlConfig } from '../../global.js';
import { COMM_PATH } from '../../utils/Constants.js';
import { formatterJameBv } from '../../common.js';
export default function (_params) {
    delete _params.regionId;
    delete _params.tableId;
    delete _params.bvId;
    delete _params.stId;
    let _model, _msgr;
    return {
        type: 'card',
        icon: '',
        cap: '电压越限详情',
        broker: 'devOverLimitWindow',
        styles: [
            'with.elevation',
            Styles.card.floating({
                width: '70vw',
                height: '60vh'
            })
        ],
        components: [
            buildTable({
                cap: '电压越限详情-表格',
                icon: 'table',
                broker: 'fiveTypesAlarmDetailsWindow',
                dataDef: [
                    {
                        key: 'stId',
                        show: false
                    },
                    {
                        cap: '地区',
                        key: 'regionName',
                        sortable: false
                    },
                    {
                        cap: '变电站',
                        key: 'stName',
                        sortable: false
                    },
                    {
                        cap: '电压等级',
                        key: 'bvName',
                        sortable: false,
                        formatter: formatterJameBv
                    },
                    {
                        cap: '详细内容',
                        key: 'content',
                        sortable: false,
                        width: '60%',
                        align: 'left',
                        styles: [Styles.toShowAll]
                    }
                ],
                //变电站、间隔、电压等级、设备名称、遥测名称、累计调档次数；
                getReqParams: function () {
                    return {
                        method: 'post',
                        data: {
                            pageIndex: this.model.cpageNo || 1,
                            pageSize: this.model.cpageSize || 20,
                            ..._params
                        },
                        url: urlConfig.getOverLimitDetail.url,
                        mock: mockPath + urlConfig.getOverLimitDetail.mock,
                        transform: (res) => {
                            const { list = [], pojoTotalCount = 0 } = res?.data || {};
                            this.model.ctotal = pojoTotalCount;
                            return list.map((item) => {
                                return [item.id, item.regionName, item.stName, item.bvName, item.content];
                            });
                        }
                    };
                }
            })
        ],
        onmount() {
            _model = this.model;
        },
        onafterrender: function (dom) {}
    };
}
