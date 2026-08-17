import { ajaxCall, getDetailConf } from '../common.js';
import { handleClickStName } from './substationIndex.mjs';
const mapConfig = getDetailConf('mapConf');
const defaultRegionName = mapConfig.defaultRegionName;
const mapLegend = getDetailConf('mapLegend');

let _model, _msgr;
export default {
    type: 'wrapper',
    styles: [
        'size.fullsize',
        'css(columnGap:1.25rem)',
        Styles.stylesheet({
            ':scope': {
                position: 'relative'
            },
            '.leftContent': {
                position: 'absolute',
                top: '0%',
                left: '0%',
                display: 'flex',
                flexDirection: 'column'
                // zIndex: 999
            },
            '.left-item': {
                display: 'flex',
                flexDirection: 'column',
                width: '9.75rem',
                height: '4.375rem',
                background: 'tint',
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, .05), transparent .4rem, transparent calc(100% - .6rem), rgba(0, 0, 0, .12))',
                border: 's solid var(--jam-color-primary-default)',
                cursor: 'pointer'
            },
            '.left-item-label': {},

            ' .container': {
                width: '11rem',
                height: ' 7.075rem',
                background: 'elevation',
                borderRadius: 'm',
                borderWidth: 's',
                borderColor: 'var(--jam-color-primary-default)'
                // background: 'url(../../assets/images/map_bullet_box.png) no-repeat',
                // backgroundSize: ' 100% 100%'
            },
            '.tittle': {
                width: '100%',
                height: ' 2rem',
                lineHeight: '2rem',
                margin: 'auto',
                backgroundSize: ' 14px 16px',
                paddingLeft: 's',
                boxSizing: ' border-box',
                backgroundPositionY: ' 15px',
                backgroundPositionX: '5px',
                background: 'tint',
                borderRadius: 's s 0 0'
            },

            '.location': {
                float: 'left',
                width: 'calc(100% - 2.8125rem)',
                fontWeight: 'bold',
                color: 'var(--jam-color-on-primary)',
                marginLeft: 'm'
            },
            '.danwei': {
                zIndex: 9999,
                color: 'var(--jam-color-on-primary)',
                float: 'left',
                width: ' 1rem',
                height: ' 100%'
            },
            '.content': {
                width: '100%',
                height: ' calc(100% - 2.5rem)',
                margin: ' 0px auto'
            },
            '.container>ul': {
                paddingInlineStart: '0 !important'
            },
            '.content>li': {
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '0 m',
                marginTop: 's !important',
                width: '100%',
                height: ' 1.25rem',
                backgroundSize: '100% 50%',
                fontSize: 's',
                fontWeight: ' bold',
                background: 'tint'
            },
            '.content>li .name': {
                fontSize: 's',
                color: 'var(--jam-color-on-primary)',
                lineHeight: '20px',
                padding: '0 xs'
            },

            '.fhbox': {
                width: 'calc(100% - 100px)'
            },

            '.blue': {
                color: 'warn',
                fontSize: 's',
                textAlign: ' right',
                fontFamily: 'DIN-Medium',
                // backgroundColor: ' hsla(201, 97%, 14%, 0.8)',
                borderRadius: 's',
                paddingRight: 's',
                width: '5rem'
            },

            '.fuhao': {
                fontSize: 's',
                color: 'var(--jam-color-fg-muted)',
                fontFamily: 'SourceHanSansCN-Regular'
            },
            '.mapLegend': {
                position: 'absolute',
                bottom: '0%',
                right: '0%',
                width: '7.55rem',
                height: '8.25rem',
                background: 'tint',
                border: 's solid var(--jam-color-primary-default)',
                display: 'flex',
                flexDirection: 'column',
                fontSize: 's',
                padding: 's'
            },
            '.mapLegend-item': {
                flex: '1'
            },
            '.tabButton': {
                position: 'absolute',
                top: '0%',
                right: '0%',
                zIndex: 999
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            class: 'leftContent',
            components: [
                {
                    type: 'wrapper',
                    class: 'left-item',
                    components: [
                        {
                            type: 'wrapper',
                            styles: [Styles.size({ width: '100%', height: '1.8rem' }), Styles.css({ padding: 's m' }), Styles.layout.flex({ justifyContent: 'space-between', alignItems: 'center' })],
                            components: [
                                {
                                    type: 'label',
                                    class: 'left-item-label',
                                    styles: [Styles.size({ height: '100%' }), Styles.label.css({ fontSize: 's' })],
                                    cap: '遥控'
                                },
                                {
                                    type: 'element',
                                    styles: [
                                        Styles.size({
                                            width: '1.875rem',
                                            height: '1.875rem'
                                        }),
                                        Styles.background({
                                            image: 'url(../assets/images/deco_map_switch.png)',
                                            size: '100% 100%',
                                            repeat: 'no-repeat'
                                        }),
                                        'props(justify-content: center;align-items: center;)'
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            styles: [Styles.css({ marginLeft: 'm' })],
                            components: [
                                {
                                    type: 'label',
                                    styles: [Styles.label.css({ fontSize: 'l', fontWeight: 'bold', fontFamily: 'DINPro' })],
                                    cap: '{{switch_remote_num}}'
                                },
                                {
                                    type: 'label',
                                    styles: [Styles.label.css({ fontSize: 's' })],
                                    cap: '个'
                                }
                                // {
                                //     type: 'element',
                                //     styles: [
                                //         Styles.size({
                                //             width: '1.875rem',
                                //             height: '1.875rem'
                                //         }),
                                //         Styles.background({
                                //             image: 'url(../assets/images/deco_map_transformer.png)',
                                //             size: '100% 100%',
                                //             repeat: 'no-repeat'
                                //         }),
                                //     ]
                                // }
                            ]
                        }
                    ],
                    onclick() {
                        rambutan.switchTo('/operation-statistics', {
                            token: jam.getUrlParam('token')
                        });
                        mango.pub('remoteOperationParams', {
                            opType: 1,
                            type: '遥控'
                        });
                    }
                },
                {
                    type: 'wrapper',
                    class: 'left-item',
                    styles: [Styles.css({ marginTop: 's' })],
                    components: [
                        {
                            type: 'wrapper',
                            styles: [Styles.size({ width: '100%', height: '1.8rem' }), Styles.css({ padding: 's m' }), Styles.layout.flex({ justifyContent: 'space-between', alignItems: 'center' })],
                            components: [
                                {
                                    type: 'label',
                                    class: 'left-item-label',
                                    styles: [Styles.size({ height: '100%' }), Styles.label.css({ fontSize: 's' })],
                                    cap: '遥调'
                                },
                                {
                                    type: 'element',
                                    styles: [
                                        Styles.size({
                                            width: '1.875rem',
                                            height: '1.875rem'
                                        }),
                                        Styles.background({
                                            image: 'url(../assets/images/deco_map_transformer.png)',
                                            size: '100% 100%',
                                            repeat: 'no-repeat'
                                        }),
                                        'props(justify-content: center;align-items: center;)'
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            styles: [Styles.css({ marginLeft: 'm' })],
                            components: [
                                {
                                    type: 'label',
                                    styles: [Styles.label.css({ fontSize: 'l', fontWeight: 'bold', fontFamily: 'DINPro' })],
                                    cap: '{{main_transformer_num}}'
                                },
                                {
                                    type: 'label',
                                    styles: [Styles.label.css({ fontSize: 's' })],
                                    cap: '个'
                                }
                            ]
                        }
                    ],
                    onclick() {
                        rambutan.switchTo('/operation-statistics', {
                            token: jam.getUrlParam('token')
                        });
                        mango.pub('remoteOperationParams', {
                            opType: 2,
                            type: '遥调'
                        });
                    }
                },
                {
                    type: 'wrapper',
                    styles: [Styles.css({ marginTop: 's' })],
                    class: 'left-item',
                    components: [
                        {
                            type: 'wrapper',
                            styles: [Styles.size({ width: '100%', height: '1.8rem' }), Styles.css({ padding: 's m' }), Styles.layout.flex({ justifyContent: 'space-between', alignItems: 'center' })],
                            components: [
                                {
                                    type: 'label',
                                    class: 'left-item-label',
                                    styles: [Styles.size({ height: '100%' }), Styles.label.css({ fontSize: 's' })],
                                    cap: '软压板投退'
                                },
                                {
                                    type: 'element',
                                    styles: [
                                        Styles.size({
                                            width: '1.875rem',
                                            height: '1.875rem'
                                        }),
                                        Styles.background({
                                            image: 'url(../assets/images/deco_map_toutui.png)',
                                            size: '100% 100%',
                                            repeat: 'no-repeat'
                                        }),
                                        'props(justify-content: center;align-items: center;)'
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            styles: [Styles.css({ marginLeft: 'm' })],
                            components: [
                                {
                                    type: 'label',
                                    styles: [Styles.label.css({ fontSize: 'l', fontWeight: 'bold', fontFamily: 'DINPro' })],
                                    cap: '{{press_plate_num}}'
                                },
                                {
                                    type: 'label',
                                    styles: [Styles.label.css({ fontSize: 's' })],
                                    cap: '个'
                                }
                            ]
                        }
                    ],
                    onclick() {
                        rambutan.switchTo('/operation-statistics', {
                            token: jam.getUrlParam('token')
                        });
                        mango.pub('remoteOperationParams', {
                            opType: 3,
                            type: '软压板投退'
                        });
                    }
                },
                {
                    type: 'wrapper',
                    styles: [Styles.css({ marginTop: 's' })],
                    class: 'left-item',
                    components: [
                        {
                            type: 'wrapper',
                            styles: [Styles.size({ width: '100%', height: '1.8rem' }), Styles.css({ padding: 's m' }), Styles.layout.flex({ justifyContent: 'space-between', alignItems: 'center' })],
                            components: [
                                {
                                    type: 'label',
                                    class: 'left-item-label',
                                    styles: [Styles.size({ height: '100%' }), Styles.label.css({ fontSize: 's' })],
                                    cap: '程序化操作'
                                },
                                {
                                    type: 'element',
                                    styles: [
                                        Styles.size({
                                            width: '1.875rem',
                                            height: '1.875rem'
                                        }),
                                        Styles.background({
                                            image: 'url(../assets/images/deco_map_control.png)',
                                            size: '100% 100%',
                                            repeat: 'no-repeat'
                                        }),
                                        'props(justify-content: center;align-items: center;)'
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'wrapper',
                            styles: [Styles.css({ marginLeft: 'm' })],
                            components: [
                                {
                                    type: 'label',
                                    styles: [Styles.label.css({ fontSize: 'l', fontWeight: 'bold', fontFamily: 'DINPro' })],
                                    cap: '{{sequential_control_num}}'
                                },
                                {
                                    type: 'label',
                                    styles: [Styles.label.css({ fontSize: 's' })],
                                    cap: '个'
                                }
                            ]
                        }
                    ],
                    onclick() {
                        rambutan.switchTo('/operation-statistics', {
                            token: jam.getUrlParam('token')
                        });
                        mango.pub('remoteOperationParams', {
                            opType: 4,
                            type: '程序化操作'
                        });
                    }
                }
            ]
        },
        {
            type: 'wrapper',
            styles: ['size.fullsize'],
            components: [
                {
                    type: 'wrapper',
                    id: 'mapContent',
                    styles: ['size.fullsize'],
                    components: [
                        {
                            type: 'ccMap',
                            class: 'map3D',
                            styles: [
                                'ccMap.basic',
                                'css(overflow: hidden;)',
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
                    props: {
                        region: defaultRegionName,
                        topLevel: 'province',
                        duration: 0
                    },
                    watchers: [
                        {
                            key: 'infoOverMapClicked',
                            callback: function (data) {
                                handleClickStName(data.id);
                            }
                        }
                    ],
                    onmount: function () {},
                    onafterrender: async function () {
                        _model = this.model;
                        _msgr = this.model.msgr;

                        const stInfo = await raspberry.request({
                            url: `assets/mockData/getMapMainData.json`
                        });
                        if (stInfo?.substationList) {
                            _model.vars.data.chartData = stInfo.substationList.map((item) => ({
                                name: item.name,
                                icon: `<img src="../../assets/images/${item.voltageLevel}.svg" style="width: 0.875rem; height: 0.875rem;">`,
                                coord: item.location,
                                id: item.id,
                                belong: item.belong
                            }));
                        }
                    }
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'mapLegend',
            components: jaml.var('mapLegend', function (mapLegend) {
                return mapLegend.map((item) => ({
                    icon: item.icon,
                    styles: [Styles.label.icon.css({ width: '0.875rem', height: '0.875rem' }), Styles.label.cap.css({ marginLeft: 'xs' })],
                    class: 'mapLegend-item',
                    type: 'label',
                    cap: item.value
                }));
            })
        }
    ],
    vars: {
        data: {},
        mapLegend: mapLegend
    },
    watchers: [{}],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        getRegionList();
        getMapLeftData();
    }
};

mango.sub('mapRegionChange', (data) => {
    jam.notify(`当前区域：${data.detail.name}`, {
        id: 'regionchange'
    });
    if (!_model.vars.mapAreaData) {
        return;
    }
    let areaId = _model.vars.mapAreaData.filter((item) => data.detail.name.includes(item.regionNameChn));
    if (areaId.length) {
        rambutan.switchTo('/substationIndex_songjian-screen', {
            token: jam.getUrlParam('token')
        });
        mango.pub('substationIndexParams', {
            regionId: areaId[0].regionId
        });
    }
});

/**
 * 获取区域列表
 */
function getRegionList() {
    ajaxCall(
        'getRegionList',
        {
            success(data) {
                _model.vars.mapAreaData = data;
            },
            params: {},
            useMock: false,
            type: 'get'
        },
        false
    );
}

function getMapLeftData() {
    ajaxCall(
        `mapLeft`,
        {
            success(res) {
                _msgr.pub('switch_remote_num', res.ykCnt ? Number(res.ykCnt).toFixed(0) : 0);
                _msgr.pub('main_transformer_num', res.ytCnt ? Number(res.ytCnt).toFixed(0) : 0);
                _msgr.pub('press_plate_num', res.ybCnt ? Number(res.ybCnt).toFixed(0) : 0);
                _msgr.pub('sequential_control_num', res.skCnt ? Number(res.skCnt).toFixed(0) : 0);
            },
            params: {
                beginDate: moment().format('YYYY-MM-DD 00:00:00'),
                endDate: moment().format('YYYY-MM-DD 23:59:59')
            },
            useMock: false,
            type: 'post'
        },
        false
    );
}
