import axios from "axios";
import { Buffer } from "buffer";
import React, { useEffect, useRef, useState } from "react";
//@ts-ignore
import mergeImages from "merge-images-adv";
import iphone from "../../assets/iphone.png";
import screen from "../../assets/screen.png";
import arraybuffertobuffer from "arraybuffer-to-buffer";
const GenerateImage = async (tokenId: number) => {
  // const image = await urlToObject()
  const wallpaper = await urlToObject(
    "https://lh3.googleusercontent.com/efHW03CGIR1tWWWYzv5yk-W352bnbGkOown6LMQzixyfQRxlx2mBZL19z6dU6sm2EawzZOuGSMNacs2lPH-PY4CMcgnKsWxesZtqFF0=w600"
  );
  return await mergeImages(
    [
      {
        x: 230,
        y: 1300,
        width: 1000,
        height: 1000,
        src:
          "https://lh3.googleusercontent.com/efHW03CGIR1tWWWYzv5yk-W352bnbGkOown6LMQzixyfQRxlx2mBZL19z6dU6sm2EawzZOuGSMNacs2lPH-PY4CMcgnKsWxesZtqFF0=w600" ||
          wallpaper.image,
      },
      {
        src: iphone,
      },
      screen,

      // wallpaper
    ],
    { crossOrigin: "anonymous" /*  width: 1450, height: 2750 */ }
  );
};

const urlToObject = async (
  url: string
): Promise<{ error?: boolean; image?: string; buffer?: Buffer }> /* : Promise<{ error?: boolean; file?: File }> */ => {
  try {
    // "https://gateway.pinata.cloud/ipfs/QmSnQ4CKfkmUx9bs8yTymmU1nDBkboCWCV2LN33UdDR2XT/1"
    const buffer = (await axios
      .get(url, {
        responseType: "arraybuffer",
      })
      .then((response) => toBuffer(response.data))) as Buffer;
    // console.log(buffer);
    const response = await fetch(url);
    // here image is url/location of image
    const blob = await response.blob();
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(blob);
    // console.log(imageUrl);
    return { image: imageUrl };
    // const file = new File([blob], "image.jpg", { type: blob.type });
    // console.log(file, iphone);
    return { buffer };
  } catch (error) {
    console.log(error);
    return { error: true };
  }
};

const ViewPort = () => {
  const [image, setImage] = useState("");
  useEffect(() => {
    const init = async () => {
      setImage(await GenerateImage(1));
    };
    init();
    // console.log()
    // GenerateImage(1).then(setImage);
  }, []);
  return (
    <div>
      <Canvas />
      <img src={image} width="400px" height={"auto"} />
    </div>
  );
};
const Canvas = () => {
  const canvasRef = useRef<any>(null);
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    const canvas = document.createElement("canvas")!;
    canvas.width = 5 * 100;
    canvas.height = 5 * 50;
    canvas.style.width = "100px";
    canvas.style.height = "50px";
    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(5, 0, 0, 5, 0, 0);
    const font = "Arial";
    const text = "ssas";
    ctx.font = `100px "${font}"`;

    const { actualBoundingBoxLeft, actualBoundingBoxRight, actualBoundingBoxAscent, actualBoundingBoxDescent, width } =
      ctx.measureText(text);

    canvas.height = actualBoundingBoxAscent + actualBoundingBoxDescent;

    // Take the larger of the width and the horizontal bounding box
    // dimensions to try to prevent cropping of the text.
    canvas.width = Math.max(width, Math.abs(actualBoundingBoxLeft) + actualBoundingBoxRight);

    // Set the font again, since otherwise, it's not correctly set when filling.
    ctx.font = `50px ${font}`;
    ctx.fillStyle = "white";
    ctx.textBaseline = "top";
    ctx.fillText(text, 100, 0);
    canvas.toBlob((blob: any) => {
      console.log(blob);
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(blob);
      setImageUrl(imageUrl);
      console.log(imageUrl);
    });
  }, []);
  return (
    <>
      <img src={imageUrl} />
      {/* <canvas width="100" height="40" ref={canvasRef} /> */}
    </>
  );
};
function toBuffer(ab: ArrayBuffer) {
  const buf = Buffer.alloc(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}
export default ViewPort;
