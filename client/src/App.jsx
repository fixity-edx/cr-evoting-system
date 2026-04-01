import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Nomination from './pages/Nomination';
import Vote from './pages/Vote';
import Results from './pages/Results';
import Dashboard from './pages/admin/Dashboard';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="app-container">
                    <Navbar />
                    <main style={{ padding: '2rem' }}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/results" element={<Results />} />

                            {/* Protected Routes */}
                            <Route path="/" element={<ProtectedRoute><Vote /></ProtectedRoute>} /> {/* Default to Vote or Dashboard based on role logic if needed, simplify to Vote for now */}

                            <Route path="/nomination" element={
                                <RoleRoute role="student">
                                    <Nomination />
                                </RoleRoute>
                            } />

                            <Route path="/vote" element={
                                <RoleRoute role="student">
                                    <Vote />
                                </RoleRoute>
                            } />

                            <Route path="/admin" element={
                                <RoleRoute role="admin">
                                    <Dashboard />
                                </RoleRoute>
                            } />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
