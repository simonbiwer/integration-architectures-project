import { Router } from "express";
import { isLoggedIn, login, logout } from "./auth-api";
import { checkAuthorization } from "../middleware/auth-middleware";
import { getSelf } from "./user-api";

const router = Router();

router.post('/login', login);
router.delete('/login', checkAuthorization(false), logout);
router.get('/login', isLoggedIn);

router.get('/user', checkAuthorization(false), getSelf);