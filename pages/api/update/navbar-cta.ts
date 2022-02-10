import requireSession from '@/lib/require-session';
import prisma from '@/utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { siteId, navbarCta } = req.body;

  const site = await prisma.site.update({
    where: {
      id: siteId,
    },
    data: {
      navbarCta,
    },
  });

  console.log(site);

  res.json(site);
};

export default requireSession(handler);
