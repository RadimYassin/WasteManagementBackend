import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Ensure you have a PrismaService
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  // Create a new message
  async create(createMessageDto: CreateMessageDto) {
    return await this.prisma.message.create({
      data: {
        senderId: createMessageDto.senderId,
        receiverId: createMessageDto.receiverId,
        content: createMessageDto.content,
        timestamp: new Date(),
        isRead: false,
      },
    });
  }

  // Fetch all messages (admin feature)
  async findAll() {
    return await this.prisma.message.findMany();
  }

  // Fetch all messages for a specific user
  async findMessagesForUser(userId: string) {
    return await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: {
        timestamp: 'asc',
      },
    });
  }

  // Fetch a single message by ID
  async findOne(id: string) {
    return await this.prisma.message.findUnique({
      where: { id },
    });
  }

  // Update message (e.g., mark as read)
  async update(id: string, updateMessageDto: UpdateMessageDto) {
    return await this.prisma.message.update({
      where: { id },
      data: updateMessageDto,
    });
  }

  // Remove a message
  async remove(id: string) {
    return await this.prisma.message.delete({
      where: { id },
    });
  }
}
