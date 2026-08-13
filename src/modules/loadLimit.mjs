import { ajaxCall } from '../common.js';
let _model, _msgr;

export default {
    type: 'wrapper',
    class: 'load-limit',
    styles: [
        Styles.size.fullsize,
        Styles.stylesheet({
            ':scope': {
                display: 'flex',
                flexWrap: 'wrap',
                padding: '0 3rem'
            },
            '.load-limit-list': {
                height: '50%',
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
                // '&:nth-child(n+3)': {
                //     paddingRight: '10rem'
                // }
            },
            '.load-limit-list-bg': {
                height: '15rem',
                width: '15rem',
                background: 'url(../../assets/images/base.png) no-repeat center center',
                backgroundSize: 'cover',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            },
            '.load-limit-indicator': {
                width: '12rem',
                display: 'flex',
                justifyContent: 'center',
                '&>[slot=cap]': {
                    fontSize: 'xl',
                    marginLeft: 's',
                    color: 'var(--jam-color-fg-muted)'
                },
                '&>[slot=value]': {
                    margin: 0,
                    fontSize: 'l',
                    color: 'var(--jam-color-on-primary)',
                    fontWeight: 'bold'
                },
                '&>[slot=unit]': {
                    backgroundColor: 'transparent',
                    fontSize: 'm',
                    marginLeft: 'xs',
                    color: 'var(--jam-color-fg-muted)'
                }
            }
        })
    ],
    components: [
        {
            type: 'wrapper',
            class: 'load-limit-list',
            buildFor: 'item in loadLimitList',
            components: [
                {
                    type: 'wrapper',
                    class: 'load-limit-list-bg',
                    components: [
                        {
                            type: 'indicator',
                            class: 'load-limit-indicator',
                            cap: '',
                            value: '{{item.cnt}}',
                            unit: '台'
                        }
                    ]
                },
                {
                    type: 'indicator',
                    class: 'load-limit-indicator',
                    cap: '{{item.name}}'
                }
            ]
        }
    ],
    descStyles: {
        indicator: []
    },
    methods: {
        getLoadLimitList() {
            ajaxCall(
                'getLoadLimitData',
                {
                    success(res) {
                        const { ptrList } = res;
                        ptrListConfig.forEach((item) => {
                            const { begin, end } = item;
                            item.cnt = ptrList.find((ptr) => ptr.begin === begin && ptr.end === end)?.cnt || 0;
                        });
                        _model.vars.loadLimitList = ptrListConfig;
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: JSON.stringify({
                        rangeList: [
                            {
                                begin: 0,
                                end: 80
                            },
                            {
                                begin: 80,
                                end: 100
                            },
                            {
                                begin: 100,
                                end: 120
                            },
                            {
                                begin: 120,
                                end: null
                            }
                        ]
                    }),
                    useMock: false,
                    type: 'post'
                },
                false
            );
        }
    },
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {
        this.getLoadLimitList();
    }
};

const ptrListConfig = [
    {
        name: '80%以下',
        begin: 0,
        end: 80
    },
    {
        name: '80%~100%',
        begin: 80,
        end: 100
    },
    {
        name: '100%~120%',
        begin: 100,
        end: 120
    },
    {
        name: '120%以上',
        begin: 120,
        end: null
    }
];
