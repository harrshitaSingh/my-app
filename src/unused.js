import { useEffect, useState } from "react";
import "../src/table1.scss";
import "../src/table2.scss";
import { Dialog } from "@material-ui/core";
import SignaturePad from "react-signature-canvas";
import { MdClear } from "react-icons/md";
import { toast } from "react-toast";
import config from "../src/config/config";
import OpportunityService from "../src/services/opportunityService";
import POService from "../src/services/poService";

const POItem = ({ item, getPoByOrderId, imageStates }) => {
  // const [imageStates, setImageStates] = useState([]);
  const [commenttoUpdate, setComment] = useState("");
  const [declineModal, setdeclineModal] = useState(false);
  console.log(
    "sdfsdfsfdsfdsfdsfdsfsdfdsfdsfdsfsdfdsf",
    window.FromFinanceRequestAdmin
  );
  const approveHandlerUpdateApproved = async (IdtoUpdate, approvedItem) => {
    let objecttoupdate = {
      ...JSON.parse(approvedItem.approvalDetails),
      ApprovedOn: new Date().getTime(),
      status: "Approved",
    };
    const opportunityService = new OpportunityService();
    await opportunityService.updateOpportunityById(IdtoUpdate, {
      ApprovalStatus: "Approved",
      approvalDetails: objecttoupdate,
    });
    const poService = new POService();
    await poService.unReleasePO(IdtoUpdate, {
      approvalDetails: objecttoupdate,
    });

    toast.success("Order Approved!", {
      backgroundColor: "rgb(255, 211, 77)",
      color: "black",
    });
  };

  useEffect(() => {
    // desc-highlight-brand
    let highlightTimer = setTimeout(() => {
      let textarea = (elem, regex) => {
        for (let i = 0; i < elem.length; i++) {
          elem[i].innerHTML = elem[i].innerHTML.replace(regex, "<b>$&</b>");
        }
        // Takes an element, and a regex. The regex should have the "g" flag set
      };
      // let textarea = document.querySelector(".desc-highlight-brand")
      // console.log('text area divs',textarea)
      textarea(
        document.querySelectorAll(".desc-highlight-brand-released-orders"),
        /@[a-zA-Z]{1,}/g
      );
    }, 0);

    // let testing = document.querySelectorAll(".desc-highlight-brand")
    // console.log('testing ',testing);

    return () => clearTimeout(highlightTimer);
  });

  const olderverions =
    JSON.parse(item?.OlderVersions) !== "null" &&
    JSON.parse(item?.OlderVersions) !== null &&
    JSON.parse(item?.OlderVersions);
  console.log("Oldrecek cer;sfjsf", olderverions);
  const uploadSignature = async (url) => {
    // setIsLoading(true)
    console.log("in the upload sign ", Date.now());
    await fetch(`${config.poService}${item.Id}`, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendorSignature: url,
        VendorAcceptedDate: Date.now().toString(),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log("Response from uploadSignature API: ", json);
        getPoByOrderId();
        toast.success("PO Accepted Successfully", {
          backgroundColor: "#2AC342",
          color: "black",
        });
      })
      .catch((e) => {
        console.log("uploadSignature error: ", e.toString());
        // e.toString().includes('Network request failed') ? setIsOnline(false) : (alert(e.toString()), setIsOnline(true))
        // setIsLoading(false)
        toast.error("Error Uploading Signature", {
          backgroundColor: "#E72424",
          color: "black",
        });
      });
  };

  const VendorAcceptedDate = (timestamp) => {
    let AcceptedDate = new Date(+timestamp);
    let year = AcceptedDate.getFullYear();
    let month = AcceptedDate.getMonth() + 1;
    let date = AcceptedDate.getDate();
    let day = AcceptedDate.getDay();

    return `${date}-${month}-${year}`;
  };
  const [isSignModal, setSignModal] = useState(false);
  const [signPad, setsignPad] = useState();
  const signBtnUploadHandler = () => {
    setSignModal(true);
  };

  const onCloseModalHandler = () => {
    setSignModal(false);
  };
  const onSignClearHandler = () => {
    console.log(
      "signPad ",
      signPad,
      "issenpty",
      signPad._sigPad._isEmpty,
      "sdfdsfsfsdf",
      signPad._sigPad._isEmpty
    );
    signPad.clear();
  };

  const onSignSubmitHandler = async () => {
    await uploadSignature(signPad.getTrimmedCanvas().toDataURL());
    // setImageStates(true);
    //  await sleep(2000)

    onCloseModalHandler();
    // setImageStates(false);
    // console.log('poData',poData,"ID",poData[0].Id)
  };

  const [milestoneTobeAddedIndex, setMilestoneTobeAddedIndex] = useState([]);
  // const [imageStates, setImageStates] = useState([]);

  // console.log("here is image printed but url coming", imageStates[index]);

  var orderNo = 0;
  var commonMilestonesIndex = 0;
  var commonMilestoneAmount =
    (!isNaN(item.freight) ? item.freight : 0) -
    (item?.discount > 0 ? Number(item?.discount) : 0); // this is for po older than April-25-23(added commonMilestones seperatly)
  let sNo = 0;
  return (
    <>
      {item && (
        <>
          <p className="release-date-info-header">
            {new Date(item.poDate).toLocaleDateString("en-GB")}-{" "}
            {new Date(item.poDate).toLocaleTimeString()}
          </p>
          <div
            style={{
              opacity: JSON.parse(item.AmendmentDetails)?.isUnreleased
                ? "0.5"
                : "",
            }}
            className="divs-container"
          >
            {JSON.parse(item.AmendmentDetails)?.isUnreleased && (
              <div className="watermark">Unreleased</div>
            )}
            <div className="heading-container">
              <p className="header">
                {"type" in JSON.parse(item.discription)[0]
                  ? `${
                      olderverions?.length > 0 ? "Amended" : ""
                    }  Purchase Order ${
                      olderverions?.length > 0
                        ? `(${olderverions?.length + 1})`
                        : ""
                    }`
                  : `${olderverions?.length > 0 ? "Amended" : ""} Work Order ${
                      olderverions?.length > 0
                        ? `(${olderverions?.length + 1})`
                        : ""
                    }`}
              </p>
              <img src={item.firmLogoURL} className="firmLogo" />
            </div>
            <div className="order-details-container">
              <div className="left-pan-container">
                <div className="details">
                  <p style={{ fontWeight: "bold" }}>{item.firmName}&nbsp;</p>
                </div>
                <div className="details" style={{ width: "70%" }}>
                  <p>{item.firmAddress}</p>
                </div>
                <div className="details">
                  <p style={{ fontWeight: "bold" }}>Phone Number:&nbsp;</p>
                  <p> {item.firmPhoneNumber}</p>
                </div>
                <div className="details">
                  <p style={{ fontWeight: "bold" }}> GSTIN:&nbsp;</p>
                  <p> {item.firmGSTIN}</p>
                </div>
                <div className="details">
                  <p style={{ fontWeight: "bold" }}>Contact Person: &nbsp;</p>
                  <p> {item.firmContactPersonName}</p>
                </div>
                <div className="details">
                  <p style={{ fontWeight: "bold" }}>Mobile Number:&nbsp;</p>
                  <p>{item.firmContactPersonNumber}</p>
                </div>
                <div className="details">
                  <p style={{ fontWeight: "bold" }}>Email: &nbsp;</p>
                  <p>{item.firmContactPersonEmail}</p>
                </div>
              </div>
              <div className="right-pan-container-order">
                <div className="details-order">
                  <p>Order ID:&nbsp; </p>
                  <p>{item.OrderId}</p>
                </div>
                <div className="details-order">
                  <p>PO ID:&nbsp;</p>
                  <p>{item.Id}</p>
                </div>

                <div className="details-order">
                  <p>PO Date:&nbsp;</p>
                  <p>
                    {item.poDate
                      .toString()
                      .substring(0, 10)
                      .split("-")
                      .reverse()
                      .join(" / ")}
                  </p>
                </div>
                <div className="details-order">
                  <p>Start Date: &nbsp;</p>
                  <p>
                    {item.startDate
                      .toString()
                      .substring(0, 10)
                      .split("-")
                      .reverse()
                      .join(" / ")}
                  </p>
                </div>
                <div className="details-order">
                  <p>End Date:&nbsp; </p>
                  <p>
                    {item.endDate
                      .toString()
                      .substring(0, 10)
                      .split("-")
                      .reverse()
                      .join(" / ")}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="order-details-container"
              style={{ background: "#f1f1f1" }}
            >
              <div className="left-pan-container">
                <p>To,</p>
                <div className="details">
                  <p>
                    <span style={{ fontWeight: "bold" }}>
                      Vendor Name:&nbsp;
                    </span>
                  </p>
                  <p>
                    {item.vendorMobile == null ||
                    item.vendorMobile == "null" ||
                    item.vendorMobile == "null : null" ||
                    item.vendorMobile == "Open Vendor"
                      ? "-"
                      : item.vendorMobile.split(":")[0].trim()}
                  </p>
                </div>
                <div className="details">
                  <p style={{ fontWeight: "bold" }}>Vendor Firm:&nbsp; </p>
                  <p>
                    {item.vendorFirm == null || item.vendorFirm == "null"
                      ? "-"
                      : item.vendorFirm}
                  </p>
                </div>
                <div className="details">
                  <p style={{ fontWeight: "bold" }}>Mobile Number:&nbsp; </p>
                  <p>
                    {item.vendorMobile == null ||
                    item.vendorMobile == "null" ||
                    item.vendorMobile == "null : null" ||
                    item.vendorMobile == "Open Vendor"
                      ? "-"
                      : item.vendorMobile &&
                        item.vendorMobile.split(":")[1].trim()}
                  </p>
                </div>
                <div className="details">
                  <p style={{ fontWeight: "bold" }}>Address:&nbsp; </p>
                  <p>
                    {item.vendorAddress == null || item.vendorAddress == "null"
                      ? //  ||
                        // item.vendorMobile == "null : null" ||
                        // item.vendorMobile == "Open Vendor"
                        "-"
                      : item.vendorAddress
                          .toString()
                          .replace(/<new-line>/g, "\n")
                          .replace(/[\\#, +;$~%.'":*?<>{}]/g, "\n")}{" "}
                    {item.vendorPinCode == null || item.vendorPinCode == "null"
                      ? //  ||
                        // item.vendorMobile == "null : null" ||
                        // item.vendorMobile == "Open Vendor"
                        "-"
                      : item.vendorPinCode}{" "}
                    {item.vendorCity == null || item.vendorPinCode == "null"
                      ? //  ||
                        // item.vendorMobile == "null : null" ||
                        // item.vendorMobile == "Open Vendor"
                        "-"
                      : item.vendorCity}{" "}
                    {item.vendorState}
                  </p>
                </div>
                <div className="details">
                  <p style={{ fontWeight: "bold" }}>GSTIN: &nbsp; </p>
                  <p>
                    {item.vendorMobile == null ||
                    item.vendorMobile == "null" ||
                    item.vendorMobile == "null : null" ||
                    item.vendorMobile == "Open Vendor"
                      ? "-"
                      : item.vendorGSTIN}
                  </p>
                </div>
              </div>

              <div
                className="right-pan-container"
                style={{ justifyContent: "flex-start", paddingTop: "46px" }}
              >
                <div className="details">
                  <p style={{ fontWeight: "bold" }}>Site Engineer: &nbsp;</p>
                  <p>{item.siteEngineerName}</p>
                </div>
                <div className="details">
                  <p style={{ fontWeight: "bold" }}>Mobile Number:&nbsp;</p>
                  <p>{item.siteEngineerMobile}</p>{" "}
                </div>
                <p style={{ fontSize: 15 }}>&nbsp;(Escalation 1)</p>
                <div className="details">
                  <p style={{ fontWeight: "bold" }}>Contact Person:&nbsp;</p>
                  <p>{item.projectContactPerson}</p>
                </div>
                <div className="details">
                  <p style={{ fontWeight: "bold" }}>Mobile Number:&nbsp;</p>
                  <p>{item.projectContactNumber}</p>{" "}
                  {/* <p style={{ fontSize: 15 }}>&nbsp;(Escalation2)</p> */}
                </div>
              </div>
            </div>
            {window.innerWidth > 600 ? (
              <table
                id="table"
                style={{
                  fontSize: "13px",
                  width: "80%",
                  marginTop: "1.5em",
                  height: "100%",
                }}
              >
                <tbody>
                  <tr>
                    <th style={{ backgroundColor: "#fff6db" }}>Category</th>
                    <th style={{ backgroundColor: "#fff6db" }}>Description</th>
                    {/* {imageStates.every((img) => img != null )  ? <th style={{ backgroundColor: "#fff6db" }}>Image</th> : ''} /// */}
                    <th style={{ backgroundColor: "#fff6db" }}>Image</th>
                    <th style={{ backgroundColor: "#fff6db" }}>Quantity</th>
                    <th style={{ backgroundColor: "#fff6db" }}>Unit</th>
                    <th style={{ backgroundColor: "#fff6db" }}>Rate</th>
                    <th style={{ backgroundColor: "#fff6db" }}>GST</th>
                    <th style={{ backgroundColor: "#fff6db" }}>Amount</th>
                  </tr>

                  {item.discription &&
                    JSON.parse(item.discription).map((item, index) => {
                      if (index == milestoneTobeAddedIndex[orderNo]) {
                        // write the code here
                        orderNo = orderNo + 1;
                      } else {
                        // write the code here
                        commonMilestonesIndex = index;

                        return (
                          <tr
                            style={{
                              verticalAlign: "top",
                              textAlign: "center",
                            }}
                            key={index}
                          >
                            {"type" in item ||
                            ("workType" in item &&
                              item.workType == "Only Material") ? (
                              <td>{item.type || item.category}</td>
                            ) : (
                              <td>{item.category || item.vendorCategory}</td>
                            )}

                            {"type" in item ? (
                              <td className="desc-highlight-brand-released-orders">
                                {item.specification
                                  ?.replace(/<single-quote>/g, "' ")
                                  .replace(/<double-quote>/g, '"')
                                  .split("<new-line>")
                                  .map((text, index) => {
                                    // const chunks = text.match(
                                    //   new RegExp(`.{${60}}`, "g")
                                    // );
                                    // if (!chunks)
                                    return (
                                      <div key={index}>
                                        {text}

                                        <br />
                                      </div>
                                    );

                                    // chunks
                                    //   .map((chunk) => chunk + "&#20;")
                                    //   .join("");
                                    // return (
                                    //   <div key={index}>
                                    //     {chunks}

                                    //     <br />
                                    //   </div>
                                    // );
                                  })}
                                {"milestones" in item &&
                                  item.milestones.map((mItem, mIndex) => (
                                    <div
                                      key={mIndex}
                                      style={{ display: "none" }}
                                    >
                                      {
                                        (commonMilestoneAmount =
                                          commonMilestoneAmount +
                                          Number(
                                            (item.quantity * item.rate +
                                              item.quantity *
                                                item.rate *
                                                (item.gst / 100)) *
                                              (mItem.percentage / 100)
                                          ))
                                      }
                                    </div>
                                  ))}
                              </td>
                            ) : (
                              <td className="desc-highlight-brand-released-orders">
                                {item.description
                                  ?.replace(/<single-quote>/g, "'")
                                  .replace(/<double-quote>/g, '"')
                                  .split("<new-line>")
                                  .map((text, index) => {
                                    // const chunks = text.match(
                                    //   new RegExp(`.{${60}}`, "g")
                                    // );
                                    // console.log("chunksss", chunks);
                                    // if (!chunks)
                                    return (
                                      <div key={index}>
                                        {text}

                                        <br />
                                      </div>
                                    );

                                    // let addedspaces = chunks
                                    //   // .map((chunk) => chunk + "&emsp;")
                                    //   .join(" ");
                                    // console.log("added tje spacs", addedspaces);
                                    // return (
                                    //   <div key={index}>
                                    //     {addedspaces}

                                    //     <br />
                                    //   </div>
                                    // );
                                  })}
                                {"milestones" in item &&
                                  item.milestones.map((mItem, mIndex) => (
                                    <div
                                      key={mIndex}
                                      style={{ display: "none" }}
                                    >
                                      {
                                        (commonMilestoneAmount =
                                          commonMilestoneAmount +
                                          Number(
                                            (item.quantity * item.rate +
                                              item.quantity *
                                                item.rate *
                                                (item.gst / 100)) *
                                              (mItem.percentage / 100)
                                          ))
                                      }
                                    </div>
                                  ))}
                              </td>
                            )}

                            {/* { imageStates[index] != null ? */}
                            <td>
                              {!imageStates || imageStates[index] == null ? (
                                <p>-</p>
                              ) : (
                                <img
                                  style={{
                                    width: "150px",
                                    height: "150px",
                                    objectFit: "contain",
                                  }}
                                  src={imageStates[index]}
                                  alt="Image Not uploaded"
                                />
                              )}
                            </td>

                            <td>{item.quantity}</td>
                            <td>{item.unit}</td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "center",
                                }}
                              >
                                {"\u20B9 "}
                                {item.rate}
                              </div>
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "center",
                                }}
                              >
                                {item.gst} %
                              </div>
                            </td>
                            <td
                              style={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {"\u20B9 "}{" "}
                              {(
                                item["quantity"] * item["rate"] +
                                item["quantity"] *
                                  item["rate"] *
                                  (item["gst"] / 100)
                              ).toFixed(2)}
                              {window.FromFinanceRequestAdmin &&
                                item?.profitablilityOfComponent && (
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      color:
                                        item?.profitablilityOfComponent
                                          ?.percentage > 0
                                          ? "red"
                                          : "green",
                                    }}
                                  >
                                    {`(${Math.abs(
                                      item.profitablilityOfComponent.percentage
                                    )}%)`}
                                  </span>
                                )}
                            </td>
                          </tr>
                        );
                      }
                    })}
                </tbody>
              </table>
            ) : (
              <div className="mobile-items-container">
                <div className="items-heading">
                  <p>Items:</p>
                </div>
                <div>
                  {item.discription &&
                    JSON.parse(item.discription).map((item, index) => {
                      if (index == milestoneTobeAddedIndex[orderNo]) {
                        // write the code here
                        // sNo +=1
                        orderNo = orderNo + 1;

                        console.log(
                          "here is the url heloo",
                          imageStates[index]
                        );
                      } else {
                        sNo += 1;
                        return (
                          <div>
                            <div key={index} className="mobile-item">
                              <p style={{ fontWeight: "bold" }}>{sNo}.</p>
                              {"type" in item ||
                              ("workType" in item &&
                                item.workType == "Only Material") ? (
                                <p style={{ fontWeight: "bold" }}>
                                  Category : {item.type || item.category}
                                </p>
                              ) : (
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "12px",
                                  }}
                                >
                                  Category :{" "}
                                  {item.category || item.vendorCategory}
                                </p>
                              )}
                              <div className="mob-item-description">
                                {"type" in item ? (
                                  <div className="desc-highlight-brand-released-orders">
                                    {item.specification
                                      ?.replace(/<single-quote>/g, "'")
                                      .replace(/<double-quote>/g, '"')
                                      .split("<new-line>")
                                      .map((text, index) => (
                                        <div key={index}>
                                          {text}
                                          <br />
                                        </div>
                                      ))}
                                    {"milestones" in item &&
                                      item?.milestones.map((mItem, mIndex) => (
                                        <div
                                          key={mIndex}
                                          style={{ display: "none" }}
                                        >
                                          {
                                            (commonMilestoneAmount =
                                              commonMilestoneAmount +
                                              Number(
                                                (item.quantity * item.rate +
                                                  item.quantity *
                                                    item.rate *
                                                    (item.gst / 100)) *
                                                  (mItem.percentage / 100)
                                              ))
                                          }
                                        </div>
                                      ))}
                                  </div>
                                ) : (
                                  <div className="desc-highlight-brand-released-orders">
                                    {item.description
                                      ?.replace(/<single-quote>/g, "'")
                                      .replace(/<double-quote>/g, '"')
                                      .split("<new-line>")
                                      .map((text, index) => (
                                        <div key={index}>
                                          {text}
                                          <br />
                                        </div>
                                      ))}
                                    {"milestones" in item &&
                                      item.milestones.map((mItem, mIndex) => (
                                        <div
                                          key={mIndex}
                                          style={{ display: "none" }}
                                        >
                                          {
                                            (commonMilestoneAmount =
                                              commonMilestoneAmount +
                                              Number(
                                                (item.quantity * item.rate +
                                                  item.quantity *
                                                    item.rate *
                                                    (item.gst / 100)) *
                                                  (mItem.percentage / 100)
                                              ))
                                          }
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>
                              <div className="mob-item-details">
                                <p>Quantity : {item.quantity}</p>
                                <p>Unit : {item.unit}</p>
                                <p>Rate : {item.rate}</p>
                                <p>GST : {item.gst} %</p>
                                <p>
                                  Amount :{" "}
                                  {(
                                    item["quantity"] * item["rate"] +
                                    item["quantity"] *
                                      item["rate"] *
                                      (item["gst"] / 100)
                                  ).toFixed(2)}
                                  {window.FromFinanceRequestAdmin &&
                                    item?.profitablilityOfComponent && (
                                      <span
                                        style={{
                                          fontWeight: 600,
                                          color:
                                            item?.profitablilityOfComponent
                                              ?.percentage > 0
                                              ? "red"
                                              : "green",
                                        }}
                                      >
                                        {`(${Math.abs(
                                          item.profitablilityOfComponent
                                            .percentage
                                        )}%)`}
                                      </span>
                                    )}
                                </p>
                              </div>
                              <div className="mob-item-image">
                                {!imageStates || imageStates[index] == null ? (
                                  ""
                                ) : (
                                  // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                  <img
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      objectFit: "contain",
                                    }}
                                    src={imageStates[index]}
                                    alt="Item Image"
                                  />
                                )}
                              </div>
                            </div>
                            <hr style={{ margin: "10px" }}></hr>
                          </div>
                        );
                      }
                    })}
                </div>
              </div>
            )}

            <div className="common-milestones-container">
              <div className="common-milestones-header">
                <div
                  style={{
                    display: "flex",
                    width: "40%",
                    maxWidth: "40%",
                    minWidth: "40%",
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  Payment Milestones
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "10%",
                    justifyContent: "center",
                    maxWidth: "auto%",
                    minWidth: "20%",
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  %
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    // width: "10%",
                    maxWidth: "auto",
                    minWidth: "30%",
                    fontWeight: 700,
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  Amount
                </div>
              </div>

              {item?.CommonMilestones
                ? JSON.parse(item.CommonMilestones).map((mItem, mIndex) => (
                    <div
                      key={mIndex}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        padding: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: "40%",
                          maxWidth: "40%",
                          minWidth: "40%",
                          fontSize: 12,
                        }}
                      >
                        {mItem.name}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          // width: "10%",
                          justifyContent: "center",
                          maxWidth: "auto%",
                          minWidth: "20%",
                          fontSize: 12,
                        }}
                      >
                        {mItem.percentage} %
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          // width: "10%",
                          maxWidth: "auto",
                          minWidth: "30%",
                          fontSize: 12,
                          textAlign: "center",
                        }}
                      >
                        {"\u20B9 "}
                        {Number(mItem.totalAmount).toFixed(2)}
                      </div>
                    </div>
                  ))
                : item.discription &&
                  JSON.parse(item.discription)[
                    commonMilestonesIndex
                  ].milestones.map((mItem, mIndex) => (
                    <div
                      key={mIndex}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        padding: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: "40%",
                          maxWidth: "40%",
                          minWidth: "40%",
                          fontSize: 12,
                        }}
                      >
                        {mItem.name}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          // width: "10%",
                          justifyContent: "center",
                          maxWidth: "auto%",
                          minWidth: "20%",
                          fontSize: 12,
                        }}
                      >
                        {mItem.percentage} %
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          // width: "10%",
                          maxWidth: "auto",
                          minWidth: "30%",
                          fontSize: 12,
                          textAlign: "center",
                        }}
                      >
                        {"\u20B9 "}
                        {/* {Number(mItem.totalAmount).toFixed(2)} */}
                        {(item.totalAmount * (mItem.percentage / 100)).toFixed(
                          2
                        )}
                      </div>
                    </div>
                  ))}
            </div>

            {window.innerWidth > 600 ? (
              <table
                id="table"
                style={{ fontSize: "13px", width: "80%", marginTop: "30px" }}
              >
                <tbody>
                  {milestoneTobeAddedIndex.length == 0 ? null : (
                    <tr>
                      <th style={{ backgroundColor: "#fff6db" }}>Category</th>
                      <th style={{ backgroundColor: "#fff6db" }}>
                        Description
                      </th>
                      <th style={{ backgroundColor: "#fff6db" }}>Image</th>
                      <th style={{ backgroundColor: "#fff6db" }}>Quantity</th>
                      <th style={{ backgroundColor: "#fff6db" }}>Unit</th>
                      <th style={{ backgroundColor: "#fff6db" }}>Rate</th>
                      <th style={{ backgroundColor: "#fff6db" }}>GST</th>
                      <th style={{ backgroundColor: "#fff6db" }}>Amount</th>
                    </tr>
                  )}

                  {<div style={{ display: "none" }}>{(orderNo = 0)}</div>}
                  {console.log(
                    "milestoneTobeAddedIndex : ",
                    milestoneTobeAddedIndex
                  )}
                  {console.log(
                    "milestoneTobeAddedIndex[orderNo] : ",
                    milestoneTobeAddedIndex[orderNo]
                  )}
                  {item.discription &&
                    JSON.parse(item.discription).map((item, index) => {
                      console.log("index : ", index);
                      if (index == milestoneTobeAddedIndex[orderNo]) {
                        // write the code here
                        orderNo = orderNo + 1;

                        return (
                          <tr
                            style={{
                              verticalAlign: "top",
                              textAlign: "center",
                            }}
                            key={index}
                          >
                            {"type" in item ||
                            ("workType" in item &&
                              item.workType == "Only Material") ? (
                              <td>{item.type || item.category}</td>
                            ) : (
                              <td>{item.category || item.vendorCategory}</td>
                            )}

                            {"type" in item ? (
                              <td className="desc-highlight-brand-released-orders">
                                {item.specification
                                  ?.replace(/<single-quote>/g, "'")
                                  .replace(/<double-quote>/g, '"')
                                  .split("<new-line>")
                                  .map((text, index) => (
                                    <div key={index}>
                                      {text}
                                      <br />
                                    </div>
                                  ))}
                                {"milestones" in item && (
                                  <>
                                    <br />
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        marginTop: 30,
                                        gap: 10,
                                        padding: 5,
                                        wordWrap: "break-word",
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontWeight: "bold",
                                          display: "flex",
                                          flexDirection: "row",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "60%",
                                            textAlign: "left",
                                          }}
                                        >
                                          Milestones
                                        </div>
                                        <div style={{ width: "15%" }}>%</div>
                                        <div style={{ width: "25%" }}>
                                          {"\u20B9"}
                                        </div>
                                      </div>
                                      {item.milestones.map((mItem, mIndex) => (
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                          }}
                                          key={mIndex}
                                        >
                                          <div
                                            style={{
                                              width: "60%",
                                              textAlign: "left",
                                            }}
                                          >
                                            {mItem.name}
                                          </div>
                                          <div style={{ width: "15%" }}>
                                            {mItem.percentage} %
                                          </div>
                                          <div style={{ width: "25%" }}>
                                            {"\u20B9 "}
                                            {(
                                              (item.quantity * item.rate +
                                                item.quantity *
                                                  item.rate *
                                                  (item.gst / 100)) *
                                              (mItem.percentage / 100)
                                            ).toFixed(2)}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </td>
                            ) : (
                              <td className="desc-highlight-brand-released-orders">
                                {item.description
                                  ?.replace(/<single-quote>/g, "'")
                                  .replace(/<double-quote>/g, '"')
                                  .split("<new-line>")
                                  .map((text, index) => (
                                    <div key={index}>
                                      {text}
                                      <br />
                                    </div>
                                  ))}
                                {"milestones" in item && (
                                  <>
                                    <br />
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        marginTop: 30,
                                        gap: 10,
                                        padding: 5,
                                        wordWrap: "break-word",
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontWeight: "bold",
                                          display: "flex",
                                          flexDirection: "row",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "60%",
                                            textAlign: "left",
                                          }}
                                        >
                                          Milestones
                                        </div>
                                        <div style={{ width: "15%" }}>%</div>
                                        <div style={{ width: "25%" }}>
                                          {"\u20B9"}
                                        </div>
                                      </div>
                                      {item.milestones.map((mItem, mIndex) => (
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                          }}
                                          key={mIndex}
                                        >
                                          <div
                                            style={{
                                              width: "60%",
                                              textAlign: "left",
                                            }}
                                          >
                                            {mItem.name}
                                          </div>
                                          <div style={{ width: "15%" }}>
                                            {mItem.percentage} %
                                          </div>
                                          <div style={{ width: "25%" }}>
                                            {"\u20B9 "}
                                            {(
                                              (item.quantity * item.rate +
                                                item.quantity *
                                                  item.rate *
                                                  (item.gst / 100)) *
                                              (mItem.percentage / 100)
                                            ).toFixed(2)}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </td>
                            )}

                            <td>
                              {imageStates[index] == null ? (
                                <p>-</p>
                              ) : (
                                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                <img
                                  style={{
                                    width: "150px",
                                    height: "150px",
                                    objectFit: "contain",
                                  }}
                                  src={imageStates[index]}
                                  alt="Image Not uploaded"
                                />
                              )}
                            </td>

                            <td>{item.quantity}</td>
                            <td>{item.unit}</td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "center",
                                }}
                              >
                                {"\u20B9 "}
                                {item.rate}
                              </div>
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "center",
                                }}
                              >
                                {item.gst} %
                              </div>
                            </td>
                            <td>
                              {"\u20B9 "}{" "}
                              {(
                                item["quantity"] * item["rate"] +
                                item["quantity"] *
                                  item["rate"] *
                                  (item["gst"] / 100)
                              ).toFixed(2)}
                            </td>
                          </tr>
                        );
                      } else {
                        // write the code here
                        console.log("Life is sad as hell");
                      }
                    })}
                </tbody>
              </table>
            ) : (
              <div className="mobile-items-container">
                {milestoneTobeAddedIndex.length == 0 ? null : (
                  <div className="items-heading">
                    <p>Custom Milestone Items:</p>
                  </div>
                )}
                {<div style={{ display: "none" }}>{(orderNo = 0)}</div>}
                <div>
                  {item.discription &&
                    JSON.parse(item.discription).map((item, index) => {
                      if (index == milestoneTobeAddedIndex[orderNo]) {
                        // write the code here
                        orderNo = orderNo + 1;

                        return (
                          <div key={index}>
                            <div className="mobile-item">
                              <p style={{ fontWeight: "bold" }}>{index + 1}.</p>
                              {"type" in item ||
                              ("workType" in item &&
                                item.workType == "Only Material") ? (
                                <p style={{ fontWeight: "bold" }}>
                                  Category : {item.type || item.category}
                                </p>
                              ) : (
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "12px",
                                  }}
                                >
                                  Category :{" "}
                                  {item.category || item.vendorCategory}
                                </p>
                              )}
                              <div className="mob-item-description">
                                {"type" in item ? (
                                  <div className="desc-highlight-brand-released-orders">
                                    {item.specification
                                      ?.replace(/<single-quote>/g, "'")
                                      .replace(/<double-quote>/g, '"')
                                      .split("<new-line>")
                                      .map((text, index) => (
                                        <div key={index}>
                                          {text}
                                          <br />
                                        </div>
                                      ))}
                                  </div>
                                ) : (
                                  <div className="desc-highlight-brand-released-orders">
                                    {item.description
                                      ?.replace(/<single-quote>/g, "'")
                                      .replace(/<double-quote>/g, '"')
                                      .split("<new-line>")
                                      .map((text, index) => (
                                        <div key={index}>
                                          {text}
                                          <br />
                                        </div>
                                      ))}
                                    {"milestones" in item &&
                                      item.milestones.map((mItem, mIndex) => (
                                        <div
                                          key={mIndex}
                                          style={{ display: "none" }}
                                        >
                                          {
                                            (commonMilestoneAmount =
                                              commonMilestoneAmount +
                                              Number(
                                                (item.quantity * item.rate +
                                                  item.quantity *
                                                    item.rate *
                                                    (item.gst / 100)) *
                                                  (mItem.percentage / 100)
                                              ))
                                          }
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>
                              <div className="mob-item-details">
                                <p>Quantity : {item.quantity}</p>
                                <p>Unit : {item.unit}</p>
                                <p>Rate : {item.rate}</p>
                                <p>GST : {item.gst} %</p>
                                <p>
                                  Amount :{" "}
                                  {(
                                    item["quantity"] * item["rate"] +
                                    item["quantity"] *
                                      item["rate"] *
                                      (item["gst"] / 100)
                                  ).toFixed(2)}
                                </p>
                              </div>
                              <div className="mob-item-image">
                                {imageStates[index] == null ? (
                                  <p
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      fontWeight: "100",
                                    }}
                                  >
                                    No image Uploaded
                                  </p>
                                ) : (
                                  // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                  <img
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      objectFit: "contain",
                                    }}
                                    src={imageStates[index]}
                                    alt="Image Not uploaded"
                                  />
                                )}
                              </div>
                              <div className="common-milestones-container">
                                <div>
                                  <div
                                    className="common-milestones-header"
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      width: "100%",
                                    }}
                                  >
                                    <p
                                      style={{
                                        display: "flex",
                                        width: "40%",
                                        maxWidth: "40%",
                                        minWidth: "40%",
                                        fontWeight: 700,
                                        fontSize: 12,
                                      }}
                                    >
                                      Milestones
                                    </p>
                                    <p
                                      style={{
                                        display: "flex",
                                        width: "10%",
                                        justifyContent: "center",
                                        maxWidth: "auto%",
                                        minWidth: "20%",
                                        fontWeight: 700,
                                        fontSize: 12,
                                      }}
                                    >
                                      Percentage
                                    </p>
                                    <p
                                      style={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end",
                                        // width: "10%",
                                        maxWidth: "auto",
                                        minWidth: "30%",
                                        fontWeight: 700,
                                        fontSize: 12,
                                        textAlign: "center",
                                      }}
                                    >
                                      Amount
                                    </p>
                                  </div>
                                  {/* <hr style={{margin:"10px"}}></hr> */}
                                  <div>
                                    {item.milestones.map((mItem, mIndex) => (
                                      <div
                                        key={mIndex}
                                        style={{
                                          display: "flex",
                                          flexDirection: "row",
                                          width: "100%",
                                          padding: 10,
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "40%",
                                            maxWidth: "40%",
                                            minWidth: "40%",
                                            fontSize: 12,
                                          }}
                                        >
                                          {mItem.name
                                            .toString()
                                            .replace(
                                              /[\\#, +;$~%.'":*?<>{}]/g,
                                              "\n"
                                            )}
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            // width: "10%",
                                            justifyContent: "center",
                                            maxWidth: "auto%",
                                            minWidth: "20%",
                                            fontSize: 12,
                                          }}
                                        >
                                          {mItem.percentage} %
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "flex-end",
                                            // width: "10%",
                                            maxWidth: "auto",
                                            minWidth: "30%",
                                            fontSize: 12,
                                            textAlign: "center",
                                          }}
                                        >
                                          {"\u20B9 "}
                                          {(
                                            commonMilestoneAmount *
                                            (mItem.percentage / 100)
                                          ).toFixed(2)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr style={{ margin: "10px" }}></hr>
                          </div>
                        );
                      } else {
                        // write the code here
                        console.log("Life is sad as hell");
                      }
                    })}
                </div>

                {/* </tbody> */}
                {/* </table>  */}
              </div>
            )}

            <div className="total-details">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  padding: 10,
                  gap: 30,
                  backgroundColor: "#FCFCFC",
                }}
              >
                {item.discount != 0 && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>Basic Value</p>
                      <p>
                        {"\u20B9 "}
                        {item.discription &&
                          JSON.parse(item.discription).reduce(
                            (total, item) =>
                              Number(total) +
                              Number(
                                (
                                  Number(item["quantity"] * item["rate"]) +
                                  Number(
                                    item["quantity"] *
                                      item["rate"] *
                                      (item["gst"] / 100)
                                  )
                                ).toFixed(2)
                              ),
                            0
                          )}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>Discount</p>
                      <p>{item.discount} %</p>
                    </div>
                  </>
                )}
                {/* <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    // minWidth:"30%",
                    width:"20"
                  }}
                >
                  <p style={{fontWeight:"bold",width:"60%"}}>Total Value including Taxes and Duties:</p>
                  <p>
                    {"\u20B9 "}
                    {item.totalAmount}
                  </p>
                </div> */}
                {item.freight && item.freight.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      // minWidth:"30%",
                      width: "20",
                    }}
                  >
                    <p style={{ fontWeight: "bold", width: "60%" }}>
                      Freight Charges
                    </p>
                    <p>
                      {item.freight
                        ?.replace(/<single-quote>/g, "'")
                        .replace(/<double-quote>/g, '"')
                        .split("<new-line>")
                        .map((text, index) => (
                          <div key={index}>
                            {text}
                            <br />
                          </div>
                        ))}
                    </p>
                  </div>
                ) : (
                  ""
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    // minWidth:"30%",
                    width: "20",
                  }}
                >
                  <p style={{ fontWeight: "bold", width: "60%" }}>
                    Total Value including Taxes and Duties:
                  </p>
                  <p>
                    {"\u20B9 "}
                    {item.totalAmount}
                  </p>
                </div>
              </div>
            </div>

            {item.termsAndCondition.length > 0 ? (
              <div className="terms-condition">
                <p style={{ fontWeight: "bold" }}>Terms & Conditions:</p>
                {item.termsAndCondition
                  ?.replace(/<single-quote>/g, "'")
                  .replace(/<double-quote>/g, '"')
                  .split("<new-line>")
                  .map((text, index) => (
                    <p key={index}>
                      {text}
                      <br />
                    </p>
                  ))}
              </div>
            ) : (
              ""
            )}

            {window.innerWidth > 600 ? (
              <table id="table" style={{ textAlign: "center", width: "80%" }}>
                <tbody>
                  <tr>
                    <th>PRICE BASIS</th>
                    <th>FREIGHT</th>
                    <th>INSURANCE</th>
                  </tr>
                  <tr>
                    <td>
                      {item.priceBase
                        ?.replace(/<single-quote>/g, "'")
                        .replace(/<double-quote>/g, '"')
                        .split("<new-line>")
                        .map((text, index) => (
                          <div key={index}>
                            {text}
                            <br />
                          </div>
                        ))}
                    </td>
                    <td>
                      {item.freight
                        ?.replace(/<single-quote>/g, "'")
                        .replace(/<double-quote>/g, '"')
                        .split("<new-line>")
                        .map((text, index) => (
                          <div key={index}>
                            {text}
                            <br />
                          </div>
                        ))}
                    </td>
                    <td>
                      {item.insurance
                        ?.replace(/<single-quote>/g, "'")
                        .replace(/<double-quote>/g, '"')
                        .split("<new-line>")
                        .map((text, index) => (
                          <div key={index}>
                            {text}
                            <br />
                          </div>
                        ))}
                    </td>
                  </tr>
                  <tr>
                    <th>SHIP TO ADDRESS</th>
                    <th>BILL TO ADDRESS</th>
                    <th>PAYMENT TERMS</th>
                  </tr>
                  <tr>
                    <td>
                      {item.shipToAddress
                        ?.replace(/<single-quote>/g, "'")
                        .replace(/<double-quote>/g, '"')
                        .split("<new-line>")
                        .map((text, index) => (
                          <div key={index}>
                            {text}
                            <br />
                          </div>
                        ))}
                    </td>
                    <td>
                      {item.billToAddress
                        ?.replace(/<single-quote>/g, "'")
                        .replace(/<double-quote>/g, '"')
                        .split("<new-line>")
                        .map((text, index) => (
                          <div key={index}>
                            {text}
                            <br />
                          </div>
                        ))}
                    </td>
                    <td>
                      {item.paymentTerms
                        ?.replace(/<single-quote>/g, "'")
                        .replace(/<double-quote>/g, '"')
                        .split("<new-line>")
                        .map((text, index) => (
                          <div key={index}>
                            {text}
                            <br />
                          </div>
                        ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div style={{ width: "100%" }}>
                {item.priceBase.length != 0 &&
                item.freight.length != 0 &&
                item.insurance.length != 0 ? (
                  <div className="terms-condition">
                    {item.priceBase.length > 0 ? (
                      <div>
                        <p style={{ fontWeight: "bold" }}>PRICE BASIS:</p>
                        {item.priceBase
                          ?.replace(/<single-quote>/g, "'")
                          .replace(/<double-quote>/g, '"')
                          .split("<new-line>")
                          .map((text, index) => (
                            <div key={index}>
                              {text}
                              <br />
                            </div>
                          ))}
                      </div>
                    ) : (
                      ""
                    )}
                    {item.freight.length > 0 ? (
                      <div>
                        <p style={{ fontWeight: "bold", marginTop: "5px" }}>
                          FREIGHT:
                        </p>
                        {item.freight
                          ?.replace(/<single-quote>/g, "'")
                          .replace(/<double-quote>/g, '"')
                          .split("<new-line>")
                          .map((text, index) => (
                            <div key={index}>
                              {text}
                              <br />
                            </div>
                          ))}
                      </div>
                    ) : (
                      ""
                    )}

                    {item.insurance.length > 0 ? (
                      <div>
                        <p style={{ fontWeight: "bold", marginTop: "5px" }}>
                          INSURANCE:
                        </p>
                        {item.insurance
                          ?.replace(/<single-quote>/g, "'")
                          .replace(/<double-quote>/g, '"')
                          .split("<new-line>")
                          .map((text, index) => (
                            <div key={index}>
                              {text}
                              <br />
                            </div>
                          ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
                <br></br>
                <div className="terms-condition">
                  <p style={{ fontWeight: "bold" }}>SHIP TO ADDRESS:</p>
                  {item.shipToAddress
                    ?.replace(/<single-quote>/g, "'")
                    .replace(/<double-quote>/g, '"')
                    .split("<new-line>")
                    .map((text, index) => (
                      <div key={index}>{text}</div>
                    ))}
                </div>
                <div className="terms-condition">
                  <p style={{ fontWeight: "bold" }}>BILL TO ADDRESS:</p>
                  {item.billToAddress
                    ?.replace(/<single-quote>/g, "'")
                    .replace(/<double-quote>/g, '"')
                    .split("<new-line>")
                    .map((text, index) => (
                      <div key={index}>
                        {text}
                        <br />
                      </div>
                    ))}
                </div>

                {item.paymentTerms.length > 0 ? (
                  <div className="terms-condition">
                    <p style={{ fontWeight: "bold" }}>PAYMENT TERMS:</p>
                    {item.paymentTerms
                      ?.replace(/<single-quote>/g, "'")
                      .replace(/<double-quote>/g, '"')
                      .split("<new-line>")
                      .map((text, index) => (
                        <div key={index}>
                          {text}
                          <br />
                        </div>
                      ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}

            {item.specialInstructions.length > 0 ? (
              <div className="terms-condition">
                <p style={{ fontWeight: "bold" }}>Special Instructions:</p>
                <p>
                  {item.specialInstructions
                    ?.replace(/<single-quote>/g, "'")
                    .replace(/<double-quote>/g, '"')
                    .split("<new-line>")
                    .map((text, index) => (
                      <div key={index}>
                        {text}
                        <br />
                      </div>
                    ))}
                </p>
              </div>
            ) : (
              ""
            )}
            {item.firmName === "uniworks" && (
              <p //need to make this dynamic
                style={{ display: "flex", flexDirection: "row" }}
                className="terms-condition"
              >
                <span style={{ color: "red" }}>*</span>
                Uniworks has a policy that permits a maximum billing upward
                adjustment/acceptance up to 2.5% of the PO value in cases where
                the on-site area or dimensions differ from those originally
                specified in the purchase order. To ensure accurate billing, any
                modifications or revisions to the area or dimensions must be
                communicated in advance i.e. during work in progress only (till
                50-60% billing/payment). If such changes are not reported
                beforehand, vendors will be held accountable for any financial
                obligations that arise as a consequence.
              </p>
            )}

            {JSON.parse(item.attachments).length > 0 ? (
              <div className="terms-condition">
                <p style={{ fontWeight: "bold" }}>Attachments:</p>
                {item.attachments &&
                  JSON.parse(item.attachments).map((item, index) => (
                    <p key={index} style={{ marginTop: 10 }}>
                      <a href={item.url} target="_blank" key={index}>
                        {item.name}
                      </a>
                      <br />
                    </p>
                  ))}
              </div>
            ) : (
              ""
            )}

            <div className="sign-container">
              <div
                className="vendor-sign"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space",
                  gap: "20",
                  alignItems: "center",
                }}
              >
                {item.vendorSignature ? (
                  <div>
                    <img
                      src={item.vendorSignature && item.vendorSignature}
                      style={{
                        maxWidth: 100,
                        maxHeight: 100,
                        marginBottom: 10,
                      }}
                    />
                    <p style={{ fontSize: "smaller" }}>
                      {
                        // new Date(+(item.VendorAcceptedDate)).toDateString()
                        VendorAcceptedDate(item.VendorAcceptedDate)
                      }
                    </p>
                  </div>
                ) : (
                  !JSON.parse(item.AmendmentDetails)?.isUnreleased && (
                    <div>
                      <button
                        onClick={signBtnUploadHandler}
                        className="vendor-sign-btn sign-accept"
                      >
                        Sign & Accept
                      </button>
                      <Dialog
                        open={isSignModal}
                        onClose={onCloseModalHandler}
                        fullWidth="sm"
                        style={{ borderRadius: "7px" }}
                      >
                        <div className="sign-modal-container">
                          <div className="sign-modal-header">
                            <p style={{ textAlign: "center" }}>Add Signature</p>
                            <MdClear
                              onClick={onCloseModalHandler}
                              width="35px"
                              className="sign-modal-close-btn"
                            />
                          </div>
                          <SignaturePad
                            canvasProps={{ className: "sign-modal-canvaspad" }}
                            ref={(ref) => {
                              setsignPad(ref);
                            }}
                          />
                        </div>
                        <div className="sign-modal-btn-container">
                          <button
                            onClick={onSignSubmitHandler}
                            className="vendor-sign-btn"
                          >
                            Submit
                          </button>
                          <button
                            onClick={onSignClearHandler}
                            className="vendor-sign-btn"
                          >
                            Clear
                          </button>
                        </div>
                      </Dialog>
                    </div>
                  )
                )}
                <p style={{ fontWeight: "bold" }}>Vendor Signatory</p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="authorized-sign"
              >
                <img
                  src={item.firmSignature && JSON.parse(item.firmSignature).url}
                  style={{ maxWidth: 100, maxHeight: 100, marginBottom: 10 }}
                />
                <p style={{ fontWeight: "bold" }}>Authorized Signatory</p>
              </div>
            </div>
            {/* {console.log("approva", item.approvalDetails)} */}
            {/* {!item.approvalDetails &&
            (!item.approvalDetails ||
              JSON.parse(item.approvalDetails) === "Ordered" ||
              JSON.parse(item.approvalDetails).status === "Approved" ||
              JSON.parse(item.approvalDetails).status === "Ordered") ? (
              ""
            ) : (
              <div className="approval_container">
                <button
                  onClick={() => {
                    setdeclineModal(true);
                  }}
                  className="vendor-sign-btn sign-accept"
                >
                  Decline
                </button>
                <button
                  className="vendor-sign-btn sign-accept"
                  onClick={async () => {
                    // approveConfirmation(item.OrderId,item)
                    // approveHandler()
                    const objecttoupdate = await approveHandlerUpdateApproved(
                      item.OrderId,
                      item
                    );
                    // setPoData((prev)=> {
                    //   prev[0].approvalDetails = JSON.stringify(objecttoupdate) // directly manipulating the value
                    //   return prev
                    // })
                    await getPoByOrderId();
                  }}
                >
                  Approve
                </button>
              </div>
            )} */}
            {/* {declineModal && (
              <Dialog
                open={declineModal}
                onClose={() => {
                  setdeclineModal(false);
                }}
                maxWidth="sm"
                fullWidth={true}
              >
                <div>
                  <div className="comment-decline-header">
                    <h3>Comment & Decline</h3>
                  </div>
                  <div className="comment-decline-body">
                    <RemarkTextBox
                      rows="8"
                      cols="80"
                      value={JSON.parse(item.approvalDetails)?.comment}
                      onUpdate={(e) => {
                        console.log("e", e.target.value);
                        let value = e.currentTarget.value;
                        value = value?.replace(/'/g, "<single-quote>");
                        value = value?.replace(/"/g, "<double-quote>");
                        value = value?.replace(/₹/g, "<rupee-symbol>");
                        value = value.replace(/\n/g, "<new-line>");
                        setComment(value);
                      }}
                      style={{ fontSize: "1.2rem", padding: "0.4em" }}
                    />
                  </div>
                  <div className="comment-decline-bottom">
                    <button
                      onClick={async () => {
                        setdeclineModal(false);
                        const objectUpdated = await commentHandler(
                          item.OrderId,
                          item,
                          commenttoUpdate
                        );
                        // getPoByOrderId()
                        console.log("objectUpdated", objectUpdated);
                        setPoData((prev) => {
                          prev[0].approvalDetails =
                            JSON.stringify(objectUpdated); // directly manipulating the value
                          return prev;
                        });
                        toast.success("Message Sent!", {
                          backgroundColor: "rgb(255, 211, 77)",
                          color: "black",
                        });
                      }}
                      className="vendor-sign-btn sign-accept"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </Dialog>
            )} */}
          </div>

          {olderverions &&
            olderverions.map((data, index) => (
              <POItem
                key={index}
                item={{
                  ...data,
                  discription: JSON.stringify(data.discription),
                  attachments: JSON.stringify(data.attachments),
                  firmSignature: JSON.stringify(data.firmSignature),
                  AmendmentDetails: JSON.stringify(data.AmendmentDetails),
                  CommonMilestones:
                    data.CommonMilestones &&
                    JSON.stringify(data.CommonMilestones),
                }}
                isOlderVersion={true}
              />
            ))}
        </>
      )}
    </>
  );
};

export default POItem;



// order qoutation

import { useContext, useEffect, useState, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Button,
  DropDown,
  Input,
  PopOverView,
  TextArea,
} from "../../components";
import {
  FiPaperclip,
  FiTrash2,
  FiChevronLeft,
  FiEdit2,
  FiInfo,
  FiMoreVertical,
  FiMoreHorizontal,
} from "react-icons/fi";
import { CgFileDocument } from "react-icons/cg";
import { AiFillCheckCircle, AiOutlineExclamationCircle } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { HiOutlineCurrencyRupee, HiDotsHorizontal } from "react-icons/hi";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Dialog from "@material-ui/core/Dialog";
import ContentEditable from "react-contenteditable";
import { UserContext } from "../../Context/UserContext";
import AnalyticsService from "../../api/analyticsService";
import ProjectService from "../../api/projectService";
import POService from "../../api/poService";
import SmsService from "../../api/smsService";
import OpportunityService from "../../api/opportunityService";
import QuotationService from "../../api/quotationService";
import NotificationService from "../../api/notificationService";
import DraftService from "../../api/draftService";
import AddVendor from "../AuthPage/signUpVendor";
import AddItemsForm from "./AddItemsForm";
import UnreleasedItemsForm from "./UnreleasedItemsForm";
import Preview from "./Preview";
import toast from "react-hot-toast";
import config from "../../config/config";
import POServicefirebase from "../../api/poToFirebaseService";
import fileDialog from "file-dialog";
import firebase from "../../config/firebase";
import environment from "../../config/config";
import { useAnalyticsContext, TAGS } from "../../Context/Analytics";
import drawerTemplate1 from "../../hoc/drawerTemplate1";
import { getDifference, saveWorkButtonClicked } from "../ProjectPage/helper";
import getVendorPrice from "../../helpers/getVendorPrice";
import getComponentsPrice from "../../helpers/getComponentsPrice";
import SuccessPage from "./SuccessPage";
import { BsArrowLeftShort } from "react-icons/bs";
import AllVendors from "./allVendors";
import "./table1.scss";
import PaymentTerms from "./paymentTerms";
import AddCustomMilestones from "./addCustomMilestones";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { confirmAlert } from "react-confirm-alert";
import { textAlign } from "@mui/system";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ImageMandatoryMaterialCategories = [
  "Acrylic Sheet",
  "Bed",
  "Brass",
  "Carpet",
  "CP fitting",
  "Crockery",
  "Decorative Light",
  "Door bell",
  "Door lock",
  "Exhaust Fan",
  "Fabric",
  "Fan",
  "flush door",
  "glass",
  "Glass shutter",
  "Granite",
  "KitchenAppliances",
  "Kitchen Sink & Accessories",
  "Laminate",
  "Laquered glass",
  "Light",
  "Light fixture",
  "Limestone",
  "Marble",
  "Metal Paint",
  "metal patti",
  "Mirror",
  "Office chair",
  "Paint",
  "Quartz",
  "Sanitary ware",
  "Seating",
  "Side table",
  "Sink",
  "Slate",
  "Spout",
  "SS Jali",
  "SS Patti",
  "Stone",
  "Switches",
  "Terracotta",
  "Tiles",
  "Tv",
  "veneer wood",
  "vinyl flooring",
  "wall paintings",
  "Wall/Ceilling",
  "Wardrobe",
  "WB",
  "WC",
  "Wood Paint",
  "Wooden Door",
  "WPC",
  "HANDLE",
  "CNC",
  "MATTRESS",
  "BED SPREADS",
  "RUGS/CARPETS",
  "CURTAINS",
  "BLINDS",
];

const OrdersQuotations = () => {
  let isMandatoryImages = useRef(false);
  const { record } = useAnalyticsContext();
  const userContext = useContext(UserContext);
  const accountType = userContext.user.accountType;
  const [activeMainTab, setActiveMainTab] = useState(1);
  const [spinner, setSpinner] = useState(false);
  const analyticsService = new AnalyticsService();
  const projectService = new ProjectService();
  const poService = new POService();
  const poservicefirebse = new POServicefirebase();
  const draftService = new DraftService();

  const [displayPurchaseAmount, setDisplayPurchaseAmount] = useState(true);

  const history = useHistory();
  const location = useLocation();
  const data = location.state.data;

  const selectedWorks = location.state.selectedWorks;
  const selectedMaterials = location.state.selectedMaterials;
  const orderOrQuotation = location.state.orderOrQuotation;
  const quotationId = location.state.quotationId;
  const quotationVendorName = location.state.quotationVendorName;
  const quotationVendorMobile = location.state.quotationVendorMobile;
  const draft = location.state.draft;
  const FromReleasedItem = location.state.releasedItem;
  const FromApproval = location.state.ApprovalItem;
  const releasedOrderDataFromReleased =
    location.state.releasedOrderDataFromReleased;
  // let poresponse ;
  console.log(
    "releasedOrderDataFromReleased : ",
    releasedOrderDataFromReleased
  );
  const [poresponsefromAPi, setPoresponse] = useState({});
  const comingFromQuotation = location.state.comingFromQuotation;
  const [revision, setRevision] = useState(data.rooms);
  // const [orderType, setOrderType] = useState('Purchase Order')
  const [orderType, setOrderType] = useState(
    orderOrQuotation === "OrderButton" ? "Purchase Order" : "Work Quotation"
  );
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorMobile, setVendorMobile] = useState("Open Vendor");
  const [vendorFirm, setVendorFirm] = useState("");
  const [vendorGSTIN, setVendorGSTIN] = useState("");
  const [vendorCompanyName, setVendorCompanyName] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [vendorPinCode, setVendorPinCode] = useState("");
  const [vendorCity, setVendorCity] = useState("");
  const [vendorState, setVendorState] = useState("");
  const [vendorDetails, setVendorDetails] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAddItemsFormOpen, setIsAddItemsFormOpen] = useState(false);
  const [isUnreleasedItemsFormOpen, setIsUnreleasedItemsFormOpen] =
    useState(false);
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [termsAndConditions, setTermsAndConditions] = useState(
    sessionStorage.getItem("termsAndConditions") || ""
  );
  const [paymentTerms, setPaymentTerms] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [priceBase, setPriceBase] = useState("");
  const [freight, setFreight] = useState("");
  const [insurance, setInsurance] = useState("");
  const [contactPersonName, setContactPersonName] = useState(
    sessionStorage.getItem("contactPersonName") || ""
  );
  const [contactPersonNumber, setContactPersonNumber] = useState(
    sessionStorage.getItem("contactPersonNumber") || ""
  );

  const [siteEngineerDetails, setSiteEngineerDetails] = useState({
    siteEngineerName: "",
    siteEngineerNumber: "",
    siteEngineerDevice: {},
  });

  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState(
    sessionStorage.getItem("billingAddress") || ""
  );

  const [poSuggestions, setPOSuggestions] = useState([]);
  const [checkedWorks, setCheckedWorks] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [firmName, setFirmName] = useState("");
  const [firmAddress, setFirmAddress] = useState("");
  const [firmPhoneNumber, setFirmPhoneNumber] = useState("");
  const [firmGSTIN, setFirmGSTIN] = useState("");
  const [firmContactPersonName, setFirmContactPersonName] = useState("");
  const [firmContactPersonNumber, setFirmContactPersonNumber] = useState("");
  const [firmContactPersonEmail, setFirmContactPersonEmail] = useState("");
  const [firmSignature, setFirmSignature] = useState("");
  const [isSuccessPageOpen, setIsSuccessPageOpen] = useState(false);
  const [selectedItemsNonEdited, setSelectedItemsNonEdited] = useState([]);
  const [showPaymentTerms, setShowPaymentTerms] = useState(false);
  const [milestoneTobeAddedIndex, setMilestoneTobeAddedIndex] = useState([]);
  const [currentMilestoneTobeEditedIndex, setCurrentMilestoneTobeEditedIndex] =
    useState();
  const [totalPaidAmountReleasedOrder, setTotalPaidAmountReleasedOrder] =
    useState({ isChanged: true, value: 0 });
  // const [clientName, setClientName] = useState('');
  const [isApproval, setIsApproval] = useState(false);
  // const [approvalto, setSendapprovalto] = useState({});

  const [OlderVersionofOrderData, setOlderVersionofOrderData] = useState([]);
  const [deletedItemsToUnfreeze, setDeltedItemsToUnfreeze] = useState([]);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  let contactPersonNameRef = useRef(null);
  let contactPersonNumberRef = useRef(null);
  let siteEngineerNameRef = useRef(null);
  let siteEngineerNumberRef = useRef(null);
  let shippingAddressRef = useRef(null);
  let billingAddressRef = useRef(null);
  // const [projectDetails, setProjectDetails] = useState();

  const imageUploader = useRef(null);

  const transactionDetailsofPaidOrder = useRef([]);

  const [imageULS, setImageULS] = useState({});

  var storageRef = firebase.storage().ref();
  var database = firebase.database();

  var orderIds = [];

  const [imagesFromFirebase, setImagesFromFirebase] = useState({});

  var urlForImage = "";

  const milestonesForCalculation = useRef(new Array()); //storing the static i,e. after calc the initial Values, bcoz if selectedItem,totalAmouunt or freight/discount we loose track of milestones percentages to calc amount of milestone, so we calc amount from these percentages everytime something changes
  // const minGSTForFreight = useRef(null);
  const VendorDetailsSelected = useRef(null);

  const handleFileUpload = async (files) => {
    for (let i = 0; i < files.length; i++) {
      toast.success("Uploading attachment. Please wait.", {
        duration: 4000,
        position: "bottom-center",
        style: {
          borderRadius: "8px",
          padding: "16px",
          color: "#1F9A5E",
          backgroundColor: "#81B29A",
          maxWidth: "100%",
        },
        icon: <AiFillCheckCircle color={"#1F9A5E"} />,
      });
      const response = await firebase
        .storage()
        .ref("/WebUploads/" + new Date().getTime() + files[i].name)
        .put(files[i]);
      response.ref.getDownloadURL().then((url) => {
        let cAttachments = [...attachments];
        cAttachments.push({ name: files[i].name, url: url });
        setAttachments(cAttachments);
      });
    }
  };

  const handleDeleteAttachment = (index) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    setAttachments(updatedAttachments);
  };

  // const deleteAttachment = (index) => {
  //   const updatedAttachments = [...attachments];
  //   updatedAttachments.splice(index, 1);
  //   setAttachments(updatedAttachments);
  // };

  {
    /* <Preview
  attachments={attachments}
  deleteAttachment={deleteAttachment}
></Preview>; */
  }

  const updateFBRDB = (payload) =>
    firebase
      .database()
      .ref("liveBOQ/" + data.ProjectId.toString())
      .set({ ...payload, rooms: JSON.stringify(payload.rooms) });

  const [showAllVendors, setShowAllVendors] = useState(false);
  const [allVendorData, setAllVendorData] = useState([]);

  const defaultMilestonesState = [
    {
      name: "Completion",
      percentage: 100,
      totalAmount: totalAmount,
    },
  ];

  const [defaultMilestones, setDefaultMilestones] = useState(
    defaultMilestonesState
  );

  const [tempStateForTesting, setTempStateForTesting] = useState([]);

  useEffect(() => {
    if (orderOrQuotation === "OrderButton") {
      if (selectedWorks && selectedWorks.length > 0) {
        setOrderType("Work Order");
        setTempStateForTesting(
          selectedWorks.map((item) => ({
            ...item,
            milestones: defaultMilestones,
          }))
        );
      }
      if (selectedMaterials && selectedMaterials.length > 0) {
        setOrderType("Purchase Order");
        setTempStateForTesting(
          selectedMaterials.map((item) => ({
            ...item,
            milestones: defaultMilestones,
          }))
        );
      }
    }

    if (orderOrQuotation === "QuatationButton") {
      // console.log("selectedWorks : ", selectedWorks);
      // console.log("selectedMaterials : ", selectedMaterials);

      if (selectedWorks && selectedWorks.length > 0) {
        setOrderType("Work Quotation");

        // setTempStateForTesting(selectedWorks.map((item) => (
        //     { ...item, 'milestones': defaultMilestones }
        // )))

        setTempStateForTesting(selectedWorks);
      }

      // if (selectedMaterials && selectedMaterials.length > 0 && selectedWorks.length == 0) {
      if (selectedMaterials && selectedMaterials.length > 0) {
        setOrderType("Material Quotation");
        // setTempStateForTesting(selectedMaterials.map((item) => (
        //     { ...item, 'milestones': defaultMilestones }
        // )))
        setTempStateForTesting(selectedMaterials);
      }

      if (comingFromQuotation) {
        // write the code here
        if (
          selectedMaterials[0].workType == "Only Work" ||
          selectedMaterials[0].workType == "Work + Material"
        ) {
          setOrderType("Work Order");
        } else {
          // write the code here
          setOrderType("Purchase Order");
        }
      }
    }
  }, [orderOrQuotation]);

  useEffect(() => {
    // console.log('This is inside useeffect of tempStateForTesting');
    // console.log('orderOrQuotation : ', orderOrQuotation);
    // console.log('tempStateForTesting : ', tempStateForTesting);

    setSelectedItems(tempStateForTesting);

    // console.log("timagaaaaaa", ImagesObjectFetchedFromFirebase);
    let tempImageULS = {};
    for (let index = 0; index < tempStateForTesting.length; index++) {
      // write the code here
      // tempImageULS.push(null);
      // tempImageULS.push(tempStateForTesting[index].OrderId);
      tempImageULS[tempStateForTesting[index].OrderId] = null;
      orderIds.push(tempStateForTesting[index].OrderId);
      // console.log("tmpppp", tempImageULS);
    }
    // console.log("before tempImgesULS", tempImageULS);
    // setImageULS(tempImageULS);
    if ((FromReleasedItem || draft) && imagesFromFirebase) {
      // console.log("imageILC", "fromfirebase", imageULS.length, imageULS);
      // console.log("fromfirebase", imagesFromFirebase);
      // let tempImageULS = { ...imageULS };
      for (var key of Object.keys(tempImageULS)) {
        // console.log("kys", tempImageULS[key], key);
        // console.log("fffffff", imagesFromFirebase[key]);
        tempImageULS[key] = { ...imagesFromFirebase[key] };
      }
      // console.log(" after tempImgesULS", tempImageULS);

      // // tempImageULS[index] = (URL.createObjectURL(e.target.files[0]));
      // tempImageULS[item.OrderId] = e.target.files;
    }
    setImageULS(tempImageULS);
  }, [tempStateForTesting, imagesFromFirebase]);



  useEffect(() => {
    // (isNaN(Number(freight)) ? 0 : Number(freight))
    // if (!isNaN(Number(freight)) && Number(freight) > 0) {
    //   // setFreight(text);
    //   setFreight(
    //     (prev) => `${Number(prev) + Number((prev * minGSTForFreight) / 100)}`
    //   );

    //   // console.log("minGst in items");
    //   // setFreight(
    //   //   (prev) => `${Number(prev) + Number((prev * minGSTinItems) / 100)}`
    //   // );
    // } else {
    //   // let minGSTinItems = 101;
    //   // for (let i = 0; i < selectedItems.length; i++) {
    //   //   if (Number(selectedItems[i].gst) < minGSTinItems) {
    //   //     minGSTinItems = Number(selectedItems[i].gst);
    //   //   }
    //   // }
    // }
    if (orderOrQuotation == "QuatationButton") {
      let tempMilestonesArray = [];
      for (let index = 0; index < selectedItems.length; index++) {
        tempMilestonesArray.push(selectedItems[index].milestones);
      }

      let commonMiestones = findMilestonesFromDraft(tempMilestonesArray);
      let tempIndexes = [];
      let statusMilestone = false;

      if (selectedItems.length > 0) {
        if (selectedItems[0].milestones) {
          statusMilestone = true;
        }
      } else {
      }
      if (statusMilestone) {
        for (let index = 0; index < selectedItems.length; index++) {
          if (
            checkMilestonesToBeEqaul(
              commonMiestones,
              selectedItems[index].milestones
            )
          ) {
          } else {
            tempIndexes.push(index);
          }
        }
        // console.log("herer setting milestones", commonMiestones);
        commonMiestones && setDefaultMilestones(commonMiestones);
        commonMiestones && setMilestoneTobeAddedIndex(tempIndexes);
      } else {
      }

      // getTheImagesForDraftandQuotations();
    } else {
    }
  }, [selectedItems]);

  const findMilestonesFromDraft = (array) => {
    if (array.length == 0) return null;
    var modeMap = {};
    var maxEl = array[0],
      maxCount = 1;
    for (var i = 0; i < array.length; i++) {
      var el = array[i];
      if (modeMap[el] == null) modeMap[el] = 1;
      else modeMap[el]++;
      if (modeMap[el] > maxCount) {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    return maxEl;
  };

  const checkMilestonesToBeEqaul = (obj1, obj2) => {
    // write the code here
    let tempComp = true;
    if (obj1.length == obj2.length) {
      // write the code here
      for (let key = 0; key < obj1.length; key++) {
        // write the code here
        if (
          obj1[key].name == obj2[key].name &&
          obj1[key].percentage == obj2[key].percentage
        ) {
          // write the code here
        } else {
          // write teh code here
          tempComp = false;
        }
      }
    } else {
      // write teh code here
      tempComp = false;
    }
    return tempComp;
  };

  useEffect(() => {
    // console.log(
    //   "vendor assigned draft should change",
    //   vendorMobile
    //   // vendorDetails
    // );

    if (vendorMobile && vendorDetails && !draft) {
      // only for normal orders and other than draft bcoz for this doesnot trigger for draft so, added vendordetails as dependency to tirgger for draft
      // console.log("vendor mobile changed", vendorMobile);
      console.log("vendorDetails : ", vendorDetails);
      vendorDetails.filter((detail) => {
        if (
          detail.Mobile.toString() ==
          vendorMobile.slice(vendorMobile.indexOf(":") + 2)
        ) {
          setVendorFirm(detail.Firm);
          setVendorGSTIN(detail.GSTIN || "");
          setVendorAddress(detail.Address);
          setVendorPinCode(detail.PinCode);
          setVendorCity(detail.City);
          setVendorState(detail.State);
          setVendorCompanyName(detail.Company);
          // console.log("detail", detail, detail.Id);
          VendorDetailsSelected.current = detail.Id;
          // console.log(VendorDetailsSelected.current);
          if (
            !FromReleasedItem &&
            detail.Milestones &&
            JSON.parse(detail.Milestones).length > 0
          ) {
            // console.log("aggagagagag", detail.Milestones);
            setDefaultMilestones(() => {
              let tempMilestoneswithoutAmounts = [
                ...JSON.parse(detail.Milestones),
              ];
              // console.log(tempMilestoneswithoutAmounts, "teeeeee");
              for (let i = 0; i < tempMilestoneswithoutAmounts.length; i++) {
                tempMilestoneswithoutAmounts[i].totalAmount =
                  (totalAmount * tempMilestoneswithoutAmounts[i].percentage) /
                  100;
              }
              return tempMilestoneswithoutAmounts;
            });
          }
        }
      });
    } else if (vendorMobile === "Open Vendor") {
      VendorDetailsSelected.current = null;
    }
    if (vendorMobile && vendorDetails && draft) {
      vendorDetails.filter((detail) => {
        if (
          detail.Mobile.toString() ==
          vendorMobile.slice(vendorMobile.indexOf(":") + 2)
        ) {
          setVendorFirm(detail.Firm);
          setVendorGSTIN(detail.GSTIN || "");
          setVendorAddress(detail.Address);
          setVendorPinCode(detail.PinCode);
          setVendorCity(detail.City);
          setVendorState(detail.State);
          setVendorCompanyName(detail.Company);
          VendorDetailsSelected.current = detail.Id;
        }
      });
    }
  }, [vendorMobile, vendorDetails]);

  useEffect(() => {
    // console.log(`selectedItems to check : `, selectedItems);
    // if (FromReleasedItem || draft) {
    let tempImages = { ...imageULS };
    for (let i = 0; i < deletedItemsToUnfreeze.length; i++) {
      if (tempImages[deletedItemsToUnfreeze[i].OrderId]) {
        delete tempImages[deletedItemsToUnfreeze[i].OrderId];
      }
    }
    setImageULS(tempImages);
    // }
  }, [deletedItemsToUnfreeze]);

  const [bankAccountDetails, setBankAccountDetails] = useState([]);

  const getBankAccountDetails = (Mobile) => {
    console.log("get bank account details is called...");
    console.log("Mobile : ", Mobile);
    const Token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MiwiTmFtZSI6IlNoaXZhIiwiTW9iaWxlIjo4MDE5NzMxNzkwLCJTdGF0ZSI6IlRTIiwiQ2l0eSI6Ikh5ZGVyYWJhZCIsIkFyZWEiOiJIaXRlY2ggY2l0eSIsIlN0cmVldCI6IktQSEIgcGhhc2UgNyIsIkJ1bGRpbmciOiJJbmR1IEZvcnR1bmUiLCJGbGF0Tm8iOiIxMDIiLCJpYXQiOjE2MDk3Mzc0NjJ9.1B0hEQ9dTmwBLv5c0pFqnH9ES4sHr4IYFcIsLzFe9FQ";
    fetch(`${config.profileService}bankAccount/${Mobile}`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: "Bearer " + Token,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log("Response from getBankAccountDetails API: ", json);
        if (json.payload.length != 0) {
          setBankAccountDetails(JSON.stringify(json.payload[0]));
        }
      })
      .catch((e) => {
        console.log("getBankAccountDetails error: ", e.toString());
      });
  };

  useEffect(() => {
    if (vendorMobile != "Open Vendor") {
      getBankAccountDetails(vendorMobile);
    }
  }, [vendorMobile]);

  // useEffect(() => { console.log(`vendorMobile`, vendorMobile) }, [vendorMobile])

  useEffect(() => {
    if (data) {
      setRevision(data.rooms);
    }
  }, [data]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      getVendors();
    }, 300);

    // console.log('active Category',activeCategory)
    if (ImageMandatoryMaterialCategories.includes(activeCategory[0])) {
      // console.log(
      //   "this category images are isMandatoryImages mandatory",
      //   activeCategory[0]
      // );
      isMandatoryImages.current = true;
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [activeCategory]);

  const getVendors = () => {
    // write the code here
    analyticsService
      .getFirmBasedAnalytics(localStorage.getItem("firm"))
      .then((res) => {
        // console.log(`Response from analyticsService API: `, res);
        if (res.status === 200) {
          // res.Vendor has all the vendors
          // console.log('res.Vendor : ', res.Vendor);
          setVendorDetails(res.Vendor);
          prepareTheListOfAllVendors(res.Vendor);
          // let vendorsList = res.Vendor.filter((item) => item.Category.includes(activeCategory)).map((item) => (item.Name + ' : ' + item.Mobile)).sort((a, b) => a.localeCompare(b))
          let vendorsList = res.Vendor.filter((item) =>
            activeCategory.includes(
              item.Category.replace('("', "")
                .replace(/"/g, "")
                .replace(', "', ", ")
                .replace(")", "")
            )
          )
            .map((item) => item.Name + " : " + item.Mobile)
            .sort((a, b) => a.localeCompare(b));
          // console.log("vendorsList", vendorsList);
          vendorsList.unshift("Open Vendor");
          vendorsList.unshift("Show All Vendors");
          setVendors(vendorsList);
        }
      })
      .catch((e) => {
        console.log(`Catch from analyticsService API: `, e.toString());
      });
  };

  useEffect(async () => {
    const response = await projectService.getSuggestiveTextPO();
    if (response.status == 200) {
      setPOSuggestions(
        response.payload.filter(
          (item) =>
            item.firm == userContext.user.Firm ||
            item.firm == "Staart Buildtech" ||
            item.firm == null
        )
      );
    } else {
      toast.error("Error getting suggestions!", {
        duration: 4000,
        position: "bottom-center",
        style: {
          borderRadius: "8px",
          padding: "16px",
          color: "#E72424",
          backgroundColor: "#FEF0F0",
          maxWidth: "100%",
        },
        icon: <FiInfo color={"#E72424"} />,
      });
    }
  }, [data]);

  const [project, setProject] = useState({});
  const { pathname } = useLocation();

  useEffect(() => {
    let projectId = pathname.split("/")[2];
    firebase
      .database()
      .ref("liveBOQ/" + projectId.toString())
      .on("value", (snapshot) => {
        console.log("Firebase SS", snapshot.val());
        if (snapshot.exists()) {
          const response = {
            ...snapshot.val(),
            rooms: JSON.parse(snapshot.val().rooms),
            Rooms: JSON.parse(snapshot.val().rooms),
          };
          setProject(response);
        }
      });
    if (FromReleasedItem || draft) {
      getURLsOfImageForPO();
    }
  }, []);

  useEffect(() => {
    // project.ClientName && console.log('Project from useEffect : ', project.ClientName);
    // console.log('Project from useeffect : ', project[0].ClientName);
    // project.ClientName && setClientName(project.ClientName);
    if (project) {
      fetch(`${config.authService}SiteEngineerAnalytics`, {
        method: "GET",
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          console.log("Response from fetchSiteEngineers API: ", json);
          // console.log('project', project)
          let seData = json.payload.find((item) =>
            "siteEngineersId" in project
              ? item.Id == project.siteEngineersId
              : item.Id == project.SiteEngineersId ||
                item.Id == project.siteEngineerId
          );
          // setSiteEngineerName(seData?.Name);
          // setSiteEngineerNumber(seData?.Mobile);
          setSiteEngineerDetails({
            siteEngineerName: seData?.Name,
            siteEngineerNumber: seData?.Mobile,
            siteEngineerDevice: seData.deviceDetails
              ? JSON.parse(seData.deviceDetails)
              : {},
          });
          setShippingAddress(project.address || project.Address || "");
        })
        .catch((e) => {
          console.log("Catch from fetchSiteEngineers API: ", e.toString());
        });
    }
  }, [project]);

  useEffect(
    () =>
      setTotalAmount(
        (
          selectedItems.reduce(
            (total, item) =>
              Number(total) +
              Number(
                (
                  Number(item["quantity"] * item["rate"]) +
                  Number(item["quantity"] * item["rate"] * (item["gst"] / 100))
                ).toFixed(2)
              ),
            0
          ) -
          (selectedItems.reduce(
            (total, item) =>
              Number(total) +
              Number(
                (
                  Number(item["quantity"] * item["rate"]) +
                  Number(item["quantity"] * item["rate"] * (item["gst"] / 100))
                ).toFixed(2)
              ),
            0
          ) *
            Number(discount)) /
            100 +
          (isNaN(Number(freight)) ? 0 : Number(freight))
        ).toFixed(2)
      ),
    [selectedItems, discount, freight]
  );

  useEffect(() => {
    if (defaultMilestones[0].name === "Paid") {
    } else {
      // console.log("Into the totalAmount useeFFect", Number(totalAmount)); //for normal Orders only

      let tempDefaultMilestones = [...defaultMilestones];
      for (let index = 0; index < tempDefaultMilestones.length; index++) {
        tempDefaultMilestones[index].totalAmount = (
          (tempDefaultMilestones[index].percentage * totalAmount) /
          100
        ).toFixed(2);
      }

      // // else if(releasedOrderDataFromReleased){
      //     let tempMilestonesArray = [];
      //     for (let index = 0; index < selectedItems.length; index++) {
      //       // console.log('selectedItems[index] : ', selectedItems[index].milestones);
      //       tempMilestonesArray.push(selectedItems[index].milestones);
      //     }

      //     let commonMiestones = findMilestonesFromDraft(tempMilestonesArray);
      //     let tempIndexes = [];
      //     let statusMilestone = false;

      //     if (selectedItems.length > 0 && totalAmount > 0) {
      //       // write the code here
      //       if (selectedItems[0].milestones) {
      //         // write the code here
      //         statusMilestone = true;
      //       }
      //     } else {
      //     }
      //     if (statusMilestone) {
      //       // write the code here
      //       for (let index = 0; index < selectedItems.length; index++) {
      //         if (checkMilestonesToBeEqaul(commonMiestones, selectedItems[index].milestones)) {
      //         } else {
      //           tempIndexes.push(index);
      //         }
      //       }
      //       // console.log('herer setting milestones',commonMiestones)
      //       let tempMilestones = [...defaultMilestones]
      //       tempMilestones.unshift({name:"Paid",percentage:Number(((10000/(totalAmount))*100)).toFixed(0), totalAmount: 10000 })
      //       console.log('tempMilestones to set as new ',tempMilestones)
      //       // setDefaultMilestones(tempMilestones)

      //     } else {
      //     }

      // setDefaultMilestones((prev) => {
      //       let temp = [...prev];
      //       return [{name:"Paid",percentage:((10000/(totalAmount))*100).toFixed(0), totalAmount: 10000 }, ...temp]
      //     })

      // }
      // defaultMilestones = tempDefaultMilestones;

      setDefaultMilestones(tempDefaultMilestones);
    }
  }, [totalAmount]);

  useEffect(() => {
 if (
    releasedOrderDataFromReleased &&
    selectedItems.length > 0 &&
    totalPaidAmountReleasedOrder.value > 0
  ) {
   let tempOrderMilestones = [...selectedItems];
   
    let tempTotalCalAmount = (
      selectedItems.reduce(
        (total, item) =>
          Number(total) +
          Number(
            (
              Number(item["quantity"] * item["rate"]) +
              Number(item["quantity"] * item["rate"] * (item["gst"] / 100))
            ).toFixed(2)
          ),
        0
      ) -
      (selectedItems.reduce(
        (total, item) =>
          Number(total) +
          Number(
            (
              Number(item["quantity"] * item["rate"]) +
              Number(item["quantity"] * item["rate"] * (item["gst"] / 100))
            ).toFixed(2)
          ),
        0
      ) *
        Number(discount)) /
        100 +
      (isNaN(Number(freight)) ? 0 : Number(freight))
    ).toFixed(2);

    let tempMilestones = JSON.parse(JSON.stringify(defaultMilestones));
    let tempPayments = [];

    tempMilestones.map((mItem) => {
      if (mItem?.payments) {
        tempPayments.push(...mItem.payments);
        delete mItem.payments;
      }
    });

    transactionDetailsofPaidOrder.current = [...tempPayments];
    
    if (defaultMilestones[0].name === "Paid") {
      let tempdiffAmount = Number(totalPaidAmountReleasedOrder.value);

      tempMilestones.splice(0, 1);
      let temp = [
        {
          name: "Paid",
          totalAmount: tempdiffAmount,
          percentage: Math.ceil(
            (totalPaidAmountReleasedOrder.value / tempTotalCalAmount) * 100
          ),
          payments: [...transactionDetailsofPaidOrder.current],
        },
      ];

    
      const originalPercentages = defaultMilestones.map((item) => item.percentage);

      tempMilestones.forEach((mItem, mIndex) => {
        temp.push({
          name: mItem.name,
          percentage: originalPercentages[mIndex],
          totalAmount: (
            (originalPercentages[mIndex] / 100) * (tempTotalCalAmount - tempdiffAmount)
          ).toFixed(2),
        });
      });

      let diffvalue = temp.reduce(
        (percent, mitem) => {
          percent.percentage += +mitem.percentage;
          percent.amount += Number(mitem.totalAmount);
          return { ...percent, percentage: Number(percent.percentage) };
        },
        { percentage: 0, amount: 0 }
      );

      if (
        diffvalue.amount < Number(tempTotalCalAmount) ||
        diffvalue.percentage < 100
      ) {
        temp[temp.length - 1].percentage =
          Number(temp[temp.length - 1].percentage) +
          (100 - diffvalue.percentage);
        temp[temp.length - 1].totalAmount =
          Number(temp[temp.length - 1].totalAmount) +
          (tempTotalCalAmount - diffvalue.amount);
      }

      setDefaultMilestones([...temp]);
      }
    } else if (
      releasedOrderDataFromReleased &&
      selectedItems.length > 0 &&
      totalPaidAmountReleasedOrder.value <= 0
    ) {
      let tempDefaultMilestones = [
        ...JSON.parse(releasedOrderDataFromReleased.CommonMilestones),
      ];

      for (let index = 0; index < tempDefaultMilestones.length; index++) {
        tempDefaultMilestones[index].totalAmount = (
          (tempDefaultMilestones[index].percentage * totalAmount) /
          100
        ).toFixed(2);
      }
      setDefaultMilestones(tempDefaultMilestones);
      milestonesForCalculation.current = [...tempDefaultMilestones];
    }
  }, [
    selectedItems,
    totalPaidAmountReleasedOrder.isChanged,
    freight,
    discount,
  ]);

  useEffect(() => {
    let tempActiveCategory = [];
    if (
      selectedItems != undefined &&
      selectedItems != [] &&
      selectedItems[0] != undefined
    ) {
      selectedItems.forEach((item) => {
        if ("type" in item) {
          tempActiveCategory.push(
            item.type
              .replace('("', "")
              .replace(/"/g, "")
              .replace(', "', ", ")
              .replace(")", "")
          );
        } else {
          tempActiveCategory.push(item.vendorCategory);
        }
      });
    }
    setActiveCategory([...new Set(tempActiveCategory)]);
  }, [selectedItems]);

  useEffect(() => {
    if (draft) {
      setContactPersonNumber(draft?.contactPersonNumber);
    } else if (
      poSuggestions.filter(
        (item) => item.ContactPersonName.localeCompare(contactPersonName) == 0
      )
    ) {
      setContactPersonNumber(
        poSuggestions.filter(
          (item) => item.ContactPersonName.localeCompare(contactPersonName) == 0
        )[0]?.ContactPersonNumber
      );
    }
  }, [contactPersonName, poSuggestions]);

  useEffect(() => {
    sessionStorage.setItem("contactPersonName", contactPersonName);
    sessionStorage.setItem("contactPersonNumber", contactPersonNumber);
    sessionStorage.setItem("termsAndConditions", termsAndConditions);
    sessionStorage.setItem("billingAddress", billingAddress);
  }, [
    contactPersonName,
    contactPersonNumber,
    termsAndConditions,
    billingAddress,
  ]);



  const calculateDiscountedAmount = (lineItem) => {
    let discountedRate = (
      lineItem.rate -
      (lineItem.rate * discount) / 100
    ).toFixed(2);
    return discountedRate;
  };

  const getProfitability = (component) => {
    const differ = getDifference(
      Number(component["quantity"] || 0) * Number(component["rate"] || 0),
      component.Work.reduce(
        (total, item) =>
          Number(total) +
          (Number(
            (item?.discountedRate && item.discountedRate !== "null"
              ? item.discountedRate
              : item.rate == "quotation"
              ? 0
              : item.rate) || 0
          ) *
            Number(item.quantity || 0) +
            Number(
              (item?.discountedRate && item?.discountedRate !== "null"
                ? item.discountedRate
                : item.rate == "quotation"
                ? 0
                : item.rate) || 0
            ) *
              Number(item.quantity || 0) *
              (Number(item.gst || 0) / 100)),
        0
      ) +
        component.Material.reduce(
          (total, item) =>
            Number(total) +
            (Number(
              (item?.discountedRate && item?.discountedRate !== "null"
                ? item.discountedRate
                : item.rate == "quotation"
                ? 0
                : item.rate) || 0
            ) *
              Number(item.quantity || 0) +
              Number(
                (item?.discountedRate && item.discountedRate !== "null"
                  ? item.discountedRate
                  : item.rate == "quotation"
                  ? 0
                  : item.rate) || 0
              ) *
                Number(item.quantity || 0) *
                (Number(item.gst || 0) / 100)),
          0
        )
    );
    return differ;
  };

  const editingTheBOQPage = () => {
    // console.log("in the edit pages");
    const workAndMaterials = selectedItems;
    let tempWorks = [];
    let tempMaterials = [];
    let newRivision = [...revision];

    // workAndMaterials.forEach((item, index) => {
    for (const [index, item] of workAndMaterials.entries()) {
      // if (addedItems.length > 0 && item["Unit Name"] == "Extra items") {
      // // if (addedItems.length > 0 && item["Unit Name"] == "Extra items") {
      //   console.log("IN THE THING CHECKING", item);
      //   // if (item["Unit Name"] == "Extra items") {
      //   if (item.workType == "Only Material") {
      //     const materialObject = {
      //       ...item,
      //       status: isApproval ? "inApproval" : "ordered",
      //       discountedRate:
      //         discount > 0 ? calculateDiscountedAmount(item) : "null",
      //     };
      //     tempMaterials.push(materialObject);
      //   } else {
      //     const workObject = {
      //       ...item,
      //       status: isApproval ? "inApproval" : "ordered",
      //       discountedRate:
      //         discount > 0 ? calculateDiscountedAmount(item) : "null",
      //     };
      //     tempWorks.push(workObject);
      //   }
      // } else {
      // console.log("CHECKING THE ELSE COND", item);
      // console.log("work&Material", workAndMaterials);
      let cWork = workAndMaterials[index];
      let cRoom =
        item["Unit Name"] == "Extra items"
          ? newRivision[newRivision.length - 1]["Room Name"] ===
            "Non tender items"
            ? newRivision[newRivision.length - 1]
            : undefined //
          : newRivision[cWork.indexces.roomIndex];
      if (!cRoom) {
        // this case is for the new Extra items , if added for the first time in the project. refer backtrackBOQ()
        continue;
      }

      let Units = cRoom.Units;
      let cUnit = Units[cWork.indexces.unitIndex];
      let Components = cUnit.Components;
      let cComponent = Components[cWork.indexces.componentIndex];
      // console.log("cComponent", cComponent, cWork);
      if (!cComponent) {
        // console.log("NO COMPOENTS IT IS A EXTRA ITEM CONTINUE");
        // it is an new extra item
        // added items are taken care in backtrackBOQ();
        // unreleased extra items are changed here
        continue;
      }
      if ("vendorCategory" in workAndMaterials[index]) {
        let Work = [...cComponent.Work];
        Work.splice(cWork.indexces.workIndex, 1, {
          ...cWork,

          status: isApproval ? "inApproval" : "ordered",

          discountedRate:
            discount > 0 ? calculateDiscountedAmount(cWork) : "null",
        });
        cComponent = { ...cComponent, Work };
        const profitablilityOfComponent = getProfitability(cComponent);
        // console.log("profitablilityOfComponent", profitablilityOfComponent);
        tempWorks.push({
          ...workAndMaterials[index],
          profitablilityOfComponent,
        });
      } else {
        let Material = [...cComponent.Material];
        Material.splice(cWork.indexces.materialIndex, 1, {
          ...cWork,
          status: isApproval ? "inApproval" : "ordered",
          discountedRate:
            discount > 0 ? calculateDiscountedAmount(cWork) : "null",
        });
        cComponent = { ...cComponent, Material };
        const profitablilityOfComponent = getProfitability(cComponent);
        // console.log("profitablilityOfComponent", profitablilityOfComponent);
        tempMaterials.push({
          ...workAndMaterials[index],
          profitablilityOfComponent,
        });
      }
      Components.splice(cWork.indexces.componentIndex, 1, cComponent);
      cUnit = { ...cUnit, Components };
      Units.splice(cWork.indexces.unitIndex, 1, cUnit);
      cRoom = { ...cRoom, Units };
      newRivision.splice(cWork.indexces.roomIndex, 1, cRoom);
      setRevision(newRivision);
      // }
      // });
    }

    addedItems.length > 0 &&
      addedItems.forEach((item, index) => {
        if (item.workType == "Only Material") {
          const materialObject = {
            ...item,
            // status: isApproval ? "inApproval" : "ordered",
            // discountedRate:
            //   discount > 0 ? calculateDiscountedAmount(item) : "null",
          };
          tempMaterials.push(materialObject);
        } else {
          const workObject = {
            ...item,
            // status: isApproval ? "inApproval" : "ordered",
            // discountedRate:
            //   discount > 0 ? calculateDiscountedAmount(item) : "null",
          };
          tempWorks.push(workObject);
        }
      });
    // console.log("tempWOrks ", tempWorks, "tempMaterials", tempMaterials);
    return [tempWorks, tempMaterials];
  };

  const makeOpportunity = async () => {
    // console.log("in the make oppurtunity", data);
    if (
      selectedItems.length > 0 &&
      contactPersonName &&
      contactPersonNumber &&
      siteEngineerDetails.siteEngineerName &&
      siteEngineerDetails.siteEngineerNumber &&
      shippingAddress &&
      billingAddress
    ) {
      // console.log(`selectedItems in makeOpportunity`, selectedItems);

      // const workAndMaterials = selectedItems;
      // let tempWorks = [];
      // let tempMaterials = [];
      // let newRivision = [...revision];

      // workAndMaterials.forEach((item, index) => {
      //   if (addedItems.length > 0 && item["Unit Name"] == "Extra items"){
      //     // if (item["Unit Name"] == "Extra items") {
      //     if (item.workType == "Only Material") {
      //       const materialObject = { ...item  };
      //       tempMaterials.push(materialObject);
      //     } else {
      //       const workObject = { ...item };
      //       tempWorks.push(workObject);
      //     }}
      //   else {
      //     console.log('work&Material',workAndMaterials)
      //     let cWork = workAndMaterials[index];
      //     let cRoom = newRivision[cWork.indexces.roomIndex];
      //     let Units = cRoom.Units;
      //     let cUnit = Units[cWork.indexces.unitIndex];
      //     let Components = cUnit.Components;
      //     let cComponent = Components[cWork.indexces.componentIndex];
      //     console.log('cComponent',cComponent)
      //     if ("vendorCategory" in workAndMaterials[index]) {
      //       let Work = [...cComponent.Work];
      //       Work.splice(cWork.indexces.workIndex, 1, { ...cWork, status: isApproval ? "inApproval" : "ordered" });
      //       cComponent = { ...cComponent, Work };
      //       tempWorks.push(workAndMaterials[index]);
      //     } else {
      //       let Material = [...cComponent.Material];
      //       Material.splice(cWork.indexces.materialIndex, 1, { ...cWork, status: isApproval ? "inApproval" : "ordered" });
      //       cComponent = { ...cComponent, Material };
      //       tempMaterials.push(workAndMaterials[index]);
      //     }
      //     Components.splice(cWork.indexces.componentIndex, 1, cComponent);
      //     cUnit = { ...cUnit, Components };
      //     Units.splice(cWork.indexces.unitIndex, 1, cUnit);
      //     cRoom = { ...cRoom, Units };
      //     newRivision.splice(cWork.indexces.roomIndex, 1, cRoom);
      //     setRevision(newRivision);
      //   }
      // });

      const [tempWorks, tempMaterials] = editingTheBOQPage();
      // console.log(`tempMaterials`, tempMaterials)
      // console.log(`tempWorks`, tempWorks)
      // throw new Error("stopping");

      const opportunityService = new OpportunityService();
      const notificationService = new NotificationService();

      let errorFound = "";
      // console.log("aisApproval ", isApproval);
      let UniqueIdtoOrderandPO;
      if (tempWorks.length > 0) {
        UniqueIdtoOrderandPO = new Date().getTime();
        const response = await opportunityService.add(
          tempWorks,
          // data.ClientName,
          project.clientName ? project.clientName : project.ClientName,
          data.Address,
          data.AmountRecieved,
          data.ProjectId,
          startDate,
          endDate,
          "work",
          vendorMobile == null ||
            vendorMobile == "null" ||
            vendorMobile == "Open Vendor"
            ? "Open Vendor"
            : vendorMobile.split(":")[1].trim(),
          activeCategory,
          isApproval,
          { raised: userContext.user.email, sendTo: "" }, //details for history
          userContext.user.Firm,
          Number(totalAmount),
          defaultMilestones,
          vendorCompanyName,
          UniqueIdtoOrderandPO // orderId to match Order and PO OrderId
          // orderType,
          // contactPersonName,
          // contactPersonNumber,
          // siteEngineerName,
          // siteEngineerNumber,
          // discount,
          // // startDate,
          // // endDate,
          // // vendorMobile,
          // vendorFirm,
          // vendorGSTIN,
          // vendorAddress,
          // vendorPinCode,
          // vendorCity,
          // vendorState,
          // termsAndConditions,
          // paymentTerms,
          // specialInstructions,
          // priceBase,
          // freight,
          // insurance,
          // shippingAddress,
          // billingAddress,
          // attachments
        );
        console.log(`Response from opportunityService.add API: `, response);
        if (response.status !== 200) {
          errorFound = "Error while making opportunity!";
        }
      }

      if (tempMaterials.length > 0) {
        UniqueIdtoOrderandPO = new Date().getTime();
        const response = await opportunityService.add(
          tempMaterials,
          // data.ClientName,
          project.clientName ? project.clientName : project.ClientName,
          data.Address,
          data.AmountRecieved,
          data.ProjectId,
          startDate,
          endDate,
          "material",
          vendorMobile == null ||
            vendorMobile == "null" ||
            vendorMobile == "Open Vendor"
            ? "Open Vendor"
            : vendorMobile.split(":")[1].trim(),
          activeCategory,
          isApproval,
          { raised: userContext.user.email, sendTo: "" },
          userContext.user.Firm,
          Number(totalAmount),
          defaultMilestones,
          vendorCompanyName,
          UniqueIdtoOrderandPO 
        );
        console.log(`Response from opportunityService.add API: `, response);
        if (response.status !== 200) {
          errorFound = "Error while making opportunity!";
        }
      }

      if (tempWorks.length > 0 || tempMaterials.length > 0) {
        if (errorFound.length > 0) {
          toast.error(errorFound, {
            duration: 4000,
            position: "bottom-center",
            style: {
              borderRadius: "8px",
              padding: "16px",
              color: "#E72424",
              backgroundColor: "#FEF0F0 ",
              maxWidth: "100%",
            },
            icon: <FiInfo color={"#E72424"} />,
          });
        } else {
          // toast.success(`Opportunity for ${activeCategory} category with ${selectedItems.length} items released.`, {
          //     duration: 4000,
          //     position: 'bottom-center',
          //     style: { borderRadius: '8px', padding: '16px', color: '#1F9A5E', backgroundColor: '#F2FFF9', maxWidth: '100%', },
          //     icon: <AiFillCheckCircle color={'#1F9A5E'} />,
          // })

          setIsSuccessPageOpen(true);
          setIsUpdatingProgress(false);

          if (quotationId) {
            deleteQuotation();
          }

          if (draftId && !FromReleasedItem) {
            deleteDraft();
          }

          let categoryType;
          if (tempWorks.length > 0) {
            categoryType = "workCategory";
          } else {
            categoryType = "materialCategory";
          }
          notificationService.sendNotificationsOnCategory(
            activeCategory,
            categoryType
          );

          await releasePO(UniqueIdtoOrderandPO, tempWorks, tempMaterials);

          notificationService.notifySEOnOrderRelease(
            project, // required to navigate to project in SE
            siteEngineerDetails,
            activeCategory,
            orderType
          );
          saveWorkButtonClicked(
            { ...data, rooms: revision },
            undefined,
            updateFBRDB
          );
          updatePOImagesFirebase();

          // record(TAGS["@release_order_button_click_success", { description: "Release order button click success" }])
          record("@release_order_button_click_success", {
            description: "Release order button click success",
          });
        }
      }
    } else {
      if (!contactPersonName) {
        contactPersonNameRef.current.focus();
      } else if (!contactPersonNumber) {
        contactPersonNumberRef.current.focus();
      } else if (!siteEngineerDetails.siteEngineerName) {
        siteEngineerNameRef.current.focus();
      } else if (!siteEngineerDetails.siteEngineerNumber) {
        siteEngineerNumberRef.current.focus();
      } else if (!shippingAddress) {
        shippingAddressRef.current.focus();
      } else if (!billingAddress) {
        billingAddressRef.current.focus();
      }
      setIsUpdatingProgress(false);

      toast.error("Mandatory fields incomplete!", {
        duration: 4000,
        position: "bottom-center",
        style: {
          borderRadius: "8px",
          padding: "16px",
          color: "#E72424",
          backgroundColor: "#FEF0F0",
          maxWidth: "100%",
        },
        icon: <FiInfo color={"#E72424"} />,
      });

      // record(TAGS["@release_order_button_click_error", { description: "Release order button click error" }])
      record("@release_order_button_click_error", {
        description: "Release order button click error",
      });
    }
  };

  const sendSignatureMessage = async (to) => {
    try {
      const response = await (
        await fetch(`${config.whatsAppService.URL}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.whatsAppService.AuthKey}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: to,
            type: "template",
            template: {
              name: "vendor_sign_po",
              language: {
                code: "en",
              },
            },
          }),
        })
      ).json();
      // console.log("Response form sendWhatsapp API: ", response);
      return response;
    } catch (e) {
      console.log(e);
      return { status: 400, statusMsg: e };
    }
  };

  const releasePO = async (orderId, tempWorks, tempMaterials) => {
    console.log("po released");
    const response = await poService.releasePO(
      new Date().getTime(), // Id
      data.ProjectId, // projectId
      new Date(), //poDate
      contactPersonName,
      contactPersonNumber,
      siteEngineerDetails.siteEngineerName,
      siteEngineerDetails.siteEngineerNumber,
      tempWorks.length > 0 ? tempWorks : tempMaterials, //selected Items
      defaultMilestones,
      termsAndConditions,
      shippingAddress,
      billingAddress,
      specialInstructions,
      discount,
      totalAmount,
      orderId, //this will be received from the make oppurtunity to match the id's
      startDate,
      endDate,
      firmGSTIN,
      sessionStorage.getItem("firmLogoURL"), //firmLogoURL
      firmSignature,
      firmName,
      firmAddress,
      firmPhoneNumber,
      firmContactPersonName,
      firmContactPersonNumber,
      firmContactPersonEmail,
      vendorMobile,
      vendorCompanyName, // vendorFirm
      vendorAddress,
      vendorPinCode,
      vendorCity,
      vendorState,
      vendorGSTIN,
      priceBase,
      freight,
      insurance,
      paymentTerms,
      orderType,
      attachments,
      bankAccountDetails
    );

    console.log(`Response from generatePO API: `, response);
    if (response.status === 200) {
      const smsService = new SmsService();
      if (
        vendorMobile != null &&
        vendorMobile != "null" &&
        vendorMobile != "Open Vendor" &&
        !isApproval
      ) {
        // immediatly  send what'sapp msg if not for approval
        // await smsService.sendSms(
        //   `${
        //     userContext.user.Firm
        //   } has sent you a ${orderType} for ${activeCategory}. Download the ${orderType} from this link : ${
        //     environment.environment == "staging" ? `https://startstaging.web.app/PO/` : `https://staart.build/PO/`
        //   }${orderId}`,
        //   `+91${vendorMobile.split(":")[1].trim()}`
        // );

        await smsService.sendWhatsapp({
          to: `91${vendorMobile.split(":")[1].trim()}`,
          firm: userContext.user.Firm,
          orderType: orderType,
          category: activeCategory,
          link:
            environment.environment == "staging"
              ? `https://661a58e4528b3d77527dac4e--sparkly-hotteok-089b7a.netlify.app/?po_id=${orderId}`
              : `https://staartbuild.netlify.app/?po_id=${orderId}`,
        });

        await sendSignatureMessage(`91${vendorMobile.split(":")[1].trim()}`);
      }
      await poservicefirebse.sendPOtoFirebase(
        data.ProjectId,
        orderId,
        selectedItems
      );
    } else {
      toast.error(`Error releasing ${orderType}!`, {
        duration: 4000,
        position: "bottom-center",
        style: {
          borderRadius: "8px",
          padding: "16px",
          color: "#E72424",
          backgroundColor: "#FEF0F0",
          maxWidth: "100%",
        },
        icon: <FiInfo color={"#E72424"} />,
      });
    }
    // console.log("acalling backtrackBOQ");
    backtrackBOQ();
  };

  const makeQuotation = async () => {
    if (selectedItems.length > 0) {
      // console.log(`selectedItems in makeQuotation`, selectedItems);

      const workAndMaterials = selectedItems;
      let tempWorks = [];
      let tempMaterials = [];
      let newRivision = [...revision];

      workAndMaterials.forEach((item, index) => {
        // if (item["Unit Name"] == "Extra items") {
        if (addedItems.length > 0 && item["Unit Name"] == "Extra items") {
          // if (item["Unit Name"] == "Extra items") {
          if (item.workType == "Only Material") {
            const materialObject = { ...item, rate: "quotation" };
            tempMaterials.push(materialObject);
          } else {
            const workObject = { ...item, rate: "quotation" };
            tempWorks.push(workObject);
          }
        } else {
          let cWork = workAndMaterials[index];
          let cRoom = newRivision[cWork.indexces.roomIndex];
          let Units = cRoom.Units;
          let cUnit = Units[cWork.indexces.unitIndex];
          let Components = cUnit.Components;
          let cComponent = Components[cWork.indexces.componentIndex];
          if ("vendorCategory" in workAndMaterials[index]) {
            let Work = [...cComponent.Work];
            Work.splice(cWork.indexces.workIndex, 1, {
              ...cWork,
              rate: "quotation",
            });
            cComponent = { ...cComponent, Work };
            tempWorks.push(workAndMaterials[index]);
          } else {
            let Material = [...cComponent.Material];
            Material.splice(cWork.indexces.materialIndex, 1, {
              ...cWork,
              rate: "quotation",
            });
            cComponent = { ...cComponent, Material };
            tempMaterials.push(workAndMaterials[index]);
          }
          Components.splice(cWork.indexces.componentIndex, 1, cComponent);
          cUnit = { ...cUnit, Components };
          Units.splice(cWork.indexces.unitIndex, 1, cUnit);
          cRoom = { ...cRoom, Units };
          newRivision.splice(cWork.indexces.roomIndex, 1, cRoom);
          setRevision(newRivision);
        }
      });

      // console.log(`tempMaterials`, tempMaterials)
      // console.log(`tempWorks`, tempWorks)

      const quotationService = new QuotationService();

      let errorFound = "";
      if (tempWorks.length > 0) {
        const response = await quotationService.add(
          tempWorks,
          project.clientName ? project.clientName : project.ClientName,
          // data.ClientName,
          data.Address,
          data.AmountRecieved,
          data.ProjectId,
          startDate,
          endDate,
          "work",
          vendorMobile == null ||
            vendorMobile == "null" ||
            vendorMobile == "Open Vendor"
            ? "Open Vendor"
            : vendorMobile.split(":")[1].trim()
        );
        console.log(`Response from quotationService.add API: `, response);
        if (response.status !== 200) {
          errorFound = "Error while releasing quotation!";
        }
      }

      if (tempMaterials.length > 0) {
        const response = await quotationService.add(
          tempMaterials,
          // data.ClientName,
          project.clientName ? project.clientName : project.ClientName,
          data.Address,
          data.AmountRecieved,
          data.ProjectId,
          startDate,
          endDate,
          "material",
          vendorMobile == null ||
            vendorMobile == "null" ||
            vendorMobile == "Open Vendor"
            ? "Open Vendor"
            : vendorMobile.split(":")[1].trim()
        );
        console.log(`Response from quotationService.add API: `, response);
        if (response.status !== 200) {
          errorFound = "Error while releasing quotation!";
        }
      }

      if (tempWorks.length > 0 || tempMaterials.length > 0) {
        if (errorFound.length > 0) {
          alert(errorFound);
        } else {
          toast.success(
            `Quotation for ${activeCategory} category with ${selectedItems.length} items released.`,
            {
              duration: 4000,
              position: "bottom-center",
              style: {
                borderRadius: "8px",
                padding: "16px",
                color: "#F4696C",
                backgroundColor: "#FFF0F0",
                maxWidth: "100%",
              },
              icon: <HiOutlineCurrencyRupee color={"#F4696C"} />,
            }
          );
          if (draftId) {
            deleteDraft();
          }
          saveWorkButtonClicked(
            { ...data, rooms: newRivision },
            undefined,
            updateFBRDB
          );
          history.push("/Timeline/" + data.ProjectId, { data: data });
          // record(TAGS["@release_quotation_button_click_success", { description: "Release quotation button click success" }])
          record("@release_quotation_button_click_success", {
            description: "Release quotation button click success",
          });
        }
      }
    } else {
      toast.error("Please add an item to proceed.", {
        duration: 4000,
        position: "bottom-center",
        style: {
          borderRadius: "8px",
          padding: "16px",
          color: "#E72424",
          backgroundColor: "#FEF0F0",
          maxWidth: "100%",
        },
        icon: <FiInfo color={"#E72424"} />,
      });
      // record(TAGS["@release_quotation_button_click_error", { description: "Release quotation button click error" }])
      record("@release_quotation_button_click_error", {
        description: "Release quotation button click error",
      });
    }
  };

  const deleteQuotation = async () => {
    const quotationService = new QuotationService();
    const response = await quotationService.delete(quotationId);
    console.log(`Response from deleteQuotation API: `, response);
    if (response.status != 200) {
      toast.error("Error while deleting quotation!", {
        duration: 4000,
        position: "bottom-center",
        style: {
          borderRadius: "8px",
          padding: "16px",
          color: "#E72424",
          backgroundColor: "#FEF0F0",
          maxWidth: "100%",
        },
        icon: <FiInfo color={"#E72424"} />,
      });
    }
  };

  useEffect(() => {
    if (quotationVendorName && quotationVendorMobile) {
      setVendorMobile(quotationVendorName + " : " + quotationVendorMobile);
    }
  }, [quotationVendorName, quotationVendorMobile]);

  const backtrackBOQ = () => {
    if (addedItems.length > 0) {
      // console.log('backtrackBOQ addedItems : ', addedItems);

      // console.log('backtrackBOQ data : ', data);

      delete data.AmountRecieved;

      let worksToBeBacktracked = [];
      let materialsToBeBacktracked = [];

      addedItems.forEach((item, index) => {
        if (item.workType == "Only Material") {
          const materialObject = {
            ...item,
            status: isApproval ? "inApproval" : "ordered",
            discountedRate:
              discount > 0 ? calculateDiscountedAmount(item) : "null",
          };
          materialsToBeBacktracked.push(materialObject);
          // console.log("backtrackBOQ materialObject", materialObject);
        } else {
          const workObject = {
            ...item,
            status: isApproval ? "inApproval" : "ordered",
            discountedRate:
              discount > 0 ? calculateDiscountedAmount(item) : "null",
          };
          worksToBeBacktracked.push(workObject);
          // console.log("backtrackBOQ workObject", workObject);
        }
      });

      if (
        data.rooms[data.rooms.length - 1]["Room Name"] == "Non tender items"
      ) {
        const rooms = data.rooms;
        const roomIndex = data.rooms.length;
        const room = {
          "Room Name": "Non tender items",
          Units: [
            {
              "Unit Name": "Extra items",
              Drawings: [],
              Components: [
                ...data.rooms[roomIndex - 1].Units[0].Components,
                {
                  description: "component",
                  quantity: "1",
                  rate: (
                    (worksToBeBacktracked &&
                      worksToBeBacktracked.reduce(
                        (total, item) =>
                          total +
                          Number(
                            item.quantity * item.rate +
                              item.quantity * item.rate * (item.gst / 100)
                          ),
                        0
                      )) ||
                    (materialsToBeBacktracked &&
                      materialsToBeBacktracked.reduce(
                        (total, item) =>
                          total +
                          Number(
                            item.quantity * item.rate +
                              item.quantity * item.rate * (item.gst / 100)
                          ),
                        0
                      ))
                  ).toString(),
                  unit: "unit",
                  Work: worksToBeBacktracked,
                  Material: materialsToBeBacktracked,
                  Remarks: "",
                },
              ],
            },
          ],
        };
        rooms.splice(roomIndex - 1, 1, room);
        // console.log('if : rooms', rooms);
        setRevision(data.rooms);
        updateFBRDB({ ...data, rooms });
      } else {
        const room = {
          "Room Name": "Non tender items",
          Units: [
            {
              "Unit Name": "Extra items",
              Drawings: [],
              Components: [
                {
                  description: "component",
                  quantity: "1",
                  rate: (
                    (worksToBeBacktracked &&
                      worksToBeBacktracked.reduce(
                        (total, item) =>
                          total +
                          Number(
                            item.quantity * item.rate +
                              item.quantity * item.rate * (item.gst / 100)
                          ),
                        0
                      )) ||
                    (materialsToBeBacktracked &&
                      materialsToBeBacktracked.reduce(
                        (total, item) =>
                          total +
                          Number(
                            item.quantity * item.rate +
                              item.quantity * item.rate * (item.gst / 100)
                          ),
                        0
                      ))
                  ).toString(),
                  unit: "unit",
                  Work: worksToBeBacktracked,
                  Material: materialsToBeBacktracked,
                  Remarks: "",
                },
              ],
            },
          ],
        };
        const rooms = data.rooms;
        const roomIndex = data.rooms.length;
        rooms.splice(roomIndex + 1, 0, room);
        // console.log('else : rooms', rooms);
        setRevision(data.rooms);
        updateFBRDB({ ...data, rooms });
      }
    }
  };

  const [draftId, setDraftId] = useState(null);

  

  const getURLsOfImageForPO = async () => {
    // writ th cod hr
    let projectId = pathname.split("/")[2];
    let emptyURL = null;
    let itemImageURLs = [];
    var useRef = database.ref(`POImages/${projectId}`);
    // var data;
    useRef
      .once("value", function (snapshot) {
        // write the code here
        // ImagesObjectFetchedFromFirebase.current = snapshot.val();
        var data = snapshot.val();
        setImagesFromFirebase(data);
        // console.log(
        //   "data from firebase images",
        //   data
        //   // ImagesObjectFetchedFromFirebase.current
        // );
        // return data;
        // if (data == null) {
        //   // write the code here
        //   for (let index = 0; index < orderIds.length; index++) {
        //     // write the code here
        //     itemImageURLs.push(emptyURL);
        //   }
        // } else {
        //   // write the code here
        //   for (let index = 0; index < orderIds.length; index++) {
        //     // write the code here
        //     console.log("data[orderIds[index]] : ", data[orderIds[index]]);
        //     if (data[orderIds[index]]) {
        //       // write the code here
        //       itemImageURLs.push(data[orderIds[index]].url);
        //     } else {
        //       // write the code here
        //       itemImageURLs.push(emptyURL);
        //     }
        //   }
        // }
      })
      // return ImagesObjectFetchedFromFirebase;
      .then((res) => {
        // console.log("itemImageURLs : ", itemImageURLs);
        // setImageStates(itemImageURLs);
        // setImageULS((prev)=>{})
        // console.log("image need to set hewr", imageULS);
        return res;
      });
  };

  

  useEffect(() => {
    (async () => {
      if (draft) {
        setDraftId(draft.draftId);
        setOrderType(draft.orderType);
        setTempStateForTesting(JSON.parse(draft.selectedItems));
        setAddedItems(JSON.parse(draft.addedItems));
        setActiveCategory(draft.activeCategory);
        setContactPersonName(draft.contactPersonName);
        setContactPersonNumber(draft.contactPersonNumber);
        // setSiteEngineerName(draft.siteEngineerName);
        // setSiteEngineerNumber(draft.siteEngineerNumber);
        setSiteEngineerDetails((prev) => ({
          ...prev,
          siteEngineerName: draft.siteEngineerName,
          siteEngineerNumber: draft.siteEngineerNumber,
        }));
        setDiscount(draft.discount);
        setStartDate(draft.startDate);
        setEndDate(draft.endDate);
        setVendorMobile(draft.vendorMobile);
        setVendorFirm(draft.vendorFirm);
        setVendorGSTIN(draft.vendorGSTIN || "");
        setVendorAddress(draft.vendorAddress);
        setVendorPinCode(draft.vendorPinCode);
        setVendorCity(draft.vendorCity);
        setVendorState(draft.vendorState);
        setTermsAndConditions(draft.termsAndConditions);
        setPaymentTerms(draft.paymentTerms);
        setSpecialInstructions(draft.specialInstructions);
        setPriceBase(draft.priceBase);
        setFreight(draft.freight);
        setInsurance(draft.insurance);
        setShippingAddress(draft.shippingAddress);
        setBillingAddress(draft.billingAddress);
        setAttachments(JSON.parse(draft.attachments));
        setDefaultMilestones(
          JSON.parse(draft.commonMilestones) &&
            JSON.parse(draft.commonMilestones)
        );
        // setOlderVersionofOrderData(draft.OlderVersions && JSON.parse(draft.OlderVersions) || [])
      }
      if (FromReleasedItem) {
        setIsUpdatingProgress(true);

        // fetch the associated PO to fill the data
        let poresponse = await poService.getPoByOrderId(
          releasedOrderDataFromReleased.OrderId
        );

        setPoresponse(poresponse);

        if (poresponse.status === 200) {
          // setDraftId(releasedOrderDataFromReleased.OrderId);
          setOrderType(poresponse.payload[0].orderType);
          setTempStateForTesting(
            JSON.parse(releasedOrderDataFromReleased.Data).data
          );
          setAddedItems([]);
          // setActiveCategory(releasedOrderDataFromReleased.Category);
          setContactPersonName(poresponse.payload[0].projectContactPerson);
          setContactPersonNumber(poresponse.payload[0].projectContactNumber);
          // setSiteEngineerName(poresponse.payload[0].siteEngineerName);
          // setSiteEngineerNumber(poresponse.payload[0].siteEngineerMobile);
          setSiteEngineerDetails((prev) => ({
            ...prev,
            siteEngineerName: poresponse.payload[0].siteEngineerName,
            siteEngineerNumber: poresponse.payload[0].siteEngineerMobile,
          }));
          setDiscount(poresponse.payload[0].discount);
          setStartDate(poresponse.payload[0].startDate);
          setEndDate(poresponse.payload[0].endDate);
          setVendorMobile(poresponse.payload[0].vendorMobile);
          setVendorFirm(poresponse.payload[0].vendorFirm);
          setVendorGSTIN(poresponse.payload[0].vendorGSTIN || "");
          setVendorAddress(poresponse.payload[0].vendorAddress);
          setVendorPinCode(poresponse.payload[0].vendorPinCode);
          setVendorCity(poresponse.payload[0].vendorCity);
          setVendorState(poresponse.payload[0].vendorState);
          setTermsAndConditions(poresponse.payload[0].termsAndCondition);
          setPaymentTerms(poresponse.payload[0].paymentTerms);
          setSpecialInstructions(poresponse.payload[0].specialInstructions);
          setPriceBase(poresponse.payload[0].priceBase);
          setFreight(poresponse.payload[0].freight);
          setInsurance(poresponse.payload[0].insurance);
          setShippingAddress(poresponse.payload[0].shipToAddress);
          setBillingAddress(poresponse.payload[0].billToAddress);
          setAttachments(JSON.parse(poresponse.payload[0].attachments));
          setOlderVersionofOrderData(
            (releasedOrderDataFromReleased.OlderVersions &&
              JSON.parse(releasedOrderDataFromReleased.OlderVersions)) ||
              []
          );

          setTotalPaidAmountReleasedOrder(() => {
            let tempOrderMilestones = JSON.parse(
              releasedOrderDataFromReleased.CommonMilestones
            );

            let total_Paid = Number(
              tempOrderMilestones.reduce((mTotalPaid, mItem) => {
                return (mTotalPaid =
                  mTotalPaid +
                  (mItem.name !== "Paid" && "payments" in mItem
                    ? mItem.payments.reduce(
                        (total, item) => (total = total + Number(item.amount)),
                        0
                      )
                    : 0.0));
              }, 0)
            );

            console.log("total_Paid : ", total_Paid);

            total_Paid =
              tempOrderMilestones[0].name === "Paid"
                ? Number(
                    total_Paid + tempOrderMilestones[0].totalAmount
                  ).toFixed(2)
                : Number(total_Paid + 0).toFixed(2);
                console.log("total paid amount", total_Paid)
            return { isChanged: false, value: total_Paid };
 
          }
        );
          
          
        }
        setIsUpdatingProgress(false);
      }
    })();
  }, [draft]);

  const updateDraft = async () => {
    if (
      selectedItems.length > 0 &&
      contactPersonName &&
      contactPersonNumber &&
      siteEngineerDetails.siteEngineerName &&
      siteEngineerDetails.siteEngineerNumber &&
      shippingAddress &&
      billingAddress
    ) {
      const response = await draftService.updateDraft(
        data.ProjectId,
        draftId,
        orderType,
        JSON.stringify(selectedItems),
        JSON.stringify(defaultMilestones),
        JSON.stringify(addedItems),
        activeCategory,
        contactPersonName,
        contactPersonNumber,
        siteEngineerDetails.siteEngineerName,
        siteEngineerDetails.siteEngineerNumber,
        discount,
        startDate,
        endDate,
        vendorMobile,
        vendorFirm,
        vendorGSTIN,
        vendorAddress,
        vendorPinCode,
        vendorCity,
        vendorState,
        termsAndConditions,
        paymentTerms,
        specialInstructions,
        priceBase,
        freight,
        insurance,
        shippingAddress,
        billingAddress,
        JSON.stringify(attachments)
      );

      console.log(`Response from updateDraft API: `, response);

      if (response.status === 200) {
        updatePOImagesFirebase();

        toast.success(
          `Draft for ${activeCategory} category with ${selectedItems.length} items updated.`,
          {
            duration: 4000,
            position: "bottom-center",
            style: {
              borderRadius: "8px",
              padding: "16px",
              color: "#1A85B1",
              backgroundColor: "#F1FBFF",
              maxWidth: "100%",
            },
            icon: <CgFileDocument color={"#1A85B1"} size={20} />,
          }
        );

        history.push("/Timeline/" + data.ProjectId, { data: data });
        // record(TAGS["@update_draft_button_click_success", { description: "Update draft button click success" }])
        record("@update_draft_button_click_success", {
          description: "Update draft button click success",
        });
      } else {
        toast.error("Error updating draft!", {
          duration: 4000,
          position: "bottom-center",
          style: {
            borderRadius: "8px",
            padding: "16px",
            color: "#E72424",
            backgroundColor: "#FEF0F0",
            maxWidth: "100%",
          },
          icon: <FiInfo color={"#E72424"} />,
        });
        // record(TAGS["@update_draft_button_click_error", { description: "Update draft button click error" }])
        record("@update_draft_button_click_error", {
          description: "Update draft button click error",
        });
      }
    } else {
      if (!contactPersonName) {
        contactPersonNameRef.current.focus();
      } else if (!contactPersonNumber) {
        contactPersonNumberRef.current.focus();
      } else if (!siteEngineerDetails.siteEngineerName) {
        siteEngineerNameRef.current.focus();
      } else if (!siteEngineerDetails.siteEngineerNumber) {
        siteEngineerNumberRef.current.focus();
      } else if (!shippingAddress) {
        shippingAddressRef.current.focus();
      } else if (!billingAddress) {
        billingAddressRef.current.focus();
      }

      toast.error("Mandatory fields incomplete!", {
        duration: 4000,
        position: "bottom-center",
        style: {
          borderRadius: "8px",
          padding: "16px",
          color: "#E72424",
          backgroundColor: "#FEF0F0",
          maxWidth: "100%",
        },
        icon: <FiInfo color={"#E72424"} />,
      });
    }
  };

  const saveDraft = async () => {
    if (
      selectedItems.length > 0 &&
      contactPersonName &&
      contactPersonNumber &&
      siteEngineerDetails.siteEngineerName &&
      siteEngineerDetails.siteEngineerNumber &&
      shippingAddress &&
      billingAddress
    ) {
      const draftIdtobeUpdated = new Date().getTime();
      const workAndMaterials = selectedItems;
      let tempWorks = [];
      let tempMaterials = [];
      let newRivision = [...revision];

      workAndMaterials.forEach((item, index) => {
        if (addedItems.length > 0 && item["Unit Name"] == "Extra items") {
          // if (item["Unit Name"] == "Extra items") {
          if (item.workType == "Only Material") {
            const materialObject = {
              ...item,
              status: "inDraft",
              AssociatedID: draftIdtobeUpdated,
            };
            tempMaterials.push(materialObject);
          } else {
            const workObject = {
              ...item,
              status: "inDraft",
              AssociatedID: draftIdtobeUpdated,
            };
            tempWorks.push(workObject);
          }
        } else {
          // console.log("work&Material", workAndMaterials);
          let cWork = workAndMaterials[index];
          let cRoom = newRivision[cWork.indexces.roomIndex];
          let Units = cRoom.Units;
          let cUnit = Units[cWork.indexces.unitIndex];
          let Components = cUnit.Components;
          let cComponent = Components[cWork.indexces.componentIndex];
          // console.log("cComponent", cComponent);
          if ("vendorCategory" in workAndMaterials[index]) {
            let Work = [...cComponent.Work];
            Work.splice(cWork.indexces.workIndex, 1, {
              ...cWork,
              status: "inDraft",
              AssociatedID: draftIdtobeUpdated,
            });
            cComponent = { ...cComponent, Work };
            tempWorks.push(workAndMaterials[index]);
          } else {
            let Material = [...cComponent.Material];
            Material.splice(cWork.indexces.materialIndex, 1, {
              ...cWork,
              status: "inDraft",
              AssociatedID: draftIdtobeUpdated,
            });
            cComponent = { ...cComponent, Material };
            tempMaterials.push(workAndMaterials[index]);
          }
          Components.splice(cWork.indexces.componentIndex, 1, cComponent);
          cUnit = { ...cUnit, Components };
          Units.splice(cWork.indexces.unitIndex, 1, cUnit);
          cRoom = { ...cRoom, Units };
          newRivision.splice(cWork.indexces.roomIndex, 1, cRoom);
          setRevision(newRivision);
        }
      });

      const response = await draftService.postDraft(
        data.ProjectId,
        draftIdtobeUpdated, // new Date().getTime(), // draftId
        orderType,
        selectedItems,
        defaultMilestones,
        addedItems,
        activeCategory,
        contactPersonName,
        contactPersonNumber,
        siteEngineerDetails.siteEngineerName,
        siteEngineerDetails.siteEngineerNumber,
        discount,
        startDate,
        endDate,
        vendorMobile,
        vendorFirm,
        vendorGSTIN,
        vendorAddress,
        vendorPinCode,
        vendorCity,
        vendorState,
        termsAndConditions,
        paymentTerms,
        specialInstructions,
        priceBase,
        freight,
        insurance,
        shippingAddress,
        billingAddress,
        attachments
      );
      console.log(`Response from postDraft API: `, response);
      if (response.status === 200) {
        saveWorkButtonClicked(
          { ...data, rooms: revision },
          undefined,
          updateFBRDB
        );
        updatePOImagesFirebase();

        toast.success(
          `Draft for ${activeCategory} category with ${selectedItems.length} items saved.`,
          {
            duration: 4000,
            position: "bottom-center",
            style: {
              borderRadius: "8px",
              padding: "16px",
              color: "#1A85B1",
              backgroundColor: "#F1FBFF",
              maxWidth: "100%",
            },
            icon: <CgFileDocument color={"#1A85B1"} />,
          }
        );

        history.push("/Timeline/" + data.ProjectId, { data: data });
      } else {
        toast.error("Error saving draft!", {
          duration: 4000,
          position: "bottom-center",
          style: {
            borderRadius: "8px",
            padding: "16px",
            color: "#E72424",
            backgroundColor: "#FEF0F0",
            maxWidth: "100%",
          },
          icon: <FiInfo color={"#E72424"} />,
        });
        // record(TAGS["@save_draft_button_click_success", { description: "Save draft button click success" }])
        record("@save_draft_button_click_success", {
          description: "Save draft button click success",
        });
      }
    } else {
      if (!contactPersonName) {
        contactPersonNameRef.current.focus();
      } else if (!contactPersonNumber) {
        contactPersonNumberRef.current.focus();
      } else if (!siteEngineerDetails.siteEngineerName) {
        siteEngineerNameRef.current.focus();
      } else if (!siteEngineerDetails.siteEngineerNumber) {
        siteEngineerNumberRef.current.focus();
      } else if (!shippingAddress) {
        shippingAddressRef.current.focus();
      } else if (!billingAddress) {
        billingAddressRef.current.focus();
      }
      toast.error("Mandatory fields incomplete!", {
        duration: 4000,
        position: "bottom-center",
        style: {
          borderRadius: "8px",
          padding: "16px",
          color: "#E72424",
          backgroundColor: "#FEF0F0",
          maxWidth: "100%",
        },
        icon: <FiInfo color={"#E72424"} />,
      });
      // record(TAGS["@save_draft_button_click_error", { description: "Save draft button click error" }])
      record("@save_draft_button_click_error", {
        description: "Save draft button click error",
      });
    }
  };

  const deleteDraft = async () => {
    const response = await draftService.deleteDraft(draftId);
    console.log(`Response from deleteDraft API: `, response);
    if (response.status != 200) {
      toast.error("Error deleting draft!", {
        duration: 4000,
        position: "bottom-center",
        style: {
          borderRadius: "8px",
          padding: "16px",
          color: "#E72424",
          backgroundColor: "#FEF0F0",
          maxWidth: "100%",
        },
        icon: <FiInfo color={"#E72424"} />,
      });
    }
  };

  useEffect(() => {
    getSuggestiveTextFirm();
  }, []);

  const getSuggestiveTextFirm = async () => {
    const response = await projectService.getSuggestiveTextFirm();
    if (response.status == 200) {
      const firmDetails = response.payload.filter(
        (item) => item.firmName == userContext.user.Firm
      );
      if (firmDetails.length > 0) {
        setFirmName(firmDetails[0].firmName);
        setFirmAddress(firmDetails[0].firmAddress);
        setFirmPhoneNumber(firmDetails[0].firmPhoneNumber);
        setFirmGSTIN(firmDetails[0].firmGSTIN);
        setFirmContactPersonName(firmDetails[0].firmContactPersonName);
        setFirmContactPersonNumber(firmDetails[0].firmContactPersonNumber);
        setFirmContactPersonEmail(firmDetails[0].firmContactPersonEmail);
        setFirmSignature(JSON.parse(firmDetails[0].firmSignature));
      }
    } else {
      toast.error("Error getting suggestions!", {
        duration: 4000,
        position: "bottom-center",
        style: {
          borderRadius: "8px",
          padding: "16px",
          color: "#E72424",
          backgroundColor: "#FEF0F0",
          maxWidth: "100%",
        },
        icon: <FiInfo color={"#E72424"} />,
      });
    }
  };
  const [customMilestones, setCustomMilestones] = useState(false);

  const styles = {
    outerCircle: {
      height: 25,
      width: 25,
      borderRadius: 50,
      border: "1px solid #FFA000",
      backgroundColor: "#FFF8E1",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    innerCircle: {
      height: 15,
      width: 15,
      borderRadius: 50,
      backgroundColor: "#FFA000",
    },

    leftRightUnit: {
      height: 7.5,
      width: 55,
      backgroundColor: "#FFECB3",
    },
    centerUnit: {
      height: 25,
      width: 10,
      backgroundColor: "#FFECB3",
      cursor: "pointer",
    },

    leftRightUnitSelected: {
      height: 7.5,
      width: 30,
      backgroundColor: "#FFECB3",
    },
    selectedMilestone: {
      height: 60,
      width: 60,
      borderRadius: 50,
      border: "1px solid #FFA000",
      backgroundColor: "#FFF8E1",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  const removeHTML = (str) => {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = str;
    return tmp.textContent || tmp.innerText || "";
  };

  const DateCreated = () => {
    let dateObj = new Date(
      Number(
        location.pathname.substring(location.pathname.lastIndexOf("/") + 1)
      )
    );
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    let newdate = year + "/" + month + "/" + day;
    return newdate;
  };

  const calculateDate = () => {
    var date1 = new Date();
    var date2 = new Date(
      Number(
        location.pathname.substring(location.pathname.lastIndexOf("/") + 1)
      )
    );
    var diffTime = date1.getTime() - date2.getTime();
    var diffDays = diffTime / (1000 * 3600 * 24);
    return Math.floor(diffDays);
  };

  const prepareTheListOfAllVendors = (allVendors) => {
    let tempCategoryArray = [];
    let tempObjectForVendorData = {};
    let tempCat, concCat;
    for (let index = 0; index < allVendors.length; index++) {
      if (tempCategoryArray.includes(allVendors[index].Category)) {
        // console.log('We already have the category in the Array')
      } else {
        if (allVendors[index].Category[0] == "(") {
          tempCat = allVendors[index].Category.slice(2);
          concCat = tempCat.slice(0, tempCat.length - 2);
          tempCategoryArray.push(concCat);
        } else {
          tempCategoryArray.push(allVendors[index].Category);
        }
      }
    }
    tempCategoryArray = [...new Set(tempCategoryArray)].sort();
    for (let index = 0; index < allVendors.length; index++) {
      if (allVendors[index].Category[0] == "(") {
        tempCat = allVendors[index].Category.slice(2);
        concCat = tempCat.slice(0, tempCat.length - 2);
        if (tempObjectForVendorData.hasOwnProperty(concCat)) {
          tempObjectForVendorData[concCat].push([
            allVendors[index].Name + " : " + allVendors[index].Mobile,
          ]);
        } else {
          tempObjectForVendorData[concCat] = [
            allVendors[index].Name + " : " + allVendors[index].Mobile,
          ];
        }
      } else {
        if (
          tempObjectForVendorData.hasOwnProperty(allVendors[index].Category)
        ) {
          tempObjectForVendorData[allVendors[index].Category].push([
            allVendors[index].Name + " : " + allVendors[index].Mobile,
          ]);
        } else {
          tempObjectForVendorData[allVendors[index].Category] = [
            allVendors[index].Name + " : " + allVendors[index].Mobile,
          ];
        }
      }
    }
    for (let i in tempObjectForVendorData) {
      tempObjectForVendorData[i] = tempObjectForVendorData[i].sort();
    }
    let tempArray = [];
    for (let i in tempObjectForVendorData) {
      tempArray.push({ [i]: tempObjectForVendorData[i] });
    }
    setAllVendorData(tempArray);
  };

  var orderNo = 0;

  const updatePOImagesFirebase = async () => {
    // write the code here
    // console.log("imageULS : ", imageULS);
    // for (let index = 0; index < Object.keys(imageULS).length; index++) {
    //   // write the code here
    //   console.log("imageULS[index] : ", imageULS[index]);
    //   if (imageULS[index] == null) {
    //   } else {
    //     await handleImageUpload(imageULS[index], index);
    //   }
    // }
    // for (let value of Object.values(user)) {
    //   alert(value); // John, then 30
    // }
    // for (let index = 0; index < Object.keys(imageULS).length; index++) {
    let index = 0;
    for (let key of Object.keys(imageULS)) {
      // write the code here
      // console.log("imageULS[index] : ", imageULS[index], imageULS[key]);
      if (
        imageULS[key] &&
        Object.keys(imageULS[key] !== null) &&
        Object.keys(imageULS[key]).length > 0
      ) {
        if (imageULS[key].url) {
          //image is already uploaded firebase url is present
          // console.log("image is already there in that item");
          index++;
          continue;
        }
        await handleImageUpload(imageULS[key], index);
      } else {
      }
      index++;
    }
  };

  const handleImageUpload = async (image, index) => {
    const [file] = image;

    // console.log("image : ", image);
    // console.log("userContext.user.adminId : ", userContext.user.adminId);

    if (file) {
      // console.log("project : ", project);
      let timeStamp = new Date().getTime();
      await storageRef
        .child(
          `POImages/${project.ProjectId}/${selectedItems[index].OrderId}/${timeStamp}.jpg`
        )
        .put(file);
      console.log("Successfully placed the file");
      storageRef
        .child(
          `POImages/${project.ProjectId}/${selectedItems[index].OrderId}/${timeStamp}.jpg`
        )
        .getDownloadURL()
        .then((url) => {
          // setImageUrl(url)
          urlForImage = url;
        })
        .then(() => {
          let updates = {
            url: urlForImage,
          };

          database
            .ref(
              `POImages/${project.ProjectId}/${selectedItems[index].OrderId}`
            )
            .update(updates);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const previewHandler = () => {
    if (selectedItems.length != 0) {
      if (defaultMilestones.length == 1) {
        // write the code here
        if (defaultMilestones[0].name == "Type your milestone here") {
          // write the code here
          alert("Kindly define the payment terms");
        } else {
          // write the code here
          // setIsPreviewModalOpen(true)
          if (selectedItemsNonEdited.length > 0) {
            confirmAlert({
              title: "Line items changes detected!",
              message:
                "You have made some changes to the line items. Do you want to keep them?",
              buttons: [
                {
                  label: "Yes",
                  onClick: () => {
                    setIsPreviewModalOpen(true);
                  },
                },
                {
                  label: "No",
                  onClick: () => {
                    setSelectedItems(selectedItemsNonEdited);
                    setIsPreviewModalOpen(true);
                  },
                },
              ],
            });
          } else {
            setIsPreviewModalOpen(true);
          }
          record("@preview_release_button_click_success", {
            description: "preview&release button click success",
          });
        }
      } else {
        // write the code here
        // setIsPreviewModalOpen(true)
        if (selectedItemsNonEdited.length > 0) {
          confirmAlert({
            title: "Line items changes detected!",
            message:
              "You have made some changes to the line items. Do you want to keep them?",
            buttons: [
              {
                label: "Yes",
                onClick: () => {
                  setIsPreviewModalOpen(true);
                },
              },
              {
                label: "No",
                onClick: () => {
                  setSelectedItems(selectedItemsNonEdited);
                  setIsPreviewModalOpen(true);
                },
              },
            ],
          });
        } else {
          setIsPreviewModalOpen(true);
        }
        record("@preview_release_button_click_success", {
          description: "preview&release button click success",
        });
      }
    } else {
      alert("Kindly select the Items first");
    }
  };

  const AmmendPO = async (tempWorks, tempMaterials) => {
    // const poresponse = await poService.getPoByOrderId(orderIdtoFetch);
    // console.log('update response', poresponsefromAPi);
    if (poresponsefromAPi.status == 200) {
      let po = { ...poresponsefromAPi.payload[0] };
      // console.log('po ',poresponsefromAPi.payload[0])
      let poOlderVesionsofPO =
        (po.OlderVersions && JSON.parse(po.OlderVersions)) || [];
      poOlderVesionsofPO.unshift({
        ...po,
        AmendmentDetails: {
          isUnreleased: true,
          UnreleasedOn: new Date().getTime(),
        },
        discription: JSON.parse(po.discription),
        firmSignature: JSON.parse(po.firmSignature),
        attachments: JSON.parse(po.attachments),
        CommonMilestones: JSON.parse(po.CommonMilestones),
        OlderVersions: "null",
        // approvalDetails: "null",
      }); //previous stringified values need to parsed to update

      // if(isApproval){
      //   // console.log('approval order  ',isApproval)

      //   dataObject["ApprovalDetails"] = {From :userContext.user.email, to:''}
      // }
      // else{
      //   dataObject["ApprovalStatus"] = 'Ordered'
      //   dataObject["ApprovalDetails"] = 'Ordered'
      // }

      // isApproval ? {From :userContext.user.email, to:''} : "null",
      // console.log('poOlderVersionsarray' ,poOlderVesionsofPO);
      // console.log(
      //   "VEndoe details ============================",
      //   vendorCompanyName,
      //   vendorFirm
      // );

      let poDataObjetToUpdate = {
        discription: tempWorks.length > 0 ? tempWorks : tempMaterials,
        shipToAddress: shippingAddress,
        totalAmount,
        projectContactPerson: contactPersonName,
        projectContactNumber: contactPersonNumber,
        siteEngineerName: siteEngineerDetails.siteEngineerName,
        siteEngineerMobile: siteEngineerDetails.siteEngineerNumber,
        discount,
        startDate,
        endDate,
        vendorFirm: vendorCompanyName,
        vendorAddress,
        vendorPinCode,
        vendorGSTIN,
        vendorCity,
        vendorState,
        termsAndCondition: termsAndConditions,
        paymentTerms,
        specialInstructions,
        priceBase,
        freight,
        insurance,
        billToAddress: billingAddress,
        attachments,
        OlderVersions: FromApproval ? "null" : poOlderVesionsofPO,
        AmendmentDetails: { isUnreleased: false },
        poDate: new Date(),
        vendorMobile:
          vendorMobile == null ||
          vendorMobile == "null" ||
          vendorMobile == "Open Vendor"
            ? "Open Vendor"
            : vendorMobile,
        VendorAcceptedDate: "",
        vendorSignature: "",
        CommonMilestones: defaultMilestones,
        // approvalDetails: isApproval
        //   ? { From: userContext.user.email, to: "" }
        //   : "null",
      };
      // console.log("finale things ", poDataObjetToUpdate);
      const updateresponse = await poService
        .updatePO(po.Id, poDataObjetToUpdate)
        .then((res) => console.log("respo", res));
      // console.log("update po response", updateresponse);
      const smsService = new SmsService();
      // console.log(
      //   "current vendormoble",
      //   vendorMobile,
      //   "previous vendor: ",
      //   po.vendorMobile
      // );
      if (
        vendorMobile != null &&
        vendorMobile != "null" &&
        vendorMobile != "Open Vendor" &&
        !isApproval
      ) {
        // immediatly  send what'sapp msg if not for approval
        let link =
          environment.environment == "staging"
            ? `https://661a58e4528b3d77527dac4e--sparkly-hotteok-089b7a.netlify.app/?po_id=${releasedOrderDataFromReleased.OrderId}`
            : `https://staartbuild.netlify.app/?po_id=${releasedOrderDataFromReleased.OrderId}`;

        console.log("vendor msg");

        if (po.vendorMobile != vendorMobile) {
          console.log("vendors not same send new vendor po");
          await smsService.sendWhatsapp({
            to: `91${vendorMobile.split(":")[1].trim()}`,
            firm: userContext.user.Firm,
            orderType: orderType,
            category: activeCategory,
            link: link,
          });
        } else {
          // console.log("equal amend po  to same vendor");
          let components = [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: userContext.user.Firm,
                },
                {
                  type: "text",
                  text: orderType,
                },
                {
                  type: "text",
                  text: activeCategory[0],
                },
                {
                  type: "text",
                  text: link,
                },
              ],
            },
          ];
          await smsService.whatsAppSMS(
            `${vendorMobile.split(":")[1].trim()}`,
            "amended_po_notify_vendors",
            "en",
            components
          );
        }
      }
    }
  };

  const UnReleaseDeletedItems = () => {
    // console.log("deleted itemss", deletedItemsToUnfreeze);
    if (deletedItemsToUnfreeze.length > 0) {
      let newRivision = [...revision];
      deletedItemsToUnfreeze.forEach((order) => {
        // console.log('order',order,'releasedItem',releasedItem)
        let cWork = order;
        let cRoom = newRivision[cWork.indexces.roomIndex];
        let Units = cRoom.Units;
        let cUnit = Units[cWork.indexces.unitIndex];
        let Components = cUnit.Components;
        let cComponent = Components[cWork.indexces.componentIndex];
        if ("vendorCategory" in order) {
          let Work = [...cComponent.Work];
          Work.splice(cWork.indexces.workIndex, 1, { ...cWork, status: "" });
          cComponent = { ...cComponent, Work };
        } else {
          // console.log("material categoty  doing things");
          let Material = [...cComponent.Material];
          Material.splice(cWork.indexces.materialIndex, 1, {
            ...cWork,
            status: "",
          });
          cComponent = { ...cComponent, Material };
        }
        Components.splice(cWork.indexces.componentIndex, 1, cComponent);
        cUnit = { ...cUnit, Components };
        Units.splice(cWork.indexces.unitIndex, 1, cUnit);
        cRoom = { ...cRoom, Units };
        newRivision.splice(cWork.indexces.roomIndex, 1, cRoom);
        setRevision(newRivision);
      });
      saveWorkButtonClicked(
        { ...data, rooms: newRivision },
        undefined,
        updateFBRDB
      );
    }
  };

  const reReleaseOrder = async () => {
    if (
      selectedItems.length > 0 &&
      contactPersonName &&
      contactPersonNumber &&
      siteEngineerDetails.siteEngineerName &&
      siteEngineerDetails.siteEngineerNumber &&
      shippingAddress &&
      billingAddress
    ) {
      const opportunityService = new OpportunityService();
      if (
        (releasedOrderDataFromReleased.VendorMobile == null &&
          vendorMobile !== "Open Vendor") ||
        (releasedOrderDataFromReleased.VendorMobile !== null &&
          releasedOrderDataFromReleased.VendorMobile !==
            vendorMobile?.split(":")[1]?.trim())
      ) {
        //vendor changed
        makeOpportunity();
        UnReleaseDeletedItems();
        const poService = new POService();
        await poService.unReleasePO(releasedOrderDataFromReleased.OrderId, {
          AmendmentDetails: {
            isUnreleased: true,
            UnreleasedOn: new Date().getTime(),
          },
        });
        await opportunityService.deleteOrderByID(
          releasedOrderDataFromReleased.OrderId
        );
        // console.log("vendor changed");
      } else {

        let currentDraft = {
          CommonMilestones: JSON.parse(
            releasedOrderDataFromReleased.CommonMilestones
          ),
          Data: JSON.parse(releasedOrderDataFromReleased.Data),
          OrderTotalAmount: releasedOrderDataFromReleased.OrderTotalAmount,
        };
        let tempOlderVerions = OlderVersionofOrderData && [
          ...OlderVersionofOrderData,
        ];
        //appending the older versions
        tempOlderVerions.unshift(currentDraft);

   
        const [tempWorks, tempMaterials] = editingTheBOQPage();
        // console.log("tempWOrks", tempWorks, "tempMaterial", tempMaterials);
        let dataObjectToUpdate = {};
        let errorFound = "";
        dataObjectToUpdate.Data = {
          data: tempWorks.length > 0 ? tempWorks : tempMaterials,
          // ClientName: data.ClientName,
          ClientName: project.clientName
            ? project.clientName
            : project.ClientName,
          StartDate: startDate,
          EndDate: endDate,
          releasedDate: new Date(),
        };
 
        dataObjectToUpdate = {
          ...dataObjectToUpdate,
          Address: shippingAddress,
          OrderTotalAmount: totalAmount,
          CommonMilestones: defaultMilestones,
          OlderVersions: FromApproval ? "null" : tempOlderVerions,
          Category: activeCategory.toString(),
        };
        dataObjectToUpdate.ApprovalStatus = isApproval ? "inApproval" : "";
        let lastUpdatedTimestamp = new Date().getTime();
        let lastUpdatedDate =
          new Date(lastUpdatedTimestamp).getDate() +
          "-" +
          (new Date(lastUpdatedTimestamp).getMonth() + 1) +
          "-" +
          new Date(lastUpdatedTimestamp).getFullYear();
        let lastUpdatedTime =
          new Date(lastUpdatedTimestamp).getHours() +
          ":" +
          new Date(lastUpdatedTimestamp).getMinutes();

        let previousHistory = {
          ...JSON.parse(releasedOrderDataFromReleased.requestHistory),
        };
        let reqHistoryObjectTOUpdate = {
          ...previousHistory,
          [new Date().getTime()]: {
            sendTo: "", //will be same, for now empty
            raised: userContext.user.email, //same all the time
            comments: isApproval ? "Edited For Approval" : "",
            status: isApproval ? "Requested" : "Ordered",
            date: lastUpdatedDate,
            time: lastUpdatedTime,
            userId: userContext.user.email, //  email of current  updating user
            By: userContext.user.email.slice(
              0,
              userContext.user.email.indexOf("@")
            ), // name/email of current  updating user
          },
        };
        if (isApproval) {
          // console.log('approval order  ',isApproval)
          dataObjectToUpdate["ApprovalStatus"] = "inApproval"; // change the status to "inApproval" ,default will be ""

          dataObjectToUpdate["requestHistory"] = reqHistoryObjectTOUpdate;
        } else {
          dataObjectToUpdate["ApprovalStatus"] = "Ordered";
          dataObjectToUpdate["requestHistory"] = reqHistoryObjectTOUpdate;
        }
        dataObjectToUpdate.VendorMobile =
          vendorMobile == null ||
          vendorMobile == "null" ||
          vendorMobile == "Open Vendor"
            ? "Open Vendor"
            : Number(vendorMobile.split(":")[1].trim());
        dataObjectToUpdate.VendorName =
          vendorMobile == null ||
          vendorMobile == "null" ||
          vendorMobile == "Open Vendor"
            ? "Open Vendor"
            : vendorMobile.split(":")[0].trim();
        dataObjectToUpdate.Status =
          vendorMobile == null ||
          vendorMobile == "null" ||
          vendorMobile == "Open Vendor"
            ? "Order Placed"
            : "Order accepted";
        // console.log("dataobjectoUpdate ", dataObjectToUpdate);
        await opportunityService
          .updateOpportunityById(
            releasedOrderDataFromReleased.OrderId,
            dataObjectToUpdate
          )
          .then((res) => {
            console.log("response of api service order update", res);
            if (res.status !== 200) {
              errorFound = "Error while making opportunity!";
            }
          });
        if (tempWorks.length > 0 || tempMaterials.length > 0) {
          if (errorFound.length > 0) {
            toast.error(errorFound, {
              duration: 4000,
              position: "bottom-center",
              style: {
                borderRadius: "8px",
                padding: "16px",
                color: "#E72424",
                backgroundColor: "#FEF0F0 ",
                maxWidth: "100%",
              },
              icon: <FiInfo color={"#E72424"} />,
            });
          } else {
            setIsUpdatingProgress(false);
            setIsSuccessPageOpen(true); //open success modal
            saveWorkButtonClicked(
              { ...data, rooms: revision },
              undefined,
              updateFBRDB
            ); //freeze the boq items

            updatePOImagesFirebase(); //update the images, if any
            backtrackBOQ(); //update the non tender items ,if any
            AmmendPO(tempWorks, tempMaterials); // fetch po and update acc
            UnReleaseDeletedItems(); //unrelease deleted items while edit Order, if any
          }
        }
      }
    } else {
      if (!contactPersonName) {
        contactPersonNameRef.current.focus();
      } else if (!contactPersonNumber) {
        contactPersonNumberRef.current.focus();
      } else if (!siteEngineerDetails.siteEngineerName) {
        siteEngineerNameRef.current.focus();
      } else if (!siteEngineerDetails.siteEngineerNumber) {
        siteEngineerNumberRef.current.focus();
      } else if (!shippingAddress) {
        shippingAddressRef.current.focus();
      } else if (!billingAddress) {
        billingAddressRef.current.focus();
      }

      toast.error("Mandatory fields incomplete!", {
        duration: 4000,
        position: "bottom-center",
        style: {
          borderRadius: "8px",
          padding: "16px",
          color: "#E72424",
          backgroundColor: "#FEF0F0",
          maxWidth: "100%",
        },
        icon: <FiInfo color={"#E72424"} />,
      });

      // record(TAGS["@release_order_button_click_error", { description: "Release order button click error" }])
      record("@release_order_button_click_error", {
        description: "Release order button click error",
      });
    }
    // if(updateresponse.status === 200){
    //     console.log('Successfully updated the order');

    // }
    //  VendorMobile:  // vendorMobile == null || vendorMobile == "null" || vendorMobile == "Open Vendor"
    // ? "Open Vendor"
    // : vendorMobile.split(":")[1].trim(),
  };

  return (
    <div style={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
      <div className={"mainTabs"}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginRight: "18%",
            marginTop: "18px",
          }}
        >
          <BsArrowLeftShort
            size={30}
            style={{
              marginRight: "20px",
              border: "1px solid  #fdd34d",
              borderRadius: "50%",
              backgroundColor: "#fdd34d",
              cursor: "pointer",
            }}
            onClick={() => {
              setAddedItems([]);
              setSelectedItems([]);
              history.push("/UnreleasedItems/" + data.ProjectId, {
                data: data,
              });
            }}
          />
          <div
            style={{ color: "#2F4858", fontSize: "18px", fontWeight: "400" }}
          >
            {/* <h3 >{data.clientName ? data.clientName : data.ClientName}</h3></div> */}
            {project && (
              <p
                style={{
                  fontWeight: "bold",
                  marginRight: "20px",
                  cursor: "default",
                }}
              >
                {project.clientName ? project.clientName : project.ClientName}
              </p>
            )}
          </div>
        </div>

        <div>
          <div
            className={"boqTab"}
            onClick={() => {
              setActiveMainTab(0);
              history.push("/ProjectPage/" + data.ProjectId);
              // record(TAGS["@boq_tab_click_success", { description: "BOQ tab click success" }])
              record("@boq_tab_click_success", {
                description: "BOQ tab click success",
              });
            }}
          >
            <div style={{ fontWeight: "bold" }}>BOQ</div>
            {(accountType == "Admin" ||
              accountType == "Finance" ||
              accountType == "Owner") && (
              <div style={{ whiteSpace: "nowrap" }}>
                Rs {(data && getComponentsPrice(data).toFixed(2)) || 0}
              </div>
            )}
          </div>
          <div className={activeMainTab === 0 ? "active" : ""}></div>
        </div>

        <div>
          <div
            className={"indentTab"}
            onClick={() => {
              if (accountType == "BOQ" || accountType == "Finance") {
                toast.error("You don't have access to Purchase!", {
                  backgroundColor: "red",
                  color: "black",
                });
              } else {
                if (data?.rooms) {
                  setActiveMainTab(1);
                  saveWorkButtonClicked(data, setSpinner);
                } else {
                  toast.error("Empty BOQ. Please add to proceed!", {
                    backgroundColor: "red",
                    color: "black",
                  });
                }
              }
              // record(TAGS["@purchase_tab_click_success", { description: "Purchase tab click success" }])
              record("@purchase_tab_click_success", {
                description: "Purchase tab click success",
              });
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontWeight: "bold" }}>Purchase</div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (displayPurchaseAmount) {
                    setDisplayPurchaseAmount(false);
                  } else {
                    setDisplayPurchaseAmount(true);
                  }
                }}
              >
                {!displayPurchaseAmount ? (
                  <VisibilityOff
                    style={{
                      marginLeft: 10,
                    }}
                  />
                ) : (
                  <Visibility
                    style={{
                      marginLeft: 10,
                    }}
                  />
                )}
              </div>
            </div>
            {(accountType == "Admin" ||
              accountType == "Finance" ||
              accountType == "Owner") && (
              <div style={{ whiteSpace: "nowrap" }}>
                Rs{" "}
                {(data &&
                  !displayPurchaseAmount &&
                  getVendorPrice(data).toFixed(2)) ||
                  "**********"}
              </div>
            )}
          </div>
          <div className={activeMainTab === 1 ? "active" : ""}></div>
        </div>

        <div
          style={{
            marginLeft: "18%",
            color: "#2F4858",
            fontSize: "18px",
            fontWeight: "400",
            marginTop: "20px",
          }}
        >
          <h5>
            started Date : {DateCreated()} | {calculateDate()} days ago
          </h5>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          padding: 40,
          gap: 40,
        }}
      >
        <div
          style={{
            width: "100%",
            margin: "auto",
            height: "5%",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
              cursor: "pointer",
            }}
          >
            {quotationVendorMobile != null ? (
              <p
                style={{
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                  fontSize: "28px",
                  cursor: "text",
                }}
              >
                {orderType}
              </p>
            ) : (
              <>
                <div
                  style={
                    orderType == "Work Order"
                      ? {
                          backgroundColor: "#F5F5F5",
                          color: "#353535",
                          fontWeight: 700,
                          padding: "10px",
                        }
                      : { color: "#CFCFCF" }
                  }
                  onClick={() => {
                    setOrderType("Work Order");
                    setSelectedItems([]);
                    setAddedItems([]);
                    setDefaultMilestones(defaultMilestonesState);
                    // record(TAGS["@work_order_tab_click_success", { description: "Work order tab click success" }]);
                    record("@work_order_tab_click_success", {
                      description: "Work order tab click success",
                    });
                  }}
                >
                  Work Order
                </div>

                <div
                  style={
                    orderType == "Purchase Order"
                      ? {
                          backgroundColor: "#F5F5F5",
                          color: "#353535",
                          fontWeight: 700,
                          padding: "10px",
                        }
                      : { color: "#CFCFCF" }
                  }
                  onClick={() => {
                    setOrderType("Purchase Order");
                    setSelectedItems([]);
                    setAddedItems([]);
                    setDefaultMilestones(defaultMilestonesState);
                    // record(TAGS["@purchase_order_tab_click_success", { description: "Purchase order tab click success" }]);
                    record("@purchase_order_tab_click_success", {
                      description: "Purchase order tab click success",
                    });
                  }}
                >
                  Purchase Order
                </div>

                <div
                  style={
                    orderType == "Work Quotation"
                      ? {
                          backgroundColor: "#F5F5F5",
                          color: "#353535",
                          fontWeight: 700,
                          padding: "10px",
                        }
                      : { color: "#CFCFCF" }
                  }
                  onClick={() => {
                    setOrderType("Work Quotation");
                    setSelectedItems([]);
                    setAddedItems([]);
                    setDefaultMilestones(defaultMilestonesState);
                    // record(TAGS["@work_quotation_tab_click_success", { description: "Work quotation tab click success" }]);
                    record("@work_quotation_tab_click_success", {
                      description: "Work quotation tab click success",
                    });
                  }}
                >
                  Work Quotation
                </div>

                <div
                  style={
                    orderType == "Material Quotation"
                      ? {
                          backgroundColor: "#F5F5F5",
                          color: "#353535",
                          fontWeight: 700,
                          padding: "10px",
                        }
                      : { color: "#CFCFCF" }
                  }
                  onClick={() => {
                    setOrderType("Material Quotation");
                    setSelectedItems([]);
                    setAddedItems([]);
                    setDefaultMilestones(defaultMilestonesState);
                    // record(TAGS["@material_quotation_tab_click_success", { description: "Material quotation tab click success" }]);
                    record("@material_quotation_tab_click_success", {
                      description: "Material quotation tab click success",
                    });
                  }}
                >
                  Material Quotation
                </div>
              </>
            )}
          </div>
          <div />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <p style={{ fontWeight: "bold" }}>Release Date: </p>
              <p style={{ marginLeft: 10 }}>{`${new Date().getDate()} / ${
                new Date().getMonth() + 1
              } / ${new Date().getFullYear()}`}</p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={sessionStorage.getItem("firmLogoURL")}
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                borderStyle: "solid",
                borderWidth: 0.25,
                borderColor: "grey",
              }}
            />
            <p
              style={{
                textAlign: "center",
                justifyContent: "center",
                color: "rgba(0, 0, 0, 0.54)",
                marginTop: 10,
              }}
            >
              {userContext.user.Firm}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: 8,
            marginBottom: 100,
          }}
        >
          <div
            style={{
              width: 9,
              backgroundColor: "#FDD34D",
              borderRadius: "8px 0px 0px 8px",
            }}
          />
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                gap: 20,
              }}
            >
              <abbr
                title="Default milestones"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: "7%",
                      maxWidth: "7%",
                      minWidth: "7%",
                      marginTop: 20,
                      flexDirection: "column",
                      textAlign: "center",
                      marginLeft: "1%",
                      gap: 5,
                    }}
                  >
                    <div
                      style={{
                        color: "#999999",
                        fontSize: 10,
                        fontWeight: 600,
                        fontFamily: "Montserrat",
                        marginBottom: 5,
                      }}
                    >
                      Alloted Amount
                    </div>
                    <div
                      style={{
                        border: "2px solid #FDD34D",
                        borderRadius: "16px",
                      }}
                    >
                      Total {"\u20B9 "} {totalAmount}
                    </div>
                    <div
                      style={{
                        color: "#353535",
                        fontSize: 10,
                        fontWeight: 600,
                        fontFamily: "Montserrat",
                        marginTop: 5,
                      }}
                    >
                      Milestone
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      width: "12%",
                      marginTop: 20,
                      flexDirection: "row",
                    }}
                  >
                    <div
                      style={{
                        height: 5,
                        width: "14%",
                        backgroundColor: "#FFECB3",
                      }}
                    ></div>
                    <div
                      style={{
                        height: 5,
                        width: "14%",
                        backgroundColor: "#FFA000",
                      }}
                    ></div>
                    <div
                      style={{
                        height: 5,
                        width: "14%",
                        backgroundColor: "#FFECB3",
                      }}
                    ></div>
                    <div
                      style={{
                        height: 5,
                        width: "14%",
                        backgroundColor: "#FFA000",
                      }}
                    ></div>
                    <div
                      style={{
                        height: 5,
                        width: "14%",
                        backgroundColor: "#FFECB3",
                      }}
                    ></div>
                    <div
                      style={{
                        height: 5,
                        width: "15%",
                        backgroundColor: "#FFA000",
                      }}
                    ></div>
                    <div
                      style={{
                        height: 5,
                        width: "15%",
                        backgroundColor: "#FFECB3",
                      }}
                    ></div>
                  </div>

                  {defaultMilestones.length == 1 ? (
                    <>
                      {defaultMilestones[0].name ==
                      "Type your milestone here" ? (
                        <>
                          <div
                            style={{
                              width: "4%",
                              maxWidth: "4%",
                              minWidth: "4%",
                              marginTop: 20,
                              flexDirection: "column",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                color: "#999999",
                                fontSize: 10,
                                fontWeight: 600,
                                fontFamily: "Montserrat",
                                marginBottom: 5,
                              }}
                            >
                              {"\u20B9 "} 0.00
                            </div>
                            <div
                              style={{
                                border: "2px solid #FDD34D",
                                borderRadius: "16px",
                              }}
                            >
                              0 %
                            </div>
                            <div
                              style={{
                                color: "#353535",
                                fontSize: 10,
                                fontWeight: 600,
                                fontFamily: "Montserrat",
                                marginTop: 5,
                              }}
                            >
                              Starting
                            </div>
                          </div>
                          <div
                            style={{
                              height: 5,
                              width: "69%",
                              backgroundColor: "#FFECB3",
                              marginTop: 20,
                            }}
                          ></div>
                          <div
                            style={{
                              width: "4%",
                              maxWidth: "4%",
                              minWidth: "4%",
                              marginTop: 20,
                              flexDirection: "column",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                color: "#999999",
                                fontSize: 10,
                                fontWeight: 600,
                                fontFamily: "Montserrat",
                                marginBottom: 5,
                              }}
                            >
                              {"\u20B9 "} 0.00
                            </div>
                            <div
                              style={{
                                border: "2px solid #FDD34D",
                                borderRadius: "16px",
                              }}
                            >
                              100 %
                            </div>
                            <div
                              style={{
                                color: "#353535",
                                fontSize: 10,
                                fontWeight: 600,
                                fontFamily: "Montserrat",
                                marginTop: 5,
                              }}
                            >
                              Completion
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              width: "2%",
                              maxWidth: "2%",
                              minWidth: "2%",
                              marginTop: 20,
                              flexDirection: "column",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                border: "2px solid #FDD34D",
                                borderRadius: "16px",
                                height: "20px",
                                width: "20px",
                              }}
                            ></div>
                          </div>
                          <div
                            style={{
                              height: 5,
                              width: "69%",
                              backgroundColor: "#FFECB3",
                              marginTop: 20,
                            }}
                          ></div>
                          <div
                            style={{
                              width: "4%",
                              maxWidth: "4%",
                              minWidth: "4%",
                              marginTop: 20,
                              flexDirection: "column",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                color: "#999999",
                                fontSize: 10,
                                fontWeight: 600,
                                fontFamily: "Montserrat",
                                marginBottom: 5,
                              }}
                            >
                              {"\u20B9 "} {defaultMilestones[0].totalAmount}
                            </div>
                            <div
                              style={{
                                border: "2px solid #FDD34D",
                                borderRadius: "16px",
                              }}
                            >
                              100 %
                            </div>
                            <div
                              style={{
                                color: "#353535",
                                fontSize: 10,
                                fontWeight: 600,
                                fontFamily: "Montserrat",
                                marginTop: 5,
                              }}
                            >
                              {defaultMilestones[0].name}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    defaultMilestones.map((item, index) => (
                      <>
                        {index == defaultMilestones.length - 1 ? (
                          <div
                            style={{
                              width: "4%",
                              maxWidth: "4%",
                              minWidth: "4%",
                              marginTop: 20,
                              flexDirection: "column",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                color: "#999999",
                                fontSize: 10,
                                fontWeight: 600,
                                fontFamily: "Montserrat",
                                marginBottom: 5,
                              }}
                            >
                              {/* {"\u20B9 "} {((totalAmount * item.percentage) / 100).toFixed(2)} */}
                              {"\u20B9 "} {item.totalAmount}
                            </div>
                            <div
                              style={{
                                border: "2px solid #FDD34D",
                                borderRadius: "16px",
                              }}
                            >
                              {item.percentage} %
                            </div>
                            <div
                              style={{
                                color: "#353535",
                                fontSize: 10,
                                fontWeight: 600,
                                fontFamily: "Montserrat",
                                marginTop: 5,
                              }}
                            >
                              {item.name}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div
                              style={{
                                width: "4%",
                                maxWidth: "4%",
                                minWidth: "4%",
                                marginTop: 20,
                                flexDirection: "column",
                                textAlign: "center",
                              }}
                            >
                              <div
                                style={{
                                  color: "#999999",
                                  fontSize: 10,
                                  fontWeight: 600,
                                  fontFamily: "Montserrat",
                                  marginBottom: 5,
                                }}
                              >
                                {/* {"\u20B9 "} {((totalAmount * item.percentage) / 100).toFixed(2)} */}
                                {"\u20B9 "} {item.totalAmount}
                              </div>
                              <div
                                style={{
                                  border: "2px solid #FDD34D",
                                  borderRadius: "16px",
                                }}
                              >
                                {item.percentage} %
                              </div>
                              <div
                                style={{
                                  color: "#353535",
                                  fontSize: 10,
                                  fontWeight: 600,
                                  fontFamily: "Montserrat",
                                  marginTop: 5,
                                }}
                              >
                                {item.name}
                              </div>
                            </div>
                            <div
                              style={{
                                height: 5,
                                width: "69%",
                                backgroundColor: "#FFECB3",
                                marginTop: 20,
                              }}
                            ></div>
                          </>
                        )}
                      </>
                    ))
                  )}

                  {defaultMilestones?.length == 1 ? (
                    <>
                      {defaultMilestones[0].name ==
                      "Type your milestone here" ? (
                        <div
                          style={{
                            width: "6%",
                            marginTop: 20,
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            // console.log(
                            //   "selectedItems from plus icon : ",
                            //   selectedItems
                            // );
                            // console.log("selected Items : ", selectedItems);
                            // console.log(
                            //   "selectedItems.length : ",
                            //   selectedItems.length
                            // );
                            // setShowPaymentTerms(true);
                            if (selectedItems.length == 0) {
                              // write the code here
                              alert("Add Items First!");
                            } else {
                              // write the code here
                              setDefaultMilestones([
                                {
                                  name: "Type your milestone here",
                                  percentage: 100,
                                  totalAmount: totalAmount,
                                },
                              ]);
                              setShowPaymentTerms(true);
                            }
                          }}
                        >
                          <p
                            style={{
                              display: "inline-block",
                              backgroundColor: "#FDD34D",
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              lineHeight: "50px",
                              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                              fontSize: "40px",
                            }}
                          >
                            +
                          </p>
                        </div>
                      ) : (
                        <div
                          style={{
                            width: "6%",
                            marginTop: 20,
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            // console.log(
                            //   "selectedItems from plus icon : ",
                            //   selectedItems
                            // );
                            // console.log(
                            //   "defaultMilestones : ",
                            //   defaultMilestones
                            // );
                            setShowPaymentTerms(true);
                          }}
                        >
                          <div
                            style={{
                              display: "inline-block",
                              backgroundColor: "#FDD34D",
                              height: "50px",
                              width: "50px",
                              borderRadius: "50%",
                              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                              textAlign: "center",
                              flexDirection: "column",
                            }}
                          >
                            <FiEdit2
                              style={{ marginTop: "0.75em" }}
                              size={25}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      style={{
                        width: "6%",
                        marginTop: 20,
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        console.log(
                          "selectedItems from plus icon : ",
                          selectedItems
                        );
                        // console.log("defaultMilestones : ", defaultMilestones);
                        setShowPaymentTerms(true);
                      }}
                    >
                      <div
                        style={{
                          display: "inline-block",
                          backgroundColor: "#FDD34D",
                          height: "50px",
                          width: "50px",
                          borderRadius: "50%",
                          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                          textAlign: "center",
                          flexDirection: "column",
                        }}
                      >
                        <FiEdit2 style={{ marginTop: "0.75em" }} size={25} />
                      </div>
                    </div>
                  )}
                </div>
              </abbr>

              <p
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  marginBottom: 20,
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#9b9b9a",
                }}
              >
                Line Items - common milestones
              </p>
              <table id="table1">
                <tbody>
                  <tr>
                    <th
                      style={{
                        color: "#C4C4C4",
                        fontFamily: "Montserrat",
                        fontWeight: 500,
                      }}
                    >
                      Items
                    </th>
                    <th
                      style={{
                        color: "#C4C4C4",
                        fontFamily: "Montserrat",
                        fontWeight: 500,
                      }}
                    >
                      Description
                    </th>
                    <th
                      style={{
                        color: "#C4C4C4",
                        fontFamily: "Montserrat",
                        fontWeight: 500,
                      }}
                    >
                      Image
                    </th>
                    <th
                      style={{
                        color: "#C4C4C4",
                        fontFamily: "Montserrat",
                        fontWeight: 500,
                      }}
                    >
                      Quantity
                    </th>
                    <th
                      style={{
                        color: "#C4C4C4",
                        fontFamily: "Montserrat",
                        fontWeight: 500,
                      }}
                    >
                      Unit
                    </th>
                    {orderType == "Work Quotation" ||
                    orderType == "Material Quotation" ? (
                      <>
                        {quotationVendorMobile != null ? (
                          <th
                            style={{
                              backgroundColor: "white",
                              color: "#C4C4C4",
                              fontFamily: "Montserrat",
                              fontWeight: 500,
                            }}
                          >
                            Rate
                          </th>
                        ) : null}
                      </>
                    ) : (
                      <th
                        style={{
                          backgroundColor: "white",
                          color: "#C4C4C4",
                          fontFamily: "Montserrat",
                          fontWeight: 500,
                        }}
                      >
                        Rate
                      </th>
                    )}

                    <th
                      style={{
                        backgroundColor: "white",
                        color: "#C4C4C4",
                        fontFamily: "Montserrat",
                        fontWeight: 500,
                      }}
                    >
                      GST
                    </th>
                    {orderType == "Work Quotation" ||
                    orderType == "Material Quotation" ? null : (
                      <th
                        style={{
                          backgroundColor: "white",
                          color: "#C4C4C4",
                          fontFamily: "Montserrat",
                          fontWeight: 500,
                        }}
                      >
                        Amount
                      </th>
                    )}
                  </tr>
                </tbody>
                {selectedItems.map((item, index) => {
                  if (milestoneTobeAddedIndex.includes(index)) {
                    // write the code here
                    orderNo = orderNo + 1;
                  } else {
                    return (
                      <tbody key={index}>
                        <tr style={{ textAlign: "center" }} key={index}>
                          {"type" in item ||
                          ("workType" in item &&
                            item.workType == "Only Material") ? (
                            <td>{item.type || item.category}</td>
                          ) : (
                            <td>{item.category || item.vendorCategory}</td>
                          )}

                          {"type" in item ? (
                            <td>
                              <ContentEditable
                                className="wrapInput"
                                contentEditable
                                html={item.specification
                                  .replace(/<new-line>/g, "\n")
                                  .replace(/<single-quote>/g, "'")
                                  .replace(/<double-quote>/g, '"')}
                                onChange={(e) => {
                                  if (selectedItemsNonEdited.length == 0) {
                                    let nonEditedSelectedItems = JSON.parse(
                                      JSON.stringify(selectedItems)
                                    );
                                    setSelectedItemsNonEdited(
                                      nonEditedSelectedItems
                                    );
                                  }
                                  let value = removeHTML(e.target.value)
                                    .replaceAll("<div>", "")
                                    .replaceAll("</div>", "")
                                    .replaceAll("<br>", "")
                                    .replaceAll("</br>", "")
                                    .replaceAll("&amp;", "and ")
                                    .replaceAll("&nbsp;", " ")
                                    .replaceAll("'", "<single-quote>")
                                    .replaceAll('"', "<double-quote>")
                                    .replaceAll("\n", "<new-line>");
                                  selectedItems[index].specification = value;
                                  setSelectedItems([...selectedItems]);
                                }}
                              />
                            </td>
                          ) : (
                            <td>
                              <ContentEditable
                                className="wrapInput"
                                contentEditable
                                html={item.description
                                  .replace(/<new-line>/g, "\n")
                                  .replace(/<single-quote>/g, "'")
                                  .replace(/<double-quote>/g, '"')}
                                onChange={(e) => {
                                  if (selectedItemsNonEdited.length == 0) {
                                    let nonEditedSelectedItems = JSON.parse(
                                      JSON.stringify(selectedItems)
                                    );
                                    setSelectedItemsNonEdited(
                                      nonEditedSelectedItems
                                    );
                                  }

                                  let value = removeHTML(e.target.value)
                                    // let value = e.target.value
                                    .replaceAll("<div>", "")
                                    .replaceAll("</div>", "")
                                    .replaceAll("<br>", "")
                                    .replaceAll("</br>", "")
                                    .replaceAll("&amp;", "and ")
                                    .replaceAll("&nbsp;", " ")
                                    .replaceAll("'", "<single-quote>")
                                    .replaceAll('"', "<double-quote>")
                                    .replaceAll("\n", "<new-line>");
                                  selectedItems[index].description = value;
                                  setSelectedItems([...selectedItems]);
                                }}
                              />
                            </td>
                          )}

                          <td
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            {
                              // imageULS[index] == null ?
                              //     null
                              //     :
                              //     <img
                              //         style={{
                              //             width: '800px',
                              //             height: '300px',
                              //             objectFit: 'contain'
                              //         }}
                              //         src={URL.createObjectURL(imageULS[index][0])} alt="Image Not uploaded" />
                            }

                            {
                              // imageULS[index] == null ?
                              //     ''
                              //     :
                              //     ''
                            }

                            <input
                              id="img"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                // let tempImageULS = [...imageULS];
                                let tempImageULS = { ...imageULS };
                                // tempImageULS[index] = (URL.createObjectURL(e.target.files[0]));
                                // if (e.target.files[0]) {
                                //   tempImageULS[item.OrderId] = {
                                //     url: URL.createObjectURL(e.target.files[0]),
                                //   };
                                // }
                                // tempImageULS[item.OrderId] = {
                                //   url: URL.createObjectURL(e.target.files[0]),
                                // };
                                tempImageULS[item.OrderId] = e.target.files;
                                setImageULS(tempImageULS);
                                // console.log("sdfsj", tempImageULS);
                                // this is where we have to write the code
                                // checkImageUpload(e)
                                // handleImageUpload(e)
                              }}
                              ref={imageUploader}
                              style={
                                {
                                  // display: "none"
                                }
                              }
                            />
                            <p style={{ marginLeft: "-6em" }} htmlFor="img">
                              {((imageULS &&
                                imageULS[
                                  selectedItems[index]?.OrderId
                                ]?.url?.substring(0, 20)) ||
                                "") + "..." || ""}
                            </p>
                          </td>

                          <td>
                            <ContentEditable
                              className="wrapInput"
                              contentEditable
                              html={item.quantity}
                              onChange={(e) => {
                                if (selectedItemsNonEdited.length == 0) {
                                  let nonEditedSelectedItems = JSON.parse(
                                    JSON.stringify(selectedItems)
                                  );
                                  setSelectedItemsNonEdited(
                                    nonEditedSelectedItems
                                  );
                                }

                                let value = e.target.value
                                  .replace(/(?!-)[^0-9.]/g, "")
                                  .replaceAll("<div>", "")
                                  .replaceAll("</div>", "")
                                  .replaceAll("<br>", "")
                                  .replaceAll("</br>", "")
                                  .replaceAll("&amp;", "and ")
                                  .replaceAll("&nbsp;", " ");
                                selectedItems[index].quantity = value;
                                setSelectedItems([...selectedItems]);

                                // if (defaultMilestones[0].name == 'Type your milestone here') {

                                //     // write the code here
                                //     if (selectedItemsNonEdited.length == 0) {
                                //         let nonEditedSelectedItems = JSON.parse(JSON.stringify(selectedItems))
                                //         setSelectedItemsNonEdited(nonEditedSelectedItems)
                                //     }

                                //     let value = e.target.value.replace(/(?!-)[^0-9.]/g, "")
                                //         .replaceAll('<div>', "")
                                //         .replaceAll('</div>', "")
                                //         .replaceAll('<br>', "")
                                //         .replaceAll('</br>', "")
                                //         .replaceAll('&amp;', "and ")
                                //         .replaceAll('&nbsp;', " ")
                                //     selectedItems[index].quantity = value;
                                //     setSelectedItems([...selectedItems]);

                                // } else {

                                //     confirmAlert({
                                //         title: 'Editing quantity will clear the milestones',
                                //         message: 'Do you want to continue?',
                                //         buttons: [
                                //             {
                                //                 label: 'Yes', onClick: () => {
                                //                     // setIsPreviewModalOpen(true);
                                //                     setDefaultMilestones(defaultMilestonesState);
                                //                 }
                                //             },
                                //             {
                                //                 label: 'No', onClick: () => {
                                //                     setSelectedItem(selectedItems);
                                //                 }
                                //             }
                                //         ]
                                //     })
                                // }
                              }}
                            />
                          </td>

                          <td>
                            <ContentEditable
                              className="wrapInput"
                              contentEditable
                              html={item.unit}
                              onChange={(e) => {
                                if (selectedItemsNonEdited.length == 0) {
                                  let nonEditedSelectedItems = JSON.parse(
                                    JSON.stringify(selectedItems)
                                  );
                                  setSelectedItemsNonEdited(
                                    nonEditedSelectedItems
                                  );
                                }
                                let value = e.target.value
                                  .replaceAll("<div>", "")
                                  .replaceAll("</div>", "")
                                  .replaceAll("<br>", "")
                                  .replaceAll("</br>", "")
                                  .replaceAll("&amp;", "and ")
                                  .replaceAll("&nbsp;", " ");
                                selectedItems[index].unit = value;
                                setSelectedItems([...selectedItems]);
                              }}
                            />
                          </td>

                          {orderType == "Work Quotation" ||
                          orderType == "Material Quotation" ? (
                            <>
                              {quotationVendorMobile != null ? (
                                <td>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {"\u20B9 "}
                                    {quotationVendorMobile != null ? (
                                      item.rate
                                    ) : (
                                      <ContentEditable
                                        className="wrapInput"
                                        contentEditable
                                        html={item.rate}
                                        onChange={(e) => {
                                          if (
                                            selectedItemsNonEdited.length == 0
                                          ) {
                                            let nonEditedSelectedItems =
                                              JSON.parse(
                                                JSON.stringify(selectedItems)
                                              );
                                            setSelectedItemsNonEdited(
                                              nonEditedSelectedItems
                                            );
                                          }

                                          let value = e.target.value
                                            .replaceAll("<div>", "")
                                            .replaceAll("</div>", "")
                                            .replaceAll("<br>", "")
                                            .replaceAll("</br>", "")
                                            .replaceAll("&amp;", "and ")
                                            .replaceAll("&nbsp;", " ");
                                          selectedItems[index].rate = value;
                                          setSelectedItems([...selectedItems]);

                                          // if (defaultMilestones[0].name == 'Type your milestone here') {
                                          //     // write the code here
                                          //     if (selectedItemsNonEdited.length == 0) {
                                          //         let nonEditedSelectedItems = JSON.parse(JSON.stringify(selectedItems))
                                          //         setSelectedItemsNonEdited(nonEditedSelectedItems)
                                          //     }
                                          //     let value = e.target.value
                                          //         .replaceAll('<div>', "")
                                          //         .replaceAll('</div>', "")
                                          //         .replaceAll('<br>', "")
                                          //         .replaceAll('</br>', "")
                                          //         .replaceAll('&amp;', "and ")
                                          //         .replaceAll('&nbsp;', " ")
                                          //     selectedItems[index].rate = value;
                                          //     setSelectedItems([...selectedItems]);
                                          // } else {
                                          //     // write the code here
                                          //     confirmAlert({
                                          //         title: 'Editing rate will clear the milestones',
                                          //         message: 'Do you want to continue?',
                                          //         buttons: [
                                          //             {
                                          //                 label: 'Yes', onClick: () => {
                                          //                     // setIsPreviewModalOpen(true);
                                          //                     setDefaultMilestones(defaultMilestonesState);
                                          //                 }
                                          //             },
                                          //             {
                                          //                 label: 'No', onClick: () => {
                                          //                     setSelectedItem(selectedItems);
                                          //                 }
                                          //             }
                                          //         ]
                                          //     })
                                          // }
                                        }}
                                      />
                                    )}
                                  </div>
                                </td>
                              ) : null}
                            </>
                          ) : (
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "center",
                                }}
                              >
                                {"\u20B9 "}
                                {quotationVendorMobile != null ? (
                                  item.rate
                                ) : (
                                  <ContentEditable
                                    className="wrapInput"
                                    contentEditable
                                    html={item.rate}
                                    onChange={(e) => {
                                      if (selectedItemsNonEdited.length == 0) {
                                        let nonEditedSelectedItems = JSON.parse(
                                          JSON.stringify(selectedItems)
                                        );
                                        setSelectedItemsNonEdited(
                                          nonEditedSelectedItems
                                        );
                                      }

                                      let value = e.target.value
                                        .replaceAll("<div>", "")
                                        .replaceAll("</div>", "")
                                        .replaceAll("<br>", "")
                                        .replaceAll("</br>", "")
                                        .replaceAll("&amp;", "and ")
                                        .replaceAll("&nbsp;", " ");
                                      selectedItems[index].rate = value;
                                      setSelectedItems([...selectedItems]);

                                      // if (defaultMilestones[0].name == 'Type your milestone here') {
                                      //     // write the code here
                                      //     if (selectedItemsNonEdited.length == 0) {
                                      //         let nonEditedSelectedItems = JSON.parse(JSON.stringify(selectedItems))
                                      //         setSelectedItemsNonEdited(nonEditedSelectedItems)
                                      //     }
                                      //     let value = e.target.value
                                      //         .replaceAll('<div>', "")
                                      //         .replaceAll('</div>', "")
                                      //         .replaceAll('<br>', "")
                                      //         .replaceAll('</br>', "")
                                      //         .replaceAll('&amp;', "and ")
                                      //         .replaceAll('&nbsp;', " ")
                                      //     selectedItems[index].rate = value;
                                      //     setSelectedItems([...selectedItems]);
                                      // } else {
                                      //     // write the code here
                                      //     confirmAlert({
                                      //         title: 'Editing rate will clear the milestones',
                                      //         message: 'Do you want to continue?',
                                      //         buttons: [
                                      //             {
                                      //                 label: 'Yes', onClick: () => {
                                      //                     // setIsPreviewModalOpen(true);
                                      //                     setDefaultMilestones(defaultMilestonesState);
                                      //                 }
                                      //             },
                                      //             {
                                      //                 label: 'No', onClick: () => {
                                      //                     setSelectedItem(selectedItems);
                                      //                 }
                                      //             }
                                      //         ]
                                      //     })
                                      // }
                                    }}
                                  />
                                )}
                              </div>
                            </td>
                          )}
                          <td>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                              }}
                            >
                              <ContentEditable
                                className="wrapInput"
                                contentEditable
                                html={item.gst}
                                onChange={(e) => {
                                  if (selectedItemsNonEdited.length == 0) {
                                    let nonEditedSelectedItems = JSON.parse(
                                      JSON.stringify(selectedItems)
                                    );
                                    setSelectedItemsNonEdited(
                                      nonEditedSelectedItems
                                    );
                                  }

                                  let value = e.target.value
                                    .replaceAll("<div>", "")
                                    .replaceAll("</div>", "")
                                    .replaceAll("<br>", "")
                                    .replaceAll("</br>", "")
                                    .replaceAll("&amp;", "and ")
                                    .replaceAll("&nbsp;", " ");
                                  selectedItems[index].gst = value;
                                  setSelectedItems([...selectedItems]);

                                  // if (defaultMilestones[0].name == 'Type your milestone here') {
                                  //     // write the code here
                                  //     if (selectedItemsNonEdited.length == 0) {
                                  //         let nonEditedSelectedItems = JSON.parse(JSON.stringify(selectedItems))
                                  //         setSelectedItemsNonEdited(nonEditedSelectedItems)
                                  //     }
                                  //     let value = e.target.value
                                  //         .replaceAll('<div>', "")
                                  //         .replaceAll('</div>', "")
                                  //         .replaceAll('<br>', "")
                                  //         .replaceAll('</br>', "")
                                  //         .replaceAll('&amp;', "and ")
                                  //         .replaceAll('&nbsp;', " ")
                                  //     selectedItems[index].gst = value;
                                  //     setSelectedItems([...selectedItems]);
                                  // } else {
                                  //     confirmAlert({
                                  //         title: 'Editing gst will clear the milestones',
                                  //         message: 'Do you want to continue?',
                                  //         buttons: [
                                  //             {
                                  //                 label: 'Yes', onClick: () => {
                                  //                     // setIsPreviewModalOpen(true);
                                  //                     setDefaultMilestones(defaultMilestonesState);
                                  //                 }
                                  //             },
                                  //             {
                                  //                 label: 'No', onClick: () => {
                                  //                     setSelectedItem(selectedItems);
                                  //                 }
                                  //             }
                                  //         ]
                                  //     })
                                  // }
                                }}
                              />
                              %
                            </div>
                          </td>
                          {orderType == "Work Quotation" ||
                          orderType == "Material Quotation" ? null : (
                            <td>
                              {"\u20B9 "}{" "}
                              {(
                                item["quantity"] * item["rate"] +
                                item["quantity"] *
                                  item["rate"] *
                                  (item["gst"] / 100)
                              ).toFixed(2)}{" "}
                            </td>
                          )}
                          <div style={{ pointer: "cursor" }}>
                            <PopOverView
                              position="left"
                              component={
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                    fontSize: 12,
                                    color: "grey",
                                    alignItems: "flex-start",
                                    width: 140,
                                  }}
                                >
                                  {/* <div
                                  onMouseDown={(e) => {
                                    if (defaultMilestones.length == 1) {
                                      if (defaultMilestones[0].name == "Type your milestone here") {
                                        alert("Enter the milestones first");
                                      } else {
                                        e.stopPropagation();
                                        setCustomMilestones(true);
                                        setCurrentMilestoneTobeEditedIndex(index);
                                        record("@edit_custom_milestone_option_clicked");
                                      }
                                    } else {
                                      e.stopPropagation();
                                      setCustomMilestones(true);
                                      setCurrentMilestoneTobeEditedIndex(index);
                                      record("@edit_custom_milestone_option_clicked");
                                    }
                                  }}
                                  className="menuItem"
                                >
                                  Edit
                                </div> */}

                                  <p
                                    className="menuItem"
                                    onMouseDown={(e) => {
                                      e.stopPropagation();
                                      // let tempDeletedItems =[]

                                      setDeltedItemsToUnfreeze((prev) => {
                                        // console.log(
                                        //   [...prev, selectedItems[index]],
                                        //   "sdfjs;lkdjfklfjslkjf"
                                        // );
                                        return [...prev, selectedItems[index]];
                                      });
                                      // console.log([]);
                                      // console.log(
                                      //   "this shouldd eeee",
                                      //   selectedItems[index]
                                      // );
                                      // setImageULS((prev) => {
                                      //   console.log(
                                      //     "deleint the image",
                                      //     selectedItems[index]
                                      //   );
                                      //   delete prev[
                                      //     selectedItems[index].OrderId
                                      //   ];

                                      //   let temp = { ...prev };
                                      //   console.log("tem", temp);
                                      //   return temp;
                                      // });
                                      selectedItems.splice(index, 1);
                                      setSelectedItems([...selectedItems]);

                                      let tempmilestoneTobeAddedIndex = [
                                        ...milestoneTobeAddedIndex,
                                      ];
                                      // write the logic for findig tempIndex
                                      let tempIndex;
                                      if (
                                        tempmilestoneTobeAddedIndex.indexOf(
                                          index
                                        )
                                      ) {
                                        for (
                                          let temp = 0;
                                          temp <
                                          tempmilestoneTobeAddedIndex.length;
                                          temp++
                                        ) {
                                          if (
                                            tempmilestoneTobeAddedIndex[temp] >
                                            index
                                          ) {
                                            tempIndex = temp;
                                            break;
                                          } else {
                                            console.log("Not breaking up");
                                          }
                                        }
                                      } else {
                                        // write the code here
                                        tempIndex =
                                          tempmilestoneTobeAddedIndex.indexOf(
                                            index
                                          );
                                      }
                                      // tempmilestoneTobeAddedIndex.splice(tempIndex, 1);
                                      for (
                                        let item = tempIndex;
                                        item <
                                        tempmilestoneTobeAddedIndex.length;
                                        item++
                                      ) {
                                        // write the code here
                                        if (
                                          tempmilestoneTobeAddedIndex[item] == 0
                                        ) {
                                          // write the code here
                                          console.log(
                                            "Life is fucking awesome"
                                          );
                                        } else {
                                          // write the code here
                                          tempmilestoneTobeAddedIndex[item] =
                                            tempmilestoneTobeAddedIndex[item] -
                                            1;
                                        }

                                        // if (index >= tempmilestoneTobeAddedIndex[item]) {
                                        //     // write the code here
                                        //     console.log('Required Condition')
                                        //     tempmilestoneTobeAddedIndex[item] = tempmilestoneTobeAddedIndex[item] - 1;
                                        // } else { console.log('life will be fucking awesome') }
                                      }

                                      setMilestoneTobeAddedIndex(
                                        tempmilestoneTobeAddedIndex
                                      );
                                      // console.log('This is the tempmilestonetobeaddedindex : ', tempmilestoneTobeAddedIndex);
                                      // console.log('tempmilestoneTobeAddedIndex: ', tempmilestoneTobeAddedIndex);
                                      // let's take care of the things here
                                      record("@removed_selected_item_success", {
                                        description:
                                          "removed selected item success",
                                      });

                                      // if (defaultMilestones[0].name == 'Type your milestone here') {
                                      //     // write the code here
                                      //     e.stopPropagation();
                                      //     selectedItems.splice(index, 1);
                                      //     setSelectedItems([...selectedItems])
                                      //     let tempmilestoneTobeAddedIndex = [...milestoneTobeAddedIndex];
                                      //     // write the logic for findig tempIndex
                                      //     let tempIndex;
                                      //     if (tempmilestoneTobeAddedIndex.indexOf(index)) {
                                      //         for (let temp = 0; temp < tempmilestoneTobeAddedIndex.length; temp++) {
                                      //             if (tempmilestoneTobeAddedIndex[temp] > index) {
                                      //                 tempIndex = temp;
                                      //                 break;
                                      //             } else { console.log('Not breaking up'); }
                                      //         }
                                      //     } else {
                                      //         // write the code here
                                      //         tempIndex = tempmilestoneTobeAddedIndex.indexOf(index);
                                      //     }
                                      //     // tempmilestoneTobeAddedIndex.splice(tempIndex, 1);
                                      //     for (let item = tempIndex; item < tempmilestoneTobeAddedIndex.length; item++) {
                                      //         // write the code here

                                      //         if (tempmilestoneTobeAddedIndex[item] == 0) {
                                      //             // write the code here
                                      //             console.log('Life is fucking awesome')
                                      //         } else {
                                      //             // write the code here
                                      //             tempmilestoneTobeAddedIndex[item] = tempmilestoneTobeAddedIndex[item] - 1;
                                      //         }

                                      //         console.log('tempmilestoneTobeAddedIndex[item] after decrement : ', tempmilestoneTobeAddedIndex[item])

                                      //         // if (index >= tempmilestoneTobeAddedIndex[item]) {
                                      //         //     // write the code here
                                      //         //     console.log('Required Condition')
                                      //         //     tempmilestoneTobeAddedIndex[item] = tempmilestoneTobeAddedIndex[item] - 1;
                                      //         // } else { console.log('life will be fucking awesome') }

                                      //     }
                                      //     setMilestoneTobeAddedIndex(tempmilestoneTobeAddedIndex);
                                      //     // console.log('This is the tempmilestonetobeaddedindex : ', tempmilestoneTobeAddedIndex);
                                      //     // console.log('tempmilestoneTobeAddedIndex: ', tempmilestoneTobeAddedIndex);
                                      //     // let's take care of the things here
                                      //     record("@removed_selected_item_success", { description: "removed selected item success" })
                                      // } else {
                                      //     // writ th cod hr
                                      //     if (window.confirm('Editing quantity will clear the milestones')) {
                                      //         setDefaultMilestones(defaultMilestonesState);
                                      //     } else {
                                      //         console.log('Sooner or later You will be dead');
                                      //     }
                                      // }
                                    }}
                                  >
                                    Delete
                                  </p>
                                </div>
                              }
                            >
                              <FiMoreHorizontal />
                            </PopOverView>
                          </div>
                        </tr>
                      </tbody>
                    );
                  }
                })}
              </table>

              {milestoneTobeAddedIndex.length == 0 ? null : (
                <p
                  style={{
                    textAlign: "center",
                    marginTop: 50,
                    marginBottom: 20,
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#9b9b9a",
                  }}
                >
                  Line Items - custom milestones
                </p>
              )}

              {/* This table is for EditedCustom Milestone */}
              {<div style={{ display: "none" }}>{(orderNo = 0)}</div>}

              {milestoneTobeAddedIndex.length == 0 ? null : (
                <table id="table1">
                  <tbody>
                    <tr>
                      <th
                        style={{
                          color: "#C4C4C4",
                          fontFamily: "Montserrat",
                          fontWeight: 500,
                        }}
                      >
                        Items
                      </th>
                      <th
                        style={{
                          color: "#C4C4C4",
                          fontFamily: "Montserrat",
                          fontWeight: 500,
                        }}
                      >
                        Description
                      </th>
                      <th
                        style={{
                          color: "#C4C4C4",
                          fontFamily: "Montserrat",
                          fontWeight: 500,
                        }}
                      >
                        Image
                      </th>
                      <th
                        style={{
                          color: "#C4C4C4",
                          fontFamily: "Montserrat",
                          fontWeight: 500,
                        }}
                      >
                        Quantity
                      </th>
                      <th
                        style={{
                          color: "#C4C4C4",
                          fontFamily: "Montserrat",
                          fontWeight: 500,
                        }}
                      >
                        Unit
                      </th>

                      {orderType == "Work Quotation" ||
                      orderType == "Material Quotation" ? (
                        <>
                          {quotationVendorMobile != null ? (
                            <th
                              style={{
                                backgroundColor: "white",
                                color: "#C4C4C4",
                                fontFamily: "Montserrat",
                                fontWeight: 500,
                              }}
                            >
                              Rate
                            </th>
                          ) : null}
                        </>
                      ) : (
                        <th
                          style={{
                            backgroundColor: "white",
                            color: "#C4C4C4",
                            fontFamily: "Montserrat",
                            fontWeight: 500,
                          }}
                        >
                          Rate
                        </th>
                      )}
                      <th
                        style={{
                          backgroundColor: "white",
                          color: "#C4C4C4",
                          fontFamily: "Montserrat",
                          fontWeight: 500,
                        }}
                      >
                        GST
                      </th>
                      {orderType == "Work Quotation" ||
                      orderType == "Material Quotation" ? null : (
                        <th
                          style={{
                            backgroundColor: "white",
                            color: "#C4C4C4",
                            fontFamily: "Montserrat",
                            fontWeight: 500,
                          }}
                        >
                          Amount
                        </th>
                      )}
                    </tr>
                  </tbody>
                  {selectedItems.map((item, index) => {
                    if (milestoneTobeAddedIndex.includes(index)) {
                      // write the code here
                      orderNo = orderNo + 1;
                      return (
                        <tbody key={index}>
                          <tr style={{ textAlign: "center" }} key={index}>
                            {"type" in item ||
                            ("workType" in item &&
                              item.workType == "Only Material") ? (
                              <td>{item.type || item.category}</td>
                            ) : (
                              <td>{item.category || item.vendorCategory}</td>
                            )}
                            {"type" in item ? (
                              <td>
                                <ContentEditable
                                  className="wrapInput"
                                  contentEditable
                                  html={
                                    item.specification
                                    // .replace(/<new-line>/g, "\n")
                                    // .replace(/<single-quote>/g, "'")
                                    // .replace(/<double-quote>/g, '"')
                                  }
                                  onChange={(e) => {
                                    if (selectedItemsNonEdited.length == 0) {
                                      let nonEditedSelectedItems = JSON.parse(
                                        JSON.stringify(selectedItems)
                                      );
                                      setSelectedItemsNonEdited(
                                        nonEditedSelectedItems
                                      );
                                    }

                                    let value = removeHTML(e.target.value)
                                      // let value = e.target.value
                                      .replaceAll("<div>", "")
                                      .replaceAll("</div>", "")
                                      .replaceAll("<br>", "")
                                      .replaceAll("</br>", "")
                                      .replaceAll("&amp;", "and ")
                                      .replaceAll("&nbsp;", " ")
                                      .replaceAll("'", "<single-quote>")
                                      .replaceAll('"', "<double-quote>");
                                    selectedItems[index].specification = value;
                                    setSelectedItems([...selectedItems]);
                                  }}
                                />
                              </td>
                            ) : (
                              <td>
                                <ContentEditable
                                  className="wrapInput"
                                  contentEditable
                                  html={item.description
                                    .replace(/<new-line>/g, "\n")
                                    .replace(/<single-quote>/g, "'")
                                    .replace(/<double-quote>/g, '"')}
                                  onChange={(e) => {
                                    if (selectedItemsNonEdited.length == 0) {
                                      let nonEditedSelectedItems = JSON.parse(
                                        JSON.stringify(selectedItems)
                                      );
                                      setSelectedItemsNonEdited(
                                        nonEditedSelectedItems
                                      );
                                    }
                                    let value = removeHTML(e.target.value)
                                      // let value = e.target.value
                                      .replaceAll("<div>", "")
                                      .replaceAll("</div>", "")
                                      .replaceAll("<br>", "")
                                      .replaceAll("</br>", "")
                                      .replaceAll("&amp;", "and ")
                                      .replaceAll("&nbsp;", " ")
                                      .replaceAll("'", "<single-quote>")
                                      .replaceAll('"', "<double-quote>");
                                    selectedItems[index].description = value;
                                    setSelectedItems([...selectedItems]);
                                  }}
                                />
                              </td>
                            )}

                            <td
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <input
                                id="img"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  let tempImageULS = [...imageULS];
                                  // tempImageULS[index] = (URL.createObjectURL(e.target.files[0]));
                                  // if (e.target.files[0]) {
                                  //   tempImageULS[item.OrderId] = {
                                  //     url: URL.createObjectURL(
                                  //       e.target.files[0]
                                  //     ),
                                  //   };
                                  // }
                                  tempImageULS[index] = e.target.files;
                                  setImageULS(tempImageULS);
                                  // this is where we have to write the code
                                  // checkImageUpload(e)
                                  // handleImageUpload(e)
                                }}
                                ref={imageUploader}
                                style={
                                  {
                                    // display: "none"
                                  }
                                }
                              />
                              <p style={{ marginLeft: "-6em" }} htmlFor="img">
                                {((imageULS &&
                                  imageULS[
                                    selectedItems[index]?.OrderId
                                  ]?.url?.substring(0, 20)) ||
                                  "") + "..." || ""}
                              </p>
                            </td>

                            <td>
                              <ContentEditable
                                className="wrapInput"
                                contentEditable
                                html={item.quantity}
                                onChange={(e) => {
                                  if (selectedItemsNonEdited.length == 0) {
                                    let nonEditedSelectedItems = JSON.parse(
                                      JSON.stringify(selectedItems)
                                    );
                                    setSelectedItemsNonEdited(
                                      nonEditedSelectedItems
                                    );
                                  }
                                  let value = e.target.value
                                    .replace(/(?!-)[^0-9.]/g, "")
                                    .replaceAll("<div>", "")
                                    .replaceAll("</div>", "")
                                    .replaceAll("<br>", "")
                                    .replaceAll("</br>", "")
                                    .replaceAll("&amp;", "and ")
                                    .replaceAll("&nbsp;", " ");
                                  selectedItems[index].quantity = value;
                                  setSelectedItems([...selectedItems]);

                                  // if (defaultMilestones[0].name == 'Type your milestone here') {
                                  //     // write the code here
                                  //     if (selectedItemsNonEdited.length == 0) {
                                  //         let nonEditedSelectedItems = JSON.parse(JSON.stringify(selectedItems))
                                  //         setSelectedItemsNonEdited(nonEditedSelectedItems)
                                  //     }
                                  //     let value = e.target.value.replace(/(?!-)[^0-9.]/g, "")
                                  //         .replaceAll('<div>', "")
                                  //         .replaceAll('</div>', "")
                                  //         .replaceAll('<br>', "")
                                  //         .replaceAll('</br>', "")
                                  //         .replaceAll('&amp;', "and ")
                                  //         .replaceAll('&nbsp;', " ")
                                  //     selectedItems[index].quantity = value
                                  //     setSelectedItems([...selectedItems]);
                                  // } else {
                                  //     confirmAlert({
                                  //         title: 'Editing quantity will clear the milestones',
                                  //         message: 'Do you want to continue?',
                                  //         buttons: [
                                  //             {
                                  //                 label: 'Yes', onClick: () => {
                                  //                     // setIsPreviewModalOpen(true);
                                  //                     setDefaultMilestones(defaultMilestonesState);
                                  //                 }
                                  //             },
                                  //             {
                                  //                 label: 'No', onClick: () => {
                                  //                     setSelectedItem(selectedItems);
                                  //                 }
                                  //             }
                                  //         ]
                                  //     })
                                  // }
                                }}
                              />
                            </td>
                            <td>
                              <ContentEditable
                                className="wrapInput"
                                contentEditable
                                html={item.unit}
                                onChange={(e) => {
                                  if (selectedItemsNonEdited.length == 0) {
                                    let nonEditedSelectedItems = JSON.parse(
                                      JSON.stringify(selectedItems)
                                    );
                                    setSelectedItemsNonEdited(
                                      nonEditedSelectedItems
                                    );
                                  }
                                  let value = e.target.value
                                    .replaceAll("<div>", "")
                                    .replaceAll("</div>", "")
                                    .replaceAll("<br>", "")
                                    .replaceAll("</br>", "")
                                    .replaceAll("&amp;", "and ")
                                    .replaceAll("&nbsp;", " ");
                                  selectedItems[index].unit = value;
                                  setSelectedItems([...selectedItems]);
                                }}
                              />
                            </td>
                            {orderType == "Work Quotation" ||
                            orderType == "Material Quotation" ? (
                              <>
                                {quotationVendorMobile != null ? (
                                  <td>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {"\u20B9 "}
                                      {quotationVendorMobile != null ? (
                                        item.rate
                                      ) : (
                                        <ContentEditable
                                          className="wrapInput"
                                          contentEditable
                                          html={item.rate}
                                          onChange={(e) => {
                                            if (
                                              selectedItemsNonEdited.length == 0
                                            ) {
                                              let nonEditedSelectedItems =
                                                JSON.parse(
                                                  JSON.stringify(selectedItems)
                                                );
                                              setSelectedItemsNonEdited(
                                                nonEditedSelectedItems
                                              );
                                            }
                                            let value = e.target.value
                                              .replaceAll("<div>", "")
                                              .replaceAll("</div>", "")
                                              .replaceAll("<br>", "")
                                              .replaceAll("</br>", "")
                                              .replaceAll("&amp;", "and ")
                                              .replaceAll("&nbsp;", " ");
                                            selectedItems[index].rate = value;
                                            setSelectedItems([
                                              ...selectedItems,
                                            ]);

                                            // if (defaultMilestones[0].name == 'Type your milestone here') {
                                            //     // write the code here
                                            //     if (selectedItemsNonEdited.length == 0) {
                                            //         let nonEditedSelectedItems = JSON.parse(JSON.stringify(selectedItems))
                                            //         setSelectedItemsNonEdited(nonEditedSelectedItems)
                                            //     }
                                            //     let value = e.target.value
                                            //         .replaceAll('<div>', "")
                                            //         .replaceAll('</div>', "")
                                            //         .replaceAll('<br>', "")
                                            //         .replaceAll('</br>', "")
                                            //         .replaceAll('&amp;', "and ")
                                            //         .replaceAll('&nbsp;', " ")
                                            //     selectedItems[index].rate = value;
                                            //     setSelectedItems([...selectedItems]);
                                            // } else {
                                            //     // write the code here
                                            //     confirmAlert({
                                            //         title: 'Editing rate will clear the milestones',
                                            //         message: 'Do you want to continue?',
                                            //         buttons: [
                                            //             {
                                            //                 label: 'Yes', onClick: () => {
                                            //                     // setIsPreviewModalOpen(true);
                                            //                     setDefaultMilestones(defaultMilestonesState);
                                            //                 }
                                            //             },
                                            //             {
                                            //                 label: 'No', onClick: () => {
                                            //                     setSelectedItem(selectedItems);
                                            //                 }
                                            //             }
                                            //         ]
                                            //     })
                                            // }
                                          }}
                                        />
                                      )}
                                    </div>
                                  </td>
                                ) : null}
                              </>
                            ) : (
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                  }}
                                >
                                  {"\u20B9 "}
                                  {quotationVendorMobile != null ? (
                                    item.rate
                                  ) : (
                                    <ContentEditable
                                      className="wrapInput"
                                      contentEditable
                                      html={item.rate}
                                      onChange={(e) => {
                                        if (
                                          selectedItemsNonEdited.length == 0
                                        ) {
                                          let nonEditedSelectedItems =
                                            JSON.parse(
                                              JSON.stringify(selectedItems)
                                            );
                                          setSelectedItemsNonEdited(
                                            nonEditedSelectedItems
                                          );
                                        }
                                        let value = e.target.value
                                          .replaceAll("<div>", "")
                                          .replaceAll("</div>", "")
                                          .replaceAll("<br>", "")
                                          .replaceAll("</br>", "")
                                          .replaceAll("&amp;", "and ")
                                          .replaceAll("&nbsp;", " ");
                                        selectedItems[index].rate = value;
                                        setSelectedItems([...selectedItems]);

                                        // if (defaultMilestones[0].name == 'Type your milestone here') {
                                        //     // writ th cod hr
                                        //     if (selectedItemsNonEdited.length == 0) {
                                        //         let nonEditedSelectedItems = JSON.parse(JSON.stringify(selectedItems))
                                        //         setSelectedItemsNonEdited(nonEditedSelectedItems)
                                        //     }
                                        //     let value = e.target.value
                                        //         .replaceAll('<div>', "")
                                        //         .replaceAll('</div>', "")
                                        //         .replaceAll('<br>', "")
                                        //         .replaceAll('</br>', "")
                                        //         .replaceAll('&amp;', "and ")
                                        //         .replaceAll('&nbsp;', " ")
                                        //     selectedItems[index].rate = value
                                        //     setSelectedItems([...selectedItems])
                                        // } else {
                                        //     // writ th cod hr
                                        //     confirmAlert({
                                        //         title: 'Editing rate will clear the milestones',
                                        //         message: 'Do you want to continue?',
                                        //         buttons: [
                                        //             {
                                        //                 label: 'Yes', onClick: () => {
                                        //                     // setIsPreviewModalOpen(true);
                                        //                     setDefaultMilestones(defaultMilestonesState);
                                        //                 }
                                        //             },
                                        //             {
                                        //                 label: 'No', onClick: () => {
                                        //                     setSelectedItem(selectedItems);
                                        //                 }
                                        //             }
                                        //         ]
                                        //     })
                                        // }
                                      }}
                                    />
                                  )}
                                </div>
                              </td>
                            )}

                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "center",
                                }}
                              >
                                <ContentEditable
                                  className="wrapInput"
                                  contentEditable
                                  html={item.gst}
                                  onChange={(e) => {
                                    if (selectedItemsNonEdited.length == 0) {
                                      let nonEditedSelectedItems = JSON.parse(
                                        JSON.stringify(selectedItems)
                                      );
                                      setSelectedItemsNonEdited(
                                        nonEditedSelectedItems
                                      );
                                    }

                                    let value = e.target.value
                                      .replaceAll("<div>", "")
                                      .replaceAll("</div>", "")
                                      .replaceAll("<br>", "")
                                      .replaceAll("</br>", "")
                                      .replaceAll("&amp;", "and ")
                                      .replaceAll("&nbsp;", " ");
                                    selectedItems[index].gst = value;
                                    setSelectedItems([...selectedItems]);

                                    // if (defaultMilestones[0].name == 'Type your milestone here') {
                                    //     // writ th cod hr
                                    //     if (selectedItemsNonEdited.length == 0) {
                                    //         let nonEditedSelectedItems = JSON.parse(JSON.stringify(selectedItems))
                                    //         setSelectedItemsNonEdited(nonEditedSelectedItems)
                                    //     }
                                    //     let value = e.target.value
                                    //         .replaceAll('<div>', "")
                                    //         .replaceAll('</div>', "")
                                    //         .replaceAll('<br>', "")
                                    //         .replaceAll('</br>', "")
                                    //         .replaceAll('&amp;', "and ")
                                    //         .replaceAll('&nbsp;', " ")
                                    //     selectedItems[index].gst = value;
                                    //     setSelectedItems([...selectedItems]);
                                    // } else {
                                    //     confirmAlert({
                                    //         title: 'Editing gst will clear the milestones',
                                    //         message: 'Do you want to continue?',
                                    //         buttons: [
                                    //             {
                                    //                 label: 'Yes', onClick: () => {
                                    //                     // setIsPreviewModalOpen(true);
                                    //                     setDefaultMilestones(defaultMilestonesState);
                                    //                 }
                                    //             },
                                    //             {
                                    //                 label: 'No', onClick: () => {
                                    //                     setSelectedItem(selectedItems);
                                    //                 }
                                    //             }
                                    //         ]
                                    //     })
                                    // }
                                  }}
                                />
                                %
                              </div>
                            </td>

                            {orderType == "Work Quotation" ||
                            orderType == "Material Quotation" ? null : (
                              <td>
                                {"\u20B9 "}{" "}
                                {(
                                  item["quantity"] * item["rate"] +
                                  item["quantity"] *
                                    item["rate"] *
                                    (item["gst"] / 100)
                                ).toFixed(2)}{" "}
                              </td>
                            )}
                            <td>
                              <div style={{ pointer: "cursor" }}>
                                <PopOverView
                                  position="left"
                                  component={
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 10,
                                        fontSize: 12,
                                        color: "grey",
                                        alignItems: "flex-start",
                                        width: 140,
                                      }}
                                    >
                                      {/* <div
                                    onMouseDown={(e) => {
                                      // console.log('Custom itm dit icon is clickd')
                                      // console.log('defaultMilestones : ', defaultMilestones)
                                      // console.log('defaultMilestones.length : ', defaultMilestones.length)
                                      if (defaultMilestones.length == 1) {
                                        if (defaultMilestones[0].name == "Type your milestone here") {
                                          // write the code here
                                          alert("Enter the milestones first");
                                        } else {
                                          e.stopPropagation();
                                          setCustomMilestones(true);
                                          setCurrentMilestoneTobeEditedIndex(index);
                                          record("@edit_custom_milestone_option_clicked");
                                        }
                                      } else {
                                        e.stopPropagation();
                                        setCustomMilestones(true);
                                        // console.log('milestoneTobeAddedIndex : ', milestoneTobeAddedIndex);
                                        setCurrentMilestoneTobeEditedIndex(index);
                                        record("@edit_custom_milestone_option_clicked");
                                      }
                                    }}
                                    className="menuItem"
                                  >
                                    Edit
                                  </div> */}
                                      <p
                                        className="menuItem"
                                        onMouseDown={(e) => {
                                          e.stopPropagation();
                                          selectedItems.splice(index, 1);
                                          setSelectedItems([...selectedItems]);
                                          // setImageULS((prev) => {
                                          //   delete prev[
                                          //     selectedItems[index].OrderId
                                          //   ];
                                          //   console.log(
                                          //     "deleint the image",
                                          //     selectedItems[index]
                                          //   );
                                          //   let temp = { ...prev };
                                          //   return temp;
                                          // });
                                          let tempmilestoneTobeAddedIndex = [
                                            ...milestoneTobeAddedIndex,
                                          ];
                                          let tempIndex =
                                            tempmilestoneTobeAddedIndex.indexOf(
                                              index
                                            );
                                          tempmilestoneTobeAddedIndex.splice(
                                            tempIndex,
                                            1
                                          );
                                          for (
                                            let item = tempIndex;
                                            item <
                                            tempmilestoneTobeAddedIndex.length;
                                            item++
                                          ) {
                                            // write the code here
                                            tempmilestoneTobeAddedIndex[item] =
                                              tempmilestoneTobeAddedIndex[
                                                item
                                              ] - 1;
                                          }
                                          setMilestoneTobeAddedIndex(
                                            tempmilestoneTobeAddedIndex
                                          );
                                          record(
                                            "@removed_selected_item_success",
                                            {
                                              description:
                                                "removed selected item success",
                                            }
                                          );

                                          // if (defaultMilestones[0].name == 'Type your milestone here') {
                                          //     // writ th cod hr
                                          //     e.stopPropagation();
                                          //     selectedItems.splice(index, 1);
                                          //     setSelectedItems([...selectedItems])
                                          //     let tempmilestoneTobeAddedIndex = [...milestoneTobeAddedIndex];
                                          //     let tempIndex = tempmilestoneTobeAddedIndex.indexOf(index);
                                          //     tempmilestoneTobeAddedIndex.splice(tempIndex, 1);
                                          //     for (let item = tempIndex; item < tempmilestoneTobeAddedIndex.length; item++) {
                                          //         // write the code here
                                          //         tempmilestoneTobeAddedIndex[item] = tempmilestoneTobeAddedIndex[item] - 1;
                                          //     }
                                          //     setMilestoneTobeAddedIndex(tempmilestoneTobeAddedIndex);
                                          //     record("@removed_selected_item_success", { description: "removed selected item success" })
                                          // } else {
                                          //     // writ th cod hr
                                          //     if (window.confirm('Editing quantity will clear the milestones')) {
                                          //         setDefaultMilestones(defaultMilestonesState);
                                          //     } else { }
                                          // }
                                        }}
                                      >
                                        Delete
                                      </p>
                                    </div>
                                  }
                                >
                                  <FiMoreHorizontal />
                                </PopOverView>
                              </div>
                            </td>
                            {/* <td
                                                    style={{ border: 'none', backgroundColor: 'white', cursor: 'pointer', justifyContent: 'center', alignItems: 'center', }}
                                                    onClick={() => {
                                                        setIsEditMilestoneDialogOpen(true)
                                                        setSelectedItem(item)
                                                        setCustomMilestones(JSON.parse(JSON.stringify(defaultMilestones)))
                                                        record("@edit_custom_milestone_option_clicked")
                                                    }}
                                                >
                                                    <abbr title='Set custom milestone'>
                                                        <FiEdit2 />
                                                    </abbr>
                                                </td>
                                                {
                                                    quotationVendorMobile != null ? null :
                                                        <td
                                                            style={{ border: 'none', backgroundColor: 'white', cursor: 'pointer', justifyContent: 'center', alignItems: 'center', }}
                                                            onClick={() => {
                                                                selectedItems.splice(index, 1);
                                                                setSelectedItems([...selectedItems])
                                                                record("@removed_selected_item_success", { description: "removed selected item success" })
                                                            }}
                                                        >
                                                            X
                                                        </td>
                                                } */}
                          </tr>
                        </tbody>
                      );
                    } else {
                    }
                  })}
                </table>
              )}
            </div>

            <div>
              {quotationVendorMobile != null ? null : (
                <div
                  style={{
                    border: `1px dashed ${
                      selectedItems.length > 0 ? "#C4C4C4" : "tomato"
                    }`,
                    borderRadius: "6px",
                    padding: 20,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "20px 0px",
                    gap: 40,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid #FDD34D",
                      padding: "10px 30px",
                      minWidth: "300px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setIsAddItemsFormOpen(true);

                      // if (defaultMilestones[0].name == 'Type your milestone here') {
                      //     // writ ht cod hr
                      //     setIsAddItemsFormOpen(true)
                      // } else {
                      //     if (window.confirm('Editing quantity will clear the milestones')) {
                      //         setDefaultMilestones(defaultMilestonesState);
                      //     } else {
                      //         console.log('Sooner or later You will be dead');
                      //     }
                      // }
                    }}
                  >
                    <p>Add new item *</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid #FDD34D",
                      padding: "10px 30px",
                      minWidth: "300px",
                      cursor: "pointer",
                    }}
                    onClick={() => setIsUnreleasedItemsFormOpen(true)}
                  >
                    <p>Select from unreleased items *</p>
                  </div>
                </div>
              )}

              <Dialog
                open={isAddItemsFormOpen}
                onClose={() => setIsAddItemsFormOpen(false)}
              >
                <AddItemsForm
                  handleClose={() => {
                    setIsAddItemsFormOpen(false);
                  }}
                  data={data}
                  sendItems={(itemsReceived) => {
                    console.log("Items Received : ", itemsReceived);
                    console.log("defaultMilestones : ", defaultMilestones);
                    itemsReceived = itemsReceived.map((item) => ({
                      ...item,
                      milestones: defaultMilestones,
                    }));
                    console.log("itemsReceived : ", itemsReceived);
                    // itemsReceived['milestones'] = defaultMilestones;
                    console.log("Adding new Item");
                    console.log("selectedItems : ", selectedItems);
                    let totalItems = selectedItems.concat(itemsReceived);
                    console.log("selectedItems : ", totalItems);
                    setSelectedItems(totalItems);
                    let totalAddedItems = addedItems.concat(itemsReceived);
                    setAddedItems(totalAddedItems);
                  }}
                  orderType={orderType}
                  addedItems={addedItems}
                />
              </Dialog>
              <Dialog
                open={isUnreleasedItemsFormOpen}
                onClose={() => setIsUnreleasedItemsFormOpen(false)}
              >
                <UnreleasedItemsForm
                  handleClose={() => {
                    setIsUnreleasedItemsFormOpen(false);
                  }}
                  sendItems={(itemsReceived) => {
                    itemsReceived = itemsReceived.map((item) => ({
                      ...item,
                      milestones: defaultMilestones,
                    }));
                    let totalItems = selectedItems.concat(itemsReceived);
                    setSelectedItems(totalItems);
                  }}
                  data={data}
                  orderType={orderType}
                  sendCheckedWorks={(checkedWorksReceived) => {
                    let totalCheckedWorks =
                      checkedWorks.concat(checkedWorksReceived);
                    setCheckedWorks(totalCheckedWorks);
                  }}
                  selectedItems={selectedItems}
                />
              </Dialog>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div
            style={{ display: "flex", width: "100%", flexDirection: "column" }}
          >
            <div
              style={{
                padding: 5,
                backgroundColor: "#FDD34D",
                borderStyle: "none",
                borderWidth: "1",
                borderTopRightRadius: 3,
                borderTopLeftRadius: 3,
                opacity: "0.5",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "space-between",
                padding: 10,
                gap: 20,
                backgroundColor: "#FCFCFC",
              }}
            >
              <p
                style={{
                  color: "#353535",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Contact Person & Site Engineer Details
              </p>
              <p style={{ color: "#353535", fontWeight: "600" }}>
                Contact Person
              </p>
              <TextArea
                placeholder={"Contact Person Name *"}
                value={contactPersonName}
                onChange={(text) => setContactPersonName(text)}
                autoFocus={contactPersonNameRef}
                suggestions={true}
                suggestionOptions={poSuggestions.map((item) =>
                  item.ContactPersonName.replace(/<new-line>/g, "\n")
                    .replace(/<single-quote>/g, "'")
                    .replace(/<double-quote>/g, '"')
                )}
              />
              <TextArea
                placeholder={"Contact Person Number *"}
                value={contactPersonNumber}
                onChange={(text) =>
                  setContactPersonNumber(text.replace(/[^0-9]+/gm, ""))
                }
                autoFocus={contactPersonNumberRef}
                suggestions={true}
                suggestionOptions={poSuggestions.map((item) =>
                  item.ContactPersonNumber.replace(/<new-line>/g, "\n")
                    .replace(/<single-quote>/g, "'")
                    .replace(/<double-quote>/g, '"')
                )}
              />
              <p style={{ color: "#353535", fontWeight: "600" }}>
                Site Engineer
              </p>
              <Input
                placeholder={"Site Engineer Name *"}
                value={siteEngineerDetails.siteEngineerName}
                onChange={(text) => {
                  // setSiteEngineerName(text)

                  setSiteEngineerDetails((prev) => ({
                    ...prev,
                    siteEngineerName: text,
                  }));
                }}
                placeHolderAlwaysOnTop={true}
                autoFocus={siteEngineerNameRef}
              />
              <Input
                placeholder={"Site Engineer Number *"}
                value={siteEngineerDetails.siteEngineerNumber}
                onChange={(text) => {
                  // setSiteEngineerNumber(text.replace(/[^0-9]+/gm, ""))
                  setSiteEngineerDetails((prev) => ({
                    ...prev,
                    siteEngineerNumber: text.replace(/[^0-9]+/gm, ""),
                  }));
                }}
                placeHolderAlwaysOnTop={true}
                autoFocus={siteEngineerNumberRef}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  padding: 5,
                  backgroundColor: "#FDD34D",
                  borderStyle: "none",
                  borderWidth: "1",
                  borderTopRightRadius: 3,
                  borderTopLeftRadius: 3,
                  opacity: "0.5",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "space-between",
                  padding: 10,
                  gap: 20,
                  backgroundColor: "#FCFCFC",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <p style={{ color: "#353535" }}>Basic value</p>
                  <Input
                    value={selectedItems.reduce(
                      (total, item) =>
                        Number(total) +
                        Number(
                          (
                            Number(item["quantity"] * item["rate"]) +
                            Number(
                              item["quantity"] *
                                item["rate"] *
                                (item["gst"] / 100)
                            )
                          ).toFixed(2)
                        ),
                      0
                    )}
                    disabled
                    hideRedLine
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <p style={{ color: "#353535" }}>Discount</p>
                  <Input
                    value={discount}
                    onChange={(text) => {
                      if (text <= 100) {
                        setDiscount(text.replace(/[^0-9.]+/gm, ""));
                      }
                    }}
                    hideRedLine
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <p style={{ color: "#353535", fontWeight: "bold" }}>
                    Total value including Taxes and Duties
                  </p>
                  <Input value={totalAmount} disabled />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  padding: 5,
                  backgroundColor: "#FDD34D",
                  borderStyle: "none",
                  borderWidth: "1",
                  borderTopRightRadius: 3,
                  borderTopLeftRadius: 3,
                  opacity: "0.5",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10,
                  gap: 20,
                  backgroundColor: "#FCFCFC",
                }}
              >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="Start Date"
                    format="dd/MM/yyyy"
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    KeyboardButtonProps={{ "aria-label": "change date" }}
                    disablePast={draft || FromReleasedItem ? false : true}
                  />
                </MuiPickersUtilsProvider>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="End Date"
                    format="dd/MM/yyyy"
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    KeyboardButtonProps={{ "aria-label": "change date" }}
                    minDate={new Date(startDate)}
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div
            style={{ display: "flex", width: "100%", flexDirection: "column" }}
          >
            <div
              style={{
                padding: 5,
                backgroundColor: "#FDD34D",
                borderStyle: "none",
                borderWidth: "1",
                borderTopRightRadius: 3,
                borderTopLeftRadius: 3,
                opacity: "0.5",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "space-between",
                padding: 10,
                gap: 20,
                backgroundColor: "#FCFCFC",
              }}
            >
              <p
                style={{
                  color: "#353535",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Vendor Details
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <DropDown
                  data={vendors}
                  value={vendorMobile}
                  onChange={(value) =>
                    value == "Show All Vendors"
                      ? setShowAllVendors(true)
                      : setVendorMobile(value)
                  }
                  disabled={quotationVendorMobile != null}
                />
                {quotationVendorMobile != null ? null : (
                  <AddVendor
                    getIsVendorModalClosed={(itemReceived) => {
                      itemReceived && getVendors();
                    }}
                  />
                )}
              </div>
              {vendorMobile == null ||
              vendorMobile == "null" ||
              vendorMobile == "Open Vendor" ||
              quotationVendorMobile != null ? null : (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <TextArea
                      placeholder={"Name"}
                      value={vendorMobile.split(":")[0].trim()}
                      disabled
                      hideRedLine
                    />
                    <TextArea
                      placeholder={"Contact Number"}
                      value={vendorMobile.split(":")[1].trim()}
                      disabled
                      hideRedLine
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <TextArea
                      placeholder={"Firm Name"}
                      value={vendorFirm}
                      onChange={(text) => setVendorFirm(text)}
                      hideRedLine
                      disabled
                    />
                    <TextArea
                      placeholder={"Vendor Company Name"}
                      value={vendorCompanyName}
                      onChange={(text) => setVendorCompanyName(text)}
                      hideRedLine
                      disabled
                    />
                  </div>

                  <TextArea
                    placeholder={"GSTIN"}
                    value={vendorGSTIN}
                    onChange={(text) => setVendorGSTIN(text)}
                    hideRedLine
                  />
                  <p style={{ color: "#353535", fontWeight: "600" }}>Address</p>
                  <TextArea
                    placeholder={"Address"}
                    value={vendorAddress || ""}
                    onChange={(text) => setVendorAddress(text)}
                    hideRedLine
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <TextArea
                      placeholder={"Pin Code"}
                      value={vendorPinCode || ""}
                      onChange={(text) => setVendorPinCode(text)}
                      hideRedLine
                    />
                    <TextArea
                      placeholder={"City"}
                      value={vendorCity}
                      onChange={(text) => setVendorCity(text)}
                      hideRedLine
                    />
                    <TextArea
                      placeholder={"State"}
                      value={vendorState}
                      onChange={(text) => setVendorState(text)}
                      hideRedLine
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  padding: 5,
                  backgroundColor: "#FDD34D",
                  borderStyle: "none",
                  borderWidth: "1",
                  borderTopRightRadius: 3,
                  borderTopLeftRadius: 3,
                  opacity: "0.5",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "space-between",
                  padding: 10,
                  gap: 20,
                  backgroundColor: "#FCFCFC",
                }}
              >
                <p
                  style={{
                    color: "#353535",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Terms & Conditions
                </p>
                <TextArea
                  placeholder={"Enter T&C"}
                  value={termsAndConditions}
                  onChange={(text) => setTermsAndConditions(text)}
                  suggestions={true}
                  suggestionOptions={poSuggestions.map((item) =>
                    item.TermsandConditions.replace(/<new-line>/g, "\n")
                      .replace(/<single-quote>/g, "'")
                      .replace(/<double-quote>/g, '"')
                  )}
                  hideRedLine
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              padding: 5,
              backgroundColor: "#FDD34D",
              borderStyle: "none",
              borderWidth: "1",
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
              opacity: "0.5",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "space-between",
              padding: 10,
              gap: 20,
              backgroundColor: "#FCFCFC",
            }}
          >
            <p
              style={{
                color: "#353535",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Overall Payment Terms
            </p>

            <TextArea
              placeholder={"Enter Terms"}
              value={paymentTerms}
              onChange={(text) => setPaymentTerms(text)}
              hideRedLine
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              padding: 5,
              backgroundColor: "#FDD34D",
              borderStyle: "none",
              borderWidth: "1",
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
              opacity: "0.5",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 10,
              gap: 20,
              backgroundColor: "#FCFCFC",
            }}
          >
            <p
              style={{
                color: "#353535",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Special Instructions
            </p>

            <TextArea
              placeholder={"Enter Instructions"}
              value={specialInstructions}
              onChange={(text) => setSpecialInstructions(text)}
              suggestions={true}
              suggestionOptions={poSuggestions.map((item) =>
                item.SpecialInstructions.replace(/<new-line>/g, "\n")
                  .replace(/<single-quote>/g, "'")
                  .replace(/<double-quote>/g, '"')
              )}
              hideRedLine
            />

            <p
              style={{
                color: "#353535",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Details
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
              }}
            >
              {/* <TextArea
                placeholder={"Price Base"}
                value={priceBase}
                onChange={(text) => setPriceBase(text)}
                suggestions={true}
                suggestionOptions={poSuggestions.map((item) =>
                  item.SpecialInstructions.replace(/<new-line>/g, "\n")
                    .replace(/<single-quote>/g, "'")
                    .replace(/<double-quote>/g, '"')
                )}
                hideRedLine
              /> */}
              <div>
                <TextArea
                  placeholder={"Freight"}
                  value={freight}
                  onChange={(text) => {
                    // (isNaN(Number(freight)) ? 0 : Number(freight))
                    // if (isNaN(Number(text))) {
                    setFreight(text);
                    // } else {
                    //   let minGSTinItems = 101;
                    //   for (let i = 0; i < selectedItems.length; i++) {
                    //     if (Number(selectedItems[i].gst) < minGSTinItems) {
                    //       minGSTinItems = Number(selectedItems[i].gst);
                    //     }
                    //   }
                    //   console.log("minGst in items");
                    //   setFreight(
                    //     `${Number(text) + Number((text * minGSTinItems) / 100)}`
                    //   );
                    // }
                  }}
                  suggestions={true}
                  suggestionOptions={poSuggestions.map((item) =>
                    item.SpecialInstructions.replace(/<new-line>/g, "\n")
                      .replace(/<single-quote>/g, "'")
                      .replace(/<double-quote>/g, '"')
                  )}
                  hideRedLine
                />
                {/* <p>Min. GST of line items will be used</p> */}
              </div>

              <TextArea
                placeholder={"Insurance"}
                value={insurance}
                onChange={(text) => setInsurance(text)}
                suggestions={true}
                suggestionOptions={poSuggestions.map((item) =>
                  item.SpecialInstructions.replace(/<new-line>/g, "\n")
                    .replace(/<single-quote>/g, "'")
                    .replace(/<double-quote>/g, '"')
                )}
                hideRedLine
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <div
              style={{
                padding: 5,
                backgroundColor: "#FDD34D",
                borderStyle: "none",
                borderWidth: "1",
                borderTopRightRadius: 3,
                borderTopLeftRadius: 3,
                opacity: "0.5",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 10,
                gap: 20,
                backgroundColor: "#FCFCFC",
              }}
            >
              <p
                style={{
                  color: "#353535",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Ship To Address
              </p>
              <TextArea
                placeholder={"Shipping Address *"}
                value={shippingAddress}
                onChange={(text) => setShippingAddress(text)}
                autoFocus={shippingAddressRef}
              />
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <div
              style={{
                padding: 5,
                backgroundColor: "#FDD34D",
                borderStyle: "none",
                borderWidth: "1",
                borderTopRightRadius: 3,
                borderTopLeftRadius: 3,
                opacity: "0.5",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 10,
                gap: 20,
                backgroundColor: "#FCFCFC",
              }}
            >
              <p
                style={{
                  color: "#353535",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Bill To Address
              </p>
              <TextArea
                placeholder={"Billing Address *"}
                value={billingAddress}
                onChange={(text) => setBillingAddress(text)}
                suggestions={true}
                suggestionOptions={poSuggestions.map((item) =>
                  item.BillingAddress.replace(/<new-line>/g, "\n")
                    .replace(/<single-quote>/g, "'")
                    .replace(/<double-quote>/g, '"')
                )}
                autoFocus={billingAddressRef}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              color: "grey",
            }}
          >
            <p
              style={{ cursor: "pointer" }}
              onClick={() => {
                fileDialog().then(async (files) => {
                  handleFileUpload(files);
                });
              }}
            >
              <FiPaperclip size={15} style={{ marginRight: 10 }} />
              Add Attachments
            </p>
            {attachments.map((item, index) => (
              <div key={index}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.name}
                </a>
                <button onClick={() => handleDeleteAttachment(index)}>
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {firmSignature == "" ? (
              <p>
                No signature found! Save your firm signature in suggestive
                items.
              </p>
            ) : (
              <>
                <img
                  src={firmSignature.url}
                  style={{ width: 100, height: 100 }}
                />
                Signature
              </>
            )}
          </div>
        </div>

        <div
          style={{
            paddingBottom: "40px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            gap: 20,
          }}
        >
          {!FromReleasedItem && (
            <Button
              invert
              content={draftId ? `Update Draft` : `Save as Draft`}
              onClick={() => {
                draftId ? updateDraft() : saveDraft();
              }}
            />
          )}
          {/* {FromReleasedItem ? 
          <Button 
            content="Preview & Re-Release"
            onClick={()=>{

            }}
          /> :  */}
          {orderType == "Work Quotation" ||
          orderType == "Material Quotation" ? (
            ""
          ) : (
            <Button
              invert
              // style={{flex: " 0.75 1"}}
              content={"Send for Approval"}
              onClick={() => {
                setIsApproval(true);
                // selectedItems?.length - Object.keys(imageULS).length === 0
                if (isMandatoryImages.current) {
                  // if((imageULS?.filter(item => item != null).length === selectedItems?.length)){
                  // console.log(Object.values(imageULS));
                  // console.log(
                  //   selectedItems.length,
                  //   selectedItems.length -
                  //     Object.values(imageULS).filter((item) => item !== null)
                  //       .length
                  // );
                  if (
                    selectedItems?.length -
                      Object.values(imageULS).filter((item) => item !== null)
                        .length ===
                    0
                  ) {
                    previewHandler();
                  } else {
                    toast.error("Please Upload all Images!", {
                      duration: 4000,
                      position: "bottom-center",
                      style: {
                        borderRadius: "8px",
                        padding: "16px",
                        color: "#E72424",
                        backgroundColor: "#FEF0F0",
                        maxWidth: "100%",
                      },
                      icon: <FiInfo color={"#E72424"} />,
                    });
                  }
                } else {
                  previewHandler();
                }
                // previewHandler()
              }}
            />
          )}
          <Button
            content={"Preview & Release"}
            onClick={() => {

              if (isMandatoryImages.current) {
                if (
                  selectedItems?.length -
                    Object.values(imageULS).filter((item) => item !== null)
                      .length ===
                  0
                ) {
                  previewHandler();
                } else {
                  toast.error("Please Upload all Images!", {
                    duration: 4000,
                    position: "bottom-center",
                    style: {
                      borderRadius: "8px",
                      padding: "16px",
                      color: "#E72424",
                      backgroundColor: "#FEF0F0",
                      maxWidth: "100%",
                    },
                    icon: <FiInfo color={"#E72424"} />,
                  });
                }
              } else {
                previewHandler();
              }
            }}
          />
          {/* } */}

          <Dialog
            open={isPreviewModalOpen}
            onClose={() => {
              setIsPreviewModalOpen(false);
              setIsApproval(false);
            }}
            fullWidth
            maxWidth="md"
          >
            <Preview
              handleClose={() => {
                setIsPreviewModalOpen(false);
                // setIsApproval(false);
              }}
              isApproval={isApproval}
              orderType={orderType}
              selectedItems={selectedItems}
              contactPersonName={contactPersonName}
              contactPersonNumber={contactPersonNumber}
              siteEngineerName={siteEngineerDetails.siteEngineerName}
              siteEngineerNumber={siteEngineerDetails.siteEngineerNumber}
              discount={discount}
              totalAmount={totalAmount}
              startDate={startDate}
              endDate={endDate}
              vendorMobile={vendorMobile}
              // vendorFirm={vendorFirm}
              vendorFirm={vendorCompanyName}
              vendorGSTIN={vendorGSTIN}
              vendorAddress={vendorAddress}
              vendorPinCode={vendorPinCode}
              vendorCity={vendorCity}
              vendorState={vendorState}
              termsAndConditions={termsAndConditions}
              paymentTerms={paymentTerms}
              specialInstructions={specialInstructions}
              priceBase={priceBase}
              freight={freight}
              insurance={insurance}
              shippingAddress={shippingAddress}
              billingAddress={billingAddress}
              firmName={firmName}
              firmAddress={firmAddress}
              firmPhoneNumber={firmPhoneNumber}
              firmGSTIN={firmGSTIN}
              firmContactPersonName={firmContactPersonName}
              firmContactPersonNumber={firmContactPersonNumber}
              firmContactPersonEmail={firmContactPersonEmail}
              firmSignature={firmSignature}
              attachments={attachments}
              releaseOpportunityQuotation={() => {
                if (FromReleasedItem) {
                  // console.log("from released rerelease the order ");
                  reReleaseOrder();
                } else {
                  orderType == "Purchase Order" || orderType == "Work Order"
                    ? makeOpportunity()
                    : makeQuotation();
                }
              }}
              milestoneTobeAddedIndex={milestoneTobeAddedIndex}
              imageULS={imageULS}
              // clientName={clientName}
              setIsUpdatingProgress={setIsUpdatingProgress}
              totalPaidAmountReleasedOrder={totalPaidAmountReleasedOrder}
              defaultMilestones={defaultMilestones}
              ImagesObjectFetchedFromFirebase={imagesFromFirebase}
            />
          </Dialog>
          <Dialog
            open={isSuccessPageOpen}
            onClose={() => {
              setIsApproval(false);
              setIsSuccessPageOpen(false);
              history.push("/ReleasedOrders/" + data.ProjectId, {
                data: data,
              });
            }}
            maxWidth="md"
          >
            <SuccessPage
              isApproval={isApproval}
              info={data}
              activeCategory={activeCategory}
              selectedItems={selectedItems}
              orderType={orderType}
            />
          </Dialog>
        </div>
      </div>

      {customMilestones && (
        <AddCustomMilestones
          customMilestones={customMilestones}
          setCustomMilestones={setCustomMilestones}
          currentMilestoneTobeEditedIndex={currentMilestoneTobeEditedIndex}
          selectedItems={selectedItems}
          defaultMilestones={defaultMilestones}
          setSelectedItems={setSelectedItems}
          milestoneTobeAddedIndex={milestoneTobeAddedIndex}
          setMilestoneTobeAddedIndex={setMilestoneTobeAddedIndex}
        />
      )}

      {showAllVendors && (
        <AllVendors
          getBankAccountDetails={getBankAccountDetails}
          showAllVendors={showAllVendors}
          setShowAllVendors={setShowAllVendors}
          allVendorData={allVendorData}
          setVendorMobile={setVendorMobile}
        />
      )}

      {showPaymentTerms && (
        <PaymentTerms
          defaultMilestones={defaultMilestones}
          totalAmount={totalAmount}
          showPaymentTerms={showPaymentTerms}
          setShowPaymentTerms={setShowPaymentTerms}
          selectedItems={selectedItems}
          // setTheValueOfDefaultMilestones={setTheValueOfDefaultMilestones}
          setTheValueOfDefaultMilestones={(itemsReceived) => {
            // console.log("itemsReceived", itemsReceived);
            setDefaultMilestones(itemsReceived);
            milestonesForCalculation.current = itemsReceived;
            // let tempSelectedItems = [...selectedItems]
            // console.log('tempSelectedItems before :>> ', tempSelectedItems);
            // tempSelectedItems.map((item) => ({ ...item, milestones: itemsReceived }))
            // console.log('tempSelectedItems after :>> ', tempSelectedItems);
            // setSelectedItems(tempSelectedItems)
          }}
          totalPaidAmountReleasedOrder={totalPaidAmountReleasedOrder.value}
          setTotalPaidAmountReleasedOrder={setTotalPaidAmountReleasedOrder}
          VendorDetailsSelected={VendorDetailsSelected}
        />
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: 999555555 }}
        open={isUpdatingProgress}
        // onClick={}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {isMandatoryImages.current && orderType === "Purchase Order" ? (
        <div
          style={{
            position: "fixed",
            background:
              selectedItems?.length -
                Object.values(imageULS).filter((item) => item !== null)
                  .length ===
              0
                ? "darkseagreen"
                : "red",
            left: "60px",
            top: "96vh",
            height: "4vh",
            width: "calc(100vw - 60px)",
            textAlign: "center",
          }}
        >
          {
            // console.log('imagesurl s',imageULS),
            selectedItems?.length -
              Object.values(imageULS).filter((item) => {
                // console.log(item, "itme", item && Object.keys(item));
                return item !== null && item && Object.keys(item)?.length !== 0;
              }).length ===
            0 ? (
              <p style={{ fontWeight: "600", padding: "0.3em" }}>
                <TiTick style={{ margin: "-1px" }} /> All Images Uploaded
              </p>
            ) : (
              <p
                style={{ fontWeight: "600", padding: "0.3em", color: "white" }}
              >
                {" "}
                <AiOutlineExclamationCircle style={{ margin: "-1px" }} />{" "}
                {selectedItems?.length -
                  Object.values(imageULS).filter(
                    (item) => item !== null && item && item?.length !== 0
                  ).length}{" "}
                Pending image to upload and{" "}
                {
                  Object.values(imageULS).filter(
                    (item) =>
                      item !== null && item && Object.keys(item)?.length !== 0
                  ).length
                }{" "}
                uploaded{" "}
              </p>
            )
          }
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default drawerTemplate1(OrdersQuotations);
