package edu.sabanciuniv.howudoin.security;

import edu.sabanciuniv.howudoin.model.Group;
import edu.sabanciuniv.howudoin.model.Message;
import edu.sabanciuniv.howudoin.model.User;
import edu.sabanciuniv.howudoin.repository.UserRepository;
import edu.sabanciuniv.howudoin.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.aggregation.ArrayOperators;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CustomUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Fetch the user from the database using UserRepository
        User user = userRepository.findById(username).orElse(null);

        // Throw exception if user is not found
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        // Return a Spring Security UserDetails object
        return new org.springframework.security.core.userdetails.User(
                user.getId(),            // Username (in your case, `id`)
                user.getPassword(),      // Password
                new ArrayList<>()        // Authorities (empty list for now)
        );
    }

    // we do not create the object of UserRepository
    // Spring creates it for us
    @Autowired
    private GroupService groupService;

    // USER SAVE WORKS
    public void saveUser(User user){
        userRepository.save(user);
        System.out.println("User saved");
    }
    public void saveMessageOfUser(Message message){

        User user = userRepository.findById(message.getSenderUserName()).get();
        User user2 = userRepository.findById(message.getReceiverUserName()).get();
        if(!friendsOrNot(message.getSenderUserName(), message.getReceiverUserName())){
            System.out.println("You are not friends with this user EERRRROOORRRR");
            return;
        }
        user.getMessages().add(message);
        user2.getMessages().add(message);
        userRepository.save(user2);
        userRepository.save(user);
        System.out.println("Message saved");
    }

    public boolean existByID(String username){return userRepository.existsById(username);}


    // This is an old code please do not consider this
    // Haven't fully implemented
    // To be done in phase 2
    // Must add deleting group id from user, and deleting user from group
    public void deleteUser(String username){
        User user = userRepository.findById(username).get();
        // Get the user's sent and received friend requests using the existing vectors
        Vector<String> friendRequestsSENT = user.getFriendsRequestsSended();
        Vector<String> friendRequestsRECEIVED = user.getFriendRequestsRecieved();
        Vector<String> Friends = user.getFriends();

        //Now we have to remove the user from the receiver's list that he sent a request for.
        //First we have to check if the user has any invitations sent.
        if(!friendRequestsSENT.isEmpty()){
            for(String receiverUsername : friendRequestsSENT) {
                User receiver = userRepository.findById(receiverUsername).get();
                receiver.getFriendRequestsRecieved().remove(username);
                userRepository.save(receiver);
            }
        }

        //We'll remove the user from the sender's invitation list this time.
        //Same process for sender.
        if(!friendRequestsRECEIVED.isEmpty()) {
            for(String senderUsername : friendRequestsRECEIVED) {
                User sender = userRepository.findById(senderUsername).get();
                sender.getFriendsRequestsSended().remove(username);
                userRepository.save(sender);
            }
        }

        //Finally, we have to remove the user from their friends' list(if they have any).
        if(!Friends.isEmpty()){
            for(String friendUsername: Friends){
                User friend = userRepository.findById(friendUsername).get();
                friend.getFriends().remove(username);
                userRepository.save(friend);
            }
        }

        userRepository.delete(user);
        System.out.println("User deleted");
    }


    public void saveMessageOfGroupUsers(Message message, List<String> users) {
        for (String username : users) {
            // Initialize the message list if it is null
            User user = userRepository.findById(username).get();
            if (user.getMessages() == null) {
                user.setMessages(new Vector<>());
            }

            // Add the message to the user's message list
            user.getMessages().add(message);

            // Save the user to persist the new message list
            userRepository.save(user);
        }
    }
    public boolean friendsOrNot(String sender, String receiver){
        User userreciever = userRepository.findById(receiver).get();
        if(userreciever.getFriends().contains(sender)){
            return true;
        }
        return false;
    }
    public User returningUser(String username) {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (Objects.equals(user.getId(), username)) {
                return user;
            }
        }
        return null;
    }
    public String getUser(String username){
        //User user = returningUser(username);
        User user = userRepository.findById(username).get();
        String email = user.getId();
        String name = user.getName();
        return "Here is the username (as an email): "+email +", and the name of the user is: " + name;
    }
    public User getUserAsUser(String username){
        return userRepository.findById(username).get();
    }

    public List<Message> getMessages(String username){
        User user = userRepository.findById(username).get();
        return user.getMessages();
    }


    public TreeSet<Integer> getConversationPtoP(String sender, String receiver) {
        if (existByID(sender) && existByID(receiver )&& friendsOrNot(sender, receiver)) {
            User UserSender = userRepository.findById(sender).get();
            User UserReceiver = userRepository.findById(receiver).get();

            // We need to get the message from reciever with senders name equals to sender
            // and from sender with senders name equals to reciever

            List<Message> messagesSender = UserSender.getMessages();
            List<Message> messagesReceiver = UserReceiver.getMessages();

            List<Message> conversation = new Vector<>();

            TreeSet<Integer> messageID = new TreeSet<>();
            // Since we do not have the "time" we can not sort the messages
            // Or we may take the message from the messageRepository
            for(Message message : messagesSender){
                if(message.getReceiverUserName()!= null && message.getSenderUserName().equals(receiver) && message.getReceiverUserName().equals(sender)){
                    messageID.add(message.getId());
                }
            }
            for(Message message : messagesReceiver){
                if(message.getReceiverUserName()!= null && message.getSenderUserName().equals(sender) && message.getReceiverUserName().equals(receiver)){
                    messageID.add(message.getId());
                }
            }
            return messageID;
        }
        return null;
    }
    public String  sendingFriendRequest(String Sender, String Reciever) {
        //RECIEVER
        User userReceiver = userRepository.findById(Reciever).get();
        Vector<String> pendingFriendRequests = userReceiver.getFriendRequestsRecieved();
        Vector<String> friendsAlready = userReceiver.getFriends();


        //SENDER
        User userSender = userRepository.findById(Sender).get();
        Vector<String> friendsRequestsSended = userSender.getFriendsRequestsSended();
        Vector<String> friendsRequestRecievedSender = userSender.getFriendRequestsRecieved();
        if (friendsAlready.contains(Reciever)) {
            System.out.println("You are already friends with this user: " + Reciever);
            return "You are already friends with this user: " + Reciever;
        }
        // Check if there is already a pending friend request
        if (pendingFriendRequests.contains(Sender)) {
            System.out.println("You have already sent a friend request to this user: " + Reciever);
            return "You have already sent a friend request to this user: " + Reciever;
        }
        if(friendsRequestRecievedSender.contains(Reciever)){
            System.out.println("You have already recieved a friend request from this user: " + Reciever);
            return "You have recieved a : " + Reciever;
        }
        // Otherwise, add the friend request
        else {
            pendingFriendRequests.add(Sender);
            friendsRequestsSended.add(Reciever);
            userSender.setFriendsRequestsSended(friendsRequestsSended);
            userReceiver.setFriendRequestsRecieved(pendingFriendRequests);
            userRepository.save(userReceiver);
            userRepository.save(userSender);
            System.out.println("Friend request sent to " + Reciever);
            return "Friend request sent to " + Reciever;
        }
    }

    public String acceptFriendRequest(String Receiver, String Sender){
        if (!userRepository.existsById(Receiver)) {
            return "Receiver user not found.";
        }
        if (!userRepository.existsById(Sender)) {
            return "Sender user not found.";
        }
        System.out.println("I am here: ");
        // User and sender exists after this location
        //---------------------------------------------
        //SENDER
        User userSender = userRepository.findById(Sender).get();
        //---------------------------------------------
        //---------------------------------------------
        //RECIEVER
        User userReceiver = userRepository.findById(Receiver).get();
        Vector<String> pendingFriendRequests = userReceiver.getFriendRequestsRecieved();
        //---------------------------------------------
        if(pendingFriendRequests.contains(Sender)){

            userReceiver.getFriends().add(Sender);
            userSender.getFriends().add(Receiver);
            userReceiver.getFriendRequestsRecieved().remove(Sender);
            userSender.getFriendsRequestsSended().remove(Receiver);
            //Add the receiver to sender's friends list and remove sender from the pending list.
            userRepository.save(userReceiver);
            userRepository.save(userSender);
            return "Friend request accepted by " + Receiver;
        }
        else{
            return "No pending requests from this user";
        }
    }

    // Get the friends of a user ,as a string
    // If user hasn't been found returns appropriate message
    public String getFriends(String username) {
        if(!existByID(username)){
            return "User not found";
        }
        User user = userRepository.findById(username).get();
        Vector<String> friends = user.getFriends();
        return "Friends of " + username + " are: " + friends.toString();
    }

    // Login a user
    public boolean login(String username, String password) {
        if (!userRepository.existsById(username)) {
            return false;
        }
        User user = userRepository.findById(username).get();
        if (user.getPassword().equals(password)) {
            return true;
        }
        return false;
    }



    // Helper function that adds a group id to a user
    public void addGroup(String username, Group group){
        User user1 = userRepository.findById(username).get();
        Group group1 = groupService.getGroup(group.getId());
        user1.getGroups().add(group1.getId());
        System.out.println("Group added to the user");
        userRepository.save(user1);
    }

    public List<String> getFriendsList(String username) {
        User friendTofind = userRepository.findById(username).get();
        return friendTofind.getFriends();
    }
    public List<String> getFriendRequestsList(String username) {
        User friendTofind = userRepository.findById(username).get();

        return friendTofind.getFriendRequestsRecieved();
    }

    public Vector<Integer> getGroups(String username) {
        User user = userRepository.findById(username).get();
        return user.getGroups();}
}