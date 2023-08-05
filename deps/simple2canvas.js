!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.simple2canvas=e():t.simple2canvas=e()}(window,(function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e,n){const r=n(1);e.parseFont=r,e.createCanvas=function(t,e){return Object.assign(document.createElement("canvas"),{width:t,height:e})},e.createImageData=function(t,e,n){switch(arguments.length){case 0:return new ImageData;case 1:return new ImageData(t);case 2:return new ImageData(t,e);default:return new ImageData(t,e,n)}},e.loadImage=function(t,e){return new Promise((function(n,r){const o=Object.assign(document.createElement("img"),e);function i(){o.onload=null,o.onerror=null}o.onload=function(){i(),n(o)},o.onerror=function(){i(),r(new Error('Failed to load the image "'+t+'"'))},o.src=t}))}},function(t,e,n){"use strict";const r="'([^']+)'|\"([^\"]+)\"|[\\w\\s-]+",o=new RegExp("(bold|bolder|lighter|[1-9]00) +","i"),i=new RegExp("(italic|oblique) +","i"),a=new RegExp("(small-caps) +","i"),c=new RegExp("(ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded) +","i"),u=new RegExp(`([\\d\\.]+)(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q) *((?:${r})( *, *(?:${r}))*)`),l={};t.exports=t=>{if(l[t])return l[t];const e=u.exec(t);if(!e)return;const n={weight:"normal",style:"normal",stretch:"normal",variant:"normal",size:parseFloat(e[1]),unit:e[2],family:e[3].replace(/["']/g,"").replace(/ *, */g,",")};let r,f,s,h;const p=t.substring(0,e.index);switch((r=o.exec(p))&&(n.weight=r[1]),(f=i.exec(p))&&(n.style=f[1]),(s=a.exec(p))&&(n.variant=s[1]),(h=c.exec(p))&&(n.stretch=h[1]),n.unit){case"pt":n.size/=.75;break;case"pc":n.size*=16;break;case"in":n.size*=96;break;case"cm":n.size*=96/2.54;break;case"mm":n.size*=96/25.4;break;case"%":break;case"em":case"rem":n.size*=16/.75;break;case"q":n.size*=96/25.4/4}return l[t]=n}},function(t,e,n){"use strict";n.r(e);var r=function(){function t(t,e){}var e=t.prototype;return e.rect=function(){},e.image=function(){},e.text=function(){},e.wrapText=function(){},t}();function o(t,e){return(o=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t})(t,e)}var i=function(t){var e,n;function r(e,n,r){var o,i=r.rate;o=t.call(this,e,n)||this;var a=document.createElement("canvas");return a.width=e,a.height=n,o.rate=i,o.canvas=a,o.ctx=a.getContext("2d"),o}n=t,(e=r).prototype=Object.create(n.prototype),e.prototype.constructor=e,o(e,n);var i=r.prototype;return i.rect=function(t){var e=this,n=t.top,r=t.left,o=t.width,i=t.height,a=t.fill,c=t.round,u=[r,n,o,i,c].map((function(t){return t*e.rate}));r=u[0],n=u[1],o=u[2],i=u[3],c=u[4];var l=this.ctx;return l.save(),l.fillStyle=a,c?(o<2*c&&(c=o/2),i<2*c&&(c=i/2),l.beginPath(),l.moveTo(r+c,n),l.arcTo(r+o,n,r+o,n+i,c),l.arcTo(r+o,n+i,r,n+i,c),l.arcTo(r,n+i,r,n,c),l.arcTo(r,n,r+o,n,c),l.closePath(),l.fill()):l.fillRect(r,n,o,i),l.restore(),Promise.resolve(this)},i.image=function(t){var e=this,n=t.url,r=t.top,o=t.left,i=t.width,a=t.height,c=[o,r,i,a].map((function(t){return t*e.rate}));o=c[0],r=c[1],i=c[2],a=c[3];var u=this.ctx;return new Promise((function(t,e){u.save();var c=document.createElement("img");c.crossOrigin="*",c.onload=function(){i||a?i?a||(a=c.height/c.widht*i):i=c.width/c.height*a:(i=c.width,a=c.height),u.drawImage(c,o,r,i,a),c.parentNode.removeChild(c),t()},c.onerror=e,c.src=n,document.body.appendChild(c)}))},i.text=function(t){var e=this,n=t.text,r=t.top,o=t.left,i=t.fontSize,a=t.lineHeight,c=t.color,u=t.textAlign,l=t.fontFamily,f=t.fontWeight,s=t.width,h=this.ctx,p=[r,o,i,a,s].filter((function(t){return"number"==typeof t})).map((function(t){return t*e.rate}));return r=p[0],o=p[1],i=p[2],a=p[3],s=p[4],h.save(),h.font=[f,i?i+"px":"",l||"Arial"].filter((function(t){return t})).join(" "),h.fillStyle=c,h.textAlign=u||"left",r=r+a-Math.max((a-i)/2,0),h.fillText(n,o,r,s),h.restore(),Promise.resolve(this)},i.wrapText=function(t){var e=this,n=t.text,r=t.top,o=t.left,i=t.fontSize,a=t.lineHeight,c=t.color,u=t.width,l=t.height,f=t.textAlign,s=t.fontFamily,h=t.fontWeight,p=this.ctx;p.save(),p.font=[h,i?i+"px":"",s||"Arial"].filter((function(t){return t})).join(" ");for(var d=n.split(""),m="",g=[],_=0;_<d.length;_++){var v=m+d[_];p.measureText(v).width>u&&_>0?(g.push({line:m,top:r,left:o}),m=d[_],r+=a):m=v}return g.push({line:m,top:r,left:o}),p.restore(),g.forEach((function(t,n){var r=t.line,o=t.top,p=t.left;l&&(n+1)*a>l||e.text({text:r,top:o,left:p,fontSize:i,lineHeight:a,color:c,width:u,textAlign:f,fontFamily:s,fontWeight:h})})),g},r}(r),a=n(0),c=n.n(a);function u(t,e){return(u=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t})(t,e)}var l=c.a.createCanvas,f=c.a.loadImage,s={html:i,node:function(t){var e,n;function r(e,n,r){var o,i=r.rate;o=t.call(this,e,n)||this;var a=l(e,n);return o.rate=i,o.canvas=a,o.ctx=a.getContext("2d"),o}return n=t,(e=r).prototype=Object.create(n.prototype),e.prototype.constructor=e,u(e,n),r.prototype.image=function(t){var e=this,n=t.url,r=t.top,o=t.left,i=t.width,a=t.height,c=[o,r,i,a].map((function(t){return t*e.rate}));o=c[0],r=c[1],i=c[2],a=c[3];var u=this.ctx;return new Promise((function(t,e){u.save(),f(n).then((function(t){u.drawImage(t,o,r,i,a),u.resolve()}))}))},r}(i)},h=function(t){return"number"==typeof t&&!isNaN(t)},p=function(t){return"function"==typeof t},d={getTextWidth:function(t,e){var n=t.fontWeight,r=t.fontFamily,o=t.fontSize,i=t.width,a=t.text,c=t.top,u=t.left,l=t.lineHeight;void 0===e&&(e="html");var f=(e=new(p(e)?e:s[e]||s.html)(1e4,1e4,{rate:1})).ctx;if(f.font=[n,o?o+"px":"",r||"Arial"].filter((function(t){return t})).join(" "),!i)return f.measureText(a);for(var h=a.split(""),d="",m=[],g=0;g<h.length;g++){var _=d+h[g];f.measureText(_).width>i&&g>0?(m.push({line:d,top:c,left:u}),d=h[g],c+=l):d=_}return m.push({line:d,top:c,left:u}),m},isNumber:h,isFunction:p,formatCoord:function(t,e){var n=t.top,r=t.left,o=t.width,i=t.height,a=t.right,c=t.bottom,u=e.width,l=e.height;return h(a)&&h(o)&&(r=u-o-a),h(c)&&h(i)&&(n=l-i-c),{top:n,left:r}}},m=["type","elements","top","left","right","bottom","width","height","__GROUP_POS__"];var g=d.isNumber,_=d.isFunction,v=d.formatCoord;function x(t){var e=t.width,n=t.height,r=t.rate,o=void 0===r?1:r,i=t.render,a=void 0===i?"html":i,c=t.elements,u=_(a)?a:s[a]||s.html;a=new u(e*o,n*o,{rate:o});for(var l=function(t){var e=c[t],n=e.type,r=e.elements,o=e.top,i=e.left,a=e.right,u=e.bottom,l=e.width,s=e.height,h=e.__GROUP_POS__,p=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(e,m);if("group"!==n||!Array.isArray(r)||!r.length)return f=t,"continue";if(p.__GROUP_POS__={top:o,left:i,right:a,bottom:u,width:l,height:s},h){var d=v(h,{width:l,height:s}),_=d.top,x=d.left;g(_)&&(p.__GROUP_POS__.top+=_),g(x)&&(p.__GROUP_POS__.left+=x)}c.splice.apply(c,[t,1].concat(r.map((function(e){for(var n in p)!e.hasOwnProperty(n)&&(e[n]=p[n]);return f=t,e})))),f=t-=1},f=0;f<c.length;f++)l(f);for(var h=0;h<c.length;h++){var p=c[h],d=v(p,{width:p.__GROUP_POS__&&p.__GROUP_POS__.width||e,height:p.__GROUP_POS__&&p.__GROUP_POS__.height||n}),x=d.top,y=d.left;if(g(x)&&(p.top=x),g(y)&&(p.left=y),delete p.right,delete p.bottom,p.__GROUP_POS__){var w=v(p.__GROUP_POS__,{width:e,height:n}),b=w.top,O=w.left;g(b)&&(p.top+=b),g(O)&&(p.left+=O),delete p.__GROUP_POS__}}return c.reduce((function(t,e){return t.then((function(){return _(e.type)?e.type.call(a,e):_(a[e.type])?a[e.type](e):Promise.resolve()}))}),Promise.resolve()).then((function(){return a.canvas}))}x.Render=r,x.Renders=s,x.utils=d;e.default=x}]).default}));