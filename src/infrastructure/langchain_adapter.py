"""
Adaptador LangChain — la misma lógica, pero con el framework.

Este archivo muestra el contraste pedagógico del curso:

    ┌─────────────────────────────────────────────────────────────┐
    │  LO QUE HICIMOS A MANO       │  LO QUE LANGCHAIN FORMALIZA │
    ├──────────────────────────────┼─────────────────────────────┤
    │  Construir el array messages │  ChatPromptTemplate         │
    │  Inyectar historial a mano   │  MessagesPlaceholder        │
    │  Llamar al cliente del modelo│  ChatGoogleGenerativeAI     │
    │  adapter.complete(...)       │  prompt | llm | parser      │
    └─────────────────────────────────────────────────────────────┘

LangChain no hace magia — hace lo mismo que nuestros adaptadores,
pero con una API estandarizada que funciona igual para cualquier
proveedor (OpenAI, Gemini, Anthropic, DeepSeek, etc.).

El concepto clave: LCEL (LangChain Expression Language)
    chain = prompt | llm | output_parser
    chain.invoke({"pregunta": "...", "historial": [...]})
"""
import os
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from src.domain.schemas import Message
from src.infrastructure.model_factory import IModelAdapter


class LangChainGeminiAdapter(IModelAdapter):
    """
    Adaptador LangChain para Gemini.

    Implementa exactamente el mismo contrato IModelAdapter
    que GeminiAdapter — pero usa LangChain internamente.

    Esto demuestra que el Factory Pattern + IModelAdapter
    permiten intercambiar implementaciones sin cambiar nada más.
    """

    MODEL = "gemini-2.0-flash"

    def __init__(self) -> None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY no está configurada.")

        # LangChain envuelve el cliente de Gemini
        self._llm = ChatGoogleGenerativeAI(
            model=self.MODEL,
            google_api_key=api_key,
            max_output_tokens=800,
            temperature=0.3,
        )

        # PromptTemplate con historial dinámico
        # MessagesPlaceholder inyecta la lista de mensajes previos
        self._prompt = ChatPromptTemplate.from_messages([
            ("system", "{system_prompt}"),
            MessagesPlaceholder(variable_name="historial", optional=True),
            ("human", "{pregunta}"),
        ])

        # LCEL: chain = prompt | llm | parser
        # El operador | encadena los pasos del pipeline
        self._chain = self._prompt | self._llm | StrOutputParser()

    def complete(
        self,
        system_prompt: str,
        user_message: str,
        history: list[Message] | None = None,
    ) -> tuple[str, int | None]:
        """
        Misma firma que GeminiAdapter.complete() — mismo contrato.

        LangChain convierte automáticamente el historial a
        HumanMessage / AIMessage según el rol.
        """
        # Convertir historial al formato de LangChain
        lc_history = []
        if history:
            for msg in history:
                if msg.role == "user":
                    lc_history.append(HumanMessage(content=msg.content))
                else:
                    lc_history.append(AIMessage(content=msg.content))

        # Invocar la cadena — LangChain se encarga del resto
        respuesta: str = self._chain.invoke({
            "system_prompt": system_prompt,
            "historial": lc_history,
            "pregunta": user_message,
        })

        return respuesta, None


# ─── Comparación pedagógica ───────────────────────────────────────────────────
#
# NUESTRO ADAPTADOR (gemini_adapter.py):
#
#   contents = []
#   for msg in history:
#       role = "user" if msg.role == "user" else "model"
#       contents.append(types.Content(role=role, parts=[...]))
#   contents.append(types.Content(role="user", parts=[...]))
#   response = client.models.generate_content(model=..., contents=contents)
#   return response.text, None
#
#
# LANGCHAIN (este archivo):
#
#   chain = prompt | llm | parser
#   respuesta = chain.invoke({"system_prompt": ..., "historial": ..., "pregunta": ...})
#   return respuesta, None
#
#
# MISMA LÓGICA. LangChain la abstrae en:
#   - ChatPromptTemplate  → construye el array de mensajes
#   - MessagesPlaceholder → inyecta el historial
#   - LCEL (|)            → conecta los pasos
#   - StrOutputParser     → extrae el texto del response
#
# La ventaja real de LangChain aparece cuando cambias de proveedor:
# solo cambias ChatGoogleGenerativeAI por ChatOpenAI o ChatAnthropic
# y el resto del código queda IGUAL. El mismo ChatPromptTemplate,
# el mismo MessagesPlaceholder, el mismo StrOutputParser.
