const { instance } = require("../../../utils/razorpay");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const checkout = async (req, res) => {
  const { amount, counsellorId } = req.body;
  const { id, email } = req.currentUser;

  const options = {
    amount: Number(amount) * 100,
    currency: "INR",
    receipt: `receipt_${id}_${counsellorId}`,
    notes: {
      counsellorId: counsellorId,
      studentId: id,
      studentEmail: email || mail,
    },
  };

  const order = await instance.orders.create(options);
  if (!order) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred while creating the order",
    });
  }

  // console.log(counsellorId);

  // Save order details in the database
  const payment = await prisma.payment.create({
    data: {
      counsellorId: Number(counsellorId),
      studentId: Number(id),
      amount: Number(amount),
      orderID: order?.id,
    },
  });

  const Course = await prisma.cousellorStudentAccess.create({
    data: {
      counsellorId: Number(counsellorId),
      studentId: Number(id),
      orderID: order.id,
    },
  });

  res.status(200).json({
    success: true,
    order,
  });
};

module.exports = checkout;
