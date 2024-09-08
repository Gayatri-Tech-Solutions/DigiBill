export const validateOtherData = (data) => {
 const { address, bankDetails, firmDetails } = data;

 // Validate otherData
 if (
   !address?.city ||
   !address?.country ||
   !address?.houseno ||
   !address?.locality ||
   !address?.pin ||
   !address?.state
 ) {
   return false;
 }

 // Validate bankDetails
 if (
   !bankDetails?.IFSCcode ||
   !bankDetails?.accountName ||
   !bankDetails?.accountNumber ||
   !bankDetails?.bankName ||
   !bankDetails?.branch ||
   !bankDetails?.city ||
   !bankDetails?.pincode
 ) {
   return false;
 }

 // Validate firmDetails
 if (
   !firmDetails?.SAScode ||
   !firmDetails?.firmName ||
   !firmDetails?.gst ||
   !firmDetails?.phone
 ) {
   return false;
 }

 return true;
};
