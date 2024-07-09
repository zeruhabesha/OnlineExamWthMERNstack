const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav>
        <ul className="pagination">
          {pageNumbers.map(number => (
            <li key={number} className="page-item">
              <button onClick={() => paginate(number)} className={currentPage === number ? 'page-link active' : 'page-link'}>
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };
  
  export default Pagination;
  
