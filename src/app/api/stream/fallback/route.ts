import { NextRequest, NextResponse } from 'next/server';
import { extractStreamingInfo } from '@/lib/api-logic/extractors/streamInfo.extractor.js';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const server = searchParams.get('server') || 'vidstreaming';
        const type = searchParams.get('type') || 'sub';

        if (!id) {
            return NextResponse.json({ success: false, message: 'Missing id parameter' }, { status: 400 });
        }

        let finalId = id.split('?')[0];
        if (id.includes('ep=')) {
            const match = id.match(/ep=(\d+)/);
            if (match) finalId = match[1];
        }

        const data = await extractStreamingInfo(finalId, server, type, true);
        return NextResponse.json({ success: true, results: data });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
