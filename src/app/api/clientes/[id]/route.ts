import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://192.168.88.225:8000/api/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(`${BACKEND_URL}/clientes/${id}`);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/clientes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying PUT request:', error);
    return NextResponse.json(
      { success: false, error: 'Error de conexión con el backend' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(`${BACKEND_URL}/clientes/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying DELETE request:', error);
    return NextResponse.json(
      { success: false, error: 'Error de conexión con el backend' },
      { status: 500 }
    );
  }
} 