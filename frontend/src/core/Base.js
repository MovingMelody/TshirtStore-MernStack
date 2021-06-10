import React from "react";
import Nav from "./Nav";

const Base = ({
  title = "My Title",
  description = "My desription",
  className = "bg-dark text-white p-4",
  children,
}) => (
  <div>
    <Nav />
    <div className="container-fluid">
      <div className="jumbotron bg-dark text-white text-center">
        <h2 className="display-4">{title}</h2>
        <p className="lead">{description}</p>
      </div>
      <div className={className}>{children}</div>
    </div>
    <footer className="footer bg-dark mt-auto pt-3">
      <div className="container-fluid bg-success text-white text-center py-2">
        <h4>If you got any questions, feel free to reach out!</h4>
        <button className="btn btn-sm  btn-warning">Contact Us</button>
      </div>
      {/* <div className="container">
        <span className="text-muted">
          An Amazing <span className="text-white">MERN</span> Bootcamp
        </span>
      </div> */}
    </footer>
  </div>
);

export default Base;
