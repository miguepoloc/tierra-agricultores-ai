"""
ContextLoader — RAG simplificado.

Lee archivos .md de knowledge/ y skills/ para construir
el System Prompt completo del asistente.

Esto es RAG (Retrieval Augmented Generation) simplificado:
- Sin vector database
- Sin embeddings
- Sin búsqueda semántica
→ Solo lectura de archivos + inyección en el contexto

Para RAG completo en producción se usaría LangChain + ChromaDB o Pinecone.
"""
from pathlib import Path


class ContextLoader:
    """
    Carga el conocimiento del dominio desde archivos Markdown.

    Estructura esperada:
        skills/asistente-tienda.md   → instrucciones de comportamiento
        knowledge/*.md               → datos del dominio (productos, etc.)
    """

    def __init__(
        self,
        skills_dir: str = "skills",
        knowledge_dir: str = "knowledge",
        skill_file: str = "asistente-tienda.md",
    ) -> None:
        self._skills_dir = Path(skills_dir)
        self._knowledge_dir = Path(knowledge_dir)
        self._skill_file = skill_file

    def load_skill(self) -> str:
        """Carga las instrucciones de comportamiento del asistente."""
        path = self._skills_dir / self._skill_file
        if not path.exists():
            return "Eres un asistente útil de Tierra de Agricultores."
        return path.read_text(encoding="utf-8")

    def load_knowledge(self) -> str:
        """Carga todos los archivos .md de la carpeta knowledge/."""
        if not self._knowledge_dir.exists():
            return ""
        files = sorted(self._knowledge_dir.glob("*.md"))
        if not files:
            return ""
        return "\n\n---\n\n".join(
            f.read_text(encoding="utf-8") for f in files
        )

    def load_full_context(self) -> str:
        """
        Construye el System Prompt completo:
        [Instrucciones del asistente] + [Conocimiento del dominio]

        Este texto completo se envía como system_prompt en cada petición.
        """
        skill = self.load_skill()
        knowledge = self.load_knowledge()

        if knowledge:
            return (
                f"{skill}\n\n"
                f"## Base de conocimiento disponible:\n\n"
                f"{knowledge}"
            )
        return skill
