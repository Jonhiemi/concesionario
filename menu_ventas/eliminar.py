from validaciones import leer_archivo, guardar_archivo, pedir_numero, mostrar_venta

def eliminar_venta():
    print('Eliminar una venta')
    ventas = leer_archivo()
    
    if len(ventas) == 0:
        print('No hay ventas.')
        return   
    id_venta = pedir_numero('ID a eliminar: ')
    encontrada = None  
    for v in ventas:
        if v['id'] == id_venta:
            encontrada = v
            break   
    if encontrada is None:
        print('No se encontró.')
        return   
    mostrar_venta(encontrada)
    confirmar = input('Para eliminar ingrese si o no: ')    
    if confirmar == 'si':
        ventas.remove(encontrada)
        guardar_archivo(ventas)
        print('La venta fue eliminada.')
    else:
        print('Cancelado.')