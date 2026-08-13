import { loadConf, homeSceneRouter } from '../common.js';
import { confPath } from '../global.js';

// ========== 常量与类型定义 ==========
const SCENE_CONTAINER_ID = 'scene_id';
const LOG_PREFIX = '[3d-engine]';
let sceneOpQueue = Promise.resolve();
let scheduleLoadTimer = null;

/** 生产构建勿打包进 index.js，避免 Terser 破坏 ECR 运行时注入 */
function getEngineModuleUrl() {
    return new URL('assets/lib/3d-engine.js', document.baseURI).href;
}

/**
 * 3d-engine（第三方 SDK，不可改）在 new Engine 时若 window.ue 为真则跳过 DOM 事件绑定。
 * SDK 加载后还可能执行 window.ue = {}，须在 import 之后、new Engine 之前清理。
 * 仅在此处调用（勿写进 index.html），避免与打包脚本里的标识符冲突。
 */
function prepareForWebEngine() {
    if (window.ue != null && window.__UE_BACKUP__ == null) {
        window.__UE_BACKUP__ = window.ue;
    }
    try {
        window.ue = undefined;
    } catch {
        /* ignore */
    }
    try {
        delete window.ue;
    } catch {
        /* ignore */
    }
    try {
        Object.defineProperty(window, 'ue', {
            configurable: true,
            enumerable: false,
            get: () => undefined,
            set: () => {}
        });
    } catch {
        /* 宿主页若定义为不可配置，只能由部署方避免注入 window.ue */
    }
}

function restoreHostUeIfNeeded() {
    if (window.__UE_BACKUP__ == null) return;
    try {
        delete window.ue;
        window.ue = window.__UE_BACKUP__;
    } catch {
        /* ignore */
    }
}

/** 解析 #scene_id（兼容 jam-container Shadow DOM） */
export function resolveSceneContainer(containerEl) {
    if (containerEl?.nodeType === 1) {
        return containerEl.id === SCENE_CONTAINER_ID ? containerEl : containerEl.querySelector?.(`#${SCENE_CONTAINER_ID}`) || containerEl;
    }
    const byId = document.getElementById(SCENE_CONTAINER_ID);
    if (byId) return byId;
    const mainHost = document.querySelector('jam-container#main');
    const root = mainHost?.shadowRoot;
    if (root) {
        return root.getElementById(SCENE_CONTAINER_ID) || root.querySelector(`#${SCENE_CONTAINER_ID}`);
    }
    return document.querySelector(`#${SCENE_CONTAINER_ID}`);
}

let EngineClass = null;
let engineModulePromise = null;

function formatScreenshotTime(date = new Date()) {
    const pad = (num) => String(num).padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function normalizeScreenshotDataUrl(imageData) {
    if (!imageData || typeof imageData !== 'string') {
        throw new Error('截图结果为空');
    }
    const value = imageData.trim();
    if (value.startsWith('data:images/')) return value;
    return `data:images/png;base64,${value}`;
}

function downloadDataUrl(filename, dataUrl) {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = dataUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function loadEngineClass() {
    if (EngineClass) return EngineClass;
    prepareForWebEngine();
    if (!engineModulePromise) {
        engineModulePromise = import(/* webpackIgnore: true */ getEngineModuleUrl());
    }
    const mod = await engineModulePromise;
    prepareForWebEngine();
    EngineClass = mod.Engine;
    if (!EngineClass) {
        throw new Error('3d-engine 模块未导出 Engine');
    }
    if (typeof window.Engine !== 'function') {
        throw new Error('3d-engine 未完成初始化（window.Engine 不存在）');
    }
    return EngineClass;
}
export const ENGINE_BASE_CONFIG = {
    url: 'http://192.168.205.222:29999',
    token: ''
};

class Scene3DManager {
    static instance = null;

    constructor() {
        if (Scene3DManager.instance) {
            return Scene3DManager.instance;
        }

        // 引擎实例
        this.engine = null;

        // 统一状态管理（所有需要记录的ID）
        this.state = {
            currentHighlightIds: [], // 高亮ID
            currentPopIds: [], // 气泡ID
            initialPerspective: {}, // 初始视角，
            currentLeyerHighlightIds: [],
            currentPopConfigs: []
        };

        this._container = null;
        this._sceneLoaded = false;
        this._mangoBound = false;
        this._modelEventsBound = false;

        Scene3DManager.instance = this;
    }

    /** 仅创建 Engine（已存在则跳过） */
    async initScene(containerEl) {
        if (this.engine) return;

        const container = resolveSceneContainer(containerEl);
        if (!container) throw new Error(`未找到三维容器 #${SCENE_CONTAINER_ID}`);

        this._container = container;
        const Engine = await loadEngineClass();
        prepareForWebEngine();
        if (window.ue) {
            console.error(`${LOG_PREFIX} new Engine 前 window.ue 仍为真，DOM 事件不会绑定`, typeof window.ue);
        }

        const { url, token } = ENGINE_BASE_CONFIG;
        this.engine = new Engine(container, url, token);
        restoreHostUeIfNeeded();

        this._modelEventsBound = false;
        this.bindModelEvents();
        jam.applyStyle(container, { pointerEvents: 'auto' });
        console.info(`${LOG_PREFIX} Engine 已创建`);
    }

    /** 卸载场景：同步 destroyScene，不 await */
    _unloadScene() {
        if (!this.engine || !this._sceneLoaded) return;
        const prev = this.engine;
        this.engine = null;
        this._sceneLoaded = false;
        this._modelEventsBound = false;
        try {
            prev.destroyScene();
        } catch (error) {
            console.warn(`${LOG_PREFIX} 卸载场景:`, error);
        }
    }

    loadScene(containerEl) {
        sceneOpQueue = sceneOpQueue
            .then(() => this._loadSceneImpl(containerEl))
            .catch((err) => {
                console.error('🎮 场景加载异常:', err);
                ENGINE_BASE_CONFIG.onError?.(err);
            });
        return sceneOpQueue;
    }

    async _loadSceneImpl(containerEl) {
        const path = rambutan.getPath();
        if (!homeSceneRouter.includes(path)) return;

        const container = resolveSceneContainer(containerEl) || this._container;
        if (!container) throw new Error(`未找到三维容器 #${SCENE_CONTAINER_ID}`);
        this._container = container;

        if (this._sceneLoaded) this._unloadScene();
        if (!this.engine) await this.initScene(container);

        const sceneInfo = await this.getSceneInfo();
        if (!sceneInfo) throw new Error('场景配置信息为空，无法加载场景');

        await this.engine.loadScene({ json: sceneInfo });
        this._sceneLoaded = true;

        const { position, target } = await this.engine.getCameraInfo();
        this.state.initialPerspective = { position, target };
        this.state.currentHighlightIds = [];
        this.state.currentPopIds = [];
        this.state.currentPopConfigs = [];
        this.state.currentLeyerHighlightIds = [];

        console.info(`${LOG_PREFIX} 场景已加载`, { path });
    }

    async destroyScene() {
        await sceneOpQueue;
        if (!this.engine) {
            this._sceneLoaded = false;
            return;
        }
        const prev = this.engine;
        this.engine = null;
        this._sceneLoaded = false;
        this._modelEventsBound = false;
        try {
            await prev.destroyScene();
        } catch (error) {
            console.error('🎮 场景销毁异常:', error);
        }
    }

    async getSceneInfo() {
        try {
            const path = rambutan.getPath();
            const sceneConf = mango.get('sceneConf');
            const sceneConfigItem = sceneConf?.[path] ?? sceneConf?.defaultConf;
            const { scene_id = '' } = sceneConfigItem || {};
            if (!scene_id) throw new Error('未获取到有效的场景ID');

            const response = await jam.ajaxCall({
                urlKey: 'getSceneData',
                method: 'POST',
                data: { id: scene_id, isPublish: 0 }
            });
            return response?.resultData?.sceneInfo || null;
        } catch (error) {
            console.error('📄 获取场景数据失败:', error);
            return null;
        }
    }

    /**
     * 绑定模型事件,处理mango事件
     * @returns
     */
    bindModelEvents() {
        if (!this.engine) return;

        if (!this._mangoBound) {
            this._mangoBound = true;
            mango.sub('3D_mango_event', async (params) => {
                if (!this.engine) return;
                const { action, data } = params || {};
                const handlers = {
                    look: () => this.engine.look({ position: data.position, target: data.target, time: data.time }),
                    setModelHighlight: () => this.engine.setModelHighlight(data),
                    createPanel: () =>
                        this.engine.createPanel({
                            html: data.html,
                            position: data.position,
                            rotation: data.target,
                            scale: data.scale
                        }),
                    resetModelHighlight: () => this.engine.resetModelHighlight(data),
                    createPops: () => this.createPops(data.popConfigs),
                    resetPerspective: () => this.resetPerspective(),
                    createEffect: () => this.engine.createEffect(data),
                    focusLayer: () => this.engine.focusLayer(data),
                    setLayerHighlight: () => this.engine.setLayerHighlight(data),
                    resetLayerHighlight: () => this.engine.resetLayerHighlight(data),
                    destroyPop: () => {
                        this.destroyPop(this.state.currentPopIds);
                        this.state.currentPopIds = [];
                    }
                };
                await handlers[action]?.();
            });
        }

        if (this._modelEventsBound) return;
        this._modelEventsBound = true;

        this.engine.onModelClick(async (event) => {});

        this.engine.onModelDoubleClick(async (event) => {
            try {
                await this.engine.focusModel({
                    modelId: event,
                    offset: { x: 0, y: 0, z: 10 },
                    time: 1
                });
            } catch (error) {
                console.error('获取模型信息失败:', error);
            }
        });

        this.engine.onModelContextmenu(async (event) => {
            console.log('🖱️ 模型右键点击:', event);
        });
    }

    /**
     * 批量生成气泡
     * @param {string[]} popConfigs 气泡配置
     * @param {boolean} clearPrevious 是否清楚上次的气泡
     * @returns
     */
    async createPops(popConfigs, clearPrevious = true) {
        if (!Array.isArray(popConfigs) || popConfigs.length === 0) {
            console.warn('📌 气泡配置列表为空，无需创建');
            return;
        }

        if (clearPrevious && this.state.currentPopIds.length) {
            await this.destroyPop(this.state.currentPopIds);
            this.state.currentPopIds = [];
        }

        const popIdList = [];
        const createPromises = popConfigs.map(async (item) => {
            const { id, content = '', html } = item;
            const backgroundColor = jam.accolor.css();

            const _dom = document.createElement('div');
            _dom.innerHTML =
                html ||
                `
                <div style="color: white; padding: 8px; border-radius: 4px;background:${backgroundColor}; text-align:center;">
                    ${content}
                </div>
            `;

            await this.engine.createPop({
                modelId: id,
                dom: _dom
            });

            popIdList.push(id);
        });

        await Promise.all(createPromises);

        this.state.currentPopIds = [...popIdList];
        this.state.currentPopConfigs = popConfigs;
    }

    /**
     *
     * @param {string | string[]}} modelIds
     * @returns
     */
    async destroyPop(modelIds) {
        if (!modelIds || modelIds.length === 0) {
            console.warn('📌 待删除气泡ID列表为空，无需删除');
            return;
        }

        const modelIdList = Array.isArray(modelIds) ? modelIds : [modelIds];

        const deletePromises = modelIdList.map(async (modelId) => {
            await this.engine.destroyPop({ modelId: modelId });
        });

        await Promise.all(deletePromises);
    }

    /**
     * 恢复初始视角
     * @returns
     */
    async resetPerspective() {
        const ip = this.state.initialPerspective;
        if (!ip) {
            console.warn('🔍 初始视角未缓存，无法恢复');
            return;
        }
        try {
            await this.engine.look({
                position: ip.position,
                target: ip.target,
                time: 1
            });
        } catch (error) {
            console.error('🔍 恢复初始视角失败:', error);
        }
        // 恢复气泡
        if (this.state.currentPopConfigs.length > 0) {
            await this.createPops(this.state.currentPopConfigs);
        }
    }

    /**
     * 隐藏图层
     * @param {string | string[]} layerIds 图层id
     * @param {boolean} visible
     * @returns
     */
    async setLayerVisible(layerIds, visible) {
        if (!layerIds) {
            console.warn('🖼️ 图层ID不能为空');
            return;
        }

        const list = Array.isArray(layerIds) ? layerIds : [layerIds];

        try {
            await this.engine.setLayerVisible({ layerIds: list, visible });
        } catch (error) {
            console.error(`🖼️ 图层${visible ? '显示' : '隐藏'}失败:`, error);
        }
    }

    /**
     * 隐藏模型
     * @param {string | string[]} modelIds
     * @param {boolean} visible
     * @returns
     */
    async setModelVisible(modelIds, visible) {
        if (!modelIds) {
            console.warn('🖼️ 模型ID不能为空');
            return;
        }

        const list = Array.isArray(modelIds) ? modelIds : [modelIds];

        try {
            await this.engine.setModelVisible({ modelIds: list, visible });
        } catch (error) {
            console.error(`🖼️ 模型${visible ? '显示' : '隐藏'}失败:`, error);
        }
    }

    /**
     * 画线测距
     * @param {*} params
     */
    async drawLineRanging(params) {
        try {
            const lineProps = await this.engine.drawLine(params);
            mango.pub('rangingData', lineProps.distance);
        } catch (error) {
            console.error('📏 画线测距失败:', error);
        }
    }

    /**
     * 获取相机信息
     * @returns
     */
    async getCameraInfo() {
        try {
            const cameraInfo = await this.engine.getCameraInfo();
            mango.pub('cameraInfo', cameraInfo);
            return cameraInfo;
        } catch (error) {
            console.error('📏 获取相机信息失败:', error);
        }
    }

    /**
     * 获取模型数据
     * @returns
     */
    async getSceneModelList() {
        try {
            return await this.engine.getSceneModelList();
        } catch (error) {
            console.error('📏 获取模型数据失败:', error);
        }
    }

    /**
     * 截取当前三维视角并下载 png
     * @param {{ filename?: string }} options
     * @returns {Promise<string>} dataUrl
     */
    async screenshotCurrentView(options = {}) {
        if (!this.engine || !this._sceneLoaded) {
            throw new Error('三维场景未加载，无法截图');
        }

        const container = resolveSceneContainer(this._container);
        if (!container) throw new Error(`未找到三维容器 #${SCENE_CONTAINER_ID}`);
        const containerRect = container.getBoundingClientRect;
        const rect = {
            x: 0,
            y: 0,
            width: Math.round(container.clientWidth || containerRect.width),
            height: Math.round(container.clientHeight || containerRect.height)
        };

        if (!rect.width || !rect.height) {
            throw new Error('三维截图区域尺寸无效');
        }

        try {
            const dataUrl = normalizeScreenshotDataUrl(await this.engine.screenshot({ rect }));
            downloadDataUrl(options.filename || `scene-screenshot-${formatScreenshotTime()}.png`, dataUrl);
            return dataUrl;
        } finally {
            try {
                await this.engine?.clearScreenshot?.();
            } catch (error) {
                console.warn(`${LOG_PREFIX} 清理截图缓存失败:`, error);
            }
        }
    }

    /**
     * 获取全部模型id
     * @param {{}[]} data 模型属性数据
     * @param {string} type 获取类型
     * @returns
     */
    getAllModelIds(data, type = 'model') {
        if (!Array.isArray(data) || !type) return [];

        return Array.from(
            data.reduce((result, item) => {
                if (item.type === type) result.add(item.id);

                if (Array.isArray(item.children)) {
                    this.getAllModelIds(item.children, type).forEach((id) => result.add(id));
                }

                return result;
            }, new Set())
        );
    }

    /**
     * 高亮模型
     * @param {string} devId 设备id
     * @param {{mode:string,config:{color:string,width:number,speed:number}}} options
     * @returns
     */
    highlight(devId, options = {}, clearPrevious = true) {
        if (!devId) {
            nutmeg.warn('高亮设备ID不能为空');
            return;
        }

        // 清除上次高亮
        if (clearPrevious && this.state.currentHighlightIds.length > 0) {
            this.resetModelHighlight(this.state.currentHighlightIds);
            this.state.currentHighlightIds = [];
        }

        const devIdList = Array.isArray(devId) ? devId : [devId];

        const modelIds = getModelIdBayDevId(devIdList, true);

        const mode = options.mode || 'flash';

        const defaultConfig = {
            color: jam.getColor('error').hex(),
            width: 1,
            speed: 1
        };

        const config = { ...defaultConfig, ...options };
        delete config.mode;

        mango.pub('3D_mango_event', {
            action: 'setModelHighlight',
            data: { modelIds, mode, config },
            time: Date.now()
        });

        this.state.currentHighlightIds = modelIds;
    }

    /**
     * 清除模型高亮
     * @param {string[]} modelIds
     */
    resetModelHighlight(modelIds) {
        mango.pub('3D_mango_event', {
            action: 'resetModelHighlight',
            data: { modelIds },
            time: Date.now()
        });

        if (this.state.currentHighlightIds === modelIds || this.state.currentHighlightIds.join() === modelIds?.join?.()) {
            this.state.currentHighlightIds = [];
        }
    }

    /**
     * 高亮图层
     * @param {*} devId 设备id
     * @param {{mode:string,config:{color:string,width:number,speed:number}}} options
     * @param {*} clearPrevious  是否需要清楚上次高亮
     * @returns
     */
    highlightLayer(devId, options = {}, clearPrevious = true) {
        if (!devId) {
            nutmeg.warn('高亮图层ID不能为空');
            return;
        }

        // 清除上次高亮
        if (clearPrevious && this.state.currentLeyerHighlightIds.length > 0) {
            this.resetLayerHighlight(this.state.currentLeyerHighlightIds);
            this.state.currentLeyerHighlightIds = [];
        }

        const devIdList = Array.isArray(devId) ? devId : [devId];

        const layerIds = getModelIdBayDevId(devIdList, true);

        const mode = options.mode || 'flash';

        const defaultConfig = {
            color: jam.getColor('error').hex(),
            width: 1,
            speed: 1
        };

        const config = { ...defaultConfig, ...options };
        delete config.mode;

        mango.pub('3D_mango_event', {
            action: 'setLayerHighlight',
            data: { layerIds, mode, config },
            time: Date.now()
        });

        this.state.currentLeyerHighlightIds = layerIds;
    }

    /**
     * 清除图层高亮
     * @param {string[]} layerIds
     */
    resetLayerHighlight(layerIds) {
        mango.pub('3D_mango_event', {
            action: 'resetLayerHighlight',
            data: { layerIds },
            time: Date.now()
        });

        if (this.state.currentLeyerHighlightIds === layerIds || this.state.currentLeyerHighlightIds.join() === layerIds?.join?.()) {
            this.state.currentLeyerHighlightIds = [];
        }
    }

    getModelIdBayDevId(devId, isNeedArray = false) {
        if (!devId) {
            nutmeg.warn('设备ID不能为空');
            return null;
        }

        const list = milo.get('transpDevMappingInfo') || [];
        const devIds = Array.isArray(devId) ? devId : [devId];
        const modelIds = list.filter((item) => devIds.includes(item.deviceId)).map((item) => item.modelId);
        return isNeedArray ? modelIds : (modelIds[0] ?? null);
    }
}

// 导出全局唯一实例
export const scene3D = new Scene3DManager();

export function scheduleLoadScene(containerEl) {
    clearTimeout(scheduleLoadTimer);
    const el = containerEl;
    scheduleLoadTimer = setTimeout(() => {
        scheduleLoadTimer = null;
        scene3D.loadScene(el);
    }, 100);
}

export function cancelScheduledLoadScene() {
    clearTimeout(scheduleLoadTimer);
    scheduleLoadTimer = null;
}

export const initScene = (...args) => scene3D.initScene(...args);
export const loadScene = (...args) => scene3D.loadScene(...args);
export const destroyScene = (...args) => scene3D.destroyScene(...args);
export const createPops = (...args) => scene3D.createPops(...args);
export const deletePops = (...args) => scene3D.deletePops(...args);
export const resetPerspective = (...args) => scene3D.resetPerspective(...args);
export const setLayerVisible = (...args) => scene3D.setLayerVisible(...args);
export const setModelVisible = (...args) => scene3D.setModelVisible(...args);
export const drawLineRanging = (...args) => scene3D.drawLineRanging(...args);
export const getCameraInfo = (...args) => scene3D.getCameraInfo(...args);
export const getSceneModelList = (...args) => scene3D.getSceneModelList(...args);
export const screenshotScene = (...args) => scene3D.screenshotCurrentView(...args);
export const getAllModelIds = (...args) => scene3D.getAllModelIds(...args);
export const highlight = (...args) => scene3D.highlight(...args);
export const getModelIdBayDevId = (...args) => scene3D.getModelIdBayDevId(...args);
export const highlightLayer = (...args) => scene3D.highlightLayer(...args);
