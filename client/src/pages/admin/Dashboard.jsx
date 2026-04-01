import { useState, useEffect } from 'react';
import { getPendingCandidates, approveCandidate, rejectCandidate } from '../../api/candidate';
import { getResults } from '../../api/vote';
import { getElectionReport } from '../../api/ai';

const Dashboard = () => {
    const [pendingCandidates, setPendingCandidates] = useState([]);
    const [stats, setStats] = useState({ totalVotes: 0, candidatesCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [pendingRes, resultsRes] = await Promise.all([
                getPendingCandidates(),
                getResults()
            ]);

            setPendingCandidates(pendingRes.data.data);

            const results = resultsRes.data.data;
            const totalVotes = results.reduce((sum, cand) => sum + cand.votesCount, 0);
            setStats({
                totalVotes,
                candidatesCount: results.length
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveCandidate(id);
            setPendingCandidates(prev => prev.filter(c => c._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const [report, setReport] = useState(null);
    const [generatingReport, setGeneratingReport] = useState(false);

    const handleGenerateReport = async () => {
        setGeneratingReport(true);
        try {
            // Construct data from local state to avoid extra API call if possible, 
            // or just rely on what we have. Ideally we'd fetch fresh data but for this MVP:
            // We use 'stats' and 'pendingCandidates' but results are not stored in full detail in state.
            // Let's re-fetch or just loop over what we might have if we stored it?
            // Actually, we need the APPROVED candidates for the report.
            // Let's use getResults() to get them fresh.

            const { data } = await getResults();
            const candidates = data.data;

            if (candidates.length === 0) {
                alert("No active candidates to analyze.");
                return;
            }

            const candidatesData = candidates.map(c =>
                `- ${c.user.name}: ${c.votesCount} votes. Manifesto snippet: "${c.manifesto.substring(0, 100)}..."`
            ).join('\n');

            const prompt = `Analyze this election data for a Class Representative. 
            Data:
            ${candidatesData}
            
            Provide a "Winner Prediction" (based on votes), "Voter Engagement Analysis", and "Strategic Advice" for the next term. Keep it professional.`;

            const response = await window.puter.ai.chat(prompt, { model: 'x-ai/grok-4.1-fast' });
            setReport(response?.message?.content || "Report generation failed.");

        } catch (error) {
            console.error("Puter Report Error", error);
            alert("Failed to generate report.");
        } finally {
            setGeneratingReport(false);
        }
    };

    const handleReject = async (id) => {
        if (!confirm('Reject this candidate?')) return;
        try {
            await rejectCandidate(id);
            setPendingCandidates(prev => prev.filter(c => c._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="container center-screen" style={{ color: 'white' }}>Loading dashboard...</div>;

    return (
        <div className="container">
            <h1 className="title">Admin Dashboard</h1>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                <div className="card glass-effect" style={{ flex: 1, textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--text-muted)' }}>Total Votes Cast</h3>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0', color: 'var(--primary)' }}>{stats.totalVotes}</p>
                </div>
                <div className="card glass-effect" style={{ flex: 1, textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--text-muted)' }}>Active Candidates</h3>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0', color: 'var(--accent)' }}>{stats.candidatesCount}</p>
                </div>
            </div>

            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <button
                    onClick={handleGenerateReport}
                    className="btn-primary"
                    style={{ background: 'linear-gradient(45deg, #0984e3, #6c5ce7)', width: '100%', maxWidth: '400px', fontSize: '1.2rem' }}
                    disabled={generatingReport}
                >
                    {generatingReport ? 'Generating AI Analysis...' : '📊 Generate Election Analysis Report'}
                </button>

                {report && (
                    <div className="card glass-effect" style={{ marginTop: '2rem', textAlign: 'left', border: '1px solid #0984e3' }}>
                        <h3 style={{ color: '#0984e3', marginBottom: '1rem' }}>AI Election Report</h3>
                        <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                            {report}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'white', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                    Pending Approvals
                </h2>

                {pendingCandidates.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No pending nominations to review.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {pendingCandidates.map(candidate => (
                            <div key={candidate._id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)' }}>
                                <div style={{ flex: 1 }}>
                                    <strong style={{ fontSize: '1.2rem', color: 'white' }}>{candidate.user.name}</strong>
                                    <span style={{ color: 'var(--text-muted)', marginLeft: '1rem' }}>Section: {candidate.user.section}</span>
                                    <div style={{ marginTop: '0.5rem', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', maxWidth: '80%' }}>
                                        <small style={{ color: 'var(--accent)', textTransform: 'uppercase', fontSize: '0.7rem' }}>Manifesto</small>
                                        <p style={{ margin: '0.3rem 0 0 0', color: '#ddd', fontSize: '0.9rem' }}>{candidate.manifesto}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                                    <button
                                        onClick={() => handleApprove(candidate._id)}
                                        style={{ padding: '0.6rem 1.2rem', background: '#00b894', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(candidate._id)}
                                        style={{ padding: '0.6rem 1.2rem', background: '#ff7675', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
