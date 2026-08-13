import { findCol } from '../../global.js';
import { ajaxCall, formatterJameTime } from '../../common.js';
let _model, _msgr, _thisModel;
const defectRecord = () => {
    return {
        type: 'card',
        icon: '',
        cap: '提取缺陷记录',
        class: 'defectRecordId',
        broker: 'systemOperatingRecords',
        styles: [
            Styles.card.floating({
                width: '65vw',
                height: '68vh'
            })
        ],
        components: [
            {
                type: 'container',
                styles: ['size.fullsize'],
                descStyles: { '*': [Styles.icon.duotone] },
                components: [
                    {
                        type: 'wrapper',
                        styles: ['margin(bottom:1rem)'],
                        inputStyles: [Styles.input.regularStyleNew, 'input.labelslot.margin(0)'],
                        datepickerStyles: [Styles.input.regularStyleNew, 'input.labelslot.margin(0)'],
                        components: [
                            {
                                type: 'input',
                                valueKey: 'defectContent',
                                defaultValue: '',
                                icon: 'calendar',
                                cap: '缺陷内容：'
                            },
                            {
                                type: 'input',
                                valueKey: 'defectnote',
                                defaultValue: '',
                                icon: 'calendar',
                                cap: '备注：'
                            },
                            {
                                type: 'datepicker',
                                valueKey: 'defectstartDate',
                                icon: 'clock',
                                cap: '开始时间：'
                            },
                            {
                                type: 'datepicker',
                                valueKey: 'defectendDate',
                                icon: 'clock',
                                cap: '结束时间：'
                            },
                            {
                                type: 'button',
                                class: 'btn jam-cta',
                                cap: '查询',
                                icon: 'magnifying-glass',
                                styles: [Styles.searchBtnsStyles, Styles.props({ marginTop: 'xs' })],
                                onclick: function () {
                                    getDefectPage();
                                }
                            }
                        ]
                    },
                    {
                        type: 'tableWithPage',
                        subType: 'checkbox',
                        click2Check: true,
                        valueIndex: 0,
                        value: '{{selectRows}}',
                        styles: ['tableWithPage.basic', Styles.hover.toShowAll({ selector: '.jam-td' }), Styles.table.css({ height: 'calc(100% - 5rem)' }), Styles.css({ padding: 0 }), 'table.th.css(whiteSpace:nowrap;minHeight:2.5rem;)'],
                        descStyles: {
                            '.item-content': ['css(overflow:hidden;white-space:nowrap;text-overflow:ellipsis)']
                        },
                        props: {
                            cpageNo: '{{tPageNo}}',
                            ctotal: '{{tTotal}}',
                            cpageSize: '{{tPageSize}}',
                            cpageHide: { pageSize: false },
                            dataDef: [
                                {
                                    key: 'defectId',
                                    cap: 'defectId',
                                    hide: true
                                },
                                {
                                    key: 'stName',
                                    cap: '厂站名称',
                                    sortable: false
                                },
                                {
                                    key: 'devName',
                                    cap: '设备名称',
                                    sortable: false
                                },
                                {
                                    key: 'bayName',
                                    cap: '开关名称',
                                    sortable: false
                                },
                                {
                                    key: 'occurTime',
                                    cap: '发生时间',
                                    sortable: false,
                                    formatter: formatterJameTime
                                },
                                {
                                    key: 'content',
                                    cap: '缺陷内容',
                                    sortable: false,
                                    align: 'left',
                                    class: 'item-content'
                                },
                                {
                                    key: 'note',
                                    cap: '备注',
                                    sortable: false
                                }
                            ],
                            pageSizeList: [
                                { value: 20, name: '20条/页' },
                                { value: 30, name: '30条/页' },
                                { value: 50, name: '50条/页' },
                                { value: 100, name: '100条/页' }
                            ]
                        },
                        data: '{{defectRecordData}}'
                    }
                ]
            },
            {
                type: 'wrapper',
                styles: ['size.fullwidth', 'wrapper.buttonwrapper', Styles.css({ position: 'absolute', bottom: '0', left: '0' })],
                childStyles: ['icon.duotone', Styles.css({ borderRadius: '0' })],
                components: [
                    {
                        type: 'button',
                        icon: 'repeat',
                        cap: '重置',
                        usage: 'reset'
                    },
                    {
                        type: 'button',
                        icon: 'trash-can',
                        cap: '清空',
                        usage: 'clear'
                    },
                    {
                        type: 'button',
                        icon: 'xmark',
                        cap: '取消',
                        usage: 'cancel',
                        onclick: function () {
                            _msgr.pub('closedefectSaff', 1);
                            _msgr.pub('detailId', '');
                        }
                    },
                    {
                        type: 'button',
                        icon: 'check',
                        cap: '确认',
                        msgFormat: {
                            msgKey: 'result'
                        },
                        onclick: function () {
                            getDefectDetail();
                        }
                    }
                ]
            }
        ],

        vars: {
            tPageNo: 1,
            tPageSize: 20,
            tTotal: 0,
            defectRecordData: []
        },
        watchers: [
            {
                debounce: 300,
                init: false,
                keys: ['tPageSize', 'tPageNo'],
                callback() {
                    getDefectPage();
                }
            }
        ],
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
        },
        onafterrender: function () {
            // getDefectPage();
            getAllTableData();
        }
    };
};
function getDefectDetail() {
    let data = _model.allTableData;
    let selectRows = _model.selectRows || [];
    let desccontent = '';
    data.forEach((item) => {
        selectRows.forEach((key) => {
            if (key == item.defectId) {
                if (desccontent) {
                    desccontent = desccontent + ';' + item.content + (item.note ? ',' + item.note : '');
                } else {
                    desccontent = item.content + (item.note ? ',' + item.note : '');
                }
            }
        });
    });
    mango.pub('defectDesc', desccontent);
    nutmeg.success('缺陷内容添加成功');
    let dom = document.querySelector('.defectRecordId');
    spoon.removeSelf(dom);
}

function getDefectPage() {
    let _params = {
        pageIndex: _model.tPageNo || 1,
        pageSize: _model.tPageSize || 20,
        content: _msgr.get('defectContent'),
        note: _msgr.get('defectnote'),
        startDate: _msgr.get('defectstartDate'),
        endDate: _msgr.get('defectendDate')
    };
    jam.ajaxCall({
        urlKey: 'getDefectPage',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        data: _params,
        onsuccess(result) {
            const { data } = result;
            const { list = [], pageIndex = 1, pojoTotalCount = 20 } = data;
            _model.tPageNo = pageIndex;
            _model.tTotal = pojoTotalCount;
            _model.defectRecordData = list;
        }
    });
}

// 获取全部表格数据
function getAllTableData() {
    let _params = {
        pageIndex: 1,
        pageSize: 9999,
        content: _msgr.get('defectContent'),
        note: _msgr.get('defectnote'),
        startDate: _msgr.get('defectstartDate'),
        endDate: _msgr.get('defectendDate')
    };
    jam.ajaxCall({
        urlKey: 'getDefectPage',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        data: _params,
        onsuccess(result) {
            const { data } = result;
            _model.allTableData = data?.list;
        }
    });
}
export default defectRecord;
