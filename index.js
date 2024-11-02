const express = require('express');
const { createCanvas } = require('canvas');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// 处理根路径的请求
app.get('/', (req, res) => {
    res.send('欢迎使用图像生成服务！请访问 /image 来生成图像。');
});

app.get('/image', async (req, res) => {
    const ip = req.ip.replace('::ffff:', ''); // 获取用户IP
    const userAgent = req.headers['user-agent']; // 获取用户代理
    const browser = getBrowser(userAgent); // 获取浏览器信息
    const os = getOS(userAgent); // 获取操作系统信息

    let location = '未知省份-未知城市';
    
    // 获取用户位置信息
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

    // 创建图像
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // 设置背景色
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 设置字体颜色和字体
    ctx.fillStyle = '#ff0000';
    ctx.font = '20px "微软雅黑"';

    // 绘制文本
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const today = new Date();
    const dateString = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    const dayOfWeek = weekDays[today.getDay()];

    ctx.fillText(`欢迎您来自: ${location} 的朋友`, 50, 50);
    ctx.fillText(`今天是：${dateString} 星期${dayOfWeek}`, 50, 100);
    ctx.fillText(`您的IP是: ${ip}`, 50, 150);
    ctx.fillText(`您使用的操作系统: ${os}`, 50, 200);
    ctx.fillText(`您使用的浏览器: ${browser}`, 50, 250);
    ctx.fillText('此接口由如初提供！', 50, 300);

    // 输出图像
    res.setHeader('Content-Type', 'image/png');
    canvas.toBuffer((err, buffer) => {
        if (err) {
            return res.status(500).send('图像生成失败');
        }
        res.send(buffer);
    });
});

// 函数：获取浏览器信息
function getBrowser(ua) {
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('MSIE')) return 'Internet Explorer';
    if (ua.includes('Edge')) return 'Edge';
    return '未知浏览器';
}

// 函数：获取操作系统信息
function getOS(ua) {
    if (ua.includes('Windows NT 10.0')) return 'Windows 10';
    if (ua.includes('Windows NT 6.1')) return 'Windows 7';
    if (ua.includes('Mac OS X')) return 'Mac OSX';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('iPhone')) return 'iPhone';
    if (ua.includes('iPad')) return 'iPad';
    return '未知操作系统';
}

// 启动服务器
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
