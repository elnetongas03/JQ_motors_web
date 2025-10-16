import pandas as pd
import json

# Cargar Excel
excel_file = 'data/catalogo.xlsx'  # Ruta de tu Excel
df = pd.read_excel(excel_file)

# Seleccionar columnas que quieres mantener
columnas = ['codigo', 'descripcion', 'imagen']  # quitar stock
df = df[columnas]

# Reemplazar NaN de imagen por un placeholder vacío
df['imagen'] = df['imagen'].fillna("")

# Guardar como JSON
json_file = 'data/catalogo.json'  # Ruta de salida
df.to_json(json_file, orient='records', force_ascii=False, indent=4)

print(f"Archivo JSON creado: {json_file}")

