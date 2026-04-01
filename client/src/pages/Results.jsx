import { useState, useEffect } from 'react';
import { getResults } from '../api/vote';

const Results = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const { data } = await getResults();
                setResults(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) return <div className="container center-screen" style={{ color: 'white' }}>Loading live results...</div>;

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <h1 className="title">Live Results</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {results.map((candidate, index) => {
                    const percentage = results.length > 0 && results[0].votesCount > 0
                        ? (candidate.votesCount / results.reduce((a, b) => a + b.votesCount, 0)) * 100
                        : 0;

                    return (
                        <div key={candidate._id} className="card glass-effect" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: index === 0 ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                color: 'white'
                            }}>
                                #{index + 1}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{candidate.user.name}</h3>
                                    <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>{candidate.votesCount} votes</span>
                                </div>

                                <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div
                                        style={{
                                            height: '100%',
                                            background: index === 0 ? 'linear-gradient(90deg, var(--primary), var(--accent))' : 'var(--text-muted)',
                                            width: `${percentage}%`,
                                            transition: 'width 1s ease-out'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {results.length === 0 && (
                    <div className="card glass-effect" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No votes have been cast yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Results;
