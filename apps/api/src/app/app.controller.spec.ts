import { Test, TestingModule } from "@nestjs/testing";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe("getData", () => {
    it('should return "Hello API"', () => {
      const movies = [
        { id: 1, title: "Iron Man", globalReleaseDate: new Date("2008-04-30") },
        {
          id: 2,
          title: "The Incredible Hulk",
          globalReleaseDate: new Date("2008-06-13"),
        },
      ];
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({ list: movies });
    });
  });
});
