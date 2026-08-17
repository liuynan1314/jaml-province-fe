import { urlConfig } from '../../global.js';
import { ajaxCall, exportExcel } from '../../common.js';
// import { createWindow } from '../createWindow.js';
import defectRecord from '../modal/defectRecord.js';
let _model, _msgr;
let fileDataidList = [];
import { getRecordTableData, getTotalData } from '../systemOperatingRecords/operatingRecords.js';
const newBuildLog = (params) => {
    fileDataidList = [];
    // 同时发布空数据到相关主题，确保清理干净

    return {
        type: 'card',
        icon: '',
        cap: params.title,
        class: 'newBuildLogId',
        styles: [
            Styles.card.floating({
                width: '40vw',
                height: '43vh'
            }),
            Styles.stylesheet({
                ':scope': {
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 'm',
                    'box-sizing': 'border-box'
                    // alignItems: 'center'
                },
                '.description-input': {
                    height: '5rem'
                }
            })
        ],
        components: [
            {
                type: 'container',
                styles: ['size.fullsize'],
                components: [
                    {
                        type: 'wrapper',
                        class: 'form-item',
                        childStyles: ['margin(top:1rem;)'],
                        components: [
                            {
                                type: 'select',
                                cap: '区域选择：',
                                icon: 'earth-asia',
                                valueKey: 'addarea',
                                disabled: params.statusName == '已确认' || params.statusName == '处理中',
                                data: '{{regionList}}',
                                styles: [Styles.select.regularStyleNew, 'props(width:50%)'],
                                onvaluechange: function (value) {
                                    _msgr.pub('addarea', value);
                                }
                            },
                            {
                                type: 'input',
                                valueKey: 'addcontent',
                                cap: '运维标题：',
                                disabled: params.statusName == '已确认' || params.statusName == '处理中',
                                styles: [Styles.input.regularStyleNew, 'input.labelslot.margin(0.1rem)', 'props(width:50%)']
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        class: 'form-item',
                        childStyles: ['margin(top:1rem;)'],
                        components: [
                            {
                                type: 'select',
                                cap: '反馈类型：',
                                valueKey: 'addfeedbackType',
                                disabled: params.statusName == '已确认' || params.statusName == '处理中',
                                defaultValue: '',
                                data: [
                                    {
                                        name: '系统问题',
                                        value: 1
                                    },
                                    {
                                        name: '需求反馈',
                                        value: 2
                                    }
                                ],
                                styles: [Styles.select.regularStyleNew, 'props(width:50%)'],
                                onvaluechange: function (value) {
                                    _msgr.pub('addfeedbackType', value);
                                }
                            },
                            {
                                type: 'select',
                                cap: '缺陷类型：',
                                disabled: params.statusName == '已确认' || params.statusName == '处理中',
                                valueKey: 'adddefectType',
                                showIf: '{{addfeedbackType}} == "1"',
                                defaultValue: '',
                                data: [
                                    {
                                        name: '人机界面缺陷',
                                        value: 1
                                    },
                                    {
                                        name: '软件缺陷',
                                        value: 2
                                    },
                                    {
                                        name: '硬件缺陷',
                                        value: 3
                                    },
                                    {
                                        name: '告警信息缺陷',
                                        value: 4
                                    },
                                    {
                                        name: '其它类缺陷',
                                        value: 5
                                    }
                                ],
                                styles: [Styles.select.regularStyleNew, 'props(width:50%)', 'select.labelslot.margin(0)']
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        class: 'form-item',
                        childStyles: ['margin(top:1rem);'],
                        components: [
                            {
                                type: 'filterSelect',
                                class: 'unifycap',
                                disabled: params.statusName == '已确认' || params.statusName == '处理中',
                                props: { cap: '\u3000负责人：', data: '{{assigneeData}}', search: '{{assignname}}', select: '{{addassignee}}', defaultValue: '{{assignname}}' },
                                watchers: {
                                    async assignname(val) {
                                        if (!val || val.length == 0) _msgr.pub('addassignee', '');
                                        getIscUser(val);
                                    }
                                },
                                styles: [Styles.input.regularStyleNew, 'props(width:50%)', 'filterSelect.labelslot.margin(0)'],
                                childStyles: [Styles.css({ width: '100%' })],
                                onvaluechange: function (value) {
                                    let assigneeData = _msgr.get('assigneeData');
                                    if (assigneeData != undefined) {
                                        _msgr.pub('phone', assigneeData ? assigneeData.find((item) => item.value == value).tel : '');
                                    }
                                }
                            },
                            {
                                type: 'input',
                                valueKey: 'phone',
                                defaultValue: '',
                                disabled: params.statusName == '已确认' || params.statusName == '处理中',
                                cap: '联系方式：',
                                styles: [Styles.input.regularStyleNew, 'props(width:50%)', 'input.labelslot.margin(0)']
                            }
                        ]
                    },
                    {
                        type: 'wrapper',
                        class: 'btn-wrapper1',
                        showIf: '{{adddefectType}} == "4"',
                        components: [
                            {
                                type: 'button',
                                class: 'btn refresh-btn',
                                styles: [Styles.defectButton, Styles.button.regularStyleNew],
                                cap: '提取缺陷记录',
                                onclick: function () {
                                    jam.renderModal('#main', defectRecord());
                                }
                            }
                        ]
                    },
                    {
                        type: 'textarea',
                        valueKey: 'desc',
                        defaultValue: '',
                        class: 'description-input',
                        cap: '运维内容：',
                        styles: [Styles.css({ width: '100%', height: '6rem', marginTop: 's' }), 'textarea.labelslot.margin(0)']
                    },
                    {
                        type: 'fileinput',
                        disabled: params.statusName == '已确认' || params.statusName == '处理中',
                        props: { data: '{{datafile}}' },
                        cap: '\u3000\u3000附件：',
                        onvaluechange() {
                            let fileData = this.data.map((item) => item.file);

                            if (this.data.length > 0) {
                                // 检查最后一个文件是否有file属性（只有新上传的文件才会有）
                                const lastFile = fileData[fileData.length - 1];
                                if (lastFile) {
                                    // 确保只在用户新上传文件时才调用getFileUpload
                                    getFileUpload(lastFile);
                                } else {
                                    console.log('跳过getFileUpload调用，这是初始加载的文件数据');
                                }
                            }

                            // 只有在编辑模式下才发布delfile事件
                            if (params.detailId) {
                                _msgr.pub('delfile', []);
                                _msgr.pub('delfile', this.data);
                            }
                        },
                        onclick(e) {
                            e.stopPropagation();
                            getDownLoad(e.target.innerText);
                        },
                        styles: [Styles.css({ marginTop: 's' }), 'fileinput.labelslot.margin(0)']
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
                        onclick: function () {
                            if (params.detailId) {
                                getRecordDetail(params.detailId);
                            } else {
                                _msgr.pub('addcontent', '');
                                _msgr.pub('addfeedbackType', '');
                                _msgr.pub('adddefectType', '');
                                _msgr.pub('addassignee', '');
                                _msgr.pub('assignname', '');
                                _msgr.pub('phone', '');
                                _msgr.pub('desc', '');
                            }
                        }
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
                            let dom = document.querySelector('.newBuildLogId');
                            spoon.removeSelf(dom);
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
                            let reg = /^1[3-9]\d{9}$/.test(_msgr.get('phone'));
                            if (_msgr.get('addcontent') == '') {
                                nutmeg.error('请填写运维标题');
                            } else if (_msgr.get('addfeedbackType') == '') {
                                nutmeg.error('请选择反馈类型');
                            } else if (_msgr.get('assignname') == '') {
                                nutmeg.error('请选择负责人');
                            } else if (_msgr.get('phone') == '') {
                                nutmeg.error('请填写联系方式');
                            } else if (!reg) {
                                nutmeg.error('请填写正确的联系方式');
                            } else if (_msgr.get('desc') == '') {
                                nutmeg.error('请填写运维内容');
                            } else {
                                if (params.detailId) {
                                    getRecordUpdate(params.detailId);
                                } else {
                                    getRecordAdd();
                                }
                            }
                        }
                    }
                ]
            }
        ],
        watchers: [
            {
                key: 'defectDesc@mango',
                callback(val) {
                    _msgr.pub('desc', val);
                }
            }
        ],
        onmount: function () {
            _model = this.model;
            _msgr = this.model.msgr;
            if (!params.detailId) {
                _msgr.pub('file', []);
                _msgr.pub('addcontent', '');
                _msgr.pub('addfeedbackType', '');
                _msgr.pub('adddefectType', '');
                _msgr.pub('addassignee', '');
                _msgr.pub('phone', '');
                _msgr.pub('desc', '');
                _msgr.pub('datafile', '');
                _msgr.pub('assignname', '');
            }
            _msgr.pub('assignname', params.key_ownerName);
        },
        onafterrender: function () {
            getIscUser();
            getRegionList();
            _msgr.pub('file', []);
            _msgr.pub('filevalue', []);
            _msgr.pub('delfile', []);
            _msgr.pub('datafile', []);
            if (params.detailId) {
                getRecordDetail(params.detailId);
            }
        }
    };
};

function getDownLoad(value) {
    if (value.includes('.')) {
        let filevalue = _msgr.get('filevalue');
        let params = {};
        const matchedItem = filevalue.find((item) => item.name === value);
        if (matchedItem) {
            params.id = matchedItem.id;
            // 使用params调用下载接口
            // window.open(urlConfig.getFileDownload.url + '?id=' + params.id);
            // 获取存储在localStorage中的token
            const token = localStorage.getItem('JKZ_NARIKJ_PORTAL_TOKEN') || '';
            // const token = jam.getUrlParam('token');

            // 使用XMLHttpRequest发送带token的请求
            const xhr = new XMLHttpRequest();
            xhr.open('GET', urlConfig.getFileDownload.url + '?id=' + params.id, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr.responseType = 'blob'; // 设置响应类型为blob以处理二进制文件

            // 请求成功处理
            xhr.onload = function () {
                if (this.status === 200) {
                    // 创建下载链接并自动触发下载
                    const blob = new Blob([this.response]);
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = value;
                    document.body.appendChild(a);
                    a.click();

                    // 清理临时对象
                    setTimeout(() => {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 0);
                } else {
                    nutmeg.error('下载失败，请重试');
                }
            };

            // 请求错误处理
            xhr.onerror = function () {
                nutmeg.error('网络错误，请检查网络连接');
            };

            xhr.send();
        }
    }
}

// 新增
function getRecordAdd() {
    let params = {
        content: _msgr.get('addcontent'),
        feedbackType: _msgr.get('addfeedbackType'),
        defectType: _msgr.get('adddefectType'),
        ownerId: _msgr.get('addassignee'),
        tel: _msgr.get('phone'),
        describe: _msgr.get('desc'),
        fileIds: _msgr.get('file'),
        regionId: _msgr.get('addarea')
    };
    jam.ajaxCall({
        urlKey: 'getRecordAdd',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        data: params,
        onsuccess() {
            nutmeg.success('新增成功');
            let dom = document.querySelector('.newBuildLogId');
            spoon.removeSelf(dom);
            getRecordTableData();
            getTotalData();
        }
    });
}

function getRegionList() {
    jam.ajaxCall({
        urlKey: 'getRegionList',
        data: {
            queryProvincial: true
        },
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess(result) {
            const { data } = result;
            const defaultRegion = [
                {
                    name: '全部',
                    value: null
                }
            ];
            let regionList = data.map((item) => {
                return { name: item.regionNameChn, value: item.regionId };
            });
            _msgr.pub('regionList', [...defaultRegion, ...regionList]);
        }
    });
}

function getIscUser(val) {
    jam.ajaxCall({
        urlKey: 'getIscUser',
        data: {
            name: val || ''
        },
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess(result) {
            const { data } = result;
            _msgr.pub(
                'assigneeData',
                data?.map((item) => ({ name: item.name, value: item.id, tel: item.tel }))
            );
        }
    });
}

// 编辑
function getRecordUpdate(id) {
    let params = {};

    // 获取现有文件列表
    let filevalue = _msgr.get('filevalue') || [];
    // 获取要删除的文件列表
    let delfile = _msgr.get('delfile') || [];
    // 获取新上传的文件ID列表
    let newFileIds = _msgr.get('file') || [];
    // 找出要删除的文件ID
    let deletedFileIds = [];
    filevalue.forEach(function (item) {
        delfile.forEach(function (val) {
            if (item.name == val.name) {
                deletedFileIds.push(item.id);
            }
        });
    });

    // 过滤掉"file"值
    deletedFileIds = deletedFileIds.filter((item) => item !== 'file');

    // 计算要保留的原有文件ID（所有原有文件ID减去要删除的文件ID）
    let FileIdsData = filevalue.map((item) => item.id).filter((fileId) => !deletedFileIds.includes(fileId) && fileId !== 'file');

    // 合并保留的原有文件ID和新上传的文件ID
    let allFileIds = [...deletedFileIds, ...newFileIds];

    allFileIds = [...FileIdsData, ...allFileIds];
    params.id = id;
    params.content = _msgr.get('addcontent');
    params.feedbackType = _msgr.get('addfeedbackType');
    params.defectType = _msgr.get('adddefectType');

    params.ownerId = _msgr.get('addassignee') == null ? '' : _msgr.get('addassignee');
    params.tel = _msgr.get('phone');
    params.describe = _msgr.get('desc');
    params.regionId = _msgr.get('addarea');
    params.fileIds = allFileIds;

    jam.ajaxCall({
        urlKey: 'getRecordUpdate',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        data: params,
        onsuccess() {
            nutmeg.success('修改成功');
            let dom = document.querySelector('.newBuildLogId');
            spoon.removeSelf(dom);
            getRecordTableData();
            getTotalData();
        }
    });
}

// 初始
function getRecordDetail(id) {
    // 重置文件ID列表
    fileDataidList = [];
    _msgr.pub('file', []);

    let _params = {};
    let files = [];
    let filevalue;
    _params.id = id;
    jam.ajaxCall({
        urlKey: 'getRecordDetail',
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        data: _params,
        onsuccess(result) {
            const { data } = result;
            _msgr.pub('addcontent', data.content);
            _msgr.pub('addfeedbackType', data.feedbackType);
            _msgr.pub('adddefectType', data.defectType);
            _msgr.pub('addassignee', data.ownerId);
            _msgr.pub('assignname', data.ownerName);
            _msgr.pub('phone', data.tel);
            _msgr.pub('desc', data.describe);
            _msgr.pub('addarea', data.regionId ? data.regionId : '');
            if (data.files.length > 0) {
                // 修改这里：创建与fileinput组件处理后格式一致的数据
                files = data.files.map((item) => ({
                    name: item.fileName,
                    value: item.fileName, // 保持value与name一致
                    onclick() {
                        // 这里可以添加查看文件的逻辑
                    },
                    file: null // 初始加载的文件没有file对象
                }));
                _msgr.pub('datafile', null);
                _msgr.pub('datafile', files);
                filevalue = data.files.map((item) => ({ name: item.fileName, id: item.idStr }));
                _msgr.pub('filevalue', filevalue);
            } else {
                _msgr.pub('file', []);
                _msgr.pub('datafile', null);
                setTimeout(() => {
                    _msgr.pub('datafile', []);
                }, 0);
            }
        }
    });
}

function getFileUpload(files) {
    let formData = new FormData();
    formData.append('file', files);
    jam.ajaxCall({
        urlKey: 'getFileUpload',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'application/json',
            userId: mango.get('userInfo') ? mango.get('userInfo').userId : ''
        },
        onsuccess(result) {
            const { data } = result;
            fileDataidList.push(data.id);
            _msgr.pub('file', fileDataidList);
        }
    });
}

export default newBuildLog;
