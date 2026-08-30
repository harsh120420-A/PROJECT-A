import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    function handleRegister(e) {
        e.preventDefault();

        console.log('Register:', name, email);
        navigate('/dashboard');
    }

    return (
        <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4'>
            <div className='w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border'>
                <h1 className='text-2xl font-bold'>
                    Create your account
                </h1>
                <p className='text-slate-500 mt-2'>
                    Start building your career profile.
                </p>

                <form onSubmit={handleRegister} className='mt-8 space-y-5'>
                    <div>
                        <label className='block text-sm font-medium mb-2'>
                            Full Name
                        </label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className='w-full border rounded-lg px-4 py-3' placeholder='Your name' required />

                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2'>
                            Email
                        </label>

                        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full border rounded-lg px-4 py-3' placeholder='you@example.com' required />
                    </div>

                    <button className='w-full bg-blue-600 text-white py-3 rounded-lg'>
                        Create Account
                    </button>
                </form>

                <p className='text-sm text-center mt-6'>
                    Already have an account?{' '}
                    <Link to='/login' className='text-blue-600 font-medium'>
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register;