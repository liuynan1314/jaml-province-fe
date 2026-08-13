// 三种类型都有的公共字段
const COMMON_FIELD_MAP = {
    id: 'ID',
    statTime: '统计时间',
    stId: '变电站ID',
    stName: '所属厂站',
    stPsrId: '中台变电站ID',
    devId: '设备ID',
    devName: '设备名称',
    devPsrId: '中台设备ID',
    regionId: '区域ID',
    regionName: '区域',
    bvId: '电压等级ID',
    bvName: '电压等级',
    uploadStatus: '上送状态',
    createTime: '创建时间',
    remarks: '备注'
};

// 枚举值翻译
const VALUE_MAP = {
    uploadStatus: {
        0: '未上送',
        1: '上送成功',
        2: '上送失败'
    },
    // 容抗器 devType
    rkqDevType: {
        1: '并联电容',
        2: '并联电抗'
    },
    // 母线越限类型
    limitType: {
        0: '双向越限',
        1: '越上限',
        2: '越下限'
    },
    // 主变对应侧
    windType: {
        0: '高压侧',
        1: '中压侧',
        2: '中压侧', // 接口注释写3，若返回2也兼容
        3: '低压侧'
    }
};
// devType = 1 容抗器
const FIELD_MAP_RKQ = {
    ...COMMON_FIELD_MAP,
    devType: '容器类型',
    autoSwitchOn: '自动投入次数',
    manualSwitchOn: '手动投入次数',
    autoSwitchOff: '自动退出次数',
    manualSwitchOff: '手动退出次数',
    totalSwitch: '当日投切次数',
    onDuration: '投入时长(分钟)',
    offDuration: '退出时长(分钟)',
    usageRate: '使用率(%)',
    brkId: '断路器ID',
    psrBrkId: '中台断路器ID',
    busId: '母线ID',
    psrBusId: '中台母线ID',
    trId: '主变ID',
    psrTrId: '中台主变ID'
};

// devType = 2 主变
const FIELD_MAP_ZB = {
    ...COMMON_FIELD_MAP,
    tapSwitchTotal: '档位动作总次数',
    tapSwitchRise: '档位上升次数',
    tapSwitchDrop: '档位下降次数',
    positiveAverage: '正向负载率平均值(%)',
    positiveMax: '正向负载率最大值(%)',
    positiveMaxTime: '正向负载率最大值时刻',
    positiveDuration: '正向负载率累计时长(分钟)',
    reverseAverage: '反向负载率平均值(%)',
    reverseMax: '反向负载率最大值(%)',
    reverseMaxTime: '反向负载率最大值时刻',
    reverseDuration: '反向负载率累计时长(分钟)',
    qbackAverage: '无功倒送平均值(Mvar)',
    qbackMax: '无功倒送最大值(Mvar)',
    qbackMaxTime: '无功倒送最大值时刻',
    qbackDuration: '无功倒送时长(分钟)',
    qbackPercent: '无功倒送时长占比(%)'
};

// devType = 3 母线
const FIELD_MAP_MX = {
    ...COMMON_FIELD_MAP,
    limitType: '越限类型',
    upDuration: '越上限时长(分钟)',
    downDuration: '越下限时长(分钟)',
    linkTime: '母线拓扑连接主变时长(分钟)',
    trId: '主变ID',
    psrTrId: '中台主变ID',
    windType: '主变对应侧'
};
// 按 dailyType / devType 取字典
const FIELD_MAP_BY_TYPE = {
    1: FIELD_MAP_RKQ,
    2: FIELD_MAP_ZB,
    3: FIELD_MAP_MX
};
export default function (title, _params, devType) {
    let _model, _msgr;
    const list = rowToDetailList(_params, devType);
    return {
        type: 'card',
        cap: title + '详情',
        styles: [
            'with.elevation',
            Styles.card.floating({
                width: '40vw',
                height: '80vh'
            }),
            Styles.stylesheet({
                '.jsonContent': {
                    display: 'flex'
                }
            })
        ],
        components: [
            {
                type: 'wrapper',
                class: 'jsonContent',
                watchers: [
                    {
                        key: 'result',
                        callback(value) {
                            // 先清空所有子元素，避免重复渲染
                            while (this.firstChild) {
                                this.removeChild(this.firstChild);
                            }
                            jam.renderJSON(this, value);
                        }
                    }
                ]
            }
        ],
        vars: { result: list },
        onmount() {
            _model = this.model;
        },
        onafterrender: function (dom) {}
    };
}

function rowToDetailList(row, devType) {
    const fieldMap = FIELD_MAP_BY_TYPE[devType] || COMMON_FIELD_MAP;
    const HIDE_KEYS = ['id', 'stId', 'devId', 'stPsrId', 'devPsrId', 'regionId', 'bvId', 'brkId', 'psrBrkId', 'busId', 'psrBusId', 'trId', 'psrTrId'];
    return Object.keys(fieldMap).reduce((acc, key) => {
        if (HIDE_KEYS.includes(key)) return acc;
        acc[fieldMap[key]] = formatDetailValue(key, row[key], devType);
        return acc;
    }, {});
}

function formatDetailValue(key, value, devType) {
    if (value === null || value === undefined || value === '') {
        return '--';
    }

    if (key === 'uploadStatus') {
        return VALUE_MAP.uploadStatus[value] ?? value;
    }
    if (key === 'devType' && devType === 1) {
        return VALUE_MAP.rkqDevType[value] ?? value;
    }
    if (key === 'limitType') {
        return VALUE_MAP.limitType[value] ?? value;
    }
    if (key === 'windType') {
        return VALUE_MAP.windType[value] ?? value;
    }

    // 百分比 / 数值保留
    if (['usageRate', 'positiveAverage', 'positiveMax', 'reverseAverage', 'reverseMax', 'qbackAverage', 'qbackMax', 'qbackPercent'].includes(key)) {
        const num = Number(value);
        return Number.isNaN(num) ? value : Number.isInteger(num) ? num : num.toFixed(2);
    }

    return String(value);
}
