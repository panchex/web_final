/**
 * Limpia el número de teléfono removiendo espacios, guiones y paréntesis
 */
export function cleanPhone(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '');
}

/**
 * Formatea un número de teléfono chileno
 */
export function formatChileanPhone(phone: string): string {
  const cleanedPhone = cleanPhone(phone);
  
  // Si ya tiene +, mantenerlo
  if (cleanedPhone.startsWith('+')) {
    return cleanedPhone;
  }
  
  // Si empieza con 56, agregar +
  if (cleanedPhone.startsWith('56') && cleanedPhone.length >= 11) {
    return `+${cleanedPhone}`;
  }
  
  // Si es un número de 9 dígitos (celular chileno), agregar +56
  if (cleanedPhone.length === 9 && cleanedPhone.startsWith('9')) {
    return `+56${cleanedPhone}`;
  }
  
  // Si es un número de 8 dígitos (fijo chileno), agregar +56
  if (cleanedPhone.length === 8 && !cleanedPhone.startsWith('9')) {
    return `+56${cleanedPhone}`;
  }
  
  // Si no coincide con ningún patrón, devolver tal como está
  return cleanedPhone;
}

/**
 * Valida si un número de teléfono chileno es válido
 */
export function validateChileanPhone(phone: string): boolean {
  const cleanedPhone = cleanPhone(phone);
  
  // Remover + y código de país si existe
  let phoneNumber = cleanedPhone;
  if (phoneNumber.startsWith('+56')) {
    phoneNumber = phoneNumber.substring(3);
  } else if (phoneNumber.startsWith('56') && phoneNumber.length >= 11) {
    phoneNumber = phoneNumber.substring(2);
  }
  
  // Verificar que solo contenga números
  if (!/^\d+$/.test(phoneNumber)) {
    return false;
  }
  
  // Celular: 9 dígitos empezando con 9
  if (phoneNumber.length === 9 && phoneNumber.startsWith('9')) {
    return true;
  }
  
  // Fijo: 8 dígitos no empezando con 9
  if (phoneNumber.length === 8 && !phoneNumber.startsWith('9')) {
    return true;
  }
  
  return false;
} 