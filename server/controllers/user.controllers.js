export const getCurrentUser = async (req, res) => {
    try {
        // if authentication middleware attached a user, send it back
        if (req.user) {
            return res.json(req.user);
        }
        // otherwise indicate unauthenticated
        return res.status(401).json({ message: "not logged in" });
    } catch (error) {
        return res.status(500).json({ message: `get current user error ${error}` });
    }
};

 