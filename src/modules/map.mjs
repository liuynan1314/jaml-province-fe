export default {
    type: 'card',
    styles: [],
    components: [
        {
            type: 'container',
            styles: [Styles.size.fullsize],
            components: [jaml.map({ region: '山东', colorScheme: 'shade', topLevel: 'province', highlightTogether: false, styles: [Styles.css({ width: '100%', height: '100%' })] })]
        }
    ]
};
