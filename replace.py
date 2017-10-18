import os
import sys
import re

def handleFile(path, replace_str):
    print("Handeling file = '%s'" % path)
    with open(path, 'r') as f:
        contents = f.read()
    if "<!-- Default Header -->" in contents:
        print("\tby replacing default header commment")
        contents = contents.replace("<!-- Default Header -->", replace_str)
    else:
        l = re.split("<!-- Start Default Header -->|<!-- End Default Header -->", contents)
        if len(l) != 3:
            print("\tfailed because split list has wrong length (%s)" % len(l))
            return
        print("\tby replacing contents of default header scope")
        contents = l[0] + replace_str + l[2]
    with open(path, 'w') as f:
        f.write(contents)

def applyAllFiles(path, replace_str):
    print("applyAllFiles called for path: '%s'" % path)
    prog = re.compile("(.[/|\\\\])?sec_[^/|\\\\]*[/\\\\]page_[^/|\\\\]*[/\\\\]src_index\\.html")
    for root, directorys, file_name in os.walk(path):
        for f in file_name:
            ff = root + '/' + f
            #print("Checking path: '%s'" % ff)
            m = prog.match(ff)
            if m is not None:
                handleFile(ff, replace_str)

def main():
    with open("standard_header.html", 'r') as sh:
        replace_str = "<!-- Start Default Header -->\n" \
            + sh.read() + "<!-- End Default Header -->"
    applyAllFiles(".", replace_str)

if __name__ == "__main__":
    main()
