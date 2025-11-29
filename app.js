var allPrompts = [];
var filteredPrompts = [];
var selectedCategory = 'all';
var selectedAI = 'all';
var categories = [
    { id: 'all', name: 'Todos', icon: '📊' },
    { id: 'Data Analytics', name: 'Data Analytics', icon: '📈' },
    { id: 'Data Engineering', name: 'Data Engineering', icon: '⚙️' },
    { id: 'Data Science', name: 'Data Science', icon: '🧠' },
    { id: 'Business Intelligence', name: 'Business Intelligence', icon: '📉' }
];
var aiModels = ['ChatGPT', 'Claude', 'Gemini', 'Copilot', 'Llama'];

function loadPrompts() {
    fetch('prompts/index.json')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            var promises = [];
            for (var i = 0; i < data.files.length; i++) {
                promises.push(fetch('prompts/' + data.files[i]).then(function(r) { return r.text(); }));
            }
            return Promise.all(promises).then(function(contents) {
                for (var j = 0; j < contents.length; j++) {
                    allPrompts.push(parseMarkdown(contents[j], data.files[j]));
                }
                filteredPrompts = allPrompts.slice();
                renderPrompts();
                renderFilters();
            });
        })
        .catch(function(error) { console.error('Error:', error); });
}

function parseMarkdown(content, filename) {
    var lines = content.split('\n');
    var prompt = { id: filename.replace('.md', ''), title: '', description: '', prompt: '', author: '', category: '', technology: '', aiModels: [], tags: [] };
    var currentSection = '';
    var contentBuffer = [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.indexOf('# ') === 0) prompt.title = line.replace('# ', '').trim();
        else if (line.indexOf('**Autor:**') === 0) prompt.author = line.replace('**Autor:**', '').trim();
        else if (line.indexOf('**Categoría:**') === 0) prompt.category = line.replace('**Categoría:**', '').trim();
        else if (line.indexOf('**Tecnología:**') === 0) prompt.technology = line.replace('**Tecnología:**', '').trim();
        else if (line.indexOf('**IAs compatibles:**') === 0) {
            var models = line.replace('**IAs compatibles:**', '').trim();
            prompt.aiModels = models.split(',').map(function(m) { return m.trim(); });
        }
        else if (line.indexOf('**Tags:**') === 0) {
            var tags = line.replace('**Tags:**', '').trim();
            prompt.tags = tags.split(',').map(function(t) { return t.trim(); });
        }
        else if (line.indexOf('## Descripción') === 0) {
            currentSection = 'description';
        }
        else if (line.indexOf('## Prompt') === 0) {
            currentSection = 'prompt';
            if (contentBuffer.length > 0) {
                prompt.description = contentBuffer.join(' ').trim();
                contentBuffer = [];
            }
        }
        else if (line.trim() && currentSection) {
            contentBuffer.push(line);
        }
    }
    if (currentSection === 'prompt' && contentBuffer.length > 0) {
        prompt.prompt = contentBuffer.join('\n').trim();
    }
    return prompt;
}

function renderFilters() {
    var categoryFilters = document.getElementById('categoryFilters');
    var catHTML = '';
    for (var i = 0; i < categories.length; i++) {
        var cat = categories[i];
        var activeClass = selectedCategory === cat.id ? 'active' : '';
        catHTML += '<button class="filter-btn ' + activeClass + '" onclick="filterByCategory(\'' + cat.id + '\')">' + cat.icon + ' ' + cat.name + '</button>';
    }
    categoryFilters.innerHTML = catHTML;
    var aiFilters = document.getElementById('aiFilters');
    var aiHTML = '<button class="ai-filter-btn ' + (selectedAI === 'all' ? 'active' : '') + '" onclick="filterByAI(\'all\')">🤖 Todas las IAs</button>';
    for (var j = 0; j < aiModels.length; j++) {
        var ai = aiModels[j];
        var aiActiveClass = selectedAI === ai ? 'active' : '';
        aiHTML += '<button class="ai-filter-btn ' + aiActiveClass + '" onclick="filterByAI(\'' + ai + '\')">' + ai + '</button>';
    }
    aiFilters.innerHTML = aiHTML;
}

function filterByCategory(categoryId) {
    selectedCategory = categoryId;
    applyFilters();
}

function filterByAI(ai) {
    selectedAI = ai;
    applyFilters();
}

function applyFilters() {
    var searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredPrompts = [];
    for (var i = 0; i < allPrompts.length; i++) {
        var p = allPrompts[i];
        var matchesSearch = !searchTerm || p.title.toLowerCase().indexOf(searchTerm) !== -1 || p.description.toLowerCase().indexOf(searchTerm) !== -1 || p.technology.toLowerCase().indexOf(searchTerm) !== -1;
        if (!matchesSearch) {
            for (var j = 0; j < p.tags.length; j++) {
                if (p.tags[j].toLowerCase().indexOf(searchTerm) !== -1) {
                    matchesSearch = true;
                    break;
                }
            }
        }
        var matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        var matchesAI = selectedAI === 'all';
        if (!matchesAI) {
            for (var k = 0; k < p.aiModels.length; k++) {
                if (p.aiModels[k] === selectedAI) {
                    matchesAI = true;
                    break;
                }
            }
        }
        if (matchesSearch && matchesCategory && matchesAI) {
            filteredPrompts.push(p);
        }
    }
    renderPrompts();
    renderFilters();
}

function renderPrompts() {
    var grid = document.getElementById('promptsGrid');
    var count = document.getElementById('resultsCount');
    count.textContent = filteredPrompts.length + ' prompts encontrados';
    if (filteredPrompts.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><h3 class="empty-title">No se encontraron prompts</h3><p class="empty-text">Intenta con otros términos de búsqueda, categorías o modelos de IA</p></div>';
        return;
    }
    var html = '';
    for (var i = 0; i < filteredPrompts.length; i++) {
        var p = filteredPrompts[i];
        html += '<div class="prompt-card"><div class="prompt-header"><h3 class="prompt-title">' + p.title + '</h3><span class="prompt-category">' + p.category + '</span></div>';
        html += '<p class="prompt-description">' + p.description + '</p>';
        html += '<div class="prompt-meta"><div class="meta-label">Tecnología:</div><div class="meta-value">' + p.technology + '</div></div>';
        html += '<div class="prompt-meta"><div class="meta-label">Compatible con:</div><div class="ai-models">';
        for (var j = 0; j < p.aiModels.length; j++) {
            html += '<span class="ai-badge">' + p.aiModels[j] + '</span>';
        }
        html += '</div></div><div class="tags">';
        for (var k = 0; k < p.tags.length; k++) {
            html += '<span class="tag">#' + p.tags[k] + '</span>';
        }
        html += '</div><div class="prompt-footer"><span class="author">por <span class="author-name">' + p.author + '</span></span>';
        html += '<button class="copy-btn" onclick="copyPrompt(\'' + p.id + '\', this)">📋 Copiar</button></div></div>';
    }
    grid.innerHTML = html;
}

function copyPrompt(id, btn) {
    for (var i = 0; i < allPrompts.length; i++) {
        if (allPrompts[i].id === id) {
            var prompt = allPrompts[i];
            if (navigator.clipboard) {
                navigator.clipboard.writeText(prompt.prompt);
                btn.textContent = '✅ ¡Copiado!';
                setTimeout(function() { btn.textContent = '📋 Copiar'; }, 2000);
            }
            break;
        }
    }
}

document.getElementById('searchInput').addEventListener('input', applyFilters);
loadPrompts();
