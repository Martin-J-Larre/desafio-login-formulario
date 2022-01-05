import { Router } from "express";
const router = new Router();
import { validateSession } from "../index.js";

//---------------------services
import { MessagesServices } from "../services/MessagesServices.js";
import { messagesCollection } from "../db/options/mongoDB.js";
const service = new MessagesServices(messagesCollection);

//------------------Milddlewares
function validateMessage(req, res, next) {
	const { author, message, date } = req.body;
	const { id, name, surname, age, alias } = author;
	if (!id || !name || !surname || !age || !alias || !message || !date)
		return res.status(406).json({ error: "Invalid message." });
	else next();
}

//------------------Helpers
async function emitLoadMessages() {
	try {
		const messages = await service.getMessagesAll();

		const { io } = await import("../index.js");
		io.sockets.emit("loadMessages", messages);
	} catch (error) {
		console.log(error.message);
	}
}

//ROUTES
//------------- Get
router.get("/", validateSession, async (req, res) => {
	try {
		const messages = await service.getMessagesAll();

		res.json(messages);
	} catch (error) {
		res.status(500).json({ error: "Error in getMessagesAll()", description: error.message });
	}
});

//------------- Post
router.post("/", validateSession, validateMessage, async (req, res) => {
	try {
		const newMessage = await service.insertMessage(req.body);

		res.json(newMessage);

		await emitLoadMessages();
	} catch (error) {
		res.status(500).json({ error: "Error in insertMessage()", description: error.message });
	}
});

export { router };