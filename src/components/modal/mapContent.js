import { getMapDataPromise } from '../../modules/mainMap.mjs';

import { ajaxCall } from '../../common.js';
let _model, _msgr;

const mapContent = (params) => {
    return {
        type: 'wrapper',
        id: 'mapContent',
        styles: ['size.fullsize'],
        components: [
            {
                type: 'ccMap',
                class: 'map3D',
                styles: [
                    Styles.size.fullsize,
                    Styles.echarts.map.fake3D({
                        color: jam.ac(1, '100%', jam.lumiO(45), 0.87),
                        colorEmphasis: jam.ac(1, 1.5, 1, 0.5),
                        borderWidth: 1,
                        borderColor: jam.ac(),
                        colorMid: jam.ac(),
                        colorBottom: jam.ac()
                    })
                ]
            }
        ],
        watchers: {},
        props: {
            region: params.defaultRegionName,
            topLevel: 'province'
        },
        vars: {
            data: {}
        },
        onmount: function () {},
        onafterrender: function () {
            _model = this.model;
            _msgr = this.model.msgr;
        }
    };
};

export default mapContent;
