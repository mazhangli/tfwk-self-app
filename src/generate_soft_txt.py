import os

def format_code_to_txt(raw_code: str, output_file: str, software_name: str, version: str):
    """生成纯文本格式的软著源代码（每页50行，连续行号，页眉）"""
    # 按行拆分，并去除空行（保留非空行）
    lines = [line.rstrip('\n') for line in raw_code.splitlines() if line.strip() != '']
    total_lines = len(lines)
    
    lines_per_page = 50
    page_count = (total_lines + lines_per_page - 1) // lines_per_page
    
    with open(output_file, 'w', encoding='utf-8') as f:
        for page in range(page_count):
            # 页眉（格式：软件全称 版本号 页码）
            header = f"{software_name} {version} 第{page+1}页"
            f.write(header + '\n')
            f.write('=' * 60 + '\n')  # 分隔线
            
            start = page * lines_per_page
            end = min(start + lines_per_page, total_lines)
            for idx in range(start, end):
                line_number = idx + 1  # 全局行号
                f.write(f"{line_number:>6}\t{lines[idx]}\n")
            
            # 如果不是最后一页，添加分页符（Word 中可识别为换页）
            if page != page_count - 1:
                f.write('\f')  # 换页符
        print(f"✅ 生成完成: {output_file}  (共{page_count}页, {total_lines}行代码)")

# =============== 请修改以下配置 ===============
# 1. 把您整理好的所有核心代码合并到一个文本文件中（例如 merged.txt）
input_file = "merged.txt"          # 改成您的代码合并文件路径
output_file = "源代码.txt"          # 输出的TXT文件
software_name = "同方卫康自助服务系统"   # 改成您的软件全称
version = "V1.1.0"                 # 改成您的版本号
# ===========================================

if __name__ == "__main__":
    if not os.path.exists(input_file):
        print(f"❌ 文件不存在: {input_file}")
        print("请先将您的核心代码合并到一个文本文件中，并修改 input_file 路径")
    else:
        with open(input_file, "r", encoding="utf-8") as f:
            code = f.read()
        format_code_to_txt(code, output_file, software_name, version)