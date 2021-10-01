import { NextApiRequest, NextApiResponse } from 'next';
import CreateComments from '@lib/createComment';
import GetComments from '@lib/getComments';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'GET':
            return GetComments(req, res);
        case 'POST':
            return CreateComments(req, res);
        default:
            return res.status(400).json({ message: 'Invalid method' });
    }
}