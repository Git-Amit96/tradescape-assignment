import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../Pages/ErrrorPage.jsx";
import App from "../App.jsx";
import Dashboard from "@/Pages/Dashboard.jsx";

const Routes = createBrowserRouter([
{
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>,
    children:[
        {
            path: "",
            element: <Dashboard/>
        },
    ],
},

])

export default Routes;