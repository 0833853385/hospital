import { StoreContext } from './context/StoreContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/style/index.scss';
import { useContext } from 'react';
import AppRouter from './common/routes/router.jsx';

function App() {
  const { theme } = useContext(StoreContext);
  return (
    <div className="app " data-theme={theme}>
      <AppRouter />
    </div>
  );
}
export default App;
