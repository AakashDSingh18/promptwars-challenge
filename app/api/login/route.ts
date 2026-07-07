import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
    try {
        const { username, password, type } = await req.json();
        const filePath = path.join(process.cwd(), 'data', 'users.json');

        // Ensure data/users.json exists
        let users = [];
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            users = JSON.parse(fileContent);
        } catch {
            // If file doesn't exist, we start with empty array
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, JSON.stringify([]));
        }

        if (type === 'signup') {
            if (users.find((u: any) => u.username === username)) {
                return NextResponse.json({ error: 'User already exists' }, { status: 400 });
            }
            users.push({ username, password });
            await fs.writeFile(filePath, JSON.stringify(users, null, 2));
            return NextResponse.json({ success: true });
        } else {
            const user = users.find((u: any) => u.username === username && u.password === password);
            if (user) {
                return NextResponse.json({ success: true });
            } else {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error occurred' }, { status: 500 });
    }
}