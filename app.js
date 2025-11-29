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
                promises.push(
                    fetch('prompts/' + data.files[i])
                        .then(function(r) { 
                            if (!r.ok) throw new Error('Error cargando prompt');
                            return r.text(); 
                        })
                );
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
        .catch(function(error) { 
            console.error('Error cargando prompts:', error);
            document.getElementById('promptsGrid').innerHTML = 
                '<div class="empty-state"><div class="empty-icon">⚠️</div>' +
                '<h3 class="empty-title">Error al cargar prompts</h3>' +
                '<p class="empty-text">Asegúrate de que los archivos .md estén en la carpeta prompts/</p></div>';
        });
}

function parseMarkdown(content, filename) {
    var lines = content.split('\n');
    var prompt = { 
        id: filename.replace('.md', ''), 
        title: '', 
        description: '', 
        prompt: '', 
        author: '', 
        category: '', 
        technology: '', 
        aiModels: [], 
        tags: [] 
    };
    var currentSection = '';
    var contentBuffer = [];
    
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.indexOf('# ') === 0) {
            prompt.title = line.replace('# ', '').trim();
        }
        else if (line.indexOf('**Autor:**') === 0) {
            prompt.author = line.replace('**Autor:**', '').trim();
        }
        else if (line.indexOf('**Categoría:**') === 0) {
            prompt.category = line.replace('**Categoría:**', '').trim();
        }
        else if (line.indexOf('**Tecnología:**') === 0) {
            prompt.technology = line.replace('**Tecnología:**', '').trim();
        }
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
        
        var matchesSearch = !searchTerm || 
            p.title.toLowerCase().indexOf(searchTerm) !== -1 || 
            p.description.toLowerCase().indexOf(searchTerm) !== -1 || 
            p.technology.toLowerCase().indexOf(searchTerm) !== -1;
        
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
        html += '<div class="prompt-card" onclick="showPromptDetail(\'' + p.id + '\')">';
        html += '<div class="prompt-header"><h3 class="prompt-title">' + p.title + '</h3><span class="prompt-category">' + p.category + '</span></div>';
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
        html += '<button class="copy-btn" onclick="event.stopPropagation(); copyPrompt(\'' + p.id + '\', this)">📋 Copiar</button></div></div>';
    }
    grid.innerHTML = html;
}

function showPromptDetail(id) {
    for (var i = 0; i < allPrompts.length; i++) {
        if (allPrompts[i].id === id) {
            var p = allPrompts[i];
            var modal = document.createElement('div');
            modal.id = 'promptModal';
            modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;padding:2rem;z-index:1000;';
            modal.onclick = function(e) {
                if (e.target.id === 'promptModal') closeModal();
            };
            
            var modalContent = '<div style="background:#0a0020;border:1px solid rgba(1,245,156,0.3);border-radius:16px;max-width:900px;width:100%;max-height:90vh;overflow-y:auto;padding:2rem;">';
            modalContent += '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:1.5rem;">';
            modalContent += '<div><h2 style="font-size:1.75rem;font-weight:700;color:#fff;margin-bottom:0.5rem;">' + p.title + '</h2>';
            modalContent += '<div style="display:flex;gap:0.5rem;margin-bottom:1rem;">';
            modalContent += '<span style="padding:0.25rem 0.75rem;background:rgba(1,245,156,0.15);color:#01F59C;border-radius:12px;font-size:0.85rem;font-weight:600;">' + p.category + '</span>';
            modalContent += '<span style="padding:0.25rem 0.75rem;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.8);border-radius:12px;font-size:0.85rem;">' + p.technology + '</span>';
            modalContent += '</div></div>';
            modalContent += '<button onclick="closeModal()" style="padding:0.5rem;background:rgba(255,255,255,0.1);border:1px solid rgba(1,245,156,0.3);color:#fff;border-radius:8px;cursor:pointer;font-size:1.5rem;line-height:1;">×</button>';
            modalContent += '</div>';
            
            modalContent += '<div style="margin-bottom:1.5rem;"><p style="color:rgba(255,255,255,0.7);line-height:1.6;">' + p.description + '</p></div>';
            
            modalContent += '<div style="margin-bottom:1.5rem;"><div style="color:rgba(255,255,255,0.5);font-size:0.75rem;margin-bottom:0.5rem;">COMPATIBLE CON:</div><div style="display:flex;flex-wrap:wrap;gap:0.5rem;">';
            for (var j = 0; j < p.aiModels.length; j++) {
                modalContent += '<span style="padding:0.4rem 0.8rem;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.8);border-radius:8px;font-size:0.85rem;">' + p.aiModels[j] + '</span>';
            }
            modalContent += '</div></div>';
            
            modalContent += '<div style="margin-bottom:1.5rem;border-top:1px solid rgba(255,255,255,0.1);padding-top:1rem;">';
            modalContent += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">';
            modalContent += '<div style="color:rgba(255,255,255,0.5);font-size:0.85rem;font-weight:600;">PROMPT COMPLETO</div>';
            modalContent += '<button onclick="copyFullPrompt(\'' + p.id + '\', this)" style="padding:0.5rem 1rem;background:#01F59C;color:#060010;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.85rem;">📋 Copiar Prompt</button>';
            modalContent += '</div>';
            modalContent += '<pre style="background:rgba(0,0,0,0.4);border:1px solid rgba(1,245,156,0.2);border-radius:8px;padding:1.5rem;color:#fff;font-size:0.9rem;line-height:1.6;white-space:pre-wrap;overflow-x:auto;">' + escapeHtml(p.prompt) + '</pre>';
            modalContent += '</div>';
            
            modalContent += '<div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:1rem;"><div style="color:rgba(255,255,255,0.5);font-size:0.75rem;margin-bottom:0.5rem;">TAGS</div><div style="display:flex;flex-wrap:wrap;gap:0.5rem;">';
            for (var k = 0; k < p.tags.length; k++) {
                modalContent += '<span style="padding:0.4rem 0.8rem;background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.1);border-radius:8px;font-size:0.85rem;">#' + p.tags[k] + '</span>';
            }
            modalContent += '</div></div>';
            
            modalContent += '<div style="margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);font-size:0.85rem;">Creado por <span style="color:#01F59C;font-weight:600;">' + p.author + '</span></div>';
            modalContent += '</div>';
            
            modal.innerHTML = modalContent;
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            break;
        }
    }
}

function closeModal() {
    var modal = document.getElementById('promptModal');
    if (modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    }
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

function copyFullPrompt(id, btn) {
    for (var i = 0; i < allPrompts.length; i++) {
        if (allPrompts[i].id === id) {
            var prompt = allPrompts[i];
            if (navigator.clipboard) {
                navigator.clipboard.writeText(prompt.prompt);
                btn.textContent = '✅ ¡Copiado!';
                setTimeout(function() { btn.textContent = '📋 Copiar Prompt'; }, 2000);
            }
            break;
        }
    }
}

function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

document.getElementById('searchInput').addEventListener('input', applyFilters);
loadPrompts();
```

---

## 🎯 **Cómo funciona:**

1. **Subes un nuevo `.md`** a la carpeta `prompts/`
2. **GitHub Actions detecta el cambio automáticamente**
3. **Genera `prompts/index.json`** con la lista de archivos
4. **Commit automático** del index.json
5. **Tu sitio se actualiza solo** 🎉

---

## ✅ **Ventajas:**

- ✅ Solo subes archivos `.md`, nada más
- ✅ 100% automático
- ✅ Funciona en GitHub Pages
- ✅ No requiere backend
- ✅ El `index.json` se regenera siempre que cambies archivos

---

## 📦 **Estructura final:**
```
data-prompts-hub/
├── index.html
├── app.js
├── .github/
│   └── workflows/
│       └── generate-index.yml  ← Magia automática
├── prompts/
│   ├── index.json  ← Se genera solo
│   ├── prompt1.md
│   ├── prompt2.md
│   └── prompt3.md  ← Solo agregas esto
└── README.md
