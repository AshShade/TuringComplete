# How to run the Instruction Set Viewer


1. 安装依赖：

   ```sh
   npm install
   ```

2. 启动开发服务器：

   ```sh
   npm run dev
   ```

3. 在浏览器访问 http://localhost:5173

4. 确保 instruction_set.yaml 文件位于项目根目录或 public 目录，页面会自动加载并展示指令集。

---

如需构建生产版本：

```sh
npm run build
```

构建后静态文件在 dist 目录，可用 `npm run preview` 本地预览。
