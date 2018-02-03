### hostcss.md使用

[参考自:h5 手机屏幕适配—rem](http://blog.csdn.net/jill6693484/article/details/53445192)

rem布局基本概念：
rem布局就是指为文档的根节点元素设置一个基准字体大小，然后所有的元素尺寸都以rem为单位来写，为了能够在不同尺寸的手机屏幕上自适应，需要用js来判断手机宽度，并动态设置<html>的字体大小，这样基准字体变了，元素的尺寸自然相应变化，达到了自适应的效果。


[hostcss.md使用教程及原代码](https://github.com/imochen/hotcss)


使用动态的HTML根字体大小和动态的viewport scale。

遵循视觉一致性原则。在不同大小的屏幕和不同的设备像素密度下，让你的页面看起来是一样的。

不仅便捷了你的布局，同时它使用起来异常简单。


示例名称	演示地址	贡献者
普通的演示	http://imochen.github.io/hotcss/example/normal/	墨尘
duang游戏	http://imochen.github.io/hotcss/example/duang/	阳阳](https://github.com/Keraun)
灰太狼	http://imochen.github.io/hotcss/example/wolf/	[阳阳](https://github.com/Keraun)


优势:
保证不同设备下的统一视觉体验。
不需要你再手动设置viewport，根据当前环境计算出最适合的viewport。
支持任意尺寸的设计图，不局限于特定尺寸的设计图。
支持单一项目，多种设计图尺寸，专为解决大型，长周期项目。
提供px2rem转换方法，CSS布局，零成本转换，原始值不丢失。
有效解决移动端真实1像素问题。


用法:
1、 引入hotcss.js
```
<script src="/path/to/hotcss.js"></script>
```
------------------------------------
2、css要怎么写
hotcss提供的将px转为rem的方法，可根据您的需要选择使用。
```
//px2rem.scss
@function px2rem( $px ){
    @return $px*320/$designWidth/20 + rem;
}
```
推荐使用scss来编写css，在scss文件的头部使用import将px2rem导入,
```
@import '/path/to/px2rem.scss';
```
如果你的项目是单一尺寸设计图，那么你需要去px2rem.scss中定义全局的designWidth。
```
@function px2rem( $px ){
    @return $px*320/$designWidth/20 + rem;
}
$designWidth : 750; //如设计图是750
```
如果你的项目是多尺寸设计图，那么就不能定义全局的designWidth了。需要在你的业务scss中单独定义。如以下是style.scss
```
@import '/path/to/px2rem.scss';
$designWidth : 750; //如设计图是750
```

$designWidth必须要在使用px2rem前定义。否则scss编译会出错。

#### 注意：如果使用less，则需要引入less-plugin-functions，普通的less编译工具无法正常编译。
------------------------------------

3、想用px怎么办？
直接写px肯定是不能适配的，那hotcss.js会在html上注册data-dpr属性，这个属性用来标识当前环境dpr值。那么要使用px可以这么写。
```
//scss写法
#container{
    font-size: 12px ;
    [data-dpr="2"] &{
        font-size: 24px;
    }
    [data-dpr="3"] &{
        font-size: 36px;
    }
}
```

可能你会说 talk is cheap,show me the code，那我现在列下hotcss整个项目的目录结构。
```
├── example //所有的示例都在这个目录下
│   ├── duang
│   ├── normal
│   └── wolf
│
└── src //主要文件在这里
    ├── hotcss.js
    ├── px2rem.less
    ├── px2rem.scss
    └── px2rem.styl
```

hotcss.js源代码：
```
(function( window , document ){

    'use strict';

    //给hotcss开辟个命名空间，别问我为什么，我要给你准备你会用到的方法，免得用到的时候还要自己写。
    var hotcss = {};

    (function() {
        //根据devicePixelRatio自定计算scale
        //可以有效解决移动端1px这个世纪难题。
        var viewportEl = document.querySelector('meta[name="viewport"]'),
            hotcssEl = document.querySelector('meta[name="hotcss"]'),
            dpr = window.devicePixelRatio || 1,
            maxWidth = 540,
            designWidth = 0;

        dpr = dpr >= 3 ? 3 : ( dpr >=2 ? 2 : 1 );

        //允许通过自定义name为hotcss的meta头，通过initial-dpr来强制定义页面缩放
        if (hotcssEl) {
            var hotcssCon = hotcssEl.getAttribute('content');
            if (hotcssCon) {
                var initialDprMatch = hotcssCon.match(/initial\-dpr=([\d\.]+)/);
                if (initialDprMatch) {
                    dpr = parseFloat(initialDprMatch[1]);
                }
                var maxWidthMatch = hotcssCon.match(/max\-width=([\d\.]+)/);
                if (maxWidthMatch) {
                    maxWidth = parseFloat(maxWidthMatch[1]);
                }
                var designWidthMatch = hotcssCon.match(/design\-width=([\d\.]+)/);
                if (designWidthMatch) {
                    designWidth = parseFloat(designWidthMatch[1]);
                }
            }
        }

        document.documentElement.setAttribute('data-dpr', dpr);
        hotcss.dpr = dpr;

        document.documentElement.setAttribute('max-width', maxWidth);
        hotcss.maxWidth = maxWidth;

        if( designWidth ){
            document.documentElement.setAttribute('design-width', designWidth);
            hotcss.designWidth = designWidth;
        }

        var scale = 1 / dpr,
            content = 'width=device-width, initial-scale=' + scale + ', minimum-scale=' + scale + ', maximum-scale=' + scale + ', user-scalable=no';

        if (viewportEl) {
            viewportEl.setAttribute('content', content);
        } else {
            viewportEl = document.createElement('meta');
            viewportEl.setAttribute('name', 'viewport');
            viewportEl.setAttribute('content', content);
            document.head.appendChild(viewportEl);
        }

    })();

    hotcss.px2rem = function( px , designWidth ){
        //预判你将会在JS中用到尺寸，特提供一个方法助你在JS中将px转为rem。就是这么贴心。
        if( !designWidth ){
            //如果你在JS中大量用到此方法，建议直接定义 hotcss.designWidth 来定义设计图尺寸;
            //否则可以在第二个参数告诉我你的设计图是多大。
            designWidth = parseInt(hotcss.designWidth , 10);
        }

        return parseInt(px,10)*320/designWidth/20;
    }

    hotcss.rem2px = function( rem , designWidth ){
        //新增一个rem2px的方法。用法和px2rem一致。
        if( !designWidth ){
            designWidth = parseInt(hotcss.designWidth , 10);
        }
        //rem可能为小数，这里不再做处理了
        return rem*20*designWidth/320;
    }

    hotcss.mresize = function(){
        //给HTML设置font-size。
        var innerWidth = document.documentElement.getBoundingClientRect().width || window.innerWidth;

        if( hotcss.maxWidth && (innerWidth/hotcss.dpr > hotcss.maxWidth) ){
            innerWidth = hotcss.maxWidth*hotcss.dpr;
        }

        if( !innerWidth ){ return false;}

        document.documentElement.style.fontSize = ( innerWidth*20/320 ) + 'px';

        hotcss.callback && hotcss.callback();

    };

    hotcss.mresize(); 
    //直接调用一次

    window.addEventListener( 'resize' , function(){
        clearTimeout( hotcss.tid );
        hotcss.tid = setTimeout( hotcss.mresize , 33 );
    } , false ); 
    //绑定resize的时候调用

    window.addEventListener( 'load' , hotcss.mresize , false ); 
    //防止不明原因的bug。load之后再调用一次。


    setTimeout(function(){
        hotcss.mresize(); 
        //防止某些机型怪异现象，异步再调用一次
    },333)

    window.hotcss = hotcss; 
    //命名空间暴露给你，控制权交给你，想怎么调怎么调。


})( window , document );
```


