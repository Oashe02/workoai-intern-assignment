import Candidate from '../models/CandidateModel.js';

const newCandidate = async (req, res) => {
    try {
        const {name, email, phone, jobTitle, resumeData, resumeFilename} = req.body;
        const candidate = await Candidate.create({
            name,
            email,
            phone,
            jobTitle,
            resumeData: resumeData || null,
            resumeFilename: resumeFilename || null,
        });
        res.status(201).json({
            success: true,
            message: 'Candidate referred successfully',
            data: candidate,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

const getAlCandidates = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        
        if (status) {
            query.status = status;
        }

        const candidates = await Candidate.find(query).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: candidates.length,
            data: candidates,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const getCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found',
            });
        }
        res.status(200).json({
            success: true,
            data: candidate,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const updateCandidateStatus = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Candidate status updated successfully',
            data: candidate,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Candidate deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const getStats = async (req, res) => {
    try {
        const stats = await Candidate.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const getResume = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate || !candidate.resumeData) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }
        
        // Convert base64 to buffer
        const pdfBuffer = Buffer.from(candidate.resumeData, 'base64');
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${candidate.resumeFilename || 'resume.pdf'}"`);
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export {
    newCandidate,
    getAlCandidates,
    getCandidate,
    updateCandidateStatus,
    deleteCandidate,
    getStats,
    getResume,
}