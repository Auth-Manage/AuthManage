# TopFullStack

(nestjs)NodeJs+VueJs全栈开发《全栈之巅》视频网站+app+小程序——学习

### 项目启动注意

admin项目：要创建空的.env文件,要不然请求报错
server项目：也要创建.env文件,内容在.env.example中

### 笔记

创建项目：nest new server
创建子项目：nest g app admin
启动子项目：nest start -w admin
创建模块：nest g lib db
创建module：nest g mo -p admin users
创建controller：nest g co -p admin users
创建service：nest g s -p admin users

@typegoose/typegoose：基于typescript的封装，可以增强提示
很多npm的包，都有一个@types/xx包，用于增强提示

nestjs-mongoose-crud：自动生成crud,前端查询时，可以提供分页查询。
[链接](https://github.com/topfullstack/nestjs-mongoose-crud)
`/users?query={"where":{"username":"user1","age":{"$gt":18}},"sort":"-_id","limit":10,"page":2,"populate":"friends"}`

`@Crud`使用时,`constructor`引入格式：`@InjectModel(XX) private readonly model`,名称一定是`model`


@nestjs/config 配置环境变量所需要的包

web项目：nuxt自定义本地端口，在package.json中添加`"config": { "nuxt": { "host": "127.0.0.1", "port": "7000" } }`

'!' 和 '?'：是typescript的语法，！表示强制解析，一定有值。？表示可选

`schema.virtual('title', {//定义虚拟字段
    ref: 'Title',// 关联的模型
    localField: '_id',// 内键,schema对应的模型的_id
    foreignField: 'question',//外键,关联模型的字段
    justOne: false  // 只查询一条数据
})`

### 问题
`[ CastError: Cast to ObjectId failed for value "users" at path "_id" for model
 "User"]`：