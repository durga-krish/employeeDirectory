import axios from "axios";

class UserService {
    static BASE_URL = "http://localhost:8080"

    static async login(email, password) {
        try{
            const response = await axios.post(`${UserService.BASE_URL}/api/users/login`,{email, password});
            return response.data;
        }catch (err){
            throw err;
        }
    }

    static async register(userData, token) {
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        }catch (err){
            throw err;
        }
    }

    static async getAllUsers(token) {
        try{
            const response = await axios.get(`${UserService.BASE_URL}/api/users`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        }catch (err){
            throw err;
        }
    }

    static async getYourProfile(token) {
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-profile`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        }catch (err){
            throw err;
        }
    }

    static async getUserById(userId, token) {
        try{
            const response = await axios.get(`${UserService.BASE_URL}/api/users/${userId}`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        }catch (err){
            throw err;
        }
    }

    static async deleteUser(userId, token) {
        try{
            const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        }catch (err){
            throw err;
        }
    }

    static async updateUser(userId, userData, token) {
        try{
            const response = await axios.put(`${UserService.BASE_URL}/admin/update/${userId}`, userData,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        }catch (err){
            throw err;
        }
    }

    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token
    }

    static getRole() {
        return localStorage.getItem('role');
    }

    static isAdmin(){
        const role = this.getRole();
        return role === 'ADMIN';
    }

    static isUser(){
        const role = this.getRole();
        return role === 'USER';
    }

    static adminOnly(){
        return this.isAuthenticated() && this.isAdmin();
    }

}

export default UserService;