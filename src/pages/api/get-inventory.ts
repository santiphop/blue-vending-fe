// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios'

const BLUE_VENDING_BE_ENDPOINT = process.env.BLUE_VENDING_BE_ENDPOINT;
const MACHINE_ID = process.env.MACHINE_ID;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data = await axios.get(`${BLUE_VENDING_BE_ENDPOINT}/api/v1/inventories/${MACHINE_ID}?itemNumber=${req.query.itemNumber}`)
  res.status(200).json(data.data);
}
