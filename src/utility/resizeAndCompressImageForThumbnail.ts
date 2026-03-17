import sharp from "sharp";
export const resizeAndCompressImageForThumbnail = async (
  imageBuffer: Buffer<ArrayBufferLike>,
) => {
  const compressedImage = await sharp(imageBuffer)
    .resize(400)
    .jpeg({ quality: 70 })
    .toBuffer();
  return compressedImage;
};
