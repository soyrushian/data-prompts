let allPrompts = [];
let filteredPrompts = [];
let selectedArea = 'all';
let selectedTech = 'all';
let selectedModel = 'all';

async function loadPrompts() {
    try {
        const response = await fetch('https://api.github.com/repos/soyrushian/data-prompts/contents/prompts');
        const files = await response.json();
        
        const promptPromises = files
            .filter(file => file.name.endsWith('.md'))
            .map(async file => {
                const content = await fetch(file.download_url);
                const text = await content.text();
                return parsePrompt(text, file.name);
            });
        
        allPrompts = await Promise.all(promptPromises);
        filterPrompts();
    } catch (error) {
        console.error('Error loading prompts:', error);
    }
}

function parsePrompt(content, filename) {
    const lines = content.split('\n');
    const frontmatter = {};
    let inFrontmatter = false;
    let contentStart = 0;
    
    lines.forEach((line, index) => {
        if (line.trim() === '---') {
            if (!inFrontmatter) {
                inFrontmatter = true;
            } else {
                inFrontmatter = false;
                contentStart = index + 1;
            }
        } else if (inFrontmatter) {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
                frontmatter[match[1]] = match[2].trim();
            }
        }
    });
    
    const promptContent = lines.slice(contentStart).join('\n').trim();
    
    return {
        id: filename,
        title: frontmatter.title || 'Sin título',
        area: frontmatter.area || 'general',
        tech: frontmatter.tech || 'general',
        model: frontmatter.model || 'general',
        content: promptContent,
        preview: promptContent.substring(0, 100) + '...',
        contributor: frontmatter.contributor || 'soyrushian'
    };
}

function filterPrompts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredPrompts = allPrompts.filter(prompt => {
        const matchesSearch = prompt.title.toLowerCase().includes(searchTerm) || 
                            prompt.content.toLowerCase().includes(searchTerm);
        const matchesArea = selectedArea === 'all' || prompt.area === selectedArea;
        const matchesTech = selectedTech === 'all' || prompt.tech === selectedTech;
        const matchesModel = selectedModel === 'all' || prompt.model === selectedModel;
        
        return matchesSearch && matchesArea && matchesTech && matchesModel;
    });
    
    renderPrompts();
    updateCounter();
}

function renderPrompts() {
    const grid = document.getElementById('promptsGrid');
    grid.innerHTML = '';
    
    filteredPrompts.forEach(prompt => {
        const card = document.createElement('div');
        card.className = 'prompt-card';
        card.onclick = () => showPromptModal(prompt);
        
        card.innerHTML = `
            <h3 class="prompt-title">${prompt.title}</h3>
            <p class="prompt-preview">${prompt.preview}</p>
            <div class="tags">
                <span class="tag">${prompt.area}</span>
                <span class="tag">${prompt.tech}</span>
                <span class="tag">${prompt.model}</span>
            </div>
            <div class="contributor">
                Contributed by: <a href="https://github.com/${prompt.contributor}" target="_blank">@${prompt.contributor}</a>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function showPromptModal(prompt) {
    const modal = document.getElementById('promptModal');
    document.getElementById('modalTitle').textContent = prompt.title;
    document.getElementById('modalArea').textContent = prompt.area;
    document.getElementById('modalTech').textContent = prompt.tech;
    document.getElementById('modalModel').textContent = prompt.model;
    document.getElementById('modalContent').textContent = prompt.content;
    document.getElementById('modalContributor').innerHTML = 
        `Contributed by: <a href="https://github.com/${prompt.contributor}" target="_blank">@${prompt.contributor}</a>`;
    
    modal.style.display = 'block';
}

function copyPrompt() {
    const content = document.getElementById('modalContent').textContent;
    navigator.clipboard.writeText(content);
    
    const btn = document.querySelector('.copy-btn');
    btn.textContent = '✓ Copiado';
    btn.classList.add('copied');
    
    setTimeout(() => {
        btn.textContent = 'Copiar';
        btn.classList.remove('copied');
    }, 2000);
}

function updateCounter() {
    document.getElementById('promptCounter').textContent = 
        `${filteredPrompts.length} prompts encontrados`;
}

function setFilter(type, value) {
    if (type === 'area') selectedArea = value;
    if (type === 'tech') selectedTech = value;
    if (type === 'model') selectedModel = value;
    
    document.querySelectorAll(`.filter-btn[data-type="${type}"]`).forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.filter-btn[data-type="${type}"][data-value="${value}"]`).classList.add('active');
    
    filterPrompts();
}

document.addEventListener('DOMContentLoaded', () => {
    loadPrompts();
    
    document.getElementById('searchInput').addEventListener('input', (e) => {
        document.querySelector('.clear-search').style.display = e.target.value ? 'block' : 'none';
        filterPrompts();
    });
    
    document.querySelector('.clear-search').addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        document.querySelector('.clear-search').style.display = 'none';
        filterPrompts();
    });
    
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('promptModal').style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('promptModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
