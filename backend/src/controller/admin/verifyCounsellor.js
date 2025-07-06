const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const verfiyCounsellor = async (req, res) => {
  const { counsellorId } = req.params;
  const id = Number(counsellorId);
  console.log(id);

  const counsellor = await prisma.counsellor.findUnique({ where: { id } });

  if (!counsellor) {
    return res.status(404).json({ message: "Counsellor not found" });
  }

  const updatedCounsellor = await prisma.counsellor.update({
    where: { id },
    data: { isVerified: true },
  });
  if (!updatedCounsellor) {
    return res.status(500).json({ message: "Failed to verify counsellor" });
  }
  res.status(200).json({ success: true, counsellor: updatedCounsellor });
};

module.exports = verfiyCounsellor;
