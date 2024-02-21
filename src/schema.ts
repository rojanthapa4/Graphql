import Joi from 'joi';

const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().label('Username'),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().label('Email'),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required().label('Password'),
});

const postSchema = Joi.object({
    title: Joi.string().required().label('Title'),
    content: Joi.string().required().label('Content'),
    author: Joi.string().optional().label('Author'),
    createdAt: Joi.date().iso().optional().label('CreatedAt'),
});

const loginSchema = Joi.object({
    username: Joi.string().required().label('Username'),
    password: Joi.string().required().label('Password'),
});

const signUpSchema = Joi.object({
    username: Joi.string().min(3).max(12).required().label('Username'),
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,15}$/).required().label('Password'),
});

const userUpdateSchema = Joi.object({
    id: Joi.string().required(),
    username: Joi.string().alphanum().min(3).max(30).optional().label('Username'),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional().label('Email'),
});

const commentSchema = Joi.object({
    text: Joi.string().required().label('Content'),
    userId: Joi.number().optional().label('User ID'),
    postId: Joi.number().required().label('Post ID'),
});

const replySchema = Joi.object({
    text: Joi.string().required().label('Text'),
    userId: Joi.number().optional().label('User ID'),
    commentId: Joi.number().required().label('Comment ID'),
});

const likeSchema = Joi.object({
    userId: Joi.number().required().label('User ID'),
    postId: Joi.number().optional().label('Post ID'),
    commentId: Joi.number().optional().label('Comment ID'),
  });
  
export {
    userSchema,
    postSchema,
    loginSchema,
    signUpSchema,
    userUpdateSchema,
    commentSchema,
    replySchema,
    likeSchema
    
};