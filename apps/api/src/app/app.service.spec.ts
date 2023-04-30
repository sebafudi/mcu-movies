import { Test } from "@nestjs/testing";

import { AppService } from "./app.service";

import { movies } from "./movies";

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
      expect(service.getData()).toEqual({ list: movies });
    });
  });
});
