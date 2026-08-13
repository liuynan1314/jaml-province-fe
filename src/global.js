export const mockPath = `../assets/mockData/`;
export const paramPath = `../assets/paramConfig/`;
export const confPath = `../assets/conf/`;
export const okStatus = document.location.protocol === 'file:' ? 0 : 200;
export const urlPath = (() => {
    if (NODE_ENV !== 'development') {
        return '/logsApi';
    }
    switch (BASE_ENV) {
        case 'test':
            return 'http://192.1.103.101:18090';
        case 'home':
            return 'http://10.10.1.5:18094';

        default:
            //  return 'http://192.168.201.107:18090';
            // return 'http://192.168.201.32:18090';
            // return 'http://192.168.208.153:18090';
            return 'https://172.40.193.7:8002/logsApi';
    }
})();

export const smsnotePath = (() => {
    if (NODE_ENV !== 'development') {
        return '/smsnote';
    }

    switch (BASE_ENV) {
        case 'test':
            return 'http://192.1.103.101:18090';
        case 'home':
            return 'http://10.10.1.5:18094';

        default:
            return 'https://172.40.193.7:8001/smsnote';
    }
})();

export const ospPath = (() => {
    if (NODE_ENV !== 'development') {
        return '';
    }
    switch (BASE_ENV) {
        case 'test':
            // return 'http://192.1.103.101:18081';
            return 'https://192.1.103.101:8443';
        case 'home':
            // return 'http://192.1.103.101:18081';
            return 'https://10.10.1.5:8443';
        default:
            // return '..';
            return 'https://172.40.193.7:8002';
    }
})();
export const eventPath = (() => {
    if (NODE_ENV !== 'development') {
        return 'bscsd';
    }
    switch (BASE_ENV) {
        case 'test':
            return 'http://192.1.103.101:26180';
        case 'home':
            return 'http://10.10.1.5:26180';
        default:
            return 'http://192.1.103.101:26180';
    }
})();
export const smsPath = (() => {
    if (NODE_ENV !== 'development') {
        return '../../../smsnote';
    }
    switch (BASE_ENV) {
        case 'test':
            return 'http://192.1.103.101:18082';
        default:
            // return 'http://192.1.103.101:18082';
            // return 'http://192.168.208.153:18082';
            return 'https://172.40.193.7:8001/smsnote';
    }
})();

export const provincePath = (() => {
    if (NODE_ENV !== 'development') {
        return '/provinceApi';
    }
    switch (BASE_ENV) {
        case 'test':
            return 'http://192.1.103.101:18090';
        case 'home':
            return 'http://10.10.1.5:18090';
        default:
            return 'https://172.40.193.7:8002/provinceApi';
    }
})();

export const overloadPath = (() => {
    if (NODE_ENV !== 'development') {
        return '/overload';
    }
    switch (NODE_ENV) {
        case 'test':
            return 'http://192.1.103.101:18090';
        case 'home':
            return 'http://172.41.1.3:18094';

        default:
            //  return 'http://192.168.201.107:18090';
            // return 'http://192.168.201.32:18090';
            // return 'http://192.168.208.153:18090';
            return 'http://192.1.103.101:18091';
    }
})();

export const regionPath = (() => {
    if (NODE_ENV !== 'development') {
        return '/bizc';
    }
    switch (NODE_ENV) {
        case 'test':
            return 'http://192.1.103.101:18090';
        case 'home':
            return 'http://172.41.1.3:18094';

        default:
            return 'https://172.40.193.7:8001/bizc';
    }
})();
export function findCol(currentNode) {
    if (currentNode && currentNode?.col) {
        return currentNode;
    } else {
        currentNode = jam.findParent(currentNode);
        return findCol(currentNode);
    }
}
export const authPath = (() => {
    if (NODE_ENV !== 'development') {
        return 'auth-system-back';
    }
    switch (BASE_ENV) {
        case 'test':
            return 'http://192.1.103.101:28088';
        case 'home':
            return 'http://10.10.1.5:28088';
        default:
            return '..';
    }
})();

export const urlConfig = {
    getMenuColor: {
        url: urlPath + '/monitor/common/getMenuColor',
        mock: 'getMenuColor.json'
    },
    queryRcBranchRegionStatistics: {
        url: urlPath + '/v1/ccs/op/rcBranch/queryRcBranchRegionStatistics',
        mock: 'queryRcBranchRegionStatistics.json'
    },
    queryRcBranchStatusDayStatistics: {
        url: urlPath + '/v1/ccs/op/rcBranch/queryRcBranchStatusDayStatistics',
        mock: 'queryRcBranchStatusDayStatistics.json'
    },
    queryRcBranchStatusDayDetail: {
        url: urlPath + '/v1/ccs/op/rcBranch/queryRcBranchStatusDayDetail',
        mock: 'queryRcBranchStatusDayDetail.json'
    },
    exportRcBranchStatusDayDetail: {
        url: urlPath + '/v1/ccs/op/rcBranch/exportRcBranchStatusDayDetail',
    },
    queryRcBranchAbnormalDetail: {
        url: urlPath + '/v1/ccs/op/rcBranch/queryRcBranchAbnormalDetail',
        mock: 'queryRcBranchAbnormalDetail.json'
    },
    exportRcBranchAbnormalDetail: {
        url: urlPath + '/v1/ccs/op/rcBranch/exportRcBranchAbnormalDetail'
    },
    exportRcBranchStatusDayStatistics: {
        url: urlPath + '/v1/ccs/op/rcBranch/exportRcBranchStatusDayStatistics',
    },
    getRegionList: {
        url: urlPath + '/v1/ccs/op/model/getRegionList',
        mock: 'getRegionList.json'
    },
    getOspMenu: {
        url: ospPath + '/v1/ccs/per-service/platform/menu',
        mock: 'getOspMenu.json'
    },
    getUserInfo: {
        url: ospPath + '/v1/ccs/per-service/platform/user-info',
        mock: 'getUserInfo.json'
    },
    userLogout: {
        url: ospPath + '/v1/ccs/auth-service/oauth/cancel_token'
    },
    logout: {
        url: ospPath + '/ospApi/jkportal/rest/mData/logout'
    },
    queryTripDetail: {
        url: urlPath + '/dzServer/comparision/getDataForHdr',
        mock: 'getDataForHdr.json'
    },
    hdrFileDownload: {
        url: urlPath + '/dzServer/comparision/FileListDownload'
    },
    faultFileNameList: {
        url: urlPath + '/dzServer/comparision/FaultFileNameList'
    },
    queryDevHisSample: {
        url: urlPath + '/v1/ccs/op/sample/queryDevHisSample',
        mock: 'queryDevHisSample.json'
    },
    queryDevSampleRealList: {
        url: urlPath + '/v1/ccs/op/sample/queryDevSampleRealList',
        mock: 'queryDevSampleRealList.json'
    },
    getOverLimitRegionStatics: {
        url: urlPath + '/v1/ccs/op/overLimit/getOverLimitRegionStatics',
        mock: 'getOverLimitRegionStatics.json'
    },
    exportOverLimitDevStatics: {
        url: urlPath + '/v1/ccs/op/overLimit/exportOverLimitDevStatics'
    },
    getOverLimitDevStatics: {
        url: urlPath + '/v1/ccs/op/overLimit/getOverLimitDevStatics',
        mock: 'getOverLimitDevStatics.json'
    },
    getOverLimitDetail: {
        url: urlPath + '/v1/ccs/op/overLimit/getOverLimitDetail',
        mock: 'getOverLimitDetail.json'
    },
    getMenuInfo_EventType: {
        // 监控事件等级
        url: urlPath + '/v1/ccs/op/model/getMenuInfo',
        mock: 'getMenuInfo_EventType.json'
    },
    getWeatherData: {
        url: urlPath + '/v1/ccs/op/weather/getSubAreaWeatherInfoByAreaId',
        mock: 'getWeatherData.json'
    },
    locateDevice: {
        url: urlPath + '/v1/ccs/op/zxLinkage/locateDevice'
    },
    exportEventDateToPdf: {
        url: urlPath + '/v1/ccs/op/event/exportEventDateToPdf'
    },
    getEventDetails: {
        url: urlPath + '/v1/ccs/op/event/getEventDetails',
        mock: 'getEventDetails.json'
    },
    getParamFileNameAndPath: {
        url: urlPath + '/v1/ccs/op/event/getParamFileNameAndPath',
        mock: 'getParamFileNameAndPath.json'
    },
    updEventRelayHisUploadRecord: {
        url: urlPath + '/v1/ccs/op/event/updEventRelayHisUploadRecord',
        mock: 'updEventRelayHisUploadRecord.json'
    },
    getEventRelayHisUploadRecordData: {
        url: urlPath + '/v1/ccs/op/event/getEventRelayHisUploadRecordData',
        mock: 'getEventRelayHisUploadRecordData.json'
    },
    exportEventByParam: {
        // 事件化导出
        url: urlPath + '/v1/ccs/op/event/exportEventByParam'
    },
    getEventTypeConfData: {
        url: urlPath + '/v1/ccs/op/event/getEventTypeConfData',
        mock: 'getEventTypeConfData.json'
    },
    getEventRegionData: {
        url: urlPath + '/v1/ccs/op/event/getEventRegionData',
        mock: 'getEventRegionData.json'
    },
    getEventLevelStatData: {
        url: urlPath + '/v1/ccs/op/event/getEventLevelStatData',
        mock: 'getEventLevelStatData.json'
    },
    getEventAnalyseData: {
        url: urlPath + '/v1/ccs/op/event/getEventAnalyseData',
        mock: 'getEventAnalyseData.json'
    },
    querySystemRunDetail: {
        url: urlPath + '/v1/ccs/op/systemStatus/querySystemRunDetail',
        mock: 'querySystemRunDetail.json'
    },
    querySystemRunDetailStatistics: {
        url: urlPath + '/v1/ccs/op/systemStatus/querySystemRunDetailStatistics',
        mock: 'querySystemRunDetailStatistics.json'
    },
    exportSystemRunDetail: {
        url: urlPath + '/v1/ccs/op/systemStatus/exportSystemRunDetail'
    },
    getJkSynthEventAlarm: {
        url: urlPath + '/v1/ccs/op/event/getJkSynthEventAlarm',
        mock: 'getJkSynthEventAlarm.json'
    },
    getDailyData: {
        // url: urlPath + '/v1/ccs/op/event/getJkSynthEventAlarm',
        mock: 'getDailyData.json'
    },
    exportEventInfo: {
        url: urlPath + '/v1/ccs/op/event/exportEventInfo',
        mock: 'exportEventInfo.json'
    },
    getDropByType: {
        url: urlPath + '/v1/ccs/op/custom/getDropByType',
        mock: 'getDropByType.json'
    },
    getJsTDeviceData: {
        url: urlPath + '/v1/ccs/op/custom/getJsTDeviceData',
        mock: 'getJsTDeviceData.json'
    },
    getJsTDeviceRegionNum: {
        url: urlPath + '/v1/ccs/op/custom/getJsTDeviceRegionNum',
        mock: 'getJsTDeviceRegionNum.json'
    },
    exportJsTDeviceData: {
        url: urlPath + '/v1/ccs/op/custom/exportJsTDeviceData'
    },
    saveCaseTableData: {
        url: urlPath + '/v1/ccs/op/custom/saveCaseTableData'
    },
    exportCaseTableData: {
        url: urlPath + '/v1/ccs/op/custom/exportCaseTableData'
    },
    getRelationDevAreaNum: {
        url: urlPath + '/v1/ccs/op/custom/getRelationDevAreaNum',
        mock: 'getRelationDevAreaNum.json'
    },
    getRelationDevAreaData: {
        url: urlPath + '/v1/ccs/op/custom/getRelationDevAreaData',
        mock: 'getRelationDevAreaData.json'
    },
    exportRelationDevAreaData: {
        url: urlPath + '/v1/ccs/op/custom/exportRelationDevAreaData',
        mock: 'getRelationDevAreaData.json'
    },
    runReactiveDevPush: {
        url: urlPath + '/reactive/runReactiveDevPush',
        mock: 'runReactiveDevPush.json'
    },
    getReactiveDevStatList: {
        url: urlPath + '/reactive/getReactiveDevStatList',
        mock: 'getReactiveDevStatList.json'
    },
    getDevTypeConf: {
        url: urlPath + '/v1/ccs/op/custom/getDevTypeConf',
        mock: 'getRelationDevAreaNum.json'
    },
    getTracemanageAlarmData: {
        url: urlPath + '/v1/ccs/op/custom/getTracemanageAlarmData',
        mock: 'getTracemanageAlarmData.json'
    },
    getTracemanageAlarmRegionNum: {
        url: urlPath + '/v1/ccs/op/custom/getTracemanageAlarmRegionNum',
        mock: 'getTracemanageAlarmRegionNum.json'
    },
    exportTracemanageAlarmData: {
        url: urlPath + '/v1/ccs/op/custom/exportTracemanageAlarmData',
        mock: 'getTracemanageAlarmData.json'
    },
    onSendMessage: {
        url: smsnotePath + '/v/sms/outbox/add'
    },
    getAddressBookList: {
        url: smsnotePath + '/v/personnel/addressBook/list',
        mock: 'getAddressBookList.json'
    },
    getBvList: {
        url: urlPath + '/v1/ccs/op/overload/getOverloadStaticsBvList',
        mock: 'getOverloadStaticsBvList.json'
    },
    getUserTypeList: {
        url: mockPath + 'getUserTypeList.json'
    },
    getEarlyWarningOverview: {
        // GET
        // ## 获取预警总览
        // url: urlPath + `/v1/ccs/op/earlyWarning/province/getEarlyWarningOverview`,
        url: mockPath + 'getEarlyWarningOverview.json'
    },
    exportPtrOverload: {
        url: urlPath + '/v1/ccs/op/overload/new/exportPtrOverload'
    },
    getRegionCnt: {
        // POST
        // ## 获取预警区域统计-chart
        url: urlPath + `/v1/ccs/op/earlyWarning/province/getRegionCnt`,
        mock: 'getRegionCnt.json'
    },
    getEarlyWarningRecord: {
        // POST
        // ## 获取预警记录 -list
        url: urlPath + `/v1/ccs/op/earlyWarning/province/getEarlyWarningRecord`,
        mock: 'getEarlyWarningRecord.json'
    },
    exportEarlyWarningRecord: {
        // POST
        // ## 导出预警记录
        url: urlPath + `/v1/ccs/op/earlyWarning/province/exportEarlyWarningRecord`,
        mock: 'exportEarlyWarningRecord.json'
    },
    getWarnDevSample: {
        // POST
        // ## 弹框曲线-预警设备采样数据
        url: urlPath + `/v1/ccs/op/earlyWarning/province/getWarnDevSample`,
        mock: 'getWarnDevSample.json'
    },
    getWarnDetailInfo: {
        // POST
        // ## 弹框告警-五类告警查询接口
        url: urlPath + `/v1/ccs/op/warn/getWarnDetailInfo`,
        mock: 'getWarnDetailInfo.json'
    },
    getHisOilTempCurve: {
        url: urlPath + '/v1/ccs/op/oilTemp/getHisOilTempCurve',
        mock: 'getHisOilTempCurve.json'
    },
    getPtrOverload: {
        url: urlPath + '/v1/ccs/op/overload/new/getPtrOverload',
        mock: 'getPtrOverload.json'
    },
    getOverloadStaticsBvList: {
        url: urlPath + '/v1/ccs/op/overload/getOverloadStaticsBvList',
        mock: 'getOverloadStaticsBvList.json'
    },
    getOverloadTrendStatistics: {
        url: urlPath + '/v1/ccs/op/overload/new/getOverLoadMonthTrend',
        mock: 'getOverloadTrendStatistics.json'
    },
    getOverloadDurationStatistics: {
        url: urlPath + '/v1/ccs/op/overload/new/getOverloadDuration',
        mock: 'getOverloadDurationStatistics.json'
    },
    getOverloadRuntimeStatistics: {
        url: urlPath + '/v1/ccs/op/overload/new/getOverloadBvStatistics',
        mock: 'getOverloadRuntimeStatistics.json'
    },
    getOverloadDetail: {
        url: urlPath + '/v1/ccs/op/overload/new/getRealOverloadRecord',
        mock: 'getOverloadDetail.json'
    },
    getRespList: {
        // 责任区下拉框
        url: urlPath + '/v1/ccs/op/ptrTransfer/getRespList',
        mock: 'getRespList.json'
    },
    queryRealLoadSd: {
        // 设备重过载详情表格
        url: urlPath + '/v1/ccs/op/overload/new/queryRealLoadSd',
        mock: 'queryRealLoadSd.json'
    },
    getSubstationList: {
        url: urlPath + '/v1/ccs/op/model/getJkDevInfoByRetrieval',
        mock: 'getSubstationList.json'
    },
    getAutoSysTableData: {
        url: urlPath + '/v1/ccs/op/systemStatus/getKeywordData',
        mock: 'getAutoSysTableData.json'
    },
    getAutoSysChartData: {
        url: urlPath + '/v1/ccs/op/systemStatus/getKeywordStatData',
        mock: 'getAutoSysChartData.json'
    },
    exportAutoSysChartData: {
        url: urlPath + '/v1/ccs/op/systemStatus/exportKeywordData'
        // mock: 'getPowerOutageList.json'
    },
    getPowerOutageList: {
        url: urlPath + '/getPowerOutageList',
        mock: 'getPowerOutageList.json'
    },
    getRegionIdOriginLineData: {
        url: urlPath + '/v1/ccs/op/warn/getRegionIdOriginLineData',
        mock: 'getOilTempRegionCnt.json'
    },
    getEventDataByEventLevel: {
        url: urlPath + '/v1/ccs/op/event/getEventDataByEventLevel',
        mock: 'getEventDataByEventLevel.json'
    },
    getMonitorIndexStatAll: {
        url: urlPath + '/v1/ccs/op/work/getMonitorIndexStatAll',
        mock: 'getMonitorIndexStatAll.json'
    },
    getTripStatistics: {
        url: urlPath + '/v1/ccs/op/event/getEventDataByParam',
        mock: 'getTripStatistics.json'
    },
    getPtrOverloadPage: {
        url: urlPath + '/v1/ccs/op/overload/new/getPtrOverloadPage',
        mock: 'getPtrOverloadPage.json'
    },
    sendMail: {
        url: urlPath + '/v1/ccs/op/earlyWarning/province/sendMail',
        mock: 'getPtrOverloadPage.json'
    },
    getFireMonitorRegionStatistic: {
        url: urlPath + '/v1/ccs/op/fireOnline/getFireMonitorRegionStatistic',
        mock: 'getFireMonitorRegionStatistic.json'
    },
    getOnlineMonitorRegionStatistic: {
        url: urlPath + '/v1/ccs/op/fireOnline/getOnlineMonitorRegionStatistic',
        mock: 'getOnlineMonitorRegionStatistic.json'
    },
    getOverloadRegionStatistics: {
        url: provincePath + '/v1/ccs/op/overload/new/getOverloadRegionStatistics',
        mock: 'getOverloadRegionStatistics.json'
    },

    defectStatistics: {
        url: urlPath + '/monitors/log/defectLogStatics',
        mock: 'defectStatistics.json'
    },
    getOriginBvConf: {
        url: urlPath + '/v1/ccs/op/warn/getOriginBvConf',
        mock: 'getOriginBvConf.json'
    },
    getBvOriginLineData: {
        url: urlPath + '/v1/ccs/op/warn/getBvOriginLineData',
        mock: 'getOilTempBvCnt.json'
    },
    getTypeOriginLineData: {
        url: urlPath + '/v1/ccs/op/warn/getTypeOriginLineData',
        mock: 'getTypeOriginLineData.json'
    },
    getOriginLineData: {
        url: urlPath + '/v1/ccs/op/warn/getOriginLineData',
        mock: 'queryBusPowerLossStatistics.json'
    },
    exportOriginLineData: {
        url: urlPath + '/v1/ccs/op/warn/exportOriginLineData',
        mock: 'queryBusPowerLossStatistics.json'
    },
    getIndexData: {
        url: urlPath + '/v1/ccs/op/event/getIndexData',
        mock: 'querySysAppStatus.json'
    },
    getMainAuxLineData: {
        url: urlPath + '/v1/ccs/op/warn/alarm/getAlarmNumListGroupTime',
        mock: 'getMainAuxLineData.json'
    },
    getMainAuxBarData: {
        url: urlPath + '/v1/ccs/op/warn/numList',
        mock: 'getMainAuxBarData.json'
    },
    getImportUserNumData: {
        url: mockPath + 'getImportUserNum.json'
    },
    getBusPowerLossRegionStatistics: {
        url: urlPath + '/v1/ccs/op/overLimit/getBusPowerLossRegionStatistics',
        mock: 'getBusPowerLossRegionStatistics.json'
    },
    queryBusPowerLossStatistics: {
        url: urlPath + '/v1/ccs/op/overLimit/queryBusPowerLossStatistics',
        mock: 'queryBusPowerLossStatistics.json'
    },
    queryBusPowerLossRecord: {
        url: urlPath + '/v1/ccs/op/overLimit/queryBusPowerLossRecord',
        mock: 'queryBusPowerLossRecord.json'
    },
    exportBusPowerLoss: {
        url: urlPath + '/v1/ccs/op/overLimit/exportBusPowerLoss',
        mock: 'exportBusPowerLoss.json'
    },
    getRemoteInspectionChartData: {
        url: urlPath + '/v1/ccs/op/overLimit/getRemoteInspectionChartData',
        mock: 'getRemoteInspectionChartData.json'
    },
    getRemoteInspectionRateData: {
        url: urlPath + '/v1/ccs/op/getRemoteInspectionRateData',
        mock: 'getRemoteInspectionRateData.json'
    },
    getRemoteInspectionInfoBarData: {
        url: urlPath + '/v1/ccs/op/getRemoteInspectionInfoBarData',
        mock: 'getRemoteInspectionInfoBarData.json'
    },
    getRemoteInspectionInfoPieData: {
        url: urlPath + '/v1/ccs/op/getRemoteInspectionInfoPieData',
        mock: 'getRemoteInspectionInfoPieData.json'
    },
    getDevLoadRate: {
        url: urlPath + '/v1/ccs/op/loadRate/getDevLoadRate',
        mock: 'getDevLoadRate.json'
    },
    getDevLoadRateIntraday: {
        url: urlPath + '/v1/ccs/op/loadRate/getDevLoadRateIntraday',
        mock: 'getDeviceLoadRate.json'
    },
    getDevLoadRateTh: {
        url: urlPath + '/v1/ccs/op/loadRate/getDevLoadRateTh',
        mock: 'getDeviceLoadRate.json'
    },
    queryMonitorsDiaryCtrl: {
        url: urlPath + '/v1/ccs/op/remoteOperation/getRemoteOpRecord',
        mock: 'queryMonitorsDiaryCtrl.json'
    },
    exportRemoteOpRecord: {
        url: urlPath + '/v1/ccs/op/remoteOperation/exportRemoteOpRecord'
    },
    getRemoteOpRegionCnt: {
        url: urlPath + '/v1/ccs/op/remoteOperation/getRemoteOpRegionCnt',
        mock: 'getRemoteOpRegionCnt.json'
    },
    getMonitorsDiaryManageGroupData: {
        url: urlPath + '/monitors/diary/getMonitorsDiaryManageGroupData',
        mock: 'getMonitorsDiaryManageGroupData.json'
    },
    getMonitorsDiaryManageSignalTable: {
        url: urlPath + '/monitors/diary/getMonitorsDiaryManageSignalTable',
        mock: 'getMonitorsDiaryManageSignalTable.json'
    },
    getMonitorsDiaryManageSignalTableDateils: {
        url: urlPath + '/monitors/diary/getMonitorsDiaryManageSignalTableDateils',
        mock: 'getMonitorsDiaryManageSignalTableDateils.json'
    },
    exportMonitorsDiaryManageSignalTable: {
        url: urlPath + '/monitors/diary/exportMonitorsDiaryManageSignalTable'
    },
    queryHisSample1: {
        url: urlPath + '/v1/ccs/op/overload/new/queryHisSample',
        mock: 'queryHisSample1.json'
    },
    queryHisSample2: {
        url: urlPath + '/v1/ccs/op/overload/new/queryHisSample',
        mock: 'queryHisSample2.json'
    },
    exportDevLoadRateTh: {
        url: urlPath + '/v1/ccs/op/loadRate/exportDevLoadRateTh'
        // mock: 'getDeviceLoadRate.json'
    },
    exportDevLoadRateIntraday: {
        url: urlPath + '/v1/ccs/op/loadRate/exportDevLoadRateIntraday'
        // mock: 'getDeviceLoadRate.json'
    },
    exportDevLoadRate: {
        url: urlPath + '/v1/ccs/op/loadRate/exportDevLoadRate'
        // mock: 'getDeviceLoadRate.json'
    },
    getSysDefectTableData: {
        //系统缺陷管理表格
        url: urlPath + '/v1/ccs/op/sysOpsRecord/record/page',
        mock: 'getSysDefectTableData.json'
    },
    getRecordCount: {
        // 运维记录统计接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/record/count',
        mock: 'getRecordCount.json'
    },
    getUserSync: {
        // 同步接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/user/sync',
        mock: 'getUserAdd.json'
    },
    getDevScale: {
        //设备规模
        url: urlPath + '/v1/ccs/op/model/getDevScale',
        mock: 'getDevScale.json'
    },
    getSysDefectEchartsData: {
        //系统缺陷管理表格
        url: urlPath + '/v1/ccs/op/sysOpsRecord/defect/stat',
        mock: 'getSysDefectEchartsData.json'
    },
    getSysDefectEchartsData2: {
        //系统缺陷管理表格
        url: urlPath + '/v1/ccs/op/sysOpsRecord/defect/stat',
        mock: 'getSysDefectEchartsData.json'
    },
    getUserPage: {
        // 运维人员列表接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/user/page',
        mock: 'getUserPage.json'
    },
    getUserListData: {
        // 运维人员下拉框接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/user/list',
        mock: 'getUserListData.json'
    },
    getUserAdd: {
        // 运维人员新增接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/user/add',
        mock: 'getUserAdd.json'
    },
    getUserDetail: {
        // 运维人员详情接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/user/detail',
        mock: 'getUserDetail.json'
    },
    getUserUpdate: {
        // 运维人员修改接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/user/update',
        mock: 'getUserUpdate.json'
    },
    getUserDelete: {
        // 运维人员删除接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/user/delete',
        mock: 'getUserDelete.json'
    },
    getRecordPage: {
        // 运维记录列表接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/record/page',
        mock: 'getRecordPage.json'
    },
    getRecordConfig: {
        url: paramPath + '/recordConfig.json',
        mock: paramPath + 'recordConfig.json'
    },
    getRecordDetail: {
        // 运维记录详情接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/record/detail',
        mock: 'getRecordDetail.json'
    },
    getRecordAdd: {
        // 运维记录新增接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/record/add',
        mock: 'getRecordAdd.json'
    },
    getRecordUpdate: {
        // 运维记录修改接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/record/update',
        mock: 'getRecordUpdate.json'
    },
    getRecordDelete: {
        // 运维记录删除接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/record/delete',
        mock: 'getRecordDelete.json'
    },
    getRecordCommand: {
        // 运维记录命令接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/record/command',
        mock: 'getRecordCommand.json'
    },
    getDefectPage: {
        // 缺陷列表接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/defect/page',
        mock: 'getDefectPage.json'
    },
    getFileUpload: {
        // 文件上传接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/file/upload',
        mock: 'getFileUpload.json'
    },
    getFileDownload: {
        url: urlPath + '/v1/ccs/op/sysOpsRecord/file/download'
        // mock: 'getRecordDelete.json'
    },

    getIscUser: {
        // 获取负责人数据
        url: smsnotePath + '/v/personnel/addressBook/getIscUser',
        mock: 'getIscUser.json'
    },

    getLogPage: {
        // 日志列表接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/log/page'
        // mock: 'getLogPage.json'
    },

    getLogDetail: {
        // 日志详情接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/log/detail',
        mock: 'getLogDetail.json'
    },
    getLogAdd: {
        // 日志新增接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/log/add',
        mock: 'getLogAdd.json'
    },
    getLogUpdate: {
        // 日志修改接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/log/update',
        mock: 'getLogUpdate.json'
    },
    getLogDelete: {
        // 日志删除接口
        url: urlPath + '/v1/ccs/op/sysOpsRecord/log/delete'
    },
    getImportantActivityData: {
        // 重要活动保电-
        url: urlPath + '/v1/ccs/op/diff/province/queryPowerProtectScene',
        mock: 'getImportantActivityData.json'
    },
    getLoadLimitData: {
        // 获取越线信息数据
        url: urlPath + '/v1/ccs/op/overload/new/queryOverloadRateRangeCnt',
        mock: 'getLoadLimitData.json'
    },
    getImportDeviceNumData: {
        // 重大保电场景 --- 查询重要设备数量统计
        url: urlPath + '/v1/ccs/op/diff/province/queryImportantDevCnt',
        mock: 'getImportDeviceNumData.json'
    },
    queryPowerProtectScene: {
        url: urlPath + '/v1/ccs/op/diff/province/queryPowerProtectScene',
        mock: 'queryPowerProtectScene.json'
    },
    editPowerProtectScene: {
        url: urlPath + '/v1/ccs/op/diff/province/editPowerProtectScene',
        mock: 'editPowerProtectScene.json'
    },
    deletePowerProtectScene: {
        // 重大保电场景 --- 查询场景列表数据
        url: urlPath + '/v1/ccs/op/diff/province/deletePowerProtectScene'
    },
    getSceneListData: {
        // 重大保电场景 --- 查询场景列表数据
        url: urlPath + '/v1/ccs/op/diff/province/queryPowerProtectScene',
        mock: 'getSceneListData.json'
    },
    querySceneImportantDev: {
        // 重大保电场景 --- 查询重要设备表格接口
        url: urlPath + '/v1/ccs/op/diff/province/queryImportantDev',
        mock: 'querySceneImportantDev.json'
    },
    queryHisSample: {
        // 重大保电场景 --- 查询曲线弹窗数据
        url: urlPath + '/v1/ccs/op/overload/new/queryHisSample',
        mock: 'queryHisSample.json'
    },
    mainAndAuxAlarmInfo: {
        // 主辅设备告警列表
        url: smsnotePath + '/v/alarm/pageAlarmInfo',
        mock: 'pageAlarmInfo.json'
    },
    deletePowerProtectScene: {
        // 重大保电场景 --- 删除保电场景
        url: urlPath + '/v1/ccs/op/diff/province/deletePowerProtectScene',
        mock: 'deletePowerProtectScene.json'
    },
    getGeneralStatisticsData: {
        // 重大保电场景 --- 删除保电场景
        url: urlPath + '/v1/ccs/op/work/getGeneralStatistics',
        mock: 'getGeneralStatistics.json'
    },
    mapMain: {
        //全景展示-主网架构地图
        url: mockPath + 'getMapMainData.json',
        mock: 'getMapMainData.json'
    },
    mapLeft: {
        // 天津地图左侧四个数据
        url: urlPath + '/v1/ccs/op/remoteOperation/getRemoteOpCnt',
        mock: 'getRemoteOpCnt.json'
    },
    getSubstationTableData: {
        url: smsPath + '/v/model/subList',
        mock: 'getSubstationTableData.json'
    },
    getSubAreaListData: {
        //查询厂站区域列表
        url: urlPath + '/v1/ccs/op/model/getSubAreaList',
        mock: 'getSubAreaList.json'
    },
    oilTempStatics: {
        url: urlPath + '/v1/ccs/op/oilTemp/oilTempStatics',
        mock: 'oilTempStatics.json'
    },
    riskInfoData: {
        // url: urlPath + '/v1/ccs/op/oilTemp/oilTempStatics',
        mock: 'riskInfoData.json'
    },
    getDevTaizhang: {
        url: urlPath + '/v1/ccs/op/model/getSubstationDir',
        mock: 'getDevTaizhang.json'
    },
    getStInfo: {
        url: urlPath + '/v1/ccs/op/model/getStInfo',
        mock: 'getStInfo.json'
    },
    getCvtInfoData: {
        //cvt详情列表接口
        url: urlPath + '/runstatus/cvt/getCvtInfo',
        mock: 'getCvtInfoData.json'
    },
    getDeviationData: {
        //偏差电压接口
        url: urlPath + '/runstatus/cvt/getDeviation',
        mock: 'getDeviationData.json'
    },
    getPhaseVoltageData: {
        //相位电压接口
        url: urlPath + '/runstatus/cvt/getPhaseVoltage',
        mock: 'getPhaseVoltageData.json'
    },
    getCvtAbnormalStatData: {
        //cvt异常电压统计接口
        url: urlPath + '/runstatus/cvt/getCvtAbnormalStat',
        mock: 'getCvtAbnormalStatData.json'
    },
    getDevData: {
        //获取系统规模详情表格列表
        url: smsPath + '/v/model/getDevData',
        mock: 'getDevData.json'
    },
    getTableCountData: {
        //获取系统规模详情表格列表
        url: smsPath + '/v/model/getTableCount',
        mock: 'getTableCount.json'
    },
    getGroupListData: {
        //获取系统规模详情运维班表格列表
        url: smsPath + '/v/model/getGroupData',
        mock: 'getGroupData.json'
    },
    getSubListData: {
        //获取系统规模详情表格列表
        url: smsPath + '/v/model/subList',
        mock: 'getSubListData.json'
    },
    getMainDevListData: {
        //获取主设备详情数据
        url: smsPath + '/v/model/getMainDevData',
        mock: '/getMainDevData.json'
    },
    getAuxDevListData: {
        //获取辅设备详情数据
        url: smsPath + '/v/model/getAuxDevData',
        mock: '/getAuxDevData.json'
    },
    getMainYcOrYxListData: {
        //获取主遥信或主遥测详情数据
        url: smsPath + '/v/model/getMainYcOrYxData',
        mock: '/getMainYcOrYxData.json'
    },
    getAuxYcListData: {
        //获取辅助遥测详情数据
        url: smsPath + '/v/model/getAuxYcData',
        mock: '/getAuxYcData.json'
    },
    getAuxYxListData: {
        //获取辅助遥信详情数据
        url: smsPath + '/v/model/getAuxYxData',
        mock: '/getAuxYcData.json'
    },
    getDevTypeData: {
        //获取设备类型列表
        url: urlPath + '/general/model/getDevType',
        mock: '/getDevType.json'
    },
    getJkDevInfoData: {
        //查询设备信息
        url: urlPath + '/general/model/getJkDevInfo',
        mock: '/getJkDevInfo.json'
    },
    getFireMonitorRecord: {
        //消防监测
        url: urlPath + '/v1/ccs/op/fireOnline/getFireMonitorRecord',
        mock: 'getFireMonitorRecord.json'
    },
    getOnlineMonitorRecord: {
        //在线监测
        url: urlPath + '/v1/ccs/op/fireOnline/getOnlineMonitorRecord',
        mock: 'getOnlineMonitorRecord.json'
    },
    getHisOverloadRecord: {
        //历史重过载
        url: urlPath + '/v1/ccs/op/overload/new/getHisOverloadRecord',
        mock: 'getHisOverloadRecord.json'
    },
    /**
     * 数据质量管控-统计 POST
     */
    getMonitorIndexStatNew: {
        url: urlPath + '/v1/ccs/op/work/getMonitorIndexStatNew',
        mock: 'getMonitorIndexStatNew.json'
    },
    /**
     * 数据质量管控-统计 POST
     */
    getMonitorIndexStatList: {
        url: urlPath + '/v1/ccs/op/work/getMonitorIndexStatList',
        mock: 'getMonitorIndexStatList.json'
    },
    getStInfoList: {
        url: urlPath + '/v1/ccs/op/model/getStInfoList',
        mock: 'getStInfoList.json'
    },
    getVoltageList: {
        // 获取电压等级
        url: urlPath + '/v1/ccs/op/model/getBvList',
        mock: 'getBvList.json'
    },
    getRemoteCnt: {
        url: urlPath + '/v1/ccs/op/remoteOperation/getRemoteCnt',
        mock: 'getRemoteCnt.json'
    },
    /**
     * 数据质量管控-通道在线情况 POST
     */
    getChannelStatics: {
        url: urlPath + '/v1/ccs/op/work/getChannelStaticsPage',
        mock: 'getChannelStatics.json'
    },
    /**
     * 数据质量管控-事故信号正确性 POST
     */
    getAccidentStatics: {
        url: urlPath + '/v1/ccs/op/work/getAccidentStaticsPage',
        mock: 'getAccidentStatics.json'
    },
    /**
     * 数据质量管控-数据完整性 POST
     */
    getDataCompletenessStatics: {
        url: urlPath + '/v1/ccs/op/work/getDataCompletenessStaticsPage',
        mock: 'getDataCompletenessStatics.json'
    },
    /**
     * 数据质量管控-合格率 POST
     */
    getDataValidStatics: {
        url: urlPath + '/v1/ccs/op/work/getDataValidStaticsPage',
        mock: 'getDataValidStatics.json'
    },
    /**
     * 数据质量管控-遥测遥信匹配度 POST
     */
    getYcYxMatchStatics: {
        url: urlPath + '/v1/ccs/op/work/getYcYxMatchStaticsPage',
        mock: 'getYcYxMatchStatics.json'
    },
    /**
     * 数据质量管控-查询设备告警 POST
     */
    getAlarmDetailsByDevId: {
        url: urlPath + '/v1/ccs/op/work/getAlarmDetailsByDevId',
        mock: 'getAlarmDetailsByDevId.json'
    },
    /**
     * 系统运行管控-节点详情 GET
     */
    getSysNodeDetail: {
        url: urlPath + '/v1/ccs/op/systemStatus/getSysNodeDetail',
        mock: 'getSysNodeDetail.json'
    },
    /**
     * 系统运行管控-节点/应用/进程菜单获取 POST
     */
    getStsRunMenu: {
        url: urlPath + '/v1/ccs/op/systemStatus/getStsRunMenu',
        mock: 'getStsRunMenu.json'
    },
    /**
     * 系统运行管控-系统运行统计 GET
     */
    getSysRunStat: {
        url: urlPath + '/v1/ccs/op/systemStatus/getSysRunStat',
        mock: 'getSysRunStat.json'
    },
    /**
     * 系统运行管控-应用详情 GET
     */
    getSysAppDetail: {
        url: urlPath + '/v1/ccs/op/systemStatus/getSysAppDetail',
        mock: 'getSysAppDetail.json'
    },
    /**
     * 系统运行管控-进程详情 GET
     */
    getSysProcessDetail: {
        url: urlPath + '/v1/ccs/op/systemStatus/getSysProcessDetail',
        mock: 'getSysProcessDetail.json'
    },
    queryRealMea: {
        url: urlPath + '/v1/ccs/op/sample/queryRealMea',
        mock: 'queryRealMea.json'
    },
    exportRealMea: {
        url: urlPath + '/v1/ccs/op/sample/exportRealMea'
    },
    /**
     *   江苏省级 设备管控---辅助在线监测
     */
    getAuxMonitorData: {
        url: urlPath + '/v1/ccs/op/aux/getAuxMonitorData',
        mock: 'getAuxMonitorData.json'
    },
    /**
     * 图模更新历史详情 POST
     */
    getGraphData: {
        url: urlPath + '/v1/ccs/op/graph/getGraphData',
        mock: 'getGraphData.json'
    },
    exportGraphData: {
        url: urlPath + '/v1/ccs/op/graph/exportGraphData'
    },
    // 重过载变电站统计
    getOverloadStCnt: {
        url: urlPath + '/v1/ccs/op/overload/new/getOverloadStCnt',
        mock: 'getOverloadStCnt.json'
    },
    // 事件化上送-地区
    getRegionListNew: {
        url: overloadPath + '/v1/ccs/op/noToken/getRegionList',
        mock: 'getRegionListNew.json'
    },
    // 事件化上送-电压等级
    getBvNameList: {
        url: overloadPath + '/v1/ccs/op/noToken/getBvNameList',
        mock: 'getBvNameList.json'
    },
    // 事件化上送-事件类型
    getProvinceEventTypeList: {
        url: overloadPath + '/v1/ccs/op/noToken/getProvinceEventTypeList',
        mock: 'getProvinceEventTypeList.json'
    },
    // 事件化上送-事件等级
    getEventLevelList: {
        url: overloadPath + '/v1/ccs/op/noToken/getEventLevelList',
        mock: 'getEventLevelList.json'
    },
    // 事件化上送-表格
    queryEventAlarm: {
        url: overloadPath + '/v1/ccs/op/noToken/queryEventAlarm',
        mock: 'queryEventAlarm.json'
    },
    // 事件化上送-表格导出
    exportEventAlarmRecord: {
        url: overloadPath + '/v1/ccs/op/noToken/exportEventAlarmRecord',
        mock: 'queryEventAlarm.json'
    },
    // 事件化上送-是否显示事件编辑
    getIfCustomizedEventEnabled: {
        url: overloadPath + '/v1/ccs/op/noToken/getIfCustomizedEventEnabled',
        mock: 'getIfCustomizedEventEnabled.json'
    },
    // 事件化上送-表格列展示
    getEventAlarmTableColumnConfig: {
        url: overloadPath + '/v1/ccs/op/noToken/getEventAlarmTableColumnConfig',
        mock: 'getEventAlarmTableColumnConfig.json'
    },
    // 事件化上送-事件编辑-事件类型1
    getEventInfoTypeList: {
        url: overloadPath + '/v1/ccs/op/noToken/getEventInfoTypeList',
        mock: 'getEventInfoTypeList.json'
    },
    // 事件化上送-事件编辑-事件类型2
    getEventTypeList: {
        url: overloadPath + '/v1/ccs/op/noToken/getEventTypeList',
        mock: 'getEventTypeList.json'
    },
    // 事件化上送-事件编辑-事件名称
    getEventInfoList: {
        url: overloadPath + '/v1/ccs/op/noToken/getEventInfoList',
        mock: 'getEventInfoList.json'
    },
    // 事件化上送-事件编辑-电压等级
    getBvListNew: {
        url: overloadPath + '/v1/ccs/op/noToken/getBvList',
        mock: 'getBvListNew.json'
    },
    // 事件化上送-事件编辑-保存
    provinceCustomizeEventAlarm: {
        url: overloadPath + '/v1/ccs/op/noToken/provinceCustomizeEventAlarm',
        mock: 'provinceCustomizeEventAlarm.json'
    },
    // 事件化上送-上送中台过滤-过滤器列表
    getProvince2BpFilterConfig: {
        url: overloadPath + '/v1/ccs/op/noToken/getProvince2BpFilterConfig',
        mock: 'getProvince2BpFilterConfig.json'
    },
    // 事件化上送-上送中台过滤-事件类型和事件等级
    getProvinceEventTypeLevelList: {
        url: overloadPath + '/v1/ccs/op/noToken/getProvinceEventTypeLevelList',
        mock: 'getProvinceEventTypeLevelList.json'
    },
    // 事件化上送-上送中台过滤-厂站
    getStNameList: {
        url: overloadPath + '/v1/ccs/op/noToken/getStNameList',
        mock: 'getStNameList.json'
    },
    // 事件化上送-上送中台过滤-设备类型
    getProvinceDevTypeList: {
        url: overloadPath + '/v1/ccs/op/noToken/getProvinceDevTypeList',
        mock: 'getProvinceDevTypeList.json'
    },
    // 事件化上送-上送中台过滤-保存
    saveProvince2BpFilterConfig: {
        url: overloadPath + '/v1/ccs/op/noToken/saveProvince2BpFilterConfig',
        mock: 'saveProvince2BpFilterConfig.json'
    },
    // 重过载上送-判断是否展示上送总部和上送中台
    getProvinceSendConf: {
        url: overloadPath + '/v1/ccs/op/noToken/getProvinceSendConf',
        mock: 'getProvinceSendConf.json'
    },
    // 重过载上送-重过载数据
    queryOverload: {
        url: overloadPath + '/v1/ccs/op/noToken/queryOverload',
        mock: 'queryOverload.json'
    },
    // 重过载上送-上送中台-上送总部
    sendOverload: {
        url: overloadPath + '/v1/ccs/op/noToken/send',
        mock: 'sendOverload.json'
    },
    // 事件化上送-上送总部过滤-初始
    getProvinceFilterConfig: {
        url: overloadPath + '/v1/ccs/op/noToken/getProvinceFilterConfig',
        mock: 'getProvinceFilterConfig.json'
    },
    // 事件化上送-上送总部过滤-保存
    saveProvinceFilterConfig: {
        url: overloadPath + '/v1/ccs/op/noToken/saveProvinceFilterConfig',
        mock: 'saveProvinceFilterConfig.json'
    },
    // 事件化上送-手动确认
    confirmEventAlarm: {
        url: overloadPath + '/v1/ccs/op/noToken/confirmEventAlarm',
        mock: 'confirmEventAlarm.json'
    },
    // 事件化上送-事件上送-表单显隐
    getProvinceEventConfig: {
        url: overloadPath + '/v1/ccs/op/noToken/getProvinceEventConfig',
        mock: 'getProvinceEventConfig.json'
    },
    // 事件化上送-事件上送
    sendEventAlarm: {
        url: overloadPath + '/v1/ccs/op/noToken/sendEventAlarm',
        mock: 'sendEventAlarm.json'
    },
    /**
     * 量测校验数据比对 POST
     * @params  id
     * @params  systemId
     */
    doCompare: {
        url: urlPath + '/dc/mea/check/doCompare',
        mock: 'doCompare.json'
    },
    /**
     * 量测校验数据比对总览 POST
     * @params  startTime
     * @params  endTime
     * @params  dataType
     * @params  systemId
     * @params  compared
     */
    queryMeaCompareOverview: {
        url: urlPath + '/dc/mea/check/queryMeaCompareOverview',
        mock: 'queryMeaCompareOverview.json'
    },
    /**
     * 量测校验数据校验结果 POST
     * @params  id
     */
    queryMeaCompareResult: {
        url: urlPath + '/dc/mea/check/queryMeaCompareResult',
        mock: 'queryMeaCompareResult.json'
    },
    /**
     * 量测校验数据校验结果详情 POST
     */
    queryMeaCompareDetail: {
        url: urlPath + '/dc/mea/check/queryMeaCompareDetail',
        mock: 'queryMeaCompareDetail.json'
    },
    /**
     * 获取量测校核浮动范围 POST
     * userId
     */
    getConsistencyRange: {
        url: urlPath + '/dc/mea/check/getConsistencyRange',
        mock: 'getConsistencyRange.json'
    },
    /**
     * 保存量测校核浮动范围 POST
     */
    saveConsistencyRange: {
        url: urlPath + '/dc/mea/check/saveConsistencyRange',
        mock: 'saveConsistencyRange.json'
    },
    /**
     * 获取设备类型 GET
     */
    getDevTypeList: {
        url: urlPath + '/dc/dev/check/getDevTypeList',
        mock: 'getDevTypeList.json'
    },
    /**
     * 获取指定设备表下的域信息 GET
     */
    getColumnListByTableNo: {
        url: urlPath + '/dc/dev/check/getColumnListByTableNo',
        mock: 'getColumnListByTableNo.json'
    },
    /**
     * 召唤设备模型 POST
     */
    summonModel: {
        url: urlPath + '/dc/dev/check/summonModel',
        mock: 'summonModel.json'
    },
    /**
     * 查询设备模型校核记录 POST
     */
    queryCheckRecord: {
        url: urlPath + '/dc/dev/check/queryCheckRecord',
        mock: 'queryCheckRecord.json'
    },
    /**
     * 查询设备模型校核详情 POST
     */
    queryCheckDetail: {
        url: urlPath + '/dc/dev/check/queryCheckDetail',
        mock: 'queryCheckDetail.json'
    },
    /**
     * 获取目标系统列表 POST
     */
    getTargetSystemList: {
        url: urlPath + '/dc/interactionStat/getTargetSystem',
        mock: 'getTargetSystemList.json'
    },
    /**
     * 开关动作次数统计
     */
    getBreakerActionInfo: {
        url: urlPath + '/app/dev/stat/getBreakerActionInfo',
        mock: 'getBreakerActionInfo.json'
    },
    downloadBreakerActionInfo: {
        url: urlPath + '/app/dev/stat/downloadBreakerActionInfo'
    },
    /**
     * 获取区域列表 POST
     */
    getDcRegionList: {
        url: urlPath + '/dc/interactionStat/getRegionList',
        mock: 'getDcRegionList.json'
    },
    getJkDevInfoByRetrieval: {
        // 获取厂站
        url: urlPath + '/v1/ccs/op/model/getJkDevInfoByRetrieval',
        mock: 'getJkDevInfoByRetrieval.json'
    },
    getOilTempRecords: {
        // 获取主变油温表格
        url: urlPath + '/v1/ccs/op/oilTemp/getOilTempRecords',
        mock: 'getOilTempRecords.json'
    },
    getOilTempRegionCnt: {
        // 获取主变油温 地区越限
        url: urlPath + '/v1/ccs/op/oilTemp/getOilTempRegionCnt',
        mock: 'getOilTempRegionCntNew.json'
    },
    getOilTempBvCnt: {
        // 获取主变油温 电压等级越限
        url: urlPath + '/v1/ccs/op/oilTemp/getOilTempBvCnt',
        mock: 'getOilTempBvCntNew.json'
    },
    exportOilTempRecords: {
        // 获取主变油温表格导出
        url: urlPath + '/v1/ccs/op/oilTemp/exportOilTempRecords'
    },
    getOilOverStCnfList: {
        // 获取主变油温 变电站统计弹窗
        url: urlPath + '/v1/ccs/op/oilTemp/getOilOverStCnfList',
        mock: 'getOilOverStCnfList.json'
    },
    // 获取五类告警页面总计详情表格数据
    getJkWarnSumStatGroup: {
        url: urlPath + '/v1/ccs/op/warn/getJkWarnSumStatGroup',
        mock: 'getJkWarnSumStatGroup.json'
    },
    // 获取五类告警总计图表数据
    getAlarmBarNum: {
        url: urlPath + '/v1/ccs/op/warn/getAlarmBarNum',
        mock: 'getAlarmBarNum.json'
    },
    // 获取五类告警详情弹窗数据
    getJkAlarmNumByRecordType: {
        url: urlPath + '/v1/ccs/op/warn/getJkAlarmNumByRecordType',
        mock: 'getJkAlarmNumByRecordType.json'
    },
    getWarnDetails: {
        url: urlPath + '/v1/ccs/op/warn/getWarnDetails',
        mock: 'getWarnDetails.json'
    },
    exportSumAlarmByParam: {
        url: urlPath + '/v1/ccs/op/warn/exportSumAlarmByParam',
        mock: 'exportSumAlarmByParam.json'
    },
    exportAlarmByParam: {
        url: urlPath + '/v1/ccs/op/warn/exportAlarmByParam',
        mock: 'exportAlarmByParam.json'
    },
    exportWarnDetailsByParam: {
        url: urlPath + '/v1/ccs/op/warn/exportWarnDetailsByParam',
        mock: 'exportWarnDetailsByParam.json'
    },
    getNetSafetyCondition: {
        url: urlPath + '/v1/ccs/op/index/getNetSafetyCondition',
        mock: 'getNetSafetycondition.json'
    },
    getNetSafetyData: {
        url: urlPath + '/v1/ccs/op/index/getNetSafetyData',
        mock: 'getNetSafetyData.json'
    },
    exportNetSafetyData: {
        url: urlPath + '/v1/ccs/op/index/exportNetSafetyData'
    },
    getBoundaryCondition: {
        url: urlPath + '/v1/ccs/op/index/getBoundaryCondition',
        mock: 'getBoundarycondition.json'
    },
    getBoundaryData: {
        url: urlPath + '/v1/ccs/op/index/getBoundaryData',
        mock: 'getBoundaryData.json'
    },
    exportBoundaryData: {
        url: urlPath + '/v1/ccs/op/index/exportBoundaryData'
    },
    getEventKillWayCondition: {
        url: urlPath + '/v1/ccs/op/index/getEventKillWayCondition',
        mock: 'getBoundarycondition.json'
    },
    getSpiteEventData: {
        url: urlPath + '/v1/ccs/op/index/getSpiteEventData',
        mock: 'getBoundarycondition.json'
    },
    exportSpiteEventData: {
        url: urlPath + '/v1/ccs/op/index/exportSpiteEventData'
    },
    getPropertyCondition: {
        url: urlPath + '/v1/ccs/op/index/getPropertyCondition',
        mock: 'getBoundarycondition.json'
    },
    getPropertyData: {
        url: urlPath + '/v1/ccs/op/index/getPropertyData',
        mock: 'getBoundarycondition.json'
    },
    exportPropertyData: {
        url: urlPath + '/v1/ccs/op/index/exportPropertyData'
    },
    getOperationStatusData: {
        url: urlPath + '/v1/ccs/op/index/getOperationStatusData',
        mock: 'getBoundarycondition.json'
    },
    exportOperationStatusData: {
        url: urlPath + '/v1/ccs/op/index/exportOperationStatusData'
    },
    getSpiteStatusCountGroupRegionId: {
        url: urlPath + '/v1/ccs/op/index/getSpiteStatusCountGroupRegionId',
        mock: 'getBoundarycondition.json'
    },
    getSpiteStatusData: {
        url: urlPath + '/v1/ccs/op/index/getSpiteStatusData',
        mock: 'getBoundarycondition.json'
    },
    exportSpiteStatusData: {
        url: urlPath + '/v1/ccs/op/index/exportSpiteStatusData'
    },
    getBvConfData: {
        url: regionPath + '/monitor/event/getBvConfData',
        mock: 'getOverloadStaticsBvList2.json'
    },
    subScale: {
        url: smsPath + '/v/model/subScale',
        mock: 'subScale.json'
    },
    getOverloadStatistics: {
        // 获取重过载数量统计数据
        url: regionPath + '/monitor/overload/getOverloadStatistics',
        mock: 'getOverloadStatistics.json'
    },
    getRealOverloadRecord: {
        // 获取重过载详情表格数据
        url: regionPath + '/monitor/overload/getRealOverloadRecord',
        mock: 'getRealOverloadRecord.json'
    },
    queryLevelCnt: {
        // 首页缺陷统计数据新接口
        url: regionPath + '/monitor/defect/queryLevelCnt',
        mock: 'queryLevelCnt.json'
    },
    getSubstationDir: {
        // 获取厂站地图
        url: regionPath + '/monitor/common/getSubstationDir',
        mock: 'getSubstationDir.json'
    },
    getStationSelectList: {
        // 查询运维站
        url: smsPath + '/v/index/getStationSelectList',
        mock: 'getStationSelectList.json'
    },
    getStTree: {
        // 获取厂站目录树形菜单
        url: regionPath + '/general/model/getStTree',
        mock: 'getStTree.json'
    },
    getMaintenanceGroup: {
        // 查询运维班组
        url: urlPath + '/general/model/getMaintenanceGroup',
        mock: 'getMaintenanceGroup.json'
    },
    getIndexSubstationSuccessData: {
        // 当月操作次数
        url: urlPath + '/v1/ccs/op/transSubstation/getIndexSubstationSuccessData',
        mock: 'getIndexSubstationSuccessData.json'
    }
};

function loadConf(_filename, _default) {
    let _res = loadLocalFile(`${confPath}${_filename}`) || _default || {};
    if (!Array.isArray(_res)) {
        confignize(_res);
    }
    return _res;
}

function loadLocalFile(path) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    xhr.send();
    let _res;
    if (xhr.status === 200) {
        _res = JSON.parse(xhr.responseText);
    } else {
        lime.error(`Failed load config from <${path}>`);
    }
    return _res;
}

function confignize(_data) {
    _data.__proto__ = Object.create({
        get: function (_key, _default) {
            return _key in this ? this[_key] : _default;
        },
        getNumber: function (_key, _default) {
            return _key in this ? spoon.toNumber(this[_key]) : _default;
        },
        getString: function (_key, _default) {
            return _key in this ? String(this[_key]) : _default;
        },
        getBoolean: function (_key, _default) {
            return _key in this ? spoon.toBoolean(this[_key]) : _default;
        },
        getStringList: function (_key) {
            return spoon.toArray(_key);
        }
    });
}

export const ALARM_TYPE = {
    1: '事故',
    2: '异常',
    3: '越限',
    4: '变位',
    5: '告知'
};

export const dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
export const dateFormat = 'yyyy-MM-dd';

if (!mango.get('dataNameMap')) {
    mango.pub('dataNameMap', loadConf('statNameMap.json', {}));
}
if (!mango.get('layoutpageConfig')) {
    mango.pub('layoutpageConfig', loadConf('layoutpageConfig.json', {}));
}
if (!mango.get('defectpageConfig')) {
    mango.pub('defectpageConfig', loadConf('defectpageConfig.json', {}));
}
export const dataNameMap = mango.get('dataNameMap');
export const layoutPageConfig = mango.get('layoutpageConfig');
export const defectPageConfig = mango.get('defectpageConfig');
export const userInfo = parent.mangoJam?.get('userInfo') || {};
