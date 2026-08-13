let _model = null;
let _msgr = null;
let _this = null;

const defectstatistics = (pageIndex = 0) => {
    return {
        type: 'wrapper',
        styles: [
            'size.fullsize',
            Styles.stylesheet({
                ':scope': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0',
                    flexWrap: 'wrap'
                },
                '.form-item': {
                    width: '49%',
                    height: '49%',
                    '.chart-bar-box': {
                        width: '100%',
                        height: '100%',
                        border: `1px solid ${jam.ac(0.99, 0.95, 0.6, jam.acLumiO(30))}`,
                        'flex-direction': 'column'
                    }
                }
            })
        ],
        components: [buildStatChartPanel('人机界面缺陷', 'defectStatChart0'), buildStatChartPanel('软/硬件缺陷', 'defectStatChart1'), buildStatChartPanel('告警信息缺陷', 'defectStatChart2'), buildStatChartPanel('其他类型缺陷', 'defectStatChart3')],
        onmount: function () {
            _this = this;
            _model = this.model;
            _msgr = this.model.msgr;
        },
        onafterrender: function () {
            loadDefectStatChart('defectStatChart0', [1], 'getSysDefectEchartsData1');
            loadDefectStatChart('defectStatChart1', [2, 3], 'getSysDefectEchartsData2');
            loadDefectStatChart('defectStatChart2', [4], 'getSysDefectEchartsData3');
            loadDefectStatChart('defectStatChart3', [5], 'getSysDefectEchartsData4');
        }
    };
};

function buildStatChartPanel(title, refKey) {
    return {
        type: 'card',
        cap: title,
        class: 'form-item',
        components: [
            // {
            //     type: 'wrapper',
            //     class: 'right-tab',
            //     styles: ['css(height:3rem)'],
            //     components: [
            //         {
            //             type: 'label',
            //             cap: title,
            //             class: 'right-title',
            //             styles: ['css(background:url(../../../../assets/images/new/title_level.png) no-repeat;bottom var(--gap) left; padding-left: 1.5rem; minWidth: 13.2rem;height: 2.25rem)']
            //         }
            //     ]
            // },

            {
                type: 'stripyBarChart',
                ref: refKey,
                props: { unit: '个' },
                styles: ['stripyBarChart.basic', 'size.fullsize'],
                vars: {
                    data: {
                        chartData: [['地区', '统计值']]
                    }
                }
            }
        ]
    };
}

function buildChartData(data) {
    const chartData = [['地区', '统计值']];
    for (const key in data) {
        chartData.push([key, data[key]]);
    }
    return chartData;
}

function loadDefectStatChart(refKey, defectTypeList, uniqId) {
    jam.ajaxCall({
        urlKey: 'getSysDefectEchartsData',
        method: 'post',
        uniqId,
        data: {
            startDate: moment().format('YYYY-MM-01'),
            endDate: moment().format('YYYY-MM-DD'),
            defectTypeList,
            regionIdList: [],
            statusList: [1, 2, 3, 4, 5],
            type: 'region'
        },
        onsuccess(res) {
            const data = res?.data || {};
            const chartRef = _this?.ref(refKey);
            if (chartRef) {
                chartRef.vars.data.chartData = buildChartData(data);
            }
        }
    });
}

export default defectstatistics;
