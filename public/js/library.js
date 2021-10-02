function render1(i, htmlContent, cssContent, jsContent) {
    var html = htmlContent;
    var css = cssContent;
    var js = jsContent;
    var iframeContent = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge">' + '<style>' + css + '</style>' + '</head><body>' + html + '\n<script>' + js + '<\/script>' + '</body></html>';
    var target = $('.preview1')[i].contentWindow.document;
    target.open();
    target.write(iframeContent);
    target.close();
    console.log($('#preview1').contents());
};