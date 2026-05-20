import Razorpay from "razorpay";

let instance;

export function getRazorpay() {
  if (!instance) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set");
    }
    instance = new Razorpay({ key_id, key_secret });
  }
  return instance;
}

export function getPublicKeyId() {
  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!key) throw new Error("NEXT_PUBLIC_RAZORPAY_KEY_ID must be set");
  return key;
}
