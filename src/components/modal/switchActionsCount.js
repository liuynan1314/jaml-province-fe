let _model, _msgr;
const window = (tableData, title) => {
    return {
        type: 'card',
        icon: '',
        cap: title,
        styles: [
            Styles.card.floating({
                width: '80vw',
                height: '65vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                styles: [Styles.size.fullsize],
                components: [
                    {
                        type: 'table',
                        styles: [
                            Styles.hover.toShowAll({ selector: '.hover' }),
                            Styles.table.fixedrowheight({
                                height: '2.5rem'
                            }),
                            Styles.tableStyles,
                            Styles.css({
                                width: '100%',
                                height: '100%'
                            })
                        ],
                        data: tableData,
                        dataDef: [
                            {
                                key: 'regionName',
                                class: 'hover',
                                cap: '地区',
                                sortable: false,
                                width: '15%'
                            },
                            {
                                key: 'stName',
                                class: 'hover',
                                cap: '厂站名称',
                                sortable: false,
                                width: '15%'
                            },
                            {
                                key: 'occurTime',
                                cap: '发生时间',
                                sortable: false,
                                width: '20%',
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
                            },
                            {
                                key: 'content',
                                class: 'hover',
                                cap: '信号描述',
                                sortable: false,
                                width: '50%'
                            }
                        ]
                    }
                ],
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                onafterrender: function () {}
            }
        ]
    };
};

export default window;
