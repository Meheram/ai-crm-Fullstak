import "dotenv/config";
import mongoose from "mongoose";

// 1. Database Connection URL
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in .env");
  process.exit(1);
}

// 2. Lead Schema for CRM Analytics & Charts
const leadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  value: {
    type: Number,
    required: true,
    default: 0,
  },

  company: {
    type: String,
    required: true,
  },

  contactPerson: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
  },

  stage: {
    type: String,
    enum: ["New", "Qualified", "Proposal", "Won", "Lost"],
    default: "New",
  },

  source: {
    type: String,
    enum: [
      "Website",
      "Referral",
      "Cold Call",
      "Social Media",
      "Event",
      "Partner",
    ],
    default: "Website",
  },

  owner: {
    type: String,
    required: true,
  },

  probability: {
    type: Number,
    default: 50,
  },

  expectedCloseDate: {
    type: Date,
  },

  lastActivity: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lead = mongoose.model("Lead", leadSchema);

// 3. Enterprise CRM Seed Data
const dummyLeads = [
  {
    title: "Enterprise ERP Migration",
    value: 45000,
    company: "Apex Global Logistics",
    contactPerson: "David Miller",
    email: "d.miller@apexglobal.com",
    phone: "+1-555-0192",
    stage: "New",
    source: "Website",
    owner: "Alex Turner",
    probability: 20,
    expectedCloseDate: new Date("2026-11-30"),
    lastActivity:
      "Initial inquiry received through the company contact form",
    createdAt: new Date("2026-09-15"),
  },

  {
    title: "Cloud Infrastructure Upgrade",
    value: 28000,
    company: "FinTech Solutions Inc.",
    contactPerson: "Sarah Jenkins",
    email: "s.jenkins@fintechsolutions.io",
    phone: "+1-555-0148",
    stage: "New",
    source: "Referral",
    owner: "Emily Chen",
    probability: 25,
    expectedCloseDate: new Date("2026-12-15"),
    lastActivity:
      "Discovery call requested by the technology department",
    createdAt: new Date("2026-09-20"),
  },

  {
    title: "Mobile App Redesign",
    value: 16500,
    company: "Urban Wear Retail",
    contactPerson: "Michael Brown",
    email: "mbrown@urbanwear.com",
    phone: "+1-555-0173",
    stage: "Qualified",
    source: "Social Media",
    owner: "Alex Turner",
    probability: 50,
    expectedCloseDate: new Date("2026-10-28"),
    lastActivity:
      "Requirements gathering meeting completed successfully",
    createdAt: new Date("2026-08-10"),
  },

  {
    title: "Custom CRM Integration",
    value: 32000,
    company: "BioHealth Corp",
    contactPerson: "Rachel Green",
    email: "rgreen@biohealth.org",
    phone: "+1-555-0129",
    stage: "Qualified",
    source: "Event",
    owner: "Jason Vance",
    probability: 60,
    expectedCloseDate: new Date("2026-11-10"),
    lastActivity:
      "Technical scope document reviewed and approved",
    createdAt: new Date("2026-08-25"),
  },

  {
    title: "SaaS Platform Development",
    value: 54000,
    company: "NexGen Media",
    contactPerson: "Chris Evans",
    email: "cevans@nexgenmedia.com",
    phone: "+1-555-0181",
    stage: "Proposal",
    source: "Partner",
    owner: "Emily Chen",
    probability: 75,
    expectedCloseDate: new Date("2026-10-18"),
    lastActivity:
      "Commercial proposal sent to the chief financial officer",
    createdAt: new Date("2026-07-14"),
  },

  {
    title: "Cybersecurity Audit & Compliance",
    value: 12000,
    company: "Vanguard Capital",
    contactPerson: "Amanda Lewis",
    email: "a.lewis@vanguardcap.com",
    phone: "+1-555-0115",
    stage: "Proposal",
    source: "Cold Call",
    owner: "Jason Vance",
    probability: 80,
    expectedCloseDate: new Date("2026-10-22"),
    lastActivity:
      "Contract revision is currently being reviewed by the legal team",
    createdAt: new Date("2026-09-02"),
  },

  {
    title: "Annual Managed IT Support",
    value: 22000,
    company: "Beacon Law Firm",
    contactPerson: "Robert Taylor",
    email: "r.taylor@beaconlaw.com",
    phone: "+1-555-0133",
    stage: "Won",
    source: "Website",
    owner: "Alex Turner",
    probability: 100,
    expectedCloseDate: new Date("2026-09-10"),
    lastActivity:
      "Signed contract received and implementation scheduled",
    createdAt: new Date("2026-06-01"),
  },

  {
    title: "E-Commerce Platform Deployment",
    value: 38000,
    company: "Nordic Furniture Co.",
    contactPerson: "Elena Rostova",
    email: "elena@nordicfurniture.com",
    phone: "+1-555-0164",
    stage: "Won",
    source: "Referral",
    owner: "Emily Chen",
    probability: 100,
    expectedCloseDate: new Date("2026-08-30"),
    lastActivity:
      "Project kickoff completed with the client development team",
    createdAt: new Date("2026-05-18"),
  },

  {
    title: "Legacy Database Migration",
    value: 19000,
    company: "Old World Logistics",
    contactPerson: "James Wilson",
    email: "j.wilson@oldworld.com",
    phone: "+1-555-0102",
    stage: "Lost",
    source: "Cold Call",
    owner: "Jason Vance",
    probability: 0,
    expectedCloseDate: new Date("2026-09-01"),
    lastActivity:
      "Client selected a competitor after comparing project pricing",
    createdAt: new Date("2026-04-12"),
  },

  {
    title: "AI Customer Support Platform",
    value: 62000,
    company: "Vertex Digital Systems",
    contactPerson: "Daniel Anderson",
    email: "d.anderson@vertexdigital.com",
    phone: "+1-555-0201",
    stage: "New",
    source: "Website",
    owner: "Emily Chen",
    probability: 15,
    expectedCloseDate: new Date("2027-01-20"),
    lastActivity:
      "New enterprise inquiry received from the product team",
    createdAt: new Date("2026-09-24"),
  },

  {
    title: "Business Intelligence Dashboard",
    value: 36000,
    company: "Global Trade Partners",
    contactPerson: "Sophia Martinez",
    email: "s.martinez@globaltrade.com",
    phone: "+1-555-0202",
    stage: "Qualified",
    source: "Referral",
    owner: "Alex Turner",
    probability: 55,
    expectedCloseDate: new Date("2026-11-25"),
    lastActivity:
      "Business intelligence requirements discussed with management",
    createdAt: new Date("2026-08-28"),
  },

  {
    title: "Healthcare Management System",
    value: 48000,
    company: "MedCore Healthcare",
    contactPerson: "Olivia Wilson",
    email: "o.wilson@medcorehealth.com",
    phone: "+1-555-0203",
    stage: "Proposal",
    source: "Event",
    owner: "Jason Vance",
    probability: 70,
    expectedCloseDate: new Date("2026-12-05"),
    lastActivity:
      "Final proposal presentation completed with the operations team",
    createdAt: new Date("2026-07-30"),
  },

  {
    title: "Digital Marketing Automation",
    value: 14500,
    company: "BrightPath Marketing",
    contactPerson: "Liam Johnson",
    email: "liam.johnson@brightpath.com",
    phone: "+1-555-0204",
    stage: "Qualified",
    source: "Social Media",
    owner: "Emily Chen",
    probability: 45,
    expectedCloseDate: new Date("2026-11-12"),
    lastActivity:
      "Marketing automation requirements documented",
    createdAt: new Date("2026-08-15"),
  },

  {
    title: "Financial Reporting System",
    value: 27500,
    company: "Summit Financial Group",
    contactPerson: "Noah Williams",
    email: "noah.williams@summitfinancial.com",
    phone: "+1-555-0205",
    stage: "Proposal",
    source: "Partner",
    owner: "Alex Turner",
    probability: 65,
    expectedCloseDate: new Date("2026-11-18"),
    lastActivity:
      "Proposal updated based on the finance department feedback",
    createdAt: new Date("2026-07-22"),
  },

  {
    title: "Warehouse Management Software",
    value: 41000,
    company: "Prime Distribution Group",
    contactPerson: "Emma Davis",
    email: "emma.davis@primedistribution.com",
    phone: "+1-555-0206",
    stage: "Won",
    source: "Referral",
    owner: "Jason Vance",
    probability: 100,
    expectedCloseDate: new Date("2026-09-25"),
    lastActivity:
      "Customer signed the final implementation agreement",
    createdAt: new Date("2026-05-27"),
  },

  {
    title: "Secure Payment Gateway",
    value: 33500,
    company: "Nova Commerce",
    contactPerson: "William Harris",
    email: "w.harris@novacommerce.com",
    phone: "+1-555-0207",
    stage: "New",
    source: "Event",
    owner: "Alex Turner",
    probability: 30,
    expectedCloseDate: new Date("2026-12-20"),
    lastActivity:
      "Payment infrastructure consultation requested",
    createdAt: new Date("2026-09-10"),
  },

  {
    title: "Employee Management Portal",
    value: 18500,
    company: "BlueStone Consulting",
    contactPerson: "Ava Thompson",
    email: "ava.thompson@bluestone.com",
    phone: "+1-555-0208",
    stage: "Qualified",
    source: "Cold Call",
    owner: "Emily Chen",
    probability: 50,
    expectedCloseDate: new Date("2026-11-30"),
    lastActivity:
      "HR workflow analysis completed with the client",
    createdAt: new Date("2026-08-05"),
  },

  {
    title: "Cloud Security Transformation",
    value: 57000,
    company: "Orion Technologies",
    contactPerson: "James Anderson",
    email: "j.anderson@oriontech.com",
    phone: "+1-555-0209",
    stage: "Proposal",
    source: "Website",
    owner: "Jason Vance",
    probability: 85,
    expectedCloseDate: new Date("2026-10-30"),
    lastActivity:
      "Security architecture proposal delivered to the client",
    createdAt: new Date("2026-06-19"),
  },

  {
    title: "Restaurant Management Platform",
    value: 12500,
    company: "Urban Table Group",
    contactPerson: "Mia Clark",
    email: "mia.clark@urbantable.com",
    phone: "+1-555-0210",
    stage: "Lost",
    source: "Social Media",
    owner: "Emily Chen",
    probability: 0,
    expectedCloseDate: new Date("2026-09-15"),
    lastActivity:
      "Client postponed the project because of budget limitations",
    createdAt: new Date("2026-04-30"),
  },

  {
    title: "Supply Chain Analytics",
    value: 39500,
    company: "EastBridge Manufacturing",
    contactPerson: "Benjamin Lewis",
    email: "b.lewis@eastbridge.com",
    phone: "+1-555-0211",
    stage: "Qualified",
    source: "Partner",
    owner: "Alex Turner",
    probability: 60,
    expectedCloseDate: new Date("2026-12-10"),
    lastActivity:
      "Supply chain analytics workshop completed",
    createdAt: new Date("2026-08-21"),
  },

  {
    title: "Mobile Banking Application",
    value: 68000,
    company: "Crescent Financial",
    contactPerson: "Charlotte Walker",
    email: "c.walker@crescentfinancial.com",
    phone: "+1-555-0212",
    stage: "Proposal",
    source: "Referral",
    owner: "Jason Vance",
    probability: 75,
    expectedCloseDate: new Date("2027-01-15"),
    lastActivity:
      "Mobile banking technical proposal submitted",
    createdAt: new Date("2026-07-08"),
  },

  {
    title: "Inventory Optimization System",
    value: 24500,
    company: "Metro Wholesale",
    contactPerson: "Henry Hall",
    email: "henry.hall@metrowholesale.com",
    phone: "+1-555-0213",
    stage: "Won",
    source: "Website",
    owner: "Emily Chen",
    probability: 100,
    expectedCloseDate: new Date("2026-09-05"),
    lastActivity:
      "Implementation phase officially started",
    createdAt: new Date("2026-05-12"),
  },

  {
    title: "Cloud Data Warehouse",
    value: 52000,
    company: "DataCore Analytics",
    contactPerson: "Amelia Allen",
    email: "amelia.allen@datacore.com",
    phone: "+1-555-0214",
    stage: "New",
    source: "Cold Call",
    owner: "Alex Turner",
    probability: 20,
    expectedCloseDate: new Date("2027-01-30"),
    lastActivity:
      "Initial technical discussion scheduled with the data team",
    createdAt: new Date("2026-09-26"),
  },

  {
    title: "Corporate Website Modernization",
    value: 21000,
    company: "SilverLine Industries",
    contactPerson: "Ethan Young",
    email: "ethan.young@silverline.com",
    phone: "+1-555-0215",
    stage: "Qualified",
    source: "Social Media",
    owner: "Emily Chen",
    probability: 50,
    expectedCloseDate: new Date("2026-11-08"),
    lastActivity:
      "Website modernization requirements approved",
    createdAt: new Date("2026-08-17"),
  },

  {
    title: "Enterprise Identity Management",
    value: 46000,
    company: "SecureNet Global",
    contactPerson: "Harper King",
    email: "harper.king@securenetglobal.com",
    phone: "+1-555-0216",
    stage: "Proposal",
    source: "Event",
    owner: "Jason Vance",
    probability: 80,
    expectedCloseDate: new Date("2026-10-25"),
    lastActivity:
      "Identity management proposal reviewed by the security team",
    createdAt: new Date("2026-06-28"),
  },

  {
    title: "Online Learning Platform",
    value: 31000,
    company: "FutureSkills Academy",
    contactPerson: "Daniel White",
    email: "daniel.white@futureskills.com",
    phone: "+1-555-0217",
    stage: "Lost",
    source: "Cold Call",
    owner: "Alex Turner",
    probability: 0,
    expectedCloseDate: new Date("2026-08-20"),
    lastActivity:
      "Client selected an internal development team",
    createdAt: new Date("2026-03-25"),
  },

  {
    title: "AI Sales Forecasting Platform",
    value: 73500,
    company: "InsightWorks Corporation",
    contactPerson: "Grace Martin",
    email: "grace.martin@insightworks.com",
    phone: "+1-555-0218",
    stage: "Proposal",
    source: "Website",
    owner: "Emily Chen",
    probability: 85,
    expectedCloseDate: new Date("2026-12-28"),
    lastActivity:
      "AI forecasting demonstration completed for senior management",
    createdAt: new Date("2026-07-02"),
  },

  {
    title: "Customer Loyalty Platform",
    value: 17200,
    company: "MarketPlus Retail",
    contactPerson: "Samuel Thompson",
    email: "samuel.thompson@marketplus.com",
    phone: "+1-555-0219",
    stage: "New",
    source: "Referral",
    owner: "Jason Vance",
    probability: 25,
    expectedCloseDate: new Date("2026-12-12"),
    lastActivity:
      "Customer loyalty platform introduction meeting requested",
    createdAt: new Date("2026-09-18"),
  },

  {
    title: "Enterprise API Integration",
    value: 43000,
    company: "CloudBridge Technologies",
    contactPerson: "Victoria Garcia",
    email: "victoria.garcia@cloudbridge.com",
    phone: "+1-555-0220",
    stage: "Won",
    source: "Partner",
    owner: "Alex Turner",
    probability: 100,
    expectedCloseDate: new Date("2026-09-18"),
    lastActivity:
      "API integration project completed and accepted by the client",
    createdAt: new Date("2026-05-05"),
  },
];

// 4. Seeding Logic
const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Successfully connected to MongoDB.");

    await Lead.deleteMany({});

    console.log("Cleared previous database entries.");

    await Lead.insertMany(dummyLeads);

    console.log(
      `Database successfully seeded with ${dummyLeads.length} leads!`
    );

    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("Database seeding failed:", error);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
};

seedDB();