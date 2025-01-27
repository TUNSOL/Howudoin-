package edu.sabanciuniv.howudoin.controller;

import edu.sabanciuniv.howudoin.model.Group;
import edu.sabanciuniv.howudoin.model.Message;
import edu.sabanciuniv.howudoin.model.User;
import edu.sabanciuniv.howudoin.security.CustomUserDetailsService;
import edu.sabanciuniv.howudoin.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Vector;

@RestController
public class GroupController {
    @Autowired
    private GroupService groupService;
    @Autowired
    private CustomUserDetailsService userService;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;


    // Create a new group with a given name and an initial member
    @PutMapping ("/create")
    public String createGroup(@RequestBody Group group) {

        if(groupService.groupExist(group.getId())){
            return "Group already exists";
        }
        String usernameAdmin = group.getGroupAdmin();
        Vector<String> groupMembersToBeAdded = new Vector<>();
        groupMembersToBeAdded.add(usernameAdmin);
        if(group.getGroupMembers()!=null){
            for(int i = 0; i<group.getGroupMembers().size(); i++){
                if(userService.existByID(group.getGroupMembers().get(i))){
                    // Checking if they are friends or not may not be necessary since the user won't be able to choose from
                    // non-friends
                    if(userService.friendsOrNot(usernameAdmin, group.getGroupMembers().get(i))){
                        String user1 = group.getGroupMembers().get(i);
                        groupMembersToBeAdded.add(user1);
                    }
                }
            }
        }
        Group newGroup = new Group(group.getGroupName(),usernameAdmin,groupMembersToBeAdded, new Vector<>());
        groupService.createGroup(newGroup);
        System.out.println("User admin" + usernameAdmin);
        for(int m = 0; m < newGroup.getGroupMembers().size(); m++){
            String user1 =newGroup.getGroupMembers().get(m);
            System.out.println("User added to group" + user1);
            userService.addGroup(user1, newGroup);
        }
        return "Group created successfully with name: " + group.getGroupName();
    }


    // Sends a message to all members of a specified group
    @PostMapping("/{groupId}/send")
    public String sendMessage(@PathVariable int groupId, @RequestBody Message message) {
        if (!groupService.groupExist(groupId)) {
            return "Group does not exist";
        }
        if (!groupService.userInGroup(groupId, message.getSenderUserName())) {
            return "User is not a member of this group";
        }
        Message messageToSend = new Message(message.getMessage(), message.getSenderUserName(), groupId);
        userService.saveMessageOfGroupUsers(messageToSend, groupService.getGroup(groupId).getGroupMembers());
        groupService.sendMessage(messageToSend, groupId);
        return "Message sent to the group successfully";
    }

    // Retrieves message history for a specified group
    @GetMapping("/{groupId}/messages")
    public ResponseEntity<Vector<Message>> getMessageHistory(@PathVariable int groupId) {
        if (!groupService.groupExist(groupId)) {
            return ResponseEntity.ok(null);
        }
        return ResponseEntity.ok(this.groupService.getMessage(groupId));
    }

    // Retrieves the list of members for a specified group
    @GetMapping("/{groupId}/members")
    public ResponseEntity<Vector<String>> getMembers(@PathVariable int groupId) {
        if (!groupService.groupExist(groupId)) {
            return  ResponseEntity.ok(null);
        }
        return ResponseEntity.ok(this.groupService.getMembers(groupId));
    }
    @GetMapping("/{groupId}")
    public ResponseEntity<String> getGroupNames(@PathVariable int groupId){
        return ResponseEntity.ok(groupService.getGroupNames(groupId));

    }

    @GetMapping("/group/{groupId}/time")
    public ResponseEntity<String> getGroupTime(@PathVariable int groupId){
        return ResponseEntity.ok(groupService.getCreationTime(groupId));
    }
    // Adds a member to a specified group
    @PostMapping("/{groupId}/add-member")
    public String addMember(@PathVariable int groupId, @RequestBody User user) {
        if (!groupService.groupExist(groupId)) {
            return "Group does not exist";
        }
        if (!userService.existByID(user.getId())) {
            return "User does not exist";
        }
        if (groupService.userInGroup(groupId, user.getId())) {
            return "User is already in ithis group";
        }
        if(!userService.friendsOrNot(groupService.getGroup(groupId).getGroupAdmin(), user.getId())){
            return "User is not a friend of you";
        }
        User userToAdd = userService.getUserAsUser(user.getId());
        userService.addGroup(userToAdd.getId(), groupService.getGroup(groupId));
        groupService.addMember(groupId, userToAdd.getId());
        return "Member added to the group successfully";
    }
}