import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import poAPI from "../src/services/poService";
import "../src/table1.scss";
import "./App.scss"
import "../src/table2.scss";
import firebase from "../src/config/firebase"
import "../src/dashboardPage.scss"

import POItem from "../src/POItem";

export default function PO() {
  console.log(
    "sdfsdfsfdsfdsfdsfdsfsdfdsfdsfdsfsdfdsf",
    window.my_special_setting
  );
  // const { pathname } = useLocation();

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

  var itemImageURLs = [];
  var orderIds = [];
  var projectId = null;
  var database = firebase.database();

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
          console.log("projectId : ", projectId);
          setWebAddress(res.payload[0].webAddress);
          let tempResPayload = JSON.parse(res.payload[0].discription);
          let tempMilestonesArray = [];

          for (let value = 0; value < tempResPayload.length; value++) {
            // write the code here
            tempMilestonesArray.push(tempResPayload[value].milestones);
          }
          let commonMiestones = findMilestonesFromDraft(tempMilestonesArray);
          let tempIndexes = [];
          for (let value = 0; value < tempResPayload.length; value++) {
            // write the code here
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

          // console.log(
          //   "res.payload discription : ",
          //   JSON.parse(res.payload[0].discription)
          // );
          let tempItems = JSON.parse(res.payload[0].discription);
          //filtering the items if same rate and same unit
          let tempObjFreqDesc = {};
          let arrayOfDescriptionandSpecifications = [];

          for (let index = 0; index <= tempItems.length - 1; index++) {
            // console.log("items from tempItems : ", index, " : ", tempItems[index]);
            // console.log("tempItems[index].workType : ", tempItems[index].workType);

            if (typeof tempItems[index].workType != "undefined") {
              // console.log("work type foundff"); // this means work or work + material
              if (
                arrayOfDescriptionandSpecifications.includes(
                  tempItems[index].description
                )
              ) {
                // write the code here
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
                );

                // console.log(
                //   "type of tempObjFreqDesc",
                //   tempObjFreqDesc[tempItems[index].description].length
                // );
              } else {
                // write the code here
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
              // write the code here
              // console.log("work type not found f"); // this means material
              // console.log(
              //   "tempItems[index].specification : ",
              //   tempItems[index].specification
              // );

              if (
                arrayOfDescriptionandSpecifications.includes(
                  tempItems[index].specification
                )
              ) {
                // write the code here

                tempObjFreqDesc[tempItems[index].specification].rate.push(
                  tempItems[index].rate
                );
                tempObjFreqDesc[tempItems[index].specification].quantity.push(
                  +tempItems[index].quantity
                );
                // tempObjFreqDesc[tempItems[index].specification].workType.push(
                //   tempItems[index].workType
                // );
                tempObjFreqDesc[tempItems[index].specification].indexes.push(
                  index
                );
                tempObjFreqDesc[tempItems[index].specification].unit.push(
                  tempItems[index].unit
                );
              } else {
                // write the code here
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

          // console.log('after desc filter', tempObjFreqDesc);

          // let tempRatesCheck = {};
          let tempFinalFiltered = [];

          for (
            let objectIndex = 0;
            objectIndex < Object.keys(tempObjFreqDesc).length;
            objectIndex++
          ) {
            // console.log("teeeeee", tempRatesCheck);
            // console.log(Object.keys(tempObjFreqDesc)[objectIndex]);

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
              // write the code here
              if (
                tempRate.includes(
                  `R${+tempObjFreqDesc[
                    Object.keys(tempObjFreqDesc)[objectIndex]
                  ]["rate"][rIndex]}`
                )
              ) {
                // write the code here
                // console.log('already included pushing the indexes to array','tempRate',tempRate,'rateCount[tempObjFreqDesc[Object.keys(tempObjFreqDesc)[objectIndex]][\'rate\'][rIndex]][tempObjFreqDesc[Object.keys(tempObjFreqDesc)[objectIndex]][\'indexes\'][rIndex].unit]',rateCount[tempObjFreqDesc[Object.keys(tempObjFreqDesc)[objectIndex]]['rate'][rIndex]][[tempItems[tempObjFreqDesc[Object.keys(tempObjFreqDesc)[objectIndex]]['indexes'][rIndex]].unit]])
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
                // write the code here
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
          await getURLsOfImageForPO();
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
    // writ th cod hr
    let emptyURL = null;
    itemImageURLs = [];
    var useRef = database.ref(`POImages/${projectId}`);
    console.log("this is the image", useRef)

    useRef
      .once("value", function (snapshot) {
        // write the code here
        var data = snapshot.val();
        if (data == null) {
          // write the code here
          for (let index = 0; index < orderIds.length; index++) {
            // write the code here
            itemImageURLs.push(emptyURL);
          }
        } else {
          // write the code here
          for (let index = 0; index < orderIds.length; index++) {
            // write the code here
            console.log("data[orderIds[index]] : ", data[orderIds[index]]);
            if (data[orderIds[index]]) {
              // write the code here
              itemImageURLs.push(data[orderIds[index]].url);
            } else {
              // write the code here
              itemImageURLs.push(emptyURL);
            }
          }
        }
      })
      .then(() => {
        console.log("itemImageURLs : ", itemImageURLs);
        setImageStates(itemImageURLs);
      });
  };

  const checkMilestonesToBeEqaul = (obj1, obj2) => {
    let tempComp = true;
    if (obj1.length === obj2.length) {
      // write the code here
      for (let key = 0; key < obj1.length; key++) {
        // write the code here
        if (
          obj1[key].name === obj2[key].name &&
          obj1[key].percentage === obj2[key].percentage
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

  // var orderNo = 0;
  // var commonMilestonesIndex = 0;
  // var commonMilestoneAmount = 0;
  // let sNo = 0;
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
          <p style={{ textAlign: "center", border: "2px solid red" }}>
            Po/Wo Not Available
          </p>
        ) : (
          <POItem
            key="latest"
            item={poData[0]}
            getPoByOrderId={getPoByOrderId}
            imageStates={imageStates}
            setPoData={setPoData}
          />
        )
      ) : (
        <p style={{ textAlign: "center", border: "2px solid blue" }}>
          Po/Wo Not Available
        </p>
      )}
    </div>
  );
}
