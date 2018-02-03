### 关于rem的使用-定局


移动端实现采用hotcss2.js或者rem.js文件来实现，
他们的实现需要注意的点就是设计稿要是750px的，不过可以根据你的设计稿修改js文件得到你想要的js。

-------------------
hotcss2.js和hotcss.js文件的区别是：

hotcss.js是原版文件。
hotcss2.js是修改为750设计稿了的文件，你可根据你自己的需求更改即可！

--------------------
hotcss.js 文件的使用方法请参考：http://blog.csdn.net/jill6693484/article/details/53445192
hotcss2.js 文件的使用方法：
```
	直接在head中引入hotcss2.js！
	
	<!--
	    根据页面渲染机制，`hotcss2.js`必须在其他JS加载前加载，万不可异步加载。
	
	    如果可以，你应将`hotcss2.js`的内容以内嵌的方式写到`<head>`标签里面进行加载，并且保证在其他js文件之前。
	
	    为了避免不必要的bug，请将CSS放到该JS之前加载。
    -->
    <link rel="stylesheet" href="./css/style.css">
    <script src="../hotcss2.js"></script>
    
```

-----------------

hotcss.js的方案就考虑到了dpr值的影响,他们的CSS是用sass实时去编译计算的,
宽高这么写width:px2rem(182);height:px2rem(53);
下边这个函数就是用来解决这个算法的.
```
@function px2rem( $px ){
   @return $px*320/$designWidth/20 + rem;
}
```


这里对hotcss.js稍微做了修改,因为老去写px2rem()这个方法烦的很,所以这里把里边计算根元素字体大小这句改成如下
```
document.documentElement.style.fontSize = ( innerWidth*100/750 ) + 'px'; //设计尺寸750 根元素为100px  便于计算
```
这样做的原因如下,我的设计稿一直都是750px,在这个尺寸下我将根元素字体大小设置成100px,这样我设计稿上的元素高是98px的时候,我直接设置成0.98rem;这样简单的计算一下,速度很快,也不会去写px2rem()这个方法;

如果写个简单活动页面,也可以不用sass 老去监听编译,测试也麻烦.直接口算简单易用.
如果你的设计稿是720,这句话应该为：
```
document.documentElement.style.fontSize = ( innerWidth*100/720 ) + 'px';
```

--------------------------------------------------
--------------------------------------------------

那么关于rem.js的话和hotcss2.js是一样的， 这里的750px设计稿的px转换成rem也是除以100即可！




