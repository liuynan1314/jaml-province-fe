let _model, _msgr;

const notification = () => {
    return {
        type: 'wrapper',
        styles: ['size(width:25vw;height:40vh;)', 'css(display:flex;flex-direction:column;)'],
        components: [
            {
                type: 'wrapper',
                styles: ['size.fullwidth', 'css(display:flex;justifyContent:space-between;)'],
                components: [
                    {
                        type: 'buttongroup-radio',
                        data: [
                            {
                                name: '全部',
                                value: 'all'
                            },
                            {
                                name: '未读',
                                value: 'unread'
                            },
                            {
                                name: '已读',
                                value: 'read'
                            }
                        ],
                        defaultValue: 'all'
                    },
                    {
                        type: 'label',
                        cap: '全部已读',
                        styles: ['color.primary', 'css(cursor:pointer;)']
                    }
                ]
            },
            {
                type: 'table',
                id: 'notificationTable',
                styles: [Styles.table.regularStyle({ scroll: false }), Styles.table.headless, Styles.css({ width: '100%', height: 'calc(100% - 1.5rem)' })],
                dataDef: [
                    {
                        cap: '消息内容',
                        sortable: false,
                        align: 'left',
                        styles: [
                            Styles.hover.toShowAll,
                            Styles.css({
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            })
                        ]
                    },
                    {
                        cap: '发送人',
                        sortable: false
                    },
                    {
                        cap: '发送时间',
                        formatter: function (value) {
                            return value
                                ? jame({
                                      type: 'badge',
                                      styles: [
                                          Styles.css({
                                              borderRadius: 'xs',
                                              fontSize: 's'
                                          })
                                      ],
                                      cap: jam.formatTime(value, 'yyyy-MM-dd'),
                                      content: jam.formatTime(value, 'HH:mm:ss')
                                  })
                                : '--:--';
                        }
                    }
                ]
            }
        ],
        onmount() {
            const data = [
                ['且将新火试新茶，诗酒趁年华', '苏轼', '2025-08-20 12:00:00'],
                ['俯仰各有志，得酒诗自', '苏轼', '2025-08-21 12:00:00'],
                ['雪沫乳花浮午盏，蓼茸蒿笋试春盘。人间有味是清欢。', '苏轼', '2025-08-22 12:00:00'],
                ['我观人间世，无如醉中真', '苏轼', '2025-08-23 12:00:00']
            ];
            jam.findElement('#notificationTable').data = data;
        }
    };
};

export default notification;
