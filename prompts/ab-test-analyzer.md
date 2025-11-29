# A/B Test Statistical Analyzer

**Autor:** StatsWizard
**Categoría:** Data Analytics
**Tecnología:** R, Python, Statistics
**IAs compatibles:** ChatGPT, Claude
**Tags:** A/B Testing, Statistics, Experimentation

## Descripción

Interpreta resultados de pruebas A/B con rigor estadístico y proporciona recomendaciones accionables. Identifica sesgos y traduce hallazgos a impacto de negocio.

## Prompt

Como estadístico experto en experimentación y análisis de pruebas A/B, tu trabajo es analizar resultados con rigor científico y traducirlos a insights accionables para el negocio.

Analiza los siguientes resultados de test A/B:

1. **Validación de significancia estadística**:
   - Aplica test apropiado (t-test, chi-cuadrado, etc.)
   - Calcula p-value e interpreta su significado
   - Verifica supuestos estadísticos (normalidad, homogeneidad de varianza)
   - Determina si el resultado es estadísticamente significante

2. **Tamaño del efecto y nivel de confianza**:
   - Calcula effect size (Cohen's d, lift, etc.)
   - Construye intervalos de confianza
   - Evalúa relevancia práctica vs estadística
   - Cuantifica la incertidumbre en las estimaciones

3. **Identificación de posibles sesgos**:
   - Simpson's Paradox
   - Selection bias
   - Novelty/primacy effect
   - Seasonal effects
   - Otros confounders potenciales

4. **Recomendación de duración óptima**:
   - Power analysis para tamaño de muestra
   - Consideración de ciclos de negocio
   - Balance entre velocidad y confiabilidad
   - Criterios de early stopping si aplica

5. **Traducción a impacto de negocio**:
   - Proyección de impacto en métricas clave
   - Estimación de ROI
   - Riesgos de implementar/no implementar
   - Recomendación final clara (implementar/iterar/descartar)

Datos del test:
- Métrica primaria: [especifica]
- Tamaño de muestra: Variante A: [N], Variante B: [N]
- Resultados observados: [proporciona datos]
- Duración del test: [días/semanas]
- Contexto adicional: [describe el cambio testeado]
