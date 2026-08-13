let _model, _msgr;

const remoteVideoAccess = (params) => {
    return {
        type: 'card',
        icon: '',
        cap: '智巡视频调阅',
        styles: [
            Styles.card.floating({
                width: '75vw',
                height: '75vh'
            })
        ],
        components: [
            {
                type: 'wrapper',
                styles: [
                    'size.fullsize',
                    Styles.stylesheet({
                        ':scope': {
                            padding: 's',
                            iframe: {
                                height: '100%',
                                width: '100%',
                                border: 'none',
                                margin: '0'
                            }
                        }
                    })
                ],
                components: [
                    {
                        type: 'vanilla-iframe',
                        src: '{{src}}',
                        class: 'aaaa',
                        Styles: [Styles.size.fullsize]
                    }
                ],
                onmount: function () {
                    _model = this.model;
                    _msgr = this.model.msgr;
                },
                onafterrender: function () {
                    const { protocol, hostname } = window.location;
                    const _path = mango.get('config')?.zxVideoPrefix;
                    const url = `${protocol}//${hostname}:9007/${_path}`;
                    _model.vars.src = `${url}?id=${params?.devId}&token=${jam.getUrlParam('token')}`;
                }
            }
        ]
    };
};

export default remoteVideoAccess;
