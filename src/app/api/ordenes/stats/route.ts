import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://192.168.88.225:8000/api/v1';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/ordenes/stats`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying GET request to ordenes stats:', error);
    return NextResponse.json(
      { success: false, error: 'Error de conexión con el backend' },
      { status: 500 }
    );
  }
} 