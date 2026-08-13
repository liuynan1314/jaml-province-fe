import { CurrantComposable, currantComposable } from '@jam/jam-ui';
import { getDetailConf, homeRouter } from '../common';
import { confPath } from '../global';
import { destroyScene, initScene } from '../utils/EngineUtils';
import { getUserLayout, saveUserLayout } from '../utils/pageEditorUtil';
import { getAcColor } from '../utils/acColorParams.js';
import { color } from 'echarts';

import { config } from '../index';
let _model = null;
export function commonHeader() {
    return {
        type: 'wrapper',
        class: 'header',
        showIf: jaml.var(`${rambutan.pathWatcher}@mango`, (path) => {
            if (homeRouter.includes(path)) {
                return !path.includes('home_zj');
            } else {
                return true;
            }
        }),
        components: [
            {
                type: 'projectHeader',
                styles: ['css(height:100%;display:flex;alignItems:center;gap:1rem)'],
                props: {
                    projectTitle: config.sysTitle,
                    logoPath: 'assets/images/NARI_logo.svg'
                }
            },
            {
                type: 'wrapper',
                slot: 'layer',
                styles: ['css(alignItems:center;marginRight:1rem)'],
                descStyles: {
                    button: ['icon.duotone']
                },
                components: [
                    {
                        type: 'button',
                        class: 'composable-action',
                        icon: 'pencil',
                        showIf: '!{{editMode@mango}}&&{{editModeSwitch@mango}}',
                        onmouseenter(e) {
                            jam.popup(e, '编辑页面布局');
                        },
                        onmouseleave(e) {
                            jam.closePopup();
                        },
                        async onclick() {
                            mango.pub('editMode', true);
                            jam.closePopup(100);
                            currantComposable.makePageEditable();
                            // if (currantComposable.center) {
                            //     currantComposable.showCenter();
                            // } else {
                            //     // TODO 后续开发中可以将模块卡片中心替换成实际的注册中心
                            //     // const registerModules = await jam.addResource('modules/registryModules.mjs');
                            //     // jaml(document.body, registerModules.default);
                            //     const registerComponents = await jam.addResource('modules/registryComponents.mjs');
                            //     jaml(document.body, registerComponents.default);
                            // }
                        }
                    },
                    {
                        type: 'button',
                        icon: 'floppy-disk',
                        class: 'composable-action',
                        showIf: '{{editMode@mango}}&&{{editModeSwitch@mango}}',
                        onmouseenter(e) {
                            jam.popup(e, '保存页面布局');
                        },
                        onmouseleave(e) {
                            jam.closePopup();
                        },
                        onclick: jam.makeDebounce(async function (e) {
                            mango.pub('editMode', false);
                            jam.closePopup(100);
                            currantComposable.removePageEditable();
                            const newConfig = CurrantComposable.sortCardsImmutable(currantComposable.config);
                            currantComposable.config = newConfig;
                            currantComposable.oldConfig = newConfig;
                            const cardsIds = getAllCardsIds(newConfig);

                            const oldPropsConfig = JSON.parse(jam.getFromStorage(CurrantComposable.propsStorageName));
                            const newPropsConfig = {};
                            for (let cardId in oldPropsConfig) {
                                if (jam.hasElement(cardsIds, cardId)) {
                                    newPropsConfig[cardId] = oldPropsConfig[cardId];
                                }
                            }

                            rambutan.addRoutes(jam.buildRouters(newConfig, jam.findElement(document.body, '#content')));

                            const userLayout = await getUserLayout();
                            userLayout.layoutConfig = newConfig;
                            saveUserLayout(userLayout);
                            jam.save2Storage(CurrantComposable.propsStorageName, JSON.stringify(newPropsConfig));

                            jam.notify('布局保存成功.', 'info');
                        }, 200)
                    },
                    {
                        type: 'button',
                        icon: 'refresh',
                        showIf: '{{editMode@mango}}&&{{editModeSwitch@mango}}',
                        class: 'composable-action',
                        onmouseenter(e) {
                            jam.popup(e, '使用初始化布局');
                        },
                        onmouseleave(e) {
                            jam.closePopup();
                        },
                        onclick: function () {
                            jam.modalYesNo(
                                '#content',
                                `确定要重置为初始布局吗？所有自定义页面和布局都将被清除`,
                                async () => {
                                    const userLayout = await getUserLayout();
                                    userLayout.layoutConfig = await raspberry.request({ url: `${confPath}nav.json` });
                                    saveUserLayout(userLayout);
                                    location.reload();
                                },
                                () => {},
                                [Styles.click.toFront, 'css(position:absolute;top:30%;left:50%;transform:translate(-50%,-50%);backgroundColor:var(--jam-sys-background-color-deep-primary);boxShadow:0 1rem 1.5rem hsla(0,0%,0%,0.6);padding:1.5rem;font-size:1.125rem;border:2px solid var(--jam-sys-border-color-primary,#80808099);gap:1.5rem)', 'css(selector:.prompt;font-size:1.5rem)']
                            );
                        }
                    },
                    {
                        type: 'button',
                        icon: 'plus',
                        showIf: '{{editMode@mango}}&&{{editModeSwitch@mango}}',
                        class: 'composable-action',
                        onmouseenter(e) {
                            jam.popup(e, '新增空白页面');
                        },
                        onmouseleave(e) {
                            jam.closePopup();
                        },
                        onclick: async function () {
                            jam.closePopup();
                            const configPage = await jam.addResource('modules/addNewPageConfig.mjs');
                            jam.renderModal(document.body, configPage.default, {
                                curtainCSS: {
                                    zIndex: 1
                                }
                            });
                        }
                    },
                    {
                        type: 'button',
                        icon: 'grid-2',
                        cap: '注册中心',
                        class: 'composable-action',
                        showIf: '{{editMode@mango}}&&{{editModeSwitch@mango}}',
                        onclick: async (e) => {
                            document.getElementById('registryCenter').showSheet();
                        }
                    },
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
                            'css(--jam-icon-size:1.8rem;margin:0 0.25rem)',
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
                                styles: ['css(width:9rem;display:flex;flexDirection:column;alignItems:center;gap:0.5rem)'],
                                childStyles: ['css(width:8rem)'],
                                descStyles: {
                                    label: ['icon.duotone']
                                },
                                components: [
                                    {
                                        type: 'button',
                                        cap: '编辑页面布局',
                                        onclick() {
                                            const editModeSwitch = mango.get('editModeSwitch');
                                            mango.pub('editModeSwitch', !editModeSwitch);
                                        },
                                        onmount() {
                                            let _this = this;
                                            const editModeSwitch = mango.get('editModeSwitch');
                                            _this.cap = editModeSwitch ? '退出页面布局' : '编辑页面布局';
                                            mango.sub('editModeSwitch', function (value) {
                                                _this.cap = value ? '退出页面布局' : '编辑页面布局';
                                                if (mango.get('editMode') && !value) {
                                                    mango.pub('editMode', false);
                                                    currantComposable.removePageEditable();
                                                    if (currantComposable.center) {
                                                        jam.removeSelf(currantComposable.center);
                                                    }
                                                }
                                            });
                                        },
                                        onunmount() {}
                                    },
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
        ],
        onmount() {
            _model = this;
        }
    };
}

function getAllCardsIds(pages) {
    let ids = [];
    for (let page of pages) {
        const cards = page?.cards;
        if (!cards) {
            if (page?.pages) {
                ids = jam.mergeArrays(ids, getAllCardsIds(page.pages));
            }
        } else {
            ids = jam.mergeArrays(
                ids,
                cards.map((item) => item.id)
            );
        }
    }
    return ids;
}
