import React from "react";
import tempImg from "../../../assets/image/temperature.png";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Home.scss";

const Home = () => {
  return (
    <div className="home d-flex flex-column h-100">
     
      <div className="notify-temp mt-auto">
        <img src={tempImg} alt="Temperature icon" />
        <span>
          Nhiệt độ ngày mai gần bằng mức cao kỉ lục của ngày 24 tháng 7
        </span>
      </div>
    </div>
  );
};

export default Home;