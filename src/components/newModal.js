export default function newModal({ title = '', body, width = '40vw', height = '65vh', showBtn = false, deleteFun = () => {}, onConfirm = () => false, onCancel = () => {}, ...props }) {
    const handleCancel = () => {
        onCancel();
        spoon.removeSelf(modal.element);
        mango.pub('openCard', null);
    };
    const modal = new jam.Model({
        type: 'container',
        id: 'modal',
        styles: [
            Styles.size.fullsize,
            Styles.background({ color: 'var(--jam-color-primary-film)' }),
            Styles.css({
                position: 'fixed',
                left: 0,
                top: 0,
                // backdropFilter: 'blur(.05rem)',
                zIndex: 9998
            })
        ],
        onclick: (e) => {
            if (e.target.id === 'modal' && !props.modelClosePrevent) {
                handleCancel();
            }
        },

        onmount: () => {
            if (props?.onmount) {
                props.onmount();
            }
        },
        components: [
            {
                type: 'card',
                cap: title,
                styles: [
                    Styles.interact.movable,
                    Styles.interact.resizable,
                    Styles.animation.entry,
                    Styles.animation.exit,
                    Styles.hover.brighter,
                    Styles.card.titleslot.text({ size: 's' }),
                    Styles.card.titleslot.size({ width: '100%' }),
                    Styles.card.titleslot.css({ justifyContent: 'flex-start', boxSizing: 'border-box', backgroundClip: 'border', borderRadius: 0, borderBottom: 's solid var(--jam-color-outline-muted)' }),
                    Styles.card.bodyslot.size({ width: '100%', height: 'calc(100% - var(--jam-card-title-height,auto))' }),
                    Styles.card.bodyslot.padding(0),
                    Styles.css({
                        '--jam-card-title-height': '2.4375rem',
                        width,
                        height,
                        aspectRatio: props.aspectRatio,
                        padding: 0,
                        position: 'absolute',
                        left: props.left ?? '50%',
                        top: props.top ?? '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 0,
                        backdropFilter: 'blur(4rem)',
                        border: 's solid var(--jam-color-outline-muted)',
                        backgroundColor: 'elevation'
                    }),
                    Styles.stylesheet({
                        '&>[slot=cap]': {
                            fontSize: 'l'
                        },
                        '.card-body': {
                            '--top-line-width': '1.2rem',
                            '--top-line-gap': '.3rem',
                            position: 'relative'
                        },
                        // top ———— line
                        '.card-body::after,.card-body::before': {
                            content: '',
                            position: 'absolute',
                            top: 0,
                            width: '2.7rem',
                            height: '0.06rem',
                            backgroundImage: 'linear-gradient(to right, var(--jam-color-primary-default) 0, var(--jam-color-primary-default) 1.2rem, transparent 1.2rem, transparent 1.5rem, var(--jam-color-primary-default) 1.5rem, var(--jam-color-primary-default) 2.7rem)'
                        },
                        '.card-body::after': {
                            right: 0
                        },
                        '.card-body::before': {
                            left: 0
                        },
                        // 边框小角
                        '.conner': {
                            width: '.6rem',
                            height: '.6rem',
                            position: 'absolute',
                            borderStyle: 'solid',
                            borderWidth: 0,
                            borderColor: 'var(--jam-color-primary-default)'
                        },
                        '.conner-tl': { borderTopWidth: 's', borderLeftWidth: 's', top: 0, left: 0 },
                        '.conner-tr': { borderTopWidth: 's', borderRightWidth: 's', top: 0, right: 0 },
                        '.conner-bl': { borderBottomWidth: 's', borderLeftWidth: 's', bottom: 0, left: 0 },
                        '.conner-br': { borderBottomWidth: 's', borderRightWidth: 's', bottom: 0, right: 0 }
                    })
                ],
                components: [
                    {
                        type: 'wrapper',
                        class: 'card-body',
                        styles: [Styles.props({ width: '100%', height: showBtn ? 'calc(100% - 2rem)' : '100%' })],
                        components: [body]
                    },
                    showBtn
                        ? {
                              type: 'wrapper',
                              styles: [
                                  Styles.props({
                                      width: '100%',
                                      height: '2rem',
                                      display: 'flex',
                                      justifyContent: 'center'
                                  })
                              ],
                              buttonStyles: [Styles.button.size({ maxWidth: '5rem', height: '2rem' }), 'margin(left: 1rem)'],
                              components: [
                                  {
                                      type: 'button',
                                      cap: '确认',
                                      styles: ['with.accent', 'on.accent'],
                                      onclick: () => {
                                          if (!onConfirm()) {
                                              handleCancel();
                                          }
                                      }
                                  },
                                  {
                                      type: 'button',
                                      cap: '取消',
                                      styles: [],
                                      onclick: () => {
                                          handleCancel();
                                      }
                                  }
                              ]
                          }
                        : null,
                    {
                        type: 'label',
                        icon: 'close',
                        styles: [
                            'icon.regular',
                            Styles.props({
                                width: '1rem',
                                height: '1rem',
                                position: 'absolute',
                                right: '1rem',
                                top: 'calc(calc(var(--jam-card-title-height,auto) / 2) - .5rem)',
                                cursor: 'pointer'
                            })
                        ],
                        onclick() {
                            handleCancel();
                        }
                    },
                    { type: 'element', class: 'conner conner-tl' },
                    { type: 'element', class: 'conner conner-tr' },
                    { type: 'element', class: 'conner conner-bl' },
                    { type: 'element', class: 'conner conner-br' }
                ]
            }
        ]
    });
    modal.close = () => {
        spoon.removeSelf(modal.element);
        mango.pub('openCard', null);
    };
    modal.render(document.body);
    typeof props.done === 'function' && props.done(modal);
    return modal;
}
