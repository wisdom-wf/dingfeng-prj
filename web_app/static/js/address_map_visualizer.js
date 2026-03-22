/**
 * 地图可视化分析组件
 * 基于高德地图API实现服务地址的地理分布可视化
 */

class AddressMapVisualizer {
    constructor(mapContainerId) {
        this.mapContainerId = mapContainerId;
        this.map = null;
        this.markers = [];
        this.heatmapLayer = null;
        this.districtExplorer = null;
    }

    /**
     * 初始化地图
     */
    async initMap() {
        return new Promise((resolve, reject) => {
            // 加载高德地图API，使用正确的JS API Key
            const script = document.createElement('script');
            script.src = 'https://webapi.amap.com/maps?v=2.0&key=cecc9ac00f6780e341db70a3ddd57e4e&plugin=AMap.Scale,AMap.ToolBar,AMap.Geocoder,AMap.DistrictSearch,AMap.Heatmap';
            script.async = true;
            
            script.onload = () => {
                // 等待AMap对象完全加载
                const checkAMap = setInterval(() => {
                    if (window.AMap) {
                        clearInterval(checkAMap);
                        this.createMap();
                        resolve();
                    }
                }, 100);
                
                // 超时处理
                setTimeout(() => {
                    if (!window.AMap) {
                        clearInterval(checkAMap);
                        reject(new Error('地图API加载超时'));
                    }
                }, 10000);
            };
            
            script.onerror = () => {
                reject(new Error('地图API加载失败'));
            };
            
            document.head.appendChild(script);
        });
    }

    /**
     * 创建地图实例
     */
    createMap() {
        this.map = new AMap.Map(this.mapContainerId, {
            zoom: 12,
            center: [109.49081, 36.596537], // 延安市宝塔区中心坐标
            mapStyle: 'amap://styles/normal'
        });

        // 添加基础地图控件
        this.map.addControl(new AMap.Scale());
        this.map.addControl(new AMap.ToolBar());
        
        console.log('地图初始化完成');
    }

    /**
     * 显示预约总数标记
     * @param {Array} data - 预约数据
     */
    showReservationCount(data) {
        // 清除之前的标记
        this.clearMarkers();
        
        // 宝塔区中心坐标
        const baotaCenter = new AMap.LngLat(109.489692, 36.585142);
        
        // 计算预约总数
        const totalCount = data.length;
        
        // 创建标记
        const marker = new AMap.Marker({
            position: baotaCenter,
            title: `宝塔区预约总数: ${totalCount}`,
            label: {
                content: `<div style="background: #ff6b6b; color: white; padding: 8px 12px; border-radius: 20px; font-weight: bold; box-shadow: 0 2px 6px rgba(0,0,0,0.3); text-align: center;">
                    <div>宝塔区</div>
                    <div style="font-size: 18px;">${totalCount}</div>
                    <div style="font-size: 12px;">预约总数</div>
                </div>`,
                offset: new AMap.Pixel(-30, -50)
            }
        });
        
        // 添加点击事件
        marker.on('click', () => {
            alert(`宝塔区预约总数: ${totalCount} 条`);
        });
        
        this.map.add(marker);
        this.markers.push(marker);
        
        // 居中显示
        this.map.setCenter(baotaCenter);
        this.map.setZoom(12);
        
        console.log(`已在地图上显示宝塔区预约总数: ${totalCount}`);
    }

    /**
     * 批量地理编码
     * @param {Array} addressData - 地址数据
     */
    async batchGeocodeAddresses(addressData) {
        // 确保地理编码器已加载
        if (!window.AMap.Geocoder) {
            throw new Error('地理编码器插件未加载');
        }
        
        const geocoder = new AMap.Geocoder({
            city: '延安市'
        });
        
        const results = [];
        
        // 严格限制处理数量
        const maxProcess = Math.min(addressData.length, 30); // 进一步减少到30个
        const processData = addressData.slice(0, maxProcess);
        
        console.log(`开始地理编码，处理 ${processData.length} 个地址`);
        
        // 单个处理，避免并发
        for (let i = 0; i < processData.length; i++) {
            const item = processData[i];
            
            try {
                const result = await new Promise((resolve, reject) => {
                    // 设置5秒超时
                    const timeout = setTimeout(() => {
                        reject(new Error('地理编码超时'));
                    }, 5000);
                    
                    geocoder.getLocation(item.address, (status, geoResult) => {
                        clearTimeout(timeout);
                        if (status === 'complete' && geoResult.geocodes.length > 0) {
                            resolve({
                                ...item,
                                location: geoResult.geocodes[0].location,
                                formattedAddress: geoResult.geocodes[0].formattedAddress
                            });
                        } else {
                            // 地理编码失败时使用延安市中心坐标
                            resolve({
                                ...item,
                                location: new AMap.LngLat(109.49081, 36.596537),
                                formattedAddress: item.address,
                                geocodeFailed: true
                            });
                        }
                    });
                });
                
                results.push(result);
                console.log(`地理编码进度: ${i + 1}/${processData.length}`);
                
                // 每个地址间隔300ms，给UI渲染时间
                if (i < processData.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
                
            } catch (error) {
                console.warn(`地址 '${item.address}' 地理编码失败:`, error.message);
                // 失败时也添加默认坐标
                results.push({
                    ...item,
                    location: new AMap.LngLat(109.49081, 36.596537),
                    formattedAddress: item.address,
                    geocodeFailed: true
                });
            }
        }
        
        console.log(`地理编码完成，成功处理 ${results.length} 个地址`);
        return results;
    }

    /**
     * 添加地图标记
     * @param {Object} item - 包含地址和位置信息的对象
     */
    addMarker(item) {
        // 限制标记数量，避免性能问题
        if (this.markers.length >= 100) {
            console.warn('标记数量已达上限(100个)，跳过添加');
            return;
        }
        
        const marker = new AMap.Marker({
            position: item.location,
            title: item.address,
            extData: item,
            // 优化标记样式
            icon: new AMap.Icon({
                size: new AMap.Size(20, 30),
                imageSize: new AMap.Size(20, 30),
                image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png'
            })
        });

        // 添加信息窗口
        const infoWindow = new AMap.InfoWindow({
            content: this.createInfoWindowContent(item),
            offset: new AMap.Pixel(0, -30),
            isCustom: false
        });

        marker.on('click', () => {
            infoWindow.open(this.map, marker.getPosition());
        });

        this.map.add(marker);
        this.markers.push(marker);
    }

    /**
     * 创建信息窗口内容
     * @param {Object} item - 数据项
     */
    createInfoWindowContent(item) {
        return `
            <div style="padding: 10px; min-width: 200px;">
                <h4 style="margin: 0 0 10px 0;">${item.name || '服务地址'}</h4>
                <p><strong>地址：</strong>${item.formattedAddress || item.address}</p>
                ${item.phone ? `<p><strong>电话：</strong>${item.phone}</p>` : ''}
                ${item.serviceType ? `<p><strong>服务类型：</strong>${item.serviceType}</p>` : ''}
                ${item.appointmentTime ? `<p><strong>预约时间：</strong>${item.appointmentTime}</p>` : ''}
            </div>
        `;
    }

    /**
     * 清除所有标记
     */
    clearMarkers() {
        this.markers.forEach(marker => {
            this.map.remove(marker);
        });
        this.markers = [];
    }

    /**
     * 销毁地图
     */
    destroy() {
        if (this.map) {
            this.map.destroy();
            this.map = null;
        }
        this.clearMarkers();
        console.log('地图已销毁');
    }
}

// 导出类
window.AddressMapVisualizer = AddressMapVisualizer;