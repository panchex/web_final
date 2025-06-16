import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://192.168.88.225:8000/api/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${BACKEND_URL}/ordenes/${params.id}`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying GET request to orden:', error);
    return NextResponse.json(
      { success: false, error: 'Error de conexión con el backend' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/ordenes/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying PUT request to orden:', error);
    return NextResponse.json(
      { success: false, error: 'Error de conexión con el backend' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    
    // Si es cambio de estado, usar endpoint específico
    if (searchParams.get('action') === 'estado') {
      const response = await fetch(`${BACKEND_URL}/ordenes/${params.id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    // PATCH general
    const response = await fetch(`${BACKEND_URL}/ordenes/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying PATCH request to orden:', error);
    return NextResponse.json(
      { success: false, error: 'Error de conexión con el backend' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${BACKEND_URL}/ordenes/${params.id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying DELETE request to orden:', error);
    return NextResponse.json(
      { success: false, error: 'Error de conexión con el backend' },
      { status: 500 }
    );
  }
} 