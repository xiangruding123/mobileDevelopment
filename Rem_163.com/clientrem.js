//这是网易的处理方法

<script>
    (function(win,doc){
        win.onload = win.onresize = function(){
            doc.documentElement.style.fontSize = doc.documentElement.clientWidth*100/750+'px';
        };

//		doc.documentElement.style.fontSize = doc.documentElement.clientWidth*100/750+'px';
//      win.addEventListener("resize",function(){
//      	doc.documentElement.style.fontSize = doc.documentElement.clientWidth*100/750+'px';
//      },false);
    })(window,document);
</script>

