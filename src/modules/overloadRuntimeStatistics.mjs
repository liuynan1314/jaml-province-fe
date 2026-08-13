let selectType = 'overload';

let overData = [],
    heavyData = [],
    overValue = 0,
    heavyValue = 0;
let regionData = [];
let _bvColorData = [];
export default {
    type: 'card',
    class: '',
    icon: 'eye',
    styles: [
        'size.fullsize',
        Styles.css({
            '--jam-card-bodyslot-padding': '0.25rem 0.5rem'
        })
    ],
    components: [
        {
            type: 'label',
            icon: 'download',
            attrs: {
                title: '导出图表数据'
            },
            styles: [
                Styles.css({
                    position: 'absolute',
                    right: '0.5rem',
                    top: '0rem',
                    cursor: 'pointer'
                }),
                Styles.icon.regular
            ],
            onclick() {
                const data = this.vars.allData;
                nusp.exportArray2Excel(data, '实时重过载分类统计');
            }
        },
        {
            type: 'tagWithScalPie',
            ref: 'chartPie',
            props: {
                title: '过载总数',
                unit: '次',
                dataType: 'analog',
                valueType: 'number',
                decimalPos: 2,
                toFixed: false,
                hasTags: false,
                radius1: ['60%', '75%'],
                radius2: ['50%', '55%'],
                tabs: [
                    {
                        value: 'overload',
                        name: '过载'
                    },
                    {
                        value: 'heavyLoad',
                        name: '重载'
                    }
                ],
                data: '{{timeChartPieData}}'
            },
            colorSet: '{{bvColorData}}',
            watchers: {
                selected(value) {
                    selectType = value;
                    this.vars.timeChartPieData = {
                        chartData: selectType == 'overload' ? overData : heavyData,
                        value: selectType == 'overload' ? overValue : heavyValue
                    };
                }
            },
            styles: ['tagWithScalPie.basic', 'css(width:100%;height:100%)']
        }
    ],
    vars: {
        selected: 'overload',
        data: {
            timeChartPieData: {}
        }
    },
    methods: {
        getOverloadRuntimeStatistics(regionId) {
            let _this = this;
            const params = {
                devType: 2,
                regionId: regionId || ''
            };
            jam.ajaxCall({
                urlKey: 'getOverloadRuntimeStatistics',
                data: params,
                method: 'post',
                onsuccess(result) {
                    const { data } = result;
                    overData = [['电压等级', '过载']];
                    heavyData = [['电压等级', '重载']];
                    let _allData = [['电压等级', '过载', '重载']];
                    overValue = 0;
                    heavyValue = 0;
                    _bvColorData = [];
                    data.forEach(function (item) {
                        overValue += item.overloadCnt;
                        heavyValue += item.heavyLoadCnt;
                        overData.push([item.bvName, item.overloadCnt]);
                        heavyData.push([item.bvName, item.heavyLoadCnt]);
                        _bvColorData.push(jam.getColor(item.bvName).hex());
                        _allData.push([item.bvName, item.overloadCnt, item.heavyLoadCnt]);
                    });

                    _this.vars.bvColorData = _bvColorData;
                    _this.vars.allData = _allData;
                    _this.vars.timeChartPieData = {
                        chartData: selectType == 'overload' ? overData : heavyData,
                        value: selectType == 'overload' ? overValue : heavyValue
                    };
                }
            });
        }
    },
    onmount: function () {},
    onafterrender: function () {
        this.getOverloadRuntimeStatistics();
        mango.sub('devOverLoadParmas', (params) => {
            if (params?.regionId) {
                this.getOverloadRuntimeStatistics ? this.getOverloadRuntimeStatistics(params?.regionId || '') : '';
            }
        });
    }
};
