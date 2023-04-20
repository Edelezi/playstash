import { Request, Response } from 'express';
import * as express from 'express';
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';

type WishlistItem = {
    userId: string;
    gameId: number;
    platform: string;
    category: string;
};

type DbSchema = {
    wishlists: WishlistItem[];
};

const adapter = new JSONFileSync<DbSchema>('db.json');
const db = new LowSync(adapter, { wishlists: [] });

db.read();

if (!db.data) {
    db.data = { wishlists: [] };
    db.write();
}

const wishlistRouter = express.Router();

wishlistRouter.post('/wishlist', (req: Request, res: Response) => {
    const { userId, gameId, platform, category } = req.body;

    if (!userId || !gameId || !platform || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const newWishlistItem: WishlistItem = {
        userId,
        gameId,
        platform,
        category,
    };

    db.data.wishlists.push(newWishlistItem);
    db.write();
    res.status(201).json(newWishlistItem);
});


wishlistRouter.get('/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'Missing user ID' });
    }

    const userWishlist = db.data.wishlists.filter(
        (item: WishlistItem) => item.userId === userId
    );

    res.status(200).json(userWishlist);
});

export { wishlistRouter };
