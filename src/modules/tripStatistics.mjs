/**
 * 跳闸统计-卡片
 * @cap 跳闸统计-卡片
 * @icon chart-line
 * @showType card
 */

import { getDatesInMonth } from '../utils/commonList.js';
// import { getDaysInMonth, getJumpParams } from '../common.js';
let _chartModel;
let _this;
export default {
    type: 'card',
    cap: '跳闸统计',
    icon: 'power-off',
    class: 'chart-trop',
    styles: [
        'size.fullsize',
        Styles.css({
            '--jam-card-bodyslot-padding': '0.25rem 0.5rem'
        }),
        Styles.card.bodyslot.css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }),
        Styles.stylesheet({
            'jam-buttongroup': {
                position: 'absolute',
                right: 0,
                top: '-2.5rem',
                width: 'auto'
            },
            '.jam-cc-legend-on-top': {
                width: '100%',
                height: '100%',
                flex: 'auto !important'
            },
            '.jam-cc-legend-wrapper': {
                position: 'absolute'
            },
            '.jam-cc-chart-wrapper': {
                marginTop: 'l',
                height: 'calc(100% - 2rem)'
            }
        })
    ],
    components: [
        {
            type: 'tagWithLine',
            props: {
                tabs: [
                    {
                        value: 1,
                        name: '日'
                    },
                    {
                        value: 2,
                        name: '月'
                    },
                    {
                        value: 3,
                        name: '年'
                    }
                ],
                selected: 1
            },
            styles: ['tagWithLine.basic', 'css(width:100%;height:100%;)']
        }
    ],
    vars: {
        data: {
            chartData: []
        }
    },
    methods: {
        /**
         * 获取跳闸统计数据
         */
        async getTripStatisticsData(dateType) {
            const detailConf = mango.get('detailConf') || {};
            const { startDate, endDate } = getQueryDateRange(dateType);
            return await jam.ajaxCall({
                method: 'post',
                data: {
                    startTime: `${startDate} 00:00:00`,
                    endTime: `${endDate} 23:59:59`,
                    eventTypeList: [2, 13, 14, 15, 16],
                    contentNotLike: detailConf.contentNotLike ? detailConf.contentNotLike : '',
                    notLikeCon: '开关连接刀闸分开',
                    groupTimeType: dateType
                },
                urlKey: 'getTripStatistics',
                onsuccess: (res) => {
                    try {
                        const { data = [] } = res;
                        const title = ['time', '跳闸数', '恢复数'];
                        let chartData = [];

                        if (dateType === 1) {
                            const dataMap = {};
                            data.forEach((item) => {
                                if (item?.occurTime) {
                                    const hour = item.occurTime.split(' ')?.[1]?.split(':')?.[0];
                                    if (hour) {
                                        dataMap[hour] = item;
                                    }
                                }
                            });
                            const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
                            chartData = hours.map((hour) => {
                                const item = dataMap[hour];
                                return [`${hour}:00`, item?.value || 0, item?.recoverValue || 0];
                            });
                        } else if (dateType === 2) {
                            const [year, month] = startDate.split('-');
                            const dayList = getDatesInMonth(month, year);

                            const dataMap = new Map(data.map((item) => [item?.occurTime, item]));
                            chartData = dayList.map((day) => {
                                const item = dataMap.get(day);
                                return [day, item?.value || 0, item?.recoverValue || 0];
                            });
                        } else {
                            const [year] = startDate.split('-');
                            chartData = Array.from({ length: 12 }, (_, i) => {
                                const month = `${year}-${(i + 1).toString().padStart(2, '0')}`;
                                const item = data.find((item) => item?.occurTime === month);
                                return [month, item?.value || 0, item?.recoverValue || 0];
                            });
                        }
                        this.vars.data.chartData = [title, ...chartData];
                    } catch (error) {
                        console.error('获取跳闸统计数据失败:', error);
                    }
                }
            });
        }
    },
    watchers: {
        selected(dateType) {
            this.getTripStatisticsData(dateType);
        }
    },
    onafterrender: function () {
        _this = this;
        this.getTripStatisticsData(1);
    }
};

const getQueryDateRange = (type) => {
    const currDate = jam.formatDate(new Date(), 'yyyy-MM-dd');

    switch (type) {
        case 1:
            return { startDate: currDate, endDate: currDate };
        case 2:
            return {
                startDate: jam.formatDate(new Date(), 'yyyy-MM-01'),
                endDate: currDate
            };
        default:
            const currentYear = new Date().getFullYear();
            return {
                startDate: `${currentYear}-01-01`,
                endDate: `${currentYear}-12-31`
            };
    }
};
