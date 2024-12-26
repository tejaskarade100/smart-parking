import { Building, Calendar, Car, Home, MapPin, Ticket, Users } from 'lucide-react';

export const categories = [
  {
    title: "Operators",
    description: "Companies or organizations that manage parking facilities at a large scale.",
    fullDescription: "These are companies or organizations that manage parking facilities at a large scale. They operate multiple parking lots, offering services like parking management, monitoring, and maintenance.",
    examples: "Companies like Indigo Parking Solutions or Park+ in India.",
    keyFeatures: [
      "Automated ticketing systems",
      "Real-time monitoring and security",
      "Loyalty programs for frequent users"
    ],
    icon: Building
  },
  {
    title: "Monthly/Long-term Partners",
    description: "Parking facilities that cater to users needing long-term parking solutions.",
    fullDescription: "These are parking facilities that cater to users needing long-term parking solutions, such as residents, office workers, or vehicle storage.",
    examples: "Monthly parking contracts at IT parks, apartment complexes, or multi-level parking facilities in cities.",
    keyFeatures: [
      "Subscription-based payment models",
      "Reserved spots for long-term customers",
      "Additional services like vehicle washing and maintenance"
    ],
    icon: Calendar
  },
  {
    title: "Airport/Railway/Bus Stand Operators",
    description: "Parking facilities at transport hubs, catering to travelers needing short- or long-term parking.",
    fullDescription: "Parking facilities at transport hubs, catering to travelers needing short- or long-term parking.",
    examples: "Parking lots at Indira Gandhi International Airport in Delhi or CST Railway Station in Mumbai.",
    keyFeatures: [
      "Hourly and daily pricing models",
      "Shuttle services to terminals",
      "High security with CCTV and ticket validation"
    ],
    icon: MapPin
  },
  {
    title: "Event and Venue Partnerships",
    description: "Temporary or event-specific parking arrangements for concerts, exhibitions, sports events, and conferences.",
    fullDescription: "Temporary or event-specific parking arrangements for concerts, exhibitions, sports events, and conferences.",
    examples: "Parking arrangements for IPL matches in stadiums or trade expos in Pragati Maidan.",
    keyFeatures: [
      "Dynamic pricing based on demand",
      "Staffed lots to guide attendees",
      "Temporary parking structures for high-capacity needs"
    ],
    icon: Ticket
  },
  {
    title: "Municipalities",
    description: "Public parking spaces managed by local governing bodies for urban areas.",
    fullDescription: "Public parking spaces managed by local governing bodies for urban areas.",
    examples: "Paid parking zones managed by Delhi Municipal Corporation or BMC in Mumbai.",
    keyFeatures: [
      "Affordable rates for citizens",
      "Integrated with public transportation hubs",
      "Transparent online payment options"
    ],
    icon: Users
  },
  {
    title: "Property Managers",
    description: "Parking facilities managed by residential or commercial property managers for tenants and visitors.",
    fullDescription: "Parking facilities managed by residential or commercial property managers for tenants and visitors.",
    examples: "Parking lots in large residential complexes or malls like Select Citywalk, Delhi.",
    keyFeatures: [
      "Visitor parking with time limits",
      "Exclusive spots for tenants or employees",
      "Smart access control with RFID or mobile apps"
    ],
    icon: Home
  },
  {
    title: "Spot Owners (Personal Parking Renters)",
    description: "Individuals renting out their private parking spots to others.",
    fullDescription: "Individuals renting out their private parking spots to others.",
    examples: "Renting a driveway or garage spot in areas like Koramangala, Bangalore.",
    keyFeatures: [
      "Flexible pricing and availability",
      "Personalized arrangements for renters",
      "Listings on platforms like ParkCirca or local classifieds"
    ],
    icon: Car
  }
];
