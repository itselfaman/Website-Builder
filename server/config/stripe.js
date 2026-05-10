// import dotenv from "dotenv"
// dotenv.config()
// import Stripe from "stripe"
// const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)
// export default stripe

import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";

let stripe;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn("⚠️ Stripe key missing - Stripe disabled");
  stripe = null;
}

export default stripe;