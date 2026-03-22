# 养老服务预约数据采集与分析系统

基于 Flask 的养老服务预约数据采集与分析系统，支持多数据源自动采集、实时监控、数据可视化和导出功能。

## 功能特性

### 1. 数据采集
- 支持通过 curl 命令从全国养老服务信息平台 API 采集预约数据
- 自动区分已处理和未处理数据
- 支持数据追加和覆盖两种模式

### 2. 自动刷新监控
- 用户输入 curl 命令后自动启动定时器
- 每 120 秒自动刷新数据
- 支持添加多个数据源同时监控
- 实时显示倒计时和数据源状态

### 3. 数据可视化
- **处理状态分布**：饼图展示已处理/未处理比例
- **服务类型统计**：柱状图展示各类服务数量
- **地址词云分析**：基于服务地址的关键词词云
- **地区分布分析**：按区域统计预约数量

### 4. 数据导出
- 支持导出为 CSV 和 Excel 格式
- 可自定义导出字段
- 包含完整的数据脱敏处理

### 5. 界面特性
- **身份证号脱敏**：显示前6位+****+后4位
- **手机号脱敏**：显示前3位+****+后4位
- **实时统计卡片**：总预约数、未处理数、已处理数、处理率
- **状态颜色标识**：绿色-已处理，橙色-未处理

## 技术栈

- **后端**：Python 3 + Flask
- **前端**：Bootstrap 5 + Font Awesome + ECharts
- **数据处理**：Pandas
- **API**：RESTful API

## 项目结构

```
dingfeng-jiazheng/
├── web_app/
│   ├── app_modern.py          # Flask 主应用
│   ├── data_collector.py      # 数据采集器
│   ├── requirements.txt       # Python 依赖
│   ├── start_11236.sh        # 启动脚本
│   ├── templates/
│   │   ├── modern_dashboard.html      # 主页面
│   │   └── visualization_dashboard.html # 可视化大屏
│   └── static/
│       ├── css/
│       ├── js/
│       └── data/
├── images/                    # 项目截图
├── docs/                      # 部署文档
└── README.md
```

## 快速开始

### 环境要求

- Python 3.8+
- pip

### 安装依赖

```bash
cd web_app
pip install -r requirements.txt
```

### 启动服务

```bash
python app_modern.py
```

服务启动后访问：http://127.0.0.1:11236

### 使用流程

1. **获取 curl 命令**
   - 登录全国养老服务信息平台
   - 按 F12 打开开发者工具
   - 切换到 Network 标签
   - 找到 reservationPage 请求
   - 右键选择 "Copy as cURL"

2. **采集数据**
   - 粘贴 curl 命令到输入框
   - 点击"开始采集数据"
   - 首次采集会启动自动刷新定时器

3. **追加数据源**
   - 输入新的 curl 命令
   - 选择"追加新数据"模式
   - 可同时监控多个数据源

4. **查看可视化**
   - 点击"数据可视化"按钮
   - 查看完整的统计图表

5. **导出数据**
   - 点击导出按钮
   - 选择 CSV 或 Excel 格式

## API 接口

### 健康检查
```
GET /health
```

### 数据采集
```
POST /api/collect
Content-Type: application/json

{
    "curl": "curl 'https://...'",
    "mode": "overwrite"  // overwrite 或 append
}
```

### 导出 CSV
```
POST /api/export/csv
Content-Type: application/json

{
    "records": [...]
}
```

### 导出 Excel
```
POST /api/export/excel
Content-Type: application/json

{
    "records": [...]
}
```

## 部署指南

详见 [DEPLOY.md](docs/DEPLOY.md)

### 快速部署（Ubuntu）

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 创建虚拟环境（推荐）
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. 启动服务
python app_modern.py
```

### Nginx 反向代理配置

```nginx
location /dingfeng {
    proxy_pass http://127.0.0.1:11236;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

### systemd 服务配置

```ini
[Unit]
Description=Dingfeng Reservation Data Collector
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/path/to/web_app
ExecStart=/path/to/venv/bin/python /path/to/web_app/app_modern.py
Restart=always

[Install]
WantedBy=multi-user.target
```

## 数据字段说明

| 字段名 | 说明 |
|--------|------|
| 预约单号 | 预约记录唯一标识 |
| 姓名 | 预约人姓名 |
| 公民身份号码 | 身份证号（页面显示时脱敏） |
| 人员手机号 | 手机号（页面显示时脱敏） |
| 预约服务类型 | 服务类型名称 |
| 服务机构名称 | 服务机构全称 |
| 服务机构地址 | 服务机构地址 |
| 服务地址 | 服务地址（已补充省市区） |
| 处理状态 | 已处理/未处理 |
| 创建时间 | 预约创建时间 |

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue。
