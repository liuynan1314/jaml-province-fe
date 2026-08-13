/**
 * 元素样式相关的工具方法
 */

/**
 * 如果卡片不在首页，移除卡片标题
 * @param {*} el
 */
export function removeCardTitleIfNotHome(el) {
    const path = rambutan.getPath();
    // path以/homeXXX为最后一节
    if (path !== '/' && !/\/home[^/]*$/.test(path)) {
        jam.removeSelf(jam.findElement(el, ':host slot[name=title]'));
    }
}

/**
 * 当某条件变化时，执行一次回调
 * @param {*} el
 * @param {*} condition
 * @param {*} callback
 */
export function onConditionChangeOnce(el, condition, callback) {
    const ob = new MutationObserver(() => {
        if (!document.contains(el)) {
            ob.disconnect();
        }
        if (condition()) {
            callback();
            ob.disconnect();
        }
    });
    // 目前只监听样式属性，如有其他需求，则需要更改
    ob.observe(el, { attributes: true, attributeFilter: ['style'] });
}

/**
 * 向模块添加样式
 * @param {*} module
 * @param {*} style
 */
export function appendStyleToModule(module, style) {
    const _module = jam.cloneDeep(module);
    if (!_module.styles) {
        _module.styles = [];
    }
    _module.styles.push(style);
    return _module;
}

export const topLegendStyle = [
    Styles.indicator.inline,
    Styles.css({
        paddingBottom: '0'
    }),
    Styles.indicator.value.css({
        fontSize: '1.125rem',
        color: jam.ac(1, 1, jam.lumiO(22)),
        fontWeight: 'bold',
        fontFamily: 'DINPro',
        cursor: 'pointer'
    }),
    Styles.indicator.unit.css({
        fontSize: '1rem',
        lineHeight: '1rem',
        backgroundColor: 'transparent',
        fontWeight: 'normal',
        border: 'none',
        boxShadow: 'none',
        color: 'var(--jam-element-color)',
        padding: '0 0.25rem'
    })
];

export function getMenuColor() {
    return new Promise((r, j) => {
        jam.ajaxCall({
            urlKey: 'getMenuColor',
            onsuccess(res) {
                let menuColor = {};
                res.data.forEach((item) => {
                    if (item.menuColorList) {
                        item.menuColorList.forEach((color) => {
                            let _color = Number(color.color);
                            _color = jam.getAdjustedColor('#' + (_color >>> 0).toString(16).slice(-6)).css();
                            menuColor = {
                                ...menuColor,
                                [`${item.menuType}_${color.id}`]: jam.toHSLString(_color, { a: 1 })
                            };
                        });
                    }
                });
                r(menuColor);
            },
            onerror(error) {
                r(error);
            }
        });
    });
}
function getMenuColorMap() {
    return mango.get('menuColor');
}
/**
 * 从 menuColor 中获取菜单颜色
 * @param {string} menuType 菜单类型，见 MenuType
 * @param {string} [id] 菜单项 id；传入时返回对应颜色，不传时返回该类型下全部颜色 { [id]: color }
 * @returns {string|Record<string, string>|undefined}
 */
export function getMenuColorByType(menuType, id) {
    const menuColor = getMenuColorMap();
    if (id != null && id !== '') {
        return menuColor[`${menuType}_${id}`];
    }
    const prefix = `${menuType}_`;
    const result = {};
    Object.entries(menuColor).forEach(([key, value]) => {
        if (key.startsWith(prefix)) {
            result[key.slice(prefix.length)] = value;
        }
    });
    return result;
}
