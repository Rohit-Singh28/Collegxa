const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const feedback = async (req, res) => {
  const {
    communicationRating,
    recommendationRating,
    sessionQuality,
    counselorRating,
    helpfulnessRating,
  } = req.body;
  const { counselorFeedback, sessionLink, mostHelpful, counsellorId } =
    req.body;

  const { id } = req.currentUser;
  if (
    !communicationRating ||
    !recommendationRating ||
    !sessionQuality ||
    !counselorRating ||
    !helpfulnessRating ||
    !counselorFeedback ||
    !sessionLink ||
    !mostHelpful
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const data = await prisma.student.findUnique({
    where: { studentId: Number(id), counsellorId: Number(counsellorId) },
  });

  if (data) {
    return res
      .status(400)
      .json({ success: false, message: "Feedback already submitted" });
  }

  const rating =
    (communicationRating +
      recommendationRating +
      sessionQuality +
      counselorRating +
      helpfulnessRating) /
    5;

  const feedbackData = {
    rating: Math.round(Number(rating)),
    counselorFeedback,
    sessionLink,
    mostHelpful,
    studentId: Number(id),
    counsellorId: Number(counsellorId),
  };

  const feedbackResponse = await prisma.feedback.create({
    data: feedbackData,
  });

  if (!feedbackResponse) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to submit feedback" });
  }

  return res.status(200).json({
    success: true,
    message: "Feedback submitted successfully",
    data: feedbackResponse,
  });
};

module.exports = feedback;
