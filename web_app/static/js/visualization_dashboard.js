// 可视化大屏 JavaScript 代码

// 全局变量存储图表实例
let charts = {};

// 数据配置
const dashboardData = {
    summaryStats: {
        totalAppointments: 404,
        processedCount: 381,
        pendingCount: 23,
        processRate: 94.3
    },
    
    serviceTypeData: [
        { name: "能力评估", value: 274, color: "#00D4FF", percent: 67.8 },
        { name: "上门服务", value: 121, color: "#FF6B35", percent: 29.9 },
        { name: "生活照料", value: 9, color: "#39FF14", percent: 2.2 }
    ],
    
    assessmentTypeData: [
        { name: "初次评估", value: 223, color: "#00D4FF" },
        { name: "复评", value: 51, color: "#7B61FF" }
    ],
    
    areaData: [
        { area: "宝塔区", count: 356, percent: 88.1 },
        { area: "安塞区/县", count: 22, percent: 5.4 },
        { area: "延川县", count: 8, percent: 2.0 },
        { area: "其他地区", count: 18, percent: 4.5 }
    ],
    
    genderData: [
        { name: "女性", value: 258, color: "#FF6B9D", percent: 63.9 },
        { name: "男性", value: 146, color: "#4FC3F7", percent: 36.1 }
    ],
    
    timeSlotData: [
        { slot: "上午", count: 171, color: "#FFB74D" },
        { slot: "下午", count: 233, color: "#00D4FF" }
    ],
    
    recentAppointments: [
        { name: "冯国英", service: "能力评估", time: "2026-04-27 下午", status: "未处理", area: "延川县" },
        { name: "贺建军", service: "能力评估", time: "2026-03-21 上午", status: "未处理", area: "宝塔区" },
        { name: "曹金莲", service: "能力评估", time: "2026-03-21 上午", status: "未处理", area: "宝塔区" },
        { name: "郭玉兰", service: "能力评估", time: "2026-03-20 上午", status: "未处理", area: "安塞县" },
        { name: "王延清", service: "能力评估", time: "2026-03-20 上午", status: "未处理", area: "宝塔区" },
        { name: "张玉兰", service: "能力评估", time: "2026-03-20 上午", status: "未处理", area: "宝塔区" },
        { name: "林秀珍", service: "能力评估", time: "2026-03-20 下午", status: "未处理", area: "宝塔区" },
        { name: "王磊", service: "生活照料", time: "2026-03-20 上午", status: "未处理", area: "宝塔区" },
        { name: "高平安", service: "生活照料", time: "2026-03-20 上午", status: "未处理", area: "宝塔区" },
        { name: "李秀娃", service: "能力评估", time: "2026-03-20 上午", status: "未处理", area: "宝塔区" }
    ]
};

// 初始化函数
document.addEventListener('DOMContentLoaded', function() {
    initializeClock();
    initializeCharts();
    startAutoRefresh();
});

// 时钟更新
function initializeClock() {
    function updateTime() {
        const now = new Date();
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        
        // 更新时间显示
        const timeElement = document.getElementById('currentTime');
        const dateElement = document.getElementById('currentDate');
        
        if (timeElement) {
            timeElement.textContent = now.toTimeString().slice(0, 8);
        }
        
        if (dateElement) {
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const weekday = weekdays[now.getDay()];
            dateElement.textContent = `${year}.${month}.${day} 星期${weekday}`;
        }
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// 初始化所有图表
function initializeCharts() {
    // 服务类型分布饼图
    initServiceTypeChart();
    
    // 能力评估类型饼图
    initAssessmentTypeChart();
    
    // 性别分布饼图
    initGenderChart();
    
    // 日趋势折线图
    initDailyTrendChart();
    
    // 服务状态柱状图
    initServiceStatusChart();
    
    // 星期分布柱状图
    initWeekdayChart();
    
    // 小时分布柱状图
    initHourlyChart();
    
    // 年龄段分布横向柱状图
    initAgeChart();
    
    // 启动数字动画
    animateNumbers();
}

// 服务类型分布饼图
function initServiceTypeChart() {
    const chartDom = document.getElementById('serviceTypeChart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    charts.serviceType = chart;
    
    const option = {
        series: [{
            type: 'pie',
            radius: ['40%', '68%'],
            center: ['50%', '50%'],
            data: dashboardData.serviceTypeData.map(item => ({
                name: item.name,
                value: item.value,
                itemStyle: {
                    color: item.color,
                    shadowBlur: 5,
                    shadowColor: item.color + '88'
                }
            })),
            label: { show: false },
            labelLine: { show: false },
            animationDuration: 1400,
            animationDelay: 200
        }]
    };
    
    chart.setOption(option);
}

// 能力评估类型饼图
function initAssessmentTypeChart() {
    const chartDom = document.getElementById('assessmentTypeChart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    charts.assessmentType = chart;
    
    const option = {
        series: [{
            type: 'pie',
            radius: ['36%', '62%'],
            center: ['50%', '50%'],
            data: dashboardData.assessmentTypeData.map(item => ({
                name: item.name,
                value: item.value,
                itemStyle: {
                    color: item.color,
                    shadowBlur: 5,
                    shadowColor: item.color + '88'
                }
            })),
            label: { show: false },
            labelLine: { show: false },
            animationDuration: 1400,
            animationDelay: 400
        }]
    };
    
    chart.setOption(option);
}

// 性别分布饼图
function initGenderChart() {
    const chartDom = document.getElementById('genderChart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    charts.gender = chart;
    
    const option = {
        series: [{
            type: 'pie',
            radius: ['36%', '60%'],
            center: ['50%', '50%'],
            data: dashboardData.genderData.map(item => ({
                name: item.name,
                value: item.value,
                itemStyle: {
                    color: item.color,
                    shadowBlur: 5,
                    shadowColor: item.color + '88'
                }
            })),
            label: { show: false },
            labelLine: { show: false },
            animationDuration: 1400,
            animationDelay: 300
        }]
    };
    
    chart.setOption(option);
}

// 日趋势折线图
function initDailyTrendChart() {
    const chartDom = document.getElementById('dailyTrendChart');
    if (!chartDom) return;
    
    // 生成近期28天的数据
    const recentTrend = generateDailyTrendData();
    
    const chart = echarts.init(chartDom);
    charts.dailyTrend = chart;
    
    const option = {
        grid: {
            top: '8%',
            right: '3%',
            bottom: '12%',
            left: '8%'
        },
        xAxis: {
            type: 'category',
            data: recentTrend.map(item => item.date),
            axisLine: { lineStyle: { color: 'rgba(0,212,255,0.15)' } },
            axisTick: { show: false },
            axisLabel: {
                color: 'rgba(180,210,240,0.42)',
                fontSize: 9,
                interval: 3
            }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: 'rgba(180,210,240,0.42)',
                fontSize: 9
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0,212,255,0.07)',
                    type: 'dashed'
                }
            }
        },
        series: [{
            type: 'line',
            data: recentTrend.map(item => item.count),
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
                color: '#00D4FF',
                width: 2
            },
            itemStyle: {
                color: '#00D4FF',
                borderWidth: 2,
                borderColor: 'rgba(0,212,255,0.4)'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(0,212,255,0.35)' },
                        { offset: 1, color: 'rgba(0,212,255,0.02)' }
                    ]
                }
            },
            animationDuration: 2000
        }],
        markLine: {
            silent: true,
            data: [{
                yAxis: 99,
                lineStyle: {
                    color: 'rgba(255,107,53,0.55)',
                    type: 'dashed',
                    width: 1
                },
                label: {
                    show: true,
                    position: 'middle',
                    formatter: '峰值99',
                    color: 'rgba(255,107,53,0.7)',
                    fontSize: 9
                }
            }]
        }
    };
    
    chart.setOption(option);
}

// 服务状态柱状图
function initServiceStatusChart() {
    const chartDom = document.getElementById('serviceStatusChart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    charts.serviceStatus = chart;
    
    const option = {
        grid: {
            top: '8%',
            right: '3%',
            bottom: '12%',
            left: '8%'
        },
        xAxis: {
            type: 'category',
            data: ['能力评估', '上门服务', '生活照料'],
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: 'rgba(180,210,240,0.6)',
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: 'rgba(180,210,240,0.42)',
                fontSize: 9
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0,212,255,0.07)',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: '已处理',
                type: 'bar',
                stack: 'total',
                data: [265, 109, 7],
                itemStyle: {
                    color: '#39FF14',
                    shadowBlur: 3,
                    shadowColor: 'rgba(57,255,20,0.5)'
                }
            },
            {
                name: '未处理',
                type: 'bar',
                stack: 'total',
                data: [9, 12, 2],
                itemStyle: {
                    color: '#FF6B35',
                    borderRadius: [3, 3, 0, 0],
                    shadowBlur: 3,
                    shadowColor: 'rgba(255,107,53,0.5)'
                }
            }
        ]
    };
    
    chart.setOption(option);
}

// 星期分布柱状图
function initWeekdayChart() {
    const chartDom = document.getElementById('weekdayChart');
    if (!chartDom) return;
    
    const weekdayData = [
        { day: "周一", count: 55 },
        { day: "周二", count: 63 },
        { day: "周三", count: 132 },
        { day: "周四", count: 83 },
        { day: "周五", count: 35 },
        { day: "周六", count: 17 },
        { day: "周日", count: 19 }
    ];
    
    const chart = echarts.init(chartDom);
    charts.weekday = chart;
    
    const maxCount = Math.max(...weekdayData.map(item => item.count));
    
    const option = {
        grid: {
            top: '8%',
            right: '3%',
            bottom: '12%',
            left: '8%'
        },
        xAxis: {
            type: 'category',
            data: weekdayData.map(item => item.day),
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: 'rgba(180,210,240,0.6)',
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: 'rgba(180,210,240,0.42)',
                fontSize: 9
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0,212,255,0.07)',
                    type: 'dashed'
                }
            }
        },
        series: [{
            type: 'bar',
            data: weekdayData.map(item => ({
                value: item.count,
                itemStyle: {
                    color: item.count === maxCount ? '#FF6B35' : '#00D4FF',
                    shadowBlur: item.count === maxCount ? 4 : 3,
                    shadowColor: item.count === maxCount ? 'rgba(255,107,53,0.6)' : 'rgba(0,212,255,0.4)',
                    borderRadius: [3, 3, 0, 0]
                }
            })),
            animationDuration: 1500
        }]
    };
    
    chart.setOption(option);
}

// 小时分布柱状图
function initHourlyChart() {
    const chartDom = document.getElementById('hourlyChart');
    if (!chartDom) return;
    
    const hourlyData = generateHourlyData();
    
    const chart = echarts.init(chartDom);
    charts.hourly = chart;
    
    const maxCount = Math.max(...hourlyData.map(item => item.count));
    
    const option = {
        grid: {
            top: '8%',
            right: '3%',
            bottom: '12%',
            left: '8%'
        },
        xAxis: {
            type: 'category',
            data: hourlyData.map(item => item.hour),
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: 'rgba(180,210,240,0.42)',
                fontSize: 9
            }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: 'rgba(180,210,240,0.42)',
                fontSize: 9
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0,212,255,0.06)',
                    type: 'dashed'
                }
            }
        },
        series: [{
            type: 'bar',
            data: hourlyData.map(item => ({
                value: item.count,
                itemStyle: {
                    color: item.count === maxCount ? '#FF6B35' : 
                          item.count >= 40 ? '#7B61FF' : '#00D4FF',
                    opacity: 0.88,
                    borderRadius: [2, 2, 0, 0]
                }
            })),
            animationDuration: 1800
        }]
    };
    
    chart.setOption(option);
}

// 年龄段分布横向柱状图
function initAgeChart() {
    const chartDom = document.getElementById('ageChart');
    if (!chartDom) return;
    
    const ageGroupData = [
        { age: "60岁以下", count: 4, color: "#4FC3F7" },
        { age: "60-70岁", count: 117, color: "#00D4FF" },
        { age: "70-80岁", count: 144, color: "#0099CC" },
        { age: "80-90岁", count: 123, color: "#006699" },
        { age: "90-100岁", count: 16, color: "#FF6B35" }
    ];
    
    const chart = echarts.init(chartDom);
    charts.age = chart;
    
    const option = {
        grid: {
            top: '5%',
            right: '8%',
            bottom: '5%',
            left: '15%'
        },
        xAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: 'rgba(180,210,240,0.42)',
                fontSize: 9
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0,212,255,0.06)',
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            type: 'category',
            data: ageGroupData.map(item => item.age),
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: 'rgba(180,210,240,0.7)',
                fontSize: 10
            }
        },
        series: [{
            type: 'bar',
            data: ageGroupData.map(item => ({
                value: item.count,
                itemStyle: {
                    color: item.color,
                    shadowBlur: 3,
                    shadowColor: item.color + '66',
                    borderRadius: [0, 3, 3, 0]
                }
            })),
            animationDuration: 1500
        }]
    };
    
    chart.setOption(option);
}

// 生成日趋势数据
function generateDailyTrendData() {
    // 模拟最近28天的数据
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 27);
    
    for (let i = 0; i < 28; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        
        // 生成模拟数据，周末较低，工作日较高
        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
        const baseValue = isWeekend ? 5 : 15;
        const variation = Math.floor(Math.random() * 20);
        const count = Math.max(1, baseValue + variation);
        
        data.push({
            date: `${month}-${day}`,
            count: count
        });
    }
    
    return data;
}

// 生成小时分布数据
function generateHourlyData() {
    const hours = [];
    for (let i = 7; i <= 23; i++) {
        const hour = `${i.toString().padStart(2, '0')}时`;
        // 模拟创建时间分布，上午9-12点和下午2-4点较多
        let count;
        if (i >= 9 && i <= 12) {
            count = 40 + Math.floor(Math.random() * 20);
        } else if (i >= 14 && i <= 16) {
            count = 35 + Math.floor(Math.random() * 20);
        } else if (i >= 13 && i <= 17) {
            count = 20 + Math.floor(Math.random() * 15);
        } else {
            count = 1 + Math.floor(Math.random() * 10);
        }
        hours.push({ hour, count });
    }
    return hours;
}

// 数字动画效果
function animateNumbers() {
    const kpiElements = [
        { id: 'totalAppointments', end: 404 },
        { id: 'processedCount', end: 381 },
        { id: 'pendingCount', end: 23 },
        { id: 'processRate', end: 94.3, decimals: 1, suffix: '%' }
    ];
    
    kpiElements.forEach((element, index) => {
        const el = document.getElementById(element.id);
        if (el) {
            animateNumber(el, 0, element.end, 2000, index * 200, element.decimals || 0, element.suffix || '');
        }
    });
}

// 数字递增动画
function animateNumber(element, start, end, duration, delay, decimals = 0, suffix = '') {
    setTimeout(() => {
        const startTime = performance.now();
        const increment = end - start;
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = start + (increment * easeOutQuart);
            
            element.textContent = currentValue.toFixed(decimals) + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
    }, delay);
}

// 自动刷新数据
function startAutoRefresh() {
    // 每30秒更新一次时间
    setInterval(() => {
        // 这里可以添加数据更新逻辑
        console.log('数据自动刷新');
    }, 30000);
}

// 窗口大小变化时重绘图表
window.addEventListener('resize', function() {
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
            chart.resize();
        }
    });
});

// 工具提示格式化函数
function formatTooltip(params) {
    if (Array.isArray(params)) {
        params = params[0];
    }
    
    return `<div style="
        background: rgba(4,8,20,0.97);
        border: 1px solid rgba(0,212,255,0.4);
        border-radius: 6px;
        padding: 8px 12px;
        box-shadow: 0 0 16px rgba(0,212,255,0.2);
        font-family: 'Noto Sans SC',sans-serif;
        font-size: 12px;
        color: #C8E0F4;
    ">
        <div style="color: rgba(0,212,255,0.85); font-weight: 600; margin-bottom: 4px;">
            ${params.name}
        </div>
        <div style="color: ${params.color || '#00D4FF'}">
            ${params.seriesName || '数量'}：<span style="color:#C8E0F4">${params.value}</span>
        </div>
    </div>`;
}