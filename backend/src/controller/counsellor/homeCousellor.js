const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const homeCounsellor = async (req, res) => {
  try {
    const counsellors = await prisma.counsellor.findMany({
      take: 7,
      select: {
        id: true,
        name: true,
        email: true,
        document: {
          select: {
            profilePhotoUrl: true,
            college: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formatted = counsellors.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      profilePhoto: c.document?.profilePhotoUrl || null,
      collegeName: c.document?.college?.name || null,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching counsellors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = homeCounsellor;
