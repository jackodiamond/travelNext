'use client'
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/Login');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: "url('/back02.jpg')" }}>
      <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Login to view this page</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Home;
