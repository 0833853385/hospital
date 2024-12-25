
const TimeItem = ({ isActive, value }) => {
    return (
      <div
        style={{
          padding: "10px 15px",
          borderRadius: "5px",
          cursor: "pointer",
          backgroundColor: isActive ? "#0067FF" : "#dbeaff",
          color: isActive ? "#fff" : "#000",
        }}
      >
        {value}
      </div>
    );
  };

export default TimeItem
