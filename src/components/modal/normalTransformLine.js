import moment from 'moment';
import { ajaxCall, exportExcel } from '../../common.js';
import { urlConfig } from '../../global.js';

let _msgr = null;

const normalTransformLine = (params) => {
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
                cap: params.devName + ' ' + params.bvName + '负载曲线展示',
                styles: [
                    'echarts.legend(show:true;icon:rect;top:5%;itemWidth:10;itemHeight:10;)',
                    'echarts.legend.textStyle(size:14;color:#fff)',
                    'echarts.grid(top:15%;bottom:5%;left:5%;)',
                    'echarts.axis.y.nameStyle(fontSize:18px;color:#fff;fontWeight:500)',
                    'size(width:100%;height:100%;)',
                    'css(font-size:22px;)',
                    Styles.cap.text({ spacing: '3px' }),
                    Styles.echarts.axis.y({
                        max: 100,
                        name: '%'
                    })
                ],
                dataWatcher: 'lineData'
            }
        ],
        onmount: function () {
            _msgr = this.model.msgr;
        },
        onafterrender: function () {
            getEchartsData(params.devId);
        }
    };
};

function getEchartsData(devId) {
    let searchParams = {
        beginTime: globalThis.moment().format('YYYY-MM-DD 00:00:00'),
        endTime: globalThis.moment().format('YYYY-MM-DD 23:59:59'),
        devId: devId
    };
    searchParams.devId = devId;
    ajaxCall('getHisOilTempCurve', {
        type: 'post',
        success(data) {
            let lineData = [['时间', '负载率']];
            lineData = lineData.concat(
                (data?.loadRate || []).map((item) => {
                    return [item.occurTime, item.sampleValue];
                })
            );
            _msgr.pub('lineData', lineData);
        },
        params: searchParams,
        useMock: false
    });
}

export default normalTransformLine;
