import { ajaxCall, getDetailConf, loadConf } from '../common.js';
import { confPath } from '../global.js';
import { COMM_PATH, DATA_PATH } from './Constants.js';

/**
 * 根据全局变量 ALL_COMPONENTS 决定要发布在注册中心的内容
 */
export async function initModuleInfos() {
    try {
        const _showType = mango.get('detailConfig')?.registryCenterShowTypes;
        const allComponents = [];
        for (let component of ALL_COMPONENTS) {
            if (component?.showType && _showType.includes(component.showType)) {
                allComponents.push(component);
            }
        }
        mango.pub('modulesData', allComponents);
    } catch (e) {
        mango.pub('modulesData', ALL_COMPONENTS);
    }
}

/**
 * 重定向到登录页面
 */
export function redirectToLogin() {
    const ospPort = loadConf('config.json', {})?.ospPort || '8443';
    const redirectUrl = `${location.protocol}//${location.hostname}:${ospPort}/osp/jkz_portal/login.jsp?redirectUrl=${location.href}`;
    location.href = redirectUrl;
}

export function getOspUserInfo() {
    const token = jam.getUrlParam('token');
    if (token) {
        localStorage.setItem('JKZ_NARIKJ_PORTAL_TOKEN', token);
    } else {
        if (NODE_ENV !== 'development' && NODE_ENV !== 'test') {
            redirectToLogin();
        }
        jam.notify('无用户信息，请登录。');
    }
    if (token) {
        return new Promise((r, j) => {
            ajaxCall('getOspInfo', {
                success: (res) => {
                    const _resp = jam.getFromStorage('USER_RESP_AREA');
                    let _initResp = JSON.parse(_resp) || { curRespValue: res.respAreaAll, curRespName: '默认责任区' };
                    if (!_resp) {
                        jam.save2Storage('USER_RESP_AREA', JSON.stringify(_initResp));
                    }
                    mango.pub('userInfo', { ...res, ..._initResp });
                    mango.pub('userId', res?.userId);
                    r(res);
                },
                error: () => {
                    j();
                }
            });
        });
    }
}

/**
 * 获取用户布局信息
 * @returns
 */
export async function getUserLayout(info) {
    let layoutConfig;
    let userInfo = info || mango.get('userInfo');

    if (NODE_ENV !== 'development' && NODE_ENV !== 'test') {
        // 有用户信息，读取用户配置
        if (userInfo) {
            const key = `userLayout.${userInfo.userId}.${userInfo.userName}`;
            try {
                layoutConfig = await jam.ajaxCall(`${COMM_PATH}/monitor/common/getCustomizedConfig?key=${key}`);
                layoutConfig = JSON.parse(layoutConfig.data[key]);
            } catch (e) {
                layoutConfig = null;
            }
        }
    }

    // 没有本地缓存，读取默认布局
    if (!layoutConfig) {
        layoutConfig = await raspberry.request({ url: `${confPath}nav.json` });
    }
    // 如果需要读取osp菜单权限
    if (getDetailConf('useOspMenuAuth', false)) {
        layoutConfig = await getOspMenu(layoutConfig);
    }
    await resolveModuleInConfig(layoutConfig);
    return { userInfo: userInfo, layoutConfig: layoutConfig };
}

/**
 * 保存用户布局信息
 * @param {*} userLayout
 */
export async function saveUserLayout(userLayout) {
    debugger
    if (NODE_ENV !== 'development' && NODE_ENV !== 'test') {
        if (userLayout.userInfo) {
            removeModuleInConfig(userLayout.layoutConfig);
            await jam.ajaxCall({
                method: 'POST',
                url: `${COMM_PATH}/monitor/common/saveCustomizedConfig`,
                data: {
                    key: `userLayout.${userLayout.userInfo.userId}.${userLayout.userInfo.userName}`,
                    value: JSON.stringify(userLayout.layoutConfig)
                }
            });
        }
    }
}

// 需要从一个id判断它是card还是container,由此可以在此处直接给
// moduleType@@widgetsId@@widgetId
// 捕获组: 1-模块类型，2-模块组ID，3-设备类型，4-APP类型，5-模块ID
export const WIDGETS_ID_PATTERN = /([\w-]+)@@(widgets-d(\d+)-a(\d+)-\w+)@@([\w-]+)/;

/**
 * 按ID解析一个注册中心模块
 * @param {*} cardId 卡片ID
 * @returns 注册中心模块
 */
export async function resolveModuleById(cardId) {
    const _match = cardId ? cardId.match(WIDGETS_ID_PATTERN) : null;
    if (!_match) {
        return null;
    }
    const _moduleType = _match[1]; // 模块类型 card|container
    const _widgetsId = _match[2]; // 模块组ID
    const _devType = _match[3]; // 设备类型
    const _moduleId = _match[5]; // 模块ID
    const _widgets = await jam.ajaxCall(`${DATA_PATH}/devType${_devType}/${_widgetsId}.json`); // 模块组文件
    // TODO 有了具体的ID以后把这块该成全等判断
    const _module = _widgets.widgets.find((widget) => widget?.id === _moduleId || _moduleId === 'undefined'); // 模块
    // 模块容器
    const _moduleWrapper = {
        id: cardId,
        attrs: {
            'data-id': _moduleId
        },
        type: _moduleType,
        cap: _widgets.name,
        class: 'single-widgets', // single-widgets类样式在main.scss中
        size: _module?.size ?? [1, 1],
        components: _module ? [_module] : []
    }
    return _moduleWrapper;
}

/**
 * 解析config中的注册中心模块ID
 * @param {*} layoutConfig 
 */
async function resolveModuleInConfig(layoutConfig) {
    for (let page of layoutConfig) {
        if (!page?.switchable && page?.pages) {
            await resolveModuleInConfig(page.pages);
            continue;
        }

        if (!page?.cards) {
            continue;
        }

        await Promise.allSettled(page.cards.map((card) => resolveModuleById(card?.id))).then((cardWrappers) => {
            for (let i = 0; i < page.cards.length; i++) {
                const _card = page.cards[i];
                const _moduleWrapper = cardWrappers[i].value;
                if (!_moduleWrapper) {
                    continue;
                }
                // TODO icon替换成所属类别的icon
                _moduleWrapper.icon = _card?.icon ?? 'border-all';
                // TODO 要不要把resource字段改成jaml
                _card.resource = _moduleWrapper;
            }
        });

    }
}

/**
 * 移除config中的注册中心模块内容
 * 内容随注册中心变化而变化,保存其没有意义
 * @param {*} layoutConfig 
 */
function removeModuleInConfig(layoutConfig) {
    for (let page of layoutConfig) {
        if (!page?.switchable && page?.pages) {
            removeModuleInConfig(page.pages);
            continue;
        }

        if (!page?.cards) {
            continue;
        }

        for (let card of page.cards) {
            if (card?.id && !WIDGETS_ID_PATTERN.test(card.id)) {
                continue;
            }
            delete card.resource;
        }
    }
}

async function getOspMenu(layout) {
    const _layout = jam.cloneDeep(layout);
    return new Promise((r, j) => {
        ajaxCall('getOspMenu', {
            success(res) {
                // 遍历布局数据，与osp菜单比对，没有的hide:true，有的hide:false
                const _menu = scanMenu(_layout, res);
                r(_menu);
            },
            error(err) {
                j(err);
            },
            useMock: false
        });
    });
}

function scanMenu(layout, menus) {
    return layout.map((item) => {
        if (item.pages) {
            item.pages = scanMenu(item.pages, menus);
        }
        return {
            ...item,
            hide: menus.every((menu) => menu.route !== item.path)
        };
    });
}

/**
 * 根据路径查找路由配置
 * @param {string} targetPath - 要查找的路由路径（如 "/transparent_station/homepage"）
 * @param {Array} routeConfig - 完整的路由配置数组（即 nav.json 对应的数组）
 * @returns {Object|null} 匹配到的路由节点配置，未找到则返回 null
 */
export function findRouteByPath(targetPath, routeConfig) {
    // 递归遍历路由节点的方法
    function traverse(node) {
        // 1. 匹配当前节点的 path
        if (node.path === targetPath) {
            return node;
        }

        // 2. 如果当前节点有 pages 子节点，递归遍历子节点
        if (Array.isArray(node.pages)) {
            for (const child of node.pages) {
                const result = traverse(child);
                if (result) {
                    return result;
                }
            }
        }

        // 3. 未匹配到当前节点及子节点
        return null;
    }

    // 校验入参合法性
    if (typeof targetPath !== 'string' || !targetPath.trim()) {
        console.error('入参 targetPath 必须是非空字符串');
        return null;
    }
    if (!Array.isArray(routeConfig)) {
        console.error('入参 routeConfig 必须是数组');
        return null;
    }

    // 遍历根节点数组
    for (const rootNode of routeConfig) {
        const matchedRoute = traverse(rootNode);
        if (matchedRoute) {
            return matchedRoute;
        }
    }

    // 未找到匹配的路由
    return null;
}
