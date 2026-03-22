# 丁峰家政预约数据系统 - 部署文档

本文档详细说明如何在不同环境下部署养老服务预约数据采集与分析系统。

## 目录

- [环境要求](#环境要求)
- [本地开发部署](#本地开发部署)
- [服务器部署](#服务器部署)
- [Nginx 配置](#nginx-配置)
- [systemd 服务配置](#systemd-服务配置)
- [HTTPS 配置](#https-配置)
- [故障排除](#故障排除)

## 环境要求

### 硬件要求

- CPU: 1核+
- 内存: 512MB+
- 磁盘: 2GB+

### 软件要求

- Python 3.8+
- pip (Python包管理器)
- Nginx (用于生产环境反向代理)
- Git (用于代码更新)

## 本地开发部署

### 1. 克隆项目

```bash
git clone <repository-url>
cd dingfeng-jiazheng
```

### 2. 创建虚拟环境（推荐）

```bash
# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
# Linux/Mac:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### 3. 安装依赖

```bash
cd web_app
pip install -r requirements.txt
```

### 4. 启动服务

```bash
python app_modern.py
```

### 5. 访问应用

打开浏览器访问：http://127.0.0.1:11236

## 服务器部署

### Ubuntu / Debian

#### 1. 更新系统

```bash
sudo apt update
sudo apt upgrade -y
```

#### 2. 安装 Python 和 pip

```bash
sudo apt install -y python3 python3-pip python3-venv
```

#### 3. 创建部署目录

```bash
sudo mkdir -p /var/www/wisdomdance.cn/html/dingfeng
sudo chown -R $USER:$USER /var/www/wisdomdance.cn/html/dingfeng
cd /var/www/wisdomdance.cn/html/dingfeng
```

#### 4. 上传项目文件

**方式一：使用 git clone**
```bash
git clone <repository-url> .
```

**方式二：使用 scp 上传**
```bash
# 在本地执行
scp -r web_app/* user@server:/var/www/wisdomdance.cn/html/dingfeng/
```

#### 5. 创建虚拟环境并安装依赖

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
```

#### 6. 配置防火墙

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### CentOS / RHEL

```bash
# 安装依赖
sudo yum install -y python3 python3-pip

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
```

## Nginx 配置

### 基本配置

```bash
sudo nano /etc/nginx/sites-available/dingfeng
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /dingfeng {
        proxy_pass http://127.0.0.1:11236;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket 支持（如果需要）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /dingfeng/static {
        alias /var/www/wisdomdance.cn/html/dingfeng/web_app/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 启用配置

```bash
# 创建符号链接
sudo ln -sf /etc/nginx/sites-available/dingfeng /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

### 多个子路径配置

如果需要部署多个应用：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 应用1
    location /app1 {
        proxy_pass http://127.0.0.1:11236;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 应用2
    location /app2 {
        proxy_pass http://127.0.0.1:11237;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## systemd 服务配置

### 创建服务文件

```bash
sudo nano /etc/systemd/system/dingfeng.service
```

```ini
[Unit]
Description=Dingfeng Reservation Data Collector
Documentation=https://github.com/your-repo/dingfeng-jiazheng
After=network.target

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=/var/www/wisdomdance.cn/html/dingfeng/web_app
ExecStart=/var/www/wisdomdance.cn/html/dingfeng/venv/bin/python /var/www/wisdomdance.cn/html/dingfeng/web_app/app_modern.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=dingfeng

# 环境变量（如果需要）
Environment="FLASK_ENV=production"
Environment="SECRET_KEY=your-secret-key"

[Install]
WantedBy=multi-user.target
```

### 启用并启动服务

```bash
# 重新加载 systemd 配置
sudo systemctl daemon-reload

# 启用服务（开机自启）
sudo systemctl enable dingfeng

# 启动服务
sudo systemctl start dingfeng

# 检查服务状态
sudo systemctl status dingfeng
```

### 服务管理命令

```bash
# 启动
sudo systemctl start dingfeng

# 停止
sudo systemctl stop dingfeng

# 重启
sudo systemctl restart dingfeng

# 查看日志
sudo journalctl -u dingfeng -f

# 查看最近日志
sudo journalctl -u dingfeng --since "1 hour ago"
```

## HTTPS 配置

### 使用 Let's Encrypt（免费）

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期测试
sudo certbot renew --dry-run
```

### Nginx HTTPS 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location /dingfeng {
        proxy_pass http://127.0.0.1:11236;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 故障排除

### 服务无法启动

1. 检查端口是否被占用：
```bash
sudo lsof -i :11236
sudo netstat -tlnp | grep 11236
```

2. 查看服务日志：
```bash
sudo journalctl -u dingfeng -n 50
```

3. 手动测试运行：
```bash
cd /var/www/wisdomdance.cn/html/dingfeng/web_app
source ../venv/bin/activate
python app_modern.py
```

### Nginx 502 Bad Gateway

1. 检查后端服务是否运行：
```bash
curl http://127.0.0.1:11236/health
```

2. 检查 Nginx 日志：
```bash
sudo tail -f /var/log/nginx/error.log
```

3. 检查 SELinux（CentOS）：
```bash
sudo setsebool -P httpd_can_network_connect 1
```

### 权限问题

```bash
# 设置正确的文件权限
sudo chown -R ubuntu:ubuntu /var/www/wisdomdance.cn/html/dingfeng

# 设置目录权限
sudo find /var/www/wisdomdance.cn/html/dingfeng -type d -exec chmod 755 {} \;

# 设置文件权限
sudo find /var/www/wisdomdance.cn/html/dingfeng -type f -exec chmod 644 {} \;

# 确保venv可执行
sudo chmod +x /var/www/wisdomdance.cn/html/dingfeng/venv/bin/python
```

### 数据库/数据文件问题

如果使用数据库：
```bash
# 检查数据库文件权限
sudo chown ubuntu:ubuntu /var/www/wisdomdance.cn/html/dingfeng/*.db
```

## 性能优化

### Gunicorn（生产环境推荐）

```bash
pip install gunicorn
```

创建 gunicorn 配置文件 `/var/www/wisdomdance.cn/html/dingfeng/gunicorn_config.py`：

```python
bind = "127.0.0.1:11236"
workers = 4
worker_class = "sync"
timeout = 120
keepalive = 5
```

修改 systemd 服务：
```ini
ExecStart=/var/www/wisdomdance.cn/html/dingfeng/venv/bin/gunicorn -c /var/www/wisdomdance.cn/html/dingfeng/gunicorn_config.py app_modern:app
```

### 静态文件缓存

在 Nginx 配置中添加：
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

## 更新部署

```bash
cd /var/www/wisdomdance.cn/html/dingfeng

# 拉取最新代码
git pull origin main

# 更新依赖（如有变化）
source venv/bin/activate
pip install -r requirements.txt
deactivate

# 重启服务
sudo systemctl restart dingfeng
```

## 备份

```bash
# 备份数据和配置
tar -czf backup_$(date +%Y%m%d).tar.gz \
    /var/www/wisdomdance.cn/html/dingfeng/web_app \
    --exclude='*.csv' \
    --exclude='*.log'

# 备份数据库（如果有）
pg_dump -U postgres dingfeng > dingfeng_db_$(date +%Y%m%d).sql
```

## 监控

### 添加系统监控

```bash
# 安装 htop
sudo apt install -y htop

# 监控进程
htop -p $(pgrep -f app_modern)
```

### 日志轮转

创建 `/etc/logrotate.d/dingfeng`：

```
/var/www/wisdomdance.cn/html/dingfeng/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 ubuntu ubuntu
    sharedscripts
    postrotate
        systemctl restart dingfeng > /dev/null 2>&1 || true
    endscript
}
```

---

如有问题，请提交 Issue。
