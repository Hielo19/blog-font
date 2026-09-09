# 最近记录卡片试验版：备份与恢复

本次仅修改本地预览，未发布网站。

## 已保存的原版

- 原分支：`main`
- 原版提交：`5b7c832de6b837dc99dea58d0fa3daedb128e0e1`
- 备份标签：`backup/before-journal-cards-20260909`
- 试验分支：`codex/journal-cards-20260909`
- 源码及素材 ZIP：`C:/Users/nieve/Desktop/test/outputs/backups/hielo-before-journal-cards-20260909-5b7c832.zip`

开始改版前工作区干净。ZIP 包含该提交的全部受版本管理的源码、配置、锁文件及原始素材；依赖、构建缓存和 Git 历史不在 ZIP 内，可重新安装和生成。备份目录被 Git 忽略，切换分支时仍保留。

## 安全退回原版

先在项目目录运行 `git status`，确认当前修改。在当前试验分支提交想保留的工作后，再创建一个来自备份标签的恢复分支：

```powershell
git add --all
git commit -m "Save journal card experiment before rollback"
git switch -c codex/restore-before-journal-cards-20260909 backup/before-journal-cards-20260909
```

只在确有未提交修改时运行前两行，并先检查暂存内容，避免纳入无关文件。恢复分支名如果已经存在，直接 `git switch codex/restore-before-journal-cards-20260909`。该流程不覆盖试验分支，也不使用强制重置。

恢复后重新启动本地预览并刷新浏览器。想重新查看卡片版，先保存恢复分支上的修改，再切换回 `codex/journal-cards-20260909`。

也可以将 ZIP 解压到一个新的空目录，安装依赖后单独预览原版；不要直接覆盖当前项目。

## 移除示例卡片

六张示例集中在 `data/blog/journal.ts`，与 `data/blog/posts.ts` 的真实文章分开。将 `journalItems` 中的 `...examples` 移除即可隐藏全部示例。示例没有原文 URL 和阅读入口；两篇真实文章维持原有路由及原文链接。
