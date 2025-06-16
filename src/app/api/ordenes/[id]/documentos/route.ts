import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://192.168.88.225:8000/api/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${BACKEND_URL}/ordenes/${params.id}/documentos`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying GET request to orden documentos:', error);
    return NextResponse.json(
      { success: false, error: 'Error de conexión con el backend' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    
    const response = await fetch(`${BACKEND_URL}/ordenes/${params.id}/documentos`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying POST request to orden documentos:', error);
    return NextResponse.json(
      { success: false, error: 'Error de conexión con el backend' },
      { status: 500 }
    );
  }
} 