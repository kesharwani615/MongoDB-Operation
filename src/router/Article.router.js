import { Router } from "express";
import { articleController, changeArticleStatus, getarticles,deletearticle, updatearticle } from "../controller/Article.conrtoller.js";

const router = Router();

router.post('/articleCreate',articleController);

router.patch('/articleStatusChange/:id',changeArticleStatus);

router.get('/getarticles',getarticles);

router.delete('/deletearticle/:id',deletearticle);

router.put('/updatearticle/:id',updatearticle);

export default router