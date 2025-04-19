const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // 1. Create Colleges
  const college1 = await prisma.college.create({
    data: { name: "Delhi University", sessionFee: 500 },
  });

  const college2 = await prisma.college.create({
    data: { name: "IIT Bombay", sessionFee: 0 },
  });

  // 2. Create Registration Keys
  await prisma.registrationAccess.createMany({
    data: [
      { email: "counsellor1@example.com", privateKey: "abc123" },
      { email: "counsellor2@example.com", privateKey: "def456" },
      { email: "counsellor3@example.com", privateKey: "ghi789" },
    ],
  });

  // 3. Create Counsellors + Documents
  const doc1 = await prisma.document.create({
    data: {
      idCardUrl: "https://dummyimg.com/id1.jpg",
      marksheetUrl: "https://dummyimg.com/mark1.jpg",
      profilePhotoUrl: "https://dummyimg.com/photo1.jpg",
      branchName: "Computer Science",
      collegeId: college1.id,
    },
  });

  const doc2 = await prisma.document.create({
    data: {
      idCardUrl: "https://dummyimg.com/id2.jpg",
      marksheetUrl: "https://dummyimg.com/mark2.jpg",
      profilePhotoUrl: "https://dummyimg.com/photo2.jpg",
      branchName: "Electrical",
      collegeId: college2.id,
    },
  });

  const doc3 = await prisma.document.create({
    data: {
      idCardUrl: "https://dummyimg.com/id3.jpg",
      marksheetUrl: "https://dummyimg.com/mark3.jpg",
      profilePhotoUrl: "https://dummyimg.com/photo3.jpg",
      branchName: "Mechanical",
      collegeId: college1.id,
    },
  });

  // 4. Create Counsellors
  await prisma.counsellor.createMany({
    data: [
      {
        name: "Alice Sharma",
        phone: "9876543210",
        email: "counsellor1@example.com",
        documentId: doc1.id,
      },
      {
        name: "Bob Kumar",
        phone: "9123456780",
        email: "counsellor2@example.com",
        documentId: doc2.id,
      },
      {
        name: "Carol Singh",
        phone: "9988776655",
        email: "counsellor3@example.com",
        documentId: doc3.id,
      },
    ],
  });

  console.log("✅ Seed data inserted!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
