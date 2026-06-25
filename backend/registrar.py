from datetime import date
from validaciones_ventas import leer_archivo, guardar_archivo, pedir_numero, pedir_precio, pedir_opcion, proximo_id

def registrar_venta():
    print('══════════════════════════════════════════')
    print('       📌 Registrar nueva venta          ')
    print('══════════════════════════════════════════')
    ventas = leer_archivo()   
    nueva = {
        'id': proximo_id(ventas),
        'id_auto': pedir_numero('🆔 auto: '),
        'id_cliente': pedir_numero('🆔 cliente: '),
        'id_vendedor': pedir_numero('🆔 vendedor: '),
        'fecha': date.today().isoformat(),
        'precio_final': pedir_precio('Precio: 💲'),
        'forma_pago': pedir_opcion('Forma pago:', ('Contado', 'Financiado', 'Parte_de_pago')),
        'estado_de_pago': pedir_opcion('Estado pago:', ('Cobrado', 'Pendiente', 'En_cuotas'))
    }  
    ventas.append(nueva)
    guardar_archivo(ventas)
    print(f'Venta N° {nueva['id']} registrada✔️')