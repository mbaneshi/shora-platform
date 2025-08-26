// MongoDB Initialization Script for Shora Platform
// This script runs when the MongoDB container starts for the first time

print('🚀 Initializing Shora Platform Database...');

// Switch to the shora database
db = db.getSiblingDB('shora');

// Create collections with validation
print('📋 Creating collections...');

// Places collection
db.createCollection('places', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "namePersian", "province", "provincePersian", "county", "countyPersian"],
      properties: {
        name: { bsonType: "string" },
        namePersian: { bsonType: "string" },
        type: { enum: ["city", "village", "town", "district"] },
        province: { bsonType: "string" },
        provincePersian: { bsonType: "string" },
        county: { bsonType: "string" },
        countyPersian: { bsonType: "string" }
      }
    }
  }
});

// Users collection
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password", "firstName", "firstNamePersian", "lastName", "lastNamePersian"],
      properties: {
        username: { bsonType: "string", minLength: 3, maxLength: 30 },
        email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
        password: { bsonType: "string", minLength: 6 },
        firstName: { bsonType: "string", maxLength: 50 },
        firstNamePersian: { bsonType: "string", maxLength: 50 },
        lastName: { bsonType: "string", maxLength: 50 },
        lastNamePersian: { bsonType: "string", maxLength: 50 }
      }
    }
  }
});

// Shora collection
db.createCollection('shora', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["place", "name", "namePersian", "term", "structure"],
      properties: {
        place: { bsonType: "objectId" },
        name: { bsonType: "string" },
        namePersian: { bsonType: "string" },
        type: { enum: ["main", "branch", "special"] },
        status: { enum: ["active", "inactive", "suspended", "election"] }
      }
    }
  }
});

// Commissions collection
db.createCollection('commissions', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "namePersian", "place", "type"],
      properties: {
        name: { bsonType: "string" },
        namePersian: { bsonType: "string" },
        place: { bsonType: "objectId" },
        type: { enum: ["standing", "ad-hoc", "special"] },
        status: { enum: ["active", "inactive", "suspended"] }
      }
    }
  }
});

// Decisions collection
db.createCollection('decisions', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "titlePersian", "place", "shora", "type"],
      properties: {
        title: { bsonType: "string" },
        titlePersian: { bsonType: "string" },
        place: { bsonType: "objectId" },
        shora: { bsonType: "objectId" },
        type: { enum: ["resolution", "policy", "approval", "rejection"] },
        status: { enum: ["draft", "proposed", "approved", "rejected", "implemented"] }
      }
    }
  }
});

// Documents collection
db.createCollection('documents', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "titlePersian", "place", "type", "filename"],
      properties: {
        title: { bsonType: "string" },
        titlePersian: { bsonType: "string" },
        place: { bsonType: "objectId" },
        type: { enum: ["meeting-minutes", "decision", "report", "policy", "other"] },
        status: { enum: ["draft", "published", "archived"] }
      }
    }
  }
});

print('✅ Collections created successfully');

// Create indexes for better performance
print('🔍 Creating indexes...');

// Places indexes
db.places.createIndex({ "name": 1 });
db.places.createIndex({ "province": 1, "county": 1 });
db.places.createIndex({ "isActive": 1 });

// Users indexes
db.users.createIndex({ "username": 1 });
db.users.createIndex({ "email": 1 });
db.users.createIndex({ "nationalId": 1 });
db.users.createIndex({ "status": 1 });
db.users.createIndex({ "roles": 1 });

// Shora indexes
db.shora.createIndex({ "place": 1 });
db.shora.createIndex({ "status": 1 });
db.shora.createIndex({ "term.startDate": 1, "term.endDate": 1 });

// Commissions indexes
db.commissions.createIndex({ "place": 1 });
db.commissions.createIndex({ "type": 1 });
db.commissions.createIndex({ "status": 1 });

// Decisions indexes
db.decisions.createIndex({ "place": 1 });
db.decisions.createIndex({ "shora": 1 });
db.decisions.createIndex({ "type": 1 });
db.decisions.createIndex({ "status": 1 });
db.decisions.createIndex({ "createdAt": -1 });

// Documents indexes
db.documents.createIndex({ "place": 1 });
db.documents.createIndex({ "type": 1 });
db.documents.createIndex({ "status": 1 });
db.documents.createIndex({ "createdAt": -1 });

print('✅ Indexes created successfully');

// Insert sample data for Baneshi city
print('🏙️  Inserting sample data for Baneshi city...');

// Insert Baneshi place
const baneshiPlace = db.places.insertOne({
  name: "Baneshi",
  namePersian: "بانشی",
  type: "city",
  province: "Fars",
  provincePersian: "فارس",
  county: "Beyza",
  countyPersian: "بیضا",
  coordinates: {
    latitude: 29.8667,
    longitude: 52.4333
  },
  population: 15000,
  area: 45.2,
  description: "A historic city in Beyza county, Fars province, Iran",
  descriptionPersian: "شهری تاریخی در شهرستان بیضا، استان فارس، ایران",
  isActive: true,
  features: {
    hasShora: true,
    hasCommissions: true,
    hasDocuments: true,
    hasVoting: false
  },
  settings: {
    allowPublicAccess: true,
    requireApproval: true,
    maxFileSize: 10485760
  },
  contact: {
    email: "info@baneshi.gov.ir",
    phone: "+98-71-12345678",
    address: "Baneshi, Beyza County, Fars Province, Iran",
    addressPersian: "بانشی، شهرستان بیضا، استان فارس، ایران"
  },
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date()
  }
});

print(`✅ Inserted Baneshi place with ID: ${baneshiPlace.insertedId}`);

// Insert sample Shora for Baneshi
const baneshiShora = db.shora.insertOne({
  place: baneshiPlace.insertedId,
  name: "Baneshi City Council",
  namePersian: "شورای شهر بانشی",
  type: "main",
  status: "active",
  term: {
    startDate: new Date("2024-01-01"),
    endDate: new Date("2027-12-31"),
    number: 1
  },
  structure: {
    totalSeats: 7,
    mainRepresentatives: 5,
    alternateRepresentatives: 2,
    specialSeats: 0
  },
  representatives: [],
  commissions: [],
  meetings: [],
  policies: {
    quorum: 50,
    votingMethod: "majority",
    meetingFrequency: "monthly"
  },
  contact: {
    email: "shora@baneshi.gov.ir",
    phone: "+98-71-12345679",
    address: "City Hall, Baneshi, Beyza County, Fars Province",
    addressPersian: "شهرداری، بانشی، شهرستان بیضا، استان فارس"
  },
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date()
  }
});

print(`✅ Inserted Baneshi Shora with ID: ${baneshiShora.insertedId}`);

// Insert sample commissions
const commissions = [
  {
    name: "Education Commission",
    namePersian: "کمیسیون آموزش و پرورش",
    place: baneshiPlace.insertedId,
    type: "standing",
    status: "active",
    description: "Overseeing educational matters and school improvements",
    descriptionPersian: "نظارت بر امور آموزشی و بهبود مدارس",
    members: [],
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    name: "Infrastructure Commission",
    namePersian: "کمیسیون زیرساخت",
    place: baneshiPlace.insertedId,
    type: "standing",
    status: "active",
    description: "Managing city infrastructure and development projects",
    descriptionPersian: "مدیریت زیرساخت شهر و پروژه‌های توسعه",
    members: [],
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    name: "Health Commission",
    namePersian: "کمیسیون بهداشت",
    place: baneshiPlace.insertedId,
    type: "standing",
    status: "active",
    description: "Overseeing public health and medical facilities",
    descriptionPersian: "نظارت بر بهداشت عمومی و امکانات پزشکی",
    members: [],
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
];

const commissionIds = [];
commissions.forEach(commission => {
  const result = db.commissions.insertOne(commission);
  commissionIds.push(result.insertedId);
  print(`✅ Inserted commission: ${commission.name} with ID: ${result.insertedId}`);
});

print('🎉 Database initialization completed successfully!');
print('');
print('📊 Summary:');
print(`   - Database: ${db.getName()}`);
print(`   - Collections: ${db.getCollectionNames().join(', ')}`);
print(`   - Sample place: Baneshi city inserted`);
print(`   - Sample Shora: Baneshi City Council created`);
print(`   - Sample commissions: ${commissionIds.length} commissions created`);
print('');
print('🚀 Ready to serve the Shora Platform!');
