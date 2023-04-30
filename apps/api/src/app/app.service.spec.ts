import { Test } from "@nestjs/testing";

import { AppService } from "./app.service";

describe("AppService", () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe("getData", () => {
    it("should return list of objects of type movie", () => {
      const movies = [
        { id: 1, title: "Iron Man", globalReleaseDate: new Date("2008-04-30") },
        {
          id: 2,
          title: "The Incredible Hulk",
          globalReleaseDate: new Date("2008-06-13"),
        },
      ];
      expect(service.getData()).toEqual({ list: movies });
    });
  });
});
