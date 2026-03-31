import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../redux/slices/authSlice';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }
  if (adminOnly && user.role !== 'admin') {
    navigate('/');
    return null;
  }
  return children;
}
