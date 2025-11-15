import { useState, useEffect } from 'react';
import { searchSweets } from '../api/sweetApi';
import SweetCard from '../components/SweetCard';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const DashboardPage = () => {
  const [sweets, setSweets] = useState([]);
  const { user,loading } = useAuth();

  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  // Fetch all sweets on load
  const fetchAllSweets = async () => {
    try {
      const res = await searchSweets({}); // Empty search gets all
      setSweets(res.data);
    } catch (error) {
      console.error('Failed to fetch sweets', error);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchAllSweets();
    }
  }, [user]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await searchSweets(filters);
      setSweets(res.data);
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  const handleClear = () => {
    setFilters({ name: '', category: '', minPrice: '', maxPrice: '' });
    fetchAllSweets(); // Refetch all
  };

  const updateSweetQuantity = (id, newQuantity) => {
    setSweets(prevSweets =>
      prevSweets.map(sweet =>
        sweet._id === id ? { ...sweet, quantity: newQuantity } : sweet
      )
    );
  };

  if (loading) {
  return <div>Loading sweets...</div>; // Ya koi bhi loading message
}

if (!user) {
  return <Navigate to="/login" replace />;
}

  return (
    <div>
      <header className="dashboard-header">
        <h2>Available Sweets</h2>
        <form className="filter-bar" onSubmit={handleSearch}>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Search by name..."
            value={filters.name}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="category"
            className="form-control"
            placeholder="Search by category..."
            value={filters.category}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="minPrice"
            className="form-control"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxPrice"
            className="form-control"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
          <button type="button" className="btn btn-primary" onClick={handleClear}>
            Clear
          </button>
        </form>
      </header>

      <div className="sweets-grid">
        {sweets.length > 0 ? (
          sweets.map((sweet) => (
            <SweetCard
              key={sweet._id}
              sweet={sweet}
              onPurchase={updateSweetQuantity}
            />
          ))
        ) : (
          <p>No sweets found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;