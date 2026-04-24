import type { TravelAdvisory } from "../types.js";

// Country-specific advisory data for realism
const COUNTRY_DATA: Record<string, Partial<TravelAdvisory>> = {
  france: {
    safetyLevel: "Low Risk",
    overallRating: "Safe for tourism",
    localInfo: {
      currency: "EUR",
      emergencyNumber: "112",
      electricalOutlets: "Type C/E (220V)",
      language: "French (English widely spoken in cities)",
    },
    entryRequirements: {
      visaRequired: false,
      passportValid: "Must be valid for 3 months beyond stay",
      maxStayDays: 90,
      healthDocuments: "No mandatory vaccinations required",
    },
  },
  netherlands: {
    safetyLevel: "Low Risk",
    overallRating: "Very safe for tourism",
    localInfo: {
      currency: "EUR",
      emergencyNumber: "112",
      electricalOutlets: "Type C/F (230V)",
      language: "Dutch (English very widely spoken)",
    },
    entryRequirements: {
      visaRequired: false,
      passportValid: "Must be valid for 3 months beyond stay",
      maxStayDays: 90,
      healthDocuments: "No mandatory vaccinations required",
    },
  },
  germany: {
    safetyLevel: "Low Risk",
    overallRating: "Safe for tourism",
    localInfo: {
      currency: "EUR",
      emergencyNumber: "112",
      electricalOutlets: "Type C/F (230V)",
      language: "German (English common in cities)",
    },
    entryRequirements: {
      visaRequired: false,
      passportValid: "Must be valid for 3 months beyond stay",
      maxStayDays: 90,
      healthDocuments: "No mandatory vaccinations required",
    },
  },
  italy: {
    safetyLevel: "Low Risk",
    overallRating: "Safe for tourism — watch for pickpockets in tourist areas",
    localInfo: {
      currency: "EUR",
      emergencyNumber: "112",
      electricalOutlets: "Type C/F/L (230V)",
      language: "Italian (English in tourist areas)",
    },
    entryRequirements: {
      visaRequired: false,
      passportValid: "Must be valid for 3 months beyond stay",
      maxStayDays: 90,
      healthDocuments: "No mandatory vaccinations required",
    },
  },
  "united kingdom": {
    safetyLevel: "Low Risk",
    overallRating: "Very safe for tourism",
    localInfo: {
      currency: "GBP",
      emergencyNumber: "999",
      electricalOutlets: "Type G (230V)",
      language: "English",
    },
    entryRequirements: {
      visaRequired: false,
      passportValid: "Must be valid for duration of stay",
      maxStayDays: 180,
      healthDocuments: "No mandatory vaccinations required",
    },
  },
  japan: {
    safetyLevel: "Very Low Risk",
    overallRating: "Exceptionally safe for tourism",
    localInfo: {
      currency: "JPY",
      emergencyNumber: "110",
      electricalOutlets: "Type A/B (100V)",
      language: "Japanese (limited English outside major cities)",
    },
    entryRequirements: {
      visaRequired: false,
      passportValid: "Must be valid for duration of stay",
      maxStayDays: 90,
      healthDocuments: "No mandatory vaccinations required",
    },
  },
  "united arab emirates": {
    safetyLevel: "Low Risk",
    overallRating: "Safe for tourism — respect local customs",
    localInfo: {
      currency: "AED",
      emergencyNumber: "999",
      electricalOutlets: "Type G (220V)",
      language: "Arabic (English widely spoken)",
    },
    entryRequirements: {
      visaRequired: false,
      passportValid: "Must be valid for 6 months beyond stay",
      maxStayDays: 30,
      healthDocuments: "No mandatory vaccinations required",
    },
  },
  singapore: {
    safetyLevel: "Very Low Risk",
    overallRating: "One of the safest cities in the world",
    localInfo: {
      currency: "SGD",
      emergencyNumber: "999",
      electricalOutlets: "Type G (230V)",
      language: "English, Mandarin, Malay, Tamil",
    },
    entryRequirements: {
      visaRequired: false,
      passportValid: "Must be valid for 6 months beyond stay",
      maxStayDays: 90,
      healthDocuments: "No mandatory vaccinations required",
    },
  },
  australia: {
    safetyLevel: "Low Risk",
    overallRating: "Safe for tourism — sun protection essential",
    localInfo: {
      currency: "AUD",
      emergencyNumber: "000",
      electricalOutlets: "Type I (230V)",
      language: "English",
    },
    entryRequirements: {
      visaRequired: true,
      passportValid: "Must be valid for duration of stay",
      maxStayDays: 90,
      healthDocuments: "No mandatory vaccinations required",
    },
  },
  "united states": {
    safetyLevel: "Low-Medium Risk",
    overallRating: "Generally safe — varies by location",
    localInfo: {
      currency: "USD",
      emergencyNumber: "911",
      electricalOutlets: "Type A/B (120V)",
      language: "English",
    },
    entryRequirements: {
      visaRequired: false,
      passportValid: "Must be valid for 6 months beyond stay",
      maxStayDays: 90,
      healthDocuments: "No mandatory vaccinations required",
    },
  },
};

const DEFAULT_ADVISORIES = [
  "Normal travel precautions recommended",
  "Keep valuables secure in crowded tourist areas",
  "Comprehensive travel insurance strongly advised",
  "Register with your embassy if staying over 30 days",
];

export function generateAdvisory(country: string): TravelAdvisory {
  const key = country.toLowerCase();
  const data = COUNTRY_DATA[key] || {};

  return {
    country,
    safetyLevel: data.safetyLevel || "Low Risk",
    overallRating: data.overallRating || "Safe for tourism",
    advisories: DEFAULT_ADVISORIES,
    entryRequirements: data.entryRequirements || {
      visaRequired: false,
      passportValid: "Must be valid for 6 months beyond stay",
      maxStayDays: 90,
      healthDocuments: "No mandatory vaccinations required",
    },
    localInfo: data.localInfo || {
      currency: "Local currency",
      emergencyNumber: "112",
      electricalOutlets: "Check before travel",
      language: "Local language",
    },
    lastUpdated: new Date().toISOString().split("T")[0],
    source: "MCPay Travel Advisory via Arc Nanopayments",
  };
}
