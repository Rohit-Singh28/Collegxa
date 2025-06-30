const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const verify = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const { id, email } = req.currentUser;
  console.log(razorpay_order_id);

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here
    const payment = await prisma.payment.update({
      where: {
        orderID: razorpay_order_id,
      },
      data: {
        paymentID: razorpay_payment_id,
        signature: razorpay_signature,
        status: "success",
      },
    });

    const Course = await prisma.cousellorStudentAccess.update({
      where: {
        orderID: razorpay_order_id,
      },
      data: {
        IsAllowed: "True",
      },
    });

    res.redirect(
      `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};

module.exports = verify;
