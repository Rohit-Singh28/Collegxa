const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const deleteAdmin = async (req, res) => {
  const { counsellorId } = req.params;
  const id = Number(counsellorId);

  const counsellor = await prisma.counsellor.findUnique({ where: { id } });

  if (!counsellor) {
    return res.status(404).json({ message: "Counsellor not found" });
  }

  // Step 1: Get all sessionRequestIds for this counsellor
  const sessionRequests = await prisma.sessionRequest.findMany({
    where: { counsellorId: id },
    select: { id: true },
  });

  const sessionRequestIds = sessionRequests.map((sr) => sr.id);

  // Step 2: Delete related completed sessions first
  await prisma.completedSession.deleteMany({
    where: { sessionRequestId: { in: sessionRequestIds } },
  });

  // Step 3: Delete session requests
  await prisma.sessionRequest.deleteMany({
    where: { id: { in: sessionRequestIds } },
  });

  // Step 4: Delete other related data
  await prisma.payment.deleteMany({ where: { counsellorId: id } });
  await prisma.cousellorStudentAccess.deleteMany({
    where: { counsellorId: id },
  });
  await prisma.chat.deleteMany({ where: { counsellorSenderId: id } });
  await prisma.chat.deleteMany({ where: { counsellorReceiverId: id } });
  await prisma.feedback.deleteMany({ where: { counsellorId: id } });

  // Step 5: Optionally delete associated document (if exists)
  if (counsellor.documentId) {
    await prisma.document.delete({ where: { id: counsellor.documentId } });
  }

  // Step 6: Delete the counsellor
  await prisma.counsellor.delete({ where: { id } });

  res.status(200).json({ success: true });
};

module.exports = deleteAdmin;
