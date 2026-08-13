const minRangeList = [
    {
        startLimit: 0,
        endLimit: 30
    },
    {
        startLimit: 30,
        endLimit: 60
    },
    {
        startLimit: 60,
        endLimit: 120
    },
    {
        startLimit: 120,
        endLimit: null
    }
];
let clickIndex, clickSeriesName, totalTime, areaName; //点击记录
let barOptions, _el;
let colorList = ['hsl(0, 100%, 67%)', 'hsl(45,70%,64%)'];
export default {
    type: 'card',
    class: '',
    icon: 'bolt',
    styles: ['size.fullsize', Styles.stylesheet({})],
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
                const data = this.vars.durationChartBarData;
                nusp.exportArray2Excel(data, '实时重过载时长统计');
            }
        },
        {
            type: 'groupBar',
            class: 'chart-bar',
            props: {
                unit: '',
                barWith: '20%',
                fontSize: 's',
                dataType: 'analog',
                valueType: 'number',
                decimalPos: 2,
                hasSubtitle: false,
                toFixed: false,
                hasTags: false,
                colorList: colorList,
                data: { chartData: '{{durationChartBarData}}' }
            },
            styles: ['groupBar.basic', 'css(width:100%;height:100%;)']
        }
    ],
    vars: {
        durationChartBarData: [['时间', '过载', '重载']]
    },
    onmount: function () {},
    methods: {
        getOverloadDurationStatistics(regionId) {
            let _this = this;
            const params = {
                devType: 2,
                minRangeList,
                regionId: regionId || ''
            };
            jam.ajaxCall({
                urlKey: 'getOverloadDurationStatistics',
                method: 'post',
                data: params,
                onsuccess(result) {
                    const { data } = result;
                    const xAxisData = ['0-30分钟', '30-60分钟', '60-120分钟', '120分钟及以上'];
                    let _chartData = [['时间', '过载', '重载']];
                    data?.minRangeList.forEach(function (item, index) {
                        _chartData.push([xAxisData[index], item.overCnt, item.heavyCnt]);
                    });
                    _this.vars.durationChartBarData = _chartData;
                }
            });
        }
    },
    onafterrender: async function () {
        this.getOverloadDurationStatistics();
        mango.sub('devOverLoadParmas', (params) => {
            if (params?.regionId) {
                this.getOverloadDurationStatistics ? this.getOverloadDurationStatistics(params?.regionId || '') : '';
            }
        });
    }
};
