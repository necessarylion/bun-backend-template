import { Service } from "typedi"

@Service()
export default class UserService {
  constructor() {
    console.log('UserService loaded')
  }

  async getUsers() {
    return {
      message: 'Users fetched successfully',
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
      ]
    }
  }
}