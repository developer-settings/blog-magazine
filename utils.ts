const cloudinary = require('cloudinary').v2;

export const uploadImage = async (imagePath: string) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
};
