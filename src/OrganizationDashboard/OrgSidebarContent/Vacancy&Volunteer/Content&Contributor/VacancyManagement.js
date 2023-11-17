import React, { useState } from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import Button from "../../../../components/reuseable/Button";

export const VacancyManagement = () => {
  const [edit, setEdit] = useState(false);

  return (
    <div className="vacancyManagement">
      <div className="subHeading mt-5">
        <h3>
          Vacancy Management
          {!edit && (
            <MdOutlineModeEdit
              fontSize={"24px"}
              className="ms-3 point"
              onClick={() => setEdit(true)}
            />
          )}
        </h3>
      </div>
      <div className="section mt-3 currentPlan row gy-3">
        <h2 className="text mb-0 col-sm-10">Open to application</h2>
        <div class="form-check form-switch col-sm-1 ">
          <input
            disabled={!edit}
            class="form-check-input point subIput"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckChecked"
          />
        </div>

        <h2 className=" text mb-0 col-sm-10">
          Send me notification when receive new application
        </h2>
        <div class="form-check form-switch col-sm-1 ">
          <input
            disabled={!edit}
            class="form-check-input point subIput"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckChecked"
          />
        </div>
        {edit && (
          <div className="text-center mt-4 ">
            <Button
              data={"Save Changes"}
              class={"profile-btn mt-2"}
              onClick={() => setEdit(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
