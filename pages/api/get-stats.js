import { getStats } from "@/prisma/operations";

export default async function handler(req, res) {
    const { mail } = req.body;
    const stat = await getStats(mail);
    
    res.status(200).json(stat);
}