import { useState, useEffect } from 'react';

const SweetForm = ({ onSubmit, initialData, onClear }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', category: '', price: '', quantity: '' });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    };

    onSubmit(dataToSubmit); // Sahi data submit karein
    setFormData({ name: '', category: '', price: '', quantity: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="form-title">
        {initialData ? 'Edit Sweet' : 'Add New Sweet'}
      </h3>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Category</label>
        <input
          type="text"
          name="category"
          className="form-control"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          name="price"
          step="0.01"
          className="form-control"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          className="form-control"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Update' : 'Add'}
        </button>
        {initialData && (
          <button type="button" className="btn btn-secondary" onClick={onClear}>
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default SweetForm;