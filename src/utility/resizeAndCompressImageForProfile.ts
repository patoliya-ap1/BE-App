import sharp from "sharp";
export const resizeAndCompressImageForProfile = async (
  imageBuffer: Buffer<ArrayBufferLike>,
) => {
  const compressedImage = await sharp(imageBuffer)
    .resize(400)
    .jpeg({ quality: 70 })
    .toBuffer();
  return compressedImage;
};
