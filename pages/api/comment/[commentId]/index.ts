import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    try {
      const { commentId } = req.query;
      const { text: updatedText } = req.body;
  
      if (!commentId || typeof commentId !== 'string') {
        throw new Error('Invalid ID');
      }
  
      const comment = await prisma.comment.findUnique({
        where: {
          id: commentId
        }
      });
  
      if (!comment) {
        throw new Error('Invalid ID');
      }

      const updatedComment = await prisma.comment.update({
        where: {
          id: commentId
        },
        data: {
          body: updatedText
        }
      });

      return res.status(200).json(updatedComment);
    } catch (error) {
      console.log(error);
      return res.status(400).end();
    }
  } else if (req.method === 'DELETE') {
    try {
      const { commentId } = req.query;
  
      if (!commentId || typeof commentId !== 'string') {
        throw new Error('Invalid ID');
      }
  
      const comment = await prisma.comment.delete({
        where: {
          id: commentId,
        }
      });
  
      return res.status(201).json(comment);
    } catch (error) {
      console.log(error);
      return res.status(400).end();
    }
  } else {
    return res.status(405).end();
  }
}
