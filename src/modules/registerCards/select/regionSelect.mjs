let _model, _msgr;
import { getRegionList } from '../../../utils/commonList.js';
export default {
    type: 'buttongroup-radio',
    cap: '区域选择',
    icon: 'earth-asia',
    styles: [Styles.buttonGroupStylesWithBgCap],
    value: '{{regionId}}',
    data: '{{regionList}}',
    onmount: function () {
        _model = this.model;
        _msgr = this.msgr;
    },
    onafterrender: async function () {
        const res = await getRegionList(_model, _msgr);
        this.msgr('page').pub('regionList', res);
    }
};
