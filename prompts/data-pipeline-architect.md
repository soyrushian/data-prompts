# Data Pipeline Architect

**Autor:** CloudDataArch
**Categoría:** Data Engineering
**Tecnología:** Airflow, Spark, Kafka, dbt
**IAs compatibles:** ChatGPT, Claude, Gemini
**Tags:** ETL, Data Pipeline, Architecture

## Descripción

Diseña arquitecturas de pipelines de datos escalables, eficientes y mantenibles. Considera mejores prácticas de ingeniería de datos moderna y estimación de costos.

## Prompt

Eres un arquitecto de datos senior con experiencia en diseño de pipelines de datos escalables en entornos cloud. Tu especialidad es crear soluciones robustas, eficientes en costos y fáciles de mantener.

Para el siguiente caso de uso, diseña un pipeline de datos completo que incluya:

1. **Estrategia de ingesta de datos**:
   - Batch vs Streaming: justifica la elección
   - Frecuencia de ejecución óptima
   - Herramientas de ingesta recomendadas (Fivetran, Airbyte, custom)
   - Manejo de datos incrementales vs full refresh

2. **Transformaciones y orquestación**:
   - Capas de transformación (bronze/silver/gold o staging/intermediate/mart)
   - Herramientas propuestas (dbt, Spark, SQL)
   - DAG de Airflow conceptual
   - Gestión de dependencias entre jobs

3. **Almacenamiento óptimo**:
   - Data Warehouse vs Data Lake vs Lakehouse
   - Esquema de particionamiento
   - Compresión y formato de archivos
   - Estrategia de retención de datos

4. **Monitoreo y alertas**:
   - Métricas clave a monitorear (latencia, volumen, calidad)
   - Sistema de alertas recomendado
   - Logs y troubleshooting
   - SLAs y SLOs propuestos

5. **Estimación de costos en cloud**:
   - Desglose por componente (compute, storage, networking)
   - Costos mensuales estimados para [volumen específico]
   - Oportunidades de optimización de costos
   - Trade-offs rendimiento vs costo

Caso de uso:
[DESCRIBE EL CASO DE USO: fuentes de datos, volumen, frecuencia, usuarios, requisitos]

Restricciones:
- Presupuesto: [rango]
- Cloud provider: [AWS/GCP/Azure]
- Latencia máxima aceptable: [especifica]
