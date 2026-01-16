
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';

// @desc    Create a bid
// @route   POST /api/bids
// @access  Private
const createBid = async (req, res) => {
    const { gigId, message, price } = req.body;

    const gig = await Gig.findById(gigId);

    if (!gig) {
        res.status(404);
        throw new Error('Gig not found');
    }

    if (gig.ownerId.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('Cannot bid on your own gig');
    }

    if (gig.status !== 'open') {
        res.status(400);
        throw new Error('Gig is not open for bidding');
    }

    // Check if user already bid
    const existingBid = await Bid.findOne({ gigId, freelancerId: req.user._id });
    if (existingBid) {
        res.status(400);
        throw new Error('You have already placed a bid on this gig');
    }

    const bid = new Bid({
        gigId,
        freelancerId: req.user._id,
        message,
        price,
        status: 'pending',
    });

    const createdBid = await bid.save();
    res.status(201).json(createdBid);
};

// @desc    Get bids for a gig
// @route   GET /api/bids/:gigId
// @access  Private (Owner only)
const getBidsByGigId = async (req, res) => {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
        res.status(404);
        throw new Error('Gig not found');
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to view bids for this gig');
    }

    const bids = await Bid.find({ gigId: req.params.gigId }).populate('freelancerId', 'name email');
    res.json(bids);
};

// @desc    Hire a freelancer
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Owner only)
const hireFreelancer = async (req, res) => {
    const bid = await Bid.findById(req.params.bidId);

    if (!bid) {
        res.status(404);
        throw new Error('Bid not found');
    }

    const gig = await Gig.findById(bid.gigId);

    if (!gig) {
        res.status(404);
        throw new Error('Gig not found');
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to hire for this gig');
    }

    if (gig.status !== 'open') {
        res.status(400);
        throw new Error('Gig is already assigned');
    }

    // Atomic update logic
    // 1. Update chosen bid -> hired
    bid.status = 'hired';
    await bid.save();

    // 2. Update gig -> assigned
    gig.status = 'assigned';
    await gig.save();

    // 3. Update all other bids for this gig -> rejected
    await Bid.updateMany(
        { gigId: gig._id, _id: { $ne: bid._id } },
        { status: 'rejected' }
    );

    res.json({ message: 'Freelancer hired successfully', bid });
}

export { createBid, getBidsByGigId, hireFreelancer };
