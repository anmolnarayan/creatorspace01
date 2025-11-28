const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Check your .env.local file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🌱 Starting seed...");

  // Create Launch Packs
  console.log("Creating launch packs...");
  const { data: pack1, error: pack1Error } = await supabase
    .from("launch_packs")
    .insert({
      slug: "webapp-todo-dashboard",
      title: "WebApp: ToDo Dashboard",
      short_description:
        "Build a full-stack todo dashboard with authentication, real-time updates, and analytics",
      difficulty: "intermediate",
      duration_weeks: 4,
      tags: ["React", "Next.js", "TypeScript", "PostgreSQL", "Full-Stack"],
    })
    .select()
    .single();

  if (pack1Error) {
    console.error("Error creating pack 1:", pack1Error);
  } else {
    console.log("✓ Created launch pack 1");
  }

  const { data: pack2, error: pack2Error } = await supabase
    .from("launch_packs")
    .insert({
      slug: "dataproject-iris-classifier",
      title: "DataProject: Iris Classifier + Viz",
      short_description:
        "Build a machine learning classifier for the Iris dataset with interactive visualizations",
      difficulty: "beginner",
      duration_weeks: 3,
      tags: ["Python", "Machine Learning", "Data Visualization", "Scikit-learn"],
    })
    .select()
    .single();

  if (pack2Error) {
    console.error("Error creating pack 2:", pack2Error);
  } else {
    console.log("✓ Created launch pack 2");
  }

  const { data: pack3, error: pack3Error } = await supabase
    .from("launch_packs")
    .insert({
      slug: "startupmvp-local-services",
      title: "StartupMVP: Local Services Finder",
      short_description:
        "Build a marketplace MVP connecting local service providers with customers",
      difficulty: "advanced",
      duration_weeks: 6,
      tags: ["Next.js", "Stripe", "Maps API", "Real-time", "Marketplace"],
    })
    .select()
    .single();

  if (pack3Error) {
    console.error("Error creating pack 3:", pack3Error);
  } else {
    console.log("✓ Created launch pack 3");
  }

  // Create Milestones for Pack 1
  if (pack1) {
    const milestones1 = [
      {
        launch_pack_id: pack1.id,
        title: "Setup Project & Authentication",
        description: "Initialize Next.js project, set up Supabase auth, create login/signup pages",
        order_index: 1,
        est_hours: 6,
      },
      {
        launch_pack_id: pack1.id,
        title: "Todo CRUD Operations",
        description: "Implement create, read, update, delete operations for todos",
        order_index: 2,
        est_hours: 8,
      },
      {
        launch_pack_id: pack1.id,
        title: "Real-time Updates",
        description: "Add real-time synchronization using Supabase subscriptions",
        order_index: 3,
        est_hours: 5,
      },
      {
        launch_pack_id: pack1.id,
        title: "Analytics Dashboard",
        description: "Build analytics page showing completion rates and trends",
        order_index: 4,
        est_hours: 6,
      },
    ];

    for (const milestone of milestones1) {
      await supabase.from("milestones").insert(milestone);
    }
    console.log("✓ Created milestones for pack 1");
  }

  // Create Milestones for Pack 2
  if (pack2) {
    const milestones2 = [
      {
        launch_pack_id: pack2.id,
        title: "Data Loading & Exploration",
        description: "Load Iris dataset, perform EDA, understand features",
        order_index: 1,
        est_hours: 4,
      },
      {
        launch_pack_id: pack2.id,
        title: "Model Training",
        description: "Train classification models (SVM, Random Forest, KNN)",
        order_index: 2,
        est_hours: 5,
      },
      {
        launch_pack_id: pack2.id,
        title: "Model Evaluation",
        description: "Evaluate models, compare accuracy, select best model",
        order_index: 3,
        est_hours: 4,
      },
      {
        launch_pack_id: pack2.id,
        title: "Visualization Dashboard",
        description: "Create interactive visualizations with Plotly/Matplotlib",
        order_index: 4,
        est_hours: 6,
      },
    ];

    for (const milestone of milestones2) {
      await supabase.from("milestones").insert(milestone);
    }
    console.log("✓ Created milestones for pack 2");
  }

  // Create Milestones for Pack 3
  if (pack3) {
    const milestones3 = [
      {
        launch_pack_id: pack3.id,
        title: "Project Setup & Database Schema",
        description: "Initialize project, design and implement database schema",
        order_index: 1,
        est_hours: 8,
      },
      {
        launch_pack_id: pack3.id,
        title: "User Authentication & Profiles",
        description: "Implement auth, user profiles for providers and customers",
        order_index: 2,
        est_hours: 6,
      },
      {
        launch_pack_id: pack3.id,
        title: "Service Listings & Search",
        description: "Build service listing creation and search functionality",
        order_index: 3,
        est_hours: 8,
      },
      {
        launch_pack_id: pack3.id,
        title: "Booking System",
        description: "Implement booking flow with calendar integration",
        order_index: 4,
        est_hours: 10,
      },
      {
        launch_pack_id: pack3.id,
        title: "Payment Integration",
        description: "Integrate Stripe for payments and booking confirmations",
        order_index: 5,
        est_hours: 8,
      },
      {
        launch_pack_id: pack3.id,
        title: "Maps Integration",
        description: "Add Google Maps API for location-based search",
        order_index: 6,
        est_hours: 6,
      },
    ];

    for (const milestone of milestones3) {
      await supabase.from("milestones").insert(milestone);
    }
    console.log("✓ Created milestones for pack 3");
  }

  // Note: Users and projects should be created through the app's signup flow
  // This seed script focuses on Launch Packs and Milestones

  console.log("✅ Seed completed!");
}

seed().catch(console.error);

