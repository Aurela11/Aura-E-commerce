const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();

// Krijo një checkout session me Stripe
router.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;
  try {
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send({ message: "Failed to create checkout session" });
  }
});

// Konfirmo pagesën dhe ruaj porosinë në PostgreSQL
router.post("/confirm-payment", async (req, res) => {
  const { session_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

    const paymentIntentId = session.payment_intent.id;

    let order = await prisma.order.findUnique({
      where: { orderId: paymentIntentId },
    });

    if (!order) {
      const lineItems = session.line_items.data.map((item) => ({
        productId: item.price.product,
        quantity: item.quantity,
      }));

      order = await prisma.order.create({
        data: {
          orderId: paymentIntentId,
          amount: session.amount_total / 100,
          products: lineItems,
          email: session.customer_details.email,
          status: session.payment_intent.status === "succeeded" ? "pending" : "failed",
        },
      });
    } else {
      order = await prisma.order.update({
        where: { orderId: paymentIntentId },
        data: { status: session.payment_intent.status === "succeeded" ? "pending" : "failed" },
      });
    }

    res.json({ order });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).send({ message: "Failed to confirm payment" });
  }
});

// Merr të gjitha porositë e një email-i
router.get("/:email", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ where: { email: req.params.email } });
    res.status(200).send({ orders });
  } catch (error) {
    console.error("Error fetching orders by email", error);
    res.status(500).send({ message: "Failed to fetch orders by email" });
  }
});

// Merr një porosi sipas ID
// Në orders.route.js
router.get("/:orderId", async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
    });
    res.status(200).json(order); // Kthe si JSON
  } catch (error) {
    res.status(500).json({ error: "Gabim serveri" });
  }
});

// Merr të gjitha porositë
router.get("/", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      select: { // Shtoni këtë pjesë
        id: true,
        orderId: true,
        email: true,
        status: true,
        amount: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.status(200).send(orders);
  } catch (error) {
    console.error("Error fetching all orders", error);
    res.status(500).send({ message: "Failed to fetch all orders" });
  }
});

// Përditëso statusin e një porosie
// Change this route:
router.patch("/update-order-status/:id", async (req, res) => { // Removed duplicate /api/orders
  const { status } = req.body;
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.status(200).json({ message: "Order status updated successfully", updatedOrder });
  } catch (error) {
    console.error("Error updating order status", error);
    res.status(500).send({ message: "Failed to update order status" });
  }
});

// Fshij një porosi
router.delete("/delete-order/:id", async (req, res) => {
  try {
    await prisma.order.delete({
        where: { id: req.params.id.toString() },
      });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order", error);
    res.status(500).send({ message: "Failed to delete order" });
  }
});

module.exports = router;
