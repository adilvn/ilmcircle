import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { BsChevronDown } from "react-icons/bs";
import { LuSend } from "react-icons/lu";
import { BiChevronDown, BiChevronRight, BiPlusCircle } from "react-icons/bi";
import { MdClose, MdEdit } from "react-icons/md";
import img1 from "../../../asserts/images/Avatar (1).png";
import img2 from "../../../asserts/images/mamber2.png";
import Download from "../../../asserts/images/download.svg";
import { ReactSVG } from "react-svg";
import myEventCloseIcon from "../../../asserts/images/myEventCloseIcon.png";
import downArrow from "../../../asserts/images/downArrow.png";
import edit from "../../../asserts/images/orgEditIcon.png";
import addBtn from "../../../asserts/images/newMsg.png";
import { Calendar } from "primereact/calendar";
import { Loader } from "../../../components/reuseable/Loader";
import secureLocalStorage from "react-secure-storage";
// import { BiChevronRight } from "react-icons/bi"; // Import the icons you need
import Buttons from "../../../components/reuseable/Button";
import set from "date-fns/set";

export default function ProductsDemo({
  filterName,
  item,

  sendCreateTaskData,
  sendUpdatedTaskData,
  hideModal,
  setHideModal,
  setAllSelectedItem,
  setProduct,
  product,
  setDeleteProductID,
  openDelete,
  DeletedProducts,
  setOpenDelete,
  setTaskComment,
  taskComment,
  setMarkIds,
  selectedItem,
  deleteProductID,
}) {
  const [date, setDate] = useState(null);

  // const [product, setProduct] = useState();

  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showOption, setShowOption] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalCategory, setModalCategory] = useState(false);
  const [modalPriority, setModalPriority] = useState(false);
  const [modalMember, setModalMember] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [rowClick, setRowClick] = useState(true);
  const [deletedPro, setDeletedPro] = useState();
  const [member, setMember] = useState();
  const [selectedMembers, setSelectedMembers] = useState([]); // Initialize selected members as an empty array
  const [isEdit, setIsEdit] = useState(false);
  const [selectedActionText, setSelectedActionText] = useState("");

  const [isInputActive, setInputActive] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    document.body.addEventListener("click", handleDocumentClick);
    return () => {
      document.body.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleDocumentClick = (e) => {
    // Check if the click target is inside the status field or its children
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      e.target.classList.contains("statusField") === false
    ) {
      setModalStatus(false); // Close the dropdown if clicked outside
      setModalCategory(false);
      setModalPriority(false);
      setModalMember(false);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      openNew();
      const date = new Date(selectedItem);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are zero-based
      const day = date.getDate().toString().padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;
      setProduct({ ...product, dueDate: formattedDate });
    }
  }, []);
  const updateSelectedActionText = (selectedItems) => {
    if (selectedItems.length === 0) {
      setTaskComment(false);
      setSelectedActionText("");
    } else {
      setSelectedActionText(`(${selectedItems.length} selected)`);
    }
  };

  const handleMarkAction = (txt) => {
    const selectedIds = Array.from(
      new Set(selectedProducts?.map((item) => item._id))
    );
    // console.log('selectedIds==>', selectedIds, txt)
    // setMarkIds(selectedIds);
    // setMarkTxt(txt);
    // setSelectedArrayTasks(selectedProducts)
    sendUpdatedTaskData(selectedIds, txt);
    setTaskComment(false);
  };

  const handleMarkAsNotStarted = () => { };

  const handleDeleteSelectedItems = () => { };

  const toggleDropdown = () => {
    setModalCategory(!modalCategory);
  };

  const handleInputClick = () => {
    setModalCategory(!modalCategory);
    if (!modalCategory) {
      setNewCategory("");
    }
  };

  const handleInputChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      setProduct({ ...product, category: newCategory });
      setNewCategory("");
      setModalCategory(false);
    }
  };

  // console.log('product0900-->', product)

  const handleCategoryClick = (category) => {
    setProduct({ ...product, category });
    setModalCategory(false); // Close the dropdown when an option is clicked
  };
  const token = secureLocalStorage.getItem("token");

  const toast = useRef(null);
  const dt = useRef(null);
  const dummyData = [
    { img: img1, name: "Jade Doe" },
    { img: img1, name: "Jade Doe" },
    { img: img1, name: "Jade Doe" },
    { img: img1, name: "Jade Doe" },
  ];

  useEffect(() => {
    GetMembersData();
    if (hideModal) {
      setSubmitted(false);
      setProductDialog(false);
      setHideModal(false);
      setSelectedProducts([]);
      setShowOption(false);
      setTaskComment(false);
    }
  }, [hideModal]);

  useEffect(() => {
    if (openDelete) {
      setDeleteProductsDialog(true);
    }
  }, [openDelete]);

  const GetMembersData = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://ilmcircle.com/backend/api/student/task/member/get",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log('JSONData -> ', result)
        setMember(result?.data);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    setProducts(item);
  }, [item]);

  const formatCurrency = (value) => {
    return value;
  };

  const ClickedRow = (e) => {
    if (e.field !== "selection") {
      setRowClick(true);
      setProduct(e.data);
      setSelectedRowData(e.data);
      setProductDialog(true);
      setTaskComment(false);
    }
  };

  const openNew = () => {
    setProduct({});
    setSubmitted(false);
    setProductDialog(true);
  };
  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };
  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
    setOpenDelete(false);
  };

  // console.log('product.....=>', product)

  const saveProduct = () => {
    setSubmitted(true);

    if (product.name.trim()) {
      let _products = [...products];
      let _product = { ...product };

      if (product.id) {
        const index = findIndexById(product.id);

        _products[index] = _product;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        _product.id = createId();
        // _product.image = "product-placeholder.svg";
        _products.push(_product);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }

      setProducts(_products);
      setProductDialog(false);
      // setProduct(emptyProduct);
    }
  };

  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _products = products.filter((val) => val._id !== product.id);
    setProducts(_products);
    setDeleteProductDialog(false);
    // setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < products.length; i++) {
      if (products[i]._id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };
  // console.log('setOpenDelete', openDelete)
  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    let _products = products.filter((val) => selectedProducts?.includes(val));
    DeletedProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts([]);
    setTaskComment(false);
    setShowOption(false);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <div className="goalTaskDoneSection">
          <button
            className={`doneBtn gap-2 ${filterName == "In progress"
              ? "Inprogress"
              : filterName == "Not Started"
                ? "isstarted"
                : ""
              } `}
          >
            <div className="span"></div>
            {filterName}
            <img
              src={downArrow}
              className="ms-2 mt-1"
              alt=""
              width={20}
              height={20}
            />
          </button>
        </div>


      </div>
    );
  };

  // console.log('selectedProducts111111', selectedProducts)

  const AllSelectedDeleteItem = (e) => {
    setTaskComment(true);
    setSelectedProducts(e.value); // Update selected item IDs
    updateSelectedActionText(e.value); // Update action text

    // Set rowClick to false when a checkbox is clicked
    setRowClick(false);
    setAllSelectedItem(e.value);
  };
  const leftToolbarTemplate2 = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {taskComment ? (
          <div>
            <div className="p-toolbar-group-left gap-4">
              <div
                className="checkMarksTxt"
                onClick={() => handleMarkAction("Done")}
              >
                Mark as Done
              </div>
              <div
                className="checkMarksTxt"
                onClick={() => handleMarkAction("Not started")}
              >
                Mark as Not Started
              </div>
              <div
                className="checkMarksTxt"
                onClick={() => {
                  setDeleteProductsDialog(true);
                  setOpenDelete(true);
                }}
              >
                Delete selected items
              </div>
            </div>
            <div className="p-toolbar-group-right">
              {/* {selectedActionText} */}
            </div>
          </div>
        ) : null}
      </div>
    );
  };
  const statusBody = () => {
    return (
      <div className="goalTaskDoneSection">
        <div className="innerTableColBtnHead">
          <button
            className={`innerTableCol ${filterName == "In progress"
              ? "Inprogress"
              : filterName == "Not Started"
                ? "isstarted"
                : ""
              } `}
          >
            <div className="span"></div>
            <div style={{ marginLeft: "-5px" }}>{filterName}</div>
          </button>
        </div>
      </div>
    );
  };
  const modalHeader = (pro) => {
    // console.log('pro--=-=-=-=->', pro)
    return (
      <div className="header d-flex justify-content-between">
        <input
          style={{ border: "none" }}
          id="Name"
          disabled={!isEdit}
          placeholder="Untitled task"
          className="unitedTaskstyle w-100  p-1 mt-2"
          value={product?.name}
          // onValueChange={(e) => onInputNumberChange(e)}
          onChange={(e) => {
            setProduct({ ...product, name: e.target.value });
          }}
        />

        {/* <span className="me-2">Untitled task</span> */}
        <div className="p-dialog-header-icons-custom d-flex align-items-center gap-4">
          <img
            className=" "
            src={edit}
            onClick={() => setIsEdit(!isEdit)}
            alt="edit"
            style={{
              width: 20.83,
              height: 20.83,
              // marginBottom: 31,
              cursor: "pointer",
            }}
          />

          <img
            className=""
            onClick={hideDialog}
            src={myEventCloseIcon}
            alt="myEventCloseIcon"
            style={{
              width: 16.15,
              height: 16.15,
              // marginBottom: 31,
              cursor: "pointer",
            }}
          />
          <ReactSVG
            style={{ cursor: "pointer" }}
            className="mb-3 ms-1 iconModal"
            src={Download}
          />
        </div>
      </div>
    );
  };

  // console.log('productPROPS===>', product)
  const rightToolbarTemplate = () => {
    return (
      <Button
        label="New item"
        icon={<BiPlusCircle className="me-2" />}
        className="newItemBtn"
        onClick={openNew}
      />
      // <Button
      //   label="Export"
      //   icon="pi pi-upload"
      //   className="p-button-help"
      //   onClick={exportCSV}
      // />
    );
  };

  const imageBodyTemplate = (rowData) => {
    // console.log('rowData--.>', rowData)

    return rowData?.contactId?.map(
      (item) =>
        item?.userDetailId?.image?.url && (
          <img
            src={item?.userDetailId?.image?.url}
            alt={"item"}
            className="border-round "
            style={{ width: "30px", height: "30px", borderRadius: "30px" }}
          />
        )
    );
  };
  const FirstNameHeader = (rowData) => {
    // console.log('rowDataContact', rowData)
    return rowData?.name;
  };
  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.price);
  };



  const toggleMemberSelection = (item) => {
    const isSelected = selectedMembers?.some(
      (selected) => selected?.member?.id === item?.member?.id
    );

    if (isSelected) {
      setSelectedMembers((prevSelectedMembers) =>
        prevSelectedMembers.filter(
          (selected) => selected.member.id !== item.member.id
        )
      );
    } else {
      setSelectedMembers((prevSelectedMembers) => [
        ...prevSelectedMembers,
        item,
      ]);
    }

    setProduct((prevProduct) => {
      const updatedMembers = isSelected
        ? (prevProduct.member || []).filter(
          (selected) => selected.member.id !== item.member.id
        )
        : [...(prevProduct.member || []), item];

      return { ...prevProduct, member: updatedMembers };
    });
  };

  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }


  const productDialogFooter = (
    <React.Fragment>

    </React.Fragment>
  );
  const categoryHeader = () => {
    return (
      <div className="header">
        <span className="category me-2">Category</span>
        <img src={downArrow} className="" alt="" width={20} height={20} />
      </div>
    );
  };


  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedProducts}
      />
    </React.Fragment>
  );

  return (
    <div className="doneSectionTable mt-4">
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <Toast ref={toast} />
      <div className="card ">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <Toolbar
          className="mt-3 p-0 ms-4"
          left={leftToolbarTemplate2}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) => AllSelectedDeleteItem(e)}
          dataKey="_id"
          onRowDoubleClick={(e) => ClickedRow(e)}
          selectionMode={rowClick ? null : "checkbox"}
          // rows={10}
          // rowsPerPageOptions={[5, 10, 25]}
          // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
        // header={header}
        >
          <Column
            selectionMode="multiple"
            onClick={(e) => e.preventDefault()}
            style={{ width: "4rem" }}
            exportable={false}
            className="widthSettingTable"
          ></Column>

          <Column
            field="name"
            header="Name"
            body={FirstNameHeader}
            style={{ width: "22rem" }}
            className="widthSettingTable"
          ></Column>
          <Column
            field="category"
            header={categoryHeader}
            style={{ width: "125px", padding: "5px" }}
            className="widthSettingTable"
          ></Column>
          <Column
            field="dueDate"
            header="Due date"
            style={{ width: "125px", padding: "5px" }}
            className="widthSettingTable"
          />
          <Column
            field="member"
            header="Member"
            body={imageBodyTemplate}
            style={{ width: "125px", padding: "5px" }}
            className="widthSettingTable"
          ></Column>
          <Column
            field="description"
            header="Description"
            style={{ width: "175px", padding: "5px" }}
            className="widthSettingTable"
          ></Column>

          <Column
            field="priority"
            header="Priority"
            style={{ width: "125px", padding: "5px" }}
            className="widthSettingTable"
          ></Column>

          <Column
            field="status"
            header="Status"
            body={statusBody}
            // body={statusBodyTemplate}

            style={{ width: "12rem" }}
            className="widthSettingTable"
          ></Column>

        </DataTable>
      </div>

      <Dialog
        visible={productDialog}
        // style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={modalHeader}
        dismissableMask={true}
        draggable={false}
        modal
        className="p-fluid addNewTaskModal width-class "
        // footer={productDialogFooter}
        onHide={hideDialog}
      >

        <div className="field mt-3 row goalTaskDoneSection jusitfy-content-start">
          <label htmlFor="name" className="font-bold pt-2 pb-3 ps-1 pe-4 col-2">
            Status
          </label>
          <div className=" col-sm-6 col-9 ms-sm-0 ms-1">
            <div
              className="statusField py-2 ps-1 pe-1 point"
              onClick={() => setModalStatus(!modalStatus)}
            >
              {" "}
              <span className="">
                {product?.status ? product?.status : "Select"}
              </span>
              <span className="text-end ms-5">
                {modalStatus ? (
                  <BiChevronDown fontSize={"20px"} />
                ) : (
                  <BiChevronRight fontSize={"20px"} />
                )}
              </span>
            </div>
            {modalStatus ? (
              <div className="mt-2" ref={dropdownRef}>
                <div className="goalTaskDoneSection my-2">
                  <div className="innerTableColBtnHead ">
                    <button
                      className={`innerTableCol py-2 fs-16 px-3 py-2 w-75 justify-content-start`}
                      style={{ backgroundColor: "#C5E4D7" }}
                      onClick={() => {
                        setProduct({ ...product, status: "Done" });
                        // setTaskStatus("done")
                        setModalStatus(false);
                      }}
                    >
                      <div className="span"></div>
                      <div className="statusoptions">Done</div>
                    </button>
                  </div>
                </div>
                <div className="goalTaskDoneSection  my-2">
                  <div className="innerTableColBtnHead ">
                    <button
                      onClick={() => {
                        setProduct({ ...product, status: "In progress" });
                        // setTaskStatus("In progress")

                        setModalStatus(false);
                      }}
                      className={`innerTableCol Inprogress fs-16 px-3 py-2 w-75 justify-content-start`}
                    >
                      <div className="span"></div>
                      <div className="statusoptions">In progress</div>
                    </button>
                  </div>
                </div>
                <div className="goalTaskDoneSection  my-2">
                  <div className="innerTableColBtnHead ">
                    <button
                      onClick={() => {
                        setProduct({ ...product, status: "Not started" });
                        // setTaskStatus("not started")

                        setModalStatus(false);
                      }}
                      className={`innerTableCol isstarted fs-16 px-3 py-2 w-75 justify-content-start`}
                    >
                      <div className="span"></div>

                      <div className="statusoptions">Not started</div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="field mt-3 goalTaskDoneSection row justify-content-start">
          <label htmlFor="name" className="font-bold py-2 ps-1 pe-4 col-2">
            Category
          </label>
          <div className="col-sm-6 col-9 ms-sm-0 ms-1">
            <div
              className="statusField py-2 ps-1 pe-1 point"
              onClick={toggleDropdown}
            >
              <span className="me-0">
                {product.category ? product.category : "Select"}
              </span>
              <span className="text-end">
                {modalCategory ? (
                  <BiChevronDown fontSize={"20px"} />
                ) : (
                  <BiChevronRight fontSize={"20px"} />
                )}
              </span>
            </div>
            {modalCategory ? (
              <div
                className="categoryDropDown categoryVal mt-2 "
                ref={dropdownRef}
              >
                <div
                  className="categoryGoal my-3 pointer dropDown-hover"
                  onClick={() => handleCategoryClick("Memorization")}
                >
                  Memorization
                </div>
                <div
                  className="categoryGoal my-3 pointer dropDown-hover"
                  onClick={() => handleCategoryClick("Revision")}
                >
                  Revision
                </div>
                <div
                  className="categoryGoal my-3 pointer"
                  onClick={handleInputClick}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      {modalCategory ? (
                        <input
                          type="text"
                          placeholder="Input name "
                          value={newCategory}
                          onChange={handleInputChange}
                          className="w-75"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        "Input name"
                      )}
                    </div>
                    <img
                      className="me-2"
                      onClick={handleAddCategory}
                      style={{ width: 20, height: 20, cursor: "pointer" }}
                      src={addBtn}
                      alt="addBtn"
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="field mt-3 goalTaskDoneSection row jusitfy-content-start">
          <label htmlFor="name" className="font-bold py-2 col-2 ps-1 pe-0">
            Due date
          </label>
          <div className="col-sm-6 col-9 ms-sm-0 ms-1">
            <input
              type="date"
              disabled={selectedItem}
              placeholder="Select"
              value={product?.dueDate?.replace(/\//g, "-")}
              onChange={(e) => {
                setProduct({ ...product, dueDate: e.target.value });
                // setTaskDueDate(e.target.value)
              }}
              className="w-100 statusField py-2 ps-1 pe-1 point"
            />
          </div>
        </div>
        <div className="field mt-3 goalTaskDoneSection row jusitfy-content-start">
          <label htmlFor="name" className="font-bold py-2 ps-1 pe-4 col-2">
            Priority
          </label>
          <div className="col-sm-6 col-9 ms-sm-0 ms-1">
            <div
              className="statusField py-2 ps-1 pe-1 point"
              onClick={() => setModalPriority(!modalPriority)}
            >
              <span className="">
                {product?.priority ? product?.priority : "Select"}
              </span>
              <span className="text-end">
                {modalPriority ? (
                  <BiChevronDown fontSize={"20px"} />
                ) : (
                  <BiChevronRight fontSize={"20px"} />
                )}
              </span>
            </div>
            {modalPriority ? (
              <div className="categroyDropDown mt-2" ref={dropdownRef}>
                <div
                  className="categoryGoal my-2 point"
                  onClick={() => {
                    setProduct({ ...product, priority: "Low" });
                    // setPriority("Low")
                    setModalPriority(false);
                  }}
                >
                  Low
                </div>
                <div
                  className="categoryGoal my-2 point"
                  onClick={() => {
                    setProduct({ ...product, priority: " Medium" });
                    // setPriority("Medium")

                    setModalPriority(false);
                  }}
                >
                  Medium
                </div>
                <div
                  className="categoryGoal my-2 point"
                  onClick={() => {
                    setProduct({ ...product, priority: "High" });
                    // setPriority("High")
                    setModalPriority(false);
                  }}
                >
                  High
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="field mt-3 goalTaskDoneSection row justify-content-start">
          <label htmlFor="name" className="font-bold py-2 ps-1 pe-4 col-2">
            Member
          </label>
          <div className="col-sm-6 col-9 ms-sm-0 ms-1">
            <div
              className="statusField py-2 ps-1 pe-1 point"
              onClick={() => setModalMember(!modalMember)}
              ref={dropdownRef}
            >
              <div
                className="selected-members-container"
                style={{
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  width: "300px",
                }}
              >
                <span className="ms-1">{(!product?._id && selectedMembers?.length === 0) ? "Select " : ""} </span>

                {
                  selectedMembers?.length > 0
                    ? selectedMembers?.map((selected) => (
                      <div
                        key={selected.id}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          marginRight: "10px",
                        }}
                      >
                        {selected?.member?.images &&
                          selected?.member?.images?.length > 0 && (
                            <img
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 30,
                              }}
                              src={selected?.member?.images[0]?.url}
                              alt="image"
                            />
                          )}
                        <span className="ms-1">
                          {selected?.member?.firstName}{" "}
                          {selected?.member?.lastName}
                        </span>
                      </div>
                    ))
                    : product?.contactId?.map((selected) => (
                      <div
                        key={selected._id}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          marginRight: "10px",
                        }}
                      >
                        {selected?.userDetailId?.image && (
                          <img
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 30,
                            }}
                            src={selected?.userDetailId?.image?.url}
                            alt="image"
                          />
                        )}
                        <span className="ms-1">
                          {selected?.userDetailId?.firstName}{" "}
                          {selected?.userDetailId?.lastName}
                        </span>
                      </div>
                    ))
                }
              </div>
              <span className="text-end ms-2">
                {modalMember ? (
                  <BiChevronDown fontSize={"20px"} />
                ) : (
                  <BiChevronRight fontSize={"20px"} />
                )}
              </span>
            </div>

            {modalMember ? (
              <div className="categroyDropDown mt-2">
                {member?.map((item, index) => (
                  <div key={index}>
                    {item?.userDetailId?.firstName ||
                      item?.userDetailId?.lastName ||
                      item?.userDetailId?.image?.url ? (
                      <div
                        className={`categoryGoal my-2 point ${selectedMembers?.some(
                          (selected) => selected?.member?.id === item?._id
                        )
                          ? "selected"
                          : ""
                          }`}
                        key={index}
                        onClick={() => {
                          toggleMemberSelection({
                            member: {
                              id: item._id,
                              firstName: item?.userDetailId?.firstName || "",
                              lastName: item?.userDetailId?.lastName || "",
                              images: [
                                {
                                  url: item?.userDetailId?.image?.url || "",
                                },
                              ],
                            },
                          });
                        }}
                      >
                        {item?.userDetailId?.image?.url && (
                          <img
                            style={{ width: 30, height: 30, borderRadius: 30 }}
                            src={item?.userDetailId?.image?.url}
                            alt="User"
                          />
                        )}
                        {(item?.userDetailId?.firstName ||
                          item?.userDetailId?.lastName) && (
                            <span className="ms-1">
                              {item?.userDetailId?.firstName}{" "}
                              {item?.userDetailId?.lastName}
                            </span>
                          )}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div iv className="field mt-3 negativePadding">
          <label htmlFor="name" className="font-bold py-2 pe-4 ">
            Description
          </label>
          <InputTextarea
            id="descriptionGoalTask"
            value={product?.description}
            onChange={(e) => {
              setProduct({ ...product, description: e.target.value });
              // setTaskDescription(e.target.value)
            }}
            placeholder="Input text"
            required
            rows={3}
            cols={20}
            className="p-0 ps-1 font-size-input-field"
          />
        </div>

        <div className="field position-relative mb-4 negativePadding">
          <div htmlFor="price" className="font-bold">
            Comments
          </div>
          <input
            id="comments"
            placeholder="Input text"
            className="w-100  p-1 mt-2 font-size-input-field"
            value={product?.comment}
            onValueChange={(e) => onInputNumberChange(e)}
            onChange={(e) => {
              setProduct({ ...product, comment: e.target.value });
            }}

          />

        </div>

        <div className="d-flex justify-content-center mb-4">
          <Buttons
            class={"tech-btn tech-btn-2 me-3"}
            data={product?._id ? "Update" : "Create"}
            onClick={() => {
              product?._id ? sendUpdatedTaskData() : sendCreateTaskData();
              setSelectedMembers([]);
            }}
          ></Buttons>
        </div>


      </Dialog>

      {deleteProductsDialog && openDelete && (
        <>
          <Dialog
            visible={deleteProductsDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            // header="Confirm"

            draggable={false}
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteProductsDialog}
          >
            <div className="confirmation-content">
              <div className="d-flex algn-items-center gap-3">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                <p className="ConfirmAlert">Confirm</p>
              </div>

              {product && (
                <div>
                  <span>
                    Are you sure you want to delete the selected products?
                  </span>
                </div>
              )}
            </div>
          </Dialog>
        </>
      )}


    </div>
  );
}