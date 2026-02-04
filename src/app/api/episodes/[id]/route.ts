import { NextRequest, NextResponse } from 'next/server';
import { getEpisodes } from '@/lib/api-logic/controllers/episodeList.controller.js';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const mockReq = { params: { id }, url: req.url };

        const responseData = await getEpisodes(mockReq, {});
        return NextResponse.json({ success: true, results: responseData });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
