# Notes on Feet 发布指南

1. 复制 templates/note.md 到 _notes/，英文文件名如 walking-and-feet.md。
2. 填写标题、日期、摘要、标签，同一文件中文在前、英文在后。
3. 草稿同时保留 draft: true、published: false；正式发布改为 draft: false、published: true。
4. 图片放 blog/images/文章名/，引用格式：![说明](/blog/images/文章名/photo.jpg)。
5. GitHub Desktop 中 Commit，再 Push。文章列表与站点地图自动生成。

文章网址：https://wooohu.com/blog/文件名/。
实质修改旧文章可增加 updated 日期字段。

首次上线：Settings → Pages → Build and deployment → Source 选择 GitHub Actions。然后在 Desktop 将本次所有修改 Commit to main，再 Push origin。Actions 中的 Build and deploy WOOOHU 会构建 Markdown、检查生成结果，通过后发布。以后只需提交文章，不必重复设置。部署后检查 /blog/、文章页面和 /sitemap.xml。如果第一次推送后才改 Source，可在 Actions 中手动 Run workflow 重跑。

首页仍能直接打开 HTML；博客必须经过 Jekyll 构建，不能双击原始 HTML 预览。本机没有已确认的 Ruby/Jekyll 环境，此次未完成真实构建和视觉核验。

保留 CNAME、Google 验证文件和 images。公开仓库中的草稿源码也是公开的，不要放私密信息。
