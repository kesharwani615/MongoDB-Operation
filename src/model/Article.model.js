import { Schema, model } from "mongoose";

const articleSchema = new Schema({
  ArticleTitle: {
    type: String,
    required: true,
  },
  ArticleDescription: {
    type: String,
    required: true,
  },
  ArticleCategory: {
    type: String,
    required: true,
  },
  Articleimage: {
    type: String,
    required: true,
  },
  ArticleUrl: {
    type: String,
    required: true,
  },
  ArticleContent: {
    type: String,
    required: true,
  },
  ArticleStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    required: true,
  },
});

const Article = model("Article", articleSchema);

export default Article;
