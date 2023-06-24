import { deleteTask } from "@/prisma/operations";

export default async function handler(req, res) {
    const { taskId } = req.body;
    await deleteTask(taskId);
    
    res.status(200).json({message: "Task deleted"});
}