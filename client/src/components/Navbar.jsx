import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #6c5ce7, #fd79a8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>CR Voting</Link>
            </div>
            <div className="nav-links">
                {!user ? (
                    <>
                        <Link to="/login" className="nav-item">Login</Link>
                        <Link to="/register" className="nav-item">Register</Link>
                    </>
                ) : (
                    <>
                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>Hi, {user.name}</span>
                        {user.role === 'student' && (
                            <>
                                <Link to="/nomination" className="nav-item">Nominate</Link>
                                <Link to="/vote" className="nav-item">Vote</Link>
                            </>
                        )}
                        {user.role === 'admin' && (
                            <Link to="/admin" className="nav-item">Admin Panel</Link>
                        )}
                        <Link to="/results" className="nav-item">Live Results</Link>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'transparent',
                                border: '1px solid #fd79a8',
                                color: '#fd79a8',
                                padding: '0.4rem 1rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#fd79a8'; e.currentTarget.style.color = 'white'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fd79a8'; }}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
