import { mockPath, urlConfig, ALARM_TYPE } from '../../global.js';
let _model, _msgr;

export default function (_params) {
    return {
        type: 'card',
        // icon: 'compass',
        broker: 'signalDetailsWindow',
        cap: '开关动作次数详情',
        styles: [
            'with.elevation',

            Styles.card.floating({
                width: '70vw',
                height: '60vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                styles: ['size.fullsize'],
                components: [
                    {
                        type: 'tableWithPage',
                        styles: ['tableWithPage.basic', Styles.tableStyles, Styles.iconslot.css({ display: 'none' }), Styles.capslot.css({ display: 'none' }), 'size.fullsize', 'padding(0)'],
                        props: {
                            cpageHide: {
                                pageSize: true
                            },
                            pageSizeList: [
                                { value: 20, name: '20条/页' },
                                { value: 50, name: '50条/页' },
                                { value: 100, name: '100条/页' }
                            ]
                        },
                        dataDef: [
                            {
                                key: 'stId',
                                show: false
                            },
                            {
                                cap: '地区',
                                key: 'regionName',
                                sortable: false,
                                width: '10%'
                            },
                            {
                                cap: '变电站',
                                key: 'stName',
                                sortable: false,
                                width: '10%'
                            },
                            {
                                cap: '电压等级',
                                key: 'bvName',
                                sortable: false,
                                width: '10%'
                            },
                            {
                                cap: '内容',
                                key: 'content',
                                sortable: false
                            }
                        ],
                        dataUrl: {
                            method: 'POST',
                            data: jaml.var('cpageNo', 'cpageSize', function (pageIndex, pageSize) {
                                return {
                                    ..._params,
                                    pageIndex,
                                    pageSize
                                };
                            }),
                            url: urlConfig.getMonitorsDiaryManageSignalTableDateils.url,
                            mock: mockPath + urlConfig.getMonitorsDiaryManageSignalTableDateils.mock,
                            transform: (res) => {
                                _model.vars.ctotal = res.data?.pojoTotalCount || 1;
                                const _data = res?.data || [];
                                console.log('_data', _data);
                                return _data.list;
                            },

                            debounce: 200
                        }
                    }
                ]
            }
        ],
        vars: {
            ctotal: 0,
            cpageNo: 1,
            cpageSize: 20
        },
        onmount() {
            _model = this.model;
        },
        onafterrender: function (dom) {}
    };
}
