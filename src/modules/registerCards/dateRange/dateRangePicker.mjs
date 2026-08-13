let _model, _msgr;
export const DEFAULT_DATE = jam.formatDate(Date.now(), 'yyyy-MM-dd');
export default {
    type: 'container',
    cap: '查询时间',
    icon: 'calendar',
    class: 'form-item date-range-picker',
    styles: ['layout.flex(alignContent:center;justifyContent:flex-start;wrap:nowrap;)'],
    descStyles: {
        datepicker: ['padding(top:0;bottom:0)', 'datepicker.labelslot.margin(0)'],
        button: [Styles.searchBtnsStyles]
    },
    components: [
        {
            type: 'datepicker',
            max: '{{endDate}}',
            cap: '查询时间：',
            icon: 'calendar',
            value: '{{beginDate}}',
            styles: [
                Styles.datepicker.agent.css({
                    width: '8rem'
                })
            ]
        },
        {
            type: 'label',
            cap: ' - '
        },
        {
            type: 'datepicker',
            min: '{{beginDate}}',
            cap: '',
            value: '{{endDate}}',
            styles: [
                // 'padding(left:0)',
                // 'size(width:9.2rem;)',
                Styles.stylesheet({ ':scope': { minWidth: '0!important' } }),
                Styles.datepicker.agent.css({
                    width: '8rem'
                })
            ]
        },
        {
            type: 'radio',
            data: [
                { name: '昨日', value: 1 },
                { name: '今日', value: 0 },
                { name: '近三天', value: 3 },
                { name: '近七天', value: 7 }
            ],
            value: 0,
            onvaluechange: function (value) {
                _model.endDate = moment().format('YYYY-MM-DD');
                _model.beginDate = moment().subtract(value, 'day').format('YYYY-MM-DD');
            }
        }
    ],
    onmount() {
        _model = this.model;
        _msgr = this.model.msgr;
        _model.vars.beginDate = DEFAULT_DATE;
        _model.vars.endDate = DEFAULT_DATE;
    }
};
