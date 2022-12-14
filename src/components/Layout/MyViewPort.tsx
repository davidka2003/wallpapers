import React, { useEffect, useRef, useState } from "react";
import iphone from "../../assets/iphone.png";
import overlay from "../../assets/screen.png";
import { CanvasWrapText } from "../../utils/text.utils";
import { fetchedDataT, logoT } from "./Layout";
import { saveAs } from "file-saver";
import styles from "./ViewPort.module.scss";
const BACKGROUNDS = {
  Pumpkin: "#d69444", //4
  Mint: "#6fd0c5", //1162
  H2O: "#a2e5f4", //7934
  Macaroon: "#fcdad8", //9456
  Blueberry: "#7289b5", //4605
  Ice: "#cfd0cb", //5375
  Watermelon: "#c27272", //2238
  Oyster: "#447286", //3203
  Mustard: "#bc9e65",
  Eggplant: "#827183",
};
const MyViewPort = ({
  text,
  textColor,
  showLockScreenOverlay,
  data,
  logoVertical,
  scale,
  preview,
  canvasRef,
  logo,
  scaleLogo,
  logoText,
}: {
  text: string;
  textColor: string;
  showLockScreenOverlay: boolean;
  data: fetchedDataT;
  logoVertical: number;
  scale: number;
  preview: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  logo: HTMLImageElement | null;
  scaleLogo: number;
  logoText: logoT;
}) => {
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  //   const [text, setText] = useState("asassad sadsdanjkasndkjdasn kas djkasjnassdaknsak sadjnsajknsjanjsaddd");
  useEffect(() => {
    const init = async () => {
      if (canvasRef.current) {
        // console.log("hui");
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d")!;
        const iphoneImage = new Image();
        iphoneImage.setAttribute("crossorigin", "anonymous");
        iphoneImage.src = iphone;
        await new Promise((resolve) => {
          iphoneImage.onload = () => resolve(null);
        });
        // console.log(iphoneImage.width, iphoneImage.height);
        const fontSize = 90;
        canvas.width = iphoneImage.width;
        canvas.height = iphoneImage.height;
        ctx.font = `${fontSize}px ${"Kanit, sans-serif"}`;
        // ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        if (data.data) {
          ctx.beginPath();
          ctx.rect(0, 0, canvas.width, canvas.height);
          //@ts-ignore
          ctx.fillStyle = BACKGROUNDS[data.data.background];
          // console.log(BACKGROUNDS[data.data.background]);
          ctx.fill();
          // ctx.fillStyle = textColor;

          // ctx.fillText(text, iphoneImage.width / 2, iphoneImage.height / 2);
          //   const scale = 0.5;
          const { image } = data.data;
          const width = canvas.width * scale;
          const height = image.height * (canvas.width / image.width) * scale;
          const x = (canvas.width - width) / 2;
          //   console.log(vertical);
          const y = 1 /* logoVertical */ * (canvas.height - height);
          ctx.drawImage(image, x, y, width, height);
        }
        if (logo) {
          // debugger;
          const image = logo;
          // console.log(logoText);

          // console.log(image);
          // console.log(scaleLogo);
          const width = canvas.width * scaleLogo;
          const height = image.height * (canvas.width / image.width) * scaleLogo;
          const x = (canvas.width - width) / 2;
          const y = logoVertical * (canvas.height - height);
          ctx.drawImage(image, x, y, width, height);
        }
        //no need
        ctx.fillStyle = textColor;
        CanvasWrapText(
          ctx,
          text,
          iphoneImage.width / 2,
          iphoneImage.height / 2,
          canvas.width * 0.9,
          fontSize + fontSize * 0.2
        );
      }
    };
    // };
    init();
  }, [canvasRef, text, textColor, data.data, scale, logoVertical, logo, scaleLogo]);
  // console.log("loading,", data.loading);
  return (
    <div className={styles.IphoneWrapper}>
      {!preview && <img className={styles.IphoneWrapper_iphone} src={iphone} />}
      {!preview && showLockScreenOverlay && <img className={styles.IphoneWrapper_iphone} src={overlay} />}
      <div className={styles.ViewPort}>
        <canvas
          className={styles[!preview ? "ViewPort_canvas" : "ViewPort_canvas-preview"]}
          // style={{ width: 400, height: "auto", border: "solid 1px white", background: `url("../../assets/iphone.png")` }}
          ref={canvasRef}
        ></canvas>
      </div>
      {data.loading && (
        <div className={styles.loadingContainer}>
          <div className={styles["lds-ring"]}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      {/* <input type="text" value={text} onChange={(event) => setText(event.target.value)} /> */}
    </div>
  );
};

export default MyViewPort;
