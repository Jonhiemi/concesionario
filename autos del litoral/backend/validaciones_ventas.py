import json
import os
from datetime import date

NOMBRE_ARCHIVO = 'ventas.json' 
def leer_archivo(): 
    if os.path.exists(NOMBRE_ARCHIVO):
        archivo = open(NOMBRE_ARCHIVO, 'rt', encoding='UTF-8')
        datos = json.load(archivo)
        archivo.close()
        return datos
    else:
        return []
def guardar_archivo(datos):
    archivo = open(NOMBRE_ARCHIVO, 'wt', encoding='UTF-8')
    json.dump(datos, archivo, ensure_ascii=False, indent=2)
    archivo.close()

def pedir_numero(mensaje):
    while True:
        valor = input(mensaje)
        if valor.isnumeric():
            return int(valor)
        else:
            print('❌ Intente de nuevo ingresando un numero.')

def pedir_precio(mensaje):
    while True:
        valor = input(mensaje)
        try:
            precio = float(valor)
            if precio > 0:
                return precio
        except:
            print('❌ Ingrese un número válido.')

def pedir_opcion(mensaje, opciones):
    print(mensaje)
    for i in range(len(opciones)):
        print(f'  {i+1}. {opciones[i]}')
    while True:
        eleccion = input('Elegí una opción: ')
        if eleccion.isnumeric():
            numero = int(eleccion)
            if 1 <= numero <= len(opciones):
                return opciones[numero - 1]
        print('La opción no es válida.😕')

def proximo_id(ventas):
    if len(ventas) == 0:
        return 1
    id_mas_alto = 0
    for venta in ventas:
        if venta['id'] > id_mas_alto:
            id_mas_alto = venta['id']
    return id_mas_alto + 1

def mostrar_venta(v):
    print('══════════════════════════════════════════')
    print(f'  ID: {v['id']}')
    print(f'  Auto: {v['id_auto']}')
    print(f'  Cliente: {v['id_cliente']}')
    print(f'  Vendedor: {v['id_vendedor']}')
    print(f'  Fecha: {v['fecha']}')
    print(f'  Precio: ${v['precio_final']}')
    print(f'  Forma pago: {v['forma_pago']}')
    print(f'  Estado: {v['estado_de_pago']}')
    print('══════════════════════════════════════════')