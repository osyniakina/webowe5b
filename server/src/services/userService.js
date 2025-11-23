export default class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }
  //logike usera tu
    async createUser(data) {
    const user = new this.userModel(data);
    return await user.save();
  } 
    async getUserByEmail(email) {   
        return await this.userModel.findOne({ email });
    }
    async getUserById(id) {
        return await this.userModel.findById(id);
    }
    async updateUser(id, data) {
        return await this.userModel.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteUser(id) {
        return await this.userModel.findByIdAndDelete(id);
    }
}