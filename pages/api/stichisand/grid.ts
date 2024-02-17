import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb"


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

function getCollection() {
  return clientPromise
    .then(client => client.db(DB_NAME))
    .then(db => db.collection(COLLECTION_NAME));
}

export function getGrid(id: string | string[] | undefined | null) {
  if (typeof id !== "string") {
    return Promise.resolve(undefined);
  }
  return getCollection()
    .then(collection => {
      const _id = new ObjectId(id as string);
      return collection.findOne({ _id });
    }).then(doc => {
      return doc as unknown as (GridData | undefined);
    });
}


export function GET(
  req: NextApiRequest,
  res: NextApiResponse<GridData>
) {
  const { id } = req.query;
  return getGrid(id)?.then(grid => {
    if (grid) {
      return res.status(200).json(grid as unknown as GridData);
    }
    return res.status(404);
  });
}

export function POST(
  req: NextApiRequest,
  res: NextApiResponse<{ id: string }>
) {
  return getCollection()
    .then(collection => {
      const body = JSON.parse(req.body) as GridData;
      const { id, ...rawBody } = body;
      if (id) {
        const _id = new ObjectId(id);
        return collection.updateOne({ _id }, { "$set": { ...rawBody, updated: new Date() } })
          .then(() => id);
      }
      return collection.insertOne({ ...rawBody, created: new Date() })
        .then(doc => doc.insertedId.toString());
    }).then(id => {
      return res.status(200).json({ id });
    });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GridData | { id: string }>
) {
  const method = req.method;
  if (method === "GET") {
    return GET(req, res);
  } else if (method === "POST") {
    return POST(req, res);
  }
  return res.status(405);
}
