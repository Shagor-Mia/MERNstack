// const { cloudinary } = require("../config/cloudinary");

// const PublicIdWithoutExtentionFromUrl = async (imageUrl) => {
//   const pathSegments = imageUrl.split("/");
//   //get lastsegment
//   const LastSegment = pathSegments[pathSegments.length - 1];
//   const valueWithoutExt = LastSegment.replace(".jpg", "");
//   return valueWithoutExt; //
// };

// const productSlugWithoutExtentionFromUrl = async (imageUrl) => {
//   const pathSegments = imageUrl.split("/");
//   //get lastsegment
//   const LastSegment = pathSegments[pathSegments.length - 1];
//   const valueWithoutExt = LastSegment.replace(".jpg", "");
//   return valueWithoutExt; //
// };

// const deleteFileFromCloudinary = async (folderName, publicId, modelName) => {
//   const { result } = await cloudinary.uploader.destroy(
//     `${folderName}/${publicId}`
//   );
//   if (result != "ok") {
//     throw createError(
//       500,
//       `${modelName} image was not deleted from cloudinary!please try again.`
//     ); //
//   }
// };

// module.exports = {
//   PublicIdWithoutExtentionFromUrl,
//   productSlugWithoutExtentionFromUrl,
//   deleteFileFromCloudinary, //
// };
