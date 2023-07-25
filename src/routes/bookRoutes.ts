import { Router } from "express";
import {
  getBooks,
  getBook,
  deleteBook,
  createBook,
  updateBook,
} from "../controller/bookController";

import { protect } from "../controller/authController";

const router = Router();

router.route("/").get( getBooks).post(protect, createBook);
router.route("/:id").get(getBooks).patch(protect, updateBook).delete(protect, deleteBook);

export default router;
