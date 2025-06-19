import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {

    constructor(private notesService: NotesService){

    }

    @Get('all-notes')
    async getAllNotes(@Req() req : Request): Promise<any>{
        return this.notesService.getAllNotes(req);
    }

    @Post('new-note')
    async createNote(@Body() notesData): Promise<any>{
        console.log('Request Received')
        return this.notesService.createNote(notesData);
    }

    @Put('update-note')
    async updateNote(@Req() req: Request,@Body() notesData): Promise<any>{
        return this.notesService.updateNote(req,notesData)
    }

    @Get('get-shared-note')
    getSharedNote(){
        return this.notesService.getSharedNote();
    }

    @Put('share-note')
    shareNote(@Body() notesData){
        return this.notesService.shareNote(notesData);
    }

    @Get('test')
    sayHello(){
        return 'Hello World'
    }

    @Delete('delete-note')
    deleteNote(@Body() noteData){
        return this.notesService.deleteNote(noteData)
    }

    @Post('post-comment')
    postComment(@Req() req: Request, @Body() info){
        console.log(info)
        return this.notesService.postComment(req,info.message,info.noteId)
    }
}
