/**
 * 厂站地图
 * @cap 厂站地图
 * @icon map-location-dot
 * @showType chart
 */

function bvLevelSvgIcon(bvName) {
    const m = String(bvName ?? '').match(/(\d+)/);
    const kv = m ? m[1] : '';
    if (!kv) {
        return 'fa-transformer-bolt';
    }
    const src = `assets/images/voltage/${kv}kV_tl.svg`;
    return `<img src="${src}" alt="${bvName}" style="width:1.5em;height:1.5em;vertical-align:middle;object-fit:contain;display:inline-block" />`;
}

let props = mango.get('detailConfig')?.mapConf?.value || {
    region: '浙江',
    topLevel: 'province',
    states: {
        '1000kV': { styles: [Styles.hover({ color: jam.getColor('1000kV').hex() })] },
        '500kV': { styles: [Styles.hover({ color: jam.getColor('500kV').hex() })] },
        '220kV': { styles: [Styles.hover({ color: jam.getColor('220kV').hex() })] },
        '110kV': { styles: [Styles.hover({ color: jam.getColor('110kV').hex() })] },
        '35kV': { styles: [Styles.hover({ color: jam.getColor('35kV').hex() })] },
        '10kV': { styles: [Styles.hover({ color: jam.getColor('10kV').hex() })] }
    }
};

let allStData = [];
export default {
    type: 'container',
    components: [
        {
            type: 'container',
            styles: [
                Styles.size.fullsize,
                'css(postion:relative;pointerEvents:auto)',
                Styles.stylesheet({
                    '.map3D .infoOverMap': {
                        display: 'flex',
                        height: 'max-content',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 's',
                        boxShadow: 'none',
                        filter: 'none',
                        '& > img': {
                            width: '4rem !important',
                            height: '4rem !important'
                        }
                    },
                    '.map3D .infoOverMap::after': {
                        width: '100%',
                        height: '100%',
                        // top: '-40%',
                        left: '0',
                        backgroundColor: 'transparent !important'
                    },
                    '.map3D .infoOverMap [slot=icon], .map3D .infoOverMap [slot=iconslot]': {
                        marginRight: 0
                    },
                    '.map3D .infoOverMap [slot=cap]': {
                        height: 'max-content',
                        paddingLeft: 0,
                        textAlign: 'end',
                        whiteSpace: 'normal',
                        fontSize: 's',
                        writingMode: 'vertical-rl',
                        textOrientation: 'upright',
                        transform: 'translateY(-80%)'
                    }
                })
            ],
            components: [
                {
                    type: 'ccMap',
                    styles: ['ccMap.basic', Styles.size.fullsize, Styles.css({ overflow: 'hidden' })],
                    plugins: [Plugins.shortcut.popGraph([{ target: '.infoOverMap', shortcuts: ['stGraph', 'onlineInfo'] }])]
                },
                {
                    type: 'wrapper',
                    class: 'map-bv-legend',
                    styles: [
                        'with.elevation',
                        'border.subtle',
                        'border.s',
                        Styles.css({
                            padding: 's',
                            width: 'fit-content',
                            height: 'fit-content',
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            gap: 's',
                            borderRadius: 'm',
                            borderColor: 'var(--jam-color-primary-film)'
                        }),
                        Styles.stylesheet({
                            '.map-bv-legend-title': {
                                width: '100%',
                                textAlign: 'center',
                                paddingBottom: 's',
                                marginBottom: 's',
                                borderBottom: 's solid var(--jam-color-primary-subtle)'
                            },
                            '.bv_item.bv_item-selected': {
                                background: 'accent'
                            }
                        })
                    ],
                    labelStyles: ['icon.regular'],
                    components: [
                        {
                            type: 'wrapper',
                            styles: [Styles.css({ display: 'flex', flexDirection: 'column', gap: 's' })],
                            components: jaml.var('bvList', function (bvList) {
                                return (bvList || []).map((item) => {
                                    return {
                                        type: 'label',
                                        icon: item.icon || bvLevelSvgIcon(item.name),
                                        cap: item.name,
                                        color: item.color,
                                        class: 'bv_item',
                                        styles: [
                                            'css(cursor:pointer)',
                                            Styles.label.hover({
                                                background: 'var(--jam-color-primary-subtle)'
                                            }),
                                            Styles.label.cap.css({ color: 'muted', fontFamily: 'DINPro', fontSize: 's' })
                                        ],
                                        onclick() {
                                            const _selectedBv = this.msgr.get('selectBv')?.value;
                                            if (_selectedBv === item.value) {
                                                this.msgr.pub('selectBv', null);
                                                jam.removeClass(this, 'bv_item-selected');
                                            } else {
                                                this.msgr.pub('selectBv', item);
                                                jam.findSiblings(this).forEach((el) => {
                                                    jam.removeClass(el, 'bv_item-selected');
                                                });
                                                jam.addClass(this, 'bv_item-selected');
                                            }
                                        }
                                    };
                                });
                            })
                        }
                    ]
                }
            ]
        }
    ],
    props: {
        ...props
    },
    vars: {
        data: {}
    },
    watchers: [
        {
            key: 'selectBv',
            callback(bv) {
                let filterData = [];
                if (bv) {
                    filterData = allStData.filter((item) => item.bvName == bv.name);
                } else {
                    filterData = allStData;
                }
                this.vars.data.chartData = dealStData(filterData);
            }
        }
    ],

    methods: {
        syncBvListFromSubstation(substationData) {
            if (!substationData?.length) {
                this.vars.bvList = [];
                return;
            }
            const allBv = this.vars._allBvList;
            if (!allBv?.length) {
                this.vars._lastSubstationData = substationData;
                return;
            }
            const bvIdSet = new Set(substationData.map((item) => item.bvId).filter(Boolean));
            this.vars.bvList = allBv.filter((item) => bvIdSet.has(item.id));
        },
        getBvList() {
            let _this = this;
            jam.ajaxCall({
                urlKey: 'getVoltageList',
                onsuccess(res) {
                    const { data } = res;
                    const bvList = (data || []).sort((a, b) => parseInt(b.name) - parseInt(a.name));
                    _this.vars._allBvList = bvList.map((item) => {
                        return {
                            ...item,
                            color: jam.getColor(item.name).hex(),
                            icon: bvLevelSvgIcon(item.name)
                        };
                    });
                    _this.syncBvListFromSubstation(_this.vars._lastSubstationData);
                }
            });
        },
        getStInfoList() {
            let _this = this;
            jam.ajaxCall({
                urlKey: 'getStInfoList',
                onsuccess(res) {
                    let data = res?.data || [];
                    allStData = data;
                    _this.vars.data.chartData = dealStData(data);
                    _this.syncBvListFromSubstation(data);
                }
            });
        }
    },
    onmount: function () {
        mango.sub('mapRegionChange', (data) => {
            jam.notify(`当前区域：${data.name}`, {
                id: 'regionchange'
            });
            mango.pub('area', data.adcode === 370000 ? 'province' : 'city');
        });
        mango.pub('area', 'province');
    },
    onafterrender: async function () {
        this.getBvList();
        this.getStInfoList();
    }
};

function dealStData(data) {
    let _res = [];
    _res = data.map((item) => ({
        name: item.name,
        icon: bvLevelSvgIcon(item.bvName),
        color: jam.getColor(item.bvName).hex(),
        coord: [item.xcoor, item.ycoor],
        id: item.id,
        graphName: item.graphName,
        state: item.bvName
    }));
    return _res;
}
