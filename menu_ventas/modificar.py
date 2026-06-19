from validaciones import leer_archivo, guardar_archivo, pedir_numero, pedir_opcion

def modificar_venta():
    print('Modificar estado de venta')
    ventas = leer_archivo()
    
    if len(ventas) == 0:
        print(' No hay ventas.')
        return
    id_venta = pedir_numero('ID a modificar: ')
    encontrada = None 
    for v in ventas:
        if v['id'] == id_venta:
            encontrada = v
            break   
    if encontrada is None:
        print('❌ No se encontró.')
        return    
    print(f'Estado actual: {encontrada['estado_de_pago']}')
    nuevo = pedir_opcion('Nuevo estado:', ('cobrado', 'pendiente', 'en_cuotas'))
    encontrada['estado_de_pago'] = nuevo
    guardar_archivo(ventas)
    print(f'✅ Actualizado a: {nuevo}')