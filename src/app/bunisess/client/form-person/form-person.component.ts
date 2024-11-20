import { AfterViewChecked, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-form-person',
  templateUrl: './form-person.component.html',
  styleUrls: ['./form-person.component.scss']
})
export class FormPersonComponent implements AfterViewChecked{

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  messages: { sender: string, text: string, isTyping?: boolean }[] = [];
  newMessage: string = '';
  botMessage: string = '¡Hola! ¿En qué te puedo ayudar?'; // Mensaje predeterminado del bot

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      // Agregar mensaje del usuario
      this.messages.push({ sender: 'user', text: this.newMessage });
      
      // Limpiar el input
      this.newMessage = '';

      // Simular que el bot está escribiendo
      this.messages.push({ sender: 'bot', text: '', isTyping: true });

      // Esperar un momento antes de simular la escritura del bot
      setTimeout(() => {
        this.typeBotMessage(this.botMessage);
      }, 1000);
    }
  }

  typeBotMessage(fullMessage: string) {
    let typedMessage = '';
    let currentIndex = 0;
    const typingSpeed = 50; // Velocidad de escritura en milisegundos por letra

    // Inicia el proceso de escritura letra por letra
    const typingInterval = setInterval(() => {
      if (currentIndex === 0) {
        // Ocultar el indicador de "Escribiendo..." en cuanto se empieza a escribir la primera letra
        this.messages[this.messages.length - 1].isTyping = false;
      }

      typedMessage += fullMessage[currentIndex];
      currentIndex++;

      // Actualizar el mensaje del bot letra por letra
      this.messages[this.messages.length - 1].text = typedMessage;

      if (currentIndex === fullMessage.length) {
        clearInterval(typingInterval);
      }

    }, typingSpeed);
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
  
}
