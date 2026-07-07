import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'complaints.json');

// Helper to ensure file exists
async function ensureFile() {
    try { await fs.access(filePath); }
    catch { await fs.writeFile(filePath, JSON.stringify([])); }
}

export async function GET() {
    await ensureFile();
    const data = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
}

export async function POST(req: Request) {
    await ensureFile();
    const newComplaint = await req.json();
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const complaints = JSON.parse(fileContent);

    complaints.push(newComplaint);
    await fs.writeFile(filePath, JSON.stringify(complaints, null, 2));

    return NextResponse.json({ success: true });
}