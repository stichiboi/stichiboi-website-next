import {NextApiRequest, NextApiResponse} from "next";
import path from 'path';
import {promises as fs} from 'fs';

type WordData = {
  words: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WordData>
) {
  //Find the absolute path of the json directory
  const wordsDirectory = path.join(process.cwd(), "static", "parodle");

  const fileContents = await fs.readFile(wordsDirectory + "/ita_5.txt", 'utf8');
  const words = fileContents.split(/(\r)?\n/).filter(Boolean);
  res.status(200).json({words});
}