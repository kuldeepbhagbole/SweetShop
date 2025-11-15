import { useState, useEffect } from 'react';
import * as api from '../api/sweetApi';
import SweetForm from '../components/SweetForm';
import RestockModal from '../components/RestockModal'; // Import the modal

const AdminPage = () => {
  const [sweets, setSweets] = useState([]);
  const [editingSweet, setEditingSweet] = useState(null);

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [restockSweetId, setRestockSweetId] = useState(null);

  const fetchSweets = async () => {
    const res = await api.getSweets();
    setSweets(res.data);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleFormSubmit = async (sweetData) => {
    try {
      if (editingSweet) {
        await api.updateSweet(editingSweet._id, sweetData);
      } else {
        await api.createSweet(sweetData);
      }
      setEditingSweet(null);
      fetchSweets();
    } catch (error) {
      alert('Operation failed. Check console.');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await api.deleteSweet(id);
        fetchSweets();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  // This function opens the modal
  const handleRestockClick = (id) => {
    setRestockSweetId(id);
    setIsModalOpen(true);
  };

  // This function handles the modal's submit
  const handleRestockSubmit = async (amount) => {
    try {
      await api.restockSweet(restockSweetId, amount);
      fetchSweets();
      setIsModalOpen(false); // Close modal on success
      setRestockSweetId(null);
    } catch (error) {
      alert('Restock failed');
    }
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet);
  };

  return (
    <>
      <RestockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRestockSubmit}
      />
      <div className="admin-page">
        <div className="admin-form-container">
          <SweetForm
            onSubmit={handleFormSubmit}
            initialData={editingSweet}
            onClear={() => setEditingSweet(null)}
          />
        </div>
        <div className="admin-list">
          <h2>Manage Sweets</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sweets.map((sweet) => (
                <tr key={sweet._id}>
                  <td>{sweet.name}</td>
                  <td>{sweet.category}</td>
                  <td>${sweet.price.toFixed(2)}</td>
                  <td>{sweet.quantity}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => handleEdit(sweet)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(sweet._id)}>Delete</button>
                    <button className="btn btn-primary" onClick={() => handleRestockClick(sweet._id)}>Restock</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminPage;