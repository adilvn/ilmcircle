import React from 'react'

import { MdClose } from "react-icons/md";
import { OrganizationContact } from './OrganizationContact';
function OrganizationContactOffcanvas({ data, data2, fetchConversations }) {
  return (
    <div className="chatCanvas">
      <div
        class="offcanvas offcanvas-start pe-1"
        tabindex="-1"
        id="offcanvasExample2"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div class="offcanvas-body ">
          <div
            className="pe-1 py-4"
            style={{
              backgroundColor: "rgba(252, 252, 252, 1)",
              height: "100vh",
              overflowY: "scroll",
            }}
          >
            <div className="text-end">
              <MdClose
                data-bs-dismiss="offcanvas"
                fontSize={"30px"}
                style={{ cursor: "pointer" }}
              />
            </div>


            <OrganizationContact dismiss={"offcanvas"} data={data} fetchConversations={fetchConversations} data2={data2} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizationContactOffcanvas