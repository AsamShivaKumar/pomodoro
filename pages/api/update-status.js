import { updateStatus } from "@/prisma/operations";

export default async function handler(req, res) {
    const { id } = req.body;
    await updateStatus(id);
    
    res.status(200).json("Status updated");
}