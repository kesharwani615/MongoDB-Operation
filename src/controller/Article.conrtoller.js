import {
  articleSchemaValidation,
  articleStatusChangeSchemaValidation,
} from "../service/JoiHelper.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Article from "../model/Article.model.js";

export const articleController = asyncHandler(async (req, res) => {
  const { error } = articleSchemaValidation.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    throw new ApiError(400, message);
  }

  const {
    ArticleTitle,
    ArticleDescription,
    ArticleCategory,
    Articleimage,
    ArticleUrl,
    ArticleContent,
  } = req.body;

  const savedData = new Article({
    ArticleTitle,
    ArticleDescription,
    ArticleCategory,
    Articleimage,
    ArticleUrl,
    ArticleContent,
  });

  await savedData.save();

  const response = new ApiResponse(201, savedData, "User fetched successfully");

  res.status(response.statusCode).json(response);
});

export const changeArticleStatus = asyncHandler(async (req, res) => {
  const { error } = articleStatusChangeSchemaValidation.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    throw new ApiError(400, message);
  }

  const { id } = req.params;

  const { status } = req.body;

  const savedData = await Article.findByIdAndUpdate(
    id,
    { ArticleStatus: status },
    { new: true }
  );

  console.log(savedData);

  const response = new ApiResponse(201, savedData, "User updated successfully");

  res.status(response.statusCode).json(response);
});

export const getarticles = asyncHandler(async (req, res) => {
  const { type, limit, page } = req.query;

  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const skipCount = (pageNumber - 1) * pageSize;

  const matched = type ? { $match: { ArticleStatus: type } } : { $match: {} };

  const pipeline = [matched, {$skip:skipCount},{$limit:pageSize}];

  const gotData = await Article.aggregate(pipeline);

  const totalData = await Article.aggregate([{$count:"total"}]);
  console.log("totalData:",totalData);

  const pagination = {
    page:pageNumber,
    total:totalData[0]?.total,
    limit:limit,
  }

  console.log(gotData);
  const response = new ApiResponse(
    201,
    gotData,
    `all ${type ? type : "article fetched"} successfully`,pagination
  );

  res.status(response.statusCode).json(response);
});

export const deletearticle = asyncHandler(async(req,res)=>{
  const {id} = req.params;

  let response=null;

  const matchedData = await Article.findByIdAndDelete({_id:id})
  
  if(!matchedData){
  throw new ApiError(404,"Data Not Found")
  }else{
    response = new ApiResponse(
    200,
    matchedData,
    `Article deleted successfully!`
  );
}
res.status(response.statusCode).json(response);

})

export const updatearticle = asyncHandler(async(req,res)=>{
  const {id} = req.params;  

  const updatedData =await Article.findOneAndUpdate(
    {_id:id},
    {$set:req.body},
    {new:true}
  )

  let response=null;

  if(!updatedData){
    throw new ApiError(404,"article not found");
  }

   response = new ApiResponse(
    200,
    updatedData,
    `Article deleted successfully!`
   )

   return res.status(response.statusCode).json(response);
});