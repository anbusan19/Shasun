import { Link } from "react-router-dom";
import collegeImage from "../../assets/college_logo.png";
import "./Home.css";
import Footer from "../Footer/Footer";

function Home() {
  return (
    <>
      <div className="home-container">
        <header className="home-header">
          <img src={collegeImage} alt="College Logo" className="college-logo" />
        </header>

        <div className="hero-section">
          <h1 className="hero-title" >INVITEWIZ</h1>
          <Link to="/design-invitation">
            <button className="invite-button" style={{backgroundColor:'rgb(220,53,69)', padding:'20px'}}>Design Invitation →</button>
          </Link>
        </div>

        <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          ↑
        </button>
        
      </div>
      <Footer/>
    </>
  );
}

export default Home;
