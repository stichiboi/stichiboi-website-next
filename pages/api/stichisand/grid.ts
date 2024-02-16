import {NextApiRequest, NextApiResponse} from "next";
import clientPromise from "../../../lib/mongodb";
import {ObjectId} from "mongodb"


export type GridData = {
    version: string,
    grid: string,
    width: number,
    height: number,
    name: string,
    creatorName: string,
    id?: string
}

const DB_NAME = "stichisand";
const COLLECTION_NAME = "grid";

// GET
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GridData | { id: string }>
) {
    try {
        const {method} = req;
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME)

        if (method === "GET") {
            const {id} = req.query;
            if (!id) {
                return res.status(200);
            }
            const _id = new ObjectId(id as string);
            const grid = await collection.findOne({_id});
            if (grid) {
                return res.status(200).json(grid as unknown as GridData);
            }
            return res.status(404);
        } else if (method === "POST") {
            const body = JSON.parse(req.body) as GridData;
            let {id, ...rawBody} = body;
            if (id) {
                const _id = new ObjectId(id);
                await collection.updateOne({_id}, {"$set": {...rawBody, updated: new Date()}});
            } else {
                const doc = await collection.insertOne({...rawBody, created: new Date()});
                id = doc.insertedId.toString();
            }
            return res.status(200).json({id});
        }
        return res.status(405);
    } catch (e) {
        console.error(e);
        res.status(400);
    }
}
