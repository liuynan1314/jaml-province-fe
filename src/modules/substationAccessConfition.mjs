import { ajaxCall } from '../common.js';
let _msgr, _model;
export default {
    type: 'card',
    icon: 'gauge-high',
    cap: '变电站通道工况统计',
    styles: [
        'size.fullsize',
        Styles.css({
            '--jam-card-bodyslot-padding': '0.25rem 0.5rem'
        }),
        Styles.stylesheet({
            '.ranking-item-container,progress': {
                cursor: 'pointer'
            }
        })
    ],
    components: [
        {
            type: 'container',
            styles: ['size.fullsize', 'css(overflow:hidden)'],
            components: [
                {
                    type: 'wrapper',
                    styles: [Styles.titleBox, Styles.css({ height: '1.5rem' })],
                    components: [
                        {
                            type: 'label',
                            cap: '{{accessTitle}}'
                        }
                    ]
                },
                {
                    type: 'regionRank',
                    props: {
                        dataType: 'string',
                        valueType: 'string',
                        title: '',
                        hasValue: false,
                        hasIcon: false,
                        hasSubtitle: false,
                        hasTitle: false
                    },
                    styles: ['regionRank.basic', 'css(width:100%;height:calc(100% - 1.6rem))'],
                    onclick(e) {
                        let parentDom = jam.closest(e.target, '.ranking-item-container');
                        let regionName = jam.findChildren(parentDom, '.ranking-item-name span[slot=cap]')?.[0]?.innerText;

                        rambutan.switchTo('/maintenance/data-quality-control-new', {
                            token: jam.getUrlParam('token')
                        });
                        mango.pub('substationAccessConfitionParams', {
                            name: regionName
                        });
                    }
                }
            ]
        }
    ],
    methods: {
        getAreaData() {
            jam.ajaxCall({
                urlKey: 'getMonitorIndexStatNew',
                method: 'post',
                data: {
                    beginTime: jam.formatTime(new Date(), 'yyyy-MM-dd 00:00:00'),
                    endTime: jam.formatTime(new Date(), 'yyyy-MM-dd 23:59:59')
                },
                onsuccess(res) {
                    const { data } = res;
                    let chartData = [];
                    data.sort((a, b) => Number(b.channel.rate * 100).toFixed(2) - Number(a.channel.rate * 100).toFixed(2));
                    data.forEach(function (item) {
                        chartData.push({
                            name: item.regionName,
                            value: Number(item.channel.rate * 100).toFixed(2)
                        });
                    });

                    let maxRate = chartData[0].value;
                    let maxRateName = chartData[0].name;
                    _msgr.pub('data', chartData);

                    _msgr.pub('accessTitle', `<div> <b style="color:${jam.colorText()}">${maxRateName}</b> 通道在线率最高，数值为 <b style="color:${jam.colorText()}">${maxRate}</b> %</div>`);
                }
            });
        }
    },
    onmount: function () {
        _msgr = this.model.msgr;
        _model = this.model;
    },
    onafterrender: async function () {
        this.getAreaData();
    }
};
