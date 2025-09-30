import express from "express";
import { fundTransfer, getBalance } from "../controller/accountsController";

const router = express.Router();

router.get("/balance", getBalance);
router.post("/transfer", fundTransfer);

export default router;
