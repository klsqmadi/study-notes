![网站](https://juejin.cn/post/6898630134530752520#heading-3)
#### cookie
https://github.com/mqyqingfeng/Blog/issues/157
- cookie的值
1. name=value
2. expires
3. max-age,max优先级更高
4. secure
5. domain
6. same-site：strict，lax，none
   1. strict：仅允许第一方发送cookie，即url相同
   2. lax：允许部分第三方发送cookie，链接，预加载，get表单会进行第三方发送cookie，AJax，post表单，image不会发送
   3. none：无论是否跨站都会携带cookie，不是跨域，
   4. 跨站的判断规则：只判断有效顶级域名+二级域名是否相同，eTLD+1，不会判断端口号和协议
7. path
8. http-only
- cookie判断是否同站通过eTLD+1来判断的，eTLD表示顶级域名，eTLD表示有效顶级域名+二级域名
#### session
#### token
##### token编码
##### refresh token
##### jwt，更好的编码方案
#### 单点登录
- 在A系统登录后，初次访问B系统，B系统是没有cookie。这时 B 系统重定向至SSO（SSO域是存有cookie的，登录A系统时存的），即带着SSO域的cookie访问SSO系统，它会判断登录状态，若还有效（在线），则重定向至B系统（带有一个code），然后B系统拿着这个code向SSO换取ticket，接着把ticket存放在B系统的cookie上。后续访问B系统就能这个ticket来验证了。
#### indexdb
#### cacheStorage