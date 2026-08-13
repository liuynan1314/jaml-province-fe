let _model, _msgr;
import { getBvList } from '../../../utils/commonList.js';
export default {
    type: 'buttongroup-radio',
    icon: 'bolt',
    cap: '电压等级',
    styles: [Styles.buttonGroupStylesWithBgCap],
    value: '{{bvId}}',
    data: '{{bvList}}',
    onmount: function () {
        _model = this.model;
        _msgr = this.msgr;
    },
    onafterrender: async function () {
        const res = await getBvList(_model, _msgr);
        this.msgr('page').pub('bvList', res);
    }
};
