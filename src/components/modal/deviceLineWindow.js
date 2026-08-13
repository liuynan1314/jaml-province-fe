import { ajaxCall, exportExcel } from '../../common.js';
import { urlConfig } from '../../global.js';

let _msgr = null;

const deviceWindow = (params) => {
    return {
        type: 'wrapper',
        styles: ['size.fullsize', 'padding( 0.5rem 0.5rem 1.5rem 0.5rem )', Styles.layout.flex({ direction: 'column', wrap: 'nowrap' })],
        components: [
            // {
            //     type: 'button',
            //     class: 'btn export-btn',
            //     styles: [Styles.button.regularStyle, Styles.buttonWithexportBg],
            //     onclick: function () {
            //         exportDetailTableData(params);
            //     }
            // },
            {
                type: 'chart-line',
                icon: '📈',
                cap: params.stName + ' ' + params.devName + '曲线展示',
                styles: [
                    'echarts.line.gradientBg',
                    'size.fullsize',
                    'echarts.axis.hideSplitLine',
                    Styles.echarts.legend({
                        show: true,
                        top: '0%',
                        left: '15%',
                        formatter: function (param) {
                            if (params.type !== 'dateType') {
                                param = params.time1 + '~' + params.time2;
                            }
                            return param;
                        }
                    }),
                    Styles.echarts.tooltip({
                        trigger: 'axis',
                        formatter: function (param) {
                            const hashPart = params.devName.split('#')[1] ? `#${params.devName.split('#')[1]}` : params.devName;
                            let result = `${hashPart}<br/>`;
                            if (param.length > 1) {
                                const [time, value] = param[0]?.value || [];
                                const [time1, , value1] = param[1]?.value || [];
                                result += `${param[0].seriesName}${time}<b style="margin-left:1.5rem">${value ?? '-'}</b><br/>`;
                                result += `${param[1].seriesName}${time1}<b style="margin-left:1.5rem">${value1 ?? '-'}</b><br/>`;
                            } else {
                                const [time, value] = param[0]?.value || [];
                                result += `${time}<b style="margin-left:1.5rem">${value ?? '-'}</b><br/>`;
                            }
                            return result;
                        }
                    })
                ],
                dataWatcher: 'deviceLineData'
            }
        ],
        onmount: function () {
            _msgr = this.model.msgr;
        },
        onafterrender: function () {
            getDetailTableData(params);
        }
    };
    async function getDetailTableData(params) {
        let param,
            data = [];
        let chartLine;
        if (params.type == 'dateType') {
            chartLine = [['时间', moment(params.time1).format('yyyy年MM月DD日'), moment(params.time2).format('yyyy年MM月DD日')]];
            const param1 = {
                lcId: params.ycId,
                beginTime: `${params.time1} 00:00:00`,
                endTime: `${params.time1} 23:59:59`
            };
            const param2 = {
                lcId: params.ycId,
                beginTime: `${params.time2} 00:00:00`,
                endTime: `${params.time2} 23:59:59`
            };
            try {
                const data1 = await getLineData(param1, 1);
                const data2 = await getLineData(param2, 2);
                // data = data1.map((item, i) => [item?.occurTime?.slice(10, 16) || '--:--', item?.sampleValue ?? 0, data2[i]?.sampleValue ?? 0])
                // 提取两条曲线的时间点
                const times1 = data1.map((item) => item?.occurTime?.slice(10, 16) || '--:--');
                const times2 = data2.map((item) => item?.occurTime?.slice(10, 16) || '--:--');

                // 获取所有唯一时间点并按时间排序
                const allTimes = [...new Set([...times1, ...times2])].sort((a, b) => {
                    return a.localeCompare(b); // 按时间字符串排序
                });

                // 以完整时间轴为基准，对齐两条曲线的数据
                data = allTimes.map((time) => {
                    // 查找第一条曲线对应时间点的值
                    const value1 = data1.find((item) => (item?.occurTime?.slice(10, 16) || '--:--') === time)?.sampleValue ?? null;

                    // 查找第二条曲线对应时间点的值
                    const value2 = data2.find((item) => (item?.occurTime?.slice(10, 16) || '--:--') === time)?.sampleValue ?? null;

                    return [time, value1, value2];
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            chartLine = [['时间', moment(params.time1).format('yyyy年MM月DD日')]];
            param = {
                lcId: params.ycId,
                beginTime: params.time1,
                endTime: params.time2
            };
            try {
                data = (await getLineData(param, 1)).map((item, i) => [item?.occurTime || '--:--', item?.sampleValue ?? 0]);
            } catch (error) {
                console.error(error);
            }
        }

        _msgr.pub('deviceLineData', [...chartLine, ...data]);
    }

    function getLineData(param, p) {
        return new Promise((resolve, reject) => {
            ajaxCall(
                'queryHisSample' + p,
                {
                    success(data) {
                        resolve(data);
                    },
                    error(error) {
                        reject(error);
                    },
                    params: {
                        ...param
                    },
                    useMock: false,
                    type: 'post'
                },
                false
            );
        });
    }
};

export default deviceWindow;
