#!/bin/bash
# 启动预约数据抓取 Web 服务 - 固定端口11236

echo "======================================"
echo "预约数据抓取 Web 服务"
echo "======================================"

# 检查Python
if ! command -v python3 &> /dev/null; then
    echo "错误：未找到 Python3"
    exit 1
fi

# 安装依赖
echo ""
echo "检查依赖..."
pip3 install -q -r requirements.txt

# 启动服务
echo ""
echo "启动 Web 服务..."
echo "访问地址: http://127.0.0.1:11236"
echo ""
echo "按 Ctrl+C 停止服务"
echo "======================================"

python3 app_modern.py
