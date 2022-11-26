
import dotenv from 'dotenv'
import cloudinary from 'cloudinary'


dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

export const upload = async (file) => {
  console.log('uploading:',file)
  const image = await cloudinary.v2.uploader.upload(file,(result) => result);
  return image;
};

export const removeFromCloud = (avatar_id)=>{
  cloudinary.v2.uploader.destroy(avatar_id,()=>console.log("törlés a Clodinaryról:",avatar_id));
  return 
}