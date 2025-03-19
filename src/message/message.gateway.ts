import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@WebSocketGateway({ cors: { origin: '*' } }) // Allow connections from frontend
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map<string, string>(); // userId -> socketId mapping

  constructor(private readonly messageService: MessageService) {}

  // Handle client connection
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Handle client disconnection
  handleDisconnect(client: Socket) {
    const userId = [...this.activeUsers.entries()].find(([, socketId]) => socketId === client.id)?.[0];
    if (userId) {
      this.activeUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  // Track logged-in users (Frontend must emit 'registerUser' event after login)
  @SubscribeMessage('registerUser')
  handleUserRegistration(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    this.activeUsers.set(userId, client.id);
    console.log(`User ${userId} registered with socket ${client.id}`);
  }

  // Create and broadcast new messages
  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const message = await this.messageService.create(createMessageDto);

    // Emit message to the specific receiver if online
    const receiverSocketId = this.activeUsers.get(createMessageDto.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receiveMessage', message);
    }

    return message;
  }

  // Fetch all messages (for admin or chat history)
  @SubscribeMessage('findAllMessages')
  async findAll() {
    return await this.messageService.findAll();
  }

  // Fetch messages for a specific user
  @SubscribeMessage('findMessagesForUser')
  async findMessagesForUser(@MessageBody() userId: string) {
    return await this.messageService.findMessagesForUser(userId);
  }

  // Fetch a single message
  @SubscribeMessage('findOneMessage')
  async findOne(@MessageBody() id: string) {
    return await this.messageService.findOne(id);
  }

  // Update message status (like "seen")
  @SubscribeMessage('updateMessage')
  async update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return await this.messageService.update(updateMessageDto.id, updateMessageDto);
  }

  // Delete a message
  @SubscribeMessage('removeMessage')
  async remove(@MessageBody() id: string) {
    return await this.messageService.remove(id);
  }
}
