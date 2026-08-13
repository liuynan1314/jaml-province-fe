import { ajaxCall, exportExcel } from '../../common.js';
import { urlConfig } from '../../global.js';

let _msgr = null;
let popupHideDelay = null;
let popupController = false;

const powerOutageWindow = (params, devName) => {
    return {
        type: 'wrapper',
        styles: [
            'size.fullsize',
            'padding( 0.5rem 0.5rem 1.5rem 0.5rem )',
            Styles.layout.flex({ direction: 'column', wrap: 'nowrap' }),
            Styles.stylesheet({
                '.btn': {
                    marginLeft: 'calc(100% - 5rem)'
                }
            })
        ],
        components: [
            {
                type: 'button',
                class: 'btn export-btn',
                styles: [Styles.button.regularStyle, Styles.buttonWithexportBg, Styles.size({ width: '4rem' })],
                onclick: function () {
                    exportDetailTableData(params, devName);
                }
            },
            {
                type: 'table',
                styles: [Styles.size.fullsize, Styles.table.regularStyle, Styles.table.showrownum({ style: 'plain' }), 'margin(top:0.5rem)', Styles.size({ width: '100%', height: 'calc(100% - 2.8rem)' })],
                dataWatcher: 'detailTableData',
                dataDef: [
                    {
                        cap: '越限信息',
                        key: 'content',
                        sortable: false
                    },
                    {
                        cap: '变位内容',
                        key: 'bwContent',
                        show: false
                    },
                    {
                        cap: '告警内容',
                        key: 'warnContent',
                        show: false
                    },
                    {
                        cap: '发生时间',
                        key: 'occurTime',
                        sortable: false
                    },
                    {
                        cap: '详情',
                        key: 'isShow',
                        sortable: false,
                        width: '4rem',
                        formatter: function (value) {
                            const details = filterDetails(getFormatterRowData(this));
                            if (!value || !Object.keys(details).length) return '';
                            return jame({
                                type: 'label',
                                cap: '<i class="jam-info">i</i>',
                                onmouseenter: function (e) {
                                    clearTimeout(popupHideDelay);
                                    popupController = false;
                                    jam.popup(e.target, buildTipContent(details), {
                                        position: 'left',
                                        showDelay: 0,
                                        stay: true,
                                        showArrow: false,
                                        dynamic: false,
                                        allowOverflow: true
                                    });
                                },
                                onmouseleave: function () {
                                    popupHideDelay = setTimeout(() => {
                                        if (popupController) return;
                                        jam.closePopup();
                                    }, 300);
                                }
                            });
                        }
                    }
                ]
            }
        ],
        onmount: function () {
            _msgr = this.model.msgr;
        },
        onafterrender: function () {
            getDetailTableData(params);
        }
    };
};

async function getDetailTableData(params) {
    ajaxCall(
        'queryBusPowerLossRecord',
        {
            success(data) {
                data.forEach((item) => {
                    let bwContent = '';
                    let warnContent = '';
                    item.bwContentList?.forEach((im) => {
                        bwContent += im.replace(/\s+/g, '') + '\n';
                    });
                    item.warnContentList?.forEach((im) => {
                        warnContent += im.replace(/\s+/g, '') + '\n';
                    });
                    item.bwContent = bwContent;
                    item.warnContent = warnContent;
                    item.isShow = !!(bwContent || warnContent);
                });
                _msgr.pub('detailTableData', data);
            },
            params: {
                ...params
            },
            useMock: false,
            type: 'post'
        },
        false
    );
}

function exportDetailTableData(params, devName) {
    exportExcel(
        urlConfig.exportBusPowerLoss.url,
        {
            ...params,
            exportDetail: true
        },
        `${devName}失电详情数据.xlsx`,
        'POST'
    );
}

function getFormatterRowData(ctx) {
    const tableData = _msgr?.get('detailTableData') || [];
    const rowIdx = ctx.jamtd?.rowIdx;
    const rawRow = tableData[rowIdx] || {};
    const rowData = ctx.rowData || {};
    return {
        ...rawRow,
        ...rowData,
        bwContent: rawRow.bwContent || rowData.bwContent || rowData['变位内容'] || ctx.col(1),
        warnContent: rawRow.warnContent || rowData.warnContent || rowData['告警内容'] || ctx.col(2)
    };
}

function filterDetails(rowData) {
    const details = {};
    const bwContent = rowData?.bwContent ?? rowData?.['变位内容'];
    const warnContent = rowData?.warnContent ?? rowData?.['告警内容'];
    if (bwContent) {
        details['变位内容'] = bwContent;
    }
    if (warnContent) {
        details['告警内容'] = warnContent;
    }
    return details;
}

function buildTipContent(details) {
    const components = [];
    Object.entries(details).forEach(([key, value]) => {
        components.push({
            type: 'input-textarea',
            cap: key,
            value,
            readOnly: true,
            styles: [Styles.input.autoRows({ maxRows: 8 })]
        });
    });

    return jame({
        type: 'container',
        stylize: 'json',
        styles: [
            'group.divider',
            Styles.css({ minWidth: '24rem', maxWidth: '30rem', paddingTop: '2rem' }),
            Styles.stylesheet({
                ':scope .jam-depth-0': {
                    flexDirection: 'column',
                    flexWrap: 'nowrap',
                    alignItems: 'stretch'
                },
                ':scope jam-input[type=textarea]': {
                    width: '100%',
                    pointerEvents: 'auto'
                },
                ':scope jam-input[type=textarea] textarea': {
                    maxHeight: '12rem',
                    overflowY: 'auto',
                    pointerEvents: 'auto'
                }
            })
        ],
        descStyles: {
            wrapper: [Styles.layout.flex({ direction: 'column', wrap: 'nowrap' }), Styles.layout.overflow({ animaDelay: 400 })],
            '*': [Styles.hover.withbg],
            'table,tags,input': ['animation.entry.frombottom(delay:seq(50,100);easing:bouncing;distance:2rem;duration:400)']
        },
        components: [
            {
                type: 'wrapper',
                class: 'jam-depth-0',
                components
            }
        ],
        onmouseenter: function () {
            popupController = true;
        },
        onmouseleave: function () {
            jam.closePopup();
            popupController = false;
        }
    });
}

export default powerOutageWindow;
