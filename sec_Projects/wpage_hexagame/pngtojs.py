import os
import json
from PIL import Image

out = dict()
for filename in os.listdir("./"):
    if filename.endswith(".png"): 
        name = filename[:filename.find(".")]
        l = list(Image.open(filename).getdata())
        r = []
        for ll in l:
            r.extend(ll)
        out[name] = r
        print("processed image: %s" % name)
        continue
    else:
        continue

with open('imgs.js', 'w') as fp:
    fp.write("imgs = " + json.dumps(out))
print("saved to imgs.js")