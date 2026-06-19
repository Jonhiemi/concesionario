from datetime import date
from validaciones import leer_archivo, guardar_archivo, pedir_numero, pedir_precio, pedir_opcion, proximo_id

def registrar_venta():
    print('Registrar nueva venta')
    ventas = leer_archivo()   
    nueva = {
        'id': proximo_id(ventas),
        'id_auto': pedir_numero('ID auto: '),
        'id_cliente': pedir_numero('ID cliente: '),
        'id_vendedor': pedir_numero('ID vendedor: '),
        'fecha': date.today().isoformat(),
        'precio_final': pedir_precio('Precio: $'),
        'forma_pago': pedir_opcion('Forma pago:', ('contado', 'financiado', 'parte_de_pago')),
        'estado_de_pago': pedir_opcion('Estado pago:', ('cobrado', 'pendiente', 'en_cuotas'))
    }  
    ventas.append(nueva)
    guardar_archivo(ventas)
    print(f'✅ Venta N°{nueva['id']} registrada')