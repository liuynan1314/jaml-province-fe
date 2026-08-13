import { ajaxCall } from '../common.js';
export function digitalFormatter(value = 0, toFixed = 2) {
    return parseFloat((Math.floor(+value * 100) / 100).toFixed(toFixed));
}

export function getRegionList(force = false) {
    //
    // force强制调用接口
    return new Promise((resolve, reject) => {
        if (mango.get('cache-regionList') === undefined || force) {
            ajaxCall('getRegionList', {
                success(data) {
                    if (data?.length > 0) {
                        for (let item of data) {
                            Reflect.set(item, 'value', item.regionId);
                            Reflect.deleteProperty(item, 'regionId');
                            Reflect.set(item, 'name', item.regionNameChn);
                            Reflect.deleteProperty(item, 'regionNameChn');
                        }
                        mango.pub('cache-regionList', data);
                    }
                    resolve(data || []);
                },
                error(error) {
                    resolve([]);
                    console.log(error);
                },
                params: {},
                useMock: false,
                type: 'get'
            });
        } else {
            resolve(mango.get('cache-regionList'));
        }
    });
}

export function getStList(force = false) {
    // force强制调用接口
    return new Promise((resolve, reject) => {
        if (mango.get('cache-stInfoList') === undefined || force) {
            ajaxCall('getStInfoList', {
                success(data) {
                    if (data?.length > 0) {
                        for (let item of data) {
                            Reflect.set(item, 'value', item.id);
                            Reflect.deleteProperty(item, 'id');
                        }
                        mango.pub('cache-stInfoList', data);
                    }
                    resolve(data || []);
                },
                error(error) {
                    resolve([]);
                    console.log(error);
                },
                params: {},
                useMock: false,
                type: 'get'
            });
        } else {
            resolve(mango.get('cache-stInfoList'));
        }
    });
}

export function getBvList(force = false) {
    // force强制调用接口
    return new Promise((resolve, reject) => {
        if (mango.get('cache-bvList') === undefined || force) {
            ajaxCall('getBvList', {
                success(data) {
                    if (data?.length > 0) {
                        for (let item of data) {
                            Reflect.set(item, 'value', item.bvId);
                            Reflect.deleteProperty(item, 'bvId');
                            Reflect.set(item, 'name', item.bvName);
                            Reflect.deleteProperty(item, 'bvName');
                        }
                        mango.pub('cache-bvList', data);
                    }
                    resolve(data || []);
                },
                error(error) {
                    resolve([]);
                    console.log(error);
                },
                params: {},
                useMock: false,
                type: 'get'
            });
        } else {
            resolve(mango.get('cache-bvList'));
        }
    });
}

export function getTargetSystemList(force = false) {
    // force强制调用接口
    return new Promise((resolve, reject) => {
        if (mango.get('cache-targetSystem') === undefined || force) {
            ajaxCall('getTargetSystemList', {
                success(data) {
                    if (data?.length > 0) {
                        for (let item of data) {
                            Reflect.set(item, 'value', item.id);
                            Reflect.deleteProperty(item, 'id');
                            Reflect.set(item, 'name', item.systemName);
                            Reflect.deleteProperty(item, 'systemName');
                        }
                        mango.pub('cache-targetSystem', data);
                    }
                    resolve(data || []);
                },
                error(error) {
                    resolve([]);
                    console.log(error);
                },
                params: {
                    enable: 1,
                    pageIndex: 1,
                    pageSize: 100
                },
                useMock: false,
                type: 'post'
            });
        } else {
            resolve(mango.get('cache-targetSystem'));
        }
    });
}

export function getDcRegionList(force = false) {
    // force强制调用接口
    return new Promise((resolve, reject) => {
        if (mango.get('cache-dcRegionList') === undefined || force) {
            ajaxCall('getDcRegionList', {
                success(data) {
                    if (data?.length > 0) {
                        for (let item of data) {
                            Reflect.set(item, 'value', item.regionId);
                            Reflect.deleteProperty(item, 'regionId');
                            Reflect.set(item, 'name', item.regionNameChn);
                            Reflect.deleteProperty(item, 'regionNameChn');
                        }
                        mango.pub('cache-dcRegionList', data);
                    }
                    resolve(data || []);
                },
                error(error) {
                    resolve([]);
                    console.log(error);
                },
                params: {},
                useMock: false,
                type: 'post'
            });
        } else {
            resolve(mango.get('cache-dcRegionList'));
        }
    });
}

export function getJkDevInfoByRetrieval({ devName = '' }) {
    return new Promise((resolve, reject) => {
        ajaxCall('getJkDevInfoByRetrieval', {
            success(data) {
                resolve(data || []);
            },
            error(error) {
                resolve([]);
                console.log(error);
            },
            params: {
                count: 20,
                devName,
                devType: ['substation']
            },
            useMock: false,
            type: 'post'
        });
    });
}
export function setStlist(data = []) {
    let rt = [];
    for (let item of data) {
        rt.push({
            value: item.stId,
            name: item.stName
        });
    }
    return rt;
}
export function getDevTypeList() {
    return new Promise((resolve, reject) => {
        ajaxCall('getDevTypeList', {
            success(data) {
                resolve(data || []);
            },
            error(error) {
                resolve([]);
                console.log(error);
            },
            params: {},
            useMock: false,
            type: 'get'
        });
    });
}
export function setDevlist(data = [], valueKey = 'tableName') {
    let rt = [];
    for (let item of data) {
        rt.push({
            value: item.tableName,
            name: item.devType,
            tableNo: item.tableNo
        });
    }
    return rt;
}
