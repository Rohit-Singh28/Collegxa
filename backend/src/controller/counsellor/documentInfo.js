const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const documentInfo = async (req, res) => {
  const {
    email,
    idCardUrl,
    marksheetUrl,
    profilePhotoUrl,
    branchName,
    collegeId,
  } = req.body;

  console.log("Request body:", req.body);

  if (
    !email ||
    !idCardUrl ||
    !marksheetUrl ||
    !profilePhotoUrl ||
    !branchName ||
    !collegeId
  ) {
    return res.status(400).json({ error: "All fields are required", data: [] });
  }

  try {
    const doc = await prisma.document.create({
      data: {
        idCardUrl,
        marksheetUrl,
        profilePhotoUrl,
        branchName,
        collegeId,
      },
    });

    const { id } = doc;
    const user = await prisma.counsellor.update({
      where: {
        email,
      },
      data: {
        documentId: id,
      },
    });
    res.status(201).json({ message: user, data: doc });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = documentInfo;
