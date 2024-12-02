import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chat, MsChatService } from '../../core/service/ms-chat.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbots',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbots.component.html',
  styleUrl: './chatbots.component.scss'
})

export class ChatbotsComponent implements OnInit {

  messages: Chat[] = [];
  newMessage: string = '';
  editingIndex: number = -1;
  showArchived: boolean = false;

  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(private msChatService: MsChatService) { }

  ngOnInit(): void {
    this.loadChats();
  }

  loadChats(): void {
    if (this.showArchived) 
      this.msChatService.listarChatInactive().subscribe((chats: Chat[]) => {
        this.messages = chats;
      });
     else {
      this.msChatService.listarChat().subscribe((chats: Chat[]) => {
        this.messages = chats;
      });
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const mensajeIA = { query: this.newMessage };

      if (this.editingIndex !== -1) { 
        const messageToUpdate = this.messages[this.editingIndex];
        const updatedMessage = { ...messageToUpdate, query: this.newMessage };

        this.msChatService.actualizarChat(messageToUpdate.id, updatedMessage).subscribe((chat: Chat) => {
          this.messages[this.editingIndex] = { ...chat, response: this.cleanText(chat.response) };
          this.editingIndex = -1; 
          this.newMessage = ''; 
          this.scrollToMessage(this.editingIndex); // Asegúrate de que esto se llame correctamente
        });
      } else {
        const userMessage: Chat = {
          id: 0,
          query: this.newMessage,
          response: '',
          time: ''
        };

        this.messages.push(userMessage);
        this.newMessage = '';

        this.msChatService.crearChat(mensajeIA).subscribe((chat: Chat) => {
          chat.response = this.cleanText(chat.response);
          this.typeResponse(chat.response);
          userMessage.id = chat.id;
          userMessage.time = chat.time;
        });
      }

      this.scrollToBottom();
    }
  }

  toggleArchived(): void {
    this.showArchived = !this.showArchived;
    this.loadChats();
  }

  eliminarChat(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Este mensaje será archivado!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, archivar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.msChatService.eliminarChat(id).subscribe(() => {
          Swal.fire(
            'Archivado!',
            'El mensaje ha sido archivado.',
            'success'
          );
          this.loadChats();
        });
      }
    });
  }
  
  activateMessage(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Este mensaje será activado!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.msChatService.activarChat(id).subscribe(() => {
          Swal.fire(
            'Activado!',
            'El mensaje ha sido activado.',
            'success'
          );
          this.loadChats(); // Asegúrate de que se llama para actualizar la lista
        }, error => {
          Swal.fire(
            'Error!',
            'No se pudo activar el mensaje.',
            'error'
          );
        });
      }
    });
  }  

  typeResponse(text: string, index: number = 0): void {
    const lastMessageIndex = this.messages.length - 1;

    if (index < text.length && lastMessageIndex >= 0) {
      this.messages[lastMessageIndex].response += text.charAt(index);
      this.scrollToBottom();
      setTimeout(() => this.typeResponse(text, index + 1), 50);  
    }
  }

  cleanText(text: string): string {
    return text.replace(/<\/?[^>]+(>|$)|[*_~`]/g, '').trim();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error al hacer scroll:', err);
    }
  }

  editMessage(index: number): void {
    const messageToEdit = this.messages[index];
    this.newMessage = messageToEdit.query; 
    this.editingIndex = index; 
    this.scrollToMessage(index); 
  }

  scrollToMessage(index: number): void {
    setTimeout(() => {
      const messageElements = this.messageContainer.nativeElement.querySelectorAll('.user-message, .bot-message');
      if (messageElements[index]) {
        messageElements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
  }
}
