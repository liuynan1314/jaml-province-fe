let _model, _msgr;
// import '../css/main-aux-dev.scss';
import { ajaxCall } from '../common.js';
import { getLineChartOptions, getBarChartOptions } from '../components/chartConfig/mainAuxDevOptions.js';
let regionIdList = [];
export default {
    type: 'card',
    components: [{
        type: 'wrapper',
        class: 'main-aux-dev',
        styles: [
            'size.fullsize',
            'props(display:flex;flexDirection: column;justifyContent:space-between; alignItems: center;)',
            Styles.stylesheet({
                '.buttonList': {
                    height: '3rem'
                },
                '.chart_content': {
                    width: '100%',
                    height: 'calc(100% - 3rem)',
                    display: 'flex'
                },
                '.chart-box': {
                    width: '50%',
                    height: '100%'
                }
            })
        ],
        components: [
            {
                type: 'buttongroup-radio',
                defaultValue: 0,
                class: 'buttonList',
                valueKey: 'recordType',
                styles: [Styles.buttongroupWithCapInTop],
                data: [
                    {
                        name: '事故',
                        value: 0
                    },
                    {
                        name: '异常',
                        value: 1
                    },
                    {
                        name: '越限',
                        value: 2
                    },
                    {
                        name: '变位',
                        value: 3
                    },
                    {
                        name: '告知',
                        value: 4
                    }
                ],
                onvaluechange(val) {
                    _msgr.pub('recordType', val);
                    onRenderLineChart();
                    selectBarData();
                }
            },
            {
                type: 'wrapper',
                class: 'chart_content',
                components: [
                    {
                        type: 'wrapper',
                        class: 'linechart-box chart-box'
                    },
                    {
                        type: 'wrapper',
                        class: 'barChart-box chart-box'
                    }
                ]
            }
        ],
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
        },
        onafterrender: function () {
            onRenderLineChart();
            onRenderBarChart();
        }
    }]
};

async function onRenderLineChart() {
    const recordType = _msgr.get('recordType') || 0;
    const _data = [
        {
            month: '一月',
            lastYear: 0,
            thisYear: 0
        },
        {
            month: '二月',
            lastYear: 0,
            thisYear: 0
        },
        {
            month: '三月',
            lastYear: 0,
            thisYear: 0
        },
        {
            month: '四月',
            lastYear: 0,
            thisYear: 0
        },
        {
            month: '五月',
            lastYear: 0,
            thisYear: 0
        },
        {
            month: '六月',
            lastYear: 0,
            thisYear: 0
        },
        {
            month: '七月',
            lastYear: 0,
            thisYear: 0
        },
        {
            month: '八月',
            lastYear: 0,
            thisYear: 0
        },
        {
            month: '九月',
            lastYear: 0,
            thisYear: 0
        },
        {
            month: '十月',
            lastYear: 0,
            thisYear: 0
        },
        {
            month: '十一月',
            lastYear: 0,
            thisYear: 0
        },
        {
            month: '十二月',
            lastYear: 0,
            thisYear: 0
        }
    ];
    const fetchData = (params, uniqId) =>
        new Promise((resolve) => {
            ajaxCall(
                'getMainAuxLineData',
                {
                    success: resolve, // 直接将 resolve 作为 success 回调
                    params,
                    uniqId,
                    useMock: false,
                    type: 'post',
                    timeout: 20
                },
                false
            );
        });
    try {
        // 请求去年数据
        const lastYearData = await fetchData(
            {
                startTime: moment().subtract(1, 'years').format('YYYY-01-01 00:00:00'),
                endTime: moment().subtract(1, 'years').format('YYYY-12-31 23:59:59'),
                groupTimeType: 7,
                recordType
            },
            'lastYearData'
        );

        lastYearData.forEach((item) => {
            if (!item.occurTime) return;
            const _index = moment(item.occurTime).month();
            _data[_index].lastYear = item.list[0]?.count || 0;
        });

        // 请求今年数据
        const currentYearData = await fetchData(
            {
                startTime: moment().format('YYYY-01-01 00:00:00'),
                endTime: moment().format('YYYY-MM-DD 23:59:59'),
                groupTimeType: 7,
                recordType
            },
            'currentYearData'
        );

        currentYearData.forEach((item) => {
            if (!item.occurTime) return;
            const _index = moment(item.occurTime).month();
            _data[_index].thisYear = item.list[0]?.count || 0;
        });
    } catch (error) {
        console.error('数据请求失败', error);
    }

    const lineChart = echarts.init(document.querySelector('.linechart-box'));
    lineChart.setOption(getLineChartOptions(_data));
    window.addEventListener('resize', lineChart.resize);
    lineChart.on('click', function (params) {
        console.log('parmas', params);
        const _index = params.dataIndex || 0;
        const type = _msgr.get('recordType') || 0;
        let startTime = moment().month(_index).startOf('month').format('YYYY-MM-DD');
        let endTime = moment().month(_index).endOf('month').format('YYYY-MM-DD');
        if (params.seriesName == '去年') {
            startTime = moment().subtract(1, 'year').month(_index).startOf('month').format('YYYY-MM-DD');
            endTime = moment().subtract(1, 'year').month(_index).endOf('month').format('YYYY-MM-DD');
        }
        parent.mangoJam.update('menuData', {
            type: 'both',
            parentKey: 'statisticAnalysis_jiangsu',
            key: 'allStatisistics',
            sub: 'alarmNumStatistic_jiangsu',
            param: {
                startTime,
                endTime,
                type
            }
        });
    });
}

function onRenderBarChart() {
    ajaxCall(
        'getMainAuxBarData',
        {
            success(regionData) {
                const result = Array(5)
                    .fill()
                    .map(() => []);
                const regions = regionData.map((item) => item.regionName);
                regionIdList = regionData.map((item) => item.regionId);
                console.log('regionIdList', regionIdList);
                regionData.forEach((region) => {
                    // 初始化当前地市的计数数组 [0,0,0,0,0]
                    const countsForRegion = Array(5).fill(0);

                    // 填充当前地市的各种recordType计数
                    region.numList.forEach((item) => {
                        const type = parseInt(item.recordType);
                        if (type >= 0 && type <= 4) {
                            countsForRegion[type] = item.count;
                        }
                    });

                    // 将当前地市的各种计数添加到结果数组
                    countsForRegion.forEach((count, type) => {
                        result[type].push(count);
                    });
                });

                _msgr.pub('regionList', regions);
                _msgr.pub('regionData', result);
                selectBarData();
            },
            params: {
                startTime: moment().format('YYYY-MM-DD 00:00:00'),
                endTime: moment().format('YYYY-MM-DD 23:59:59'),
                groupType: 1
            },
            useMock: false,
            type: 'post'
        },

        false
    );
}

function selectBarData() {
    const recordType = _msgr.get('recordType') || 0;
    const regionList = _msgr.get('regionList') || [];
    const regionData = _msgr.get('regionData') || [];
    const barChart = echarts.init(document.querySelector('.barChart-box'));
    barChart.setOption(getBarChartOptions(regionData[recordType], regionList));
    window.addEventListener('resize', barChart.resize);
    barChart.on('click', function (params) {
        console.log('parmas', params);
        const _index = params.dataIndex || 0;
        const regionId = regionIdList[_index];
        const type = _msgr.get('recordType') || 0;
        parent.mangoJam.update('menuData', {
            type: 'both',
            parentKey: 'statisticAnalysis_jiangsu',
            key: 'allStatisistics',
            sub: 'alarmNumStatistic_jiangsu',
            param: {
                regionId,
                type
            }
        });
    });
}
