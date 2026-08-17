import { ajaxCall, formatterJameBv } from '../../common.js';
let _model, _msgr, _this;
let deleteRecord = [];
const recordsMap = new Map();
const devListWindow = (params) => {
    return {
        type: 'card',
        icon: '',
        cap: '新增保电设备',
        styles: [
            Styles.card.floating({
                width: '46vw',
                height: '60vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                id: 'devListWindow',
                styles: [
                    'props(display:flex;flexDirection:column;position:relative;)',
                    'size(width:100%;height:100%)',
                    Styles.stylesheet({
                        ':scope': {
                            // padding: 'm'
                        },
                        '.form_wrapper': {
                            width: '100%',
                            display: 'flex',
                            marginBottom: 's',
                            alignItems: 'center',
                            '.add_btn': {
                                width: '4rem !important',
                                padding: '0 !important',
                                justifyContent: 'flex-start'
                            },
                            '.form_item': {
                                '--jam-agent-width': '11.25rem'
                            }
                        },
                        '.devList': {
                            alignItems: 'flex-start'
                        },
                        '.devListBox': {
                            width: '80%',
                            height: '4rem',
                            display: 'flex',
                            flexWrap: 'wrap',
                            borderRadius: 's',
                            border: 's solid',
                            borderColor: 'var(--jam-color-outline-muted)',
                            padding: 's',
                            marginBottom: 'xxs',
                            flexWrap: 'wrap',
                            'jam-button': {
                                marginLeft: 0
                            },
                            'jam-label': {
                                padding: 'm',
                                borderRadius: 0,
                                border: 's solid',
                                height: '2rem',
                                marginRight: 's',
                                fontSize: 's',
                                marginBottom: 's',
                                borderColor: 'var(--jam-color-outline-subtle)',
                                background: 'transparent'
                            }
                        },
                        '#select-all-record': {
                            width: '1.1rem',
                            height: '1.1rem',
                            marginLeft: 'xs'
                        },
                        '.tableContent': {
                            height: 'calc(100% - 10rem)',
                            flexGrow: 1
                        }
                    })
                ],
                components: [
                    {
                        type: 'wrapper',
                        class: 'form_wrapper',
                        components: [
                            {
                                type: 'filterSelect',
                                class: 'form_item',
                                styles: [
                                    Styles.input.regularStyleDiff,
                                    Styles.input.agent.css({
                                        borderColor: 'var(--jam-color-outline-muted)',
                                        width: '11.25rem'
                                    })
                                ],
                                props: { cap: '所属厂站：', data: '{{stList}}', search: '{{stName}}', select: '{{stId}}' },
                                watchers: {
                                    async stName(val) {
                                        if (val.length == 0) _msgr.pub('stId', '');
                                        getSubstationList(val);
                                    }
                                }
                            },
                            {
                                type: 'input',
                                styles: [
                                    Styles.input.regularStyleDiff,
                                    Styles.input.agent.css({
                                        borderColor: 'var(--jam-color-outline-muted)',
                                        width: '11.25rem'
                                    })
                                ],
                                cap: '设备名称：',
                                class: 'form_item',
                                valueKey: 'devName'
                            },
                            {
                                type: 'select',
                                styles: [Styles.select.regularStyleDiff],
                                class: 'form_item',
                                cap: '设备类型：',
                                defaultValue: '',
                                valueKey: 'devType',
                                data: [
                                    { name: '断路器', value: ['CBR'] },
                                    { name: '负荷', value: ['FH'] },
                                    { name: '交流线段端点', value: ['aclineend'] },
                                    { name: '变压器', value: ['PTR'] },
                                    { name: '绕组', value: ['NS'] }
                                ]
                            },
                            {
                                type: 'button',
                                class: 'jam-cta',
                                cap: '查询',
                                icon: 'search',
                                styles: [Styles.searchBtnsStyles],
                                onclick: function () {
                                    querySceneImportantDev();
                                }
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        components: [
                            {
                                type: 'label',
                                class: 'devList',
                                cap: '保电设备：'
                            },
                            {
                                type: 'wrapper',
                                class: 'devListBox',
                                components: [
                                    {
                                        type: 'tags',
                                        removable: true,
                                        dataWatcher: 'tagsList',
                                        value: '{{checkedList}}'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        class: 'tableContent',
                        components: [
                            {
                                type: 'basicTable',
                                subType: 'checkbox',
                                click2Check: true,
                                valueIndex: 0,
                                value: '{{checkedList}}',
                                styles: ['basicTable.basic', Styles.hover.toShowAll({ selector: '.jam-td' }), Styles.size.fullsize, Styles.css({ padding: 0 }), 'table.th.css(whiteSpace:nowrap;minHeight:2.5rem;)'],
                                descStyles: {
                                    '.item-content': ['css(overflow:hidden;white-space:nowrap;text-overflow:ellipsis)']
                                },
                                props: {
                                    dataDef: [
                                        {
                                            cap: '设备ID',
                                            key: 'devId',
                                            hide: true
                                        },
                                        {
                                            cap: '所属厂站',
                                            key: 'stName',
                                            sortable: false
                                        },
                                        {
                                            cap: '所属间隔',
                                            key: 'bayName',
                                            align: 'left',
                                            sortable: false,
                                            formatter: function (value) {
                                                return value ? value : '<div style="width:100%;text-align:center">--</div>';
                                            }
                                        },
                                        {
                                            cap: '设备',
                                            key: 'devName',
                                            align: 'left',
                                            sortable: false
                                        },
                                        {
                                            cap: '设备类型',
                                            key: 'typeDesc',
                                            sortable: false
                                        },
                                        {
                                            cap: '电压等级',
                                            key: 'bvName',
                                            sortable: false,
                                            formatter: formatterJameBv
                                        }
                                    ]
                                },
                                data: '{{devListData}}'
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        styles: ['css(width:calc(100% + 2rem))', 'wrapper.buttonwrapper', Styles.css({ marginTop: 'm', position: 'absolute', bottom: '-1rem', left: '-1rem' })],
                        childStyles: ['icon.duotone', Styles.css({ borderRadius: '0' })],
                        components: [
                            {
                                type: 'button',
                                icon: 'repeat',
                                cap: '重置',
                                onclick: function () {
                                    resetForm();
                                }
                            },
                            {
                                type: 'button',
                                icon: 'trash-can',
                                cap: '清空',
                                onclick: function () {
                                    resetForm();
                                }
                            },
                            {
                                type: 'button',
                                icon: 'xmark',
                                cap: '取消',
                                onclick: function () {
                                    mango.pub('_editDev', new Date());
                                }
                            },
                            {
                                type: 'button',
                                icon: 'check',
                                class: 'jam-cta',
                                cap: '确认',
                                msgFormat: {
                                    msgKey: 'devListResult'
                                }
                            }
                        ]
                    }
                ],

                vars: {
                    devListData: []
                    // checkedList: []
                },
                watchers: {
                    devListResult() {
                        const tableCheckedId = this.vars.checkedList || [];
                        const devTableList = _msgr.get('devListData') || [];
                        let _data = devTableList.filter((item) => {
                            return tableCheckedId.includes(item.devId);
                        });
                        nutmeg.success('新增保电设备成功');
                        _data.forEach((item) => {
                            if (item.typeDesc) {
                                item.devType = item.typeDesc;
                            }
                        });
                        mango.pub('_editDev', _data);
                    },
                    checkedList(val) {
                        const tagsList = [];
                        const devTableList = _msgr.get('devListData') || [];
                        if (val && val.length > 0) {
                            val.forEach((item) => {
                                tagsList.push({
                                    name: devTableList.find((dev) => dev.devId === item)?.devName || '',
                                    value: item
                                });
                            });
                        }
                        _msgr.pub('tagsList', tagsList);
                    }
                },
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                    _this = this;
                },
                onafterrender: async function () {
                    if (params.regionId) {
                        _msgr.pub('_regionId', params.regionId);
                    }
                    await querySceneImportantDev();
                    if (params.devList && params.devList[0]) {
                        this.vars.checkedList = params.devList.map((item) => item.devId);
                        _msgr.pub('tagsList', params.devList);
                    }
                    getSubstationList();
                }
            }
        ]
    };
};

function querySceneImportantDev() {
    const params = getParams();
    params.count = 100;
    return new Promise((resolve, reject) => {
        ajaxCall(
            'getSubstationList',
            {
                success(data) {
                    recordsMap.clear();
                    data.forEach((item) => {
                        recordsMap.set(item.devId);
                        item.name = item.devName;
                        item.value = item.devId;
                    });
                    _msgr.pub('devListData', data);
                    resolve(data);
                },
                params: params,
                useMock: false,
                type: 'post'
            },
            false
        );
    });
}

function getSubstationList(devName = '') {
    const regionId = _msgr.get('_regionId') || null;
    ajaxCall(
        'getSubstationList',
        {
            success(data) {
                _model.vars.stList = data?.map((item) => ({ name: item.devName, value: item.devId }));
            },
            params: {
                count: 100,
                regionId: regionId,
                devName: devName,
                devType: ['substation']
            },
            useMock: false,
            type: 'post',
            uniqId: `getSubstationList_${Math.random(1, 1000000)}`
        },
        false
    );
}

function resetForm() {
    _msgr.pub('stId', '');
    _msgr.pub('devType', null);
    _msgr.pub('stName', '');
    _msgr.pub('devName', '');
    // _model.vars.formList.fhList = [];
}

function getParams() {
    const stId = _msgr.get('stId') || '';
    const devType = _msgr.get('devType') || ['CBR', 'FH', 'aclineend', 'PTR', 'NS'];
    const devName = _msgr.get('devName') || '';
    const regionId = _msgr.get('_regionId') || null;
    return {
        regionId,
        stId,
        devType,
        devName
    };
}

export default devListWindow;
