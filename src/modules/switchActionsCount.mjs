let _model, _msgr;
import { ajaxCall, exportExcel, formatterJameBv } from '../common.js';
import { getRegionList } from '../utils/ajaxCache.js';
import { getSubstationList, getBvList } from '../utils/commonList.js';
import { urlConfig } from '../global.js';
// import { createWindow } from '../components/createWindow.js';
import switchActionsCount from '../components/modal/switchActionsCount.js';
export default {
    type: 'container',
    styles: [
        Styles.size.fullsize,
        Styles.css({
            display: 'flex',
            flexDirection: 'column',
            fontSize: 'm',
            minHeight: '0',
            paddingRight: 'm'
        })
    ],
    components: [
        {
            type: 'container',
            class: 'top',
            styles: [
                Styles.css({
                    display: 'flex',
                    width: '100%',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                })
            ],
            datepickerStyles: [Styles.datepicker.agent.css({ width: '9rem' })],
            components: [
                {
                    type: 'container',
                    class: 'top-left',
                    styles: [
                        Styles.css({
                            display: 'flex',
                            height: 'initial',
                            gap: 'xs',
                            alignItems: 'flex-start',
                            width: '100%',
                            alignItems: 'flex-start',
                            marginBottom: 'm'
                        })
                    ],
                    buttongroupStyles: [Styles.buttonGroupStylesWithBgCap],
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '区域：',
                            icon: 'earth-asia',
                            valueKey: 'regionId',
                            dataWatcher: 'regionList',
                            value: null
                        },
                        {
                            type: 'buttongroup-radio',
                            icon: 'bolt',
                            cap: '电压等级',
                            defaultValue: null,
                            value: '{{bvId}}',
                            data: '{{bvList}}'
                        }
                    ]
                },
                { type: 'datepicker', value: '{{beginTime}}', max: '{{endTime}}', icon: 'calendar', cap: '时间：' },
                { type: 'datepicker', value: '{{endTime}}', min: '{{beginTime}}', cap: '-', styles: ['padding(left:0)'] },
                {
                    type: 'filterSelect',
                    styles: ['size(maxWidth:19.5rem)', 'padding(top:0;bottom:0)'],
                    childStyles: ['size(minWidth:19.5rem)', 'input.agent.border(radius:.25rem)', 'input.agent.css(height:1.8rem)', 'input.labelslot.margin(0)'],
                    valueKey: 'stId',
                    props: { cap: '变电站：', placeholder: '请选择', data: '{{stList}}', search: '{{stName}}', select: '{{stId}}', icon: 'transformer-bolt' },
                    watchers: {
                        stName(val) {
                            getSubstationList({ _model, devName: val });
                        }
                    }
                },
                {
                    type: 'button',
                    cap: '查询',
                    icon: 'search',
                    class: 'jam-cta',
                    styles: [Styles.searchBtnsStyles],
                    onclick() {
                        getTableData();
                    }
                },
                {
                    type: 'button',
                    cap: '导出',
                    icon: 'file-export',
                    styles: [Styles.searchBtnsStyles],
                    onclick() {
                        exportTableData();
                    }
                }
            ]
        },
        {
            type: 'container',
            class: 'body',
            styles: [Styles.css({ minHeight: '0%', width: '100%', flexGrow: 1, display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', position: 'relative' })],
            components: [
                {
                    type: 'tableWithPage',
                    styles: [
                        'tableWithPage.basic',
                        Styles.hover.toShowAll({ selector: '.hover' }),
                        Styles.tableStylesFixedRowGeight,
                        Styles.numberAlign,
                        Styles.css({
                            width: '100%',
                            height: 'calc(100% - 3rem)',
                            padding: 0,
                            margin: 's auto'
                        }),
                        Styles.stylesheet({
                            '.underline': {
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }
                        })
                    ],
                    props: {
                        cpageHide: {
                            pageSize: false
                        },
                        pageSizeList: [
                            { value: 15, name: '15条/页' },
                            { value: 30, name: '30条/页' },
                            { value: 50, name: '50条/页' },
                            { value: 100, name: '100条/页' }
                        ]
                    },
                    dataDef: [
                        {
                            class: 'hover',
                            key: 'regionName',
                            cap: '地区',
                            sortable: false
                        },
                        {
                            class: 'hover',
                            key: 'stName',
                            cap: '厂站',
                            sortable: false
                        },
                        {
                            class: 'hover',
                            key: 'bvName',
                            cap: '电压等级',
                            sortable: false,
                            formatter: formatterJameBv
                        },
                        {
                            class: 'hover',
                            key: 'devName',
                            cap: '开关名称',
                            sortable: false
                        },
                        {
                            class: 'underline',
                            key: 'breakBw',
                            cap: '开关变位次数',
                            sortable: false
                        },
                        {
                            class: 'underline',
                            key: 'remoteOperation',
                            cap: '远方操作次数',
                            sortable: false
                        },
                        {
                            class: 'underline',
                            key: 'brakerTripBw',
                            cap: '开关跳闸变位次数',
                            sortable: false
                        }
                    ],
                    dataWatcher: 'tableData',
                    onclick: jam.makeThrottle((e) => {
                        let target;
                        if (e.target.classList.contains('jam-td')) {
                            target = e.target;
                        } else {
                            target = jam.findParent(e.target, '.jam-td');
                        }
                        if (target) {
                            const row = target.jamtd.rowIdx;
                            const col = target.jamtd.col;
                            const rowData = _msgr.get('tableData')[row];
                            let body;
                            if (col === 5 && rowData.breakBwDetails) {
                                // 开关变位
                                body = switchActionsCount(rowData.breakBwDetails, '开关变位详情');
                            } else if (col === 6 && rowData.remoteOperationDetails) {
                                // 远方操作
                                body = switchActionsCount(rowData.remoteOperationDetails, '远方操作详情');
                            } else if (col === 7 && rowData.brakerTripBwDetails) {
                                // 开关跳闸变位
                                body = switchActionsCount(rowData.brakerTripBwDetails, '开关跳闸变位详情');
                            }
                            if (!body) return;
                            jam.renderModal('#main', body);
                            // createWindow({
                            //     title,
                            //     width: '65vw',
                            //     height: '45vh',
                            //     body,
                            //     showBtn: false
                            // });
                        }
                    }, 400)
                }
            ]
        }
    ],
    vars: {
        cpageSize: 15,
        ctotal: 0,
        cpageNo: 1
    },
    watchers: [
        {
            keys: ['cpageNo', 'cpageSize'],
            debounce: 400,
            callback: function (cpageNo, cpageSize) {
                _model.vars.cpageNo = cpageNo;
                _model.vars.cpageSize = cpageSize;
                getTableData();
            }
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
        _msgr.pub('beginTime', jam.formatDate(Date.now() - 86400000 * 7, 'yyyy-MM-dd'));
        _msgr.pub('endTime', jam.formatDate(Date.now(), 'yyyy-MM-dd'));
    },
    onafterrender: async function () {
        let regionList = await getRegionList();
        let rt = jam.clone(regionList);
        rt.unshift({
            value: null,
            name: '全部'
        });
        _msgr.pub('regionList', rt || []);
        getSubstationList({ _model });
        getBvList(_model, _msgr);
        // getTableData();
    }
};
function getTableData() {
    let params = {
        beginTime: _msgr.get('beginTime') ? _msgr.get('beginTime') + ' 00:00:00' : null,
        endTime: _msgr.get('endTime') ? _msgr.get('endTime') + ' 23:59:59' : null,
        regionId: _msgr.get('regionId') || null,
        stId: _msgr.get('stId') ? [_msgr.get('stId')] : null,
        bvId: _msgr.get('bvId') ? [_msgr.get('bvId')] : null,
        pageIndex: _model.vars.cpageNo,
        pageSize: _model.vars.cpageSize
    };
    ajaxCall('getBreakerActionInfo', {
        success(data) {
            _model.vars.ctotal = data?.pojoTotalCount || 0;
            _msgr.pub('tableData', data?.list || []);
        },
        error(error) {
            console.log(error);
        },
        params,
        useMock: false,
        type: 'post'
    });
}
function exportTableData() {
    let params = {
        beginTime: _msgr.get('beginTime') ? _msgr.get('beginTime') + ' 00:00:00' : null,
        endTime: _msgr.get('endTime') ? _msgr.get('endTime') + ' 23:59:59' : null,
        regionId: _msgr.get('regionId') || null,
        stId: _msgr.get('stId') ? [_msgr.get('stId')] : null,
        bvId: _msgr.get('bvId') ? [_msgr.get('bvId')] : null
    };
    exportExcel(urlConfig.downloadBreakerActionInfo.url, params, '开关动作次数统计.xlsx', 'POST');
}
