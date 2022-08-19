import React, { useEffect, useRef, useState } from "react";
import iphone from "../../assets/iphone.png";
import overlay from "../../assets/screen.png";
import { CanvasWrapText } from "../../utils/text.utils";
import { fetchedDataT } from "./Layout";
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
  vertical,
  scale,
  preview,
}: {
  text: string;
  textColor: string;
  showLockScreenOverlay: boolean;
  data: fetchedDataT;
  vertical: number;
  scale: number;
  preview: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  //   const [text, setText] = useState("asassad sadsdanjkasndkjdasn kas djkasjnassdaknsak sadjnsajknsjanjsaddd");
  useEffect(() => {
    const init = async () => {
      if (canvasRef.current) {
        // console.log("hui");
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d")!;
        const iphoneImage = new Image();
        iphoneImage.src = iphone;
        await new Promise((resolve) => {
          iphoneImage.onload = () => resolve(null);
        });
        console.log(iphoneImage.width, iphoneImage.height);
        const fontSize = 90;
        canvas.width = iphoneImage.width;
        canvas.height = iphoneImage.height;
        ctx.font = `${fontSize}px ${"Kanit, sans-serif"}`;
        // ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        if (data) {
          ctx.beginPath();
          ctx.rect(0, 0, canvas.width, canvas.height);
          //@ts-ignore
          ctx.fillStyle = BACKGROUNDS[data.background];
          console.log(BACKGROUNDS[data.background]);
          ctx.fill();
          // ctx.fillStyle = textColor;

          // ctx.fillText(text, iphoneImage.width / 2, iphoneImage.height / 2);
          //   const scale = 0.5;
          const { image } = data;
          const width = canvas.width * scale;
          const height = image.height * (canvas.width / image.width) * scale;
          const x = (canvas.width - width) / 2;
          //   console.log(vertical);
          const y = vertical * (canvas.height - height);
          ctx.drawImage(image, x, y, width, height);
        }
        ctx.fillStyle = textColor;
        CanvasWrapText(
          ctx,
          text,
          iphoneImage.width / 2,
          iphoneImage.height / 2,
          canvas.width * 0.9,
          fontSize + fontSize * 0.2
        );
        // console.log(canvas.toDataURL());
      }
    };
    // };
    init();
  }, [canvasRef, text, textColor, data, scale, vertical]);
  return (
    <div className={styles.IphoneWrapper}>
      {!preview && <img className={styles.IphoneWrapper_iphone} src={iphone} />}
      {!preview && showLockScreenOverlay && <img className={styles.IphoneWrapper_iphone} src={overlay} />}
      <div className={styles.ViewPort}>
        <canvas
          className={styles.ViewPort_canvas}
          // style={{ width: 400, height: "auto", border: "solid 1px white", background: `url("../../assets/iphone.png")` }}
          ref={canvasRef}
        ></canvas>
      </div>
      {data?.loading && (
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
