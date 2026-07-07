'use client';

import React, { useState } from 'react';

type Summary = {
    whatIsIt: string;
    eligibility: string;
    benefit: string;
} | null;

export default function PolicyTranslator() {
    const [inputText, setInputText] = useState(
        'The PMFME Scheme provides financial and business support for upgrading micro food enterprises, specifically targeting home-based food delivery services and kitchen setups. Applicants receive a 35% credit-linked capital subsidy. Must have a valid FSSAI registration.'
    );
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [summary, setSummary] = useState<Summary>(null);

    const handleSimplify = async () => {
        setIsAnalyzing(true);
        setSummary(null);

        try {
            const response = await fetch('/api/translate-policy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputText }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.error('Failed to simplify policy:', error);
            alert('Failed to simplify policy. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Policy Simplifier</h2>
                <p className="text-gray-600">Translate dense government schemes into easy-to-understand points.</p>
            </div>

            <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none mb-4 text-gray-700"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste government policy here..."
            />

            <button
                onClick={handleSimplify}
                disabled={isAnalyzing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                    </span>
                ) : (
                    'Simplify Policy 🪄'
                )}
            </button>

            {summary && (
                <div className="mt-6 space-y-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-800 mb-1 text-sm uppercase tracking-wider">What is it?</h3>
                        <p className="text-blue-900">{summary.whatIsIt}</p>
                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                        <h3 className="font-semibold text-green-800 mb-1 text-sm uppercase tracking-wider">Eligibility</h3>
                        <p className="text-green-900">{summary.eligibility}</p>
                    </div>

                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                        <h3 className="font-semibold text-purple-800 mb-1 text-sm uppercase tracking-wider">The Benefit</h3>
                        <p className="text-purple-900">{summary.benefit}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
