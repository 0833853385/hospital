import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoIcon from '../../../assets/icons/logo';
import { PATH_AUTHENTICATION, PATH_HOME } from '../../routes/path';
import {
  clearAuthentication,
  selectIsAuthenticated,
  selectPatientId,
} from '../../../oauth/oauth.slice';
import './index.scoped.scss';
import { FaUserCircle } from 'react-icons/fa';
import { useDispatch } from '@/common/redux/store';
import { replacePathParams } from '@/common/utils/common.utils';

const HomeNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const patientId = useSelector(selectPatientId);

  const handleBookNowClick = () => {
    if (!isAuthenticated) {
      navigate(PATH_AUTHENTICATION.oauthLogin);
    } else {
      navigate(replacePathParams(PATH_HOME.appointment.booking, { patientId: patientId }));
    }
  };

  const handleLogout = () => {
    dispatch(clearAuthentication());
  };
  return (
    <Navbar bg="light" expand="lg" className="py-3 w-50">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <LogoIcon />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="w-100">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={PATH_HOME.prescription.root}>
              Prescriptions
            </Nav.Link>
            <Nav.Link
              as={Link}
              to={replacePathParams(PATH_HOME.appointment.calendar, { patientId: patientId })}
            >
              Appointment
            </Nav.Link>
          </Nav>
          <Nav>
            <Button variant="primary" className="me-2" onClick={handleBookNowClick}>
              Book now
            </Button>
            {!isAuthenticated ? (
              <Button
                variant="outline-secondary"
                onClick={() => navigate(PATH_AUTHENTICATION.oauthLogin)}
              >
                Log in
              </Button>
            ) : (
              <div className="auth d-flex align-items-center">
                <FaUserCircle size={32} className="text-secondary" />
                <ul className="select">
                  <li onClick={handleLogout} className="item">
                    Log out
                  </li>
                </ul>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HomeNavbar;
