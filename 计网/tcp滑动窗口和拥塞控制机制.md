## TCP 为什么能可靠传输

### 校验和

计算方式：在数据传输的过程中，将发送的数据段都当做一个 16 位的整数，将这些整数加起来，并且前面的进位不能丢弃，补在后面，最后取反，得到校验和。

发送方：在发送数据之前计算校验和，并进行校验和的填充

接收方：收到数据后，对数据以同样的方式进行计算，求出校验和，与发送方的进行对比

**注意**：如果接收方计算得出的校验和和发送方的校验和不一致，那么说明数据一定传输有误，但是如果两者一致，数据不一定传输成功

### 确认应答 + 序列号

序列号：TCP 传输时将每个字节的数据都进行了编号，这就是序列号

确认应答：TCP 传输过程中，每次接收方收到数据后，都会像发送方进行确认应答，也就是发送 ACK 报文。这个ACK 报文当中带有对应的确认序列号，告诉发送方接收到了哪些数据，下一次数据要从哪里开始发送。

序列号的作用不仅仅是应答作用，有了序列号能够将接收到的数据根据序列号进行排序，并且去掉重复序列号的数据。这也是 TCP 保证可靠的原因之一。

### 超时重传

在进行 TCP 传输时，由于确认应答与序列号机制，因此发送方发送一部分数据后，都会等待接收方返回一个 ACK 的报文，并解析，判断数据是否传输成功。

发送方没有接收到响应的 ACK 报文的原因可能有两点：

1. 数据在传输过程中由于网络原因等直接全体丢包，接收方没有接收到
2. 接收方接收到了响应的数据，但是返回的 ACK 报文却犹豫网络原因丢包了

TCP 在解决这个问题的时候引入了一个新的机制：【超时重传】。简单理解就是发送方在发送完数据之后等待一段时间，如果在这段时间内还没有接收到接收方返回的 ACK 应答，那么就对刚刚发送的数据进行重新发送。**如果是因为接收方没有接收到，接收方会在接收到重传的数据后发送一个 ACK 的应答，如果是接收方发送的 ACK 报文丢失了，那么对于重传的数据，接收方会认为已存在，则直接丢弃，仍旧发送 ACK 应答。**

那么发送方发送完毕后**等待的时间是多少呢？**如果这个等待的时间过长，那么会影响TCP传输的整体效率，如果等待时间过短，又会导致频繁的发送重复的包。

注意：

超时以500ms（0.5秒）为一个单位进行控制，每次判定超时重发的超时时间都是500ms的整数倍。重发一次后，仍未响应，那么等待`2*500ms`的时间后，再次重传。等待`4*500ms`的时间继续重传。以一个指数的形式增长。累计到一定的重传次数，TCP就认为网络或者对端出现异常，强制关闭连接。

### 连接管理

三次握手和四次挥手

### 流量控制

**TCP 连接的每一方都有一个固定大小的缓冲空间**，TCP 的接收端**只允许发送端发送接收端能接纳的数据**。当接收方来不及处理发送的数据，就会提示发送方降低发送的速率，防止包的丢失。TCP 使用的流量控制协议是可变大小的滑动窗口协议

### 拥塞控制

当网络拥塞时，减少数据发送。

发送方有拥塞窗口，发送数据前比对接收方发过来的可以接收的窗口大小的值，取小。

算法：慢开始、拥塞控制、快重传、快恢复



## TCP 可靠传输的实现

### 滑动窗口的定义

TCP 的滑动窗口是以字节为单位的。【窗口】对应的一段是可以被连续发送的字节序列；【滑动】则是指这段 “允许发送的范围” 是可以随发送的过程而变化的。

滑动窗口的位置由窗口的前沿和后沿确定。发送窗口后沿的变化有两种可能：1. 不动（没有收到新的确认）2. 前移（收到了新的确认）。发送窗口的后沿不可能向后移动，因为不可能撤销已收到的确认。

**注意：**接收端只能对【按序】收到的数据中的最高序号进行确认，未按序收到的，仍然会保留在发送窗口中

### 滑动窗口的作用

是一种**流量控制**的方法，该协议允许发送方在停止等待确认前可以连续发送几个分组。由于发送方不必每发送一个分组就停下来等待确认，因此，该协议可以加速数据的传输。



<span style="color: red">以 A 向 B 发送为例</span>

A 的发送窗口表示：在没有收到 B 的确认的情况下，A可以连续把窗口内的数据都发送出去。凡是已经发送过的数据，在未收到确认之前都必须暂时保留，以便在超时重传时使用。同时，接收方会把自己可以接受的接收窗口数值放在 TCP 首部的窗口字段中，通过 ACK 来发送给对方，因此，发送方的发送窗口一定不能超过接收端接收窗口的数值。

TCP 提供**全双工**通信。TCP 允许通信双方的应用进程在任何时候都能发送数据，因此，TCP 连接的两端都设有发送缓存和接受缓存，用来临时存放双向通信的数据。在发送时，应用程序在把数据传送给 TCP 的缓存后，就可以做自己的事了，而 TCP 在合适的时候把数据发送出去。在接收时，TCP 把收到的数据放入缓存，上层的应用进程在合适的时候读取缓存中的数据。

滑动窗口和缓存有着一定的关系：发送窗口是发送缓存中的一部分，相似的，接收窗口是接收缓存中的一部分。当接收方确认收到数据后，发送窗口就会向右移动。窗口的两个边沿的相对运动增加或减小了窗口的大小。

以发送缓存为例，他用来暂存发送应用程序传送给发送方 TCP 准备发送的数据 和 TCP 已经发送出去的但未收到确认的数据。发送窗口通常只是发送缓存中的一部分，已被确认的数据应当从发送缓存中删除，因此，发送缓存和发送窗口的后沿是重合的。发送应用程序必须要控制写入发送缓存的速度，不能太快，否则发送缓存就会没有存放数据的空间。



## TCP 为什么要引入接受缓存这个数据结构

如果没有接受缓存的话，或者说只有一个缓存的话，为了保证接受的数据是按顺序传输的，所以，**如果位于 x 序号之后的序号分组先到达目的主机的运输层的话必然丢弃，这样的话将在重传上花费很大的开销**，所以一般如果有过大的序号达到接收端，那么会按照序号还存起来，等待之前的序号分组到达，然后一起交付给应用层。



## TCP 流量控制

流量控制：让发送方的发送速率适中，不要太快，要让接收方来得及接受。

【利用**滑动窗口的机制**就可以很方便的实现在 TCP 连接上对发送方的**流量控制**】

**主要过程**：接收方会通过 ACK 来告诉发送方自己的接收窗口的大小，并利用这个大小来控制发送方的数据发送。

**出现问题**：如果 B 已经告诉 A 自己的缓冲区已满，那么 A 将会停止发送。等过了一段时间后，接收端的缓存区出现了富余，于是就发送报文告诉 A 当前的接收窗口的大小。但如果这个报文丢失了，那么就开始出现 A 等待 B 收到发送的非零窗口的通知，而 B 也等待 A 发送数据的通知，这样的一个死锁情况。

**解决方案**：TCP 为每一个连接设有一个持续的计时器。只要 TCP 连接的一方收到对方的零窗口的通知，就会启动计时器。如果计时器设置的事件到期，发送方就会发送一个探测报文段，用于探测是否出现死锁现象，而接收方在确认这个探测报文段的时候给出了现在的接收窗口的值。这样，死锁的僵局就被打破了。

### TCP 传输效率

可以用不同的机制来控制 TCP 报文段的发送时机：

1. TCP 维持一个变量，他等于最大报文段长度 MSS，只要缓存中存放的数据达到 MSS 字节时，就组装成一个 TCP 报文段发送出去
2. 由发送方的应用进程指明要求发送的报文段
3. 发送方设置一个计时器，当计时器到期时，就把当前已有的缓存数据装入报文段发送出去



## TCP 的拥塞控制

拥塞控制：防止过多的数据注入网络中，这样可以使网络中的路由器或链路不过载。

拥塞控制所要做的前提是：网络能够承受现有的网络负荷。

### 与流量控制的区别

- 拥塞控制是一个**全局**的过程，涉及到所有的主机、所有的路由器，以及与降低网络传输性能有关的所有因素

- 流量控制往往是指点对点通信量的控制，是个**端到端**的问题
- 流量控制所要做的是抑制发送端发送数据的速率，以便使接收端来得及接收

### 开环控制和闭环控制

拥塞控制可以分为开环控制和闭环控制

#### 开环控制

在涉及网络时事先将有关发生拥塞的因素考虑周到，力求网络在工作时不产生拥塞

#### 闭环控制

闭环控制是基于反馈环路的概念

1. 监测网络系统以便检测到拥塞在何时、何处发生
2. 把拥塞发生的信息传送到可采取行动的地方
3. 调整网络系统的运行已解决出现的问题

### TCP 控制拥塞的方法

#### 慢开始和拥塞避免

基于窗口的拥塞控制，发送方维持一个叫做**拥塞窗口**的状态变量。拥塞窗口的大小取决于网络拥塞的程度，并且动态的在变化。**发送方让自己的发送窗口等于拥塞窗口。**

发送方控制拥塞窗口的原则：只要网络没有出现拥塞，拥塞窗口就可以再增大拥塞窗口的大小，以便把更多的分组发送出去，这样就可以提高网络的利用率。

发送方如何知道网络发生拥塞：当发送方没有按时收到应当到达的确认报文，也就是出现了超时，那么就可以猜想网络可能出现了拥塞。因此，**判断网络拥塞的依据是出现了超时**。

##### 慢开始

**算法**：当主机开始发送数据时，由于并不清楚网络的负荷情况，所以如果立即把大量数据字节注入到网络，那么就有可能引起网络发生拥塞。因此，慢开始选择由小到大逐渐增大发送窗口的数值。

一开始，发送方先设置拥塞窗口 cwnd 为 1，在后面的传输轮次中，发送方每收到一个对新报文段的确认，就会使发送方的拥塞窗口加 1 ，使 cwnd 由 1 变为 2，由此类推，在每个传输轮次中，拥塞窗口的值就会加倍。

为了防止拥塞窗口 cwnd 增长过大引起网络拥塞，还需要设置一个【慢开始门限 ssthresh】：

- 当 cwnd < ssthresh 时，使用慢开始算法
- 当 cwnd > ssthresh 时，停止使用慢开始算法，改为使用拥塞避免算法
- 当 cwnd < ssthresh 时，既可以使用慢开始，也可以使用拥塞算法

##### 拥塞避免

**算法**：让拥塞窗口 cwnd 缓慢增大，即每经过一个传输轮次就把发送方的拥塞窗口 cwnd + 1，而不是像 慢开始那样加倍增长。

拥塞避免并非完全能够避免拥塞，只是说把拥塞窗口控制为按线性规律增长，使网络比较不容易出现拥塞。

<span style="color: red">慢开始和拥塞控制常常作为一个整体使用，而快重传和快恢复则是为了减少因为拥塞导致的数据包丢失带来的重传时间</span>

#### 快重传

让发送方尽早知道发生了被个别报文段的丢失。

快重传首先要求接收方在接收到一个数据后就立即发送确认，即使是收到了失序的报文段。

一旦发送方接收到三个一样的确认，那么就认为是出现了报文段的丢失，从返回的确认报文中的值丢失的那一个报文段，立即重传该包。

#### 快恢复

1. sshresh（慢开始门限）= cwnd / 2
2. cwnd = sshresh