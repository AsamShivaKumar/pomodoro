import { getUser } from "@/prisma/operations";

export default async function handler(req, res) {
    const { mail } = req.body;
    const user = await getUser(mail);
    
    res.status(200).json(user);
}