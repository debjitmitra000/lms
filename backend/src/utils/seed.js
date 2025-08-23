const { faker } = require("@faker-js/faker")
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require("../config/db")  

const User = require("../models/User")
const Lead = require("../models/Lead")

const seedUsers = async (count = 10) => {
  try {
    await connectDB()
    
    //removing existing users
    await User.deleteMany({})
    console.log("Existing users cleared")
    
    const users = []
    
    //one default user 
    users.push({
      name: "Test User",
      email: "testuser@gmail.com",
      password: "Test1234",
    })
    
    //remaining users
    for (let i = 1; i < count; i++) {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      
      users.push({
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: "Test1234",
      })
    }
    
    await User.create(users)
    console.log(`${count} users created successfully`)
    
    process.exit(0)
  } catch (error) {
    console.error("User seeding error:", error)
    process.exit(1)
  }
}

const seedLeads = async (count = 100) => {
  try {
    await connectDB()
    
    //get all users
    const users = await User.find({})
    if (users.length === 0) {
      console.error("No users found. Please seed users first")
      process.exit(1)
    }
    
    //removing existing leads
    await Lead.deleteMany({})
    console.log("Existing leads cleared")
    
    const leadSources = ["website", "facebook_ads", "google_ads", "referral", "events", "other"]
    const leadStatuses = ["new", "contacted", "qualified", "lost", "won"]
    
    const leads = []
    
    for (let i = 0; i < count; i++) {
      //assigning lead to a random user
      const randomUser = users[Math.floor(Math.random() * users.length)]
      
      //realistic dates last 6 months
      const createdAt = faker.date.recent({ days: 180 })
      const lastActivity = Math.random() > 0.3 
        ? faker.date.between({ from: createdAt, to: new Date() })
        : null
      
      leads.push({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number({ style: 'national' }).replace(/\D/g, '').slice(0, 10),
        company: faker.company.name(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        source: leadSources[Math.floor(Math.random() * leadSources.length)],
        status: leadStatuses[Math.floor(Math.random() * leadStatuses.length)],
        score: Math.floor(Math.random() * 101),
        lead_value: Math.floor(Math.random() * 15000) + 1000,
        is_qualified: Math.random() > 0.4, 
        user: randomUser._id,
        last_activity_at: lastActivity,
        createdAt: createdAt,
        updatedAt: createdAt,
      })
    }
    
    await Lead.insertMany(leads)
    console.log(`${count} leads created successfully`)
    
    process.exit(0)
  } catch (error) {
    console.error("Lead seeding error:", error)
    process.exit(1)
  }
}

const seedLeadsForUser = async (userId, count = 100) => {
  try {
    await connectDB()
    
    const leadSources = ["website", "facebook_ads", "google_ads", "referral", "events", "other"]
    const leadStatuses = ["new", "contacted", "qualified", "lost", "won"]
    
    const leads = []
    
    for (let i = 0; i < count; i++) {
      const createdAt = faker.date.recent({ days: 180 })
      const lastActivity = Math.random() > 0.3
        ? faker.date.between({ from: createdAt, to: new Date() })
        : null
      
      leads.push({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number({ style: 'national' }).replace(/\D/g, '').slice(0, 10),
        company: faker.company.name(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        source: leadSources[Math.floor(Math.random() * leadSources.length)],
        status: leadStatuses[Math.floor(Math.random() * leadStatuses.length)],
        score: Math.floor(Math.random() * 101),
        lead_value: Math.floor(Math.random() * 15000) + 1000,
        is_qualified: Math.random() > 0.4,
        
        user: userId,
        last_activity_at: lastActivity,
        createdAt: createdAt,
        updatedAt: createdAt,
      })
    }
    
    await Lead.insertMany(leads)
    console.log(`${count} leads created successfully for user ID: ${userId}`)
    
    process.exit(0)
  } catch (error) {
    console.error("User-specific lead seeding error:", error)
    process.exit(1)
  }
}

const command = process.argv[2]
const param = process.argv[3] 
const count = parseInt(process.argv[4]) || 100 

switch (command) {
  case 'users':
    const userCount = parseInt(param) || 10
    seedUsers(userCount)
    break
  case 'leads':
    const leadCount = parseInt(param) || 100
    seedLeads(leadCount)
    break
  case 'user-leads':
    if (!param) {
      console.log("Error: User ID is required")
      console.log("Usage: npm run seed:user-leads <userId> [count]")
      process.exit(1)
    }
    seedLeadsForUser(param, count)
    break
  default:
    console.log("Usage:")
    console.log("npm run seed:users [count] - Create users (default: 10)")
    console.log("npm run seed:leads [count] - Create leads (default: 100)")
    console.log("npm run seed:user-leads <userId> [count] - Create leads for specific user")
    process.exit(1)
}