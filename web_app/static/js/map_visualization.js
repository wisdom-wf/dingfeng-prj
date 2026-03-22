/**
 * 延安市地图可视化工具类
 * 用于livaddress数据的地图可视化分析
 */

class YananMapVisualization {
  constructor() {
    this.mapChart = null;
    this.currentData = null;
    this.selectedRegion = null;
  }

  /**
   * 初始化地图
   * @param {string} containerId - 地图容器ID
   */
  initMap(containerId) {
    // 注册延安市地图
    echarts.registerMap('yanan', yananGeoJSON);
    
    // 初始化图表
    this.mapChart = echarts.init(document.getElementById(containerId));
    
    // 设置基础选项
    const baseOption = {
      backgroundColor: '#f8f9fa',
      title: {
        text: '延安市养老服务地址分布图',
        subtext: '基于livaddress数据分析',
        left: 'center',
        textStyle: {
          color: '#333',
          fontSize: 18,
          fontWeight: 'bold'
        },
        subtextStyle: {
          color: '#666',
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          if (params.componentType === 'series') {
            const data = params.data || {};
            let html = `<div style="font-weight:bold;margin-bottom:5px;">${params.name}</div>`;
            html += `<div>预约数量: ${data.value || 0}</div>`;
            if (data.population) {
              html += `<div>人口: ${data.population.toLocaleString()}</div>`;
            }
            if (data.area) {
              html += `<div>面积: ${data.area} km²</div>`;
            }
            return html;
          }
          return params.name;
        }
      },
      visualMap: {
        type: 'continuous',
        min: 0,
        max: 100,
        text: ['高', '低'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['#e6f7ff', '#1890ff', '#0050b3']
        },
        textStyle: {
          color: '#666'
        },
        left: 'left',
        bottom: 'bottom'
      },
      geo: {
        map: 'yanan',
        roam: true,
        zoom: 1.2,
        center: [109.49, 36.60],
        label: {
          emphasis: {
            show: true,
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: [4, 6],
            borderRadius: 4
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#fff',
            borderColor: '#ddd',
            borderWidth: 1
          },
          emphasis: {
            areaColor: '#1890ff',
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10
          }
        }
      },
      series: []
    };

    this.mapChart.setOption(baseOption);
    
    // 添加地图点击事件
    this.mapChart.on('click', (params) => {
      if (params.componentType === 'geo') {
        this.onRegionClick(params.name);
      }
    });

    // 响应式调整
    window.addEventListener('resize', () => {
      if (this.mapChart) {
        this.mapChart.resize();
      }
    });

    return this.mapChart;
  }

  /**
   * 更新地图数据
   * @param {Object} addressData - livaddress分析数据
   */
  updateMapData(addressData) {
    if (!this.mapChart) {
      console.error('地图未初始化');
      return;
    }

    this.currentData = addressData;
    
    // 处理地址数据，统计各区域数量
    const regionData = this.processAddressData(addressData);
    
    // 更新数据系列
    const series = [
      {
        name: '区域分布',
        type: 'map',
        mapType: 'yanan',
        roam: true,
        geoIndex: 0,
        data: regionData.map(region => ({
          name: region.name,
          value: region.count,
          population: region.population,
          area: region.area,
          itemStyle: {
            areaColor: regionColors[region.name] || '#1890ff'
          }
        })),
        label: {
          show: true,
          formatter: '{b}\n{c}',
          fontSize: 10,
          color: '#333'
        },
        emphasis: {
          label: {
            show: true,
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: [4, 6],
            borderRadius: 4
          },
          itemStyle: {
            areaColor: '#f04864',
            borderColor: '#f04864',
            borderWidth: 2
          }
        }
      }
    ];

    // 如果有详细地址数据，添加散点图
    if (addressData.detailed && addressData.detailed.length > 0) {
      const scatterData = this.generateScatterData(addressData.detailed);
      series.push({
        name: '详细地址',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: scatterData,
        symbolSize: 12,
        label: {
          show: false,
          formatter: '{b}',
          position: 'right',
          fontSize: 10
        },
        itemStyle: {
          color: '#f04864',
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        },
        emphasis: {
          label: {
            show: true,
            formatter: '{b}',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: [4, 6],
            borderRadius: 4
          },
          itemStyle: {
            color: '#ff8c00',
            shadowBlur: 15,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      });
    }

    // 更新图表选项
    this.mapChart.setOption({
      series: series,
      visualMap: {
        max: Math.max(...regionData.map(r => r.count), 10)
      }
    });
  }

  /**
   * 处理地址数据
   * @param {Object} addressData - 原始地址数据
   * @returns {Array} 区域统计数据
   */
  processAddressData(addressData) {
    const regionStats = {};
    
    // 初始化所有区域
    yananGeoJSON.features.forEach(feature => {
      const regionName = feature.properties.name;
      regionStats[regionName] = {
        name: regionName,
        count: 0,
        population: feature.properties.population,
        area: feature.properties.area,
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
              service: record['预约服务类型'] || ''
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
    const regions = [
      '宝塔区', '安塞区', '延长县', '延川县', '子长市',
      '志丹县', '吴起县', '甘泉县', '富县', '洛川县',
      '宜川县', '黄龙县', '黄陵县'
    ];

    // 简单关键词匹配
    for (const region of regions) {
      if (address.includes(region)) {
        return region;
      }
    }

    // 尝试简写匹配
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
   * 生成散点图数据
   * @param {Array} detailedAddresses - 详细地址列表
   * @returns {Array} 散点数据
   */
  generateScatterData(detailedAddresses) {
    const scatterData = [];
    
    // 为每个地址生成一个随机坐标（在实际应用中应该使用地理编码）
    detailedAddresses.forEach((addr, index) => {
      const region = this.detectRegion(addr.address);
      if (region) {
        // 获取该区域的中心坐标并添加随机偏移
        const regionFeature = yananGeoJSON.features.find(f => f.properties.name === region);
        if (regionFeature) {
          const [lng, lat] = regionFeature.properties.center;
          const offsetLng = (Math.random() - 0.5) * 0.1; // ±0.05度
          const offsetLat = (Math.random() - 0.5) * 0.1; // ±0.05度
          
          scatterData.push({
            name: addr.name || `用户${index + 1}`,
            value: [lng + offsetLng, lat + offsetLat],
            address: addr.address,
            phone: addr.phone,
            service: addr.service
          });
        }
      }
    });

    return scatterData;
  }

  /**
   * 区域点击事件处理
   * @param {string} regionName - 区域名称
   */
  onRegionClick(regionName) {
    this.selectedRegion = regionName;
    
    // 高亮选中区域
    this.mapChart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      name: regionName
    });

    // 显示区域详情
    this.showRegionDetails(regionName);
  }

  /**
   * 显示区域详情
   * @param {string} regionName - 区域名称
   */
  showRegionDetails(regionName) {
    if (!this.currentData) return;

    const regionData = this.processAddressData(this.currentData);
    const region = regionData.find(r => r.name === regionName);
    
    if (region) {
      // 在实际应用中，这里可以显示模态框或更新侧边栏
      console.log(`选中区域: ${regionName}`);
      console.log(`预约数量: ${region.count}`);
      console.log(`详细地址:`, region.addresses.slice(0, 5));
      
      // 可以在这里触发自定义事件，让其他组件更新
      const event = new CustomEvent('regionSelected', {
        detail: {
          region: regionName,
          count: region.count,
          addresses: region.addresses
        }
      });
      window.dispatchEvent(event);
    }
  }

  /**
   * 添加时间轴功能
   * @param {Array} timeSeriesData - 时间序列数据
   */
  addTimeSlider(timeSeriesData) {
    if (!this.mapChart) return;

    const option = {
      timeline: {
        data: Object.keys(timeSeriesData).sort(),
        axisType: 'category',
        autoPlay: true,
        playInterval: 2000,
        left: '10%',
        right: '10%',
        bottom: '3%',
        label: {
          formatter: function(s) {
            return s.substring(5); // 显示MM-DD格式
          }
        }
      },
      options: []
    };

    // 为每个时间点创建选项
    Object.entries(timeSeriesData).forEach(([date, data]) => {
      const regionData = this.processAddressData(data);
      option.options.push({
        title: { text: `延安市地址分布 - ${date}` },
        series: [{
          name: '区域分布',
          type: 'map',
          mapType: 'yanan',
          data: regionData.map(region => ({
            name: region.name,
            value: region.count
          }))
        }]
      });
    });

    this.mapChart.setOption(option);
  }

  /**
   * 导出地图图片
   * @param {string} filename - 文件名
   */
  exportMapImage(filename = 'yanan_map') {
    if (!this.mapChart) return;
    
    const imgData = this.mapChart.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
    
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${filename}_${new Date().getTime()}.png`;
    link.click();
  }

  /**
   * 重置地图视图
   */
  resetView() {
    if (!this.mapChart) return;
    
    this.mapChart.dispatchAction({
      type: 'geoRoam',
      zoom: 1.2,
      center: [109.49, 36.60]
    });
    
    this.selectedRegion = null;
  }

  /**
   * 销毁地图实例
   */
  destroy() {
    if (this.mapChart) {
      this.mapChart.dispose();
      this.mapChart = null;
    }
    this.currentData = null;
    this.selectedRegion = null;
  }
}

// 全局导出
if (typeof window !== 'undefined') {
  window.YananMapVisualization = YananMapVisualization;
}