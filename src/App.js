import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import poAPI from "../src/services/poService";
import "../src/table1.scss";
import "./App.scss";
import "../src/table2.scss";
import firebaseApp from "../src/config/firebase";
import "../src/dashboardPage.scss";
import { getDatabase, ref, get, onValue } from "firebase/database";

import POItem from "../src/POItem";

export default function PO() {
  console.log(
    "sdfsdfsfdsfdsfdsfdsfsdfdsfdsfdsfsdfdsf",
    window.my_special_setting
  );

  function getQueryParam(name) {
    console.log("getQueryParam is MdCallEnd..");
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  const pathname = getQueryParam("po_id");

  const [spinner, setSpinner] = useState(false);
  const [poData, setPoData] = useState([]);
  const [milestoneTobeAddedIndex, setMilestoneTobeAddedIndex] = useState([]);
  const [imageStates, setImageStates] = useState([]);
  const [webAddress, setWebAddress] = useState("");
  const [poReqMilestone, setPoReqMilestone] = useState([]);
  const [lastObjectState, setLastObjectState] = useState(null);

  var itemImageURLs = [];
  var orderIds = [];
  var projectId = null;
  var poId = null;
  var requestId = null;


  useEffect(() => {
    getPoByOrderId();
  }, []);

  const getPoByOrderId = async () => {
    setSpinner(true);
    console.log("pathname is ", pathname);
    let orderId = pathname;
    // let orderId = pathname.split("/")[1];
    console.log("orderId hhhhh", orderId);

    new poAPI()
      .getPoByOrderId(orderId)
      .then(async (res) => {
        console.log("Response from getPoByOrderId API: ", res);

        if (res.status === 200 && res.payload.length > 0) {
          console.log("res.payload original : ", res.payload);
          projectId = res.payload[0].projectId;
          poId = res.payload[0].OrderId;
          console.log("po id for request is", poId);

          console.log("projectId : ", projectId);
          setWebAddress(res.payload[0].webAddress);
          let tempResPayload = JSON.parse(res.payload[0].discription);
          let tempMilestonesArray = [];

          for (let value = 0; value < tempResPayload.length; value++) {
            
            tempMilestonesArray.push(tempResPayload[value].milestones);
          }
          let commonMiestones = findMilestonesFromDraft(tempMilestonesArray);
          let tempIndexes = [];
          for (let value = 0; value < tempResPayload.length; value++) {
            
            if (
              checkMilestonesToBeEqaul(
                commonMiestones,
                tempResPayload[value].milestones
              )
            ) {
            } else {
              tempIndexes.push(value);
            }
          }

          let tempItems = JSON.parse(res.payload[0].discription);
          let tempObjFreqDesc = {};
          let arrayOfDescriptionandSpecifications = [];

          for (let index = 0; index <= tempItems.length - 1; index++) {
            if (typeof tempItems[index].workType != "undefined") {
              if (
                arrayOfDescriptionandSpecifications.includes(
                  tempItems[index].description
                )
              ) {
                
                tempObjFreqDesc[tempItems[index].description].rate.push(
                  tempItems[index].rate
                );
                tempObjFreqDesc[tempItems[index].description].quantity.push(
                  +tempItems[index].quantity
                );
                tempObjFreqDesc[tempItems[index].description].workType.push(
                  tempItems[index].workType
                );
                tempObjFreqDesc[tempItems[index].description].indexes.push(
                  index
                );
                tempObjFreqDesc[tempItems[index].description].unit.push(
                  tempItems[index].unit
                );;
              } else {
                
                arrayOfDescriptionandSpecifications.push(
                  tempItems[index].description
                );

                tempObjFreqDesc[tempItems[index].description] = {
                  rate: [tempItems[index].rate],
                  quantity: [+tempItems[index].quantity],
                  workType: [tempItems[index].workType],
                  indexes: [index],
                  unit: [tempItems[index].unit],
                };
              }
            } else {
              if (
                arrayOfDescriptionandSpecifications.includes(
                  tempItems[index].specification
                )
              ) {
                

                tempObjFreqDesc[tempItems[index].specification].rate.push(
                  tempItems[index].rate
                );
                tempObjFreqDesc[tempItems[index].specification].quantity.push(
                  +tempItems[index].quantity
                );
                tempObjFreqDesc[tempItems[index].specification].indexes.push(
                  index
                );
                tempObjFreqDesc[tempItems[index].specification].unit.push(
                  tempItems[index].unit
                );
              } else {
                
                arrayOfDescriptionandSpecifications.push(
                  tempItems[index].specification
                );

                tempObjFreqDesc[tempItems[index].specification] = {
                  rate: [tempItems[index].rate],
                  quantity: [+tempItems[index].quantity],
                  workType: [tempItems[index].workType],
                  indexes: [index],
                  unit: [tempItems[index].unit],
                };
              }
            }
          }

          let tempFinalFiltered = [];

          for (
            let objectIndex = 0;
            objectIndex < Object.keys(tempObjFreqDesc).length;
            objectIndex++
          ) {
            let tempRate = [];
            let rateCount = {};
            for (
              let rIndex = 0;
              rIndex <
              tempObjFreqDesc[Object.keys(tempObjFreqDesc)[objectIndex]][
                "indexes"
              ].length;
              rIndex++
            ) {
              
              if (
                tempRate.includes(
                  `R${+tempObjFreqDesc[
                    Object.keys(tempObjFreqDesc)[objectIndex]
                  ]["rate"][rIndex]}`
                )
              ) {
                
                if (
                  rateCount[
                    `R${
                      tempObjFreqDesc[
                        Object.keys(tempObjFreqDesc)[objectIndex]
                      ]["rate"][rIndex]
                    }`
                  ].hasOwnProperty(
                    tempItems[
                      tempObjFreqDesc[
                        Object.keys(tempObjFreqDesc)[objectIndex]
                      ]["indexes"][rIndex]
                    ].unit
                  )
                ) {
                  rateCount[
                    `R${
                      tempObjFreqDesc[
                        Object.keys(tempObjFreqDesc)[objectIndex]
                      ]["rate"][rIndex]
                    }`
                  ][
                    [
                      tempItems[
                        tempObjFreqDesc[
                          Object.keys(tempObjFreqDesc)[objectIndex]
                        ]["indexes"][rIndex]
                      ].unit,
                    ]
                  ].push(
                    tempObjFreqDesc[Object.keys(tempObjFreqDesc)[objectIndex]][
                      "indexes"
                    ][rIndex]
                  );
                } else {
                  rateCount[
                    `R${
                      tempObjFreqDesc[
                        Object.keys(tempObjFreqDesc)[objectIndex]
                      ]["rate"][rIndex]
                    }`
                  ][
                    tempItems[
                      tempObjFreqDesc[
                        Object.keys(tempObjFreqDesc)[objectIndex]
                      ]["indexes"][rIndex]
                    ].unit
                  ] = [
                    tempObjFreqDesc[Object.keys(tempObjFreqDesc)[objectIndex]][
                      "indexes"
                    ][rIndex],
                  ];
                }
              } else {
                
                tempRate.push(
                  `R${
                    tempObjFreqDesc[Object.keys(tempObjFreqDesc)[objectIndex]][
                      "rate"
                    ][rIndex]
                  }`
                );

                rateCount[
                  `R${
                    tempObjFreqDesc[Object.keys(tempObjFreqDesc)[objectIndex]][
                      "rate"
                    ][rIndex]
                  }`
                ] = {
                  [tempItems[
                    tempObjFreqDesc[Object.keys(tempObjFreqDesc)[objectIndex]][
                      "indexes"
                    ][rIndex]
                  ].unit]: [
                    tempObjFreqDesc[Object.keys(tempObjFreqDesc)[objectIndex]][
                      "indexes"
                    ][rIndex],
                  ],
                };
              }
            }

            for (
              let rCIndex = 0;
              rCIndex < Object.keys(rateCount).length;
              rCIndex++
            ) {
              for (
                let unitIndex = 0;
                unitIndex <
                Object.keys(rateCount[Object.keys(rateCount)[rCIndex]]).length;
                unitIndex++
              ) {
                if (
                  rateCount[Object.keys(rateCount)[rCIndex]][
                    Object.keys(rateCount[Object.keys(rateCount)[rCIndex]])[
                      unitIndex
                    ]
                  ].length > 1
                ) {
                  let newQuantity = 0;
                  rateCount[Object.keys(rateCount)[rCIndex]][
                    Object.keys(rateCount[Object.keys(rateCount)[rCIndex]])[
                      unitIndex
                    ]
                  ].forEach((element) => {
                    newQuantity = newQuantity + +tempItems[element].quantity;
                  });
                  delete tempItems[
                    rateCount[Object.keys(rateCount)[rCIndex]][
                      Object.keys(rateCount[Object.keys(rateCount)[rCIndex]])[
                        unitIndex
                      ]
                    ][0]
                  ].profitablilityOfComponent;
                  console.log(
                    "testing to delete the prof",
                    tempItems[
                      rateCount[Object.keys(rateCount)[rCIndex]][
                        Object.keys(rateCount[Object.keys(rateCount)[rCIndex]])[
                          unitIndex
                        ]
                      ][0]
                    ]
                  );
                  tempFinalFiltered.push({
                    ...tempItems[
                      rateCount[Object.keys(rateCount)[rCIndex]][
                        Object.keys(rateCount[Object.keys(rateCount)[rCIndex]])[
                          unitIndex
                        ]
                      ][0]
                    ],
                    quantity: newQuantity,
                  });
                } else {
                  // console.log();
                  tempFinalFiltered.push(
                    tempItems[
                      rateCount[Object.keys(rateCount)[rCIndex]][
                        Object.keys(rateCount[Object.keys(rateCount)[rCIndex]])[
                          unitIndex
                        ]
                      ][0]
                    ]
                  );
                }
              }
            }
          }

          setMilestoneTobeAddedIndex(tempIndexes);
          res.payload[0].discription = JSON.stringify(tempFinalFiltered);
          setPoData(res.payload);

          console.log(
            "res.payload.length : ",
            JSON.parse(res.payload[0].discription).length
          );

          orderIds = [];

          for (
            let index = 0;
            index < JSON.parse(res.payload[0].discription).length;
            index++
          ) {
            orderIds.push(
              JSON.parse(res.payload[0].discription)[index].OrderId
            );
          }

          console.log("projectId : ", projectId);
          console.log("orderIds : ", orderIds);
          getURLsOfImageForPO();
          getPoMilestones();
        } else {
          setPoData([]);
        }

        setSpinner(false);
      })
      .catch((e) => {
        console.log("Catch from getPoByOrderId API: ", e);
        setSpinner(false);
      });
  };

  const getURLsOfImageForPO = async () => {
    console.log("Fetching image URLs...");
    let emptyURL = null;
    itemImageURLs = [];

    try {
      const db = getDatabase(firebaseApp);
      const snapshot = await get(ref(db, `POImages/${projectId}`));
      console.log("Snapshot:", snapshot.val()); // Log snapshot value
      const data = snapshot.val();

      console.log("hello data", data);

      if (data == null) {
        for (let index = 0; index < orderIds.length; index++) {
          itemImageURLs.push(emptyURL);
        }
      } else {
        for (let index = 0; index < orderIds.length; index++) {
          if (data[orderIds[index]]) {
            itemImageURLs.push(data[orderIds[index]].url);
          } else {
            itemImageURLs.push(emptyURL);
          }
        }
      }
      console.log("Image URLs fetched successfully:", itemImageURLs); 
      setImageStates(itemImageURLs);
    } catch (error) {
      console.log("Error retrieving image URLs:", error);
    }
  };

  const getPoMilestones = async () => {
    let requestPO = [];
    let lastObject = null;

    try {
      const db = getDatabase(firebaseApp);
      const snapshot = await get(ref(db, `poRequests/${poId}`));
      const data = snapshot.val();
      console.log("this is the data value", data);

      if (data != null) {
        const values = Object.values(data);
        console.log(values, "values are");
        values.slice(0, -1).map((value) => {
          requestPO = [...requestPO, value];
        });
        lastObject = values[values.length - 1];
        setLastObjectState(lastObject);
        setPoReqMilestone(requestPO);
      }
    } catch (error) {
      console.log("error in getting PO milestones");
    }
  };

  const checkMilestonesToBeEqaul = (obj1, obj2) => {
    let tempComp = true;
    if (obj1.length === obj2.length) {
      
      for (let key = 0; key < obj1.length; key++) {
        
        if (
          obj1[key].name === obj2[key].name &&
          obj1[key].percentage === obj2[key].percentage
        ) {
          
        } else {
          
          tempComp = false;
        }
      }
    } else {
      
      tempComp = false;
    }
    return tempComp;
  };

  const findMilestonesFromDraft = (array) => {
    if (array.length === 0) return null;
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

  return spinner ? (
    <div
      style={{
        display: "flex",
        flex: 1,
        marginTop: "300px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress style={{ color: "#fdd34d" }} />
    </div>
  ) : (
    <div className="container">
      {poData ? (
        poData.length < 1 ? (
          <p style={{ textAlign: "center" }}></p>
        ) : (
          <POItem
            key="latest"
            item={poData[0]}
            getPoByOrderId={getPoByOrderId}
            imageStates={imageStates}
            setPoData={setPoData}
            poReqMilestone={poReqMilestone}
            lastObjectState={lastObjectState}
          />
        )
      ) : (
        <p style={{ textAlign: "center" }}></p>
      )}
    </div>
  );
}
