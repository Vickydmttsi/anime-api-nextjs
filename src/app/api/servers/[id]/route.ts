import { NextRequest, NextResponse } from 'next/server';
import { getServers } from '@/lib/api-logic/controllers/servers.controller.js';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const query = Object.fromEntries(searchParams.entries());

        // Fallback to id if ep is not in query string (though frontend usually adds it)
        if (!query.ep) query.ep = id;

        const mockReq = { query, url: req.url };

        const responseData = await getServers(mockReq);
        return NextResponse.json({ success: true, results: responseData });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
