import { findResIds, getSubstationTree } from '../../../utils/commonList.js';

export function stationFilterSelect(broker = 'page', options = {}) {
    return {
        type: 'treeFilterSelect',
        class: 'filter-item',
        cap: '变电站',
        styles: ['icon.solid', 'padding(top:0;bottom:0)'],
        icon: 'transformer-bolt',
        childStyles: ['icon.solid'],
        props: { cap: '变电站', icon: 'transformer-bolt', data: '{{stTree}}', search: `{{name}}`, select: `{{stId@${broker}}}`, expandNodes: '{{expanded}}' },
        watchers: [
            {
                key: 'name',
                callback: function (value) {
                    getSubstationTree({ _model: this.model, devName: value });
                    this.msgr(broker).pub('stName', value);
                },
                debounce: 300
            },
            {
                key: `resetSearch@${broker}`,
                callback: function () {
                    this.ref('closeBtn').click();
                }
            },
            // 兼容旧版本写法
            {
                key: `stId@${broker}`,
                callback: function (value) {
                    this.msgr.pub('stId', value);
                    this.msgr.pub('expanded', findResIds(this.msgr.get('stTree'), value));
                }
            }
        ],
        onafterrender: function () {
            getSubstationTree({ _model: this.model });
        },
        ...options
    };
}

export default stationFilterSelect();
