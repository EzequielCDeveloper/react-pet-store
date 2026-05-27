# Skill Registry

Proyecto: react-pet-store
Actualizado: 2026-05-26

## User-level Skills

| Name | Description | Triggers | Location |
|------|-------------|----------|----------|
| find-docs | Documentación actualizada, referencias API y ejemplos de código para cualquier tecnología. Usar para preguntas de sintaxis, migración de versiones, configuración, debugging de librerías. | API syntax, "how do I", debugging de librería, configuración | `~/.agents/skills/find-docs/SKILL.md` |
| find-skills | Descubre e instala agent skills del ecosistema abierto. Usar cuando el usuario busca funcionalidad que podría existir como skill instalable. | "how do I do X", "find a skill for X", "is there a skill that..." | `~/.agents/skills/find-skills/SKILL.md` |
| supabase-postgres-best-practices | Optimización de rendimiento Postgres y mejores prácticas de Supabase. 8 categorías de reglas priorizadas por impacto. | SQL queries, schema design, índices, RLS, connection pooling | `~/.agents/skills/supabase-postgres-best-practices/SKILL.md` |
| customize-opencode | Editar o crear configuración de OpenCode: opencode.json, .opencode/, ~/.config/opencode/. También para agentes, subagentes, skills, plugins, MCP. | Configuración de OpenCode, agentes, reglas de permiso | Built-in |

## Project-level Skills

No se encontraron skills a nivel de proyecto.

## Project Conventions

| File | Description |
|------|-------------|
| `AGENTS.md` | Reglas de código: TypeScript estricto (no `any`), `export default`, solo Tailwind CSS, documentación en `/docs/*` (qué, por qué, para qué, dónde, cómo) |
| `docs/DESIGN.md` | Arquitectura global: React + React Router + createContext + Axios + Tailwind, estructura feature-based (`src/features/*`), capa de red en `src/api/*` |
| `docs/specs-interface-home.md` | Especificaciones de la interfaz Home: secciones dinámicas/estáticas, patrón Custom Hook, skeleton loaders, error boundaries |
