import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from '../models/Lead.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const sampleLeads = [
  {
    name: 'Max Mustermann',
    email: 'max.mustermann@example.com',
    salutation: 'herr',
    source: 'automation',
    status: 'new',
    priority: 'high',
    leadType: 'hot',
    company: {
      name: 'Mustermann GmbH',
      website: 'https://mustermann.de',
      industry: 'IT Services',
      size: '51-200'
    },
    phone: '+49 123 456 789',
    serviceDetails: {
      automation: {
        monthlyBudget: 5000,
        conversionRate: 25,
        marginPerSale: 2000,
        roiProjection: 180,
        estimatedProfit: 15000
      }
    },
    estimatedValue: 25000,
    notes: 'Sehr interessiert an Marketing Automation. Möchte schnell starten.',
    tags: ['hot-lead', 'automation', 'high-value']
  },
  {
    name: 'Anna Schmidt',
    email: 'a.schmidt@techcorp.de',
    salutation: 'frau',
    source: 'digitalization',
    status: 'contacted',
    priority: 'medium',
    leadType: 'warm',
    company: {
      name: 'TechCorp AG',
      website: 'https://techcorp.de',
      industry: 'Manufacturing',
      size: '201-500'
    },
    serviceDetails: {
      digitalization: {
        areas: ['Marketing', 'Vertrieb', 'Kundenservice'],
        urgency: '1-3 Monate',
        currentChallenges: ['Ineffiziente Prozesse', 'Mangelnde Automatisierung']
      }
    },
    estimatedValue: 35000,
    notes: 'Digitalisierung mehrerer Unternehmensbereiche geplant.'
  },
  {
    name: 'Peter Weber',
    email: 'p.weber@startup-hub.com',
    salutation: 'herr',
    source: 'website',
    status: 'qualified',
    priority: 'medium',
    leadType: 'warm',
    company: {
      name: 'StartupHub',
      website: 'https://startup-hub.com',
      industry: 'Technology',
      size: '11-50'
    },
    serviceDetails: {
      website: {
        currentUrl: 'https://old-site.com',
        goals: ['Mehr Leads', 'Bessere Conversion', 'Moderne Optik'],
        style: 'modern',
        timeline: '2-3 Monate',
        budget: '10000-15000'
      }
    },
    estimatedValue: 12000,
    notes: 'Neue Website für bessere Lead-Generierung benötigt.'
  },
  {
    name: 'Sarah Müller',
    email: 's.mueller@consulting.de',
    salutation: 'frau',
    source: 'contact',
    status: 'proposal',
    priority: 'high',
    leadType: 'hot',
    company: {
      name: 'Müller Consulting',
      website: 'https://mueller-consulting.de',
      industry: 'Consulting',
      size: '1-10'
    },
    estimatedValue: 8000,
    notes: 'Beratung für digitale Transformation gewünscht.'
  },
  {
    name: 'Thomas Fischer',
    email: 't.fischer@enterprise.com',
    salutation: 'herr',
    source: 'automation',
    status: 'negotiation',
    priority: 'urgent',
    leadType: 'hot',
    company: {
      name: 'Enterprise Solutions',
      website: 'https://enterprise.com',
      industry: 'Software',
      size: '500+'
    },
    serviceDetails: {
      automation: {
        monthlyBudget: 15000,
        conversionRate: 35,
        marginPerSale: 5000,
        roiProjection: 220,
        estimatedProfit: 50000
      }
    },
    estimatedValue: 75000,
    notes: 'Großprojekt für Marketing Automation. Verhandlungen laufen.'
  }
];

const seedSampleLeads = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing sample leads
    await Lead.deleteMany({ email: { $regex: '@example.com|@techcorp.de|@startup-hub.com|@consulting.de|@enterprise.com' } });

    // Get admin user for assignment
    const adminUser = await User.findOne({ role: 'admin' });
    const regularUser = await User.findOne({ role: 'user' });

    // Create sample leads
    for (let i = 0; i < sampleLeads.length; i++) {
      const leadData = sampleLeads[i];
      
      // Create or get user for this lead
      const leadUser = await User.createLeadUser({
        name: leadData.name,
        email: leadData.email,
        company: leadData.company?.name
      });

      // Assign some leads to admin, some to regular user
      const assignedTo = i % 2 === 0 ? adminUser?._id : regularUser?._id;

      // Create the lead
      const lead = await Lead.create({
        ...leadData,
        user: leadUser._id,
        assignedTo: assignedTo,
        privacyConsent: true,
        marketingConsent: true
      });

      // Add some sample communications
      if (i < 3) {
        lead.communications.push({
          type: 'email',
          subject: 'Erstkontakt',
          content: 'Vielen Dank für Ihr Interesse. Wir melden uns in Kürze.',
          userId: assignedTo
        });
      }

      // Add some sample tasks
      if (i < 2) {
        lead.tasks.push({
          title: 'Follow-up Anruf',
          description: 'Telefonisches Nachfassen innerhalb 24h',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          priority: 'high',
          assignedTo: assignedTo,
          createdBy: assignedTo
        });
      }

      await lead.save();
      console.log(`Created lead: ${lead.name} (${lead.email})`);
    }

    console.log(`${sampleLeads.length} sample leads created successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding sample leads:', error);
    process.exit(1);
  }
};

seedSampleLeads();
