package edu.sabanciuniv.howudoin.controller;

import edu.sabanciuniv.howudoin.model.FriendAdd;
import edu.sabanciuniv.howudoin.model.User;
import edu.sabanciuniv.howudoin.security.CustomUserDetailsService;
import edu.sabanciuniv.howudoin.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.util.List;
import java.util.Vector;

@RestController
public class UserController {

    @Autowired
    private CustomUserDetailsService userService;
    @Autowired
    private MessageService messageService;

    // Register a new user
    @PutMapping("/register")
    public String registerUser(@RequestBody User user) {
        System.out.println("I am here");

        System.out.println(user.getId());
        if (userService.existByID(user.getId())) {
            return "User already exists";
        }
        if(user.getId() == "" || user.getPassword() == "" || user.getName() == "" || user.getLastname() == ""){
            return "Please fill all the fields";
        }
        User newUser = new User(user.getId(), user.getPassword(), user.getName(), user.getLastname(), new Vector<>(), new Vector<>(), new Vector<>(), new Vector<>(), new Vector<>());
        userService.saveUser(newUser);
        return "User registered successfully";
    }

    // Send a friend request
    @PostMapping("/friends/add")
    public ResponseEntity sendFriendRequest(@RequestBody FriendAdd friendAdd) {
        User sender = friendAdd.getUser1();
        User reciever = friendAdd.getUser2();


        if(!userService.existByID(sender.getId()) || !userService.existByID(reciever.getId())){
            ResponseEntity.ok( "User not found");
        }
        if(sender.getId().equals(reciever.getId())){
            ResponseEntity.ok( "You cannot send a friend request to yourself");
        }
        if(userService.friendsOrNot(sender.getId(), reciever.getId())){
            ResponseEntity.ok( "You are already friends");
        }
        return ResponseEntity.ok(this.userService.sendingFriendRequest(sender.getId(), reciever.getId()));
    }

    // Delete a user
    @DeleteMapping("/delete/{username}")
    public String deleteUser(@PathVariable String username) {
        //userService.deleteUser(username);
        return "User deleted successfully";
    }

    @PostMapping("/friends/accept")
    public ResponseEntity acceptFriendRequest(@RequestBody FriendAdd friendAdd) {
        User sender = friendAdd.getUser1();
        User reciever = friendAdd.getUser2();
        System.out.println(sender.getId());
        System.out.println(reciever.getId());
        if (!userService.existByID(reciever.getId())) {
            return ResponseEntity.ok("Reciever user not found.");
        }
        if (!userService.existByID(sender.getId())) {
            return ResponseEntity.ok("Sender user not found.");
        }
        return ResponseEntity.ok(this.userService.acceptFriendRequest(sender.getId(), reciever.getId()));
    }

    // ADDED AFTER PHASE1
    @GetMapping("/friends/pending/{username}")
    public ResponseEntity<List<String>> getFriendRequests(@PathVariable String username) {
        return ResponseEntity.ok(this.userService.getFriendRequestsList(username));
    }
    // Retrieve friends of a user
    @GetMapping("/friends/{username}")
    public ResponseEntity<List<String>> getFriends(@PathVariable String username) {
        return ResponseEntity.ok(this.userService.getFriendsList(username));
    }

    //Retrieve the messages sent by user.
    @GetMapping("/messages")
    public String getMessages(@PathVariable String username){
        return userService.getMessages(username).toString();
    }

    @GetMapping("/username/{username}")
    public User getUser(@PathVariable String username) {
        return userService.getUserAsUser(username);
    }

    @GetMapping("/groups/{username}")
    public ResponseEntity<Vector<Integer>> getGroupId(@PathVariable String username){
        return ResponseEntity.ok(userService.getGroups(username));
    }
}