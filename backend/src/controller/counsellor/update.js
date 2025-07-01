const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const update = async (req, res) => {
  const currentCounsellor = req.currentUser;
  const counsellorId = currentCounsellor.id;

  const { UPI } = req.body;

  console.log(UPI);

  if (!UPI) {
    return res.status(400).json({
      message: "UPI is required",
      success: false,
    });
  }

  const updatedCounsellor = await prisma.counsellor.update({
    where: { id: counsellorId },
    data: { UPI },
  });

  return res.status(200).json({
    message: "Counsellor updated successfully",
    success: true,
    data: updatedCounsellor,
  });
};

module.exports = update;
