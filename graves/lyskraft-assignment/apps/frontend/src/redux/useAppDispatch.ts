import { useDispatch } from 'react-redux';
import { store } from './store';

const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export default useAppDispatch;
