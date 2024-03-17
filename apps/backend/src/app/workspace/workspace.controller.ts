import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { AuthenticationGuard } from '../authentication/authentication.guard';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  create(@Req() req: Request, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    const user = req.user;

    return this.workspaceService.create(user.userId, createWorkspaceDto);
  }
}
