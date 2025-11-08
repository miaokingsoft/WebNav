class WebsiteNavigator {
    constructor() {
        this.data = {
            categories: [
                {
                    id: 'default',
                    name: '默认分类',
                    websites: []
                }
            ]
        };
        this.draggedElement = null;
        this.draggedCategoryId = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.bindEvents();
        this.render();
    }

    // 从服务器加载数据
    async loadData() {
        try {
            const response = await fetch('/data.json');
            if (response.ok) {
                this.data = await response.json();
                // 确保所有网站都有backgroundColor属性
                this.data.categories.forEach(category => {
                    category.websites.forEach(website => {
                        if (!website.hasOwnProperty('backgroundColor')) {
                            website.backgroundColor = ''; // 默认无背景色
                        }
                    });
                });
            } else {
                console.log('未找到数据文件，初始化默认数据');
                this.data = {
                    categories: [
                        {
                            id: 'default',
                            name: '默认分类',
                            websites: []
                        }
                    ]
                };
            }
        } catch (error) {
            console.error('加载数据失败:', error);
            this.data = {
                categories: [
                    {
                        id: 'default',
                        name: '默认分类',
                        websites: []
                    }
                ]
            };
        }
    }

    // 绑定事件
    bindEvents() {
        // 编辑网站表单提交
        document.getElementById('edit-site-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEditedSite();
        });

        // 添加网站表单提交（模态框）
        document.getElementById('add-site-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addWebsiteFromModal();
        });

        // 悬浮添加按钮
        document.getElementById('floating-add-btn').addEventListener('click', () => {
            this.openAddSiteModal();
        });

        // 关闭模态框
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        });
        
        // 绑定颜色选择事件
        this.bindColorPickerEvents();
    }

    // 绑定颜色选择器事件
    bindColorPickerEvents() {
        // 我们将在打开编辑模态框时绑定颜色选择事件
    }

    // 打开添加网站模态框
    openAddSiteModal() {
        // 填充分类选择
        const categorySelect = document.getElementById('modal-site-category');
        categorySelect.innerHTML = '';
        this.data.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
        
        // 清空表单
        document.getElementById('modal-site-name').value = '';
        document.getElementById('modal-site-url').value = '';
        
        // 显示模态框
        document.getElementById('add-site-modal').style.display = 'block';
    }

    // 添加分类（保留功能但不在界面显示）
    async addCategory() {
        // 这个功能保留，可以通过其他方式调用
        const name = prompt('请输入分类名称:');
        if (!name) {
            return;
        }

        // 检查分类是否已存在
        const exists = this.data.categories.some(cat => cat.name === name);
        if (exists) {
            alert('分类名称已存在');
            return;
        }

        const newCategory = {
            id: 'cat_' + Date.now(),
            name: name,
            websites: []
        };

        this.data.categories.push(newCategory);
        
        // 保存到服务器
        if (await this.saveData()) {
            this.render();
        }
    }

    // 添加分类功能已移除
    /*
    async deleteCategory(id) {
        if (id === 'default') {
            alert('不能删除默认分类');
            return;
        }

        if (!confirm('确定要删除这个分类吗？分类下的所有网站也将被删除。')) {
            return;
        }

        this.data.categories = this.data.categories.filter(cat => cat.id !== id);
        
        // 保存到服务器
        if (await this.saveData()) {
            this.render();
        }
    }
    */

    // 从模态框添加网站
    async addWebsiteFromModal() {
        const categorySelect = document.getElementById('modal-site-category');
        const nameInput = document.getElementById('modal-site-name');
        const urlInput = document.getElementById('modal-site-url');
        
        const categoryId = categorySelect.value;
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();

        if (!name || !url) {
            alert('请填写网站名称和链接');
            return;
        }

        // 验证URL格式
        try {
            new URL(url);
        } catch (e) {
            alert('请输入有效的网站链接');
            return;
        }

        // 找到对应的分类
        const category = this.data.categories.find(cat => cat.id === categoryId);
        if (!category) {
            alert('分类不存在');
            return;
        }

        // 添加新网站到分类
        const newSite = {
            id: 'site_' + Date.now(),
            name: name,
            url: url,
            backgroundColor: '' // 默认无背景色
        };

        category.websites.push(newSite);
        
        // 保存到服务器
        if (await this.saveData()) {
            this.closeModal();
            this.render();
            
            // 实现新增网址自动隐藏效果
            this.animateNewSite(categoryId, newSite.id);
        }
    }

    // 添加网站（原来的表单方式）
    async addWebsite() {
        const categorySelect = document.getElementById('site-category');
        const nameInput = document.getElementById('site-name');
        const urlInput = document.getElementById('site-url');
        
        const categoryId = categorySelect.value;
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();

        if (!name || !url) {
            alert('请填写网站名称和链接');
            return;
        }

        // 验证URL格式
        try {
            new URL(url);
        } catch (e) {
            alert('请输入有效的网站链接');
            return;
        }

        // 找到对应的分类
        const category = this.data.categories.find(cat => cat.id === categoryId);
        if (!category) {
            alert('分类不存在');
            return;
        }

        // 添加新网站到分类
        const newSite = {
            id: 'site_' + Date.now(),
            name: name,
            url: url,
            backgroundColor: '' // 默认无背景色
        };

        category.websites.push(newSite);
        
        // 保存到服务器
        if (await this.saveData()) {
            this.render();
            nameInput.value = '';
            urlInput.value = '';
            nameInput.focus();
            
            // 实现新增网址自动隐藏效果
            this.animateNewSite(categoryId, newSite.id);
        }
    }

    // 编辑网站
    editWebsite(siteId) {
        // 找到网站
        let site = null;
        let categoryId = null;
        
        for (const category of this.data.categories) {
            const found = category.websites.find(s => s.id === siteId);
            if (found) {
                site = found;
                categoryId = category.id;
                break;
            }
        }
        
        if (!site) {
            alert('网站不存在');
            return;
        }

        // 填充编辑表单
        document.getElementById('edit-site-id').value = siteId;
        document.getElementById('edit-site-name').value = site.name;
        document.getElementById('edit-site-url').value = site.url;
        
        // 填充分类选择
        const categorySelect = document.getElementById('edit-site-category');
        categorySelect.innerHTML = '';
        this.data.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            if (category.id === categoryId) {
                option.selected = true;
            }
            categorySelect.appendChild(option);
        });
        
        // 设置背景色选择器
        this.setupColorPicker(site.backgroundColor || '');
        
        // 显示模态框
        document.getElementById('edit-modal').style.display = 'block';
    }

    // 设置颜色选择器
    setupColorPicker(selectedColor) {
        const colorOptions = document.querySelectorAll('.color-option');
        const bgColorInput = document.getElementById('edit-site-bg-color');
        
        // 清除之前的选择
        colorOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        // 设置当前选择的颜色
        bgColorInput.value = selectedColor;
        
        // 高亮选中的颜色
        colorOptions.forEach(option => {
            const color = option.getAttribute('data-color');
            if (color === selectedColor) {
                option.classList.add('selected');
            }
            
            // 绑定点击事件
            option.addEventListener('click', () => {
                // 清除之前的选择
                colorOptions.forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // 设置新选择
                option.classList.add('selected');
                bgColorInput.value = color;
            });
        });
    }

    // 保存编辑的网站
    async saveEditedSite() {
        const siteId = document.getElementById('edit-site-id').value;
        const categoryId = document.getElementById('edit-site-category').value;
        const name = document.getElementById('edit-site-name').value.trim();
        const url = document.getElementById('edit-site-url').value.trim();
        const backgroundColor = document.getElementById('edit-site-bg-color').value;

        if (!name || !url) {
            alert('请填写网站名称和链接');
            return;
        }

        // 验证URL格式
        try {
            new URL(url);
        } catch (e) {
            alert('请输入有效的网站链接');
            return;
        }

        // 找到原分类和网站
        let originalCategory = null;
        let site = null;
        
        for (const category of this.data.categories) {
            const found = category.websites.find(s => s.id === siteId);
            if (found) {
                originalCategory = category;
                site = found;
                break;
            }
        }
        
        if (!site || !originalCategory) {
            alert('网站不存在');
            return;
        }

        // 如果分类改变了，需要移动网站
        if (originalCategory.id !== categoryId) {
            // 从原分类中删除
            originalCategory.websites = originalCategory.websites.filter(s => s.id !== siteId);
            
            // 添加到新分类
            const newCategory = this.data.categories.find(cat => cat.id === categoryId);
            if (newCategory) {
                site.name = name;
                site.url = url;
                site.backgroundColor = backgroundColor; // 更新背景色
                newCategory.websites.push(site);
            }
        } else {
            // 同一分类内编辑
            site.name = name;
            site.url = url;
            site.backgroundColor = backgroundColor; // 更新背景色
        }
        
        // 保存到服务器
        if (await this.saveData()) {
            this.closeModal();
            this.render();
        }
    }

    // 删除网站
    async deleteWebsite(siteId) {
        if (!confirm('确定要删除这个网站吗？')) {
            return;
        }

        // 从所有分类中删除网站
        this.data.categories.forEach(category => {
            category.websites = category.websites.filter(site => site.id !== siteId);
        });
        
        // 保存到服务器
        if (await this.saveData()) {
            this.render();
        }
    }

    // 保存数据到服务器
    async saveData() {
        try {
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.data)
            });

            if (response.ok) {
                console.log('数据保存成功');
                return true;
            } else {
                throw new Error('服务器返回错误状态');
            }
        } catch (error) {
            console.error('保存数据失败:', error);
            alert('保存失败，请检查网络连接或服务器状态');
            // 重新加载数据以保持一致性
            await this.loadData();
            return false;
        }
    }

    // 渲染所有内容
    render() {
        this.renderCategorySelect();
        this.renderCategories();
        this.bindDragEvents(); // 绑定拖动事件
        this.bindCardActionEvents(); // 绑定卡片操作事件
    }

    // 绑定拖动事件
    bindDragEvents() {
        const websiteCards = document.querySelectorAll('.website-card');
        websiteCards.forEach(card => {
            // 确保每个卡片都有拖动句柄
            let dragHandle = card.querySelector('.drag-handle');
            if (!dragHandle) {
                dragHandle = document.createElement('div');
                dragHandle.className = 'drag-handle';
                dragHandle.title = '拖动排序';
                card.appendChild(dragHandle);
            }
            
            // 设置拖动属性
            card.setAttribute('draggable', 'true');
            
            // 拖动开始事件
            card.addEventListener('dragstart', (e) => {
                this.draggedElement = card;
                this.draggedCategoryId = card.closest('.websites-grid').id.replace('websites-', '');
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                
                // 延迟添加占位符，避免初始闪烁
                setTimeout(() => {
                    if (this.draggedElement) {
                        // 创建初始占位符
                        this.createInitialPlaceholder(card);
                    }
                }, 0);
            });
            
            // 拖动结束事件
            card.addEventListener('dragend', (e) => {
                card.classList.remove('dragging');
                // 移除所有占位符
                this.clearPlaceholders();
                this.draggedElement = null;
                this.draggedCategoryId = null;
            });
            
            // 拖动到元素上时触发
            card.addEventListener('dragover', (e) => {
                this.handleDragOver(card, e);
            });
            
            // 拖动离开元素时触发
            card.addEventListener('dragleave', (e) => {
                // 不再立即移除占位符，避免闪烁
            });
            
            // 拖动放置事件
            card.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleDrop(card, e);
            });
        });
        
        // 为分类容器绑定拖动事件（处理拖动到空位置的情况）
        const websiteGrids = document.querySelectorAll('.websites-grid');
        websiteGrids.forEach(grid => {
            grid.addEventListener('dragover', (e) => {
                this.handleEmptyGridDragOver(grid, e);
            });
            
            grid.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleGridDrop(grid, e);
            });
        });
    }

    // 创建初始占位符
    createInitialPlaceholder(card) {
        // 创建占位符
        const placeholder = document.createElement('div');
        placeholder.className = 'drag-placeholder';
        placeholder.style.height = card.offsetHeight + 'px';
        placeholder.style.marginBottom = '20px';
        
        // 插入占位符到被拖动元素的原始位置
        card.parentNode.insertBefore(placeholder, card);
    }

    // 处理拖动到卡片上
    handleDragOver(card, e) {
        // 阻止默认行为
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // 只在同一分类内允许拖动
        const targetGridId = card.closest('.websites-grid').id.replace('websites-', '');
        if (targetGridId !== this.draggedCategoryId) {
            return;
        }
        
        // 如果拖动的是自己，不处理
        if (card === this.draggedElement) {
            return;
        }
        
        // 计算鼠标相对于卡片的位置
        const rect = card.getBoundingClientRect();
        const offset = e.clientY - rect.top;
        const height = rect.height;
        
        // 查找现有的占位符
        const existingPlaceholder = card.parentNode.querySelector('.drag-placeholder');
        
        // 如果占位符已经存在且位置正确，不重新创建
        if (existingPlaceholder) {
            const placeholderIndex = Array.from(card.parentNode.children).indexOf(existingPlaceholder);
            const cardIndex = Array.from(card.parentNode.children).indexOf(card);
            
            // 如果占位符已经在正确位置（在卡片前或后），不处理
            if ((placeholderIndex === cardIndex - 1 && offset < height / 2) || 
                (placeholderIndex === cardIndex + 1 && offset >= height / 2)) {
                return;
            }
        }
        
        // 清除所有现有占位符
        this.clearPlaceholders();
        
        // 创建新的占位符
        const placeholder = document.createElement('div');
        placeholder.className = 'drag-placeholder';
        placeholder.style.height = this.draggedElement.offsetHeight + 'px';
        placeholder.style.marginBottom = '20px';
        
        // 根据鼠标位置决定插入位置
        if (offset < height / 3) {
            // 插入到卡片前面
            card.parentNode.insertBefore(placeholder, card);
        } else {
            // 插入到卡片后面
            card.parentNode.insertBefore(placeholder, card.nextSibling);
        }
    }

    // 处理拖动到空网格
    handleEmptyGridDragOver(grid, e) {
        // 阻止默认行为
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // 如果网格已经有子元素（非占位符），不处理
        if (grid.children.length > 0 && !grid.querySelector('.drag-placeholder')) {
            return;
        }
        
        // 如果已经有占位符，不重复创建
        if (grid.querySelector('.drag-placeholder')) {
            return;
        }
        
        // 清除其他占位符
        this.clearPlaceholders();
        
        // 创建占位符
        const placeholder = document.createElement('div');
        placeholder.className = 'drag-placeholder';
        placeholder.style.height = this.draggedElement.offsetHeight + 'px';
        placeholder.style.marginBottom = '20px';
        grid.appendChild(placeholder);
    }

    // 处理放置事件
    handleDrop(card, e) {
        // 获取父容器
        const parentContainer = card.parentNode;
        
        // 先尝试找到占位符
        let placeholder = parentContainer.querySelector('.drag-placeholder');
        
        if (placeholder) {
            // 如果有占位符，将元素插入到占位符位置
            placeholder.parentNode.insertBefore(this.draggedElement, placeholder);
        } else {
            // 如果没有占位符，计算鼠标位置并决定插入位置
            const rect = card.getBoundingClientRect();
            const offset = e.clientY - rect.top;
            const height = rect.height;
            
            // 根据鼠标位置决定插入到卡片前还是卡片后
            if (offset < height / 2) {
                // 插入到卡片前面
                parentContainer.insertBefore(this.draggedElement, card);
            } else {
                // 插入到卡片后面
                parentContainer.insertBefore(this.draggedElement, card.nextSibling);
            }
        }
        
        // 更新数据顺序
        this.updateWebsiteOrder(this.draggedCategoryId);
        
        // 清除所有占位符
        this.clearPlaceholders();
    }

    // 处理网格放置事件
    handleGridDrop(grid, e) {
        // 找到占位符
        const placeholder = grid.querySelector('.drag-placeholder');
        if (placeholder) {
            // 移动元素到占位符位置
            placeholder.parentNode.insertBefore(this.draggedElement, placeholder);
            
            // 更新数据顺序
            this.updateWebsiteOrder(this.draggedCategoryId);
        }
        
        // 清除所有占位符
        this.clearPlaceholders();
    }

    // 清除所有占位符
    clearPlaceholders() {
        const placeholders = document.querySelectorAll('.drag-placeholder');
        placeholders.forEach(placeholder => {
            // 添加淡出效果
            placeholder.style.opacity = '0';
            placeholder.style.transition = 'opacity 0.2s ease';
            
            // 延迟移除元素
            setTimeout(() => {
                if (placeholder.parentNode) {
                    placeholder.parentNode.removeChild(placeholder);
                }
            }, 200);
        });
    }

    // 更新网站顺序
    async updateWebsiteOrder(categoryId) {
        // 找到对应的分类
        const category = this.data.categories.find(cat => cat.id === categoryId);
        if (!category) return;
        
        // 获取该分类下的所有网站卡片
        const websiteGrid = document.getElementById(`websites-${categoryId}`);
        const websiteCards = websiteGrid.querySelectorAll('.website-card');
        
        // 根据DOM顺序更新数据顺序
        const newWebsites = [];
        websiteCards.forEach(card => {
            const siteId = card.dataset.siteId;
            const site = category.websites.find(s => s.id === siteId);
            if (site) {
                newWebsites.push(site);
            }
        });
        
        // 更新分类中的网站顺序
        category.websites = newWebsites;
        
        // 保存到服务器
        await this.saveData();
    }

    // 渲染分类选择下拉框
    renderCategorySelect() {
        const select = document.getElementById('site-category');
        const editSelect = document.getElementById('edit-site-category');
        const modalSelect = document.getElementById('modal-site-category');
        
        // 清空现有选项
        if (select) select.innerHTML = '';
        if (editSelect) editSelect.innerHTML = '';
        if (modalSelect) modalSelect.innerHTML = '';
        
        // 添加所有分类
        this.data.categories.forEach(category => {
            if (select) {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            }
            
            if (editSelect) {
                const editOption = document.createElement('option');
                editOption.value = category.id;
                editOption.textContent = category.name;
                editSelect.appendChild(editOption);
            }
            
            if (modalSelect) {
                const modalOption = document.createElement('option');
                modalOption.value = category.id;
                modalOption.textContent = category.name;
                modalSelect.appendChild(modalOption);
            }
        });
    }

    // 渲染所有分类
    renderCategories() {
        const container = document.getElementById('categories-container');
        container.innerHTML = '';

        if (this.data.categories.length === 0) {
            container.innerHTML = '<p style="color: white; text-align: center;">暂无分类，请添加</p>';
            return;
        }

        this.data.categories.forEach(category => {
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            categorySection.innerHTML = `
                <div class="category-header">
                    <h2 class="category-title">${this.escapeHtml(category.name)}</h2>
                </div>
                <div class="websites-grid" id="websites-${category.id}">
                    ${category.websites.length === 0 ? 
                        '<p style="color: white; text-align: center; grid-column: 1 / -1;">该分类下暂无网站</p>' : 
                        ''}
                </div>
            `;
            container.appendChild(categorySection);

            // 渲染该分类下的网站
            const websitesContainer = document.getElementById(`websites-${category.id}`);
            if (websitesContainer && category.websites.length > 0) {
                category.websites.forEach(site => {
                    const card = document.createElement('div');
                    card.className = 'website-card';
                    card.dataset.siteId = site.id;
                    // 不再设置 draggable=true，改为通过句柄控制
                    
                    // 设置背景色
                    if (site.backgroundColor) {
                        card.style.backgroundColor = site.backgroundColor;
                    } else {
                        // 重置为默认背景色
                        card.style.backgroundColor = '';
                    }
                    
                    card.innerHTML = `
                        <div class="drag-handle" title="拖动排序"></div>
                        <div class="card-hover-area"></div>
                        <div class="card-actions">
                            <button class="action-btn edit" data-site-id="${site.id}" data-action="edit" title="编辑">✏️</button>
                            <button class="action-btn delete" data-site-id="${site.id}" data-action="delete" title="删除">❌</button>
                        </div>
                        <h3>${this.escapeHtml(site.name)}</h3>
                        <a href="${this.escapeHtml(site.url)}" target="_blank">${this.escapeHtml(site.url)}</a>
                    `;
                    websitesContainer.appendChild(card);
                });
            }
        });
        
        // 绑定操作按钮事件
        this.bindCardActionEvents();
    }

    // 绑定卡片操作按钮事件
    bindCardActionEvents() {
        // 编辑按钮事件
        const editButtons = document.querySelectorAll('.action-btn[data-action="edit"]');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const siteId = button.dataset.siteId;
                this.editWebsite(siteId);
            });
        });
        
        // 删除按钮事件
        const deleteButtons = document.querySelectorAll('.action-btn[data-action="delete"]');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const siteId = button.dataset.siteId;
                this.deleteWebsite(siteId);
            });
        });
    }

    // 新增网站动画效果
    animateNewSite(categoryId, siteId) {
        const siteCard = document.querySelector(`.website-card[data-site-id="${siteId}"]`);
        if (siteCard) {
            // 先隐藏
            siteCard.classList.add('hidden');
            
            // 然后显示动画
            setTimeout(() => {
                siteCard.classList.remove('hidden');
            }, 10);
        }
    }

    // 关闭模态框
    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // HTML转义函数，防止XSS攻击
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// 初始化应用
let navigator;
document.addEventListener('DOMContentLoaded', () => {
    navigator = new WebsiteNavigator();
});