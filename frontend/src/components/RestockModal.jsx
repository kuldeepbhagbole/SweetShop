import { useState } from 'react';

const RestockModal = ({ isOpen, onClose, onSubmit }) => {
  const [amount, setAmount] = useState(10);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Amount must be positive');
      return;
    }
    onSubmit(amount);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="form-title">Restock Sweet</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="restockAmount">Amount to Add:</label>
            <input
              type="number"
              id="restockAmount"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="1"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Restock</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockModal;