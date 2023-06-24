import { addTask } from "@/prisma/operations";

export default async function handler(req, res) {
    const { title, description, userMail, deadline } = req.body;
    const newTask = await addTask(title, description, userMail, deadline);
    
    res.status(200).json(newTask);
}