"use strict";

var web = require('webpage');
var fs = require('fs');

var page = web.create();
page.viewportSize = { width: 600, height: 600 };
page.paperSize = { 
    format: "A4", 
    orientation: 'portrait', 
    margin: '1cm' 
};

page.onConsoleMessage = function(msg) {
    console.log('The web page said: ' + msg);
};

page.open("res/Tut03_Induktion/Tut03.slides.html", 
    function (status) {
        if (status !== 'success') {
            console.log('failed: ' + 
                        " \t status: " + status);
            phantom.exit(1);
        } else {
            window.setTimeout(function () {
                /*page.evaluate(function() { 
                    var link = document.createElement( 'link' );
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = './../../../../reveal/css/print/pdf.css';
                    document.getElementsByTagName('head')[0].appendChild( link );
                    console.log('ran js'); 
                });
                fs.write("res/Tut03_Induktion/test.html", page.content);*/
                page.url = page.url + "?print-pdf";
                page.render("res/Tut03_Induktion/Tut03.slides.pdf");
                console.log('wrote');
                phantom.exit(0);
            }, 800);
        }
});


/*var web = require('webpage');

var fs = require('fs');
var files = fs.list('./res');
var index = -1;

function next_file() {
    index++;
    if(index >= files.length)
        phantom.exit(0);
    else 
        handel_file(files[index]);
}

function handel_file(file) {
    var endstr = file.substr(0, file.indexOf('_'));
    var add = './res/' + file + '/' + endstr +
               '.slides.html';
    var output = './res/' + file + '/' + endstr +
                 '.slides.pdf';

    console.log("starting to handel "+add)

    if (fs.isFile(add)) {

        console.log('handeling file: ' + add);

        var page = web.create();

        page.paperSize = { 
            format: 'a4', 
            orientation: 'landscape', 
            margin: '1cm' 
        };

        page.open(add + "?print-pdf", function (status) {
            consol.log("handelPageLoad: this="+this);
            if (status !== 'success') {
                console.log('failed: ' + add + 
                            " \t status: " + status);
                setTimeout(next_file, 50);
            } else {
                window.setTimeout(function () {
                    page.render(output);
                    console.log('wrote: ' + output);
                    setTimeout(next_file, 50);
                }, 200);
            }
        });
    } else {
        next_file();
    }
}

next_file();*/