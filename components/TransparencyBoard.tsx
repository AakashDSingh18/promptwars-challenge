'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const mockData = [
    { name: 'Sector Alpha', resolved: 145, pending: 32 },
    { name: 'Sector Beta', resolved: 98, pending: 45 },
    { name: 'Sector Delta', resolved: 210, pending: 18 },
    { name: 'Sector Gamma', resolved: 76, pending: 65 },
    { name: 'Knowledge Park', resolved: 189, pending: 21 }
];

export default function TransparencyBoard() {
    return (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">Real-Time Civic Accountability</h2>
            <p className="text-gray-500 mb-6">Ward-wise grievance resolution tracking</p>

            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="resolved" fill="#10b981" />
                    <Bar dataKey="pending" fill="#f43f5e" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
