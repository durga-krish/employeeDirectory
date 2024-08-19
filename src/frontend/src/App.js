import './App.css';
import {Navigate, Route, Routes} from "react-router-dom";
import EmployeeList from "./pages/employee/EmployeeList";
import PostEmployee from "./pages/employee/PostEmployee";
import EditEmployee from "./pages/employee/EditEmployee";
import PostDepartment from "./pages/department/PostDepartment";
import EditDepartment from "./pages/department/EditDepartment";
import PostLocation from "./pages/location/PostLocation";
import EditLocation from "./pages/location/EditLocation";
import Department from "./pages/department/Department";
import Location from "./pages/location/Location"
import Dashboard from "./pages/dashboard/Dashboard";
import Navbar from "./components/common/Navbar";
import LoginPage from "./components/auth/LoginPage";
import ProfilePage from "./components/userspage/ProfilePage";
import UserService from "./components/service/UserService";
import RegistrationPage from "./components/auth/RegistrationPage";
import UserManagementPage from "./components/userspage/UserManagementPage";
import UpdateUser from "./components/userspage/UpdateUser";
import AuthContext, {AuthProvider} from "./components/auth/AuthContext";

const App = () =>{
  return (
      <AuthProvider>
         <AuthContext.Consumer>
             {({ isAuthenticated }) => (
                 <>
                 {isAuthenticated && <Navbar />}
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

                     <Route path="/register" element={<RegistrationPage />} />
                     <Route path="/admin/user-management" element={<UserManagementPage />} />
                     <Route path="/update-user/:userId" element={<UpdateUser />} />

             <Route path="*" element={<Navigate to="/login" />} />
         </Routes>
         </>
                 )}
         </AuthContext.Consumer>
      </AuthProvider>
  );
};

export default App;
