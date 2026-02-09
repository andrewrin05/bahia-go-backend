// Servicio para subir imágenes a Cloudinary desde React Native
// Requiere tu cloud_name y upload_preset de Cloudinary

export async function uploadImageToCloudinary(localUri) {
  const data = new FormData();
  data.append('file', {
    uri: localUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  });
  data.append('upload_preset', 'bahia_go');
  data.append('cloud_name', 'dthjyzxxt');

  const res = await fetch('https://api.cloudinary.com/v1_1/dthjyzxxt/image/upload', {
    method: 'POST',
    body: data,
  });
  const json = await res.json();
  if (!json.secure_url) throw new Error('Error subiendo imagen a Cloudinary');
  return json.secure_url;
}
