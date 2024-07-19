import './App.css';
import {Navigate, Route, Routes} from "react-router-dom";
import EmployeeList from "./pages/employee/EmployeeList";
import PostEmployee from "./pages/employee/PostEmployee";
import EditEmployee from "./pages/employee/EditEmployee";
import PostDepartment from "./pages/department/PostDepartment";
import EditDepartment from "./pages/department/EditDepartment";
import PostLocation from "./pages/location/PostLocation";
import EditLocation from "./pages/location/EditLocation";
import Register from "./pages/login/Register";
import Login from "./pages/login/Login";
import Logout from "./pages/login/Logout";
import Department from "./pages/department/Department";
import Location from "./pages/location/Location"
import WelcomePage from "./pages/dashboard/WelcomePage";
import Dashboard from "./pages/dashboard/Dashboard";
import Navbar from "./components/common/Navbar";
import LoginPage from "./components/auth/LoginPage";
import ProfilePage from "./components/userspage/ProfilePage";
import UserService from "./components/service/UserService";
import RegistrationPage from "./components/auth/RegistrationPage";
import UserManagementPage from "./components/userspage/UserManagementPage";
import UpdateUser from "./components/userspage/UpdateUser";

const App = () =>{
  return (
         <>
             <Navbar />
         <Routes>
             <Route path='/' element={<LoginPage />} />
             <Route path='/dashboard' element={<Dashboard />} />
             <Route path='/employees' element={<EmployeeList />} />
             <Route path='/departments' element={<Department />} />
             <Route path='/locations' element={<Location />} />
             <Route path='/employees/new' element={<PostEmployee />} />
             <Route path='/employees/:id' element={<EditEmployee />} />
             <Route path='/departments/new' element={<PostDepartment />}  />
             <Route path='/departments/:id' element={<EditDepartment />} />
             <Route path='/locations/new' element={<PostLocation />} />
             <Route path='/locations/:id' element={<EditLocation />} />

             <Route path="/login" element={<LoginPage />} />
             <Route path="/profile" element={<ProfilePage />} />

             {UserService.adminOnly() && (
                 <>
                     <Route path="/register" element={<RegistrationPage />} />
                     <Route path="/admin/user-management" element={<UserManagementPage />} />
                     <Route path="/update-user/:userId" element={<UpdateUser />} />
                 </>
             )}
             <Route path="*" element={<Navigate to="/login" />} />
         </Routes>
         </>
  );
};

export default App;
