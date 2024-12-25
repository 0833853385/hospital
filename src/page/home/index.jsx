import { Button, Col, Container, Row } from 'react-bootstrap';
import './index.scoped.scss';
import HealthIcon from '../../assets/icons/health';
import Footer from './components/Footer';
import doctorImg from '../../assets/image/doctor.png';
const Home = () => {
  const services = [
    {
      title: 'Root Canal Treatment',
      description: 'Professional care for your root canal needs',
      iconColor: '#25B4F8',
    },
    {
      title: 'Cosmetic Dentistry',
      description: 'Transform your smile beautifully',
      iconColor: '#FF6347',
    },
    {
      title: 'Pediatric Dentistry',
      description: 'Gentle care for children',
      iconColor: '#FFD700',
    },
  ];
  return (
    <Container className="p-5">
      <Row className="mt-5">
        <Col md={6}>
          <h1 className="hero-title">Get ready for your best ever Dental Experience!</h1>
          <p className="hero-description">
            We use only the best quality materials on the market in order to provide the best
            products to our patients, So dont worry about anything and book yourself.
          </p>

          <div className="d-flex gap-3 mt-4">
            <Button variant="primary">Book Appointment</Button>
            <Button variant="outline-primary">Learn More</Button>
          </div>
        </Col>

        <Col md={6}>
          <img src={doctorImg} alt="Dental Care" className="hero-image" />
        </Col>
      </Row>

      <Row className="services mt-0">
        <Col xs={12} className="text-center mb-5">
          <h2 className="services-title">Our Services</h2>
          <p className="services-subtitle">We provide the best dental services</p>
        </Col>

        {services.map((service, index) => (
          <Col md={4} key={index}>
            <div className="services-item d-flex flex-column align-items-center justify-content-center">
              <div className="service-icon mb-4">
                <HealthIcon />
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <Button variant="link" className="mt-3">
                Learn More →
              </Button>
            </div>
          </Col>
        ))}
      </Row>

      <Footer />
    </Container>
  );
};

export default Home;
