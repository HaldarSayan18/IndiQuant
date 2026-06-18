import { NextResponse } from 'next/server';

export function proxy(request) {
    const path = request.nextUrl.pathname;
    const tokenVal = request.cookies.get('token')?.value || '';

    if (path === '/login' && tokenVal) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    const isPrivatePath =
        path.startsWith('/dashboard/portfolio') ||
        path.startsWith('/dashboard/alerts') ||
        path.startsWith('/dashboard/orders') ||
        path.startsWith('/dashboard/ai-picks') ||
        path.startsWith('/dashboard/settings');

    // if (isPublicPath && tokenVal) {
    //     return NextResponse.redirect(new URL('/settings', request.url))
    // }
    if (isPrivatePath && !tokenVal) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next();
}

// See matching paths
export const config = {
    matcher: [
        '/',
        '/login',
        '/dashboard/:path*',
    ],
}