const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clear existing data (optional - remove if you don't want to clear the database)
  await prisma.completedSession.deleteMany({});
  await prisma.sessionRequest.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.counsellor.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.registrationAccess.deleteMany({});

  console.log("Cleared existing data");

  // Create colleges
  const colleges = await prisma.college.createMany({
    data: [
      { name: "University of Technology", sessionFee: 1000 },
      { name: "State Engineering College", sessionFee: 1200 },
      { name: "National Science Institute", sessionFee: 1500 },
      { name: "Medical University", sessionFee: 2000 },
    ],
  });
  console.log("Created colleges:", colleges);

  // Get college IDs for reference
  const collegeList = await prisma.college.findMany();

  // Create documents
  const documents = await prisma.document.createMany({
    data: [
      {
        idCardUrl: "https://storage.example.com/id/doc1.pdf",
        marksheetUrl: "https://storage.example.com/marksheet/ms1.pdf",
        profilePhotoUrl: "https://storage.example.com/profile/p1.jpg",
        collegeId: collegeList[0].id,
        branchName: "Computer Science",
      },
      {
        idCardUrl: "https://storage.example.com/id/doc2.pdf",
        marksheetUrl: "https://storage.example.com/marksheet/ms2.pdf",
        profilePhotoUrl: "https://storage.example.com/profile/p2.jpg",
        collegeId: collegeList[1].id,
        branchName: "Mechanical Engineering",
      },
      {
        idCardUrl: "https://storage.example.com/id/doc3.pdf",
        marksheetUrl: "https://storage.example.com/marksheet/ms3.pdf",
        profilePhotoUrl: "https://storage.example.com/profile/p3.jpg",
        collegeId: collegeList[2].id,
        branchName: "Physics",
      },
      {
        idCardUrl: "https://storage.example.com/id/doc4.pdf",
        marksheetUrl: "https://storage.example.com/marksheet/ms4.pdf",
        profilePhotoUrl: "https://storage.example.com/profile/p4.jpg",
        collegeId: collegeList[3].id,
        branchName: "Medicine",
      },
    ],
  });
  console.log("Created documents:", documents);

  // Get document IDs for reference
  const documentList = await prisma.document.findMany();

  // Create registration access
  const registrationAccess = await prisma.registrationAccess.createMany({
    data: [
      { email: "john.smith@example.com", privateKey: "key123456" },
      { email: "sarah.jones@example.com", privateKey: "key234567" },
      { email: "mike.wilson@example.com", privateKey: "key345678" },
      { email: "emily.clark@example.com", privateKey: "key456789" },
    ],
  });
  console.log("Created registration access records:", registrationAccess);

  // Create counsellors
  const counsellors = await Promise.all([
    prisma.counsellor.create({
      data: {
        name: "John Smith",
        password: await bcrypt.hash("password123", 10),
        phone: "9876543210",
        email: "john.smith@example.com",
        documentId: documentList[0].id,
      },
    }),
    prisma.counsellor.create({
      data: {
        name: "Sarah Jones",
        password: await bcrypt.hash("password234", 10),
        phone: "8765432109",
        email: "sarah.jones@example.com",
        documentId: documentList[1].id,
      },
    }),
    prisma.counsellor.create({
      data: {
        name: "Mike Wilson",
        password: await bcrypt.hash("password345", 10),
        phone: "7654321098",
        email: "mike.wilson@example.com",
        documentId: documentList[2].id,
      },
    }),
  ]);
  console.log("Created counsellors");

  // Create students
  const students = await Promise.all([
    prisma.student.create({
      data: {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "9876123450",
        passwordHash: await bcrypt.hash("studentpass1", 10),
      },
    }),
    prisma.student.create({
      data: {
        name: "Jamie Rodriguez",
        email: "jamie.rodriguez@example.com",
        phone: "8765123459",
        passwordHash: await bcrypt.hash("studentpass2", 10),
      },
    }),
    prisma.student.create({
      data: {
        name: "Taylor Kim",
        email: "taylor.kim@example.com",
        phone: "7654123458",
        passwordHash: await bcrypt.hash("studentpass3", 10),
      },
    }),
    prisma.student.create({
      data: {
        name: "Morgan Patel",
        email: "morgan.patel@example.com",
        phone: "6543123457",
        passwordHash: await bcrypt.hash("studentpass4", 10),
      },
    }),
  ]);
  console.log("Created students");

  // Create session requests
  const sessionRequests = await Promise.all([
    prisma.sessionRequest.create({
      data: {
        studentId: students[0].id,
        counsellorId: counsellors[0].id,
        chatSessionCode: "SESSION001",
        status: "completed",
      },
    }),
    prisma.sessionRequest.create({
      data: {
        studentId: students[1].id,
        counsellorId: counsellors[1].id,
        chatSessionCode: "SESSION002",
        status: "pending",
      },
    }),
    prisma.sessionRequest.create({
      data: {
        studentId: students[2].id,
        counsellorId: counsellors[2].id,
        chatSessionCode: "SESSION003",
        status: "pending",
      },
    }),
    prisma.sessionRequest.create({
      data: {
        studentId: students[3].id,
        counsellorId: counsellors[0].id,
        chatSessionCode: "SESSION004",
        status: "completed",
      },
    }),
  ]);
  console.log("Created session requests");

  // Create completed sessions
  const completedSessions = await Promise.all([
    prisma.completedSession.create({
      data: {
        sessionRequestId: sessionRequests[0].id,
        startedAt: new Date("2025-04-20T10:00:00Z"),
        endedAt: new Date("2025-04-20T11:30:00Z"),
        studentFeedback: "Very helpful session!",
        rating: 5,
      },
    }),
    prisma.completedSession.create({
      data: {
        sessionRequestId: sessionRequests[3].id,
        startedAt: new Date("2025-04-22T14:00:00Z"),
        endedAt: new Date("2025-04-22T15:15:00Z"),
        studentFeedback: "Good advice, but session was a bit short.",
        rating: 4,
      },
    }),
  ]);
  console.log("Created completed sessions");

  console.log("Database seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
