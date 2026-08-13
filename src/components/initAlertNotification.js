import { ajaxCall } from '../common';
import alertNotificationWindow from '../components/alertNotificationWindow';
const REFRESH_INTERVAL = 1 * 60 * 1000; // 5分钟
// const REFRESH_INTERVAL = 1000;

// 定时刷新数据
const startAlarmRefresh = () => {
    if (!window.alertNotification) return;
    alertNotification.init();
    // 立即执行一次初始化
    initAlarmSystem();
    // 设置定时器，每5分钟刷新一次
    setInterval(() => {
        console.log('定时刷新告警数据...');
        initAlarmSystem();
    }, REFRESH_INTERVAL);
};
// 初始化告警系统
const initAlarmSystem = async () => {
    try {
        // 获取告警数据
        let warnData = await getWarnData();
        if (warnData && warnData.length > 0) {
            mango.pub('alertNotificationList', { data: warnData, st: Date.now() });
        }
    } catch (error) {
        console.error('初始化告警系统失败:', error);
    }
};

function getWarnData() {
    return new Promise((resolve, reject) => {
        ajaxCall(
            'getGraphData',
            {
                success(res) {
                    resolve(res?.list ? res?.list : []);
                },
                params: {},
                useMock: false,
                type: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
                },
                error() {
                    resolve();
                },
                complete() {
                    resolve();
                }
            },
            false
        );
    });
}

export default startAlarmRefresh;
