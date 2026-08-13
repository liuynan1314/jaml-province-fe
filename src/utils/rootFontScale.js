/** 设计稿基准分辨率，根字体 16px */
export const DESIGN_WIDTH = 1920;
export const DESIGN_HEIGHT = 1080;
export const BASE_ROOT_FONT_PX = 16;

/**
 * 按视口相对设计稿的缩放比计算根字体（取宽高比较小值，避免溢出）
 * @param {number} [innerWidth]
 * @param {number} [innerHeight]
 * @returns {number} px
 */
export function computeRootFontSize(innerWidth = window.innerWidth, innerHeight = window.innerHeight) {
    const scale = Math.min(innerWidth / DESIGN_WIDTH, innerHeight / DESIGN_HEIGHT);
    return BASE_ROOT_FONT_PX * scale;
}

/** 写入 document.documentElement.style.fontSize */
export function applyRootFontSize() {
    const px = computeRootFontSize();
    document.documentElement.style.fontSize = `${px}px`;
}

/**
 * 初始化根字体缩放，并在 resize / orientationchange 时更新
 * @returns {() => void} 卸载监听
 */
export function initRootFontScale() {
    applyRootFontSize();
    let rafId = 0;
    const schedule = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(applyRootFontSize);
    };
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);
    return () => {
        window.removeEventListener('resize', schedule);
        window.removeEventListener('orientationchange', schedule);
        cancelAnimationFrame(rafId);
    };
}
