import "./LoadingIcon.scss";
import logo from "../../assets/scp_logo.svg";

const LoadingIcon = () => {
  return (
    <div className="loading-icon">
      <div className="spin-icon">
        <img className="spin-logo" src={logo} alt="logo" />
      </div>
    </div>
  );
};

export default LoadingIcon;
