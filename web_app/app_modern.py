#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
现代化养老服务预约数据采集系统
集成数据采集、分析和可视化功能
"""

from flask import Flask, request, jsonify, render_template, send_file
import json
import pandas as pd
import io
from datetime import datetime
import traceback
from data_collector import ReservationDataCollector

app = Flask(__name__)
collector = ReservationDataCollector()

# 全局存储最近一次采集的数据
latest_data = {}

@app.route('/')
def index():
    """主页面"""
    return render_template('modern_dashboard.html')

@app.route('/visualization')
def visualization_dashboard():
    """可视化大屏页面"""
    # 读取CSS和JS文件内容
    css_content = ""
    js_content = ""
    
    try:
        with open('static/css/visualization_dashboard.css', 'r', encoding='utf-8') as f:
            css_content = f.read()
        
        with open('static/js/visualization_dashboard.js', 'r', encoding='utf-8') as f:
            js_content = f.read()
    except FileNotFoundError:
        css_content = "/* CSS文件未找到 */"
        js_content = "// JS文件未找到"
    
    # 准备数据
    dashboard_data = {
        'service_type_data': [
            {'name': '能力评估', 'value': 274, 'color': '#00D4FF', 'percent': 67.8},
            {'name': '上门服务', 'value': 121, 'color': '#FF6B35', 'percent': 29.9},
            {'name': '生活照料', 'value': 9, 'color': '#39FF14', 'percent': 2.2}
        ],
        'assessment_type_data': [
            {'name': '初次评估', 'value': 223, 'color': '#00D4FF'},
            {'name': '复评', 'value': 51, 'color': '#7B61FF'}
        ],
        'area_data': [
            {'area': '宝塔区', 'count': 356, 'percent': 88.1},
            {'area': '安塞区/县', 'count': 22, 'percent': 5.4},
            {'area': '延川县', 'count': 8, 'percent': 2.0},
            {'area': '其他地区', 'count': 18, 'percent': 4.5}
        ],
        'gender_data': [
            {'name': '女性', 'value': 258, 'color': '#FF6B9D', 'percent': 63.9},
            {'name': '男性', 'value': 146, 'color': '#4FC3F7', 'percent': 36.1}
        ],
        'time_slot_data': [
            {'slot': '上午', 'count': 171, 'color': '#FFB74D'},
            {'slot': '下午', 'count': 233, 'color': '#00D4FF'}
        ],
        'recent_appointments': [
            {'name': '冯国英', 'service': '能力评估', 'time': '2026-04-27 下午', 'status': '未处理', 
             'service_color': '#00D4FF', 'status_color': '#FF6B35'},
            {'name': '贺建军', 'service': '能力评估', 'time': '2026-03-21 上午', 'status': '未处理',
             'service_color': '#00D4FF', 'status_color': '#FF6B35'},
            {'name': '曹金莲', 'service': '能力评估', 'time': '2026-03-21 上午', 'status': '未处理',
             'service_color': '#00D4FF', 'status_color': '#FF6B35'},
            {'name': '郭玉兰', 'service': '能力评估', 'time': '2026-03-20 上午', 'status': '未处理',
             'service_color': '#00D4FF', 'status_color': '#FF6B35'},
            {'name': '王延清', 'service': '能力评估', 'time': '2026-03-20 上午', 'status': '未处理',
             'service_color': '#00D4FF', 'status_color': '#FF6B35'},
            {'name': '张玉兰', 'service': '能力评估', 'time': '2026-03-20 上午', 'status': '未处理',
             'service_color': '#00D4FF', 'status_color': '#FF6B35'},
            {'name': '林秀珍', 'service': '能力评估', 'time': '2026-03-20 下午', 'status': '未处理',
             'service_color': '#00D4FF', 'status_color': '#FF6B35'},
            {'name': '王磊', 'service': '生活照料', 'time': '2026-03-20 上午', 'status': '未处理',
             'service_color': '#39FF14', 'status_color': '#FF6B35'},
            {'name': '高平安', 'service': '生活照料', 'time': '2026-03-20 上午', 'status': '未处理',
             'service_color': '#39FF14', 'status_color': '#FF6B35'},
            {'name': '李秀娃', 'service': '能力评估', 'time': '2026-03-20 上午', 'status': '未处理',
             'service_color': '#00D4FF', 'status_color': '#FF6B35'}
        ]
    }
    
    return render_template('visualization_dashboard.html', 
                         css_styles=css_content,
                         javascript_code=js_content,
                         **dashboard_data)

@app.route('/amap-test')
def amap_test():
    """高德地图密钥测试页面"""
    return render_template('amap_key_test.html')

@app.route('/api/collect', methods=['POST'])
def api_collect():
    """API: 采集数据"""
    try:
        data = request.json
        curl_command = data.get('curl', '')
        mode = data.get('mode', 'overwrite')  # 默认覆盖模式
        
        if not curl_command:
            return jsonify({'success': False, 'error': '请提供curl命令'})
        
        # 采集数据
        result = collector.collect_all_data(curl_command)
        
        # 根据模式处理数据
        if mode == 'append' and latest_data:
            # 追加模式：合并数据
            existing_records = latest_data.get('records', [])
            new_records = result.get('records', [])
            
            # 去重：基于预约单号
            existing_ids = set(r.get('预约单号', '') for r in existing_records)
            unique_new_records = [r for r in new_records if r.get('预约单号', '') not in existing_ids]
            
            # 合并记录
            merged_records = existing_records + unique_new_records
            
            # 更新统计数据
            merged_stats = {
                'total_count': len(merged_records),
                'unhandled_count': len([r for r in merged_records if r.get('处理状态') == '未处理']),
                'handled_count': len([r for r in merged_records if r.get('处理状态') == '已处理'])
            }
            
            if merged_stats['total_count'] > 0:
                merged_stats['handle_rate'] = f"{round((merged_stats['handled_count'] / merged_stats['total_count']) * 100)}%"
            else:
                merged_stats['handle_rate'] = '0%'
            
            # 更新结果
            result['records'] = merged_records
            result['stats'] = merged_stats
            
            app.logger.info(f"数据合并完成: 原有{len(existing_records)}条 + 新增{len(unique_new_records)}条 = 总计{len(merged_records)}条")
        
        # 保存到全局变量
        latest_data.update(result)
        
        return jsonify({
            'success': True,
            'data': result,
            'mode': mode,
            'message': f"数据{'合并' if mode == 'append' else '采集'}成功"
        })
        
    except Exception as e:
        error_msg = f"数据采集失败: {str(e)}"
        app.logger.error(error_msg)
        app.logger.error(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': error_msg
        }), 500

@app.route('/api/export/csv', methods=['POST'])
def export_csv():
    """导出CSV文件"""
    try:
        data = request.json
        records = data.get('records', [])
        
        if not records:
            return jsonify({'error': '没有数据可导出'}), 400
        
        # 创建DataFrame
        df = pd.DataFrame(records)
        
        # 选择要导出的列
        columns = ['预约单号', '姓名', '公民身份号码', '人员手机号', '预约服务类型', '服务内容类型',
                  '预约时间', '服务机构名称', '服务机构地址', '服务地址', '原始服务地址', '创建时间', '确认时间',
                  '处理状态', '服务类型编码', '来访人数', '备注', '回复信息', '评估类型']
        
        # 确保所有列都存在
        for col in columns:
            if col not in df.columns:
                df[col] = ''
        
        df = df[columns]
        
        # 生成CSV
        output = io.StringIO()
        df.to_csv(output, index=False, encoding='utf-8-sig')
        output.seek(0)
        
        # 创建响应
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'预约数据_{timestamp}.csv'
        
        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8-sig')),
            mimetype='text/csv',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        app.logger.error(f"CSV导出失败: {str(e)}")
        return jsonify({'error': f'导出失败: {str(e)}'}), 500

@app.route('/api/export/excel', methods=['POST'])
def export_excel():
    """导出Excel文件"""
    try:
        data = request.json
        records = data.get('records', [])
        
        if not records:
            return jsonify({'error': '没有数据可导出'}), 400
        
        # 创建DataFrame
        df = pd.DataFrame(records)
        
        # 选择要导出的列
        columns = ['预约单号', '姓名', '公民身份号码', '人员手机号', '预约服务类型', '服务内容类型',
                  '预约时间', '服务机构名称', '服务机构地址', '服务地址', '原始服务地址', '创建时间', '确认时间',
                  '处理状态', '服务类型编码', '来访人数', '备注', '回复信息', '评估类型']
        
        # 确保所有列都存在
        for col in columns:
            if col not in df.columns:
                df[col] = ''
        
        df = df[columns]
        
        # 生成Excel
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='预约数据')
        output.seek(0)
        
        # 创建响应
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'预约数据_{timestamp}.xlsx'
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        app.logger.error(f"Excel导出失败: {str(e)}")
        return jsonify({'error': f'导出失败: {str(e)}'}), 500

@app.route('/api/stats')
def get_stats():
    """获取统计数据"""
    if not latest_data:
        return jsonify({
            'success': True,
            'stats': {
                'total_count': 0,
                'handled_count': 0,
                'unhandled_count': 0,
                'handle_rate': '0%'
            },
            'timestamp': datetime.now().isoformat()
        })
    
    return jsonify({
        'success': True,
        'stats': latest_data.get('stats', {}),
        'timestamp': latest_data.get('timestamp', '')
    })

@app.route('/api/recent-data')
def get_recent_data():
    """获取最近采集的数据"""
    if not latest_data:
        return jsonify({
            'success': True,
            'records': [],
            'stats': {
                'total_count': 0,
                'handled_count': 0,
                'unhandled_count': 0,
                'handle_rate': '0%'
            },
            'timestamp': datetime.now().isoformat()
        })
    
    # 只返回前100条记录以避免响应过大
    records = latest_data.get('records', [])[:100]
    
    return jsonify({
        'success': True,
        'records': records,
        'stats': latest_data.get('stats', {}),
        'timestamp': latest_data.get('timestamp', '')
    })

@app.route('/health')
@app.route('/api/health')
def health_check():
    """健康检查"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '2.0.0'
    })

# 错误处理
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': '页面未找到'}), 404

@app.errorhandler(500)
def internal_error(error):
    app.logger.error(f"内部服务器错误: {str(error)}")
    return jsonify({'error': '服务器内部错误'}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("养老服务预约数据采集与分析系统")
    print("=" * 60)
    print("🚀 系统启动中...")
    print("📊 访问地址: http://127.0.0.1:11236")
    print("📁 API文档: http://127.0.0.1:11236/docs (TODO)")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=11236, debug=False)