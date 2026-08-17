export const confPath = 'assets/conf/';
export const OPT_CONF = {};
export const COMM_PATH = NODE_ENV === 'development' ? 'http://172.40.193.7:8007/jaml/' : 'jaml/';
export const ip = `${COMM_PATH}moduleRegistry/moduleRegistry`;
export const DATA_PATH = `${ip}/assets`;
export const ICON_PATH = `${ip}/codes/icon`;
export const VOLTAGE_COLOR_STATE_BG = (elem, styleName = 'color') => {
    const eleName = elem ? Styles[elem] : Styles;
    return {
        '10kV': {
            styles: [eleName.css({ [styleName]: 'hsl(2.7, 51.7%, 65.9%)' })]
        },
        '35kV': {
            styles: [eleName.css({ [styleName]: 'hsl(60, 91.7%, 76.5%)' })]
        },
        '66kV': {
            styles: [eleName.css({ [styleName]: 'hsl(48, 100%, 50%)' })]
        },
        '110kV': {
            styles: [eleName.css({ [styleName]: 'hsl(199.3, 100%, 59.2%)' })]
        },
        '220kV': {
            styles: [eleName.css({ [styleName]: 'hsl(300, 52.2%, 59%)' })]
        },
        '330kV': {
            styles: [eleName.css({ [styleName]: 'hsl(91.2, 63.4%, 48.2%)' })]
        },
        '500kV': {
            styles: [eleName.css({ [styleName]: 'hsl(354.8, 100%, 63.9%)' })]
        },
        '660kV': {
            styles: [eleName.css({ [styleName]: 'hsl(29.3, 90.5%, 49.6%)' })]
        },
        '750kV': {
            styles: [eleName.css({ [styleName]: 'hsl(29.5, 95.5%, 35.1%)' })]
        },
        '800kV': {
            styles: [eleName.css({ [styleName]: 'hsl(240, 100%, 65.1%)' })]
        },

        '1000kV': {
            styles: [eleName.css({ [styleName]: 'hsl(240, 100%, 50%)' })]
        }
    };
};

/** Legacy accent sample (index.js comment / historical apply); not for styles fills. */
export const acColor = 'hsl(210, 59%, 28%)';

/** Theme chrome tokens as single-layer CSS vars (styles-safe; no jam.ac). */
export const COLOR_SET = {
    purewhite: 'var(--jam-color-on-primary)',
    primarytextclr: 'var(--jam-color-primary-default)',
    auxtextclr: 'var(--jam-color-fg-muted)',
    firsttextclr: 'var(--jam-color-fg-default)',
    secondarytextclr: 'var(--jam-color-fg-muted)',
    modalbgclr: 'elevation',
    modalborderclr: 'var(--jam-color-outline-muted)',
    modulebgclr: 'elevation',
    modulebgclr_deep: 'var(--jam-color-primary-subtle)',
    secondaryborderclr: 'var(--jam-color-outline-muted)',
    garytextclr: 'var(--jam-color-fg-subtle)',
    thirdborderclr: 'var(--jam-color-outline-subtle)',
    gradientbgclr_deep: 'var(--jam-color-primary-subtle)',
    gradientbgclr_light: 'var(--jam-color-primary-film)',
    gradientbgclr_lighter: 'var(--jam-color-primary-film)',
    thbrclr: 'var(--jam-color-primary-subtle)'
};

export const MenuType = {
    /** 基础电压等级 */
    BASE_VOLTAGE: 'BASE_VOLTAGE',
    /** 自定义分组（五类信号等） */
    CUSTOMIZED_GROUP: 'CUSTOMIZED_GROUP',
    /** 遥测状态 */
    TELEMETRY_STATUS: '遥测状态',
    /** 遥信状态 */
    REMOTE_SIGNAL_STATUS: '遥信状态',
    /** 设备状态 */
    DEVICE_STATUS: '设备状态',
    /** 通信厂站工况 */
    COMM_STATION_STATUS: '通信厂站工况',
    /** 光字牌状态 */
    ANNUNCIATOR_STATUS: '光字牌状态',
    /** 设备投运状态 */
    DEVICE_COMMISSION_STATUS: '设备投运状态',
    /** 动作状态 */
    ACTION_STATUS: '动作状态',
    /** 厂站状态菜单 */
    STATION_STATUS_MENU: '厂站状态菜单',
    /** 备用监视告警状态 */
    BACKUP_MONITOR_ALARM_STATUS: '备用监视告警状态',
    /** AGC 遥测状态 */
    AGC_TELEMETRY_STATUS: 'AGC遥测状态',
    /** AGC 机组状态 */
    AGC_UNIT_STATUS: 'AGC机组状态',
    /** AGC 控制模式状态 */
    AGC_CONTROL_MODE_STATUS: 'AGC控制模式状态',
    /** 链路运行状态 */
    LINK_RUNNING_STATUS: '链路运行状态',
    /** 颜色值 */
    COLOR_VALUE: '颜色值',
    /** 五类信号告警状态 */
    FIVE_CLASS_SIGNAL_ALARM_STATUS: '五类信号告警状态',
    /** 微机保护装置运行状态 */
    MICROCOMPUTER_PROTECTION_STATUS: '微机保护装置运行状态',
    /** 跟踪计划状态 */
    TRACKING_PLAN_STATUS: '跟踪计划状态',
    /** 断面监视遥测状态 */
    SECTION_MONITOR_TELEMETRY_STATUS: '断面监视遥测状态',
    /** 辅助遥测状态 */
    AUXILIARY_TELEMETRY_STATUS: '辅助遥测状态',
    /** 主设备遥信告警等级 */
    MAIN_DEVICE_REMOTE_SIGNAL_ALARM_LEVEL: '主设备遥信告警等级',
    /** 电缆沟状态菜单 */
    CABLE_TRENCH_STATUS_MENU: '电缆沟状态菜单',
    /** 电缆状态菜单 */
    CABLE_STATUS_MENU: '电缆状态菜单'
};
