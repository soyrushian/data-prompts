# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Data Prompts Hub! Este documento te guiará a través del proceso.

## 📋 Antes de Contribuir

- Revisa los prompts existentes para evitar duplicados
- Asegúrate de que tu prompt esté enfocado en el área de datos
- Prueba tu prompt con al menos una IA antes de enviarlo

## 🔧 Proceso de Contribución

### 1. Prepara tu entorno
```bash
# Fork el repositorio desde GitHub

# Clona tu fork
git clone https://github.com/TU-USUARIO/data-prompts-hub.git
cd data-prompts-hub

# Crea una nueva rama
git checkout -b add-prompt-nombre-descriptivo
```

### 2. Crea tu archivo de prompt

Crea un nuevo archivo `.md` en la carpeta `prompts/` con un nombre descriptivo en kebab-case:

Ejemplo: `prompts/excel-to-python-converter.md`

### 3. Usa la plantilla requerida
```markdown
# Título del Prompt

**Autor:** TuNombre o TuUsuarioDeGitHub
**Categoría:** [Elige UNA: Data Analytics | Data Engineering | Data Science | Business Intelligence]
**Tecnología:** Lista las herramientas/lenguajes relevantes separados por comas
**IAs compatibles:** Lista las IAs con las que probaste el prompt
**Tags:** Máximo 5 tags separados por comas

## Descripción

Una descripción clara y concisa (2-3 oraciones) de:
- Qué hace el prompt
- Cuándo usarlo
- Qué problema resuelve

## Prompt

[El prompt completo aquí. Debe ser:]
- Claro y específico
- Bien estructurado
- Con placeholders claros entre [CORCHETES] o {llaves}
- Probado al menos una vez
```

### 4. Actualiza el índice

Agrega el nombre de tu archivo a `prompts/index.json`:
```json
{
  "files": [
    "sql-query-optimizer.md",
    "tu-nuevo-prompt.md"  <-- Agregar aquí
  ]
}
```

### 5. Commit y Push
```bash
git add prompts/tu-nuevo-prompt.md prompts/index.json
git commit -m "Add: [Nombre descriptivo del prompt]"
git push origin add-prompt-nombre-descriptivo
```

### 6. Crea un Pull Request

- Ve a tu fork en GitHub
- Haz clic en "New Pull Request"
- Describe tu prompt brevemente
- Espera la revisión

## ✅ Checklist antes de enviar

- [ ] El archivo `.md` sigue la plantilla requerida
- [ ] Todos los campos obligatorios están completos
- [ ] El prompt fue probado con al menos una IA
- [ ] El nombre del archivo está en kebab-case
- [ ] Se actualizó `prompts/index.json`
- [ ] No hay errores de ortografía graves
- [ ] El prompt es original o tiene atribución adecuada

## 🎯 Qué hace un buen prompt

### ✅ Buenos prompts

- Son específicos y accionables
- Incluyen contexto y ejemplos
- Tienen estructura clara
- Resuelven problemas reales
- Son reutilizables con modificaciones mínimas

### ❌ Evita

- Prompts demasiado genéricos
- Instrucciones ambiguas
- Falta de contexto
- Prompts no probados
- Contenido copiado sin atribución

## 📝 Ejemplo de buen commit message
```
Add: Python DataFrame Performance Optimizer

- Optimizes pandas operations
- Includes memory profiling
- Compatible with ChatGPT and Claude
```

## 🐛 Reportar Problemas

Si encuentras un prompt que no funciona bien:

1. Abre un [Issue](https://github.com/TU-USUARIO/data-prompts-hub/issues)
2. Incluye:
   - Nombre del prompt
   - IA utilizada
   - Problema encontrado
   - Ejemplo del resultado no esperado

## 🙋‍♀️ ¿Preguntas?

Si tienes dudas sobre el proceso de contribución:
- Abre un [Issue](https://github.com/TU-USUARIO/data-prompts-hub/issues) con tu pregunta
- Menciona `@TU-USUARIO` en la conversación

## 🌟 Reconocimientos

Todos los contribuyentes serán reconocidos en el README principal.

---

¡Gracias por ayudar a hacer crecer esta comunidad!
