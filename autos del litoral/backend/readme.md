Autos del Litoral_ Grupo 77 
- Modulo de Stock -Octavio Libedinsky
Descripción

Este proyecto fue desarrollado en Python para el trabajo final de Programación I.

El sistema puede ver el stock de vehículos de una concesionaria por una aplicación de consola, guardando los datos en archivos JSON.

Alta de autos.
Listado de autos.
Búsqueda de autos por patente o Id.
Modificacion de datos del auto.
Cambio de estado de un auto en venta, vendido, reservado o en el taller .
dar de baja.
kilometros que tiene el auto.
se asigna una id automaticamente.
los guarda en un formato JSON.
Datos registrados

Cada auto tiene lo siguiente :

ID
Patente
Marca
Modelo
Año
Kilómetros
Precio
Estado
Tecnologías utilizadas:
Python 3
JSON
Programación modular
Autor

Octavio Libedinsky

Desde el mismo sistema pueden generarse y guardarse las reservas que hagan los clientes. Este módulo tiene la finalidad de evitar inconvenientes en cuanto a la disponibilidad de los autos, si ya la reserva está generada otro cliente no puede hacerla sobre el mismo vehículo. También cuenta con un registro de fecha límite que vuelve a poner el auto "en venta" en caso de que no se haya concretado la venta.
En este módulo 
Desde el módulo el vendedor puede: crear una reserva, ver todas las reservas hechas, buscar una reserva en particular (con ID reserva), cancelar (vuelve a "en venta") o concretar una reserva (estado "vendido").
Cada reserva tiene 
ID reserva
ID cliente
ID auto
ID vendedor
fecha de reserva
monto de la seña
fecha límite 

ROMERO SUSANA 


Trabajo Final - Programación I Universidad Nacional de Entre Rios 
