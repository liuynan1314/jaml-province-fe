import { getDetailConf } from '../common.js';
export default {
    type: 'card',
    styles: [
        Styles.stylesheet({
            ':scope': {
                iframe: {
                    width: '100%',
                    height: '100%'
                }
            }
        }),
        Styles.card.floating({
            width: '80vw',
            height: '80vh'
        })
    ],
    icon: 'palette',
    cap: '厂站接线图',
    components: [
        {
            type: 'vanilla-iframe',
            // src: 'http://192.1.103.101:9000/osp/GraphPub/Navigator.html?graph=220kV%E6%B5%8B%E8%AF%95%E7%AB%991.fac.pic.g;isClient=1;menubarshow=0;'
            src: '{{url}}'
        }
    ],
    async onmount() {
        const { regionListUserOtherSys = [90] } = getDetailConf('regionListUserOtherSys');
        const info = mango.get('openCard');
        const result = await jam.ajaxCall({
            method: 'get',
            urlKey: 'getStInfo',
            data: {
                stId: info?.params?.id || info?.id
            }
        });
        const res = result?.data;
        let url = '';
        if (res?.graphName && res?.graphUrl) {
            url = `${res?.graphUrl}?graph=${res?.graphName};isClient=1;toolbarshow=0;menubarshow=0;&token=${jam.getUrlParam('token')}&randvalue1=${moment().valueOf()}`;
            if (regionListUserOtherSys.includes(res?.regionId)) {
                url = `${res.graphUrl}?graph=${res?.graphName}`.replace('fac', 'sys').replace('nccs', '');
            }
        } else if (res?.graphName && res?.graphName.includes('http')) {
            url = res.graphName;
        } else {
            nutmeg.warn('请配置厂站对应g文件和链接地址');
            return;
        }

        this.vars.url = url;
    }
};
