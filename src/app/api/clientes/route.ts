import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://192.168.88.225:8000/api/v1';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/clientes/${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying GET request:', error);
    return NextResponse.json(
      { success: false, error: 'Error de conexión con el backend' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/clientes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying POST request:', error);
    return NextResponse.json(
      { success: false, error: 'Error de conexión con el backend' },
      { status: 500 }
    );
  }
} 