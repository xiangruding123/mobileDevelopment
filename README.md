## mobileDevelopment
### web移动端开发使用的基础模板

web开发少不了移动端开发，这里的内容只是一个简单的模板页面的基础文件，后续内容需自己自行增添。

注：UI设计稿宽为750px

/20170824 16：40
--------------------------

添加了clientrem.js文件（来自徐宏&何辩）
也是一种是想页面rem布局的方法，采用此方法较为简单的设计。
一般不使用. 大多时候还是采用的rem.min.js文件来实现rem的页面布局（移动端）！
----------------
采用1、
```
(function(win,doc){
    win.onload = win.onresize = function(){
        doc.documentElement.style.fontSize = doc.documentElement.clientWidth*100/750+'px';
    };
})(window,document);
```
采用2、
```
doc.documentElement.style.fontSize = doc.documentElement.clientWidth*100/750+'px';
win.addEventListener("resize",function(){
  doc.documentElement.style.fontSize = doc.documentElement.clientWidth*100/750+'px';
},false);
```
/20170824  17:00

------------------------
