import os
import json

nivel3_path = r"C:\Users\infob\Desktop\JQ_Motors_web\catalogo\nivel3_partes"

nivel3_data = []

for carpeta in os.listdir(nivel3_path):
    carpeta_path = os.path.join(nivel3_path, carpeta)
    if os.path.isdir(carpeta_path):
        imagenes = [img for img in os.listdir(carpeta_path) if img.lower().endswith(".png")]
        # Tomamos la primera imagen como portada
        portada = imagenes[0] if imagenes else ""
        nivel3_data.append({
            "nombre": carpeta,
            "codigo": carpeta,  # Usamos el nombre de la carpeta como código
            "imagen": f"nivel3_partes/{carpeta}/{portada}"
        })

# Guardamos en JSON
with open(os.path.join(nivel3_path, "nivel3.json"), "w", encoding="utf-8") as f:
    json.dump(nivel3_data, f, ensure_ascii=False, indent=4)

print("nivel3.json generado correctamente")
