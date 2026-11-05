
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Students() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setLoading(false);
            navigate('/login', { replace: true });
            return;
        }

        const fetchStudents = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetch(
                    'http://localhost:3000/api/students',
                    {
                        method: 'GET',
                        cache: 'no-store',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const data = await response.json();

                if (response.status === 401 || response.status === 403) {
                    logout();
                    navigate('/login', { replace: true });
                    return;
                }

                if (!response.ok) {
                    throw new Error(
                        data.error || data.message || 'Failed to load students'
                    );
                }

                const studentList = Array.isArray(data)
                    ? data
                    : data.students || data.data || [];

                if (!Array.isArray(studentList)) {
                    throw new Error('Invalid student data received.');
                }

                setStudents(studentList);

            } catch (err) {
                console.error('Students API error:', err);
                setError(err.message || 'Unable to load students.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [token, logout, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="students-container">
            <header className="students-header">
                <div>
                    <h1>Student Directory</h1>
                    <p>Welcome! You are successfully logged in.</p>
                </div>

                <button onClick={handleLogout}>Logout</button>
            </header>

            <main className="students-content">
                <h2>Students List</h2>

                {loading && <p>Loading students...</p>}

                {error && (
                    <div className="error-message">{error}</div>
                )}

                {!loading && !error && students.length === 0 && (
                    <p>No students found.</p>
                )}

                {!loading && !error && students.length > 0 && (
                    <div className="students-list">
                        {students.map((student) => (
                            <div
                                className="student-card"
                                key={student._id || student.id || student.email}
                            >
                                <h3>
                                    {student.name || student.fullName || 'Unnamed Student'}
                                </h3>
                                <p>Email: {student.email || 'No email available'}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Students;
