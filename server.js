const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3003;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 提供静态文件
app.use(express.static(path.join(__dirname)));

// API路由：保存网站数据
app.post('/api/save', (req, res) => {
    try {
        const data = req.body;
        
        // 验证数据格式 - 现是是包含categories的对象
        if (!data || !Array.isArray(data.categories)) {
            return res.status(400).json({ error: '数据格式错误' });
        }
        
        // 验证每个分类的结构
        for (const category of data.categories) {
            if (!category.id || !category.name || !Array.isArray(category.websites)) {
                return res.status(400).json({ error: '分类数据格式错误' });
            }
            
            // 验证每个网站的结构
            for (const website of category.websites) {
                if (!website.id || !website.name || !website.url) {
                    return res.status(400).json({ error: '网站数据格式错误' });
                }
            }
        }
        
        // 写入data.json文件
        fs.writeFileSync(
            path.join(__dirname, 'data.json'),
            JSON.stringify(data, null, 2),
            'utf8'
        );
        
        res.json({ success: true, message: '数据保存成功' });
    } catch (error) {
        console.error('保存数据时出错:', error);
        res.status(500).json({ error: '保存数据失败' });
    }
});

// API路由：获取网站数据
app.get('/data.json', (req, res) => {
    try {
        const dataPath = path.join(__dirname, 'data.json');
        if (fs.existsSync(dataPath)) {
            res.sendFile(dataPath);
        } else {
            // 如果文件不存在，返回默认结构
            const defaultData = {
                categories: [
                    {
                        id: 'default',
                        name: '默认分类',
                        websites: []
                    }
                ]
            };
            res.json(defaultData);
        }
    } catch (error) {
        console.error('读取数据时出错:', error);
        res.status(500).json({ error: '读取数据失败' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
    console.log(`访问地址: http://localhost:${PORT}`);
});