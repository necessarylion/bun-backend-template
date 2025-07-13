import { Service } from "typedi";

@Service()
export default class BlogService {
  sayHello() {
    console.log('Hello')
  }
}