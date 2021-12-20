![https://www.cnblogs.com/stulzq/p/9291237.html][参考]
#### 服务器
1. 先重置密码：大写 + 小写 + 数据
2. 用win scp远程连接服务器
3. 通过防火墙放开远程连接端口
#### 远程连接服务器
- win scp 连接端口号是22，不是3389
#### 安装jenkins
##### 先查看是否有安装java jdk环境
- `java -version`
##### 安装jdk环境
- `yum install java-1.8.0-openjdk* -y`
- -y 全自动安装
- 默认安装位置
- `/usr/lib/jvm`
- 安装过程可能会出现权限不够，需要root用户权限
###### Loaded plugins: fastestmirror, langpacks。You need to be root to perform this command.（你需要root用户才能执行这个命令。）

- `su` 然后 跳出 密码登录（在输入密码时是看不见密码的）
- ![image-20210929151502201](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210929151502201.png)
##### 安装jenkins
- `sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo`
- `sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key`
- `yum install jenkins`
- sudo是linux系统管理指令，是允许系统管理员让普通用户执行一些或者全部的root命令的一个工具，如halt，reboot，su等等。这样不仅减少了root用户的登录 和管理时间
- 启动 `service jenkins start` 或 `sudo systemctl start jenkins`  或 `sudo service jenkins start`
##### 配置jenkins
- 配置config目录 `vim /etc/sysconfig/jenkins`
- jenkins 下载目录 `/var/lib/jenkins`
- 配置端口号  `JENKINS_PORT="8080"`
- 此时防火墙没有开通8080这个端口，需要开放8080端口号

##### 输入ip+port 访问jenkins面板
- 第一次进入需要输入默认密码
- `cat /var/lib/jenkins/secrets/initialAdminPassword`
- 选择新手入门安装插件推荐
- 然后创建第一个管理员用户

###### 配置插件
- 打包vue项目需要nodejs,打包完成后需要通过ssh把打包好的文件上传到服务器上，所以需要先安装nodejs插件和publish over ssh插件
- 点击manage jenkins（系统管理）
- 点击manage plugins（插件管理）

###### 安装nodejs
- 在可选插件 输入nodejs，install without restart
- 然后回到manage jenkins 
- 点击global tool configuration（全局工具配置）
- 找到nodejs，新增nodejs
- 输入别名nodejs
- 在global npm packages to install 输入 yarn

###### 安装Publish Over SSH
- 安装过程一样
- 配置过程：
- 来到system configuration
- 找到Publish Over SSH
- 在SSH Servers
- 配置 Name：xxxxx HostName：服务器ip地址 UserName：xxxxx Remote Directory：/
- 点击test 
- 如果失败就要
- 点击高级 勾选Use password authentication, or use a different key
- 在Password 输入服务器登录密码
###### 配置流程和命令
- 点击新建item
- 输入项目名称
- freestyle object
- 源码管理
- 点击git
- 配置url
- 无法连接仓库：Error performing git command: git ls-remote -h https://github.com/Krega0129/vue-vuetify-ZJelectric.git HEAD
- 这是因为没有安装git 
-  输入指令`yum -y install git`
-  查看git安装路径 `whereis git`
-  然后去到global too configuration 去git下面path to executable 配置whereis git 返回的路径
-  之后刷新即可

###### returned status code 128:
stdout: 
stderr: remote: Support for password authentication was removed on August 13, 2021. Please use a personal access token instead.
- 因为没有配置SSH，去服务器创建一个ssh，然后去github配置
- ssh-keygen
- cat /root/.ssh/id_rsa.pub 拿到公钥,配置到github
- cat /root/.ssh/id_rsa 拿到私钥，配置到jenkins凭证
- [https://blog.csdn.net/tt75281920/article/details/105434989/]

#### nginx 
- [https://my.oschina.net/yueshengwujie/blog/3099219]

#### 无法连接仓库的情况：Error performing git command: git ls-remote -h
- 服务器没有安装git
- `yum -y install git`

#### remote: Support for password authentication was removed
- github不再支持使用密码，必须使用token
- token在github -> setting -> personal token generate 生成
- 在username password那里将密码 replace成token