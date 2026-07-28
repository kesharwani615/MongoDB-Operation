import { Router } from "express";
import { getAllUserFilter } from "../controller/MYSQL.Controller.js";

const router = Router();

router.get("/getAllUserFilter", getAllUserFilter)

export default router;