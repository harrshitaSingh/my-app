import config from "../config/config";

class POService {
  async releasePO(
    Id,
    projectId,
    poDate,
    projectContactPerson,
    projectContactNumber,
    siteEngineerName,
    siteEngineerMobile,
    discription,
    CommonMilestones,
    // approvalDetails,
    termsAndCondition,
    shipToAddress,
    billToAddress,
    specialInstructions,
    discount,
    totalAmount,
    OrderId,
    startDate,
    endDate,
    firmGSTIN,
    firmLogoURL,
    firmSignature,
    firmName,
    firmAddress,
    firmPhoneNumber,
    firmContactPersonName,
    firmContactPersonNumber,
    firmContactPersonEmail,
    vendorMobile,
    vendorCompanyName,
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
  ) {
    try {
      const response = await (
        await fetch(`${config.poService}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            Id,
            projectId,
            poDate,
            projectContactPerson,
            projectContactNumber,
            siteEngineerName,
            siteEngineerMobile,
            discription,
            CommonMilestones,
            // approvalDetails: approvalDetails === "null" ? 'Ordered' : approvalDetails,
            termsAndCondition,
            shipToAddress,
            billToAddress,
            specialInstructions,
            discount,
            totalAmount,
            OrderId,
            startDate,
            endDate,
            firmGSTIN,
            firmLogoURL,
            firmSignature,
            firmName,
            firmAddress,
            firmPhoneNumber,
            firmContactPersonName,
            firmContactPersonNumber,
            firmContactPersonEmail,
            vendorMobile,
            vendorFirm: vendorCompanyName,
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
            bankAccountDetails,
          }),
        })
      ).json();
      return response;
    } catch (e) {
      console.log(e);
      return { status: 400, statusMsg: e };
    }
  }

  async getPoByOrderId(OrderId) {
    try {
      const response = await (
        await fetch(`${config.poService}${OrderId}`)
      ).json();
      return response;
    } catch (e) {
      console.log(e);
      return { status: 400, statusMsg: e };
    }
  }

  async getPosByProjectId(projectId) {
    try {
      const response = await (
        await fetch(`${config.poService}getPos/ByProjectId/${projectId}`)
      ).json();
      return response;
    } catch (e) {
      console.log(e);
      return { status: 400, statusMsg: e };
    }
  }

  // update with (PoId | Id)
  async updatePO(IdtoUpdate, data) {
    try {
      const response = await (
        await fetch(`${config.poService}${IdtoUpdate}`, {
          method: "PUT",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data }),
        })
      ).json();
      return response;
    } catch (e) {
      return { status: 400, statusMsg: e };
    }
  }

  // this is to update the node "AmmendedDetails" as unreleased:true, ||| updating with OrderId (notPOID | Id)
  async unReleasePO(IdtoUpdate, data) {
    //here it is orderId
    try {
      const response = await (
        await fetch(`${config.poService}unreleasePO/${IdtoUpdate}`, {
          method: "PUT",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data }),
        })
      ).json();
      return response;
    } catch (e) {
      return { status: 400, statusMsg: e };
    }
  }
}

export default POService;
