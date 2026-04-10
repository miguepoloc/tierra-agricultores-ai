# Perfil: Analisis e Investigacion

Extiende las reglas base para tareas de analisis de datos, investigacion y reportes.

## Reglas Adicionales para Analisis

### Estructura de Respuesta
- Hallazgo principal primero, metodologia despues
- Tablas para comparaciones, no prosa
- Numeros exactos, no aproximaciones vagas ("aproximadamente muchos")
- Fuentes inline, no en seccion separada al final a menos que sean muchas

### Datos e Incertidumbre
- Si los datos son insuficientes: decirlo directamente en la linea 1
- Distinguir entre correlacion y causalidad explicitamente cuando aplique
- No extrapolar mas alla de lo que los datos soportan
- Intervalos de confianza o margenes de error cuando son relevantes

### Reportes
- Ejecutive summary en maximo 3 bullets
- Sin introduccion sobre "en el mundo de hoy..."
- Recomendaciones accionables, no genericas

## Template CLAUDE.md para Analisis

```markdown
## Output
- Finding first. Methodology after.
- Tables for comparisons. No prose for structured data.
- Exact numbers. No vague approximations.
- No preamble. No hollow closings.

## Analysis Rules
- Insufficient data: say so on line 1.
- Distinguish correlation from causation explicitly.
- Do not extrapolate beyond what data supports.
- Report confidence intervals when relevant.

## Reports
- Executive summary: max 3 bullets.
- No "In today's world..." intros.
- Recommendations must be actionable, not generic.

## Token Efficiency
- No redundant context.
- Every sentence earns its place.
- Short is correct unless depth is requested.

## Override Rule
User instructions always override this file.
```