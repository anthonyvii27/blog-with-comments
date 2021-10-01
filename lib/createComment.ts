import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';

import { IComment } from '@interfaces/IComments';
import { connectToDatabase } from '@config/mongodb';

async function CreateComments(req: NextApiRequest, res: NextApiResponse) {
    const { db } = await connectToDatabase();
    
    const { username, text } = req.body;

    const slug = req.query.slug; 

    if(!username || !text || !slug) {
        return res.status(400).json({ message: 'Invalid parameters' });
    }

    const comment: IComment = {
        id: nanoid(),
        username,
        text,
        created_at: new Date(),
        slug
    }

    try {
        const entity = await db.collection("comments").insertOne(comment);
        return res.status(200).json({ entity });
    
    } catch(_) {
        return res.status(400).json({ message: 'Unexpected error occurred' });
    }
}

export default CreateComments;