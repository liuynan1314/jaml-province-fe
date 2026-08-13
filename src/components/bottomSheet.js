jaml.register('bottomSheet', {
    type: 'container',
    class: 'bottom-sheet',
    styles: [
        Styles.stylesheet({
            '&': {
                width: '100%',
                position: 'absolute',
                bottom: '0',
                transform: 'translateY(100%)',
                transition: 'transform 400ms cubic-bezier(0.22, 0.61, 0.36, 1)',
                '&.showing': {
                    transform: 'translateY(0)'
                },
                '.fab-layer': {
                    position: 'absolute',
                    width: '100%',
                    height: '5rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: '-100%',
                    transition: 'bottom 400ms cubic-bezier(0.22, 0.61, 0.36, 1)',
                    '[type=fab]': {
                        flexGrow: 0
                    },
                    '&.showing': {
                        bottom: '100%'
                    }
                },
                '&::before': {
                    content: '',
                    position: 'absolute',
                    backgroundColor: jam.ac(),
                    boxShadow: `0 0 2rem 0.2rem transparent`,
                    width: '100%',
                    height: '3px',
                    bottom: '100%',
                    borderRadius: '50%',
                    transition: 'box-shadow 400ms ease-in-out, background-color 400ms ease-in'
                },
                '&.showing::before': {
                    visibility: 'hidden',
                    backgroundColor: 'transparent'
                },
                '&.glow::before': {
                    boxShadow: `0 0 2rem 0.2rem ${jam.ac(1, 1, 1, 0.9)},0 0 4rem 0.6rem ${jam.ac(1, 1, 1, 0.45)},0 0 6rem 1rem ${jam.ac(1, 1, 1, 0.15)}`
                }
            },
            'part(bodyslot)': {
                width: '100%'
            }
        })
    ],
    onmount() {
        this.enable();
    },
    onunmount() {
        this.disable();
    },
    methods: {
        enable() {
            this._aborter = new AbortController();
            this.rafAwakeFab = jam.rafThrottle(this.awakeFab, this);
            this.parentNode.addEventListener('mouseenter', this.activeAwake, { signal: this._aborter.signal });
            this.parentNode.addEventListener('mousemove', this.rafAwakeFab, { signal: this._aborter.signal });
            this.parentNode.addEventListener('mouseleave', this.deactiveAwake, { signal: this._aborter.signal });
            this.parentNode.addEventListener('click', this.hideSheetIfClickElse, { signal: this._aborter.signal });
        },
        disable() {
            this._aborter.abort();
        },
        showSheet(e) {
            jam.addClass(this, 'showing -glow');
            jam.removeClass(this.ref('fab'), 'showing');
        },
        hideSheet(e) {
            jam.removeClass(this, 'showing');
            jam.removeClass(this.ref('fab'), 'showing');
        },
        hideSheetIfClickElse(e) {
            if (!jam.hasClass(this, 'showing') || jam.closest(e.target, '.bottom-sheet') === this) {
                return;
            }
            this.hideSheet();
        },
        activeAwake(e) {
            this._awake = true;
        },
        awakeFab(e) {
            if (!this?._awake || jam.hasClass(this, 'showing')) {
                return;
            }
            const _rect = this?._rect ?? this.parentNode.getBoundingClientRect();
            this._rect = _rect;
            const _distance2bottom = _rect.bottom - e.clientY;
            const _inZone = _distance2bottom <= this.props.awakeDistance;
            const _fab = this.ref('fab');
            const _showing = jam.hasClass(_fab, 'showing');
            // fab正在展示且鼠标不在区域内
            if (_showing !== _inZone) {
                jam.toggleClass(_fab, 'showing');
                jam.toggleClass(this, 'glow');
            }
        },
        deactiveAwake(e) {
            this._awake = false;
            jam.removeClass(this, 'glow');
            jam.removeClass(this.ref('fab'), 'showing');
        }
    },
    on: {
        resize(e) {
            this._rect = this.parentNode.getBoundingClientRect();
        }
    },
    components: [
        {
            type: 'wrapper',
            class: 'fab-layer',
            ref: 'fab',
            slot: 'layer',
            components: [
                {
                    type: 'button-fab',
                    icon: '{{icon}}',
                    styles: [Styles.icon.solid, Styles.background.gradient.concave, Styles.layer.glare.reflect('radial'), Styles.shadow.sphere, Styles.click.bouncing],
                    onclick() {
                        this.parentNode.parentNode.showSheet();
                    }
                }
            ]
        }
    ],
    props: {
        icon: 'grid-2',
        awakeDistance: 140
    }
});