const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const studentInfo = async (req, res) => {
  const currentStudent = req.currentUser;
  const studentId = currentStudent.id;
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    return res.status(404).json({
      message: "Student not found",
      success: false,
    });
  }

  res.status(200).json({
    message: "Student info fetched successfully",
    success: true,
    data: student,
  });
};

module.exports = studentInfo;
