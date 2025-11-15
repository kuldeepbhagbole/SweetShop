import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        🍭 Sweet Shop
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <span className="username">Hi, {user.username}!</span>
            {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
            <button onClick={logoutUser} className="btn btn-secondary">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;