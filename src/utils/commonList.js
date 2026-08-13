import { ajaxCall } from './../common';

/**
 * 获取区域列表
 */
export function getRegionList(_model, params = {}) {
    return new Promise((resolve, reject) => {
        ajaxCall(
            'getRegionList',
            {
                success(data) {
                    const regionList = [
                        {
                            name: '全部',
                            value: null
                        }
                    ];

                    (data || []).forEach((item) => regionList.push({ name: item.regionNameChn, value: item.regionId }));
                    _model.vars.regionList = regionList;
                    if (params?.name) {
                        let filterData = data.filter((item) => item.regionNameChn == params.name);
                        _model.vars.regionId = filterData?.[0].regionId;
                    }
                    resolve(regionList);
                },
                params: {},
                useMock: false,
                type: 'get'
            },
            false
        );
    });
}

export function getIndexRegionList(params = {}) {
    return new Promise((resolve, reject) => {
        ajaxCall(
            'getRegionList',
            {
                success(data) {
                    const regionList = [
                        {
                            name: '全部',
                            value: null
                        }
                    ];

                    (data || []).forEach((item) => regionList.push({ name: item.regionNameChn, value: item.regionId }));
                    mango.pub('regionListChange', regionList);
                    console.log('2222', regionList);

                    if (params?.name) {
                        let filterData = data.filter((item) => item.regionNameChn == params.name);
                        _model.vars.regionId = filterData?.[0].regionId;
                    }
                    resolve(regionList);
                },
                params: {},
                useMock: false,
                type: 'get'
            },
            false
        );
    });
}

/**
 * 获取电压等级列表
 */
export async function getBvList(_model) {
    return new Promise((resolve, reject) => {
        ajaxCall(
            'getBvList',
            {
                success(data) {
                    const bvList__ = [
                        {
                            name: '全部',
                            value: null
                        }
                    ];
                    const bvList = (data || [])
                        .sort((a, b) => parseInt(b.bvName) - parseInt(a.bvName))
                        .map((item) => ({
                            name: item.bvName,
                            value: item.bvId
                        }));
                    bvList__.push(...bvList);
                    _model.vars.bvList = bvList__;
                    resolve(bvList__);
                },
                params: {},
                useMock: false,
                type: 'get'
            },
            false
        );
    });
}

/**
 * 获取变电站列表
 */
export function getSubstationList({ _model, devName, bvId, regionId }) {
    ajaxCall(
        'getSubstationList',
        {
            success(data) {
                _model.vars.stList = (data || []).map((item) => ({ name: item.devName, value: item.devId }));
            },
            params: {
                count: 100,
                devName: devName || undefined,
                regionId: regionId || undefined,
                bvId: bvId ? String(bvId) : undefined,
                devType: ['substation']
            },
            useMock: false,
            type: 'post',
            uniqId: `getSubstationList_${Math.random(1, 1000000)}`
        },
        false
    );
}

/**
 * 获取厂站区域列表
 */
export function getSubAreaListData(_model) {
    return new Promise((resolve, reject) => {
        ajaxCall(
            'getSubAreaListData',
            {
                success(data) {
                    const subAreaList = [
                        {
                            name: '全部',
                            value: null
                        }
                    ];
                    const limitedData = (data || []).slice(0, 14);
                    limitedData.forEach((item) => subAreaList.push({ name: item.areaName, value: item.areaId }));
                    // (data || []).forEach((item) => subAreaList.push({ name: item.areaName, value: item.areaId }));
                    _model.vars.subAreaList = subAreaList;
                    resolve(subAreaList);
                },
                params: {},
                useMock: false,
                type: 'get'
            },
            false
        );
    });
}

export function getCardsInPage() {
    const path = rambutan.getPath();
    let page = null;

    function findPage(conf) {
        conf.forEach((item) => {
            if (item.path === path) {
                page = item;
            } else if (item?.pages) {
                findPage(item.pages);
            }
        });
    }
    findPage(mango.get('sidebar'));

    return page?.cards || [];
}

/**
 * 获取厂站树
 * @param {*} param0
 */
export function getSubstationTree({ _model, devName }) {
    jam.ajaxCall({
        method: 'POST',
        urlKey: 'getStTree',
        data: { devName: devName },
        transform(res) {
            if (!res || !res?.data) {
                return [];
            }
            return transformStTree(res.data);
        },
        onsuccess(data) {
            _model.msgr.pub('stTree', data);
            _model.msgr.pub('expanded', findResIds(data));
        }
    });
}

/**
 * 转换厂站树
 * @param {*} stTree
 * @param {*} level
 * @param {*} parentId
 * @returns
 */
export function transformStTree(stTree, level = 0, parentId = null) {
    if (!stTree || !stTree.length) {
        return null;
    }
    const _res = [];
    for (let subTree of stTree) {
        _res.push({
            id: subTree?.id,
            nodeId: subTree?.id,
            treeParentId: parentId,
            nodeName: subTree?.name,
            treeType: String(level),
            children: transformStTree(subTree?.children, level + 1, subTree?.id)
        });
    }
    return _res;
}

/**
 * 获取第一个匹配结果的id
 * @param {*} data
 * @returns
 */
export function findResIds(data, select = null) {
    function dfs(nodes, targetId, path) {
        for (const node of nodes) {
            const currentPath = [...path, node.id];
            if (targetId !== null) {
                if (node.id === targetId) {
                    return currentPath;
                }
            } else {
                const children = node.children || [];
                if (children.length === 0) {
                    return currentPath;
                }
            }
            const children = node.children || [];
            if (children.length > 0) {
                const result = dfs(children, targetId, currentPath);
                if (result !== null) {
                    return result;
                }
            }
        }
    }

    return dfs(data, select, []) || [];
}

/**
 * 获取间隔列表
 * @param {*} name
 */
export function getBayList({ _model, stId, devName }) {
    ajaxCall(
        'getJkDevInfoData',
        {
            success(data) {
                _model.vars.bayList = (data?.list || []).map((item) => ({ name: item.bayName, value: item.bayId }));
            },
            useMock: false,
            params: {
                stId: stId || undefined,
                devName: devName || undefined,
                devType: ['bay'],
                pageIndex: 1,
                pageSize: 100,
                selectColList: ['bayId', 'bayName']
            },
            type: 'post',
            error() {},
            complete() {},
            uniqId: `getSubstationList_${Math.random(1, 1000000)}`
        },

        false
    );
}

/**
 * 获取传入月份的所有日期
 * @param {*} month
 * @returns
 */
export function getDatesInMonth(month, year = new Date().getFullYear()) {
    // 如果传入的是字符串，转换为数字
    if (typeof month === 'string') {
        month = parseInt(month, 10);
        if (isNaN(month)) {
            throw new Error('月份字符串必须是可以转换为数字的值');
        }
    }

    // 验证月份是否有效
    if (typeof month !== 'number' || month < 1 || month > 12) {
        throw new Error('月份必须是1到12之间的数字');
    }

    // JavaScript中月份从0开始，需要将常规月份(1-12)转换为JS月份(0-11)
    const jsMonth = month - 1;

    // 获取该月的天数（Date对象会自动处理闰年等情况）
    const daysInMonth = new Date(year, jsMonth + 1, 0).getDate();

    // 创建数组存储所有日期
    const dates = [];

    // 遍历该月的每一天
    for (let day = 1; day <= daysInMonth; day++) {
        // 格式化月份和日期为两位数
        const monthStr = String(month).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        // 生成YYYY-MM-DD格式的日期字符串
        const dateStr = `${year}-${monthStr}-${dayStr}`;
        dates.push(dateStr);
    }

    return dates;
}
