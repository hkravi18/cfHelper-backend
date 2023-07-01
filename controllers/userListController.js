const User = require('../models/userModel');
const axios = require('axios');

const { cfURL } = require('../api/cfURL');

module.exports.addUserList = async(req, res, next) => {
    try {
        const username = req.body.userName;
        if (!username) res.json({ status: "FAILED", msg: "Username is required"});

        const userStored = await User.findOne({ username });
        if (userStored) {
            res.json({ status: "FAILED", msg : "User Already Exists"});
        } else {
            const { data } = await axios.get(`${cfURL}/user.info?handles=${username}`);
            
            if (data.status === 'OK') {
                const user = await User.create({
                    username: username,
                    rating: data.result[0].rating,
                    rank: data.result[0].rank, 
                });

                if (!user) {
                    res.json({ status: "FAILED", msg: "User Not Added, Please try again."})
                } else {
                    res.json({ status: "OK", msg: "User Added successfully"})
                }             
            } else {
                res.json({ status: "FAILED", msg: "Fetching Data Failed" })
            }
        }
    } catch (err) {
        if (err.response.data.status === "FAILED") return res.json({ status: "FAILED", msg: err.response.data.comment }); 
        res.json({ status : "FAILED", msg: "Server Error, Please try again after sometime."})
        next(err);
    }
};

module.exports.removeUserList = async(req, res, next) => {
    try {
        const username = req.body.userName;
        if (!username) return res.json({ status: "FAILED", msg: "Username is required"});
        
        const deleteUser = await User.findOneAndDelete({ username });
        if (!deleteUser) {
            return res.json({ status : "FAILED", msg : "User does not exist in the Users list."});
        }
        return res.json({ status : "OK", msg : `"${deleteUser.username}" User deleted successfully`})
    } catch (err) {
        res.json({ status : "FAILED", msg: "Server Error, Please try again after sometime."})
        next(err);
    }
}

module.exports.removeAllUserList = async(req, res, next) => {
    try {
        const deletedUsers = await User.deleteMany({});
        console.log(deletedUsers);
        if (deletedUsers) {
            res.json({ status : "OK", msg : `${deletedUsers.deletedCount} users deleted successfully.`, deletedUsersCount: deletedUsers.deletedCount });
        } else {
            res.json({ status : "FAILED", msg : "Database Error, Please try again." });
        }
    } catch (err) {
        res.json({ status : "FAILED", msg: "Server Error, Please try again after sometime."})
        next(err);
    }
}

module.exports.showUserList = async(req, res, next) => {
    try {
        const usersList = await User.find({});
        if (!usersList) {
            res.json({ status : "FAILED", msg : "Database Error, Please try again."})
        } else {
            usersList.sort((a ,b) => b.rating - a.rating); 
            res.json({ status : "OK", msg : "User List fetched successfully", usersList: usersList});
        }
    } catch (err) {
        res.json({ status : "FAILED", msg: "Server Error, Please try again after sometime."})
        next(err);
    }
}

module.exports.updateUserList = async(req, res, next) => {
    try {
        const usersList = await User.find({});
        if (!usersList) {
            res.json({ status : "FAILED", msg : "Database Error, Please try again."})
        } else {
            let users = "";
            for (const user of usersList) {
                users += user.username + ";";
            } 
            console.log(users);
            
            const { data } = await axios.get(`${cfURL}/user.info?handles=${users}`);
            if (data.status === 'OK') {
                for (const userApi of data.result) {
                    for (const userLs of usersList) {
                        if (userApi.handle.toLowerCase() === userLs.username.toLowerCase()) {
                            userApi.handle = userLs.username;
                            break;
                        }
                    }
                }
                for (const user of data.result) {
                    const updatedUser = await User.findOneAndUpdate({ username: user.handle }, {
                        rating: user.rating,
                        rank: user.rank,
                    }, { new: true });
                    console.log(user.handle);
                    console.log(updatedUser);
                }

                res.json({ status: "OK", msg: "User List Updated successfully"})             
            } else {
                res.json({ status: "FAILED", msg: "Fetching Data Failed" })
            }
        }
    } catch (err) {
        res.json({ status : "FAILED", msg: "Server Error, Please try again after sometime."})
        next(err);
    }
}