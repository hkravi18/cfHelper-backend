const axios = require('axios');
const { cfURL }  = require('../api/cfURL');

module.exports.showUserInfo = async(req, res, next) => {
    try {
        const username = req.body.userName;
        console.log('username : ', username);
        if (!username) {
            return res.json({ status : "FAILED", msg: "Username is required"});
        } else {
            const { data } = await axios.get(`${cfURL}/user.info?handles=${username}`);
            // console.log('data : ', data);
            if (data.status === "OK") {
                res.json({ status : "OK", msg: "Data fetched successfully", user: data.result[0]});
            } else {
                res.json({ status :"FAILED", msg: "Data fetching failed, Please Try again."})
            }
        }
    } catch (err) {
        res.json({ status : "FAILED", msg: "Server Error, Please try again after sometime."})
        next(err);
    }
}

module.exports.showUserRatingChange = async(req, res, next) => {
    try { 
        const username = req.body.userName;
        if (!username) return res.json({ status : "FAILED", msg: "Username is required"});
        const { data } = await axios.get(`${cfURL}/user.rating?handle=${username}`);
        if (data.status === "OK") {
            const userRatingChange = data.result;
            userRatingChange.reverse();
            res.json({ status : "OK", msg : "Data fetched successfully.", userRatingChange: userRatingChange });
        } else {
            res.json({ status : "FAILED", msg: "Data fetching failed. Please try again."})
        }
    } catch (err) {
        res.json({ status : "FAILED", msg: "Server Error, Please try again after sometime."})
        next(err);
    }
};

module.exports.showUserSubmission = async(req, res, next) => {
    try {
        const username = req.body.userName;
        if (!username) return res.json({ status : "FAILED", msg: "Username is required"});
        const { data } = await axios.get(`${cfURL}/user.status?handle=${username}&from=1&count=60`); 
        if (data.status === "OK") {  
            const submissions = [];    
            for (const sub of data.result) {
                const problemInfo = {
                    "index": sub.problem.index,
                    "name": sub.problem.name,
                    "tags": sub.problem.tags,
                    "creationTimeSeconds": sub.creationTimeSeconds,
                    "programmingLanguage": sub.programmingLanguage,
                    "verdict": sub.verdict,
                } 
                submissions.push(problemInfo);       
            }
           
            res.json({ status: "OK", msg: "Data fetched successfully", submissions});   
        } else {
            res.json({ status : "FAILED", msg: "Data fetching failed, Please try again."});
        } 
    } catch (err) {
        res.json({ status : "FAILED", msg: "Server Error, Please try again after sometime."})
        next(err);
    }
};