import { Injectable } from "@nestjs/common";

const movies = [
  { id: 1, title: "Iron Man", globalReleaseDate: new Date("2008-04-30") },
  {
    id: 2,
    title: "The Incredible Hulk",
    globalReleaseDate: new Date("2008-06-13"),
  },
];

@Injectable()
export class AppService {
  getData(): { list: typeof movies } {
    return { list: movies };
  }
}
