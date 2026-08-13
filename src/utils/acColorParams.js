/**
 * 根据设计稿目标色，相对当前主题色（jam.accolor）推算 jam.ac() 参数。
 *
 * @example
 * // 主题色 hsl(178, 60%, 43%)，设计稿要 hsla(3, 30%, 50%, 1)
 * getAcParams('hsla(3, 30%, 50%, 1)');
 * // → { h: 0.514, s: 0.5, l: '50%', a: 1, code: "jam.ac(0.514, 0.5, '50%', 1)" }
 *
 * // 使用（推荐 positional，与项目内写法一致）
 * jam.ac(0.514, 0.5, '50%', 1)
 *
 * // 或直接取主题联动 CSS 色值
 * getAcColor('hsla(3, 30%, 50%, 1)');
 */

/**
 * @param {string} target 设计稿颜色 hex / rgb / hsl / hsla
 * @param {string} [base=jam.accolor] 基准色，默认当前主题色
 * @returns {{
 *   h: number,
 *   s: number,
 *   l: string,
 *   a: number,
 *   tuple: [number, number, string, number],
 *   object: { h: number, s: number, l: string, a: number },
 *   code: string,
 *   preview: string
 * }}
 */
export function getAcParams(target, base = jam.accolor) {
    const baseColor = jam.color(base);
    const targetColor = jam.color(target);

    const [bh, bs, bl] = baseColor.hsl();
    const [th, ts, tl] = targetColor.hsl();
    const alpha = +targetColor.alpha().toFixed(3);

    let deltaH = th - bh;
    if (deltaH > 180) deltaH -= 360;
    if (deltaH < -180) deltaH += 360;

    const h = +(1 + deltaH / 360).toFixed(3);
    const s = bs > 0 ? +(ts / bs).toFixed(3) : +ts.toFixed(3);
    const l = `${+(tl * 100).toFixed(1)}%`;

    const object = { h, s, l, a: alpha };
    const tuple = [h, s, l, alpha];
    const preview = acToCssString(jam.ac(...tuple));

    return {
        h,
        s,
        l,
        a: alpha,
        tuple,
        object,
        code: `jam.ac(${h}, ${s}, '${l}', ${alpha})`,
        preview
    };
}

/**
 * 设计稿颜色 → 相对主题色推算后的 jam.ac() CSS 色值。
 *
 * @param {string} target 设计稿颜色 hex / rgb / hsl / hsla
 * @param {string} [base=jam.accolor] 基准色，默认当前主题色
 * @returns {string}
 */
export function getAcColor(target, base = jam.accolor) {
    return jam.ac(getAcParams(target, base).object);
}

/** jam.ac() 在本项目返回 CSS 字符串，不是 chroma 对象 */
function acToCssString(result) {
    if (result == null) return '';
    if (typeof result === 'string') return result;
    if (typeof result.css === 'function') return result.css();
    return jam.color(result).css();
}
