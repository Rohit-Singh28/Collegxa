const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const suggestCollege = async (req, res) => {
  try {
    const { term } = req.query;

    if (!term || term.length < 3) {
      return res.json([]);
    }

    // Prisma query to search for colleges
    const colleges = await prisma.college.findMany({
      where: {
        name: {
          startsWith: term,
          // mode: "insensitive", // Case-insensitive search
        },
      },
      select: {
        id: true,
        name: true,
        sessionFee: true, // Include if needed in the frontend
      },
      take: 10, // Limit to 10 results
    });

    res.json(colleges);
  } catch (error) {
    console.error("Error searching colleges:", error);
    res.status(500).json({ error: "Failed to search colleges" });
  }
};

module.exports = suggestCollege;
