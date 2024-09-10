import { NextApiRequest, NextApiResponse } from "next";
import { getEnvFromServer } from "../../services/env/getEnvFromServer";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    "Cache-Control",
    "public, maxage=1200, stale-while-revalidate=600"
  );
  res.status(200).json(getEnvFromServer());
}
