# 变更日志

## [v2.0] - 2026-03-31

### 优化

#### 数据联动修复
- **visualization_dashboard.js**: 重写 `startAutoRefresh()` 函数，实现真正的数据自动获取
  - 添加 `fetchAndUpdateData()` 函数从 `/api/recent-data` 获取真实数据
  - 添加 `hashRecords()` 计算数据哈希检测变化
  - 添加 `updateChartsWithData()` 完整更新所有图表
  - 添加 `calculateServiceTypeData()`, `calculateGenderData()`, `calculateAreaData()` 数据计算函数

- **visualization_dashboard.html**: 修复 `updateChartData()` 空实现覆盖问题
  - 改为调用全局 `window.updateChartsWithData()` 函数

#### 图表复用优化
- **modern_dashboard.html**: `renderCharts()` 函数改为复用已有图表实例
  - 避免每次调用都 `echarts.init()` 创建新实例

#### UI/UE 优化
- **modern_dashboard.html**:
  - 添加自定义 `showToast()` 通知组件
  - 替换所有 10 处 `alert()` 为友好的 Toast 提示
  - 添加 Toast 动画 CSS (`slideIn`/`slideOut`)

#### 功能精简
- **modern_dashboard.html**: 移除数据可视化模块
  - 删除"数据可视化"按钮
  - 删除 `openVisualization()` 函数
  - 删除 `updateVizButtonState()` 函数

---

## [v1.0] - 2026-03-16

### 初始功能
- 养老服务预约数据采集系统
- curl 命令数据采集
- 自动定时刷新（120秒）
- 多数据源同时监控
- 数据可视化（饼图、柱状图、词云、地区分布）
- CSV/Excel 导出
- 身份证/手机号脱敏
