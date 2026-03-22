const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();

// 设置演示文稿属性
pptx.title = "童虎家政管理系统 - 项目演示";
pptx.subject = "家政服务管理系统项目汇报";
pptx.author = "产品经理";

// 定义颜色方案 - 使用 Teal Trust 配色
const colors = {
  primary: "028090",
  secondary: "00A896",
  accent: "02C39A",
  dark: "1a1a2e",
  light: "F2F2F2",
  white: "FFFFFF",
  text: "333333",
  gray: "666666"
};

// 第1页：封面
const slide1 = pptx.addSlide();
slide1.background = { color: colors.dark };
slide1.addShape("rect", { x: 0, y: 0, w: "100%", h: "100%", fill: { color: colors.dark } });
slide1.addShape("rect", { x: 0, y: 0, w: "100%", h: "40%", fill: { color: colors.primary } });
slide1.addText("童虎家政管理系统", {
  x: 0.5, y: 1.5, w: "90%", h: 1,
  fontSize: 44, bold: true, color: colors.white, align: "center"
});
slide1.addText("项目演示汇报", {
  x: 0.5, y: 2.6, w: "90%", h: 0.8,
  fontSize: 28, color: colors.accent, align: "center"
});
slide1.addText("智慧家政服务数字化解决方案", {
  x: 0.5, y: 3.5, w: "90%", h: 0.5,
  fontSize: 16, color: colors.light, align: "center"
});
slide1.addText("2026年3月16日", {
  x: 0.5, y: 4.5, w: "90%", h: 0.4,
  fontSize: 14, color: colors.gray, align: "center"
});

// 第2页：项目概述
const slide2 = pptx.addSlide();
slide2.addText("项目概述", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 32, bold: true, color: colors.primary
});
slide2.addText("项目背景", {
  x: 0.5, y: 1.5, w: "40%", h: 0.5,
  fontSize: 20, bold: true, color: colors.secondary
});
slide2.addText("随着家政服务行业的快速发展，传统的人工管理模式已无法满足日益增长的业务需求。童虎家政系统旨在通过数字化手段，实现家政服务全流程管理，提升运营效率，改善客户体验。", {
  x: 0.5, y: 2.1, w: "40%", h: 1.5,
  fontSize: 14, color: colors.text, valign: "top"
});
slide2.addText("系统定位", {
  x: 5, y: 1.5, w: "40%", h: 0.5,
  fontSize: 20, bold: true, color: colors.secondary
});
slide2.addText("本系统定位为中小型家政服务企业的综合管理平台，涵盖客户管理、服务工单、人员管理、财务管理等核心业务模块，同时提供微信小程序客户端。", {
  x: 5, y: 2.1, w: "40%", h: 1.5,
  fontSize: 14, color: colors.text, valign: "top"
});

// 添加关键数据
slide2.addShape("rect", { x: 0.5, y: 4, w: 2, h: 1.2, fill: { color: colors.primary } });
slide2.addText("12周", { x: 0.5, y: 4.1, w: 2, h: 0.5, fontSize: 28, bold: true, color: colors.white, align: "center" });
slide2.addText("开发周期", { x: 0.5, y: 4.7, w: 2, h: 0.4, fontSize: 12, color: colors.white, align: "center" });

slide2.addShape("rect", { x: 2.8, y: 4, w: 2, h: 1.2, fill: { color: colors.secondary } });
slide2.addText("38万", { x: 2.8, y: 4.1, w: 2, h: 0.5, fontSize: 28, bold: true, color: colors.white, align: "center" });
slide2.addText("项目预算", { x: 2.8, y: 4.7, w: 2, h: 0.4, fontSize: 12, color: colors.white, align: "center" });

slide2.addShape("rect", { x: 5.1, y: 4, w: 2, h: 1.2, fill: { color: colors.accent } });
slide2.addText("11个", { x: 5.1, y: 4.1, w: 2, h: 0.5, fontSize: 28, bold: true, color: colors.white, align: "center" });
slide2.addText("核心模块", { x: 5.1, y: 4.7, w: 2, h: 0.4, fontSize: 12, color: colors.white, align: "center" });

slide2.addShape("rect", { x: 7.4, y: 4, w: 2, h: 1.2, fill: { color: colors.dark } });
slide2.addText("31%", { x: 7.4, y: 4.1, w: 2, h: 0.5, fontSize: 28, bold: true, color: colors.white, align: "center" });
slide2.addText("成本节省", { x: 7.4, y: 4.7, w: 2, h: 0.4, fontSize: 12, color: colors.white, align: "center" });

// 第3页：核心功能模块
const slide3 = pptx.addSlide();
slide3.addText("核心功能模块", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 32, bold: true, color: colors.primary
});

const modules = [
  { icon: "👥", title: "会员管理", desc: "客户档案、等级体系、积分管理" },
  { icon: "📋", title: "服务工单", desc: "全流程管理、智能派单、状态跟踪" },
  { icon: "👷", title: "人员管理", desc: "阿姨档案、排班考勤、绩效考核" },
  { icon: "💰", title: "财务管理", desc: "收款退款、对账报表、薪资结算" },
  { icon: "🎫", title: "套餐卡管理", desc: "次卡时长卡、销售核销、余额查询" },
  { icon: "🎁", title: "营销工具", desc: "优惠券、活动管理、营销统计" }
];

let xPos = 0.5;
let yPos = 1.5;
modules.forEach((mod, index) => {
  if (index === 3) { xPos = 0.5; yPos = 3.2; }
  
  slide3.addShape("rect", { 
    x: xPos, y: yPos, w: 2.8, h: 1.5, 
    fill: { color: colors.white },
    line: { color: colors.primary, width: 2 }
  });
  slide3.addText(mod.icon, { x: xPos, y: yPos + 0.2, w: 2.8, h: 0.4, fontSize: 24, align: "center" });
  slide3.addText(mod.title, { x: xPos, y: yPos + 0.6, w: 2.8, h: 0.4, fontSize: 16, bold: true, color: colors.primary, align: "center" });
  slide3.addText(mod.desc, { x: xPos, y: yPos + 1, w: 2.8, h: 0.4, fontSize: 11, color: colors.gray, align: "center" });
  
  xPos += 3.1;
});

// 第4页：技术架构
const slide4 = pptx.addSlide();
slide4.addText("技术架构", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 32, bold: true, color: colors.primary
});

// 架构图
slide4.addShape("rect", { x: 0.5, y: 1.5, w: 9, h: 4, fill: { color: "F5F7FA" } });

// 前端层
slide4.addShape("rect", { x: 1, y: 1.8, w: 2, h: 0.8, fill: { color: colors.primary } });
slide4.addText("前端层", { x: 1, y: 1.95, w: 2, h: 0.5, fontSize: 14, bold: true, color: colors.white, align: "center" });
slide4.addText("Vue3 + Element Plus", { x: 1, y: 2.7, w: 2, h: 0.3, fontSize: 10, color: colors.gray, align: "center" });

// 小程序
slide4.addShape("rect", { x: 3.5, y: 1.8, w: 2, h: 0.8, fill: { color: colors.secondary } });
slide4.addText("小程序", { x: 3.5, y: 1.95, w: 2, h: 0.5, fontSize: 14, bold: true, color: colors.white, align: "center" });
slide4.addText("微信小程序原生", { x: 3.5, y: 2.7, w: 2, h: 0.3, fontSize: 10, color: colors.gray, align: "center" });

// 网关层
slide4.addShape("rect", { x: 6, y: 1.8, w: 2.5, h: 0.8, fill: { color: colors.accent } });
slide4.addText("网关层", { x: 6, y: 1.95, w: 2.5, h: 0.5, fontSize: 14, bold: true, color: colors.white, align: "center" });
slide4.addText("Nginx 反向代理", { x: 6, y: 2.7, w: 2.5, h: 0.3, fontSize: 10, color: colors.gray, align: "center" });

// 后端层
slide4.addShape("rect", { x: 2, y: 3.5, w: 3, h: 0.8, fill: { color: colors.dark } });
slide4.addText("后端层", { x: 2, y: 3.65, w: 3, h: 0.5, fontSize: 14, bold: true, color: colors.white, align: "center" });
slide4.addText("Spring Boot 2.7 + MyBatis Plus", { x: 2, y: 4.4, w: 3, h: 0.3, fontSize: 10, color: colors.gray, align: "center" });

// 数据层
slide4.addShape("rect", { x: 5.5, y: 3.5, w: 2, h: 0.8, fill: { color: colors.primary } });
slide4.addText("MySQL 8.0", { x: 5.5, y: 3.65, w: 2, h: 0.5, fontSize: 14, bold: true, color: colors.white, align: "center" });

slide4.addShape("rect", { x: 7.8, y: 3.5, w: 1.5, h: 0.8, fill: { color: colors.secondary } });
slide4.addText("Redis 6.0", { x: 7.8, y: 3.65, w: 1.5, h: 0.5, fontSize: 14, bold: true, color: colors.white, align: "center" });

// 技术选型说明
slide4.addText("技术选型说明", { x: 0.5, y: 5, w: "90%", h: 0.4, fontSize: 16, bold: true, color: colors.secondary });
slide4.addText("• 采用单体应用架构，技术栈成熟稳定，降低开发和运维成本", { x: 0.5, y: 5.5, w: "90%", h: 0.3, fontSize: 12, color: colors.text });
slide4.addText("• Docker Compose容器化部署，简化运维管理", { x: 0.5, y: 5.85, w: "90%", h: 0.3, fontSize: 12, color: colors.text });

// 第5页：系统演示 - 首页仪表盘
const slide5 = pptx.addSlide();
slide5.addText("系统演示 - 首页仪表盘", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 32, bold: true, color: colors.primary
});

// 模拟仪表盘界面
slide5.addShape("rect", { x: 0.5, y: 1.5, w: 9, h: 4.5, fill: { color: "F5F7FA" } });

// 统计卡片
const stats = [
  { label: "今日订单", value: "28", change: "+12.5%", color: colors.primary },
  { label: "今日营收", value: "¥8,560", change: "+8.3%", color: colors.secondary },
  { label: "新增会员", value: "15", change: "+25%", color: colors.accent },
  { label: "服务人员", value: "42", change: "在岗38人", color: colors.dark }
];

let statX = 0.8;
stats.forEach(stat => {
  slide5.addShape("rect", { x: statX, y: 1.8, w: 2, h: 1.2, fill: { color: colors.white } });
  slide5.addText(stat.label, { x: statX, y: 1.9, w: 2, h: 0.3, fontSize: 11, color: colors.gray, align: "center" });
  slide5.addText(stat.value, { x: statX, y: 2.2, w: 2, h: 0.5, fontSize: 24, bold: true, color: stat.color, align: "center" });
  slide5.addText(stat.change, { x: statX, y: 2.7, w: 2, h: 0.25, fontSize: 10, color: colors.accent, align: "center" });
  statX += 2.2;
});

// 待处理工单表格
slide5.addShape("rect", { x: 0.8, y: 3.2, w: 5.5, h: 2.5, fill: { color: colors.white } });
slide5.addText("待处理工单", { x: 1, y: 3.35, w: 3, h: 0.3, fontSize: 12, bold: true, color: colors.primary });

const orders = [
  ["#20260316001", "张女士", "日常保洁", "待分配"],
  ["#20260316002", "李先生", "深度保洁", "服务中"],
  ["#20260316003", "王阿姨", "月嫂服务", "待分配"]
];

let rowY = 3.7;
orders.forEach(order => {
  slide5.addText(order[0], { x: 1, y: rowY, w: 1.5, h: 0.3, fontSize: 9, color: colors.text });
  slide5.addText(order[1], { x: 2.5, y: rowY, w: 1, h: 0.3, fontSize: 9, color: colors.text });
  slide5.addText(order[2], { x: 3.5, y: rowY, w: 1.5, h: 0.3, fontSize: 9, color: colors.text });
  slide5.addText(order[3], { x: 5, y: rowY, w: 1, h: 0.3, fontSize: 9, color: colors.secondary });
  rowY += 0.35;
});

// 快捷操作
slide5.addShape("rect", { x: 6.5, y: 3.2, w: 2.7, h: 2.5, fill: { color: colors.white } });
slide5.addText("快捷操作", { x: 6.7, y: 3.35, w: 2, h: 0.3, fontSize: 12, bold: true, color: colors.primary });

const actions = ["新建订单", "新增会员", "收款登记", "排班管理"];
let actionY = 3.7;
actions.forEach(action => {
  slide5.addShape("rect", { x: 6.7, y: actionY, w: 2.3, h: 0.4, fill: { color: "F5F7FA" } });
  slide5.addText(action, { x: 6.8, y: actionY + 0.05, w: 2, h: 0.3, fontSize: 10, color: colors.text });
  actionY += 0.5;
});

// 第6页：核心功能展示
const slide6 = pptx.addSlide();
slide6.addText("核心功能展示", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 32, bold: true, color: colors.primary
});

// 会员管理
slide6.addShape("rect", { x: 0.5, y: 1.5, w: 4.2, h: 2.2, fill: { color: colors.primary } });
slide6.addText("会员管理", { x: 0.7, y: 1.65, w: 3, h: 0.4, fontSize: 18, bold: true, color: colors.white });
slide6.addText("• 会员档案管理\n• 等级体系（普通/银卡/金卡/钻石）\n• 积分体系与兑换\n• 多维度会员分析", { 
  x: 0.7, y: 2.1, w: 3.8, h: 1.5, 
  fontSize: 12, color: colors.white, valign: "top" 
});

// 服务工单
slide6.addShape("rect", { x: 5, y: 1.5, w: 4.2, h: 2.2, fill: { color: colors.secondary } });
slide6.addText("服务工单", { x: 5.2, y: 1.65, w: 3, h: 0.4, fontSize: 18, bold: true, color: colors.white });
slide6.addText("• 工单全流程管理\n• 智能派单与改派\n• 实时状态跟踪\n• 客户评价系统", { 
  x: 5.2, y: 2.1, w: 3.8, h: 1.5, 
  fontSize: 12, color: colors.white, valign: "top" 
});

// 人员管理
slide6.addShape("rect", { x: 0.5, y: 4, w: 4.2, h: 2.2, fill: { color: colors.accent } });
slide6.addText("人员管理", { x: 0.7, y: 4.15, w: 3, h: 0.4, fontSize: 18, bold: true, color: colors.white });
slide6.addText("• 服务人员档案\n• 排班与考勤管理\n• 绩效评估体系\n• 薪资自动核算", { 
  x: 0.7, y: 4.6, w: 3.8, h: 1.5, 
  fontSize: 12, color: colors.white, valign: "top" 
});

// 财务管理
slide6.addShape("rect", { x: 5, y: 4, w: 4.2, h: 2.2, fill: { color: colors.dark } });
slide6.addText("财务管理", { x: 5.2, y: 4.15, w: 3, h: 0.4, fontSize: 18, bold: true, color: colors.white });
slide6.addText("• 多渠道收款管理\n• 退款与对账功能\n• 财务报表生成\n• 服务人员结算", { 
  x: 5.2, y: 4.6, w: 3.8, h: 1.5, 
  fontSize: 12, color: colors.white, valign: "top" 
});

// 第7页：项目计划
const slide7 = pptx.addSlide();
slide7.addText("项目计划", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 32, bold: true, color: colors.primary
});

// 里程碑时间线
const milestones = [
  { phase: "需求确认", week: "第1周", deliverable: "确认版PRD", status: "已完成" },
  { phase: "系统设计", week: "第2周", deliverable: "设计文档", status: "已完成" },
  { phase: "开发实现", week: "第3-8周", deliverable: "可运行系统", status: "进行中" },
  { phase: "测试验收", week: "第9-10周", deliverable: "测试报告", status: "待启动" },
  { phase: "上线部署", week: "第11-12周", deliverable: "生产系统", status: "待启动" }
];

let mileY = 1.5;
milestones.forEach((ms, index) => {
  const statusColor = ms.status === "已完成" ? colors.accent : (ms.status === "进行中" ? colors.primary : colors.gray);
  
  slide7.addShape("circle", { x: 0.8, y: mileY + 0.1, w: 0.3, h: 0.3, fill: { color: statusColor } });
  slide7.addText(ms.phase, { x: 1.3, y: mileY, w: 2, h: 0.3, fontSize: 14, bold: true, color: colors.text });
  slide7.addText(ms.week, { x: 3.5, y: mileY, w: 1.5, h: 0.3, fontSize: 12, color: colors.gray });
  slide7.addText(ms.deliverable, { x: 5, y: mileY, w: 2.5, h: 0.3, fontSize: 12, color: colors.text });
  slide7.addText(ms.status, { x: 7.8, y: mileY, w: 1.5, h: 0.3, fontSize: 11, color: statusColor, bold: true });
  
  if (index < milestones.length - 1) {
    slide7.addShape("line", { x: 0.95, y: mileY + 0.4, w: 0, h: 0.5, line: { color: colors.gray, width: 2 } });
  }
  mileY += 0.8;
});

// 资源需求
slide7.addText("资源需求", { x: 0.5, y: 5, w: "90%", h: 0.4, fontSize: 16, bold: true, color: colors.secondary });
slide7.addText("项目经理1人 + 前端开发2人 + 后端开发2人 + 测试工程师1人 + UI设计师1人（兼职）", { 
  x: 0.5, y: 5.4, w: "90%", h: 0.3, fontSize: 12, color: colors.text 
});

// 第8页：总结与展望
const slide8 = pptx.addSlide();
slide8.background = { color: colors.dark };
slide8.addShape("rect", { x: 0, y: 0, w: "100%", h: "100%", fill: { color: colors.dark } });

slide8.addText("项目总结", {
  x: 0.5, y: 1, w: "90%", h: 0.8,
  fontSize: 36, bold: true, color: colors.white, align: "center"
});

slide8.addText("通过数字化手段实现家政服务全流程管理", {
  x: 0.5, y: 2, w: "90%", h: 0.5,
  fontSize: 18, color: colors.accent, align: "center"
});

// 核心优势
const advantages = [
  "提升运营效率50%",
  "规范财务管理流程",
  "改善客户服务体验",
  "降低人力成本"
];

let advY = 3;
advantages.forEach(adv => {
  slide8.addShape("rect", { x: 2, y: advY, w: 6, h: 0.5, fill: { color: colors.primary } });
  slide8.addText(adv, { x: 2, y: advY + 0.1, w: 6, h: 0.3, fontSize: 14, color: colors.white, align: "center" });
  advY += 0.7;
});

slide8.addText("感谢聆听", {
  x: 0.5, y: 5.5, w: "90%", h: 0.5,
  fontSize: 24, bold: true, color: colors.white, align: "center"
});

// 保存PPT
pptx.writeFile({ fileName: "童虎家政管理系统-项目演示.pptx" })
  .then(() => {
    console.log("PPT生成成功！");
  })
  .catch(err => {
    console.error("PPT生成失败:", err);
  });
