// 插件系统核心库 - 可在任何网页中引入使用
(function(window, document) {
    // 检查是否已加载
    if (window.PluginSystem) {
        console.warn('插件系统已加载');
        return;
    }

    // 创建样式并添加到页面
    function injectStyles() {
        const style = document.createElement('style');
        style.id = 'plugin-system-styles';
        style.textContent = `
            /* 保持原有样式不变 */
            .plugin-system-body {
                position: relative;
            }

            #plugin-viewer .viewer-content {
                max-width: 800px;
                width: 100%;
                position: relative;
                border-top: 5px solid #9c27b0;
            }

            #plugin-viewer h3 {
                color: #9c27b0;
                border-bottom: 1px solid #f0e6f0;
                padding-bottom: 10px;
                margin-top: 0;
            }

            #plugin-viewer .close-button {
                background-color: #9c27b0;
            }

            #plugin-viewer .close-button:hover {
                background-color: #7b1fa2;
            }

            #plugin-viewer {
                z-index: 1001;
            }

            #plugin-list {
                margin-bottom: 20px;
                border-top: 1px solid #f0e6f0;
                padding-top: 10px;
                min-height: 100px;
            }

            .plugin-item {
                padding: 10px;
                margin-bottom: 10px;
                border: 1px solid #e0c8e0;
                border-radius: 4px;
                background-color: #fcfaff;
                cursor: pointer;
                transition: background-color 0.2s, border-color 0.2s;
            }

            .plugin-item:hover {
                background-color: #f5edf5;
                border-color: #c9a3c9;
            }

            .plugin-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .plugin-name {
                font-weight: bold;
                color: #7b1fa2;
            }

            .plugin-packname {
                font-size: 0.8em;
                color: #9c27b0;
            }

            .plugin-description {
                margin-top: 5px;
                font-size: 0.9em;
                color: #5a266a;
            }

            .plugin-details {
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px dashed #e0c8e0;
                font-size: 0.85em;
                display: none;
            }

            .plugin-details.visible {
                display: block;
            }

            .plugin-section {
                margin-bottom: 8px;
            }

            .plugin-section-title {
                font-weight: bold;
                color: #7b1fa2;
                margin-bottom: 3px;
            }

            .plugin-section-content {
                color: #6a327a;
                padding-left: 10px;
            }

            #add-plugin-button {
                width: 40px;
                height: 40px;
                background-color: #9c27b0;
                color: white;
                border: none;
                font-size: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 20px;
                right: 20px;
                border-radius: 6px;
                transition: background-color 0.2s, transform 0.2s;
            }

            #add-plugin-button:hover {
                background-color: #7b1fa2;
                transform: scale(1.1);
            }

            #add-plugin-form {
                display: none;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #f0e6f0;
            }

            #add-plugin-form.visible {
                display: block;
            }

            .form-group {
                margin-bottom: 15px;
            }

            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #7b1fa2;
            }

            textarea, input[type="file"] {
                width: 100%;
                padding: 8px;
                border: 1px solid #e0c8e0;
                border-radius: 4px;
                box-sizing: border-box;
            }

            textarea:focus, input[type="file"]:focus {
                border-color: #9c27b0;
                outline: none;
                box-shadow: 0 0 0 2px rgba(156, 39, 176, 0.2);
            }

            textarea {
                min-height: 150px;
                font-family: monospace;
            }

            .form-buttons {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }

            .form-button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .submit-button {
                background-color: #9c27b0;
                color: white;
            }

            .submit-button:hover {
                background-color: #7b1fa2;
            }

            .cancel-button {
                background-color: #f0e6f0;
                color: #7b1fa2;
            }

            .cancel-button:hover {
                background-color: #e0c8e0;
            }

            .error-message {
                color: #d32f2f;
                margin-top: 5px;
                font-size: 0.9em;
            }

            .plugin-actions {
                display: flex;
                gap: 5px;
            }

            .plugin-action-button {
                padding: 3px 8px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 0.8em;
            }

            .delete-button {
                background-color: #ff4444;
                color: white;
            }

            .delete-button:hover {
                background-color: #cc0000;
            }
            
            .toggle-button {
                background-color: #4CAF50;
                color: white;
            }
            
            .toggle-button:hover {
                background-color: #45a049;
            }
            
            .toggle-button.disabled {
                background-color: #cccccc;
                color: #666666;
            }

            .install-methods {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }

            .install-method {
                flex: 1;
                text-align: center;
                padding: 10px;
                border: 1px solid #e0c8e0;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .install-method:hover {
                background-color: #f5edf5;
            }

            .install-method.active {
                border-color: #9c27b0;
                background-color: #f0e6f0;
                color: #7b1fa2;
            }

            .install-content {
                display: none;
            }

            .install-content.active {
                display: block;
            }

            #no-plugins-message {
                text-align: center;
                color: #9c27b0;
                padding: 20px;
                font-style: italic;
                font-size: 0.9em;
                margin: 0;
            }

            .view-source-button {
                background-color: #9c27b0;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 0.85em;
                margin-top: 10px;
                transition: background-color 0.2s;
                width: 100%;
                text-align: center;
            }

            .view-source-button:hover {
                background-color: #7b1fa2;
            }

            .plugin-source-code {
                margin-top: 10px;
                padding: 10px;
                background-color: #f8f8f8;
                border-radius: 4px;
                font-family: monospace;
                font-size: 0.8em;
                line-height: 1.4;
                max-height: 300px;
                overflow-y: auto;
                white-space: pre-wrap;
                display: none;
                border: 1px solid #e0c8e0;
            }

            .plugin-source-code.visible {
                display: block;
            }

            #puzzle-button {
                position: absolute;
                left: 20px;
                top: 20px;
                width: 40px;
                height: 40px;
                background-color: #9c27b0;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                transition: transform 0.2s ease, background-color 0.2s ease;
                z-index: 1000;
            }

            #puzzle-button:hover {
                background-color: #7b1fa2;
                transform: scale(1.1);
            }

            #puzzle-button.dragging {
                cursor: move;
                background-color: #6a1b88;
                box-shadow: 0 0 10px rgba(106, 27, 136, 0.5);
            }

            #drag-hint {
                position: absolute;
                left: 70px;
                top: 25px;
                background-color: #6a1b88;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                display: none;
                z-index: 999;
            }

            .viewer {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                display: none;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 1001;
            }

            .viewer-content {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 90%;
                max-height: 80%;
                overflow: auto;
            }

            .close-button {
                margin-top: 20px;
                padding: 8px 16px;
                background-color: #00BBD4;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .winbox {
                position: absolute;
                width: 500px;
                height: 400px;
                border: 1px solid #e0c8e0;
                background-color: white;
                color: #333;
                overflow: hidden;
                z-index: 1000;
                display: none;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .winbox-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 12px;
                background-color: #9c27b0;
                cursor: move;
                user-select: none;
            }
            .winbox-header .title {
                font-weight: bold;
                color: white;
            }
            .winbox-header .controls {
                display: flex;
            }
            .winbox-header .controls button {
                background: #7b1fa2;
                border: none;
                color: white;
                font-size: 14px;
                cursor: pointer;
                width: 24px;
                height: 24px;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
            }
            .winbox-header .controls button:hover {
                background: #6a1b88;
            }
            .winbox-content {
                flex: 1;
                padding: 15px;
                box-sizing: border-box;
                overflow: auto;
            }
            .resizer {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 10px;
                height: 10px;
                background-color: #9c27b0;
                cursor: se-resize;
            }
            .dialog-buttons {
                padding: 10px;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            .dialog-buttons button {
                background-color: #f0e6f0;
                color: #7b1fa2;
                border: 1px solid #9c27b0;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 3px;
                transition: background-color 0.2s;
            }
            .dialog-buttons button:hover {
                background-color: #e0c8e0;
            }
            .input-field {
                width: 100%;
                padding: 8px;
                background-color: white;
                color: #333;
                border: 1px solid #e0c8e0;
                box-sizing: border-box;
                border-radius: 3px;
            }
            .input-field:focus {
                border-color: #9c27b0;
                outline: none;
            }
        `;
        document.head.appendChild(style);
    }

    // 加载Font Awesome图标库
    function loadFontAwesome() {
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(link);
        }
        
        if (!document.querySelector('link[href*="highlight.js"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css';
            document.head.appendChild(link);
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js';
            script.onload = () => window.hljs?.highlightAll();
            document.body.appendChild(script);
        }
    }

    // 创建必要的DOM元素
    function createDOM() {
        // 为body添加相对定位类
        document.body.classList.add('plugin-system-body');
        
        // 创建拖动提示
        const dragHint = document.createElement('div');
        dragHint.id = 'drag-hint';
        dragHint.textContent = '拖动中 - 按ESC退出';
        document.body.appendChild(dragHint);
        
        // 创建拼图按钮
        const puzzleButton = document.createElement('button');
        puzzleButton.id = 'puzzle-button';
        puzzleButton.title = '插件管理';
        puzzleButton.innerHTML = '<i class="fas fa-puzzle-piece"></i>';
        document.body.appendChild(puzzleButton);
        
        // 创建插件查看器
        const pluginViewer = document.createElement('div');
        pluginViewer.id = 'plugin-viewer';
        pluginViewer.className = 'viewer';
        pluginViewer.innerHTML = `
            <div class="viewer-content">
                <h3>插件管理</h3>
                
                <button id="add-plugin-button">+</button>
                
                <div id="add-plugin-form">
                    <div class="install-methods">
                        <div class="install-method active" data-method="text">输入代码</div>
                        <div class="install-method" data-method="file">上传文件</div>
                    </div>
                    
                    <div class="install-contents">
                        <div class="install-content active" id="text-install">
                            <div class="form-group">
                                <label for="plugin-code">插件代码</label>
                                <textarea id="plugin-code" placeholder="粘贴插件代码..." style="resize: none"></textarea>
                                <div id="plugin-code-error" class="error-message"></div>
                            </div>
                        </div>
                        
                        <div class="install-content" id="file-install">
                            <div class="form-group">
                                <label for="plugin-file">选择JS文件</label>
                                <input type="file" id="plugin-file" accept=".js">
                                <div id="plugin-file-error" class="error-message"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-buttons">
                        <button class="form-button cancel-button" id="cancel-add-plugin">取消</button>
                        <button class="form-button submit-button" id="install-plugin">安装</button>
                    </div>
                </div>
                
                <p id="no-plugins-message">暂无安装的插件</p>
                <div id="plugin-list"></div>
            </div>
            <button class="close-button" id="close-plugin-viewer">关闭</button>
        `;
        document.body.appendChild(pluginViewer);
    }

    // 插件系统主类
    class PluginSystem {
        constructor() {
            // 初始化变量
            this.isDraggingButton = false;
            this.buttonOffsetX = 0;
            this.buttonOffsetY = 0;
            this.plugins = [];
            this.activePlugins = [];
            this.shortcutsEnabled = true;
            this.winboxs = [];
            this.winboxCounter = 0;
            this.DEFAULT_BUTTON_LEFT = 20;
            this.DEFAULT_BUTTON_TOP = 20;
            
            // 初始化
            this.init();
        }

        // 初始化函数
        init() {
            // 注入样式
            injectStyles();
            
            // 加载外部资源
            loadFontAwesome();
            
            // 创建DOM元素
            createDOM();
            
            // 获取DOM引用
            this.puzzleButton = document.getElementById('puzzle-button');
            this.dragHint = document.getElementById('drag-hint');
            this.pluginViewer = document.getElementById('plugin-viewer');
            this.pluginList = document.getElementById('plugin-list');
            this.addPluginButton = document.getElementById('add-plugin-button');
            this.addPluginForm = document.getElementById('add-plugin-form');
            this.closePluginViewer = document.getElementById('close-plugin-viewer');
            this.cancelAddPlugin = document.getElementById('cancel-add-plugin');
            this.installPluginBtn = document.getElementById('install-plugin');
            this.pluginCodeInput = document.getElementById('plugin-code');
            this.pluginFileInput = document.getElementById('plugin-file');
            this.noPluginsMessage = document.getElementById('no-plugins-message');
            this.installMethods = document.querySelectorAll('.install-method');
            
            // 绑定事件
            this.bindEvents();
            
            // 初始化插件
            this.initializePlugins();
            
            // 从本地存储加载按钮位置
            this.loadButtonPosition();
        }

        // 绑定事件处理函数
        bindEvents() {
            // 拼图按钮点击事件
            this.puzzleButton.addEventListener('click', () => this.togglePluginViewer());
            
            // 关闭插件查看器
            this.closePluginViewer.addEventListener('click', () => this.togglePluginViewer());
            
            // 添加插件按钮点击事件
            this.addPluginButton.addEventListener('click', () => {
                this.addPluginForm.classList.add('visible');
            });
            
            // 取消添加插件
            this.cancelAddPlugin.addEventListener('click', () => {
                this.addPluginForm.classList.remove('visible');
                this.clearErrors();
            });
            
            // 安装插件按钮点击事件
            this.installPluginBtn.addEventListener('click', () => this.handleInstallPlugin());
            
            // 安装方式切换
            this.installMethods.forEach(method => {
                method.addEventListener('click', () => this.switchInstallMethod(method));
            });
            
            // 文件选择变化事件
            this.pluginFileInput.addEventListener('change', () => {
                if (this.pluginFileInput.files && this.pluginFileInput.files.length > 0) {
                    document.getElementById('plugin-file-error').textContent = '';
                }
            });
            
            // 输入框焦点事件
            this.pluginCodeInput.addEventListener('focus', () => {
                this.shortcutsEnabled = false;
            });
            this.pluginCodeInput.addEventListener('blur', () => {
                this.shortcutsEnabled = true;
            });
            
            // 初始化按钮拖动
            this.initButtonDrag();
            
            // 键盘事件
            document.addEventListener('keydown', (event) => this.handleKeydown(event));
        }

        // 处理键盘事件
        handleKeydown(event) {
            if (!this.shortcutsEnabled) return;
            
            // Alt+M 切换拖动模式
            if ((event.key === 'm' || event.key === 'M') && event.altKey) {
                event.preventDefault();
                this.toggleButtonDragMode();
            }
            // Alt+R 重置位置
            else if ((event.key === 'r' || event.key === 'R') && event.altKey) {
                event.preventDefault();
                this.resetButtonPosition();
            }
            // ESC 退出拖动模式
            else if (event.key === 'Escape' && this.isDraggingButton) {
                event.preventDefault();
                this.toggleButtonDragMode();
            }
            // Insert 键打开/关闭插件管理
            else if (event.key.toLowerCase() === 'insert') {
                event.preventDefault();
                this.togglePluginViewer();
            }
            // ESC 关闭所有查看器
            else if (event.key === 'Escape' && !this.isDraggingButton) {
                event.preventDefault();
                this.closeAllViewers();
            }
        }

        // 切换安装方式
        switchInstallMethod(method) {
            // 移除所有active类
            this.installMethods.forEach(m => m.classList.remove('active'));
            document.querySelectorAll('.install-content').forEach(c => c.classList.remove('active'));
            
            // 给当前点击的添加active类
            method.classList.add('active');
            const methodName = method.dataset.method;
            document.getElementById(`${methodName}-install`).classList.add('active');
            
            // 清空错误信息
            this.clearErrors();
        }

        // 处理安装插件
        handleInstallPlugin() {
            const activeMethod = document.querySelector('.install-method.active').dataset.method;
            
            if (activeMethod === 'text') {
                const code = this.pluginCodeInput.value.trim();
                if (!code) {
                    this.showError('plugin-code-error', '请输入插件代码');
                    return;
                }
                this.installPlugin(code);
            } else if (activeMethod === 'file') {
                if (!this.pluginFileInput.files || this.pluginFileInput.files.length === 0) {
                    this.showError('plugin-file-error', '请选择一个JS文件');
                    return;
                }
                this.installPluginFromFile(this.pluginFileInput.files[0]);
            }
        }

        // 初始化拼图按钮拖动功能
        initButtonDrag() {
            // 鼠标按下时记录偏移量
            this.puzzleButton.addEventListener('mousedown', (e) => {
                if (this.isDraggingButton) {
                    const rect = this.puzzleButton.getBoundingClientRect();
                    this.buttonOffsetX = e.clientX - rect.left;
                    this.buttonOffsetY = e.clientY - rect.top;
                    e.preventDefault();
                }
            });
            
            // 鼠标移动时拖动按钮
            document.addEventListener('mousemove', (e) => {
                if (this.isDraggingButton) {
                    const newLeft = e.clientX - this.buttonOffsetX;
                    const newTop = e.clientY - this.buttonOffsetY;
                    
                    // 确保按钮不会移出窗口
                    const windowWidth = window.innerWidth;
                    const windowHeight = window.innerHeight;
                    const buttonWidth = this.puzzleButton.offsetWidth;
                    const buttonHeight = this.puzzleButton.offsetHeight;
                    
                    const constrainedLeft = Math.max(0, Math.min(newLeft, windowWidth - buttonWidth));
                    const constrainedTop = Math.max(0, Math.min(newTop, windowHeight - buttonHeight));
                    
                    this.puzzleButton.style.left = `${constrainedLeft}px`;
                    this.puzzleButton.style.top = `${constrainedTop}px`;
                    
                    // 保存位置到本地存储
                    localStorage.setItem('puzzle_button_position', JSON.stringify({
                        left: constrainedLeft,
                        top: constrainedTop
                    }));
                }
            });
            
            // 鼠标释放时结束拖动
            document.addEventListener('mouseup', () => {
                // 保持拖动模式直到用户再次按下alt+m或esc
            });
        }

        // 切换拼图按钮的拖动模式
        toggleButtonDragMode() {
            this.isDraggingButton = !this.isDraggingButton;
            
            if (this.isDraggingButton) {
                // 进入拖动模式
                this.puzzleButton.classList.add('dragging');
                this.puzzleButton.title = "拖动按钮 - 按ESC退出拖动模式";
                this.dragHint.style.display = 'block';
                
                // 临时移除点击事件监听器
                const clickHandler = this.puzzleButton.onclick;
                this.puzzleButton.onclick = null;
                
                // 记录当前的点击处理器，以便退出时恢复
                this.puzzleButton.dataset.clickHandler = 'true';
                this.puzzleButton._originalClick = clickHandler;
            } else {
                // 退出拖动模式
                this.puzzleButton.classList.remove('dragging');
                this.puzzleButton.title = "插件管理";
                this.dragHint.style.display = 'none';
                
                // 恢复点击事件监听器
                if (this.puzzleButton.dataset.clickHandler) {
                    this.puzzleButton.onclick = this.puzzleButton._originalClick;
                    delete this.puzzleButton.dataset.clickHandler;
                    delete this.puzzleButton._originalClick;
                }
            }
        }

        // 从本地存储加载按钮位置
        loadButtonPosition() {
            const buttonPosition = localStorage.getItem('puzzle_button_position');
            if (buttonPosition) {
                try {
                    const { left, top } = JSON.parse(buttonPosition);
                    this.puzzleButton.style.left = `${left}px`;
                    this.puzzleButton.style.top = `${top}px`;
                } catch (e) {
                    console.error('加载按钮位置失败:', e);
                }
            }
        }

        // 重置按钮位置到初始状态
        resetButtonPosition() {
            // 设置按钮回初始位置
            this.puzzleButton.style.left = `${this.DEFAULT_BUTTON_LEFT}px`;
            this.puzzleButton.style.top = `${this.DEFAULT_BUTTON_TOP}px`;
            
            // 更新本地存储中的位置
            localStorage.setItem('puzzle_button_position', JSON.stringify({
                left: this.DEFAULT_BUTTON_LEFT,
                top: this.DEFAULT_BUTTON_TOP
            }));
            
            // 如果当前处于拖动模式，退出拖动模式
            if (this.isDraggingButton) {
                this.toggleButtonDragMode();
            }
        }

        // 切换插件查看器显示状态
        togglePluginViewer() {
            this.pluginViewer.style.display = this.pluginViewer.style.display === 'flex' ? 'none' : 'flex';
            // 隐藏添加插件表单
            this.addPluginForm.classList.remove('visible');
        }

        // 关闭所有查看器窗口
        closeAllViewers() {
            this.pluginViewer.style.display = 'none';
            // 隐藏添加插件表单
            this.addPluginForm.classList.remove('visible');
        }

        // 初始化插件系统
        initializePlugins() {
            // 从localStorage加载插件
            const savedPlugins = localStorage.getItem('papercode_plugins');
            if (savedPlugins) {
                try {
                    this.plugins = JSON.parse(savedPlugins);
                    // 运行所有已安装的插件
                    this.plugins.forEach(plugin => {
                        if (!plugin.disabled) { // 只运行未被禁用的插件
                            this.runPlugin(plugin.code, plugin.manifest.packname);
                            this.activePlugins.push(plugin.manifest.packname);
                        }
                    });
                } catch (e) {
                    console.error('加载插件失败:', e);
                    this.plugins = [];
                }
            }
            this.updatePluginList();
        }

        // 更新插件列表显示
        updatePluginList() {
            this.pluginList.innerHTML = '';
            
            if (this.plugins.length === 0) {
                // 没有插件时显示提示信息
                this.noPluginsMessage.style.display = 'block';
                return;
            }
            
            // 有插件时隐藏提示信息
            this.noPluginsMessage.style.display = 'none';
            
            this.plugins.forEach((plugin, index) => {
                const manifest = plugin.manifest;
                const pluginItem = document.createElement('div');
                pluginItem.className = 'plugin-item';
                
                const header = document.createElement('div');
                header.className = 'plugin-header';
                
                const nameDiv = document.createElement('div');
                nameDiv.className = 'plugin-name';
                nameDiv.textContent = manifest.name;
                
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'plugin-actions';
                
                // 添加启用/禁用按钮
                const toggleButton = document.createElement('button');
                toggleButton.className = `plugin-action-button toggle-button ${plugin.disabled ? '' : 'disabled'}`;
                toggleButton.textContent = plugin.disabled ? '启用' : '禁用';
                toggleButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.togglePluginStatus(index);
                });
                
                const deleteButton = document.createElement('button');
                deleteButton.className = 'plugin-action-button delete-button';
                deleteButton.textContent = '删除';
                deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deletePlugin(index);
                });
                
                actionsDiv.appendChild(toggleButton);
                actionsDiv.appendChild(deleteButton);
                header.appendChild(nameDiv);
                header.appendChild(actionsDiv);
                
                const packnameDiv = document.createElement('div');
                packnameDiv.className = 'plugin-packname';
                packnameDiv.textContent = manifest.packname;
                
                const descriptionDiv = document.createElement('div');
                descriptionDiv.className = 'plugin-description';
                descriptionDiv.textContent = manifest.description || '无描述';
                
                // 显示插件状态
                const statusDiv = document.createElement('div');
                statusDiv.style.fontSize = '0.8em';
                statusDiv.style.marginTop = '5px';
                statusDiv.style.color = plugin.disabled ? '#ff9800' : '#4CAF50';
                statusDiv.textContent = plugin.disabled ? '已禁用' : '已启用';
                
                const detailsDiv = document.createElement('div');
                detailsDiv.className = 'plugin-details';
                
                // 添加依赖信息
                if (manifest.lib && manifest.lib.length > 0) {
                    const libSection = document.createElement('div');
                    libSection.className = 'plugin-section';
                    
                    const libTitle = document.createElement('div');
                    libTitle.className = 'plugin-section-title';
                    libTitle.textContent = '依赖插件:';
                    
                    const libContent = document.createElement('div');
                    libContent.className = 'plugin-section-content';
                    libContent.textContent = manifest.lib.join(', ');
                    
                    libSection.appendChild(libTitle);
                    libSection.appendChild(libContent);
                    detailsDiv.appendChild(libSection);
                }
                
                // 添加不兼容信息
                if (manifest.incompatible && manifest.incompatible.length > 0) {
                    const incompatibleSection = document.createElement('div');
                    incompatibleSection.className = 'plugin-section';
                    
                    const incompatibleTitle = document.createElement('div');
                    incompatibleTitle.className = 'plugin-section-title';
                    incompatibleTitle.textContent = '不兼容插件:';
                    
                    const incompatibleContent = document.createElement('div');
                    incompatibleContent.className = 'plugin-section-content';
                    incompatibleContent.textContent = manifest.incompatible.join(', ');
                    
                    incompatibleSection.appendChild(incompatibleTitle);
                    incompatibleSection.appendChild(incompatibleContent);
                    detailsDiv.appendChild(incompatibleSection);
                }

                // 添加查看源代码按钮
                const viewSourceButton = document.createElement('button');
                viewSourceButton.className = 'view-source-button';
                viewSourceButton.textContent = '查看源代码';
                viewSourceButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const sourceCodeElement = pluginItem.querySelector('.plugin-source-code');
                    sourceCodeElement.classList.toggle('visible');
                    viewSourceButton.textContent = sourceCodeElement.classList.contains('visible') 
                        ? '隐藏源代码' 
                        : '查看源代码';
                });
                detailsDiv.appendChild(viewSourceButton);

                // 添加源代码显示区域
                const sourceCodeElement = document.createElement('div');
                sourceCodeElement.className = 'plugin-source-code';
                // 显示包含manifest的完整源代码
                sourceCodeElement.textContent = plugin.fullCode || '无源代码';
                detailsDiv.appendChild(sourceCodeElement);
                
                pluginItem.appendChild(header);
                pluginItem.appendChild(packnameDiv);
                pluginItem.appendChild(descriptionDiv);
                pluginItem.appendChild(statusDiv);
                pluginItem.appendChild(detailsDiv);
                
                // 点击显示/隐藏详情
                pluginItem.addEventListener('click', (e) => {
                    // 检查点击目标是否是代码块或其内部元素
                    if (!e.target.closest('.plugin-source-code')) {
                        detailsDiv.classList.toggle('visible');
                    }
                });
                
                this.pluginList.appendChild(pluginItem);
            });
        }

        // 切换插件启用/禁用状态
        togglePluginStatus(index) {
            const plugin = this.plugins[index];
            const packname = plugin.manifest.packname;
            
            if (plugin.disabled) {
                // 启用插件
                try {
                    this.runPlugin(plugin.code, packname);
                    this.activePlugins.push(packname);
                    plugin.disabled = false;
                    this.savePlugins();
                    this.updatePluginList();
                } catch (e) {
                    alert(`启用插件失败: ${e.message}`);
                    plugin.disabled = true;
                }
            } else {
                // 禁用插件
                plugin.disabled = true;
                this.activePlugins = this.activePlugins.filter(p => p !== packname);
                this.savePlugins();
                this.updatePluginList();
                // 刷新页面以彻底清除插件影响
                location.reload();
            }
        }

        // 解析插件代码，提取manifest
        parsePluginCode(code) {
            try {
                // 保存完整代码（包含manifest）
                const fullCode = code;
                
                // 尝试提取manifest部分
                const manifestMatch = code.match(/"manifest"\s*:\s*\{([\s\S]*?)\}/);
                if (!manifestMatch) {
                    return { error: '插件代码中未找到manifest' };
                }
                
                // 尝试解析manifest
                const manifestStr = `{${manifestMatch[1]}}`;
                const manifest = JSON.parse(manifestStr);
                
                // 验证必要字段
                if (!manifest.name || !manifest.packname) {
                    return { error: 'manifest中缺少name或packname' };
                }
                
                // 验证packname格式 (至少三部分)
                const packnameParts = manifest.packname.split('.');
                if (packnameParts.length < 3) {
                    return { error: 'packname格式不正确，至少需要三部分(xxx.xxx.xxx)' };
                }
                
                // 提取纯代码部分（去除manifest）
                const codeWithoutManifest = code.replace(/"manifest"\s*:\s*\{[\s\S]*?\}/, '');
                
                return {
                    manifest: manifest,
                    code: codeWithoutManifest,
                    fullCode: fullCode
                };
            } catch (e) {
                return { error: `解析插件失败: ${e.message}` };
            }
        }

        // 检查插件依赖
        checkPluginDependencies(manifest) {
            if (!manifest.lib || manifest.lib.length === 0) {
                return { valid: true };
            }
            
            const missingDeps = [];
            manifest.lib.forEach(depPackname => {
                const found = this.plugins.some(plugin => plugin.manifest.packname === depPackname);
                if (!found) {
                    missingDeps.push(depPackname);
                }
            });
            
            if (missingDeps.length > 0) {
                return {
                    valid: false,
                    missing: missingDeps
                };
            }
            
            return { valid: true };
        }

        // 检查插件兼容性
        checkPluginCompatibility(manifest) {
            // 检查是否与已安装插件不兼容
            if (manifest.incompatible && manifest.incompatible.length > 0) {
                for (const incompatiblePackname of manifest.incompatible) {
                    const found = this.plugins.some(plugin => plugin.manifest.packname === incompatiblePackname);
                    if (found) {
                        return {
                            valid: false,
                            reason: `与已安装的插件冲突: ${incompatiblePackname}`
                        };
                    }
                }
            }
            
            // 检查已安装插件是否与当前插件不兼容
            for (const installedPlugin of this.plugins) {
                if (installedPlugin.manifest.incompatible && 
                    installedPlugin.manifest.incompatible.includes(manifest.packname)) {
                    return {
                        valid: false,
                        reason: `已安装的插件 ${installedPlugin.manifest.name} 与当前插件冲突`
                    };
                }
            }
            
            return { valid: true };
        }

        // 检查插件是否已安装
        isPluginInstalled(packname) {
            return this.plugins.some(plugin => plugin.manifest.packname === packname);
        }

        // 安装插件
        installPlugin(code) {
            const result = this.parsePluginCode(code);
            
            if (result.error) {
                this.showError('plugin-code-error', result.error);
                return false;
            }
            
            const { manifest, code: pluginCode, fullCode } = result;
            const packname = manifest.packname;
            
            // 检查是否已安装
            if (this.isPluginInstalled(packname)) {
                this.showError('plugin-code-error', `已安装同名插件: ${packname}`);
                return false;
            }
            
            // 检查依赖
            const depCheck = this.checkPluginDependencies(manifest);
            if (!depCheck.valid) {
                this.showError('plugin-code-error', `缺少依赖插件: ${depCheck.missing.join(', ')}`);
                return false;
            }
            
            // 检查兼容性
            const compatCheck = this.checkPluginCompatibility(manifest);
            if (!compatCheck.valid) {
                this.showError('plugin-code-error', compatCheck.reason);
                return false;
            }
            
            // 运行插件
            try {
                this.runPlugin(pluginCode, packname);
            } catch (e) {
                this.showError('plugin-code-error', `插件运行出错: ${e.message}`);
                return false;
            }
            
            // 添加到插件列表
            this.plugins.push({
                manifest: manifest,
                code: pluginCode,
                fullCode: fullCode,
                disabled: false
            });
            
            // 保存到localStorage
            this.savePlugins();
            
            // 更新插件列表
            this.updatePluginList();
            
            // 隐藏添加插件表单
            this.addPluginForm.classList.remove('visible');
            // 清空输入
            this.pluginCodeInput.value = '';
            
            return true;
        }

        // 从文件安装插件
        installPluginFromFile(file) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const code = e.target.result;
                    const success = this.installPlugin(code);
                    if (success) {
                        // 重置文件输入
                        this.pluginFileInput.value = '';
                    }
                } catch (e) {
                    this.showError('plugin-file-error', `文件读取错误: ${e.message}`);
                }
            };
            
            reader.onerror = () => {
                this.showError('plugin-file-error', '文件读取失败');
            };
            
            reader.readAsText(file);
        }

        // 运行插件代码
        runPlugin(code, packname) {
            // 创建一个沙箱环境运行插件代码，传入pluginAPI
            const pluginFunction = new Function('api', code);
            pluginFunction(this.getPluginAPI(packname));
        }

        // 获取插件API
        getPluginAPI(packname) {
            const self = this;
            
            return {
                // DOM操作方法
                querySelector: (selector) => document.querySelector(selector),
                querySelectorAll: (selector) => document.querySelectorAll(selector),
                createElement: (tag) => document.createElement(tag),
                getElementById: (id) => document.getElementById(id),
                
                // 修改页面内容的方法
                setInnerHTML: (selector, html) => {
                    const element = document.querySelector(selector);
                    if (element) element.innerHTML = html;
                },
                setTextContent: (selector, text) => {
                    const element = document.querySelector(selector);
                    if (element) element.textContent = text;
                },
                appendChild: (parentSelector, child) => {
                    const parent = document.querySelector(parentSelector);
                    if (parent && child) parent.appendChild(child);
                },
                
                // 添加样式的方法
                addStyle: (css) => {
                    const style = document.createElement('style');
                    style.textContent = css;
                    document.head.appendChild(style);
                    return style;
                },
                
                // 事件监听方法
                addEventListener: (selector, event, handler) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        element.addEventListener(event, handler);
                        return true;
                    }
                    return false;
                },
                
                // 存储管理方法
                setStorage: (key, value) => {
                    try {
                        localStorage.setItem(`plugin_${key}`, JSON.stringify(value));
                        return true;
                    } catch (e) {
                        console.error('Plugin storage error:', e);
                        return false;
                    }
                },
                getStorage: (key) => {
                    try {
                        const value = localStorage.getItem(`plugin_${key}`);
                        return value ? JSON.parse(value) : null;
                    } catch (e) {
                        console.error('Plugin storage error:', e);
                        return null;
                    }
                },
                
                // 通知主应用的方法
                notify: (message, type = 'info') => self.notify(message, type),
                
                // 获取已安装插件信息
                getInstalledPlugins: () => {
                    return self.plugins.map(plugin => ({
                        name: plugin.manifest.name,
                        packname: plugin.manifest.packname,
                        description: plugin.manifest.description
                    }));
                },

                // 窗口系统API
                createWindow: (windowName, x, y) => self.createWinbox(windowName, x, y, packname),
                toggleWindow: (winboxId, x, y) => self.toggleWinbox(winboxId, x, y),
                closeWindow: (winboxId) => self.closeWinbox(winboxId),
                
                // 拼图按钮拖动控制API
                toggleButtonDrag: () => self.toggleButtonDragMode(),
                unlockButtonDrag: () => {
                    if (!self.isDraggingButton) {
                        self.toggleButtonDragMode();
                    }
                },
                lockButtonDrag: () => {
                    if (self.isDraggingButton) {
                        self.toggleButtonDragMode();
                    }
                },
                resetButtonPosition: () => self.resetButtonPosition()
            };
        }

        // 显示通知
        notify(message, type = 'info') {
            // 创建通知元素
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '4px';
            notification.style.color = 'white';
            notification.style.zIndex = '9999';
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            
            // 根据类型设置不同颜色
            switch(type) {
                case 'success':
                    notification.style.backgroundColor = '#4CAF50';
                    break;
                case 'error':
                    notification.style.backgroundColor = '#f44336';
                    break;
                case 'warning':
                    notification.style.backgroundColor = '#ff9800';
                    break;
                default:
                    notification.style.backgroundColor = '#2196F3';
            }
            
            document.body.appendChild(notification);
            
            // 显示通知
            setTimeout(() => {
                notification.style.opacity = '1';
            }, 10);
            
            // 3秒后隐藏通知
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // 删除插件 - 修改为删除数据并刷新页面
        deletePlugin(index) {
            if (confirm('确定要删除这个插件吗？此操作将刷新页面。')) {
                const plugin = this.plugins[index];
                const packname = plugin.manifest.packname;
                
                // 从列表中移除插件
                this.plugins.splice(index, 1);
                
                // 从活跃插件列表中移除
                this.activePlugins = this.activePlugins.filter(p => p !== packname);
                
                // 保存更改
                this.savePlugins();
                
                // 刷新页面以彻底清除插件影响
                location.reload();
            }
        }

        // 保存插件到localStorage
        savePlugins() {
            localStorage.setItem('papercode_plugins', JSON.stringify(this.plugins));
        }

        // 显示错误信息
        showError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            // 3秒后隐藏错误信息
            setTimeout(() => {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }, 3000);
        }

        // 清空错误信息
        clearErrors() {
            document.getElementById('plugin-code-error').textContent = '';
            document.getElementById('plugin-file-error').textContent = '';
        }

        // 创建新窗口
        createWinbox(windowName, x, y, packname) {
            const winboxId = `winbox-${this.winboxCounter++}`;
            const winbox = document.createElement('div');
            winbox.id = winboxId;
            winbox.className = 'winbox';
            winbox.style.display = 'none';

            winbox.innerHTML = `
                <div class="winbox-header">
                    <div class="title">${windowName}</div>
                    <div class="controls">
                        <button onclick="PluginSystem.instance.closeWinbox('${winboxId}')">×</button>
                    </div>
                </div>
                <div class="winbox-content">
                    <div class="output" id="${winboxId}-output"></div>
                </div>
                <div class="resizer"></div>
            `;

            document.body.appendChild(winbox);
            this.winboxs.push(winbox);

            // 初始化事件监听
            const outputDiv = document.getElementById(`${winboxId}-output`);
            
            // 使窗口可拖动
            this.makeDraggable(winbox);

            // 使窗口可调整大小
            this.makeResizable(winbox);

            // 显示窗口
            this.toggleWinbox(winboxId, x, y);

            // 返回窗口实例
            return {
                id: winboxId,
                element: winbox,
                content: outputDiv,
                msg: (message) => this.createMessageDialog(message),
                input: (promptText, defaultValue = '') => this.createInputDialog(promptText, defaultValue),
                setContent: (content) => {
                    outputDiv.innerHTML = content;
                },
                appendContent: (content) => {
                    outputDiv.innerHTML += content;
                },
                setStyle: (styles) => {
                    Object.keys(styles).forEach(key => {
                        winbox.style[key] = styles[key];
                    });
                }
            };
        }

        // 创建消息对话框
        createMessageDialog(message) {
            return new Promise((resolve) => {
                const dialogId = `dialog-${this.winboxCounter++}`;
                const dialog = document.createElement('div');
                dialog.id = dialogId;
                dialog.className = 'winbox';
                dialog.innerHTML = `
                    <div class="winbox-header">
                        <div class="title">Message</div>
                        <div class="controls">
                            <button onclick="PluginSystem.instance.closeWinbox('${dialogId}')">×</button>
                        </div>
                    </div>
                    <div class="winbox-content">
                        <p>${message}</p>
                    </div>
                    <div class="dialog-buttons">
                        <button onclick="PluginSystem.instance.closeWinbox('${dialogId}'); PluginSystem.instance.resolveDialog('${dialogId}', true)">OK</button>
                    </div>
                `;
                document.body.appendChild(dialog);
                dialog.style.display = 'block';

                // 存储对话框的Promise resolve
                dialog._resolve = resolve;

                // 使对话框可拖动
                this.makeDraggable(dialog);
            });
        }

        // 创建输入对话框
        createInputDialog(promptText, defaultValue = '') {
            return new Promise((resolve) => {
                const dialogId = `dialog-${this.winboxCounter++}`;
                const dialog = document.createElement('div');
                dialog.id = dialogId;
                dialog.className = 'winbox';
                dialog.innerHTML = `
                    <div class="winbox-header">
                        <div class="title">Input</div>
                        <div class="controls">
                            <button onclick="PluginSystem.instance.closeWinbox('${dialogId}'); PluginSystem.instance.resolveDialog('${dialogId}', [false, ''])">×</button>
                        </div>
                    </div>
                    <div class="winbox-content">
                        <p>${promptText}</p>
                        <input type="text" value="${defaultValue}" class="input-field" id="${dialogId}-input">
                    </div>
                    <div class="dialog-buttons">
                        <button onclick="PluginSystem.instance.closeWinbox('${dialogId}'); PluginSystem.instance.resolveDialog('${dialogId}', [false, ''])">Cancel</button>
                        <button onclick="const val = document.getElementById('${dialogId}-input').value; PluginSystem.instance.closeWinbox('${dialogId}'); PluginSystem.instance.resolveDialog('${dialogId}', [true, val])">OK</button>
                    </div>
                `;
                document.body.appendChild(dialog);
                dialog.style.display = 'block';

                // 存储对话框的Promise resolve
                dialog._resolve = resolve;

                // 使对话框可拖动
                this.makeDraggable(dialog);
            });
        }

        // 解决对话框Promise
        resolveDialog(dialogId, value) {
            const dialog = document.getElementById(dialogId);
            if (dialog && dialog._resolve) {
                dialog._resolve(value);
                delete dialog._resolve;
            }
        }

        // 切换窗口显示状态
        toggleWinbox(winboxId, x, y) {
            const winbox = document.getElementById(winboxId);
            if (winbox.style.display === 'none' || winbox.style.display === '') {
                winbox.style.display = 'block';
                if (x !== undefined && y !== undefined) {
                    // 确保窗口位置不超出边框
                    winbox.style.left = `${Math.max(0, Math.min(x, window.innerWidth - winbox.offsetWidth))}px`;
                    winbox.style.top = `${Math.max(0, Math.min(y, window.innerHeight - winbox.offsetHeight))}px`;
                } else {
                    // 默认位置在屏幕中央
                    winbox.style.left = `${(window.innerWidth - winbox.offsetWidth) / 2}px`;
                    winbox.style.top = `${(window.innerHeight - winbox.offsetHeight) / 2}px`;
                }
            } else {
                winbox.style.display = 'none';
            }
        }

        // 关闭窗口
        closeWinbox(winboxId) {
            const winbox = document.getElementById(winboxId);
            if (winbox) {
                // 如果是对话框，确保resolve被调用
                if (winbox._resolve && !winbox._resolved) {
                    winbox._resolved = true;
                    if (winbox.className.includes('dialog')) {
                        winbox._resolve(false);
                    }
                }
                winbox.remove();
                const index = this.winboxs.indexOf(winbox);
                if (index !== -1) {
                    this.winboxs.splice(index, 1);
                }
            }
        }

        // 使窗口可拖动
        makeDraggable(element) {
            let isDragging = false;
            let offsetX, offsetY;

            const header = element.querySelector('.winbox-header');
            header.addEventListener('mousedown', (event) => {
                isDragging = true;
                offsetX = event.clientX - element.getBoundingClientRect().left;
                offsetY = event.clientY - element.getBoundingClientRect().top;
            });

            document.addEventListener('mousemove', (event) => {
                if (isDragging) {
                    const newX = Math.max(0, Math.min(event.clientX - offsetX, window.innerWidth - element.offsetWidth));
                    const newY = Math.max(0, Math.min(event.clientY - offsetY, window.innerHeight - element.offsetHeight));
                    element.style.left = `${newX}px`;
                    element.style.top = `${newY}px`;
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        }

        // 使窗口可调整大小
        makeResizable(element) {
            const resizer = element.querySelector('.resizer');
            let isResizing = false;
            let startX, startY, startWidth, startHeight;

            resizer.addEventListener('mousedown', (event) => {
                isResizing = true;
                startX = event.clientX;
                startY = event.clientY;
                startWidth = element.offsetWidth;
                startHeight = element.offsetHeight;
                event.preventDefault();
            });

            document.addEventListener('mousemove', (event) => {
                if (isResizing) {
                    const newWidth = Math.max(200, Math.min(startWidth + (event.clientX - startX), window.innerWidth));
                    const newHeight = Math.max(100, Math.min(startHeight + (event.clientY - startY), window.innerHeight));
                    element.style.width = `${newWidth}px`;
                    element.style.height = `${newHeight}px`;
                }
            });

            document.addEventListener('mouseup', () => {
                isResizing = false;
            });
        }
    }

    // 初始化插件系统并暴露到window对象
    window.PluginSystem = {
        instance: null,
        init: () => {
            if (!window.PluginSystem.instance) {
                window.PluginSystem.instance = new PluginSystem();
            }
            return window.PluginSystem.instance;
        },
        // 提供窗口操作的全局方法
        closeWinbox: (winboxId) => {
            if (window.PluginSystem.instance) {
                window.PluginSystem.instance.closeWinbox(winboxId);
            }
        },
        resolveDialog: (dialogId, value) => {
            if (window.PluginSystem.instance) {
                window.PluginSystem.instance.resolveDialog(dialogId, value);
            }
        },
        // 插件按钮控制接口
        pluginbutton: {
            move: {
                unlock: () => {
                    if (window.PluginSystem.instance) {
                        window.PluginSystem.instance.toggleButtonDragMode();
                    }
                },
                lock: () => {
                    if (window.PluginSystem.instance) {
                        window.PluginSystem.instance.toggleButtonDragMode();
                    }
                },
                reset: () => {
                    if (window.PluginSystem.instance) {
                        window.PluginSystem.instance.resetButtonPosition();
                    }
                }
            }
        },
        // 窗口注册API
        register: {
            winbox: (windowName, x, y) => {
                if (window.PluginSystem.instance) {
                    return window.PluginSystem.instance.createWinbox(windowName, x, y);
                }
                return null;
            }
        }
    };

    // 页面加载完成后自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.PluginSystem.init());
    } else {
        window.PluginSystem.init();
    }
})(window, document);
