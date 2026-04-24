export interface Transaction {
  id: number;
  timestamp: string;
  txHash: string;
  tool: string;
  amount: string;
  currency: string;
  agentWallet: string;
  status: "confirmed";
}

export interface FlightResult {
  airline: string;
  flight: string;
  departs: string;
  arrives: string;
  duration: string;
  price: string;
  seats: number;
}

export interface WeatherData {
  city: string;
  temperature: string;
  feelsLike: string;
  condition: string;
  humidity: string;
  windSpeed: string;
  uvIndex: number;
  visibility: string;
  travelSuitability: string;
  forecast7Days: string;
}

export interface TravelAdvisory {
  country: string;
  safetyLevel: string;
  overallRating: string;
  advisories: string[];
  entryRequirements: {
    visaRequired: boolean;
    passportValid: string;
    maxStayDays: number;
    healthDocuments: string;
  };
  localInfo: {
    currency: string;
    emergencyNumber: string;
    electricalOutlets: string;
    language: string;
  };
  lastUpdated: string;
  source: string;
}
