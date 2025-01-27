package edu.sabanciuniv.howudoin.controller;

import edu.sabanciuniv.howudoin.model.Message;
import edu.sabanciuniv.howudoin.security.CustomUserDetailsService;
import edu.sabanciuniv.howudoin.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MessageController {
    @Autowired
    private MessageService messageService;
    @Autowired
    private CustomUserDetailsService userService;

    // Sends a message to the specified user
    @PostMapping("/messages/send")
    public ResponseEntity<String> sendMessage(@RequestBody Message messageRequest) {
        if (!userService.existByID(messageRequest.getSenderUserName())) {
           return ResponseEntity.ok("Sender does not exist");
        }
        if (!userService.existByID(messageRequest.getReceiverUserName())) {
            return ResponseEntity.ok( "Receiver does not exist");
        }
        if(!userService.friendsOrNot(messageRequest.getSenderUserName(), messageRequest.getReceiverUserName())){
            ResponseEntity.ok( "You are not friends with the receiver");
        }
        Message message = new Message(messageRequest.getMessage(), messageRequest.getSenderUserName(), messageRequest.getReceiverUserName());
        messageService.saveAndsendMessage(message);
        return ResponseEntity.ok("Message sent successfully from " + messageRequest.getSenderUserName() + " to " + message.getReceiverUserName() + " message: " + message);
    }

    // Gets a specific message by ID
    @GetMapping("/get/{id}")
    public String getMessage(@PathVariable int id) { // Adjusted to String if MongoDB ObjectId
        return messageService.gettingMessage(id);
    }

    // Now returning all the messages that user has ever received and send
    @GetMapping("/messages/{username}/{reciever}")
    public ResponseEntity<List<Message>>getMessages(@PathVariable String username, @PathVariable String reciever){
        if(!userService.existByID(username) && !userService.existByID(reciever)){
            // If the users or one of them does not exist return null
            return null;
        }
        return ResponseEntity.ok(this.messageService.returnMessagesById(userService.getConversationPtoP(username, reciever)));
    }
}