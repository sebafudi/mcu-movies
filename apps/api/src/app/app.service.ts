import { Injectable } from "@nestjs/common";

import { movies } from "./movies";

@Injectable()
export class AppService {
  getData(): { list: typeof movies } {
    return { list: movies };
  }
}
