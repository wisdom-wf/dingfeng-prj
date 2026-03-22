/**
 * 高德地图可视化模块 - 修复版本
 * 解决AMap.Scale is not a constructor错误
 */

class AMapVisualizationFixed {
  constructor() {
    this.map = null;
    this.heatmap = null;
    this.markers = [];
    this.isAPILoaded = false;
  }

  /**
   * 检查并加载高德地图API
   * @returns {Promise} API加载完成的Promise
   */
  loadAMapAPI() {
    return new Promise((resolve, reject) => {
      if (typeof AMap !== 'undefined' && this.isAPILoaded) {
        resolve();
        return;
      }

      if (typeof AMap !== 'undefined') {
        this.isAPILoaded = true;
        resolve();
        return;
      }

      console.log('正在加载高德地图API...');
      const script = document.createElement('script');
      script.src = 'https://webapi.amap.com/maps?v=2.0&key=c3393e2109cc291f294da41f0884d5d3';
      script.async = true;
      
      script.onload = () => {
        console.log('高德地图API加载完成');
        this.isAPILoaded = true;
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('加载高德地图API失败:', error);
        reject(new Error('加载高德地图API失败'));
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * 异步加载高德地图插件
   * @param {Array} plugins - 插件名称数组
   * @returns {Promise} 插件加载完成的Promise
   */
  loadPlugins(plugins) {
    return new Promise((resolve, reject) => {
      if (!this.isAPILoaded || typeof AMap === 'undefined') {
        reject(new Error('请先加载高德地图API'));
        return;
      }

      AMap.plugin(plugins, () => {
        console.log('插件加载完成:', plugins);
        resolve();
      });
    });
  }

  /**
   * 初始化地图
   * @param {string} containerId - 地图容器ID
   * @returns {Promise} 地图初始化完成的Promise
   */
  async initMap(containerId) {
    try {
      console.log('开始初始化地图...');
      console.log('容器ID:', containerId);
      
      // 检查容器是否存在
      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`地图容器不存在: ${containerId}`);
      }
      
      // 1. 加载高德地图API
      await this.loadAMapAPI();
      
      // 2. 异步加载需要的插件
      await this.loadPlugins([
        'AMap.Heatmap',
        'AMap.DistrictSearch',
        'AMap.ToolBar',
        'AMap.HawkEye'
      ]);
      
      // 3. 创建地图实例
      // 验证坐标参数
      const centerLng = parseFloat(109.49);
      const centerLat = parseFloat(36.60);
      
      if (isNaN(centerLng) || isNaN(centerLat)) {
        throw new Error('无效的地图中心坐标');
      }
      
      this.map = new AMap.Map(containerId, {
        zoom: 10,
        center: [centerLng, centerLat], // 延安市中心
        viewMode: '3D',
        pitch: 40,
        rotation: -15,
        mapStyle: 'amap://styles/light',
        features: ['bg', 'road', 'building', 'point'],
        showIndoorMap: false
      });
      
      console.log('地图实例创建成功');
      
      // 4. 使用异步方式添加控件
      // 4.1 添加工具条
      AMap.plugin(['AMap.ToolBar'], () => {
        try {
          const toolbar = new AMap.ToolBar();
          this.map.addControl(toolbar);
          console.log('工具条添加成功');
        } catch (error) {
          console.error('工具条添加失败:', error);
        }
      });
      
      // 4.2 添加鹰眼
      AMap.plugin(['AMap.HawkEye'], () => {
        try {
          const hawkEye = new AMap.HawkEye({
            opened: false
          });
          this.map.addControl(hawkEye);
          console.log('鹰眼添加成功');
        } catch (error) {
          console.error('鹰眼添加失败:', error);
        }
      });
      
      // 5. 初始化热力图
      AMap.plugin(['AMap.Heatmap'], () => {
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
        console.log('热力图初始化成功');
      });
      
      // 6. 绑定地图点击事件
      this.map.on('click', (e) => {
        this.onMapClick(e);
      });
      
      console.log('地图初始化完成');
      return this.map;
      
    } catch (error) {
      console.error('初始化地图失败:', error);
      throw error;
    }
  }

  /**
   * 地图点击事件处理
   * @param {Object} e - 事件对象
   */
  onMapClick(e) {
    console.log('地图点击位置:', e.lnglat);
    
    // 清除之前的标记
    this.clearMarkers();
    
    // 添加新标记
    const marker = new AMap.Marker({
      position: e.lnglat,
      title: '点击位置',
      content: '<div style="background: #4285f4; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">📍</div>'
    });
    
    marker.setMap(this.map);
    this.markers.push(marker);
    
    // 显示信息窗口
    const infoWindow = new AMap.InfoWindow({
      content: `<div style="padding: 10px;">
        <h4>点击位置</h4>
        <p>经度: ${e.lnglat.getLng().toFixed(6)}</p>
        <p>纬度: ${e.lnglat.getLat().toFixed(6)}</p>
        <p>时间: ${new Date().toLocaleString()}</p>
      </div>`,
      offset: new AMap.Pixel(0, -30)
    });
    
    infoWindow.open(this.map, e.lnglat);
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
   * 设置热力图数据
   * @param {Array} data - 热力图数据 [{lng: 109.49, lat: 36.60, count: 10}, ...]
   */
  setHeatmapData(data) {
    if (!this.heatmap) {
      console.warn('热力图未初始化');
      return;
    }
    
    const heatmapData = data.map(item => ({
      lng: item.lng,
      lat: item.lat,
      count: item.count || 1
    }));
    
    this.heatmap.setDataSet({
      data: heatmapData,
      max: 100
    });
    
    console.log('热力图数据设置成功，数据点数量:', heatmapData.length);
  }

  /**
   * 添加区域标记
   * @param {Object} region - 区域信息 {name: '区域名称', lng: 109.49, lat: 36.60, count: 10}
   */
  addRegionMarker(region) {
    if (!this.map) {
      console.warn('地图未初始化');
      return;
    }
    
    const marker = new AMap.Marker({
      position: [region.lng, region.lat],
      title: region.name,
      content: `<div style="background: #ff6b6b; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
        ${region.count}
      </div>`
    });
    
    marker.setMap(this.map);
    this.markers.push(marker);
    
    // 绑定点击事件
    marker.on('click', () => {
      const infoWindow = new AMap.InfoWindow({
        content: `<div style="padding: 10px;">
          <h4>${region.name}</h4>
          <p>预约数量: ${region.count}</p>
          <p>经度: ${region.lng.toFixed(6)}</p>
          <p>纬度: ${region.lat.toFixed(6)}</p>
        </div>`,
        offset: new AMap.Pixel(0, -30)
      });
      
      infoWindow.open(this.map, [region.lng, region.lat]);
    });
  }

  /**
   * 清除地图
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
    
    console.log('地图已销毁');
  }
}

// 创建全局实例
window.amapVisualizer = new AMapVisualizationFixed();