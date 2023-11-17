import React, { useEffect, useState } from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CustomerService } from "./DummyArray";
import { RiDeleteBin6Line } from "react-icons/ri";

export const Applicant = () => {
  const [edit, setEdit] = useState(false);
  const [totalRecords, setTotalRecords] = useState(CustomerService.length);
  const [customers, setCustomers] = useState(CustomerService);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState(null);
  const [selectedDlt, setSelectedDlt] = useState(false);

  const onSelectionChange = (event) => {
    if (!selectedDlt) {
      const value = event.value;

      setSelectedCustomers(value);
      setSelectAll(value.length === totalRecords);
    }
  };

  const onSelectAllChange = (event) => {
    const selectAll = event.checked;

    if (selectAll) {
      setSelectAll(true);
      setSelectedCustomers(customers);
    } else {
      setSelectAll(false);
      setSelectedCustomers([]);
    }
  };
  const dltRow = (item) => {
  };
  const dltBtn = (data) => {
    return (
      <RiDeleteBin6Line
        className={"point"}
        fontSize={"20px"}
        onClick={() => dltRow(data)}
      />
    );
  };
  const nameBody = (data) => {
    return (
      <div className="d-flex align-items-center">
        <img className="nameColoumnImg me-3" src={data.img} />
        <p className="mb-0">{data.name}</p>
      </div>
    );
  };
  const statusBody = (data) => {
    return (
      <div
        style={{
          color:
            data.status == "Rejected"
              ? "#B73838"
              : data.status == "Hired"
                ? "#2FA070"
                : data.status == "Interviewing"
                  ? "#2F90EC"
                  : "#252727",
        }}
      >
        {data.status}
      </div>
    );
  };
  return (
    <div className="applicant my-5">
      <div className="subHeading mt-5">
        <h3>
          Applicant {`(${totalRecords})`}
          {!edit && (
            <MdOutlineModeEdit
              fontSize={"24px"}
              className="ms-3 point"
              onClick={() => setEdit(true)}
            />
          )}
        </h3>
        {edit ? (
          <p className={`mb-0 ${selectAll ? "orangeColor" : ""}`}>
            {selectAll ? "Delete Applicants" : "Select all"}
          </p>
        ) : (
          ""
        )}{" "}
      </div>

      <div className="section mt-3">
        <DataTable
          value={customers}
          dataKey="id"
          selectionMode="checkbox"
          totalRecords={totalRecords}
          selection={selectedCustomers}
          onSelectionChange={onSelectionChange}
          selectAll={selectAll}
          onSelectAllChange={onSelectAllChange}
        >
          {edit && (
            <Column
              className="applicantSelection"
              selectionMode="multiple"
              headerStyle={{ width: "1rem" }}
            ></Column>
          )}
          <Column
            headerStyle={{ width: "8rem" }}
            field="name"
            header="Name"
            className="nameColumn"
            // body={representativeBodyTemplate}
            body={nameBody}
          />
          <Column
            headerStyle={{ width: "8rem" }}
            field="date"
            header="Apply date"
          //    body={countryBodyTemplate}
          />
          <Column
            field="status"
            header="Status"
            body={statusBody}
            headerStyle={{ width: "8rem" }}
          />
          {edit && <Column body={dltBtn} headerStyle={{ width: "1rem" }} />}
        </DataTable>
      </div>
    </div>
  );
};
