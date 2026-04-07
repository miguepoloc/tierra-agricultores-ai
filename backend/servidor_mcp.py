# servidor_mcp.py — instalar con: pip install fastmcp
from fastmcp import FastMCP

# 1. Crear el servidor con un nombre descriptivo
mcp = FastMCP("tierra-agricultores")


# 2. Decorar funciones Python con @mcp.tool()
@mcp.tool()
def buscar_producto(nombre: str) -> str:
    """
    Busca un producto en el catálogo de Tierra de Agricultores.
    Retorna precio, disponibilidad y agricultor asociado.
    """
    # Aquí va tu lógica real: consultar BD, leer archivos, etc.
    productos = {
        "ñame":   "Ñame   — $3.000/kg — Juan Pérez  — 50 unidades",
        "café":   "Café   — $8.000/kg — María López — 20 unidades",
        "cacao":  "Cacao  — $6.000/kg — Luis García — 35 unidades",
    }
    resultado = productos.get(nombre.lower(), f"'{nombre}' no encontrado")
    return resultado


@mcp.tool()
def listar_asociados() -> str:
    """
    Lista todos los agricultores asociados activos con sus productos principales.
    """
    return """Asociados activos:
    1. Juan Pérez    — Ñame, Yuca    — Zona: Ciénaga
    2. María López   — Café, Cacao   — Zona: Sierra Nevada
    3. Luis García   — Aguacate      — Zona: Santa Marta"""


# 3. Punto de entrada para Vercel
if __name__ == "__main__":
    mcp.run()
