'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({ username, password, type: isRegistering ? 'signup' : 'login' }),
                headers: { 'Content-Type': 'application/json' },
            });

            const text = await res.text(); // Get raw text first
            let data;
            try {
                data = text ? JSON.parse(text) : {}; // Parse only if not empty
            } catch (e) {
                data = { error: 'Server error' };
            }

            if (res.ok) {
                if (isRegistering) {
                    alert('Account created! Please sign in.');
                    setIsRegistering(false);
                } else {
                    localStorage.setItem('currentUser', username);
                    router.push('/dashboard');
                }
            } else {
                alert(data.error || 'Failed to authenticate');
            }
        } catch (err) {
            alert('Network or Server error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-2xl w-96 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-black">{isRegistering ? 'Create Account' : 'Smart Bharat Login'}</h2>
            <input className="w-full p-3 mb-4 border rounded text-black" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
            <input className="w-full p-3 mb-6 border rounded text-black" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold mb-4">
                {isRegistering ? 'Register' : 'Sign In'}
            </button>

            <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full text-blue-600 text-sm hover:underline"
            >
                {isRegistering ? 'Already have an account? Sign In' : 'New user? Create an account'}
            </button>
        </form>
    );
}