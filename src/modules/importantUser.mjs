import { ajaxCall, loadConf } from '../common.js';
import { getRegionList } from '../utils/commonList.js';
// import { createWindow } from '../components/createWindow.js';
import powerAssuranceWindow from '../components/modal/powerAssuranceWindow.js';
import devDetailsWindow from '../components/modal/devDetailsWindow.js';
let _model = null,
    _msgr = null;
let _thisModel = null;
let tooltip;
let _info = {};
export default {
    type: 'wrapper',
    class: 'importantUser',
    styles: [
        'props(display:flex;flexDirection:column;)',
        'size.fullsize',
        Styles.stylesheet({
            '.importantUser': {
                overflow: 'hidden'
            },
            '.form-box': {
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                marginBottom: '0.5rem',
                border: 's solid var(--jam-color-primary-subtle)',
                backdropFilter: ' blur(24px)'
            },
            '.user-box': {
                width: '100%',
                flex: 1,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
            },
            '.form-item': {
                marginBottom: '.5rem',
                display: 'flex',
                alignItems: 'center'
            },

            '.search_btn': {
                marginLeft: '0.625rem'
            },
            '.bvIcon': {
                width: '0.625rem',
                height: '0.625rem'
            },
            '.bvList': {
                position: 'absolute',
                bottom: 0,
                right: 0,
                justifyContent: 'end'
            },
            '.bvItem': {
                alignItems: 'center'
            },
            '.bvName': {
                fontSize: 's'
            },
            '.userBox': {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                // minHeight: '16.25rem',
                // background: "url('../../assets/images/bg_result.png') no-repeat",
                // backgroundPosition: 'center center',
                // backgroundSize: '100% 100%',
                marginBottom: 'm',
                paddingBottom: 'l'
            },
            '.userType': {
                height: '2.5rem',
                'line-height': '2.5rem',
                // background: "url('../../assets/images/user_sec_title.png') no-repeat",
                // backgroundPosition: 'top left',
                fontSize: 'l',
                fontWeight: 'bold',
                marginTop: 's',
                paddingLeft: 'l'
                // padding
            },
            '.userContent': {
                display: 'flex',
                height: 'auto',
                padding: '0 l',
                'flex-wrap': 'wrap'
            },
            '.userContent>div': {
                position: 'relative',
                width: '10rem',
                height: '11.375rem',
                marginTop: 'l',
                // background: "url('../../assets/images/user_bg_box.png') no-repeat",
                // backgroundPosition: 'center center',
                // backgroundSize: '100% 100%',
                border: 's solid var(--jam-color-primary-default)',
                background: 'tint',
                marginRight: 'm'
            },
            '.userName': {
                width: '100%',
                height: '2.125rem',
                'line-height': '2.125rem',
                'text-align': 'center',
                fonSize: '1.125rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                background: 'accent',
                color: 'onprimary'
            },
            '.userName:hover': {
                background: 'linear-gradient(180deg, #c3e3f0ff 0%, #FFFFFF 100%)',
                '-webkit-background-clip': 'text',
                'background-clip': 'text',
                '-webkit-text-fill-color': 'transparent',
                color: 'transparent'
            },
            '.lineBox': {
                width: '100%',
                height: 'calc(100% - 2.125rem)',
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap'
            },
            '.line_item': {
                width: '50%',
                height: '100%',
                overflow: 'hidden',
                position: 'relative'
            },

            '.green_line': {
                position: 'absolute',
                width: '.0625rem',
                height: 'calc(100% - 2.5rem)',
                left: 'calc(50% - .0625rem)',
                top: '1rem',
                'background-color': 'rgb(185, 72, 66)'
            },

            '.top_text,.left_text,.bottom_text': {
                'text-align': 'center',
                fontSize: 's'
            },

            '.left_text': {
                position: 'absolute',
                top: '2rem',
                left: 'calc(50% + .5rem)'
            },

            '.bottom_text': {
                position: 'absolute',
                bottom: '0.5rem',
                left: '50%',
                transform: 'translate(-50%,0)'
            },

            '.red_line': {
                position: 'absolute',
                width: '.4375rem',
                height: '1.3125rem',
                top: '2rem',
                left: 'calc(50% - .21875rem)',
                border: 's solid #B1220B'
            },
            '.red_line11000': {
                borderColor: '#0000ff'
            },
            '.red_line500': {
                borderColor: '#FF4757'
            },
            '.red_line220': {
                borderColor: '#CD60CD'
            },
            '.red_line110': {
                borderColor: '#2FBCFF'
            },
            '.red_line35': {
                borderColor: '#FAFA8C'
            },
            '.red_line10': {
                borderColor: '#D57F7B'
            },
            '.red_line.brk0': {
                'background-color': 'rgb(4, 35, 45) !important'
            },
            '.kv1000': {
                backgroundColor: '#0000ff'
            },
            '.kv500': {
                backgroundColor: '#FF4757'
            },
            '.kv220': {
                backgroundColor: '#CD60CD'
            },
            '.kv110': {
                backgroundColor: '#2FBCFF'
            },
            '.kv35': {
                backgroundColor: '#FAFA8C'
            },
            '.kv10': {
                backgroundColor: '#D57F7B'
            },
            '.tooltip': {
                position: 'absolute'
            }
        })
    ],

    components: [
        {
            type: 'wrapper',
            class: 'form-box',
            styles: ['size(width:100%)'],
            components: [
                {
                    type: 'wrapper',
                    class: 'form-item',
                    components: [
                        {
                            type: 'buttongroup-radio',
                            cap: '地区:',
                            icon: 'earth-asia',
                            defaultValue: null,
                            valueKey: 'regionId',
                            dataWatcher: 'regionList',
                            styles: [Styles.buttonGroupStyles, 'buttongroup.labelslot.margin(0)'],
                            onvaluechange: function (val) {
                                _msgr.pub('regionId', val);
                                getImportantUserList();
                            }
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'form-item',
                    buttonStyles: [Styles.searchBtnsStyles],
                    components: [
                        {
                            type: 'buttongroup-radio',
                            icon: 'globe-snow',
                            cap: '类型:',
                            defaultValue: null,
                            valueKey: 'type',
                            dataWatcher: 'userTypeList',
                            styles: [Styles.buttonGroupStyles],
                            onvaluechange: function (val) {
                                _msgr.pub('type', val);
                                getImportantUserList();
                            }
                        },
                        {
                            type: 'input',
                            styles: [
                                'props(marginLeft:2rem;)',
                                Styles.input.regularStyleDiff,
                                Styles.input.agent.css({
                                    borderColor: 'var(--jam-color-primary-subtle)'
                                })
                            ],
                            cap: '用户名称：',
                            defaultValue: '',
                            valueKey: 'name'
                        },
                        {
                            type: 'button',
                            class: 'jam-cta',
                            cap: '查询',
                            icon: 'magnifying-glass',
                            onclick: function (e) {
                                getImportantUserList();
                            }
                        },
                        {
                            type: 'button',
                            cap: '新增用户',
                            icon: 'plus',
                            onclick: function (e) {
                                openWindow();
                            }
                        }
                    ]
                },
                {
                    type: 'wrapper',
                    class: 'form-item bvList',
                    components: [
                        {
                            type: 'wrapper',
                            buildFor: '(item,index) in bvList',
                            class: 'bvItem',
                            components: [
                                {
                                    type: 'label',
                                    class: '"bvIcon kv"+{{item}}',
                                    cap: ' '
                                },
                                {
                                    type: 'label',
                                    class: 'bvName',
                                    cap: '{{item}}+"kV"'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type: 'wrapper',
            class: 'user-box'
        }
    ],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onunmount: function () {
        mango.unsub('_closeWindow');
        document.body.removeChild(tooltip);
    },
    onafterrender: function () {
        // console.log('config', config);
        mango.sub('_closeWindow', (val) => {
            jam.closeTopModal();
            mango.pub('_closeWindow', null);
            if (val == 1) {
                getImportantUserList();
            }
        });
        initBvList();
        getRegionList(_model, _msgr);
        getUserType();
        getImportantUserList();
    }
};

function initBvList() {
    const bvList = loadConf('config.json', {})?.bvList || [];
    console.log('bvList', bvList);
    _model.vars.bvList = bvList;
}
function getUserType() {
    ajaxCall(
        'getUserTypeList',
        {
            success(data) {
                const defaultRegion = [
                    {
                        name: '全部',
                        value: null
                    }
                ];
                const userList = data.map((item) => {
                    return { name: item.name, value: item.value };
                });
                _msgr.pub('userTypeList', [...defaultRegion, ...userList]);
            },
            params: {},
            useMock: false,
            type: 'get'
        },
        false
    );
}

function getImportantUserList() {
    const params = getParams() || {};
    ajaxCall(
        'queryPowerProtectScene',
        {
            success(data) {
                const grouped = data.reduce((acc, item) => {
                    const subType = item.subType;
                    if (!acc[subType]) {
                        acc[subType] = [];
                    }

                    acc[subType].push(item);
                    return acc;
                }, {});

                const userList = Object.keys(grouped).map((subType) => ({
                    subType,
                    list: grouped[subType]
                }));
                drawUser(userList);
            },
            params: params,
            useMock: false,
            type: 'post'
        },
        false
    );
}

function drawUser(data) {
    let _html = ``;
    data.forEach((item) => {
        _html +=
            `
        <div class="userBox">
            <div class="userType">` +
            item.subType +
            `</div>
            <div class="userContent">`;
        item.list.forEach((em) => {
            _html += `<div class="_box" _info= ` + JSON.stringify(em) + `><div class="userName">` + em.name + `</div><div class="lineBox">`;
            em.fhList.forEach((im) => {
                const i = im.ivalue ? im.ivalue + 'A' : '';
                let lineName = '';
                let brkName = '';
                if (im.fhNo && im.fhNo != 'null') {
                    lineName = im.fhNo;
                    // for (let i = 0; i < im.fhNo.length; i++) {
                    //     lineName += '<span style="display:block">' + im.fhNo[i] + '</span>';
                    // }
                }
                if (im.brkNo && im.brkNo != 'null') {
                    brkName = im.brkNo;
                }
                const _bv = im.bvName?.replace('kV', '');
                _html +=
                    `
            <div class="line_item">
                <div class="top_text">` +
                    i +
                    `</div>
                <div class="green_line kv` +
                    _bv +
                    `"></div>
                <div class="left_text">` +
                    brkName +
                    `</div>
                <div class="red_line kv` +
                    _bv +
                    ` red_line` +
                    _bv +
                    ` brk` +
                    im.brkState +
                    `"></div>
                <div class="bottom_text">` +
                    lineName +
                    `</div>
            </div>
            `;
            });
            _html += `</div></div>`;
        });
        _html += `</div>
        </div>`;
    });
    const _div = document.querySelector('.user-box');
    _div.textContent = '';
    _div.innerHTML = _html;
    document.querySelectorAll('._box').forEach((item) => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 20px 12px rgba(0, 0, 0, 0.15)';
        });

        item.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
    });
    if (document.querySelector('.tooltip')) {
        document.querySelector('.tooltip').remove();
    }
    tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.width = '10rem';
    tooltip.style.position = 'absolute';
    tooltip.innerHTML = `
                <div class="tooltip-buttons">
                    <button class="tooltip-btn btn-edit"><i class="fas fa-edit"></i>   编辑</button>
                    <button class="tooltip-btn btn-detail"><i class="fas fa-info-circle"></i>   详情</button>
                    <button class="tooltip-btn btn-delete"><i class="fas fa-trash"></i>   删除</button>
                </div>
            `;

    // 添加到文档
    document.body.appendChild(tooltip);

    document.querySelector('.tooltip').style.position = 'absolute';
    document.querySelector('.tooltip').style.borderRadius = '10px';
    document.querySelector('.tooltip').style.boxShadow = '0 5px 25px rgba(0, 0, 0, 0.2)';
    document.querySelector('.tooltip').style.padding = '5px';
    document.querySelector('.tooltip').style.width = '15rem';
    document.querySelector('.tooltip').style.zIndex = '100';
    document.querySelector('.tooltip').style.transform = 'translateY(10px)';
    document.querySelector('.tooltip').style.opacity = 0;
    document.querySelector('.tooltip').style.transition = 'all 0.3s ease';

    document.querySelector('.tooltip').style.background = 'rgba(255, 255, 255, 0.25)';
    document.querySelector('.tooltip-buttons').style.display = 'flex';
    document.querySelector('.tooltip-buttons').style.justifyContent = 'space-around';
    const tooltipButtons = document.querySelectorAll('.tooltip-btn');
    const colorList = [jam.acToken[0](), jam.acToken[1](), jam.acToken[2]()];
    tooltipButtons.forEach((btn, index) => {
        btn.style.width = '4rem';
        btn.style.height = '2rem';
        btn.style.lineHeight = '2rem';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'space-around';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.3s ease';
        btn.style.fontSize = '0.875rem';
        btn.style.backgroundColor = colorList[index];
        btn.style.border = 'none';
        btn.style.boxShadow = '0 4px 8px rgba(86, 73, 73, 0.1)';
        btn.style.position = 'relative';

        btn.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        });

        btn.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
    });

    const deleteBtn = tooltip.querySelector('.btn-delete');
    const editBtn = tooltip.querySelector('.btn-edit');
    const detailBtn = tooltip.querySelector('.btn-detail');

    deleteBtn.addEventListener('click', (e) => {
        jam.popupYesNo(
            e.target,
            '确认删除此用户',
            () => {
                deletePowerProtectScene(_info.id);
            },
            () => {}
        );
        tooltip.classList.remove('visible');
    });

    editBtn.addEventListener('click', () => {
        tooltip.classList.remove('visible');
        openWindow(_info);
    });

    detailBtn.addEventListener('click', (e) => {
        jam.renderModal('#main', devDetailsWindow(_info));

        // _thisModel = createWindow({
        //     title: '用户详情',
        //     width: '80vw',
        //     height: '65vh',
        //     icon: '',
        //     body: devDetailsWindow(_info),
        //     showBtn: false
        // });
        tooltip.classList.remove('visible');
    });
    document.querySelectorAll('._box').forEach((target) => {
        target.addEventListener('mouseenter', (e) => {
            _info = e.target.getAttribute('_info') ? JSON.parse(e.target.getAttribute('_info')) : {};
            const rect = target.getBoundingClientRect();
            const tooltipWidth = tooltip.offsetWidth;
            const leftPosition = rect.left + rect.width / 2 - tooltipWidth / 2;

            const viewportWidth = window.innerWidth;
            let adjustedLeft = leftPosition;

            if (leftPosition < 10) {
                adjustedLeft = 10;
            } else if (leftPosition + tooltipWidth > viewportWidth - 10) {
                adjustedLeft = viewportWidth - tooltipWidth - 10;
            }
            tooltip.style.left = `${adjustedLeft}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.opacity = 1;
        });

        target.addEventListener('mouseleave', () => {
            tooltip.style.opacity = 0;
        });
    });

    tooltip.addEventListener('mouseenter', () => {
        tooltip.style.opacity = 1;
    });

    tooltip.addEventListener('mouseleave', () => {
        tooltip.style.opacity = 0;
    });
}

function deletePowerProtectScene(id) {
    ajaxCall(
        'deletePowerProtectScene',
        {
            success(res) {
                nutmeg.success('删除成功');
                getImportantUserList();
            },
            params: {
                sceneId: id
            },
            useMock: false,
            type: 'get'
        },
        false
    );
}

function getParams() {
    const name = _msgr.get('name') || undefined;
    const type = 1;
    const subType = _msgr.get('type') || undefined;
    const regionId = _msgr.get('regionId') || undefined;
    return {
        name,
        type,
        subType,
        regionId
    };
}

function openWindow(object) {
    const title = object ? '编辑保电用户' : '新增保电用户';
    jam.renderModal(
        '#main',
        powerAssuranceWindow({
            _titel: title,
            type: 1,
            ...object
        })
    );

    // _thisModel = createWindow({
    //     title: title,
    //     width: '25vw',
    //     height: '50vh',
    //     icon: '',
    //     body: powerAssuranceWindow({
    //         type: 1,
    //         ...object
    //     }),
    //     showBtn: false
    // });
}
