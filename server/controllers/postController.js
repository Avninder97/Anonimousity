const Post = require('../models/Post');
const Comment = require('../models/Comment');
const inDev = process.env.INDEVMODE;

const postControllers = {
    getPosts: async (req, res) => {
        try {
            const posts = await Post.find({});
            return res.status(200).json({
                message: "Success",
                posts: posts
            });
        } catch(err) {
            return res.status(500).json({
                message: "Server Error"
            });
        }
    },
    getSinglePost: async (req, res) => {
        try {
            const pid = req.params.id;
            const post = await Post.findOne({ _id: id });
            return res.status(200).json({
                message: "Success",
                post: post
            });
        } catch(err) {
            return res.status(500).json({
                message: "Server Error"
            });
        }
    },
    createPost: async (req, res) => {
        try {
            const { title, description, backgroundImage, categories, decoded } = req.body;
            if(!(title && description && decoded)){
                return res.status(400).json({
                    message: "Fill All necessary fields"
                })
            }
            const userId = decoded.userId;
            const newPost = await Post.create({
                title,
                description,
                backgroundImage,
                categories,
                author: userId
            })
            return res.status(200).json({
                message: "Post created successfully"
            })
        } catch(err) {
            return res.status(500).json({
                message: "Server Error"
            });
        }
    },
    editPost: (req, res) => {

    },
    deletePost: (req, res) => {
        // remember to delete it's comments to from database
        return res.send("processed");
    },
    likePost: (req, res) => {

    },
    addComment: async (req, res) => {
        try {
            const { id } = req.params, author = req.body.decoded.userId;
            const { description } = req.body;
            const foundPost = await Post.findOne({ _id: id });
            if(!foundPost){
                return res.status(404).json({
                    message: 'Invalid Post'
                })
            }
            const newComment = await Comment.create({
                author,
                description,
                linkedToWhichPost: id
            })
            foundPost.comments.push(newComment._id);
            await foundPost.save();
            return res.status(200).json({
                message: 'Comment added successfully'
            });
        } catch(err) {
            return res.status(500).json({
                message: "Server Error"
            });
        }
    },
    likeComment: async (req, res) => {
        try {
            const { id, cId } = req.params, likedBy = req.body.decoded.userId;
            const foundComment = await Comment.findOne({ _id: cId });
            if(!foundComment){
                return res.status(404).json({
                    message: 'Comment does not exist'
                })
            }
            foundComment.likedBy.push(likedBy);
            await foundComment.save();
            return res.status(200).json({
                message: 'Comment added successfully'
            });
        } catch(err) {
            return res.status(500).json({
                message: "Server Error"
            });
        }
    },
    editComment: async (req, res) => {
        try {
            const { id, cId } = req.params, currUserId = req.body.decoded.userId, { description } = req.body;
            const foundComment = await Comment.findOne({ _id: cId, author: currUserId });
            if(!foundComment){
                return res.status(404).json({
                    message: 'Comment not found'
                })
            }
            foundComment.description = description;
            await foundComment.save();
            return res.status(200).json({
                message: 'Success'
            })

        } catch(err) {
            inDev && console.log(err);
            return res.status(500).json({
                message: "Server Error"
            });
        }
    },
    deleteComment: async (req, res) => {
        try {
            const { id, cId } = req.params, currUserId = req.body.decoded.userId;
            const deletedComment = await Comment.deleteOne({ _id: cId, author: currUserId, linkedToWhichPost: id });
            const foundPost = await Post.findOne({ _id: id });
            if(deletedComment.deletedCount == 0){
                return res.status(404).json({
                    message: 'Comment not deleted'
                })
            }
            foundPost.comments.pull(cId);
            await foundPost.save();
            return res.status(200).json({
                message: 'Comment deleted successfully'
            });
        } catch(err) {
            inDev && console.log(err);
            return res.status(500).json({
                message: "Server Error"
            });
        }
    }
};

module.exports = postControllers;