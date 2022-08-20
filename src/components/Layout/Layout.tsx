import axios from "axios";
import saveAs from "file-saver";
import React, { useEffect, useRef, useState } from "react";
import useWindowDimensions from "../../hooks/WindowDimensions";
import RangeInput from "../inputs/input.range";
import styles from "./Layout.module.scss";
import MyViewPort from "./MyViewPort";
import logoBlack from "../../assets/logo-black.png";
import logoWhite from "../../assets/logo-white.png";
import Iphone from "./Iphone";
type traitT = "BACKGROUND" | "FUR" | "EYES" | "CLOTHING" | "NECKLACE" | "HAIR" | "MOUTH";
export type logoT = "null" | "logo-white" | "logo-black";
type backgroundT =
  | "Pumpkin"
  | "Mint"
  | "H2O"
  | "Macaroon"
  | "Blueberry"
  | "Ice"
  | "Watermelon"
  | "Oyster"
  | "Mustard"
  | "Eggplant";
export type fetchedDataT = {
  data?: {
    background: backgroundT;
    url: string;
    src?: string;
    tokenId: number;
    error?: string;
    // loading: boolean;
    image: HTMLImageElement;
  };
  loading: boolean;
};
type responseT = {
  description: string;
  image: string;
  name: string;
  attributes: {
    trait_type: traitT;
    value: backgroundT;
  }[];
};
const Layout = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { width, height } = useWindowDimensions();
  const [caption, setCaption] = useState("");
  const [captionColor, setCaptionColor] = useState("#ffffff");
  const [showLockscreenOverlay, setShowLockscreenOverlay] = useState(true);
  const [fetchedData, setFetchedData] = useState<fetchedDataT>({ loading: true });
  const [tokenId, setTokenId] = useState(1);
  const [logoVertical, setLogoVertical] = useState(60);
  const [scaleDAW, setScaleDAW] = useState(100);
  const [scaleLogoDAW, setScaleLogoDAW] = useState(50);
  const [logo, setLogo] = useState<logoT>("logo-black");
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [preview, setPreview] = useState(false);
  console.log(logo);
  useEffect(() => {
    const init = async () => {
      if (logo === "null") {
        console.log("setting logo to null");
        setLogoImage(null);
        return setLogo("null");
      }
      const image = new Image();
      setFetchedData((state) => (state ? { ...state, loading: true } : { loading: true }));
      switch (logo) {
        case "logo-black":
          image.src = logoBlack;
          break;
        case "logo-white":
          image.src = logoWhite;
          break;
        default:
          break;
      }
      await new Promise((resolve) => (image.onload = () => resolve(null)));
      setFetchedData((state) => (state ? { ...state, loading: false } : { loading: false }));
      setLogoImage(image);
    };
    init();
  }, [logo]);
  useEffect(() => {
    let canceled = false;
    const token = tokenId == 0 ? 1 : tokenId;
    const source = axios.CancelToken.source();
    console.log("fetching");
    setFetchedData((state) => (state ? { ...state, error: undefined, loading: true } : { loading: true }));
    axios(`https://ipfs.io/ipfs/QmSnQ4CKfkmUx9bs8yTymmU1nDBkboCWCV2LN33UdDR2XT/${token}`, {
      cancelToken: source.token,
    })
      .then(async (response) => {
        if (!canceled) {
          const data = response.data as responseT;
          const image = new Image();
          image.src = data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
          image.crossOrigin = "anonymus";
          await new Promise((resolve) => {
            image.onload = () => resolve(null);
          });
          if (!canceled) {
            console.log(data.attributes.filter((e) => e.trait_type == "BACKGROUND")[0].value);
            setFetchedData({
              data: {
                url: data.image,
                background: data.attributes.filter((e) => e.trait_type == "BACKGROUND")[0].value,
                tokenId: token,
                // loading: false,
                error: undefined,
                image,
              },
              loading: false,
            });
          }
        }
      })
      .catch((e) => {
        if (!canceled) {
          if (axios.isCancel(e)) {
            // console.log("Request canceled 19");
            setFetchedData((state) => (state ? { ...state, error: undefined, loading: false } : { loading: false }));
            return; //fetchedData;
          } else {
            setFetchedData((state) =>
              state ? { ...state, error: "Failed to fetch ipfs", loading: false } : { loading: false }
            );
          }
        }
      });
    return () => {
      canceled = true;
      setFetchedData((state) =>
        state ? { ...state, error: "Failed to fetch ipfs", loading: false } : { loading: false }
      );
      source.cancel("Request canceled");
    };
  }, [tokenId]);
  const saveHandler = async () => {
    fetchedData.data &&
      canvasRef.current?.toBlob((blob) => {
        blob && saveAs(blob, `DAW_Wallpaper#${fetchedData.data!.tokenId}.png`);
      });
  };

  return (
    <div className={styles.Layout}>
      <div className={styles.box}>
        <div className={styles.box_left}>
          <div className={styles.form_container}>
            <form className={styles.form_layout} onSubmit={({ preventDefault }) => preventDefault()}>
              <div className={styles.form_layout_optionBasic}>
                <p>DAW token number</p>
                <input
                  type="number"
                  max={10000}
                  min={1}
                  value={tokenId}
                  placeholder="DAW token number"
                  onChange={({ target }) => {
                    +target.value <= 10000 && setTokenId(+target.value);
                  }}
                />
              </div>
              <div className={styles.form_layout_optionRange}>
                <div className={styles.form_layout_optionRange_description}>Image size:</div>
                <RangeInput
                  min={100}
                  max={150}
                  value={scaleDAW}
                  onChange={({ target }) => setScaleDAW(+target.value)}
                />
                <div className={styles.form_layout_optionRange_scale}>{scaleDAW}%</div>
              </div>
              <div className={styles.form_layout_optionBasic}>
                <p>Logo overlay</p>
                <select
                  disabled={fetchedData.loading}
                  value={logo}
                  onChange={async ({ target: { value } }) => {
                    console.log("setted,", value);
                    setLogo(value as logoT);
                  }}
                >
                  <option value={"null" as logoT}>None</option>
                  <option value={"logo-white" as logoT}>White logo</option>
                  <option value={"logo-black" as logoT}>Black logo</option>
                </select>
              </div>
              <div
                className={styles.form_layout_optionRange}
                style={{ visibility: logo === "null" ? "hidden" : "visible" }}
              >
                <div className={styles.form_layout_optionRange_description}>Logo size:</div>
                <RangeInput
                  min={50}
                  max={150}
                  value={scaleLogoDAW}
                  onChange={({ target }) => setScaleLogoDAW(+target.value)}
                />
                <div className={styles.form_layout_optionRange_scale}>{scaleLogoDAW}%</div>
              </div>

              <div className={styles.form_layout_optionRange}>
                <div className={styles.form_layout_optionRange_description}>Logo vertical:</div>
                <RangeInput
                  min={0}
                  max={100}
                  value={logoVertical}
                  onChange={({ target }) => setLogoVertical(+target.value)}
                />
                <div className={styles.form_layout_optionRange_scale}>{logoVertical}%</div>
              </div>

              <div>
                <div className={styles.btnControlUnion}>
                  {!preview ? (
                    <button
                      type={"button"}
                      onClick={({ preventDefault }) => {
                        // preventDefault();
                        setPreview(true);
                      }}
                    >
                      PREVIEW
                    </button>
                  ) : (
                    <button
                      type={"button"}
                      onClick={({ preventDefault }) => {
                        // preventDefault();
                        setPreview(false);
                      }}
                    >
                      VIEW
                    </button>
                  )}
                  <button type={"button"} disabled={!fetchedData && !!canvasRef.current} onClick={saveHandler}>
                    SAVE
                  </button>
                </div>
              </div>
              {/* <div>
                  <input
                    type="checkbox"
                    checked={!preview && showLockscreenOverlay}
                    onChange={({ target }) => setShowLockscreenOverlay(target.checked)}
                  />
                  <span>Show lockscreen overlay</span>
                </div> */}
            </form>
          </div>
        </div>
        <div className={styles.box_right}>
          {/* <Iphone /> */}
          {/* <div className={styles.previewButton}>
            {!preview ? (
              <button
                type={"button"}
                onClick={({ preventDefault }) => {
                  // preventDefault();
                  setPreview(true);
                }}
              >
                PREVIEW
              </button>
            ) : (
              <button
                type={"button"}
                onClick={({ preventDefault }) => {
                  // preventDefault();
                  setPreview(false);
                }}
              >
                HIDE PREVIEW
              </button>
            )}
          </div> */}
          <MyViewPort
            text={caption}
            textColor={captionColor}
            showLockScreenOverlay={showLockscreenOverlay}
            data={fetchedData}
            logoVertical={1 - logoVertical / 100}
            scale={scaleDAW / 100}
            logo={logoImage}
            scaleLogo={scaleLogoDAW / 100}
            preview={preview}
            canvasRef={canvasRef}
            logoText={logo}
          />
        </div>
      </div>
    </div>
  );
};

export default Layout;
