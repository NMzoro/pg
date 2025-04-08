import { createBrowserRouter } from "react-router-dom";
import Hero from "../Hero";
import App from "../App";

export const router = createBrowserRouter([
    {
        path:'/',
        element:<Hero/>
    },
    {
        path:'/demo',
        element:<App/>
    }
])
export default router