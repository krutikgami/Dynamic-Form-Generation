import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContainerUtility/ToastContainer";
import Button from "../components/common/Button";

export default function Login() {
  const {showToast} = useToast();
    const navigate = useNavigate();
    const [isLoading,setIsLoading] = useState(false)
    const [formdata,setFormData] = useState({
        email : '',
        password : ''
    })
    const handleLogin = async()=>{
        try {
          setIsLoading(true)
            const response = await fetch('/api/v1/admin/login',{
                headers :{
                    'Content-Type' : 'application/json'
                },
                method : "POST",
                body : JSON.stringify(formdata)
            })
            const data = await response.json();
            console.log(data)
            if(!response.ok){
              console.log(data?.message);
              showToast(data.message,data.success)
              return
            }
            showToast(data.message,data.success)
            navigate('/builder')
        } catch (error) {
            console.error('Error in Login',error)
        }finally{
          setIsLoading(false)
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white border-2 border-black rounded-2xl shadow-lg p-8 w-96">
        <h2 className="text-3xl font-bold text-center text-black mb-6">Login</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            onChange={(e)=>setFormData({...formdata,email : e.target.value})}
            value={formdata.email}
            placeholder="Enter your email"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            onChange={(e)=>setFormData({...formdata,password : e.target.value})}
            value={formdata.password}
            placeholder="Enter your password"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <Button 
        title="Login"
         className="bg-green-500 hover:bg-green-600 text-white font-semibold w-full py-3 rounded-lg transition duration-200 cursor-pointer" 
         onClickFunction={handleLogin}
        />
      </div>
    </div>
  );
}
