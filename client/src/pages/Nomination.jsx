import { useState } from 'react';
import { applyForCandidacy } from '../api/candidate';
import { useNavigate } from 'react-router-dom';

const Nomination = () => {
    const [manifesto, setManifesto] = useState('');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await applyForCandidacy({ manifesto });
            setMessage('Application submitted! Waiting for admin approval.');
            setError('');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed');
            setMessage('');
        }
    };

    return (
        <div className="container center-screen">
            <div className="card glass-effect" style={{ maxWidth: '600px' }}>
                <h2 className="title">Nominate Yourself</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Ready to lead? Submit your manifesto and stand for election.
                </p>

                {message && <p style={{ color: '#55efc4', textAlign: 'center', marginBottom: '1rem' }}>{message}</p>}
                {error && <p className="error-msg">{error}</p>}

                <form onSubmit={handleSubmit} className="form-stack">
                    <textarea
                        placeholder="Write your manifesto here... Why should students vote for you? (Minimum 20 characters)"
                        value={manifesto}
                        onChange={(e) => setManifesto(e.target.value)}
                        className="input-field"
                        style={{ minHeight: '150px', resize: 'vertical', fontFamily: 'inherit' }}
                        rows="6"
                        required
                    />
                    <button type="submit" className="btn-primary">Submit Nomination</button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginTop: '1rem' }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Nomination;
