# Cloudflare Pages 迁移

先建立 Pages 预览，验证后再切换域名。现有 GitHub Pages 工作流暂时保留用于回退。

## Git 集成设置

- GitHub 仓库：oooeee999-dot/wooohu-site
- 生产分支：main
- 根目录：仓库根目录
- 构建命令：bash scripts/build-cloudflare.sh
- 输出目录：_site
- 环境变量：JEKYLL_ENV=production

仓库通过 Gemfile 安装 Jekyll。构建顺序为新品生成 → Jekyll → 图片与输出检查。首次真实构建需要在 Cloudflare 日志中验证。

## 切换前检查

检查 Pages 预览中的首页、/new-arrivals/、代表型号、/blog/、文章、/privacy.html、/sitemap.xml、/robots.txt 及 Google 验证文件。
检查手机导航、WhatsApp 和邮箱链接。预览域名不加载 GA4，这是已有的正式域名保护规则。

## 域名

预览通过后，在 Pages 项目中添加 wooohu.com 和 www.wooohu.com。
如果需要将域名 DNS 接入 Cloudflare，先完整核对已有记录，尤其是 MX、SPF、DKIM、DMARC 等邮件记录；不要仅迁移网站记录。
按 Cloudflare 控制台给出的记录配置，不猜测目标地址。
www 到主域名使用永久重定向，保留路径及查询参数。待证书和两种域名都验证通过后再停用旧发布流程。

域名、型号和文章 URL 保持不变。保留现有 canonical、Google 验证和统计 ID。

## 发布习惯

以后仍由负责人 Commit 与 Push，Cloudflare 自动构建发布。源码继续存 GitHub。
