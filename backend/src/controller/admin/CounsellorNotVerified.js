const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const counsellorNotVerified = async (req, res) => {
  console.log("Fetching unverified counsellors...");

  const counsellorInfo = await prisma.counsellor.findMany({
    where: {
      isVerified: false,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      document: {
        select: {
          profilePhotoUrl: true,
          idCardUrl: true,
          marksheetUrl: true,
          branchName: true,
          college: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!counsellorInfo) {
    return res
      .status(404)
      .json({ message: "No unverified counsellors found." });
  }

  return res.status(200).json({
    success: true,
    counsellorInfo: counsellorInfo,
  });
};

module.exports = counsellorNotVerified;
