import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../config/mongodb';

async function GetComments(req: NextApiRequest, res: NextApiResponse) {
    const { db } = await connectToDatabase();
    
    const slug = req.query.slug; 

    if(!slug) {
        return res.status(400).json({ message: 'Invalid parameters' });
    }

    try {
        const comments = await db.collection('comments').find({ slug }).toArray();
        return res.status(200).json({ comments });
    
    } catch(_) {
        return res.status(400).json({ message: 'Unexpected error occurred' });
    }
}

export default GetComments;