// ============================================================================
// data.js - Gestión de datos con localStorage
// ============================================================================

/**
 * Obtiene todos los datos de una entidad
 * @param {string} key - Clave en localStorage
 * @returns {Array} - Lista de objetos
 */
function getData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Error al leer ${key}:`, error);
        return [];
    }
}

/**
 * Guarda datos en localStorage
 * @param {string} key - Clave en localStorage
 * @param {Array} data - Datos a guardar
 */
function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error al guardar ${key}:`, error);
    }
}

/**
 * Genera un nuevo ID automático
 * @param {string} key - Clave de la entidad
 * @returns {number} - Nuevo ID
 */
function generarId(key) {
    const data = getData(key);
    if (data.length === 0) return 1;
    const maxId = Math.max(...data.map(item => item.id || item.ID || item.id_reserva));
    return maxId + 1;
}

/**
 * Elimina un elemento por ID
 * @param {string} key - Clave de la entidad
 * @param {number} id - ID a eliminar
 * @returns {boolean} - True si se eliminó
 */
function deleteById(key, id) {
    let data = getData(key);
    const filtered = data.filter(item => (item.id || item.ID || item.id_reserva) !== id);
    if (filtered.length === data.length) return false;
    saveData(key, filtered);
    return true;
}