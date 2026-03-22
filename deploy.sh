#!/bin/bash
#========================================
# 丁峰家政预约数据系统 - 服务器部署脚本
#========================================

set -e

# 服务器配置
SERVER_IP="43.153.213.134"
SERVER_USER="ubuntu"
SERVER_PASS="w00135950F"
DEPLOY_PATH="/var/www/wisdomdance.cn/html/dingfeng"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo_step() {
    echo -e "${GREEN}==>${NC} $1"
}

echo_error() {
    echo -e "${RED}[错误]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[警告]${NC} $1"
}

# 检查expect工具
check_expect() {
    if ! command -v expect &> /dev/null; then
        echo_warn "expect 未安装，正在安装..."
        if command -v brew &> /dev/null; then
            brew install expect
        fi
    fi
}

# 上传文件到服务器
upload_files() {
    echo_step "上传文件到服务器..."
    
    LOCAL_PATH="/Volumes/works/红泥业务/10-dingfeng--pro/web_app"
    TEMP_PATH="/tmp/dingfeng_webapp"
    
    # 清理旧文件
    rm -rf "$TEMP_PATH" 2>/dev/null || true
    
    # 创建临时目录
    mkdir -p "$TEMP_PATH"
    
    # 使用rsync同步文件
    rsync -av --exclude='*.pyc' \
           --exclude='__pycache__' \
           --exclude='*.log' \
           --exclude='data/*.csv' \
           --exclude='.git' \
           --exclude='node_modules' \
           --exclude='*.DS_Store' \
           "$LOCAL_PATH/" "$TEMP_PATH/"
    
    # 创建expect脚本来上传
    cat > /tmp/upload.exp << 'EXPECTEOF'
#!/usr/bin/expect -f
set timeout 300
set password [lindex $argv 0]
set local_path [lindex $argv 1]
set server [lindex $argv 2]
set user [lindex $argv 3]
set deploy_path [lindex $argv 4]

spawn scp -r $local_path $user@$server:/tmp/
expect {
    "password:" {
        send "$password\r"
        exp_continue
    }
    "yes/no?" {
        send "yes\r"
        exp_continue
    }
    eof {
    }
}
EXPECTEOF

    chmod +x /tmp/upload.exp
    /tmp/upload.exp "$SERVER_PASS" "$TEMP_PATH" "$SERVER_IP" "$SERVER_USER" "$DEPLOY_PATH"
    
    echo "文件上传完成"
}

# 在服务器上执行部署
deploy_on_server() {
    echo_step "在服务器上执行部署..."
    
    cat > /tmp/deploy.exp << 'EXPECTEOF'
#!/usr/bin/expect -f
set timeout 600
set password [lindex $argv 0]
set server [lindex $argv 1]
set user [lindex $argv 2]
set deploy_path [lindex $argv 3]

# SSH连接
spawn ssh -o StrictHostKeyChecking=no $user@$server
expect {
    "password:" {
        send "$password\r"
    }
    "yes/no?" {
        send "yes\r"
        expect "password:"
        send "$password\r"
    }
}
expect "~> " { send "sudo su\r" }
expect {
    "password for" {
        send "$password\r"
        expect "~#"
    }
    "~#" {
    }
}

# 创建目录
send "mkdir -p $deploy_path\r"
expect "~#"
send "cp -r /tmp/dingfeng_webapp/* $deploy_path/\r"
expect {
    "~#" { }
    timeout { }
}

# 安装依赖
send "cd $deploy_path && pip3 install -q -r requirements.txt\r"
expect {
    "~#" { }
    timeout { send "\r"; expect "~#" }
}

# 创建systemd服务
send "cat > /etc/systemd/system/dingfeng.service << 'EOF'
[Unit]
Description=Dingfeng Reservation Data Collector
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=DEPLOYPATH
ExecStart=/usr/bin/python3 DEPLOYPATH/app_modern.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
"
expect "~#"
send "sed -i 's|DEPLOYPATH|$deploy_path|g' /etc/systemd/system/dingfeng.service\r"
expect "~#"

# 创建Nginx配置
send "cat > /etc/nginx/sites-available/dingfeng << 'EOF'
location /dingfeng {
    proxy_pass http://127.0.0.1:11236;
    proxy_set_header Host \\$host;
    proxy_set_header X-Real-IP \\$remote_addr;
    proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \\$scheme;
}
EOF
"
expect "~#"

# 启用Nginx配置
send "ln -sf /etc/nginx/sites-available/dingfeng /etc/nginx/sites-enabled/\r"
expect "~#"
send "nginx -t\r"
expect "~#"
send "systemctl reload nginx\r"
expect "~#"

# 启动服务
send "systemctl daemon-reload\r"
expect "~#"
send "systemctl enable dingfeng\r"
expect "~#"
send "pkill -f 'python3.*app_modern' || true\r"
expect "~#"
send "sleep 1\r"
expect "~#"
send "systemctl restart dingfeng\r"
expect "~#"

# 检查状态
send "systemctl status dingfeng --no-pager -l || true\r"
expect "~#"

send "exit\r"
expect "logout"
send "exit\r"
expect eof
EXPECTEOF

    chmod +x /tmp/deploy.exp
    /tmp/deploy.exp "$SERVER_PASS" "$SERVER_IP" "$SERVER_USER" "$DEPLOY_PATH"
}

# 验证部署
verify_deployment() {
    echo_step "验证部署..."
    
    sleep 3
    
    curl -s http://127.0.0.1:11236/health || echo "服务可能正在启动..."
    
    echo ""
    echo_step "请访问: http://wisdomdance.cn/dingfeng"
}

# 清理
cleanup() {
    rm -rf /tmp/dingfeng_webapp /tmp/upload.exp /tmp/deploy.exp 2>/dev/null
}

# 主流程
main() {
    echo "========================================"
    echo "丁峰家政预约数据系统 - 服务器部署"
    echo "========================================"
    echo ""
    
    check_expect
    upload_files
    deploy_on_server
    verify_deployment
    cleanup
    
    echo ""
    echo "========================================"
    echo -e "${GREEN}部署完成！${NC}"
    echo "========================================"
}

main "$@"
