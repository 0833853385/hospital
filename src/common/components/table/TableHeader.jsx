const TableHeader = ({ header }) => {
  return (
    <thead>
      <tr className="text-center">
        {header.map((col, index) => (
          <th key={index}>{col}</th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
