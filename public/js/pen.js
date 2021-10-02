// Global variable to store layout of webpage
var view;

// Change View
function changeView(order){
  var main_row = document.getElementById('main-row');
  var editor_area = document.getElementById('editor-area');
  var output = document.getElementById('output');
  var html_box = document.getElementById('html-box');
  var css_box = document.getElementById('css-box');
  var js_box = document.getElementById('js-box');
  
  // Left View
  if(order == 1){
    view = 1;
    main_row.setAttribute('class', 'row no-gutters');
    html_box.removeAttribute('class');
    css_box.removeAttribute('class');
    js_box.removeAttribute('class');
    editor_area.setAttribute('class', 'col-md-4 order-1');
    output.setAttribute('class', 'col-md-8 order-2');
  }

  // Right View
  else if(order == 2){
    view = 2;
    main_row.setAttribute('class', 'row no-gutters');
    html_box.removeAttribute('class');
    css_box.removeAttribute('class');
    js_box.removeAttribute('class');
    editor_area.setAttribute('class', 'col-md-4 order-2');
    output.setAttribute('class', 'col-md-8 order-1');
  }

  // Top View
  else if(order == 3){
    view = 3;
    main_row.removeAttribute('class');
    editor_area.setAttribute('class', 'row no-gutters');
    html_box.setAttribute('class', 'col-md-4');
    css_box.setAttribute('class', 'col-md-4');
    js_box.setAttribute('class', 'col-md-4');
    output.setAttribute('class', 'col-md-12');
  }
}

var header = document.getElementById('nav');
var heading1 = document.getElementById('heading1');
var heading2 = document.getElementById('heading2');
var heading3 = document.getElementById('heading3');
var heading4 = document.getElementById('heading4');
var code_btn1 = document.getElementById('code-btn1');
var code_btn2 = document.getElementById('code-btn2');
var code_btn3 = document.getElementById('code-btn3');
var code_btn4 = document.getElementById('code-btn4');
var code_btn5 = document.getElementById('code-btn5');      
var editor_area = document.getElementById('editor-area');
var console_bar = document.getElementById('console-bar');
      
// Dark View
function lowVision(){
  header.removeAttribute('class');
  header.setAttribute('class', 'navbar navbar-expand-lg navbar-dark bg-dark');
  heading1.setAttribute('style', 'border: none; background-color: #454545; color: #fff;');
  heading2.setAttribute('style', 'border: none; background-color: #454545; color: #fff;');
  heading3.setAttribute('style', 'border: none; background-color: #454545; color: #fff;');
  heading4.setAttribute('style', 'border: none; background-color: #454545; color: #fff;');
  htmlEditor.setTheme("ace/theme/monokai");
  cssEditor.setTheme("ace/theme/monokai");
  jsEditor.setTheme("ace/theme/monokai");
  document.getElementById('logo').src="assets/logo-doodlepen-light.png";
  editor_area.setAttribute('style', 'border-right: 10px solid #595959');
  console_bar.setAttribute('style', 'background-color: #343a40');
  code_btn1.setAttribute('style', 'background-color: #343a40; color: #fff');
  code_btn2.setAttribute('style', 'background-color: #343a40; color: #fff');
  code_btn3.setAttribute('style', 'background-color: #343a40; color: #fff');
  code_btn4.setAttribute('style', 'background-color: #343a40; color: #fff');
  code_btn5.setAttribute('style', 'background-color: #343a40; color: #fff');
}

// Light View
function fullVision(){
  header.removeAttribute('style');
  header.setAttribute('style', 'background-color: #f5f5f5;');
  header.removeAttribute('class');
  header.setAttribute('class', 'navbar navbar-expand-lg navbar-light');
  heading1.setAttribute('style', 'background-color: #f3f3f3; color: #000;');
  heading2.setAttribute('style', 'background-color: #f3f3f3; color: #000;');
  heading3.setAttribute('style', 'background-color: #f3f3f3; color: #000;');
  heading4.setAttribute('style', 'background-color: #f3f3f3; color: #000;');
  htmlEditor.setTheme("ace/theme/crimson_editor");
  cssEditor.setTheme("ace/theme/crimson_editor");
  jsEditor.setTheme("ace/theme/crimson_editor");
  document.getElementById('logo').src="assets/logo-doodlepen.png";
  editor_area.setAttribute('style', 'border-right: 10px solid #efefef;');
  console_bar.setAttribute('style', 'background-color: #f5f5f5;');
  code_btn1.setAttribute('style', 'background-color: #f5f5f5; color: #000');
  code_btn2.setAttribute('style', 'background-color: #f5f5f5; color: #000');
  code_btn3.setAttribute('style', 'background-color: #f5f5f5; color: #000');
  code_btn4.setAttribute('style', 'background-color: #f5f5f5; color: #000');
  code_btn5.setAttribute('style', 'background-color: #f5f5f5; color: #000');
}
      
// HTML
var htmlEditor = ace.edit("html-editor");
htmlEditor.setTheme("ace/theme/crimson_editor");
htmlEditor.session.setMode("ace/mode/html");
htmlEditor.setOption("enableEmmet", true);
htmlEditor.session.setTabSize(2);
htmlEditor.session.setUseWrapMode(true);

// CSS
var cssEditor = ace.edit("css-editor");
cssEditor.setTheme("ace/theme/crimson_editor");
cssEditor.session.setMode("ace/mode/css");
cssEditor.session.setTabSize(2);
cssEditor.session.setUseWrapMode(true);

// JS
var jsEditor = ace.edit("js-editor");
jsEditor.setTheme("ace/theme/crimson_editor");
jsEditor.session.setMode("ace/mode/javascript");
jsEditor.session.setTabSize(2);
jsEditor.session.setUseWrapMode(true);

// Rendering
function render(order) {
  changeView(order);
  var html = htmlEditor.getValue();
  var css = cssEditor.getValue();
  var js = jsEditor.getValue();
  var iframeContent = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge">' + '<style>' + css + '</style>' + '</head><body>' + html + '\n<script>' + js + '<\/script>' + '</body></html>';
  var target = $('#preview')[0].contentWindow.document;
  target.open();
  target.write(iframeContent);
  target.close();
  console.log($('#preview').contents());
};

$(document).ready(function() {

  $(function () {
      $('[data-toggle="tooltip"]').tooltip()
  });

  // Console
  var iframeWindow = document.getElementById("preview").contentWindow;
  iframeWindow.console.log = function(val) {
    var divId = document.getElementById("console-window");
    var div_append = document.createElement("div");
    div_append.appendChild(document.createTextNode('\n > '+ val));
    divId.appendChild(div_append);
  };

  // Save
  $('#saveTitle-btn').click(function(){
    var title = $("#codeTitle").val();
    var h = htmlEditor.getValue();
    var c = cssEditor.getValue();
    var j = jsEditor.getValue();
    var l = view;
    console.log("title: "+title);
    $.ajax({
      type: 'POST',
      url: '/save',
      data: {html: h,css: c, js:j, layout: l, title: title},
      success: function(data)
      {
        console.log('key: '+data);
        if(data){
          $('#saved-link').css('display', 'block');
          $('#resultData').css('display', 'block');
          $('#showData').css('display', 'block');
          $('#showData').val('http://doodlepen.herokuapp.com/' + data);
        }
        else{
          $('#saved-link').css('display', 'none');
          $('#resultData').css('display', 'none');
          $('#showData').css('display', 'none');
          $('#saved-link').html('<div class="alert alert-danger" role="alert">Some error Occured! Couldnt save your data</div>');
        }
      },
      error: function(data)
      {
        console.log('Custom URL Generate Request Failed! :(');        
      }
    });
  });
  
});

function copyToClipboard() {
	var copyText = document.getElementById("showData");
	copyText.select();
 	document.execCommand("copy");
}