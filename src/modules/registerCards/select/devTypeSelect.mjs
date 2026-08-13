import { buildSelect } from '../../../components/componentBuilder.js';

export default buildSelect({
    cap: '设备类型',
    valueName: 'tableId',
    icon: 'draw-square',
    defaultValue: '',
    data: [
        { name: '变电站', value: '405' },
        { name: '断路器', value: '407' },
        { name: '刀闸', value: '408' },
        { name: '接地刀闸', value: '409' },
        { name: '负荷', value: '412' },
        { name: '交流线段端点', value: '415' },
        { name: '交流线段', value: '414' },
        { name: '变压器', value: '416' },
        { name: '母线', value: '410' },
        { name: '绕组', value: '417' },
        { name: '并联电容/电抗器表', value: '419' },
        { name: '计算点', value: '433' }
    ]
});
