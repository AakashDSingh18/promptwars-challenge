'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Report {
    id?: string;
    category?: string;
    severity?: string;
    location?: string;
    date?: string;
}

export default function MyComplaints() {
    const [reports, setReports] = useState<Report[]>([]);

    useEffect(() => {
        const storedReports = localStorage.getItem('smart_bharat_reports');
        if (storedReports) {
            try {
                setReports(JSON.parse(storedReports));
            } catch (e) {
                console.error('Failed to parse reports from localStorage', e);
            }
        }
    }, []);

    const getSeverityColor = (severity?: string) => {
        if (!severity) return 'bg-gray-100 text-gray-800';
        switch (severity.toLowerCase()) {
            case 'low':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'high':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="p-6 border-b border-gray-200">
                <Link href="/" className="inline-block mb-4 text-blue-600 hover:text-blue-800 font-medium">
                    &larr; Back to Home
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">My Submitted Complaints</h1>
            </div>

            <div className="p-6 overflow-x-auto">
                {reports.length === 0 ? (
                    <p className="text-gray-500 text-lg">No complaints reported yet.</p>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="p-4 text-gray-600 font-semibold">Tracking ID</th>
                                <th className="p-4 text-gray-600 font-semibold">Category</th>
                                <th className="p-4 text-gray-600 font-semibold">Severity</th>
                                <th className="p-4 text-gray-600 font-semibold">Location</th>
                                <th className="p-4 text-gray-600 font-semibold">Date</th>
                                <th className="p-4 text-gray-600 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4 text-gray-800">{report.id || 'N/A'}</td>
                                    <td className="p-4 text-gray-800">{report.category || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(report.severity)}`}>
                                            {report.severity || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-800">{report.location || 'N/A'}</td>
                                    <td className="p-4 text-gray-800">{report.date || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700">
                                            Pending
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
