# 新品图册

图片位置：new-arrivals/images/型号/，原文件名可以保留。

每个型号中的 collection.json 保存封面 cover、排序 order（数值越大越靠前）和每张图的中英文短句。每张图片需列入 images 一次。

本地更新后运行 node scripts/build-arrivals.cjs，生成可直接双击查看的图册页；GitHub 发布时也会自动运行。

新增图片后可以告诉助手整理诗句和顺序，再预览确认。没有 collection.json 的新型号会使用默认双语短句，发布前建议补齐。

0550 页面地址：/new-arrivals/0550/。每个型号的 WhatsApp 链接自动带上型号。
