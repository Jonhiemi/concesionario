from validaciones import leer_archivo, mostrar_venta


def ver_ventas():
    print('Lista de ventas')
    ventas = leer_archivo()  
    if len(ventas) == 0:
        print('No hay ventas disponibles.')
        return  
    for v in ventas:
        mostrar_venta(v)
    print(f'Total: {len(ventas)} ventas')