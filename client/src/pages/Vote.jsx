import { useState, useEffect } from 'react';
import { getCandidates } from '../api/candidate';
import { castVote as voteApi } from '../api/vote';
import { getCandidateInsights } from '../api/ai';

const Vote = () => {
    const [candidates, setCandidates] = useState([]);
    const [insights, setInsights] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        try {
            const { data } = await getCandidates();
            setCandidates(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const [processing, setProcessing] = useState({});

    const handleAnalyze = async (candidateId, manifesto) => {
        if (insights[candidateId] || processing[candidateId]) return;

        setProcessing(prev => ({ ...prev, [candidateId]: true }));
        try {
            // Using Puter.js directly on frontend as requested
            const response = await window.puter.ai.chat(
                `Analyze the following manifesto for a Class Representative election and provide brief bullet points on key promises and leadership qualities. Manifesto: "${manifesto}"`,
                { model: 'x-ai/grok-4.1-fast' }
            );

            const aiText = response?.message?.content || 'No insights generated.';
            setInsights(prev => ({ ...prev, [candidateId]: aiText }));

        } catch (error) {
            console.error('Puter AI Error:', error);
            alert('Failed to get AI insights. Please try again.');
        } finally {
            setProcessing(prev => ({ ...prev, [candidateId]: false }));
        }
    };

    const handleVote = async (candidateId) => {
        if (!confirm('Are you sure? This action cannot be undone.')) return;
        try {
            await voteApi(candidateId);
            setMessage('Vote cast successfully! Thank you for participating.');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Voting failed');
        }
    };

    if (loading) return <div className="container center-screen" style={{ color: 'white' }}>Loading...</div>;

    return (
        <div className="container">
            <h1 className="title">Cast Your Vote</h1>
            {message && (
                <div style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    padding: '1rem',
                    background: message.includes('failed') ? 'rgba(231, 76, 60, 0.2)' : 'rgba(46, 204, 113, 0.2)',
                    color: message.includes('failed') ? '#ff7675' : '#55efc4',
                    borderRadius: '8px',
                    border: '1px solid currentColor'
                }}>
                    {message}
                </div>
            )}

            <div className="grid-container">
                {candidates.map(candidate => (
                    <div key={candidate._id} className="card vote-card">
                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.8rem', margin: 0, color: 'white' }}>{candidate.user.name}</h3>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Section: {candidate.user.section}</span>
                        </div>

                        <div style={{
                            background: 'rgba(0,0,0,0.2)',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            minHeight: '80px'
                        }}>
                            <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '0.5rem' }}>Manifesto</strong>
                            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '0.95rem' }}>{candidate.manifesto}</p>
                        </div>

                        <div className="actions">
                            <button
                                onClick={() => handleAnalyze(candidate._id, candidate.manifesto)}
                                className="ai-btn"
                                disabled={processing[candidate._id]}
                                style={{ opacity: processing[candidate._id] ? 0.7 : 1 }}
                            >
                                {processing[candidate._id] ? '⏳ Analyzing...' : insights[candidate._id] ? '✨ AI Analysis Loaded' : '✨ Get AI Summary'}
                            </button>

                            <button
                                onClick={() => handleVote(candidate._id)}
                                className="vote-btn-action"
                            >
                                Vote for {candidate.user.name.split(' ')[0]}
                            </button>
                        </div>

                        {insights[candidate._id] && (
                            <div className="ai-insights-box">
                                <strong style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    🤖 AI Insights
                                </strong>
                                <p style={{ lineHeight: '1.5', whiteSpace: 'pre-line' }}>{insights[candidate._id]}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Vote;
