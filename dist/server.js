const express = require('express');
const path = require('path');
const app = express();
// 支持从环境变量读取端口，兼容不同的部署平台
const port = process.env.PORT || 3000;

// 静态文件服务
app.use(express.static(__dirname));

// 默认路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Galgame服务器运行在 http://localhost:${port}`);
});