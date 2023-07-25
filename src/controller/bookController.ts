import { Request, Response, NextFuction } from "express";
import Book from "../model/bookModel";

/***
 * GET BOOKs
 */
export const getBooks = async (req: Request, res: Response) => {
  try {
    // Paginantion
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalPages = (await Book.count()) / limit;

    const books = await Book.find().skip(skip).limit(limit);

    return res.status(200).json({
      status: "success",
      pages: totalPages,
      books,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error,
    });
  }
};

/***
 * GET BOOK
 */
export const getBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);

    return res.status(200).json({
      status: "success",
      book,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error,
    });
  }
};

/***
 * DELETE BOOK
 */
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: "success",
      book: "null",
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error,
    });
  }
};

/***
 * POST BOOK
 */

export const createBook = async (req: Request, res: Response) => {
  try {
    const {
      title,
      author,
      genre,
      publicationDate,
      ISBN,
      quantityAvailable,
      price,
    } = req.body;

    let error = [];

    const book = await Book.create({
      title,
      author,
      genre,
      publicationDate,
      ISBN,
      quantityAvailable,
      price,
    });

    return res.status(201).json({
      status: "success",
      book,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error,
    });
  }
};

/***
 * PATCH BOOK
 */
export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      success: "success",
      book,
    });
  } catch (e) {
    return res.status(400).json({
      status: "fail",
      error: e,
    });
  }
};
