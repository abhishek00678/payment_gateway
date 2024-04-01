import express from "express";
import { handleWebhook } from "../controller/payment.js";

const router = express.Router();

router.post("/checkout", handleWebhook);

export default router;
