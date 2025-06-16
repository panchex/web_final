/**
 * Limpia el RUT removiendo puntos, guiones y espacios
 */
export function cleanRUT(rut: string): string {
  return rut.replace(/[.\-\s]/g, '').toUpperCase();
}

/**
 * Formatea el RUT con puntos y guión
 */
export function formatRUT(rut: string): string {
  const cleanedRUT = cleanRUT(rut);
  
  if (cleanedRUT.length < 2) return cleanedRUT;
  
  const body = cleanedRUT.slice(0, -1);
  const dv = cleanedRUT.slice(-1);
  
  // Agregar puntos cada 3 dígitos desde la derecha
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formattedBody}-${dv}`;
}

/**
 * Calcula el dígito verificador de un RUT
 */
export function calculateDV(rut: string): string {
  const cleanedRUT = cleanRUT(rut);
  const rutNumbers = cleanedRUT.replace(/[^0-9]/g, '');
  
  if (rutNumbers.length === 0) return '';
  
  let sum = 0;
  let multiplier = 2;
  
  // Calcular desde el último dígito hacia el primero
  for (let i = rutNumbers.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumbers[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  const dv = 11 - remainder;
  
  if (dv === 11) return '0';
  if (dv === 10) return 'K';
  return dv.toString();
}

/**
 * Valida si un RUT es válido
 */
export function validateRUT(rut: string): boolean {
  const cleanedRUT = cleanRUT(rut);
  
  if (cleanedRUT.length < 2) return false;
  
  const body = cleanedRUT.slice(0, -1);
  const dv = cleanedRUT.slice(-1);
  
  // Verificar que el cuerpo sean solo números
  if (!/^\d+$/.test(body)) return false;
  
  // Verificar que tenga entre 7 y 8 dígitos en el cuerpo
  if (body.length < 7 || body.length > 8) return false;
  
  // Calcular y comparar dígito verificador
  const calculatedDV = calculateDV(body);
  
  return dv === calculatedDV;
}

/**
 * Auto-completa un RUT parcial calculando el dígito verificador
 */
export function autoCompleteRUT(rutBody: string): string {
  const cleanedBody = rutBody.replace(/[^0-9]/g, '');
  
  if (cleanedBody.length < 7 || cleanedBody.length > 8) {
    return rutBody; // No auto-completar si no tiene la longitud correcta
  }
  
  const dv = calculateDV(cleanedBody);
  return formatRUT(cleanedBody + dv);
} 