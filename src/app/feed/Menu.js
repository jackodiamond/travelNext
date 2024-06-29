'use client'
import React ,{useContext} from 'react';
import { useRouter } from 'next/navigation';
import UserContext from '../components/UserContext';
import './Menu.css';

function Menu({ activeMenu, setActiveMenu,unseenCount,showLogout }) {
  const router = useRouter();
  const {logout,setAuthor } = useContext(UserContext); 

  const handleClick = (menu) => {
    console.log("handle click called ", menu);
    switch (menu) {
      case 'feeds':
        router.push('/feed');
        break;
      case 'profile':
        setAuthor(null)
        router.push('/profile');
        break;
      case 'createFeed':
        router.push('/createFeed');
        break;
      case 'companion':
        router.push('/companion');
        break;
      case 'logout':
        router.push('/'); 
       // logout();
        const timeoutId = setTimeout(() => {
          logout();
          console.log("logged out")
        }, 1000);
        break;
      default:
        break;
    }
  };

  return (
    <div className="menu-container">
    <div className="button-group">
    <button
      className="menu-button w-36 h-6 rounded bg-blue-500 text-white hover:bg-blue-400 transition"
      onClick={() => handleClick('feeds')}
    >
      Feeds
    </button>
    <button
      className="menu-button w-36 h-6 rounded bg-blue-500 text-white hover:bg-blue-400 transition"
      onClick={() => handleClick('profile')}
    >
      Profile
    </button>
    <button
      className="menu-button w-36 h-6 rounded bg-blue-500 text-white hover:bg-blue-400 transition"
      onClick={() => handleClick('createFeed')}
    >
      Create Feed
    </button>
    <button
      className="menu-button w-36 h-6 rounded bg-blue-500 text-white hover:bg-blue-400 transition"
      onClick={() => handleClick('companion')}
    >
      Companion
      {unseenCount!== 0 ? (<span className="text-red-500 text-xs"> {unseenCount}</span>
                  ):(<></>)}
    </button>

    </div>
    {showLogout && (
    <div className="logout-container">
    <button
      className="menu-button w-36 h-6 rounded bg-blue-500 text-white hover:bg-red-400 transition"
      onClick={() => handleClick('logout')}
    >
      Logout
    </button>
    </div>
    )}
  </div>

  );
}

export default Menu;
