let _model, _msgr, _this;
// import '../css/main-aux-dev.scss';
import { ajaxCall, findCol } from '../common.js';
import { createWindow } from '../components/createWindow.js';
import { exportPtrOverload } from './heavyloadTransformData.mjs';
import normalTransformLine from '../components/modal/normalTransformLine.js';
import { userInfo } from '../global.js';
const REGION_ID = userInfo.regionId;
const AREA_ID = userInfo.areaId;
const windType = ['两绕组', '三绕组'];
let pageIndex = 1,
    pageSize = 20;
export default {
    type: 'card',
    styles: [
        Styles.stylesheet({
            '.jam-td>span[slot=value]': {
                whiteSpace: 'nowrap'
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            styles: [Styles.css({ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto', postion: 'relative' })],
            components: [
                {
                    type: 'wrapper',
                    styles: ['size(width:100%)', 'css(marginBottom:0.5rem;display:flex;alignItems:center;justifyContent:flex-start;gap:0.5rem;)'],
                    components: [
                        {
                            type: 'multidropdown',
                            props: {
                                cap: '区域：',
                                value: '{{regionIdList}}',
                                searchable: true,
                                remoteSearch: true,
                                clearable: !REGION_ID,
                                disabled: !!REGION_ID,
                                searchName: 'regionDesc',
                                data: '{{regionListData}}'
                            },
                            dataUrl: {
                                urlKey: 'getRegionList',
                                debounce: 200,
                                data: {
                                    regionName: '{{regionDesc}} ?? undefined'
                                },
                                transform(res) {
                                    return res.data.filter((item) => (REGION_ID ? item.regionId == REGION_ID : true)).map((item) => ({ name: item.regionNameChn, value: item.regionId }));
                                }
                            }
                        },
                        {
                            type: 'multidropdown',
                            props: {
                                cap: '电压等级：',
                                value: '{{bvIdList}}',
                                searchable: true,
                                clearable:true,
                                data: '{{bvListData}}'
                            },
                            dataUrl: {
                                urlKey: 'getOverloadStaticsBvList',
                                debounce: 200,
                                transform(res) {
                                    return res.data.map((item) => ({ name: item.name, value: item.id }));
                                }
                            }
                        },
                        {
                            type: 'multidropdown',
                            props: {
                                cap: '厂站名称：',
                                value: '{{stIdList}}',
                                searchable: true,
                                clearable:true,
                                remoteSearch: true,
                                searchName: 'stationDesc',
                                data: '{{stationListData}}'
                            },
                            methods: {
                                fetchStationListData({ devName, regionIdList, bvIdList }) {
                                    jam.ajaxCall({
                                        urlKey: 'getSubstationList',
                                        debounce: 100,
                                        method: 'post',
                                        data: {
                                            count: 100,
                                            devName: devName ? devName : (_model.stationDesc ?? undefined),
                                            devType: ['substation'],
                                            subareaIdList: AREA_ID ? [AREA_ID] : undefined,
                                            regionIdList: REGION_ID ? [REGION_ID] : regionIdList ? regionIdList : (_model.regionIdList ?? undefined),
                                            bvIdList: bvIdList ? bvIdList : (_model.bvIdList ?? undefined)
                                        },
                                        transform(res) {
                                            _model.stIdList = [];
                                            _msgr.pub(
                                                'stationListData',
                                                res.data.map((item) => ({ name: item.stName, value: item.stId }))
                                            );
                                        }
                                    });
                                }
                            },
                            // watchers: [
                            //     {
                            //         key: 'stationDesc',
                            //         callback(val) {
                            //             nutmeg.success( val);
                            //         }
                            //     },
                            //     {
                            //         keys: ['regionIdList', 'bvIdList', 'stationDesc'],
                            //         callback() {
                            //             nutmeg.success( JSON.stringify(arguments));
                            //         }
                            //     }
                            // ],
                            watchers: {
                                stationDesc(devName) {
                                    this.fetchStationListData({ devName });
                                },
                                regionIdList(regionIdList) {
                                    this.fetchStationListData({ regionIdList });
                                },
                                bvIdList(bvIdList) {
                                    this.fetchStationListData({ bvIdList });
                                }
                            }
                        },
                        {
                            type: 'input',
                            styles: [
                                'icon.duotone',
                                Styles.input.regularStyle,
                                Styles.input.agent.css({
                                    width: '7rem',
                                    minWidth: '7rem'
                                })
                            ],
                            cap: '设备名称：',
                            placeholder: '请输入设备名称',
                            valueKey: 'devName'
                        },
                        {
                            type: 'button',
                            cap: '导出',
                            styles: ['icon.duotone', 'size(height:2.125rem)', 'css(text-wrap:nowrap;)'],
                            icon: 'arrow-down-from-line',
                            onclick() {
                                const _regionId = _msgr.get('regionId');
                                exportPtrOverload('normal', {
                                    regionIdList: REGION_ID ? [REGION_ID] : _msgr.get('regionIdList'),
                                    subareaIdList: AREA_ID ? [AREA_ID] : undefined,
                                    stIdList: _model.stIdList,
                                    bvIdList: _msgr.get('bvIdList'),
                                    devName: _msgr.get('devName')
                                });
                            }
                        }
                    ]
                },
                {
                    type: 'table',
                    startRow: 1,
                    styles: [Styles.css({ width: '99%', height: 'calc(100% - 2rem)' }), Styles.table.regularStyleNew, Styles.hover.toShowAll({ selector: '.jam-td' }), Styles.table.layout({ overflow: 'auto' }), Styles.table.fixedrowheight({ height: '2.5rem' })],
                    ref: 'table',
                    dataDef: [
                        {
                            cap: '变电站',
                            sortable: false,
                            key: 'stName'
                        },
                        {
                            cap: '设备名称',
                            sortable: false,
                            align: 'left',
                            key: 'devName'
                        },
                        {
                            cap: '绕组类型',
                            sortable: false,
                            key: 'windType'
                        },
                        {
                            cap: '电压等级',
                            sortable: false,
                            key: 'bvName'
                        },
                        {
                            cap: '额定容量',
                            styles: [Styles.indicator.cap.css({ display: 'none' })],
                            type: 'indicator',
                            unit: 'MV.A',
                            key: 'mvanom'
                        },
                        {
                            cap: '实时负荷',
                            styles: [Styles.indicator.cap.css({ display: 'none' })],
                            type: 'indicator',
                            key: 'curLoad',
                            unit: 'MW'
                        },
                        {
                            cap: '实时负载率',
                            type: 'indicator',
                            styles: [Styles.indicator.cap.css({ display: 'none' })],
                            key: 'loadRate',
                            unit: '%'
                        },
                        {
                            cap: '操作',
                            sortable: false,
                            key: 'devId',
                            formatter: function () {
                                return jame({
                                    type: 'label',
                                    cap: '负载曲线',
                                    styles: [
                                        Styles.label.css({
                                            height: '1.5rem',
                                            color: jam.ac(1.02, 1, jam.lumiO(25)),
                                            textDecoration: 'underline',
                                            borderRadius: '0.2rem',
                                            cursor: 'pointer'
                                        })
                                    ],
                                    onclick: function (e) {
                                        let target = e.target;
                                        target = findCol(target);
                                        const devName = target.col(1);
                                        const bvName = target.col(3);
                                        const devId = target.col(7);
                                        const _p = {
                                            devName,
                                            bvName,
                                            devId
                                        };
                                        console.log('_p', _p);
                                        createWindow({
                                            title: '负载曲线',
                                            width: '90vw',
                                            height: '60vh',
                                            body: normalTransformLine(_p),
                                            showBtn: false
                                        });
                                    }
                                });
                            }
                        }
                    ],
                    dataWatcher: 'normalTableData'
                },
                {
                    type: 'pagination',
                    styles: [Styles.css({ 'justify-content': 'flex-end', width: '99%!important' })],
                    props: {
                        pageNo: '{{pageNo_}}',
                        total: '{{total_}}',
                        pageSize: '{{pageSize_}}'
                    },
                    watchers: [
                        {
                            keys: ['pageNo_', 'pageSize_'],
                            callback(pageNo_, pageSize_) {
                                if (!pageNo_ || !pageSize_) return;
                                if (pageIndex === pageNo_ && pageSize === pageSize_) return;
                                pageIndex = pageNo_;
                                pageSize = pageSize_;
                                getPtrOverload();
                            }
                        }
                    ]
                }
            ]
        }
    ],
    onmount: function () {
        _this = this;
        _model = this.model;
        _msgr = this.model.msgr;
        // jam.applyAccentColor(this, 'hsl(210,100%,60%)');
    },
    vars: {
        regionIdList: REGION_ID ? [REGION_ID] : [],
        regionDesc: '',
        stationDesc: '',
        bvDesc: '',
        pageNo_: 1,
        pageSize_: 20
    },
    watchers: [
        {
            keys: ['devName', 'stIdList', 'regionIdList', 'bvIdList'],
            debounce: 200,
            callback() {
                const [devName, stIdList, regionIdList, bvIdList] = arguments;
                _model.vars.pageNo_ = 1;
                pageIndex = 1;
                getPtrOverload({ devName, stIdList, regionIdList, bvIdList });
            }
        }
    ],
    onafterrender: function () {
        setInterval(() => {
            getPtrOverload();
        }, 60000);
    }
};

function getPtrOverload({ regionIdList, stIdList, bvIdList, devName } = {}) {
    ajaxCall(
        'getPtrOverloadPage',
        {
            type: 'post',
            success(res) {
                const newData = (res?.list || res).map((item, index) => ({
                    ...item,
                    index: index + 1,
                    loadRate: Number(item.loadRate.toFixed(2)),
                    curLoad: Number(item.curLoad.toFixed(2)),
                    windType: windType[item.windType]
                }));
                if (!newData || !newData.length) _model.vars.normalTableData = [];
                _msgr.pub('normalTableData', newData);
                _msgr.pub('total_', res.pojoTotalCount);
            },
            error() {},
            uniqId: jam.genUUID(),
            params: {
                pageSize,
                pageIndex,
                status: 0,
                regionIdList: REGION_ID ? [REGION_ID] : (regionIdList ?? _msgr.get('regionIdList')),
                subareaIdList: AREA_ID ? [AREA_ID] : undefined,
                stIdList: stIdList ?? _model.stIdList,
                bvIdList: bvIdList ?? _msgr.get('bvIdList'),
                devName: devName ?? _msgr.get('devName')
            },
            useMock: false
        },
        false
    );
}
