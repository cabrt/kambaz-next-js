import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/Courses/1234/Home" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="React JS Course" />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/5678/Home" className="wd-dashboard-course-link">
            <Image src="/images/python.jpg" width={200} height={150} alt="Python Course" />
            <div>
              <h5> CS5678 Python Programming </h5>
              <p className="wd-dashboard-course-title">
                Data Science and Machine Learning
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/6767/Home" className="wd-dashboard-course-link">
            <Image src="/images/brainrot.jpg" width={200} height={150} alt="BrainRot Course" />
            <div>
              <h5> BUS6767 BrainRot </h5>
              <p className="wd-dashboard-course-title">
                BrainRot and Things Related
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/4530/Home" className="wd-dashboard-course-link">
            <Image src="/images/sofeng.jpg" width={200} height={150} alt="Software Engineering Course" />
            <div>
              <h5> CS4530 Software Engineering </h5>
              <p className="wd-dashboard-course-title">
                Software Engineering and Things Related
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/1010/Home" className="wd-dashboard-course-link">
            <Image src="/images/apoc.jpg" width={200} height={150} alt="Apocalypticism in Film Course" />
            <div>
              <h5> PHIL1010 Apocalypticism in Film </h5>
              <p className="wd-dashboard-course-title">
                Apocalypticism and Things Related
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/1000/Home" className="wd-dashboard-course-link">
            <Image src="/images/mus.jpg" width={200} height={150} alt="Music and Everyday Life Course" />
            <div>
              <h5> MUS1000 Music and Everyday Life </h5>
              <p className="wd-dashboard-course-title">
                Music and Things Related
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/4550/Home" className="wd-dashboard-course-link">
            <Image src="/images/webdev.jpg" width={200} height={150} alt="Web Development Course" />
            <div>
              <h5> CS4550 Web Development </h5>
              <p className="wd-dashboard-course-title">
                Web Development and Things Related
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
