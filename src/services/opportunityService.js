import config from "../config/config";

const dataObject = {
  OrderId: 0,
  ClientId: 1612092733076,
  VendorId: {},
  SiteEngineerId: null,
  TransactionId: 161096557991,
  ProjectId: 2222222222222,
  Lat: "-20.075890",
  Lng: "146.257309",
  Status: "Order Placed",
  // Status: "",
  Category: ["Plywood", "Tiles"],
  Dates: {
    AcceptedDate: "",
  },
  Address: "Sample City, Sample State, XYZ",
  Payments: {},
  Data: {},
  VendorName: "",
  VendorMobile: null,
  ApprovalStatus: "",
  OrderTotalAmount: 0,
  CommonMilestones: {},
  vendorCompanyName: "",
  orderType: "",
  contactPersonName: "",
  contactPersonNumber: "",
  siteEngineerName: "",
  siteEngineerNumber: "",
  discount: "",
  startDate: "",
  endDate: "",
  vendorFirm: "",
  vendorGSTIN: "",
  vendorAddress: "",
  vendorPinCode: "",
  vendorCity: "",
  vendorState: "",
  termsAndConditions: "",
  paymentTerms: "",
  specialInstructions: "",
  priceBase: "",
  freight: "",
  insurance: "",
  shippingAddress: "",
  billingAddress: "",
  attachments: "",
};

class OpportunityService {
  async add(
    data,
    clientName,
    address,
    totalAmount,
    projectId,
    StartDate,
    EndDate,
    typ,
    vendorMobile,
    activeCategory,
    isApproval,
    requestHistory,
    Firm,
    OrderTotalAmount,
    CommonMilestones,
    vendorCompanyName,
    OrderId,
    orderType,
    contactPersonName,
    contactPersonNumber,
    siteEngineerName,
    siteEngineerNumber,
    discount,
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
  ) {
    // console.log('Common Milestones : ', CommonMilestones ,'dataObject',dataObject["ApprovalStatus"] )
    if (typ === "work") {
      // const { OrderId } = data[0];
      dataObject["VendorId"] = { [activeCategory]: null, vendorCompanyName };
      dataObject["Category"] = activeCategory.toString();
      dataObject["OrderId"] = OrderId;
    } else {
      // const { OrderId } = data[0];
      dataObject["VendorId"] = { [activeCategory]: null, vendorCompanyName };
      dataObject["Category"] = activeCategory.toString();
      dataObject["OrderId"] = OrderId;
    }

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
    // console.log('approval order  ',isApproval)
    let reqHistoryObject = {
      [lastUpdatedTimestamp]: {
        ...requestHistory,
        comments: isApproval ? "Request For Approval" : "Ordered",
        status: isApproval ? "Requested" : "Ordered",
        date: lastUpdatedDate,
        time: lastUpdatedTime,
        userId: requestHistory.raised,
        By: requestHistory.raised.slice(0, requestHistory.raised.indexOf("@")),
      },
    };

    if (isApproval) {
      dataObject["ApprovalStatus"] = "inApproval"; // this should be inApproval for api to in order to filter the orders
      dataObject["requestHistory"] = reqHistoryObject;
    } else {
      dataObject["ApprovalStatus"] = "Ordered";
      dataObject["requestHistory"] = reqHistoryObject;
    }
    dataObject["Data"] = {
      data,
      ClientName: clientName,
      StartDate,
      EndDate,
      releasedDate: new Date(),
    };
    dataObject["Data"] = { ...dataObject["Data"] };
    // console.log('totalAmount : ',totalAmount)
    dataObject["Payments"] = { TotalAmount: totalAmount };
    dataObject["Address"] = address;
    dataObject["ProjectId"] = projectId;
    // console.log('OrdertotalAmount to updated,',OrderTotalAmount)
    dataObject["OrderTotalAmount"] = OrderTotalAmount;
    dataObject["CommonMilestones"] = CommonMilestones;
    dataObject["Firm"] = Firm;

    // dataObject["orderType"] = orderType;
    // dataObject["contactPersonNumber"] = contactPersonNumber;
    // dataObject["contactPersonName"] = contactPersonName;
    // dataObject["siteEngineerName"] = siteEngineerName;
    // dataObject["siteEngineerNumber"] = siteEngineerNumber;
    // dataObject["discount"] = discount;
    // dataObject["startDate"] = StartDate;
    // dataObject["endDate"] = EndDate;
    // dataObject["vendorFirm"] = vendorFirm;
    // dataObject["vendorGSTIN"] = vendorGSTIN;
    // dataObject["vendorAddress"] = vendorAddress;
    // dataObject["vendorPinCode"] = vendorPinCode;
    // dataObject["vendorCity"] = vendorCity;
    // dataObject["vendorState"] = vendorState;
    // dataObject["termsAndConditions"] = termsAndConditions;
    // dataObject["paymentTerms"] = paymentTerms;
    // dataObject["specialInstructions"] = specialInstructions;
    // dataObject["priceBase"] = priceBase;
    // dataObject["freight"] = freight;
    // dataObject["insurance"] = insurance;
    // dataObject["shippingAddress"] = shippingAddress;
    // dataObject["billingAddress"] = billingAddress;
    // dataObject["attachments"] = JSON.stringify(attachments);

    console.log("dataObject", dataObject);
    try {
      const url =
        vendorMobile == "Open Vendor"
          ? `${config.orderService}serviceOrder`
          : `${config.orderService}serviceOrder/assignToVendor/${vendorMobile}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization:
            "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MiwiTmFtZSI6IlNoaXZhIiwiTW9iaWxlIjo4MDE5NzMxNzkwLCJTdGF0ZSI6IlRTIiwiQ2l0eSI6Ikh5ZGVyYWJhZCIsIkFyZWEiOiJIaXRlY2ggY2l0eSIsIlN0cmVldCI6IktQSEIgcGhhc2UgNyIsIkJ1bGRpbmciOiJJbmR1IEZvcnR1bmUiLCJGbGF0Tm8iOiIxMDIiLCJpYXQiOjE2MDk3Mzc0NjJ9.1B0hEQ9dTmwBLv5c0pFqnH9ES4sHr4IYFcIsLzFe9FQ",
        },
        body: JSON.stringify(dataObject),
      });
      response = await response.json();
      return { ...response };
    } catch (e) {
      return {
        status: 400,
        statusMsg: "Error while making opportunity!",
        payload: e,
      };
    }
  }

  async getOpportunitiesByProjectId(ProjectId) {
    try {
      let response = await fetch(
        `${config.orderService}getServiceOrders/${ProjectId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization:
              "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MiwiTmFtZSI6IlNoaXZhIiwiTW9iaWxlIjo4MDE5NzMxNzkwLCJTdGF0ZSI6IlRTIiwiQ2l0eSI6Ikh5ZGVyYWJhZCIsIkFyZWEiOiJIaXRlY2ggY2l0eSIsIlN0cmVldCI6IktQSEIgcGhhc2UgNyIsIkJ1bGRpbmciOiJJbmR1IEZvcnR1bmUiLCJGbGF0Tm8iOiIxMDIiLCJpYXQiOjE2MDk3Mzc0NjJ9.1B0hEQ9dTmwBLv5c0pFqnH9ES4sHr4IYFcIsLzFe9FQ",
          },
        }
      );

      response = await response.json();
      return { ...response };
    } catch (e) {
      return {
        status: 400,
        statusMsg: "Error fetching project data!",
        payload: e,
      };
    }
  }

  async getOpportunityByOrderId(OrderId) {
    try {
      let response = await fetch(
        `${config.orderService}getServiceOrdersById/${OrderId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization:
              "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MiwiTmFtZSI6IlNoaXZhIiwiTW9iaWxlIjo4MDE5NzMxNzkwLCJTdGF0ZSI6IlRTIiwiQ2l0eSI6Ikh5ZGVyYWJhZCIsIkFyZWEiOiJIaXRlY2ggY2l0eSIsIlN0cmVldCI6IktQSEIgcGhhc2UgNyIsIkJ1bGRpbmciOiJJbmR1IEZvcnR1bmUiLCJGbGF0Tm8iOiIxMDIiLCJpYXQiOjE2MDk3Mzc0NjJ9.1B0hEQ9dTmwBLv5c0pFqnH9ES4sHr4IYFcIsLzFe9FQ",
          },
        }
      );

      response = await response.json();
      return { ...response };
    } catch (e) {
      return {
        status: 400,
        statusMsg: "Error fetching opportunity data!",
        payload: e,
      };
    }
  }

  async updateOpportunityById(id, data) {
    try {
      let response = await fetch(`${config.orderService}serviceOrder/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MiwiTmFtZSI6IlNoaXZhIiwiTW9iaWxlIjo4MDE5NzMxNzkwLCJTdGF0ZSI6IlRTIiwiQ2l0eSI6Ikh5ZGVyYWJhZCIsIkFyZWEiOiJIaXRlY2ggY2l0eSIsIlN0cmVldCI6IktQSEIgcGhhc2UgNyIsIkJ1bGRpbmciOiJJbmR1IEZvcnR1bmUiLCJGbGF0Tm8iOiIxMDIiLCJpYXQiOjE2MDk3Mzc0NjJ9.1B0hEQ9dTmwBLv5c0pFqnH9ES4sHr4IYFcIsLzFe9FQ",
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      response = await response.json();
      return { ...response };
    } catch (e) {
      return {
        status: 400,
        statusMsg: "Error updating opportunity",
        payload: e,
      };
    }
  }

  async deleteOrderByID(orderId) {
    try {
      let response = await fetch(
        `${config.orderService}ServiceOrders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );
      response = await response.json();
      return { ...response };
    } catch (e) {
      return {
        status: 400,
        statusMsg: "Error deleting opportunity",
        payload: e,
      };
    }
  }

  async addFinanceRequest(data) {
    console.log("proejct der", data);
    try {
      let response = await fetch(`${config.orderService}NewFinanceRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization:
            "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MiwiTmFtZSI6IlNoaXZhIiwiTW9iaWxlIjo4MDE5NzMxNzkwLCJTdGF0ZSI6IlRTIiwiQ2l0eSI6Ikh5ZGVyYWJhZCIsIkFyZWEiOiJIaXRlY2ggY2l0eSIsIlN0cmVldCI6IktQSEIgcGhhc2UgNyIsIkJ1bGRpbmciOiJJbmR1IEZvcnR1bmUiLCJGbGF0Tm8iOiIxMDIiLCJpYXQiOjE2MDk3Mzc0NjJ9.1B0hEQ9dTmwBLv5c0pFqnH9ES4sHr4IYFcIsLzFe9FQ",
        },
        body: JSON.stringify({ ...data }),
      });
      response = await response.json();
      return { ...response };
    } catch (e) {
      console.log("Error While sending Request");
      return {
        status: 400,
        statusMsg: "Error updating opportunity",
        payload: e,
      };
    }
  }

  async getFinanceRequest(firm) {
    try {
      let response = await fetch(
        `${config.orderService}getFinanceRequests/${firm}`, //for now just uniworks
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization:
              "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MiwiTmFtZSI6IlNoaXZhIiwiTW9iaWxlIjo4MDE5NzMxNzkwLCJTdGF0ZSI6IlRTIiwiQ2l0eSI6Ikh5ZGVyYWJhZCIsIkFyZWEiOiJIaXRlY2ggY2l0eSIsIlN0cmVldCI6IktQSEIgcGhhc2UgNyIsIkJ1bGRpbmciOiJJbmR1IEZvcnR1bmUiLCJGbGF0Tm8iOiIxMDIiLCJpYXQiOjE2MDk3Mzc0NjJ9.1B0hEQ9dTmwBLv5c0pFqnH9ES4sHr4IYFcIsLzFe9FQ",
          },
        }
      );

      response = await response.json();
      return { ...response };
    } catch (e) {
      return {
        status: 400,
        statusMsg: "Error fetching Requests data!",
        payload: e,
      };
    }
  }

  async getFinanceRecord(firm) {
    try {
      let response = await fetch(
        `${config.orderService}getFinRecords/${firm}`, //for now just uniworks
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization:
              "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MiwiTmFtZSI6IlNoaXZhIiwiTW9iaWxlIjo4MDE5NzMxNzkwLCJTdGF0ZSI6IlRTIiwiQ2l0eSI6Ikh5ZGVyYWJhZCIsIkFyZWEiOiJIaXRlY2ggY2l0eSIsIlN0cmVldCI6IktQSEIgcGhhc2UgNyIsIkJ1bGRpbmciOiJJbmR1IEZvcnR1bmUiLCJGbGF0Tm8iOiIxMDIiLCJpYXQiOjE2MDk3Mzc0NjJ9.1B0hEQ9dTmwBLv5c0pFqnH9ES4sHr4IYFcIsLzFe9FQ",
          },
        }
      );

      response = await response.json();
      return { ...response };
    } catch (e) {
      return {
        status: 400,
        statusMsg: "Error fetching Requests data!",
        payload: e,
      };
    }
  }

  async getFinanceApprovalByOrderId(OrderId) {
    try {
      let response = await fetch(
        `${config.orderService}GetFinRecReqByOrderId/${OrderId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization:
              "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MiwiTmFtZSI6IlNoaXZhIiwiTW9iaWxlIjo4MDE5NzMxNzkwLCJTdGF0ZSI6IlRTIiwiQ2l0eSI6Ikh5ZGVyYWJhZCIsIkFyZWEiOiJIaXRlY2ggY2l0eSIsIlN0cmVldCI6IktQSEIgcGhhc2UgNyIsIkJ1bGRpbmciOiJJbmR1IEZvcnR1bmUiLCJGbGF0Tm8iOiIxMDIiLCJpYXQiOjE2MDk3Mzc0NjJ9.1B0hEQ9dTmwBLv5c0pFqnH9ES4sHr4IYFcIsLzFe9FQ",
          },
        }
      );

      response = await response.json();
      return { ...response };
    } catch (e) {
      return {
        status: 400,
        statusMsg: "Error fetching data!",
        payload: e,
      };
    }
  }
  async updateFinanceRequestByuuId(uuid, data) {
    try {
      let response = await fetch(
        `${config.orderService}updateFinanceRequest/${uuid}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization:
              "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MiwiTmFtZSI6IlNoaXZhIiwiTW9iaWxlIjo4MDE5NzMxNzkwLCJTdGF0ZSI6IlRTIiwiQ2l0eSI6Ikh5ZGVyYWJhZCIsIkFyZWEiOiJIaXRlY2ggY2l0eSIsIlN0cmVldCI6IktQSEIgcGhhc2UgNyIsIkJ1bGRpbmciOiJJbmR1IEZvcnR1bmUiLCJGbGF0Tm8iOiIxMDIiLCJpYXQiOjE2MDk3Mzc0NjJ9.1B0hEQ9dTmwBLv5c0pFqnH9ES4sHr4IYFcIsLzFe9FQ",
          },
          body: JSON.stringify({
            ...data,
          }),
        }
      );

      response = await response.json();
      return { ...response };
    } catch (e) {
      return {
        status: 400,
        statusMsg: "Error updating Request",
        payload: e,
      };
    }
  }

  async getFinanceReqRecAnalytics(Firm, isRequest) {
    let endpoint = isRequest
      ? "GetFinanceAnalyticsRequest"
      : "GetFinanceAnalyticsRecord";
    try {
      let response = await fetch(`${config.orderService}${endpoint}/${Firm}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MiwiTmFtZSI6IlNoaXZhIiwiTW9iaWxlIjo4MDE5NzMxNzkwLCJTdGF0ZSI6IlRTIiwiQ2l0eSI6Ikh5ZGVyYWJhZCIsIkFyZWEiOiJIaXRlY2ggY2l0eSIsIlN0cmVldCI6IktQSEIgcGhhc2UgNyIsIkJ1bGRpbmciOiJJbmR1IEZvcnR1bmUiLCJGbGF0Tm8iOiIxMDIiLCJpYXQiOjE2MDk3Mzc0NjJ9.1B0hEQ9dTmwBLv5c0pFqnH9ES4sHr4IYFcIsLzFe9FQ",
        },
      });

      response = await response.json();
      return { ...response };
    } catch (e) {
      return {
        status: 400,
        statusMsg: "Error Getting Analytics",
        payload: e,
      };
    }
  }

  async deleteRequestByuuid(uuid) {
    try {
      let response = await fetch(
        `${config.orderService}FinanceRequests/${uuid}`,
        {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );
      response = await response.json();
      return { ...response };
    } catch (e) {
      return {
        status: 400,
        statusMsg: "Error deleting opportunity",
        payload: e,
      };
    }
  }
}
export default OpportunityService;
