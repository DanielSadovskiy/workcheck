import bodyParser from 'body-parser';
import { Router } from 'express';

const routes = Router();;
const professorController = require("../controllers/ProfessorController")

console.log(professorController)

const jsonParser = bodyParser.json({ type: 'application/json' });

routes.post("/login", jsonParser, professorController.loginHandler);
routes.get('/getAll', professorController.getAll)
routes.post('/changePassword', jsonParser, professorController.changePasswordHandler)
routes.post('/changeOldPassword', jsonParser, professorController.changeOldPasswordHandler)
routes.get('/getPolicies', professorController.getPolicies)
routes.put('/addNewPolicy', jsonParser, professorController.addNewPolicyHandler)
routes.delete('/removePolicy', jsonParser, professorController.removePolicyHandler)
routes.post('/focus', jsonParser, professorController.userChangedFocusHandler);

export default routes;
