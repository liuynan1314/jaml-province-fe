let _model, _msgr, _this;
// import '../css/main-aux-dev.scss';
import { ajaxCall } from '../common.js';
import { exportPtrOverload } from './heavyloadTransformData.mjs';
import { userInfo } from '../global.js';
const REGION_ID = userInfo.regionId;
const AREA_ID = userInfo.areaId;
const windType = ['两绕组', '三绕组'];
const { openType = '', bvName = '' } = top?.mangoJam?.get('os')?.params || {};
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
            styles: [Styles.css({ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto', postion: 'relative', paddingTop: openType === 'dialog' ? '3rem' : 0 })],
            components: [
                {
                    type: 'wrapper',
                    styles: ['size(width:100%)', 'css(display:flex;justifyContent:flex-end;alignItems:center;gap:0.5rem)'],
                    components: [
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
                            dataUrl: {
                                urlKey: 'getSubstationList',
                                debounce: 200,
                                method: 'post',
                                data: {
                                    devName: '{{stationDesc}}??undefined',
                                    count: 100,
                                    devType: ['substation'],
                                    regionIdList: REGION_ID ? [REGION_ID] : undefined,
                                    subareaIdList: AREA_ID ? [AREA_ID] : undefined
                                },
                                transform(res) {
                                    return res.data.map((item) => ({ name: item.stName, value: item.stId }));
                                }
                            }
                        },
                        {
                            type: 'input',
                            styles: ['icon.duotone', Styles.input.regularStyle],
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
                                exportPtrOverload('overload', { devName: _msgr.get('devName'), regionIdList: REGION_ID ? [REGION_ID] : undefined, subareaIdList: AREA_ID ? [AREA_ID] : undefined, stIdList: _model.stIdList ?? undefined });
                            }
                        }
                    ]
                },
                {
                    type: 'table',
                    styles: ['size.fullsize', Styles.table.regularStyleNew, Styles.hover.toShowAll({ selector: '.jam-td' }), Styles.table.layout({ overflow: 'auto' }), Styles.table.fixedrowheight({ height: '2.5rem' })],
                    ref: 'table',
                    buildIf: '{{overloadTableData}}.length>0',
                    dataDef: [
                        {
                            cap: '变电站',
                            sortable: false,
                            key: 'stName'
                        },
                        {
                            cap: '设备名称',
                            align: 'left',
                            sortable: false,
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
                            cap: '开始时间',
                            key: 'startTime',
                            formatter: function (value) {
                                return value
                                    ? jame({
                                          type: 'badge',
                                          styles: [
                                              Styles.css({
                                                  borderRadius: '0.2rem',
                                                  fontSize: '0.9rem'
                                              })
                                          ],
                                          cap: jam.formatTime(value, 'MM-dd'),
                                          content: jam.formatTime(value, 'HH:mm:ss')
                                      })
                                    : '--:--';
                            }
                        },
                        {
                            cap: '开始结束',
                            sortable: false,
                            key: 'endTime',
                            formatter: function (value) {
                                return value
                                    ? jame({
                                          type: 'badge',
                                          styles: [
                                              Styles.css({
                                                  borderRadius: '0.2rem',
                                                  fontSize: '0.9rem'
                                              })
                                          ],
                                          cap: jam.formatTime(value, 'MM-dd'),
                                          content: jam.formatTime(value, 'HH:mm:ss')
                                      })
                                    : '--:--';
                            }
                        }
                    ],
                    data: '{{overloadTableData}}'
                },
                {
                    type: 'emptyStatus',
                    buildIf: '{{overloadTableData}}.length===0',
                    props: {
                        desc: '当前无过载变压器'
                    }
                }
            ]
        }
    ],
    onmount: function () {
        _this = this;
        _model = this.model;
        _msgr = this.model.msgr;
    },
    watchers: [
        {
            keys: ['devName', 'stIdList'],
            debounce: 200,
            callback: getPtrOverload
        }
    ],
    vars: {
        stationDesc: ''
    },
    onafterrender: function () {
        jam.setInterval(() => {
            getPtrOverload();
        }, 60000);
    }
};

function getPtrOverload() {
    const params = { devName: _msgr.get('devName'), regionIdList: REGION_ID ? [REGION_ID] : undefined, subareaIdList: AREA_ID ? [AREA_ID] : undefined, stIdList: _model.stIdList ?? undefined };
    ajaxCall(
        'getPtrOverloadPage',
        {
            type: 'post',
            success(res) {
                let newData = (res?.list || res).map((item, index) => ({
                    ...item,
                    index: index + 1,
                    loadRate: Number(item.loadRate.toFixed(2)),
                    curLoad: Number(item.curLoad.toFixed(2)),
                    windType: windType[item.windType]
                }));

                if (bvName) {
                    const voltageMap = {
                        '110kV及以下': ['110kV', '35kV', '10kV', '6kV']
                    };

                    const targetVoltages = voltageMap[bvName] || [bvName];
                    newData = newData.filter((item) => targetVoltages.includes(item.bvName));
                }

                _model.vars.overloadTableData = newData;
            },
            params: { pageSize: 200, pageIndex: 1, status: 2, ...params },
            uniqId: jam.genUUID(),
            useMock: false
        },
        false
    );
}
