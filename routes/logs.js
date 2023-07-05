import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// https://mongoosejs.com/docs/6.x/docs/guide.html#virtuals
// https://mongoosejs.com/docs/6.x/docs/guide.html#toJSON
// https://mongoosejs.com/docs/6.x/docs/api/schematypeoptions.html#schematypeoptions_SchemaTypeOptions-transform
// https://mongoosejs.com/docs/6.x/docs/api/schematype.html#schematype_SchemaType-transform
const toJSON_opts = {
  virtuals: true,
  // getters: true,
  // transform: function (doc, ret) {
  //   delete ret.id;
  // }
};

// GET /api/users/:_id/logs?[from][&to][&limit]
router.get('/:_id/logs', async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { from, to, limit } = req.query;

    const match = {};
    if (from) {
      match.date = { $gt: new Date(from) };
    }
    if (to) {
      match.date = { ...match.date, $lt: new Date(to) };
    }

    const user = await User.findById(_id)
      .select('_id username log')
      .populate({
        path: 'log',
        match,
        options: { limit: parseInt(limit) || 0 },
        select: 'description duration date'
      })
      .exec();

    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }

    res.json(user.toJSON(toJSON_opts));
  } catch (error) {
    next(error);
  }
});

export default router;
