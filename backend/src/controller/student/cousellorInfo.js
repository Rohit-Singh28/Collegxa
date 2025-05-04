const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const counsellorDetails = async (req, res) => {
  const { counsellorId } = req.params;

  const counsellor = await prisma.counsellor.findUnique({
    where: {
      id: parseInt(counsellorId),
    },
    select: {
      name: true,
      id: true,
      document: {
        select: {
          profilePhotoUrl: true,
          branchName: true,
          idCardUrl: true,
          college: {
            select: {
              name: true,
              sessionFee: true,
            },
          },
        },
      },
    },
  });

  if (!counsellor) {
    return res.status(404).json({
      message: "Counsellor not found",
      success: false,
    });
  }

  console.log("Counsellor Info:", counsellor);

  res.status(200).json({
    message: "Counsellor info fetched successfully",
    success: true,
    data: counsellor,
  });
};

module.exports = counsellorDetails;
