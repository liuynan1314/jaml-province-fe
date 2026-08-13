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
                    'ccMap.basic',
                    Styles.size.fullsize,
                    Styles.echarts.map.fake3D({
                        color: Tokens.color.primary.film,
                        colorEmphasis: Tokens.color.primary.subtle,
                        borderWidth: 1,
                        borderColor: Tokens.color.primary.default,
                        colorMid: Tokens.color.primary.default,
                        colorBottom: Tokens.color.primary.default
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
