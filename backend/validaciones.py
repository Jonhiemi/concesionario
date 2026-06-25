#es la validacion que el usuario ingrese un numero decimal

def pedir_float(mensaje):

    while True:

        dato = input(mensaje)

        if dato.upper() == "VOLVER":
            return None
#convierte el  dato que se ingresa  a float
        try:
            return float(dato)
#por si lo que se ingresa no es un numero
        except ValueError:
            print("Debe ingresar un número válido.")
#valida numero entero en kilometros y año 
            
def pedir_entero(mensaje):

    while True:

        dato = input(mensaje)

        if dato.upper() == "VOLVER":
            return None

        try:
            return int(dato)

        except ValueError:
            print("Debe ingresar un número entero válido.")
