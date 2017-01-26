---
layout: post
title:  "webkit 解析 webpage 的生命周期"
date:   2016-12-30 10:59:45 +0800
categories: webkit performance
---

## webkit 简介
&nbsp;&nbsp;&nbsp;&nbsp;首发于2003年的safari浏览器。WebKit的代码源自1998年所开发的KDE的HTML排版引擎KHTML及KDE的JavaScript引擎KJS的代码， 当时webkit仅为`khtml`与`kjs`的一个fork版本，将他们重新命名为 WebCore 及 JavaScriptCore。 之后因为各平台需要发展出不同的分支，像chromium，qtwebkit等   

## webkit组成部分
见下图：    

![webkit](/asset/img/webkit-diagram.png)

1. browser UI比如浏览器的书签栏搜索栏等    
2. webkit Embedding API是webkit嵌入的api接口，browser UI通过webkit Embedding API与webpage进行交互。    
3. webcore 负责webpage的资源的调度加载， 解析， cssobject model构建， dom解析与构建， 事件处理等    
4. jacascriptCore 包括垃圾回收与解释器（将js语法转为二进制机器码）    
5. platformAPI是提供与底层驱动的交互， 如网络， 字体渲染， 影音文件解码等， 渲染引擎（webkit将所有的render都交给platform处理， 值得一提的是不同的浏览器会选择不同的渲染引擎， 想chrome为了保持不同平台尽可能的一致，采用的是skia， 而安卓是完全交给android stack来处理的，这也是为什么不同款的安卓机展示的出的ui有些是不同的）

## webkit工作流程
具体流程见下图：    

![webkit work process](/asset/img/webkit-work-process.png)   

webkit的资源加载器对加载到的html，css，js分别解析。 后经过layout渲染出render tree， 经过绘制（paint），合成(composite) 最终输出到浏览器上，
我们简单对下面代码进行解析：   

index.html

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link href="style.css" rel="stylesheet">
    <title>Critical Path</title>
  </head>
  <body>
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg"></div>
  </body>
</html>
```
style.css

```css
body { font-size: 16px }
p { font-weight: bold }
span { color: red }
p span { display: none }
img { float: right }
```
### htmlParser解析构建dom tree
dom解析需要经过以下步骤
1. 转换：浏览器从磁盘或网络读取 HTML 的原始字节，然后根据指定的文件编码格式（例如 UTF-8）将其转换为相应字符。
2. 符号化：浏览器将字符串转换为 W3C HTML5 标准 指定的各种符号 - 比如 ""、"" 及其他「尖括号」内的字符串。每个符号都有特殊含义并一套规则。
3. 词法分析：发射的符号转换为「对象」，定义它们的属性与规则。
4. DOM 构建：最后，因为 HTML 标记定义不同标签间的相互关系（某些标签嵌套在其他标签中），所以创建的对象在树状数据结构中互相链接，树状数据结构还捕获原始标记中定义的父子关系：比如 HTML 对象是 body 对象的父对象，body 是 paragraph 对象的父对象等等。

![dom construction](/asset/img/webkit-work-dom.png)

### cssParse解析成cssOM(树状结构)
与构建dom经过相同的步骤， 结果如下  

![dom construction](/asset/img/webkit-work-cssom.png)

### 经过layout/reflow构建出render tree
大致步骤如下： 
1. 从 DOM 树的根节点开始，遍历每个可见的节点。
2. 某些节点完全不可见（例如 script 标签、meta 标签等），因为它们不会在渲染结果中反映，所以会被忽略。
3. 某些节点通过 CSS 隐藏，因此在渲染树中也会被忽略。比方说，上面例子中的 span 节点，因为该节点有一条显式规则设置了 display:none 属性，所以不会出现在渲染树中。
4. 给每个可见节点找到相应匹配的 CSSOM 规则，并应用这些规则。
5. 发射可见节点，连带其内容及计算的样式。

构建过程如下：  

![dom construction](/asset/img/webkit-work-rendertree.png)
## compsoite硬件加速
to be continue

## 关于 60fps
to be continue





