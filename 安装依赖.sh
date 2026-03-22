#!/bin/bash
# 安装预约数据抓取工具所需的依赖

echo "======================================"
echo "安装预约数据抓取工具依赖"
echo "======================================"

# 检查Python版本
echo ""
echo "检查Python版本..."
python3 --version

# 安装Python依赖
echo ""
echo "正在安装Python依赖..."
pip3 install playwright pandas plotly openpyxl

# 安装Playwright浏览器
echo ""
echo "正在安装Playwright浏览器..."
playwright install chromium

echo ""
echo "======================================"
echo "✅ 依赖安装完成！"
echo "======================================"
echo ""
echo "使用步骤："
echo "1. 编辑 预约数据抓取脚本.py，填入你的用户名和密码"
echo "2. 运行: python3 预约数据抓取脚本.py"
echo "3. 在弹出的浏览器中手动输入验证码并登录"
echo "4. 登录成功后按回车，脚本会自动抓取数据"
echo "5. 运行: python3 预约数据分析报告.py 生成分析报告"
echo ""
