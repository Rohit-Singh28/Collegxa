const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const counsellorByClgId = async (req, res) => {
  const { collegeId } = req.params;
  if (!collegeId) {
    return res.status(400).json({
      message: "College ID is required",
      success: false,
    });
  }

  const college = await prisma.college.findUnique({
    where: {
      id: parseInt(collegeId),
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
        collegeId: parseInt(collegeId),
      },
    },
  });
  if (!counsellors) {
    return res.status(404).json({
      message: "Counsellors not found",
      success: false,
    });
  }
  res.json(counsellors);
};

module.exports = counsellorByClgId;
