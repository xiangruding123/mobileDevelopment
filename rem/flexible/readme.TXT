lib-flexible的github链接

文章参考自:GitHub账户amfe:地址如下：
https://github.com/amfe/lib-flexible


taobao单位文件中都是相关的flexible的文件； 
flexible.css是重置样式的样式汇总，
makegrid.js文件看情况是否需要，这里暂时不说他的作用，有需要可以自己去网上查询相关资料。


flexible.js才是关键性的文件，这是px转换为rem的关键文件，在html文件中一定需要引入的。

转换关系：

750px的设计稿：  那么页面元素的相应像素转换公式是： 将页面的像素/75即可：


例如有个页面元素的像素为150px 那么他的对应的rem为150/75=2rem; 你在写代码的时候就只需要使用2rem 作为单位即可。 
除了字体大小使用px做单位之外，其他的元素都采用rem来做单位，原因就是： iPhone以下的设备看字体会变得很小， 而在iPhone6plus的设备上看到的字体会变得很大。







