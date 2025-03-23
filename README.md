## 🌐 **Cloudflare Workers：带密码保护的网址导航页面**

---

## 🛠️ **功能概述**
- **Worker事件监听器**：处理请求和路由。
- **请求处理函数**：响应用户请求。
- **身份验证函数**：校验用户输入的密码。
- **HTML内容生成函数**：动态生成导航页面，支持深色/浅色主题切换。
- **前端页面**：
  - 响应式布局，适配桌面与移动设备。
  - 深色/浅色主题切换。
  - 登录验证系统。
  - 完整的网址导航列表。

---

### 🚀 **使用说明**

1. **设置环境变量**
   - 在 Cloudflare Workers 设置 `PASSWORD` 环境变量，用于访问验证。

2. **创建 KV Namespace**
   - 在 Cloudflare Workers 中创建一个 KV Namespace，命名为 `"weblist"`。

3. **添加 KV 数据**
   - 在 KV Namespace `"weblist"` 中添加数据：
     - **Key**: `"DASHBOARD"`
     - **Value**: `dashboard` HTML 内容。

4. **绑定 KV Namespace**
   - 在 Worker 设置中绑定 KV Namespace：
     - **绑定名称**：`"WEBLIST"`
     - **对应 KV Namespace**：`"weblist"`。

5. **部署到 Cloudflare Workers**
   - 将代码部署到 Cloudflare Workers。
   - 确保已正确绑定 KV Namespace 并配置环境变量。

6. **访问域名**
   - 访问 Cloudflare Workers 分配的域名，即可使用密码保护的网址导航页面。

---

## 🔥 **特点**
- ✅ 密码保护：防止未授权访问。
- ✅ 响应式设计：适配各种设备。
- ✅ 主题切换：深色/浅色模式。
- ✅ 易部署：Cloudflare Workers 一键部署。
- ✅ 自定义导航链接：轻松添加网址。

---

💡 **提示**：可以在 HTML 中扩展导航列表，或增加更多样式，打造个性化导航页面。

![image](https://github.com/user-attachments/assets/278742ab-6a22-44bf-8a61-a7d027b4936b)

