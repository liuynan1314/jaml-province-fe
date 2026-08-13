jaml.register('crumbs_self', {
    type: 'wrapper',
    styles: ['size.fullheight'],
    components: [
        {
            type: 'wrapper',
            buildFor: '(route, idx) in breadcrumbs',
            components: [
                {
                    type: 'label',
                    id: '{{route.}} + "_" + {{idx}}',
                    styles: ['css(cursor:pointer)'],
                    buildIf: '{{route.name}}',
                    cap: '{{route.name}}',
                    onclick: function (e) {}
                },
                {
                    type: 'label',
                    styles: ['margin(top:0.1rem)', 'icon.duotone'],
                    buildIf: '!{{route.path}}',
                    icon: 'angle-right',
                    wathcers: {}
                }
            ]
        }
    ],
    onmount() {
        const menus = this.cmpt.props.routes;
        const _model = this.model;
        mango.sub(rambutan.pathWatcher, (path) => {
            const breadcrumbs = findBreadcrumbs(menus, path);
            _model.vars.breadcrumbs = breadcrumbs;
        });
    }
});

function findBreadcrumbs(routes, currentPath, breadcrumbs = []) {
    for (const route of routes) {
        // 检查当前路由是否匹配
        if (route.path === currentPath) {
            return [
                ...breadcrumbs,
                {
                    name: route.name,
                    path: route.path
                }
            ];
        }

        // 检查是否有子页面
        if (route.pages) {
            const found = findBreadcrumbs(route.pages, currentPath, [
                ...breadcrumbs,
                {
                    name: route.name,
                    path: route.path || breadcrumbs[breadcrumbs.length - 1]?.path // 使用父级路径如果当前没有path
                }
            ]);

            if (found) return found;
        }
    }

    return null;
}
