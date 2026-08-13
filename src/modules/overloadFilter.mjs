import { getRegionList } from '../utils/commonList.js';
let _model,
    _msgr = null;
export default {
    type: 'container',
    styles: ['size.fullsize'],
    components: [
        {
            type: 'buttongroup-radio',
            cap: '地区:',
            defaultValue: null,
            dataWatcher: 'regionList',
            valueKey: 'regionId',
            styles: [Styles.buttonGroupStyles, Styles.size.fullwidth],
            icon: 'earth-asia',
            onvaluechange(val) {
                if (val) {
                    let index = _model.vars.regionList?.findIndex((item) => item.value == val);
                    let name = _model.vars.regionList?.[index].name;
                    mango.pub('devOverLoadParmas', {
                        name,
                        index: index - 1,
                        regionId: val
                    });
                } else {
                    mango.pub('devOverLoadParmas', {
                        name: '',
                        index: -1,
                        regionId: ''
                    });
                }
            }
        }
    ],
    watchers: [
        {
            key: 'devOverLoadArea@mango',
            callback(val) {
                let index = -1;
                if (val && val.name) {
                    _model.vars.regionId = _model.vars.regionList?.filter((item) => item.name == val.name)?.[0].value;

                    index = _model.vars.regionList?.findIndex((item) => item.name == val.name);
                } else {
                    _model.vars.regionId = null;
                }
            },
            debounce: 1000
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onunmount: function () {
        mango.pub('devOverLoadParmas', null);
    },
    onafterrender: async function () {
        const devOverLoadParmas = mango.get('devOverLoadArea');
        await getRegionList(_model, devOverLoadParmas);
    }
};
