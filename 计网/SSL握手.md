http://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html

https://qwert.blog.csdn.net/article/details/105509254

https://juejin.cn/post/6844903543539761166#heading-0



#### HTTPS = HTTP + SSL

HTTPS在内容传输的加密上使用的是对称加密，非对称加密只作用在证书验证阶段。因为非对称加密的加解密效率是非常低的。

三次握手是传输层的概念，目前使用的HTTP/HTTPS协议是基于TCP协议之上的，因此也需要三次握手。要在TCP三次握手建立连接之后，才会进行SSL握手的过程（即**身份认证**和**密钥协商**的过程）

TCP三次握手是确保建立连接，保证双方准备好通信

SSL的目的是加密通信的上层数据

#### SSL协议的握手过程

1. 客户端给出支持SSL协议**版本号**，一个客户端**随机数**（Client random），客户端支持的的**加密方法**等
2. 服务端收到消息后，确认双方使用的**加密方法**，并返回**数字证书**，一个服务器生成的**随机数**（Server random）等信息
3. 客户端**确认**数字证书的有效性，然后生成一个新的**随机数**（Premaster secret），然后使用数字证书中的**公钥**，加密这个随机数，发给服务端
4. 服务端使用自己的**私钥**，获得客户端发来的**随机数字**（即Premaster secret）
5. 客户端和服务端通过约定的**加密方法**（通常是AES算法），**使用前面三个随机数，生成“对话密钥**”（session key），用来加密接下来的整个对话过程。

![image-20210405163935566](C:\Users\qq\AppData\Roaming\Typora\typora-user-images\image-20210405163935566.png)

注意：“之后的通信都用这个对话秘钥进行加密”---------------->“之后的通信” 是指本次的接口调用，而不是所有接口！！！！！
     https 不会缓存当次的会话密钥给其他接口用，每次调用一个 Https 接口，都需要重新走上面的过程。



第四次握手：服务器的最后回应（有点看不懂）

https://blog.csdn.net/LVXIANGAN/article/details/42145777