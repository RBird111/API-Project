import "./Footer.scss";

const Footer = () => {
  return (
    <div className="footer">
      <div className="name">
        <p>Roosevelt Burden</p>
      </div>

      <div className="icons">
        <a href="https://github.com/RBird111" target="_blank" rel="noreferrer">
          <i className="fa-brands fa-github" />
        </a>

        <a
          href="https://www.linkedin.com/in/roosevelt-burden-83982026b/"
          target="_blank"
          rel="noreferrer"
        >
          <i className="fa-brands fa-linkedin-in" />
        </a>

        <a
          href="https://github.com/RBird111/API-Project"
          target="_blank"
          rel="noreferrer"
        >
          <i className="fa-solid fa-code-branch" />
        </a>
      </div>

      <div className="copyright">
        <p>@2023</p>
      </div>
    </div>
  );
};

export default Footer;
