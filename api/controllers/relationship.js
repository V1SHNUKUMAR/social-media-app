import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT followerUserId FROM relationships WHERE followedUserId = ?`;

    const values = [req.query.followedUserId];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data?.map(relationship => relationship?.followerUserId));
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

