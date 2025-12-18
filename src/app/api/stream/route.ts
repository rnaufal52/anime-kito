import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing URL parameter", { status: 400 });
  }

  try {
    // Determine appropriate headers to spoof
    // Some servers require the Referer to be their own domain
    const targetUrl = new URL(url);
    const origin = targetUrl.origin;
    
    const headers = new Headers();
    headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    headers.set("Referer", origin + "/");
    headers.set("Origin", origin);

    const response = await fetch(url, {
      headers: headers,
      // Important: prevent automatic redirect following if needed, 
      // but usually for streaming links we want to follow to the final file.
      redirect: "follow", 
    });

    if (!response.ok) {
       return new NextResponse(`Failed to fetch stream: ${response.statusText}`, { status: response.status });
    }

    // Forward the headers from the source response, especially Content-Type and Content-Length
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", response.headers.get("Content-Type") || "video/mp4");
    if (response.headers.get("Content-Length")) {
        responseHeaders.set("Content-Length", response.headers.get("Content-Length")!);
    }
    responseHeaders.set("Access-Control-Allow-Origin", "*"); // Allow our frontend to access this

    // Create a readable stream from the response body
    const stream = response.body;

    return new NextResponse(stream, {
      status: 200,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
