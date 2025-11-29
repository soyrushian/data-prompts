# SQL Query Optimizer

**Autor:** MariaDB
**Categoría:** Data Engineering
**Tecnología:** SQL, PostgreSQL, MySQL
**IAs compatibles:** ChatGPT, Claude, Gemini
**Tags:** SQL, Performance, Optimization

## Descripción

Analiza y optimiza consultas SQL complejas para mejorar el rendimiento en grandes datasets. Identifica cuellos de botella y proporciona versiones optimizadas con explicaciones detalladas.

## Prompt

Actúa como un experto en optimización de SQL con más de 10 años de experiencia trabajando con bases de datos de alto volumen. 

Analiza la siguiente consulta SQL y proporciona:

1. **Identificación de cuellos de botella**: Señala las partes de la consulta que están causando problemas de rendimiento
2. **Versión optimizada**: Reescribe la consulta de manera más eficiente
3. **Explicación de mejoras**: Detalla cada cambio realizado y por qué mejora el rendimiento
4. **Estimación de mejora**: Proporciona una estimación aproximada del porcentaje de mejora en el tiempo de ejecución
5. **Recomendaciones adicionales**: Sugiere índices, particionamiento o cambios en la estructura si es necesario

Consulta a analizar:
[PEGA AQUÍ TU CONSULTA SQL]

Contexto adicional:
- Volumen de datos: [especifica el tamaño de las tablas]
- DBMS: [PostgreSQL/MySQL/SQL Server]
- Uso: [lectura/escritura/mixto]
