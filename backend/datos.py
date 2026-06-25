#autos en stock

import json # maneja la lectura y escritura de archivos en formato JSON
import os #interactua con el sistema operativo

ARCHIVO = "autos.json"

def cargar_datos():
#verificar si el archivo autos.json existe en el disco antes de intentar abrirlo:
    if not os.path.exists(ARCHIVO):
        return []
# abre el archivo y carga su contenido como lista
    try:# Forzamos excepcion
        with open(ARCHIVO, "r", encoding="utf-8") as archivo:
            return json.load(archivo)

    except: # si el archivo esta vacio devuelve lista vacia
        return []
#abre el archivo en modo escritura y guarda la lista actualizada
def guardar_datos(autos):



    with open(ARCHIVO, "w", encoding="utf-8") as archivo:
        json.dump(autos, archivo, indent=4) #se le da formato al json y los guarda
