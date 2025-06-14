import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notes, NotesSchema } from './schemas/notes.schema';
import { Model } from 'mongoose';

@Injectable()
export class NotesService {

    constructor(@InjectModel(Notes.name) private readonly notesModel: Model<Notes>){

    }
    async getAllNotes(userData): Promise<any>{
        try{
            const allNotes = await this.notesModel.find({owner: userData.email})
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
            const existingNotes = await this.notesModel.find({owner: notesData.owner});
            
            const newNote = new this.notesModel(notesData);
            await newNote.save()
            return HttpStatus.ACCEPTED;

        }catch(error){
            throw error
        }
    }

    async updateNote(noteId: string, updateData: any, userData: any): Promise<any> {
    try {
      const note = await this.notesModel.findOne({ _id: noteId, owner: userData.email });
      if (!note) {
        throw new HttpException(
          'Note not found or you are not authorized to update it',
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedNote = await this.notesModel.findByIdAndUpdate(
        noteId,
        { $set: updateData }, // Use $set to update only specified fields
        { new: true }, // Return the updated document
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
}
