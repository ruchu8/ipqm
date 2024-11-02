const express = require('express');
const { createCanvas } = require('canvas');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.get('/image', async (req, res) => {
    const ip = req.ip.replace('::ffff:', ''); // 获取客户端IP
    const userAgent = req.headers['user-agent']; // 获取用户代理

    // 调用API获取位置信息
    let location = '未知省份-未知城市';
    try {
        const response = await axios.get(`https://api.suyanw.cn/api/ipxx.php?ip=${ip}`);
        if (response.data.code === 200) {
            const province = response.data.data.province || '未知省份';
            const city = response.data.data.city || '未知城市';
            location = `${province}-${city}`;
        }
    } catch (error) {
        console.error(error);
    }

    // 创建画布
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // 设置背景色
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 设置字体颜色和字体
    ctx.fillStyle = '#000000';
    ctx.font = '30px Arial';

    // 绘制文本
    ctx.fillText(`欢迎您来自: ${location} 的朋友`, 50, 100);
    ctx.fillText(`您的IP是: ${ip}`, 50, 150);
    ctx.fillText(`您使用的浏览器: ${userAgent}`, 50, 200);

    // 输出图像
    res.setHeader('Content-Type', 'image/png');
    canvas.toBuffer((err, buffer) => {
        if (err) {
            res.status(500).send('图像生成失败');
            return;
        }
        res.send(buffer);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});