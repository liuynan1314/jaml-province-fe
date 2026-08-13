let _model, _msgr;
import { getSubstationList } from '../../../utils/commonList.js';
export default {
    type: 'filterSelect',
    childStyles: [Styles.input.regularStyle, 'input.agent.css(maxWidth:10rem;minWidth:auto)', 'input.agent.border(radius:.25rem)', 'input.labelslot.margin(0)', 'padding(0)'],
    valueKey: 'stId',
    props: { cap: '变电站：', placeholder: '请选择', data: '{{stList}}', icon: 'transformer-bolt', search: '{{name}}', select: '{{stId}}' },
    watchers: [
        {
            key: 'name',
            callback: function (val) {
                getSubstationList({ _model: this.model, devName: val });
                this.msgr('page').pub('stName', val);
            },
            debounce: 200
        },
        // 兼容旧版本写法
        {
            key: 'stId@page',
            callback: function (value) {
                if (value) {
                    this.msgr.pub('stId', value);
                }
            }
        }
    ],
    onafterrender: function () {
        getSubstationList({ _model: this.model });
    }
};
