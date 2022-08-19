import axios from "axios";
import React, { useEffect, useState } from "react";
import useWindowDimensions from "../../hooks/WindowDimensions";
import RangeInput from "../inputs/input.range";
import styles from "./Layout.module.scss";
import MyViewPort from "./MyViewPort";
import ViewPort from "./ViewPort";
type traitT = "BACKGROUND" | "FUR" | "EYES" | "CLOTHING" | "NECKLACE" | "HAIR" | "MOUTH";
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
  background: backgroundT;
  url: string;
  src?: string;
  tokenId: number;
  error?: string;
  loading: boolean;
  image: HTMLImageElement;
} | null;
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
  const { width, height } = useWindowDimensions();
  const [caption, setCaption] = useState("");
  const [captionColor, setCaptionColor] = useState("#ffffff");
  const [showLockscreenOverlay, setShowLockscreenOverlay] = useState(true);
  const [fetchedData, setFetchedData] = useState<fetchedDataT>(null);
  const [tokenId, setTokenId] = useState(1);
  const [vertical, setVertical] = useState(100);
  const [scale, setScale] = useState(100);
  const [preview, setPreview] = useState(false);
  console.log(scale);
  useEffect(() => {
    let canceled = false;
    const token = tokenId == 0 ? 1 : tokenId;
    const source = axios.CancelToken.source();
    console.log("fetching");
    setFetchedData((state) => (state ? { ...state, error: undefined, loading: true } : null));
    axios(`https://ipfs.io/ipfs/QmSnQ4CKfkmUx9bs8yTymmU1nDBkboCWCV2LN33UdDR2XT/${token}`, {
      cancelToken: source.token,
    })
      .then(async (response) => {
        if (!canceled) {
          const data = response.data as responseT;
          const image = new Image();
          image.src = data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
          await new Promise((resolve) => {
            image.onload = () => resolve(null);
          });
          if (!canceled) {
            console.log(data.attributes.filter((e) => e.trait_type == "BACKGROUND")[0].value);
            setFetchedData({
              url: data.image,
              background: data.attributes.filter((e) => e.trait_type == "BACKGROUND")[0].value,
              tokenId: token,
              loading: false,
              error: undefined,
              image,
            });
          }
        }
      })
      .catch((e) => {
        if (!canceled) {
          if (axios.isCancel(e)) {
            console.log("Request canceled 19");
            setFetchedData((state) => (state ? { ...state, error: undefined, loading: false } : null));
            return; //fetchedData;
          } else {
            setFetchedData((state) => (state ? { ...state, error: "Failed to fetch ipfs", loading: false } : null));
          }
        }
      });

    return () => {
      canceled = true;
      setFetchedData((state) => (state ? { ...state, error: "Failed to fetch ipfs", loading: false } : null));
      source.cancel("Request canceled");
    };
  }, [tokenId]);

  return (
    <div className={styles.Layout}>
      <div className={styles.Layout_container}>
        <div className={styles.box}>
          <div className={styles.box_left}>
            <div className={styles.form_container}>
              <form className={styles.form_layout} onSubmit={({ preventDefault }) => preventDefault()}>
                <div className={styles.form_layout_option}>
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
                {/* <div className={styles.form_layout_option}>
                  <p>Logo overlay</p>
                  <select>
                    <option value="a">none</option>
                    <option value="a">none</option>
                    <option value="a">None</option>
                    <option value="a">zalupa</option>
                  </select>
                </div> */}
                <div className={styles.form_layout_option}>
                  <p>Custom caption</p>
                  <div className={styles.form_layout_custom}>
                    <input
                      type="text"
                      placeholder={"Twitter handle / Discord nickname / etc."}
                      onChange={({ target }) => setCaption(target.value)}
                    />
                    <input type="color" value={captionColor} onChange={({ target }) => setCaptionColor(target.value)} />
                  </div>
                </div>
                <div className={styles.form_layout_option}>
                  <p className={styles["form_layout_scale-text"]}>Image size</p>
                  <div className={styles.form_layout_scale}>
                    <RangeInput min={30} max={100} value={scale} onChange={({ target }) => setScale(+target.value)} />
                    {/* <input type="range" /> */}
                  </div>
                </div>
                {width <= 666 && (
                  <div className={styles.form_layout_option}>
                    <p className={styles["form_layout_scale-text"]}>Image vertical position</p>
                    <div className={styles.form_layout_scale}>
                      <RangeInput
                        min={0}
                        max={100}
                        value={vertical}
                        onChange={({ target }) => setVertical(+target.value)}
                      />
                    </div>
                  </div>
                )}
                <div className={styles.form_layout_option}>
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
                </div>
                <div className={styles.form_layout_option}>
                  <button>SAVE</button>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={!preview && showLockscreenOverlay}
                    onChange={({ target }) => setShowLockscreenOverlay(target.checked)}
                  />
                  <span>Show lockscreen overlay</span>
                </div>
              </form>
            </div>
          </div>
          <div className={styles.box_right}>
            <MyViewPort
              text={caption}
              textColor={captionColor}
              showLockScreenOverlay={showLockscreenOverlay}
              data={fetchedData}
              vertical={1 - vertical / 100}
              scale={scale / 100}
              preview={preview}
            />
            {/* {fetchedData?.loading && (
              <div className={styles.loadingContainer}>
                <div className={styles["lds-ring"]}>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )} */}
            {width > 666 && (
              <div className={styles.box_right_verticalWrapper}>
                <RangeInput
                  orient={"vertical"}
                  min={0}
                  max={100}
                  value={vertical}
                  onChange={({ target }) => setVertical(+target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
