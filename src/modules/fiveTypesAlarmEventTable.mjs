import { formatterJameTime } from '../common.js';
import { buildTable } from '../components/componentBuilder.js';
import { urlConfig } from '../global.js';

const _table = buildTable({
    cap: '五类告警各类型详情数据-表格',
    icon: 'table',
    broker: 'fiveTypesAlarmDetails',
    dataDef: [
        {
            cap: '变电站ID',
            key: 'stId',
            show: false
        },
        {
            cap: '区域',
            key: 'regionName'
        },
        {
            cap: '变电站',
            key: 'stName',
            class: 'r-st item-content',
            attrs: jaml.res(function () {
                return { 'data-id': this.col(0) };
            })
        },
        {
            cap: '发生时间',
            key: 'occurTime',
            formatter: formatterJameTime
        },
        {
            cap: '信号描述',
            key: 'content',
            align: 'left',
            width: '30%',
            styles: [Styles.toShowAll]
        },
        {
            cap: '确认状态',
            key: 'confirmStatusName'
        },
        {
            cap: '确认时间',
            key: 'confirmTime',
            formatter: formatterJameTime
        },
        {
            cap: '确认人员',
            key: 'confirmUserName'
        }
    ],
    getReqParams: function () {
        const [customizedGroup, regionId, bvId, tableId, stId, beginDate, endDate] = ['customizedGroup', 'regionId', 'bvId', 'tableId', 'stId', 'beginDate', 'endDate'].map((key) => this.msgr('fiveTypesAlarmDetails').get(key));
        return {
            method: 'POST',
            url: urlConfig.getWarnDetailInfo.url,
            mock: urlConfig.getWarnDetailInfo.mock,
            data: {
                customizedGroup,
                regionId,
                bvId,
                tableId,
                stId,
                endTime: endDate + ' 23:59:59',
                pageIndex: this.model.vars.cpageNo,
                pageSize: this.model.vars.cpageSize,
                startTime: beginDate + ' 00:00:00'
            },
            transform: (res) => {
                const { pojoTotalCount = 0, list = [] } = res?.data;
                this.model.vars.ctotal = pojoTotalCount;
                const _list = list.map((item) => {
                    for (const key in item) {
                        if (key !== 'occurTime' && key !== 'confirmTime') {
                            item[key] = item[key] ?? '--';
                        }
                    }

                    return item;
                });
                return _list;
            }
        };
    },
    exportUrl: 'exportAlarmByParam'
});

export default _table;
