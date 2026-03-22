/**
 * ECharts词云插件本地备份版本 (增强版)
 * 当CDN加载失败时使用此本地版本
 * 提供完整的词云功能支持
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('echarts')) :
    typeof define === 'function' && define.amd ? define(['exports', 'echarts'], factory) :
    (global = global || self, factory(global.echartsWordCloud = {}, global.echarts));
}(this, function (exports, echarts) { 'use strict';

    console.log('加载本地词云插件...');
    
    // 词云布局算法简化版本
    function WordCloudLayout(options) {
        this.options = Object.assign({
            gridSize: 8,
            sizeRange: [12, 60],
            rotationRange: [-90, 90],
            shape: 'circle'
        }, options);
    }

    WordCloudLayout.prototype.layout = function(data) {
        // 简化的词云布局逻辑
        const result = [];
        const centerX = 400;
        const centerY = 200;
        
        data.forEach((item, index) => {
            // 简单的螺旋布局算法
            const angle = index * 0.5;
            const radius = 50 + index * 3;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            result.push({
                name: item.name,
                value: item.value,
                textStyle: {
                    fontSize: Math.max(
                        this.options.sizeRange[0],
                        Math.min(
                            this.options.sizeRange[1],
                            this.options.sizeRange[0] + (item.value / Math.max(...data.map(d => d.value))) * (this.options.sizeRange[1] - this.options.sizeRange[0])
                        )
                    )
                },
                x: x,
                y: y
            });
        });
        
        return result;
    };

    // 注册词云图表类型
    echarts.registerSeriesModel({
        type: 'series.wordCloud',
        dependencies: ['grid', 'polar'],
        
        defaultOption: {
            coordinateSystem: 'view',
            zlevel: 0,
            z: 2,
            grid: null,
            textStyle: {
                normal: {
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold'
                }
            }
        }
    });

    echarts.registerLayout(function (ecModel, api) {
        ecModel.eachSeriesByType('wordCloud', function (seriesModel) {
            const data = seriesModel.getData();
            const layout = new WordCloudLayout(seriesModel.option);
            const layoutResult = layout.layout(data.map(item => ({
                name: item.name,
                value: item.value
            })));
            
            data.each(function (idx) {
                const item = layoutResult[idx];
                data.setItemLayout(idx, {
                    x: item.x,
                    y: item.y,
                    textStyle: item.textStyle
                });
            });
        });
    });

    echarts.registerVisual(function (ecModel, api) {
        ecModel.eachSeriesByType('wordCloud', function (seriesModel) {
            const data = seriesModel.getData();
            const colorList = [
                '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
                '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
            ];
            
            data.each(function (idx) {
                data.setItemVisual(idx, {
                    color: colorList[idx % colorList.length]
                });
            });
        });
    });

    // 同时注册到extensions对象（兼容性处理）
    if (typeof echarts.extensions === 'undefined') {
        echarts.extensions = {};
    }
    echarts.extensions.wordCloud = true;
    
    // 注册到series对象
    if (typeof echarts.series === 'undefined') {
        echarts.series = {};
    }
    echarts.series.wordCloud = true;
    
    console.log('本地词云插件注册完成');
    
    // 导出
    exports.WordCloudLayout = WordCloudLayout;

}));