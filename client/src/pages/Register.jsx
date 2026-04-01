import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { registerUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [section, setSection] = useState('');
    const [role, setRole] = useState('student');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await registerUser({
                name,
                email,
                password,
                role,
                section: role === 'student' ? section : undefined
            });
            login(data.data.token, data.data);
            navigate(data.data.role === 'admin' ? '/admin' : '/vote');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="container center-screen">
            <div className="card glass-effect">
                <h2 className="title">Join Election</h2>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit} className="form-stack">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        required
                    />

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '0.5rem', marginLeft: '4px' }}>Select Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="input-field"
                            style={{ appearance: 'none', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                        >
                            <option value="student">Student Voter</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    {role === 'student' && (
                        <input
                            type="text"
                            placeholder="Class Section (e.g., 3-A)"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            className="input-field"
                            required
                        />
                    )}

                    <input
                        type="password"
                        placeholder="Create Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        required
                    />
                    <button type="submit" className="btn-primary">Create Account</button>
                    <p className="link-text" onClick={() => navigate('/login')}>Already have an account? Login</p>
                </form>
            </div>
        </div>
    );
};

export default Register;
