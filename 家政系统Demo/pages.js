// 各页面的完整HTML内容
const pages = {
    orders: `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">全部订单</span>
                    <div class="stat-icon blue"><i class="fas fa-clipboard-list"></i></div>
                </div>
                <div class="stat-value">1,258</div>
                <div class="stat-change up"><span>本月累计</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">待分配</span>
                    <div class="stat-icon orange"><i class="fas fa-clock"></i></div>
                </div>
                <div class="stat-value">28</div>
                <div class="stat-change up"><span>需及时处理</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">服务中</span>
                    <div class="stat-icon purple"><i class="fas fa-spinner"></i></div>
                </div>
                <div class="stat-value">45</div>
                <div class="stat-change up"><span>正在进行</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">已完成</span>
                    <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
                </div>
                <div class="stat-value">1,185</div>
                <div class="stat-change up"><span>本月完成</span></div>
            </div>
        </div>
        
        <div class="filter-bar">
            <div class="filter-item">
                <label>订单状态：</label>
                <select><option>全部状态</option><option>待分配</option><option>服务中</option><option>已完成</option></select>
            </div>
            <div class="filter-item">
                <label>服务类型：</label>
                <select><option>全部类型</option><option>日常保洁</option><option>深度保洁</option><option>月嫂服务</option></select>
            </div>
            <div class="filter-item">
                <label>客户搜索：</label>
                <input type="text" placeholder="姓名/手机号">
            </div>
            <button class="btn btn-primary" onclick="showToast('查询功能开发中', 'info')"><i class="fas fa-search"></i> 查询</button>
            <button class="btn btn-success" onclick="showToast('新建订单功能开发中', 'info')"><i class="fas fa-plus"></i> 新建订单</button>
        </div>
        
        <div class="tabs">
            <div class="tab active">全部订单</div>
            <div class="tab">待分配</div>
            <div class="tab">服务中</div>
            <div class="tab">已完成</div>
        </div>
        
        <div class="card">
            <div class="table-container">
                <table>
                    <thead>
                        <tr><th>订单编号</th><th>客户信息</th><th>服务类型</th><th>服务人员</th><th>预约时间</th><th>金额</th><th>状态</th><th>操作</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>#20260316001</strong></td>
                            <td><div style="display: flex; align-items: center; gap: 10px;"><div style="width: 35px; height: 35px; border-radius: 50%; background: #e3f2fd; display: flex; align-items: center; justify-content: center; color: #1976d2; font-weight: 600;">张</div><div><div style="font-weight: 600;">张女士</div><div style="font-size: 12px; color: #999;">138****8888</div></div></div></td>
                            <td>日常保洁（4小时）</td>
                            <td><span style="color: #999;">待分配</span></td>
                            <td>今天 14:00</td>
                            <td style="font-weight: 600; color: #667eea;">¥280</td>
                            <td><span class="status-badge status-pending">待分配</span></td>
                            <td><button class="btn btn-primary" style="padding: 5px 12px; font-size: 11px;" onclick="showToast('派单功能开发中', 'info')">派单</button></td>
                        </tr>
                        <tr>
                            <td><strong>#20260316002</strong></td>
                            <td><div style="display: flex; align-items: center; gap: 10px;"><div style="width: 35px; height: 35px; border-radius: 50%; background: #f3e5f5; display: flex; align-items: center; justify-content: center; color: #7b1fa2; font-weight: 600;">李</div><div><div style="font-weight: 600;">李先生</div><div style="font-size: 12px; color: #999;">139****6666</div></div></div></td>
                            <td>深度保洁（8小时）</td>
                            <td><div style="display: flex; align-items: center; gap: 8px;"><div style="width: 28px; height: 28px; border-radius: 50%; background: #e8f5e9; display: flex; align-items: center; justify-content: center; color: #388e3c; font-size: 12px;">王</div><span>王阿姨</span></div></td>
                            <td>今天 16:00</td>
                            <td style="font-weight: 600; color: #667eea;">¥580</td>
                            <td><span class="status-badge status-processing">服务中</span></td>
                            <td><button class="btn btn-outline" style="padding: 5px 12px; font-size: 11px;" onclick="showToast('详情功能开发中', 'info')">详情</button></td>
                        </tr>
                        <tr>
                            <td><strong>#20260316005</strong></td>
                            <td><div style="display: flex; align-items: center; gap: 10px;"><div style="width: 35px; height: 35px; border-radius: 50%; background: #fff3e0; display: flex; align-items: center; justify-content: center; color: #f57c00; font-weight: 600;">刘</div><div><div style="font-weight: 600;">刘先生</div><div style="font-size: 12px; color: #999;">135****5555</div></div></div></td>
                            <td>月嫂服务（26天）</td>
                            <td><div style="display: flex; align-items: center; gap: 8px;"><div style="width: 28px; height: 28px; border-radius: 50%; background: #fce4ec; display: flex; align-items: center; justify-content: center; color: #c2185b; font-size: 12px;">陈</div><span>陈月嫂</span></div></td>
                            <td>2026-03-15</td>
                            <td style="font-weight: 600; color: #667eea;">¥15,800</td>
                            <td><span class="status-badge status-completed">已完成</span></td>
                            <td><button class="btn btn-outline" style="padding: 5px 12px; font-size: 11px;" onclick="showToast('详情功能开发中', 'info')">详情</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    
    members: `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">全部会员</span>
                    <div class="stat-icon blue"><i class="fas fa-users"></i></div>
                </div>
                <div class="stat-value">856</div>
                <div class="stat-change up"><span>累计注册</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">新增会员</span>
                    <div class="stat-icon green"><i class="fas fa-user-plus"></i></div>
                </div>
                <div class="stat-value">15</div>
                <div class="stat-change up"><span>本月新增</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">活跃会员</span>
                    <div class="stat-icon orange"><i class="fas fa-user-check"></i></div>
                </div>
                <div class="stat-value">328</div>
                <div class="stat-change up"><span>近30天活跃</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">会员余额</span>
                    <div class="stat-icon purple"><i class="fas fa-wallet"></i></div>
                </div>
                <div class="stat-value">¥128.5万</div>
                <div class="stat-change up"><span>总余额</span></div>
            </div>
        </div>
        
        <div class="filter-bar">
            <div class="filter-item">
                <label>会员等级：</label>
                <select><option>全部等级</option><option>普通会员</option><option>银卡会员</option><option>金卡会员</option><option>钻石会员</option></select>
            </div>
            <div class="filter-item">
                <label>注册时间：</label>
                <select><option>全部时间</option><option>最近7天</option><option>最近30天</option></select>
            </div>
            <div class="filter-item">
                <label>会员搜索：</label>
                <input type="text" placeholder="姓名/手机号">
            </div>
            <button class="btn btn-primary" onclick="showToast('查询功能开发中', 'info')"><i class="fas fa-search"></i> 查询</button>
            <button class="btn btn-success" onclick="showToast('新增会员功能开发中', 'info')"><i class="fas fa-plus"></i> 新增会员</button>
        </div>
        
        <div class="card">
            <div class="table-container">
                <table>
                    <thead>
                        <tr><th>会员信息</th><th>手机号</th><th>等级</th><th>积分</th><th>余额</th><th>订单数</th><th>注册时间</th><th>操作</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><div style="display: flex; align-items: center; gap: 10px;"><div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #ffd700 0%, #ffab00 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">刘</div><div><div style="font-weight: 600;">刘先生</div><div style="font-size: 12px; color: #999;">北京市朝阳区</div></div></div></td>
                            <td>138****8888</td>
                            <td><span class="member-level level-gold">金卡</span></td>
                            <td>12,580</td>
                            <td style="font-weight: 600; color: #667eea;">¥2,580</td>
                            <td>28</td>
                            <td>2025-06-15</td>
                            <td><button class="btn btn-outline" style="padding: 5px 12px; font-size: 11px;" onclick="showToast('会员详情功能开发中', 'info')">详情</button></td>
                        </tr>
                        <tr>
                            <td><div style="display: flex; align-items: center; gap: 10px;"><div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #b39ddb 0%, #7e57c2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">赵</div><div><div style="font-weight: 600;">赵女士</div><div style="font-size: 12px; color: #999;">北京市海淀区</div></div></div></td>
                            <td>139****6666</td>
                            <td><span class="member-level level-diamond">钻石</span></td>
                            <td>35,600</td>
                            <td style="font-weight: 600; color: #667eea;">¥8,600</td>
                            <td>56</td>
                            <td>2024-03-20</td>
                            <td><button class="btn btn-outline" style="padding: 5px 12px; font-size: 11px;" onclick="showToast('会员详情功能开发中', 'info')">详情</button></td>
                        </tr>
                        <tr>
                            <td><div style="display: flex; align-items: center; gap: 10px;"><div style="width: 40px; height: 40px; border-radius: 50%; background: #e0e0e0; display: flex; align-items: center; justify-content: center; color: #424242; font-weight: 600;">孙</div><div><div style="font-weight: 600;">孙先生</div><div style="font-size: 12px; color: #999;">北京市西城区</div></div></div></td>
                            <td>137****9999</td>
                            <td><span class="member-level level-silver">银卡</span></td>
                            <td>3,200</td>
                            <td style="font-weight: 600; color: #667eea;">¥680</td>
                            <td>12</td>
                            <td>2025-11-08</td>
                            <td><button class="btn btn-outline" style="padding: 5px 12px; font-size: 11px;" onclick="showToast('会员详情功能开发中', 'info')">详情</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    
    workers: `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">全部人员</span>
                    <div class="stat-icon blue"><i class="fas fa-users"></i></div>
                </div>
                <div class="stat-value">42</div>
                <div class="stat-change up"><span>在职人员</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">今日在岗</span>
                    <div class="stat-icon green"><i class="fas fa-user-check"></i></div>
                </div>
                <div class="stat-value">38</div>
                <div class="stat-change up"><span>在岗率 90%</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">休息中</span>
                    <div class="stat-icon orange"><i class="fas fa-coffee"></i></div>
                </div>
                <div class="stat-value">3</div>
                <div class="stat-change up"><span>今日休息</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">请假中</span>
                    <div class="stat-icon purple"><i class="fas fa-procedures"></i></div>
                </div>
                <div class="stat-value">1</div>
                <div class="stat-change up"><span>事假/病假</span></div>
            </div>
        </div>
        
        <div class="filter-bar">
            <div class="filter-item">
                <label>服务技能：</label>
                <select><option>全部技能</option><option>日常保洁</option><option>月嫂</option><option>育儿嫂</option><option>养老护理</option></select>
            </div>
            <div class="filter-item">
                <label>工作状态：</label>
                <select><option>全部状态</option><option>在岗</option><option>休息</option><option>请假</option></select>
            </div>
            <div class="filter-item">
                <label>人员搜索：</label>
                <input type="text" placeholder="姓名/手机号">
            </div>
            <button class="btn btn-primary" onclick="showToast('查询功能开发中', 'info')"><i class="fas fa-search"></i> 查询</button>
            <button class="btn btn-success" onclick="showToast('新增人员功能开发中', 'info')"><i class="fas fa-plus"></i> 新增人员</button>
        </div>
        
        <div class="card">
            <div class="table-container">
                <table>
                    <thead>
                        <tr><th>人员信息</th><th>手机号</th><th>服务技能</th><th>服务区域</th><th>评分</th><th>本月订单</th><th>状态</th><th>操作</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><div style="display: flex; align-items: center; gap: 10px;"><div style="width: 40px; height: 40px; border-radius: 50%; background: #e3f2fd; display: flex; align-items: center; justify-content: center; color: #1976d2; font-weight: 600;">王</div><div><div style="font-weight: 600;">王秀芳</div><div style="font-size: 12px; color: #999;">ID: A1001</div></div></div></td>
                            <td>138****1234</td>
                            <td><span class="skill-tag skill-clean">日常保洁</span><span class="skill-tag skill-clean">深度保洁</span></td>
                            <td>朝阳区、海淀区</td>
                            <td><div style="color: #ff9800;"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><span style="color: #666; margin-left: 5px;">5.0</span></div></td>
                            <td>28</td>
                            <td><span class="status-badge status-completed">在岗</span></td>
                            <td><button class="btn btn-outline" style="padding: 5px 12px; font-size: 11px;" onclick="showToast('人员详情功能开发中', 'info')">详情</button></td>
                        </tr>
                        <tr>
                            <td><div style="display: flex; align-items: center; gap: 10px;"><div style="width: 40px; height: 40px; border-radius: 50%; background: #fce4ec; display: flex; align-items: center; justify-content: center; color: #c2185b; font-weight: 600;">陈</div><div><div style="font-weight: 600;">陈美玲</div><div style="font-size: 12px; color: #999;">ID: A1002</div></div></div></td>
                            <td>139****5678</td>
                            <td><span class="skill-tag skill-nanny">月嫂</span><span class="skill-tag skill-nanny">育儿嫂</span></td>
                            <td>全北京市</td>
                            <td><div style="color: #ff9800;"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i><span style="color: #666; margin-left: 5px;">4.8</span></div></td>
                            <td>15</td>
                            <td><span class="status-badge status-processing">服务中</span></td>
                            <td><button class="btn btn-outline" style="padding: 5px 12px; font-size: 11px;" onclick="showToast('人员详情功能开发中', 'info')">详情</button></td>
                        </tr>
                        <tr>
                            <td><div style="display: flex; align-items: center; gap: 10px;"><div style="width: 40px; height: 40px; border-radius: 50%; background: #e8f5e9; display: flex; align-items: center; justify-content: center; color: #388e3c; font-weight: 600;">李</div><div><div style="font-weight: 600;">李建国</div><div style="font-size: 12px; color: #999;">ID: A1003</div></div></div></td>
                            <td>137****9012</td>
                            <td><span class="skill-tag skill-elder">养老护理</span><span class="skill-tag skill-clean">日常保洁</span></td>
                            <td>西城区、东城区</td>
                            <td><div style="color: #ff9800;"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i><span style="color: #666; margin-left: 5px;">4.5</span></div></td>
                            <td>22</td>
                            <td><span class="status-badge status-pending">休息中</span></td>
                            <td><button class="btn btn-outline" style="padding: 5px 12px; font-size: 11px;" onclick="showToast('人员详情功能开发中', 'info')">详情</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    
    finance: `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">今日收入</span>
                    <div class="stat-icon green"><i class="fas fa-arrow-down"></i></div>
                </div>
                <div class="stat-value">¥8,560</div>
                <div class="stat-change up"><span>较昨日 +12%</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">今日支出</span>
                    <div class="stat-icon orange"><i class="fas fa-arrow-up"></i></div>
                </div>
                <div class="stat-value">¥2,340</div>
                <div class="stat-change up"><span>阿姨结算</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">本月收入</span>
                    <div class="stat-icon blue"><i class="fas fa-chart-line"></i></div>
                </div>
                <div class="stat-value">¥156.8万</div>
                <div class="stat-change up"><span>较上月 +8%</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">账户余额</span>
                    <div class="stat-icon purple"><i class="fas fa-wallet"></i></div>
                </div>
                <div class="stat-value">¥45.2万</div>
                <div class="stat-change up"><span>可用资金</span></div>
            </div>
        </div>
        
        <div class="content-grid">
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-list"></i>收支明细</div>
                    <button class="btn btn-outline" onclick="showToast('导出报表功能开发中', 'info')">导出</button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr><th>时间</th><th>类型</th><th>项目</th><th>金额</th><th>支付方式</th><th>操作人</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2026-03-16 14:30</td>
                                <td><span style="color: #4caf50;">收入</span></td>
                                <td>日常保洁服务</td>
                                <td style="font-weight: 600; color: #4caf50;">+¥280</td>
                                <td>微信支付</td>
                                <td>系统自动</td>
                            </tr>
                            <tr>
                                <td>2026-03-16 12:15</td>
                                <td><span style="color: #f44336;">支出</span></td>
                                <td>王秀芳-工资结算</td>
                                <td style="font-weight: 600; color: #f44336;">-¥180</td>
                                <td>银行转账</td>
                                <td>管理员</td>
                            </tr>
                            <tr>
                                <td>2026-03-16 10:00</td>
                                <td><span style="color: #4caf50;">收入</span></td>
                                <td>月嫂服务定金</td>
                                <td style="font-weight: 600; color: #4caf50;">+¥5,000</td>
                                <td>支付宝</td>
                                <td>系统自动</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div>
                <div class="chart-container">
                    <div class="chart-header">
                        <div class="chart-title">本周收支趋势</div>
                    </div>
                    <div class="chart-placeholder">
                        <span>图表功能开发中</span>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-calculator"></i>快捷记账</div>
                    </div>
                    <div style="padding: 20px;">
                        <button class="btn btn-success" style="width: 100%; margin-bottom: 10px;" onclick="showToast('收款登记功能开发中', 'info')">
                            <i class="fas fa-plus"></i> 记一笔收入
                        </button>
                        <button class="btn btn-warning" style="width: 100%;" onclick="showToast('付款登记功能开发中', 'info')">
                            <i class="fas fa-minus"></i> 记一笔支出
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    marketing: `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">优惠券总数</span>
                    <div class="stat-icon blue"><i class="fas fa-ticket-alt"></i></div>
                </div>
                <div class="stat-value">12</div>
                <div class="stat-change up"><span>进行中</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">已领取</span>
                    <div class="stat-icon orange"><i class="fas fa-download"></i></div>
                </div>
                <div class="stat-value">568</div>
                <div class="stat-change up"><span>本月累计</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">已使用</span>
                    <div class="stat-icon green"><i class="fas fa-check"></i></div>
                </div>
                <div class="stat-value">342</div>
                <div class="stat-change up"><span>使用率 60%</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">优惠金额</span>
                    <div class="stat-icon purple"><i class="fas fa-yen-sign"></i></div>
                </div>
                <div class="stat-value">¥12.6万</div>
                <div class="stat-change up"><span>累计优惠</span></div>
            </div>
        </div>
        
        <div class="filter-bar">
            <button class="btn btn-success" onclick="showToast('新建优惠券功能开发中', 'info')">
                <i class="fas fa-plus"></i> 新建优惠券
            </button>
            <button class="btn btn-primary" onclick="showToast('营销活动功能开发中', 'info')">
                <i class="fas fa-bullhorn"></i> 创建活动
            </button>
        </div>
        
        <div class="content-grid">
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-ticket-alt"></i>优惠券列表</div>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr><th>优惠券名称</th><th>类型</th><th>面额</th><th>使用条件</th><th>有效期</th><th>状态</th><th>操作</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>新用户专享券</td>
                                <td>满减券</td>
                                <td style="font-weight: 600; color: #f44336;">¥50</td>
                                <td>满200可用</td>
                                <td>2026-03-01 至 2026-03-31</td>
                                <td><span class="status-badge status-completed">进行中</span></td>
                                <td><button class="btn btn-outline" style="padding: 5px 12px; font-size: 11px;" onclick="showToast('编辑功能开发中', 'info')">编辑</button></td>
                            </tr>
                            <tr>
                                <td>春节大扫除券</td>
                                <td>折扣券</td>
                                <td style="font-weight: 600; color: #f44336;">8折</td>
                                <td>无门槛</td>
                                <td>2026-01-20 至 2026-02-10</td>
                                <td><span class="status-badge status-cancelled">已结束</span></td>
                                <td><button class="btn btn-outline" style="padding: 5px 12px; font-size: 11px;" onclick="showToast('查看数据功能开发中', 'info')">数据</button></td>
                            </tr>
                            <tr>
                                <td>会员生日礼券</td>
                                <td>满减券</td>
                                <td style="font-weight: 600; color: #f44336;">¥100</td>
                                <td>满500可用</td>
                                <td>长期有效</td>
                                <td><span class="status-badge status-completed">进行中</span></td>
                                <td><button class="btn btn-outline" style="padding: 5px 12px; font-size: 11px;" onclick="showToast('编辑功能开发中', 'info')">编辑</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-gift"></i>营销活动</div>
                </div>
                <div style="padding: 20px;">
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                        <div style="font-weight: 600; color: #333; margin-bottom: 5px;">🎉 春季大扫除特惠</div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 10px;">全场保洁服务8折起，限时7天</div>
                        <div style="font-size: 11px; color: #999;">2026-03-15 至 2026-03-22</div>
                    </div>
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                        <div style="font-weight: 600; color: #333; margin-bottom: 5px;">👶 月嫂服务预订节</div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 10px;">预订月嫂服务送育儿礼包</div>
                        <div style="font-size: 11px; color: #999;">2026-04-01 至 2026-04-15</div>
                    </div>
                    <button class="btn btn-outline" style="width: 100%;" onclick="showToast('查看更多活动功能开发中', 'info')">查看更多</button>
                </div>
            </div>
        </div>
    `,
    
    settings: `
        <div class="card" style="margin-bottom: 25px;">
            <div class="card-header">
                <div class="card-title"><i class="fas fa-building"></i>企业信息</div>
            </div>
            <div class="setting-item">
                <div class="setting-info">
                    <h4>企业名称</h4>
                    <p>丁峰家政服务有限公司</p>
                </div>
                <button class="btn btn-outline" onclick="showToast('编辑功能开发中', 'info')">编辑</button>
            </div>
            <div class="setting-item">
                <div class="setting-info">
                    <h4>联系电话</h4>
                    <p>400-888-8888</p>
                </div>
                <button class="btn btn-outline" onclick="showToast('编辑功能开发中', 'info')">编辑</button>
            </div>
            <div class="setting-item">
                <div class="setting-info">
                    <h4>服务地址</h4>
                    <p>北京市朝阳区建国路88号</p>
                </div>
                <button class="btn btn-outline" onclick="showToast('编辑功能开发中', 'info')">编辑</button>
            </div>
        </div>
        
        <div class="card" style="margin-bottom: 25px;">
            <div class="card-header">
                <div class="card-title"><i class="fas fa-bell"></i>通知设置</div>
            </div>
            <div class="setting-item">
                <div class="setting-info">
                    <h4>订单通知</h4>
                    <p>新订单产生时发送通知</p>
                </div>
                <div class="switch active" onclick="this.classList.toggle('active')"></div>
            </div>
            <div class="setting-item">
                <div class="setting-info">
                    <h4>短信通知</h4>
                    <p>向客户发送服务提醒短信</p>
                </div>
                <div class="switch active" onclick="this.classList.toggle('active')"></div>
            </div>
            <div class="setting-item">
                <div class="setting-info">
                    <h4>微信通知</h4>
                    <p>向客户发送微信模板消息</p>
                </div>
                <div class="switch" onclick="this.classList.toggle('active')"></div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <div class="card-title"><i class="fas fa-shield-alt"></i>系统安全</div>
            </div>
            <div class="setting-item">
                <div class="setting-info">
                    <h4>修改密码</h4>
                    <p>定期修改密码可提高账号安全性</p>
                </div>
                <button class="btn btn-outline" onclick="showToast('修改密码功能开发中', 'info')">修改</button>
            </div>
            <div class="setting-item">
                <div class="setting-info">
                    <h4>操作日志</h4>
                    <p>查看系统操作记录</p>
                </div>
                <button class="btn btn-outline" onclick="showToast('查看日志功能开发中', 'info')">查看</button>
            </div>
            <div class="setting-item">
                <div class="setting-info">
                    <h4>数据备份</h4>
                    <p>上次备份：2026-03-16 02:00</p>
                </div>
                <button class="btn btn-outline" onclick="showToast('立即备份功能开发中', 'info')">立即备份</button>
            </div>
        </div>
    `
};

// 导出页面内容
if (typeof module !== 'undefined' && module.exports) {
    module.exports = pages;
}
