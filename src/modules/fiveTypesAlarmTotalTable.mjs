import fiveTypesAlarmDetailsWindow from '../components/modal/fiveTypesAlarmDetailsWindow.js';
import { formatterJameBv } from '../common.js';
import { buildTable } from '../components/componentBuilder.js';
import { urlConfig } from '../global.js';

const text_styles = { textDecoration: 'underline', cursor: 'pointer' };

const _table = buildTable({
    cap: '五类告警总计详情数据-表格',
    icon: 'table',
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
            cap: '电压等级',
            key: 'bvName',
            class: 'item-content',
            formatter: formatterJameBv
        },
        {
            cap: '变电站',
            key: 'stName',
            class: 'item-content',
            class: 'r-st item-content',
            attrs: jaml.res(function () {
                return { 'data-id': this.col(0) };
            })
        },
        {
            cap: '事故',
            key: 'recordNum0',
            styles: [Styles.css({ color: 'hsl(355 100% 63.9%)', ...text_styles })],
            onclick: function (e) {
                openFiveTypesAlarmDetailsDialog(0, this);
            }
        },
        {
            cap: '异常',
            key: 'recordNum1',
            styles: [Styles.css({ color: 'hsl(39 100% 50.4%)', ...text_styles })],
            onclick: function (e) {
                openFiveTypesAlarmDetailsDialog(1, this);
            }
        },
        {
            cap: '越限',
            key: 'recordNum2',
            styles: [Styles.css({ color: 'hsl(57 66.3% 51.2%)', ...text_styles })],
            onclick: function (e) {
                openFiveTypesAlarmDetailsDialog(2, this);
            }
        },
        {
            cap: '变位',
            key: 'recordNum3',
            styles: [Styles.css({ color: 'hsl(162 66.7% 54.1%)', ...text_styles })],
            onclick: function (e) {
                openFiveTypesAlarmDetailsDialog(3, this);
            }
        },
        {
            cap: '告知',
            key: 'recordNum4',
            styles: [Styles.css({ color: 'hsl(199 100% 59.2%)', ...text_styles })],
            onclick: function (e) {
                openFiveTypesAlarmDetailsDialog(4, this);
            }
        },
        {
            cap: '总计',
            key: 'recordNumSum',
            styles: [Styles.css({ ...text_styles })],
            onclick: function (e) {
                openFiveTypesAlarmDetailsDialog('total', this);
            }
        }
    ],
    getReqParams: function () {
        const [stId, tableId, beginDate, endDate] = ['stId', 'tableId', 'beginDate', 'endDate'].map((key) => this.msgr('fiveTypesAlarmDetails').get(key));
        return {
            method: 'POST',
            url: urlConfig.getJkWarnSumStatGroup.url,
            mock: urlConfig.getJkWarnSumStatGroup.mock,
            data: {
                stId,
                tableId,
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
                        item[key] = item[key] ?? '--';
                    }

                    return item;
                });

                return _list;
            }
        };
    },
    exportUrl: 'exportSumAlarmByParam'
});

function openFiveTypesAlarmDetailsDialog(customizedGroup, _this) {
    const [beginDate, endDate] = ['beginDate', 'endDate'].map((key) => _this.cmpt.msgr('fiveTypesAlarmDetails').get(key));
    const _params = {
        customizedGroup: customizedGroup,
        stId: _this.col(0),
        startTime: beginDate + ' 00:00:00',
        endTime: endDate + ' 23:59:59'
    };
    jam.renderModal('#main', fiveTypesAlarmDetailsWindow(_params));
}

export default _table;
