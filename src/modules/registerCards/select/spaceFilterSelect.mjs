import { getBayList } from '../../../utils/commonList.js';

export default {
    type: 'filterSelect',
    class: 'filter-item space-filter-select',
    cap: '间隔',
    styles: ['icon.solid', 'padding(top:0;bottom:0)'],
    icon: 'transformer-bolt',
    childStyles: ['icon.solid'],
    placeholder: '--请选择--',
    props: { cap: '间隔', icon: 'transformer-bolt', data: '{{bayList}}', search: '{{bayName}}', select: '{{bayId@page}}' },
    watchers: [
        {
            key: 'bayName',
            callback: function (value) {
                const stId = this.msgr().get('stId');
                getBayList({ _model: this.model, stId, devName: value });
                this.msgr('page').pub('bayName', value);
            },
            debounce: 300
        },
        {
            key: 'name',
            callback: function () {
                const stId = this.msgr().get('stId');
                getBayList({ _model: this.model, stId });
            },
            debounce: 300
        },
        {
            key: 'resetSearch@page',
            callback: function () {
                this.ref('closeBtn').click();
            }
        },
        // 兼容旧版本写法
        {
            key: 'bayId@page',
            callback: function (value) {
                this.msgr.pub('bayId', value);
            }
        }
    ],
    onafterrender: function () {
        const stId = this.msgr().get('stId');
        getBayList({ _model: this.model, stId });
    }
};
