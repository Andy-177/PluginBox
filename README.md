# PluginBox
PluginBox允许你在浏览器网页上允许js插件，只要你打开浏览器控制台，输入插件管理器代码即可在网页中使用
# 使用教程
打开浏览器控制台，这里我用edge浏览器做示范，其他浏览器通常按f12就可以打开，在控制台里面你会看到欢迎、元素、控制台，这里选择控制台。

复制插件代码，第一次在控制台粘贴时要求你输入“允许复制”，输入“允许复制”后粘贴代码，粘贴完PluginBox的代码就可以在浏览器里使用了。
# 快捷键
通过快捷键，可以快速使用PluginBox的一些功能，快捷键对应的功能如下表
| 快捷键 | 功能 |
| ----- | ----- |
| insert | 打开插件菜单/锁定插件按钮 |
| esc | 退出插件菜单 |
| Alt+M | 开启/锁定插件按钮移动 |
| Alt+R | 重置插件位置 |
# 插件开发
## manifest
manifest在代码的开头，是一段json文本，用于告诉PluginBox你插件的相关信息，manifest格式如下：
```
"manifest": {
    "name": "PluginName",
    "packname": "xxx.xxx.xxx",
    "description": "xxxxxxxxxxxxxxxxx",
    "lib": ["xxx.xxx.xxx","aaa.bbb.ccc"],
    "incompatible": ["axb.bxc.cxd","axx,bxx,cxx"]
}
```
其中manifest表明你是这个描述文件，确保它不会被加载到PluginBox里

neme就是你插件的名字，这个必须填

packname是你插件的包名，命名时要是xxx.xxx.xxx，当然这个数量还可以更多，比如xxx.xxx.xxx.xxx，但是不可以少于三个，这个也是必填

description是插件的描述，可以不写

lib是插件的依赖，如果你的插件需要依赖其他插件则在[]里面加入这个插件的包名，如`"lib":["xxx.xxx.xxx","xxx.xxx.abc"]"

如果你的插件与别的插件有冲突，则把插件的包名加入incompatible，填写形式和lib差不多
## api
### Window的创建与winboxAPI
plugin支持winboxAPI，这意味着你无需使用复杂代码就可以创建属于你创建的窗口。

由于未知原因，winboxAPI无法初始化，所以请用下面的方法创建窗口
```
// 更可靠的方式是通过实例创建
const myWindow = window.PluginSystem.instance.createWinbox('我的窗口标题');
```
这样子可以稳定创建窗口，但是使用的是pluginAPI，但不论是WinboxAPI还是PluginAPI，其效果是一样的
### pluginAPI
pluginAPI是pluginbox提供的api，可以让插件的功能更加强大

在插件系统中，PluginAPI 是插件运行时可以访问的接口集合，提供了插件与主系统交互的各种能力。以下是核心 PluginAPI 功能的分类介绍：

##### 1. DOM 操作 API
用于操作页面元素，实现插件对页面的修改能力：
```
// 选择元素
api.querySelector(selector);       // 类似 document.querySelector
api.querySelectorAll(selector);    // 类似 document.querySelectorAll
api.getElementById(id);            // 类似 document.getElementById

// 创建元素
api.createElement(tag);            // 创建指定标签的DOM元素

// 修改内容
api.setInnerHTML(selector, html);  // 设置元素的innerHTML
api.setTextContent(selector, text);// 设置元素的文本内容
api.appendChild(parentSelector, child); // 向父元素添加子节点
```
##### 2. 样式操作 API
用于动态添加或修改页面样式：
```
// 添加CSS样式
const styleElement = api.addStyle(`
  .custom-class {
    color: red;
    font-size: 16px;
  }
`);
// 返回创建的<style>元素，可用于后续移除
```
##### 3. 事件监听 API
用于为页面元素绑定事件：
```
// 为元素添加事件监听
api.addEventListener(selector, eventName, handler);
// 示例：为所有按钮添加点击事件
api.addEventListener('button', 'click', (e) => {
  console.log('按钮被点击了', e.target);
});
```
##### 4. 存储管理 API
用于插件数据的本地存储（基于 localStorage，自动添加插件前缀避免冲突）：
```
// 存储数据
api.setStorage('userConfig', { theme: 'dark', size: 'large' });

// 获取数据
const config = api.getStorage('userConfig');

// 存储的数据会自动以 "plugin_xxx" 为键名，避免与其他存储冲突
```
##### 5. 通知提示 API
用于向用户显示通知消息：
```
// 显示不同类型的通知（默认3秒后自动消失）
api.notify('操作成功', 'success');   // 成功通知（绿色）
api.notify('发生错误', 'error');     // 错误通知（红色）
api.notify('请注意', 'warning');     // 警告通知（橙色）
api.notify('普通信息');               // 普通通知（蓝色，默认类型）
```
##### 6. 窗口系统 API
用于创建和管理独立窗口（插件系统内置的窗口功能）：
```
// 创建新窗口（x, y 为窗口初始位置坐标）
const win = api.createWindow('我的窗口', 100, 200);

// 操作窗口内容
win.setContent('<p>窗口内容</p>');    // 设置窗口内容
win.appendContent('<p>追加内容</p>'); // 追加窗口内容

// 调整窗口样式
win.setStyle({ width: '400px', height: '300px' });

// 显示/隐藏窗口
api.toggleWindow(win.id);

// 关闭窗口
api.closeWindow(win.id);
```
##### 7. 插件系统交互 API
用于获取系统信息或控制插件系统本身：
```
// 获取已安装的插件列表
const plugins = api.getInstalledPlugins();
// 返回格式：[{ name: '插件名', packname: '唯一标识', description: '描述' }, ...]

// 控制拼图按钮拖动
api.toggleButtonDrag();    // 切换按钮拖动模式
api.unlockButtonDrag();    // 解锁按钮拖动
api.lockButtonDrag();      // 锁定按钮拖动
api.resetButtonPosition(); // 重置按钮到初始位置
```
### PluginSystem
PluginSystem 是一个完整的插件管理系统，允许在网页中动态安装、管理和运行插件，为页面扩展功能提供了标准化的框架。以下是其核心特点和组成部分的详细介绍：
#### 核心功能
##### 1.插件生命周期管理
- 支持插件的安装（通过代码或文件上传）、启用 / 禁用、删除和存储
- 所有插件数据保存在 localStorage 中，页面刷新后仍可恢复
##### 2.交互界面
- 提供可视化的插件管理面板（通过左上角紫色拼图按钮打开）
- 支持窗口系统（Winbox），允许插件创建独立的交互窗口
##### 3.扩展性
- 插件可通过 API 操作 DOM、添加样式、存储数据和创建窗口
- 支持插件依赖管理和冲突检测
#### 主要组成部分
##### 核心类（PluginSystem）
是系统的核心控制器，负责：
- 初始化系统（加载样式、创建 DOM、绑定事件）
- 管理插件生命周期（安装、运行、卸载）
- 提供窗口管理、按钮控制等核心功能
##### UI 组
- 拼图按钮：页面左上角的紫色按钮，用于打开插件管理面板，支持拖拽和位置重置
- 插件管理面板：展示已安装插件，提供添加 / 删除 / 启用插件的功能
- 窗口系统（Winbox）：插件可创建的浮动窗口，支持拖拽、 resize 和关闭
#### 示例：
由于手机没有键盘，无法像PC一样通过快捷键来开启或关闭插件按钮的移动，那么我们可以通过pluginbox里的pluginbutton来开启、关闭插件管理器按钮的位置以及重置插件管理器的位置。
```
PluginSystem.pluginbutton.move.lock();  // 固定插件按钮
PluginSystem.pluginbutton.move.unlock();  // 允许插件按钮移动
PluginSystem.pluginbutton.move.reset();  // 重置插件按钮位置
```
