import { currantComposable, CurrantComposable } from '@jam/jam-ui';
import * as echarts from 'echarts';
import 'echarts-gl';
globalThis.axios = require('axios');
import moment from 'moment';
globalThis.moment = moment;
import { confPath, OPT_CONF, acColor } from './utils/Constants';
import { ajaxCall, getDetailConf, loadConf, homeRouterWatcher, isValidHttpOrRelativeUrl } from './common';
import { getIndexRegionList } from './utils/commonList';
import './css/main.scss';
import registryComponents from './modules/registryComponents.mjs';
import { initModuleInfos } from './utils/pageEditorUtil.js';
import { buildStyleStack } from './styles/index.js';
import './components/main.js';
import { mockPath, urlConfig } from './global.js';
import { commonHeader } from './components/commonHeader.js';
import { tsHeader } from './components/tsHeader.js';
import { initRootFontScale } from './utils/rootFontScale';
import { registerCmpts } from './utils/nuspUtil';
import { getMenuColor } from './utils/styleUtil.js';

initRootFontScale();
rambutan.use('hash');
raspberry.use('axios');
raspberry.shouldUseMock((error) => {
    return true;
});
raspberry.optionBuilder = (o) => {
    let url, mock;
    let useMock = jam.getUrlParam('useMock', false) === 'true' || o.useMock;
    url = 'urlKey' in o ? urlConfig[o.urlKey].url : 'url' in o ? o.url : '';
    mock = 'urlKey' in o ? urlConfig[o.urlKey].mock : 'mock' in o ? o.mock : '';
    if (mock && typeof mock === 'object') {
        const blob = new Blob([JSON.stringify(mock)], { type: 'application/json' });
        mock = URL.createObjectURL(blob);
    } else if (mock && typeof mock === 'string' && !mock.includes(mockPath)) {
        mock = `${mockPath}${mock}`;
    }
    if (useMock) {
        url = mock ? mock : url;
    }
    return jam.assign(o, {
        headers: {
            Authorization: 'Bearer ' + jam.getUrlParam('token') || '',
            'USER-RESP-AREA': JSON.parse(jam.getFromStorage('USER_RESP_AREA'))?.curRespValue || ''
        },
        url,
        mock
    });
};
export let config = null;
export let cardSwichConfig = null;
export let sidebar = null;
jam.Theme.default = 'NUSP';
initHtmlFontSize();
globalThis.echarts = echarts;
jam.mapPath = 'assets/mapProfile/';
rambutan.resources = ['assets/lib/jam-map-util.mjs'];

//注册cc组件 想同步可以await，支持传入组件名称
// cc.ccStyles(
//     Styles.css({
//         '--title-size': '1.2rem',
//         '--value-size': '1.4rem'
//     })
// );
jam.NutmegNotify.config({
    paddingTop: '4rem',
    position: 'right',
    defaultType: 'card',
    styles: [Styles.notify.bigicon, Styles.icon.duotone],
    levels: {
        info: { icon: 'info-circle' },
        warn: { icon: 'triangle-exclamation' },
        error: { icon: 'bomb' },
        success: { icon: 'circle-check' },
        hurray: { icon: 'party-horn' }
    }
});

window.addEventListener('load', async () => {
    await cc.registerCC(null);
    // buildStyleStack();
    jam.logLevel = 3; // 日志等级
    // Styles.color.accent(acColor).applyTo(document.body); // 主题色
    // document.documentElement.style.setProperty('--jam-ui-color-accent', acColor);
    // if (process.env.NODE_ENV === 'production') {
    //     document.documentElement.style.setProperty('color-scheme', 'light');
    // } else {
    // }
    config = (await raspberry.request({ url: `${confPath}/config.json` })) || {};
    cardSwichConfig = (await raspberry.request({ url: `${confPath}/cardSwichConfig.json` })) || {};

    mango.pub('cardSwichConfig', cardSwichConfig);
    mango.pub('config', config);
    Object.entries(OPT_CONF).forEach(([k, v]) => {
        OPT_CONF[k] = v;
    });
    init(config);
    getIndexRegionList();

    tomato.sub('shortcutclick', (_data) => {
        if (_data.url) {
            if (isValidHttpOrRelativeUrl(_data.url)) {
                // url是一个网页地址
                if (_data.url.includes('osp/bscs/event/index.html')) {
                    dealingAlarm(_data);
                } else {
                    window.open(_data.url, '_blank');
                }
            } else {
                // 内部卡片
                mango.pub('openCard', {
                    card: _data.url,
                    id: _data.id,
                    timespace: Date.now()
                });
            }
        }
    });
});

// 设置默认主题
jam.Theme.default = 'NUSP';
if (!milo.get('jam-swatch')) {
    milo.pub('jam-swatch', '蓝色系');
}

async function init(config) {
    await initModuleInfos();
    const ospMenuCheck = config?.ospMenuCheck;
    sidebar = await raspberry.request({ url: `${confPath}sidebar.json` });
    let conf = await raspberry.request({ url: `${confPath}config.json` });
    const ospMenu = ospMenuCheck ? await getOspMenu() : [];
    sidebar = ospMenuCheck ? markHiddenMenus(sidebar, ospMenu) : sidebar;
    const { mode = '' } = jam.getUrlParams();
    // const menuColor = await getMenuColor();
    const userInfo = await getUserInfo();
    console.log('userInfo', userInfo);
    
    // mango.pub('menuColor', menuColor);
    mango.pub('sidebar', sidebar);
    mango.pub('userInfo', userInfo);
    mango.pub('config', conf);

    jaml(document.body, {
        id: 'main',
        type: 'container',
        stylize: 'app',
        styles: [!(mode === 'fullscreen' && process.env.NODE_ENV === 'production') ? Styles.background.tint : Styles.background({ color: 'transparent' }), Styles.background.tint],
        // descStyles: [Styles.icon.duotone],
        descCardStyles: [
            Styles.card.regularCard,
            Styles.card.css({
                position: 'relative'
            })
        ],
        components:
            mode === 'fullscreen'
                ? [
                      {
                          id: 'content',
                          class: 'demo-content',
                          type: 'container',
                          ref: 'main-content',
                          stylize: 'main',
                          plugins: [Plugins.composable.composable({ config: sidebar })],
                          styles: [
                              Styles.css({
                                  display: 'flex',
                                  width: '100%',
                                  height: '100%',
                                  maxWidth: '100%',
                                  minWidth: '3rem',
                                  position: 'relative',
                                  transition: 'width 400ms',
                                  flex: '0 0 auto'
                              })
                          ],
                          descStyles: {
                              '*:not(label):not(jam-indicator)': [Styles.icon.duotone],
                              card: ['card.bodyslot.css(display:grid;placeContent:stretch;placeItems:center)']
                          }
                      }
                  ]
                : [
                      {
                          type: 'wrapper',
                          class: 'header',
                          components: [commonHeader(), tsHeader()]
                      },
                      {
                          type: 'wrapper',
                          styles: [
                              Styles.size({
                                  width: '100%',
                                  height: 'calc(100% - 4rem)'
                              })
                          ],
                          class: '',
                          components: [
                              {
                                  id: 'sidebar-wrapper',
                                  type: 'container',
                                  styles: [
                                      Styles.css({
                                          transition: 'width 400ms',
                                          zIndex: 1,
                                          width: '15rem',
                                          minWidth: '0px',
                                          flex: '1 1 0%',
                                          overflow: 'auto',
                                          'white-space': 'nowrap'
                                      }),
                                      Styles.stylesheet({
                                          '.sidebar-name:hover': {
                                              backgroundColor: 'var(--jam-color-primary-film) !important'
                                          },
                                          '.sidebar-name.jam-checked': {
                                              backgroundColor: 'var(--jam-color-primary-default) !important'
                                          }
                                      })
                                  ],
                                  components: jaml.var('sidebarData@mango', (value) => {
                                      return [
                                          {
                                              type: 'sidebar',
                                              stylize: 'sidebar',
                                              vars: {
                                                  sidebarData: value
                                              },
                                              props: {
                                                  useIcon: false
                                              }
                                          }
                                      ];
                                  })
                              },
                              {
                                  id: 'content',
                                  class: 'demo-content',
                                  type: 'container',
                                  ref: 'main-content',
                                  stylize: 'main',
                                  plugins: [
                                      Plugins.composable.composable({ config: sidebar }),
                                      Plugins.shortcut.popGraph([
                                          {
                                              target: '.r-transparentStation',
                                              shortcuts: ['stGraph', 'transparentStation']
                                          },
                                          { target: '.r-st', shortcuts: ['stGraph'] },
                                          { target: '.r-device', shortcuts: ['devInfo'] }
                                      ])
                                  ],
                                  styles: [
                                      Styles.css({
                                          padding: 'm',
                                          display: 'flex',
                                          width: 'calc(100% - 15rem)',
                                          height: '100%',
                                          maxWidth: '100%',
                                          minWidth: '3rem',
                                          position: 'relative',
                                          transition: 'width 400ms',
                                          flex: '0 0 auto'
                                      }),
                                      Styles.interact.expandable({
                                          top: '6%',
                                          autoExpandWhenSiblingSmallerThan: 300,
                                          defaultWidth: 'calc(100% - 15rem)'
                                      }),
                                      Styles.interact.resizable({
                                          horizontalOnly: true,
                                          edges: { right: false },
                                          reset() {
                                              this.target.style.width = '67%';
                                              jam.save2Storage('playground-result-width', '67%');
                                          }
                                      })
                                  ],
                                  descStyles: {
                                      '*:not(label):not(jam-indicator)': [Styles.icon.duotone],
                                      card: ['card.bodyslot.css(display:grid;placeContent:stretch;placeItems:center)']
                                  },
                                  watchers: [
                                      {
                                          key: `${rambutan.pathWatcher}@mango`,
                                          callback(path) {
                                              if (mango.get('editMode')) {
                                                  currantComposable.makePageEditable();
                                                  // TODO 优化上浮卡片中心的方法
                                                  if (currantComposable?.center) {
                                                      setTimeout(() => {
                                                          currantComposable.center.zindexcb();
                                                      }, 0);
                                                  }
                                              }

                                              const _sidebar = document.querySelector('#sidebar-wrapper');
                                              const _expandSidebar = document.querySelector('.jam-expand-btn');
                                              homeRouterWatcher(
                                                  path,
                                                  () => {
                                                      _sidebar.classList.add('jam-collapsed');
                                                      // jam.applyStyle(_sidebar, {
                                                      //     display: 'none'
                                                      // });

                                                      jam.applyStyle(this, {
                                                          width: '100%'
                                                      });

                                                      //   jam.applyStyle(_expandSidebar, {
                                                      //       display: 'none'
                                                      //   });

                                                      // if (path.includes('/home')) {
                                                      //     jam.applyStyle(this, {
                                                      //         background: 'transparent !important',
                                                      //         backgroundImage: 'url(assets/images/bg_map.png) !important',
                                                      //         backgroundSize: `100% 100% !important`
                                                      //     });
                                                      // } else {
                                                      //     applyContentPageBackground(this, { transparent: true });
                                                      // }
                                                  },
                                                  () => {
                                                      _sidebar.classList.remove('jam-collapsed');
                                                      jam.applyStyle(_sidebar, {
                                                          display: 'block'
                                                      });

                                                      jam.applyStyle(this, {
                                                          width: 'calc(100% - 15rem)'
                                                      });

                                                      jam.applyStyle(_expandSidebar, {
                                                          display: 'block'
                                                      });

                                                      // applyContentPageBackground(this);
                                                      // milo.pub('transparentStId', null);
                                                  }
                                              );
                                              currantComposable.resetConfig();
                                          }
                                      },
                                      {
                                          key: `userInfo@mango`,
                                          callback(val) {
                                              nutmeg.success(`责任区: ${val.curRespName} 切换成功`);
                                              jam.removeSelf(jam.findElement('#switch-resp'));
                                          }
                                      }
                                  ],
                                  onmount() {
                                      mango.pub('sidebarData', rambutan.nestedRouteData);
                                  },
                                  components: [
                                      {
                                          type: 'notifycntr',
                                          slot: 'layer',
                                          props: {
                                              paddingTop: 's',
                                              position: 'center',
                                              defaultType: 'card',
                                              styles: [Styles.notify.bigicon, Styles.icon.duotone],
                                              levels: {
                                                  info: { icon: 'info-circle' },
                                                  warn: { icon: 'triangle-exclamation' },
                                                  error: { icon: 'bomb' },
                                                  success: { icon: 'circle-check' },
                                                  hurray: { icon: 'party-horn' }
                                              }
                                          }
                                      },
                                      registryComponents
                                  ]
                              }
                          ]
                      },
                      {
                          type: 'share'
                      }
                  ],
        methods: {},
        onmount() {
            _model = this.model;
            mango.pub('editMode', false);
        },
        vars: { userInfo, editModeSwitch: false }
    });
    const contentEl = document.getElementById('content');
    if (contentEl) {
        rambutan.container = contentEl;
    } else {
        rambutan.container = 'content';
    }
    rambutan.resolve();
}

function applyContentPageBackground(el, { transparent = false } = {}) {
    if (transparent) {
        jam.applyStyle(el, {
            background: 'transparent !important',
            backgroundImage: 'none !important'
        });
        return;
    }
    jam.applyStyle(el, {
        background: '',
        backgroundImage: '',
        backgroundSize: ''
    });
}

mango.sub('openCard', async (opt) => {
    if (!opt) return;
    let _res;
    switch (opt.card) {
        case 'stGraph':
            _res = await jam.addResource('modules/stGraph.mjs');
            break;
        case 'transparentStation':
            const stName = document.querySelector(`.r-transparentStation[data-id="${opt.id}"]`)?.getAttribute('data-name');
            const { data = {} } = await getGraphInfo(opt.id);
            const [url] = data?.graphUrl?.split('/osp');
            const token = jam.getUrlParam('token');
            window.open(`${url}/jaml-region/#/transparent_station/overall?stId=${opt.id}&stName=${stName}&token=${token}`);
            // window.open(`${config.transparentStationUrl}?stId=${opt.id}&stName=${stName}`);
            break;
    }
    if (!_res?.default) {
        return;
    }

    jam.renderModal('#main', _res.default);
});

const getGraphInfo = async (stId) => {
    return await jam.ajaxCall({
        method: 'get',
        urlKey: 'getStInfo',
        data: {
            stId
        }
    });
};

const getOspMenu = () => {
    return new Promise((r, j) => {
        ajaxCall(
            'getOspMenu',
            {
                success(res) {
                    const _data = res.data || res || {};
                    r(_data);
                },
                error(err) {
                    j(err);
                },
                useMock: false,
                type: 'get'
            },
            false
        );
    });
};

function loginOut() {
    const redirectUrl = loadConf('config.json', {})?.redirectUrl || '';
    jam.ajaxCall({
        urlKey: 'logout',
        data: {
            token: jam.getUrlParam('token')
        },
        transform() {
            location.href = redirectUrl;
        }
    });
}

const markHiddenMenus = (menu, ospMenu) => {
    const ospMenuNames = new Set(ospMenu.map((item) => item.name));

    // 递归处理菜单项
    const processItem = (item) => {
        // 创建处理后的项
        const processedItem = { ...item };

        // 处理子页面
        if (processedItem.pages && processedItem.pages.length) {
            processedItem.pages = processedItem.pages.map(processItem);

            // 检查所有子页面是否都被隐藏
            const allChildrenHidden = processedItem.pages.every((child) => child.hide);

            // 如果所有子页面都被隐藏，则隐藏当前项
            if (allChildrenHidden) {
                processedItem.hide = true;
            } else if (ospMenuNames.has(processedItem.name)) {
                // 如果当前项在 ospMenu 中且有未隐藏的子页面，则确保不隐藏
                delete processedItem.hide;
            }
        } else {
            // 对于没有子页面的项，直接检查是否在 ospMenu 中
            const shouldHide = !ospMenuNames.has(processedItem.name);

            if (shouldHide) {
                processedItem.hide = true;
            } else if ('hide' in processedItem) {
                // 如果原本有 hide 属性但现在应该显示，则删除 hide 属性
                delete processedItem.hide;
            }
        }

        return processedItem;
    };

    return menu.map(processItem);
};

function getUserInfo() {
    return new Promise((r, j) => {
        ajaxCall(
            'getUserInfo',
            {
                success(res) {
                    r(res);
                },
                error(err) {
                    console.log('getUserInfo err', err);
                    j({});
                },
                useMock: false,
                type: 'get'
            },
            false
        );
    });
}
function initHtmlFontSize(fontSize = '1.5vh') {
    const _htmlContainer = document.documentElement;
    _htmlContainer.style.fontSize = jam.getUrlParams()?.fontSize || fontSize;
}
