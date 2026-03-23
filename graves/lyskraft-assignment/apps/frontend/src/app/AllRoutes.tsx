import { Navigate, Route, Routes } from 'react-router-dom';
import Products from '../modules/products';
import Billing from '../modules/billing';
import Orders from '../modules/orders';
import Layout from '../components/Layout';
import Auth from '../components/Auth';
import { useTypedSelector } from '../redux/useTypedSelector';
import GetStarted from '../components/GetStarted';

const AllRoutes = () => {
  const token = useTypedSelector((store) => store.user.token);

  // TODO: Implement `isTokenValid` function
  if (!token) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="auth" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/orders/*" element={<Orders />} />
        <Route path="/products/*" element={<Products />} />
        <Route path="/billing/*" element={<Billing />} />
        <Route path="/" element={<GetStarted />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AllRoutes;
