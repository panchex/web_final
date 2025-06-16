import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = 'http://192.168.88.225:8000/health';
    console.log('Health check: Attempting to connect to', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Agregar timeout para evitar cuelgues
      signal: AbortSignal.timeout(5000)
    });

    console.log('Health check: Response status:', response.status);

    if (!response.ok) {
      console.error('Health check: Backend returned error status:', response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Health check: Success, data:', data);
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Health check proxy error:', error);
    
    // Proporcionar más detalles del error
    let errorMessage = 'Health check failed';
    let errorDetails = 'Unknown error';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.name === 'AbortError') {
        errorDetails = 'Request timeout - Backend may be down';
      } else if (error.message.includes('fetch')) {
        errorDetails = 'Network error - Cannot reach backend server';
      } else {
        errorDetails = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        status: 'error',
        timestamp: new Date().toISOString(),
        backend_url: 'http://192.168.88.225:8000/health'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 