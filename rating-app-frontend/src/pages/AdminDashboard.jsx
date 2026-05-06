import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    // Filters
    const [userSearch, setUserSearch] = useState({ name: '', email: '', address: '', role: '' });
    const [storeSearch, setStoreSearch] = useState({ name: '', email: '', address: '' });

    // Sorting: { key: string, direction: 'asc' | 'desc' }
    const [userSort, setUserSort] = useState({ key: 'name', direction: 'asc' });
    const [storeSort, setStoreSort] = useState({ key: 'name', direction: 'asc' });

    // Modals state
    const [showAddUser, setShowAddUser] = useState(false);
    const [showAddStore, setShowAddStore] = useState(false);

    // Forms state
    const [userForm, setUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
    const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', ownerId: '' });

    // User detail state
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchStores();
    }, []);

    const fetchStats = async () => {
        const res = await axios.get('/users/stats');
        setStats(res.data);
    };

    const fetchUsers = async () => {
        const res = await axios.get('/users');
        setUsers(res.data);
    };

    const fetchStores = async () => {
        const res = await axios.get('/stores');
        setStores(res.data);
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/users', userForm);
            setShowAddUser(false);
            setUserForm({ name: '', email: '', password: '', address: '', role: 'user' });
            fetchUsers();
            fetchStats();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add user');
        }
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...storeForm, ownerId: storeForm.ownerId ? parseInt(storeForm.ownerId) : undefined };
            await axios.post('/stores', payload);
            setShowAddStore(false);
            setStoreForm({ name: '', email: '', address: '', ownerId: '' });
            fetchStores();
            fetchStats();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add store');
        }
    };

    const viewUserDetail = async (id) => {
        try {
            const res = await axios.get(`/users/${id}`);
            setSelectedUser(res.data);
        } catch (err) {
            alert('Failed to load user details');
        }
    };

    const handleSort = (key, currentSort, setSort) => {
        setSort({
            key,
            direction: currentSort.key === key && currentSort.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    // Processed Data
    const filteredUsers = useMemo(() => {
        let result = users.filter(u =>
            u.name.toLowerCase().includes(userSearch.name.toLowerCase()) &&
            u.email.toLowerCase().includes(userSearch.email.toLowerCase()) &&
            u.address.toLowerCase().includes(userSearch.address.toLowerCase()) &&
            (userSearch.role === '' || u.role === userSearch.role)
        );
        result.sort((a, b) => {
            const valA = a[userSort.key] || '';
            const valB = b[userSort.key] || '';
            return userSort.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });
        return result;
    }, [users, userSearch, userSort]);

    const filteredStores = useMemo(() => {
        let result = stores.filter(s =>
            s.name.toLowerCase().includes(storeSearch.name.toLowerCase()) &&
            s.email.toLowerCase().includes(storeSearch.email.toLowerCase()) &&
            s.address.toLowerCase().includes(storeSearch.address.toLowerCase())
        );
        result.sort((a, b) => {
            const valA = String(a[storeSort.key] || '');
            const valB = String(b[storeSort.key] || '');
            return storeSort.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });
        return result;
    }, [stores, storeSearch, storeSort]);

    return (
        <div className="container">
            <div className="flex-responsive" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Admin Dashboard</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setShowAddUser(true)}>+ Add User</button>
                    <button onClick={() => setShowAddStore(true)}>+ Add Store</button>
                </div>
            </div>

            <div className="flex-responsive" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ flex: 1, textAlign: 'center' }}>
                    <h3>Total Users</h3>
                    <h1 style={{ fontSize: '3rem', margin: 0 }}>{stats.totalUsers}</h1>
                </div>
                <div className="card" style={{ flex: 1, textAlign: 'center' }}>
                    <h3>Total Stores</h3>
                    <h1 style={{ fontSize: '3rem', margin: 0 }}>{stats.totalStores}</h1>
                </div>
                <div className="card" style={{ flex: 1, textAlign: 'center' }}>
                    <h3>Total Ratings</h3>
                    <h1 style={{ fontSize: '3rem', margin: 0 }}>{stats.totalRatings}</h1>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="card" style={{ flex: 1, minWidth: '300px', overflowX: 'hidden' }}>
                    <h3>Registered Stores</h3>
                    <div className="flex-responsive" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input placeholder="Filter Name" value={storeSearch.name} onChange={e => setStoreSearch({ ...storeSearch, name: e.target.value })} style={{ padding: '0.5rem' }} />
                        <input placeholder="Filter Email" value={storeSearch.email} onChange={e => setStoreSearch({ ...storeSearch, email: e.target.value })} style={{ padding: '0.5rem' }} />
                        <input placeholder="Filter Address" value={storeSearch.address} onChange={e => setStoreSearch({ ...storeSearch, address: e.target.value })} style={{ padding: '0.5rem' }} />
                    </div>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('name', storeSort, setStoreSort)}>Name {storeSort.key === 'name' ? (storeSort.direction === 'asc' ? '↑' : '↓') : ''}</th>
                                    <th onClick={() => handleSort('email', storeSort, setStoreSort)}>Email {storeSort.key === 'email' ? (storeSort.direction === 'asc' ? '↑' : '↓') : ''}</th>
                                    <th onClick={() => handleSort('address', storeSort, setStoreSort)}>Address {storeSort.key === 'address' ? (storeSort.direction === 'asc' ? '↑' : '↓') : ''}</th>
                                    <th onClick={() => handleSort('averageRating', storeSort, setStoreSort)}>Rating {storeSort.key === 'averageRating' ? (storeSort.direction === 'asc' ? '↑' : '↓') : ''}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStores.map(s => (
                                    <tr key={s.id}>
                                        <td>{s.name}</td>
                                        <td>{s.email}</td>
                                        <td>{s.address}</td>
                                        <td>{s.averageRating || 'Unrated'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card" style={{ flex: 1, minWidth: '300px', overflowX: 'hidden' }}>
                    <h3>System Users</h3>
                    <div className="flex-responsive" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input placeholder="Filter Name" value={userSearch.name} onChange={e => setUserSearch({ ...userSearch, name: e.target.value })} style={{ padding: '0.5rem' }} />
                        <input placeholder="Filter Email" value={userSearch.email} onChange={e => setUserSearch({ ...userSearch, email: e.target.value })} style={{ padding: '0.5rem' }} />
                        <input placeholder="Filter Address" value={userSearch.address} onChange={e => setUserSearch({ ...userSearch, address: e.target.value })} style={{ padding: '0.5rem' }} />
                        <select value={userSearch.role} onChange={e => setUserSearch({ ...userSearch, role: e.target.value })} style={{ padding: '0.3rem' }}>
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="store_owner">Store Owner</option>
                        </select>
                    </div>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th onClick={() => handleSort('name', userSort, setUserSort)}>Name {userSort.key === 'name' ? (userSort.direction === 'asc' ? '↑' : '↓') : ''}</th>
                                    <th onClick={() => handleSort('email', userSort, setUserSort)}>Email {userSort.key === 'email' ? (userSort.direction === 'asc' ? '↑' : '↓') : ''}</th>
                                    <th onClick={() => handleSort('address', userSort, setUserSort)}>Address {userSort.key === 'address' ? (userSort.direction === 'asc' ? '↑' : '↓') : ''}</th>
                                    <th onClick={() => handleSort('role', userSort, setUserSort)}>Role {userSort.key === 'role' ? (userSort.direction === 'asc' ? '↑' : '↓') : ''}</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(u => (
                                    <tr key={u.id}>
                                        <td><strong>#{u.id}</strong></td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.address}</td>
                                        <td><span className="badge">{u.role}</span></td>
                                        <td><button onClick={() => viewUserDetail(u.id)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>View</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* User Details Modal (Simple rendering here) */}
            {selectedUser && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ minWidth: '350px', maxWidth: '90%' }}>
                        <h2>User Details</h2>
                        <p><strong>Name:</strong> {selectedUser.name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Address:</strong> {selectedUser.address}</p>
                        <p><strong>Role:</strong> {selectedUser.role}</p>
                        {selectedUser.role === 'store_owner' && (
                            <p><strong>Store Avg Rating:</strong> {selectedUser.storeRating ? selectedUser.storeRating + ' ⭐' : 'No Store / Unrated'}</p>
                        )}
                        <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                        <button onClick={() => setSelectedUser(null)} style={{ marginTop: '1rem', width: '100%' }}>Close</button>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {showAddUser && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto' }}>
                    <div className="card" style={{ minWidth: '350px', maxWidth: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2>Add New User</h2>
                            <button onClick={() => setShowAddUser(false)} style={{ background: 'var(--danger-color)', padding: '0.3rem 0.6rem' }}>X</button>
                        </div>
                        <form onSubmit={handleAddUser}>
                            <div className="form-group"><label>Name</label><input required value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} /></div>
                            <div className="form-group"><label>Email</label><input type="email" required value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} /></div>
                            <div className="form-group"><label>Address</label><input required value={userForm.address} onChange={e => setUserForm({ ...userForm, address: e.target.value })} /></div>
                            <div className="form-group"><label>Password</label><input type="password" required value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} /></div>
                            <div className="form-group"><label>Role</label>
                                <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                                    <option value="user">Normal User</option>
                                    <option value="store_owner">Store Owner</option>
                                    <option value="admin">System Admin</option>
                                </select>
                            </div>
                            <button type="submit" style={{ width: '100%' }}>Create User</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Store Modal */}
            {showAddStore && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto' }}>
                    <div className="card" style={{ minWidth: '350px', maxWidth: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2>Add New Store</h2>
                            <button onClick={() => setShowAddStore(false)} style={{ background: 'var(--danger-color)', padding: '0.3rem 0.6rem' }}>X</button>
                        </div>
                        <form onSubmit={handleAddStore}>
                            <div className="form-group"><label>Store Name</label><input required value={storeForm.name} onChange={e => setStoreForm({ ...storeForm, name: e.target.value })} /></div>
                            <div className="form-group"><label>Store Email</label><input type="email" required value={storeForm.email} onChange={e => setStoreForm({ ...storeForm, email: e.target.value })} /></div>
                            <div className="form-group"><label>Address</label><input required value={storeForm.address} onChange={e => setStoreForm({ ...storeForm, address: e.target.value })} /></div>
                            <div className="form-group"><label>Owner ID (User ID)</label><input type="number" placeholder="Optional" value={storeForm.ownerId} onChange={e => setStoreForm({ ...storeForm, ownerId: e.target.value })} /></div>
                            <button type="submit" style={{ width: '100%' }}>Create Store</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
