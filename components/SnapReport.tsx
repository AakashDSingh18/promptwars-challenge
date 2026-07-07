'use client';

import React, { useState, useRef } from 'react';

type AIResponse = {
    category?: string;
    severity?: string;
    formalDraft?: string;
};

export default function SnapReport() {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [trackingId, setTrackingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            handleFile(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            handleFile(file);
        }
    };

    const handleFile = (file: File) => {
        if (file.type.startsWith('image/')) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setAiResponse(null);
            setLocation(null);
            setIsSubmitted(false);
            setTrackingId(null);
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
        setAiResponse(null);
        setLocation(null);
        setIsSubmitted(false);
        setTrackingId(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const fetchLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(`Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`);
                },
                (error) => {
                    setLocation('Location unavailable');
                }
            );
        } else {
            setLocation('Location unavailable');
        }
    };

    const handleSubmitReport = async () => {
        const currentUser = localStorage.getItem('currentUser');
        const newReport = {
            id: 'SB-' + Math.floor(100000 + Math.random() * 900000),
            category: aiResponse?.category,
            username: currentUser, // <--- Link to user
            severity: aiResponse?.severity,
            location: location,
            date: new Date().toISOString(),
            status: 'Pending'
        };

        await fetch('/api/complaints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newReport)
        });

        setIsSubmitted(true);
    };

    const processIssue = () => {
        if (image) {
            setLoading(true);
            setIsSubmitted(false);
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                // Strip the data:image/...;base64, prefix
                const base64Data = base64String.split(',')[1];

                fetchLocation();

                try {
                    const response = await fetch('/api/analyze-issue', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            base64Image: base64Data,
                            mimeType: image.type
                        })
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || 'Failed to analyze issue');
                    }

                    let parsedResponse: AIResponse;
                    try {
                        // Clean up markdown syntax if Gemini returns it
                        const cleanedText = data.result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                        parsedResponse = JSON.parse(cleanedText);
                    } catch (e) {
                        // Fallback if parsing fails
                        parsedResponse = {
                            category: 'Error',
                            severity: 'Unknown',
                            formalDraft: data.result
                        };
                    }

                    setAiResponse(parsedResponse);
                } catch (error) {
                    console.error('Error analyzing issue:', error);
                    setAiResponse({
                        category: 'Error',
                        severity: 'Unknown',
                        formalDraft: 'An error occurred while analyzing the image.'
                    });
                } finally {
                    setLoading(false);
                }
            };
            reader.readAsDataURL(image);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {!preview ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}
                >
                    <span className="text-4xl mb-4">📸</span>
                    <p className="text-gray-600 font-medium">Click or drag image here</p>
                    <p className="text-gray-400 text-sm mt-2">Supports PNG, JPEG, WEBP</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center p-4 border rounded-lg bg-white shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-contain rounded-md mb-4"
                    />
                    <div className="flex w-full gap-2">
                        <button
                            onClick={removeImage}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>❌</span> Remove
                        </button>
                        <button
                            onClick={processIssue}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>🚀</span> {loading ? 'Analyzing...' : 'Process Issue'}
                        </button>
                    </div>

                    {aiResponse && !isSubmitted && (
                        <div className="w-full mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl text-left shadow-inner">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Analysis Result</h3>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <span className="font-semibold text-slate-700 w-24">Category:</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {aiResponse.category}
                                    </span>
                                </div>

                                <div className="flex items-center">
                                    <span className="font-semibold text-slate-700 w-24">Severity:</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${aiResponse.severity?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                                        aiResponse.severity?.toLowerCase() === 'medium' ? 'bg-orange-100 text-orange-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {aiResponse.severity}
                                    </span>
                                </div>

                                {location && (
                                    <div className="flex items-center mt-2">
                                        <span className="font-semibold text-slate-700 w-24">Location:</span>
                                        <span className="inline-flex items-center text-sm text-slate-700">
                                            📍 {location}
                                        </span>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <span className="font-semibold text-slate-700 block mb-2">Formal Draft:</span>
                                    <p className="text-sm text-slate-600 bg-white p-4 border border-slate-200 rounded-lg shadow-sm leading-relaxed whitespace-pre-wrap">
                                        {aiResponse.formalDraft}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmitReport}
                                className="mt-6 bg-red-600 hover:bg-red-700 text-white w-full py-3 px-4 font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
                            >
                                🚨 Submit Official Report
                            </button>
                        </div>
                    )}

                    {isSubmitted && (
                        <div className="w-full mt-6 p-8 bg-green-50 border-2 border-green-200 rounded-xl text-center shadow-sm flex flex-col items-center justify-center">
                            <h3 className="text-2xl font-bold text-green-800 mb-4">✅ Issue successfully reported to the Local Municipal Ward.</h3>
                            <p className="text-lg font-mono bg-green-100 text-green-900 px-4 py-2 rounded-md">
                                Tracking ID: #SB-{trackingId}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
