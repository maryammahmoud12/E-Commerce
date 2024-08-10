import { asyncHandler } from "../../middleware/asynchandler.js";
import { appError } from "../../utils/appError.js";
import { createInvoice } from "../../utils/pdf.js";

import orderModel from "../../../DB/models/order.model.js";
import couponModel from "../../../DB/models/coupon.model.js";
import productModel from "../../../DB/models/product.model.js";
import cartModel from "../../../DB/models/cart.model.js";
import { sendEmail } from "../../service/sendEmail.js";
import { payment } from "../../utils/payment.js";

// add order

export const createOreder = async (req, res, next) => {
  const { productId, quantity, couponCode, address, phone, paymentMethod } =
    req.body;

  if (couponCode) {
    const coupon = await couponModel.findOne({
      code: couponCode,
      usedBy: { $nin: [req.user._id] },
    });
    if (!coupon || coupon.toDate < Date.now()) {
      return next(new appError("coupon not found or expired", 280));
    }
    req.body.coupon = coupon;
  }

  let products = [];
  let flag = false;

  if (productId) {
    products = [{ productId, quantity }];
  } else {
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart.products.length) {
      return next(new appError("cart is empty , please select product", 282));
    }
    products = cart.products;
    flag = true;
  }

  let finalProducts = [];
  let subPrice = 0;
  for (const product of products) {
    const checkProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
    });
    if (!checkProduct) {
      return next(new appError("product not found", 281));
    }
    if (flag) {
      product == product.toObject();
    }

    product.title = checkProduct.title;
    product.price = checkProduct.price;
    product.finalPrice = checkProduct.subPrice * product.quantity;
    subPrice += product.finalPrice;

    finalProducts.push(product);
  }

  const order = await orderModel.create({
    user: req.user._id,
    products: finalProducts,
    subPrice,
    couponId: req.body?.coupon?._id,
    totalPrice: subPrice - subPrice * ((req.body.coupon?.amount || 0) / 100),
    address,
    phone,
    paymentMethod,
    status: paymentMethod == "cash" ? "placed" : "waitPayment",
  });

  if (req.body?.coupon) {
    await couponModel.updateOne(
      { _id: req.body.coupon._id },
      { $push: { usedBy: req.user._id } }
    );
  }

  for (const product of finalProducts) {
    await productModel.findOneAndUpdate(
      { _id: product.productId },
      { $inc: { stock: -product.quantity } }
    );
  }

  if (flag) {
    await cartModel.updateOne({ user: req.user._id }, { products: [] });
  }

  // const invoice = {
  //   shipping: {
  //     name: req.user.name,
  //     address: req.user.address,
  //     city: "Damietta",
  //     state: "Egypt",
  //     country: "Egypt",
  //     postal_code: 94111,
  //   },
  //   items: order.products,
  //   subtotal: subPrice,
  //   paid: order.totalPrice,
  //   invoice_nr: order._id,
  //   date: order.createdAt,
  //   coupon: req.body?.coupon?.amount || 0,
  // };

  // await createInvoice(invoice, "invoice.pdf");

  // await sendEmail(req.user.email, "order placed", "your order", [
  //   {
  //     path: "invoice.pdf",
  //     contentType: "application/pdf",
  //   },
  // ]);

  // req.data = {
  //   model: orderModel,
  //   id: order._id,
  // };

  if (paymentMethod == "card") {
    const stripe = new Stripe(process.env.stripe);

    if (req.body?.coupon) {
      const coupon = await stripe.coupons.create({
        percent_off: req.body.coupon.amount,
        duration: "once",
      });
      req.body.couponId = coupon.id;
    }
    const session = await payment({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      metadata: {
        orderId: order._id.toString(),
      },
      success_url: `${req.protocol}://${req.headers.host}/order/success/${order._id}`,
      cancel_url: `${req.protocol}://${req.headers.host}/order/canceled/${order._id}`,
      line_items: order.products.map((product) => {
        return {
          price_data: {
            currency: "egp",
            product_data: {
              name: product.title,
            },
            unit_amount: product.price * 100,
          },
          quantity: product.quantity,
        };
      }),
      discounts: req.body?.coupon ? [{ coupon: req.body.couponId }] : [],
    });
    return res.json({ msg: "done", url: session.url, session });
  }

  res.status(282).json({ msg: "done", order });
};

// cancle order

export const cancleOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;
  const order = await orderModel.findOne({ _id: id, user: req.user._id });
  if (!order) {
    return next(new appError("order not found", 283));
  }
  if (
    (order.paymentMethod === "cash" && order.status !== "placed") ||
    (order.paymentMethod === "card" && order.status !== "waitPayment")
  ) {
    return next(new appError("ypu can't cancle order", 284));
  }

  await orderModel.updateOne(
    { _id: id },
    { status: "cancelled", canceledBy: req.user._id, reason }
  );

  if (order?.couponId) {
    await couponModel.updateOne(
      { _id: order?.couponId },
      { $pull: { usedBy: req.user._id } }
    );
  }

  for (const product of order.products) {
    await productModel.updateOne(
      { _id: product.productId },
      { $inc: { stock: product.quantity } }
    );
  }

  res.status(285).json({ msg: "done" });
});
