'use client';

import React, { useState, useRef } from 'react';

export default function SnapReport() {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
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
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const processIssue = () => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log(reader.result);
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
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                        >
                            <span>❌</span> Remove
                        </button>
                        <button
                            onClick={processIssue}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <span>🚀</span> Process Issue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
