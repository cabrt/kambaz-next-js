import Link from "next/link";
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Button } from "react-bootstrap";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses" className="ms-4 me-4">
        <Row xs={1} sm={2} md={3} lg={4} xl={4} className="g-4">
          <Col className="wd-dashboard-course" style={{ width: "270px" }}>
            <Card>
              <Link href="/Courses/1234/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1234 React JS
                  </CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Full Stack software developer
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "270px" }}>
            <Card>
              <Link href="/Courses/1234/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/python.jpg" width="100%" height={160}/>
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS5678 Python Programming
                  </CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Data Science and Machine Learning
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "270px" }}>
            <Card>
              <Link href="/Courses/1234/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/brainrot.jpg" width="100%" height={160}/>
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    BUS6767 BrainRot
                  </CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    BrainRot and Things Related
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "270px" }}>
            <Card>
              <Link href="/Courses/1234/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/sofeng.jpg" width="100%" height={160}/>
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS4530 Software Engineering
                  </CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Software Engineering and Things Related
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "270px" }}>
            <Card>
              <Link href="/Courses/1234/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/apoc.jpg" width="100%" height={160}/>
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    PHIL1010 Apocalypticism in Film
                  </CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Apocalypticism and Things Related
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "270px" }}>
            <Card>
              <Link href="/Courses/1234/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/mus.jpg" width="100%" height={160}/>
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    MUS1000 Music and Everyday Life
                  </CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Music and Things Related
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "270px" }}>
            <Card>
              <Link href="/Courses/1234/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/webdev.jpg" width="100%" height={160}/>
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS4550 Web Development
                  </CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Web Development and Things Related
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
