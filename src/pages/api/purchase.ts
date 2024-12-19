// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

const BLUE_VENDING_BE_ENDPOINT = process.env.BLUE_VENDING_BE_ENDPOINT;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const resp = await axios.post(`${BLUE_VENDING_BE_ENDPOINT}/api/v1/transactions/cash`, req.body);
    res.status(200).json(resp.data);
  } catch (error: unknown) {
    console.error(error)
    if (error instanceof AxiosError) {
      res.status(400).json(error.response?.data);
    }
  }
}
