// 检查是否已注入插件系统
if (!window.pluginSystemInjected) {
    window.pluginSystemInjected = true;
    
    // 创建script标签引入插件系统核心代码
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('pluginSystem.js');
    script.onload = function() {
        // 脚本加载完成后可以执行初始化操作
        console.log('插件系统已注入');
        this.remove(); // 移除script标签
    };
    
    // 将script标签添加到页面
    (document.head || document.documentElement).appendChild(script);
}
    