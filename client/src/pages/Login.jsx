import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await loginUser({ email, password });
            login(data.data.token, data.data);

            // Proper Role-Based Redirect
            if (data.data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/vote');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="container center-screen">
            <div className="card glass-effect">
                <h2 className="title">Welcome Back</h2>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit} className="form-stack">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        required
                    />
                    <button type="submit" className="btn-primary">Login</button>
                    <p className="link-text" onClick={() => navigate('/register')}>Don't have an account? Register</p>
                </form>
            </div>
        </div>
    );
};

export default Login;
