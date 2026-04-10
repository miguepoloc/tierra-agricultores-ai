# Perfil: Agentes y Automatizacion

Extiende las reglas base con comportamiento optimo para pipelines multi-agente.

## Reglas Adicionales para Agentes

### Output de Herramientas
- Output de tool calls: solo lo relevante para el siguiente paso
- Sin resumenes de lo que hizo la herramienta a menos que fallen
- Si una herramienta falla: reportar el error exacto, no parafrasearlo

### Coordinacion Multi-Agente
- Estado de la tarea en la primera linea de cada respuesta
- Sin repetir contexto que el agente orquestador ya tiene
- Usar formato estructurado (JSON o YAML) para pasar estado entre agentes
- Nunca asumir el estado de otro agente; verificar explicitamente

### Loops y Reintentos
- Si una accion falla: reportar, no reintentar silenciosamente
- Maximo 3 reintentos antes de escalar al usuario
- No inventar workarounds no pedidos

## Template CLAUDE.md para Agentes

```markdown
## Agent Behavior
- State task status on line 1 of every response.
- Tool output: relevant data only. Skip summaries unless tools fail.
- No context repetition between agent steps.
- Use structured format (JSON/YAML) for state handoffs.
- Never assume other agent state; verify explicitly.
- On failure: report exact error, do not paraphrase.
- Max 3 retries before escalating to user.

## Output
- No preamble. No closings. Answer is line 1.
- Structured output only. No prose.
- Every token must carry information.

## File Rules
- Never read the same file twice.
- Cache context within session.

## Scope
- Do not take actions beyond the assigned task.
- Do not modify shared state without explicit instruction.

## Override Rule
User instructions always override this file.
```