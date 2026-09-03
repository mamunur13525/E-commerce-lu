import { Router, Request, Response } from 'express';
import { OrderModel } from '../models/Order.js';
import { isMongoConnected, fallbackStore } from '../db.js';

export const ordersRouter = Router();

// GET all orders
ordersRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { email, status } = req.query;

    if (isMongoConnected()) {
      const query: any = {};
      if (email) query.customerEmail = String(email).toLowerCase();
      if (status) query.status = status;

      const orders = await OrderModel.find(query).sort({ orderDate: -1 }).lean();
      return res.json(orders);
    } else {
      let orders = [...fallbackStore.orders];
      if (email) orders = orders.filter(o => o.customerEmail.toLowerCase() === String(email).toLowerCase());
      if (status) orders = orders.filter(o => o.status === status);
      orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      return res.json(orders);
    }
  } catch (err: any) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
});

// GET single order by ID or orderNumber or trackingNumber
ordersRouter.get('/:idOrNumber', async (req: Request, res: Response) => {
  try {
    const { idOrNumber } = req.params;

    if (isMongoConnected()) {
      const order = await OrderModel.findOne({
        $or: [
          { id: idOrNumber },
          { orderNumber: idOrNumber },
          { trackingNumber: idOrNumber },
        ],
      }).lean();

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.json(order);
    } else {
      const order = fallbackStore.orders.find(
        o => o.id === idOrNumber || o.orderNumber === idOrNumber || o.trackingNumber === idOrNumber
      );
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.json(order);
    }
  } catch (err: any) {
    console.error('Error fetching order:', err);
    return res.status(500).json({ error: 'Failed to fetch order', details: err.message });
  }
});

// POST create order
ordersRouter.post('/', async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    if (!orderData.id) {
      orderData.id = 'ord-' + Date.now().toString(36);
    }
    if (!orderData.orderNumber) {
      orderData.orderNumber = 'LUM-' + Math.floor(100000 + Math.random() * 900000);
    }
    if (!orderData.trackingNumber) {
      orderData.trackingNumber = 'TRK-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    }
    if (!orderData.carrier) {
      orderData.carrier = 'Carbon-Neutral Express';
    }
    if (!orderData.deliveryOption || typeof orderData.deliveryOption !== 'object') {
      orderData.deliveryOption = {
        id: 'del-std',
        name: 'Standard Carbon-Neutral Delivery',
        description: 'Delivered in 100% recyclable packaging',
        price: Number(orderData.deliveryCharge) || 0,
        estimatedDays: '3-5 Business Days',
        isDefault: true,
      };
    }
    if (!orderData.orderDate) {
      orderData.orderDate = new Date().toISOString();
    }
    if (!orderData.emailSentTo) {
      orderData.emailSentTo = orderData.customerEmail;
    }

    if (isMongoConnected()) {
      const created = await OrderModel.create(orderData);
      return res.status(201).json(created);
    } else {
      fallbackStore.orders.unshift(orderData);
      return res.status(201).json(orderData);
    }
  } catch (err: any) {
    console.error('Error creating order in MongoDB:', err);
    return res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

// PATCH order status
ordersRouter.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isMongoConnected()) {
      const updated = await OrderModel.findOneAndUpdate(
        { id },
        { $set: { status } },
        { new: true }
      ).lean();

      if (!updated) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.json(updated);
    } else {
      const index = fallbackStore.orders.findIndex(o => o.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Order not found' });
      }
      fallbackStore.orders[index].status = status;
      return res.json(fallbackStore.orders[index]);
    }
  } catch (err: any) {
    console.error('Error updating order status:', err);
    return res.status(500).json({ error: 'Failed to update order status', details: err.message });
  }
});

// PUT update full order
ordersRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected()) {
      const updated = await OrderModel.findOneAndUpdate(
        { id },
        { $set: updates },
        { new: true }
      ).lean();

      if (!updated) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.json(updated);
    } else {
      const index = fallbackStore.orders.findIndex(o => o.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Order not found' });
      }
      fallbackStore.orders[index] = { ...fallbackStore.orders[index], ...updates };
      return res.json(fallbackStore.orders[index]);
    }
  } catch (err: any) {
    console.error('Error updating order:', err);
    return res.status(500).json({ error: 'Failed to update order', details: err.message });
  }
});

// DELETE order
ordersRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const deleted = await OrderModel.findOneAndDelete({ id });
      if (!deleted) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.json({ success: true, message: 'Order deleted from MongoDB' });
    } else {
      const index = fallbackStore.orders.findIndex(o => o.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Order not found' });
      }
      fallbackStore.orders.splice(index, 1);
      return res.json({ success: true, message: 'Order deleted' });
    }
  } catch (err: any) {
    console.error('Error deleting order:', err);
    return res.status(500).json({ error: 'Failed to delete order', details: err.message });
  }
});

