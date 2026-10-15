"""Check the real Jekyll output before publishing it."""
from pathlib import Path
from xml.etree import ElementTree

root = Path('_site')
for name in [f'images/{i}.jpg' for i in range(1, 26)] + ['images/image.png', 'images/favicon.png']:
    source = Path(name)
    generated = root / name
    assert generated.is_file(), f'Missing image: {name}'
    assert generated.read_bytes() == source.read_bytes(), f'Image changed during build: {name}'
for name in ('index.html', 'blog/index.html', 'blog/feet-matter/index.html',
             'blog/journal.css', 'CNAME', 'google909bcdc3666f354b.html'):
    assert (root / name).is_file(), f'Missing output: {name}'
for name in ('blog/index.html', 'blog/feet-matter/index.html', 'sitemap.xml'):
    content = (root / name).read_text(encoding='utf-8')
    assert '{{' not in content and '{%' not in content, f'Unrendered Liquid: {name}'
article = (root / 'blog/feet-matter/index.html').read_text(encoding='utf-8')
assert article.index('脚对于人，非常重要。') < article.index('Our feet matter.')
assert (root / 'CNAME').read_text().strip() == 'wooohu.com'
xml = ElementTree.parse(root / 'sitemap.xml')
urls = {element.text for element in xml.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
assert 'https://wooohu.com/blog/' in urls
assert 'https://wooohu.com/blog/feet-matter/' in urls
assert not (root / 'templates').exists(), 'Templates must not be published'
assert not (root / 'scripts').exists(), 'Build scripts must not be published'
print('Generated homepage, bilingual article, assets and sitemap verified.')
