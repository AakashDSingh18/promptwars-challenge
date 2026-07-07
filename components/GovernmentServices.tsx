'use client';

import React, { useState } from 'react';

type Scheme = {
    id: string;
    name: string;
    minAge: number;
    maxIncome: number;
    description: string;
    url: string;
};

const SCHEMES: Scheme[] = [
    {
        id: 'pm-awas',
        name: 'PM Awas Yojana',
        minAge: 18,
        maxIncome: 300000,
        description: 'Housing for all scheme providing financial assistance for building a home.',
        url: '#',
    },
    {
        id: 'ayushman-bharat',
        name: 'Ayushman Bharat',
        minAge: 0,
        maxIncome: 500000,
        description: 'Health insurance coverage up to ₹5 lakhs per family per year.',
        url: '#',
    },
    {
        id: 'old-age-pension',
        name: 'National Old Age Pension Scheme',
        minAge: 60,
        maxIncome: 100000,
        description: 'Pension for senior citizens living below the poverty line.',
        url: '#',
    },
    {
        id: 'pm-rozgar',
        name: 'PM Rozgar Yojana',
        minAge: 18,
        maxIncome: 200000,
        description: 'Provides self-employment opportunities to educated unemployed youth.',
        url: '#',
    },
    {
        id: 'ews-scholarship',
        name: 'EWS Scholarship',
        minAge: 10,
        maxIncome: 150000,
        description: 'Financial assistance to students belonging to Economically Weaker Sections.',
        url: '#',
    },
];

export default function GovernmentServices() {
    const [age, setAge] = useState<number | ''>('');
    const [income, setIncome] = useState<number | ''>('');
    const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>(SCHEMES);
    const [hasSearched, setHasSearched] = useState(false);

    const findSchemes = (e: React.FormEvent) => {
        e.preventDefault();
        if (age === '' || income === '') return;

        const results = SCHEMES.filter(
            (scheme) => age >= scheme.minAge && income <= scheme.maxIncome
        );

        setFilteredSchemes(results);
        setHasSearched(true);
    };

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Find Government Schemes</h2>

            <form onSubmit={findSchemes} className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1">
                    <label htmlFor="age" className="block text-sm font-medium text-black mb-1">
                        Age
                    </label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                        placeholder="Enter your age"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black"
                        required
                        min="0"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="income" className="block text-sm font-medium text-black mb-1">
                        Annual Income (₹)
                    </label>
                    <input
                        type="number"
                        id="income"
                        value={income}
                        onChange={(e) => setIncome(e.target.value ? Number(e.target.value) : '')}
                        placeholder="Enter annual income"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black"
                        required
                        min="0"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                        Find Schemes
                    </button>
                </div>
            </form>

            <div className="space-y-4">
                {hasSearched && filteredSchemes.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-gray-600 font-medium">No schemes match your current profile.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredSchemes.map((scheme) => (
                            <div
                                key={scheme.id}
                                className="flex flex-col p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{scheme.name}</h3>
                                <p className="text-sm text-gray-600 mb-5 flex-grow">{scheme.description}</p>
                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                    <div className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                        Age: {scheme.minAge}+ | Income: &lt; ₹{(scheme.maxIncome / 100000).toFixed(1)}L
                                    </div>
                                    <a
                                        href={scheme.url}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium text-sm rounded-lg transition-colors border border-emerald-200"
                                    >
                                        Apply Now
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
