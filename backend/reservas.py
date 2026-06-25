import json
import os
from datetime import datetime, timedelta
import clientes 
import autos

reservas = [] 

def cargar_reservas():
    global reservas

    if os.path.exists("reservas.json"):
        with open("reservas.json", "r", encoding="utf-8") as archivo:
            try:
                reservas = json.load(archivo)
            except json.JSONDecodeError:
                reservas = []
    else:
        reservas = []

def guardar_reservas():
    with open("reservas.json", "w", encoding="utf-8") as archivo:
        json.dump(reservas, archivo, indent=2, ensure_ascii=False)

def menu_reservas():
    while True:
        print("\n" + "=" * 40)
        print('  MENÚ RESERVAS')
        print("=" * 40)
        print('1. Crear reserva')
        print('2. Mostrar reserva')
        print('3. Buscar reserva')
        print('4. Cancelar reserva')
        print('5. Concretar reserva')
        print('6. Volver\n')

        opcion_menu = input('Elija la opción que desee: ')
        if opcion_menu == "1":
            crear_reserva()
        elif opcion_menu == "2":
            mostrar_reserva()
        elif opcion_menu == "3":
            buscar_reserva()
        elif opcion_menu == "4":
            cancelar_reserva()
        elif opcion_menu == "5":
            concretar_reserva()
        elif opcion_menu == "6":
            break
        else:
            print('Opción Inválida, vuelve a intentar')

def crear_reserva():  

    cargar_reservas()

    if len(reservas) > 0:
        id_reserva = reservas[-1]["id_reserva"] + 1
    else:
        id_reserva = 1
        
    while True:
        try:
            fecha_texto = input("Ingrese la fecha de reserva (DD/MM/AAAA): ")
            fecha_reserva = datetime.strptime(fecha_texto, "%d/%m/%Y")
            break
        except ValueError:
            print("Fecha inválida. Intente nuevamente")

    while True:
        try:
            monto_sena = int(input('Monto entregado por el cliente: $ '))    
            if monto_sena > 0:
                break
            print("El monto debe ser mayor a cero.")
        except ValueError:
            print("Ingrese un número válido.")
            
    dias_vigencia = 30
    fecha_limite = fecha_reserva + timedelta(days=dias_vigencia)    

    clientes.cargar_clientes()

    while True:
        try:
            id_cliente = int(input("Ingrese el ID del cliente: "))
        except ValueError:
            print("Ingrese un número válido.")
            continue

        cliente_encontrado = False

        for cliente in clientes.CLIENTES:
            if cliente["ID"] == id_cliente:
                cliente_encontrado = True
                break
    
        if cliente_encontrado:
            break

        print("No existe un cliente con es ID.")
    
    autos_disponibles = autos.cargar_datos()

    while True:
        try: 
            id_auto = int(input("Ingrese el ID del auto: "))
        except ValueError:
            print("Ingrese un número válido.")
            continue
        
        auto_encontrado = False
        auto_disponible = False

        for auto in autos_disponibles:
            if auto["id"] == id_auto:
                    
                auto_encontrado = True

                if auto["estado"] == "en venta":
                    auto_disponible = True
                else:
                    print(f"El auto no está disponible. Estado actual: {auto['estado']}")
                
                break
                    
        if auto_disponible:
            break
        
        if not auto_encontrado: 
            print("No existe un auto con ese ID.")

    reserva = {
        "id_reserva": id_reserva,
        "id_cliente": id_cliente,
        "id_auto": id_auto,
        "id_vendedor" : 1, 
        "fecha_reserva": fecha_reserva.strftime("%d/%m/%Y"),
        "monto_sena": monto_sena,
        "fecha_limite": fecha_limite.strftime("%d/%m/%Y"),
        "estado" : "Reservado"
    }

    reservas.append(reserva)
    guardar_reservas()

    for auto in autos_disponibles:
        if auto["id"] == id_auto:
            auto["estado"] = "reservado"
            break

    autos.guardar_datos(autos_disponibles)
    
    print("=" * 40)
    print("RESERVA REGISTRADA")
    
    mostrar_reserva_formateada(reserva)
    pausar()

def mostrar_reserva():
    if not reservas:
        print("=" * 40)
        print("NO HAY RESERVAS REGISTRADAS.")
        print("=" * 40)

    else:
        for reserva in reservas:
            mostrar_reserva_formateada(reserva)

        pausar()

def buscar_reserva():
    while True:
        try:
            id_buscado = int(input('Ingrese el ID de la reserva: '))
            break
        except ValueError:
            print("Ingrese un número válido.")

    for reserva in reservas:
        if reserva["id_reserva"] == id_buscado:
            print("=" * 40)
            print("RESERVA ENCONTRADA")
            
            mostrar_reserva_formateada(reserva)

            pausar()
            return 

    print("=" * 40)
    print("RESERVA NO ENCONTRADA")
    print("=" * 40)
    
    pausar()

def cancelar_reserva():
    while True:
        try:
            id_buscado = int(input('Ingrese el ID de la reserva a cancelar: '))
            break
        except ValueError:
            print("Ingrese un número válido.")

    for reserva in reservas:
        if reserva["id_reserva"] == id_buscado:
            print("=" * 40)
            print("RESERVA ENCONTRADA")

            mostrar_reserva_formateada(reserva)

            if reserva["estado"] == "Cancelado": 
                print("La reserva ya está cancelada.")
                pausar()
                return

            cancelar = input("\n ¿Desea cancelar la reserva? (Si/No): ").lower()

            if cancelar == "si":
                reserva["estado"] = "Cancelado"
                guardar_reservas()

                autos_disponibles = autos.cargar_datos()

                for auto in autos_disponibles:
                    if auto["id"] == reserva["id_auto"]:
                        auto["estado"] = "en venta"
                        break
                
                autos.guardar_datos(autos_disponibles)

                print("\n RESERVA CANCELADA CORRECTAMENTE.")
                mostrar_reserva_formateada(reserva)

            elif cancelar == "no":
                print("\nLa reserva continúa: ACTIVA")

            else:
                print('Opción inválida')

            pausar()
            return

    print("=" * 40)
    print("RESERVA NO ENCONTRADA")
    print("=" * 40)
    pausar()

def concretar_reserva():

    cargar_reservas()

    while True:
        try:
            id_buscado = int(input('Ingrese el ID de la reserva a concretar: '))
            break
        except ValueError:
            print("Ingrese un número válido.")

    for reserva in reservas:
        if reserva["id_reserva"] == id_buscado:
            print("=" * 40)
            print("RESERVA ENCONTRADA")

            mostrar_reserva_formateada(reserva)

            if reserva["estado"] == "Cancelado":
                print("No se puede concretar una reserva cancelada.")
                pausar()
                return

            if reserva["estado"] == "Concretado":
                print("La reserva ya fue concretada.")
                pausar()
                return

            concretar = input("¿Desea concretar la reserva? (Si/No): ").lower().strip()

            if concretar == "si":
                reserva["estado"] = "Concretado"
                guardar_reservas()

                autos_disponibles = autos.cargar_datos()

                for auto in autos_disponibles:
                    if auto["id"] == reserva["id_auto"]:
                        auto["estado"] = "vendido"
                        break

                autos.guardar_datos(autos_disponibles)

                print("\nRESERVA CONCRETADA CORRECTAMENTE.")
                mostrar_reserva_formateada(reserva)
            
            elif concretar == "no":
                print("\nLa reserva continúa: RESERVADA")

            else:
                print('Opción inválida')

            pausar()
            return

    print("=" * 40)
    print("RESERVA NO ENCONTRADA")
    print("=" * 40)
    pausar()

def mostrar_reserva_formateada(reserva):
    print("=" * 40)
    print()
    print(f'ID Reserva: {reserva["id_reserva"]}')
    print(f'Cliente: {reserva["id_cliente"]}')
    print(f'Auto: {reserva["id_auto"]}')
    print(f'Vendedor: {reserva["id_vendedor"]}')
    print(f'Fecha reserva: {reserva["fecha_reserva"]}')
    print(f'Monto seña: ${reserva["monto_sena"]}')
    print(f'Fecha límite: {reserva["fecha_limite"]}')
    print(f'Estado: {reserva["estado"]}')
    print()
    print("=" * 40)

def pausar():
    input(f'\n Presione ENTER para continuar...')

if __name__ == "__main__":
    cargar_reservas()
    menu_reservas()
