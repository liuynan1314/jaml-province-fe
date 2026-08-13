export function createWindow({ title = '', body, width = '40vw', height = '65vh', showBtn = true, movable = true, deleteFun = () => {}, onConfirm = () => false, onCancel = () => {}, ...props }) {
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
            Styles.css({
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 9998,
                backgroundColor: 'rgba(0, 0, 0, 0.4)'
            })
        ],
        onclick: (e) => {
            if (e.target.id === 'modal') {
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
                    Styles.card.regularCard,
                    movable ? Styles.interact.movable : '',
                    Styles.interact.resizable,
                    Styles.animation.entry,
                    Styles.animation.exit,
                    Styles.hover.brighter,
                    Styles.card.titleslot.size({ width: '100%' }),
                    Styles.card.bodyslot.size({ width: '100%', height: '100%' }),
                    Styles.card.bodyslot.padding(0),

                    // Styles.card.titleslot.background({
                    //     image: 'url(../../assets/images/layer-title.png)',
                    //     size: '100% 100%',
                    //     repeat: 'no-repeat'
                    // }),

                    Styles.css({
                        width,
                        height,
                        position: 'absolute',
                        left: props.left ?? '50%',
                        top: props.top ?? '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9999,
                        // display: 'flex',
                        // flexDirection: 'column',
                        // alignItems: 'center',
                        backgroundColor: jam.ac(1, 0.1, jam.lumiO(50))
                    })
                ],
                components: [
                    {
                        type: 'wrapper',
                        styles: [
                            Styles.props({
                                width: '100%',
                                height: showBtn ? 'calc(100% - 2rem)' : '100%'
                            })
                        ],
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
                                      styles: ['props({ backgroundColor: jam.ac() })'],
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
                            Styles.label.icon.css({ fontSize: '1.5rem' }),
                            Styles.props({
                                width: '1rem',
                                height: '1rem',
                                position: 'absolute',
                                right: '1rem',
                                top: '0.5rem',
                                cursor: 'pointer'
                            })
                        ],
                        onclick() {
                            handleCancel();
                        }
                    }
                ]
            }
        ]
    });
    modal.close = handleCancel;
    modal.render(document.body);
    typeof props.done === 'function' && props.done(modal);
    return modal;
}
