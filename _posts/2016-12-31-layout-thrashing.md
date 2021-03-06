---
layout: post
title:  "DOM批量处理与 layout thrashing"
date:   2017-1-10 10:59:45 +0800
categories: webkit performance
---

## 关于layout thrashing
&nbsp;&nbsp;&nbsp;&nbsp;当对dom节点一些布局属性发生改变时，往往会导致浏览器布局的重绘，重绘简单的说就是cpu将整个 `render tree `按照像素点计算一遍并显示在浏览器上。 浏览器内核为了尽可能的避免重绘，采取了一种`lazy load`的方式，当对dom节点布局属性发生写的操作时浏览器会等待直到当前的操作结束，才会触发布局重绘，但是如果当前运行帧中调用dom布局属性的写入后并重新读取， dom会强制同步更新(`forced synchonous layout`)以便dom布局属性的正常读取。这种dom的批量就会导致layout thrashing的产生


看下面这个例子：

```js  
    var iWidth = oElement.clientWith;
    oElement.style.width = iWidth + 100 + 'px';
    var iWidth1 = oElement1.clientWith;
    oElement1.style.width = iWidth1 + 100 + 'px';
```   
当 `oElement.style.width = iWidth + 100 + 'px';`时，浏览器缓存更新并等待当前帧运行结束， 这时又发生了一次dom布局属性的读取，浏览器会触发同步强制更新layout，之后在执行对dom的读取，这种更新如果批量进行在比较现代的浏览器上的体验不是很明显但是在移动端与一些老旧的浏览器上消耗的性能还是很明显的

## 以下列举了会导致layout thrashing的dom属性

```    
1. clientHeight             11. offsetParent
2. clientLeft               12. offsetTop
3. clientTop                13. offsetWidth
4. clientWidth              14. outText
5. focus()                  15. scrollByLines()
6. getBoundingClientRect()  16. scrollPages()
7. getClientRects()         17. scrollHeight
8. innerText                18. scrollIntoView
9. offsetHeight             19. scrollIntoViewIfNeeded()
10. offsetLeft              20. scrollLeft

21 scrollTop
22 scrollWidth
```
## 解决方案

### 调整dom执行顺序
以上例来说，我们只需要改成就可以了

```js   
    var iWidth = oElement.clientWith;
    var iWidth1 = oElement1.clientWith;
    oElement.style.width = iWidth + 100 + 'px';
    oElement1.style.width = iWidth1 + 100 + 'px';
```   
以上方法浏览器会等待js执行结束并批量更新。  
&nbsp;&nbsp;&nbsp;&nbsp;但是实际业务中，我们为了业务的需要会将代码尽量解耦，如果我们按照这个方案处理的话，我们就需要调整代码执行顺序， 导致代码的混乱不堪。这个时候我们就需要raf(`requestAnimationFrame`)来解决这个问题：

### raf 解决方案
&nbsp;&nbsp;&nbsp;&nbsp;`requestAnimationFrame` 是通过将所有的dom操作放到下一帧去处理  

```js   
    var iWidth = oElement.clientWith;
    requestAnimationFrame(function() {
      oElement.style.width = iWidth + 100 + 'px';
    });
    var iWidth1 =oElement1.clientWith;
    requestAnimationFrame(function() {
      oElement1.style.width = iWidth1 + 100 + 'px';
    });
```    
如果需要调整dom的执行顺序可以通过 **事件回调** 的方式去处理。

## 参考资料(可能需要翻墙)
1. [避免大规模、复杂的布局](https://developers.google.cn/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing?hl=zh-cn)

> 业界现在比较流行的框架像 [react](https://facebook.github.io/react/) 等都对这种dom批量插入做了非常好的处理，专注于dom批量处理的库可以采用 [fastdom](https://github.com/wilsonpage/fastdom) 的方式



