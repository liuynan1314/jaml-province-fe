import { getCardsInPage } from '../utils/commonList';
import { cardSwichConfig } from './../index';
import { COLOR_SET } from '../utils/Constants.js';

export function buildStyleStack() {
    Styles.inputWithCustomizedBgAndIcon = Styles.style({
        desc: '带自定义背景和图标的input框',
        args: {
            backgroundImage: { desc: 'input框背景图', type: 'string' },
            dateIcon: { desc: '自定义图标', type: 'string' },
            timeIcon: { desc: '自定义图标', type: 'string' }
        },
        plugins: [
            Styles.props((el, args) => ({
                '--jam-datepicker-agent-background-image': args?.backgroundImage ? `url(${args?.backgroundImage})` : '',
                '--jam-timepicker-agent-background-image': args?.backgroundImage ? `url(${args?.backgroundImage})` : '',
                '--jam-datepicker-agent-icon': args?.dateIcon ? `url(${args?.dateIcon})` : '',
                '--jam-timepicker-agent-icon': args?.timeIcon ? `url(${args?.timeIcon})` : ''
            })),
            Styles.input.agent.css({
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                marginTop: '0.5px'
                // '--jam-agent-border-radius': '0'
            }),
            Styles.stylesheet('input[type=date]::-webkit-calendar-picker-indicator { background-image: var(--jam-datepicker-agent-icon) }'),
            Styles.stylesheet('input[type=time]::-webkit-calendar-picker-indicator { background-image: var(--jam-timepicker-agent-icon) }')
        ]
    });
    Styles.buttongroupWithCustomBg = Styles.style({
        desc: '带自定义背景的按钮组',
        args: {
            rightBg: { desc: '右侧按钮的背景', type: 'string' },
            centerBg: { desc: '中间位置按钮的背景', type: 'string' },
            leftBg: { desc: '左侧按钮的背景', type: 'string' }
        },
        plugins: [
            Styles.props((el, args) => ({
                '--jam-buttongroup-right-background-image': `url(${args.rightBg})`,
                '--jam-buttongroup-center-background-image': `url(${args.centerBg})`,
                '--jam-buttongroup-left-background-image': `url(${args.leftBg})`,
                width: '10rem',
                height: '2.2rem',
                backgroundColor: 'transparent',
                border: 'none',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                fontSize: 'xl',
                margin: '0 s'
            })),
            Styles.buttongroup.buttonslot.css({
                justifyContent: 'center',
                fontFamily: 'YouSheBiaoTiHei',
                fontSize: 'xl',
                flexWrap: 'nowrap'
            }),
            Styles.stylesheet('jam-button:nth-of-type(1) { background-image: var(--jam-buttongroup-right-background-image) }'),
            Styles.stylesheet('jam-button:nth-of-type(2) { background-image: var(--jam-buttongroup-right-background-image) }'),
            Styles.stylesheet('jam-button:nth-of-type(3) { background-image: var(--jam-buttongroup-center-background-image) }'),
            Styles.stylesheet('jam-button:nth-of-type(4) { background-image: var(--jam-buttongroup-left-background-image) }'),
            Styles.stylesheet('jam-button:nth-of-type(5) { background-image: var(--jam-buttongroup-left-background-image) }')
        ]
    });
    Styles.label.topTitle = Styles.style({
        desc: '顶部标题',
        args: {},
        plugins: [
            Styles.label.capslot.css({
                fontFamily: 'YouSheBiaoTiHei',
                fontSize: 'xl'
            })
        ]
    });
    Styles.table.regularStyle = Styles.style({
        desc: '表格通用样式',
        args: {
            scroll: { desc: '是否开启滚动条', type: 'boolean', default: true }
        },
        plugins: [
            Styles.table.th.css({
                backgroundColor: 'var(--jam-color-primary-veil)',
                borderRadius: '0 !important'
            }),
            Styles.table.fixedrowheight({ height: '2.5rem' }),
            Styles.table.gridline,
            Styles.table.showrownum({ style: 'plain' }),
            Styles.table.thslot.css({
                fontSize: 'm',
                borderColor: 'var(--jam-color-primary-veil)',
                borderRadius: '0 !important'
            }),
            Styles.table.td.css({
                display: 'flex',
                fontFamily: 'SourceHanSansCN-Regular'
            }),
            Styles.table.stripy,
            Styles.table.hovermarker,
            Styles.table.size({
                height: 'calc(100%-0.6rem)'
            }),
            Styles.table.stripy({
                even: 'var(--jam-color-primary-film)',
                odd: 'transparent'
            }),
            Styles.css({
                '--th-border-radius': 0,
                '--td-border-radius': 0,
                '--jam-tdslot-border-radius': 0,
                '--jam-td-color': 'var(--jam-color-fg-muted)',
                '--jam-th-background-color': 'var(--jam-color-primary-film)'
            }),
            Styles.props((el, args) => ({
                overflow: args.scroll ? 'auto' : 'hidden'
            }))
        ]
    });
    Styles.tableStyles = Styles.style({
        desc: '表格通用样式',
        args: {},
        plugins: [
            'table.thslot.border(border:0;radius:0;)',
            'table.gridline',
            Styles.table.showrownum({ style: 'plain' }),
            'padding(0)',
            `table.stripy(odd:transparent;even:var(--jam-color-primary-film))`,
            Styles.table.td.css({
                // color: jam.lumiText(1)
            }),
            Styles.stylesheet({
                ':scope': {
                    '--th-height': '2.5rem',
                    '--table-radius': 0
                },
                '.jam-th': {
                    backgroundColor: COLOR_SET.thbrclr,
                    color: COLOR_SET.firsttextclr,
                    border: 0
                },
                '.jam-th,.jam-td': {
                    borderRadius: '0!important',
                    whiteSpace: 'nowrap'
                }
            }),
            Styles.props((el, args) => ({
                overflow: args.scroll ? 'auto' : 'hidden'
            }))
        ]
    });
    Styles.tableStylesFixedRowGeight = Styles.style({
        desc: '表格通用样式',
        args: {},
        plugins: [
            Styles.tableStyles,
            Styles.table.fixedrowheight({
                height: '2.5rem'
            })
        ]
    });
    Styles.searchBtnsStyles = Styles.style({
        desc: '查询导出按钮样式',
        args: {},
        plugins: [
            'size(height:1.875rem)',
            'border.s',
            Styles.stylesheet({
                ':scope': {
                    whiteSpace: 'nowrap',
                    padding: '0 m',
                    color: 'onprimary'
                },
                '&.search-btn': {
                    background: 'var(--jam-color-primary-subtle)',
                    '&:hover': {
                        background: 'var(--jam-color-primary-default)'
                    }
                },
                '&.jam-cta': {
                    marginRight: 'm'
                }
            }),
            Styles.button.icon.css({
                position: 'relative',
                top: '0.0625rem',
                fontSize: '0.9em',
                boxShadow: 'none'
            }),
            Styles.icon.solid
        ]
    });
    Styles.buttonGroupStyles = Styles.style({
        plugins: [
            Styles.stylesheet({
                ':scope': {
                    '--jam-labelslot-align-self': 'flex-start',
                    '&>span[slot=cap]': {
                        height: '2rem',
                        lineHeight: '2rem',
                        marginTop: 'xs'
                        // color: jam.lumiText(1),
                        // fontSize: 's'
                    },
                    'jam-button': {
                        borderRadius: 's',
                        color: 'onprimary',
                        padding: 's',
                        // borderWidth: '.0625rem',
                        // borderStyle: 'solid',
                        // borderColor: hslaToJamAc('hsla(196, 90%, 30%, 0.4)'),
                        // backgroundImage: `linear-gradient(179.98deg, transparent 0%, ${hslaToJamAc('hsl(201.9, 67.4%, 57.8%)')} 100%)`,
                        // backgroundImage: 'url(./assets/images/btn_group.png)',
                        // backgroundSize: '100% 100%',
                        // backgroundRepeat: 'no-repeat',
                        // transition: 'all .2s ease-in-out',
                        '&>[slot=cap]': {
                            // height: '1.5rem',
                            // lineHeight: '1.5rem'
                        },
                        '&>[slot=icon]': {
                            position: 'relative',
                            top: '0.125rem',
                            minHeight: '1.3rem',
                            minWidth: 'initial'
                        }
                    },
                    'jam-button.jam-checked': {
                        color: 'onprimary'
                        // borderColor: hslaToJamAc('hsla(204, 90%, 30%, 0.4)'),
                        // backgroundImage: `linear-gradient(179.98deg, ${hslaToJamAc('hsl(204, 100%, 50%)')} 0%, transparent 100%)`,
                        // backgroundImage: 'url(./assets/images/btn_group_selected.png)',
                        // '&>[slot=cap]': {
                        //     backgroundImage: 'linear-gradient(-180deg, var(--jam-color-on-primary) 0%, var(--jam-color-primary-default) 100%)',
                        //     '-webkit-background-clip': 'text',
                        //     'text-shadow': `0px 4px 6px 0px ${hslaToJamAc('hsla(204,100%,50%,0.7)')}`,
                        //     backgroundClip: 'text'
                        // }
                    },
                    // 'jam-button:hover': {
                    //     'backdrop-filter': 'brightness(300%)'
                    // },
                    'jam-button,jam-button.jam-checked,jam-button.jam-checked:hover': {
                        // 'backdrop-filter': 'none',
                        // 'background-color': 'transparent'
                    }
                }
            })
        ]
    });
    Styles.buttonGroupStylesWithBgCap = Styles.style({
        plugins: [
            Styles.icon.solid,
            Styles.buttongroup.cap.css({
                height: '1.875rem',
                lineHeight: '1.875rem',
                position: 'relative',
                marginRight: '-0.25rem'
            }),
            Styles.buttongroup.icon.css({
                position: 'relative'
            }),
            Styles.buttongroup.button.css({
                // minWidth: '4.75rem'
                width: 'fit-content',
                height: '1.875rem'
                // minWidth: '5.625rem'
            })
            // 'flex(direction:column)',
            // Styles.buttonGroupStyles,
            // Styles.stylesheet({
            //     ':scope': {
            //         '--gap': '.625rem',
            //         '&>span[slot=cap]': {
            //             display: 'block',
            //             minWidth: '13.2rem',
            //             height: '2.25rem',
            //             lineHeight: '1.25rem',
            //             color: jam.lumiText(1),
            //             paddingLeft: 'l',
            //             backgroundImage: 'url(assets/images/title_third.png)',
            //             backgroundRepeat: 'no-repeat',
            //             backgroundPosition: 'bottom var(--gap) left',
            //             backgroundSize: 'auto 1.875rem'
            //         }
            //     },

            //     '.disabled': {
            //         pointerEvents: 'none',
            //         backdropFilter: 'grayscale(0.9)',
            //         color: '#989898',
            //         position: 'relative'
            //     },
            //     '.disabled::after': {
            //         content: '""',
            //         width: '100%',
            //         height: '100%',
            //         position: 'absolute',
            //         top: 0,
            //         left: 0,
            //         zIndex: -1,
            //         pointerEvents: 'none',
            //         // pointerEvents: 'all',
            //         cursor: 'not-allowed'
            //     }
            // }),
            // Styles.buttongroup.labelslot.css({
            //     alignSelf: 'flex-start'
            // })
        ]
    });
    Styles.capStyle = Styles.style({
        plugins: [
            'flex(direction:column)',
            Styles.stylesheet({
                ':scope': {
                    '&>span[slot=cap]': {
                        display: 'block',
                        minWidth: '13.2rem',
                        height: '2.25rem',
                        lineHeight: '1.25rem',
                        color: 'onprimary',
                        paddingLeft: 'l',
                        backgroundImage: 'url(./../assets/images/title_third.png)',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'bottom var(--gap) left',
                        backgroundSize: 'auto 1.875rem'
                    }
                }
            })
        ]
    });
    Styles.tableTitleStyles = Styles.style({
        desc: '表格标题通用样式',
        args: {},
        plugins: [
            'size(width:100%;height:2.5rem)',
            Styles.icon.solid,
            Styles.stylesheet({
                ':scope': {
                    position: 'relative',
                    // paddingLeft: 'xl',
                    backgroundImage: `linear-gradient(90deg, ${COLOR_SET.thbrclr} 0%, transparent 100%)`,
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '.0625rem',
                    borderBottomColor: 'transparent',
                    borderImageSource: 'linear-gradient(89.97deg, var(--jam-color-outline-muted) 0%, transparent 100%)',
                    borderImageSlice: 1,
                    '&>[slot=cap]': {
                        color: COLOR_SET.firsttextclr,
                        fontSize: 'l',
                        fontWeight: 'bold',
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 'calc(50% - 0.625rem)',
                            left: '0.625rem',
                            width: '1.25rem',
                            height: '1.25rem',
                            // backgroundImage: 'url(./assets/images/title_icon.png)',
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center'
                        },

                        '&::after': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            width: '2rem',
                            height: '.1rem',
                            backgroundImage: 'linear-gradient(to right, var(--jam-color-primary-subtle) 0, var(--jam-color-primary-subtle) 22%, transparent 22%, transparent 39%, var(--jam-color-primary-subtle) 39%, var(--jam-color-primary-subtle) 61%, transparent 61%, transparent 78%, var(--jam-color-primary-subtle) 78%, var(--jam-color-primary-subtle) 100%)'
                        }
                    }
                }
            })
        ]
    });
    Styles.tabButtonStyles = Styles.style({
        desc: 'tab按钮通用样式',
        args: {},
        plugins: [
            'padding(left:s)',
            'layout.flex(justifyContent:center;)',
            Styles.stylesheet({
                ':scope': {
                    'jam-button': {
                        width: '5.5rem',
                        height: '1.875rem',
                        border: 0,
                        borderRadius: 0,
                        fontWeight: '500',
                        fontSize: 's',
                        padding: 's',
                        boxShadow: 'none',
                        '&>[slot=cap]': {
                            height: '1.5rem',
                            lineHeight: '1.5rem'
                        }
                    },
                    'jam-button.jam-checked': {
                        color: 'var(--jam-color-on-primary) !important',
                        '&>[slot=cap]': {
                            backgroundImage: 'linear-gradient(-180deg, var(--jam-color-on-primary) 0%, var(--jam-color-primary-default) 100%)',
                            '-webkit-background-clip': 'text',
                            backgroundClip: 'text'
                        }
                    }
                }
            })
        ]
    });
    Styles.table.regularStyleNew = Styles.style({
        desc: '表格通用样式',
        args: {},
        plugins: [
            Styles.table.thslot.css({
                borderColor: 'transparent',
                borderRadius: '0 !important'
            }),
            Styles.table.gridline,
            Styles.table.showrownum({ style: 'plain' }),
            Styles.table.stripy({
                even: 'var(--jam-color-primary-film)',
                odd: 'transparent'
            }),
            Styles.stylesheet({
                ':scope': {
                    '--th-height': '2.5rem',
                    '--table-radius': 0
                },
                '.jam-th': {
                    backgroundColor: COLOR_SET.thbrclr,
                    color: 'onprimary',
                    border: 0
                },
                '.jam-th,.jam-td': {
                    borderRadius: '0!important'
                },
                '&.jam-show-rownum.jam-rownum-plain .jam-td[jam-pos*=left]:before': {
                    color: 'inherit',
                    content: 'attr(row-num)'
                }
            })
        ]
    });
    Styles.label.cardTitle = Styles.style({
        desc: '卡片title',
        args: {
            size: { desc: '字体大小', type: 'string' },
            showDots: { desc: '是否显示右侧点阵', type: 'boolean', default: true }
        },
        plugins: [
            Styles.props((el, args) => ({
                '--icon-size': args.size,
                fontSize: 'var(--icon-size)',
                fontWeight: 'bold',
                backgroundImage:
                    'linear-gradient(90deg, var(--jam-color-primary-subtle) 0%, var(--jam-color-fg-muted) 40%, var(--jam-color-fg-muted) 50%, var(--jam-color-fg-muted) 60%, var(--jam-color-primary-subtle) 100%)',
                color: 'var(--jam-color-fg-muted)',
                padding: 'calc(var(--icon-size) * 0.5) calc(var(--icon-size) * 0.5) calc(var(--icon-size) * 0.5) calc(var(--icon-size) * 2.5)',
                width: '100%',
                // minWidth: 'calc(var(--icon-size) * 15)',
                position: 'relative'
            })),
            Styles.func(
                function (el, args) {
                    const dom = document.createElement('div');
                    dom.style.width = 'calc(var(--icon-size) * 1.5)';
                    dom.style.height = 'calc(var(--icon-size) * 1.5)';
                    dom.style.borderRadius = '50%';
                    // 已降级: title ornament gradient needs theme primary
                    dom.style.background = 'linear-gradient(135deg, var(--jam-color-primary-default), var(--jam-color-primary-film) 75%)';
                    dom.style.position = 'absolute';
                    dom.style.left = 'calc(var(--icon-size) * 0.35)';
                    dom.style.padding = 'calc(var(--icon-size) * 0.1)';

                    const dom1 = document.createElement('div');
                    dom1.style.background = 'hsl(0, 0%, 18%)';
                    dom1.style.width = '100%';
                    dom1.style.height = '100%';
                    dom1.style.borderRadius = '50%';
                    dom1.style.padding = 'calc(var(--icon-size) * 0.08)';

                    const dom2 = document.createElement('div');
                    dom2.style.background = 'linear-gradient(135deg, hsl(0, 0%, 32%) 10%, transparent)';
                    dom2.style.width = '100%';
                    dom2.style.height = '100%';
                    dom2.style.borderRadius = '50%';
                    dom2.style.padding = 'calc(var(--icon-size) * 0.08)';

                    const dom3 = document.createElement('div');
                    dom3.style.background = 'linear-gradient(135deg, hsl(0, 0%, 20%) 10%, transparent)';
                    dom3.style.borderRadius = '50%';
                    dom3.style.width = '100%';
                    dom3.style.height = '100%';
                    dom3.style.display = 'flex';
                    dom3.style.justifyContent = 'center';
                    dom3.style.alignItems = 'center';

                    const dom4 = document.createElement('div');
                    dom4.style.background = 'var(--jam-color-primary-default)';
                    dom4.style.width = 'calc(var(--icon-size) * 0.3)';
                    dom4.style.height = 'calc(var(--icon-size) * 0.3)';
                    dom4.style.transform = 'rotate(45deg)';

                    const dom5 = document.createElement('div');
                    dom5.style.background = 'var(--jam-color-primary-default)';
                    dom5.style.transform = 'rotate(45deg)';
                    dom5.style.position = 'absolute';
                    dom5.style.width = 'calc(var(--icon-size) * 1.25)';
                    dom5.style.height = 'calc(var(--icon-size) * 0.1)';
                    dom5.style.top = 'calc(var(--icon-size) * 1.15)';
                    dom5.style.left = 'calc(var(--icon-size) * 0.6)';
                    dom5.style.borderRadius = 'calc(var(--icon-size) * 0.05)';

                    dom3.appendChild(dom4);
                    dom2.appendChild(dom3);
                    dom1.appendChild(dom2);
                    dom.appendChild(dom1);
                    dom.appendChild(dom5);
                    this.left = dom;
                    el.appendChild(dom);
                },
                function (el, args) {
                    el.removeChild(this.left);
                }
            ),
            Styles.func(
                function (el, args) {
                    const dom = document.createElement('div');
                    dom.style.width = 'calc(100% - var(--icon-size) * 2)';
                    dom.style.height = 'calc(var(--icon-size) * 0.1)';
                    // 已降级: title underline gradient needs theme primary
                    dom.style.background = 'linear-gradient(135deg, var(--jam-color-primary-default), var(--jam-color-primary-film) 65%)';
                    dom.style.position = 'absolute';
                    dom.style.bottom = 'calc(var(--icon-size) * 0.21)';
                    dom.style.left = 'calc(var(--icon-size) * 1.95)';
                    dom.style.borderRadius = 'calc(var(--icon-size) * 0.05)';

                    this.line = dom;
                    el.appendChild(dom);
                },
                function (el, args) {
                    el.removeChild(this.line);
                }
            ),
            Styles.func(
                function (el, args) {
                    if (args?.showDots || Styles.layer.cardTitle?.args.showDots.default) {
                        const parent = document.createElement('div');
                        const dom = document.createElement('div');
                        parent.style.maskImage = 'linear-gradient(90deg, hsl(0,0%,100%), transparent 90%)';
                        parent.style.position = 'absolute';
                        parent.style.right = 'calc(var(--icon-size) * 0.2)';
                        dom.style.width = 'calc(var(--icon-size) * 10)';
                        dom.style.height = 'calc(var(--icon-size) * 1)';
                        // 已降级: repeating mask/fill needs theme primary
                        dom.style.maskImage = 'repeating-linear-gradient(90deg, var(--jam-color-primary-default), var(--jam-color-primary-default) calc(var(--icon-size) * 0.15), transparent calc(var(--icon-size) * 0.15), transparent calc(var(--icon-size) * 0.4))';
                        dom.style.webkitMaskImage = 'repeating-linear-gradient(90deg, var(--jam-color-primary-default), var(--jam-color-primary-default) calc(var(--icon-size) * 0.15), transparent calc(var(--icon-size) * 0.15), transparent calc(var(--icon-size) * 0.4))';
                        dom.style.backgroundImage = 'repeating-linear-gradient(0deg, var(--jam-color-primary-default), var(--jam-color-primary-default) calc(var(--icon-size) * 0.15), transparent calc(var(--icon-size) * 0.15), transparent calc(var(--icon-size) * 0.4))';
                        this.dot = parent;
                        parent.appendChild(dom);
                        el.appendChild(parent);
                    }
                },
                function (el, args) {
                    if (args.showDots || Styles.layer.cardTitle.args.showDots.default) {
                        el.removeChild(this.dot);
                    }
                }
            )
        ]
    });
    Styles.layer.lightBelt = Styles.style({
        desc: '灯带样式layer',
        args: {
            animation: { desc: '是否开启hover动画', type: 'boolean', defalut: false }
        },
        plugins: [
            Styles.func(
                function (el, args) {
                    if (el.style.position === 'static' || el.style.position === 'unset' || el.style.position === 'static') {
                        el.style.position === 'relative';
                    }
                    let maskPos = 35;
                    let animationMaskPos = 35;
                    let animationMaskPosTarget = 10;
                    let animationStep = 2;
                    const dom = document.createElement('div');
                    dom.slot = 'layer';
                    dom.style.width = '100%';
                    dom.style.height = '100%';
                    dom.style.position = 'absolute';
                    dom.style.top = '0';
                    dom.style.left = '0';
                    // 已降级: light-belt borders/fill need theme primary steps
                    dom.style.borderTop = '0.15rem solid var(--jam-color-primary-film)';
                    dom.style.borderBottom = '0.15rem solid var(--jam-color-primary-subtle)';
                    dom.style.backgroundImage = 'linear-gradient(180deg, var(--jam-color-primary-film) 0, var(--jam-color-primary-film) 70%, var(--jam-color-primary-subtle) 100%)';
                    dom.style.maskImage = `linear-gradient(90deg, transparent 0%, hsl(0, 0%, 100%) ${maskPos}%,hsl(0, 0%, 100%) ${100 - maskPos}%, transparent 100%)`;
                    dom.style.transition = '0.4s all';
                    if (args.animation) {
                        dom.addEventListener('mouseenter', () => {
                            window.requestAnimationFrame(animationFrameFront);
                            dom.style.borderTop = '0.15rem solid var(--jam-color-primary-film)';
                            dom.style.borderBottom = '0.15rem solid var(--jam-color-primary-subtle)';
                        });
                        dom.addEventListener('mouseleave', () => {
                            window.requestAnimationFrame(animationFrameRevert);
                            dom.style.borderTop = '0.15rem solid var(--jam-color-primary-film)';
                            dom.style.borderBottom = '0.15rem solid var(--jam-color-primary-subtle)';
                        });
                        function animationFrameFront() {
                            if (animationMaskPos > animationMaskPosTarget) {
                                animationMaskPos -= animationStep;
                                dom.style.maskImage = `linear-gradient(90deg, transparent 0%, hsl(0, 0%, 100%) ${animationMaskPos}%,hsl(0, 0%, 100%) ${100 - animationMaskPos}%, transparent 100%)`;
                                window.requestAnimationFrame(animationFrameFront);
                            }
                        }
                        function animationFrameRevert() {
                            if (animationMaskPos < maskPos) {
                                animationMaskPos += animationStep;
                                dom.style.maskImage = `linear-gradient(90deg, transparent 0%, hsl(0, 0%, 100%) ${animationMaskPos}%,hsl(0, 0%, 100%) ${100 - animationMaskPos}%, transparent 100%)`;
                                window.requestAnimationFrame(animationFrameRevert);
                            }
                        }
                    }
                    this.lightBelt = dom;
                    el.appendChild(dom);
                },
                function (el, args) {
                    el.removeChild(this.lightBelt);
                }
            )
        ]
    });
    Styles.layer.themeCardStyleLayer = Styles.style({
        desc: '支持主题色的卡片样式layer',
        args: {
            rate: { desc: '底部与头部高度比', type: 'number', defalut: 2 },
            baseHsl: {
                desc: '设置卡片的hsl基础色',
                type: 'string',
                defalut: ''
            }
        },
        plugins: [
            Styles.func(
                function (el, args) {
                    function parseHSL(hslString) {
                        const match = hslString.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/);
                        if (match) {
                            return [parseInt(match[1], 10), parseInt(match[2], 10) + '%', parseInt(match[3], 10) + '%'];
                        } else {
                            throw new Error('Invalid HSL string');
                        }
                    }
                    const dom = document.createElement('div');
                    // 已降级: layer gradients/borders need theme primary (baseHsl override uses raw hsl)
                    let cSubtle = 'var(--jam-color-primary-subtle)';
                    let cDefault = 'var(--jam-color-primary-default)';
                    let cFilm = 'var(--jam-color-primary-film)';
                    if (args.baseHsl) {
                        try {
                            let HSLArr = parseHSL(args.baseHsl);
                            const h = HSLArr[0], s = HSLArr[1], l = HSLArr[2];
                            cSubtle = `hsla(${h}, ${s}, ${l}, 0.45)`;
                            cDefault = `hsl(${h}, ${s}, ${l})`;
                            cFilm = `hsla(${h}, ${s}, ${l}, 0.15)`;
                        } catch (error) {}
                    }
                    dom.slot = 'layer';
                    dom.style.width = '100%';
                    dom.style.height = '100%';
                    dom.style.position = 'absolute';
                    dom.style.top = '0';
                    dom.style.left = '0';
                    dom.style.borderRadius = el.style.borderRadius || 0;
                    dom.style.display = 'grid';
                    dom.style.gridTemplateRows = `3fr ${args.rate || Styles.layer.themeCardStyleLayer.args.rate.defalut}fr`;
                    dom.style.overflow = 'hidden';
                    const dom1 = document.createElement('div');
                    dom1.style.backgroundImage = `linear-gradient(180deg, ${cSubtle} 0, transparent 100%)`;
                    dom1.style.border = `0.1rem solid ${cDefault}`;
                    dom1.style.borderTopLeftRadius = el.style.borderRadius || 0;
                    dom1.style.borderTopRightRadius = el.style.borderRadius || 0;
                    dom1.style.maskImage = 'linear-gradient(180deg, hsl(0, 0%, 100%), transparent 90%)';

                    const dom2 = document.createElement('div');
                    dom2.style.borderBottomLeftRadius = el.style.borderRadius || 0;
                    dom2.style.borderBottomRightRadius = el.style.borderRadius || 0;
                    dom2.style.backgroundImage = `linear-gradient(180deg, ${cFilm} 0, ${cSubtle} 100%)`;
                    dom2.style.border = `0.1rem solid ${cDefault}`;

                    dom.appendChild(dom1);
                    dom.appendChild(dom2);
                    this.themeCardStyleLayer = dom;
                    el.appendChild(dom);
                },
                function (el, args) {
                    el.removeChild(this.themeCardStyleLayer);
                }
            )
        ]
    });
    Styles.layer.stripyButton = Styles.style({
        desc: '灯带样式layer',
        args: {
            strip: { desc: '显示斑马纹', type: 'boolean', default: false },
            bgColor: { desc: '不显示斑马纹时的颜色', type: 'string' },
            stripSize1: { desc: '斑马纹1宽度', type: 'string', default: '1rem' },
            stripColor1: {
                desc: '斑马纹1颜色',
                type: 'string'
            },
            stripSize2: { desc: '斑马纹宽度', type: 'string', default: '1rem' },
            stripColor2: {
                desc: '斑马纹2颜色',
                type: 'string'
            },
            lightHeight: {
                desc: '底部灯条高度',
                type: 'string',
                default: '0.4rem'
            }
        },
        plugins: [
            Styles.props((el, args) => ({
                '--strip-size1': args.stripSize1 || Styles.layer.stripyButton.args.stripSize1.default,
                '--strip-size2': args.stripSize2 || Styles.layer.stripyButton.args.stripSize2.default,
                backgroundColor: 'transparent'
            })),
            Styles.func(
                function (el, args) {
                    function parseHSL(hslString) {
                        const match = hslString.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/);
                        const match2 = hslString.match(/^hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*(0\.\d+|1)\)$/);
                        if (match || match2) {
                            return hslString;
                        } else {
                            throw new Error('Invalid HSL string');
                        }
                    }
                    // 已降级: stripy defaults need theme primary vars (stripy API)
                    let stripColor1 = args.stripColor1 ? parseHSL(args.stripColor1) : 'var(--jam-color-primary-default)';
                    let stripColor2 = args.stripColor2 ? parseHSL(args.stripColor2) : 'var(--jam-color-primary-subtle)';
                    if (el.style.position === 'static' || el.style.position === 'unset' || el.style.position === 'static') {
                        el.style.position === 'relative';
                    }
                    const dom = document.createElement('div');
                    dom.slot = 'layer';
                    dom.style.zIndex = '-1';
                    dom.style.width = '100%';
                    dom.style.height = '100%';
                    dom.style.position = 'absolute';
                    dom.style.top = '0';
                    dom.style.left = '0';
                    dom.style.border = '0.1rem solid var(--jam-color-primary-default)';
                    dom.style.borderRadius = el.style.borderRadius || '0';
                    if (args.strip) {
                        dom.style.backgroundImage = `repeating-linear-gradient(115deg, ${stripColor1} 0%, ${stripColor1} calc(var(--strip-size1)), ${stripColor2} calc(var(--strip-size1)), ${stripColor2} calc(var(--strip-size2) + var(--strip-size2)))`;
                    } else {
                        // dom.style.backgroundColor = args.bgColor || stripColor2;
                        dom.style.backgroundColor = 'hsl(0,0%,43%,0.5)';
                    }
                    let opacityBase1 = 0.6;
                    let opacityBase2 = 0.4;
                    let opacity1 = 0.6;
                    let opacity2 = 0.4;
                    let opacityTarget1 = 1;
                    let opacityTarget2 = 0.6;
                    let step = 0.02;
                    dom.style.maskImage = `linear-gradient(0deg, hsl(0 ,0%, 0% , 1), hsl(0 ,0%, 0% , ${opacity1}) 60%,hsl(0 ,0%, 0% ,${opacity2}) 100%)`;
                    el.addEventListener('mouseenter', () => {
                        window.requestAnimationFrame(animationFrameFront);
                    });
                    el.addEventListener('mouseleave', () => {
                        window.requestAnimationFrame(animationFrameRevert);
                    });
                    function animationFrameFront() {
                        if (opacityTarget1 > opacity1) {
                            opacity1 += step;
                            opacity2 += step;
                            dom.style.maskImage = `linear-gradient(0deg, hsl(0 ,0%, 0% , 1), hsl(0 ,0%, 0% , ${opacity1}) 60%,hsl(0 ,0%, 0% ,${opacity2}) 100%)`;
                            window.requestAnimationFrame(animationFrameFront);
                        }
                    }
                    function animationFrameRevert() {
                        if (opacityBase1 < opacity1) {
                            opacity1 -= step;
                            opacity2 -= step;
                            dom.style.maskImage = `linear-gradient(0deg, hsl(0 ,0%, 0% , 1), hsl(0 ,0%, 0% , ${opacity1}) 60%,hsl(0 ,0%, 0% ,${opacity2}) 100%)`;
                            window.requestAnimationFrame(animationFrameRevert);
                        }
                    }
                    this.stripyButton = dom;
                    el.appendChild(dom);
                },
                function (el, args) {
                    el.removeChild(this.stripyButton);
                }
            ),
            Styles.func(
                function (el, args) {
                    const dom = document.createElement('div');
                    dom.slot = 'layer';
                    dom.style.zIndex = '-1';
                    dom.style.width = '60%';
                    dom.style.height = '0';
                    dom.style.position = 'absolute';
                    dom.style.bottom = '0';
                    dom.style.left = '20%';
                    dom.style.transition = '0.4s all';
                    // 已降级: stripy light bar gradient needs theme primary
                    dom.style.backgroundImage = 'linear-gradient(0deg, var(--jam-color-primary-default), var(--jam-color-primary-default) 20%, var(--jam-color-primary-film)';
                    el.addEventListener('mouseenter', () => {
                        dom.style.height = args.lightHeight || Styles.layer.stripyButton.args.lightHeight.default;
                    });
                    el.addEventListener('mouseleave', () => {
                        dom.style.height = `0`;
                    });
                    this.light = dom;
                    el.appendChild(dom);
                },
                function (el, args) {
                    el.removeChild(this.light);
                }
            )
        ]
    });
    Styles.card.regularCard = Styles.style({
        desc: 'card样式',
        args: {},
        plugins: [
            Styles.icon.solid,
            Styles.layout({ overflow: 'hidden' }),
            Styles.card.padding({ padding: 0 }),
            Styles.card.titleslot.align({ justifyContent: 'flex-start' }),
            Styles.card.titleslot.padding(0),
            Styles.card.titleslot.border({
                bottomRightRadius: '0px',
                bottomLeftRadius: '0px',
                topLeftRadius: '0px',
                topRightRadius: '0px',
                boxSizing: 'border-box'
            }),
            Styles.card.titleslot.background({
                image: 'url(../../assets/images/layer-title.png)',
                size: '100% 100%',
                repeat: 'no-repeat'
            }),
            Styles.card.border({ radius: '0px' }),
            Styles.size.fullsize,
            Styles.css({ backgroundColor: 'transparent' }),
            Styles.card.bodyslot.padding('0'),
            Styles.card.bodyslot.css({
                borderRadius: 0,
                // 已降级: radial body wash needs theme primary film
                background: 'radial-gradient(circle, transparent, var(--jam-color-primary-film)) !important',
                boxSizing: 'border-box'
            }),

            Styles.card.cap.css({
                fontSize: 'm !important',
                color: 'primary'
                // fontFamily: 'YousheBiaoTiHei',
                // paddingLeft: 'l'
            }),
            Styles.props((el, args) => {
                const cards = getCardsInPage();
                const noTitleCards = [];
                cards.forEach((card) => {
                    if (!card?.cap) {
                        noTitleCards.push(card.id);
                    }
                });
                if (cardSwichConfig?.[el?.id]) {
                    const _title = el.querySelector('jam-card>[slot=cap]');
                    jam.addClass(_title, 'jam-card-title-hover');
                    _title.addEventListener('click', () => {
                        console.log('cardSwichConfig2', cardSwichConfig);
                        rambutan.switchTo(cardSwichConfig?.[el?.id], {
                            token: jam.getUrlParam('token')
                        });
                    });
                }

                if (noTitleCards.includes(el.id)) return;
                jaml(el, {
                    type: 'element',
                    styles: [
                        Styles.css({
                            position: 'absolute',
                            // backgroundImage: 'url(../../assets/images/dot_subtitle.png)',
                            backgroundSize: '100% 100%',
                            backgroundRepeat: 'no-repeat',
                            width: '1.2rem',
                            height: '1.2rem',
                            left: '0.6rem',
                            top: '0.6rem'
                        })
                    ]
                });
            })
        ]
    });
    Styles.buttonWithaddBgNew = Styles.style({
        desc: '带新增背景的按钮样式',
        args: {},
        plugins: [
            Styles.button.background({
                image: 'url(../../assets/images/new/but_query.png)',
                repeat: 'no-repeat',
                size: '100% 100%'
            }),
            Styles.button.size({ width: '6rem' }),
            Styles.button.icon.css({
                marginTop: 'xs'
            }),
            Styles.button.cap.css({
                fontSize: 'm'
            })
        ]
    });

    Styles.input.regularStyle = Styles.style({
        desc: '输入框框样式',
        args: {},
        plugins: [
            Styles.input.labelslot.css({ margin: 0 }),

            Styles.input.agent.css({
                height: '1.8rem',
                borderRadius: 's',
                minWidth: '12rem'
            }),

            Styles.input.cap.css({
                fontSize: 's'
            })
        ]
    });
    Styles.input.regularStyleNew = Styles.style({
        desc: '输入框框样式',
        args: {},
        plugins: [
            Styles.input.agent.css({
                height: '1.8rem',
                borderRadius: 's',
                minWidth: '12rem'
            }),
            Styles.input.agent.css({ borderColor: 'var(--jam-color-primary-default)' })
        ]
    });

    Styles.input.regularStyleDiff = Styles.style({
        desc: '输入框框样式',
        args: {},
        plugins: [
            Styles.input.agent.css({
                height: '1.875rem',
                borderRadius: 's',
                width: '8.5rem'
            }),

            Styles.input.agent.css({
                borderColor: 'var(--jam-color-primary-subtle)'
            })
        ]
    });

    Styles.select.regularStyle = Styles.style({
        desc: '下拉选择框样式',
        args: {},
        plugins: [
            Styles.select.labelslot.css({ margin: 0 }),
            Styles.select.agent.css({
                height: '1.8rem',
                borderRadius: 's',
                minWidth: '12rem'
            }),
            Styles.select.cap.css({
                fontSize: 's'
            })
        ]
    });

    Styles.select.regularStyleNew = Styles.style({
        desc: '下拉选择框样式',
        args: {},
        plugins: [
            Styles.select.agent.css({
                height: '1.8rem',
                borderRadius: 's',
                minWidth: '12rem',
                borderColor: 'var(--jam-color-primary-default)'
            })

            // Styles.select.cap.css({
            //     fontSize: 's'
            // }),
        ]
    });

    Styles.select.regularStyleDiff = Styles.style({
        desc: '输入框框样式',
        args: {},
        plugins: [
            Styles.select.agent.css({
                height: '1.875rem',
                borderRadius: 's'
                // backgroundColor: 'tansparent',
                // borderColor: 'rgb(79, 109, 131)'
            })
        ]
    });

    Styles.datepicker.regularStyle = Styles.style({
        desc: '日期选择样式',
        args: {},
        plugins: [
            Styles.datepicker.agent.css({
                minWidth: '12rem',
                height: '1.8rem',
                borderRadius: 's'
            }),

            Styles.datepicker.labelslot.css({ margin: 0 }),

            Styles.datepicker.cap.css({
                fontSize: 's'
            }),

            Styles.inputWithCustomizedBgAndIcon({
                dateIcon: '../../assets/images/icon-calender.png'
            })
        ]
    });

    Styles.datepicker.regularStyleNew = Styles.style({
        desc: '日期选择样式',
        args: {},
        plugins: [
            //   Styles.datepicker.agent.border({ radius: "0 !important" }),
            Styles.datepicker.agent.css({
                minWidth: '12rem',
                height: '1.8rem',
                borderRadius: 's'
            }),

            Styles.datepicker.cap.css({
                color: 'onprimary'
                // fontSize: 's'
            }),
            Styles.datepicker.agent.css({ borderColor: 'var(--jam-color-primary-default)' }),

            Styles.inputWithCustomizedBgAndIcon({
                dateIcon: '../../assets/images/icon-calender.png'
            })
        ]
    });

    Styles.datepicker.regularStyleDiff = Styles.style({
        desc: '日期选择样式',
        args: {},
        plugins: [
            //   Styles.datepicker.agent.border({ radius: "0 !important" }),
            Styles.datepicker.agent.css({
                minWidth: '11.25rem',
                height: '1.8rem',
                borderRadius: 's',
                borderColor: 'var(--jam-color-primary-subtle)'
            })
        ]
    });

    Styles.buttongroupWithCapInTop = Styles.style({
        desc: '标题在顶部的单选按钮组样式',
        args: {},
        plugins: [
            Styles.buttongroup.layout({
                display: 'block',
                position: 'relative'
            }),
            Styles.buttongroup.cap.size({ width: '100%', height: '2.5rem' }),
            Styles.buttongroup.cap.css({
                position: 'absolute',
                top: '-0.5rem',
                background: 'url(../../assets/images/title-bg.png) no-repeat',
                backgroundPosition: '0 50%',
                color: 'onprimary',
                fontSize: 'm',
                fontFamily: 'YousheBiaoTiHei',
                paddingLeft: 'm'
            }),

            Styles.buttongroup.button.css({
                height: '1.7rem',
                padding: '0 m',
                fontSize: 'm',
                alignItems: 'center',
                marginRight: 'm',
                marginBottom: 's',
                color: 'var(--jam-color-fg-muted)',
                borderRadius: 0,
                background: 'url(../../assets/images/select-box.png) no-repeat',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center center'
            }),

            Styles.buttongroup.button.checked({
                background: 'url(../../assets/images/select-box-active.png) no-repeat',
                backgroundSize: '100% 100%',
                color: COLOR_SET.purewhite,
                fontWeight: 700,
                border: 'none'
            }),
            Styles.stylesheet({
                '.disabled': {
                    pointerEvents: 'none',
                    backdropFilter: 'grayscale(0.9)',
                    color: 'var(--jam-color-fg-subtle)',
                    position: 'relative'
                },
                '.disabled::after': {
                    content: '""',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: -1,
                    pointerEvents: 'none',
                    // pointerEvents: 'all',
                    cursor: 'not-allowed'
                }
            })
        ]
    });

    Styles.buttongroupWithCapInTopNew = Styles.style({
        desc: '标题在顶部的单选按钮组样式',
        args: {},
        plugins: [
            Styles.buttongroup.layout({
                display: 'block',
                position: 'relative'
            }),
            Styles.buttongroup.cap.size({ width: '100%', height: '2.25rem' }),
            Styles.buttongroup.cap.css({
                background: 'url(../../assets/images/new/title_level.png) no-repeat left bottom',
                backgroundPosition: 'bottom var(--gap) left',
                color: COLOR_SET.purewhite,
                fontSize: 'm',
                paddingLeft: 'l',
                minWidth: '16rem'
            }),

            Styles.buttongroup.button.css({
                height: '1.875rem',
                'line-height': '1.875rem',
                padding: '0 m',
                fontSize: 'm',
                marginRight: 'm',
                color: 'primary',
                borderRadius: 0,
                background: 'url(../../assets/images/new/but_default.png) no-repeat center center',
                backgroundSize: '100% 100%',
                border: 'none'
            }),

            Styles.buttongroup.button.checked({
                background: 'url(../../assets/images/new/tabbar_tab_selt.png) no-repeat center center',
                backgroundSize: '100% 100%',
                border: 'none',
                'text-shadow': '0px 4px 6px rgba(0, 153, 255, 0.7)',
                'font-family': 'Source Han Sans CN',
                'font-weight': 'regular',
                'letter-spacing': '0',
                color: COLOR_SET.purewhite
            }),

            Styles.button.hover({
                background: 'url(../../assets/images/new/tabbar_tab_selt.png) no-repeat center center',
                backgroundSize: '100% 100%'
            }),
            Styles.stylesheet({
                'jam-button.jam-checked:hover': {
                    background: 'url(../../assets/images/new/tabbar_tab_selt.png) no-repeat center center',
                    backgroundSize: '100% 100%'
                }
            })
        ]
    });

    Styles.buttongroupWithCapInTopDiff = Styles.style({
        desc: '标题在顶部的单选按钮组样式',
        args: {},
        plugins: [
            Styles.buttongroup.layout({
                display: 'block',
                position: 'relative'
            }),
            Styles.buttongroup.css({
                display: 'flex'
            }),
            Styles.buttongroup.cap.css({
                color: COLOR_SET.purewhite
            }),
            Styles.buttongroup.button.css({
                height: '1.875rem',
                'line-height': '1.875rem',
                padding: '0 m',
                fontSize: 'm',
                marginRight: 'm',
                color: 'primary',
                borderRadius: 0,
                background: 'url(../../assets/images/new/but_default.png) no-repeat center center',
                backgroundSize: '100% 100%',
                border: 'none'
            }),

            Styles.buttongroup.button.checked({
                background: 'url(../../assets/images/new/tabbar_tab_selt.png) no-repeat center center',
                backgroundSize: '100% 100%',
                border: 'none',
                'text-shadow': '0px 4px 6px rgba(0, 153, 255, 0.7)',
                'font-family': 'Source Han Sans CN',
                'font-weight': 'regular',
                'letter-spacing': '0',
                color: COLOR_SET.purewhite
            }),

            Styles.button.hover({
                background: 'url(../../assets/images/new/but_default.png) no-repeat center center',
                backgroundSize: '100% 100%',
                boxShadow: 'inset 0px 0px 10px 0px var(--jam-color-primary-default)',
                color: 'var(--jam-color-on-primary) !important'
            })
        ]
    });

    Styles.button.regularStyle = Styles.style({
        desc: '按钮样式',
        args: {},
        plugins: [
            // 已降级: button fill/hover gradients need theme primary vars
            Styles.button.css({
                height: '2rem',
                padding: '0 m',
                borderRadius: 's',
                background: 'linear-gradient(-180deg, transparent 0%, var(--jam-color-primary-subtle) 100%)',
                border: 's solid var(--jam-color-primary-default)',
                fontFamily: 'Source Han Sans CN',
                color: 'onprimary'
            }),

            Styles.button.hover({
                background: 'linear-gradient(-180deg, transparent 0%, var(--jam-color-primary-default) 100%) !important',
                boxShadow: 'inset 0px 0px 10px 0px transparent !important',
                color: 'var(--jam-color-on-primary) !important'
            })
        ]
    });

    Styles.buttonWithQueryBg = Styles.style({
        desc: '带查询背景的按钮样式',
        args: {},
        plugins: [
            Styles.button.background({
                image: 'url(../../assets/images/button-search.png)',
                repeat: 'no-repeat',
                size: '100% 100%'
            })
        ]
    });

    Styles.buttonWithQueryBgNew = Styles.style({
        desc: '带查询背景的按钮样式',
        args: {},
        plugins: [
            Styles.button.background({
                image: 'url(../../assets/images/new/but_query.png)',
                repeat: 'no-repeat',
                size: '100% 100%'
            }),
            Styles.button.css({
                border: 'none'
            }),
            Styles.button.icon.css({
                marginTop: 'xs'
            }),
            Styles.button.size({ width: '6rem' }),
            Styles.button.cap.css({
                fontSize: 'm'
            })
        ]
    });

    Styles.buttonWithexportBg = Styles.style({
        desc: '带导出背景的按钮样式',
        args: {},
        plugins: [
            Styles.button.background({
                image: 'url(../../assets/images/button-export.png)',
                repeat: 'no-repeat',
                size: '100% 100%'
            })
        ]
    });

    Styles.buttonWithResetBg = Styles.style({
        desc: '带重置背景的按钮样式',
        args: {},
        plugins: [
            Styles.button.background({
                image: 'url(../../assets/images/button-reset.png)',
                repeat: 'no-repeat',
                size: '100% 100%'
            })
        ]
    });

    Styles.buttonWithResetBgNew = Styles.style({
        desc: '带重置背景的按钮样式',
        args: {},
        plugins: [
            Styles.button.background({
                image: 'url(../../assets/images/button-reset.png)',
                repeat: 'no-repeat',
                size: '100% 100%'
            }),
            Styles.button.css({
                border: 'none'
            }),
            Styles.button.size({ width: '6rem' }),
            Styles.button.cap.css({
                fontSize: 'm'
            }),
            Styles.stylesheet({
                '.fa-rotate-right': {
                    color: 'var(--jam-color-on-primary) !important'
                }
            })
        ]
    });

    Styles.diffSearchButton = Styles.style({
        desc: '按钮样式',
        args: {},
        plugins: [
            Styles.button.css({
                background: 'url(../../assets/images/search_btn_selected.png) no-repeat',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center center',
                color: 'primary',
                fontSize: 'm',
                marginRight: 'm'
            })
        ]
    });

    Styles.diffButton = Styles.style({
        desc: '按钮样式',
        args: {},
        plugins: [
            Styles.button.css({
                width: 'auto',
                height: '1.875rem',
                background: 'url(../../assets/images/search_btn.png) no-repeat',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center center',
                borderRadius: 's',
                padding: '0 m',
                color: 'primary',
                fontSize: 's',
                marginRight: 'm'
            })
        ]
    });
    Styles.defectButton = Styles.style({
        desc: '弹框按钮样式',
        args: {},
        plugins: [
            Styles.button.css({
                height: '2.4rem',
                padding: 'm',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'm',
                marginLeft: '4vw',
                marginTop: 's',
                marginBottom: 's',
                background: 'url(../../assets/images/new/but_default.png) no-repeat',
                backgroundSize: '100% 100%'
                // background: 'linear-gradient(to right, #4fbdff 50%, #6b95ae),linear-gradient(to bottom, #97bdd3 0%, #376f8f 70%)'
            })
        ]
    });

    Styles.titleLabel = Styles.style({
        desc: '标题样式',
        args: {},
        plugins: [
            Styles.label.layout({
                display: 'block',
                position: 'relative'
            }),
            Styles.label.cap.size({ width: '100%', height: '2.5rem' }),
            Styles.label.cap.css({
                position: 'absolute',
                top: '-0.5rem',
                background: 'url(../../assets/images/title-bg.png) no-repeat',
                backgroundPosition: '0 50%',
                color: COLOR_SET.purewhite,
                fontSize: 'm',
                fontFamily: 'YousheBiaoTiHei',
                paddingLeft: 'm'
            })
        ]
    });

    Styles.toShowAll = Styles.style({
        desc: 'toShowAll',
        args: {},
        plugins: [
            Styles.hover.toShowAll,
            Styles.css({
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            })
        ]
    });
    Styles.connectLine = Styles.style({
        plugins: [
            Styles.css({
                marginRight: 's'
            }),
            Styles.stylesheet({
                ':scope::after': {
                    content: '"-"',
                    width: '0.5rem',
                    height: '100%',
                    position: 'absolute',
                    right: '-0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            })
        ]
    });
    Styles.element.numberAlign = Styles.style({
        args: {
            width: { desc: '宽度', type: 'string', default: '5rem' }
        },
        plugins: [
            (args) =>
                Styles.stylesheet({
                    ':scope span': {
                        width: args.width,
                        textAlign: 'right',
                        display: 'block',
                        justifySelf: 'center'
                    }
                })
        ]
    });
    Styles.badge.timeBadge = Styles.style({
        plugins: [
            Styles.css({
                borderRadius: 's',
                fontSize: 's',
                position: 'ralative',
                top: '0.05rem'
            })
        ]
    });
    Styles.badge.successErrorBadge = Styles.style({
        plugins: [
            Styles.badge.cap.css({
                background: 'hsl(0, 45%, 30%)'
            }),
            Styles.badge.content.css({
                background: 'hsl(108, 35%, 30%)'
            }),
            Styles.stylesheet({
                ':scope span': {
                    minWidth: '3.5rem'
                }
            })
        ]
    });
    Styles.table.ellipsisTable = Styles.style({
        plugins: [
            Styles.stylesheet({
                '.jam-td.overflow span': {
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    wordbreak: 'break-all',
                    display: 'block',
                    width: '100%',
                    cursor: 'pointer'
                }
            })
        ]
    });
    Styles.datepicker.regularDatepicker = Styles.style({
        plugins: [
            Styles.datepicker.agent.css({
                width: '10rem',
                borderRadius: 's',
                // border: '1px solid #1e5e84',
                // background: 'hsl(192,100%,19%)',
                // color: '#edfcff',
                height: '2rem',
                fontSize: 's'
            })
        ]
    });
    Styles.select.regularSelect = Styles.style({
        plugins: [
            Styles.select.agent.css({
                width: '10rem',
                borderRadius: 's',
                // border: '1px solid #1e5e84',
                // background: 'hsl(192,100%,19%)',
                // color: '#edfcff',
                height: '2rem',
                fontSize: 's'
            })
        ]
    });
    Styles.input.regularInput = Styles.style({
        plugins: [
            Styles.input.agent.css({
                width: '10rem',
                borderRadius: 's',
                // border: '1px solid #1e5e84',
                // background: 'hsl(192,100%,19%)',
                // color: '#edfcff',
                height: '2rem',
                fontSize: 's'
            })
        ]
    });
    Styles.button.regularButton = Styles.style({
        plugins: [
            Styles.button.css({
                borderRadius: 's',
                height: '2rem',
                fontSize: 'm',
                // color: '#edfcff',
                // backgroundImage: 'url(../../../../common/img/bigData/btn-bg.png)',
                // backgroundSize: '100% 100%',
                // backgroundRepeat: 'no-repeat',
                minWidth: '3.5rem'
            })
        ]
    });
    Styles.numberAlign = Styles.style({
        args: {
            width: { desc: '数值宽度', type: 'string', default: '2rem' }
        },
        plugins: [
            Styles.stylesheet((el, args) => {
                return {
                    '.numberAlign span': {
                        width: args.width,
                        textAlign: 'right',
                        display: 'block',
                        justifySelf: 'center'
                    }
                };
            })
        ]
    });
    Styles.badge.successBadge = Styles.style({
        plugins: [
            Styles.badge.cap.css({
                background: 'hsl(108, 35%, 30%)'
            }),
            Styles.stylesheet({
                ':scope span': {
                    minWidth: '3.5rem'
                }
            })
        ]
    });
    Styles.badge.errorBadge = Styles.style({
        plugins: [
            Styles.badge.cap.css({
                background: 'hsl(0, 45%, 30%)'
            }),
            Styles.stylesheet({
                ':scope span': {
                    minWidth: '3.5rem'
                }
            })
        ]
    });

    Styles.tabBtnList = Styles.css({
        fontSize: 's',
        padding: '0!important'
    });
    // Styles.table.clickhighlight = Styles.style({
    //     desc: '点击高亮',
    //     args: {
    //         color: {
    //             desc: '颜色',
    //             type: 'string',
    //             shorthand: true,
    //             default: jam.ac({ s: 0.15, l: jam.lumiO(5), a: 0.15 })
    //         },
    //         overlay: { desc: '覆盖', type: 'boolean', default: true }
    //     },
    //     plugins: [
    //         Styles.stylesheet((el, args) => {
    //             return {
    //                 '.jam-td.click-row::after': {
    //                     content: '',
    //                     position: 'absolute',
    //                     left: 0,
    //                     top: 0,
    //                     width: '100%',
    //                     height: '100%',
    //                     boxSizing: 'border-box',
    //                     backgroundColor: args.color,
    //                     zIndex: args.overlay ? 'auto' : -99
    //                 }
    //             };
    //         }),
    //         jam.func(
    //             function (table, args) {
    //                 this.getData(table).inactive = (() => {
    //                     Array.prototype.forEach.call(table.querySelectorAll('.click-row'), (_td) => jam.removeClass(_td, 'click-row'));
    //                 }).bind(this);
    //                 this.getData(table).cb = jam.makeThrottle(
    //                     (e) => {
    //                         const _target = jam.closest(e.target, '.jam-td');
    //                         if (!_target) {
    //                             return;
    //                         }
    //                         const _td = _target.jamtd;
    //                         if (!_td) {
    //                             return;
    //                         }
    //                         if (_td instanceof jam.TomatoTd) {
    //                             this.getData(table).inactive();
    //                             _td.mergedWith.forEach((_merged) => {
    //                                 const _row = table.getDrawedRow(_merged.pKey);
    //                                 _row.forEach((__td) => {
    //                                     __td.mergedWith.forEach((__merged) => jam.addClass(__merged.dom, 'click-row'));
    //                                 });
    //                             });
    //                         } else {
    //                             this.getData(table).inactive();
    //                         }
    //                     },
    //                     400,
    //                     false,
    //                     this
    //                 );
    //                 table.addEventListener('click', this.getData(table).cb, true);
    //             },
    //             function (table, args) {
    //                 table.removeEventListener('click', this.getData(table).cb, true);
    //                 this.removeData(table);
    //             }
    //         )
    //     ]
    // });
}
