
import Gig from '../models/Gig.js';

// @desc    Fetch all gigs
// @route   GET /api/gigs
// @access  Public
const getGigs = async (req, res) => {
    const keyword = req.query.keyword
        ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const gigs = await Gig.find({ ...keyword, status: 'open' }).populate('ownerId', 'name email');
    res.json(gigs);
};

// @desc    Create a gig
// @route   POST /api/gigs
// @access  Private
const createGig = async (req, res) => {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const gig = new Gig({
        title,
        description,
        budget,
        ownerId: req.user._id,
        status: 'open',
    });

    const createdGig = await gig.save();
    res.status(201).json(createdGig);
};

// @desc    Get user gigs
// @route   GET /api/gigs/my
// @access  Private
const getMyGigs = async (req, res) => {
    const gigs = await Gig.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.json(gigs);
}

// @desc    Get gig by ID
// @route   GET /api/gigs/:id
// @access  Public
const getGigById = async (req, res) => {
    const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');

    if (gig) {
        res.json(gig);
    } else {
        res.status(404);
        throw new Error('Gig not found');
    }
}

export { getGigs, createGig, getMyGigs, getGigById };
