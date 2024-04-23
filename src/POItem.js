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

const POItem = ({
  item,
  getPoByOrderId,
  imageStates,
  poReqMilestone,
  lastObjectState,
}) => {
  console.log("po milestaone", poReqMilestone);

  console.log("i am last", lastObjectState);


  useEffect(() => {
    let highlightTimer = setTimeout(() => {
      let textarea = (elem, regex) => {
        for (let i = 0; i < elem.length; i++) {
          elem[i].innerHTML = elem[i].innerHTML.replace(regex, "<b>$&</b>");
        }
      };
      textarea(
        document.querySelectorAll(".desc-highlight-brand-released-orders"),
        /@[a-zA-Z]{1,}/g
      );
    }, 0);

    return () => clearTimeout(highlightTimer);
  });

  const olderverions =
    JSON.parse(item?.OlderVersions) !== "null" &&
    JSON.parse(item?.OlderVersions) !== null &&
    JSON.parse(item?.OlderVersions);

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
        // fetchPO()
        // setIsLoading(false)
        // setIsOnline(true)
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
    onCloseModalHandler();
  };

  const [milestoneTobeAddedIndex, setMilestoneTobeAddedIndex] = useState([]);

  var orderNo = 0;
  var commonMilestonesIndex = 0;
  var commonMilestoneAmount =
    (!isNaN(item.freight) ? item.freight : 0) -
    (item?.discount > 0 ? Number(item?.discount) : 0);
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
                    {/* {imageStates.every((img) => img != null )  ? <th style={{ backgroundColor: "#fff6db" }}>Image</th> : ''} */}
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
                            {/* : '' } */}

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

            {window.innerWidth > 600 ? (
              <table
                id="table"
                style={{ fontSize: "13px", width: "80%", marginTop: "30px" }}
              >
                <tbody>
                  <tr>
                    <th style={{ backgroundColor: "#fff6db" }}>
                      Payment Milestones
                    </th>
                    <th style={{ backgroundColor: "#fff6db" }}>%</th>
                    <th style={{ backgroundColor: "#fff6db" }}>Amount</th>
                  </tr>

                  {item?.CommonMilestones
                    ? JSON.parse(item.CommonMilestones).map((mItem, mIndex) => (
                        <tr key={mIndex}>
                          <td
                            style={{
                              fontSize: 12,
                              width: "40%",
                              textAlign: "center",
                            }}
                          >
                            {mItem.name}
                          </td>
                          <td
                            style={{
                              fontSize: 12,
                              width: "20%",
                              textAlign: "center",
                            }}
                          >
                            {mItem.percentage} %
                          </td>
                          <td
                            style={{
                              fontSize: 12,
                              width: "30%",
                              textAlign: "center",
                            }}
                          >
                            {"\u20B9 "}
                            {Number(mItem.totalAmount).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    : item.discription &&
                      JSON.parse(item.discription)[
                        commonMilestonesIndex
                      ].milestones.map((mItem, mIndex) => (
                        <tr key={mIndex}>
                          <td
                            style={{
                              fontSize: 12,
                              width: "40%",
                              textAlign: "center",
                            }}
                          >
                            {mItem.name}
                          </td>
                          <td
                            style={{
                              fontSize: 12,
                              width: "20%",
                              textAlign: "center",
                            }}
                          >
                            {mItem.percentage} %
                          </td>
                          <td
                            style={{
                              fontSize: 12,
                              width: "30%",
                              textAlign: "center",
                            }}
                          >
                            {"\u20B9 "}
                            {(
                              item.totalAmount *
                              (mItem.percentage / 100)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            ) : (
              <div
                style={{ fontSize: "13px", width: "80%", marginTop: "30px" }}
              >
                <div>
                  <div
                    style={{
                      backgroundColor: "#fff6db",
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px 10px",
                    }}
                  >
                    <div>Payment Milestones</div>
                    <div>%</div>
                    <div>Amount</div>
                  </div>

                  {item?.CommonMilestones
                    ? JSON.parse(item.CommonMilestones).map((mItem, mIndex) => (
                        <div
                          key={mIndex}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "5px 10px",
                          }}
                        >
                          <div style={{ width: "40%", textAlign: "center" }}>
                            {mItem.name}
                          </div>
                          <div style={{ width: "20%", textAlign: "center" }}>
                            {mItem.percentage} %
                          </div>
                          <div style={{ width: "30%", textAlign: "right" }}>
                            {"\u20B9 "} {Number(mItem.totalAmount).toFixed(2)}
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
                            justifyContent: "space-between",
                            padding: "5px 10px",
                          }}
                        >
                          <div style={{ width: "40%", textAlign: "center" }}>
                            {mItem.name}
                          </div>
                          <div style={{ width: "20%", textAlign: "center" }}>
                            {mItem.percentage} %
                          </div>
                          <div style={{ width: "30%", textAlign: "right" }}>
                            {"\u20B9 "}{" "}
                            {(
                              item.totalAmount *
                              (mItem.percentage / 100)
                            ).toFixed(2)}
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            )}

            <br></br>

            {item.bankDetails ? (
              <div
                className="order-details-container"
                style={{ background: "#f1f1f1" }}
              >
                <div className="left-pan-container">
                  <p style={{ fontWeight: "bold" }}>Bank Details</p>

                  <div className="details">
                    <p style={{ fontWeight: "bold" }}>Vendor Firm:&nbsp; </p>
                    <p>
                      {item.vendorFirm == null || item.vendorFirm == "null"
                        ? "-"
                        : item.vendorFirm}
                    </p>
                  </div>

                  <div className="details">
                    <p style={{ fontWeight: "bold" }}>
                      Account Holder Name:&nbsp;{" "}
                    </p>
                    {item?.bankDetails ? (
                      <div>
                        <p>
                          {(() => {
                            try {
                              return JSON.parse(item.bankDetails)
                                .AccountHolderName;
                            } catch (error) {
                              return "-";
                            }
                          })()}
                        </p>
                      </div>
                    ) : null}
                  </div>
                  <div className="details">
                    <p style={{ fontWeight: "bold" }}>Account Number:&nbsp;</p>
                    {item?.bankDetails ? (
                      <div>
                        <p>
                          {(() => {
                            try {
                              return JSON.parse(item.bankDetails).AccountNumber;
                            } catch (error) {
                              return "-";
                            }
                          })()}
                        </p>
                      </div>
                    ) : (
                      <p
                        className="order-details-container"
                        style={{ background: "#f1f1f1" }}
                      >
                        No bank details available
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="right-pan-container"
                  style={{ justifyContent: "flex-start", paddingTop: "46px" }}
                >
                  <div className="details">
                    <p style={{ fontWeight: "bold" }}>IFSC Code: &nbsp; </p>
                    {item?.bankDetails ? (
                      <div>
                        <p>
                          {(() => {
                            try {
                              return JSON.parse(item.bankDetails).IFSC;
                            } catch (error) {
                              return "-";
                            }
                          })()}
                        </p>
                      </div>
                    ) : null}
                  </div>
                  <div className="details">
                    <p style={{ fontWeight: "bold" }}>PAN Number: &nbsp; </p>
                    {item?.bankDetails ? (
                      <div>
                        <p>
                          {(() => {
                            try {
                              return JSON.parse(item.bankDetails).PAN;
                            } catch (error) {
                              return "-";
                            }
                          })()}
                        </p>
                      </div>
                    ) : null}
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
              </div>
            ) : (
              <p>No bank details available</p>
            )}

            <br></br>

            <div className="common-milestones-container">
              {console.log("heeloo po amtx")}
              <p style={{ fontWeight: "bold" }}>
                Payment Details (Total Amount: {"\u20B9"}{" "}
                {lastObjectState?.totalAmount}, Total Requested Amount:{" "}
                {"\u20B9"} {lastObjectState?.requestedAmount}, Total Paid
                Amount: {"\u20B9"} {lastObjectState?.totalPaidAmount})
              </p>

              {window.innerWidth > 600 ? (
                <table
                  id="table"
                  style={{ fontSize: "13px", width: "100%", marginTop: "30px" }}
                >
                  <tbody>
              
                      <tr>
                        <th style={{ backgroundColor: "#fff6db" }}>
                          Payment Milestones
                        </th>
                        <th style={{ backgroundColor: "#fff6db" }}>
                          Total Amount
                        </th>
                        <th style={{ backgroundColor: "#fff6db" }}>
                          Requested Amount
                        </th>
                        <th style={{ backgroundColor: "#fff6db" }}>
                          Total Paid Amount
                        </th>
                        <th style={{ backgroundColor: "#fff6db" }}>
                          UTR Details
                        </th>
                        <th style={{ backgroundColor: "#fff6db" }}>Status</th>
                      </tr>
                

                    {poReqMilestone &&
                      poReqMilestone.map((item, index) => (
                        <tr key={index}>
                          <td style={{ fontSize: 12, textAlign: "center" }}>
                            {item.paymentMilestoneName?.name}
                          </td>
                          <td style={{ fontSize: 12, textAlign: "center" }}>
                            {"\u20B9 "}
                            {item.paymentMilestoneName?.totalAmount}
                          </td>
                          <td style={{ fontSize: 12, textAlign: "center" }}>
                            {"\u20B9 "}
                            {item.requestedAmount}
                          </td>
                          <td style={{ fontSize: 12, textAlign: "center" }}>
                            {"\u20B9 "}
                            {item.totalPaidAmount}
                          </td>
                          <td style={{ fontSize: 12, textAlign: "center" }}>
                            {item.utrDetails}
                          </td>
                          <td
                            style={{
                              fontSize: 12,
                              fontWeight: "bold",
                              textAlign: "center",
                              color:
                                item.status === "Bill Approved"
                                  ? "blue"
                                  : item.status === "Bill Declined"
                                  ? "red"
                                  : item.status === "Bill Raised"
                                  ? "orange"
                                  : item.status === "Bill On hold"
                                  ? "yellow"
                                  : item.status === "Bill Paid"
                                  ? "green"
                                  : "inherit",
                            }}
                          >
                            {item.status}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div
                  style={{ fontSize: "13px", width: "100%", marginTop: "30px" }}
                >
                  {poReqMilestone.length === 0 ? null : (
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                      <li
                        style={{
                          backgroundColor: "#fff6db",
                          display: "flex",
                          fontWeight: "bold",
                        }}
                      >
                        <div style={{ flex: 1, textAlign: "center" }}>
                          Payment Milestones
                        </div>
                        <div style={{ flex: 1, textAlign: "center" }}>
                          Total Amount
                        </div>
                        <div style={{ flex: 1, textAlign: "center" }}>
                          Requested Amount
                        </div>
                        <div style={{ flex: 1, textAlign: "center" }}>
                          Total Paid Amount
                        </div>
                        <div style={{ flex: 1, textAlign: "center" }}>
                          UTR Details
                        </div>
                        <div style={{ flex: 1, textAlign: "center" }}>
                          Status
                        </div>
                      </li>
                      {poReqMilestone.map((item, index) => (
                        <li
                          key={index}
                          style={{
                            display: "flex",
                            borderBottom: "1px solid #ccc",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              fontSize: 12,
                              textAlign: "center",
                            }}
                          >
                            {item.paymentMilestoneName?.name}
                          </div>
                          <div
                            style={{
                              flex: 1,
                              fontSize: 12,
                              textAlign: "center",
                            }}
                          >
                            {"\u20B9 "}
                            {item.paymentMilestoneName?.totalAmount}
                          </div>
                          <div
                            style={{
                              flex: 1,
                              fontSize: 12,
                              textAlign: "center",
                            }}
                          >
                            {"\u20B9 "}
                            {item.requestedAmount}
                          </div>
                          <div
                            style={{
                              flex: 1,
                              fontSize: 12,
                              textAlign: "center",
                            }}
                          >
                            {"\u20B9 "}
                            {item.totalPaidAmount}
                          </div>
                          <div
                            style={{
                              flex: 1,
                              fontSize: 12,
                              textAlign: "center",
                            }}
                          >
                            {item.utrDetails}
                          </div>
                          <div
                            style={{
                              flex: 1,
                              fontSize: 12,
                              textAlign: "center",
                              fontWeight: "bold",
                              color:
                                item.status === "Bill Approved"
                                  ? "blue"
                                  : item.status === "Bill Declined"
                                  ? "red"
                                  : item.status === "Bill Raised"
                                  ? "orange"
                                  : item.status === "Bill On hold"
                                  ? "yellow"
                                  : item.status === "Bill Paid"
                                  ? "green"
                                  : "inherit",
                            }}
                          >
                            {item.status}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
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

                  {item.discription &&
                    JSON.parse(item.discription).map((item, index) => {
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
                    <th colSpan="2">FREIGHT</th>
                    <th colSpan="2">INSURANCE</th>
                  </tr>
                  <tr>
                    <td colSpan="2">
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
                    <td colSpan="2">
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
                    <th colSpan="1">SHIP TO ADDRESS</th>
                    <th colSpan="1">BILL TO ADDRESS</th>
                    <th>PAYMENT TERMS</th>
                  </tr>
                  <tr>
                    <td colSpan="1">
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
                    <td colSpan="1">
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
