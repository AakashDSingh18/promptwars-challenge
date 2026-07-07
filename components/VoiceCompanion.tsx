'use client';

import React, { useState } from 'react';

export default function VoiceCompanion() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const currentTranscript = event.results[0][0].transcript;
            setTranscript(currentTranscript);
            sendMessage(currentTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const sendMessage = async (messageText: string = transcript) => {
        if (!messageText.trim()) return;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText }),
            });

            const data = await response.json();
            if (data.reply) {
                setAiResponse(data.reply);
            } else {
                setAiResponse('Sorry, I encountered an error processing your request.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setAiResponse('Sorry, I encountered an error processing your request.');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage();
    };

    return (
        <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col gap-3">
            {aiResponse && (
                <div className="self-start bg-blue-50 text-blue-900 px-4 py-3 rounded-2xl rounded-bl-none max-w-[85%] text-sm shadow-sm border border-blue-100">
                    {aiResponse}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={startListening}
                    className={`p-3 rounded-full flex-shrink-0 transition-colors ${isListening
                        ? 'animate-pulse bg-red-500 text-white'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                    aria-label="Start voice input"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                </button>

                <input
                    type="text"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Type or speak a message..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />

                <button
                    type="submit"
                    disabled={!transcript.trim() || isListening}
                    className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
