import {  Col, Container, Row } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="footer-content">
          <Col md={4}>
            <div className="footer-brand">
              <p className="mt-4">
                Providing the best quality dental care with modern technology and experienced
                professionals.
              </p>
            </div>
          </Col>

          <Col md={2}>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
              <li>
                <a href="#">Doctors</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h4 className="footer-title">Services</h4>
            <ul className="footer-links">
              <li>
                <a href="#">Root Canal Treatment</a>
              </li>
              <li>
                <a href="#">Cosmetic Dentistry</a>
              </li>
              <li>
                <a href="#">Oral Surgery</a>
              </li>
              <li>
                <a href="#">Pediatric Dentistry</a>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h4 className="footer-title">Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <i className="bi bi-geo-alt"></i>
                123 Dental Street, City, Country
              </li>
              <li>
                <i className="bi bi-telephone"></i>
                +1 234 567 890
              </li>
              <li>
                <i className="bi bi-envelope"></i>
                info@dentalhospital.com
              </li>
            </ul>
          </Col>
        </Row>

        <Row className="footer-bottom">
          <Col className="text-center">
            <hr className="footer-divider" />
            <p className="copyright">
              © {new Date().getFullYear()} Dental Hospital. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
