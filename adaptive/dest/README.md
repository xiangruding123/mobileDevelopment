


## 把视觉稿中的px转换成rem

首先，目前视觉稿大小分为`640`，`750`以及，`1125`这三种。

当前方案会把这3类视觉稿分成`100份`来看待（为了以后兼容vh，vw单位）。每一份被称为一个单位a。同时，1rem单位认定为10a。

拿750的视觉稿举例：

    1a = 7.5px
    1rem = 75px0

因此，对于视觉稿上的元素的尺寸换算，只需要`原始px值`除以`rem基准px值`即可。

例如240px * 120px的元素，最后转换为3.2rem * 1.6rem。




## 字体不使用rem的方法

字体的大小不推荐用rem作为单位。所以对于字体的设置，仍旧使用px作为单位，并配合用`data-dpr`属性来区分不同dpr下的的大小。

例如：

    div {
        width: 1rem; 
        height: 0.4rem;
        font-size: 12px; // 默认写上dpr为1的fontSize
    }
    
    [data-dpr="2"] div {
        font-size: 24px;
    }

    [data-dpr="3"] div {
        font-size: 36px;
    }




### 手动配置dpr

引入执行js之前，可以通过输出meta标签方式来手动设置dpr。语法如下：

    <meta name="flexible" content="initial-dpr=2,maximum-dpr=3" />

其中`initial-dpr`会把dpr强制设置为给定的值，`maximum-dpr`会比较系统的dpr和给定的dpr，取最小值。**注意：这两个参数只能选其一。**

### 手动设置rem基准值的方法

输出如下css样式即可：

    html {font-size: 60px!important;}

### 一些常用APIs

**[Number] lib.flexible.dpr**

当前页面的dpr值

**[Number] lib.flexible.rem** 

当前页面的rem基准值

**[Number|String] lib.flexible.rem2px([Number|String digital])**

把rem转换为px

**[Number|String] lib.flexible.px2rem([Number|String digital])** 

把px转换为rem

**lib.flexible.refreshRem()** 

刷新当前页面的rem基准值

## 栅格系统

### 需引入makegrid.js
   
    <script src="http://g.tbcdn.cn/mtb/lib-flexible/{{version}}/makegrid.js"></script>

### 使用方法

    lib.flexible.makeGrid(params)

- [Object params]
    - designWidth - 设计稿宽度
    - designUnit - 设计稿最小单位a（以px为单位）
    - columnCount - 栅格列数
    - columnXUnit - 栅格列宽（以a为单位）
    - gutterXUnit - 栅格间距（以a为单位）
    - edgeXUnit - 页面左右边距（以a为单位）
    - className - 栅格样式的名称（可省略，默认为grid）

通过传入视觉的栅格规范定义，可以输出对应的css样式。

    lib.flexible.makeGridMode(modeName)

- [String modeName]

方案还预置了几个默认的栅格规范，分别是`750-12`，`750-6`，`640-12`，`640-6`。

### 利用meta输出栅格样式

    <meta content="designWidth=750, desginUnit=6, columnCount=12, columnXUnit=7, gutterXUnit=3, edgeXUnit=4" name="grid" />

或

    <meta content="modeName=750-12" name="grid" />

### 栅格代码举例

    <div class="grid">
        <div class="col-4"></div>
        <div class="col-4"></div>
        <div class="col-4"></div>
    </div>

    <div class="grid">
        <div class="col-6"></div>
        <div class="col-6"></div>
    </div>

    <div class="grid">
        <div class="col-3"></div>
        <div class="col-4"></div>
        <div class="col-5"></div>
    </div>

