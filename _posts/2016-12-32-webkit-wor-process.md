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
going on

## 硬件加速
going on

## 关于 60fps
going on





