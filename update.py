import os
import sys
import bs4

menu_items = []

def get_all_folders(path, start_str):
    l = []
    root, directorys, file_name = next(os.walk(path))
    for folder in directorys:
        if folder.startswith(start_str):
            l.append(folder)
    return l

def arange(path, prefix, elements, get_func):
    try:
        with open(os.path.join(path, "order.txt"), 'r') as f:
            for i, line in enumerate(f.readlines()):
                identity = (prefix + line).replace("\n", "").replace("\r", "")
                j = [k for k, x in enumerate(elements) if (get_func(x) == identity)]
                if len(j) != 0:
                    j = j[0]
                    e = elements[j]
                    del elements[j]
                    elements.insert(i, e)
                else:
                    print("key %s from order file %s/order.txt wasn't found" % (line, path))
    except FileNotFoundError:
        pass

def main():
    folders = get_all_folders(".", "sec_")
    print("Found a totel of %d folders of type 'sec_'" % len(folders))
    for f in folders:
        pp = []
        m = False
        for p in get_all_folders(f, "page_"):
            pp.append(p)
        arange(f, "page_", pp, lambda x: x)
        menu_items.append((f, pp))
    print("sucsessfully read tree structure")

    arange(".", "sec_", menu_items, lambda x: x[0])

    for i, (f, pages) in enumerate(menu_items):

        for j, p in enumerate(pages):
            # reset state
            current_languag = "de"
            current_head = ""
            current_body = ""

            with open(os.path.join(f, p, "src_index.html"), 'r', encoding="utf-8") as source:
                bs = bs4.BeautifulSoup(source.read(), "lxml")
                current_head = bs.find('head').prettify('ascii', formatter='html').decode('utf-8', 'xmlcharrefreplace')
                current_head = current_head[current_head.find('>')+1:current_head.rfind('<')]
                current_body = bs.find('body').prettify('ascii', formatter='html').decode('utf-8', 'xmlcharrefreplace')
                current_body = current_body[current_body.find('>')+1:current_body.rfind('<')]

            # write state
            with open(os.path.join(f, p, "index.html"), 'w', encoding='utf-8') as target:
                target.write('<html lang="%s">\n' % current_languag)
                target.write('<head>\n')
                target.write(current_head)
                target.write('</head>\n')
                target.write('<body>\n')

                #make manue
                target.write('\t<div class="menu">\n')
                for ix, (fx, px) in enumerate(menu_items):
                    if i != ix:
                        target.write('\t\t<a href="../../%s/%s/index.html">%s</a>\n' %
                            (fx, px[0], fx.replace("sec_", "").replace("_", " ")))
                    else:
                        target.write('\t\t<span class="current-menu-entry">%s</span>\n' %
                            fx.replace("sec_", "").replace("_", " "))
                target.write('\t</div>\n\n')

                target.write('\t<div class="main">')

                #make contents menue
                target.write('\t<div class="main">\n\n')
                target.write('\t\t<div class="contents">\n')
                target.write('\t\t\t<h1>Contents</h1>\n')
                for s in pages:
                    target.write('\t\t\t<a href="../%s/index.html">%s</a>\n' %
                            (s, s.replace("page_", "").replace("_", " ")))
                target.write('\t\t</div>\n')
                target.write('\t</div>\n\n')

                target.write('\t<div class="page">\n')
                target.write(current_body)
                target.write('\t</div>\n')

                target.write('\t</div>')

                #make footer
                target.write('\t<div class="footer">\n')
                for ref, img in [
                                    ("mailto:j.illerhaus@live.de", "email"),
                                    ("https://github.com/JakeI", "github"),
                                    ("https://www.facebook.com/jochen.illerhaus", "facebook"),
                                    ("https://www.youtube.com/channel/UCay4-64cUMwgApgBtUtwDww", "youtube"),
                                    ("https://www.linkedin.com/in/JochenIllerhaus", "linkedin")
                                ]:
                    target.write('\t\t<a href="%s" >\n' % ref)
                    target.write(('\t\t\t<img src="../../icons/%s.png"' + \
                                 ' onmouseover="this.src=\'../../icons/%s-orange.png\'"' + \
                                 ' onmouseout="this.src=\'../../icons/%s.png\'">') % (img, img, img))
                target.write('\t</div>\n\n')

                target.write('</body>\n')
                target.write('</html>\n')
            print("sucsessfully build file %s/%s/index.html" % (f, p))

if __name__ == "__main__":
    main()
