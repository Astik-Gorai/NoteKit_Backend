import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {

    constructor(private notesService: NotesService){

    }

    @Get('all-notes')
    async getAllNotes(@Body() userData): Promise<any>{
        return this.notesService.getAllNotes(userData);
    }

    @Post('new-note')
    async createNote(@Body() notesData): Promise<any>{
        return this.notesService.createNote(notesData);
    }

    @Get('test')
    sayHello(){
        return 'Hello World'
    }
}
