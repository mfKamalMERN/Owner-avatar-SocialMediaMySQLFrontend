import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import { Login } from './Pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Home } from './Pages/Home';
import { EditPost } from './Pages/EditPost';
import { ViewLikes } from './Pages/ViewLikes';
import { MyProfile } from './Pages/MyProfile';

function App() {

  const router = createBrowserRouter([
    { path: '/', element: <Login /> },
    { path: '/home', element: <Home /> },
    { path: '/myprofile', element: <MyProfile /> },
    { path: '/editpost/:postid', element: <EditPost /> },
    { path: '/viewlikes/:postid', element: <ViewLikes /> },
  ])

  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
