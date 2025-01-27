
package edu.sabanciuniv.howudoin.service;

import edu.sabanciuniv.howudoin.model.Group;
import edu.sabanciuniv.howudoin.model.Message;
import edu.sabanciuniv.howudoin.model.User;
import edu.sabanciuniv.howudoin.repository.GroupRepository;
import edu.sabanciuniv.howudoin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Vector;

@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private UserRepository userRepository;

    public void createGroup(Group group){
        groupRepository.save(group);
        System.out.println("Group created");
    }

    public boolean userInGroup(int groupId, String username){
        Group group = groupRepository.findById(groupId).get();
        for (int i = 0; i < group.getGroupMembers().size(); i++){
            if (group.getGroupMembers().get(i).equals(username)){
                return true;
            }
        }
        return false;
    }
    public boolean groupExist(int groupId){
        return groupRepository.existsById(groupId);
    }

    // PRE: user is not in that group, user exists, group exists
    public void addMember(int groupId, String username) {
        Group group = groupRepository.findById(groupId).get();
        // used repostory to get the user because circle dependency error.
        group.getGroupMembers().add(username);
        groupRepository.save(group);
    }

    public Group getGroup(int groupId){
        return groupRepository.findById(groupId).get();
    }



    // PRE: group exists, and have at least one member
    public void sendMessage(Message message, int groupId){
        Group group = groupRepository.findById(groupId).get();
        group.getMessages().add(message);
        groupRepository.save(group);
        System.out.println("Message sent to the group successfully");
    }
    
    // Might add deleting the people from that group
    public void deleteGroup(int groupId){
        groupRepository.deleteById(groupId);
        System.out.println("Group deleted");
    }

    // PRE: group exists, and have at least one member
    public Vector<Message> getMessage(int groupId){
        Group group = groupRepository.findById(groupId).get();
        return group.getMessages();

    }
    // PRE: group exists, and have at least one member
    public Vector<String> getMembers(int groupId){
        Group group = groupRepository.findById(groupId).get();
        /*
        String names = "";
        for (int i = 0 ; i < group.getGroupMembers().size(); i++){
            String username = group.getGroupMembers().get(i);
            System.out.println("Username: " + username);
            names = names + username + "\n";
        }*/
        return group.getGroupMembers();
    }

    public String getGroupNames(int groupId) {
        Group group = groupRepository.findById(groupId).get();
        return group.getGroupName();
    }

    public String getCreationTime(int groupId) {
        Group group = groupRepository.findById(groupId).get();
        return group.getTime().substring(0,9)+ " " + group.getTime().substring(11,16);
    }
}

