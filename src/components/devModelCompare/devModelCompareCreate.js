import { ajaxCall } from '../../common.js';
import { getDcRegionList, getJkDevInfoByRetrieval, setStlist, getDevTypeList, setDevlist } from '../../utils/ajaxCache.js';
const window = () => {
    let _model,
        _msgr,
        stSelectCacheList = [],
        devCacheList = [],
        colCacheList = [],
        colSelectCacheList = [],
        cacheTableNo = null;
    function hasSt(stId) {
        let rt = false;
        for (let item of stSelectCacheList || []) {
            if (item.stId == stId) {
                rt = true;
                break;
            }
        }
        return rt;
    }
    function hasCol(colId) {
        let rt = false;
        for (let item of colSelectCacheList || []) {
            if (item.colId == colId) {
                rt = true;
                break;
            }
        }
        return rt;
    }
    function getStNames() {
        let rt = [];
        for (let item of stSelectCacheList || []) {
            rt.push(item.stName);
        }
        return rt;
    }
    function getColNames() {
        let rt = [];
        for (let item of colSelectCacheList || []) {
            rt.push(item.colName);
        }
        return rt;
    }
    function setStCacheList(stNameList) {
        let rt = [];
        for (let item of stSelectCacheList || []) {
            if (stNameList.includes(item.stName)) {
                rt.push(item);
            }
        }
        stSelectCacheList = rt;
    }
    function setColCacheList(colNameList) {
        let rt = [];
        for (let item of colSelectCacheList || []) {
            if (colNameList.includes(item.colName)) {
                rt.push(item);
            }
        }
        colSelectCacheList = rt;
    }
    function getColumnListByTableNo(tableNo) {
        ajaxCall('getColumnListByTableNo', {
            success(data) {
                let list = [];
                for (let item of data || []) {
                    list.push({
                        value: item.columnName,
                        name: item.columnNameChn
                    });
                }
                colCacheList = list;
                _msgr.pub('columnList', list);
            },
            error(error) {
                console.log(error);
            },
            params: {
                tableNo
            },
            useMock: false,
            type: 'get'
        });
    }
    function summonModel() {
        if (!validateForm()) return;
        const params = {
            regionId: _msgr.get('regionId'),
            stId: stSelectCacheList.map((user) => user.stId),
            tableName: _msgr.get('devId'),
            columns: colSelectCacheList.map((user) => user.colId)
        };
        ajaxCall('summonModel', {
            success(data) {
                nutmeg.success('模型开始召唤！');
                const modal = mango.get('openCard');
                modal && modal.close();
            },
            error(error) {
                nutmeg.error('模型召唤失败！');
                console.log(error);
            },
            params,
            useMock: false,
            type: 'post'
        });
    }
    function validateForm() {
        let region = _model.ref('region');
        let stName = _model.ref('stName');
        let devType = _model.ref('devType');
        let column = _model.ref('column');
        if (jam.isEmpty(region.value)) {
            region.validate();
            return false;
        }
        if (jam.isEmpty(stName.value)) {
            stName.popup('⚠️ ' + '请至少选择一项', {
                noFlash: true,
                click2Hide: true,
                clickElsewhere2Hide: false,
                style: { maxWidth: 'unset', width: 'auto' }
            });
            return false;
        }
        if (jam.isEmpty(_msgr.get('devId'))) {
            devType.children[0].validate();
            return false;
        }
        if (jam.isEmpty(column.value)) {
            column.popup('⚠️ ' + '请至少选择一项', {
                noFlash: true,
                click2Hide: true,
                clickElsewhere2Hide: false,
                style: { maxWidth: 'unset', width: 'auto' }
            });
            return false;
        }
        return true;
    }
    function onunmount() {
        let region = _model.ref('region');
        let stName = _model.ref('stName');
        let devType = _model.ref('devType');
        let column = _model.ref('column');
        region?.closePopup();
        stName?.closePopup();
        devType?.children?.[0]?.closePopup();
        column?.closePopup();
    }
    async function initStList(val) {
        let stList = await getJkDevInfoByRetrieval({
            devName: val
        });
        stList = setStlist(stList);
        _msgr.pub('stList', stList);
    }
    return {
        body: {
            type: 'container',
            styles: [
                Styles.size.fullsize,
                Styles.css({
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: 'm',
                    minHeight: '0'
                })
            ],
            components: [
                {
                    type: 'container',
                    class: 'top',
                    styles: [
                        Styles.css({
                            display: 'flex',
                            flexDirection: 'column',
                            fontSize: 'm',
                            width: '100%',
                            gap: 'xs',
                            flexWrap: 'wrap',
                            padding: 'l 0 0 l'
                        })
                    ],
                    selectStyles: [
                        Styles.select.regularSelect,
                        Styles.select.agent.css({
                            width: '16rem'
                        }),
                        Styles.select.cap.css({
                            width: '6rem',
                            textAlign: 'right'
                        })
                    ],
                    tagsStyles: [
                        Styles.css({
                            width: '30rem'
                        }),
                        Styles.tags.cap.css({
                            width: '6rem',
                            textAlign: 'right'
                        })
                    ],
                    components: [
                        {
                            ref: 'region',
                            cap: '区域：',
                            type: 'select',
                            value: '{{regionId}}',
                            placeholder: '-请选择区域-',
                            dataWatcher: 'regionList',
                            rules: {
                                required: true,
                                triggers: ['blur']
                            }
                        },
                        {
                            type: 'filterSelect',
                            childStyles: [
                                Styles.input.regularInput,
                                Styles.input.agent.css({
                                    width: '16rem !important'
                                }),
                                Styles.input.cap.css({
                                    width: '6rem',
                                    textAlign: 'right'
                                })
                            ],
                            props: {
                                cap: '厂站：',
                                data: '{{stList}}',
                                search: '{{stName}}',
                                select: '{{stId}}',
                                placeholder: '-请选择厂站-'
                            },
                            watchers: [
                                {
                                    key: 'stName',
                                    callback: jam.makeDebounce(async function (val) {
                                        initStList(val);
                                    }, 500)
                                },
                                {
                                    key: 'stId',
                                    callback(val) {
                                        let stName = _msgr.get('stName');
                                        if (!hasSt(val)) {
                                            stSelectCacheList.push({
                                                stId: val,
                                                stName: stName
                                            });
                                        }
                                        _msgr.pub('stNameList', getStNames());
                                    }
                                }
                            ]
                        },
                        {
                            ref: 'stName',
                            type: 'tags',
                            cap: '已选厂站：',
                            data: '{{stNameList}}',
                            removable: true,
                            onvaluechange(val) {
                                if (val.length > 0) {
                                    this.closePopup();
                                }
                                setStCacheList(val);
                            }
                        },
                        {
                            ref: 'devType',
                            type: 'filterSelect',
                            childStyles: [
                                Styles.input.regularInput,
                                Styles.input.agent.css({
                                    width: '16rem !important'
                                }),
                                Styles.input.cap.css({
                                    width: '6rem',
                                    textAlign: 'right'
                                })
                            ],
                            props: {
                                cap: '设备类型：',
                                data: '{{devList}}',
                                search: '{{devName}}',
                                select: '{{devId}}',
                                placeholder: '-请选择设备类型-',
                                required: true
                            },
                            watchers: [
                                {
                                    key: 'devName',
                                    callback: jam.makeDebounce(async function (val) {
                                        let rt = jam.cloneDeep(devCacheList);
                                        rt = rt.filter((item) => {
                                            return item?.name?.includes(val);
                                        });
                                        _model.vars.devList = rt;
                                    }, 500)
                                },
                                {
                                    key: 'devId',
                                    callback(val) {
                                        if (!jam.isEmpty(val)) {
                                            let tableNo = null;
                                            for (let item of _model.vars.devList) {
                                                if (item.value === val) {
                                                    tableNo = item.tableNo;
                                                    break;
                                                }
                                            }
                                            tableNo && getColumnListByTableNo(tableNo);
                                            jam.afterNextRepaint(() => {
                                                this.children[0].closePopup();
                                            });
                                            if (!jam.isEmpty(cacheTableNo) && cacheTableNo !== tableNo) {
                                                // 修改设备类型后，清空已选域
                                                setColCacheList([]);
                                                _msgr.pub('columnNameList', []);
                                            }
                                            cacheTableNo = tableNo;
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            type: 'filterSelect',
                            childStyles: [
                                Styles.input.regularInput,
                                Styles.input.agent.css({
                                    width: '16rem !important'
                                }),
                                Styles.input.cap.css({
                                    width: '6rem',
                                    textAlign: 'right'
                                })
                            ],
                            props: {
                                cap: '域：',
                                data: '{{columnList}}',
                                search: '{{colName}}',
                                select: '{{colId}}',
                                placeholder: '-请选择域-'
                            },
                            watchers: [
                                {
                                    key: 'colName',
                                    callback: jam.makeDebounce(async function (val) {
                                        let rt = jam.cloneDeep(colCacheList);
                                        rt = rt.filter((item) => {
                                            return item?.name?.includes(val);
                                        });
                                        _msgr.pub('columnList', rt);
                                    }, 500)
                                },
                                {
                                    key: 'colId',
                                    callback(val) {
                                        let colName = _msgr.get('colName');
                                        if (!hasCol(val)) {
                                            colSelectCacheList.push({
                                                colId: val,
                                                colName: colName
                                            });
                                        }
                                        _msgr.pub('columnNameList', getColNames());
                                    }
                                }
                            ]
                        },
                        {
                            ref: 'column',
                            type: 'tags',
                            cap: '已选域：',
                            data: '{{columnNameList}}',
                            removable: true,
                            onvaluechange(val) {
                                if (val.length > 0) {
                                    this.closePopup();
                                }
                                setColCacheList(val);
                            }
                        },
                        {
                            type: 'wrapper',
                            buttonStyles: [Styles.button.regularButton],
                            styles: [
                                Styles.css({
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItem: 'center',
                                    padding: 'm'
                                })
                            ],
                            components: [
                                {
                                    type: 'button',
                                    cap: '确定',
                                    styles: [
                                        Styles.css({
                                            marginLeft: 's'
                                        })
                                    ],
                                    onclick() {
                                        summonModel();
                                    }
                                },
                                {
                                    type: 'button',
                                    cap: '取消',
                                    styles: [
                                        Styles.css({
                                            marginLeft: 's'
                                        })
                                    ],
                                    onclick() {
                                        const modal = mango.get('openCard');
                                        modal && modal.close();
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],
            onmount: function () {
                _model = this.model;
                _msgr = this.model.msgr;
            },
            onafterrender: async function () {
                let regionList = await getDcRegionList();
                let devList = await getDevTypeList();
                devList = setDevlist(devList);
                _msgr.pub('regionList', regionList || []);
                _msgr.pub('devList', devList || []);
                devCacheList = devList;
                initStList();
            }
        },
        onunmount
    };
};

export default window;
