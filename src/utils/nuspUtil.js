import { COMM_PATH } from './Constants';
export async function prepareNusp() {
    // 新一代需要调整用chttp请求
    raspberry.use('chttp');
    // 新一代开图
    nusp.shortcutListener();
    // 用户信息包含 g文件拖入HTML配置地址时候 './xxxx/index.html?sessionId=' + GLOBAL.sessionID + '&host=' + GLOBAL.host + '&userName=' + GLOBAL.userName
    // 用户信息不确定能否拿到，需要测试
    let _parm = jam.getUrlParams();
    globalThis.GLOBAL_INFO = {
        sessionId: _parm.sessionId,
        userName: _parm.userName,
        host: _parm.host
    };
    tomato.sub('shortcutRequest', function (data) {
        const stId = data.ST_ID;
        // 获取厂站接线图处理方式
        let _picture = 'xxxx.g';
        tomato.pub('shortcutRespond', [
            {
                op: 'graph',
                name: _picture,
                time: new Date().getTime()
            }
        ]);
    });

    // 等待chttpjs加载
    await new Promise((r, j) => {
        if (window.http) {
            r();
            return;
        }
        let _intobj = setInterval(() => {
            lime.log('wait for chttpjs ready.');
            if (window.http) {
                clearInterval(_intobj);
                r();
            }
        }, 100);
    }).then(() => {
        lime.log('chttpjs ready.');
    });
}

export function setHandlers() {
    // 接口返回值
    raspberry.setHandlers([
        (payload) => {
            let _ret = payload;
            if (jam.isDictionary(payload) && 'responseData' in payload) {
                _ret = payload.responseData;
                if (typeof _ret === 'string') {
                    try {
                        _ret = JSON.parse(_ret);
                    } catch (e) {}
                }
            }
            if (jam.isDictionary(_ret) && 'data' in _ret && 'code' in _ret) {
                if (_ret.code !== 200) {
                    throw new Error(_ret.message);
                }
                _ret = _ret.data;
            }
            return _ret;
        }
    ]);
}

export async function registerCmpts() {
    let _resp = await raspberry.request({
        url: `${COMM_PATH}jamlutil/getAllUtilsInfo`,
        method: 'get',
        data: { repo: 'CC' }
    });
    for (let ccgroup of _resp?.data || []) {
        for (let _cc of ccgroup?.others || []) {
            if (!_cc.name.startsWith('cc')) {
                continue;
            }
            await cc.addCCSource(`${COMM_PATH}cc${_cc.url}`, false);
        }
    }
}
