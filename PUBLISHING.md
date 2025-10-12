# 发布到GitHub的说明

## 准备工作

1. 确保已安装Git
2. 确保已注册GitHub账号

## 发布步骤

1. 在GitHub上创建一个新的仓库
2. 克隆仓库到本地：
   ```
   git clone <your-repository-url>
   ```
3. 将Personal Web Navigator的所有文件复制到克隆的仓库目录中
4. 初始化Git仓库：
   ```
   git init
   ```
5. 添加所有文件：
   ```
   git add .
   ```
6. 提交更改：
   ```
   git commit -m "Initial commit: Personal Web Navigator"
   ```
7. 添加远程仓库：
   ```
   git remote add origin <your-repository-url>
   ```
8. 推送到GitHub：
   ```
   git push -u origin master
   ```

## 注意事项

- data.json文件已包含示例数据，您可以直接使用
- 如果您想使用自己的数据，请在推送前替换data.json内容
- 请确保不要将敏感信息上传到公共仓库