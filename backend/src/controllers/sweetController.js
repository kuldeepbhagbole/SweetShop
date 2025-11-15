import Sweet from '../models/Sweet.js';

// GET /api/sweets
export const getSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find({});
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/sweets (Admin)
// POST /api/sweets (Admin)
export const createSweet = async (req, res) => {
  const { name, category, price, quantity } = req.body;
  try {
    // YEH HAI FIX: Save karne se pehle Number() mein badlo
    const sweet = new Sweet({
      name,
      category,
      price: Number(price),
      quantity: Number(quantity),
    });

    const createdSweet = await sweet.save();
    res.status(201).json(createdSweet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/sweets/search?query=...
export const searchSweets = async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  let query = {};

  if (name) query.name = { $regex: name, $options: 'i' };
  if (category) query.category = { $regex: category, $options: 'i' };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  try {
    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/sweets/:id (Admin)
export const updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (sweet) {
      sweet.name = req.body.name || sweet.name;
      sweet.category = req.body.category || sweet.category;

      sweet.price = req.body.price || sweet.price;
      sweet.quantity = req.body.quantity || sweet.quantity;

      if (req.body.price !== undefined) {
        sweet.price = Number(req.body.price);
      }
      if (req.body.quantity !== undefined) {
        sweet.quantity = Number(req.body.quantity);
      }
      const updatedSweet = await sweet.save();
      res.json(updatedSweet);
    } else {
      res.status(404).json({ message: 'Sweet not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/sweets/:id (Admin)
export const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (sweet) {
      await sweet.deleteOne();
      res.json({ message: 'Sweet removed' });
    } else {
      res.status(404).json({ message: 'Sweet not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/sweets/:id/purchase
export const purchaseSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (sweet) {
      if (sweet.quantity > 0) {
        sweet.quantity -= 1;
        await sweet.save();
        res.json({ message: 'Purchase successful', currentQuantity: sweet.quantity });
      } else {
        res.status(400).json({ message: 'Out of stock' });
      }
    } else {
      res.status(404).json({ message: 'Sweet not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/sweets/:id/restock (Admin)
export const restockSweet = async (req, res) => {
  const { amount } = req.body; // Expecting { "amount": 10 }
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (sweet) {
      const currentQuantity = Number(sweet.quantity) || 0;
      const restockAmount = Number(amount) || 0;

      sweet.quantity = currentQuantity + restockAmount; 

      await sweet.save();
      res.json({ message: 'Restock successful', currentQuantity: sweet.quantity });
    } else {
      res.status(404).json({ message: 'Sweet not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
