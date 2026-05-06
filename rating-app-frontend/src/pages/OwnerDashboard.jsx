import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

export default function OwnerDashboard() {
    const [data, setData] = useState({ store: null, averageRating: null, raters: [] });
    const [sort, setSort] = useState({ key: 'date', direction: 'desc' });

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        const res = await axios.get('/stores/owner/dashboard');
        setData(res.data);
    };

    const handleSort = (key) => {
        setSort(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedRaters = useMemo(() => {
        let result = [...data.raters];
        result.sort((a, b) => {
            let valA, valB;
            if (sort.key === 'name') { valA = a.user.name.toLowerCase(); valB = b.user.name.toLowerCase(); }
            else if (sort.key === 'email') { valA = a.user.email.toLowerCase(); valB = b.user.email.toLowerCase(); }
            else if (sort.key === 'value') { valA = a.value; valB = b.value; }
            else { valA = new Date(a.updatedAt).getTime(); valB = new Date(b.updatedAt).getTime(); }

            if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return result;
    }, [data.raters, sort]);

    if (!data.store) {
        return (
            <div className="container">
                <h2>Store Owner Dashboard</h2>
                <div className="card">
                    <p>You currently do not have a store assigned to your account. Please contact the administrator.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h2>My Store Dashboard</h2>

            <div className="card flex-responsive" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>{data.store.name}</h3>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>{data.store.address} | {data.store.email}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Average Rating</p>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--primary-color)' }}>{data.averageRating || 'Unrated'} ⭐</h1>
                </div>
            </div>

            <div className="card">
                <h3>User Ratings</h3>
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('name')}>Rater Name {sort.key === 'name' ? (sort.direction === 'asc' ? '↑' : '↓') : ''}</th>
                                <th onClick={() => handleSort('email')}>Email {sort.key === 'email' ? (sort.direction === 'asc' ? '↑' : '↓') : ''}</th>
                                <th onClick={() => handleSort('value')}>Rating Provided {sort.key === 'value' ? (sort.direction === 'asc' ? '↑' : '↓') : ''}</th>
                                <th onClick={() => handleSort('date')}>Date {sort.key === 'date' ? (sort.direction === 'asc' ? '↑' : '↓') : ''}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRaters.length === 0 ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center' }}>No ratings yet.</td></tr>
                            ) : (
                                sortedRaters.map(r => (
                                    <tr key={r.ratingId}>
                                        <td>{r.user.name}</td>
                                        <td>{r.user.email}</td>
                                        <td><strong>{r.value} ⭐</strong></td>
                                        <td>{new Date(r.updatedAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
