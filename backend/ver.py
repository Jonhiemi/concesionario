from validaciones_ventas import leer_archivo, mostrar_venta

def ver_ventas():
    print('══════════════════════════════════════════')
    print('           📌 Lista de ventas            ')
    print('══════════════════════════════════════════')
    ventas = leer_archivo()  
    if len(ventas) == 0:
        print('❌ No hay ventas disponibles.😕')
        return  
    for v in ventas:
        mostrar_venta(v)
    print(f'Total:▶️  {len(ventas)} ventas')