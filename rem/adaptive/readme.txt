简单概述：

资源均来自github！
实现的最终效果就是使得手机实现自适应布局！


demo1资源链接：
https://github.com/finance-sh/adaptive
 使用方便，设计图的1px对应0.01rem,设计图的字体大小24px对应0.24rem,就是如此简单！

-----------------------------------------------

demo2资源链接：

https://github.com/Vibing/adaptive
布局中使用`rem`作为单位。
举例：某UI设计出来的手机页面宽为`750px`，那么分成十份后为`75px`，此时`html`标签的`font-size: 75px`,布局时某一模块在设计稿上宽为`100px`，转成`rem`则为：`100 / 75 = 1.3333rem`;在css中则为：`width: 1.3333rem`。
demo2 XXX还存在问题不要使用这个来实现mobile


注：两个demo都没有处理到iPad等大于iPhone6以上的设备！！！！！

