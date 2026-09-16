import { useNavigate } from "react-router-dom";
import icon1 from "../../assets/icon1.png";
import icon2 from "../../assets/icon2.png";
import icon3 from "../../assets/icon3.png";
import "./Intro.css";

export default function Intro() {
  const navigate = useNavigate();

  function handleStart() {
    navigate("/knowledge");
  }

  return (
    <main className="intro">
      <section className="intro__content">
        <div className="intro__heading">
          <h1 className="intro__title">Welcome to Mesh AI</h1>
        </div>

        <div className="intro__cards">
          <article className="intro__card">
            <div className="intro__card-content">
              <img
                src={icon1}
                alt="Secure document workspace"
                className="intro__card-icon"
              />

              <p className="intro__card-description">
                Bring all your documents into one secure AI workspace
              </p>
            </div>
          </article>

          <article className="intro__card">
            <div className="intro__card-content">
              <img
                src={icon2}
                alt="Document organization"
                className="intro__card-icon"
              />

              <p className="intro__card-description">
                Organize and manage the documents that power your AI
              </p>
            </div>
          </article>

          <article className="intro__card">
            <div className="intro__card-content">
              <img
                src={icon3}
                alt="AI chat interface"
                className="intro__card-icon"
              />

              <p className="intro__card-description">
                Your knowledge base, accessible through a simple chat interface
              </p>
            </div>
          </article>
        </div>

        <div className="intro__bottom">
          <p className="intro__instruction">
            Start by creating your Organization’s Knowledge Base
          </p>

          <button
            type="button"
            className="intro__button"
            onClick={handleStart}
          >
            Start
          </button>
        </div>
      </section>
    </main>
  );
}

