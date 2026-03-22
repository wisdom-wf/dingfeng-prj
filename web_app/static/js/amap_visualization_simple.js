/**
 * 简化版高德地图可视化工具
 * 专为养老服务预约数据分析设计
 */

class SimpleAMapVisualizer {
    constructor() {
        this.map = null;
        this.markers = [];
        this.heatmap = null;
        this.isInitialized = false;
    }

    /**
     * 初始化地图
     * @param {string} containerId - 地图容器ID
     * @returns {Promise}
     */
    async initMap(containerId) {
        return new Promise((resolve, reject) => {
            try {
                // 检查容器是否存在
                const container = document.getElementById(containerId);
                if (!container) {
                    throw new Error(`地图容器不存在: ${containerId}`);
                }

                // 检查高德地图API是否已加载
                if (typeof AMap === 'undefined') {
                    // 动态加载高德地图API
                    this.loadAMapAPI()
                        .then(() => {
                            this.createMap(containerId);
                            resolve();
                        })
                        .catch(reject);
                } else {
                    this.createMap(containerId);
                    resolve();
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 加载高德地图API
     * @returns {Promise}
     */
    loadAMapAPI() {
        return new Promise((resolve, reject) => {
            // 设置安全密钥配置（必须在API加载前设置）
            if (!window._AMapSecurityConfig) {
                window._AMapSecurityConfig = {
        securityJsCode: "c3393e2109cc291f294da41f0884d5d3"
    };
            }
            
            const script = document.createElement('script');
            script.src = 'https://webapi.amap.com/maps?v=2.0&key=cecc9ac00f6780e341db70a3ddd57e4e';
            script.async = true;
            
            script.onload = () => {
                console.log('高德地图API加载成功');
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error('高德地图API加载失败'));
            };
            
            document.head.appendChild(script);
        });
    }

    /**
     * 创建地图实例
     * @param {string} containerId - 容器ID
     */
    createMap(containerId) {
        try {
            // 延安市坐标
            const center = [109.49, 36.60];
            
            this.map = new AMap.Map(containerId, {
                zoom: 10,
                center: center,
                viewMode: '2D',
                mapStyle: 'amap://styles/light'
            });

            // 添加基础控件（不使用Scale和ToolBar，避免构造函数错误）
            // // 注释掉Scale控件，避免构造函数错误
            // // 注释掉Scale控件，避免构造函数错误
            // // 注释掉Scale控件，避免构造函数错误
            // this.map.addControl(new AMap.Scale());  // 注释掉，避免AMap.Scale is not a constructor错误
            // // 注释掉ToolBar控件，避免构造函数错误
            // // 注释掉ToolBar控件，避免构造函数错误
            // // 注释掉ToolBar控件，避免构造函数错误
            // this.map.addControl(new AMap.ToolBar()); // 注释掉，避免AMap.ToolBar is not a constructor错误

            this.isInitialized = true;
            console.log('地图初始化成功');
        } catch (error) {
            console.error('地图创建失败:', error);
            throw error;
        }
    }

    /**
     * 添加热力图数据
     * @param {Array} data - 数据点数组 [{lng: 经度, lat: 纬度, count: 权重}]
     */
    addHeatmap(data) {
        if (!this.isInitialized || !this.map) {
            console.warn('地图未初始化');
            return;
        }

        try {
            // 清除之前的热力图
            if (this.heatmap) {
                this.heatmap.setMap(null);
            }

            // 创建热力图
            this.heatmap = new AMap.Heatmap(this.map, {
                radius: 25,
                opacity: [0, 0.8],
                gradient: {
                    0.4: 'rgb(0, 255, 255)',
                    0.65: 'rgb(0, 110, 255)',
                    0.8: 'rgb(100, 0, 255)',
                    1.0: 'rgb(100, 0, 255)'
                }
            });

            // 设置数据
            this.heatmap.setDataSet({
                data: data,
                max: Math.max(...data.map(item => item.count))
            });

            console.log(`热力图添加成功，共${data.length}个数据点`);
        } catch (error) {
            console.error('热力图添加失败:', error);
        }
    }

    /**
     * 添加标记点
     * @param {Array} markers - 标记点数组 [{lng: 经度, lat: 纬度, content: 内容}]
     */
    addMarkers(markers) {
        if (!this.isInitialized || !this.map) {
            console.warn('地图未初始化');
            return;
        }

        try {
            // 清除之前的标记
            this.clearMarkers();

            markers.forEach((markerData, index) => {
                const marker = new AMap.Marker({
                    position: [markerData.lng, markerData.lat],
                    title: markerData.title || `标记${index + 1}`,
                    content: markerData.content || this.getDefaultMarkerContent(markerData.count || 0)
                });

                marker.setMap(this.map);
                this.markers.push(marker);
            });

            console.log(`标记点添加成功，共${markers.length}个标记`);
        } catch (error) {
            console.error('标记点添加失败:', error);
        }
    }

    /**
     * 获取默认标记点内容
     * @param {number} count - 数量
     * @returns {string} HTML内容
     */
    getDefaultMarkerContent(count) {
        const size = Math.max(30, Math.min(60, 20 + count * 2));
        const color = count > 50 ? '#ff4d4f' : count > 20 ? '#ffa940' : '#52c41a';
        
        return `
            <div style="
                background: ${color};
                color: white;
                border-radius: 50%;
                width: ${size}px;
                height: ${size}px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                border: 2px solid white;
            ">
                ${count}
            </div>
        `;
    }

    /**
     * 清除所有标记
     */
    clearMarkers() {
        this.markers.forEach(marker => {
            marker.setMap(null);
        });
        this.markers = [];
    }

    /**
     * 设置地图视图到指定区域
     * @param {Array} bounds - 边界 [[西南角经度, 西南角纬度], [东北角经度, 东北角纬度]]
     */
    setBounds(bounds) {
        if (!this.isInitialized || !this.map) return;
        
        try {
            const boundsObj = new AMap.Bounds(bounds[0], bounds[1]);
            this.map.setBounds(boundsObj);
        } catch (error) {
            console.error('设置地图边界失败:', error);
        }
    }

    /**
     * 重置地图视图
     */
    resetView() {
        if (!this.isInitialized || !this.map) return;
        
        this.map.setZoomAndCenter(10, [109.49, 36.60]);
    }

    /**
     * 销毁地图
     */
    destroy() {
        this.clearMarkers();
        
        if (this.heatmap) {
            this.heatmap.setMap(null);
            this.heatmap = null;
        }
        
        if (this.map) {
            this.map.destroy();
            this.map = null;
        }
        
        this.isInitialized = false;
        console.log('地图已销毁');
    }
}

// 创建全局实例
window.simpleAMapVisualizer = new SimpleAMapVisualizer();