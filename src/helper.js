import { confirmAlert } from "react-confirm-alert";
import ProjectService from "../../api/projectService";
import xlsxReader from "json-as-xlsx";
import { toast } from "react-toast";
import { FiInfo } from "react-icons/fi";
import xlsx from "read-excel-file";

const addRoom = (roomIndex, project, setProject, updateFBRDB) => {
  const room = {
    "Room Name": "",
    Units: [{ "Unit Name": "", Drawings: [], Components: [] }],
  };
  const rooms = project.rooms;
  if (project.rooms.length > 0) {
    if (
      project.rooms[project.rooms.length - 1]["Room Name"] ===
      "Non tender items"
    ) {
      // this is to avoid creating multiple non-tender items
      // console.log("nontender item found at last adding to last but one");
      rooms.splice(-1, 0, room);
    } else {
      // console.log("non --tender items notfound ");
      rooms.push(room);
    }
  } else {
    // console.log("direcltly pushing to end nwe on");
    rooms.push(room);
  }
  setProject((dt) => ({ ...dt, rooms }));
  updateFBRDB({ ...project, rooms });
};

const onChangeRoom = (roomIndex, project, setProject, updateFBRDB, value) => {
  const rooms = project.rooms;
  let cRoom = { ...rooms[roomIndex], "Room Name": value };
  rooms.splice(roomIndex, 1, cRoom);
  setProject((dt) => ({ ...dt, rooms }));
  updateFBRDB({ ...project, rooms });
};

const delRoom = (roomIndex, project, setProject, updateFBRDB) => {
  confirmAlert({
    title: "Confirm to submit",
    message: "Are you sure to do this.",
    buttons: [
      {
        label: "Yes",
        onClick: () => {
          const rooms = project.rooms.filter(
            (room, index) => index !== roomIndex
          );
          setProject((dt) => ({ ...dt, rooms }));
          updateFBRDB({ ...project, rooms });
        },
      },
      {
        label: "No",
        onClick: () => null,
      },
    ],
  });
};

const addUnit = (roomIndex, unitIndex, project, setProject, updateFBRDB) => {
  const rooms = project.rooms;
  let cRoom = rooms[roomIndex];
  const units = cRoom.Units;
  // units.splice(unitIndex + 1, 0, {
  //   "Unit Name": "",
  //   Drawings: [],
  //   Components: [],
  // });
  units.push({
    "Unit Name": "",
    Drawings: [],
    Components: [],
  });
  // console.log("units : ", units, "rooms : ", rooms, "cRoom : ", cRoom);
  cRoom = { ...cRoom, Units: units };
  rooms.splice(roomIndex, 1, cRoom);
  setProject((dt) => ({ ...dt, rooms }));
  updateFBRDB({ ...project, rooms });
};

const deleteUnit = (roomIndex, unitIndex, project, setProject, updateFBRDB) => {
  confirmAlert({
    title: "Confirm to submit",
    message: "Are you sure to do this.",
    buttons: [
      {
        label: "Yes",
        onClick: () => {
          const rooms = project.rooms;
          let cRoom = rooms[roomIndex];
          const units = [...cRoom.Units];
          units.splice(unitIndex, 1);
          cRoom = { ...cRoom, Units: units };
          rooms.splice(roomIndex, 1, cRoom);
          setProject((dt) => ({ ...dt, rooms }));
          updateFBRDB({ ...project, rooms });
        },
      },
      {
        label: "No",
        onClick: () => null,
      },
    ],
  });
};

const onChangeUnit = (
  roomIndex,
  unitIndex,
  project,
  setProject,
  updateFBRDB,
  name,
  value
) => {
  const rooms = project.rooms;
  let cRoom = rooms[roomIndex];
  const units = [...cRoom.Units];
  let cUnit = {};
  if (name === "Unit Name") {
    cUnit = { ...units[unitIndex], "Unit Name": value };
  } else {
    cUnit = {
      ...units[unitIndex],
      Drawings: [...units[unitIndex].Drawings, value],
    };
  }
  units.splice(unitIndex, 1, cUnit);
  cRoom = { ...cRoom, Units: units };
  rooms.splice(roomIndex, 1, cRoom);
  setProject((dt) => ({ ...dt, rooms }));
  updateFBRDB({ ...project, rooms });
};

const addNewComponent = (
  roomIndex,
  unitIndex,
  componentIndex,
  project,
  setProject,
  updateFBRDB
) => {
  const rooms = [...project.rooms];
  let cRoom = rooms[roomIndex];
  let units = [...cRoom.Units];
  let cUnit = units[unitIndex];
  let components = cUnit.Components;
  const componentObject = {
    description: "",
    quantity: "",
    rate: "",
    unit: "",
    Work: [],
    Material: [],
    Remarks: "",
  };
  // console.log(
  //   "type of Components",
  //   typeof components,
  //   "componentIndex : ",
  //   componentIndex,
  //   "components:",
  //   components
  // );
  // components.splice(componentIndex + 1, 0, componentObject);
  components.push(componentObject);
  cUnit = { ...cUnit, Components: components };
  units.splice(unitIndex, 1, cUnit);
  cRoom = { ...cRoom, Units: units };
  rooms.splice(roomIndex, 1, cRoom);
  setProject((dt) => ({ ...dt, rooms }));
  updateFBRDB({ ...project, rooms });
};

const duplicateComponent = (
  roomIndex,
  unitIndex,
  componentIndex,
  component,
  project,
  setProject,
  updateFBRDB
) => {
  const rooms = [...project.rooms];
  let cRoom = rooms[roomIndex];
  let units = [...cRoom.Units];
  let cUnit = units[unitIndex];
  let components = cUnit.Components;
  const componentDuplicate = {
    ...component,
    Material: component.Material.map((material, materialIndex) => ({
      ...material,
      OrderId: new Date().getTime() + materialIndex,
      status: "",
      rate: material.rate === "quotation" ? "0" : material.rate,
    })),
    Work: component.Work.map((work, workIndex) => ({
      ...work,
      OrderId:
        new Date().getTime() + workIndex + Math.floor(Math.random() * 100 + 1),
      status: "",
      rate: work.rate === "quotation" ? "0" : work.rate,
    })),
  };
  components.splice(componentIndex + 1, 0, componentDuplicate);
  cUnit = { ...cUnit, Components: components };
  units.splice(unitIndex, 1, cUnit);
  cRoom = { ...cRoom, Units: units };
  rooms.splice(roomIndex, 1, cRoom);
  setProject((dt) => ({ ...dt, rooms }));
  updateFBRDB({ ...project, rooms });
};

const deleteComponent = (
  roomIndex,
  unitIndex,
  componentIndex,
  project,
  setProject,
  updateFBRDB
) => {
  confirmAlert({
    title: "Confirm to submit",
    message: "Are you sure to do this.",
    buttons: [
      {
        label: "Yes",
        onClick: () => {
          const rooms = [...project.rooms];
          let cRoom = rooms[roomIndex];
          let units = [...cRoom.Units];
          let cUnit = units[unitIndex];
          cUnit = {
            ...cUnit,
            Components: cUnit.Components.filter(
              (_, index) => index !== componentIndex
            ),
          };
          units.splice(unitIndex, 1, cUnit);
          cRoom = { ...cRoom, Units: units };
          rooms.splice(roomIndex, 1, cRoom);
          setProject((dt) => ({ ...dt, rooms }));
          updateFBRDB({ ...project, rooms });
        },
      },
      {
        label: "No",
        onClick: () => null,
      },
    ],
  });
};

const onChangeComponent = (
  roomIndex,
  unitIndex,
  componentIndex,
  project,
  setProject,
  updateFBRDB,
  name,
  value,
  changedBy,
  componentSuggestions
) => {
  if (name === "rate" || name === "quantity") {
    // console.log(typeof value.replace(/(?!-)[^0-9.]/g, ""));
    value = value.replace(/(?!-)[^0-9.]/g, "");
  }

  if (name === "rate") {
    console.log(typeof value.replace(/(?!-)[^0-9.]/g, ""));
    value = value.replace(/(?!-)[^0-9.]/g, "");
  }

  if (name === "unit") {
    console.log(typeof value.replace(/(?!-)[^0-9.]/g, ""), value);
    value = value.replace(/[0-9.]/g, "");
  }
  // console.log('before description ',project )
  if (name === "description") {
    // const testing = project.rooms
    const rooms = project.rooms;
    let cRoom = rooms[roomIndex];
    const units = [...cRoom.Units];
    let cUnit = units[unitIndex];
    let components = cUnit.Components;
    let cComponent = components[componentIndex];
    if (changedBy === "onChangeAutocomplete") {
      // console.log('in the changedby')
      // console.log('cUnits','testing','cComponent :  ',cComponent)
      // console.log('component suggestions',componentSuggestions)
      // console.log('in the component values  ',components,'component Index: ',componentIndex)
      onChangeComponent(
        roomIndex,
        unitIndex,
        componentIndex,
        project,
        setProject,
        updateFBRDB,
        "unit",
        componentSuggestions
          .map((item) => {
            if (item.description.localeCompare(value) === 0) {
              return item.unit;
            }
          })
          .filter((item) => item != undefined)[0] || cComponent.unit
      );

      onChangeComponent(
        roomIndex,
        unitIndex,
        componentIndex,
        project,
        setProject,
        updateFBRDB,
        "rate",
        componentSuggestions
          .map((item) => {
            if (item.description.localeCompare(value) === 0) {
              return item.rate;
            }
          })
          .filter((item) => item != undefined)[0] || cComponent.rate
      );

      // console.log(`cComponent.Work.length`, cComponent.Work);
      // console.log(`cComponent.Material.length`, cComponent.Material);

      // cComponent.Work.length > 0 &&
      //   deleteSuggestiveWork(
      //     roomIndex,
      //     unitIndex,
      //     componentIndex,
      //     cComponent.Work.length,
      //     project,
      //     setProject,
      //     updateFBRDB
      //   );
      // cComponent.Material.length > 0 &&
      //   deleteSuggestiveMaterial(
      //     roomIndex,
      //     unitIndex,
      //     componentIndex,
      //     cComponent.Material.length,
      //     project,
      //     setProject,
      //     updateFBRDB
      //   );

      (
        componentSuggestions
          .map((item) => {
            if (item.description.localeCompare(value) === 0) {
              return JSON.parse(item.works);
            }
          })
          .filter((item) => item != undefined)[0] || ""
      ).length > 0 &&
        (
          componentSuggestions
            .map((item) => {
              if (item.description.localeCompare(value) === 0) {
                return JSON.parse(item.works);
              }
            })
            .filter((item) => item != undefined)[0] || ""
        ).map((item, index) => {
          // console.log("item in the map: ", item, "ADDED THE TIMEOUT");
          setTimeout(() => {
            // console.log("IN THE SETTIMEOUT WORKDDD ", new Date().getTime());
            addWork(
              roomIndex,
              unitIndex,
              componentIndex,
              cComponent.Work.length,
              project,
              setProject,
              updateFBRDB,
              componentSuggestions
                .map((item) => {
                  if (item.description.localeCompare(value) === 0) {
                    return JSON.parse(item.works)[index];
                  }
                })
                .filter((item) => item != undefined)[0] || ""
            );
          }, 100);
        });

      (
        componentSuggestions
          .map((item) => {
            if (item.description.localeCompare(value) === 0) {
              return JSON.parse(item.materials);
            }
          })
          .filter((item) => item != undefined)[0] || ""
      ).length > 0 &&
        (
          componentSuggestions
            .map((item) => {
              if (item.description.localeCompare(value) === 0) {
                return JSON.parse(item.materials);
              }
            })
            .filter((item) => item != undefined)[0] || ""
        ).map((item, index) => {
          // console.log("ADDED THE TIMEOUT");
          setTimeout(() => {
            //using this bcoz looping may give same timestamp
            // console.log("IN THE SETTIMEOUT ", new Date().getTime());
            addMaterial(
              roomIndex,
              unitIndex,
              componentIndex,
              cComponent.Material.length,
              project,
              setProject,
              updateFBRDB,
              componentSuggestions
                .map((item) => {
                  if (item.description.localeCompare(value) === 0) {
                    return JSON.parse(item.materials)[index];
                  }
                })
                .filter((item) => item != undefined)[0] || ""
            );
          }, 100);
        });
    }
  }

  const rooms = [...project.rooms];
  let cRoom = rooms[roomIndex];
  const units = [...cRoom.Units];
  let cUnit = units[unitIndex];
  let components = cUnit.Components;
  let cComponent = { ...components[componentIndex], [name]: value };
  components.splice(componentIndex, 1, cComponent);
  units.splice(unitIndex, 1, { ...cUnit, Components: components });
  cRoom = { ...cRoom, Units: units };
  rooms.splice(roomIndex, 1, cRoom);
  setProject((dt) => ({ ...dt, rooms }));
  updateFBRDB({ ...project, rooms });
};

const addWork = (
  roomIndex,
  unitIndex,
  componentIndex,
  workIndex,
  project,
  setProject,
  updateFBRDB,
  selectedComponentWorks
) => {
  const rooms = project.rooms;
  let cRoom = rooms[roomIndex];
  let units = [...cRoom.Units];
  let cUnit = units[unitIndex];
  let components = cUnit.Components;
  let cComponent = components[componentIndex];

  var workObject = {
    OrderId: new Date().getTime(),
    workType: "Only Work",
    // vendorCategory: "Carpenter",
    vendorCategory: "",
    heading: "",
    description: "",
    quantity: "",
    rate: "",
    unit: "",
    gst: "",
    milestones: [{ name: "Completion", percentage: "100" }],
    tc: "",
    status: "",
    orderStatus: "",
  };

  // console.log(`selectedComponentWorks`, selectedComponentWorks)

  if (selectedComponentWorks) {
    workObject.workType = selectedComponentWorks.workType;
    workObject.vendorCategory = selectedComponentWorks.category;
    workObject.description = selectedComponentWorks.description;
    workObject.rate = selectedComponentWorks.rate;
    workObject.unit = selectedComponentWorks.unit;
    workObject.gst = selectedComponentWorks.gst;
  }

  let work = cComponent.Work;
  work.splice(workIndex + 1, 0, workObject);
  cComponent = { ...cComponent, Work: work };
  components.splice(componentIndex, 1, cComponent);
  units.splice(unitIndex, 1, cUnit);
  cRoom = { ...cRoom, Units: units };
  rooms.splice(roomIndex, 1, cRoom);
  setProject((dt) => ({ ...dt, rooms }));
  updateFBRDB({ ...project, rooms });
};

const deleteWork = (
  roomIndex,
  unitIndex,
  componentIndex,
  workIndex,
  project,
  setProject,
  updateFBRDB
) => {
  confirmAlert({
    title: "Confirm to submit",
    message: "Are you sure to do this.",
    buttons: [
      {
        label: "Yes",
        onClick: () => {
          const rooms = project.rooms;
          let cRoom = rooms[roomIndex];
          let units = [...cRoom.Units];
          let cUnit = units[unitIndex];
          let components = cUnit.Components;
          let cComponent = components[componentIndex];
          cComponent = {
            ...cComponent,
            Work: cComponent.Work.filter((_, index) => index !== workIndex),
          };
          components.splice(componentIndex, 1, cComponent);
          units.splice(unitIndex, 1, cUnit);
          cRoom = { ...cRoom, Units: units };
          rooms.splice(roomIndex, 1, cRoom);
          setProject((dt) => ({ ...dt, rooms }));
          updateFBRDB({ ...project, rooms });
        },
      },
      {
        label: "No",
        onClick: () => null,
      },
    ],
  });
};

const deleteSuggestiveWork = (
  roomIndex,
  unitIndex,
  componentIndex,
  componentWorksLength,
  project,
  setProject,
  updateFBRDB
) => {
  const rooms = project.rooms;
  let cRoom = rooms[roomIndex];
  let units = [...cRoom.Units];
  let cUnit = units[unitIndex];
  let components = cUnit.Components;
  let cComponent = components[componentIndex];

  cComponent = {
    ...cComponent,
    Work: cComponent.Work.filter(
      (_, index) => index > componentWorksLength - 1
    ),
  };

  components.splice(componentIndex, componentWorksLength, cComponent);
  units.splice(unitIndex, 1, cUnit);
  cRoom = { ...cRoom, Units: units };
  rooms.splice(roomIndex, 1, cRoom);
  setProject((dt) => ({ ...dt, rooms }));
  updateFBRDB({ ...project, rooms });
};

const onChangeWork = (
  roomIndex,
  unitIndex,
  componentIndex,
  workIndex,
  project,
  setProject,
  updateFBRDB,
  name,
  value,
  changedBy,
  workSuggestions
) => {
  if (name === "rate" || name === "quantity" || name === "gst") {
    value = value.replace(/(?!-)[^0-9.]/g, "");
  }

  if (name === "unit") {
    value = value.replace(/[0-9.]/g, "");
  }

  if (name === "description") {
    const rooms = project.rooms;
    let cRoom = rooms[roomIndex];
    const units = [...cRoom.Units];
    let cUnit = units[unitIndex];
    let components = cUnit.Components;
    let cComponent = components[componentIndex];
    let work = [...cComponent.Work];
    let cWork = work[workIndex];
    // console.log('name :  ',name)
    // console.log('project rooms obj',cWork)
    // console.log('changed By: ', changedBy);
    if (changedBy === "onChangeAutocomplete") {
      onChangeWork(
        roomIndex,
        unitIndex,
        componentIndex,
        workIndex,
        project,
        setProject,
        updateFBRDB,
        "unit",
        workSuggestions
          .map((item) => {
            if (item.description.localeCompare(value) === 0) {
              return item.unit;
            }
          })
          .filter((item) => item != undefined)[0] || cWork["unit"]
      );
      onChangeWork(
        roomIndex,
        unitIndex,
        componentIndex,
        workIndex,
        project,
        setProject,
        updateFBRDB,
        "rate",
        workSuggestions
          .map((item) => {
            if (item.description.localeCompare(value) === 0) {
              return item.rate;
            }
          })
          .filter((item) => item != undefined)[0] || cWork["rate"]
      );
      onChangeWork(
        roomIndex,
        unitIndex,
        componentIndex,
        workIndex,
        project,
        setProject,
        updateFBRDB,
        "gst",
        workSuggestions
          .map((item) => {
            if (item.description.localeCompare(value) === 0) {
              return item.gst;
            }
          })
          .filter((item) => item != undefined)[0] || cWork["gst"]
      );
    }
  }
  console.log("rooms", project.rooms);
  const rooms = project.rooms;
  let cRoom = rooms[roomIndex];
  const units = [...cRoom.Units];
  let cUnit = units[unitIndex];
  let components = cUnit.Components;
  let cComponent = components[componentIndex];
  let work = [...cComponent.Work];
  let cWork = work[workIndex];
  cWork = { ...cWork, [name]: value };
  work.splice(workIndex, 1, cWork);
  cComponent = { ...cComponent, Work: work };
  components.splice(componentIndex, 1, cComponent);
  units.splice(unitIndex, 1, { ...cUnit, Components: components });
  cRoom = { ...cRoom, Units: units };
  rooms.splice(roomIndex, 1, cRoom);
  setProject((dt) => ({ ...dt, rooms }));
  updateFBRDB({ ...project, rooms });
};

const addMaterial = (
  roomIndex,
  unitIndex,
  componentIndex,
  materialIndex,
  project,
  setProject,
  updateFBRDB,
  selectedComponentMaterials
) => {
  const rooms = project.rooms;
  let cRoom = rooms[roomIndex];
  let units = [...cRoom.Units];
  let cUnit = units[unitIndex];
  let components = cUnit.Components;
  let cComponent = components[componentIndex];

  var materialObject = {
    OrderId: new Date().getTime(),
    category: "Carpenter",
    type: "Plywood",
    item: "",
    specification: "",
    quantity: "",
    rate: "",
    unit: "",
    gst: "",
    milestones: [{ name: "Completion", percentage: "100" }],
    status: "",
    orderStatus: "",
  };

  // console.log(`selectedComponentMaterials`, selectedComponentMaterials)

  if (selectedComponentMaterials) {
    materialObject.type = selectedComponentMaterials.category;
    materialObject.specification = selectedComponentMaterials.specification;
    materialObject.rate = selectedComponentMaterials.rate;
    materialObject.unit = selectedComponentMaterials.unit;
    materialObject.gst = selectedComponentMaterials.gst;
  }

  let material = cComponent.Material;
  material.splice(materialIndex + 1, 0, materialObject);
  cComponent = { ...cComponent, Material: material };
  components.splice(componentIndex, 1, cComponent);
  units.splice(unitIndex, 1, cUnit);
  cRoom = { ...cRoom, Units: units };
  rooms.splice(roomIndex, 1, cRoom);
  setProject((dt) => ({ ...dt, rooms }));
  updateFBRDB({ ...project, rooms });
};

const deleteMaterial = (
  roomIndex,
  unitIndex,
  componentIndex,
  materialIndex,
  project,
  setProject,
  updateFBRDB
) => {
  confirmAlert({
    title: "Confirm to submit",
    message: "Are you sure to do this.",
    buttons: [
      {
        label: "Yes",
        onClick: () => {
          const rooms = project.rooms;
          let cRoom = rooms[roomIndex];
          let units = [...cRoom.Units];
          let cUnit = units[unitIndex];
          let components = cUnit.Components;
          let cComponent = components[componentIndex];
          cComponent = {
            ...cComponent,
            Material: cComponent.Material.filter(
              (_, index) => index !== materialIndex
            ),
          };
          components.splice(componentIndex, 1, cComponent);
          units.splice(unitIndex, 1, cUnit);
          cRoom = { ...cRoom, Units: units };
          rooms.splice(roomIndex, 1, cRoom);
          setProject((dt) => ({ ...dt, rooms }));
          updateFBRDB({ ...project, rooms });
        },
      },
      {
        label: "No",
        onClick: () => null,
      },
    ],
  });
};

const deleteSuggestiveMaterial = (
  roomIndex,
  unitIndex,
  componentIndex,
  componentMaterialsLength,
  project,
  setProject,
  updateFBRDB
) => {
  const rooms = project.rooms;
  let cRoom = rooms[roomIndex];
  let units = [...cRoom.Units];
  let cUnit = units[unitIndex];
  let components = cUnit.Components;
  let cComponent = components[componentIndex];

  cComponent = {
    ...cComponent,
    Material: cComponent.Material.filter(
      (_, index) => index > componentMaterialsLength - 1
    ),
  };

  components.splice(componentIndex, componentMaterialsLength, cComponent);
  units.splice(unitIndex, 1, cUnit);
  cRoom = { ...cRoom, Units: units };
  rooms.splice(roomIndex, 1, cRoom);
  setProject((dt) => ({ ...dt, rooms }));
  updateFBRDB({ ...project, rooms });
};

const onChangeMaterial = (
  roomIndex,
  unitIndex,
  componentIndex,
  materialIndex,
  project,
  setProject,
  updateFBRDB,
  name,
  value,
  changedBy,
  materialSuggestions
) => {
  if (name === "rate" || name === "quantity" || name === "gst") {
    value = value && value.replace(/(?!-)[^0-9.]/g, "");
  }

  if (name === "unit") {
    value = value.replace(/[0-9.]/g, "");
  }

  if (name === "specification") {
    if (changedBy === "onChangeAutocomplete") {
      const rooms = project.rooms;
      let cRoom = rooms[roomIndex];
      const units = [...cRoom.Units];
      let cUnit = units[unitIndex];
      let components = cUnit.Components;
      let cComponent = components[componentIndex];
      let material = [...cComponent.Material];
      let cMaterial = material[materialIndex];
      // cMaterial = { ...cMaterial, [name]: value };
      // material.splice(materialIndex, 1, cMaterial);
      // cComponent = { ...cComponent, Material: material };
      // components.splice(componentIndex, 1, cComponent);
      // units.splice(unitIndex, 1, { ...cUnit, Components: components });
      // cRoom = { ...cRoom, Units: units };
      // rooms.splice(roomIndex, 1, cRoom);
      onChangeMaterial(
        roomIndex,
        unitIndex,
        componentIndex,
        materialIndex,
        project,
        setProject,
        updateFBRDB,
        "unit",
        materialSuggestions
          .map((item) => {
            if (item.specification.localeCompare(value) === 0) {
              return item.unit;
            }
          })
          .filter((item) => item != undefined)[0] || cMaterial["unit"]
      );
      onChangeMaterial(
        roomIndex,
        unitIndex,
        componentIndex,
        materialIndex,
        project,
        setProject,
        updateFBRDB,
        "rate",
        materialSuggestions
          .map((item) => {
            if (item.specification.localeCompare(value) === 0) {
              return item.rate;
            }
          })
          .filter((item) => item != undefined)[0] || cMaterial["rate"]
      );
      onChangeMaterial(
        roomIndex,
        unitIndex,
        componentIndex,
        materialIndex,
        project,
        setProject,
        updateFBRDB,
        "gst",
        materialSuggestions
          .map((item) => {
            if (item.specification.localeCompare(value) === 0) {
              return item.gst;
            }
          })
          .filter((item) => item != undefined)[0] || cMaterial["gst"]
      );
    }
  }

  const rooms = project.rooms;
  let cRoom = rooms[roomIndex];
  const units = [...cRoom.Units];
  let cUnit = units[unitIndex];
  let components = cUnit.Components;
  let cComponent = components[componentIndex];
  let material = [...cComponent.Material];
  let cMaterial = material[materialIndex];
  cMaterial = { ...cMaterial, [name]: value };
  material.splice(materialIndex, 1, cMaterial);
  cComponent = { ...cComponent, Material: material };
  components.splice(componentIndex, 1, cComponent);
  units.splice(unitIndex, 1, { ...cUnit, Components: components });
  cRoom = { ...cRoom, Units: units };
  rooms.splice(roomIndex, 1, cRoom);

  // console.log('Current Room: ', project.rooms);

  // project.rooms[roomIndex].Units[unitIndex].Components[componentIndex].Material[materialIndex][name] = value;
  // console.log(project.rooms)

  setProject((dt) => ({ ...dt, rooms: project.rooms }));
  updateFBRDB({ ...project, rooms: project.rooms });
};

const saveWorkButtonClicked = async (data, setSpinner, updateFBRDB) => {
  setSpinner && setSpinner(true);

  let rawRoomData = String.raw`${JSON.stringify(data.Rooms)}`;
  const escapedRoomsString = JSON.stringify(
    JSON.parse(rawRoomData, (key, value) =>
      typeof value === "string" ? value.replace(/\n/g, "") : value
    )
  );

  const _data = {
    Rooms: escapedRoomsString,
    ProjectId: data.ProjectId,
    ProjectStatus: "started",
  };

  const projectService = new ProjectService();
  const response = await projectService.setProject(_data);
  if (updateFBRDB) {
    let _data = { ...data };
    delete _data["AmountRecieved"];
    updateFBRDB(_data);
  }
  setSpinner && setSpinner(false);
};

const downloadBOQ = (project) => {
  if (!project || project.rooms.length === 0) {
    toast.error("No BOQ data found!");
    return;
  }

  const rows = [];
  project.rooms.forEach((room, roomIndex) => {
    rows.push({ SNO: roomIndex + 1, Description: room["Room Name"] });
    room.Units.forEach((unit, unitIndex) => {
      rows.push({
        SNO: `${roomIndex + 1}.${unitIndex + 1}`,
        Description: unit["Unit Name"],
      });
      unit.Components.forEach((component, componentIndex) => {
        const description = component.description
          .replace(/<new-line>/g, "\n")
          .replace(/<single-quote>/g, "'");

        let quantity;
        if (component.length && component.breadth && component.height) {
          const length = Number(component.length);
          const breadth = Number(component.breadth);
          const height = Number(component.height);
          const dimensions = [length, breadth, height];
          dimensions.sort((a, b) => b - a); 
          quantity = dimensions[0] * dimensions[1];
        } else {
          quantity = Number(component.quantity) || 0;
        }

        const brand= component.brand
        const descriptionWithNewLines = description.split("\n").join("\n\n");

        console.log("brand is", component.brand)

        rows.push({
          SNO: `${roomIndex + 1}.${unitIndex + 1}.${componentIndex + 1}`,
          Description: descriptionWithNewLines,
          Dimensions:
            component.length && component.breadth && component.height
              ? `L-${component.length} B-${component.breadth} H-${component.height}`
              : 0,
          "Qty/Area": quantity,
          Brand: brand,
          Unit: component.unit,
          Rate: component.rate,
          Amount: parseInt(component.quantity) * parseInt(component.rate),
          Remarks: component.Remarks,
        });
      });
    });
  });

  const data = [
    {
      sheet: "",
      columns: [
        { label: "SNO", value: "SNO" },
        { label: "Description", value: "Description" },
        { label: "Dimensions", value: "Dimensions" },
        { label: "Qty/Area", value: "Qty/Area" },
        { label: "Brand", value: "Brand" },
        { label: "Unit", value: "Unit" },
        { label: "Rate", value: "Rate" },
        { label: "Amount", value: "Amount" },
        { label: "Remarks", value: "Remarks" },
      ],
      content: rows,
    },
  ];

  const settings = {
    fileName: project.clientName || "SampleBOQ",
    extraLength: 3,
    writeOptions: {
      useStyles: true,
      useSharedStrings: true,
      bookType: "xlsx",
      bookSST: false,
      type: "binary",
      cellStyles: true,
      wrapText: true,
    },
  };

  xlsxReader(data, settings);
};

const importBOQ = (file, project, setProject, updateFBRDB) => {
  if (file.size >= 40000000) {
    toast.error("BOQ file size can not be more than 5 MB!");
    return;
  }
  const rooms = [];
  xlsx(file)
    .then((rows) => {
      // only one sheet
      const errorList = [];
      rows.forEach((row, index) => {
        if (row[0]) {
          const indexPattern = row[0] + "";
          if (indexPattern.match(/^[0-9]+.[0-9]+.[0-9]+/)) {
            const roomId = indexPattern.split(".")[0] - 1;
            const unitId = indexPattern.split(".")[1] - 1;
            let description = "";
            if (row[1]) {
              description = row[1]
                .replace(/\n/g, "<new-line>")
                .replace(/'/g, "<single-quote>")
                .replace(/"/g, "<double-quote>")
                .replace(/₹/g, "<rupee-symbol>");
            }
            if (rooms[roomId]?.Units[unitId]?.Components) {
              rooms[roomId].Units[unitId].Components = [
                ...rooms[roomId].Units[unitId].Components,
                {
                  description,
                  quantity: row[2] + "" === "null" ? "0" : row[2] + "",
                  rate: row[4] + "" === "null" ? "0" : row[4] + "",
                  unit: row[3],
                  Work: [],
                  Material: [],
                },
              ];
              return;
            }
            errorList.push(
              <div
                style={{ fontSize: 12, marginBottom: 5 }}
              >{`Error at index ${index} - while adding component`}</div>
            );
            return;
          }
          if (indexPattern.match(/^[0-9]+.[0-9]+/) && row[1]) {
            const roomId = indexPattern.split(".")[0] - 1;
            if (rooms[roomId]?.Units) {
              rooms[roomId].Units = [
                ...rooms[roomId].Units,
                { "Unit Name": row[1], Drawings: [], Components: [] },
              ];
              return;
            }
            errorList.push(
              <div
                style={{ fontSize: 12, marginBottom: 5 }}
              >{`Error at index ${index} - while adding sub heading`}</div>
            );
            return;
          }
          if (indexPattern.match(/^[0-9]+/) && row[1]) {
            const _roomname = row[1]
              .replace(/\n/g, "<new-line>")
              .replace(/'/g, "<single-quote>")
              .replace(/"/g, "<double-quote>")
              .replace(/₹/g, "<rupee-symbol>");
            rooms.push({ "Room Name": _roomname, Units: [] });
            return;
          }
        }
      });
      console.log("Rooms: ", rooms);
      if (errorList.length > 0) {
        toast.error(`Error importing BOQ! ${errorList.map((error) => error)}`, {
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
      setProject((st) => ({ ...st, rooms, Rooms: rooms }));
      toast.success("Imported Successfully");
      updateFBRDB({ ...project, rooms, Rooms: rooms });
    })
    .catch((e) => {
      console.log(e);
    });
};

const getDifference = (n1, n2) => {
  if (isNaN(n1) && isNaN(n2)) {
    return;
  }
  if (n2 === 0) {
    return;
  }
  return {
    percentage: Math.floor(((n2 - n1) / n1) * 100),
    value: Math.abs(Math.floor(n2 - n1)),
  };
};

export {
  addRoom,
  onChangeRoom,
  delRoom,
  addUnit,
  deleteUnit,
  onChangeUnit,
  addNewComponent,
  deleteComponent,
  onChangeComponent,
  addWork,
  deleteWork,
  onChangeWork,
  addMaterial,
  deleteMaterial,
  onChangeMaterial,
  saveWorkButtonClicked,
  downloadBOQ,
  importBOQ,
  duplicateComponent,
  getDifference,
};
