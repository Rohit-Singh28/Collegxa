const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const counsellorByClgId = async (req, res) => {
  const { collegeId } = req.params;
  console.log(collegeId);
  if (!collegeId) {
    return res.status(400).json({
      message: "College ID is required",
      success: false,
    });
  }

  const college = await prisma.college.findMany({
    where: {
      name: collegeId,
    },
  });

  if (!college) {
    return res.status(404).json({
      message: "College not found",
      success: false,
    });
  }

  const counsellors = await prisma.counsellor.findMany({
    where: {
      document: {
        college: {
          name: collegeId,
        },
      },
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
  if (!counsellors || counsellors.length === 0) {
    return res.status(404).json({
      message: "Counsellors not found",
      success: false,
    });
  }

  console.log(counsellors);

  res.json(counsellors);
};

module.exports = counsellorByClgId;
