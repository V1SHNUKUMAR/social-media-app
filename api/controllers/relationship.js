import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Users who follow the profile / users the profile follows.
    const followersQuery = "SELECT u.id, u.username, u.name, u.profilePic FROM users AS u JOIN relationships AS r ON u.id = r.followerUserId WHERE r.followedUserId = ?"
    const followingQuery = "SELECT u.id, u.username, u.name, u.profilePic FROM users AS u JOIN relationships AS r ON u.id = r.followedUserId WHERE r.followerUserId = ?"

    const values = [req.query.followedUserId];

    db.query(followersQuery, values, (err, followersData) => {
      if (err) return res.status(500).json(err);

      db.query(followingQuery, values, (err, followingData) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json({
          followers: followersData,
          following: followingData,
        });
      });
    });
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `INSERT INTO relationships (followedUserId, followerUserId) VALUES (?, ?)`;

    const values = [req.body.userId, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Following!");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `DELETE FROM relationships WHERE followedUserId = ? AND followerUserId = ?`;

    const values = [req.query.userId, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollowed");
    });
  });
};

