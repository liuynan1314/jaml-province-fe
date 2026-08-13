import { formatterJameBv, formatterJameTime, formatterJameState } from '../../common.js';
import { mockPath, urlConfig } from '../../global.js';

export default function (props) {
    let _model, _msgr;
    return {
        type: 'card',
        cap: `${props.name}数据详情`,
        styles: [
            Styles.card.floating({
                width: '80vw',
                height: '80vh'
            })
        ],
        components: [
            {
                showType: 'table',
                cap: '重过载详情-表格',
                icon: 'table',
                number: null,
                type: 'basicTable',
                title: '重过载详情-表格',
                key: 'tableWithPage-event',
                styles: [
                    'size.fullsize',
                    'padding(0)',
                    'tableWithPage.basic',
                    'cap.hide',
                    'icon.hide',
                    Styles.stylesheet({
                        '.jam-th,.jam-td': {
                            whiteSpace: 'nowrap'
                        }
                    }),
                    Styles.hover.toShowAll({ selector: '.jam-td' })
                ],
                props: {
                    dataDef: [
                        { show: false },
                        {
                            cap: '变电站',
                            key: 'stName'
                        },
                        {
                            cap: '电压等级',
                            key: 'bvName',
                            formatter: formatterJameBv
                        },
                        {
                            cap: '设备名称',
                            key: 'devName'
                        },
                        {
                            cap: '实时负载率',
                            key: 'loadRate'
                        },
                        {
                            cap: '设备重过载类型',
                            key: 'loadStatus',
                            sortable: false,
                            formatter: function (val) {
                                const _type = val == 1 ? '重载' : val == 2 ? '过载' : '--';
                                return formatterJameState(_type);
                            }
                        },
                        {
                            cap: '(重过载)起始时间',
                            key: 'startTime',
                            formatter: formatterJameTime
                        },
                        {
                            cap: '持续时间(min)',
                            key: 'totalTime',
                            formatter: function (val) {
                                return val || 0 ? Math.floor(val / 60) : '--';
                            }
                        }
                    ]
                },
                dataUrl: {
                    debounce: 300,
                    method: 'get',
                    data: {
                        devType: props.devType
                    },
                    headers: {
                        Authorization: 'Bearer ' + jam.getUrlParam('token') || ''
                    },
                    url: urlConfig.getRealOverloadRecord.url,
                    mock: mockPath + urlConfig.getRealOverloadRecord.mock,
                    transform: (res) => {
                        const data = res?.data?.filter((item) => item.loadStatus === props.loadStatus);
                        return data || [];
                    }
                }
            }
        ],
        onmount() {
            _model = this.model;
        },
        onafterrender: function (dom) {}
    };
}
