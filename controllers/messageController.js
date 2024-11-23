import { validationResult } from "express-validator";
import Message from "../model/messageModel.js";
import Conversation from "../model/conversationModel.js";
import {catchAsyncError} from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import User from "../model/userModel.js";
//import { getReceiverSocketId } from "../socket/socket.js";
import Application from "../model/applicationModel.js";

export const sendMessage = catchAsyncError(async (req, res, next) => {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        const errorMessages=errors.array().map(err=>err.msg);
        return next(new ErrorHandler(422,errorMessages))
    }
    try{
        const {message} = req.body;
        const {id:conversationId}=req.params;
        const senderId=req.body.userId;
        let conversation=await Conversation.findById(conversationId);
        //console.log(conversation);
        const receiverId= conversation.participants[1].toString();
        
        
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,receiverId]
            })
        }

        const messageDate=  new Message({
            senderId,
            receiverId,
            message
        })

        
        if(messageDate){
            conversation.messages.push(messageDate._id);
           
        }
        await messageDate.save();
        await conversation.save();
        // const receiverSocketId= getReceiverSocketId(receiverId);

        // if(receiverSocketId){
        //     io.to(receiverSocketId).emit("getMessage",messageDate);
        // }

        return res.status(200).json({
            data:messageDate._id,
            success:true,
            message:"Message sent successfully"
        })
       
    }
    catch(err){
        return next(new ErrorHandler(500,"Something went wrong",err.message));
    }
    
})

export const getMessage=catchAsyncError(async (req, res, next) => {
    try{
        const {id:userToChatId}=req.params;
        //const senderId=req.body.userId;
        let conversation =await Conversation.findById(userToChatId).populate({
            path:'messages',
            select:'message createdAt',
        });

        if(!conversation){
            return res.status(200).json({
                success:true,   
                messages:[]
            })
        }
        const messages=conversation.messages;
        return res.status(200).json({
            success:true,
            messages
        })
    }catch(err){
        return next(new ErrorHandler(500,"Something went wrong",err.message));
    }
})

export const getUserForSidebar = catchAsyncError(async (req, res, next) => {
    try {
 
        const conversations = await Conversation.find({
            participants: { $in: [req.body.userId] }  
        }).populate({
            path: 'participants', 
            select: 'name',       
        });

        if (!conversations || conversations.length === 0) {
            return res.status(200).json({
                success: true,
                conversations: [] 
            });
        }
   
        return res.status(200).json({
            success: true,
            conversations: conversations.map(conversation => conversation.toObject({ getters: true })),
        });

    } catch (err) {
        return next(new ErrorHandler(500, "Something went wrong", err.message));
    }
});


export const addConversation = catchAsyncError(async (req, res, next) => {
    try{
        const {applicationId}=req.body;
        const application =await Application.findById(applicationId);
        //console.log('Hello');
        //console.log(application);
        const receiverId= application.applicantId.user.toString();
        
        //console.log(receiverId);
        //console.log('Hello');
        const senderId=req.body.userId;
        //console.log(senderId);
        //console.log('Hello1');
        const conversation =await Conversation.findOne({
            participants:{
                $all:[senderId,receiverId],
            }
        })
        //console.log(conversation);
        if(!conversation){
            const newConversation =await Conversation.create({
                participants:[senderId,receiverId]
            })
            console.log(newConversation);
            return res.status(200).json({
                success:true,
                data:newConversation
            })
        }
        return res.status(200).json({
            success:true,
            data:conversation
        })
    }
    catch(err){
        return next(new ErrorHandler(500,"Something went wrong",err.message));

    }
})