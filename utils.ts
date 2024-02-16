const cloudinary = require('cloudinary').v2;

export const uploadImage = async (imagePath: string) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result.secure_url;
  } catch (error) {
    return null;
  }
};
