import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserStores() {
    const [stores, setStores] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchAddress, setSearchAddress] = useState('');

    useEffect(() => {
        fetchStores();
    }, [searchName, searchAddress]);

    const fetchStores = async () => {
        const res = await axios.get(`/stores?name=${searchName}&address=${searchAddress}`);
        setStores(res.data);
    };

    const handleRating = async (storeId, value) => {
        try {
            await axios.post('/ratings', { storeId, value });
            fetchStores(); // Refresh to show new user rating and average
        } catch (err) {
            alert('Failed to submit rating');
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Available Stores</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        style={{ width: '200px' }}
                    />
                    <input
                        type="text"
                        placeholder="Search by address..."
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                        style={{ width: '200px' }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {stores.map(store => (
                    <div key={store.id} className="card">
                        <h3 style={{ margin: 0 }}>{store.name}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{store.address}</p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span>Avg Rating: <strong>{store.averageRating || 'None'} ⭐</strong></span>
                            <span>Your Rating: <strong>{store.userRating || '-'}</strong></span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => handleRating(store.id, star)}
                                    style={{
                                        padding: '0.25rem 0.5rem',
                                        background: store.userRating === star ? 'var(--secondary-color)' : 'var(--border-color)'
                                    }}
                                >
                                    {star}★
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
