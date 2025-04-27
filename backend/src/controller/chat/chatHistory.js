const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const chatHistory = async (req, res) => {
  const { studentId, counselorId } = req.query;
  console.log("Fetching chat history for:", studentId, counselorId);

  if (!studentId || !counselorId) {
    return res.status(400).json({ error: "Missing studentId or counselorId" });
  }

  try {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          // Student to Counselor messages
          {
            studentSenderId: parseInt(studentId),
            counsellorReceiverId: parseInt(counselorId),
          },
          // Counselor to Student messages
          {
            counsellorSenderId: parseInt(counselorId),
            studentReceiverId: parseInt(studentId),
          },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(chats);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

module.exports = chatHistory;
