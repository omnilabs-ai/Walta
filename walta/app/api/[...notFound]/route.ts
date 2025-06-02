import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      message: "API endpoint not found",
      path: request.nextUrl.pathname 
    }, 
    { status: 404 }
  );
}

// Handle other HTTP methods
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      message: "API endpoint not found",
      path: request.nextUrl.pathname 
    }, 
    { status: 404 }
  );
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { 
      message: "API endpoint not found",
      path: request.nextUrl.pathname 
    }, 
    { status: 404 }
  );
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { 
      message: "API endpoint not found",
      path: request.nextUrl.pathname 
    }, 
    { status: 404 }
  );
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json(
    { 
      message: "API endpoint not found",
      path: request.nextUrl.pathname 
    }, 
    { status: 404 }
  );
} 