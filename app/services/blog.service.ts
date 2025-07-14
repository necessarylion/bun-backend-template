import { Service } from "typedi";

@Service()
export default class BlogService {
  sayHello(name: string) {
    console.log('Hello', name)
  }
}