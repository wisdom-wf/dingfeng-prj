/**
 * 高德地图可视化工具类
 * 使用高德地图API (Key: c3393e2109cc291f294da41f0884d5d3)
 * 用于延安市地址数据的地图可视化
 */

class AMapVisualization {
  constructor() {
    this.map = null;
    this.markers = [];
    this.regions = [];
    this.heatmap = null;
    this.selectedRegion = null;
    this.currentData = null;
    
    // 延安市区域中心坐标
    this.regionCoordinates = {
      '宝塔区': [109.49, 36.60],
      '安塞区': [109.34, 36.86],
      '延长县': [110.01, 36.58],
      '延川县': [110.19, 36.88],
      '子长市': [109.67, 37.14],
      '志丹县': [108.76, 36.82],
      '吴起县': [108.18, 36.93],
      '甘泉县': [109.35, 36.28],
      '富县': [109.38, 35.99],
      '洛川县': [109.43, 35.76],
      '宜川县': [110.16, 36.05],
      '黄龙县': [109.84, 35.59],
      '黄陵县': [109.26, 35.58]
    };
    
    // 区域颜色
    this.regionColors = {
      '宝塔区': '#1890ff',
      '安塞区': '#2fc25b',
      '延长县': '#facc14',
      '延川县': '#f04864',
      '子长市': '#8543e0',
      '志丹县': '#00d4b8',
      '吴起县': '#ff7a45',
      '甘泉县': '#bae637',
      '富县': '#9254de',
      '洛川县': '#ff4d4f',
      '宜川县': '#36cfc9',
      '黄龙县': '#ffa940',
      '黄陵县': '#597ef7'
    };
  }

  /**
   * 初始化高德地图
   * @param {string} containerId - 地图容器ID
   */
  initMap(containerId) {
    return new Promise((resolve, reject) => {
      // 检查高德地图API是否已加载
      if (typeof AMap === 'undefined') {
        // 动态加载高德地图API - 添加必要的控件插件
        const script = document.createElement('script');
        script.src = `https://webapi.amap.com/maps?v=2.0&key=c3393e2109cc291f294da41f0884d5d3&plugin=AMap.Heatmap,AMap.DistrictSearch,AMap.Scale,AMap.ToolBar,AMap.HawkEye`;
        script.async = true;
        script.onload = () => {
          try {
            this._createMap(containerId, resolve);
          } catch (error) {
            reject(error);
          }
        };
        script.onerror = () => {
          reject(new Error('加载高德地图API失败'));
        };
        document.head.appendChild(script);
      } else {
        try {
          this._createMap(containerId, resolve);
        } catch (error) {
          reject(error);
        }
      }
    });
  }

  /**
   * 创建地图实例
   * @param {string} containerId - 地图容器ID
   * @param {Function} resolve - Promise回调
   */
  _createMap(containerId, resolve) {
    try {
      // 初始化地图
      this.map = new AMap.Map(containerId, {
        zoom: 10,
        center: [109.49, 36.60], // 延安市中心
        viewMode: '3D',
        pitch: 40,
        rotation: -15,
        mapStyle: 'amap://styles/light',
        features: ['bg', 'road', 'building', 'point'],
        showIndoorMap: false
      });

      // 添加地图控件 - 高德地图API v2.0的控件名称
      this.map.addControl(new AMap.Scale());
      this.map.addControl(new AMap.ToolBar({
        position: { top: '10px', right: '10px' }
      }));
      
      // 添加鹰眼
      this.map.addControl(new AMap.HawkEye({
        opened: false
      }));

      // 初始化热力图
      this.heatmap = new AMap.Heatmap(this.map, {
        radius: 25, // 热力点半径
        opacity: [0, 0.8],
        gradient: {
          0.4: 'rgb(0, 255, 255)',
          0.65: 'rgb(0, 110, 255)',
          0.8: 'rgb(100, 0, 255)',
          1.0: 'rgb(100, 0, 255)'
        }
      });

      // 绑定地图点击事件
      this.map.on('click', (e) => {
        this.onMapClick(e);
      });

      console.log('高德地图初始化成功');
      resolve(this.map);
    } catch (error) {
      console.error('创建地图失败:', error);
      // 这里不能直接使用reject，因为reject参数没有传递进来
      // 改为抛出错误，由调用者处理
      throw error;
    }
  }

  /**
   * 更新地图数据
   * @param {Object} addressData - livaddress分析数据
   */
  updateMapData(addressData) {
    if (!this.map) {
      console.error('地图未初始化');
      return;
    }

    this.currentData = addressData;
    
    // 清除之前的标记点
    this.clearMarkers();
    
    // 统计各区域数据
    const regionStats = this.processAddressData(addressData);
    this.regions = regionStats;
    
    // 添加区域标记
    this.addRegionMarkers(regionStats);
    
    // 更新热力图
    this.updateHeatmap(regionStats);
    
    // 更新区域详情面板
    this.updateRegionDetail();
  }

  /**
   * 处理地址数据
   * @param {Object} addressData - 原始地址数据
   * @returns {Array} 区域统计数据
   */
  processAddressData(addressData) {
    const regionStats = {};
    
    // 初始化所有区域
    Object.keys(this.regionCoordinates).forEach(regionName => {
      regionStats[regionName] = {
        name: regionName,
        count: 0,
        coordinates: this.regionCoordinates[regionName],
        color: this.regionColors[regionName],
        addresses: []
      };
    });

    // 统计地址数据
    if (addressData.records && Array.isArray(addressData.records)) {
      addressData.records.forEach(record => {
        const addr = record['居住地址'] || record['liveaddress'] || '';
        if (addr) {
          const region = this.detectRegion(addr);
          if (region && regionStats[region]) {
            regionStats[region].count++;
            regionStats[region].addresses.push({
              address: addr,
              name: record['姓名'] || '',
              phone: record['联系电话'] || '',
              service: record['预约服务类型'] || '',
              status: record['处理状态'] || ''
            });
          }
        }
      });
    }

    // 转换为数组
    return Object.values(regionStats);
  }

  /**
   * 检测地址所属区域
   * @param {string} address - 地址字符串
   * @returns {string|null} 区域名称
   */
  detectRegion(address) {
    const regionMapping = {
      '宝塔': '宝塔区',
      '安塞': '安塞区',
      '延长': '延长县',
      '延川': '延川县',
      '子长': '子长市',
      '志丹': '志丹县',
      '吴起': '吴起县',
      '甘泉': '甘泉县',
      '富县': '富县',
      '洛川': '洛川县',
      '宜川': '宜川县',
      '黄龙': '黄龙县',
      '黄陵': '黄陵县'
    };

    for (const [keyword, region] of Object.entries(regionMapping)) {
      if (address.includes(keyword)) {
        return region;
      }
    }

    return null;
  }

  /**
   * 添加区域标记
   * @param {Array} regionStats - 区域统计数据
   */
  addRegionMarkers(regionStats) {
    regionStats.forEach(region => {
      if (region.count > 0) {
        const marker = new AMap.Marker({
          position: region.coordinates,
          title: `${region.name}: ${region.count}个预约`,
          content: this.createMarkerContent(region),
          offset: new AMap.Pixel(-15, -15)
        });

        // 添加点击事件
        marker.on('click', () => {
          this.onRegionClick(region);
        });

        this.map.add(marker);
        this.markers.push(marker);
      }
    });
  }

  /**
   * 创建标记内容
   * @param {Object} region - 区域数据
   * @returns {string} HTML内容
   */
  createMarkerContent(region) {
    const size = Math.min(Math.max(region.count, 10), 50);
    const opacity = Math.min(region.count / 50, 0.9);
    
    return `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${region.color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${Math.max(size/3, 10)}px;
        opacity: ${opacity};
        cursor: pointer;
        transition: transform 0.2s;
      ">
        ${region.count}
      </div>
    `;
  }

  /**
   * 更新热力图
   * @param {Array} regionStats - 区域统计数据
   */
  updateHeatmap(regionStats) {
    const heatmapData = [];
    
    regionStats.forEach(region => {
      if (region.count > 0) {
        // 为每个区域添加多个热力点，以模拟分布
        const count = Math.min(region.count, 20);
        for (let i = 0; i < count; i++) {
          const offsetLng = (Math.random() - 0.5) * 0.1;
          const offsetLat = (Math.random() - 0.5) * 0.1;
          heatmapData.push({
            lng: region.coordinates[0] + offsetLng,
            lat: region.coordinates[1] + offsetLat,
            count: 1
          });
        }
      }
    });

    this.heatmap.setDataSet({
      data: heatmapData,
      max: 20
    });
  }

  /**
   * 区域点击事件处理
   * @param {Object} region - 区域数据
   */
  onRegionClick(region) {
    this.selectedRegion = region;
    
    // 高亮选中区域
    this.highlightRegion(region);
    
    // 显示区域详情
    this.showRegionDetails(region);
    
    // 调整地图视角
    this.map.setCenter(region.coordinates);
    this.map.setZoom(12);
  }

  /**
   * 地图点击事件处理
   * @param {Object} e - 地图事件对象
   */
  onMapClick(e) {
    // 重置选择
    this.selectedRegion = null;
    this.updateRegionDetail();
  }

  /**
   * 高亮选中区域
   * @param {Object} region - 区域数据
   */
  highlightRegion(region) {
    // 清除之前的高亮
    this.clearHighlight();
    
    // 添加高亮圆
    const circle = new AMap.Circle({
      center: region.coordinates,
      radius: 10000, // 10公里半径
      strokeColor: region.color,
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: region.color,
      fillOpacity: 0.1
    });
    
    circle.setMap(this.map);
    this.highlightCircle = circle;
  }

  /**
   * 清除高亮
   */
  clearHighlight() {
    if (this.highlightCircle) {
      this.highlightCircle.setMap(null);
      this.highlightCircle = null;
    }
  }

  /**
   * 显示区域详情
   * @param {Object} region - 区域数据
   */
  showRegionDetails(region) {
    const detailContent = document.getElementById('regionContent');
    if (!detailContent) return;
    
    let html = `
      <div class="region-header mb-3">
        <h6 class="fw-bold mb-1" style="color: ${region.color}">${region.name}</h6>
        <div class="d-flex justify-content-between align-items-center">
          <span>预约数量: <strong>${region.count}</strong></span>
          <small class="text-muted">点击地图其他位置取消选择</small>
        </div>
      </div>
    `;
    
    if (region.addresses.length > 0) {
      html += `
        <div class="region-addresses">
          <h7 class="fw-medium mb-2">最近预约记录:</h7>
          <div class="list-group small">
      `;
      
      region.addresses.slice(0, 5).forEach((addr, index) => {
        html += `
          <div class="list-group-item border-0 p-2">
            <div class="d-flex justify-content-between">
              <span class="fw-medium">${addr.name}</span>
              <span class="badge ${addr.status === '已处理' ? 'bg-success' : 'bg-warning'}">${addr.status}</span>
            </div>
            <div class="text-muted">${addr.service}</div>
            <div class="text-truncate" title="${addr.address}">${addr.address}</div>
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="text-muted small">
          <i class="fas fa-info-circle me-1"></i>该区域暂无预约记录
        </div>
      `;
    }
    
    detailContent.innerHTML = html;
  }

  /**
   * 更新区域详情面板
   */
  updateRegionDetail() {
    const detailContent = document.getElementById('regionContent');
    if (!detailContent) return;
    
    if (this.selectedRegion) {
      this.showRegionDetails(this.selectedRegion);
    } else {
      detailContent.innerHTML = `
        <div class="text-center text-muted py-3">
          <i class="fas fa-map-marker-alt fa-2x mb-2"></i>
          <p class="small mb-0">点击地图上的标记点查看区域详情</p>
          <p class="small">颜色越深、标记越大表示预约数量越多</p>
        </div>
      `;
    }
  }

  /**
   * 清除所有标记点
   */
  clearMarkers() {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];
  }

  /**
   * 重置地图视图
   */
  resetView() {
    if (this.map) {
      this.map.setCenter([109.49, 36.60]);
      this.map.setZoom(10);
      this.clearHighlight();
      this.selectedRegion = null;
      this.updateRegionDetail();
    }
  }

  /**
   * 导出地图图片
   */
  exportMapImage() {
    if (!this.map) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const context = canvas.getContext('2d');
    
    // 创建临时地图用于截图
    const tempMap = new AMap.Map(canvas, {
      zoom: this.map.getZoom(),
      center: this.map.getCenter(),
      mapStyle: 'amap://styles/light',
      viewMode: '2D'
    });
    
    // 添加当前标记点
    this.markers.forEach(marker => {
      const tempMarker = new AMap.Marker({
        position: marker.getPosition(),
        content: marker.getContent()
      });
      tempMap.add(tempMarker);
    });
    
    // 添加标题
    context.fillStyle = '#333';
    context.font = 'bold 24px Arial';
    context.fillText('延安市养老服务地址分布图', 50, 40);
    context.font = '16px Arial';
    context.fillStyle = '#666';
    context.fillText(`生成时间: ${new Date().toLocaleString()}`, 50, 70);
    
    // 保存图片
    setTimeout(() => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `延安市地址分布_${new Date().getTime()}.png`;
      link.click();
    }, 1000);
  }

  /**
   * 销毁地图实例
   */
  destroy() {
    this.clearMarkers();
    this.clearHighlight();
    if (this.heatmap) {
      this.heatmap.setMap(null);
      this.heatmap = null;
    }
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
    this.regions = [];
    this.currentData = null;
    this.selectedRegion = null;
  }
}

// 全局导出
if (typeof window !== 'undefined') {
  window.AMapVisualization = AMapVisualization;
}