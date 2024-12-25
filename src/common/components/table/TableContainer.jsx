import { Button } from 'react-bootstrap';
import TableHeader from './TableHeader';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

/**
 * example data
 *
 * {
 * title
 * header: array
 * data: table row
 * }
 */

const TableContainer = ({
  title,
  header,
  data,
  onHandleAdd,
  buttonTitle,
  isActionButton,
  handleEdit,
  onRowClick,
  children,
  headerMapping,
}) => {
  return (
    <div className="p-3">
      <div className="d-flex align-items-center justify-content-between w-100 mb-5">
        {title ? <h3 className="fw-bold">{title}</h3> : <div></div>}
        {isActionButton && (
          <Button variant="primary" onClick={onHandleAdd} className="fw-bold">
            {buttonTitle}
          </Button>
        )}
      </div>
      <Table striped bordered hover>
        <TableHeader header={headerMapping ? header.map((h) => headerMapping[h]) : header} />
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row.id)}
              className="cursor-pointer text-center"
            >
              {header.map((col, colIndex) => (
                <td key={colIndex}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      {children}
    </div>
  );
};

export default TableContainer;
