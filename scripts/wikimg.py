import json, os, urllib.parse, urllib.request, ssl

UA = {'User-Agent': 'BaijianDemo/1.0 (campus demo; contact kel@example.com)'}
OUT = 'C:/Users/34137/AppData/Local/hermes/cache/scratch/pick'
os.makedirs(OUT, exist_ok=True)

def api(q, n=6):
    url = ('https://commons.wikimedia.org/w/api.php?action=query&generator=search'
           '&gsrsearch=' + urllib.parse.quote(q + ' filetype:bitmap') +
           '&gsrnamespace=6&gsrlimit=%d&prop=imageinfo&iiprop=url|mime&iiurlwidth=900&format=json' % n)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        j = json.loads(r.read().decode())
    pages = (j.get('query') or {}).get('pages') or {}
    out = []
    for p in pages.values():
        ii = (p.get('imageinfo') or [{}])[0]
        u = ii.get('thumburl') or ii.get('url')
        if u and (ii.get('mime') or '').startswith('image/'):
            out.append((p['title'], u))
    return out

if __name__ == '__main__':
    got = api('pretzel', 6)
    for t, u in got:
        print(t, u[:110])
