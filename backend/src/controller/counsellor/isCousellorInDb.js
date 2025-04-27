const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const isCousellorInDb = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Counsellor ID is required",
      success: false,
    });
  }

  const counsellor = await prisma.counsellor.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!counsellor) {
    return res.status(404).json({
      message: "Counsellor not found",
      success: false,
      exits: false,
    });
  }

  res.status(200).json({
    message: "Counsellor info fetched successfully",
    success: true,
    data: counsellor,
    exits: true,
  });
};

module.exports = isCousellorInDb;
