//import styles from '../styles/HomePage.module.css';
import NavButton from './components/NavButton';
import './Home.css';

const HomePage = () => {
  return (
    <div className='home-page'>
      <div className='auth-buttons'>
        <NavButton path="/Login" label="Login" className='btn'/>
        <NavButton path="/Signup" label="Signup" className='btn' />
      </div>
      <div className='center-content'>
        <h1>Welcome to TravelBlog</h1>
        <p>TravelBlog is a platform where users can post and share their travel experiences. Join our community to explore amazing travel stories and share your own adventures.</p>
        <NavButton path="/feed" label="Explore" className='explore-btn' />
      </div>
    </div>
  );
};

export default HomePage;
