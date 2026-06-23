import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  // Wipe existing data (optional, for idempotency)
  await db.application.deleteMany();
  await db.job.deleteMany();
  await db.user.deleteMany();

  // ---- Admin user ----
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const admin = await db.user.create({
    data: {
      name: "Admin User",
      email: "admin@jobportal.com",
      password: adminPassword,
      role: "ADMIN",
      phone: "+1 555-0100",
      skills: "Management, Hiring, Operations",
    },
  });

  // ---- Candidate users ----
  const cand1Pass = await bcrypt.hash("password1234", 10);
  const cand1 = await db.user.create({
    data: {
      name: "Aarav Sharma",
      email: "aarav@example.com",
      password: cand1Pass,
      role: "CANDIDATE",
      phone: "+91 9876543210",
      skills: "React, TypeScript, Node.js, Tailwind CSS",
      resumeUrl: "https://example.com/resume-aarav.pdf",
    },
  });

  const cand2Pass = await bcrypt.hash("password1234", 10);
  const cand2 = await db.user.create({
    data: {
      name: "Priya Patel",
      email: "priya@example.com",
      password: cand2Pass,
      role: "CANDIDATE",
      phone: "+91 9988776655",
      skills: "Python, Django, PostgreSQL, Docker",
    },
  });

  const cand3Pass = await bcrypt.hash("password1234", 10);
  const cand3 = await db.user.create({
    data: {
      name: "Rohan Mehta",
      email: "rohan@example.com",
      password: cand3Pass,
      role: "CANDIDATE",
      phone: "+91 9000000001",
      skills: "Java, Spring Boot, Kafka, AWS",
    },
  });

  // ---- Jobs ----
  const jobs = [
    {
      title: "Senior Frontend Engineer",
      company: "Zentrix Labs",
      location: "Bengaluru, India",
      salary: "₹25 - 40 LPA",
      experience: "4-6",
      jobType: "Full-time",
      description:
        "We are looking for a Senior Frontend Engineer to lead the development of our customer-facing web applications. You will work closely with product, design, and backend teams to ship delightful experiences at scale. This role offers significant ownership and the opportunity to mentor junior engineers.",
      requirements: "React 18+, TypeScript, Next.js, Tailwind CSS, GraphQL, 4+ years experience",
      status: "OPEN",
    },
    {
      title: "Backend Developer (Node.js)",
      company: "Nimbus Cloud",
      location: "Remote (India)",
      salary: "₹18 - 30 LPA",
      experience: "2-4",
      jobType: "Remote",
      description:
        "Join our platform team to build the next generation of API services powering millions of requests per day. You will design scalable REST and event-driven systems, own service reliability, and collaborate with mobile and web engineers across the company.",
      requirements: "Node.js, Express, PostgreSQL, Redis, REST API design, 2+ years experience",
      status: "OPEN",
    },
    {
      title: "Full Stack Engineer",
      company: "Pixelpine",
      location: "Pune, India",
      salary: "₹15 - 25 LPA",
      experience: "2-4",
      jobType: "Full-time",
      description:
        "We are hiring a Full Stack Engineer to build features end-to-end across our MERN-based SaaS product. From database schema to pixel-perfect UI, you will own features that directly impact our customers' success.",
      requirements: "React, Node.js, MongoDB, AWS, Tailwind CSS, 2+ years experience",
      status: "OPEN",
    },
    {
      title: "DevOps Engineer",
      company: "Ironpeak Systems",
      location: "Hyderabad, India",
      salary: "₹20 - 35 LPA",
      experience: "4-6",
      jobType: "Full-time",
      description:
        "Own the CI/CD pipelines, infrastructure as code, and observability stack for our cloud-native platform. You will partner with engineering teams to ship faster and more reliably while keeping production secure.",
      requirements: "Kubernetes, Terraform, AWS, GitHub Actions, Prometheus, 4+ years experience",
      status: "OPEN",
    },
    {
      title: "UI/UX Designer (Internship)",
      company: "Studio Lumos",
      location: "Mumbai, India",
      salary: "₹35,000 / month",
      experience: "0-2",
      jobType: "Internship",
      description:
        "A 6-month internship for design students or recent grads passionate about building delightful product experiences. You will work on real client projects and build a portfolio under the guidance of senior designers.",
      requirements: "Figma, design systems, basic HTML/CSS, portfolio link required",
      status: "OPEN",
    },
    {
      title: "Mobile Engineer (React Native)",
      company: "Zentrix Labs",
      location: "Bengaluru, India",
      salary: "₹20 - 32 LPA",
      experience: "2-4",
      jobType: "Full-time",
      description:
        "Build delightful cross-platform mobile experiences for our flagship consumer app. You will work closely with product and backend teams to ship features that reach hundreds of thousands of users.",
      requirements: "React Native, TypeScript, Redux, REST API, 2+ years experience",
      status: "OPEN",
    },
    {
      title: "Data Scientist",
      company: "Auralis AI",
      location: "Remote (Global)",
      salary: "$80k - $130k USD",
      experience: "4-6",
      jobType: "Remote",
      description:
        "Build production ML models for our recommendation and personalization systems. You will work with massive datasets and partner with engineering to ship models that influence millions of user interactions daily.",
      requirements: "Python, PyTorch, SQL, MLOps, statistics, 4+ years experience",
      status: "OPEN",
    },
    {
      title: "QA Automation Engineer",
      company: "Nimbus Cloud",
      location: "Chennai, India",
      salary: "₹12 - 20 LPA",
      experience: "2-4",
      jobType: "Contract",
      description:
        "Design and maintain automated test suites across web and API layers. You will partner with engineering to uplift quality, build test plans for new features, and reduce regression cycle times.",
      requirements: "Playwright, Cypress, REST API testing, CI integration, 2+ years experience",
      status: "OPEN",
    },
    {
      title: "Product Manager",
      company: "Pixelpine",
      location: "Bengaluru, India",
      salary: "₹30 - 50 LPA",
      experience: "6+",
      jobType: "Full-time",
      description:
        "Own the product roadmap for our flagship SaaS product. You will partner with engineering, design, and go-to-market teams to ship customer-loved features and grow the business.",
      requirements: "B2B SaaS experience, roadmapping, analytics, 6+ years experience",
      status: "OPEN",
    },
    {
      title: "Junior Frontend Developer",
      company: "Studio Lumos",
      location: "Remote (India)",
      salary: "₹6 - 10 LPA",
      experience: "0-2",
      jobType: "Full-time",
      description:
        "Kick off your career building UIs for client web apps using modern React. You will be mentored by senior engineers and grow into independent feature ownership within 6-12 months.",
      requirements: "HTML, CSS, JavaScript, React basics, good communication",
      status: "OPEN",
    },
    {
      title: "Site Reliability Engineer",
      company: "Ironpeak Systems",
      location: "Remote (India)",
      salary: "₹22 - 38 LPA",
      experience: "4-6",
      jobType: "Remote",
      description:
        "Own the reliability, performance, and incident response for our cloud infrastructure. You will build self-healing systems and partner with product teams to keep our 99.95% uptime promise.",
      requirements: "Linux, Kubernetes, observability tools, on-call experience, 4+ years experience",
      status: "CLOSED",
    },
    {
      title: "Marketing Lead",
      company: "Auralis AI",
      location: "Bengaluru, India",
      salary: "₹35 - 55 LPA",
      experience: "6+",
      jobType: "Full-time",
      description:
        "Lead our marketing efforts across content, performance, and brand. You will build and lead a small but mighty team and partner with leadership on go-to-market strategy.",
      requirements: "B2B SaaS marketing, content strategy, team leadership, 6+ years experience",
      status: "OPEN",
    },
  ];

  const createdJobs = [];
  for (const job of jobs) {
    const created = await db.job.create({
      data: { ...job, createdBy: admin.id },
    });
    createdJobs.push(created);
  }

  // ---- Applications ----
  await db.application.create({
    data: { userId: cand1.id, jobId: createdJobs[0].id, status: "REVIEWED" },
  });
  await db.application.create({
    data: { userId: cand1.id, jobId: createdJobs[2].id, status: "PENDING" },
  });
  await db.application.create({
    data: { userId: cand2.id, jobId: createdJobs[0].id, status: "PENDING" },
  });
  await db.application.create({
    data: { userId: cand2.id, jobId: createdJobs[6].id, status: "ACCEPTED" },
  });
  await db.application.create({
    data: { userId: cand3.id, jobId: createdJobs[1].id, status: "PENDING" },
  });
  await db.application.create({
    data: { userId: cand3.id, jobId: createdJobs[3].id, status: "REJECTED" },
  });

  console.log("✅ Seed complete");
  console.log(`   - Users: 1 admin, 3 candidates`);
  console.log(`   - Jobs: ${createdJobs.length}`);
  console.log(`   - Applications: 6`);
  console.log("");
  console.log("Admin login: admin@jobportal.com / admin1234");
  console.log("Candidate: aarav@example.com / password1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
