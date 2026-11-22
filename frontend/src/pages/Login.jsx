import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

import useAuth from '../hooks/useAuth';
import Loader from '../components/Loader';

import './Login.css';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            const response = await login({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });

            if (response?.success) {
                toast.success('Login successful! Welcome back.', {
                    position: 'top-right',
                    autoClose: 3000,
                });

                navigate('/dashboard');
            } else {
                toast.error(
                    response?.message || 'Login failed. Please try again.',
                    {
                        position: 'top-right',
                        autoClose: 4000,
                    }
                );
            }

        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                'Invalid email or password',
                {
                    position: 'top-right',
                    autoClose: 4000,
                }
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader message="Logging in..." />;
    }

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-heading">
                    <LogIn size={35} />

                    <h1>Welcome Back</h1>

                    <p>Login to manage your tasks</p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="login-form-group">
                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="login-form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="login-password-wrapper">

                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>

                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                </form>

                <p className="login-footer">
                    Don't have an account?{' '}
                    <Link to="/register">Register</Link>
                </p>

            </div>
        </div>
    );
};

export default Login;
