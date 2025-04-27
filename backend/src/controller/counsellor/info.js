const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const counsellorInfo = async (req, res) => {
  const currentStudent = req.currentUser;
  const counsellorId = currentStudent.id;
  const counsellor = await prisma.counsellor.findUnique({
    where: {
      id: counsellorId,
    },
  });

  if (!counsellor) {
    return res.status(404).json({
      message: "Counsellor not found",
      success: false,
    });
  }

  res.status(200).json({
    message: "Counsellor info fetched successfully",
    success: true,
    data: counsellor,
  });
};

module.exports = counsellorInfo;
