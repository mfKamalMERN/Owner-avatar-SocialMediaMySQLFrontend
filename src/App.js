import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import { Login } from './Pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Home } from './Pages/Home';
import { EditPost } from './Pages/EditPost';

function App() {

  const router = createBrowserRouter([
    { path: '/', element: <Login /> },
    { path: '/home', element: <Home /> },
    { path: '/editpost/:postid', element: <EditPost /> },
  ])

  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
