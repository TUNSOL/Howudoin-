package edu.sabanciuniv.howudoin.service;

import edu.sabanciuniv.howudoin.model.Group;
import edu.sabanciuniv.howudoin.model.Message;
import edu.sabanciuniv.howudoin.model.User;
import edu.sabanciuniv.howudoin.repository.MessageRepository;
import edu.sabanciuniv.howudoin.repository.UserRepository;
import edu.sabanciuniv.howudoin.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.TreeSet;
import java.util.Vector;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private CustomUserDetailsService userService;

    @Autowired
    private UserRepository userRepository;


    public void saveAndsendMessage(Message message) {
        userService.saveMessageOfUser(message);
        messageRepository.save(message);
    }


    //DONE IN GROUO SERVCICE CLASS, NOT USED
    public void sendMessageGroup(Message message, List<String> userNames) {
        for (String usrname : userNames) {
            User user = userService.getUserAsUser(usrname);
            user.getMessages().add(message);
            userRepository.save(user);
        }
        messageRepository.save(message);
        System.out.println("Message saved for group");

    }

    public void deleteMessage(int id) {
        messageRepository.deleteById(id);
        System.out.println("Message deleted");
    }

    public String gettingMessage(int id) {
        Message message = messageRepository.findById(id).get();
        String messageText = message.getMessage();
        String sender = message.getSenderUserName();
        String receiver = message.getReceiverUserName();
        return "Message: " + messageText + " from " + sender + " to " + receiver;
    }

    // PRE: user exists
    public boolean areTheyFriends(String sender, String receiver) {
        if(userService.existByID(sender) && userService.existByID(receiver)){
            return userService.friendsOrNot(sender, receiver);
        }
        return false;}
    public List<Message> returnMessagesById(TreeSet<Integer> idSet){
        Vector<Message> messages = new Vector<>();
        for (Integer temp : idSet) {
            messages.add(messageRepository.findById(temp).get());
        }
        return messages;
    }
}