import { hslaToJamAc } from '../../utils/Constants.js';
import { ajaxCall, exportExcel, getDetailConf } from './../../common';
import { createWindow } from './../createWindow';

import { urlConfig } from './../../global';

export default function (props, isForTrip, title) {
    let _model, _msgr, saveLoading;
    const fileListMap = new Map();
    return {
        type: 'card',
        icon: '',
        cap: title,
        styles: [
            Styles.card.floating({
                width: '40vw',
                height: isForTrip ? '46vw' : '32vw'
            })
        ],
        components: [
            {
                type: 'wrapper',
                styles: ['size.fullsize', 'padding(1.25rem)', 'flex(direction:column)', 'layout(overflow:hidden;position:relative;)'],
                descStyles: {
                    input: ['input.agent.border(radius:.25rem)', 'css(cursor:auto)'],
                    '.title': [
                        //
                        'padding(left:.625rem)',
                        'background(image:url(./assets/images/title-bg.png);repeat:no-repeat;size:auto .45rem;position:left bottom;)',
                        `cap.text(weight:bold;color:${jam.lumiText(1)})`
                    ]
                },
                buttonStyles: [Styles.searchBtnsStyles],
                components: [
                    {
                        type: 'button',
                        cap: '导出详情',
                        class: 'jam-cta',
                        styles: ['layout(position:absolute;)', 'css(top:.625rem;right:1.25rem;)'],
                        icon: 'cloud-download',
                        onclick: function () {
                            const eventMap = {
                                发生时间: props.occurTime ? jam.formatDate(props.occurTime, 'yyyy-MM-dd HH:mm:ss') : '--',
                                厂站名称: props.stName,
                                间隔名称: props.bayName,
                                设备名称: props.devName,
                                事件等级: props.eventLevelName,
                                告警方式: props.confTypeName,
                                信号数量: isForTrip ? props.hisNum : _model.hisNum,
                                是否及时: props.isTimely,
                                是否准确: props.accuracy,
                                确认时间: props.confirmTime ? jam.formatDate(props.confirmTime, 'yyyy-MM-dd HH:mm:ss') : '--',
                                事件描述: props.content
                            };
                            let faultMap = undefined,
                                actionList = undefined;
                            isForTrip
                                ? ((faultMap = { 发生时间: _model.faultStartTime, 持续时间: _model.faultKeepingTime, ...Object.fromEntries(_model.faultInfo?.map((item) => [item.name, item.value]) || []) }),
                                  (actionList = _model.tripInfo?.map((item) => ({
                                      action: item.name,
                                      time: item.time,
                                      actionClass: item.phase,
                                      value: item.value
                                  }))))
                                : null;
                            exportExcel(urlConfig['exportEventDateToPdf'].url, { eventKey: props.eventKey, eventMap, faultMap, actionList }, props.content + '.pdf');
                        }
                    },
                    {
                        type: 'wrapper',
                        styles: ['flex(direction:column)', isForTrip ? '' : 'size.fullsize'],
                        components: [
                            {
                                type: 'label',
                                class: 'title',
                                cap: '事件详情'
                            },
                            {
                                type: 'wrapper',
                                styles: ['flex(wrap:wrap)', 'margin(top:.625rem )', 'layout(gap:.625rem 1.25rem ;)'],
                                descStyles: { input: ['size(width:calc(calc(100% - 1.25rem) / 2))'] },
                                components: [
                                    {
                                        type: 'input',
                                        disabled: true,
                                        label: '发生时间',
                                        value: jam.formatDate(props.occurTime, 'yyyy-MM-dd HH:mm:ss')
                                    },
                                    {
                                        type: 'input',
                                        disabled: true,
                                        label: '厂站名称',
                                        value: props.stName
                                    },
                                    {
                                        type: 'input',
                                        disabled: true,
                                        label: '间隔名称',
                                        value: props.bayName
                                    },
                                    {
                                        type: 'input',
                                        disabled: true,
                                        label: '设备名称',
                                        value: props.devName?.replace(props.stName, '').trim()
                                    },
                                    {
                                        type: 'input',
                                        disabled: true,
                                        label: '事件等级',
                                        value: props.eventLevelName
                                    },
                                    {
                                        type: 'input',
                                        disabled: true,
                                        label: '告警方式',
                                        value: props.confTypeName
                                    },
                                    isForTrip
                                        ? {
                                              type: 'input',
                                              disabled: true,
                                              label: '信号数量',
                                              value: props.hisNum
                                          }
                                        : {
                                              type: 'input',
                                              disabled: true,
                                              label: '信号数量',
                                              value: '{{hisNum}}'
                                          },

                                    {
                                        type: 'input',
                                        disabled: true,
                                        label: '是否及时',
                                        value: props.isTimely
                                    },
                                    {
                                        type: 'input',
                                        disabled: true,
                                        label: '是否准确',
                                        value: props.accuracy
                                    },
                                    {
                                        type: 'input',
                                        disabled: true,
                                        label: '确认时间',
                                        value: props.confirmTime ? jam.formatDate(props.confirmTime, 'yyyy-MM-dd HH:mm:ss') : '--:--'
                                    },
                                    {
                                        type: 'textarea',
                                        disabled: true,
                                        label: '事件描述',
                                        styles: ['size(width:100%)'],
                                        value: props.content
                                    }
                                ]
                            },
                            {
                                type: 'wrapper',
                                styles: ['margin(top:.625rem)', 'flex(direction:column;)', isForTrip ? '' : 'size.fullsize', isForTrip ? '' : 'layout(overflow:hidden)'],
                                components: [
                                    {
                                        type: 'wrapper',
                                        styles: ['css(justify-content:space-between;)'],
                                        components: [
                                            {
                                                type: 'label',
                                                class: 'title',
                                                styles: ['css(minWidth:10rem)'],
                                                cap: '信号详情'
                                            },
                                            {
                                                type: 'input',
                                                placeholder: '关键字查询',
                                                styles: [Styles.input.regularStyle, 'layout(position:relative)', 'icon.css(position:absolute;right: 1rem;)'],
                                                // styles: ['input.agent.border(radius:.25rem)', 'layout(position:relative)', 'size(width:12rem)', 'icon.css(position:absolute;right: .1rem;)'],
                                                value: '{{searchText}}',
                                                components: [
                                                    {
                                                        type: 'button',
                                                        slot: 'icon',
                                                        styles: ['icon.duotone', 'background(transparent)', 'shadow(none)', 'border(width:0)'],
                                                        icon: 'search'
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'wrapper',
                                        styles: [
                                            isForTrip ? '' : 'size.fullsize',
                                            'padding(.625rem 1.25rem)',
                                            'margin(top:.625rem )',
                                            'layout(overflow:auto)',
                                            `flex(direction:column;)`,
                                            `size(minHeight:4rem;maxHeight:${isForTrip ? '8rem' : 'unset'};)`,
                                            `border(radius:.25rem;color:${hslaToJamAc('hsl(205,56.6%,29.8%)')};style:solid;width:.0625rem)`,
                                            Styles.stylesheet({
                                                'jam-label': {
                                                    '&::before': {
                                                        content: '""',
                                                        width: '.45rem',
                                                        height: '.45rem',
                                                        borderRadius: '50%',
                                                        marginRight: '.5rem',
                                                        backgroundImage: 'linear-gradient(135deg, #02b1f1, black)'
                                                    }
                                                }
                                            })
                                        ],
                                        components: jaml.var('signalDetails', 'searchText', (details, text) =>
                                            details
                                                .filter((item) => !text?.trim() || item.content.includes(text?.trim()))
                                                .map((item) => ({
                                                    type: 'label',
                                                    cap: item.content
                                                }))
                                        )
                                        //  [
                                        //     {
                                        //         buildFor: 'item in _',
                                        //         buildIf: '!{{searchText}}||{{item.content.includes({{searchText}})}}',
                                        //         type: 'label',
                                        //         cap: '{{item.content}}'
                                        //     }
                                        // ]
                                    }
                                ]
                            }
                        ]
                    },
                    isForTrip
                        ? {
                              type: 'wrapper',
                              styles: ['flex(direction:column)', 'layout(overflow:hidden;)', 'margin(top:.625rem)'],
                              components: [
                                  {
                                      type: 'wrapper',
                                      styles: ['layout.flex(justifyContent:space-between)'],
                                      buttonStyles: [Styles.searchBtnsStyles],
                                      components: [
                                          {
                                              type: 'label',
                                              class: 'title',
                                              cap: '录波详情'
                                          },
                                          {
                                              type: 'wrapper',
                                              styles: ['css(alignItems:center)'],
                                              descStyles: { button: ['icon.duotone', 'margin(left:.625rem)', 'size(height:1.875rem)'] },
                                              components: [
                                                  {
                                                      type: 'select',
                                                      styles: ['select.agent.border(radius:.25rem)', 'size(maxWidth:12rem)'],
                                                      value: '{{selectedFile}}',
                                                      data: '{{fileList}}',
                                                      onvaluechange(val) {
                                                          init();
                                                      }
                                                  },

                                                  {
                                                      type: 'button',
                                                      cap: '录波曲线',
                                                      class: 'jam-cta',
                                                      icon: 'line-chart',
                                                      onclick: () => {
                                                          if (!_model.selectedFile) return nutmeg.warn('请选择录波文件');
                                                          createWindow({
                                                              title: '录波曲线',
                                                              width: '60vw',
                                                              height: '37vw',
                                                              showBtn: false,
                                                              body: {
                                                                  type: 'vanilla-iframe',
                                                                  styles: ['size.fullsize', 'padding(top:1.25rem)', 'css(color-scheme:auto;border:none) '],
                                                                  src: getDetailConf('recordWaveCurveUrl') + '?' + encodeURIComponent(`&file_path=${_model.selectedFile}&file_name=${fileListMap.get(_model.selectedFile)?.fileName}`)
                                                              }
                                                          });
                                                      }
                                                  },
                                                  {
                                                      type: 'button',
                                                      cap: '录波文件',
                                                      icon: 'file-export',
                                                      onclick: () => {
                                                          if (!_model.selectedFile) return nutmeg.warn('请选择录波文件');
                                                          ajaxCall('faultFileNameList', {
                                                              params: {
                                                                  filePath: _model.selectedFile,
                                                                  fileName: fileListMap.get(_model.selectedFile)?.fileName
                                                              },
                                                              success(res) {
                                                                  const { zipName, fileArr, flag } = res || {};
                                                                  if (!flag) return nutmeg.warn('未查询到数据!');
                                                                  try {
                                                                      exportExcel(urlConfig['hdrFileDownload'].url, { zipName, fileArr: fileArr instanceof Array ? fileArr.join() : '' }, zipName, 'get');
                                                                  } catch (error) {
                                                                      nutmeg.warn('导出失败!');
                                                                  }
                                                              }
                                                          });
                                                      }
                                                  }
                                              ]
                                          }
                                      ]
                                  },
                                  {
                                      type: 'wrapper',
                                      styles: ['layout.flex(justifyContent:space-between;alignItems:center;)', 'margin(top:.625rem)'],
                                      components: [
                                          {
                                              type: 'buttongroup-radio',
                                              value: '{{tabIndex}}',
                                              styles: [Styles.tabButtonStyles, 'buttongroup.button.size(minWidth:5.5rem;width:auto;)', 'buttongroup.button.padding(0.5rem 0.875rem 0.25rem 0.875rem)'],
                                              data: [
                                                  {
                                                      name: '故障信息',
                                                      value: '1'
                                                  },
                                                  {
                                                      name: '保护动作信息',
                                                      styles: ['button.size(minWidth:7.5rem;width:auto;)'],
                                                      value: '2'
                                                  }
                                              ]
                                          },
                                          {
                                              type: 'wrapper',
                                              buildIf: '{{tabIndex}} === "1"',
                                              styles: ['layout.flex(justifyContent:flex-end;)'],
                                              components: [
                                                  {
                                                      type: 'button',
                                                      cap: '保存',
                                                      showIf: '{{isEdit}}',
                                                      styles: [`background(color:${jam.ac({ l: 0.6, s: 0.8 })})`, 'icon.duotone'],
                                                      icon: 'save',
                                                      onclick: () => {
                                                          const inputElements = jam.findChildren(jam.findElement('jam-wrapper.faultInfo-wrapper'), `jam-input`);
                                                          inputElements.forEach((input) => {
                                                              if (input.hasAttribute('tag')) {
                                                                  const fault = _model.faultInfo.find((item) => item.name === input.getAttribute('tag'));
                                                                  fault.value = input.value;
                                                              }
                                                          });
                                                          updateHdrData(
                                                              () => {
                                                                  _model.isEdit = false;
                                                                  nutmeg.success('保存成功');
                                                              },
                                                              (error) => {
                                                                  nutmeg.error('保存失败');
                                                                  console.error(error);
                                                              }
                                                          );
                                                      }
                                                  },
                                                  {
                                                      type: 'button',
                                                      cap: '取消',
                                                      showIf: '{{isEdit}}',
                                                      styles: ['icon.duotone', 'margin(left:.625rem)'],
                                                      icon: 'close',
                                                      onclick: () => {
                                                          _model.isEdit = false;
                                                      }
                                                  },
                                                  {
                                                      type: 'button',
                                                      cap: '编辑',
                                                      //   buildIf: '{{faultInfo}}',
                                                      showIf: '!{{isEdit}}',
                                                      styles: ['icon.duotone'],
                                                      icon: 'edit',
                                                      onclick: () => {
                                                          _model.isEdit = true;
                                                      }
                                                  }
                                              ]
                                          },
                                          {
                                              type: 'wrapper',
                                              buildIf: '{{tabIndex}} === "2"',
                                              styles: ['layout.flex(justifyContent:flex-end;)'],
                                              components: [
                                                  {
                                                      type: 'button',
                                                      cap: '新增',
                                                      styles: [`background(color:${jam.ac()})`, 'icon.duotone'],
                                                      icon: 'plus',
                                                      onclick: () => {
                                                          if (!_model.tripInfo) return;
                                                          const allInputElements = Array.from(jam.findChildren(jam.findElement('jam-table.trip-info-wrapper'), `jam-input`));
                                                          if (allInputElements.some((input) => !input.getAttribute('disabled'))) {
                                                              return nutmeg.warn('请先保存修改');
                                                          }
                                                          _model.tripInfo.splice(0, 0, {
                                                              name: '',
                                                              time: '',
                                                              phase: '',
                                                              value: 0,
                                                              actions: 'newAdd'
                                                          });
                                                          setTimeout(() => {
                                                              const inputElements = jam.findChildren(jam.findElement('jam-table.trip-info-wrapper'), `jam-input[display-rownum="1"]`);
                                                              inputElements.forEach((input) => input.setAttribute('disabled', false));
                                                          }, 100);
                                                      }
                                                  }
                                              ]
                                          }
                                      ]
                                  },
                                  {
                                      type: 'wrapper',
                                      buildIf: '{{tabIndex}} === "1"',
                                      styles: ['flex(1)', 'layout(overflow:auto)'],
                                      components: [
                                          {
                                              type: 'wrapper',
                                              styles: [
                                                  'flex(wrap:wrap)',
                                                  'layout(gap:.625rem 1.25rem ;)',
                                                  Styles.stylesheet({
                                                      'jam-input': {
                                                          width: 'calc(calc(100% - 1.25rem) / 2)'
                                                          // '[slot=cap]':{
                                                          //     width:'10rem',
                                                          // },
                                                      }
                                                  })
                                              ],
                                              class: 'faultInfo-wrapper',
                                              components: jaml.var('faultInfo', 'isEdit', (faultInfo = [], isEdit) => {
                                                  console.log('faultInfo: ', faultInfo);
                                                  return [
                                                      {
                                                          type: 'input',
                                                          disabled: true,
                                                          styles: ['size.fullwidth'],
                                                          showIf: '{{faultStartTime}}',
                                                          cap: '装置名称',
                                                          value: fileListMap.get(_model.selectedFile)?.relayName
                                                      },
                                                      {
                                                          type: 'input',
                                                          disabled: true,
                                                          showIf: '{{faultStartTime}}',
                                                          cap: '发生时间',
                                                          value: jaml.var('faultStartTime', (startTime) => jam.formatDate(startTime, 'yyyy-MM-dd HH:mm:ss'))
                                                      },
                                                      {
                                                          type: 'input',
                                                          disabled: true,
                                                          showIf: '{{faultKeepingTime}}',
                                                          cap: '持续时间',
                                                          value: '{{faultKeepingTime}}'
                                                      },
                                                      ...(faultInfo?.map((info) => ({
                                                          type: 'input',
                                                          disabled: !isEdit,
                                                          attrs: {
                                                              tag: info.name
                                                          },
                                                          cap: info.name,
                                                          value: info.value
                                                      })) || [])
                                                  ];
                                              })
                                          }
                                      ]
                                  },
                                  {
                                      type: 'wrapper',
                                      buildIf: '{{tabIndex}} === "2"',
                                      styles: ['layout(overflow:hidden)', 'flex(1)'],
                                      components: [
                                          {
                                              type: 'table',
                                              class: 'trip-info-wrapper',
                                              styles: [
                                                  Styles.tableStyles,
                                                  'size.fullsize',
                                                  'layout(overflow:auto)',
                                                  'margin(top:.625rem )',
                                                  Styles.stylesheet({
                                                      'jam-input': {
                                                          input: {
                                                              borderRadius: '.25rem'
                                                          }
                                                      }
                                                  })
                                              ],
                                              plugins: ['popup.tip'],
                                              dataWatcher: 'tripInfo',
                                              dataDef: [
                                                  { key: 'name', attrs: { tag: 'name' }, type: 'input', sortable: false, disabled: true, cap: '动作', width: '25%', styles: [Styles.toShowAll] },
                                                  { key: 'time', attrs: { tag: 'time' }, type: 'input', sortable: false, disabled: true, cap: '时间' },
                                                  { key: 'phase', attrs: { tag: 'phase' }, type: 'input', sortable: false, disabled: true, cap: '相别' },
                                                  { key: 'value', attrs: { tag: 'value' }, type: 'input-number', sortable: false, disabled: true, maxlength: '1', min: 0, max: 1, cap: '变化值' },
                                                  {
                                                      cap: '操作',
                                                      key: 'actions',
                                                      sortable: false,
                                                      styles: ['button.icon.duotone'],
                                                      formatter: function (actions) {
                                                          const isNewAdd = actions === 'newAdd';
                                                          const _self = this; //
                                                          return jame({
                                                              type: 'wrapper',
                                                              styles: ['layout.flex(justifyContent:center;wrap:nowrap)'],
                                                              descStyles: {
                                                                  label: ['icon.duotone', 'css(cursor:pointer;)']
                                                              },
                                                              components: [
                                                                  {
                                                                      type: 'label',
                                                                      state: isNewAdd ? 'isEdit' : 'isView',
                                                                      states: {
                                                                          isView: {
                                                                              tip: '编辑',
                                                                              icon: 'edit'
                                                                          },
                                                                          isEdit: {
                                                                              tip: '保存',
                                                                              icon: 'check'
                                                                          }
                                                                      },
                                                                      onclick: function (e) {
                                                                          e.stopPropagation();
                                                                          const rowNum = _self.getAttribute('display-rownum');
                                                                          const inputElements = jam.findSiblings(_self, `jam-input[display-rownum='${+rowNum}']`);
                                                                          if (this.state === 'isView') {
                                                                              inputElements.forEach((input) => input.setAttribute('disabled', false));
                                                                              this.state = 'isEdit';
                                                                              this.nextSibling.state = this.state;
                                                                          } else {
                                                                              // 保存
                                                                              const info = {};
                                                                              inputElements.forEach((input) => {
                                                                                  info[input.getAttribute('tag')] = input.value;
                                                                                  input.setAttribute('disabled', true);
                                                                              });
                                                                              _model.tripInfo.splice(rowNum - 1, 1, info);
                                                                              updateHdrData(
                                                                                  () => {
                                                                                      nutmeg.success('保存成功');
                                                                                      this.state = 'isView';
                                                                                      this.nextSibling.state = this.state;
                                                                                  },
                                                                                  (error) => {
                                                                                      nutmeg.error('保存失败');
                                                                                      console.error(error);
                                                                                  }
                                                                              );
                                                                          }
                                                                      }
                                                                  },
                                                                  {
                                                                      type: 'label',
                                                                      state: isNewAdd ? 'isEdit' : 'isView',
                                                                      states: {
                                                                          isView: {
                                                                              tip: '删除',
                                                                              icon: 'trash'
                                                                          },
                                                                          isEdit: {
                                                                              tip: '取消',
                                                                              icon: 'close'
                                                                          }
                                                                      },
                                                                      onclick: function (e) {
                                                                          e.stopPropagation();
                                                                          const rowNum = _self.getAttribute('display-rownum');
                                                                          const inputElements = jam.findSiblings(_self, `jam-input[display-rownum='${+rowNum}']`);
                                                                          if (this.state === 'isEdit') {
                                                                              // 取消
                                                                              if (isNewAdd) {
                                                                                  _model.tripInfo.splice(rowNum - 1, 1);
                                                                                  return;
                                                                              }
                                                                              this.state = 'isView';
                                                                              this.previousSibling.state = this.state;
                                                                              inputElements.forEach((input) => {
                                                                                  input.value = _model.tripInfo[rowNum - 1][input.getAttribute('tag')];
                                                                                  input.setAttribute('disabled', true);
                                                                              });
                                                                          } else {
                                                                              jam.popupYesNo(
                                                                                  e.target,
                                                                                  '<span style="white-space:nowrap">确定执行此操作吗?</span>',
                                                                                  () => {
                                                                                      _model.tripInfo.splice(rowNum - 1, 1);
                                                                                      updateHdrData(
                                                                                          () => {
                                                                                              nutmeg.success('删除成功');
                                                                                          },
                                                                                          (error) => {
                                                                                              nutmeg.error('删除失败');
                                                                                              console.error(error);
                                                                                          }
                                                                                      );
                                                                                  },
                                                                                  () => {}
                                                                              );
                                                                          }
                                                                      }
                                                                  }
                                                              ]
                                                          });
                                                      }
                                                  }
                                              ]
                                          }
                                      ]
                                  }
                              ]
                          }
                        : null
                ],
                vars: {
                    tabIndex: '1',
                    isEdit: false
                },
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                    saveLoading = null;
                },
                onafterrender: function () {
                    initEventDetails();
                    isForTrip ? initSelectData() : null;
                }
            }
        ]
    };
    function initEventDetails() {
        ajaxCall('getEventDetails', {
            params: {
                eventKey: props.eventKey
            },
            success(data) {
                _model.signalDetails = data;
                _model.hisNum = data?.length ?? 0;
            }
        });
    }
    async function init() {
        let data = null;
        data = await new Promise((resolve, reject) => {
            ajaxCall('getEventRelayHisUploadRecordData', {
                type: 'post',
                params: {
                    eventKey: props.eventKey //'20673254237118633' //
                },
                success(data) {
                    resolve(data);
                },
                error(error) {
                    console.error('getEventRelayHisUploadRecordData', error);
                    resolve(null);
                }
            });
        });

        if (!data || !data.hasOwnProperty('FaultInfo')) {
            data = await new Promise((resolve, reject) => {
                ajaxCall('queryTripDetail', {
                    params: {
                        filePath: _model.selectedFile,
                        fileName: fileListMap.get(_model.selectedFile)?.fileName
                    },
                    success(data) {
                        resolve(data);
                    },
                    error(error) {
                        console.error('queryTripDetail', error);
                        resolve(null);
                    }
                });
            });
        }

        const { TripInfo = [], FaultInfo = [], FaultKeepingTime, FaultStartTime } = data || {};
        _model.tripInfo = TripInfo;
        _model.faultInfo = FaultInfo;
        _model.faultKeepingTime = FaultKeepingTime;
        _model.faultStartTime = FaultStartTime;
    }
    function initSelectData() {
        ajaxCall('getParamFileNameAndPath', {
            type: 'post',
            params: {
                eventKey: props.eventKey //'20673254237118633' //
            },
            success(data) {
                try {
                    fileListMap.clear();
                    if (data instanceof Array) {
                        _model.fileList = data.map((item) => (fileListMap.set(item.filePath, item), { name: item.fileName, value: item.filePath }));
                        _model.selectedFile = _model.fileList[0]?.value;
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }
    function updateHdrData(success, error) {
        if (!saveLoading) {
            saveLoading = Qmsg.loading('保存中...');
            ajaxCall('updEventRelayHisUploadRecord', {
                type: 'post',
                params: {
                    faultKeepingTime: _model.faultKeepingTime,
                    faultStartTime: _model.faultStartTime,
                    tripInfo: JSON.stringify(
                        _model.tripInfo.map((info) => ({
                            name: info.name,
                            time: info.time,
                            phase: info.phase,
                            value: info.value
                        }))
                    ),
                    faultInfo: JSON.stringify(_model.faultInfo),
                    filePath: _model.selectedFile,
                    fileName: fileListMap.get(_model.selectedFile)?.fileName
                },
                success(data) {
                    saveLoading.close();
                    saveLoading = null;
                    init();
                    typeof success === 'function' && success(data);
                },
                error(err) {
                    saveLoading.close();
                    saveLoading = null;
                    typeof error === 'function' && error(err);
                }
            });
        } else {
            console.warn('正在保存……');
        }
    }
}
