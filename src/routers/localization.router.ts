import { json, Router } from 'express';
import fileStream from 'fs';

const localizationRouter = Router();

localizationRouter.use(json());

localizationRouter.get("/:language", async (request, response) => {
    try {
        
        fileStream.readFile('../src/assets/lang/'+request.params.language+'.json', 'utf8', function (error, translation) {
            if (error) throw error;
            response.json(JSON.parse(translation));
        });
    }
    catch (error) {
        console.log(error);
        response.status(500);
        response.send(error);
    }
});

export default localizationRouter;