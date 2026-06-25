from menu_autos import menu_autos             # Importa los menú correspondientes a cada modulo correspondiente
from reservas import menu_reservas
from menu_ventas import menu_ventas
from clientes import menu_de_cliente    
from vendedores import menu_vendedores
def main():
    while True:  # Mantiene el programa activo hasta que el usuario elija salir
        # Muestra el menú principal
        print("************************************************")
        print("     AUTOS DEL LITORAL")
        print("************************************************")
        print("1. Autos en stock")
        print("2. Clientes")
        print("3. Ventas")
        print("4. Reservas")
        print("5. Vendedores")
        print("0. Salir")
        opcion = input("Seleccione una opción: ")
        if opcion == "1":
            menu_autos()          
        elif opcion == "2":
            menu_de_cliente()    
        elif opcion == "3":
            menu_ventas() 
        elif opcion == "4":
            menu_reservas()       
        elif opcion == "5":
            menu_vendedores()   
        elif opcion == "0":
            print("Programa finalizado")
            break 
        else:
            print("Opción inválida") 

main()

