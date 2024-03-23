export const environment = "production";
// export const environment = "staging";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  environment: environment,
  authService:
    environment === "production"
      ? "https://us-central1-charming-shield-300804.cloudfunctions.net/authService/"
      : "https://us-central1-charming-shield-300804.cloudfunctions.net/authServiceStg/",
  orderService:
    environment === "production"
      ? "https://us-central1-charming-shield-300804.cloudfunctions.net/orderService/"
      : "https://us-central1-charming-shield-300804.cloudfunctions.net/orderServiceStg/",
  profileService:
    environment === "production"
      ? "https://us-central1-charming-shield-300804.cloudfunctions.net/profileService/"
      : "https://us-central1-charming-shield-300804.cloudfunctions.net/profileServiceStg/",
  projectService:
    environment === "production"
      ? "https://us-central1-charming-shield-300804.cloudfunctions.net/projectService/"
      : "https://us-central1-charming-shield-300804.cloudfunctions.net/projectServiceStg/",
  ticketService:
    environment === "production"
      ? "https://us-central1-charming-shield-300804.cloudfunctions.net/ticketService/"
      : "https://us-central1-charming-shield-300804.cloudfunctions.net/ticketServiceStg/",
  utilService:
    environment === "production"
      ? "https://us-central1-charming-shield-300804.cloudfunctions.net/utilService/"
      : "https://us-central1-charming-shield-300804.cloudfunctions.net/utilServiceStg/",
  poService:
    environment === "production"
      ? "https://us-central1-charming-shield-300804.cloudfunctions.net/poService/"
      : "https://us-central1-charming-shield-300804.cloudfunctions.net/poServiceStg/",
  smsService:
    environment === "production"
      ? "https://us-central1-charming-shield-300804.cloudfunctions.net/smsService/"
      : "https://us-central1-charming-shield-300804.cloudfunctions.net/smsServiceStg/",
  notificationService:
    environment === "production"
      ? "https://us-central1-charming-shield-300804.cloudfunctions.net/notificationService/"
      : "https://us-central1-charming-shield-300804.cloudfunctions.net/notificationServiceStg/",
  quotationService:
    environment === "production"
      ? "https://us-central1-charming-shield-300804.cloudfunctions.net/quotationService/"
      : "https://us-central1-charming-shield-300804.cloudfunctions.net/quotationServiceStg/",
  draftService:
    environment === "production"
      ? "https://us-central1-charming-shield-300804.cloudfunctions.net/draftService/"
      : "https://us-central1-charming-shield-300804.cloudfunctions.net/draftServiceStg/",
  transactionService:
    environment === "production"
      ? "https://us-central1-charming-shield-300804.cloudfunctions.net/transactionService/"
      : "https://us-central1-charming-shield-300804.cloudfunctions.net/transactionServiceStg/",
  notificationBilling:
    environment === "production"
      ? ""
      : "https://us-central1-charming-shield-300804.cloudfunctions.net/notificationbillingStg/",
  whatsAppService: {
    URL: "https://graph.facebook.com/v15.0/108575118598751/messages",
    AuthKey:
      "EABMoTAj7Sc4BAOkdcZCQzTSUhbLgZCHju0EyKKWfauMVlh0SbocZCJariD7YZA9YnYnNVjwRgAFRuWNwU4x0PvNJZCijkUWaXOa8G695WI7tV4Xt49mR5R2jfgmaizGGLtkha8OeGGZCTliuvZBKlj6k3dPfeo1RFP3dvSsLuIRgOiJjKEAWhrN",
  },
};
