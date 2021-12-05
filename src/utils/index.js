import { shuffle } from "lodash";

export const gcd = (a, b) => {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
};

export const formatGridList = (data, colAmount, isWeb) => {
  let amount = 0;
  if (data.length <= 0) return [];
  const result = shuffle(data).map(item => {
    let cols = 0;
    if (item.metaData.aspectWidth === item.metaData.aspectHeight) {
      cols = isWeb ? 2 : 1;
    } else if (item.metaData.aspectWidth > item.metaData.aspectHeight) {
      cols = Math.min(item.metaData.aspectWidth, isWeb ? 4 : 1);
    } else {
      cols = Math.min(item.metaData.aspectWidth, isWeb ? 4 : 1);
    }
    amount += cols;
    if (isWeb && Math.abs(colAmount - amount) <= 3) {
      cols += colAmount - amount;
      amount = 0;
    }
    return { ...item, metaData: { ...item.metaData, cols } };
  });
  return result;
};

export const getImageMeta = async url =>
  new Promise((res, rej) => {
    const img = new Image();
    img.src = url;
    img.onload = function onLoad() {
      const divisor = gcd(this.width, this.height);
      res({
        width: this.width,
        height: this.height,
        aspectWidth: this.width / divisor,
        aspectHeight: this.height / divisor,
      });
    };
    img.onerror = function onError() {
      rej(new Error("Unable to get image meta data"));
    };
  });

export const fetchFileToJSON = async url => {
  const response = await fetch(url, { headers: { "Content-Type": "application/json", Accept: "application/json" } });
  const json = await response.json();
  return json;
};

export default {
  getImageMeta,
  fetchFileToJSON,
};
