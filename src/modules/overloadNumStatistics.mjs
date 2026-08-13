let _model,
    _msgr = null;
export default {
    type: 'card',
    class: '',
    styles: ['size.fullsize', Styles.stylesheet({})],
    components: [],
    onmount: function () {
        _model = this.model;
        _msgr = this.model.msgr;
    },
    onafterrender: function () {}
};
