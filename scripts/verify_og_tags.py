import re

files = ['index.html', 'menu.html', 'custom.html', 'about.html', 'track.html', 'login.html']
for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    og_title = re.search(r'<meta property="og:title" content="([^"]+)"', content)
    og_desc = re.search(r'<meta property="og:description" content="([^"]+)"', content)
    og_img = re.search(r'<meta property="og:image" content="([^"]+)"', content)
    tw_card = re.search(r'<meta name="twitter:card" content="([^"]+)"', content)
    canonical = re.search(r'<link rel="canonical" href="([^"]+)"', content)
    
    print(f'=== {f} ===')
    print('  og:title:', og_title.group(1) if og_title else 'MISSING')
    print('  og:description:', (og_desc.group(1)[:60] + '...') if og_desc else 'MISSING')
    print('  og:image:', og_img.group(1) if og_img else 'MISSING')
    print('  twitter:card:', tw_card.group(1) if tw_card else 'MISSING')
    print('  canonical:', canonical.group(1) if canonical else 'MISSING')
