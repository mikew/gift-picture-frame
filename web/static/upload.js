class UploadManager {
    constructor() {
        this.selectedFiles = [];
        this.frameId = window.location.pathname.split('/')[1];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadRecentUploads();
        this.updateTextPreview();
    }

    setupEventListeners() {
        // File upload elements
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        const uploadFilesBtn = document.getElementById('upload-files-btn');

        // Text upload elements
        const textInput = document.getElementById('text-input');
        const textColor = document.getElementById('text-color');
        const bgColor = document.getElementById('bg-color');
        const fontSize = document.getElementById('font-size');
        const uploadTextBtn = document.getElementById('upload-text-btn');

        // File upload events
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        uploadFilesBtn.addEventListener('click', this.uploadFiles.bind(this));

        // Text upload events
        textInput.addEventListener('input', this.updateTextPreview.bind(this));
        textColor.addEventListener('change', this.updateTextPreview.bind(this));
        bgColor.addEventListener('change', this.updateTextPreview.bind(this));
        fontSize.addEventListener('change', this.updateTextPreview.bind(this));
        uploadTextBtn.addEventListener('click', this.uploadText.bind(this));
    }

    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(tabName + '-tab').classList.add('active');
        event.target.classList.add('active');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        this.addFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.addFiles(files);
    }

    addFiles(files) {
        files.forEach(file => {
            if (this.isValidFile(file)) {
                this.selectedFiles.push(file);
            }
        });
        this.updateFileList();
        this.updateUploadButton();
    }

    isValidFile(file) {
        const validTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'video/mp4', 'video/avi', 'video/mov', 'video/webm'
        ];
        return validTypes.includes(file.type);
    }

    updateFileList() {
        const fileList = document.getElementById('file-list');
        fileList.innerHTML = '';

        this.selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';

            const preview = this.createFilePreview(file);
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';

            const fileName = document.createElement('div');
            fileName.className = 'file-name';
            fileName.textContent = file.name;

            const fileSize = document.createElement('div');
            fileSize.className = 'file-size';
            fileSize.textContent = this.formatFileSize(file.size);

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-file';
            removeBtn.textContent = 'Remove';
            removeBtn.onclick = () => this.removeFile(index);

            fileInfo.appendChild(fileName);
            fileInfo.appendChild(fileSize);
            fileItem.appendChild(preview);
            fileItem.appendChild(fileInfo);
            fileItem.appendChild(removeBtn);
            fileList.appendChild(fileItem);
        });
    }

    createFilePreview(file) {
        const preview = document.createElement('div');
        
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.onload = () => URL.revokeObjectURL(img.src);
            preview.appendChild(img);
        } else {
            const icon = document.createElement('div');
            icon.textContent = '🎬';
            icon.style.fontSize = '2rem';
            icon.style.width = '50px';
            icon.style.height = '50px';
            icon.style.display = 'flex';
            icon.style.alignItems = 'center';
            icon.style.justifyContent = 'center';
            icon.style.background = '#f0f0f0';
            icon.style.borderRadius = '5px';
            preview.appendChild(icon);
        }
        
        return preview;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.updateFileList();
        this.updateUploadButton();
    }

    updateUploadButton() {
        const uploadBtn = document.getElementById('upload-files-btn');
        uploadBtn.disabled = this.selectedFiles.length === 0;
    }

    updateTextPreview() {
        const textInput = document.getElementById('text-input');
        const textColor = document.getElementById('text-color');
        const bgColor = document.getElementById('bg-color');
        const fontSize = document.getElementById('font-size');
        const preview = document.getElementById('text-preview');
        const previewText = document.getElementById('preview-text');

        const text = textInput.value || 'Your message will appear here...';
        
        preview.style.background = bgColor.value;
        previewText.style.color = textColor.value;
        previewText.style.fontSize = fontSize.value + 'px';
        previewText.textContent = text;
    }

    async uploadFiles() {
        if (this.selectedFiles.length === 0) return;

        const uploadBtn = document.getElementById('upload-files-btn');
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';

        try {
            for (let i = 0; i < this.selectedFiles.length; i++) {
                const file = this.selectedFiles[i];
                await this.uploadSingleFile(file, i + 1, this.selectedFiles.length);
            }

            this.showStatus('All files uploaded successfully!', 'success');
            this.selectedFiles = [];
            this.updateFileList();
            this.loadRecentUploads();
        } catch (error) {
            this.showStatus('Upload failed: ' + error.message, 'error');
        } finally {
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload Files';
        }
    }

    async uploadSingleFile(file, current, total) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/${this.frameId}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }

        this.showStatus(`Uploaded ${current}/${total}: ${file.name}`, 'info');
    }

    async uploadText() {
        const textInput = document.getElementById('text-input');
        const textColor = document.getElementById('text-color');
        const bgColor = document.getElementById('bg-color');
        const fontSize = document.getElementById('font-size');

        if (!textInput.value.trim()) {
            this.showStatus('Please enter some text', 'error');
            return;
        }

        const uploadBtn = document.getElementById('upload-text-btn');
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';

        try {
            const formData = new FormData();
            const textData = {
                content: textInput.value,
                color: textColor.value,
                background: bgColor.value,
                fontSize: fontSize.value
            };
            formData.append('text', JSON.stringify(textData));

            const response = await fetch(`/${this.frameId}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            this.showStatus('Text message uploaded successfully!', 'success');
            textInput.value = '';
            this.updateTextPreview();
            this.loadRecentUploads();
        } catch (error) {
            this.showStatus('Upload failed: ' + error.message, 'error');
        } finally {
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload Text';
        }
    }

    showStatus(message, type) {
        const status = document.getElementById('upload-status');
        status.textContent = message;
        status.className = `upload-status ${type}`;
        status.style.display = 'block';

        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }

    async loadRecentUploads() {
        try {
            const response = await fetch(`/${this.frameId}/media`);
            if (!response.ok) throw new Error('Failed to load recent uploads');

            const media = await response.json();
            this.displayRecentUploads(media);
        } catch (error) {
            console.error('Failed to load recent uploads:', error);
            document.getElementById('recent-list').innerHTML = '<p>Failed to load recent uploads</p>';
        }
    }

    displayRecentUploads(media) {
        const recentList = document.getElementById('recent-list');
        
        if (media.length === 0) {
            recentList.innerHTML = '<p>No uploads yet</p>';
            return;
        }

        recentList.innerHTML = '';
        media.slice(-12).reverse().forEach(item => {
            const recentItem = document.createElement('div');
            recentItem.className = 'recent-item';

            if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = `/files/${item.filename}`;
                img.alt = item.filename;
                recentItem.appendChild(img);
            } else if (item.type === 'video') {
                const icon = document.createElement('div');
                icon.textContent = '🎬';
                icon.style.fontSize = '3rem';
                icon.style.height = '100px';
                icon.style.display = 'flex';
                icon.style.alignItems = 'center';
                icon.style.justifyContent = 'center';
                icon.style.background = '#f0f0f0';
                icon.style.borderRadius = '5px';
                recentItem.appendChild(icon);
            } else if (item.type === 'text') {
                const textDiv = document.createElement('div');
                textDiv.textContent = '📝';
                textDiv.style.fontSize = '3rem';
                textDiv.style.height = '100px';
                textDiv.style.display = 'flex';
                textDiv.style.alignItems = 'center';
                textDiv.style.justifyContent = 'center';
                textDiv.style.background = '#f0f0f0';
                textDiv.style.borderRadius = '5px';
                recentItem.appendChild(textDiv);
            }

            const itemType = document.createElement('div');
            itemType.className = 'item-type';
            itemType.textContent = item.type.toUpperCase();

            const itemName = document.createElement('div');
            itemName.className = 'item-name';
            itemName.textContent = item.filename || 'Text Message';

            recentItem.appendChild(itemType);
            recentItem.appendChild(itemName);
            recentList.appendChild(recentItem);
        });
    }
}

// Global function for tab switching
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

// Initialize the upload manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new UploadManager();
});