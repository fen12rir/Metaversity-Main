import dotenv from 'dotenv';
import connectDb from '../app/config/db.js';
import Activity from '../app/models/activityModel.js';

dotenv.config();

const sampleActivities = [
  {
    title: "Community Clean-Up Drive",
    description: "Join us in cleaning up our barangay streets and parks. Bring your own gloves and trash bags. Let's make our community cleaner together!",
    type: "volunteer",
    location: "Barangay San Jose",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours duration
    bayanihanPoints: 50,
    maxParticipants: 30,
    status: "upcoming",
    category: "Environment",
  },
  {
    title: "Food Distribution for Seniors",
    description: "Help distribute food packages to senior citizens in our community. Volunteers will assist in packing and delivering meals to elderly residents.",
    type: "volunteer",
    location: "Barangay Community Center",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
    bayanihanPoints: 75,
    maxParticipants: 20,
    status: "upcoming",
    category: "Social Welfare",
  },
  {
    title: "Tree Planting Activity",
    description: "Be part of our reforestation effort! We'll be planting 100 trees in the community park. Seedlings and tools will be provided.",
    type: "volunteer",
    location: "Community Park",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
    bayanihanPoints: 100,
    maxParticipants: 50,
    status: "upcoming",
    category: "Environment",
  },
  {
    title: "Youth Tutoring Program",
    description: "Share your knowledge! Tutor elementary students in Math and English. Sessions are held twice a week for one month.",
    type: "volunteer",
    location: "Barangay Hall",
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 1 month duration
    bayanihanPoints: 200,
    maxParticipants: 15,
    status: "upcoming",
    category: "Education",
  },
  {
    title: "Disaster Preparedness Training",
    description: "Learn essential disaster response skills. Training includes first aid, emergency evacuation procedures, and basic rescue operations.",
    type: "event",
    location: "Municipal Gym",
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
    bayanihanPoints: 150,
    maxParticipants: 40,
    status: "upcoming",
    category: "Disaster Response",
  },
  {
    title: "Medical Mission",
    description: "Free medical check-up and consultation for community members. Medical professionals and volunteers needed for registration and crowd management.",
    type: "event",
    location: "Barangay Health Center",
    startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
    bayanihanPoints: 120,
    maxParticipants: 25,
    status: "upcoming",
    category: "Health",
  },
];

const seedActivities = async () => {
  try {
    console.log('🌱 Starting activities seeder...');
    
    await connectDb();
    console.log('✅ Connected to database');

    // Clear existing activities
    await Activity.deleteMany({});
    console.log('🗑️  Cleared existing activities');

    // Create new activities
    const activities = await Activity.insertMany(sampleActivities);

    console.log('\n✅ Activities seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📋 Created ${activities.length} activities:`);
    activities.forEach((activity, index) => {
      console.log(`   ${index + 1}. ${activity.title} (${activity.bayanihanPoints} BP)`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding activities:', error);
    process.exit(1);
  }
};

seedActivities();

