import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://192.168.88.225:8000/api/v1';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // Validar que se proporcionen filtros obligatorios en producción
    const hasFilters = searchParams.has('search') || 
                      searchParams.has('estado') || 
                      searchParams.has('cliente_id') || 
                      searchParams.has('tecnico_id');
    
    if (!hasFilters && process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'FILTER_REQUIRED',
          message: 'Debe proporcionar al menos un criterio de búsqueda',
          details: "Use 'search', 'estado', 'cliente_id' o 'tecnico_id'"
        }
      }, { status: 400 });
    }
    
    const url = `${BACKEND_URL}/ordenes/${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying GET request to ordenes:', error);
    return NextResponse.json(
      { success: false, error: 'Error de conexión con el backend' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/ordenes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying POST request to ordenes:', error);
    return NextResponse.json(
      { success: false, error: 'Error de conexión con el backend' },
      { status: 500 }
    );
  }
} 