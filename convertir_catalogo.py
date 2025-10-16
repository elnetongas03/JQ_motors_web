import pandas as pd

# 📂 Ruta del archivo Excel
excel_path = "data/catalogo.xlsx"

# 📄 Ruta del archivo JSON de salida
json_path = "data/catalogo.json"

# 🔁 Leer Excel
df = pd.read_excel(excel_path)

# 🔧 Asegurar que las columnas estén en minúsculas
df.columns = [c.lower().strip() for c in df.columns]

# 💾 Exportar a JSON
df.to_json(json_path, orient="records", force_ascii=False, indent=2)

print(f"✅ Catálogo exportado correctamente a {json_path}")
