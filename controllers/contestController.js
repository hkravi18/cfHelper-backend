const User = require('../models/userModel');
const axios = require('axios');

const { cfURL } = require('../api/cfURL');

module.exports.showUpcomingContest = async(req, res, next) => {
    try {
        const { data } = await axios.get(`${cfURL}/contest.list`);
        if (data.status === "OK") {
            let contests = [];
            for (const contest of data.result) {
                if (contest.phase === "BEFORE") {
                    contests.push({
                        id: contest.id,
                        name: contest.name,
                        duration: contest.durationSeconds,
                        startTime: contest.startTimeSeconds,
                        relativeTime: contest.relativeTimeSeconds,              
                    });
                } else {
                    break;
                }
            }
            contests.reverse();
            res.json({ status: "OK", msg : "Contest data fetched successfully", contests });
        } else {
            res.json({ status : "FAILED", msg : "Can't fetch contest data, Please try again."})
        }
    } catch (err) {
        res.json({ status : "FAILED", msg: "Server Error, Please try again after sometime."})
        next(err);
    }
};

module.exports.showPastContest = async(req, res, next) => {
    try {
        const { data } = await axios.get(`${cfURL}/contest.list`) 
        if (data.status === "OK") {
            let contests = [];
            let counter = 40;
            for (const contest of data.result) {
                if (contest.phase === "FINISHED") {
                    contests.push({
                        id: contest.id,
                        name: contest.name,
                        duration: contest.durationSeconds,
                        startTime: contest.startTimeSeconds,          
                    })
                }
                counter -= 1;
                if (counter < 0) {
                    break;
                }
            }
            res.json({ status: "OK", msg: "Contest data fetched successfully", contests});
        } else {
            res.json({ status: "FAILED", msg: "Can't fetch contest data, Please try again." });
        }
    } catch (err) {
        res.json({ status : "FAILED", msg: "Server Error, Please try again after sometime."})
        next(err);
    }
}


module.exports.showUsersContestPerf = async(req, res, next) => {
    try  {
        const id = req.body.id;
        console.log(id);
        if (!id) res.json({ status : "FAILED", msg: "ContestId not found, PLease try again."});
        const usersList = await User.find({});
        if (usersList.length === 0) return res.json({ status : "OK", msg: "User List is empty.", usersPerf : {}});
        let users = "";
        for (const user of usersList) {
            users += user.username + ";";
        }
        console.log(users);
        const { data } = await axios.get(`${cfURL}/contest.standings?contestId=${id}&showUnofficial=true&handles=${users}`); 
        console.log(data);
        if (data.status === "OK") {
            let usersPerf = {
                "contest" : data.result.contest,
                "problems": data.result.problems,
                "rows": {
                    "PRACTICE": [],
                    "CONTESTANT": [],
                },
            }
            for (const party of data.result.rows) {
                const user = {
                    "handle": party.party.members[0].handle,
                    "rank": party.rank,
                    "points": party.points,
                    "problemResults": party.problemResults,
                }
                if (party.party.participantType === "CONTESTANT") {
                    usersPerf.rows.CONTESTANT.push(user);
                } else {
                    usersPerf.rows.PRACTICE.push(user);
                }
            }
            usersPerf.rows.CONTESTANT.sort((a, b) => a.rank - b.rank);
            console.log('--------', usersPerf);
            res.json({ status : "OK", msg : "Data fetched successfully", usersPerf : usersPerf});
        } else {
            return res.json({ status: "FAILED", msg: "Data fetching failed, Please try again."});
        }
    } catch (err) {
        res.json({ status : "FAILED", msg: "Server Error, Please try again after sometime."})
        next(err);
    }
}