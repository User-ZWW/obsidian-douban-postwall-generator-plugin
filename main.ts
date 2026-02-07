import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, TFolder } from 'obsidian';

// Settings Interface
interface PosterWallSettings {
    wallTitle: string;
    wallDescription: string;
    avatarUrl: string;
    useCyberpunk: boolean;
    // Expanded Layout Settings
    defaultCardWidth: number;
    defaultGap: number;
    defaultRadius: number;
    showTitlesByDefault: boolean;
    enableEditModeByDefault: boolean;
}

const DEFAULT_SETTINGS: PosterWallSettings = {
    wallTitle: 'MY COLLECTION',
    wallDescription: 'WATCHED MEDIA LOG',
    avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Obsidian',
    useCyberpunk: true,
    defaultCardWidth: 180,
    defaultGap: 16,
    defaultRadius: 8,
    showTitlesByDefault: true,
    enableEditModeByDefault: false
}

// HTML Template Generator Function
const getHtmlTemplate = (settings: PosterWallSettings, imageCount: number, jsonContent: string) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${settings.wallTitle}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Cyberpunk Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;500;700&display=swap" rel="stylesheet">

    <style>
        :root {
            --bg-color: #050510;
            --panel-bg: rgba(10, 10, 20, 0.85);
            --card-bg: rgba(20, 20, 30, 0.6);
            --text-color: #e0e0e0;
            --accent-cyan: #00f3ff;
            --accent-pink: #ff003c;
            --accent-yellow: #fcee0a;
            --grid-line: rgba(0, 243, 255, 0.1);
        }
        
        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: 'Rajdhani', sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background-image: 
                linear-gradient(var(--grid-line) 1px, transparent 1px),
                linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
            background-size: 40px 40px;
            overflow-x: hidden;
        }

        /* Header Section */
        .cyber-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px 20px;
            background: radial-gradient(circle at top, rgba(0, 243, 255, 0.15) 0%, transparent 60%);
            margin-bottom: 20px;
            position: relative;
        }
        
        .header-content {
            text-align: center;
            position: relative;
            z-index: 2;
        }

        .user-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 3px solid var(--accent-cyan);
            box-shadow: 0 0 20px var(--accent-cyan);
            margin-bottom: 15px;
            object-fit: cover;
            background: #000;
        }

        .stats-count {
            font-family: 'Orbitron', sans-serif;
            font-size: 5rem;
            font-weight: 900;
            line-height: 1;
            color: var(--accent-cyan);
            text-shadow: 0 0 10px rgba(0, 243, 255, 0.8);
            margin: 0;
        }

        .section-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.5rem;
            letter-spacing: 4px;
            color: #fff;
            text-transform: uppercase;
            margin-top: 10px;
            position: relative;
            display: inline-block;
        }
        
        .section-desc {
            font-size: 1.2rem;
            color: var(--accent-pink);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 5px;
        }

        /* Glitch Effect */
        .glitch-text {
            position: relative;
        }
        
        .glitch-text::before, .glitch-text::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .glitch-text::before {
            left: 2px;
            text-shadow: -1px 0 var(--accent-pink);
            clip: rect(44px, 450px, 56px, 0);
            animation: glitch-anim 5s infinite linear alternate-reverse;
        }
        
        .glitch-text::after {
            left: -2px;
            text-shadow: -1px 0 var(--accent-yellow);
            clip: rect(44px, 450px, 56px, 0);
            animation: glitch-anim2 5s infinite linear alternate-reverse;
        }

        @keyframes glitch-anim {
            0% { clip: rect(12px, 9999px, 81px, 0); }
            20% { clip: rect(66px, 9999px, 2px, 0); }
            40% { clip: rect(98px, 9999px, 86px, 0); }
            60% { clip: rect(10px, 9999px, 46px, 0); }
            80% { clip: rect(48px, 9999px, 19px, 0); }
            100% { clip: rect(82px, 9999px, 5px, 0); }
        }
        
        @keyframes glitch-anim2 {
            0% { clip: rect(61px, 9999px, 52px, 0); }
            20% { clip: rect(18px, 9999px, 95px, 0); }
            40% { clip: rect(3px, 9999px, 34px, 0); }
            60% { clip: rect(85px, 9999px, 28px, 0); }
            80% { clip: rect(24px, 9999px, 4px, 0); }
            100% { clip: rect(91px, 9999px, 63px, 0); }
        }

        /* Control Panel */
        .controls {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 280px;
            background: var(--panel-bg);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 4px;
            border: 1px solid var(--grid-line);
            box-shadow: 0 0 20px rgba(0, 243, 255, 0.1);
            z-index: 1000;
            transition: transform 0.3s ease, opacity 0.3s ease;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .controls.collapsed {
            transform: translateX(120%);
            opacity: 0;
        }

        .toggle-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1001;
            background: rgba(0,0,0,0.8);
            border: 1px solid var(--accent-cyan);
            color: var(--accent-cyan);
            width: 40px;
            height: 40px;
            cursor: pointer;
            box-shadow: 0 0 10px var(--accent-cyan);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            clip-path: polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%);
        }
        
        .toggle-btn:hover { background: var(--accent-cyan); color: #000; }

        .control-group { margin-bottom: 20px; }
        .control-label {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            margin-bottom: 8px;
            color: var(--accent-cyan);
            font-family: 'Orbitron', monospace;
        }
        
        input[type="range"] {
            width: 100%;
            -webkit-appearance: none;
            background: rgba(255,255,255,0.1);
            height: 2px;
            outline: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px;
            height: 12px;
            background: var(--accent-pink);
            cursor: pointer;
            transition: transform 0.1s;
            box-shadow: 0 0 10px var(--accent-pink);
        }

        .btn {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--accent-cyan);
            background: transparent;
            color: var(--accent-cyan);
            cursor: pointer;
            font-family: 'Orbitron', monospace;
            text-transform: uppercase;
            font-size: 0.8rem;
            margin-top: 10px;
            transition: all 0.2s;
        }
        
        .btn:hover { background: var(--accent-cyan); color: #000; box-shadow: 0 0 15px var(--accent-cyan); }
        .btn-secondary { border-color: var(--accent-pink); color: var(--accent-pink); }
        .btn-secondary:hover { background: var(--accent-pink); color: #000; box-shadow: 0 0 15px var(--accent-pink); }

        /* Gallery Grid */
        .gallery-container {
            padding: 20px;
            box-sizing: border-box; 
        }
        
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(var(--card-width), 1fr));
            gap: var(--gap);
            margin: 0 auto;
            max-width: 1800px;
        }

        /* Card Styles */
        .card {
            background: var(--card-bg);
            border-radius: var(--radius);
            overflow: hidden;
            position: relative;
            box-shadow: 0 4px 6px rgba(0,0,0,0.5);
            transition: transform 0.2s, box-shadow 0.2s;
            aspect-ratio: 2/3;
            user-select: none;
            border: 1px solid transparent;
        }

        .card.interactive:hover {
            z-index: 10;
            transform: translateY(-5px) scale(1.02);
            border-color: var(--accent-cyan);
            box-shadow: 0 0 20px rgba(0, 243, 255, 0.4);
        }

        .card.dragging {
            opacity: 0.5;
            border: 2px dashed var(--accent-pink);
        }

        .card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            pointer-events: none;
        }

        .card-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.95), transparent);
            padding: 30px 10px 10px;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .card:hover .card-overlay { opacity: 1; }

        .card-title {
            color: #fff;
            font-size: 0.9rem;
            text-align: center;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 700;
            text-shadow: 0 0 5px #000;
            margin-bottom: 5px;
        }

        .card-link-input {
            width: 100%;
            background: rgba(0,0,0,0.5);
            border: 1px solid var(--accent-cyan);
            color: var(--accent-cyan);
            font-size: 0.7rem;
            padding: 4px;
            outline: none;
            font-family: monospace;
            box-sizing: border-box;
        }
        
        .card-link-btn {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0, 243, 255, 0.8);
            color: #000;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            box-shadow: 0 0 10px var(--accent-cyan);
            z-index: 5;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .card-link-btn:hover { transform: scale(1.1); }
        
        /* Edit Mode Indicators */
        .edit-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--accent-pink);
            color: #fff;
            padding: 4px 8px;
            font-size: 0.7rem;
            font-family: 'Orbitron', monospace;
            box-shadow: 0 0 10px var(--accent-pink);
            pointer-events: none;
            z-index: 5;
        }
        
        [v-cloak] { display: none; }
    </style>
    <!-- Vue 3 -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
    <!-- SortableJS -->
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
</head>
<body>

<div id="app" v-cloak>
    <!-- Custom Header -->
    <div class="cyber-header">
        <div class="header-content">
            <img class="user-avatar" src="${settings.avatarUrl}" alt="User" onerror="this.src='https://api.dicebear.com/7.x/shapes/svg?seed=ERROR'">
            
            <div class="section-desc">${settings.wallDescription}</div>
            
            <!-- Dynamic Count from Vue Data -->
            <div class="stats-count">{{ cards.length }}</div>
            
            <div class="section-title glitch-text" data-text="${settings.wallTitle}">${settings.wallTitle}</div>
        </div>
    </div>

    <!-- Toggle Button -->
    <button class="toggle-btn" @click="showControls = !showControls" title="Settings">
        <i class="fas" :class="showControls ? 'fa-times' : 'fa-cog'"></i>
    </button>

    <!-- Control Panel -->
    <div class="controls" :class="{ 'collapsed': !showControls }">
        <h2 style="margin-top:0; font-weight:300; font-family:'Orbitron'; color:var(--accent-cyan)">SYSTEM.CONFIG</h2>
        
        <div class="control-group">
            <div class="control-label">CARD.WIDTH <span>{{ settings.cardWidth }}px</span></div>
            <input type="range" v-model.number="settings.cardWidth" min="100" max="400">
        </div>

        <div class="control-group">
            <div class="control-label">GRID.GAP <span>{{ settings.gap }}px</span></div>
            <input type="range" v-model.number="settings.gap" min="0" max="100">
        </div>

        <div class="control-group">
            <div class="control-label">BORDER.RADIUS <span>{{ settings.radius }}px</span></div>
            <input type="range" v-model.number="settings.radius" min="0" max="50">
        </div>

        <hr style="border: 0; border-top: 1px solid rgba(0,243,255,0.3); margin: 20px 0;">

        <div class="control-group">
            <label class="control-label" style="cursor:pointer">
                SHOW.TITLES
                <input type="checkbox" v-model="showTitles" style="width:auto; height:auto;">
            </label>
        </div>

        <div class="control-group">
            <label class="control-label" style="cursor:pointer">
                EDIT.MODE
                <input type="checkbox" v-model="isEditMode" style="width:auto; height:auto;">
            </label>
            <p style="font-size: 0.7rem; color: #777; margin-top:5px;">Check to rearrange via Drag & Drop.</p>
        </div>

        <button class="btn" @click="exportHtml">
            <i class="fas fa-save"></i> EXPORT.HTML
        </button>
        <button class="btn btn-secondary" @click="resetSettings" style="margin-top: 10px;">
            <i class="fas fa-undo"></i> SYSTEM.RESET
        </button>
    </div>

    <!-- Gallery -->
    <div class="gallery-container" :style="containerIds">
        <div class="gallery" ref="galleryRef">
            <div 
                v-for="(card, index) in cards" 
                :key="card.id" 
                class="card"
                :class="{ 'interactive': !isEditMode }"
                :data-id="card.id"
                @click="handleCardClick(card)"
                style="cursor: pointer;"
            >
                <div v-if="isEditMode" class="edit-badge">EDIT</div>
                <div v-if="card.link && !isEditMode" class="card-link-btn" title="Watch Now">
                    <i class="fas fa-play"></i>
                </div>
                <img :src="card.src" loading="lazy" :alt="card.title">
                <div class="card-overlay" v-show="showTitles || isEditMode">
                    <div 
                        class="card-title" 
                        :contenteditable="isEditMode" 
                        @blur="updateTitle($event, index)"
                        @keydown.enter.prevent="$event.target.blur()"
                    >{{ card.title }}</div>
                    
                    <input 
                        v-if="isEditMode" 
                        type="text" 
                        class="card-link-input" 
                        placeholder="Paste URL here..."
                        v-model="card.link"
                        @blur="saveCustomData"
                        @click.stop
                    >
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    const { createApp, ref, computed, onMounted, watch, nextTick } = Vue;

    createApp({
        setup() {
            // Initial Data injected
            const initialCards = ${jsonContent};
            
            // State
            const cards = ref([]);
            const showControls = ref(false);
            const isEditMode = ref(false);
            const showTitles = ref(${settings.showTitlesByDefault});
            const galleryRef = ref(null);
            
            // Settings
            const defaultSettings = {
                cardWidth: ${settings.defaultCardWidth},
                gap: ${settings.defaultGap},
                radius: ${settings.defaultRadius}
            };
            const settings = ref({ ...defaultSettings });

            // Computed Styles
            const containerIds = computed(() => ({
                '--card-width': \`\${settings.value.cardWidth}px\`,
                '--gap': \`\${settings.value.gap}px\`,
                '--radius': \`\${settings.value.radius}px\`
            }));

            // Load Data function (Handles persistence)
            const loadData = () => {
                const savedSettings = localStorage.getItem('posterWallSettings');
                if (savedSettings) settings.value = JSON.parse(savedSettings);

                const savedTitlesPref = localStorage.getItem('posterWallShowTitles');
                if (savedTitlesPref !== null) showTitles.value = savedTitlesPref === 'true';

                const savedOrder = localStorage.getItem('posterWallOrder');
                if (savedOrder) {
                    const savedMap = JSON.parse(savedOrder); 
                    const currentMap = new Map(initialCards.map(c => [c.id, c]));
                    const newCards = [];
                    savedMap.forEach(id => {
                        if (currentMap.has(id)) {
                            newCards.push(currentMap.get(id));
                            currentMap.delete(id);
                        }
                    });
                    currentMap.forEach(card => newCards.push(card));
                    
                    const savedData = JSON.parse(localStorage.getItem('posterWallCustomData') || '{}');
                    newCards.forEach(c => {
                        if (savedData[c.id]) {
                            if (savedData[c.id].title) c.title = savedData[c.id].title;
                            if (savedData[c.id].link) c.link = savedData[c.id].link;
                        }
                    });
                    cards.value = newCards;
                } else {
                    cards.value = initialCards;
                }
            };

            // SortableJS Init
            let sortableInstance = null;
            const initSortable = () => {
                if (galleryRef.value) {
                    sortableInstance = new Sortable(galleryRef.value, {
                        animation: 150,
                        disabled: !isEditMode.value,
                        ghostClass: 'dragging',
                        onEnd: (evt) => {
                            const item = cards.value.splice(evt.oldIndex, 1)[0];
                            cards.value.splice(evt.newIndex, 0, item);
                            saveOrder();
                        }
                    });
                }
            };

            watch(isEditMode, (val) => {
                if (sortableInstance) sortableInstance.option('disabled', !val);
                if (val) showTitles.value = true; // Always show titles in edit mode
            });

            watch(showTitles, (val) => {
                localStorage.setItem('posterWallShowTitles', val);
            });

            // Persistence Methods
            const saveSettings = () => localStorage.setItem('posterWallSettings', JSON.stringify(settings.value));
            const saveOrder = () => {
                const ids = cards.value.map(c => c.id);
                localStorage.setItem('posterWallOrder', JSON.stringify(ids));
            };
            const saveCustomData = () => {
                const dataMap = {};
                cards.value.forEach(c => {
                    dataMap[c.id] = { title: c.title, link: c.link };
                });
                localStorage.setItem('posterWallCustomData', JSON.stringify(dataMap));
            };

            watch(settings, saveSettings, { deep: true });

            const updateTitle = (event, index) => {
                cards.value[index].title = event.target.textContent.trim();
                saveCustomData();
            };

            const handleCardClick = (card) => {
                if (!isEditMode.value && card.link) {
                    window.open(card.link, '_blank');
                }
            };

            const resetSettings = () => {
                settings.value = { ...defaultSettings };
                showTitles.value = ${settings.showTitlesByDefault};
                if (confirm('Reset custom order and titles too?')) {
                    localStorage.removeItem('posterWallOrder');
                    localStorage.removeItem('posterWallCustomData');
                    localStorage.removeItem('posterWallShowTitles');
                    location.reload();
                }
            };

            const exportHtml = () => {
                const htmlContent = document.documentElement.outerHTML;
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'poster-wall-cyber.html';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };

            onMounted(() => {
                loadData();
                nextTick(() => initSortable());
            });

            return {
                cards, settings, showControls, isEditMode, showTitles, containerIds,
                updateTitle, saveCustomData, handleCardClick, resetSettings, exportHtml, galleryRef
            };
        }
    }).mount('#app');
</script>
</body>
</html>
`;

export default class PosterWallPlugin extends Plugin {
    settings: PosterWallSettings;

    async onload() {
        await this.loadSettings();
        this.addCommand({
            id: 'generate-poster-wall',
            name: 'Generate Poster Wall for Current Folder',
            callback: () => this.generatePosterWall()
        });
        this.registerEvent(
            this.app.workspace.on("file-menu", (menu, file) => {
                if (file instanceof TFolder) {
                    menu.addItem((item) => {
                        item.setTitle("Generate Poster Wall")
                            .setIcon("zap")
                            .onClick(async () => await this.generatePosterWallForFolder(file));
                    });
                }
            })
        );
        this.addSettingTab(new PosterWallSettingTab(this.app, this));
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async generatePosterWall() {
        const file = this.app.workspace.getActiveFile();
        if (file && file.parent) {
            await this.generatePosterWallForFolder(file.parent);
        } else {
            new Notice('No active file found.');
        }
    }

    async generatePosterWallForFolder(folder: TFolder) {
        new Notice(`Generating ${folder.name} Poster Wall...`);
        try {
            const images = [];
            const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
            const getName = (name: string) => name.substring(0, name.lastIndexOf('.'));
            for (const child of folder.children) {
                if (child instanceof TFile && validExtensions.includes(child.extension.toLowerCase())) {
                    images.push({
                        id: child.name,
                        src: encodeURIComponent(child.name),
                        title: getName(child.name),
                        link: ''
                    });
                }
            }
            if (images.length === 0) {
                new Notice('No images found.');
                return;
            }
            const finalHtml = getHtmlTemplate(this.settings, images.length, JSON.stringify(images));
            const outputPath = `${folder.path}/poster-wall.html`;
            const existingFile = this.app.vault.getAbstractFileByPath(outputPath);
            if (existingFile instanceof TFile) {
                await this.app.vault.modify(existingFile, finalHtml);
            } else {
                await this.app.vault.create(outputPath, finalHtml);
            }
            new Notice('Poster Wall Generated!');
        } catch (error) {
            console.error(error);
            new Notice('Error generating wall.');
        }
    }
}

class PosterWallSettingTab extends PluginSettingTab {
    plugin: PosterWallPlugin;
    constructor(app: App, plugin: PosterWallPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Poster Wall Generator - Settings' });

        containerEl.createEl('h3', { text: 'Header Info' });
        new Setting(containerEl).setName('Wall Title').addText(text => text.setValue(this.plugin.settings.wallTitle).onChange(async (v) => { this.plugin.settings.wallTitle = v; await this.plugin.saveSettings(); }));
        new Setting(containerEl).setName('Description').addText(text => text.setValue(this.plugin.settings.wallDescription).onChange(async (v) => { this.plugin.settings.wallDescription = v; await this.plugin.saveSettings(); }));
        new Setting(containerEl).setName('Avatar URL').addText(text => text.setValue(this.plugin.settings.avatarUrl).onChange(async (v) => { this.plugin.settings.avatarUrl = v; await this.plugin.saveSettings(); }));

        containerEl.createEl('h3', { text: 'Default Layout' });
        new Setting(containerEl).setName('Card Width').setDesc('Width of each poster in pixels').addSlider(slider => slider.setLimits(100, 400, 10).setValue(this.plugin.settings.defaultCardWidth).setDynamicTooltip().onChange(async (v) => { this.plugin.settings.defaultCardWidth = v; await this.plugin.saveSettings(); }));
        new Setting(containerEl).setName('Spacing (Gap)').setDesc('Gap between posters').addSlider(slider => slider.setLimits(0, 100, 2).setValue(this.plugin.settings.defaultGap).setDynamicTooltip().onChange(async (v) => { this.plugin.settings.defaultGap = v; await this.plugin.saveSettings(); }));
        new Setting(containerEl).setName('Corner Radius').setDesc('Roundness of corners').addSlider(slider => slider.setLimits(0, 50, 1).setValue(this.plugin.settings.defaultRadius).setDynamicTooltip().onChange(async (v) => { this.plugin.settings.defaultRadius = v; await this.plugin.saveSettings(); }));

        containerEl.createEl('h3', { text: 'Features' });
        new Setting(containerEl).setName('Show Titles by Default').addToggle(toggle => toggle.setValue(this.plugin.settings.showTitlesByDefault).onChange(async (v) => { this.plugin.settings.showTitlesByDefault = v; await this.plugin.saveSettings(); }));
        new Setting(containerEl).setName('Enable Edit Mode by Default').addToggle(toggle => toggle.setValue(this.plugin.settings.enableEditModeByDefault).onChange(async (v) => { this.plugin.settings.enableEditModeByDefault = v; await this.plugin.saveSettings(); }));
    }
}
