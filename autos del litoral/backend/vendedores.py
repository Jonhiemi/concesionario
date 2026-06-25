import json
from datetime import date

vendedores = []
ventas = []
id_vendedor = 1

ARCHIV_VENDEDORES = "vendedores.json"
def guardar_datos():
    datos = {"ultimo_id": id_vendedor, "lista_vendedores": vendedores}
    with open(ARCHIV_VENDEDORES,"w") as archivo:
        json.dump(datos, archivo, indent=4)

def cargar_datos():
    global vendedores, id_vendedor
    try:
        with open(ARCHIV_VENDEDORES, "r") as archivo:
            datos = json.load(archivo)
            id_vendedor = datos.get("ultimo_id", 1)
            vendedores = datos.get("lista_vendedores",[])
    except (FileNotFoundError, json.JSONDecodeError):
        id_vendedor = 1
        vendedores = []
    
# ALTA DE VENDEDOR

def registrar_vendedor():
    global id_vendedor

    dni = input("DNI: ")
    nombre = input("Nombre completo: ")
    telefono = input("Teléfono: ")
    email = input("Email: ")

    while "@" not in email:
        email = input("Email inválido. Ingrese nuevamente: ")

    comision = float(input("Porcentaje de comisión: "))

    vendedor = {
        "id": id_vendedor,
        "dni": dni,
        "nombre_completo": nombre,
        "telefono": telefono,
        "email": email,
        "comision_porcentaje": comision,
        "fecha_ingreso": str(date.today()),
        "estado": "activo"
    }

    vendedores.append(vendedor)
    id_vendedor += 1

    print("Vendedor registrado correctamente.")
    guardar_datos()

# LISTAR VENDEDORES

def listar_vendedores():
    if len(vendedores) == 0:
        print("No hay vendedores cargados.")
        return

    for v in vendedores:
        print("----------------------------")
        print("ID:", v["id"])
        print("Nombre:", v["nombre_completo"])
        print("DNI:", v["dni"])
        print("Comisión:", v["comision_porcentaje"], "%")
        print("Estado:", v["estado"])

# BUSCAR VENDEDOR

def buscar_vendedor():
    dato = input("Ingrese DNI o nombre: ")

    for v in vendedores:
        if v["dni"] == dato or v["nombre_completo"].lower() == dato.lower():

            print("\nVendedor encontrado")
            print(v)

            total_comision = 0

            for venta in ventas:
                if venta["id_vendedor"] == v["id"]:
                    total_comision += (
                        venta["precio_final"]
                        * v["comision_porcentaje"] / 100
                    )

            print("Total de comisiones: $", total_comision)
            return

    print("Vendedor no encontrado.")

# ACTUALIZAR COMISION

def actualizar_comision():
    id_buscar = int(input("ID del vendedor: "))

    for v in vendedores:
        if v["id"] == id_buscar:
            nueva = float(input("Nueva comisión (%): "))
            v["comision_porcentaje"] = nueva
            print("Comisión actualizada.")
            guardar_datos()
            return

    print("Vendedor no encontrado.")

# BAJA DE VENDEDOR

def baja_vendedor():
    id_buscar = int(input("ID del vendedor: "))

    for v in vendedores:
        if v["id"] == id_buscar:

            confirmar = input("¿Seguro que desea darlo de baja? (S/N): ")

            if confirmar.upper() == "S":
                v["estado"] = "inactivo"
                print("Vendedor dado de baja.")
                guardar_datos()
            return

    print("Vendedor no encontrado.")

# MENU VENDEDORES

def menu_vendedores():
    cargar_datos()
    while True:

            print("\n===== VENDEDORES =====")
            print("1. Registrar vendedor")
            print("2. Listar vendedores")
            print("3. Buscar vendedor")
            print("4. Actualizar comisión")
            print("5. Dar de baja vendedor")
            print("0. Volver")

            opcion = input("Opción: ")

            if opcion == "1":
                registrar_vendedor()

            elif opcion == "2":
                listar_vendedores()

            elif opcion == "3":
                buscar_vendedor()

            elif opcion == "4":
                actualizar_comision()

            elif opcion == "5":
                baja_vendedor()

            elif opcion == "0":
                break

            else:
                print("Opción inválida.")



