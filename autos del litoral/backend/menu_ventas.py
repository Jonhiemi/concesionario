from registrar import registrar_venta
from ver import ver_ventas
from buscar import buscar_venta
from modificar import modificar_venta
from eliminar import eliminar_venta

def menu_ventas():
    while True:
        print('══════════════════════════════════════════')
        print('     🚘      Menu de ventas     🚘      ')
        print('══════════════════════════════════════════')
        print(' 1. Registrar venta')
        print(' 2. Ver todas las ventas')
        print(' 3. Buscar venta')
        print(' 4. Modificar estado de venta')
        print(' 5. Eliminar venta')
        print(' 9. Salir de ventas')
        print('══════════════════════════════════════════') 
        opcion = input('🔸 Elige una opción: ')
        match opcion:
            case '1':
                registrar_venta()
            case '2':
                ver_ventas()
            case '3':
                buscar_venta()
            case '4':
                modificar_venta()
            case '5':
                eliminar_venta()
            case '9':
                print('🔙 Saliendo de ventas hacia menu principal')
                break
            case _:
                print('❌ La opción no es válida.😕')