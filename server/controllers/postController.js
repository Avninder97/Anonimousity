const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Organization = require('../models/Organization');
const inDev = process.env.INDEVMODE;

const postControllers = {

    // Fetches all the posts from the database
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

    // Fetches a single post and populate it's references for likedBy & comments
    getSinglePost: async (req, res) => {
        try {
            const pid = req.params.id;
            let foundPost = await Post.findOne({ _id: pid });
            if(!foundPost){
                return res.status(404).json({
                    message: "Post not found"
                });
            }
            await foundPost.populate('comments');
            await foundPost.populate('likedBy');
            return res.status(200).json({
                message: "Success",
                post: foundPost
            });
        } catch(err) {
            console.log(err)
            return res.status(500).json({
                message: "Server Error"
            });
        }
    },

    /* 
        This controller is responsible for creating the post
        and pushing it's ID to author's created Posts ref array 
        and also it can handle the organization linkage to the post
        even if that specific organization is not present in db

        Complete
    */
    createPost: async (req, res) => {
        try {
            let { title, description, backgroundImage, categories, decoded, organizationName } = req.body;
            if(!(title && description && decoded)){
                return res.status(400).json({
                    message: "Fill All necessary fields"
                })
            }
            const userId = decoded.userId;
            const foundUser = await User.findOne({ _id: userId });
            
            if(!foundUser){
                return res.status(403).json({
                    message: "Please login"
                });
            }
            
            // create or find the organization
            let foundOrganization = null;
            if(organizationName){
                organizationName = organizationName.toLowerCase();
                foundOrganization = await Organization.findOne({ name: organizationName });
                if(!foundOrganization){
                    foundOrganization = await Organization.create({
                        name: organizationName,
                    });
                }
                // Now found organization is present if organization Name is given
            }

            const newPost = await Post.create({
                title,
                description,
                backgroundImage,
                categories,
                author: userId,
                organization: organizationName ? foundOrganization._id : null
            });

            foundUser.createdPosts.push(newPost._id);
            await foundUser.save();
            return res.status(200).json({
                message: "Post created successfully"
            });
        } catch(err) {
            inDev && console.log(err);
            return res.status(500).json({
                message: "Server Error"
            });
        }
    },

    /*
        This controller is responsible for editing an existing post
        in the database and also creating a new unverified organization in db if necessary
        
        Complete
    */
    editPost: async (req, res) => {
        try {
            const { decoded, title, description, categories, backgroundImage, organizationName } = req.body, { id } = req.params;
            if(!(title && description && decoded)){
                return res.status(400).json({
                    message: "Fill All necessary fields"
                })
            }
            const userId = decoded.userId;
            const foundPost = await Post.findOne({ _id: id, author: userId });
            if(!foundPost){
                return res.status(404).json({
                    message: 'Post not found'
                });
            }
            
            foundPost.title = title;
            foundPost.description = description;
            foundPost.categories = categories;
            foundPost.backgroundImage = backgroundImage;

            if(organizationName){
                const foundOrganization = await organization.findOne({name: organizationName});
                if(!foundOrganization){
                    foundOrganization = await Organization.create({
                        name: organizationName
                    });
                }
                foundPost.organization = foundOrganization._id;
            }

            await foundPost.save();
            
            return res.status(200).json({
                message: "Post edited successfully"
            });
        } catch(err) {
            console.log(err);
            return res.status(500).json({
                message: "Server Error"
            });
        }
    },

    /*
        This deletePost controller will delete the referenced comments from database,
        also remove it's own reference from the user (author) instance from the db 
        and delete itself as well

        Complete and tested
    */
    deletePost: async (req, res) => {
        try {
            const { decoded } = req.body, { id } = req.params;
            const userId = decoded.userId;
            const foundPost = await Post.findOne({ _id: id, author: userId });
            if(!foundPost){
                return res.status(404).json({
                    message: 'Post not found'
                });
            }
            foundPost.comments.forEach(async (commentId) => {
                try{
                    await Comment.deleteOne({ _id: commentId });
                }catch(err){
                    console.log(err);
                }
            });
            await Post.deleteOne({ _id: id, author: userId });
            const foundUser = await User.findOne({ _id: userId });
            if(foundUser){
                foundUser.createdPosts.pull(id);
            }
            await foundUser.save();
            return res.status(200).json({
                message: "Post deleted successfully"
            });
        } catch(err) {
            console.log(err);
            return res.status(500).json({
                message: "Server Error"
            });
        }
    },

    /* 
        Manages the likes of post by toggling them and also updating is user ref id array
        Complete
    */
    likePost: async (req, res) => {
        try {
            const { decoded } = req.body, { id } = req.params;
            const userId = decoded.userId;
            const foundPost = await Post.findOne({ _id: id });
            const foundUser = await User.findOne({ _id: userId });

            if(!foundPost || !foundUser){
                return res.status(404).json({
                    message: `${ foundPost ? 'User' : 'Post' } not found`
                });
            }

            if(foundPost.likedBy.some((uId) => uId.equals(userId))){
                inDev && console.log('r')
                foundUser.likedPosts.pull(id);
                foundPost.likedBy.pull(userId);
            }else{
                inDev && console.log('l')
                foundUser.likedPosts.push(id);
                foundPost.likedBy.push(userId);
            }

            await foundPost.save();
            await foundUser.save();
            
            return res.status(200).json({
                message: "success"
            });
        } catch(err) {
            console.log(err);
            return res.status(500).json({
                message: "Server Error"
            });
        }
    },

    // Complete
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
            console.log(err)
            return res.status(500).json({
                message: "Server Error"
            });
        }
    },

    // Complete
    likeComment: async (req, res) => {
        try {
            const { cId } = req.params, likedById = req.body.decoded.userId;
            const foundComment = await Comment.findOne({ _id: cId });
            if(!foundComment){
                return res.status(404).json({
                    message: 'Comment does not exist'
                })
            }

            if(foundComment.likedBy.some((uId) => uId.equals(likedById))){
                inDev && console.log('r')
                foundComment.likedBy.pull(likedById);
            }else{
                inDev && console.log('l')
                foundComment.likedBy.push(likedById);
            }

            await foundComment.save();
            return res.status(200).json({
                message: 'success'
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
                message: "Server Errore"
            });
        }
    },

    // Complete
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
            console.log(err);
            return res.status(500).json({
                message: "Server Error"
            });
        }
    }
};

module.exports = postControllers;