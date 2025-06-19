import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notes, NotesSchema } from './schemas/notes.schema';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { Users } from 'src/auth/schemas/user.schema';
@Injectable()
export class NotesService {

    constructor(@InjectModel(Notes.name) private readonly notesModel: Model<Notes>,
      @InjectModel(Users.name) private readonly usersModel: Model<Users>
  ){

    }
    async getAllNotes(req): Promise<any>{
        try{
            const allNotes = await this.notesModel.find({owner: req.email})
            if(allNotes){
                return allNotes;
            }
            throw new HttpException('No Notes found', HttpStatus.NOT_FOUND)
        }catch(err){
            throw err;
        }
    }

    async createNote(notesData): Promise<any>{
        try{
          const title = notesData.title.trim();
            const existingNotes = await this.notesModel.find({owner: notesData.owner});
            existingNotes.forEach((note)=>{
              if(note.title == title){
                throw new HttpException('Title Already exist',HttpStatus.BAD_REQUEST)
              }
            })

            let isUnique = false;
            let noteId= '';
            while(!isUnique){
              noteId = nanoid(10)
              const existingUser = await this.notesModel.findOne({noteId});
              if(!existingUser)
                isUnique = true;
            }
            const newNote = new this.notesModel({...notesData, noteId: noteId, title: notesData.title.trim() });
            await newNote.save()
            return HttpStatus.ACCEPTED;

        }catch(error){
            throw error
        }
    }

    async deleteNote(newNote:any): Promise<any>{
      try{
        console.log(`Trying to delete: `,newNote)
        const deletedNote =await this.notesModel.findOneAndDelete({owner: newNote.owner, title: newNote.title.trim()});
        if (!deletedNote) {
      throw new HttpException('Note not found or not authorized to delete', HttpStatus.NOT_FOUND);
    }

    return deletedNote;
      }catch(error){
        throw error
      }
    }
    async updateNote(req: any, newNote: any): Promise<any> {
    try {
      console.log(newNote);
      const note = await this.notesModel.findOne({noteId: newNote.noteId});
      if (!note) {
        throw new HttpException(
          'Note not found or you are not authorized to update it',
          HttpStatus.NOT_FOUND,
        );
      }
      const { _id, ...noteDataWithoutId } = newNote;
      const updatedNote = await this.notesModel.findOneAndUpdate(
        {owner: req.email, title: newNote.title.trim()},
        { $set: noteDataWithoutId },
      );

      return updatedNote;
    } catch (error) {
      // Handle specific Mongoose errors (e.g., invalid ObjectId)
      if (error.name === 'CastError') {
        throw new HttpException('Invalid note ID', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  async getSharedNote(){
    try{
      const notes = await this.notesModel.find({isShared: true});
      return notes;
    }catch(err){
      throw err;
    }
  }
  async shareNote(notesData){
    try{
      const note = await this.notesModel.findOne({noteId: notesData.noteId});
      note.caption = notesData.caption;
      note.isShared = true;
      await note.save();
    }catch(err){
      throw err;
    }
  }

  async postComment(req: any, message:string,noteId: string){
    try{
      const user = await this.usersModel.findOne({userId: req.userId});
      if(!user){
        throw new NotFoundException('No user found for comment');
      }else{
        console.log('User Found')
      }
      const post = await this.notesModel.findOne({noteId: noteId});
      if(!post){
        console.log('Post Not Found')
        throw new NotFoundException('Note can not be found')
      }else{
        console.log('Post Found')
      }
      const newComment = {
        user: user.name,
        message: message
      }
      post.comments.push(newComment);
      await post.save();
    
    }catch(err){
      throw err;
    }
  }

  
}
