import { increaseTomatoes } from "@/prisma/operations";

export default async function handler(req, res) {
    const { id } = req.body;
    await increaseTomatoes(id);
    
    res.status(200).json("Tomatoes increased");
}