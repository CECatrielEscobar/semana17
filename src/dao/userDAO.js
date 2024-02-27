import UserModel from "../schemas/registerSchema.js";

class UserDAO {
  async registerUser(data) {
    // const data = UserModel.findOne({ email: email }, { email: 1 })
    try {
      const validate = await UserModel.findOne(
        { email: data.email },
        { email: 1 }
      ).lean();
      if (validate) {
        return null;
      } else {
        const newUser = new UserModel({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          age: data.age,
          password: data.password,
          rol: data.rol,
        });
        const respuesta = await newUser.save();
        return respuesta;
      }
    } catch (error) {
      console.log("error al crear un usuario", error);
      throw error;
    }
  }
  async loginUser(email, password) {
    try {
      const response = await UserModel.findOne({ email: email }).lean();
      return response;
    } catch (error) {
      console.log(error);
      throw Error;
    }
  }
}

export default UserDAO;
