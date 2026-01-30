import MockAdapter from "axios-mock-adapter";
import { SurveyService } from "../../../../../main/typescript/features/survey/services/survey.service";
import type {
  FootprintQuizzPayload,
  UserEmissionDto
} from "../../../../../main/typescript/features/survey/types";
import { apiClient } from "../../../../../main/typescript/shared/api/client";

describe("SurveyService", () => {
  let mockApi: MockAdapter;

  beforeEach(() => {
    mockApi = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mockApi.reset();
    mockApi.restore();
  });

  // =========================================
  // Test data
  // =========================================
  const mockUserId = 1;

  const mockFootprintPayload: FootprintQuizzPayload = {
    userId: mockUserId,
    transportDto: {
      car: {
        fuelType: "GASOLINE",
        kilometersPerYear: 15000,
        passengers: 1
      },
      publicTransport: {
        type: "BUS",
        useFrequency: "MEDIUM"
      },
      airTransport: {
        shortFlightsFrequencyPerYear: 2,
        mediumFlightsFrequencyPerYear: 1,
        longFlightsFrequencyPerYear: 0
      },
      bikeUsePerWeek: 3
    },
    foodDto: {
      redMeatConsumptionPerWeek: 3,
      whiteMeatConsumptionPerWeek: 4,
      fishConsumptionPerWeek: 2,
      dairyConsumptionPerWeek: 7
    },
    housingDto: {
      housingType: "APARTMENT",
      surfaceArea: 60,
      heatingEnergySource: "GAZ"
    },
    digitalDto: {
      digitalConsumption: {
        hoursOfStreamingPerWeek: 10,
        chargingFrequencyPerDay: 2
      },
      numberOfDevicesOwned: 5
    }
  };

  const mockEmissionResponse: UserEmissionDto = {
    userId: mockUserId,
    housingEmissions: 1500,
    transportEmissions: 2500,
    foodEmissions: 1800,
    digitalEmissions: 200,
    totalEmissions: 6000,
    periodStart: "2025-01-01T00:00:00.000Z",
    origin: "QUIZZ"
  };

  // =========================================
  // calculateEmissions tests
  // =========================================
  describe("calculateEmissions", () => {
    it("should successfully calculate and save emissions", async () => {
      mockApi.onPost("/emissions/calculate", mockFootprintPayload).reply(200, mockEmissionResponse);

      const result = await SurveyService.calculateEmissions(mockFootprintPayload);

      expect(result).toEqual(mockEmissionResponse);
      expect(result.totalEmissions).toBe(6000);
      expect(result.origin).toBe("QUIZZ");
    });

    it("should throw an error when payload is invalid", async () => {
      mockApi.onPost("/emissions/calculate").reply(400, {
        message: "Invalid payload"
      });

      await expect(SurveyService.calculateEmissions(mockFootprintPayload)).rejects.toThrow();
    });

    it("should throw an error on server error", async () => {
      mockApi.onPost("/emissions/calculate").reply(500, {
        message: "Internal server error"
      });

      await expect(SurveyService.calculateEmissions(mockFootprintPayload)).rejects.toThrow();
    });

    it("should handle network failure", async () => {
      mockApi.onPost("/emissions/calculate").networkError();

      await expect(SurveyService.calculateEmissions(mockFootprintPayload)).rejects.toThrow();
    });

    it("should handle timeout", async () => {
      mockApi.onPost("/emissions/calculate").timeout();

      await expect(SurveyService.calculateEmissions(mockFootprintPayload)).rejects.toThrow();
    });
  });

  // =========================================
  // getLatestEmission tests
  // =========================================
  describe("getLatestEmission", () => {
    it("should successfully get latest emission for user", async () => {
      mockApi.onGet(`/emissions/user/${mockUserId}`).reply(200, mockEmissionResponse);

      const result = await SurveyService.getLatestEmission(mockUserId);

      expect(result).toEqual(mockEmissionResponse);
      expect(result.userId).toBe(mockUserId);
    });

    it("should throw an error when user not found", async () => {
      mockApi.onGet("/emissions/user/999").reply(404, {
        message: "User not found"
      });

      await expect(SurveyService.getLatestEmission(999)).rejects.toThrow();
    });

    it("should throw an error on server error", async () => {
      mockApi.onGet(`/emissions/user/${mockUserId}`).reply(500, {
        message: "Internal server error"
      });

      await expect(SurveyService.getLatestEmission(mockUserId)).rejects.toThrow();
    });
  });

  // =========================================
  // getAllEmissions tests
  // =========================================
  describe("getAllEmissions", () => {
    const mockEmissionsArray: UserEmissionDto[] = [
      mockEmissionResponse,
      {
        ...mockEmissionResponse,
        totalEmissions: 5500,
        periodStart: "2025-02-01T00:00:00.000Z"
      }
    ];

    it("should successfully get all emissions for user", async () => {
      mockApi.onGet(`/emissions/all/user/${mockUserId}`).reply(200, mockEmissionsArray);

      const result = await SurveyService.getAllEmissions(mockUserId);

      expect(result).toHaveLength(2);
      expect(result[0].totalEmissions).toBe(6000);
      expect(result[1].totalEmissions).toBe(5500);
    });

    it("should return empty array when no emissions exist", async () => {
      mockApi.onGet(`/emissions/all/user/${mockUserId}`).reply(200, []);

      const result = await SurveyService.getAllEmissions(mockUserId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should throw an error on server error", async () => {
      mockApi.onGet(`/emissions/all/user/${mockUserId}`).reply(500, {
        message: "Internal server error"
      });

      await expect(SurveyService.getAllEmissions(mockUserId)).rejects.toThrow();
    });
  });

  // =========================================
  // getLatestApiEmission tests
  // =========================================
  describe("getLatestApiEmission", () => {
    const mockApiEmission: UserEmissionDto = {
      ...mockEmissionResponse,
      origin: "API"
    };

    it("should successfully get latest API emission for user", async () => {
      mockApi.onGet(`/emissions/api/user/${mockUserId}`).reply(200, mockApiEmission);

      const result = await SurveyService.getLatestApiEmission(mockUserId);

      expect(result.origin).toBe("API");
    });

    it("should throw an error when no API emissions exist", async () => {
      mockApi.onGet(`/emissions/api/user/${mockUserId}`).reply(404, {
        message: "No API emissions found"
      });

      await expect(SurveyService.getLatestApiEmission(mockUserId)).rejects.toThrow();
    });
  });

  // =========================================
  // getAllApiEmissions tests
  // =========================================
  describe("getAllApiEmissions", () => {
    it("should successfully get all API emissions for user", async () => {
      const mockApiEmissions: UserEmissionDto[] = [{ ...mockEmissionResponse, origin: "API" }];

      mockApi.onGet(`/emissions/all/api/user/${mockUserId}`).reply(200, mockApiEmissions);

      const result = await SurveyService.getAllApiEmissions(mockUserId);

      expect(result).toHaveLength(1);
      expect(result[0].origin).toBe("API");
    });
  });

  // =========================================
  // getLatestMissionEmission tests
  // =========================================
  describe("getLatestMissionEmission", () => {
    const mockMissionEmission: UserEmissionDto = {
      ...mockEmissionResponse,
      origin: "MISSION"
    };

    it("should successfully get latest mission emission for user", async () => {
      mockApi.onGet(`/emissions/missions/user/${mockUserId}`).reply(200, mockMissionEmission);

      const result = await SurveyService.getLatestMissionEmission(mockUserId);

      expect(result.origin).toBe("MISSION");
    });

    it("should throw an error when no mission emissions exist", async () => {
      mockApi.onGet(`/emissions/missions/user/${mockUserId}`).reply(404, {
        message: "No mission emissions found"
      });

      await expect(SurveyService.getLatestMissionEmission(mockUserId)).rejects.toThrow();
    });
  });

  // =========================================
  // getAllMissionEmissions tests
  // =========================================
  describe("getAllMissionEmissions", () => {
    it("should successfully get all mission emissions for user", async () => {
      const mockMissionEmissions: UserEmissionDto[] = [
        { ...mockEmissionResponse, origin: "MISSION" }
      ];

      mockApi.onGet(`/emissions/all/missions/user/${mockUserId}`).reply(200, mockMissionEmissions);

      const result = await SurveyService.getAllMissionEmissions(mockUserId);

      expect(result).toHaveLength(1);
      expect(result[0].origin).toBe("MISSION");
    });
  });

  // =========================================
  // hasCompletedSurvey tests
  // =========================================
  describe("hasCompletedSurvey", () => {
    it("should return true when user has emissions data", async () => {
      mockApi.onGet(`/emissions/user/${mockUserId}`).reply(200, mockEmissionResponse);

      const result = await SurveyService.hasCompletedSurvey(mockUserId);

      expect(result).toBe(true);
    });

    it("should return false when user has no emissions data", async () => {
      mockApi.onGet(`/emissions/user/${mockUserId}`).reply(404, {
        message: "No emissions found"
      });

      const result = await SurveyService.hasCompletedSurvey(mockUserId);

      expect(result).toBe(false);
    });

    it("should return false when totalEmissions is 0", async () => {
      const zeroEmissions: UserEmissionDto = {
        ...mockEmissionResponse,
        totalEmissions: 0
      };

      mockApi.onGet(`/emissions/user/${mockUserId}`).reply(200, zeroEmissions);

      const result = await SurveyService.hasCompletedSurvey(mockUserId);

      expect(result).toBe(false);
    });

    it("should return false on server error", async () => {
      mockApi.onGet(`/emissions/user/${mockUserId}`).reply(500, {
        message: "Internal server error"
      });

      const result = await SurveyService.hasCompletedSurvey(mockUserId);

      expect(result).toBe(false);
    });

    it("should return false on network error", async () => {
      mockApi.onGet(`/emissions/user/${mockUserId}`).networkError();

      const result = await SurveyService.hasCompletedSurvey(mockUserId);

      expect(result).toBe(false);
    });
  });
});
