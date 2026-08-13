/**
 * 变电站规模统计-卡片
 * @cap 变电站规模统计-卡片
 * @icon square-sliders
 * @showType card
 */

import { dataNameMap } from '../global.js';
import { getDetailConf } from '../common.js';
import substationScaleListWindow from '../components/modal/substationScaleListWindow.js';

const substationScale__ = {};
const bvList = getDetailConf('levelList1') || [];
const { substationScale } = dataNameMap;
bvList.forEach((item) => {
    substationScale__[item.name] = substationScale[item.name];
});

const dataNames = [];
Object.values(substationScale__).forEach((item) => {
    dataNames.push(item.total, item.online);
});

let _model,
    _msgr = null,
    _this;
export default {
    type: 'card',
    cap: '变电站规模统计',
    icon: 'square-sliders',
    class: 'substationScale',
    styles: [
        'size.fullsize',
        Styles.css({
            '--jam-card-bodyslot-padding': '0.5rem 2.2rem 0.5rem 0'
        }),
        Styles.stylesheet({
            '[slot=unit]': {
                marginLeft: 's',
                marginTop: 's'
            },
            '[slot=value]': {
                cursor: 'pointer'
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            styles: [
                'size.fullsize',
                Styles.css({
                    display: 'grid',
                    'grid-template-columns': '1fr',
                    'grid-template-rows': 'repeat(8, minmax(0, 1fr))'
                })
            ],
            components: [
                {
                    type: 'label',
                    styles: [
                        Styles.css({
                            'grid-area': '1/1/span 1/span 1',
                            paddingLeft: 'm'
                        })
                    ],
                    class: 'auxiliary',
                    cap: jaml.var('substationInfo', (chartLeftInfo) => chartLeftInfo)
                },
                {
                    type: '2legendWithpie',
                    props: {
                        title: '总计',
                        unit: '座',
                        dataType: 'analog',
                        valueType: 'number',
                        decimalPos: 2,
                        hasSubtitle: false,
                        toFixed: false,
                        hasTags: false
                    },
                    styles: [
                        '2legendWithpie.basic',
                        Styles.css({
                            'grid-area': '2/1/span 7/span 1'
                        })
                    ],
                    onafterrender: async function () {
                        const _chart = jam.findElement(this.element, 'jam-chart');
                        await _chart.chartReady;
                        _chart.chart.on('click', (params) => {
                            const { name } = params;
                            jam.renderModal(
                                '#main',
                                substationScaleListWindow({
                                    bvName: name
                                })
                            );
                        });
                    },
                    onclick: (e) => {
                        let _el = jam.closest(e.target, '.legend');
                        if (!_el) return;
                        const bvName = _el.getAttribute('bvName');
                        let params = {};
                        if (_el.className.includes('first')) {
                            params = {
                                bvName: bvName,
                                title: '变电站列表'
                            };
                        } else if (_el.className.includes('second')) {
                            params = {
                                bvName: bvName,
                                title: '变电站列表',
                                channelStatus: 0
                            };
                        }
                        jam.renderModal('#main', substationScaleListWindow(params));
                    }
                }
            ]
        }
    ],
    vars: {
        colorList: []
    },
    onmount: async function () {
        _model = this.model;
        _msgr = this.model.msgr;
        _this = this;
        // getBvList();

        initBvData();
    }
};

function initBvData() {
    jam.ajaxCall({
        urlKey: 'getGeneralStatisticsData',
        data: {},
        onsuccess(res) {
            const { data } = res;
            if (!(data instanceof Array)) return;
            const filterData = {};
            data.forEach((dItem) => {
                const { valList = [] } = dItem || {};
                valList.forEach((item) => {
                    const { statName, resultVal } = item;
                    if (dataNames.includes(statName)) {
                        if (filterData[statName]) {
                            filterData[statName] += resultVal;
                        } else {
                            filterData[statName] = resultVal;
                        }
                    }
                });
            });
            const data__ = [];

            for (const key in substationScale__) {
                data__.push({
                    name: key,
                    value: filterData[substationScale__[key]['total']] || 0,
                    online: filterData[substationScale__[key]['online']] || 0
                });
            }
            initData(data__);
        }
    });
}

function initData(data) {
    const chartData = [['type', '总计', '在线']];
    const colorList = [];
    let _total = 0;
    data.forEach(function (item) {
        const _color = jam.getColor(item.name).hex();
        const config = substationScale__[item.name];
        if (!config) return;
        colorList.push([_color, config.offColor]);
        chartData.push([item.name, item.value, item.online]);
        _this.ref('cc').colorList = colorList;
        _total += item.value;
    });
    let maxVal = Math.max(...data.map((item) => item.value));
    let maxName = data.find((item) => item.value == maxVal).name;

    if (_total == 0) {
        _model['substationInfo'] = `<div style="color:${jam.colorText()};">
                            无变电站
                        </div>`;
    } else {
        _model['substationInfo'] = `
                <div>
                    <b style="color:${jam.colorText()}"> ${maxName} </b>变电站数量最多，总共
                    <b style="color:${jam.colorText()}"> ${maxVal} </b>座
                </div>`;
    }
    _model.vars.data = {
        title: '总计',
        id: '000',
        value: _total,
        chartData: chartData
    };
}
