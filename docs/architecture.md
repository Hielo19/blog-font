# 项目结构

本仓库是博客前端。当前使用 React / TypeScript / Vinext（兼容 Next.js 的应用目录），静态导出；Gin 后端尚未接入。目录调整保留现有首页、哈希阅读页、主题、滚动动画和真实内容。

```text
app/                         路由入口、根布局、全局主题样式
features/
  blog/
    blog-experience.tsx       页面组装、哈希导航、返回位置和页面过渡
    blog.module.css          博客界面样式，保留原有规则顺序
    components/              导航、首屏、个人卡片、说说、文章列表、阅读页
    hooks/use-blog-scene.ts   导航贴边与身份信息聚拢
    links.ts                 链接点击约定
  theme/use-appearance.ts    系统偏好、明暗切换和本地记忆
  scroll/                    滚动引擎及 React 生命周期适配
models/blog.ts               前端文章模型和首页内容模型
data/blog/posts.ts           当前本地文章数据
services/
  blog/
    repository.ts            内容读取接口
    local-repository.ts      本地数据实现
    index.ts                 选择数据实现的唯一入口
    mappers/                 预留：后端数据转换
  api/                       预留：HTTP 请求、响应与错误处理
contracts/                   预留：Gin 接口规范与传输类型
config/site.ts               站点配置
components/ui/               通用 UI 基础组件
hooks/                       通用 UI hooks（保留脚手架内容）
lib/                         日期格式、样式合并等通用工具
public/assets/               背景、头像、文章图片
scripts/                     构建和滚动回归测试
third-party/                 第三方代码来源与许可
docs/                        结构和接入说明
```

## 数据流

`app/page.tsx → services/blog → data/blog → BlogExperience 的 content 参数 → 展示组件`

`app/page.tsx` 在服务端渲染／静态构建阶段读取内容，再把可序列化的数据交给客户端界面。文章列表和阅读页通过参数获取文章，不能直接导入 `data/` 或自行请求后端。

`models/` 定义前端使用的模型；`contracts/` 未来定义网络传输格式。两者不强求一致，日期、图片地址、正文格式等差异由 `services/blog/mappers/` 转换。

## 修改位置

| 需求 | 修改位置 |
| --- | --- |
| 修改原有文章内容 | `data/blog/posts.ts` |
| 调整文章卡片／正文 | `features/blog/components/journal.tsx`／`reading-page.tsx` |
| 调整玻璃样式 | `features/blog/blog.module.css` |
| 调整全局配色和滚动条 | `app/globals.css` |
| 调整收拢路径或导航贴边 | `features/blog/hooks/use-blog-scene.ts` |
| 调整滚动缓动 | `features/scroll/` |
| 接入 Gin 内容 | `services/blog/`，详见 `backend-integration.md` |

当前哈希路由只支持已有的阅读样例，`BlogContent` 的两个字段也只是现有首页展示位，并非未来 CMS 的完整文章列表协议。增加分页、任意文章路由或后台管理时，应单独设计相应功能；不要把管理接口塞进当前展示组件。

保留完整博客 CSS 模块是为了维持现有选择器优先级和动画变量关系。功能组件已拆分，后续可按功能逐步拆样式，无需在本次目录整理中重做视觉。
