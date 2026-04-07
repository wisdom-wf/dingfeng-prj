#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
养老服务预约数据采集器 - 完整版
支持从全国养老服务信息平台抓取数据并进行可视化分析
"""

import requests
import json
import csv
import pandas as pd
import time
import re
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('data_collector.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ReservationDataCollector:
    """预约数据采集器"""
    
    PAGE_SIZE = 500  # 单页数据容量，减少请求次数
    
    def __init__(self):
        self.base_url = "https://ylfw.mca.gov.cn/ylapi/ylptjg/personServiceApply/reservationPage"
        self.session = requests.Session()
        self.all_records = []
        self.stats = {}
        
    def parse_curl_command(self, curl_command: str) -> Dict:
        """解析curl命令，提取请求配置"""
        config = {
            'url': '',
            'headers': {},
            'cookies': {},
            'data': {}
        }
        
        # 提取URL
        url_match = re.search(r"curl\s+'([^']+)'", curl_command)
        if url_match:
            config['url'] = url_match.group(1)
        
        # 提取Headers
        header_pattern = r"-H\s+'([^:]+):\s*([^']+)'"
        for match in re.finditer(header_pattern, curl_command):
            key = match.group(1)
            value = match.group(2)
            config['headers'][key] = value
        
        # 提取Cookies
        cookie_pattern = r"-b\s+'([^']+)'"
        cookie_match = re.search(cookie_pattern, curl_command)
        if cookie_match:
            cookie_str = cookie_match.group(1)
            for cookie in cookie_str.split(';'):
                if '=' in cookie:
                    key, value = cookie.strip().split('=', 1)
                    config['cookies'][key] = value
        
        # 提取data-raw
        data_pattern = r"--data-raw\s+'([^']+)'"
        data_match = re.search(data_pattern, curl_command)
        if data_match:
            data_str = data_match.group(1)
            for param in data_str.split('&'):
                if '=' in param:
                    key, value = param.split('=', 1)
                    config['data'][key] = value
        
        logger.info(f"解析curl命令完成，URL: {config['url']}")
        return config
    
    def fetch_page_data(self, config: Dict, page: int, if_handle: int, 
                       max_retries: int = 3) -> List[Dict]:
        """获取单页数据"""
        records = []
        
        # 构建请求数据
        data = config['data'].copy()
        data['current'] = str(page)
        data['size'] = str(self.PAGE_SIZE)  # 单页数据容量，减少请求次数
        data['ifHandle'] = str(if_handle)
        
        # 设置状态标签
        status_label = "已处理" if if_handle == 1 else "未处理"
        
        for attempt in range(max_retries):
            try:
                logger.info(f"请求第 {page} 页 (状态: {status_label}), 尝试 {attempt + 1}/{max_retries}")
                
                response = self.session.post(
                    config['url'],
                    headers=config['headers'],
                    cookies=config['cookies'],
                    data=data,
                    timeout=30
                )
                
                if response.status_code != 200:
                    logger.warning(f"HTTP {response.status_code}: {response.text}")
                    continue
                
                result = response.json()
                
                if result.get("code") != 0:
                    logger.error(f"API错误: {result.get('msg')}")
                    continue
                
                page_records = result.get("data", {}).get("records", [])
                total = result.get("data", {}).get("total", 0)
                
                if not page_records:
                    logger.info("没有更多数据")
                    break
                
                # 处理记录字段映射
                for record in page_records:
                    processed_record = self.process_record(record, status_label)
                    records.append(processed_record)
                
                logger.info(f"✓ 第 {page} 页获取 {len(page_records)} 条数据")
                
                # 如果已获取所有数据则退出
                if len(records) >= total:
                    break
                    
                return records
                
            except Exception as e:
                logger.error(f"请求失败 (尝试 {attempt + 1}): {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # 指数退避
                else:
                    logger.error("达到最大重试次数")
                    break
        
        return records
    
    def process_record(self, record: Dict, status_label: str) -> Dict:
        """处理单条记录，标准化字段"""
        # 根据实际API响应结构调整字段映射
        live_address = record.get('liveAddress', '')
        org_address = record.get('orgAddress', '')
        org_name = record.get('axbe0003', '')  # 服务机构名称
        
        # 为liveAddress补充省市区信息
        processed_live_address = self.enhance_address(live_address)
        
        return {
            '预约单号': record.get('id', ''),  # 使用id作为预约单号
            '姓名': record.get('personName', ''),
            '公民身份号码': record.get('personIdCard', ''),
            '人员手机号': record.get('personPhone', ''),  # 人员手机号
            '预约服务类型': self.get_service_type_name(record.get('serviceType', '')),  # 主要服务类型
            '服务内容类型': self.get_service_content_name(record.get('serviceContent', '')),  # 服务内容类型
            '预约时间': f"{record.get('serviceTime', '')} {self.get_time_slot_name(record.get('timeSlot', ''))}".strip(),
            '服务机构名称': org_name,  # 服务机构名称 (axbe0003)
            '服务机构地址': org_address,  # 服务机构地址 (orgAddress)
            '服务地址': processed_live_address,  # 服务地址（已补充省市区）
            '原始服务地址': live_address,  # 原始服务地址
            '创建时间': record.get('createTime', ''),
            '确认时间': record.get('confirmTime', ''),
            '处理状态': status_label,
            '是否处理': '是' if record.get('ifHandle') == '1' else '否',
            '是否真实': '是' if record.get('ifTrue') == '1' else '否',
            '服务类型编码': record.get('serviceType', ''),
            '备注': record.get('notes', ''),
            '来访人数': record.get('visitorNum', 0),
            '回复信息': record.get('replyMessage', ''),
            '评估类型': record.get('assessmentType', ''),
            '经纬度': self.extract_coordinates(processed_live_address),  # 提取地理坐标
            '原始数据': json.dumps(record, ensure_ascii=False)
        }
    
    def collect_all_data(self, curl_command: str) -> Dict:
        """收集所有数据"""
        logger.info("开始数据采集...")
        
        # 解析curl命令
        config = self.parse_curl_command(curl_command)
        if not config['url']:
            raise ValueError("无法解析URL")
        
        all_records = []
        
        # 分别获取未处理和已处理数据
        for if_handle, status_label in [(0, "未处理"), (1, "已处理")]:
            logger.info(f"开始获取{status_label}数据...")
            page = 1
            
            while True:
                records = self.fetch_page_data(config, page, if_handle)
                if not records:
                    break
                    
                all_records.extend(records)
                
                # 返回数据量小于 PAGE_SIZE，说明已是最后一页，无需再请求
                if len(records) < self.PAGE_SIZE:
                    break
                
                page += 1
                time.sleep(0.5)  # 避免请求过快
        
        if not all_records:
            raise ValueError("未获取到任何数据")
        
        self.all_records = all_records
        self.generate_statistics()
        
        logger.info(f"数据采集完成，共获取 {len(all_records)} 条记录")
        return {
            'records': all_records,
            'stats': self.stats,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def generate_statistics(self):
        """生成统计数据"""
        if not self.all_records:
            return
        
        df = pd.DataFrame(self.all_records)
        
        # 基础统计
        self.stats = {
            'total_count': len(df),
            'unhandled_count': len(df[df['处理状态'] == '未处理']),
            'handled_count': len(df[df['处理状态'] == '已处理']),
            'service_types': df['预约服务类型'].value_counts().to_dict(),
            'daily_stats': df.groupby(df['预约时间'].str[:10]).size().to_dict() if not df['预约时间'].empty else {},
            'time_slot_stats': df['预约时间'].apply(lambda x: x.split()[-1] if ' ' in x else '').value_counts().to_dict(),
            'address_analysis': self.analyze_addresses(df),
            'handle_rate': f"{len(df[df['是否处理'] == '是']) / len(df) * 100:.1f}%" if len(df) > 0 else '0%',
            'real_rate': f"{len(df[df['是否真实'] == '是']) / len(df) * 100:.1f}%" if len(df) > 0 else '0%'
        }
    
    def analyze_addresses(self, df: pd.DataFrame) -> Dict:
        """分析地址分布"""
        addresses = df['服务地址'].dropna()
        if addresses.empty:
            return {}
        
        # 简单的地址分析（可以根据需要扩展）
        address_stats = {}
        for addr in addresses:
            # 这里可以添加更复杂的地址解析逻辑
            if addr:
                province = self.extract_province(addr)
                if province:
                    address_stats[province] = address_stats.get(province, 0) + 1
        
        return address_stats
    
    def get_service_type_name(self, code: str) -> str:
        """根据服务类型编码获取服务名称"""
        service_mapping = {
            '01': '生活照料',
            '02': '医疗护理',
            '03': '精神慰藉',
            '04': '文化娱乐',
            '05': '上门服务',
            '06': '能力评估'
        }
        return service_mapping.get(str(code), f'未知服务({code})') if code is not None else '未知服务(None)'
    
    def get_service_content_name(self, code: str) -> str:
        """根据服务内容编码获取服务内容名称"""
        content_mapping = {
            '02': '生活照料服务'
            # 其他编码暂时显示未知，待后续补充
        }
        return content_mapping.get(str(code), f'未知内容({code})') if code is not None else '未知内容(None)'
    
    def enhance_address(self, address: str) -> str:
        """为地址补充省市区信息"""
        if not address:
            return "陕西省延安市宝塔区"
        
        # 检查是否已经是完整地址（包含省市区）
        # 简单判断：如果地址中包含常见的省市关键字且长度较长，认为是完整地址
        complete_address_patterns = [
            r'[\u4e00-\u9fa5]{1,2}[省市]',  # 省市
            r'[\u4e00-\u9fa5]{1,2}区',     # 区
            r'[\u4e00-\u9fa5]{1,2}县',     # 县
        ]
        
        import re
        complete_matches = sum(1 for pattern in complete_address_patterns 
                              if re.search(pattern, address))
        
        # 如果匹配到多个地址层级关键字，认为是完整地址
        if complete_matches >= 2 and len(address) > 6:
            return address
        
        # 补充默认的省市区
        return f"陕西省延安市宝塔区{address}"
    
    def extract_coordinates(self, address: str) -> str:
        """从地址中提取或估算经纬度坐标"""
        if not address:
            return ""
        
        # 这里可以集成高德地图API进行精确坐标获取
        # 目前返回空字符串，后续可通过API获取精确坐标
        return ""
    
    def get_time_slot_name(self, slot: str) -> str:
        """根据时间段编码获取时间段名称"""
        time_mapping = {
            'am': '上午',
            'pm': '下午',
            'night': '晚上'
        }
        return time_mapping.get(slot, slot)
    
    def extract_province(self, address: str) -> Optional[str]:
        """从地址中提取省份（简化版）"""
        provinces = ['北京', '上海', '天津', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江',
                    '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南',
                    '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾',
                    '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门']
        
        for province in provinces:
            if province in address:
                return province
        return None
    
    def save_to_csv(self, filename: Optional[str] = None) -> str:
        """保存数据到CSV文件"""
        if not self.all_records:
            raise ValueError("没有数据可保存")
        
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'预约数据_{timestamp}.csv'
        
        fieldnames = [
            '预约单号', '姓名', '公民身份号码', '人员手机号', '预约服务类型', '服务内容类型',
            '预约时间', '服务机构名称', '服务机构地址', '服务地址', '原始服务地址', '创建时间', '确认时间',
            '处理状态', '服务类型编码', 
            '来访人数', '备注', '回复信息', '评估类型', '经纬度'
        ]
        
        with open(filename, 'w', newline='', encoding='utf-8-sig') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            # 只写入需要的字段
            for record in self.all_records:
                filtered_record = {k: v for k, v in record.items() if k in fieldnames}
                writer.writerow(filtered_record)
        
        logger.info(f"数据已保存到: {filename}")
        return filename
    
    def save_to_excel(self, filename: Optional[str] = None) -> str:
        """保存数据到Excel文件"""
        if not self.all_records:
            raise ValueError("没有数据可保存")
        
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'预约数据_{timestamp}.xlsx'
        
        # 转换为DataFrame并选择需要的列
        df = pd.DataFrame(self.all_records)
        
        columns = [
            '预约单号', '姓名', '公民身份号码', '人员手机号', '预约服务类型', '服务内容类型',
            '预约时间', '服务机构名称', '服务机构地址', '服务地址', '原始服务地址', '创建时间', '确认时间',
            '处理状态', '服务类型编码', 
            '来访人数', '备注', '回复信息', '评估类型', '经纬度'
        ]
        
        # 确保所有列都存在
        for col in columns:
            if col not in df.columns:
                df[col] = ''
        
        df = df[columns]
        df.to_excel(filename, index=False)
        
        logger.info(f"数据已保存到: {filename}")
        return filename

# 使用示例
if __name__ == "__main__":
    collector = ReservationDataCollector()
    
    # 示例curl命令（请替换为你的实际命令）
    sample_curl = """curl 'https://ylfw.mca.gov.cn/ylapi/ylptjg/personServiceApply/reservationPage' \\
  -H 'Accept: application/json, text/plain, */*' \\
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' \\
  -H 'Authorization: Bearer 80886af6-4850-496b-af31-b748206696b9' \\
  -H 'Connection: keep-alive' \\
  -H 'Content-Type: application/x-www-form-urlencoded' \\
  -b 'https_ydclearance=542e9be1284f2380e74da2fa-ee80-4dfa-bf85-e26cccfa9ba5-1773923006; https_waf_cookie=dbe8001e-dae4-4f0eb8c622b52025f156dd3e56ee2a03ce2d' \\
  -H 'Origin: https://ylfw.mca.gov.cn' \\
  -H 'Referer: https://ylfw.mca.gov.cn/' \\
  -H 'Sec-Fetch-Dest: empty' \\
  -H 'Sec-Fetch-Mode: cors' \\
  -H 'Sec-Fetch-Site: same-origin' \\
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36' \\
  -H 'sec-ch-ua: "Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"' \\
  -H 'sec-ch-ua-mobile: ?0' \\
  -H 'sec-ch-ua-platform: "macOS"' \\
  --data-raw 'current=1&size=500&ifHandle=1'"""
    
    try:
        # 采集数据
        result = collector.collect_all_data(sample_curl)
        
        # 保存数据
        csv_file = collector.save_to_csv()
        excel_file = collector.save_to_excel()
        
        # 输出统计信息
        print("\n=== 采集结果 ===")
        print(f"总记录数: {result['stats']['total_count']}")
        print(f"未处理: {result['stats']['unhandled_count']}")
        print(f"已处理: {result['stats']['handled_count']}")
        print(f"CSV文件: {csv_file}")
        print(f"Excel文件: {excel_file}")
        
    except Exception as e:
        logger.error(f"数据采集失败: {str(e)}")