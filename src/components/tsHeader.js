import { homeRouter, homeSceneRouter } from '../common';
import { destroyScene, initScene } from '../utils/EngineUtils';

export function tsHeader() {
    const config = mango.get('config');
    const page = {
        icon: 'city',
        name: '系统首页',
        value: '/home_zj',
        params: {},
        switchable: false,
        children: [
            { name: '全景展示', value: '/home_zj', params: {}, group: '全景展示', hide: true, switchable: true },
            { name: '集控运行', value: '', params: {}, group: '系统首页', hide: true, switchable: true },
            { name: '网安监测', value: '', params: {}, group: '系统首页', hide: true, switchable: true },
            { name: '设备预警', value: '', params: {}, group: '透明变电站', hide: true, switchable: true },
            { name: '统计分析', value: '/statistic/overload_songjian', params: {}, group: '透明变电站', hide: true, switchable: true },
            { name: '辅助决策', value: '', params: {}, group: '透明变电站', hide: true, switchable: true }
        ]
    };
    return {
        type: 'wrapper',
        stylize: 'header',
        class: jaml.var(`${rambutan.pathWatcher}@mango`, (path) => `tsHeader${homeSceneRouter.includes(path) ? ' tsHeader-scene' : ''}`),
        styles: [
            Styles.stylesheet({
                ':scope': {
                    backgroundImage: 'url(assets/images/bg_trans_top.png)',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center left'
                },
                '.jam-main-cap': {
                    fontSize: 'xxl !important',
                    background: 'linear-gradient(180deg, var(--jam-color-primary-default), var(--jam-color-primary-default))',
                    'background-clip': 'text',
                    '-webkit-background-clip': 'text !important',
                    color: 'transparent !important',
                    animation: 'flow 6s linear infinite',
                    fontWeight: 'bold',
                    fontfamily: 'DINPro'
                },
                '.menus': {
                    background: 'transparent',
                    'backdrop-filter': 'blur(5px)',
                    '.menuItem': {
                        width: 'calc(100%/6)',
                        color: 'onprimary'
                    },
                    '.menuItem[state="checked"]': {
                        background: 'linear-gradient(to bottom, var(--jam-color-primary-default), var(--jam-color-primary-default))',
                        backgroundClip: 'text',
                        color: 'transparent !important',
                        '-webkit-background-clip': 'text !important',
                        fontWeight: 'bold'
                    },
                    '.menuItem[state="hovered"]': {
                        background: 'linear-gradient(to bottom, var(--jam-color-primary-subtle), var(--jam-color-primary-default))',
                        backgroundClip: 'text',
                        '-webkit-background-clip': 'text !important',
                        color: 'transparent !important'
                    }
                }
            })
        ],
        showIf: jaml.var(`${rambutan.pathWatcher}@mango`, (path) => {
            if (homeRouter.includes(path)) {
                return path.includes('/home_zj');
            } else {
                return false;
            }
        }),
        components: [
            {
                type: 'headerHasOneLevelMenu',
                styles: ['headerHasOneLevelMenu.basic', 'css(width:62%;height:100%)'],
                props: {
                    title: config.sysTitle,
                    // title: '浙江集控省级节点',
                    menu: page
                }
            },
            {
                type: 'wrapper',
                slot: 'layer',
                styles: ['css(alignItems:center;marginRight:l)'],
                descStyles: {
                    button: ['icon.solid']
                },
                components: [
                    { type: 'dateDisplay' },
                    {
                        type: 'switch',
                        valueKey: 'jam-darkmode@milo',
                        value: jam.darkMode,
                        // value: jam.getSystemDarkMode(),
                        // modifier: (v) => (v === 'auto' ? jam.getSystemDarkMode() : v),
                        // accessor: (v) => (v === jam.getSystemDarkMode() ? 'auto' : v),
                        styles: [Styles.switch.darkmode]
                    },
                    {
                        type: 'themepanel'
                    },
                    {
                        type: 'label',
                        class: 'user',
                        styles: [
                            Styles.icon.duotone,
                            Styles.icon.withborder,
                            'css(--jam-icon-size:1.8rem;margin:0 xs)',
                            Styles.stylesheet({
                                'i.jam-icon.withborder': {
                                    '--size': '1.8rem'
                                }
                            })
                        ],
                        icon: 'user',
                        cap: '{{userInfo.userName}} || "未登陆"',
                        onmouseenter: function (e) {
                            jam.popup(e.target, {
                                type: 'wrapper',
                                styles: ['css(width:9rem;display:flex;flexDirection:column;alignItems:center;gap:s)'],
                                childStyles: ['css(width:8rem)'],
                                descStyles: {
                                    label: ['icon.duotone']
                                },
                                components: [
                                    //   {
                                    //       type: 'button',
                                    //       cap: '编辑页面布局',
                                    //       onclick() {
                                    //           const editModeSwitch = mango.get('editModeSwitch');
                                    //           mango.pub('editModeSwitch', !editModeSwitch);
                                    //       },
                                    //       onmount() {
                                    //           let _this = this;
                                    //           const editModeSwitch = mango.get('editModeSwitch');
                                    //           _this.cap = editModeSwitch ? '退出页面布局' : '编辑页面布局';
                                    //           mango.sub('editModeSwitch', function (value) {
                                    //               _this.cap = value ? '退出页面布局' : '编辑页面布局';
                                    //               if (mango.get('editMode') && !value) {
                                    //                   mango.pub('editMode', false);
                                    //                   currantComposable.removePageEditable();
                                    //                   if (currantComposable.center) {
                                    //                       jam.removeSelf(currantComposable.center);
                                    //                   }
                                    //               }
                                    //           });
                                    //       },
                                    //       onunmount() {}
                                    //   },
                                    {
                                        type: 'button',
                                        cap: '主题面板',
                                        onclick() {
                                            jam.popup(e.target, _model.ref('theme-config'));
                                        }
                                    },
                                    {
                                        type: 'button',
                                        cap: '退出登录',
                                        onclick: function () {
                                            loginOut();
                                        }
                                    }
                                ]
                            });
                        }
                    }
                ]
            }
        ]
    };
}
