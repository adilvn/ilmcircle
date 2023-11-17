import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
const Pagination = () => {
  return (
    <nav
      className="justify-content-center d-flex eventPage"
      aria-label="Page navigation example "
    >
      <ul class="pagination">
        <li class="page-item">
          <a class="page-link" href="#">
            <span className="me-2">
              <BiArrowBack color="grey" fontSize={"16px"} />
            </span>
            Prev
          </a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">
            1
          </a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">
            2
          </a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">
            3
          </a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">
            Next
            <span className="ms-2">
              <BsArrowRight color="grey" fontSize={"16px"} />
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
