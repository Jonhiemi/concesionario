from validaciones_ventas import leer_archivo, pedir_numero, mostrar_venta

def buscar_venta():
    print('══════════════════════════════════════════')
    print('          📌 Buscar una venta 🤔         ')
    print('══════════════════════════════════════════')
    ventas = leer_archivo()  
    if len(ventas) == 0:
        print('❌ No hay ventas.😕')
        return  
    id_buscar = pedir_numero('ID a buscar: ')
    encontrada = None   
    for v in ventas:
        if v['id'] == id_buscar:
            encontrada = v
            break   
    if encontrada is None:
        print('❌ No se encontro la venta.😕')
    else:
        mostrar_venta(encontrada)