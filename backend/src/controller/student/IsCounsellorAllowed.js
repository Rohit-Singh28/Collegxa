const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const isCounsellorAllowed = async (req, res) => {
  const { counsellorId } = req.params;
  const userId = req.currentUser.id;

  try {
    // Check if the counsellor exists and is verified
    const counsellor = await prisma.counsellor.findUnique({
      where: { id: Number(counsellorId) },
    });

    // console.log(counsellorId, userId);

    if (!counsellor) {
      return res.json({
        error: true,
        success: false,
        message:
          "Access denied. You are not allowed to access this counsellor's services.",
        data: null,
      });
    }

    // Check if the user is a student of the same college as the counsellor
    const student = await prisma.student.findUnique({
      where: { id: Number(userId) },
    });

    const course = await prisma.cousellorStudentAccess.findFirst({
      where: {
        studentId: Number(userId),
        counsellorId: Number(counsellorId),
        IsAllowed: "TRUE",
      },
    });

    if (!course) {
      return res.json({
        error: true,
        success: false,
        message:
          "Access denied. You are not allowed to access this counsellor's services.",
        data: null,
      });
    }

    // If all checks pass, allow access
    return res.status(200).json({
      error: false,
      success: true,
      message: "Allowed",
      data: course,
    });
  } catch (error) {
    console.error("Error checking counsellor access:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = isCounsellorAllowed;
