import { purchaseSweet } from '../api/sweetApi';

const SweetCard = ({ sweet, onPurchase }) => {
  
  const handlePurchase = async () => {
    try {
      const res = await purchaseSweet(sweet._id);
      onPurchase(sweet._id, res.data.currentQuantity);
      alert('Purchase successful!');
    } catch (error) {
      alert(error.response?.data?.message || 'Purchase failed');
    }
  };

  return (
    <div className="sweet-card">
      <div className="sweet-card-image">
        {/* Placeholder for an image */}
        🍭
      </div>
      <div className="sweet-card-body">
        <h3 className="sweet-card-title">{sweet.name}</h3>
        <span className="sweet-card-category">{sweet.category}</span>
        <div className="sweet-card-details">
          <span className="sweet-card-price">${sweet.price.toFixed(2)}</span>
          <span className="sweet-card-quantity">
            {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of Stock'}
          </span>
        </div>
        <div className="sweet-card-actions">
          <button
            className="btn btn-primary"
            onClick={handlePurchase}
            disabled={sweet.quantity === 0}
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default SweetCard;